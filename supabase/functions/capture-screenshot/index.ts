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
      scroll = true,
      noCache = true,
    } = await req.json();

    // Validate format
    const validFormats = ['png', 'jpg', 'pdf'];
    const outputFormat = validFormats.includes(format) ? format : 'png';

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
      format: outputFormat,
      cacheLimit: noCache ? '0' : '14400', // 0 = no cache, 14400 = 10 days
      delay: String(delay),
      js: 'true',
    });

    // Add scroll params for full-page captures - critical for lazy-loaded content
    if (fullPage) {
      // For full-page, scroll to bottom first to trigger lazy loading
      params.set('scroll', 'true');
      params.set('scrollto', 'bottom');
      params.set('scrolldelay', '3000'); // Wait 3s after scrolling
      params.set('scrollback', 'true'); // Scroll back to top after loading
    } else if (scroll) {
      params.set('scroll', 'true');
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

    // Return the image as base64 (handle large images safely)
    const imageBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(imageBuffer);
    
    // Convert to base64 in chunks to avoid stack overflow
    let base64 = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize);
      base64 += String.fromCharCode(...chunk);
    }
    base64 = btoa(base64);

    console.log(`Screenshot captured successfully, size: ${imageBuffer.byteLength} bytes, format: ${outputFormat}`);

    // Determine MIME type based on format
    const mimeType = outputFormat === 'pdf' ? 'application/pdf' : `image/${outputFormat}`;

    return new Response(
      JSON.stringify({ 
        success: true,
        image: `data:${mimeType};base64,${base64}`,
        url,
        dimension: effectiveDimension,
        format: outputFormat,
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
