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
    const { pageId, url, customInstructions } = await req.json();
    
    if (!pageId || !url) {
      return new Response(
        JSON.stringify({ error: 'pageId and url are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing landing page: ${url} (ID: ${pageId})`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Get latest version for this page
    const { data: latestVersion } = await supabase
      .from('landing_page_versions')
      .select('*')
      .eq('landing_page_id', pageId)
      .order('version_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Create analysis record
    const { data: analysis, error: analysisError } = await supabase
      .from('landing_page_analyses')
      .insert({
        landing_page_id: pageId,
        version_id: latestVersion?.id || null,
        run_type: 'manual',
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (analysisError) throw analysisError;

    // Build analysis prompt
    const pageContent = latestVersion?.markdown_content || latestVersion?.html_snapshot || '';
    const metaData = latestVersion?.meta_data || {};

    const systemPrompt = `Du bist ein Experte für Landing Page Optimierung, SEO und Conversion Rate Optimization.
Analysiere die folgende Schweizer Landing Page für Umzugsfirmen und gib detaillierte Bewertungen.

${customInstructions ? `Zusätzliche Anweisungen: ${customInstructions}` : ''}

Antworte im folgenden JSON-Format:
{
  "overall_score": <0-100>,
  "seo_score": <0-100>,
  "mobile_score": <0-100>,
  "performance_score": <0-100>,
  "conversion_score": <0-100>,
  "trust_score": <0-100>,
  "ux_score": <0-100>,
  "accessibility_score": <0-100>,
  "ai_summary": "<2-3 Sätze Zusammenfassung>",
  "strengths": ["<Stärke 1>", "<Stärke 2>", ...],
  "quick_wins": ["<Quick Win 1>", "<Quick Win 2>", ...],
  "issues": [
    {"severity": "critical|warning|info", "title": "<Titel>", "description": "<Beschreibung>"}
  ],
  "ai_recommendations": [
    {"priority": 1, "title": "<Titel>", "description": "<Beschreibung>", "effort": "low|medium|high"}
  ]
}`;

    const userPrompt = `Analysiere diese Landing Page:

URL: ${url}
Meta-Title: ${metaData.title || 'N/A'}
Meta-Description: ${metaData.description || 'N/A'}

Inhalt:
${pageContent.slice(0, 15000)}`;

    // Call Lovable AI for analysis
    console.log('Calling Lovable AI for analysis...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (aiResponse.status === 402) {
        throw new Error('AI credits exhausted. Please add credits.');
      }
      throw new Error(`AI analysis failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';
    
    console.log('AI response received, parsing...');

    // Parse AI response
    let parsedAnalysis = {
      overall_score: 50,
      seo_score: 50,
      mobile_score: 50,
      performance_score: 50,
      conversion_score: 50,
      trust_score: 50,
      ux_score: 50,
      accessibility_score: 50,
      ai_summary: '',
      strengths: [],
      quick_wins: [],
      issues: [],
      ai_recommendations: []
    };

    try {
      // Extract JSON from response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedAnalysis = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      parsedAnalysis.ai_summary = aiContent.slice(0, 500);
    }

    // Update analysis record with results
    const { error: updateError } = await supabase
      .from('landing_page_analyses')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        overall_score: parsedAnalysis.overall_score,
        seo_score: parsedAnalysis.seo_score,
        mobile_score: parsedAnalysis.mobile_score,
        performance_score: parsedAnalysis.performance_score,
        conversion_score: parsedAnalysis.conversion_score,
        trust_score: parsedAnalysis.trust_score,
        ux_score: parsedAnalysis.ux_score,
        accessibility_score: parsedAnalysis.accessibility_score,
        ai_summary: parsedAnalysis.ai_summary,
        strengths: parsedAnalysis.strengths,
        quick_wins: parsedAnalysis.quick_wins,
        issues: parsedAnalysis.issues,
        ai_recommendations: parsedAnalysis.ai_recommendations
      })
      .eq('id', analysis.id);

    if (updateError) {
      console.error('Failed to update analysis:', updateError);
      throw updateError;
    }

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        analysisId: analysis.id,
        scores: {
          overall: parsedAnalysis.overall_score,
          seo: parsedAnalysis.seo_score,
          mobile: parsedAnalysis.mobile_score,
          conversion: parsedAnalysis.conversion_score
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
