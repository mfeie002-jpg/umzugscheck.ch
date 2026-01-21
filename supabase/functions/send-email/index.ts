import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  template?: string;
  type?: string;
  data: Record<string, any>;
}

const templates: Record<string, (data: any) => string> = {
  lead_notification: (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">🚚 Neuer Lead verfügbar!</h1>
      </div>
      <div style="padding: 30px; background: #f8fafc;">
        <h2 style="color: #1e293b;">Umzug: ${data.from_city} → ${data.to_city}</h2>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p><strong>📅 Umzugsdatum:</strong> ${data.move_date}</p>
          <p><strong>📦 Volumen:</strong> ${data.volume || 'Nicht angegeben'}</p>
          <p><strong>💰 Geschätzter Wert:</strong> CHF ${data.estimated_value || 'N/A'}</p>
          ${data.bidding_enabled ? `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 15px;">
              <strong>⚡ Bidding aktiv!</strong><br>
              Startgebot: CHF ${data.starting_bid}<br>
              Endet: ${data.bidding_closes_at}
            </div>
          ` : ''}
        </div>
        <a href="https://umzugscheckv2.lovable.app/anbieter/dashboard" 
           style="display: inline-block; background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Lead ansehen →
        </a>
      </div>
      <div style="padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
        © Umzugscheck.ch - Die beste Umzugsplattform der Schweiz
      </div>
    </div>
  `,
  
  bid_update: (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">🔔 Bid-Update</h1>
      </div>
      <div style="padding: 30px; background: #f8fafc;">
        <h2 style="color: #1e293b;">${data.message}</h2>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p><strong>Lead:</strong> ${data.from_city} → ${data.to_city}</p>
          <p><strong>Ihr Gebot:</strong> CHF ${data.your_bid}</p>
          <p><strong>Höchstgebot:</strong> CHF ${data.highest_bid}</p>
          <p><strong>Verbleibende Zeit:</strong> ${data.time_remaining}</p>
        </div>
        <a href="https://umzugscheckv2.lovable.app/anbieter/marktplatz" 
           style="display: inline-block; background: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Gebot erhöhen →
        </a>
      </div>
    </div>
  `,
  
  welcome_provider: (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">🎉 Willkommen bei Umzugscheck!</h1>
      </div>
      <div style="padding: 30px; background: #f8fafc;">
        <h2 style="color: #1e293b;">Hallo ${data.company_name}!</h2>
        <p>Ihr Konto wurde erfolgreich erstellt. Sie sind jetzt Teil der führenden Umzugsplattform der Schweiz.</p>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3>Nächste Schritte:</h3>
          <ul style="padding-left: 20px;">
            <li>✅ Profil vervollständigen</li>
            <li>📸 Firmenlogo hochladen</li>
            <li>🎯 Service-Gebiete definieren</li>
            <li>💳 Zahlungsmethode hinterlegen</li>
          </ul>
        </div>
        <a href="https://umzugscheckv2.lovable.app/anbieter/dashboard" 
           style="display: inline-block; background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Zum Dashboard →
        </a>
      </div>
    </div>
  `,
  
  lead_won: (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #eab308 0%, #facc15 100%); padding: 30px; text-align: center;">
        <h1 style="color: #1e293b; margin: 0;">🏆 Glückwunsch! Bid gewonnen!</h1>
      </div>
      <div style="padding: 30px; background: #f8fafc;">
        <h2 style="color: #1e293b;">Sie haben den Lead gewonnen!</h2>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p><strong>Lead:</strong> ${data.from_city} → ${data.to_city}</p>
          <p><strong>Gewinngebot:</strong> CHF ${data.winning_bid}</p>
          <p><strong>Kontakt:</strong> ${data.customer_name}</p>
          <p><strong>Telefon:</strong> ${data.customer_phone}</p>
          <p><strong>Email:</strong> ${data.customer_email}</p>
        </div>
        <p style="color: #64748b;">Kontaktieren Sie den Kunden innerhalb von 24h für die beste Conversion-Rate!</p>
        <a href="https://umzugscheckv2.lovable.app/anbieter/dashboard" 
           style="display: inline-block; background: #eab308; color: #1e293b; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Kunde kontaktieren →
        </a>
      </div>
    </div>
  `,
  
  payment_confirmation: (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">✅ Zahlung bestätigt</h1>
      </div>
      <div style="padding: 30px; background: #f8fafc;">
        <h2 style="color: #1e293b;">Vielen Dank für Ihre Zahlung!</h2>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <p><strong>Betrag:</strong> CHF ${data.amount}</p>
          <p><strong>Beschreibung:</strong> ${data.description}</p>
          <p><strong>Transaktions-ID:</strong> ${data.transaction_id}</p>
          <p><strong>Datum:</strong> ${data.date}</p>
        </div>
        <p style="color: #64748b;">Eine Kopie dieser Rechnung wurde an Ihre E-Mail-Adresse gesendet.</p>
      </div>
    </div>
  `,

  // Legacy templates for backward compatibility
  lead_confirmation: (data) => `
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
    </div>
  `,

  provider_new_lead: (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Neue Umzugsanfrage!</h2>
      <p>Es wurde Ihnen eine neue Umzugsanfrage zugewiesen.</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Lead-Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Route:</strong> ${data.from_city} → ${data.to_city}</li>
          <li><strong>Umzugsdatum:</strong> ${data.move_date || "Flexibel"}</li>
          <li><strong>Volumen:</strong> ${data.volume} m³</li>
        </ul>
      </div>
    </div>
  `,

  price_alert: (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Ihr Preisalarm wurde ausgelöst!</h2>
      <p>Der durchschnittliche Umzugspreis in <strong>${data.canton}</strong> ist auf <strong>CHF ${data.currentPrice}</strong> gefallen.</p>
    </div>
  `,

  provider_welcome: (data) => templates.welcome_provider(data)
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: EmailRequest = await req.json();
    const { to, subject, template, type, data } = body;

    // Support both 'template' and legacy 'type' field
    const templateKey = template || type;
    
    if (!to || !templateKey) {
      throw new Error("Missing required fields: to, template/type");
    }

    const templateFn = templates[templateKey];
    if (!templateFn) {
      throw new Error(`Unknown template: ${templateKey}`);
    }

    const html = templateFn(data);
    const emailSubject = subject || getDefaultSubject(templateKey, data);

    // If RESEND_API_KEY is configured, send real emails
    if (RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Umzugscheck.ch <noreply@umzugscheck.ch>",
          to: [to],
          subject: emailSubject,
          html,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Resend API error: ${error}`);
      }

      const result = await res.json();
      return new Response(JSON.stringify({ success: true, id: result.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: log only
    console.log(`Email notification [${templateKey}] would be sent to:`, to);
    console.log("Subject:", emailSubject);

    return new Response(
      JSON.stringify({ success: true, message: "Email logged (RESEND not configured)" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Email error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function getDefaultSubject(template: string, data: any): string {
  switch (template) {
    case "lead_notification":
    case "provider_new_lead":
      return `🚚 Neuer Lead: ${data.from_city} → ${data.to_city}`;
    case "bid_update":
      return `🔔 Bid-Update: ${data.from_city} → ${data.to_city}`;
    case "welcome_provider":
    case "provider_welcome":
      return `🎉 Willkommen bei Umzugscheck.ch!`;
    case "lead_won":
      return `🏆 Lead gewonnen: ${data.from_city} → ${data.to_city}`;
    case "payment_confirmation":
      return `✅ Zahlung bestätigt - CHF ${data.amount}`;
    case "lead_confirmation":
      return "Ihre Umzugsofferte wurde eingereicht";
    case "price_alert":
      return `Preisalarm: Günstige Umzugspreise in ${data.canton}`;
    default:
      return "Umzugscheck.ch Benachrichtigung";
  }
}