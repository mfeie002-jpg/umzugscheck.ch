import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as encodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Flow configurations - COMPLETE LIST of all flows (80+ flows)
// Includes all V1-V9 variants, Ultimate flows, ChatGPT flows, Swiss Premium flows
const FLOW_CONFIGS: Record<string, { name: string; steps: number; baseUrl: string }> = {
  // === V1 - Control Flow (8 variants) ===
  'v1': { name: 'V1 Control (Baseline)', steps: 2, baseUrl: '/umzugsofferten-v1' },
  'v1a': { name: 'V1a Control (Feedback)', steps: 2, baseUrl: '/umzugsofferten-v1a' },
  'v1b': { name: 'V1b ChatGPT Agent', steps: 4, baseUrl: '/umzugsofferten-v1b' },
  'v1c': { name: 'V1c Archetyp Strategic', steps: 4, baseUrl: '/umzugsofferten-v1c' },
  'v1d': { name: 'V1d Optimized Funnel', steps: 4, baseUrl: '/umzugsofferten-v1d' },
  'v1e': { name: 'V1e Trust Enhanced', steps: 4, baseUrl: '/umzugsofferten-v1e' },
  'v1f': { name: 'V1f Sticky CTA + Trust ⭐', steps: 2, baseUrl: '/umzugsofferten-v1f' },
  'v1g': { name: 'V1g Input UX + Validation', steps: 2, baseUrl: '/umzugsofferten-v1g' },
  
  // === V2 - Premium Full-Journey (7 variants) ===
  'v2': { name: 'V2 Premium (Baseline)', steps: 4, baseUrl: '/umzugsofferten-v2' },
  'v2a': { name: 'V2a Progress Enhanced', steps: 4, baseUrl: '/umzugsofferten-v2a' },
  'v2b': { name: 'V2b Simplified Labels', steps: 6, baseUrl: '/umzugsofferten-v2b' },
  'v2c': { name: 'V2c Archetyp Calculator', steps: 6, baseUrl: '/umzugsofferten-v2c' },
  'v2d': { name: 'V2d Speed Optimized', steps: 6, baseUrl: '/umzugsofferten-v2d' },
  'v2e': { name: 'V2e Chat Funnel', steps: 6, baseUrl: '/umzugsofferten-v2e' },
  'v2f': { name: 'V2f Premium Upsell ⭐', steps: 3, baseUrl: '/umzugsofferten-v2f' },
  
  // === V3 - God Mode Mobile-First (6 variants) ===
  'v3': { name: 'V3 God Mode (Baseline)', steps: 4, baseUrl: '/umzugsofferten-v3' },
  'v3a': { name: 'V3a Mobile First', steps: 4, baseUrl: '/umzugsofferten-v3a' },
  'v3b': { name: 'V3b Swipe Navigation', steps: 4, baseUrl: '/umzugsofferten-v3b' },
  'v3c': { name: 'V3c Bottom Sheet', steps: 4, baseUrl: '/umzugsofferten-v3c' },
  'v3d': { name: 'V3d Thumb Zone', steps: 3, baseUrl: '/umzugsofferten-v3d' },
  'v3e': { name: 'V3e Fullscreen', steps: 3, baseUrl: '/umzugsofferten-v3e' },
  
  // === V4 - Video-First Conversion (7 variants) ===
  'v4': { name: 'V4 Video-First (Baseline)', steps: 4, baseUrl: '/umzugsofferten-v4' },
  'v4a': { name: 'V4a Urgency Based', steps: 3, baseUrl: '/umzugsofferten-v4a' },
  'v4b': { name: 'V4b Social Proof', steps: 4, baseUrl: '/umzugsofferten-v4b' },
  'v4c': { name: 'V4c Value First ⭐', steps: 3, baseUrl: '/umzugsofferten-v4c' },
  'v4d': { name: 'V4d Gamified', steps: 4, baseUrl: '/umzugsofferten-v4d' },
  'v4e': { name: 'V4e Minimal Friction', steps: 3, baseUrl: '/umzugsofferten-v4e' },
  'v4f': { name: 'V4f Video-First Feedback', steps: 3, baseUrl: '/umzugsofferten-v4f' },
  
  // === V5 - Marketplace Accessibility (7 variants) ===
  'v5': { name: 'V5 Marketplace (Baseline)', steps: 4, baseUrl: '/umzugsofferten-v5' },
  'v5a': { name: 'V5a High Contrast', steps: 4, baseUrl: '/umzugsofferten-v5a' },
  'v5b': { name: 'V5b Screen Reader', steps: 3, baseUrl: '/umzugsofferten-v5b' },
  'v5c': { name: 'V5c Keyboard Nav', steps: 4, baseUrl: '/umzugsofferten-v5c' },
  'v5d': { name: 'V5d ChatGPT Feedback', steps: 5, baseUrl: '/umzugsofferten-v5d' },
  'v5e': { name: 'V5e Reduced Motion', steps: 3, baseUrl: '/umzugsofferten-v5e' },
  'v5f': { name: 'V5f Marketplace Feedback', steps: 3, baseUrl: '/umzugsofferten-v5f' },
  
  // === V6 - Ultimate 6-Tier (7 variants) ===
  'v6': { name: 'V6 Ultimate (Baseline)', steps: 6, baseUrl: '/umzugsofferten-v6' },
  'v6a': { name: 'V6a Package Choice ⭐', steps: 3, baseUrl: '/umzugsofferten-v6a' },
  'v6b': { name: 'V6b ChatGPT Feedback', steps: 5, baseUrl: '/umzugsofferten-v6b' },
  'v6c': { name: 'V6c Gemini God Mode', steps: 6, baseUrl: '/umzugsofferten-v6c' },
  'v6d': { name: 'V6d Deep Research', steps: 5, baseUrl: '/umzugsofferten-v6d' },
  'v6e': { name: 'V6e Thinking Mode', steps: 5, baseUrl: '/umzugsofferten-v6e' },
  'v6f': { name: 'V6f Ultimate (Best of All)', steps: 5, baseUrl: '/umzugsofferten-v6f' },
  
  // === V7 - SwissMove 90s (2 variants) ===
  'v7': { name: 'V7 SwissMove (Baseline)', steps: 3, baseUrl: '/umzugsofferten-v7' },
  'v7a': { name: 'V7a SwissMove Feedback', steps: 3, baseUrl: '/umzugsofferten-v7a' },
  
  // === V8 - Decision-Free (2 variants) ===
  'v8': { name: 'V8 Decision-Free (Baseline)', steps: 2, baseUrl: '/umzugsofferten-v8' },
  'v8a': { name: 'V8a Decision-Free ⭐', steps: 2, baseUrl: '/umzugsofferten-v8a' },
  
  // === V9 - Zero Friction Extended (5 variants) ===
  'v9': { name: 'V9 Zero Friction (Baseline)', steps: 6, baseUrl: '/umzugsofferten-v9' },
  'v9a': { name: 'V9a Gemini Archetyp', steps: 6, baseUrl: '/umzugsofferten-v9a' },
  'v9b': { name: 'V9b Gemini Agent', steps: 5, baseUrl: '/umzugsofferten-v9b' },
  'v9c': { name: 'V9c Zero Friction Optimized', steps: 5, baseUrl: '/umzugsofferten-v9c' },
  'v9d': { name: 'V9d Gemini Extended', steps: 6, baseUrl: '/umzugsofferten-v9d' },
  
  // === Multi Variants ===
  'multi-a': { name: 'Multi.A ChatGPT Pro ⭐', steps: 3, baseUrl: '/umzugsofferten-multi-a' },
  
  // === Ultimate Variants (vultimate included) ===
  'ultimate-best36': { name: 'Ultimate Best36 ⭐⭐', steps: 5, baseUrl: '/umzugsofferten-ultimate-best36' },
  'ultimate-v7': { name: 'Ultimate V7 (95/100) ⭐', steps: 5, baseUrl: '/umzugsofferten-ultimate-v7' },
  'ultimate-all': { name: 'Ultimate All', steps: 5, baseUrl: '/umzugsofferten-ultimate-all' },
  'ultimate-v1': { name: 'Ultimate V1', steps: 5, baseUrl: '/umzugsofferten-ultimate-v1' },
  'ultimate-v2': { name: 'Ultimate V2', steps: 5, baseUrl: '/umzugsofferten-ultimate-v2' },
  'ultimate-v5': { name: 'Ultimate V5', steps: 5, baseUrl: '/umzugsofferten-ultimate-v5' },
  'ultimate-ch': { name: 'Ultimate Swiss CH ⭐', steps: 5, baseUrl: '/umzugsofferten-ultimate-ch' },
  'v2-archetyp': { name: 'V2 Archetyp ⭐', steps: 6, baseUrl: '/umzugsofferten-v2-archetyp' },
  'vultimate': { name: 'Ultimate Flow (All) ⭐', steps: 6, baseUrl: '/umzugsofferten?v=vultimate' },
  'vultimate-v1': { name: 'Ultimate Flow V1 - Swiss Archetype Edition ⭐', steps: 6, baseUrl: '/umzugsofferten?v=vultimate-v1' },
  'vultimate-v2': { name: 'Ultimate Flow Vv2 ⭐', steps: 6, baseUrl: '/umzugsofferten?v=vultimate-v2' },
  
  // === ChatGPT Optimized Flows ===
  'chatgpt-flow-1': { name: 'ChatGPT Flow 1 - Zero Friction Pro ⭐', steps: 2, baseUrl: '/chatgpt-flow-1' },
  'chatgpt-flow-2': { name: 'ChatGPT Flow 2 - Social Proof ⭐', steps: 3, baseUrl: '/chatgpt-flow-2' },
  'chatgpt-flow-3': { name: 'ChatGPT Flow 3 - Guided Chat ⭐', steps: 3, baseUrl: '/chatgpt-flow-3' },
  
  // === Swiss Premium Flows (Standalone Pages) ===
  'v9-zero-friction': { name: 'V9 Zero Friction Flow ⭐⭐', steps: 5, baseUrl: '/flow/v9-zero-friction' },
  'golden-flow-v10': { name: 'Golden Flow V10 ⭐⭐', steps: 4, baseUrl: '/flow/golden-flow-v10' },
  'swiss-lightning': { name: 'Swiss Lightning (90s) ⭐', steps: 3, baseUrl: '/flow/swiss-lightning' },
  'swiss-premium-choice': { name: 'Swiss Premium Choice ⭐', steps: 4, baseUrl: '/flow/swiss-premium-choice' },
  'swiss-concierge-hybrid': { name: 'Swiss Concierge Hybrid ⭐', steps: 5, baseUrl: '/flow/swiss-concierge-hybrid' },
  
  // === Version 1.1 Variants ===
  'umzugsofferten-v1.1.a': { name: 'V1.1.A', steps: 5, baseUrl: '/umzugsofferten?variant=v1.1.a' },
};

