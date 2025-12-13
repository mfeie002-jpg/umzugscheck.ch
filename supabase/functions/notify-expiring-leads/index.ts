import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

// Validate webhook secret for internal calls
function validateWebhookSecret(req: Request): boolean {
  const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.warn("WEBHOOK_SECRET not configured - allowing request for backward compatibility");
    return true;
  }
  const providedSecret = req.headers.get("x-webhook-secret") || req.headers.get("X-Webhook-Secret");
  return providedSecret === webhookSecret;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate webhook secret
  if (!validateWebhookSecret(req)) {
    console.error("Invalid or missing webhook secret");
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting expiring leads notification check...");

    // Get leads that are 23-24 hours old (approaching first discount)
    const twentyThreeHoursAgo = new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Get leads approaching 24h discount
    const { data: approachingFirst, error: error1 } = await supabase
      .from("leads")
      .select("*, assigned_provider_ids")
      .gte("created_at", twentyFourHoursAgo)
      .lte("created_at", twentyThreeHoursAgo)
      .eq("status", "new");

    if (error1) throw error1;

    // Get leads that are 47-48 hours old (approaching second discount)
    const fortySevenHoursAgo = new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString();
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const { data: approachingSecond, error: error2 } = await supabase
      .from("leads")
      .select("*, assigned_provider_ids")
      .gte("created_at", fortyEightHoursAgo)
      .lte("created_at", fortySevenHoursAgo)
      .eq("status", "new");

    if (error2) throw error2;

    const notifications = {
      approaching24h: approachingFirst?.length || 0,
      approaching48h: approachingSecond?.length || 0
    };

    console.log("Expiring leads found:", notifications);

    // TODO: Send email notifications to assigned providers
    // For each lead, notify providers about upcoming discount
    // This would integrate with an email service (SendGrid, etc.)

    // For now, just log the notifications
    if (approachingFirst && approachingFirst.length > 0) {
      console.log(`${approachingFirst.length} leads approaching 15% discount (24h)`);
    }

    if (approachingSecond && approachingSecond.length > 0) {
      console.log(`${approachingSecond.length} leads approaching 30% discount (48h)`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        notifications,
        message: "Expiring leads check completed"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-expiring-leads:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
