import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Flow configurations matching the central FLOW_CONFIGS - use the same IDs!
const FLOW_CONFIGS: Record<string, { name: string; steps: number; baseUrl: string }> = {
  // Main flows (matching src/data/flowConfigs.ts)
  'umzugsofferten': { name: 'V1 - Control Flow', steps: 4, baseUrl: '/umzugsofferten' },
  'umzugsofferten-v2': { name: 'V2 - Premium Full-Journey', steps: 6, baseUrl: '/umzugsofferten-v2' },
  'umzugsofferten-v3': { name: 'V3 - God Mode', steps: 4, baseUrl: '/umzugsofferten-v3' },
  'umzugsofferten-v4': { name: 'V4 - Video-First AI', steps: 5, baseUrl: '/umzugsofferten-v4' },
  'umzugsofferten-v5': { name: 'V5 - Marketplace Wizard', steps: 5, baseUrl: '/umzugsofferten-v5' },
  'umzugsofferten-v6': { name: 'V6 - Ultimate (6-Tier)', steps: 6, baseUrl: '/umzugsofferten-v6' },
  'umzugsofferten-v7': { name: 'V7 - SwissMove (90s)', steps: 3, baseUrl: '/umzugsofferten-v7' },
  'umzugsofferten-v8': { name: 'V8 - Decision-Free', steps: 5, baseUrl: '/umzugsofferten-v8' },
  'umzugsofferten-v9': { name: 'V9 - Zero Friction', steps: 5, baseUrl: '/umzugsofferten-v9' },
};

const SCREENSHOTMACHINE_KEY = Deno.env.get('SCREENSHOTMACHINE_API_KEY');
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface AnalysisRequest {
  flowId: string;
  runType?: 'manual' | 'scheduled' | 'triggered';
  baseUrl?: string;
}

interface StepAnalysis {
  stepNumber: number;
  stepName: string;
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    category: string;
    title: string;
    description: string;
    recommendation: string;
  }>;
  suggestions: string[];
  scores: {
    mobile: number;
    conversion: number;
    ux: number;
  };
}

async function captureScreenshot(url: string, device: 'desktop' | 'mobile'): Promise<string | null> {
  if (!SCREENSHOTMACHINE_KEY) {
    console.log('No SCREENSHOTMACHINE_API_KEY, skipping screenshot');
    return null;
  }

  const dimension = device === 'desktop' ? '1920x1080' : '430x932';
  const params = new URLSearchParams({
    key: SCREENSHOTMACHINE_KEY,
    url: url,
    dimension: dimension,
    format: 'png',
    cacheLimit: '0',
    delay: '5000',
    js: 'true',
    scroll: 'true',
  });

  try {
    const response = await fetch(`https://api.screenshotmachine.com?${params}`);
    if (!response.ok) {
      console.error(`Screenshot failed for ${url}: ${response.status}`);
      return null;
    }
    
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error('Screenshot error:', error);
    return null;
  }
}

async function analyzeStepWithAI(
  stepNumber: number,
  stepName: string,
  flowName: string,
  desktopScreenshot: string | null,
  mobileScreenshot: string | null
): Promise<StepAnalysis> {
  if (!LOVABLE_API_KEY) {
    console.log('No LOVABLE_API_KEY, returning mock analysis');
    return {
      stepNumber,
      stepName,
      issues: [
        {
          severity: 'info',
          category: 'setup',
          title: 'API Key fehlt',
          description: 'LOVABLE_API_KEY nicht konfiguriert',
          recommendation: 'LOVABLE_API_KEY in Secrets hinzufügen'
        }
      ],
      suggestions: ['AI analysis not available - add LOVABLE_API_KEY'],
      scores: { mobile: 65, conversion: 65, ux: 65 }
    };
  }

  const prompt = `Du bist ein UX/Conversion-Experte. Analysiere Step ${stepNumber} "${stepName}" des Flow "${flowName}".

Bewerte folgende Aspekte und gib konkrete Verbesserungsvorschläge:

1. **Mobile-Friendliness**: Touch-Targets (min 44px), Lesbarkeit, Scrollverhalten
2. **Conversion-Optimierung**: CTA-Klarheit, Formularfelder, Friction Points, Progress-Indikator
3. **UX-Qualität**: Visuelle Hierarchie, Konsistenz, Feedback, Ladezeiten

Antworte im folgenden JSON-Format:
{
  "issues": [
    {
      "severity": "critical|warning|info",
      "category": "mobile|conversion|ux|accessibility|performance",
      "title": "Kurzer Titel",
      "description": "Beschreibung des Problems",
      "recommendation": "Konkrete Lösung"
    }
  ],
  "suggestions": ["Verbesserungsvorschlag 1", "Verbesserungsvorschlag 2"],
  "scores": {
    "mobile": 0-100,
    "conversion": 0-100,
    "ux": 0-100
  }
}`;

  try {
    const messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }> = [
      { role: 'system', content: 'Du bist ein UX/Conversion-Experte für Schweizer Websites. Antworte immer im angegebenen JSON-Format.' }
    ];

    // Build content with images if available
    const userContent: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      { type: 'text', text: prompt }
    ];

    if (desktopScreenshot) {
      userContent.push({
        type: 'image_url',
        image_url: { url: desktopScreenshot }
      });
    }

    if (mobileScreenshot) {
      userContent.push({
        type: 'image_url',
        image_url: { url: mobileScreenshot }
      });
    }

    messages.push({ role: 'user', content: userContent });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI analysis failed:', errorText);
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return {
      stepNumber,
      stepName,
      issues: parsed.issues || [],
      suggestions: parsed.suggestions || [],
      scores: parsed.scores || { mobile: 70, conversion: 70, ux: 70 }
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      stepNumber,
      stepName,
      issues: [
        {
          severity: 'warning',
          category: 'ux',
          title: 'AI-Analyse fehlgeschlagen',
          description: String(error),
          recommendation: 'Manuell überprüfen'
        }
      ],
      suggestions: ['AI-Analyse fehlgeschlagen - manuell prüfen'],
      scores: { mobile: 60, conversion: 60, ux: 60 }
    };
  }
}

