import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple MD5 implementation for Deno
async function md5(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  
  // Use SubtleCrypto with SHA-256 as fallback since MD5 isn't available
  // But for ScreenshotMachine, we need actual MD5
  // Let's use a pure JS implementation
  
  function md5Hash(str: string): string {
    function md5cycle(x: number[], k: number[]) {
      let a = x[0], b = x[1], c = x[2], d = x[3];

      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);

      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);

      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);

      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);

      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
    }

    function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function md51(s: string) {
      const n = s.length;
      const state = [1732584193, -271733879, -1732584194, 271733878];
      let i;
      for (i = 64; i <= s.length; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
      }
      s = s.substring(i - 64);
      const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (i = 0; i < s.length; i++) {
        tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
      }
      tail[i >> 2] |= 0x80 << ((i % 4) << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
      }
      tail[14] = n * 8;
      md5cycle(state, tail);
      return state;
    }

    function md5blk(s: string) {
      const md5blks = [];
      for (let i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    }

    const hex_chr = '0123456789abcdef'.split('');

    function rhex(n: number) {
      let s = '';
      for (let j = 0; j < 4; j++) {
        s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
      }
      return s;
    }

    function hex(x: number[]) {
      return x.map(rhex).join('');
    }

    function add32(a: number, b: number) {
      return (a + b) & 0xFFFFFFFF;
    }

    return hex(md51(str));
  }
  
  return md5Hash(input);
}

