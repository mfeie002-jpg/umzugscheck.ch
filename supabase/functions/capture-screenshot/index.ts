import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Default to screenshotmachine.com API (supports JavaScript rendering)
const SCREENSHOT_API_KEY = Deno.env.get('SCREENSHOTMACHINE_API_KEY') || '892618';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, dimension = '1920xfull', delay = 5000, format = 'png' } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Capturing screenshot for: ${url}, dimension: ${dimension}, delay: ${delay}ms`);

    // Build ScreenshotMachine API URL with extended delay for JS animations
    const params = new URLSearchParams({
      key: SCREENSHOT_API_KEY,
      url: url,
      dimension: dimension,
      format: format,
      cacheLimit: '0', // No cache
      delay: String(delay), // Wait for animations
      // Additional params for better JS rendering
      js: 'true', // Enable JavaScript
      scroll: 'true', // Scroll the page to trigger scroll animations
    });

    const apiUrl = `https://api.screenshotmachine.com?${params.toString()}`;
    
    console.log('Requesting screenshot from API...');
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`Screenshot API error: ${response.status}`);
      return new Response(
        JSON.stringify({ error: `Screenshot API error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return the image as base64
    const imageBlob = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBlob)));

    console.log(`Screenshot captured successfully, size: ${imageBlob.byteLength} bytes`);

    return new Response(
      JSON.stringify({ 
        success: true,
        image: `data:image/${format};base64,${base64}`,
        url,
        dimension,
        capturedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Screenshot capture error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});