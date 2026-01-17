import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  analysis_id: string;
  type: 'completed' | 'pending' | 'error';
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Umzugscheck.ch <noreply@umzugscheck.ch>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return res.json();
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analysis_id, type }: NotificationRequest = await req.json();

    if (!analysis_id) {
      throw new Error("analysis_id is required");
    }

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch analysis data
    const { data: analysis, error: fetchError } = await supabase
      .from("video_analyses")
      .select("*")
      .eq("id", analysis_id)
      .single();

    if (fetchError || !analysis) {
      throw new Error(`Analysis not found: ${fetchError?.message}`);
    }

    const resultUrl = `https://umzugscheck.ch/video-analyse/${analysis_id}`;

    let subject = "";
    let htmlContent = "";

    if (type === "completed") {
      subject = "Ihre Video-Analyse ist fertig! 🎉";
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0050A8, #00A86B); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
            .price-box { background: white; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; border: 2px solid #0050A8; }
            .price { font-size: 32px; font-weight: bold; color: #0050A8; }
            .cta-button { display: inline-block; background: #00A86B; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 Ihre Video-Analyse ist fertig!</h1>
            </div>
            <div class="content">
              <p>Guten Tag${analysis.user_name ? ` ${analysis.user_name}` : ''},</p>
              
              <p>Grossartige Neuigkeiten! Unsere KI hat Ihr Umzugsvideo analysiert und eine detaillierte Kostenschätzung erstellt.</p>
              
              <div class="price-box">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Geschätzte Umzugskosten</p>
                <div class="price">CHF ${analysis.price_min || '-'} – ${analysis.price_max || '-'}</div>
              </div>
              
              <table style="width: 100%; margin: 20px 0;">
                <tr>
                  <td style="text-align: center; padding: 10px; background: #f1f5f9; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold;">${analysis.total_volume_m3?.toFixed(1) || '-'}</div>
                    <div style="font-size: 12px; color: #666;">m³ Volumen</div>
                  </td>
                  <td style="width: 10px;"></td>
                  <td style="text-align: center; padding: 10px; background: #f1f5f9; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold;">${analysis.total_weight_kg?.toFixed(0) || '-'}</div>
                    <div style="font-size: 12px; color: #666;">kg Gewicht</div>
                  </td>
                  <td style="width: 10px;"></td>
                  <td style="text-align: center; padding: 10px; background: #f1f5f9; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold;">${analysis.estimated_hours || '-'}</div>
                    <div style="font-size: 12px; color: #666;">Stunden</div>
                  </td>
                </tr>
              </table>
              
              ${analysis.from_city && analysis.to_city ? `
              <p><strong>Route:</strong> ${analysis.from_city} → ${analysis.to_city}</p>
              ` : ''}
              
              <div style="text-align: center;">
                <a href="${resultUrl}" class="cta-button">Vollständige Analyse ansehen →</a>
              </div>
              
              <p style="margin-top: 30px;">
                <strong>Nächster Schritt:</strong> Erhalten Sie jetzt kostenlose Offerten von geprüften Umzugsfirmen basierend auf Ihrer Video-Analyse!
              </p>
              
              <p>Freundliche Grüsse,<br><strong>Ihr Umzugscheck.ch Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Umzugscheck.ch – Die Nr. 1 Umzugsplattform der Schweiz</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === "pending") {
      subject = "Ihr Video wurde empfangen – Analyse startet 📹";
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0050A8, #0070C0); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
            .cta-button { display: inline-block; background: #0050A8; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📹 Video erfolgreich hochgeladen!</h1>
            </div>
            <div class="content">
              <p>Guten Tag${analysis.user_name ? ` ${analysis.user_name}` : ''},</p>
              
              <p>Vielen Dank für das Hochladen Ihres Umzugsvideos! Wir haben Ihre Anfrage erhalten und beginnen mit der Analyse.</p>
              
              <p><strong>Was passiert jetzt?</strong></p>
              <ul>
                <li>Unsere KI analysiert Ihr Video automatisch</li>
                <li>Ein Experte prüft die Ergebnisse</li>
                <li>Sie erhalten eine detaillierte Kostenschätzung</li>
              </ul>
              
              <p>Voraussichtliche Bearbeitungszeit: <strong>24-48 Stunden</strong></p>
              
              <div style="text-align: center;">
                <a href="${resultUrl}" class="cta-button">Status prüfen →</a>
              </div>
              
              <p>Wir benachrichtigen Sie per E-Mail, sobald Ihre Analyse fertig ist.</p>
              
              <p>Freundliche Grüsse,<br><strong>Ihr Umzugscheck.ch Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Umzugscheck.ch – Die Nr. 1 Umzugsplattform der Schweiz</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      subject = "Problem bei der Video-Analyse ⚠️";
      htmlContent = `
        <p>Es gab ein Problem bei der Analyse Ihres Videos. Bitte kontaktieren Sie uns.</p>
      `;
    }

    const emailResponse = await sendEmail(analysis.user_email, subject, htmlContent);
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-analysis-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