async function generateOverallSummary(
  flowName: string,
  stepAnalyses: StepAnalysis[]
): Promise<{ summary: string; recommendations: string[] }> {
  if (!LOVABLE_API_KEY) {
    return {
      summary: 'AI-Zusammenfassung nicht verfügbar.',
      recommendations: ['LOVABLE_API_KEY hinzufügen für vollständige Analyse']
    };
  }

  const issuesCount = stepAnalyses.reduce((acc, s) => acc + s.issues.length, 0);
  const avgMobile = Math.round(stepAnalyses.reduce((acc, s) => acc + s.scores.mobile, 0) / stepAnalyses.length);
  const avgConversion = Math.round(stepAnalyses.reduce((acc, s) => acc + s.scores.conversion, 0) / stepAnalyses.length);
  const avgUx = Math.round(stepAnalyses.reduce((acc, s) => acc + s.scores.ux, 0) / stepAnalyses.length);

  const prompt = `Erstelle eine Executive Summary für den Flow "${flowName}":

Statistiken:
- ${stepAnalyses.length} Steps analysiert
- ${issuesCount} Issues gefunden
- Mobile Score: ${avgMobile}/100
- Conversion Score: ${avgConversion}/100
- UX Score: ${avgUx}/100

Gefundene Issues pro Step:
${stepAnalyses.map(s => `Step ${s.stepNumber}: ${s.issues.length} Issues (${s.issues.filter(i => i.severity === 'critical').length} kritisch)`).join('\n')}

Antworte im JSON-Format:
{
  "summary": "2-3 Sätze Executive Summary",
  "recommendations": ["Top 3-5 priorisierte Handlungsempfehlungen"]
}`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Du bist ein UX/Conversion-Stratege. Antworte im JSON-Format.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) throw new Error('Summary generation failed');

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('Summary generation error:', error);
    return {
      summary: `Flow "${flowName}" mit ${stepAnalyses.length} Steps analysiert. ${issuesCount} Issues gefunden.`,
      recommendations: ['Manuelle Überprüfung empfohlen']
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { flowId, runType = 'manual', baseUrl = 'https://www.umzugscheck.ch' }: AnalysisRequest = await req.json();

    console.log(`Starting analysis for flow: ${flowId}`);

    // Validate flow - check if flow exists
    const flowConfig = FLOW_CONFIGS[flowId];
    if (!flowConfig) {
      console.error(`Unknown flow ID: ${flowId}. Available: ${Object.keys(FLOW_CONFIGS).join(', ')}`);
      return new Response(
        JSON.stringify({ 
          error: `Unknown flow: ${flowId}`,
          available: Object.keys(FLOW_CONFIGS)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Flow config found: ${flowConfig.name} with ${flowConfig.steps} steps`);

    // Create analysis run
    const { data: run, error: runError } = await supabase
      .from('flow_analysis_runs')
      .insert({
        flow_id: flowId,
        flow_name: flowConfig.name,
        run_type: runType,
        status: 'running',
        started_at: new Date().toISOString(),
        total_steps: flowConfig.steps,
      })
      .select()
      .single();

    if (runError) {
      console.error('Error creating run:', runError);
      throw new Error('Failed to create analysis run');
    }

    console.log(`Created run: ${run.id}`);

    const stepAnalyses: StepAnalysis[] = [];
    let allIssues: Array<{
      severity: string;
      category: string;
      issue_type: string;
      title: string;
      description: string;
      recommendation: string;
      step_number: number;
    }> = [];

    // Analyze each step
    for (let step = 1; step <= flowConfig.steps; step++) {
      const stepUrl = `${baseUrl}${flowConfig.baseUrl}?uc_step=${step}&uc_capture=1`;
      const stepName = `Step ${step}`;

      console.log(`Analyzing step ${step}: ${stepUrl}`);

      // Capture screenshots
      const [desktopScreenshot, mobileScreenshot] = await Promise.all([
        captureScreenshot(stepUrl, 'desktop'),
        captureScreenshot(stepUrl, 'mobile')
      ]);

      console.log(`Screenshots captured - Desktop: ${desktopScreenshot ? 'yes' : 'no'}, Mobile: ${mobileScreenshot ? 'yes' : 'no'}`);

      // Analyze with AI
      const analysis = await analyzeStepWithAI(
        step,
        stepName,
        flowConfig.name,
        desktopScreenshot,
        mobileScreenshot
      );

      stepAnalyses.push(analysis);

      // Store step metrics
      await supabase.from('flow_step_metrics').insert({
        run_id: run.id,
        flow_id: flowId,
        step_number: step,
        step_name: stepName,
        step_url: stepUrl,
        mobile_friendliness_score: analysis.scores.mobile,
        estimated_completion_rate: analysis.scores.conversion,
        desktop_screenshot_url: desktopScreenshot,
        mobile_screenshot_url: mobileScreenshot,
        ai_issues: analysis.issues,
        ai_suggestions: analysis.suggestions,
      });

      // Collect issues
      for (const issue of analysis.issues) {
        allIssues.push({
          ...issue,
          issue_type: issue.category,
          step_number: step,
        });
      }

      // Update progress
      await supabase
        .from('flow_analysis_runs')
        .update({ steps_captured: step })
        .eq('id', run.id);
    }

    // Store all issues
    if (allIssues.length > 0) {
      await supabase.from('flow_ux_issues').insert(
        allIssues.map(issue => ({
          run_id: run.id,
          flow_id: flowId,
          step_number: issue.step_number,
          severity: issue.severity,
          category: issue.category,
          issue_type: issue.issue_type,
          title: issue.title,
          description: issue.description,
          recommendation: issue.recommendation,
        }))
      );
    }

    // Generate overall summary
    const { summary, recommendations } = await generateOverallSummary(flowConfig.name, stepAnalyses);

    // Calculate overall scores
    const avgMobile = Math.round(stepAnalyses.reduce((acc, s) => acc + s.scores.mobile, 0) / stepAnalyses.length);
    const avgConversion = Math.round(stepAnalyses.reduce((acc, s) => acc + s.scores.conversion, 0) / stepAnalyses.length);
    const avgUx = Math.round(stepAnalyses.reduce((acc, s) => acc + s.scores.ux, 0) / stepAnalyses.length);
    const overallScore = Math.round((avgMobile + avgConversion + avgUx) / 3);

    // Update run with results
    await supabase
      .from('flow_analysis_runs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        overall_score: overallScore,
        conversion_score: avgConversion,
        performance_score: avgMobile,
        ux_score: avgUx,
        ai_summary: summary,
        ai_recommendations: recommendations,
      })
      .eq('id', run.id);

    // Check for alerts
    const criticalIssues = allIssues.filter(i => i.severity === 'critical').length;
    if (criticalIssues > 0) {
      const { data: alertSettings } = await supabase
        .from('flow_alert_settings')
        .select('*')
        .eq('is_active', true)
        .or(`flow_id.eq.${flowId},flow_id.is.null`);

      for (const setting of alertSettings || []) {
        if (setting.alert_type === 'new_critical_issue') {
          await supabase.from('flow_alerts').insert({
            setting_id: setting.id,
            flow_id: flowId,
            alert_type: 'new_critical_issue',
            title: `${criticalIssues} kritische Issues in ${flowConfig.name}`,
            message: `Die automatische Analyse hat ${criticalIssues} kritische UX-Issues gefunden.`,
            severity: 'critical',
          });
        }
      }
    }

    console.log(`Analysis completed for ${flowId}: Score ${overallScore}/100, ${allIssues.length} issues`);

    return new Response(
      JSON.stringify({
        success: true,
        runId: run.id,
        flowId,
        flowName: flowConfig.name,
        overallScore,
        scores: {
          mobile: avgMobile,
          conversion: avgConversion,
          ux: avgUx,
        },
        issuesCount: allIssues.length,
        criticalCount: criticalIssues,
        summary,
        recommendations,
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
