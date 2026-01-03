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
    const { feedback, pageUrl, pageName } = await req.json();

    if (!feedback) {
      return new Response(
        JSON.stringify({ error: 'Feedback is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Analyzing feedback for ${pageName} (${pageUrl})`);

    const systemPrompt = `Du bist ein Experte für Web-Analyse. Extrahiere strukturierte Daten aus dem folgenden Feedback-Text.

Deine Aufgabe:
1. Extrahiere alle genannten Issues/Probleme
2. Extrahiere Quick Wins (schnell umsetzbare Verbesserungen)
3. Extrahiere Stärken der Seite
4. Extrahiere konkrete Empfehlungen
5. Schätze Scores (0-100) für folgende Kategorien basierend auf dem Feedback:
   - SEO Score
   - Mobile Score
   - Performance Score
   - Conversion Score
   - Trust Score
   - UX Score
   - Accessibility Score
   - Overall Score (Durchschnitt oder gewichteter Wert)

Antworte NUR mit dem JSON-Objekt, keine Erklärungen.`;

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
          { role: 'user', content: `Analysiere dieses Feedback für die Landing Page "${pageName}" (${pageUrl}):\n\n${feedback}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_feedback_data",
              description: "Extrahiere strukturierte Daten aus dem Feedback",
              parameters: {
                type: "object",
                properties: {
                  issues: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Kurzer Titel des Problems" },
                        description: { type: "string", description: "Beschreibung des Problems" },
                        severity: { type: "string", enum: ["critical", "warning", "info"], description: "Schweregrad" },
                        category: { type: "string", enum: ["seo", "mobile", "performance", "conversion", "trust", "ux", "accessibility", "content"], description: "Kategorie" },
                        effort: { type: "string", enum: ["low", "medium", "high"], description: "Aufwand zur Behebung" }
                      },
                      required: ["title", "severity", "category"]
                    }
                  },
                  quick_wins: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        estimated_time: { type: "string", description: "Geschätzte Zeit (z.B. '30 Min', '2 Std')" },
                        impact: { type: "string", enum: ["low", "medium", "high"] }
                      },
                      required: ["title"]
                    }
                  },
                  strengths: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" }
                      },
                      required: ["title"]
                    }
                  },
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
                        category: { type: "string" }
                      },
                      required: ["title", "priority"]
                    }
                  },
                  scores: {
                    type: "object",
                    properties: {
                      overall: { type: "number", minimum: 0, maximum: 100 },
                      seo: { type: "number", minimum: 0, maximum: 100 },
                      mobile: { type: "number", minimum: 0, maximum: 100 },
                      performance: { type: "number", minimum: 0, maximum: 100 },
                      conversion: { type: "number", minimum: 0, maximum: 100 },
                      trust: { type: "number", minimum: 0, maximum: 100 },
                      ux: { type: "number", minimum: 0, maximum: 100 },
                      accessibility: { type: "number", minimum: 0, maximum: 100 }
                    }
                  },
                  summary: { type: "string", description: "Kurze Zusammenfassung der Analyse (2-3 Sätze)" }
                },
                required: ["issues", "quick_wins", "strengths", "recommendations", "scores", "summary"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_feedback_data" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data, null, 2));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error('No tool call result found');
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    console.log('Extracted data:', JSON.stringify(extractedData, null, 2));

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: extractedData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-feedback:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
