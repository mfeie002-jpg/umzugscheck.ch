import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resend = new Resend(resendApiKey);
    const { type, to, data } = await req.json();

    let emailContent = { subject: "", html: "" };

    switch (type) {
      case "lead_confirmation":
        emailContent = {
          subject: "Ihre Umzugsofferte wurde eingereicht",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3b82f6;">Vielen Dank für Ihre Anfrage!</h2>
              <p>Wir haben Ihre Umzugsanfrage erfolgreich erhalten.</p>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Details Ihres Umzugs:</h3>
                <ul style="list-style: none; padding: 0;">
                  <li><strong>Von:</strong> ${data.from_city} (${data.from_postal})</li>
                  <li><strong>Nach:</strong> ${data.to_city} (${data.to_postal})</li>
                  <li><strong>Volumen:</strong> ${data.volume} m³</li>
                  <li><strong>Geschätzte Kosten:</strong> CHF ${data.priceMin} - ${data.priceMax}</li>
                </ul>
              </div>
              <p>Die ausgewählten Umzugsfirmen werden sich in Kürze bei Ihnen melden.</p>
              <p style="margin-top: 30px;">
                <a href="https://umzugscheck.ch" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Zur Website</a>
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px;">Umzugscheck.ch - Ihr unabhängiger Umzugsvergleich</p>
            </div>
          `,
        };
        break;

      case "provider_new_lead":
        emailContent = {
          subject: "Neue Umzugsanfrage verfügbar",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3b82f6;">Neue Umzugsanfrage!</h2>
              <p>Es wurde Ihnen eine neue Umzugsanfrage zugewiesen.</p>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Lead-Details:</h3>
                <ul style="list-style: none; padding: 0;">
                  <li><strong>Route:</strong> ${data.from_city} → ${data.to_city}</li>
                  <li><strong>Umzugsdatum:</strong> ${data.move_date || "Flexibel"}</li>
                  <li><strong>Volumen:</strong> ${data.volume} m³</li>
                  <li><strong>Lead-Qualität:</strong> ${data.quality_score}/100</li>
                  ${data.match_score ? `<li><strong>Match-Score:</strong> ${data.match_score}%</li>` : ""}
                </ul>
              </div>
              <p style="margin-top: 30px;">
                <a href="https://umzugscheck.ch/anbieter/dashboard" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Zum Dashboard</a>
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px;">Umzugscheck.ch - Provider Portal</p>
            </div>
          `,
        };
        break;

      case "price_alert":
        emailContent = {
          subject: `Preisalarm: Günstige Umzugspreise in ${data.canton}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10b981;">Ihr Preisalarm wurde ausgelöst!</h2>
              <p>Der durchschnittliche Umzugspreis in <strong>${data.canton}</strong> ist auf <strong>CHF ${data.currentPrice}</strong> gefallen.</p>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Ihr gewünschter Maximalpreis:</strong> CHF ${data.maxPrice}</p>
                <p style="margin: 10px 0 0 0; color: #10b981;"><strong>Ersparnis:</strong> CHF ${data.maxPrice - data.currentPrice}</p>
              </div>
              <p style="margin-top: 30px;">
                <a href="https://umzugscheck.ch/regionen" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Jetzt Angebote vergleichen</a>
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px;">Diese E-Mail wurde automatisch von Umzugscheck.ch gesendet.</p>
            </div>
          `,
        };
        break;

      case "provider_welcome":
        emailContent = {
          subject: "Willkommen bei Umzugscheck.ch!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3b82f6;">Willkommen bei Umzugscheck.ch!</h2>
              <p>Vielen Dank für Ihre Registrierung als Umzugspartner.</p>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Nächste Schritte:</h3>
                <ol style="padding-left: 20px;">
                  <li>Vervollständigen Sie Ihr Firmenprofil</li>
                  <li>Warten Sie auf die Verifizierung (1-2 Werktage)</li>
                  <li>Beginnen Sie, qualifizierte Leads zu erhalten</li>
                </ol>
              </div>
              <p style="margin-top: 30px;">
                <a href="https://umzugscheck.ch/anbieter/profil" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Profil vervollständigen</a>
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px;">Umzugscheck.ch - Provider Portal</p>
            </div>
          `,
        };
        break;

      default:
        throw new Error("Invalid email type");
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "Umzugscheck.ch <onboarding@resend.dev>",
      to: [to],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (error) {
      throw error;
    }

    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ success: true, data: emailData }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Email error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
