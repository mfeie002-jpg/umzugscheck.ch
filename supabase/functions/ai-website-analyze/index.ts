import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      projectName, 
      projectUrl, 
      description, 
      goals, 
      targetAudience,
      competitors,
      htmlContent,
      screenshotBase64,
      analysisType = 'complete' 
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Starting ${analysisType} analysis for: ${projectUrl}`);

    // Build the analysis prompt based on type
    const systemPrompt = `Du bist ein erfahrener Web-Analyst und UX-Experte. Analysiere Websites gründlich und gib actionable Empfehlungen. Antworte auf Deutsch.`;

    let userPrompt = `# Website-Analyse für ${projectName}

## Projekt-Details
- **URL:** ${projectUrl}
- **Beschreibung:** ${description || 'Keine Beschreibung'}
- **Ziele:** ${goals || 'Nicht angegeben'}
- **Zielgruppe:** ${targetAudience || 'Nicht angegeben'}
- **Konkurrenten:** ${competitors || 'Nicht angegeben'}

`;

    if (htmlContent) {
      // Truncate HTML to avoid token limits
      const truncatedHtml = htmlContent.substring(0, 15000);
      userPrompt += `## HTML-Analyse
Hier ist ein Auszug des HTML-Codes (erste 15000 Zeichen):

\`\`\`html
${truncatedHtml}
\`\`\`

`;
    }

    userPrompt += `## Deine Aufgaben

### 1. Quick Analysis
- TOP 3 Conversion-Killer identifizieren
- Quick Wins für diese Woche
- Mobile UX Probleme

### 2. SEO Analyse
- Meta-Tags Bewertung (Title, Description)
- Heading-Struktur (H1, H2, H3)
- Interne Verlinkung
- Schema.org Markup

### 3. Performance & Code
- HTML-Struktur Bewertung
- Semantisches HTML
- Accessibility-Basics (ARIA, Alt-Tags)

### 4. UX/Conversion
- Call-to-Action Klarheit
- Formular-Usability
- Trust-Elemente
- Mobile Responsiveness

## Ausgabeformat

Für jeden Bereich:
| Problem | Impact | Lösung | Aufwand |
|---------|--------|--------|---------|
| ... | Hoch/Mittel/Niedrig | Konkrete Anweisung | Stunden |

### Executive Summary
- 🔴 Kritisch (sofort beheben)
- 🟡 Wichtig (diese Woche)
- 🟢 Nice-to-have (Backlog)

### ROI-Schätzung
- Geschätzter Conversion-Uplift
- Potenzielle Umsatzsteigerung`;

    // Prepare messages array
    const messages: any[] = [
      { role: 'system', content: systemPrompt },
    ];

    // If we have a screenshot, include it as an image
    if (screenshotBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          { 
            type: 'image_url', 
            image_url: { 
              url: screenshotBase64.startsWith('data:') 
                ? screenshotBase64 
                : `data:image/png;base64,${screenshotBase64}` 
            } 
          }
        ]
      });
    } else {
      messages.push({ role: 'user', content: userPrompt });
    }

    console.log('Calling Lovable AI Gateway...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit erreicht. Bitte versuche es in einer Minute erneut.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI-Guthaben aufgebraucht. Bitte Credits aufladen.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysisResult = data.choices?.[0]?.message?.content;

    if (!analysisResult) {
      throw new Error('Keine Analyse erhalten');
    }

    console.log('Analysis complete!');

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisResult,
        model: 'google/gemini-2.5-flash',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-website-analyze:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unbekannter Fehler' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
