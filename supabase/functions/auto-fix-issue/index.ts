import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IssueFixRequest {
  issueId: string;
  issueTitle: string;
  issueDescription?: string;
  recommendation?: string;
  flowId: string;
  stepNumber?: number;
  category: string;
  severity: string;
  prompt: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: IssueFixRequest = await req.json();
    console.log('Received auto-fix request:', JSON.stringify(body, null, 2));

    const { issueId, issueTitle, issueDescription, recommendation, flowId, stepNumber, category, severity, prompt } = body;

    if (!issueId || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: issueId and prompt' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build a comprehensive fix prompt for the AI
    const aiPrompt = `Du bist ein erfahrener UX/Frontend-Entwickler. Analysiere das folgende UX-Issue und generiere einen konkreten, präzisen Fix-Vorschlag.

## Issue Details
- **Titel**: ${issueTitle}
- **Kategorie**: ${category}
- **Severity**: ${severity}
- **Flow**: ${flowId}
- **Step**: ${stepNumber || 'Gesamter Flow'}
- **Beschreibung**: ${issueDescription || 'Keine weitere Beschreibung'}
- **Empfehlung**: ${recommendation || 'Keine spezifische Empfehlung'}

## Aufgabe
1. Analysiere das Problem kurz
2. Gib einen konkreten Lösungsansatz in 2-3 Sätzen
3. Liste die wichtigsten Code-Änderungen auf (Tailwind-Klassen, React-Patterns)

Antworte auf Deutsch und halte dich kurz und prägnant.`;

    let fixSuggestion = '';
    
    // Use OpenAI API
    if (openaiApiKey) {
      console.log('Calling OpenAI API for fix suggestion...');
      
      try {
        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: aiPrompt,
              }
            ],
            max_tokens: 800,
            temperature: 0.3,
          }),
        });

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json();
          fixSuggestion = aiResult.choices?.[0]?.message?.content || '';
          console.log('OpenAI generated fix suggestion:', fixSuggestion.substring(0, 200) + '...');
        } else {
          const errorText = await aiResponse.text();
          console.warn('OpenAI API call failed:', aiResponse.status, errorText);
          
          if (aiResponse.status === 429) {
            return new Response(
              JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
              { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      } catch (aiError) {
        console.error('OpenAI API call error:', aiError);
      }
    } else {
      console.warn('OPENAI_API_KEY not configured');
    }
    
    // Fallback if AI didn't return a response
    if (!fixSuggestion) {
      console.log('Using fallback fix suggestion');
      fixSuggestion = `## Manueller Fix erforderlich

**Issue**: ${issueTitle}
**Kategorie**: ${category}
**Severity**: ${severity}

### Empfohlene Massnahmen:
${recommendation || prompt}

### Nächste Schritte:
1. Issue manuell analysieren
2. Betroffene Komponente identifizieren
3. Fix implementieren und testen`;
    }

    // Mark issue as resolved in database
    const { error: updateError } = await supabase
      .from('flow_ux_issues')
      .update({ 
        is_resolved: true, 
        resolved_at: new Date().toISOString(),
        recommendation: fixSuggestion
      })
      .eq('id', issueId);

    if (updateError) {
      console.error('Failed to update issue:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        issueId,
        fixSuggestion,
        message: 'Issue wurde analysiert und als gelöst markiert'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Auto-fix error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Auto-fix failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
