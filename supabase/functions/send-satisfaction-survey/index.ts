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

interface SurveyRequest {
  leadId: string;
  providerId: string;
  customerEmail: string;
  customerName: string;
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
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    const { leadId, providerId, customerEmail, customerName }: SurveyRequest = await req.json();

    // Get provider details
    const { data: provider, error: providerError } = await supabase
      .from("service_providers")
      .select("company_name")
      .eq("id", providerId)
      .single();

    if (providerError) {
      throw providerError;
    }

    const surveyLink = `https://umzugscheck.ch/bewertung?lead=${leadId}&provider=${providerId}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 12px; }
          .question { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
          .stars { font-size: 32px; }
          .star { color: #e5e5e5; cursor: pointer; text-decoration: none; }
          .cta-button { display: inline-block; background: #0050A8; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Wie war Ihr Umzug?</h1>
          </div>
          
          <div class="content">
            <p>Liebe/r ${customerName},</p>
            
            <p>wir hoffen, Ihr Umzug mit <strong>${provider.company_name}</strong> ist gut verlaufen!</p>
            
            <p>Ihre Meinung hilft anderen bei der Entscheidung und dem Unternehmen, noch besser zu werden.</p>

            <div class="question">
              <p><strong>Wie zufrieden waren Sie insgesamt?</strong></p>
              <div class="stars">
                <a href="${surveyLink}&rating=1" class="star">⭐</a>
                <a href="${surveyLink}&rating=2" class="star">⭐</a>
                <a href="${surveyLink}&rating=3" class="star">⭐</a>
                <a href="${surveyLink}&rating=4" class="star">⭐</a>
                <a href="${surveyLink}&rating=5" class="star">⭐</a>
              </div>
              <p style="font-size: 12px; color: #666;">Klicken Sie auf die Sterne für eine schnelle Bewertung</p>
            </div>

            <div style="text-align: center;">
              <a href="${surveyLink}" class="cta-button">
                Vollständige Bewertung abgeben →
              </a>
            </div>

            <p style="font-size: 14px; color: #666;">
              Die Umfrage dauert nur 2 Minuten und hilft anderen Umziehenden bei ihrer Entscheidung.
            </p>
          </div>
          
          <div class="footer">
            <p>Diese E-Mail wurde von umzugscheck.ch im Auftrag von ${provider.company_name} gesendet.</p>
            <p>Sie erhalten diese E-Mail, weil Sie kürzlich einen Umzugsservice genutzt haben.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { error: emailError } = await resend.emails.send({
      from: "Umzugscheck.ch <feedback@umzugscheck.ch>",
      to: [customerEmail],
      subject: `Wie war Ihr Umzug mit ${provider.company_name}? ⭐`,
      html: emailHtml,
    });

    if (emailError) {
      throw emailError;
    }

    console.log(`Satisfaction survey sent to ${customerEmail} for lead ${leadId}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-satisfaction-survey:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
