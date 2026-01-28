import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, context } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "AI Gateway not configured",
          response: generateFallbackResponse(prompt, context)
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const systemPrompt = `Du bist ein Senior UX/Conversion-Experte für den Schweizer Umzugsmarkt.
Du analysierst umzugscheck.ch und gibst konkrete, umsetzbare Empfehlungen.

Kontext:
- Projekt: ${context?.projectName || 'Umzugscheck.ch'}
- URL: ${context?.projectUrl || 'https://umzugscheck.ch'}
- Markt: ${context?.market || 'Swiss Moving Industry'}
- Hauptziel: ${context?.primaryGoal || 'Lead Generation'}

Antworte auf Deutsch. Sei konkret und priorisiere nach Impact.
Verwende Markdown-Formatierung für bessere Lesbarkeit.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Rate limit exceeded",
            response: generateFallbackResponse(prompt, context)
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "AI gateway error",
          response: generateFallbackResponse(prompt, context)
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: content || "Keine Antwort erhalten" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI analysis error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        response: "Analyse fehlgeschlagen. Bitte versuche es erneut."
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

function generateFallbackResponse(prompt: string, context: any): string {
  // Provide a helpful fallback based on the prompt type
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('conversion') || promptLower.includes('cta')) {
    return `## Conversion-Analyse (Demo)

### Aktuelle Stärken ✅
- Klare Value Proposition im Hero-Bereich
- Trust-Signale (Bewertungen, Zertifikate) vorhanden
- Mobile-responsive Design

### Verbesserungspotenzial ⚠️
1. **Sticky CTA**: Auf Mobile fehlt ein permanenter Action-Button
2. **Form-Vereinfachung**: Multi-Step statt Einzel-Formular empfohlen
3. **Exit-Intent**: Keine Popup-Strategie für abbrechende Nutzer

### Quick Wins 🚀
- "Gratis & unverbindlich" Badge neben CTAs
- Live-Aktivitäts-Indikator ("23 Anfragen heute")
- Sticky Footer mit primärem CTA

*Demo-Analyse. Verbinde Lovable AI für echte Analyse.*`;
  }
  
  if (promptLower.includes('seo')) {
    return `## SEO-Analyse (Demo)

### Stärken ✅
- Gute regionale Seiten-Struktur
- Meta-Tags auf Hauptseiten vorhanden
- Schema.org Markup implementiert

### Verbesserungen ⚠️
1. **Meta Descriptions**: Einige Seiten haben generische Texte
2. **Interne Verlinkung**: Hub-Spoke-Modell optimierbar
3. **Content-Tiefe**: Ratgeber-Artikel könnten länger sein

### Quick Wins 🚀
- FAQ-Schema auf Hauptseiten
- Regionale H1-Tags optimieren
- Alt-Texte für alle Bilder

*Demo-Analyse. Verbinde Lovable AI für echte Analyse.*`;
  }
  
  if (promptLower.includes('trust')) {
    return `## Trust-Analyse (Demo)

### Swiss Trust Triumvirate

**Institutional Trust (Score: 75%)**
- ✅ Schweizer Impressum
- ✅ UID vorhanden
- ⚠️ ASTAG-Badge nicht prominent

**Social Trust (Score: 80%)**
- ✅ Google Reviews integriert
- ⚠️ Team-Fotos fehlen
- ⚠️ Keine Video-Testimonials

**Process Trust (Score: 70%)**
- ✅ Datenschutz kommuniziert
- ⚠️ Antwortzeit-Versprechen fehlt
- ⚠️ Keine Abgabegarantie sichtbar

*Demo-Analyse. Verbinde Lovable AI für echte Analyse.*`;
  }
  
  return `## Analyse-Ergebnis (Demo)

Die AI-Analyse konnte nicht durchgeführt werden. 

### Mögliche Gründe:
- Lovable AI Gateway nicht konfiguriert
- Rate Limit erreicht
- Netzwerk-Timeout

### Nächste Schritte:
1. Prüfe ob LOVABLE_API_KEY gesetzt ist
2. Versuche es in wenigen Minuten erneut
3. Nutze den Deep Research Exporter für manuelle Analyse

*Für vollständige AI-Analyse: Settings → Lovable AI aktivieren*`;
}
