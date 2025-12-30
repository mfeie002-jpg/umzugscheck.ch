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

    // Call Lovable AI (Gemini Flash)
    console.log('Calling Lovable AI for fix suggestion...');
    
    const aiResponse = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
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

    let fixSuggestion = '';
    
    if (aiResponse.ok) {
      const aiResult = await aiResponse.json();
      fixSuggestion = aiResult.choices?.[0]?.message?.content || '';
      console.log('AI generated fix suggestion:', fixSuggestion);
    } else {
      console.log('AI call failed, using fallback prompt');
      fixSuggestion = `Manueller Fix erforderlich für: ${issueTitle}\n\n${prompt}`;
    }

    // Mark issue as resolved in database
    const { error: updateError } = await supabase
      .from('flow_ux_issues')
      .update({ 
        is_resolved: true, 
        resolved_at: new Date().toISOString(),
        recommendation: fixSuggestion || recommendation
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
