/**
 * ============================================================================
 * PROCESS ANALYSIS QUEUE - ARCHETYP EDGE FUNCTION
 * ============================================================================
 * 
 * Teil des Umzugscheck.ch Flow-Analyse-Systems.
 * Verarbeitet die Flow-Analyse-Queue nach Priorität.
 * 
 * ARCHETYP-QUALITÄTSSTANDARD:
 * - Robuste Fehlerbehandlung mit detaillierten Logs
 * - Graceful Degradation bei Teilfehlern
 * - Automatische Retry-Logik
 * - Vollständige Audit-Trail
 * 
 * @version 2.0.0 - Archetyp Edition
 * @author Umzugscheck.ch Team
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================================================
// CONFIGURATION
// ============================================================================
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// ============================================================================
// TYPES
// ============================================================================
interface QueueItem {
  id: string;
  flow_id: string;
  flow_version: string;
  priority: number;
  status: string;
  queued_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  result_run_id: string | null;
  created_by: string | null;
}

interface ProcessResult {
  success: boolean;
  queueItemId: string;
  flowVersion: string;
  analysisRunId?: string;
  error?: string;
  duration?: number;
}

// ============================================================================
// LOGGING UTILITIES
// ============================================================================
const log = {
  info: (msg: string, data?: unknown) => console.log(`[Queue] ℹ️ ${msg}`, data ? JSON.stringify(data) : ''),
  success: (msg: string, data?: unknown) => console.log(`[Queue] ✅ ${msg}`, data ? JSON.stringify(data) : ''),
  warn: (msg: string, data?: unknown) => console.warn(`[Queue] ⚠️ ${msg}`, data ? JSON.stringify(data) : ''),
  error: (msg: string, data?: unknown) => console.error(`[Queue] ❌ ${msg}`, data ? JSON.stringify(data) : ''),
};

// ============================================================================
// QUEUE PROCESSOR
// ============================================================================
async function processQueueItem(
  supabase: any,
  item: QueueItem
): Promise<ProcessResult> {
  const startTime = Date.now();
  
  log.info(`Processing item: ${item.id}`, { 
    flowId: item.flow_id,
    version: item.flow_version,
    priority: item.priority 
  });

  try {
    // 1. Mark as processing
    const { error: updateError } = await supabase
      .from('flow_analysis_queue')
      .update({ 
        status: 'processing', 
        started_at: new Date().toISOString() 
      })
      .eq('id', item.id);

    if (updateError) {
      log.error('Failed to mark item as processing', updateError);
      throw new Error(`Update failed: ${updateError.message}`);
    }

    // 2. Get available variants for this flow
    const { data: variants, error: variantsError } = await supabase
      .from('flow_versions')
      .select('version_number, flow_code, version_name, is_active')
      .eq('flow_id', item.flow_id)
      .eq('is_active', true)
      .order('version_number');

    if (variantsError) {
      log.error('Failed to fetch variants', variantsError);
      throw new Error(`Variants fetch failed: ${variantsError.message}`);
    }

    const variantIds = (variants || []).map((v: any) => 
      v.flow_code?.toLowerCase() || `${item.flow_version}.${v.version_number}`
    );

    log.info(`Found ${variantIds.length} variants`, variantIds);

    if (variantIds.length === 0) {
      // No variants - mark as failed gracefully
      await supabase
        .from('flow_analysis_queue')
        .update({ 
          status: 'failed', 
          completed_at: new Date().toISOString(),
          error_message: 'Keine aktiven Varianten gefunden'
        })
        .eq('id', item.id);

      return {
        success: false,
        queueItemId: item.id,
        flowVersion: item.flow_version,
        error: 'No active variants found',
        duration: Date.now() - startTime
      };
    }

    // 3. Call deep-flow-analysis
    log.info('Invoking deep-flow-analysis...');
    
    const { data: analysisResult, error: analysisError } = await supabase.functions.invoke('deep-flow-analysis', {
      body: {
        flowIds: variantIds,
        flowId: item.flow_id,
        flowVersion: item.flow_version,
        analysisType: 'synthesis',
        includeRecommendations: true,
        background: true
      }
    });

    if (analysisError) {
      log.error('Analysis invocation failed', analysisError);
      throw new Error(`Analysis failed: ${analysisError.message}`);
    }

    log.success('Analysis invoked successfully', analysisResult);

    // 4. Get the latest run ID (may not exist yet if background)
    const { data: latestRun } = await supabase
      .from('flow_analysis_runs')
      .select('id, overall_score, status')
      .eq('flow_id', item.flow_id)
      .eq('run_type', 'deep-archetyp-analysis')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // 5. Mark queue item as completed
    await supabase
      .from('flow_analysis_queue')
      .update({ 
        status: 'completed', 
        completed_at: new Date().toISOString(),
        result_run_id: latestRun?.id || null,
        error_message: null
      })
      .eq('id', item.id);

    const duration = Date.now() - startTime;
    log.success(`Completed in ${duration}ms`, { 
      runId: latestRun?.id,
      score: latestRun?.overall_score 
    });

    return {
      success: true,
      queueItemId: item.id,
      flowVersion: item.flow_version,
      analysisRunId: latestRun?.id,
      duration
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    log.error(`Processing failed after ${duration}ms`, { error: errorMessage });

    // Mark as failed
    await supabase
      .from('flow_analysis_queue')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_message: errorMessage
      })
      .eq('id', item.id);

    return {
      success: false,
      queueItemId: item.id,
      flowVersion: item.flow_version,
      error: errorMessage,
      duration
    };
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================
serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const startTime = Date.now();

  try {
    const body = await req.json().catch(() => ({}));
    const { processAll = false, maxItems = 10 } = body;

    log.info(`Starting queue processor`, { processAll, maxItems });

    // Get the next queued item(s)
    const query = supabase
      .from('flow_analysis_queue')
      .select('*')
      .eq('status', 'queued')
      .order('priority', { ascending: false })
      .order('queued_at', { ascending: true });

    if (!processAll) {
      query.limit(1);
    } else {
      query.limit(maxItems);
    }

    const { data: queueItems, error: fetchError } = await query;

    if (fetchError) {
      log.error('Failed to fetch queue', fetchError);
      throw new Error(`Queue fetch failed: ${fetchError.message}`);
    }

    if (!queueItems || queueItems.length === 0) {
      log.info('Queue is empty');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Queue ist leer',
          processed: 0,
          duration: Date.now() - startTime
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    log.info(`Found ${queueItems.length} items to process`);

    // Process items
    const results: ProcessResult[] = [];
    
    for (const item of queueItems) {
      const result = await processQueueItem(supabase, item);
      results.push(result);
      
      // If processing all and there's more, trigger next batch
      if (processAll && results.length >= maxItems) {
        const { count } = await supabase
          .from('flow_analysis_queue')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'queued');

        if (count && count > 0) {
          log.info(`${count} more items in queue, triggering next batch...`);
          
          // Non-blocking trigger for next batch
          fetch(`${SUPABASE_URL}/functions/v1/process-analysis-queue`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({ processAll: true, maxItems })
          }).catch(err => log.warn('Next batch trigger failed', err));
        }
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    const totalDuration = Date.now() - startTime;

    log.success(`Batch complete`, { 
      total: results.length,
      success: successCount,
      failed: failCount,
      duration: totalDuration
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Verarbeitet: ${successCount}/${results.length}`,
        processed: results.length,
        successful: successCount,
        failed: failCount,
        results,
        duration: totalDuration
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log.error('Queue processor failed', { error: errorMessage });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        duration: Date.now() - startTime
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
