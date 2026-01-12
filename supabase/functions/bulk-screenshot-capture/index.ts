import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FlowConfig {
  flowId: string;
  flowName: string;
  stepCount: number;
  flowPath: string;
}

interface BulkCaptureCursor {
  flowIndex: number;
  step: number;
  dimIndex: number;
  completedCaptures: number;
  totalCaptures: number;
  successCount: number;
  errorCount: number;
}

interface BulkCaptureRequest {
  jobId: string;
  flows: FlowConfig[];
  baseUrl: string;
  captureDesktop: boolean;
  captureMobile: boolean;
  cursor?: BulkCaptureCursor;
}

interface ScreenshotError {
  type: 'quota_exceeded' | 'api_error' | 'network_error';
  message: string;
}

const MAX_CAPTURES_PER_INVOCATION = 4; // keeps runtime well below platform timeouts

async function captureViaBackend(
  supabase: any,
  url: string,
  dimension: string,
  maxRetries = 2
): Promise<{ data: string | null; error: ScreenshotError | null }> {
  let lastError: ScreenshotError | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt} for ${dimension}`);
        await new Promise((resolve) => setTimeout(resolve, 3000 * attempt));
      }
      
      const { data, error } = await supabase.functions.invoke('capture-screenshot', {
        body: {
          url,
          dimension,
          format: 'png',
          delay: 10000,
          fullPage: false,
          scroll: false,
          noCache: true,
          waitForReadySentinel: true,
        },
      });

      if (error) {
        const msg = error.message || 'Unknown error';
        if (
          msg.includes('Relay Error') ||
          msg.includes('connection closed') ||
          msg.includes('FunctionsFetchError')
        ) {
          lastError = { type: 'network_error', message: msg };
          console.warn(`Transient error on attempt ${attempt}: ${msg}`);
          continue;
        }
        return { data: null, error: { type: 'api_error', message: msg } };
      }

      if (!data || (data as any)?.error) {
        const msg = (data as any)?.error || 'Unbekannter Screenshot-Fehler';
        const lower = String(msg).toLowerCase();
        
        if (lower.includes('quota') || lower.includes('credit') || lower.includes('limit') || lower.includes('402')) {
          return { data: null, error: { type: 'quota_exceeded', message: String(msg) } };
        }
        
        lastError = { type: 'api_error', message: String(msg) };
        continue;
      }

      return { data: (data as any).image ?? null, error: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Netzwerkfehler';
      console.warn(`Exception on attempt ${attempt}: ${msg}`);
      lastError = { type: 'network_error', message: msg };
    }
  }
  
  console.error(`All ${maxRetries + 1} attempts failed for ${dimension}`);
  return { data: null, error: lastError };
}

async function updateJobProgress(
  supabase: any,
  jobId: string,
  progress: number,
  message: string,
  status: string = 'processing'
) {
  await supabase
    .from('export_jobs')
    .update({ 
      status,
      progress,
      progress_message: message,
    })
    .eq('id', jobId);
}

async function saveScreenshotToDb(
  supabase: any,
  flowId: string,
  step: number,
  type: 'desktop' | 'mobile',
  imageBase64: string
) {
  try {
    const runId = crypto.randomUUID();
    const fileName = `${flowId}/${runId}/step-${step}-${type}.png`;
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const { error: uploadError } = await supabase.storage.from('flow-screenshots').upload(fileName, bytes, {
      contentType: 'image/png',
      upsert: true,
    });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage.from('flow-screenshots').getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    const updateColumn = type === 'desktop' ? 'desktop_screenshot_url' : 'mobile_screenshot_url';
    
    const { data: existing } = await supabase
      .from('flow_step_metrics')
      .select('id')
      .eq('flow_id', flowId)
      .eq('step_number', step)
      .maybeSingle();

    if (existing) {
      await supabase.from('flow_step_metrics').update({ [updateColumn]: publicUrl }).eq('id', existing.id);
    } else {
      await supabase.from('flow_step_metrics').insert({
        flow_id: flowId,
        step_number: step,
        [updateColumn]: publicUrl,
      });
    }
    
    console.log(`Saved ${type} screenshot for ${flowId} step ${step}`);
    return publicUrl;
  } catch (err) {
    console.error('Failed to save screenshot to DB:', err);
    return null;
  }
}

function buildDimensions(captureDesktop: boolean, captureMobile: boolean): ('desktop' | 'mobile')[] {
  const dimensions: ('desktop' | 'mobile')[] = [];
  if (captureDesktop) dimensions.push('desktop');
  if (captureMobile) dimensions.push('mobile');
  return dimensions;
}

function computeTotalCaptures(flows: FlowConfig[], dimensions: ('desktop' | 'mobile')[]) {
  return flows.reduce((acc, f) => acc + f.stepCount * dimensions.length, 0);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      jobId,
      flows,
      baseUrl,
      captureDesktop = true,
      captureMobile = true,
      cursor,
    }: BulkCaptureRequest = await req.json();

    const dimensions = buildDimensions(captureDesktop, captureMobile);
    const totalCaptures = cursor?.totalCaptures ?? computeTotalCaptures(flows, dimensions);

    // First invocation: mark job as started
    if (!cursor) {
      console.log(`[BulkCapture] Starting job ${jobId} with ${flows.length} flows`);
      await supabase
        .from('export_jobs')
        .update({
          status: 'processing',
          started_at: new Date().toISOString(),
          progress: 0,
          progress_message: 'Bulk Screenshot-Erfassung gestartet...',
        })
        .eq('id', jobId);
    }

    // Initialize cursor
    let state: BulkCaptureCursor = cursor ?? {
      flowIndex: 0,
      step: 1,
      dimIndex: 0,
      completedCaptures: 0,
      totalCaptures,
      successCount: 0,
      errorCount: 0,
    };

    let capturesThisRun = 0;
    let quotaExceeded = false;

    while (
      capturesThisRun < MAX_CAPTURES_PER_INVOCATION &&
      state.flowIndex < flows.length &&
      !quotaExceeded
    ) {
      const flow = flows[state.flowIndex];

      if (state.step > flow.stepCount) {
        state.flowIndex += 1;
        state.step = 1;
        state.dimIndex = 0;
        continue;
      }

      const dim = dimensions[state.dimIndex] ?? dimensions[0];

      const progressPercent = Math.round((state.completedCaptures / state.totalCaptures) * 100);
      await updateJobProgress(
        supabase,
        jobId,
        progressPercent,
        `${flow.flowName} Step ${state.step} (${dim}) - ${state.completedCaptures + 1}/${state.totalCaptures}`
      );

      const urlObj = new URL(flow.flowPath, baseUrl);
      urlObj.searchParams.set('uc_capture', '1');
      urlObj.searchParams.set('uc_step', String(state.step));
      urlObj.searchParams.set('uc_render', '1');
      urlObj.searchParams.set('uc_cb', String(Date.now()));
      const captureUrl = urlObj.toString();

      const dimension = dim === 'desktop' ? '1920x1080' : '390x844';

      const result = await captureViaBackend(supabase, captureUrl, dimension);

      if (result.error) {
        console.error(`[BulkCapture] Error for ${flow.flowId} step ${state.step} ${dim}:`, result.error.message);
        
        if (result.error.type === 'quota_exceeded') {
          quotaExceeded = true;
          await supabase
            .from('export_jobs')
            .update({
              status: 'failed',
              error_message: `Quota überschritten nach ${state.successCount} Screenshots: ${result.error.message}`,
              completed_at: new Date().toISOString(),
              progress: progressPercent,
              progress_message: `Gestoppt bei ${flow.flowName} Step ${state.step} - Quota erreicht`,
            })
            .eq('id', jobId);
          break;
        }
        
        state.errorCount += 1;
      } else if (result.data) {
        await saveScreenshotToDb(supabase, flow.flowId, state.step, dim, result.data);
        state.successCount += 1;
      }

      state.completedCaptures += 1;
      capturesThisRun += 1;

      // Advance cursor
      state.dimIndex += 1;
      if (state.dimIndex >= dimensions.length) {
        state.dimIndex = 0;
        state.step += 1;
      }

      // Small delay between captures (keep it short; overall flow is chunked)
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Completed all work
    if (!quotaExceeded && state.completedCaptures >= state.totalCaptures) {
      await supabase
        .from('export_jobs')
        .update({
          status: 'completed',
          progress: 100,
          progress_message: `Fertig! ${state.successCount} erfolgreich, ${state.errorCount} Fehler`,
          completed_at: new Date().toISOString(),
        })
        .eq('id', jobId);

      console.log(`[BulkCapture] Job ${jobId} finished: ${state.successCount} success, ${state.errorCount} errors`);

      return new Response(
        JSON.stringify({
          started: true,
          completed: true,
          successCount: state.successCount,
          errorCount: state.errorCount,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Schedule next chunk (avoids edge function timeouts)
    if (!quotaExceeded) {
      const nextProgress = Math.round((state.completedCaptures / state.totalCaptures) * 100);
      await updateJobProgress(
        supabase,
        jobId,
        nextProgress,
        `Weiter... ${state.completedCaptures}/${state.totalCaptures}`
      );

      const scheduleNext = async () => {
        const { error } = await supabase.functions.invoke('bulk-screenshot-capture', {
          body: {
            jobId,
            flows,
            baseUrl,
            captureDesktop,
            captureMobile,
            cursor: state,
          },
        });

        if (error) {
          console.error('[BulkCapture] Failed to schedule next batch:', error);
          await supabase
            .from('export_jobs')
            .update({
              status: 'failed',
              error_message: `Fehler beim Fortsetzen: ${error.message || 'Unknown error'}`,
              completed_at: new Date().toISOString(),
              progress: nextProgress,
              progress_message: 'Job gestoppt (Scheduling-Fehler)',
            })
            .eq('id', jobId);
        }
      };

      // Run scheduling in background to return quickly
      // @ts-ignore
      const waitUntil = (globalThis as any).EdgeRuntime?.waitUntil;
      if (typeof waitUntil === 'function') {
        waitUntil(scheduleNext());
      } else {
        scheduleNext();
      }
    }

    return new Response(
      JSON.stringify({
        started: true,
        completed: false,
        progress: Math.round((state.completedCaptures / state.totalCaptures) * 100),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[BulkCapture] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
