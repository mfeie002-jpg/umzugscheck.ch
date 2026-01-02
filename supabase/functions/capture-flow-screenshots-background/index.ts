import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StepConfig {
  step: number;
  name: string;
  description?: string;
}

interface CaptureRequest {
  jobId: string;
  versionId: string;
  flowId: string;
  steps: StepConfig[];
  baseUrl: string;
  captureDesktop?: boolean;
  captureMobile?: boolean;
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
        // Wait before retry with exponential backoff
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
          // capture-mode URLs rely on the in-app sentinel
          waitForReadySentinel: true,
        },
      });

      if (error) {
        const msg = error.message || 'Unknown error';
        // Check if it's a transient error that might succeed on retry
        if (msg.includes('Relay Error') || msg.includes('connection closed') || msg.includes('FunctionsFetchError')) {
          lastError = { type: 'network_error', message: msg };
          console.warn(`Transient error on attempt ${attempt}: ${msg}`);
          continue; // Retry
        }
        return { data: null, error: { type: 'api_error', message: msg } };
      }

      if (!data || (data as any)?.error) {
        const msg = (data as any)?.error || 'Unbekannter Screenshot-Fehler';
        const lower = String(msg).toLowerCase();
        
        // Check for quota exceeded - don't retry
        if (lower.includes('quota') || lower.includes('credit') || lower.includes('limit') || lower.includes('402')) {
          return { data: null, error: { type: 'quota_exceeded', message: String(msg) } };
        }
        
        lastError = { type: 'api_error', message: String(msg) };
        continue; // Retry on other errors
      }

      return { data: (data as any).image ?? null, error: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Netzwerkfehler';
      console.warn(`Exception on attempt ${attempt}: ${msg}`);
      lastError = { type: 'network_error', message: msg };
      // Continue to next retry
    }
  }
  
  // All retries exhausted
  console.error(`All ${maxRetries + 1} attempts failed for ${dimension}`);
  return { data: null, error: lastError };
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
      versionId, 
      flowId, 
      steps, 
      baseUrl,
      captureDesktop = true,
      captureMobile = true 
    }: CaptureRequest = await req.json();

    console.log(`Starting background screenshot capture for job ${jobId}`);
    console.log(`Version: ${versionId}, Flow: ${flowId}, Steps: ${steps.length}`);

    // Update job to in_progress
    await supabase
      .from('export_jobs')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString(),
        progress: 0,
        progress_message: 'Screenshot-Erfassung gestartet...'
      })
      .eq('id', jobId);

    const screenshots: Record<string, string> = {};
    const totalSteps = steps.length;
    let completedSteps = 0;

    for (const step of steps) {
      const stepNum = step.step;
      console.log(`Processing step ${stepNum}/${totalSteps}: ${step.name}`);

      // Update progress
      await supabase
        .from('export_jobs')
        .update({ 
          progress: Math.round((completedSteps / totalSteps) * 100),
          progress_message: `Erfasse Step ${stepNum}: ${step.name}...`
        })
        .eq('id', jobId);

      // Build URL for this step (preserve existing query params like ?variant=v9b)
      const stepUrlObj = new URL(baseUrl);
      stepUrlObj.searchParams.set('uc_capture', '1');
      stepUrlObj.searchParams.set('uc_step', String(stepNum));
      stepUrlObj.searchParams.set('uc_flow', flowId);
      stepUrlObj.searchParams.set('uc_cb', String(Date.now()));
      const stepUrl = stepUrlObj.toString();

      // Capture desktop screenshot
      if (captureDesktop) {
        console.log(`Capturing desktop for step ${stepNum}`);
        const result = await captureViaBackend(supabase, stepUrl, '1920x1080');

        if (result.error) {
          console.error(`Screenshot error for step ${stepNum} (desktop):`, result.error);

          await supabase
            .from('export_jobs')
            .update({
              status: 'failed',
              error_message: result.error.message,
              completed_at: new Date().toISOString(),
            })
            .eq('id', jobId);

          const status = result.error.type === 'quota_exceeded' ? 402 : 500;
          return new Response(
            JSON.stringify({ success: false, error: result.error.message, errorType: result.error.type }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status }
          );
        }

        if (result.data) {
          screenshots[`step${stepNum}Desktop`] = result.data;
          console.log(`Desktop screenshot captured for step ${stepNum}`);
        }
      }

      // Capture mobile screenshot
      if (captureMobile) {
        console.log(`Capturing mobile for step ${stepNum}`);
        const result = await captureViaBackend(supabase, stepUrl, '390x844');

        if (result.error) {
          console.error(`Screenshot error for step ${stepNum} (mobile):`, result.error);

          await supabase
            .from('export_jobs')
            .update({
              status: 'failed',
              error_message: result.error.message,
              completed_at: new Date().toISOString(),
            })
            .eq('id', jobId);

          const status = result.error.type === 'quota_exceeded' ? 402 : 500;
          return new Response(
            JSON.stringify({ success: false, error: result.error.message, errorType: result.error.type }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status }
          );
        }

        if (result.data) {
          screenshots[`step${stepNum}Mobile`] = result.data;
          console.log(`Mobile screenshot captured for step ${stepNum}`);
        }
      }

      completedSteps++;
      
      // Small delay between steps to avoid rate limiting
      if (completedSteps < totalSteps) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`All screenshots captured. Total: ${Object.keys(screenshots).length}`);

    // Build step_configs from the steps we captured
    const stepConfigs = steps.map(s => ({
      step: s.step,
      name: s.name,
      description: s.description || '',
    }));

    // Update the flow_version with new screenshots AND step_configs
    // This ensures step_configs are always saved even for new variants
    const { error: updateError } = await supabase
      .from('flow_versions')
      .update({ 
        screenshots,
        step_configs: stepConfigs 
      })
      .eq('id', versionId);

    if (updateError) {
      console.error('Error updating flow_version:', updateError);
      await supabase
        .from('export_jobs')
        .update({ 
          status: 'failed',
          error_message: `Fehler beim Speichern: ${updateError.message}`,
          completed_at: new Date().toISOString()
        })
        .eq('id', jobId);

      return new Response(
        JSON.stringify({ success: false, error: updateError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Mark job as completed
    await supabase
      .from('export_jobs')
      .update({ 
        status: 'completed',
        progress: 100,
        progress_message: `${Object.keys(screenshots).length} Screenshots erfolgreich erfasst`,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);

    console.log(`Job ${jobId} completed successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        screenshotCount: Object.keys(screenshots).length,
        versionId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Background screenshot error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
