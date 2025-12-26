import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContextRequest {
  projectUrl: string;
  projectName?: string;
  htmlContent?: string;
  currentDescription?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectUrl, projectName, htmlContent, currentDescription } = await req.json() as ContextRequest;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Generating context for: ${projectUrl}`);

    const systemPrompt = `Du bist ein erfahrener Business-Analyst und UX-Stratege. 
Deine Aufgabe ist es, basierend auf Website-Informationen die 4 kritischen Kontext-Fragen zu beantworten, 
die für eine vollständige AI-Analyse (ChatGPT/Claude) benötigt werden.

Antworte IMMER auf Deutsch und im JSON-Format. Sei spezifisch und gib konkrete, actionable Informationen.`;

    const truncatedHtml = htmlContent?.substring(0, 15000) || '';

    const userPrompt = `# Kontext-Generierung für AI-Analyse

## Website-Information
- **URL:** ${projectUrl}
- **Name:** ${projectName || 'Nicht angegeben'}
- **Aktuelle Beschreibung:** ${currentDescription || 'Keine'}

${truncatedHtml ? `## HTML-Auszug (für Kontext)
\`\`\`html
${truncatedHtml}
\`\`\`` : ''}

## Deine Aufgabe
Analysiere die Website und generiere detaillierte Antworten zu den 4 kritischen Kontext-Fragen.
Diese Antworten werden verwendet, um ChatGPT/Claude die beste Analyse zu ermöglichen.

Antworte NUR mit einem validen JSON-Objekt in diesem exakten Format:

{
  "competitors": {
    "direct": ["Konkurrent 1", "Konkurrent 2", "Konkurrent 3"],
    "indirect": ["Indirekter Konkurrent 1", "Indirekter Konkurrent 2"],
    "analysis": "2-3 Sätze über die Wettbewerbslandschaft und Positionierung"
  },
  "targetAudience": {
    "primary": "Primäre Zielgruppe (demografisch + psychografisch)",
    "secondary": "Sekundäre Zielgruppe",
    "painPoints": ["Pain Point 1", "Pain Point 2", "Pain Point 3"],
    "motivations": ["Motivation 1", "Motivation 2"]
  },
  "businessGoals": {
    "primary": "Hauptziel der Website (z.B. Lead-Generierung)",
    "secondary": ["Nebenziel 1", "Nebenziel 2"],
    "kpis": ["KPI 1 (z.B. Conversion Rate)", "KPI 2", "KPI 3"],
    "conversionPath": "Beschreibung des idealen Conversion-Pfads"
  },
  "successMetrics": {
    "conversion": {
      "current_estimate": "Geschätzte aktuelle Rate (z.B. 2-4%)",
      "target": "Ziel-Rate (z.B. 5-8%)",
      "blockers": ["Blocker 1", "Blocker 2"]
    },
    "ux": {
      "strengths": ["Stärke 1", "Stärke 2"],
      "weaknesses": ["Schwäche 1", "Schwäche 2"]
    },
    "trustSignals": {
      "existing": ["Vorhandenes Signal 1", "Signal 2"],
      "missing": ["Fehlendes Signal 1", "Signal 2"]
    }
  }
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit erreicht. Bitte versuchen Sie es in einer Minute erneut.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Guthaben erschöpft. Bitte laden Sie Ihr Lovable AI Guthaben auf.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    console.log('AI response received, parsing JSON...');

    // Extract JSON from response (handle markdown code blocks)
    let jsonContent = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }

    let parsedContext;
    try {
      parsedContext = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw content:', content);
      
      // Return a structured fallback
      parsedContext = {
        competitors: {
          direct: ['Analyse erforderlich'],
          indirect: [],
          analysis: 'Konnte nicht automatisch ermittelt werden. Bitte manuell ergänzen.'
        },
        targetAudience: {
          primary: 'Analyse erforderlich',
          secondary: '',
          painPoints: [],
          motivations: []
        },
        businessGoals: {
          primary: 'Lead-Generierung (Standard)',
          secondary: [],
          kpis: ['Conversion Rate', 'Lead-Qualität'],
          conversionPath: 'Analyse erforderlich'
        },
        successMetrics: {
          conversion: {
            current_estimate: 'Unbekannt',
            target: '5%+',
            blockers: []
          },
          ux: {
            strengths: [],
            weaknesses: []
          },
          trustSignals: {
            existing: [],
            missing: []
          }
        },
        _parseError: true,
        _rawContent: content.substring(0, 500)
      };
    }

    return new Response(JSON.stringify({
      success: true,
      context: parsedContext,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-generate-context:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
