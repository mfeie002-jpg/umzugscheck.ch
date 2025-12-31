import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as encodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Flow configurations matching the central FLOW_CONFIGS - use the same IDs!
const FLOW_CONFIGS: Record<string, { name: string; steps: number; baseUrl: string }> = {
  // Main flows (matching src/data/flowConfigs.ts)
  'umzugsofferten': { name: 'V1 - Control Flow', steps: 4, baseUrl: '/umzugsofferten' },
  'umzugsofferten-v1': { name: 'V1 - Control Flow', steps: 4, baseUrl: '/umzugsofferten' },
  'umzugsofferten-v2': { name: 'V2 - Premium Full-Journey', steps: 6, baseUrl: '/umzugsofferten-v2' },
  'umzugsofferten-v3': { name: 'V3 - God Mode', steps: 4, baseUrl: '/umzugsofferten-v3' },
  'umzugsofferten-v4': { name: 'V4 - Video-First AI', steps: 5, baseUrl: '/umzugsofferten-v4' },
  'umzugsofferten-v5': { name: 'V5 - Marketplace Wizard', steps: 5, baseUrl: '/umzugsofferten-v5' },
  'umzugsofferten-v6': { name: 'V6 - Ultimate (6-Tier)', steps: 6, baseUrl: '/umzugsofferten-v6' },
  'umzugsofferten-v7': { name: 'V7 - SwissMove (90s)', steps: 3, baseUrl: '/umzugsofferten-v7' },
  'umzugsofferten-v8': { name: 'V8 - Decision-Free', steps: 5, baseUrl: '/umzugsofferten-v8' },
  'umzugsofferten-v9': { name: 'V9 - Zero Friction', steps: 5, baseUrl: '/umzugsofferten-v9' },
  // V2.e Chat-based Funnel (standalone route)
  'umzugsofferten-v2e': { name: 'V2.e - Chat Funnel', steps: 10, baseUrl: '/umzugsofferten-v2e' },
  // Sub-variants (v1a, v1b, v1c, etc.)
  'v1a': { name: 'V1a Control (Feedback)', steps: 2, baseUrl: '/umzugsofferten?variant=v1a' },
  'v1b': { name: 'V1b ChatGPT Agent', steps: 4, baseUrl: '/umzugsofferten?variant=v1b' },
  'v1c': { name: 'V1c Variant', steps: 3, baseUrl: '/umzugsofferten?variant=v1c' },
  'v1d': { name: 'V1d Variant', steps: 3, baseUrl: '/umzugsofferten?variant=v1d' },
  'v1e': { name: 'V1e Variant', steps: 3, baseUrl: '/umzugsofferten?variant=v1e' },
  // V2 sub-variants
  'v2a': { name: 'V2a Progress Enhanced', steps: 6, baseUrl: '/umzugsofferten-v2?variant=v2a' },
  'v2b': { name: 'V2b Simplified Labels', steps: 6, baseUrl: '/umzugsofferten-v2?variant=v2b' },
  'v2c': { name: 'V2c Trust Focused', steps: 6, baseUrl: '/umzugsofferten-v2?variant=v2c' },
  'v2d': { name: 'V2d Speed Optimized', steps: 6, baseUrl: '/umzugsofferten-v2?variant=v2d' },
  // Keep alias for legacy tooling, but point to the standalone route
  'v2e': { name: 'V2.e - Chat Funnel', steps: 10, baseUrl: '/umzugsofferten-v2e' },
  'v2f': { name: 'V2f Premium (Feedback)', steps: 3, baseUrl: '/umzugsofferten-v2?variant=v2f' },
  // V3 sub-variants
  'v3a': { name: 'V3a Mobile First', steps: 4, baseUrl: '/umzugsofferten-v3?variant=v3a' },
  'v3b': { name: 'V3b Swipe Navigation', steps: 4, baseUrl: '/umzugsofferten-v3?variant=v3b' },
  'v3c': { name: 'V3c Bottom Sheet', steps: 4, baseUrl: '/umzugsofferten-v3?variant=v3c' },
  'v3d': { name: 'V3d Thumb Zone', steps: 4, baseUrl: '/umzugsofferten-v3?variant=v3d' },
  'v3e': { name: 'V3e Fullscreen', steps: 4, baseUrl: '/umzugsofferten-v3?variant=v3e' },
  'v3f': { name: 'V3f Feedback', steps: 3, baseUrl: '/umzugsofferten-v3?variant=v3f' },
  'v3g': { name: 'V3g Feedback', steps: 3, baseUrl: '/umzugsofferten-v3?variant=v3g' },
  // V4 sub-variants
  'v4a': { name: 'V4a Urgency Based', steps: 5, baseUrl: '/umzugsofferten-v4?variant=v4a' },
  'v4b': { name: 'V4b Social Proof', steps: 5, baseUrl: '/umzugsofferten-v4?variant=v4b' },
  'v4c': { name: 'V4c Value First', steps: 5, baseUrl: '/umzugsofferten-v4?variant=v4c' },
  'v4d': { name: 'V4d Gamified', steps: 5, baseUrl: '/umzugsofferten-v4?variant=v4d' },
  'v4e': { name: 'V4e Minimal Friction', steps: 5, baseUrl: '/umzugsofferten-v4?variant=v4e' },
  'v4f': { name: 'V4f Feedback', steps: 3, baseUrl: '/umzugsofferten-v4?variant=v4f' },
  // V5 sub-variants
  'v5a': { name: 'V5a High Contrast', steps: 5, baseUrl: '/umzugsofferten-v5?variant=v5a' },
  'v5b': { name: 'V5b Screen Reader', steps: 5, baseUrl: '/umzugsofferten-v5?variant=v5b' },
  'v5c': { name: 'V5c Keyboard Nav', steps: 5, baseUrl: '/umzugsofferten-v5?variant=v5c' },
  'v5d': { name: 'V5d Large Text', steps: 5, baseUrl: '/umzugsofferten-v5?variant=v5d' },
  'v5e': { name: 'V5e Reduced Motion', steps: 5, baseUrl: '/umzugsofferten-v5?variant=v5e' },
  'v5f': { name: 'V5f Feedback', steps: 3, baseUrl: '/umzugsofferten-v5?variant=v5f' },
  // V6 sub-variants
  'v6a': { name: 'V6a Ultimate (Feedback)', steps: 3, baseUrl: '/umzugsofferten-v6?variant=v6a' },
  // V7 sub-variants
  'v7a': { name: 'V7a SwissMove (Feedback)', steps: 3, baseUrl: '/umzugsofferten-v7?variant=v7a' },
  // V8 sub-variants
  'v8a': { name: 'V8a Decision-Free (Feedback)', steps: 2, baseUrl: '/umzugsofferten-v8?variant=v8a' },
  // V9 sub-variants
  'v9a': { name: 'V9.a Gemini Archetyp', steps: 9, baseUrl: '/umzugsofferten?variant=v9a' },
  'v9b': { name: 'V9.b Gemini Variant', steps: 9, baseUrl: '/umzugsofferten?variant=v9b' },
  'v9c': { name: 'V9.c Gemini Variant', steps: 9, baseUrl: '/umzugsofferten?variant=v9c' },
  'v9d': { name: 'V9.d Gemini Variant', steps: 9, baseUrl: '/umzugsofferten?variant=v9d' },
  // Multi-variants
  'multi-a': { name: 'Multi.A Feedback Based', steps: 4, baseUrl: '/umzugsofferten?variant=multi-a' },
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

// Capture screenshot and return base64 for AI analysis
async function captureScreenshotBase64(url: string, device: 'desktop' | 'mobile'): Promise<Uint8Array | null> {
  if (!SCREENSHOTMACHINE_KEY) {
    console.log('No SCREENSHOTMACHINE_API_KEY, skipping screenshot');
    return null;
  }

  const dimension = device === 'desktop' ? '1920x1080' : '430x932';
  
  // Use the capture-screenshot edge function for better control
  const SUPABASE_URL_ENV = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_ROLE_KEY_ENV = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  try {
    // Call our own capture-screenshot function which has better settings
    console.log(`Calling capture-screenshot for ${url} (${device})...`);
    const response = await fetch(`${SUPABASE_URL_ENV}/functions/v1/capture-screenshot`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY_ENV}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        dimension: dimension,
        device: device,
        delay: 10000, // 10 seconds for SPA to fully render
        format: 'png',
        fullPage: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Screenshot API call failed for ${url}: ${response.status} - ${errorText}`);
      return null;
    }

    const result = await response.json();
    
    // The capture-screenshot function returns image as "image" field with data URL
    if (!result.success || !result.image) {
      console.error(`Screenshot failed - no image data for ${url}:`, JSON.stringify(result).substring(0, 200));
      return null;
    }
    
    // Extract base64 from data URL (format: "data:image/png;base64,...")
    const dataUrl = result.image;
    const base64Match = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
    if (!base64Match) {
      console.error(`Invalid image data URL format for ${url}`);
      return null;
    }
    
    const base64 = base64Match[1];
    
    // Convert base64 back to Uint8Array
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    console.log(`Screenshot captured for ${url} (${device}): ${bytes.length} bytes`);
    return bytes;
  } catch (error) {
    console.error('Screenshot error:', error);
    return null;
  }
}

// Upload screenshot to Supabase Storage and return public URL
async function uploadScreenshotToStorage(
  supabase: any,
  imageData: Uint8Array,
  flowId: string,
  runId: string,
  stepNumber: number,
  device: 'desktop' | 'mobile'
): Promise<string | null> {
  const fileName = `${flowId}/${runId}/step-${stepNumber}-${device}.png`;
  
  try {
    const { error: uploadError } = await supabase.storage
      .from('flow-screenshots')
      .upload(fileName, imageData, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error(`Storage upload failed for ${fileName}:`, uploadError);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('flow-screenshots')
      .getPublicUrl(fileName);

    console.log(`Screenshot uploaded: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('Storage upload error:', error);
    return null;
  }
}

// Convert Uint8Array to base64 data URL for AI analysis
function toBase64DataUrl(data: Uint8Array): string {
  // Ensure we pass a plain ArrayBuffer (not SharedArrayBuffer) to std/encoding/base64
  const copy = new Uint8Array(data);
  return `data:image/png;base64,${encodeBase64(copy.buffer)}`;
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

  // IMPROVED PROMPT: Focus on VISIBLE, VERIFIABLE issues only
  const prompt = `Du bist ein UX/Conversion-Experte. Analysiere Step ${stepNumber} "${stepName}" des Schweizer Umzugs-Flows "${flowName}".

**KRITISCHE REGELN - BEFOLGE DIESE STRIKT:**
1. Identifiziere NUR Issues die DIREKT IM SCREENSHOT SICHTBAR sind
2. KEINE VERMUTUNGEN oder theoretische Probleme - nur was du SEHEN kannst
3. KEINE DUPLIKATE - wenn ein Problem mehrere Elemente betrifft, fasse es zusammen
4. Sei REALISTISCH mit Scores - ein guter Flow hat 80-95, perfekt gibt es nicht

**BEWERTUNGSKRITERIEN (nur wenn im Screenshot erkennbar):**
- Mobile: Touch-Targets sichtbar zu klein (<44px geschätzt), horizontaler Scroll, unlesbarer Text
- Conversion: Fehlender Progress-Indikator, unklarer CTA, versteckter Button, zu viele Formularfelder
- UX: Schlechte visuelle Hierarchie, inkonsistentes Design, fehlende Feedback-Elemente

**SCORING-LOGIK:**
- Starte bei 90 Punkten pro Kategorie
- Kritisch: -15 Punkte | Warnung: -5 Punkte | Info: -2 Punkte
- Minimum: 40 | Maximum: 98
- Ein Flow OHNE sichtbare Probleme = 90-95 Punkte

**AUSGABE (NUR JSON):**
{
  "issues": [
    {
      "severity": "critical|warning|info",
      "category": "mobile|conversion|ux",
      "title": "Kurzer, spezifischer Titel",
      "description": "Was GENAU siehst du im Screenshot?",
      "recommendation": "Konkrete technische Lösung"
    }
  ],
  "suggestions": ["Max 3 Verbesserungsvorschläge"],
  "scores": {
    "mobile": 40-98,
    "conversion": 40-98,
    "ux": 40-98
  }
}

**WICHTIG:** Wenn du KEIN Problem siehst, gib eine leere issues-Liste zurück und hohe Scores (85-95).
Finde NICHT Probleme um des Findens willen. Qualität vor Quantität!`;

  try {
    const messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }> = [
      { role: 'system', content: 'Du bist ein pragmatischer UX-Experte. Identifiziere NUR REALE, SICHTBARE Probleme. Antworte im JSON-Format. Sei kritisch aber fair.' }
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
    
    // Robust JSON parsing
    let jsonContent = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }
    if (!jsonContent.startsWith('{')) {
      const firstBrace = jsonContent.indexOf('{');
      const lastBrace = jsonContent.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonContent = jsonContent.substring(firstBrace, lastBrace + 1);
      }
    }
    
    const parsed = JSON.parse(jsonContent);

    // Ensure scores are within valid range
    const clampScore = (score: number) => Math.max(40, Math.min(98, score || 75));

    return {
      stepNumber,
      stepName,
      issues: parsed.issues || [],
      suggestions: parsed.suggestions || [],
      scores: {
        mobile: clampScore(parsed.scores?.mobile),
        conversion: clampScore(parsed.scores?.conversion),
        ux: clampScore(parsed.scores?.ux)
      }
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      stepNumber,
      stepName,
      issues: [],
      suggestions: ['AI-Analyse fehlgeschlagen - manuell prüfen'],
      scores: { mobile: 70, conversion: 70, ux: 70 }
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

// Background analysis function - runs after response is sent
async function runAnalysisInBackground(
  supabase: any,
  flowId: string,
  flowConfig: { name: string; steps: number; baseUrl: string },
  runType: string,
  baseUrl: string,
  runId: string
): Promise<void> {
  try {
    console.log(`[Background] Starting analysis for flow: ${flowId}, run: ${runId}`);

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

    // Determine flow param for deterministic rendering
    const flowParam = flowId.replace('umzugsofferten-', '').replace('umzugsofferten', 'v1');
    
    for (let step = 1; step <= flowConfig.steps; step++) {
      const stepUrl = `${baseUrl}${flowConfig.baseUrl}?uc_capture=1&uc_step=${step}&uc_flow=${flowParam}&uc_cb=${Date.now()}`;
      const stepName = `Step ${step}`;

      console.log(`[Background] Analyzing step ${step}: ${stepUrl}`);

      // Capture screenshots as binary data
      const [desktopData, mobileData] = await Promise.all([
        captureScreenshotBase64(stepUrl, 'desktop'),
        captureScreenshotBase64(stepUrl, 'mobile')
      ]);

      console.log(`[Background] Screenshots captured - Desktop: ${desktopData ? 'yes' : 'no'}, Mobile: ${mobileData ? 'yes' : 'no'}`);

      // Convert to base64 for AI analysis
      const desktopBase64 = desktopData ? toBase64DataUrl(desktopData) : null;
      const mobileBase64 = mobileData ? toBase64DataUrl(mobileData) : null;

      // Analyze with AI
      const analysis = await analyzeStepWithAI(
        step,
        stepName,
        flowConfig.name,
        desktopBase64,
        mobileBase64
      );

      stepAnalyses.push(analysis);

      // Upload screenshots to Storage
      const [desktopUrl, mobileUrl] = await Promise.all([
        desktopData ? uploadScreenshotToStorage(supabase, desktopData, flowId, runId, step, 'desktop') : null,
        mobileData ? uploadScreenshotToStorage(supabase, mobileData, flowId, runId, step, 'mobile') : null
      ]);

      console.log(`[Background] Screenshots uploaded - Desktop: ${desktopUrl ? 'yes' : 'no'}, Mobile: ${mobileUrl ? 'yes' : 'no'}`);

      // Store step metrics
      await supabase.from('flow_step_metrics').insert({
        run_id: runId,
        flow_id: flowId,
        step_number: step,
        step_name: stepName,
        step_url: stepUrl,
        mobile_friendliness_score: analysis.scores.mobile,
        estimated_completion_rate: analysis.scores.conversion,
        desktop_screenshot_url: desktopUrl,
        mobile_screenshot_url: mobileUrl,
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
        .eq('id', runId);
    }

    // Store all issues
    if (allIssues.length > 0) {
      await supabase.from('flow_ux_issues').insert(
        allIssues.map(issue => ({
          run_id: runId,
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
        // Store counts for dashboards (so UIs don't need to compute from flow_ux_issues)
        metadata: {
          issuesCount: allIssues.length,
          criticalCount: criticalIssues,
        },
      })
      .eq('id', runId);

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

    console.log(`[Background] Analysis completed for ${flowId}: Score ${overallScore}/100, ${allIssues.length} issues`);

  } catch (error) {
    console.error(`[Background] Analysis failed for ${flowId}:`, error);
    
    // Update run with error status
    await supabase
      .from('flow_analysis_runs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      })
      .eq('id', runId);
  }
}

// Handle graceful shutdown
addEventListener('beforeunload', (ev: any) => {
  console.log(`[auto-analyze-flow] Shutdown due to: ${ev.detail?.reason || 'unknown'}`);
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { flowId, runType = 'manual', baseUrl = 'https://preview--umzugscheckv2.lovable.app' }: AnalysisRequest = await req.json();

    console.log(`Starting analysis for flow: ${flowId}`);

    // Validate flow
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

    // Create analysis run BEFORE starting background task
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

    console.log(`Created run: ${run.id} - starting background analysis`);

    // Start background analysis using EdgeRuntime.waitUntil
    // This allows us to return immediately while the analysis continues
    (globalThis as any).EdgeRuntime?.waitUntil?.(
      runAnalysisInBackground(supabase, flowId, flowConfig, runType, baseUrl, run.id)
    );

    // Return immediately with the run ID - client can poll for status
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Analysis started in background',
        runId: run.id,
        flowId,
        flowName: flowConfig.name,
        status: 'running',
        totalSteps: flowConfig.steps,
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
