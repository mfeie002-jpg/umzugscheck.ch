import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

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

interface LeadNotificationRequest {
  leadId: string;
  providerIds?: string[];
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
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resend = new Resend(resendApiKey);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { leadId, providerIds }: LeadNotificationRequest = await req.json();

    console.log("Processing new lead notification for lead:", leadId);

    // Fetch lead details
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      throw new Error(`Lead not found: ${leadError?.message}`);
    }

    // Get providers to notify (either specified or assigned)
    const targetProviderIds = providerIds || lead.assigned_provider_ids || [];

    if (targetProviderIds.length === 0) {
      console.log("No providers to notify");
      return new Response(
        JSON.stringify({ success: true, notified: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch provider details
    const { data: providers, error: providersError } = await supabase
      .from("service_providers")
      .select("id, company_name, email, contact_person_name")
      .in("id", targetProviderIds)
      .eq("account_status", "active");

    if (providersError) {
      throw new Error(`Failed to fetch providers: ${providersError.message}`);
    }

    console.log(`Found ${providers?.length || 0} providers to notify`);

    // Extract price from calculator output
    let priceRange = "Nicht angegeben";
    try {
      const calcOutput = lead.calculator_output as any;
      if (calcOutput?.priceMin && calcOutput?.priceMax) {
        priceRange = `CHF ${calcOutput.priceMin} - ${calcOutput.priceMax}`;
      }
    } catch (e) {
      console.error("Error parsing calculator output:", e);
    }

    // Send emails to each provider
    const emailPromises = (providers || []).map(async (provider) => {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
            .lead-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
            .detail-row:last-child { border-bottom: none; }
            .label { color: #64748b; font-size: 14px; }
            .value { font-weight: 600; color: #1e293b; }
            .cta-button { display: inline-block; background: #dc2626; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
            .badge { display: inline-block; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">🎉 Neue Anfrage erhalten!</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">Ein neuer Kunde sucht eine Umzugsfirma in Ihrer Region</p>
            </div>
            <div class="content">
              <p>Hallo ${provider.contact_person_name || provider.company_name},</p>
              <p>Sie haben eine neue Umzugsanfrage erhalten! Hier sind die Details:</p>
              
              <div class="lead-details">
                <div class="detail-row">
                  <span class="label">Kundenname</span>
                  <span class="value">${lead.name}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Von</span>
                  <span class="value">${lead.from_postal} ${lead.from_city}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Nach</span>
                  <span class="value">${lead.to_postal} ${lead.to_city}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Umzugsdatum</span>
                  <span class="value">${lead.move_date ? new Date(lead.move_date).toLocaleDateString("de-CH") : "Flexibel"}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Geschätzter Preis</span>
                  <span class="value">${priceRange}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Anfrageart</span>
                  <span class="badge">${lead.calculator_type}</span>
                </div>
              </div>

              ${lead.comments ? `<p><strong>Nachricht des Kunden:</strong><br>${lead.comments}</p>` : ""}

              <p style="color: #64748b; font-size: 14px;">
                <strong>Tipp:</strong> Reagieren Sie schnell auf Anfragen - Kunden wählen oft den Anbieter, der als erstes antwortet!
              </p>

              <a href="https://umzugscheck.ch/provider-dashboard" class="cta-button">
                Lead im Dashboard ansehen →
              </a>

              <p style="margin-top: 30px; color: #64748b; font-size: 12px;">
                Sie erhalten diese E-Mail, weil Sie als Partner bei umzugscheck.ch registriert sind.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        const result = await resend.emails.send({
          from: "Umzugscheck.ch <noreply@umzugscheck.ch>",
          to: [provider.email],
          subject: `🚚 Neue Umzugsanfrage: ${lead.from_city} → ${lead.to_city}`,
          html: emailHtml,
        });
        console.log(`Email sent to ${provider.email}:`, result);
        return { providerId: provider.id, success: true };
      } catch (emailError) {
        console.error(`Failed to send email to ${provider.email}:`, emailError);
        return { providerId: provider.id, success: false, error: emailError };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter((r) => r.success).length;

    console.log(`Successfully notified ${successCount}/${results.length} providers`);

    return new Response(
      JSON.stringify({
        success: true,
        notified: successCount,
        total: results.length,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-new-lead-notification:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
