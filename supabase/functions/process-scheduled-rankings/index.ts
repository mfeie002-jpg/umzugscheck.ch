import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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

    // Get all pending scheduled rankings that should be executed now
    const { data: scheduledRankings, error: fetchError } = await supabase
      .from('scheduled_rankings')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_date', new Date().toISOString());

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${scheduledRankings?.length || 0} scheduled rankings to process`);

    if (!scheduledRankings || scheduledRankings.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No scheduled rankings to process' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process each scheduled ranking
    for (const ranking of scheduledRankings) {
      console.log(`Processing scheduled ranking: ${ranking.id}`);

      const config = ranking.configuration;

      // Update featured companies
      if (config.featured && Array.isArray(config.featured)) {
        for (const item of config.featured) {
          await supabase
            .from('service_providers')
            .update({
              featured_position: item.position,
              is_featured: true,
            })
            .eq('id', item.id);
        }
      }

      // Update organic companies
      if (config.organic && Array.isArray(config.organic)) {
        for (const item of config.organic) {
          await supabase
            .from('service_providers')
            .update({
              ranking_position: item.position,
            })
            .eq('id', item.id);
        }
      }

      // Mark as executed
      await supabase
        .from('scheduled_rankings')
        .update({
          status: 'executed',
          executed_at: new Date().toISOString(),
        })
        .eq('id', ranking.id);

      console.log(`Successfully processed scheduled ranking: ${ranking.id}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: scheduledRankings.length,
        message: `Processed ${scheduledRankings.length} scheduled ranking(s)`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing scheduled rankings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
