/**
 * ============================================================================
 * AI FIX FLOW - ARCHETYP EDGE FUNCTION
 * ============================================================================
 * 
 * Automatische KI-gestützte Optimierung von Flows basierend auf Analyseergebnissen.
 * Generiert konkrete, umsetzbare Verbesserungsvorschläge nach Award-Level Standards.
 * 
 * ARCHETYP-QUALITÄTSSTANDARD:
 * - Archetypzentrierte Optimierungen
 * - Swiss Market Best Practices
 * - Konkrete Code-Vorschläge
 * - Priorisierte Implementierungsreihenfolge
 * 
 * @version 2.0.0 - Archetyp Edition
 * @author Umzugscheck.ch Team
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================================================
// CONFIGURATION
// ============================================================================
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// ============================================================================
// SWISS MARKET ARCHETYPES
// ============================================================================
const ARCHETYPES = {
  securitySeeker: {
    name: 'Sicherheits-Sucher',
    triggers: ['Garantie', 'ASTAG', 'Fixpreis', 'Versicherung', 'Zertifikate'],
    conversionTrigger: 'Fixpreis-Garantie & Abnahmegarantie'
  },
  efficiencyMaximizer: {
    name: 'Effizienz-Maximierer',
    triggers: ['One-Click', 'AI-Video', 'Full-Service', 'Schnell'],
    conversionTrigger: '"Fertig in 2 Minuten", "Alles aus einer Hand"'
  },
  valueHunter: {
    name: 'Preis-Jäger',
    triggers: ['Preisvergleich', 'Sparen', 'Rabatt', 'Transparent'],
    conversionTrigger: '"Sparen Sie 20% am 15. des Monats"'
  },
  overwhelmedParent: {
    name: 'Chaos-Manager',
    triggers: ['Checkliste', 'Speichern', 'Erinnerung', 'Struktur'],
    conversionTrigger: '"Wir denken an alles", "Nichts vergessen"'
  }
};

// ============================================================================
// TYPES
// ============================================================================
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
    archetypeScores?: Array<{
      archetype: string;
      score: number;
      improvements: string[];
    }>;
  };
  targetScore?: number;
}

// ============================================================================
// LOGGING UTILITIES
// ============================================================================
const log = {
  info: (msg: string, data?: unknown) => console.log(`[AI-Fix] ℹ️ ${msg}`, data ? JSON.stringify(data) : ''),
  success: (msg: string, data?: unknown) => console.log(`[AI-Fix] ✅ ${msg}`, data ? JSON.stringify(data) : ''),
  warn: (msg: string, data?: unknown) => console.warn(`[AI-Fix] ⚠️ ${msg}`, data ? JSON.stringify(data) : ''),
  error: (msg: string, data?: unknown) => console.error(`[AI-Fix] ❌ ${msg}`, data ? JSON.stringify(data) : ''),
};

// ============================================================================
// PROMPT BUILDER
// ============================================================================
function buildOptimizationPrompt(body: FixRequest): string {
  const { flowId, flowName, analysis, targetScore = 95 } = body;

  // Build issues summary
  const issuesSummary = analysis.elements?.flatMap(el => 
    el.issues.map(issue => `- [${issue.severity.toUpperCase()}] ${el.elementName}: ${issue.description} → ${issue.recommendation}`)
  ).join('\n') || 'Keine detaillierten Element-Issues vorhanden';

  // Build archetype summary
  const archetypeSummary = analysis.archetypeScores?.map(as => 
    `- ${as.archetype}: ${as.score}/100 | Verbesserungen: ${as.improvements.join(', ')}`
  ).join('\n') || 'Keine Archetypen-Scores vorhanden';

  return `Du bist ein Elite UX/Conversion-Architekt mit 15+ Jahren Erfahrung im SCHWEIZER UMZUGSMARKT.
Deine Aufgabe: Erstelle einen VOLLSTÄNDIG OPTIMIERTEN Flow nach Award-Level Standards.

# ANALYSE DES FLOWS "${flowName}" (ID: ${flowId})

## AKTUELLER STAND
- **Gesamt-Score:** ${analysis.overallScore}/100
- **Ziel-Score:** ${targetScore}+/100
- **Gap zu schließen:** ${targetScore - analysis.overallScore} Punkte

## KATEGORIE-SCORES
${Object.entries(analysis.categoryScores || {}).map(([k, v]) => `- ${k}: ${v}/100`).join('\n')}

## ARCHETYPEN-FIT
${archetypeSummary}

## STÄRKEN (beibehalten & verstärken)
${analysis.strengths?.map(s => `✓ ${s}`).join('\n') || 'Keine dokumentiert'}

## SCHWÄCHEN (kritisch beheben)
${analysis.weaknesses?.map(w => `✗ ${w}`).join('\n') || 'Keine dokumentiert'}

## CONVERSION KILLERS (sofort eliminieren)
${analysis.conversionKillers?.map(ck => `🚨 ${ck}`).join('\n') || 'Keine dokumentiert'}

## QUICK WINS (low effort, high impact)
${analysis.quickWins?.map(qw => `⚡ ${qw}`).join('\n') || 'Keine dokumentiert'}

## ELEMENT-LEVEL ISSUES
${issuesSummary}

---

# DEIN AUFTRAG

Erstelle einen VOLLSTÄNDIG OPTIMIERTEN Flow Blueprint, der:

1. **ALLE Schwächen behebt** - Keine Kompromisse
2. **ALLE Quick Wins implementiert** - Low-hanging fruits zuerst
3. **ALLE Conversion Killers eliminiert** - Kritisch für ROI
4. **Score von ${targetScore}+ erreicht** - Messbares Ziel
5. **Swiss Market Best Practices befolgt** - ASTAG, Zügeltage, Abnahmegarantie
6. **Alle 4 Archetypen bedient** - Sicherheits-Sucher, Effizienz-Maximierer, Preis-Jäger, Chaos-Manager

# OUTPUT FORMAT (JSON)

{
  "optimizedFlow": {
    "name": "Optimierter Flow Name",
    "version": "v${flowId}-optimized",
    "description": "Kurze Beschreibung der Hauptoptimierungen",
    "expectedScore": 95-100,
    "archetypeImprovements": {
      "securitySeeker": ["Konkrete Verbesserung 1", "..."],
      "efficiencyMaximizer": ["..."],
      "valueHunter": ["..."],
      "overwhelmedParent": ["..."]
    },
    "changes": [
      {
        "component": "ComponentName",
        "file": "src/components/...",
        "changeType": "modify|add|remove",
        "priority": 1-5,
        "description": "Was wird geändert",
        "before": "Aktueller Zustand (kurz)",
        "after": "Neuer Zustand (kurz)",
        "impact": "+X Score-Punkte",
        "effort": "low|medium|high",
        "affectedArchetypes": ["securitySeeker", "..."],
        "implementation": "// React/TypeScript Code Snippet"
      }
    ],
    "newComponents": [
      {
        "name": "NewComponentName",
        "file": "src/components/...",
        "purpose": "Warum brauchen wir das?",
        "archetypeValue": ["Welche Archetypen profitieren?"],
        "code": "// Vollständiger React Component Code"
      }
    ],
    "configChanges": [
      {
        "file": "tailwind.config.ts|index.css|...",
        "change": "Was wird geändert",
        "code": "// Code Snippet"
      }
    ],
    "swissMarketFeatures": [
      {
        "feature": "Feature Name",
        "implementation": "Wie umsetzen",
        "impact": "Erwarteter Effekt"
      }
    ]
  },
  "summary": {
    "totalChanges": 0,
    "criticalFixes": 0,
    "newComponents": 0,
    "expectedScoreGain": 0,
    "implementationTime": "X Stunden",
    "keyImprovements": ["Top 5 Verbesserungen"],
    "riskAssessment": "low|medium|high"
  },
  "archetypeImpact": {
    "securitySeeker": { 
      "before": 0, 
      "after": 0, 
      "improvements": ["..."],
      "triggersCovered": ["Garantie", "..."]
    },
    "efficiencyMaximizer": { "before": 0, "after": 0, "improvements": ["..."] },
    "valueHunter": { "before": 0, "after": 0, "improvements": ["..."] },
    "overwhelmedParent": { "before": 0, "after": 0, "improvements": ["..."] }
  },
  "implementationRoadmap": {
    "phase1_quickWins": {
      "duration": "1-2 Tage",
      "items": ["..."],
      "expectedScoreGain": 10
    },
    "phase2_coreOptimizations": {
      "duration": "3-5 Tage",
      "items": ["..."],
      "expectedScoreGain": 15
    },
    "phase3_advancedFeatures": {
      "duration": "1-2 Wochen",
      "items": ["..."],
      "expectedScoreGain": 10
    }
  },
  "qualityChecklist": [
    { "item": "Trust Badges vorhanden", "status": "todo|done", "priority": "high" },
    { "item": "Sticky CTA auf Mobile", "status": "todo|done", "priority": "high" },
    { "item": "Flex-Date Option", "status": "todo|done", "priority": "medium" }
  ]
}

WICHTIG: 
- Sei KONKRET mit Code-Beispielen
- Priorisiere nach Impact/Effort Ratio
- Berücksichtige Mobile-First
- Alle Scores müssen begründet sein`;
}

// ============================================================================
// MAIN HANDLER
// ============================================================================
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const startTime = Date.now();

  try {
    const body: FixRequest = await req.json();
    const { flowId, flowName, analysis, targetScore = 95 } = body;

    log.info(`Starting AI fix for "${flowName}"`, { 
      flowId, 
      currentScore: analysis.overallScore,
      targetScore 
    });

    // Validate API key
    if (!LOVABLE_API_KEY) {
      log.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'AI-Integration nicht konfiguriert. Bitte LOVABLE_API_KEY setzen.' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the prompt
    const prompt = buildOptimizationPrompt(body);
    log.info('Prompt built, calling AI...');

    // Call AI API
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
Du beachtest die 4 Schweizer Umzugs-Archetypen: ${Object.values(ARCHETYPES).map(a => a.name).join(', ')}.
Antworte IMMER im JSON-Format.`
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 8000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      log.error('AI API error', { status: response.status, error: errorText });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `AI-Optimierung fehlgeschlagen: ${response.status}`,
          details: errorText.substring(0, 200)
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '{}';
    
    // Robust JSON extraction - handle markdown code blocks and text around JSON
    let jsonContent = content;
    
    // Remove markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }
    
    // Try to find JSON object if there's text around it
    if (!jsonContent.startsWith('{')) {
      const firstBrace = jsonContent.indexOf('{');
      const lastBrace = jsonContent.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonContent = jsonContent.substring(firstBrace, lastBrace + 1);
      }
    }
    
    let optimizationResult;
    try {
      optimizationResult = JSON.parse(jsonContent);
      log.success('AI response parsed successfully');
    } catch (e) {
      log.error('Failed to parse AI response, content preview:', jsonContent.substring(0, 500));
      optimizationResult = { 
        error: 'Failed to parse optimization result', 
        raw: content.substring(0, 1000) 
      };
    }

    // Store the optimization result in flow_feedback_variants
    log.info('Storing optimization result...');

    const { data: variant, error: insertError } = await supabase
      .from('flow_feedback_variants')
      .insert({
        flow_id: flowId,
        variant_name: `${flowName} - AI Archetyp Optimiert`,
        variant_label: `${flowId}-fix-${Date.now()}`,
        prompt: `Auto-Fix: Score ${analysis.overallScore} → ${targetScore}+ | ${new Date().toISOString()}`,
        status: 'done',
        executed_at: new Date().toISOString(),
        result_json: optimizationResult,
      })
      .select()
      .single();

    if (insertError) {
      log.error('Error storing variant', insertError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Optimierung erstellt, aber konnte nicht gespeichert werden.',
          details: insertError,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    log.success('Variant stored', { id: variant?.id });

    // AUTO-APPLY: Update the flow_versions table directly
    log.info('Auto-applying optimization to flow_versions...');
    
    const aiFeedbackSummary = `## AI Auto-Fix (${new Date().toLocaleDateString('de-CH')})
Score: ${analysis.overallScore} → ${optimizationResult?.optimizedFlow?.expectedScore || targetScore}+

### Änderungen: ${optimizationResult?.summary?.totalChanges || 0}
${optimizationResult?.summary?.keyImprovements?.map((i: string) => `- ${i}`).join('\n') || 'Keine Details'}

### Archetypen-Impact:
${Object.entries(optimizationResult?.archetypeImpact || {}).map(([k, v]: [string, any]) => 
  `- ${k}: ${v.before || 0} → ${v.after || 0}`
).join('\n')}`;

    // Update the flow_versions table with the AI feedback
    const { error: updateError } = await supabase
      .from('flow_versions')
      .update({
        ai_feedback: aiFeedbackSummary,
        ai_feedback_date: new Date().toISOString(),
        ai_feedback_source: 'ai-fix-flow-auto',
        // Store the full optimization in config for later access
        config: {
          lastOptimization: optimizationResult,
          optimizedAt: new Date().toISOString(),
          originalScore: analysis.overallScore,
          targetScore: targetScore,
          expectedScore: optimizationResult?.optimizedFlow?.expectedScore || targetScore
        }
      })
      .eq('flow_id', flowId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (updateError) {
      log.warn('Could not update flow_versions (non-critical)', updateError);
    } else {
      log.success('flow_versions updated with AI feedback');
    }

    // Also update/create UX issues from the optimization
    if (optimizationResult?.optimizedFlow?.changes) {
      log.info('Creating resolved UX issues from optimizations...');
      
      const issues = optimizationResult.optimizedFlow.changes.map((change: any, idx: number) => ({
        flow_id: flowId,
        title: `[AI-FIX] ${change.description || change.component}`,
        description: `${change.before || ''} → ${change.after || ''}`,
        recommendation: change.implementation || 'Siehe AI-Optimierung',
        category: 'ai-optimization',
        issue_type: change.changeType || 'modify',
        severity: change.priority <= 2 ? 'critical' : change.priority <= 3 ? 'warning' : 'info',
        step_number: idx + 1,
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        impact: change.impact,
        effort: change.effort
      }));

      const { error: issuesError } = await supabase
        .from('flow_ux_issues')
        .insert(issues);

      if (issuesError) {
        log.warn('Could not store optimization issues', issuesError);
      } else {
        log.success(`Stored ${issues.length} optimization issues`);
      }
    }

    const duration = Date.now() - startTime;
    log.success(`Completed in ${duration}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        variantId: variant?.id,
        flowId,
        flowName,
        originalScore: analysis.overallScore,
        targetScore,
        expectedScore: optimizationResult?.optimizedFlow?.expectedScore || targetScore,
        optimization: optimizationResult,
        autoApplied: true,
        changesApplied: optimizationResult?.summary?.totalChanges || 0,
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
