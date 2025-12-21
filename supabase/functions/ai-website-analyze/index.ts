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
      analysisType = 'complete',
      pageCount = 1,
      analyzedPages = []
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Starting ${analysisType} analysis for: ${projectUrl} (${pageCount} page(s))`);
    if (analyzedPages.length > 0) {
      console.log(`Analyzed pages: ${analyzedPages.join(', ')}`);
    }

    // Build the analysis prompt based on type
    const systemPrompt = `Du bist ein erfahrener Web-Analyst, UX-Experte und Conversion-Spezialist. 
Analysiere Websites gründlich und gib actionable, priorisierte Empfehlungen.
Antworte auf Deutsch. Sei konkret und gib Aufwand-Schätzungen in Stunden.`;

    let userPrompt = `# Website-Analyse für ${projectName || 'Unbekanntes Projekt'}

## Projekt-Details
- **URL:** ${projectUrl}
- **Beschreibung:** ${description || 'Keine Beschreibung angegeben'}
- **Ziele:** ${goals || 'Lead-Generierung, Conversion-Optimierung'}
- **Zielgruppe:** ${targetAudience || 'Nicht spezifiziert'}
- **Konkurrenten:** ${competitors || 'Nicht angegeben'}
- **Analysierte Seiten:** ${pageCount}
`;

    // Add page URLs if available
    if (analyzedPages && analyzedPages.length > 0) {
      userPrompt += `\n### Erfasste Seiten:\n`;
      analyzedPages.forEach((url: string, i: number) => {
        userPrompt += `${i + 1}. ${url}\n`;
      });
    }

    userPrompt += '\n';

    // Add HTML content if provided
    if (htmlContent) {
      const truncatedHtml = htmlContent.substring(0, 20000);
      userPrompt += `## HTML-Analyse
Hier ist der HTML-Code der analysierten Seite(n) (bis 20.000 Zeichen):

\`\`\`html
${truncatedHtml}
\`\`\`

`;
    }

    userPrompt += `## Deine Aufgaben

### 1. Executive Summary (Kurz & Knapp)
- Gesamteindruck in 2-3 Sätzen
- Wichtigster Handlungsbedarf

### 2. Quick Analysis
- **TOP 3 Conversion-Killer** (was hindert Nutzer am Abschluss?)
- **Quick Wins** für diese Woche (max. 2h Aufwand pro Item)
- **Mobile UX Probleme** (kritisch für Conversion)

### 3. SEO Analyse
- Meta-Tags Bewertung (Title, Description, OG-Tags)
- Heading-Struktur (H1 vorhanden? H2/H3 Hierarchie?)
- Interne Verlinkung (Navigation, Breadcrumbs, Footer)
- Schema.org Markup (vorhanden? korrekt?)

### 4. Performance & Code
- HTML-Struktur Bewertung
- Semantisches HTML (richtige Tags?)
- Accessibility-Basics (ARIA-Labels, Alt-Tags, Kontrast)
- Ladezeit-Indikatoren (große Bilder, inline CSS/JS?)

### 5. UX/Conversion
- Call-to-Action Klarheit & Platzierung
- Formular-Usability (falls vorhanden)
- Trust-Elemente (Bewertungen, Zertifikate, Garantien)
- Mobile Responsiveness
- Above-the-fold Optimierung

### 6. Wettbewerbsvergleich (falls Konkurrenten angegeben)
- Was machen Konkurrenten besser?
- Was können wir übernehmen?

## Ausgabeformat

### Priorisierte Issue-Liste
| # | Problem | Impact | Lösung | Aufwand |
|---|---------|--------|--------|---------|
| 1 | ... | 🔴 Hoch | Konkrete Anweisung | X Stunden |
| 2 | ... | 🟡 Mittel | ... | X Stunden |
| 3 | ... | 🟢 Niedrig | ... | X Stunden |

### Kategorisierte Zusammenfassung
- 🔴 **Kritisch** (sofort beheben, hoher Impact)
- 🟡 **Wichtig** (diese Woche, mittlerer Impact)
- 🟢 **Nice-to-have** (Backlog, niedriger Impact)

### ROI-Schätzung
- Geschätzter Conversion-Uplift bei Umsetzung
- Potenzielle monatliche Umsatzsteigerung (falls möglich)

### Nächste Schritte
1. [Wichtigste Aktion]
2. [Zweitwichtigste Aktion]
3. [Drittwichtigste Aktion]`;

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

    console.log('Calling Lovable AI Gateway with google/gemini-2.5-flash...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: 6000,
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

    console.log(`Analysis complete! ${pageCount} page(s) analyzed.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisResult,
        model: 'google/gemini-2.5-flash',
        pageCount,
        analyzedPages,
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
