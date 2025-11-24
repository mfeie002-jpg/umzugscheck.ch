import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active providers
    const { data: providers } = await supabase
      .from('service_providers')
      .select('*')
      .eq('account_status', 'active')
      .eq('verification_status', 'approved');

    if (!providers || providers.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let sent = 0;

    for (const provider of providers) {
      // Get provider's performance metrics for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: metrics } = await supabase
        .from('provider_performance_metrics')
        .select('*')
        .eq('provider_id', provider.id)
        .gte('metric_date', sevenDaysAgo.toISOString())
        .order('metric_date', { ascending: false });

      if (!metrics || metrics.length === 0) continue;

      // Calculate aggregated stats
      const totalLeads = metrics.reduce((sum, m) => sum + (m.leads_received || 0), 0);
      const totalConverted = metrics.reduce((sum, m) => sum + (m.leads_converted || 0), 0);
      const avgResponseTime = metrics.reduce((sum, m) => sum + (m.response_time_avg_hours || 0), 0) / metrics.length;
      const conversionRate = totalLeads > 0 ? (totalConverted / totalLeads) * 100 : 0;

      // Send performance digest email
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'performance_digest',
          to: provider.email,
          data: {
            companyName: provider.company_name,
            period: '7 Tage',
            totalLeads,
            totalConverted,
            conversionRate: conversionRate.toFixed(1),
            avgResponseTime: avgResponseTime.toFixed(1)
          }
        }
      });

      sent++;
    }

    console.log(`Sent ${sent} performance digests`);

    return new Response(
      JSON.stringify({ success: true, sent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-performance-digest:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
