import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      const desktopParams = new URLSearchParams({
        key: screenshotApiKey,
        url: url,
        dimension: '1920x1080',
        device: 'desktop',
        format: 'png',
        cacheLimit: '0',
        delay: '3000'
      });
      
      // Note: Skip hash generation - Deno doesn't support MD5 in crypto.subtle
      // The secretPhrase/hash is optional for ScreenshotMachine API

      const desktopScreenshotApiUrl = `https://api.screenshotmachine.com?${desktopParams.toString()}`;
      const desktopResponse = await fetch(desktopScreenshotApiUrl);
      
      if (desktopResponse.ok) {
        const imageBlob = await desktopResponse.blob();
        const fileName = `landing-pages/${pageId}/v${nextVersionNumber}-desktop-${Date.now()}.png`;
        
        const { error: uploadError } = await supabase.storage
          .from('flow-screenshots')
          .upload(fileName, imageBlob, { contentType: 'image/png', upsert: true });

        if (!uploadError) {
          const { data: publicUrl } = supabase.storage
            .from('flow-screenshots')
            .getPublicUrl(fileName);
          desktopScreenshotUrl = publicUrl.publicUrl;
        } else {
          console.error('Desktop upload error:', uploadError);
        }
      }
    }

    // Capture mobile screenshot
    if (captureMobile) {
      console.log('Capturing mobile screenshot...');
      const mobileParams = new URLSearchParams({
        key: screenshotApiKey,
        url: url,
        dimension: '375x812',
        device: 'phone',
        format: 'png',
        cacheLimit: '0',
        delay: '3000'
      });

      // Note: Skip hash generation - Deno doesn't support MD5 in crypto.subtle

      const mobileScreenshotApiUrl = `https://api.screenshotmachine.com?${mobileParams.toString()}`;
      const mobileResponse = await fetch(mobileScreenshotApiUrl);
      
      if (mobileResponse.ok) {
        const imageBlob = await mobileResponse.blob();
        const fileName = `landing-pages/${pageId}/v${nextVersionNumber}-mobile-${Date.now()}.png`;
        
        const { error: uploadError } = await supabase.storage
          .from('flow-screenshots')
          .upload(fileName, imageBlob, { contentType: 'image/png', upsert: true });

        if (!uploadError) {
          const { data: publicUrl } = supabase.storage
            .from('flow-screenshots')
            .getPublicUrl(fileName);
          mobileScreenshotUrl = publicUrl.publicUrl;
        } else {
          console.error('Mobile upload error:', uploadError);
        }
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

    return new Response(
      JSON.stringify({
        success: true,
        version: newVersion,
        desktopScreenshotUrl,
        mobileScreenshotUrl
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
