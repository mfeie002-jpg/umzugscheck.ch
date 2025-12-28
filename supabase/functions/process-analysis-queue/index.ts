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

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await req.json().catch(() => ({}));
    const { processAll = false } = body;

    console.log(`[Queue Processor] Starting - processAll: ${processAll}`);

    // Get the next queued item (highest priority, oldest first)
    const { data: queueItem, error: fetchError } = await supabase
      .from('flow_analysis_queue')
      .select('*')
      .eq('status', 'queued')
      .order('priority', { ascending: false })
      .order('queued_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('[Queue Processor] Error fetching queue:', fetchError);
      throw fetchError;
    }

    if (!queueItem) {
      console.log('[Queue Processor] No items in queue');
      return new Response(
        JSON.stringify({ success: true, message: 'Queue is empty', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Queue Processor] Processing item: ${queueItem.id} - ${queueItem.flow_version}`);

    // Mark as processing
    await supabase
      .from('flow_analysis_queue')
      .update({ status: 'processing', started_at: new Date().toISOString() })
      .eq('id', queueItem.id);

    // Get available variants for this flow
    const { data: variants, error: variantsError } = await supabase
      .from('flow_versions')
      .select('version_number, flow_code')
      .eq('flow_id', queueItem.flow_id)
      .eq('is_active', true)
      .order('version_number');

    if (variantsError) {
      console.error('[Queue Processor] Error fetching variants:', variantsError);
      throw variantsError;
    }

    const variantIds = (variants || []).map(v => 
      v.flow_code?.toLowerCase() || `${queueItem.flow_version}.${v.version_number}`
    );

    console.log(`[Queue Processor] Found ${variantIds.length} variants: ${variantIds.join(', ')}`);

    if (variantIds.length === 0) {
      await supabase
        .from('flow_analysis_queue')
        .update({ 
          status: 'failed', 
          completed_at: new Date().toISOString(),
          error_message: 'No active variants found'
        })
        .eq('id', queueItem.id);

      return new Response(
        JSON.stringify({ success: false, message: 'No variants found for flow' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call the deep-flow-analysis function
    const { data: analysisResult, error: analysisError } = await supabase.functions.invoke('deep-flow-analysis', {
      body: {
        flowIds: variantIds,
        flowId: queueItem.flow_id,
        flowVersion: queueItem.flow_version,
        analysisType: 'synthesis',
        includeRecommendations: true,
        background: false // Process synchronously within this function
      }
    });

    if (analysisError) {
      console.error('[Queue Processor] Analysis error:', analysisError);
      await supabase
        .from('flow_analysis_queue')
        .update({ 
          status: 'failed', 
          completed_at: new Date().toISOString(),
          error_message: analysisError.message || 'Analysis failed'
        })
        .eq('id', queueItem.id);

      throw analysisError;
    }

    // Get the run ID from the latest analysis
    const { data: latestRun } = await supabase
      .from('flow_analysis_runs')
      .select('id')
      .eq('flow_id', queueItem.flow_id)
      .eq('run_type', 'deep-archetyp-analysis')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Mark as completed
    await supabase
      .from('flow_analysis_queue')
      .update({ 
        status: 'completed', 
        completed_at: new Date().toISOString(),
        result_run_id: latestRun?.id || null
      })
      .eq('id', queueItem.id);

    console.log(`[Queue Processor] Completed item: ${queueItem.id}`);

    // If processAll is true, check for more items and process them
    if (processAll) {
      const { count } = await supabase
        .from('flow_analysis_queue')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'queued');

      if (count && count > 0) {
        console.log(`[Queue Processor] ${count} more items in queue, triggering next...`);
        
        // Trigger next item processing asynchronously
        fetch(`${supabaseUrl}/functions/v1/process-analysis-queue`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({ processAll: true })
        }).catch(err => console.error('[Queue Processor] Error triggering next:', err));
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Item processed',
        queueItemId: queueItem.id,
        flowVersion: queueItem.flow_version,
        analysisResult: analysisResult?.synthesis?.winner?.flowId || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Queue Processor] Error:', error);
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
