/**
 * ============================================================================
 * GENERATE ULTIMATE FLOW - EDGE FUNCTION
 * ============================================================================
 * 
 * Generiert den ultimativen Flow basierend auf der Synthese aller analysierten Flows.
 * Kombiniert die besten Elemente aus allen Versionen zu einem optimalen Flow.
 * 
 * @version 1.0.0
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface UltimateFlowRequest {
  synthesis: {
    winner: {
      flowId: string;
      flowName: string;
      totalScore: number;
      reasoning: string;
    };
    ranking: Array<{
      position: number;
      flowId: string;
      score: number;
      keyStrength: string;
      keyWeakness: string;
    }>;
    bestElements: Array<{
      element: string;
      sourceFlow: string;
      reason: string;
      implementation: string;
    }>;
    ultimateFlow: {
      name: string;
      description: string;
      steps: Array<{
        number: number;
        name: string;
        sourceFlow: string;
        elements: string[];
        improvements: string[];
      }>;
      expectedConversionLift: string;
      implementationPriority: Array<{
        priority: number;
        change: string;
        effort: string;
        impact: string;
        sourceFlow: string;
      }>;
    };
  };
  analyses: Array<{
    flowId: string;
    flowName: string;
    overallScore: number;
    categoryScores: Record<string, number>;
    strengths: string[];
    quickWins: string[];
  }>;
  flowVersion: string;
}

const log = {
  info: (msg: string, data?: unknown) => console.log(`[Ultimate-Flow] ℹ️ ${msg}`, data ? JSON.stringify(data) : ''),
  success: (msg: string, data?: unknown) => console.log(`[Ultimate-Flow] ✅ ${msg}`, data ? JSON.stringify(data) : ''),
  error: (msg: string, data?: unknown) => console.error(`[Ultimate-Flow] ❌ ${msg}`, data ? JSON.stringify(data) : ''),
};

function buildUltimateFlowPrompt(body: UltimateFlowRequest): string {
  const { synthesis, analyses } = body;
  
  const rankingSummary = synthesis.ranking.map(r => 
    `${r.position}. ${r.flowId} (${r.score}/100) - Stärke: ${r.keyStrength}`
  ).join('\n');
  
  const bestElementsSummary = synthesis.bestElements.map(be => 
    `- ${be.element} (von ${be.sourceFlow}): ${be.reason}`
  ).join('\n');
  
  const allStrengths = analyses.flatMap(a => 
    a.strengths.map(s => `[${a.flowId}] ${s}`)
  ).join('\n');
  
  const allQuickWins = analyses.flatMap(a => 
    a.quickWins.map(qw => `[${a.flowId}] ${qw}`)
  ).join('\n');

  return `Du bist ein Elite UX/Conversion-Architekt für den SCHWEIZER UMZUGSMARKT.
Deine Aufgabe: Erstelle einen ULTIMATE FLOW, der die BESTEN ELEMENTE aller analysierten Flows kombiniert.

# SYNTHESE-ERGEBNISSE

## GEWINNER-FLOW
- **Flow:** ${synthesis.winner.flowId} (${synthesis.winner.flowName})
- **Score:** ${synthesis.winner.totalScore}/100
- **Warum Gewinner:** ${synthesis.winner.reasoning}

## RANKING ALLER FLOWS
${rankingSummary}

## BESTE ELEMENTE (zu übernehmen)
${bestElementsSummary}

## ALLE STÄRKEN DER FLOWS
${allStrengths}

## QUICK WINS
${allQuickWins}

## GEPLANTER ULTIMATE FLOW
- **Name:** ${synthesis.ultimateFlow.name || 'Ultimate Flow'}
- **Beschreibung:** ${synthesis.ultimateFlow.description || 'Kombination der besten Elemente'}
- **Erwartete Conversion-Steigerung:** ${synthesis.ultimateFlow.expectedConversionLift || '+20-30%'}

---

# DEIN AUFTRAG

Erstelle einen VOLLSTÄNDIGEN Ultimate Flow Blueprint als React/TypeScript Komponente:

1. **Kombiniere die BESTEN Elemente** aus allen Flows
2. **Übernimm alle Quick Wins** 
3. **Eliminiere alle Schwächen**
4. **Optimiere für alle 4 Archetypen:**
   - Sicherheits-Sucher (ASTAG, Garantie, Fixpreis)
   - Effizienz-Maximierer (One-Click, Schnell)
   - Preis-Jäger (Vergleich, Sparen)
   - Chaos-Manager (Checkliste, Struktur)

# OUTPUT FORMAT (JSON)

{
  "ultimateFlow": {
    "name": "Ultimate Flow V${body.flowVersion}",
    "flowCode": "ultimate-${body.flowVersion}",
    "description": "Kombination der besten Elemente...",
    "expectedScore": 95,
    "expectedConversionLift": "+25%",
    "steps": [
      {
        "number": 1,
        "name": "Step Name",
        "sourceElements": ["Element von Flow X", "Element von Flow Y"],
        "features": ["Feature 1", "Feature 2"],
        "archetypeValue": {
          "securitySeeker": "Was dieser Step für Sicherheits-Sucher bietet",
          "efficiencyMaximizer": "...",
          "valueHunter": "...",
          "overwhelmedParent": "..."
        }
      }
    ],
    "keyFeatures": [
      {
        "feature": "Feature Name",
        "sourceFlow": "Woher kommt es",
        "implementation": "Kurze Beschreibung",
        "impact": "Erwarteter Effekt"
      }
    ],
    "componentCode": "// Vollständiger React Component Code für den Ultimate Flow...",
    "sharedComponents": [
      {
        "name": "ComponentName",
        "purpose": "Wozu",
        "code": "// Component Code"
      }
    ]
  },
  "implementationPlan": {
    "phase1": {
      "name": "Quick Wins",
      "duration": "1-2 Tage",
      "tasks": ["Task 1", "Task 2"]
    },
    "phase2": {
      "name": "Core Features",
      "duration": "3-5 Tage",
      "tasks": ["Task 1", "Task 2"]
    },
    "phase3": {
      "name": "Polish & Testing",
      "duration": "2-3 Tage",
      "tasks": ["Task 1", "Task 2"]
    }
  },
  "successMetrics": {
    "targetScore": 95,
    "conversionGoal": "+25%",
    "archetypeCoverage": {
      "securitySeeker": 90,
      "efficiencyMaximizer": 85,
      "valueHunter": 85,
      "overwhelmedParent": 80
    }
  }
}

WICHTIG:
- Der componentCode sollte ein VOLLSTÄNDIGER, LAUFFÄHIGER React Component sein
- Nutze die shared components aus src/components/calculator-variants/shared/
- Mobile-First Design
- Swiss Market Best Practices`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const startTime = Date.now();

  try {
    const body: UltimateFlowRequest = await req.json();
    const { synthesis, analyses, flowVersion } = body;

    log.info('Starting Ultimate Flow generation', { 
      winner: synthesis.winner.flowId,
      numAnalyses: analyses.length,
      flowVersion
    });

    if (!LOVABLE_API_KEY) {
      log.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'AI-Integration nicht konfiguriert.' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = buildUltimateFlowPrompt(body);
    log.info('Prompt built, calling AI...');

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
Du erstellst den ULTIMATE FLOW - die perfekte Kombination aller besten Elemente.
Du produzierst VOLLSTÄNDIGE, LAUFFÄHIGE React/TypeScript Komponenten.
Antworte IMMER im JSON-Format.`
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 12000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      log.error('AI API error', { status: response.status, error: errorText });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `AI-Generierung fehlgeschlagen: ${response.status}`,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '{}';
    
    // Parse JSON
    let jsonContent = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }
    
    if (!jsonContent.startsWith('{')) {
      const firstBrace = jsonContent.indexOf('{');
      const lastBrace = jsonContent.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonContent = jsonContent.substring(firstBrace, lastBrace + 1);
      }
    }
    
    let ultimateFlowResult;
    try {
      ultimateFlowResult = JSON.parse(jsonContent);
      log.success('AI response parsed successfully');
    } catch (e) {
      log.error('Failed to parse AI response');
      ultimateFlowResult = { 
        error: 'Failed to parse result', 
        raw: content.substring(0, 1000) 
      };
    }

    // Store the ultimate flow variant
    const flowCode = ultimateFlowResult.ultimateFlow?.flowCode || `ultimate-${flowVersion}-${Date.now()}`;
    
    const { data: variant, error: insertError } = await supabase
      .from('flow_feedback_variants')
      .insert({
        flow_id: `ultimate-${flowVersion}`,
        variant_name: ultimateFlowResult.ultimateFlow?.name || `Ultimate Flow ${flowVersion.toUpperCase()}`,
        variant_label: flowCode,
        prompt: `Ultimate Flow: Kombination der besten Elemente aus ${analyses.length} Flows`,
        status: 'done',
        executed_at: new Date().toISOString(),
        result_json: ultimateFlowResult,
      })
      .select()
      .single();

    if (insertError) {
      log.error('Error storing variant', insertError);
    } else {
      log.success('Ultimate Flow variant stored', { id: variant?.id });
    }

    // Also create a flow_version entry if it doesn't exist
    const { data: existingVersion } = await supabase
      .from('flow_versions')
      .select('id')
      .eq('flow_code', flowCode)
      .maybeSingle();
    
    if (!existingVersion) {
      await supabase
        .from('flow_versions')
        .insert({
          flow_id: `umzugsofferten-${flowVersion}`,
          version_number: 'ultimate',
          version_name: ultimateFlowResult.ultimateFlow?.name || 'Ultimate Flow',
          flow_code: flowCode,
          is_active: true,
          is_ultimate: true,
          screenshots: {},
          html_snapshots: {},
          step_configs: ultimateFlowResult.ultimateFlow?.steps || [],
        });
      log.success('Flow version created', { flowCode });
    }

    const duration = Date.now() - startTime;
    log.success(`Completed in ${duration}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        variantId: variant?.id,
        flowCode,
        ultimateFlow: ultimateFlowResult.ultimateFlow,
        implementationPlan: ultimateFlowResult.implementationPlan,
        successMetrics: ultimateFlowResult.successMetrics,
        duration,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    log.error(`Failed after ${duration}ms`, { error: errorMessage });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        duration
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
