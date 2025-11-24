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

    // Find converted leads from 7 days ago without review requests
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: transactions } = await supabase
      .from('lead_transactions')
      .select(`
        *,
        leads(*)
      `)
      .eq('conversion_status', 'converted')
      .gte('conversion_date', sevenDaysAgo.toISOString())
      .is('review_requests.id', null);

    if (!transactions || transactions.length === 0) {
      console.log('No leads eligible for review requests');
      return new Response(
        JSON.stringify({ processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let processed = 0;

    for (const transaction of transactions) {
      const lead = transaction.leads;
      
      // Check if review request already exists
      const { data: existing } = await supabase
        .from('review_requests')
        .select('id')
        .eq('lead_id', lead.id)
        .eq('provider_id', transaction.provider_id)
        .maybeSingle();

      if (existing) continue;

      // Create review request
      await supabase.functions.invoke('send-review-request', {
        body: {
          leadId: lead.id,
          providerId: transaction.provider_id
        }
      });

      processed++;
    }

    console.log(`Processed ${processed} review requests`);

    return new Response(
      JSON.stringify({ success: true, processed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in schedule-review-requests:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
