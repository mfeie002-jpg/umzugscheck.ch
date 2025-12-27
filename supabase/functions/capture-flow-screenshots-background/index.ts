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

const SCREENSHOT_API_KEY = '5b91f9'; // ScreenshotMachine API key

async function captureScreenshot(url: string, dimension: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      key: SCREENSHOT_API_KEY,
      url: url,
      dimension: dimension,
      format: 'png',
      delay: '10000',
      cacheLimit: '0',
    });

    const apiUrl = `https://api.screenshotmachine.com?${params.toString()}`;
    console.log(`Capturing screenshot: ${url} at ${dimension}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`Screenshot API error: ${response.status}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error('Screenshot capture error:', error);
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

      // Build URL for this step
      const stepUrl = `${baseUrl}?uc_capture=1&uc_step=${stepNum}`;

      // Capture desktop screenshot
      if (captureDesktop) {
        console.log(`Capturing desktop for step ${stepNum}`);
        const desktopImage = await captureScreenshot(stepUrl, '1920x1080');
        if (desktopImage) {
          screenshots[`step${stepNum}Desktop`] = desktopImage;
          console.log(`Desktop screenshot captured for step ${stepNum}`);
        } else {
          console.warn(`Failed to capture desktop screenshot for step ${stepNum}`);
        }
      }

      // Capture mobile screenshot
      if (captureMobile) {
        console.log(`Capturing mobile for step ${stepNum}`);
        const mobileImage = await captureScreenshot(stepUrl, '375x812');
        if (mobileImage) {
          screenshots[`step${stepNum}Mobile`] = mobileImage;
          console.log(`Mobile screenshot captured for step ${stepNum}`);
        } else {
          console.warn(`Failed to capture mobile screenshot for step ${stepNum}`);
        }
      }

      completedSteps++;
      
      // Small delay between steps to avoid rate limiting
      if (completedSteps < totalSteps) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`All screenshots captured. Total: ${Object.keys(screenshots).length}`);

    // Update the flow_version with new screenshots
    const { error: updateError } = await supabase
      .from('flow_versions')
      .update({ screenshots })
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
