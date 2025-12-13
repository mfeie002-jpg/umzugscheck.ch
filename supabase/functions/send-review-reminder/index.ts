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

interface ReviewReminderRequest {
  leadId?: string;
  daysAfterMove?: number;
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
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resend = new Resend(resendApiKey);
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: ReviewReminderRequest = await req.json().catch(() => ({}));
    const daysAfterMove = body.daysAfterMove || 7;

    console.log(`Processing review reminders for moves ${daysAfterMove} days ago`);

    // Find leads where move_date was X days ago and no review request has been sent
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysAfterMove);
    const targetDateStr = targetDate.toISOString().split('T')[0];

    // If specific leadId provided, process that one
    if (body.leadId) {
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', body.leadId)
        .single();

      if (leadError || !lead) {
        console.error('Lead not found:', leadError);
        return new Response(
          JSON.stringify({ error: "Lead not found" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Send reminder for this specific lead
      const result = await sendReminderEmail(resend, supabase, lead);
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Process all leads that need reminders
    const { data: eligibleLeads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .eq('move_date', targetDateStr)
      .eq('status', 'completed');

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      throw leadsError;
    }

    console.log(`Found ${eligibleLeads?.length || 0} eligible leads for review reminders`);

    const results = [];
    for (const lead of eligibleLeads || []) {
      // Check if review request already exists
      const { data: existingRequest } = await supabase
        .from('review_requests')
        .select('id')
        .eq('lead_id', lead.id)
        .single();

      if (existingRequest) {
        console.log(`Review request already exists for lead ${lead.id}`);
        continue;
      }

      const result = await sendReminderEmail(resend, supabase, lead);
      results.push(result);
    }

    console.log(`Sent ${results.length} review reminder emails`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: results.length,
        results 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-review-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

async function sendReminderEmail(resend: any, supabase: any, lead: any) {
  try {
    // Get assigned provider info
    const providerIds = lead.assigned_provider_ids || lead.selected_company_ids || [];
    
    if (providerIds.length === 0) {
      console.log(`No providers assigned to lead ${lead.id}`);
      return { leadId: lead.id, status: 'skipped', reason: 'no_providers' };
    }

    // Get provider details
    const { data: providers } = await supabase
      .from('service_providers')
      .select('id, company_name')
      .in('id', providerIds);

    const providerNames = providers?.map((p: any) => p.company_name).join(', ') || 'Ihrer Umzugsfirma';
    const reviewUrl = `https://umzugscheck.ch/bewertung?lead=${lead.id}`;

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Umzugscheck.ch <noreply@umzugscheck.ch>",
      to: [lead.email],
      subject: `Wie war Ihr Umzug? Teilen Sie Ihre Erfahrung!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #0050A8; }
            .logo span { color: #E32026; }
            .content { background: #f9fafb; border-radius: 12px; padding: 30px; margin-bottom: 30px; }
            .stars { font-size: 32px; text-align: center; margin: 20px 0; }
            .btn { display: inline-block; background: #E32026; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; }
            .btn:hover { background: #c41d22; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Umzugs<span>check.ch</span></div>
            </div>
            
            <div class="content">
              <h1 style="text-align: center; margin-bottom: 20px;">Wie war Ihr Umzug?</h1>
              
              <p>Hallo ${lead.name},</p>
              
              <p>Wir hoffen, Ihr Umzug von <strong>${lead.from_city}</strong> nach <strong>${lead.to_city}</strong> ist gut verlaufen!</p>
              
              <p>Ihre Erfahrung mit <strong>${providerNames}</strong> ist wertvoll für andere Kunden. Würden Sie sich einen Moment Zeit nehmen, um eine Bewertung zu schreiben?</p>
              
              <div class="stars">⭐⭐⭐⭐⭐</div>
              
              <p style="text-align: center;">
                <a href="${reviewUrl}" class="btn">Jetzt bewerten</a>
              </p>
              
              <p style="font-size: 14px; color: #666; margin-top: 20px;">
                Ihre Bewertung hilft anderen bei der Wahl der richtigen Umzugsfirma und gibt den Anbietern wertvolles Feedback.
              </p>
            </div>
            
            <div class="footer">
              <p>Diese E-Mail wurde von Umzugscheck.ch gesendet.</p>
              <p>Falls Sie keine weiteren E-Mails erhalten möchten, können Sie sich <a href="https://umzugscheck.ch/abmelden">hier abmelden</a>.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`Review reminder email sent to ${lead.email}:`, emailResponse);

    // Create review request record
    for (const provider of providers || []) {
      await supabase.from('review_requests').insert({
        lead_id: lead.id,
        provider_id: provider.id,
        customer_email: lead.email,
        customer_name: lead.name,
        request_sent_at: new Date().toISOString()
      });
    }

    return { 
      leadId: lead.id, 
      status: 'sent', 
      email: lead.email,
      providers: providerIds.length 
    };

  } catch (error: any) {
    console.error(`Error sending reminder for lead ${lead.id}:`, error);
    return { leadId: lead.id, status: 'error', error: error.message };
  }
}

serve(handler);
