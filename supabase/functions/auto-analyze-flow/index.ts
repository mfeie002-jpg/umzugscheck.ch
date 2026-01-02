import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as encodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Flow configurations - CLEAN LIST of actually existing flows
// Only includes flows that have real components in src/components/calculator-variants
const FLOW_CONFIGS: Record<string, { name: string; steps: number; baseUrl: string }> = {
  // === V1 - Control Flow (8 variants) ===
  'v1': { name: 'V1 Control (Baseline)', steps: 2, baseUrl: '/umzugsofferten?variant=v1' },
  'v1a': { name: 'V1a Control (Feedback)', steps: 2, baseUrl: '/umzugsofferten?variant=v1a' },
  'v1b': { name: 'V1b ChatGPT Agent', steps: 4, baseUrl: '/umzugsofferten?variant=v1b' },
  'v1c': { name: 'V1c Archetyp Strategic', steps: 4, baseUrl: '/umzugsofferten?variant=v1c' },
  'v1d': { name: 'V1d Optimized Funnel', steps: 4, baseUrl: '/umzugsofferten?variant=v1d' },
  'v1e': { name: 'V1e Trust Enhanced', steps: 4, baseUrl: '/umzugsofferten?variant=v1e' },
  'v1f': { name: 'V1f Sticky CTA + Trust', steps: 2, baseUrl: '/umzugsofferten?variant=v1f' },
  'v1g': { name: 'V1g Input UX + Validation', steps: 2, baseUrl: '/umzugsofferten?variant=v1g' },
  
  // === V2 - Premium Full-Journey (7 variants) ===
  'v2': { name: 'V2 Premium (Baseline)', steps: 4, baseUrl: '/umzugsofferten-v2' },
  'v2a': { name: 'V2a Progress Enhanced', steps: 4, baseUrl: '/umzugsofferten?variant=v2a' },
  'v2b': { name: 'V2b Simplified Labels', steps: 6, baseUrl: '/umzugsofferten?variant=v2b' },
  'v2c': { name: 'V2c Archetyp Calculator', steps: 6, baseUrl: '/umzugsofferten?variant=v2c' },
  'v2d': { name: 'V2d Speed Optimized', steps: 6, baseUrl: '/umzugsofferten?variant=v2d' },
  'v2e': { name: 'V2e Chat Funnel', steps: 6, baseUrl: '/umzugsofferten-v2e' },
  'v2f': { name: 'V2f Premium (Feedback)', steps: 3, baseUrl: '/umzugsofferten?variant=v2f' },
  
  // === V3 - God Mode Mobile-First (6 variants) ===
  'v3': { name: 'V3 God Mode (Baseline)', steps: 4, baseUrl: '/umzugsofferten-v3' },
  'v3a': { name: 'V3a Mobile First', steps: 4, baseUrl: '/umzugsofferten?variant=v3a' },
  'v3b': { name: 'V3b Swipe Navigation', steps: 4, baseUrl: '/umzugsofferten?variant=v3b' },
  'v3c': { name: 'V3c Bottom Sheet', steps: 4, baseUrl: '/umzugsofferten?variant=v3c' },
  'v3d': { name: 'V3d Thumb Zone', steps: 3, baseUrl: '/umzugsofferten?variant=v3d' },
  'v3e': { name: 'V3e Fullscreen', steps: 3, baseUrl: '/umzugsofferten?variant=v3e' },
  
  // === V4 - Video-First Conversion (7 variants) ===
  'v4': { name: 'V4 Video-First (Baseline)', steps: 4, baseUrl: '/umzugsofferten-v4' },
  'v4a': { name: 'V4a Urgency Based', steps: 4, baseUrl: '/umzugsofferten?variant=v4a' },
  'v4b': { name: 'V4b Social Proof', steps: 3, baseUrl: '/umzugsofferten?variant=v4b' },
  'v4c': { name: 'V4c Value First', steps: 3, baseUrl: '/umzugsofferten?variant=v4c' },
  'v4d': { name: 'V4d Gamified', steps: 4, baseUrl: '/umzugsofferten?variant=v4d' },
  'v4e': { name: 'V4e Minimal Friction', steps: 2, baseUrl: '/umzugsofferten?variant=v4e' },
  'v4f': { name: 'V4f Video-First Feedback', steps: 3, baseUrl: '/umzugsofferten?variant=v4f' },
  
  // === V5 - Marketplace Accessibility (7 variants) ===
  'v5': { name: 'V5 Marketplace (Baseline)', steps: 4, baseUrl: '/umzugsofferten-v5' },
  'v5a': { name: 'V5a High Contrast', steps: 4, baseUrl: '/umzugsofferten?variant=v5a' },
  'v5b': { name: 'V5b Screen Reader', steps: 3, baseUrl: '/umzugsofferten?variant=v5b' },
  'v5c': { name: 'V5c Keyboard Nav', steps: 3, baseUrl: '/umzugsofferten?variant=v5c' },
  'v5d': { name: 'V5d ChatGPT Feedback', steps: 5, baseUrl: '/umzugsofferten?variant=v5d' },
  'v5e': { name: 'V5e Reduced Motion', steps: 3, baseUrl: '/umzugsofferten?variant=v5e' },
  'v5f': { name: 'V5f Marketplace Feedback', steps: 3, baseUrl: '/umzugsofferten?variant=v5f' },
  
  // === V6 - Ultimate 6-Tier (7 variants) ===
  'v6': { name: 'V6 Ultimate (Baseline)', steps: 3, baseUrl: '/umzugsofferten-v6' },
  'v6a': { name: 'V6a Ultimate Optimized ⭐', steps: 3, baseUrl: '/umzugsofferten?variant=v6a' },
  'v6b': { name: 'V6b ChatGPT Feedback', steps: 5, baseUrl: '/umzugsofferten?variant=v6b' },
  'v6c': { name: 'V6c Gemini God Mode', steps: 6, baseUrl: '/umzugsofferten?variant=v6c' },
  'v6d': { name: 'V6d Deep Research', steps: 5, baseUrl: '/umzugsofferten?variant=v6d' },
  'v6e': { name: 'V6e Thinking Mode', steps: 5, baseUrl: '/umzugsofferten?variant=v6e' },
  'v6f': { name: 'V6f Ultimate (Best of All)', steps: 5, baseUrl: '/umzugsofferten?variant=v6f' },
  
  // === V7 - SwissMove 90s (2 variants) ===
  'v7': { name: 'V7 SwissMove (Baseline)', steps: 3, baseUrl: '/umzugsofferten-v7' },
  'v7a': { name: 'V7a SwissMove Feedback', steps: 3, baseUrl: '/umzugsofferten?variant=v7a' },
  
  // === V8 - Decision-Free (2 variants) ===
  'v8': { name: 'V8 Decision-Free (Baseline)', steps: 2, baseUrl: '/umzugsofferten-v8' },
  'v8a': { name: 'V8a Decision-Free Feedback', steps: 2, baseUrl: '/umzugsofferten?variant=v8a' },
  
  // === V9 - Zero Friction Extended (5 variants) ===
  'v9': { name: 'V9 Zero Friction (Baseline)', steps: 6, baseUrl: '/umzugsofferten-v9' },
  'v9a': { name: 'V9a Gemini Archetyp', steps: 6, baseUrl: '/umzugsofferten?variant=v9a' },
  'v9b': { name: 'V9b Gemini Agent', steps: 5, baseUrl: '/umzugsofferten?variant=v9b' },
  'v9c': { name: 'V9c Zero Friction Optimized', steps: 5, baseUrl: '/umzugsofferten?variant=v9c' },
  'v9d': { name: 'V9d Gemini Extended', steps: 9, baseUrl: '/umzugsofferten?variant=v9d' },
  
  // === Multi Variants (1 variant) ===
  'multi-a': { name: 'Multi.A ChatGPT Pro', steps: 3, baseUrl: '/umzugsofferten?variant=multi-a' },
  
  // === Ultimate (1 variant) ===
  'ultimate-v7': { name: 'Ultimate V7 (95/100)', steps: 5, baseUrl: '/umzugsofferten?variant=ultimate-v7' },
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

// Capture screenshot with retry logic - returns base64 for AI analysis
async function captureScreenshotBase64(url: string, device: 'desktop' | 'mobile', maxRetries = 3): Promise<Uint8Array | null> {
  if (!SCREENSHOTMACHINE_KEY) {
    console.log('No SCREENSHOTMACHINE_API_KEY, skipping screenshot');
    return null;
  }

  const dimension = device === 'desktop' ? '1920x1080' : '430x932';
  const SUPABASE_URL_ENV = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_ROLE_KEY_ENV = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Screenshot] Attempt ${attempt}/${maxRetries} for ${device}: ${url}`);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout
      
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
          delay: 12000, // 12 seconds for SPA to fully render
          format: 'png',
          fullPage: false
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Screenshot] API call failed (attempt ${attempt}): ${response.status} - ${errorText}`);
        if (attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 2000 * attempt)); // Exponential backoff
          continue;
        }
        return null;
      }

      const result = await response.json();
      
      if (!result.success || !result.image) {
        console.error(`[Screenshot] No image data (attempt ${attempt}):`, JSON.stringify(result).substring(0, 200));
        if (attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 2000 * attempt));
          continue;
        }
        return null;
      }
      
      // Extract base64 from data URL
      const dataUrl = result.image;
      const base64Match = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
      if (!base64Match) {
        console.error(`[Screenshot] Invalid data URL format (attempt ${attempt})`);
        if (attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 2000 * attempt));
          continue;
        }
        return null;
      }
      
      const base64 = base64Match[1];
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      console.log(`[Screenshot] SUCCESS ${device}: ${bytes.length} bytes`);
      return bytes;
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Screenshot] Error (attempt ${attempt}): ${errorMsg}`);
      
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 2000 * attempt));
        continue;
      }
      return null;
    }
  }
  
  return null;
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
      // Robust URL building (flowConfig.baseUrl may already contain query params like ?variant=v1d)
      const u = new URL(flowConfig.baseUrl, baseUrl);
      u.searchParams.set('uc_capture', '1');
      u.searchParams.set('uc_step', String(step));
      u.searchParams.set('uc_flow', flowParam);
      u.searchParams.set('uc_cb', String(Date.now()));
      const stepUrl = u.toString();
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
    
    // Trust score is derived from conversion signals (trust elements, social proof)
    // For now approximate as average of conversion and ux
    const avgTrust = Math.round((avgConversion * 0.6 + avgUx * 0.4));
    
    // Performance score - approximate based on mobile responsiveness
    const avgPerformance = Math.round((avgMobile * 0.7 + avgUx * 0.3));
    
    const overallScore = Math.round((avgMobile + avgConversion + avgUx + avgTrust) / 4);

    // Calculate critical issues count before using it
    const criticalIssues = allIssues.filter(i => i.severity === 'critical').length;

    // Update run with results - NOW INCLUDING mobile_score and trust_score
    await supabase
      .from('flow_analysis_runs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        overall_score: overallScore,
        conversion_score: avgConversion,
        mobile_score: avgMobile,           // FIXED: Now setting mobile_score
        trust_score: avgTrust,             // FIXED: Now setting trust_score
        performance_score: avgPerformance,
        ux_score: avgUx,
        ai_summary: summary,
        ai_recommendations: recommendations,
        metadata: {
          issuesCount: allIssues.length,
          criticalCount: criticalIssues,
        },
      })
      .eq('id', runId);

    // Check for alerts
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
    const { flowId: rawFlowId, runType = 'manual', baseUrl = 'https://preview--umzugscheckv2.lovable.app' }: AnalysisRequest = await req.json();

    console.log(`Starting analysis for flow: ${rawFlowId}`);

    // Normalize flow ID: strip "umzugsofferten-" prefix if present
    const normalizedFlowId = rawFlowId
      .replace(/^umzugsofferten-/, '')
      .replace(/^umzugsofferten$/, 'v1');
    
    console.log(`Normalized flow ID: ${rawFlowId} -> ${normalizedFlowId}`);

    // Validate flow - check FLOW_CONFIGS first
    let flowConfig = FLOW_CONFIGS[normalizedFlowId];
    let resolvedFlowId = normalizedFlowId;
    
    // If not found, check if it's a flow_feedback_variant (Ultimate Flow)
    if (!flowConfig) {
      console.log(`Flow "${normalizedFlowId}" not in FLOW_CONFIGS, checking flow_feedback_variants...`);
      
      // Check if this is a generated Ultimate Flow variant
      const { data: variant } = await supabase
        .from('flow_feedback_variants')
        .select('flow_id, variant_name')
        .eq('variant_label', normalizedFlowId)
        .single();
      
      if (variant && variant.flow_id) {
        // Map to the base flow (e.g., "v1" from "ultimate-v1-swiss-archetype")
        const baseFlowId = variant.flow_id;
        flowConfig = FLOW_CONFIGS[baseFlowId];
        resolvedFlowId = baseFlowId;
        console.log(`Resolved Ultimate variant "${normalizedFlowId}" to base flow "${baseFlowId}"`);
      }
    }
    
    if (!flowConfig) {
      console.error(`Unknown flow ID: ${normalizedFlowId}. Available: ${Object.keys(FLOW_CONFIGS).join(', ')}`);
      return new Response(
        JSON.stringify({ 
          error: `Unknown flow: ${rawFlowId}`,
          available: Object.keys(FLOW_CONFIGS)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Flow config found: ${flowConfig.name} with ${flowConfig.steps} steps`);

    // Create analysis run BEFORE starting background task
    // Store both the original flowId (for display) and resolvedFlowId (for analysis)
    const { data: run, error: runError } = await supabase
      .from('flow_analysis_runs')
      .insert({
        flow_id: normalizedFlowId, // Use normalized ID for tracking
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

    console.log(`Created run: ${run.id} - starting background analysis for resolved flow: ${resolvedFlowId}`);

    // Start background analysis.
    // IMPORTANT: Some runtimes expose EdgeRuntime as a global (not necessarily on globalThis).
    // If EdgeRuntime.waitUntil is unavailable, we fall back to running the analysis in-request
    // to avoid "stuck forever" runs.
    const bgPromise = runAnalysisInBackground(
      supabase,
      resolvedFlowId,
      flowConfig,
      runType,
      baseUrl,
      run.id
    );

    let scheduledInBackground = false;
    try {
      // @ts-ignore
      if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime?.waitUntil) {
        // @ts-ignore
        EdgeRuntime.waitUntil(bgPromise);
        scheduledInBackground = true;
        console.log('Background task scheduled via EdgeRuntime.waitUntil');
      }
    } catch (e) {
      console.error('EdgeRuntime.waitUntil scheduling failed:', e);
    }

    if (!scheduledInBackground) {
      console.warn('EdgeRuntime.waitUntil not available; running analysis synchronously.');
      await bgPromise;
    }

    // Return immediately with the run ID - client can poll for status
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Analysis started in background',
        runId: run.id,
        flowId: normalizedFlowId,
        originalFlowId: rawFlowId,
        resolvedFlowId,
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
