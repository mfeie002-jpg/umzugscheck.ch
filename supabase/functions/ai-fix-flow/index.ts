import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface FixRequest {
  flowId: string;
  flowName: string;
  analysis: {
    overallScore: number;
    categoryScores: Record<string, number>;
    strengths: string[];
    weaknesses: string[];
    conversionKillers: string[];
    quickWins: string[];
    elements?: Array<{
      elementType: string;
      elementName: string;
      issues: Array<{
        severity: string;
        description: string;
        recommendation: string;
      }>;
    }>;
  };
  targetScore?: number; // Target score to achieve (default 95+)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const body: FixRequest = await req.json();
    const { flowId, flowName, analysis, targetScore = 95 } = body;

    console.log(`[AI Fix Flow] Starting fix for ${flowId} (${flowName}), target: ${targetScore}+`);

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build comprehensive prompt based on analysis
    const issuesSummary = analysis.elements?.flatMap(el => 
      el.issues.map(issue => `- [${issue.severity.toUpperCase()}] ${el.elementName}: ${issue.description} → ${issue.recommendation}`)
    ).join('\n') || 'No element-level issues provided';

    const prompt = `Du bist ein Elite UX/Conversion-Architekt mit Award-Level Output.

ANALYSE DES FLOWS "${flowName}" (ID: ${flowId}):
- Aktueller Score: ${analysis.overallScore}/100
- Ziel-Score: ${targetScore}+/100

CATEGORY SCORES:
${Object.entries(analysis.categoryScores).map(([k, v]) => `- ${k}: ${v}/100`).join('\n')}

STÄRKEN (beibehalten):
${analysis.strengths.map(s => `✓ ${s}`).join('\n')}

SCHWÄCHEN (beheben):
${analysis.weaknesses.map(w => `✗ ${w}`).join('\n')}

CONVERSION KILLERS (kritisch):
${analysis.conversionKillers.map(ck => `🚨 ${ck}`).join('\n')}

QUICK WINS (sofort umsetzbar):
${analysis.quickWins.map(qw => `⚡ ${qw}`).join('\n')}

ELEMENT-LEVEL ISSUES:
${issuesSummary}

## DEIN AUFTRAG:

Erstelle einen VOLLSTÄNDIG OPTIMIERTEN Flow, der:
1. ALLE Schwächen behebt
2. ALLE Quick Wins implementiert
3. ALLE Conversion Killers eliminiert
4. Score von ${targetScore}+ erreicht
5. Swiss Market Best Practices befolgt (ASTAG, Zügeltage, Abnahmegarantie)
6. Archetypzentriert für: Sicherheits-Sucher, Effizienz-Maximierer, Preis-Jäger, Chaos-Manager

Antworte im JSON-Format:
{
  "optimizedFlow": {
    "name": "Optimierter Flow Name",
    "version": "v${flowId}-optimized",
    "description": "Kurze Beschreibung der Optimierungen",
    "expectedScore": 95-100,
    "changes": [
      {
        "component": "ComponentName",
        "file": "src/components/...",
        "changeType": "modify|add|remove",
        "priority": 1-5,
        "description": "Was wird geändert",
        "before": "Aktueller Zustand (kurz)",
        "after": "Neuer Zustand (kurz)",
        "impact": "Score-Verbesserung +X",
        "implementation": "// React/TypeScript Code Snippet"
      }
    ],
    "newComponents": [
      {
        "name": "NewComponentName",
        "file": "src/components/...",
        "purpose": "Warum brauchen wir das?",
        "code": "// Vollständiger React Component Code"
      }
    ],
    "configChanges": [
      {
        "file": "tailwind.config.ts|index.css|...",
        "change": "Was wird geändert",
        "code": "// Code Snippet"
      }
    ]
  },
  "summary": {
    "totalChanges": 0,
    "criticalFixes": 0,
    "newComponents": 0,
    "expectedScoreGain": 0,
    "implementationTime": "X Stunden",
    "keyImprovements": ["..."]
  },
  "archetypeImpact": {
    "securitySeeker": { "before": 0, "after": 0, "improvements": ["..."] },
    "efficiencyMaximizer": { "before": 0, "after": 0, "improvements": ["..."] },
    "valueHunter": { "before": 0, "after": 0, "improvements": ["..."] },
    "overwhelmedParent": { "before": 0, "after": 0, "improvements": ["..."] }
  }
}`;

    console.log('[AI Fix Flow] Calling AI for optimization...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'system',
            content: `Du bist ein Elite UX/Conversion-Architekt für den SCHWEIZER UMZUGSMARKT.
Du produzierst Award-Level, archetypzentrierte Optimierungen.
Deine Outputs sind KONKRET, UMSETZBAR und VOLLSTÄNDIG.
Du kennst React, TypeScript, Tailwind CSS und moderne UX-Patterns.
Antworte immer im JSON-Format.`
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AI Fix Flow] AI error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'AI optimization failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '{}';
    
    let optimizationResult;
    try {
      optimizationResult = JSON.parse(content);
    } catch (e) {
      console.error('[AI Fix Flow] Failed to parse AI response:', e);
      optimizationResult = { error: 'Failed to parse optimization result', raw: content };
    }

    console.log('[AI Fix Flow] Optimization complete, storing result...');

    // Store the optimization result as a new flow_feedback_variant
    const { data: variant, error: insertError } = await supabase
      .from('flow_feedback_variants')
      .insert({
        flow_id: flowId,
        variant_name: `${flowName} - AI Optimized`,
        variant_label: `${flowId}-fix`,
        prompt: `Auto-Fix based on analysis (Score: ${analysis.overallScore} → ${targetScore}+)`,
        status: 'completed',
        executed_at: new Date().toISOString(),
        result_json: optimizationResult
      })
      .select()
      .single();

    if (insertError) {
      console.error('[AI Fix Flow] Error storing variant:', insertError);
    }

    console.log(`[AI Fix Flow] Complete! Variant ID: ${variant?.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        variantId: variant?.id,
        flowId,
        flowName,
        originalScore: analysis.overallScore,
        targetScore,
        optimization: optimizationResult,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[AI Fix Flow] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
