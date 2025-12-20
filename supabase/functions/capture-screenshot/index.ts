import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { encode as encodeHex } from "https://deno.land/std@0.168.0/encoding/hex.ts";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ScreenshotMachine API credentials
const SCREENSHOT_API_KEY = Deno.env.get('SCREENSHOTMACHINE_API_KEY') || '892618';
const SECRET_PHRASE = 'iamthebestintheworld'; // Secret phrase for hash generation

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      url, 
      dimension = '1920x1080', 
      delay = 6000, 
      format = 'png', 
      fullPage = false,
      scroll = true 
    } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Capturing screenshot for: ${url}, dimension: ${dimension}, delay: ${delay}ms, fullPage: ${fullPage}`);

    // Determine effective dimension for full-page captures
    const width = dimension.split("x")[0];
    const effectiveDimension = fullPage ? `${width}xfull` : dimension;

    // Build ScreenshotMachine API URL with hash for authentication
    const params = new URLSearchParams({
      key: SCREENSHOT_API_KEY,
      url: url,
      dimension: effectiveDimension,
      format: format,
      cacheLimit: '0',
      delay: String(delay),
      js: 'true',
    });

    // Add scroll params for full-page captures
    if (scroll) {
      params.set('scroll', 'true');
    }
    if (fullPage) {
      params.set('scrollto', 'bottom');
    }

    // Generate MD5 hash: md5(url + secretPhrase)
    const hashInput = url + SECRET_PHRASE;
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest("MD5", data);
    const hashBytes = encodeHex(new Uint8Array(hashBuffer));
    const hash = new TextDecoder().decode(hashBytes);
    params.set('hash', hash);

    const apiUrl = `https://api.screenshotmachine.com?${params.toString()}`;
    
    console.log('Requesting screenshot from API (hash included)');
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Screenshot API error: ${response.status}`, errorText);
      return new Response(
        JSON.stringify({ error: `Screenshot API error: ${response.status}`, details: errorText }),
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
        dimension: effectiveDimension,
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
