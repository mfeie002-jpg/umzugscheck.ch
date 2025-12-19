import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SCREENSHOT_API_KEY = "892618";

const TOP_20_URLS = [
  // Core Funnels
  "https://umzugscheck.ch",
  "https://umzugscheck.ch/umzugsofferten",
  "https://umzugscheck.ch/preisrechner",
  // Rankings
  "https://umzugscheck.ch/firmen",
  "https://umzugscheck.ch/beste-umzugsfirma",
  "https://umzugscheck.ch/guenstige-umzugsfirma",
  // Regions
  "https://umzugscheck.ch/umzugsfirmen/zuerich",
  "https://umzugscheck.ch/umzugsfirmen/bern",
  "https://umzugscheck.ch/umzugsfirmen/basel",
  "https://umzugscheck.ch/umzugsfirmen/aargau",
  "https://umzugscheck.ch/umzugsfirmen/luzern",
  "https://umzugscheck.ch/umzugsfirmen/st-gallen",
  // Services
  "https://umzugscheck.ch/privatumzug",
  "https://umzugscheck.ch/firmenumzug",
  "https://umzugscheck.ch/reinigung",
  "https://umzugscheck.ch/entsorgung",
  // Content
  "https://umzugscheck.ch/umzugskosten",
  "https://umzugscheck.ch/ratgeber",
  "https://umzugscheck.ch/checkliste",
  // B2B
  "https://umzugscheck.ch/fuer-firmen",
];

async function fetchHtml(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    
    if (!response.ok) {
      return `<!-- Failed to fetch: ${response.status} -->`;
    }
    
    const html = await response.text();
    // Remove scripts for security
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- script removed -->');
  } catch (error) {
    return `<!-- Error fetching HTML: ${error} -->`;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting scheduled screenshot capture...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const results: { url: string; success: boolean; error?: string }[] = [];

    for (let i = 0; i < TOP_20_URLS.length; i++) {
      const url = TOP_20_URLS[i];
      console.log(`Processing ${i + 1}/${TOP_20_URLS.length}: ${url}`);
      
      try {
        const hostname = new URL(url).hostname;
        const pathname = new URL(url).pathname.replace(/\//g, '_') || 'index';
        const basePath = `${timestamp}/${String(i + 1).padStart(2, '0')}_${hostname}${pathname}`;

        // Capture Desktop Screenshot (Full Page)
        const desktopParams = new URLSearchParams({
          key: SCREENSHOT_API_KEY,
          url: url,
          dimension: '1920xfull',
          format: 'png',
          cacheLimit: '0',
          delay: '3000',
        });
        const desktopUrl = `https://api.screenshotmachine.com?${desktopParams.toString()}`;
        
        const desktopResponse = await fetch(desktopUrl);
        if (desktopResponse.ok) {
          const desktopBlob = await desktopResponse.blob();
          const desktopArrayBuffer = await desktopBlob.arrayBuffer();
          
          await supabase.storage
            .from('screenshots-archive')
            .upload(`${basePath}_desktop.png`, desktopArrayBuffer, {
              contentType: 'image/png',
              upsert: true
            });
        }

        // Capture Mobile Screenshot (Full Page)
        const mobileParams = new URLSearchParams({
          key: SCREENSHOT_API_KEY,
          url: url,
          dimension: '375xfull',
          format: 'png',
          cacheLimit: '0',
          delay: '3000',
        });
        const mobileUrl = `https://api.screenshotmachine.com?${mobileParams.toString()}`;
        
        const mobileResponse = await fetch(mobileUrl);
        if (mobileResponse.ok) {
          const mobileBlob = await mobileResponse.blob();
          const mobileArrayBuffer = await mobileBlob.arrayBuffer();
          
          await supabase.storage
            .from('screenshots-archive')
            .upload(`${basePath}_mobile.png`, mobileArrayBuffer, {
              contentType: 'image/png',
              upsert: true
            });
        }

        // Fetch HTML
        const htmlContent = await fetchHtml(url);
        const htmlEncoder = new TextEncoder();
        const htmlArrayBuffer = htmlEncoder.encode(htmlContent);
        
        await supabase.storage
          .from('screenshots-archive')
          .upload(`${basePath}.html`, htmlArrayBuffer, {
            contentType: 'text/html',
            upsert: true
          });

        // Save metadata
        const metadata = {
          url,
          capturedAt: new Date().toISOString(),
          desktopDimension: '1920xfull',
          mobileDimension: '375xfull',
          index: i + 1,
          automated: true
        };
        const metaEncoder = new TextEncoder();
        const metaArrayBuffer = metaEncoder.encode(JSON.stringify(metadata, null, 2));
        
        await supabase.storage
          .from('screenshots-archive')
          .upload(`${basePath}_meta.json`, metaArrayBuffer, {
            contentType: 'application/json',
            upsert: true
          });

        results.push({ url, success: true });
        console.log(`✓ Successfully captured: ${url}`);
        
        // Delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`✗ Failed to capture ${url}:`, error);
        results.push({ url, success: false, error: String(error) });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`Completed: ${successCount}/${TOP_20_URLS.length} screenshots captured`);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp,
        total: TOP_20_URLS.length,
        successful: successCount,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Scheduled screenshot error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
