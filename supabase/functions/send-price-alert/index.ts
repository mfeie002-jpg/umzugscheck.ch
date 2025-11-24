import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get all active price alerts
    const { data: alerts, error: alertsError } = await supabase
      .from("price_alerts")
      .select("*")
      .eq("is_active", true);

    if (alertsError) throw alertsError;

    // Get current pricing for each canton
    const { data: pricing, error: pricingError } = await supabase
      .from("historical_pricing")
      .select("canton_code, avg_price")
      .order("created_at", { ascending: false });

    if (pricingError) throw pricingError;

    // Group pricing by canton (get latest)
    const currentPricing: Record<string, number> = {};
    pricing?.forEach((p) => {
      if (!currentPricing[p.canton_code]) {
        currentPricing[p.canton_code] = p.avg_price;
      }
    });

    // Check each alert
    const emailsToSend = [];
    for (const alert of alerts || []) {
      const currentPrice = currentPricing[alert.canton_code];
      if (currentPrice && currentPrice <= alert.max_price) {
        emailsToSend.push({
          to: alert.user_email,
          subject: `Preisalarm: Günstige Umzugspreise in ${alert.canton_code}`,
          html: `
            <h2>Ihr Preisalarm wurde ausgelöst!</h2>
            <p>Der durchschnittliche Umzugspreis in <strong>${alert.canton_code}</strong> ist auf <strong>CHF ${currentPrice}</strong> gefallen.</p>
            <p>Ihr gewünschter Maximalpreis: CHF ${alert.max_price}</p>
            <p><a href="https://umzugscheck.ch/regionen">Jetzt Angebote vergleichen</a></p>
            <hr>
            <p><small>Diese E-Mail wurde automatisch von Umzugscheck.ch gesendet.</small></p>
          `,
        });

        // Update last_triggered_at
        await supabase
          .from("price_alerts")
          .update({ last_triggered_at: new Date().toISOString() })
          .eq("id", alert.id);
      }
    }

    console.log(`Sending ${emailsToSend.length} price alert emails`);

    // In production, integrate with email service (SendGrid, Resend, etc.)
    // For now, just log
    emailsToSend.forEach((email) => {
      console.log(`Email to ${email.to}: ${email.subject}`);
    });

    return new Response(
      JSON.stringify({ success: true, emailsSent: emailsToSend.length }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Price alert error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
