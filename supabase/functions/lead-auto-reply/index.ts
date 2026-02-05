/**
 * Lead Auto-Reply Edge Function
 * 
 * Speed-to-lead automation: Sends immediate confirmation to customer
 * and internal alert to the team.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

interface AutoReplyRequest {
  leadId: string;
  customerEmail: string;
  customerName: string;
  fromCity: string;
  toCity: string;
  moveDate?: string;
  selectedProviderCount: number;
  estimatedResponse?: string; // e.g., "2-4 Stunden"
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendApiKey);
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: AutoReplyRequest = await req.json();

    // Validate required fields
    if (!payload.leadId || !payload.customerEmail || !payload.customerName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const estimatedResponse = payload.estimatedResponse || '2-4 Stunden';
    const formattedMoveDate = payload.moveDate 
      ? new Date(payload.moveDate).toLocaleDateString('de-CH', { day: '2-digit', month: 'long', year: 'numeric' })
      : 'Noch nicht festgelegt';

    // 1. Send confirmation email to customer
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0 0 10px; font-size: 28px; }
          .header p { margin: 0; opacity: 0.9; font-size: 16px; }
          .content { padding: 30px; background: #ffffff; }
          .success-box { background: #dcfce7; border: 1px solid #16a34a; border-radius: 12px; padding: 20px; margin-bottom: 25px; text-align: center; }
          .success-box .icon { font-size: 48px; margin-bottom: 10px; }
          .success-box h2 { color: #166534; margin: 0 0 5px; font-size: 20px; }
          .success-box p { color: #166534; margin: 0; }
          .details-box { background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 25px; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
          .detail-row:last-child { border-bottom: none; }
          .label { color: #64748b; font-size: 14px; }
          .value { font-weight: 600; color: #1e293b; }
          .timeline { background: #eff6ff; border-radius: 12px; padding: 20px; margin-bottom: 25px; }
          .timeline h3 { color: #1e40af; margin: 0 0 15px; font-size: 16px; }
          .timeline-step { display: flex; align-items: center; margin-bottom: 12px; }
          .timeline-step:last-child { margin-bottom: 0; }
          .step-icon { width: 24px; height: 24px; background: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 12px; }
          .step-text { color: #1e3a8a; font-size: 14px; }
          .step-text.completed { text-decoration: line-through; opacity: 0.6; }
          .footer { background: #f1f5f9; padding: 20px 30px; text-align: center; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Anfrage erfolgreich!</h1>
            <p>Ihre Umzugsofferten sind unterwegs</p>
          </div>
          <div class="content">
            <div class="success-box">
              <div class="icon">🚚</div>
              <h2>${payload.selectedProviderCount} Umzugsfirmen kontaktiert</h2>
              <p>Erwartete Antwort: ${estimatedResponse}</p>
            </div>

            <div class="details-box">
              <div class="detail-row">
                <span class="label">Umzugsroute</span>
                <span class="value">${payload.fromCity} → ${payload.toCity}</span>
              </div>
              <div class="detail-row">
                <span class="label">Umzugsdatum</span>
                <span class="value">${formattedMoveDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">Angefragte Firmen</span>
                <span class="value">${payload.selectedProviderCount} Anbieter</span>
              </div>
            </div>

            <div class="timeline">
              <h3>📋 Nächste Schritte</h3>
              <div class="timeline-step">
                <div class="step-icon">✓</div>
                <span class="step-text completed">Anfrage gesendet</span>
              </div>
              <div class="timeline-step">
                <div class="step-icon">2</div>
                <span class="step-text">Firmen erstellen Ihre Offerte</span>
              </div>
              <div class="timeline-step">
                <div class="step-icon">3</div>
                <span class="step-text">Sie erhalten Offerten per E-Mail</span>
              </div>
              <div class="timeline-step">
                <div class="step-icon">4</div>
                <span class="step-text">Vergleichen & beste Firma wählen</span>
              </div>
            </div>

            <p style="color: #64748b; font-size: 14px; text-align: center;">
              💡 <strong>Tipp:</strong> Prüfen Sie auch Ihren Spam-Ordner für Antworten der Umzugsfirmen.
            </p>
          </div>
          <div class="footer">
            <p>Diese E-Mail wurde automatisch versendet von umzugscheck.ch</p>
            <p>Bei Fragen: <a href="mailto:support@umzugscheck.ch">support@umzugscheck.ch</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send customer confirmation
    const customerResult = await resend.emails.send({
      from: 'Umzugscheck.ch <noreply@umzugscheck.ch>',
      to: [payload.customerEmail],
      subject: `✅ Ihre Umzugsanfrage: ${payload.fromCity} → ${payload.toCity}`,
      html: customerEmailHtml,
    });

    const emailId = (customerResult as { id?: string })?.id;
    console.log('Customer auto-reply sent:', emailId);

    // 2. Log the auto-reply in the database
    await supabase
      .from('leads')
      .update({ 
        auto_reply_sent_at: new Date().toISOString(),
        status: 'contacted'
      })
      .eq('id', payload.leadId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        customer_email_sent: true,
        customer_email_id: emailId
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in lead-auto-reply:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
