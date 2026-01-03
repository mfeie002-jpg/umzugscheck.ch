import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CaptureRequest {
  url: string;
  waitFor?: number;
  onlyMainContent?: boolean;
  formats?: ('html' | 'markdown' | 'rawHtml' | 'links')[];
}

// Simple HTML to Markdown converter for fallback
function htmlToSimpleMarkdown(html: string): string {
  let text = html;
  
  // Remove scripts and styles
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Convert headings
  text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  text = text.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  
  // Convert paragraphs and divs
  text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  
  // Convert links
  text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // Convert lists
  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  
  // Remove remaining tags
  text = text.replace(/<[^>]+>/g, '');
  
  // Clean up whitespace
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();
  
  // Decode HTML entities
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, ' ');
  
  return text;
}

// Fallback: Simple fetch without Firecrawl
async function simpleFetch(url: string): Promise<{ html: string; markdown: string }> {
  console.log(`Fallback: Simple fetch for ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Simple fetch failed with status ${response.status}`);
  }
  
  const html = await response.text();
  const markdown = htmlToSimpleMarkdown(html);
  
  return { html, markdown };
}

// Retry wrapper with timeout
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  maxRetries = 2,
  timeoutMs = 30000
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`Attempt ${attempt + 1} failed: ${lastError.message}`);
      
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  throw lastError || new Error('All retry attempts failed');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, waitFor = 5000, onlyMainContent = false, formats = ['html', 'markdown'] }: CaptureRequest = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log(`Capturing rendered HTML from: ${formattedUrl}`);
    console.log(`Options: waitFor=${waitFor}ms, onlyMainContent=${onlyMainContent}, formats=${formats.join(',')}`);

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    
    let result: { html?: string; markdown?: string; rawHtml?: string; links?: string[]; metadata?: unknown } = {};
    let usedFallback = false;

    if (apiKey) {
      try {
        const response = await fetchWithRetry(
          'https://api.firecrawl.dev/v1/scrape',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: formattedUrl,
              formats: formats,
              onlyMainContent: onlyMainContent,
              waitFor: waitFor,
            }),
          },
          2, // max retries
          45000 // 45 second timeout
        );

        const data = await response.json();

        if (!response.ok) {
          console.error('Firecrawl API error:', data);
          throw new Error(data.error || `Firecrawl request failed with status ${response.status}`);
        }

        result = data.data || data;
        console.log(`Successfully captured via Firecrawl from ${formattedUrl}`);
      } catch (firecrawlError) {
        console.error('Firecrawl failed, using fallback:', firecrawlError);
        usedFallback = true;
        
        // Use simple fetch as fallback
        const fallbackResult = await simpleFetch(formattedUrl);
        result = fallbackResult;
      }
    } else {
      console.log('No Firecrawl API key, using simple fetch');
      usedFallback = true;
      const fallbackResult = await simpleFetch(formattedUrl);
      result = fallbackResult;
    }
    
    console.log(`HTML length: ${result.html?.length || 0}, Markdown length: ${result.markdown?.length || 0}${usedFallback ? ' (fallback)' : ''}`);

    return new Response(
      JSON.stringify({
        success: true,
        url: formattedUrl,
        html: result.html,
        markdown: result.markdown,
        rawHtml: result.rawHtml,
        links: result.links,
        metadata: result.metadata,
        capturedAt: new Date().toISOString(),
        usedFallback,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in capture-rendered-html function:', errorMessage);
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
