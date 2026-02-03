/**
 * Geo Location Edge Function
 * Returns country/city based on CDN headers or Cloudflare trace fallback
 * Eliminates client-side CORS issues and rate limiting from third-party APIs
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try CDN headers first (Cloudflare, Vercel, Netlify, etc.)
    const cfCountry = req.headers.get('cf-ipcountry');
    const vercelCountry = req.headers.get('x-vercel-ip-country');
    const netlifyCountry = req.headers.get('x-country');
    const cfCity = req.headers.get('cf-ipcity');
    const cfRegion = req.headers.get('cf-region');
    
    const country = cfCountry || vercelCountry || netlifyCountry || '';
    const city = cfCity || '';
    const region = cfRegion || '';
    
    // If CDN provides country, return immediately (fastest path)
    if (country) {
      return new Response(
        JSON.stringify({ 
          country, 
          city: decodeURIComponent(city), 
          region, 
          source: 'cdn' 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
          } 
        }
      );
    }

    // Fallback: Use Cloudflare's free trace endpoint (server-side, no rate limits)
    const traceResp = await fetch('https://cloudflare.com/cdn-cgi/trace', {
      signal: AbortSignal.timeout(3000), // 3s timeout
    });
    
    if (traceResp.ok) {
      const traceText = await traceResp.text();
      const loc = traceText.match(/loc=(\w+)/)?.[1] || '';
      
      return new Response(
        JSON.stringify({ 
          country: loc, 
          city: '', 
          region: '', 
          source: 'trace' 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600'
          } 
        }
      );
    }

    // If all methods fail, return empty response (graceful degradation)
    return new Response(
      JSON.stringify({ 
        country: '', 
        city: '', 
        region: '', 
        source: 'none' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('Geo lookup error:', error);
    
    return new Response(
      JSON.stringify({ 
        country: '', 
        city: '', 
        region: '', 
        source: 'error' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
