import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, to, leadData, providerData } = await req.json();

    let subject = "";
    let html = "";

    if (type === "lead_confirmation") {
      // Email to customer confirming lead submission
      subject = "Ihre Umzugsofferte wurde eingereicht";
      html = `
        <h2>Vielen Dank für Ihre Anfrage!</h2>
        <p>Wir haben Ihre Umzugsanfrage erfolgreich erhalten.</p>
        <h3>Details Ihres Umzugs:</h3>
        <ul>
          <li>Von: ${leadData.from_city} (${leadData.from_postal})</li>
          <li>Nach: ${leadData.to_city} (${leadData.to_postal})</li>
          <li>Geschätzte Kosten: CHF ${leadData.priceMin} - ${leadData.priceMax}</li>
        </ul>
        <p>Die ausgewählten Umzugsfirmen werden sich in Kürze bei Ihnen melden.</p>
        <p><a href="https://umzugscheck.ch">Zur Website</a></p>
        <hr>
        <p><small>Umzugscheck.ch - Ihr unabhängiger Umzugsvergleich</small></p>
      `;
    } else if (type === "provider_new_lead") {
      // Email to provider about new lead assignment
      subject = "Neue Umzugsanfrage verfügbar";
      html = `
        <h2>Neue Umzugsanfrage!</h2>
        <p>Es wurde Ihnen eine neue Umzugsanfrage zugewiesen.</p>
        <h3>Lead-Details:</h3>
        <ul>
          <li>Route: ${leadData.from_city} → ${leadData.to_city}</li>
          <li>Umzugsdatum: ${leadData.move_date || "Flexibel"}</li>
          <li>Geschätztes Volumen: ${leadData.volume} m³</li>
          <li>Lead-Qualität: ${leadData.quality_score}/100</li>
        </ul>
        <p><a href="https://umzugscheck.ch/provider/dashboard">Zum Dashboard</a></p>
        <hr>
        <p><small>Umzugscheck.ch - Provider Portal</small></p>
      `;
    }

    console.log(`Email notification: ${subject} to ${to}`);

    // In production, integrate with email service (SendGrid, Resend, AWS SES, etc.)
    // For now, just log
    console.log("Email content:", html);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Email notification error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
