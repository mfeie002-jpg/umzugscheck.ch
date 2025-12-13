import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

interface AvailabilityNotificationRequest {
  email: string;
  companyName: string;
  preferredDate: string;
  canton: string;
  notificationType: "subscribe" | "notify";
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
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
    const { email, companyName, preferredDate, canton, notificationType }: AvailabilityNotificationRequest = await req.json();

    console.log(`Processing ${notificationType} request for ${email}`);

    if (notificationType === "subscribe") {
      // Send confirmation email for subscription
      const emailResponse = await resend.emails.send({
        from: "Umzugscheck.ch <notifications@resend.dev>",
        to: [email],
        subject: `Verfügbarkeitsbenachrichtigung aktiviert für ${companyName || canton}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0050A8 0%, #003366 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
              .highlight { background: #e8f4ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0050A8; margin: 20px 0; }
              .button { display: inline-block; background: #E32026; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🔔 Benachrichtigung aktiviert!</h1>
              </div>
              <div class="content">
                <p>Hallo,</p>
                <p>Sie haben sich erfolgreich für Verfügbarkeitsbenachrichtigungen angemeldet.</p>
                
                <div class="highlight">
                  <strong>Ihre Einstellungen:</strong><br>
                  ${companyName ? `<strong>Firma:</strong> ${companyName}<br>` : ''}
                  ${canton ? `<strong>Kanton:</strong> ${canton}<br>` : ''}
                  ${preferredDate ? `<strong>Wunschdatum:</strong> ${preferredDate}<br>` : ''}
                </div>
                
                <p>Wir werden Sie benachrichtigen, sobald passende Umzugsfirmen in Ihrer Region verfügbar sind.</p>
                
                <a href="https://umzugscheck.ch/firmen" class="button">Firmen ansehen</a>
                
                <div class="footer">
                  <p>Diese E-Mail wurde von Umzugscheck.ch gesendet.<br>
                  Die Schweizer Plattform für Umzugsvergleiche.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log("Subscription confirmation sent:", emailResponse);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Subscription confirmation sent",
          data: emailResponse 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else if (notificationType === "notify") {
      // Send availability notification
      const emailResponse = await resend.emails.send({
        from: "Umzugscheck.ch <notifications@resend.dev>",
        to: [email],
        subject: `🎉 ${companyName} ist jetzt verfügbar!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
              .company-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 20px 0; }
              .button { display: inline-block; background: #E32026; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
              .urgent { background: #fef3c7; border: 1px solid #f59e0b; padding: 12px; border-radius: 8px; margin: 15px 0; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Gute Neuigkeiten!</h1>
                <p style="margin: 10px 0 0;">Ihre gewünschte Firma ist verfügbar</p>
              </div>
              <div class="content">
                <p>Hallo,</p>
                <p>Die von Ihnen beobachtete Umzugsfirma hat jetzt freie Termine!</p>
                
                <div class="company-card">
                  <h2 style="margin: 0 0 10px;">${companyName}</h2>
                  <p style="margin: 0; color: #22c55e; font-weight: bold;">✓ Verfügbar für ${preferredDate || 'Ihren Wunschtermin'}</p>
                </div>
                
                <div class="urgent">
                  ⚡ <strong>Tipp:</strong> Beliebte Termine sind schnell ausgebucht. Handeln Sie jetzt!
                </div>
                
                <a href="https://umzugscheck.ch/firmen" class="button">Jetzt Offerte anfragen</a>
                
                <div class="footer">
                  <p>Diese E-Mail wurde von Umzugscheck.ch gesendet.<br>
                  Die Schweizer Plattform für Umzugsvergleiche.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log("Availability notification sent:", emailResponse);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Availability notification sent",
          data: emailResponse 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid notification type" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in availability-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
