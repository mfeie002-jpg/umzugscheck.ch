import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UxIssue {
  id: string;
  title: string;
  description?: string;
  recommendation?: string;
  category: string;
  severity: string;
  stepNumber?: number;
}

interface BatchFixRequest {
  flowId: string;
  issues: UxIssue[];
}

interface FixSuggestion {
  issueId: string;
  issueTitle: string;
  severity: string;
  category: string;
  analysis: string;
  codeChanges: string;
  tailwindClasses?: string;
  priority: 'high' | 'medium' | 'low';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: BatchFixRequest = await req.json();
    const { flowId, issues } = body;

    console.log(`[ai-batch-fix] Processing ${issues.length} issues for flow: ${flowId}`);

    if (!issues || issues.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No issues provided', fixes: [] }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the prompt for batch analysis
    const issuesList = issues.map((issue, idx) => 
      `${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.title}
   Kategorie: ${issue.category}
   Step: ${issue.stepNumber || 'Global'}
   Beschreibung: ${issue.description || '-'}
   Empfehlung: ${issue.recommendation || '-'}`
    ).join('\n\n');

    const systemPrompt = `Du bist ein erfahrener UX/Frontend-Entwickler für eine Schweizer Umzugs-Vergleichsplattform.
Analysiere die folgenden UX-Issues und generiere konkrete, implementierbare Fixes.

Für jeden Fix gib an:
1. Eine kurze Analyse (1-2 Sätze)
2. Konkrete Code-Änderungen (React/Tailwind)
3. Die wichtigsten Tailwind-Klassen
4. Priorität (high/medium/low)

Antworte im JSON-Format. Sei präzise und fokussiere auf Conversion-Optimierung.`;

    const userPrompt = `Flow: ${flowId}

Issues zu fixen:

${issuesList}

Generiere für JEDES Issue einen konkreten Fix im folgenden JSON-Format:
{
  "fixes": [
    {
      "issueId": "issue-id",
      "issueTitle": "Issue Titel",
      "severity": "critical|warning|info",
      "category": "ux|mobile|conversion",
      "analysis": "Kurze Analyse des Problems",
      "codeChanges": "Konkreter React/Tailwind Code",
      "tailwindClasses": "wichtige-klassen space-y-4",
      "priority": "high|medium|low"
    }
  ]
}`;

    let fixes: FixSuggestion[] = [];

    if (lovableApiKey) {
      console.log('[ai-batch-fix] Calling Lovable AI...');
      
      try {
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
            max_tokens: 4000,
          }),
        });

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json();
          const content = aiResult.choices?.[0]?.message?.content || '';
          console.log('[ai-batch-fix] AI response received, length:', content.length);
          
          // Parse JSON from response
          try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                              content.match(/```\s*([\s\S]*?)\s*```/) ||
                              [null, content];
            const jsonStr = jsonMatch[1] || content;
            const parsed = JSON.parse(jsonStr.trim());
            fixes = parsed.fixes || [];
            console.log(`[ai-batch-fix] Parsed ${fixes.length} fixes`);
          } catch (parseErr) {
            console.error('[ai-batch-fix] JSON parse error:', parseErr);
            // Fallback: create basic fixes
            fixes = issues.map(issue => ({
              issueId: issue.id,
              issueTitle: issue.title,
              severity: issue.severity,
              category: issue.category,
              analysis: `Problem: ${issue.description || issue.title}`,
              codeChanges: issue.recommendation || 'Manuell prüfen',
              priority: issue.severity === 'critical' ? 'high' : 'medium' as const,
            }));
          }
        } else {
          const errorText = await aiResponse.text();
          console.error('[ai-batch-fix] AI API error:', aiResponse.status, errorText);
          
          if (aiResponse.status === 429) {
            return new Response(
              JSON.stringify({ error: 'Rate limit - bitte später erneut versuchen', fixes: [] }),
              { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          if (aiResponse.status === 402) {
            return new Response(
              JSON.stringify({ error: 'Credits erschöpft - bitte Guthaben aufladen', fixes: [] }),
              { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      } catch (aiError) {
        console.error('[ai-batch-fix] AI call error:', aiError);
      }
    } else {
      console.warn('[ai-batch-fix] LOVABLE_API_KEY not configured');
    }

    // Fallback if no fixes generated
    if (fixes.length === 0) {
      console.log('[ai-batch-fix] Using fallback fixes');
      fixes = issues.map(issue => ({
        issueId: issue.id,
        issueTitle: issue.title,
        severity: issue.severity,
        category: issue.category,
        analysis: `Manueller Review erforderlich für: ${issue.title}`,
        codeChanges: `// Fix für: ${issue.title}\n// ${issue.recommendation || 'Siehe Issue-Beschreibung'}`,
        tailwindClasses: getCategoryClasses(issue.category),
        priority: issue.severity === 'critical' ? 'high' : issue.severity === 'warning' ? 'medium' : 'low' as const,
      }));
    }

    console.log(`[ai-batch-fix] Returning ${fixes.length} fixes`);

    return new Response(
      JSON.stringify({
        success: true,
        flowId,
        issueCount: issues.length,
        fixes,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[ai-batch-fix] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Batch fix failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        fixes: [],
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function getCategoryClasses(category: string): string {
  switch (category.toLowerCase()) {
    case 'mobile':
      return 'min-h-[44px] touch-action-manipulation p-4';
    case 'conversion':
      return 'sticky bottom-4 w-full font-semibold';
    case 'ux':
      return 'transition-colors hover:bg-accent/50';
    default:
      return '';
  }
}
