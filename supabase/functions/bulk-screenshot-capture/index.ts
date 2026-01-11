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

interface BulkCaptureRequest {
  jobId: string;
  flows: FlowConfig[];
  baseUrl: string;
  captureDesktop: boolean;
  captureMobile: boolean;
}

interface ScreenshotError {
  type: 'quota_exceeded' | 'api_error' | 'network_error';
  message: string;
}

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
        await new Promise(resolve => setTimeout(resolve, 3000 * attempt));
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
        if (msg.includes('Relay Error') || msg.includes('connection closed') || msg.includes('FunctionsFetchError')) {
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
      progress_message: message
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
    // Upload to storage
    const fileName = `${flowId}/step-${step}-${type}-${Date.now()}.png`;
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert base64 to binary
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const { error: uploadError } = await supabase.storage
      .from('screenshots-archive')
      .upload(fileName, bytes, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('screenshots-archive')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Update or insert flow_step_metrics
    const updateColumn = type === 'desktop' ? 'desktop_screenshot_url' : 'mobile_screenshot_url';
    
    const { data: existing } = await supabase
      .from('flow_step_metrics')
      .select('id')
      .eq('flow_id', flowId)
      .eq('step_number', step)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('flow_step_metrics')
        .update({ [updateColumn]: publicUrl })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('flow_step_metrics')
        .insert({
          flow_id: flowId,
          step_number: step,
          [updateColumn]: publicUrl
        });
    }
    
    return publicUrl;
  } catch (err) {
    console.error('Failed to save screenshot to DB:', err);
    return null;
  }
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
      captureMobile = true 
    }: BulkCaptureRequest = await req.json();

    console.log(`[BulkCapture] Starting job ${jobId} with ${flows.length} flows`);

    // Update job to processing
    await supabase
      .from('export_jobs')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString(),
        progress: 0,
        progress_message: 'Bulk Screenshot-Erfassung gestartet...'
      })
      .eq('id', jobId);

    const dimensions: ('desktop' | 'mobile')[] = [];
    if (captureDesktop) dimensions.push('desktop');
    if (captureMobile) dimensions.push('mobile');

    // Calculate total captures
    let totalCaptures = 0;
    for (const flow of flows) {
      totalCaptures += flow.stepCount * dimensions.length;
    }

    let completedCaptures = 0;
    let successCount = 0;
    let errorCount = 0;
    let quotaExceeded = false;

    for (const flow of flows) {
      if (quotaExceeded) break;
      
      console.log(`[BulkCapture] Processing ${flow.flowId} (${flow.stepCount} steps)`);

      for (let step = 1; step <= flow.stepCount; step++) {
        if (quotaExceeded) break;

        for (const dim of dimensions) {
          if (quotaExceeded) break;

          const progressPercent = Math.round((completedCaptures / totalCaptures) * 100);
          await updateJobProgress(
            supabase,
            jobId,
            progressPercent,
            `${flow.flowName} Step ${step} (${dim}) - ${completedCaptures + 1}/${totalCaptures}`
          );

          // Build capture URL
          const urlObj = new URL(flow.flowPath, baseUrl);
          urlObj.searchParams.set('uc_capture', '1');
          urlObj.searchParams.set('uc_step', String(step));
          urlObj.searchParams.set('uc_render', '1');
          urlObj.searchParams.set('uc_cb', String(Date.now()));
          const captureUrl = urlObj.toString();

          const dimension = dim === 'desktop' ? '1920x1080' : '390x844';

          const result = await captureViaBackend(supabase, captureUrl, dimension);

          if (result.error) {
            console.error(`[BulkCapture] Error for ${flow.flowId} step ${step} ${dim}:`, result.error.message);
            
            if (result.error.type === 'quota_exceeded') {
              quotaExceeded = true;
              await supabase
                .from('export_jobs')
                .update({
                  status: 'failed',
                  error_message: `Quota überschritten nach ${successCount} Screenshots: ${result.error.message}`,
                  completed_at: new Date().toISOString(),
                  progress: progressPercent,
                  progress_message: `Gestoppt bei ${flow.flowName} Step ${step} - Quota erreicht`
                })
                .eq('id', jobId);
              break;
            }
            
            errorCount++;
          } else if (result.data) {
            await saveScreenshotToDb(supabase, flow.flowId, step, dim, result.data);
            successCount++;
          }

          completedCaptures++;

          // Delay between captures
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    if (!quotaExceeded) {
      await supabase
        .from('export_jobs')
        .update({
          status: 'completed',
          progress: 100,
          progress_message: `Fertig! ${successCount} erfolgreich, ${errorCount} Fehler`,
          completed_at: new Date().toISOString()
        })
        .eq('id', jobId);
    }

    console.log(`[BulkCapture] Job ${jobId} finished: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: !quotaExceeded,
        successCount,
        errorCount,
        quotaExceeded
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
