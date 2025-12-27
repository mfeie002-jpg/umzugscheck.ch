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

interface ScreenshotError {
  type: 'quota_exceeded' | 'api_error' | 'network_error';
  message: string;
}

async function captureScreenshot(url: string, dimension: string): Promise<{ data: string | null; error: ScreenshotError | null }> {
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
    
    // Check content type - if it's not an image, it's likely an error response
    const contentType = response.headers.get('content-type') || '';
    
    if (!response.ok) {
      console.error(`Screenshot API error: ${response.status}`);
      
      // Check for quota exceeded (402 Payment Required or similar)
      if (response.status === 402 || response.status === 429) {
        return { 
          data: null, 
          error: { 
            type: 'quota_exceeded', 
            message: 'Screenshot-Kontingent aufgebraucht. Bitte Plan upgraden oder auf nächste Abrechnungsperiode warten.' 
          } 
        };
      }
      
      return { 
        data: null, 
        error: { type: 'api_error', message: `API Fehler: ${response.status}` } 
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    
    // Check if response is too small (likely an error page or empty response)
    if (arrayBuffer.byteLength < 1000) {
      const textResponse = new TextDecoder().decode(arrayBuffer);
      console.error('Unexpected small response:', textResponse);
      
      // Check for quota/credit related error messages
      if (textResponse.toLowerCase().includes('credit') || 
          textResponse.toLowerCase().includes('quota') ||
          textResponse.toLowerCase().includes('limit') ||
          textResponse.toLowerCase().includes('exceeded')) {
        return { 
          data: null, 
          error: { 
            type: 'quota_exceeded', 
            message: 'Screenshot-Kontingent aufgebraucht. Bitte Plan upgraden oder auf nächste Abrechnungsperiode warten.' 
          } 
        };
      }
      
      return { 
        data: null, 
        error: { type: 'api_error', message: 'Ungültige API-Antwort erhalten' } 
      };
    }

    const bytes = new Uint8Array(arrayBuffer);

    // Detect actual image type (ScreenshotMachine sometimes returns GIF/JPG bytes)
    const isPng = bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    const isGif = bytes.length >= 4 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38;
    const isJpg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

    const mime = isPng ? 'image/png' : isGif ? 'image/gif' : isJpg ? 'image/jpeg' : 'application/octet-stream';
    const base64 = btoa(String.fromCharCode(...bytes));
    return { data: `data:${mime};base64,${base64}`, error: null };
  } catch (error) {
    console.error('Screenshot capture error:', error);
    return { 
      data: null, 
      error: { type: 'network_error', message: error instanceof Error ? error.message : 'Netzwerkfehler' } 
    };
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
        const result = await captureScreenshot(stepUrl, '1920x1080');
        
        if (result.error) {
          console.error(`Screenshot error for step ${stepNum}:`, result.error);
          
          // If quota exceeded, fail the entire job with clear message
          if (result.error.type === 'quota_exceeded') {
            await supabase
              .from('export_jobs')
              .update({ 
                status: 'failed',
                error_message: result.error.message,
                completed_at: new Date().toISOString()
              })
              .eq('id', jobId);

            return new Response(
              JSON.stringify({ success: false, error: result.error.message, errorType: 'quota_exceeded' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 402 }
            );
          }
        } else if (result.data) {
          screenshots[`step${stepNum}Desktop`] = result.data;
          console.log(`Desktop screenshot captured for step ${stepNum}`);
        }
      }

      // Capture mobile screenshot
      if (captureMobile) {
        console.log(`Capturing mobile for step ${stepNum}`);
        const result = await captureScreenshot(stepUrl, '375x812');
        
        if (result.error) {
          console.error(`Screenshot error for step ${stepNum}:`, result.error);
          
          if (result.error.type === 'quota_exceeded') {
            await supabase
              .from('export_jobs')
              .update({ 
                status: 'failed',
                error_message: result.error.message,
                completed_at: new Date().toISOString()
              })
              .eq('id', jobId);

            return new Response(
              JSON.stringify({ success: false, error: result.error.message, errorType: 'quota_exceeded' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 402 }
            );
          }
        } else if (result.data) {
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