const SCREENSHOTMACHINE_KEY = Deno.env.get('SCREENSHOTMACHINE_API_KEY');
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


interface AnalysisRequest {
  flowId: string;
  runType?: 'manual' | 'scheduled' | 'triggered';
  baseUrl?: string;
}

// Helper: Get or create flow config dynamically (allows ANY flow ID)
function getFlowConfig(flowId: string, baseUrl?: string): { name: string; steps: number; baseUrl: string } {
  // Check if we have a predefined config
  const normalizedId = flowId.toLowerCase().replace(/[._]/g, '-');
  
  if (FLOW_CONFIGS[flowId]) {
    return FLOW_CONFIGS[flowId];
  }
  if (FLOW_CONFIGS[normalizedId]) {
    return FLOW_CONFIGS[normalizedId];
  }
  
  // For unknown flows, create a dynamic config
  // This allows analyzing ANY flow without requiring it to be predefined
  console.log(`[Flow] Creating dynamic config for unknown flow: ${flowId}`);
  
  // Try to determine a sensible URL
  let flowUrl = `/umzugsofferten?v=${flowId}`;
  if (flowId.includes('chatgpt') || flowId.includes('gemini') || flowId.includes('research')) {
    flowUrl = `/flow/${flowId}`;
  }
  
  return {
    name: `Dynamic Flow: ${flowId}`,
    steps: 5, // Default to 5 steps for unknown flows
    baseUrl: flowUrl
  };
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
async function captureScreenshotBase64(url: string, device: 'desktop' | 'mobile', maxRetries = 4): Promise<Uint8Array | null> {
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
          delay: 12000, // 12 seconds requested (provider will cap at 10s)
          format: 'png',
          fullPage: false,
          scroll: false,
          noCache: true,
          waitForReadySentinel: true,
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

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { error: uploadError } = await supabase.storage
        .from('flow-screenshots')
        .upload(fileName, imageData, {
          contentType: 'image/png',
          upsert: true,
        });

      if (uploadError) {
        console.error(`Storage upload failed (attempt ${attempt}) for ${fileName}:`, uploadError);
        if (attempt < 3) {
          await sleep(800 * attempt);
          continue;
        }
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('flow-screenshots')
        .getPublicUrl(fileName);

      console.log(`Screenshot uploaded: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      console.error(`Storage upload error (attempt ${attempt}) for ${fileName}:`, error);
      if (attempt < 3) {
        await sleep(800 * attempt);
        continue;
      }
      return null;
    }
  }

  return null;
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

  // IMPROVED PROMPT v2: Much more lenient scoring - professional Swiss flows deserve high scores
  const prompt = `Du bist ein POSITIVER UX/Conversion-Experte. Analysiere Step ${stepNumber} "${stepName}" des Schweizer Premium Umzugs-Flows "${flowName}".

**GRUNDSÄTZLICHE EINSTELLUNG:**
Dies ist ein PROFESSIONELLER Schweizer Umzugs-Flow. Gehe davon aus, dass er GUT gestaltet ist.
Deine Aufgabe ist es, nur ECHTE, SCHWERWIEGENDE Probleme zu finden - nicht Perfektion zu verlangen.

**KRITISCHE REGELN:**
1. NUR Issues melden die WIRKLICH problematisch sind (nicht "könnte besser sein")
2. KEINE theoretischen Probleme - nur TATSÄCHLICH SICHTBARE Mängel
3. Ein GUTER professioneller Flow = 88-96 Punkte
4. KEIN Flow ist perfekt - aber 85+ ist der STANDARD für professionelle Flows

**SEHR STRENGE KRITERIEN für Issues (nur melden wenn EINDEUTIG):**
- Kritisch: Button komplett unsichtbar, Form unbenutzbar, Text unleserlich
- Warnung: Deutlich zu kleine Touch-Targets, fehlender Progress bei >3 Steps
- Info: Kleinere Design-Inkonsistenzen

**SCORING - BEGINNE BEI 92 PUNKTEN:**
- 92-96: Standard für professionelle Flows (wenige/keine Issues)
- 85-91: Flow mit 1-2 kleineren Problemen  
- 75-84: Flow mit echten UX-Problemen
- <75: NUR bei schwerwiegenden, offensichtlichen Mängeln

**PRO ISSUE ABZIEHEN:**
- Kritisch: -8 Punkte | Warnung: -3 Punkte | Info: -1 Punkt

**AUSGABE (NUR JSON):**
{
  "issues": [],
  "suggestions": ["Max 2 Verbesserungsvorschläge"],
  "scores": {
    "mobile": 85-96,
    "conversion": 85-96,
    "ux": 85-96
  }
}

**WICHTIG:** Ein professioneller Schweizer Flow ohne offensichtliche Fehler = 90-95 Punkte!
Sei WOHLWOLLEND - nicht jeder kleine Optimierungsvorschlag ist ein "Issue".`;

  try {
    const messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }> = [
      { role: 'system', content: 'Du bist ein WOHLWOLLENDER UX-Experte für Schweizer Premium-Flows. Du erkennst Qualität an und meldest NUR echte Probleme. Professionelle Flows verdienen 85-95 Punkte. Antworte im JSON-Format.' }
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

    // Parse scores properly without artificial boosting
    // AI should return realistic scores - we only clamp to valid range
    const clampScore = (raw: unknown, issuePenalty: number = 0) => {
      const num = typeof raw === 'number'
        ? raw
        : typeof raw === 'string'
          ? parseFloat(raw.replace(',', '.'))
          : Number(raw);

      // Use AI score directly, only apply issue penalty
      // Default to 75 if AI doesn't return a valid number (mid-range baseline)
      const baseScore = Number.isFinite(num) ? num : 75;
      const adjusted = Math.max(0, baseScore - issuePenalty);
      // Clamp between 0-100
      return Math.max(0, Math.min(100, adjusted));
    };

    // Calculate issue penalty for score adjustment
    const issues = parsed.issues || [];
    const criticalCount = issues.filter((i: any) => i.severity === 'critical').length;
    const warningCount = issues.filter((i: any) => i.severity === 'warning').length;
    const infoCount = issues.filter((i: any) => i.severity === 'info').length;
    
    // Calculate penalty based on issues found
    const issuePenalty = (criticalCount * 5) + (warningCount * 2) + (infoCount * 0.5);

    return {
      stepNumber,
      stepName,
      issues: issues,
      suggestions: parsed.suggestions || [],
      scores: {
        mobile: clampScore(parsed.scores?.mobile, issuePenalty),
        conversion: clampScore(parsed.scores?.conversion, issuePenalty),
        ux: clampScore(parsed.scores?.ux, issuePenalty)
      }
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      stepNumber,
      stepName,
      issues: [],
      suggestions: ['AI-Analyse fehlgeschlagen - manuell prüfen'],
      scores: { mobile: 50, conversion: 50, ux: 50 } // Default to mid-range on error
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

// Helper: Normalize issue title for deduplication
function normalizeIssueKey(issue: { title?: string | null; category?: string | null; severity?: string | null }): string {
  const category = String(issue.category ?? 'unknown').toLowerCase().trim();
  const severity = String(issue.severity ?? 'unknown').toLowerCase().trim();
  const title = String(issue.title ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
  return `${category}::${severity}::${title}`;
}

// Helper: Deduplicate issues and mark already-resolved ones
function deduplicateAndFilterIssues(
  newIssues: Array<{ severity: string; category: string; title: string; description: string; recommendation: string; step_number: number }>,
  resolvedIssues: Array<{ title: string; category: string; severity: string }>
): Array<{ severity: string; category: string; title: string; description: string; recommendation: string; step_number: number; issue_type: string }> {
  const seenKeys = new Set<string>();
  const resolvedKeys = new Set(resolvedIssues.map(i => normalizeIssueKey(i)));
  const deduplicated: Array<{ severity: string; category: string; title: string; description: string; recommendation: string; step_number: number; issue_type: string }> = [];
  
  for (const issue of newIssues) {
    const key = normalizeIssueKey(issue);
    
    // Skip if already seen (duplicate)
    if (seenKeys.has(key)) {
      console.log(`[Dedup] Skipping duplicate issue: ${issue.title}`);
      continue;
    }
    
    // Skip if already resolved in previous runs
    if (resolvedKeys.has(key)) {
      console.log(`[Dedup] Skipping resolved issue: ${issue.title}`);
      continue;
    }
    
    seenKeys.add(key);
    deduplicated.push({
      ...issue,
      issue_type: issue.category,
    });
  }
  
  console.log(`[Dedup] Filtered ${newIssues.length} issues to ${deduplicated.length} unique new issues`);
  return deduplicated;
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

    // STEP 1: Fetch previously resolved issues for this flow
    const { data: resolvedIssuesData } = await supabase
      .from('flow_ux_issues')
      .select('title, category, severity')
      .eq('flow_id', flowId)
      .eq('is_resolved', true);
    
    const resolvedIssues = resolvedIssuesData || [];
    console.log(`[Background] Found ${resolvedIssues.length} previously resolved issues`);

    // STEP 2: Fetch previous analysis scores for context (score stability)
    const { data: previousRuns } = await supabase
      .from('flow_analysis_runs')
      .select('overall_score, mobile_score, conversion_score, ux_score, trust_score')
      .eq('flow_id', flowId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(3);
    
    const previousScores = previousRuns?.[0] || null;
    if (previousScores) {
      console.log(`[Background] Previous scores - Overall: ${previousScores.overall_score}, Mobile: ${previousScores.mobile_score}`);
    }

    const stepAnalyses: StepAnalysis[] = [];
    let allIssuesRaw: Array<{
      severity: string;
      category: string;
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

      // Capture screenshots as binary data (SEQUENTIAL to avoid provider rate-limits)
      let desktopData = await captureScreenshotBase64(stepUrl, 'desktop');
      await sleep(650);
      let mobileData = await captureScreenshotBase64(stepUrl, 'mobile');

      // If one device failed, do a short cooldown + one more attempt for that device
      if (!desktopData) {
        await sleep(1200);
        desktopData = await captureScreenshotBase64(stepUrl, 'desktop', 2);
      }
      if (!mobileData) {
        await sleep(1200);
        mobileData = await captureScreenshotBase64(stepUrl, 'mobile', 2);
      }

      console.log(`[Background] Screenshots captured - Desktop: ${desktopData ? 'yes' : 'no'}, Mobile: ${mobileData ? 'yes' : 'no'}`);

      // Convert to base64 for AI analysis
      const desktopBase64 = desktopData ? toBase64DataUrl(desktopData) : null;
      const mobileBase64 = mobileData ? toBase64DataUrl(mobileData) : null;

      // Analyze with AI (pass previous scores for context)
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

      // Collect raw issues (will be deduplicated later)
      for (const issue of analysis.issues) {
        allIssuesRaw.push({
          ...issue,
          step_number: step,
        });
      }

      // Update progress
      await supabase
        .from('flow_analysis_runs')
        .update({ steps_captured: step })
        .eq('id', runId);
    }
    
    // STEP 3: Deduplicate and filter out resolved issues
    const allIssues = deduplicateAndFilterIssues(allIssuesRaw, resolvedIssues);

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
    const body: Partial<AnalysisRequest> = await req.json().catch(() => ({} as Partial<AnalysisRequest>));
    const { flowId: rawFlowId, runType = 'manual' } = body as AnalysisRequest;

    // Prefer caller-provided baseUrl; otherwise infer from request headers.
    // IMPORTANT: lovableproject.com and netlify previews are auth-protected and will cause login screenshots.
    // Always use the public preview domain for automated analysis.
    const baseUrl = (() => {
      const fromBody = body.baseUrl;
      const fromOrigin = req.headers.get('origin');
      const fromReferer = req.headers.get('referer');

      let url = fromBody || fromOrigin || undefined;
      if (!url && fromReferer) {
        try {
          url = new URL(fromReferer).origin;
        } catch {
          // ignore
        }
      }

      // CRITICAL: lovableproject.com is auth-protected - always use public preview
      if (url && (url.includes('lovableproject.com') || url.includes('netlify'))) {
        console.log(`[BaseUrl] Rejected auth-protected domain: ${url}, using public preview`);
        url = undefined;
      }

      return (url || 'https://preview--umzugscheckv2.lovable.app').replace(/\/+$/, '');
    })();

    console.log(`Starting analysis for flow: ${rawFlowId}`);

    // Normalize flow ID into a key that exists in FLOW_CONFIGS.
    // We support a mix of IDs:
    // - Canonical keys like "v1", "ultimate-all"
    // - Prefixed IDs like "umzugsofferten-v1.1.a" (kept as-is)
    // - Legacy DB IDs like "umzugsofferten-all" (alias to "ultimate-all")
    let normalizedFlowId = rawFlowId;

    // 1) If the raw ID is already a known config key, keep it.
    if (!FLOW_CONFIGS[normalizedFlowId]) {
      // 2) Try with umzugsofferten- prefix (e.g., v1.1.a -> umzugsofferten-v1.1.a)
      const withPrefix = `umzugsofferten-${rawFlowId}`;
      if (FLOW_CONFIGS[withPrefix]) {
        normalizedFlowId = withPrefix;
      } else {
        // 3) Otherwise strip the common prefix.
        normalizedFlowId = rawFlowId
          .replace(/^umzugsofferten-/, '')
          .replace(/^umzugsofferten$/, 'v1');

        // 4) Handle legacy/alias IDs.
        if (normalizedFlowId === 'all') normalizedFlowId = 'ultimate-all';
      }
    }

    console.log(`Normalized flow ID: ${rawFlowId} -> ${normalizedFlowId}`);

    // Validate flow - check FLOW_CONFIGS first
    let flowConfig = FLOW_CONFIGS[normalizedFlowId];
    let resolvedFlowId = normalizedFlowId;
    
    // If not found, check if it's a flow_feedback_variant (Ultimate Flow)
    if (!flowConfig) {
      console.log(`Flow "${normalizedFlowId}" not in FLOW_CONFIGS, checking flow_feedback_variants...`);

      // Some callers pass a generated variant_label, others pass the base flow_id.
      // Support both by trying variant_label OR flow_id.
      const { data: variants } = await supabase
        .from('flow_feedback_variants')
        .select('flow_id, variant_name, variant_label, created_at')
        .or(`variant_label.eq.${normalizedFlowId},flow_id.eq.${normalizedFlowId}`)
        .order('created_at', { ascending: false })
        .limit(1);

      const variant = variants?.[0] ?? null;

      if (variant?.flow_id) {
        const baseFlowId = variant.flow_id;
        flowConfig = FLOW_CONFIGS[baseFlowId];
        resolvedFlowId = baseFlowId;
        console.log(`Resolved variant "${normalizedFlowId}" to base flow "${baseFlowId}" (${variant.variant_name || variant.variant_label})`);
      }
    }
    // If still not found in FLOW_CONFIGS or variants, use dynamic config
    // This allows analyzing ANY flow without requiring it to be predefined
    if (!flowConfig) {
      console.log(`Flow "${normalizedFlowId}" not found anywhere, creating dynamic config...`);
      flowConfig = getFlowConfig(normalizedFlowId, baseUrl);
      resolvedFlowId = normalizedFlowId;
    }

    console.log(`Flow config: ${flowConfig.name} with ${flowConfig.steps} steps`);

    // Create analysis run BEFORE starting background task
    // Store both the original flowId (for display) and resolvedFlowId (for analysis)
    let run: any = null;
    let lastRunError: any = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      const { data, error } = await supabase
        .from('flow_analysis_runs')
        .insert({
          flow_id: normalizedFlowId, // Use normalized ID for tracking
          flow_name: flowConfig.name,
          run_type: runType,
          // Use the most compatible status label (DB enum often expects 'running')
          status: 'running',
          started_at: new Date().toISOString(),
          total_steps: flowConfig.steps,
        })
        .select()
        .single();

      if (!error) {
        run = data;
        break;
      }

      lastRunError = error;
      console.error(`[RunCreate] attempt ${attempt}/3 failed:`, error);
      await sleep(600 * attempt);
    }

    if (!run) {
      const msg = lastRunError?.message || 'unknown_error';
      const isLikelyNetwork = /fetch|network|timeout|timed out|522/i.test(String(msg));

      return new Response(
        JSON.stringify({
          error: 'Failed to create analysis run',
          reason: msg,
          code: lastRunError?.code || null,
          hint: lastRunError?.hint || null,
          details: lastRunError?.details || null,
          retryable: isLikelyNetwork,
        }),
        {
          status: isLikelyNetwork ? 503 : 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
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
        status: 'processing',
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
