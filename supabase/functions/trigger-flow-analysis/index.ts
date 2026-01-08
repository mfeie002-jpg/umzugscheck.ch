import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Trigger Flow Analysis
 * =====================
 * Called automatically when a flow_versions row is inserted/updated.
 * Starts the auto-analyze-flow function for the affected flow.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Debounce: Don't analyze the same flow more than once per 5 minutes
const DEBOUNCE_MINUTES = 5;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const payload = await req.json();
    console.log('Trigger payload:', JSON.stringify(payload, null, 2));

    // Extract flow_id from the webhook payload
    // Supabase webhooks send: { type: 'INSERT'|'UPDATE', table: 'flow_versions', record: {...}, old_record: {...} }
    const record = payload.record || payload;
    const flowId = record.flow_id;

    if (!flowId) {
      console.log('No flow_id in payload, skipping');
      return new Response(
        JSON.stringify({ skipped: true, reason: 'No flow_id in payload' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Checking debounce for flow: ${flowId}`);

    // Check if we recently analyzed this flow (debounce)
    const { data: recentRuns } = await supabase
      .from('flow_analysis_runs')
      .select('id, created_at')
      .eq('flow_id', flowId)
      .gte('created_at', new Date(Date.now() - DEBOUNCE_MINUTES * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (recentRuns && recentRuns.length > 0) {
      console.log(`Flow ${flowId} was analyzed recently, skipping (debounce)`);
      return new Response(
        JSON.stringify({ 
          skipped: true, 
          reason: 'Recently analyzed',
          lastRunAt: recentRuns[0].created_at 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Triggering analysis for flow: ${flowId}`);

    // Call the auto-analyze-flow function
    const analyzeResponse = await fetch(`${SUPABASE_URL}/functions/v1/auto-analyze-flow`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flowId,
        runType: 'triggered',
        baseUrl: 'https://preview--umzugscheckv2.lovable.app'
      }),
    });

    if (!analyzeResponse.ok) {
      const errorText = await analyzeResponse.text();
      console.error('Analysis trigger failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'Analysis trigger failed', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await analyzeResponse.json();
    console.log(`Analysis triggered successfully for ${flowId}:`, result);

    return new Response(
      JSON.stringify({ 
        success: true, 
        flowId,
        runId: result.runId,
        message: `Analysis triggered for ${flowId}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Trigger error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