// Check if an image blob is likely an error image (very small or specific size)
async function isValidScreenshot(blob: Blob): Promise<boolean> {
  // Error images from ScreenshotMachine are typically small
  // A valid 1920x1080 screenshot should be at least 50KB
  // A valid 375x812 mobile screenshot should be at least 20KB
  if (blob.size < 15000) {
    console.log(`Image too small (${blob.size} bytes), likely an error image`);
    return false;
  }
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pageId, url, captureDesktop = true, captureMobile = true } = await req.json();
    
    if (!pageId || !url) {
      return new Response(
        JSON.stringify({ error: 'pageId and url are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Capturing landing page: ${url} (ID: ${pageId})`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const screenshotApiKey = Deno.env.get('SCREENSHOTMACHINE_API_KEY');
    const secretPhrase = Deno.env.get('SCREENSHOTMACHINE_SECRET_PHRASE') || '';

    if (!screenshotApiKey) {
      throw new Error('SCREENSHOTMACHINE_API_KEY not configured');
    }

    // Get current version count
    const { data: versions, error: versionError } = await supabase
      .from('landing_page_versions')
      .select('version_number')
      .eq('landing_page_id', pageId)
      .order('version_number', { ascending: false })
      .limit(1);

    const nextVersionNumber = (versions?.[0]?.version_number || 0) + 1;

    let desktopScreenshotUrl: string | null = null;
    let mobileScreenshotUrl: string | null = null;

    // Capture desktop screenshot
    if (captureDesktop) {
      console.log('Capturing desktop screenshot...');
      
      // Generate hash if secret phrase is configured
      let hashParam = '';
      if (secretPhrase) {
        const hashInput = url + screenshotApiKey + secretPhrase;
        hashParam = await md5(hashInput);
        console.log('Using hash authentication for desktop');
      }
      
      const desktopParams = new URLSearchParams({
        key: screenshotApiKey,
        url: url,
        dimension: '1920x1080',
        device: 'desktop',
        format: 'png',
        cacheLimit: '0',
        delay: '5000'
      });
      
      if (hashParam) {
        desktopParams.set('hash', hashParam);
      }

      const desktopScreenshotApiUrl = `https://api.screenshotmachine.com?${desktopParams.toString()}`;
      console.log('Desktop API URL (without key):', desktopScreenshotApiUrl.replace(screenshotApiKey, '***'));
      
      const desktopResponse = await fetch(desktopScreenshotApiUrl);
      
      if (desktopResponse.ok) {
        const imageBlob = await desktopResponse.blob();
        console.log(`Desktop image size: ${imageBlob.size} bytes`);
        
        // Validate the screenshot
        if (await isValidScreenshot(imageBlob)) {
          const fileName = `landing-pages/${pageId}/v${nextVersionNumber}-desktop-${Date.now()}.png`;
          
          const { error: uploadError } = await supabase.storage
            .from('flow-screenshots')
            .upload(fileName, imageBlob, { contentType: 'image/png', upsert: true });

          if (!uploadError) {
            const { data: publicUrl } = supabase.storage
              .from('flow-screenshots')
              .getPublicUrl(fileName);
            desktopScreenshotUrl = publicUrl.publicUrl;
            console.log('Desktop screenshot uploaded successfully');
          } else {
            console.error('Desktop upload error:', uploadError);
          }
        } else {
          console.error('Desktop screenshot validation failed - received error image from API');
        }
      } else {
        console.error('Desktop screenshot API error:', desktopResponse.status, await desktopResponse.text());
      }
    }

    // Capture mobile screenshot
    if (captureMobile) {
      console.log('Capturing mobile screenshot...');
      
      // Generate hash if secret phrase is configured
      let hashParam = '';
      if (secretPhrase) {
        const hashInput = url + screenshotApiKey + secretPhrase;
        hashParam = await md5(hashInput);
        console.log('Using hash authentication for mobile');
      }
      
      const mobileParams = new URLSearchParams({
        key: screenshotApiKey,
        url: url,
        dimension: '375x812',
        device: 'phone',
        format: 'png',
        cacheLimit: '0',
        delay: '5000'
      });

      if (hashParam) {
        mobileParams.set('hash', hashParam);
      }

      const mobileScreenshotApiUrl = `https://api.screenshotmachine.com?${mobileParams.toString()}`;
      const mobileResponse = await fetch(mobileScreenshotApiUrl);
      
      if (mobileResponse.ok) {
        const imageBlob = await mobileResponse.blob();
        console.log(`Mobile image size: ${imageBlob.size} bytes`);
        
        // Validate the screenshot
        if (await isValidScreenshot(imageBlob)) {
          const fileName = `landing-pages/${pageId}/v${nextVersionNumber}-mobile-${Date.now()}.png`;
          
          const { error: uploadError } = await supabase.storage
            .from('flow-screenshots')
            .upload(fileName, imageBlob, { contentType: 'image/png', upsert: true });

          if (!uploadError) {
            const { data: publicUrl } = supabase.storage
              .from('flow-screenshots')
              .getPublicUrl(fileName);
            mobileScreenshotUrl = publicUrl.publicUrl;
            console.log('Mobile screenshot uploaded successfully');
          } else {
            console.error('Mobile upload error:', uploadError);
          }
        } else {
          console.error('Mobile screenshot validation failed - received error image from API');
        }
      } else {
        console.error('Mobile screenshot API error:', mobileResponse.status, await mobileResponse.text());
      }
    }

    // Try to fetch HTML content using Firecrawl if available
    let htmlSnapshot: string | null = null;
    let renderedHtml: string | null = null;
    let markdownContent: string | null = null;
    let metaData: Record<string, any> = {};

    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (firecrawlKey) {
      try {
        console.log('Fetching page content with Firecrawl...');
        const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
            formats: ['markdown', 'html'],
            onlyMainContent: false,
          }),
        });

        if (firecrawlResponse.ok) {
          const firecrawlData = await firecrawlResponse.json();
          htmlSnapshot = firecrawlData.data?.html || null;
          markdownContent = firecrawlData.data?.markdown || null;
          metaData = firecrawlData.data?.metadata || {};
        }
      } catch (fcError) {
        console.log('Firecrawl not available or failed:', fcError);
      }
    }

    // Only create version if we got at least one valid screenshot or content
    if (!desktopScreenshotUrl && !mobileScreenshotUrl && !htmlSnapshot && !markdownContent) {
      console.error('No valid content captured - not creating version');
      return new Response(
        JSON.stringify({ 
          error: 'Failed to capture any valid content. Please check API configuration.',
          details: 'Screenshot API may have authentication issues or the page failed to load.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new version record
    const { data: newVersion, error: insertError } = await supabase
      .from('landing_page_versions')
      .insert({
        landing_page_id: pageId,
        version_number: nextVersionNumber,
        version_name: `v${nextVersionNumber}`,
        desktop_screenshot_url: desktopScreenshotUrl,
        mobile_screenshot_url: mobileScreenshotUrl,
        html_snapshot: htmlSnapshot,
        markdown_content: markdownContent,
        meta_data: metaData,
        created_by: 'system'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating version:', insertError);
      throw insertError;
    }

    console.log(`Version ${nextVersionNumber} created successfully`);
    console.log(`- Desktop: ${desktopScreenshotUrl ? 'OK' : 'FAILED'}`);
    console.log(`- Mobile: ${mobileScreenshotUrl ? 'OK' : 'FAILED'}`);
    console.log(`- HTML: ${htmlSnapshot ? 'OK' : 'N/A'}`);
    console.log(`- Markdown: ${markdownContent ? 'OK' : 'N/A'}`);

    return new Response(
      JSON.stringify({
        success: true,
        version: newVersion,
        desktopScreenshotUrl,
        mobileScreenshotUrl,
        hasHtml: !!htmlSnapshot,
        hasMarkdown: !!markdownContent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Capture error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
