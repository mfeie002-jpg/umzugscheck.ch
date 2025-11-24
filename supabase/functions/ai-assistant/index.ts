import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();

    // Build context from conversation history
    const context = conversationHistory
      .slice(-5)
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join("\n");

    // System prompt for the AI assistant
    const systemPrompt = `Sie sind ein hilfreicher KI-Assistent für Umzugscheck.ch, eine Schweizer Umzugsvergleichsplattform.
    
Ihre Aufgaben:
- Beantworten Sie Fragen zu Umzugskosten, Preisen und Kalkulationen
- Helfen Sie Benutzern, die richtige Umzugsfirma zu finden
- Erklären Sie den Umzugsprozess und geben Sie Tipps
- Empfehlen Sie relevante Rechner (Umzugsrechner, Reinigungsrechner, etc.)
- Beantworten Sie Fragen zu Kantonen und Regionen in der Schweiz

Wichtige Informationen:
- Durchschnittliche Umzugskosten in der Schweiz: CHF 1000-2000 für 2-3 Zimmer
- Wir bieten Vergleiche von über 200 Umzugsfirmen in allen 26 Kantonen
- Unsere Rechner: Umzug, Reinigung, Entsorgung, Lagerung, Packservice, Möbelmontage
- Die Plattform ist kostenlos und unabhängig

Antworten Sie immer auf Deutsch (Schweizer Hochdeutsch) und seien Sie freundlich und hilfsbereit.`;

    // Use Lovable AI (Gemini) for response
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `${context}\n\nuser: ${message}` },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const response = aiData.choices[0].message.content;

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Assistant error:", error);
    return new Response(
      JSON.stringify({
        response: "Entschuldigung, ich konnte Ihre Anfrage nicht verarbeiten. Bitte versuchen Sie es erneut.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
