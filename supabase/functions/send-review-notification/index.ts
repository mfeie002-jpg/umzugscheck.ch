import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

interface ReviewNotificationRequest {
  companyId: string;
  companyName: string;
  reviewerName?: string;
  rating: number;
  title: string;
  comment: string;
}

const handler = async (req: Request): Promise<Response> => {
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
    const { companyId, companyName, reviewerName, rating, title, comment }: ReviewNotificationRequest = await req.json();

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: true, message: "Email notifications not configured" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get company email from service_providers table
    const { data: provider } = await supabase
      .from('service_providers')
      .select('email, company_name, contact_person_name')
      .eq('id', companyId)
      .maybeSingle();

    // Also check companies table
    const { data: company } = await supabase
      .from('companies')
      .select('email, name')
      .eq('id', companyId)
      .maybeSingle();

    const recipientEmail = provider?.email || company?.email;
    const recipientName = provider?.contact_person_name || company?.name || companyName;

    if (!recipientEmail) {
      console.log("No email found for company:", companyId);
      return new Response(
        JSON.stringify({ success: true, message: "No email configured for company" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

    // Send email via Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Umzugscheck.ch <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: `Neue Bewertung erhalten: ${rating} Sterne`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
              .rating { font-size: 24px; color: #f59e0b; letter-spacing: 2px; }
              .review-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1e3a5f; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🎉 Neue Bewertung erhalten!</h1>
                <p style="margin: 10px 0 0;">Ein Kunde hat Ihre Firma bewertet</p>
              </div>
              <div class="content">
                <p>Hallo ${recipientName},</p>
                <p>Sie haben eine neue Kundenbewertung auf Umzugscheck.ch erhalten:</p>
                
                <div class="review-box">
                  <div class="rating">${stars}</div>
                  <h3 style="margin: 10px 0 5px;">${title}</h3>
                  <p style="margin: 0; color: #666;">${comment}</p>
                  ${reviewerName ? `<p style="margin: 10px 0 0; font-size: 14px; color: #888;">— ${reviewerName}</p>` : ''}
                </div>
                
                <p><strong>Tipp:</strong> Reagieren Sie auf Bewertungen, um Ihre Kundenbindung zu stärken.</p>
                
                <div class="footer">
                  <p>Diese E-Mail wurde automatisch von Umzugscheck.ch generiert.</p>
                  <p>© ${new Date().getFullYear()} Umzugscheck.ch - Die Schweizer Umzugsplattform</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const result = await emailResponse.json();
    console.log("Review notification sent:", result);

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending review notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
