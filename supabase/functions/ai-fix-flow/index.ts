/**
 * ============================================================================
 * AI FIX FLOW - BACKGROUND PROCESSING EDITION
 * ============================================================================
 * 
 * Automatische KI-gestützte Optimierung von Flows mit Background Processing.
 * User erhält sofort Feedback, AI arbeitet im Hintergrund.
 * 
 * @version 3.0.0 - Background Processing Edition
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

const ARCHETYPES = {
  securitySeeker: { name: 'Sicherheits-Sucher', triggers: ['Garantie', 'ASTAG', 'Fixpreis'] },
  efficiencyMaximizer: { name: 'Effizienz-Maximierer', triggers: ['One-Click', 'Schnell'] },
  valueHunter: { name: 'Preis-Jäger', triggers: ['Preisvergleich', 'Sparen'] },
  overwhelmedParent: { name: 'Chaos-Manager', triggers: ['Checkliste', 'Struktur'] }
};

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
      issues: Array<{ severity: string; description: string; recommendation: string; }>;
    }>;
    archetypeScores?: Array<{ archetype: string; score: number; improvements: string[]; }>;
  };
  targetScore?: number;
}

const log = {
  info: (msg: string, data?: unknown) => console.log(`[AI-Fix] ℹ️ ${msg}`, data ? JSON.stringify(data) : ''),
  success: (msg: string, data?: unknown) => console.log(`[AI-Fix] ✅ ${msg}`, data ? JSON.stringify(data) : ''),
  warn: (msg: string, data?: unknown) => console.warn(`[AI-Fix] ⚠️ ${msg}`, data ? JSON.stringify(data) : ''),
  error: (msg: string, data?: unknown) => console.error(`[AI-Fix] ❌ ${msg}`, data ? JSON.stringify(data) : ''),
};

function buildOptimizationPrompt(body: FixRequest): string {
  const { flowId, flowName, analysis, targetScore = 95 } = body;
  const issuesSummary = analysis.elements?.flatMap(el => 
    el.issues.map(issue => `- [${issue.severity.toUpperCase()}] ${el.elementName}: ${issue.description}`)
  ).join('\n') || 'Keine Element-Issues';

  return `Du bist ein Elite UX/Conversion-Architekt für den SCHWEIZER UMZUGSMARKT.

# FLOW "${flowName}" (ID: ${flowId})
- Gesamt-Score: ${analysis.overallScore}/100 → Ziel: ${targetScore}+
- Schwächen: ${analysis.weaknesses?.join(', ') || 'N/A'}
- Quick Wins: ${analysis.quickWins?.join(', ') || 'N/A'}
- Issues: ${issuesSummary}

Erstelle einen VOLLSTÄNDIG OPTIMIERTEN Flow Blueprint als JSON mit:
{
  "optimizedFlow": {
    "name": "string",
    "expectedScore": number,
    "changes": [{ "component": "string", "description": "string", "priority": 1-5, "impact": "string", "implementation": "string" }],
    "newComponents": [{ "name": "string", "purpose": "string", "code": "string" }]
  },
  "summary": { "totalChanges": number, "keyImprovements": ["string"] },
  "archetypeImpact": { "securitySeeker": { "before": 0, "after": 0 }, ... }
}`;
}

// Background processing function
async function processFixInBackground(
  supabase: any,
  queueId: string,
  body: FixRequest
) {
  const { flowId, flowName, analysis, targetScore = 95 } = body;
  const startTime = Date.now();

  try {
    // Update queue status to processing
    await supabase.from('flow_analysis_queue')
      .update({ status: 'processing', started_at: new Date().toISOString() })
      .eq('id', queueId);

    log.info(`Background processing started for "${flowName}"`);

    const prompt = buildOptimizationPrompt(body);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Du bist ein Elite UX/Conversion-Architekt. Antworte NUR im JSON-Format.
Archetypen: ${Object.values(ARCHETYPES).map(a => a.name).join(', ')}.`
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || '{}';
    
    // Clean JSON
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) content = jsonMatch[1].trim();
    if (!content.startsWith('{')) {
      const first = content.indexOf('{'), last = content.lastIndexOf('}');
      if (first !== -1 && last > first) content = content.substring(first, last + 1);
    }
    
    let optimizationResult;
    try {
      optimizationResult = JSON.parse(content);
    } catch {
      optimizationResult = { error: 'Parse failed', raw: content.substring(0, 500) };
    }

    // Store variant (make variant_name unique per run to avoid duplicate-key errors)
    const variantName = `${flowName} - AI Auto-Fix #${queueId.slice(0, 8)}`;

    const { data: variant, error: variantError } = await supabase
      .from('flow_feedback_variants')
      .insert({
        flow_id: flowId,
        variant_name: variantName,
        variant_label: `${flowId}-fix-${Date.now()}`,
        prompt: `Auto-Fix: ${analysis.overallScore} → ${targetScore}+`,
        status: 'done',
        executed_at: new Date().toISOString(),
        result_json: optimizationResult,
      })
      .select()
      .single();

    if (variantError) {
      throw variantError;
    }

    // Update flow_versions
    const aiFeedback = `## AI Auto-Fix (${new Date().toLocaleDateString('de-CH')})
Score: ${analysis.overallScore} → ${optimizationResult?.optimizedFlow?.expectedScore || targetScore}+
Änderungen: ${optimizationResult?.summary?.totalChanges || 0}
${optimizationResult?.summary?.keyImprovements?.map((i: string) => `- ${i}`).join('\n') || ''}`;

    await supabase
      .from('flow_versions')
      .update({
        ai_feedback: aiFeedback,
        ai_feedback_date: new Date().toISOString(),
        ai_feedback_source: 'ai-fix-flow-background',
        config: {
          lastOptimization: optimizationResult,
          optimizedAt: new Date().toISOString(),
          originalScore: analysis.overallScore,
          expectedScore: optimizationResult?.optimizedFlow?.expectedScore || targetScore
        }
      })
      .eq('flow_id', flowId)
      .eq('is_active', true);

    // Create resolved issues
    if (optimizationResult?.optimizedFlow?.changes) {
      const issues = optimizationResult.optimizedFlow.changes.slice(0, 10).map((change: any, idx: number) => ({
        flow_id: flowId,
        title: `[AI-FIX] ${change.description || change.component}`,
        description: change.implementation || 'Siehe Optimierung',
        category: 'ai-optimization',
        issue_type: 'modify',
        severity: change.priority <= 2 ? 'critical' : 'info',
        step_number: idx + 1,
        is_resolved: true,
        resolved_at: new Date().toISOString()
      }));
      await supabase.from('flow_ux_issues').insert(issues);
    }

    // Mark queue as completed
    const duration = Date.now() - startTime;
    await supabase.from('flow_analysis_queue')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_run_id: variant?.id
      })
      .eq('id', queueId);

    log.success(`Background processing completed in ${duration}ms`, { variantId: variant?.id });

  } catch (error) {
    log.error('Background processing failed', error);
    await supabase.from('flow_analysis_queue')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        completed_at: new Date().toISOString()
      })
      .eq('id', queueId);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const body: FixRequest = await req.json();
    const { flowId, flowName, analysis } = body;

    log.info(`Queueing AI fix for "${flowName}"`);

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create queue entry immediately
    const { data: queueEntry, error: queueError } = await supabase
      .from('flow_analysis_queue')
       .insert({
         flow_id: flowId,
         flow_version: 'ai-fix',
         status: 'queued',
         priority: 1,
         queued_at: new Date().toISOString()
       })
      .select()
      .single();

    if (queueError) {
      log.error('Failed to create queue entry', queueError);
      return new Response(
        JSON.stringify({ success: false, error: 'Queue error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Start background processing using waitUntil
    // @ts-ignore - EdgeRuntime is available in Supabase Edge Functions
    (globalThis as any).EdgeRuntime?.waitUntil?.(processFixInBackground(supabase, queueEntry.id, body)) 
      || processFixInBackground(supabase, queueEntry.id, body).catch(console.error);
    return new Response(
      JSON.stringify({
        success: true,
        queued: true,
        queueId: queueEntry.id,
        flowId,
        flowName,
        message: `AI-Optimierung läuft im Hintergrund. Queue-ID: ${queueEntry.id}`,
        originalScore: analysis.overallScore,
        estimatedTime: '15-30 Sekunden'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    log.error('Request error', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
