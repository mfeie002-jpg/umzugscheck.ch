import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Google PageSpeed Insights API (free tier, no API key required for basic usage)
const PAGESPEED_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

interface LighthouseResult {
  url: string;
  fetchTime: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    firstContentfulPaint: string;
    largestContentfulPaint: string;
    totalBlockingTime: string;
    cumulativeLayoutShift: string;
    speedIndex: string;
    timeToInteractive: string;
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    score: number | null;
  }>;
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, strategy = 'mobile' } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Running Lighthouse for ${url} (${strategy})`);

    // Call PageSpeed Insights API
    const apiUrl = new URL(PAGESPEED_API_URL);
    apiUrl.searchParams.set('url', url);
    apiUrl.searchParams.set('strategy', strategy);
    apiUrl.searchParams.set('category', 'performance');
    apiUrl.searchParams.set('category', 'accessibility');
    apiUrl.searchParams.set('category', 'best-practices');
    apiUrl.searchParams.set('category', 'seo');

    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('PageSpeed API error:', response.status, errorText);
      
      // Handle rate limit (429) gracefully
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'PageSpeed API rate limit exceeded. Please try again later or reduce the number of concurrent requests.',
            errorType: 'RATE_LIMIT',
            retryAfter: 60
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: `PageSpeed API error: ${response.status}`,
          errorType: 'API_ERROR'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const lighthouseResult = data.lighthouseResult;
    const categories = lighthouseResult.categories;
    const audits = lighthouseResult.audits;

    // Extract scores (0-100)
    const scores = {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
    };

    // Extract Core Web Vitals and metrics
    const metrics = {
      firstContentfulPaint: audits['first-contentful-paint']?.displayValue || 'N/A',
      largestContentfulPaint: audits['largest-contentful-paint']?.displayValue || 'N/A',
      totalBlockingTime: audits['total-blocking-time']?.displayValue || 'N/A',
      cumulativeLayoutShift: audits['cumulative-layout-shift']?.displayValue || 'N/A',
      speedIndex: audits['speed-index']?.displayValue || 'N/A',
      timeToInteractive: audits['interactive']?.displayValue || 'N/A',
    };

    // Extract opportunities (things to improve)
    const opportunities: Array<{ id: string; title: string; description: string; score: number | null }> = [];
    const opportunityIds = [
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'uses-responsive-images',
      'efficient-animated-content',
      'unminified-css',
      'unminified-javascript',
      'uses-text-compression',
      'uses-optimized-images',
    ];

    for (const id of opportunityIds) {
      if (audits[id] && audits[id].score !== null && audits[id].score < 1) {
        opportunities.push({
          id,
          title: audits[id].title,
          description: audits[id].description,
          score: audits[id].score,
        });
      }
    }

    // Extract diagnostics
    const diagnostics: Array<{ id: string; title: string; description: string }> = [];
    const diagnosticIds = [
      'dom-size',
      'critical-request-chains',
      'font-display',
      'bootup-time',
      'mainthread-work-breakdown',
    ];

    for (const id of diagnosticIds) {
      if (audits[id]) {
        diagnostics.push({
          id,
          title: audits[id].title,
          description: audits[id].displayValue || audits[id].description,
        });
      }
    }

    const result: LighthouseResult = {
      url,
      fetchTime: new Date().toISOString(),
      scores,
      metrics,
      opportunities: opportunities.slice(0, 5), // Top 5 opportunities
      diagnostics: diagnostics.slice(0, 5), // Top 5 diagnostics
    };

    console.log(`Lighthouse scores for ${url}:`, scores);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Lighthouse function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
