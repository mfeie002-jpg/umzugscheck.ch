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

interface DigestData {
  providerId: string;
  email: string;
  companyName: string;
  frequency: 'daily' | 'weekly';
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

    const { frequency = 'daily' } = await req.json();

    // Get providers who want email digests
    const { data: providers, error: providersError } = await supabase
      .from("service_providers")
      .select("id, email, company_name")
      .eq("account_status", "active");

    if (providersError) {
      throw providersError;
    }

    const dateRange = frequency === 'daily' 
      ? new Date(Date.now() - 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    let emailsSent = 0;

    for (const provider of providers || []) {
      // Get leads for this provider
      const { data: leads } = await supabase
        .from("lead_transactions")
        .select(`
          *,
          leads (name, email, from_city, to_city, move_date, calculator_type)
        `)
        .eq("provider_id", provider.id)
        .gte("created_at", dateRange.toISOString());

      // Get reviews for this provider
      const { data: reviews } = await supabase
        .from("review_requests")
        .select(`
          *,
          reviews (rating, title, comment)
        `)
        .eq("provider_id", provider.id)
        .eq("review_submitted", true)
        .gte("updated_at", dateRange.toISOString());

      // Get performance metrics
      const { data: metrics } = await supabase
        .from("provider_performance_metrics")
        .select("*")
        .eq("provider_id", provider.id)
        .order("metric_date", { ascending: false })
        .limit(1);

      const newLeadsCount = leads?.length || 0;
      const newReviewsCount = reviews?.length || 0;
      const avgRating = reviews?.length 
        ? reviews.reduce((sum, r) => sum + (r.reviews?.rating || 0), 0) / reviews.length 
        : null;

      // Skip if no activity
      if (newLeadsCount === 0 && newReviewsCount === 0) {
        continue;
      }

      const periodText = frequency === 'daily' ? 'heute' : 'diese Woche';
      const conversionRate = metrics?.[0]?.conversion_rate || 0;

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0050A8 0%, #003D82 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; }
            .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
            .stat-value { font-size: 32px; font-weight: bold; color: #0050A8; }
            .stat-label { color: #666; font-size: 14px; }
            .lead-item { padding: 15px; border-bottom: 1px solid #e5e5e5; }
            .lead-item:last-child { border-bottom: none; }
            .review-item { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .stars { color: #fbbf24; }
            .cta-button { display: inline-block; background: #E32026; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Ihr ${frequency === 'daily' ? 'Täglicher' : 'Wöchentlicher'} Report</h1>
              <p>${provider.company_name}</p>
            </div>
            
            <div class="content">
              <h2>Zusammenfassung ${periodText}</h2>
              
              <div class="stat-grid">
                <div class="stat-card">
                  <div class="stat-value">${newLeadsCount}</div>
                  <div class="stat-label">Neue Leads</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${newReviewsCount}</div>
                  <div class="stat-label">Neue Bewertungen</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${conversionRate.toFixed(1)}%</div>
                  <div class="stat-label">Konversionsrate</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${avgRating ? avgRating.toFixed(1) : '-'}</div>
                  <div class="stat-label">Ø Bewertung</div>
                </div>
              </div>

              ${newLeadsCount > 0 ? `
                <h3>🎯 Neue Leads</h3>
                ${leads?.slice(0, 5).map(lead => `
                  <div class="lead-item">
                    <strong>${lead.leads?.name || 'Unbekannt'}</strong><br>
                    <small>${lead.leads?.from_city || ''} → ${lead.leads?.to_city || ''}</small><br>
                    <small>Typ: ${lead.leads?.calculator_type || 'Umzug'}</small>
                  </div>
                `).join('')}
                ${leads && leads.length > 5 ? `<p>...und ${leads.length - 5} weitere</p>` : ''}
              ` : ''}

              ${newReviewsCount > 0 ? `
                <h3>⭐ Neue Bewertungen</h3>
                ${reviews?.slice(0, 3).map(review => `
                  <div class="review-item">
                    <div class="stars">${'★'.repeat(review.reviews?.rating || 5)}${'☆'.repeat(5 - (review.reviews?.rating || 5))}</div>
                    <strong>${review.reviews?.title || ''}</strong>
                    <p>${review.reviews?.comment?.substring(0, 100) || ''}${(review.reviews?.comment?.length || 0) > 100 ? '...' : ''}</p>
                  </div>
                `).join('')}
              ` : ''}

              <div style="text-align: center;">
                <a href="https://umzugscheck.ch/partner/dashboard" class="cta-button">
                  Zum Dashboard →
                </a>
              </div>

              <h3>💡 Tipps zur Optimierung</h3>
              <ul>
                ${conversionRate < 30 ? '<li>Ihre Konversionsrate ist unter dem Durchschnitt. Versuchen Sie, schneller auf Leads zu antworten.</li>' : ''}
                ${newLeadsCount > 0 && leads?.some(l => l.conversion_status === 'pending') ? '<li>Sie haben unbearbeitete Leads. Kontaktieren Sie diese zeitnah!</li>' : ''}
                ${avgRating && avgRating < 4.5 ? '<li>Bitten Sie zufriedene Kunden um eine Bewertung, um Ihre Durchschnittsbewertung zu verbessern.</li>' : ''}
                <li>Aktualisieren Sie Ihre Verfügbarkeit regelmässig für bessere Lead-Qualität.</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Sie erhalten diese E-Mail, weil Sie bei umzugscheck.ch als Partner registriert sind.</p>
              <p><a href="https://umzugscheck.ch/partner/settings">E-Mail-Einstellungen ändern</a></p>
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        await resend.emails.send({
          from: "Umzugscheck.ch <noreply@umzugscheck.ch>",
          to: [provider.email],
          subject: `📊 Ihr ${frequency === 'daily' ? 'täglicher' : 'wöchentlicher'} Report - ${newLeadsCount} neue Leads`,
          html: emailHtml,
        });

        emailsSent++;
        console.log(`Digest sent to ${provider.email}`);
      } catch (emailError) {
        console.error(`Failed to send digest to ${provider.email}:`, emailError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailsSent,
        frequency 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-email-digest:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
