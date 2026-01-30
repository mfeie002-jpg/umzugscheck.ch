import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Tool definition for structured sentiment extraction
const SENTIMENT_TOOL = {
  type: "function",
  function: {
    name: "analyze_review",
    description: "Analyze a moving company review and extract structured sentiment data",
    parameters: {
      type: "object",
      properties: {
        overall_sentiment: {
          type: "number",
          description: "Overall sentiment from -1.0 (very negative) to +1.0 (very positive)",
        },
        categories: {
          type: "object",
          properties: {
            punctuality: {
              type: "number",
              description: "Score 0-10 for punctuality/timeliness",
            },
            professionalism: {
              type: "number",
              description: "Score 0-10 for professionalism of staff",
            },
            value_for_money: {
              type: "number",
              description: "Score 0-10 for value/price ratio",
            },
            communication: {
              type: "number",
              description: "Score 0-10 for communication quality",
            },
            care_with_items: {
              type: "number",
              description: "Score 0-10 for care with belongings",
            },
          },
          required: ["punctuality", "professionalism", "value_for_money", "communication", "care_with_items"],
        },
        positive_keywords: {
          type: "array",
          items: { type: "string" },
          description: "Key positive aspects mentioned (max 5)",
        },
        negative_keywords: {
          type: "array",
          items: { type: "string" },
          description: "Key negative aspects mentioned (max 5)",
        },
        confidence: {
          type: "number",
          description: "Confidence in analysis from 0.0 to 1.0",
        },
      },
      required: ["overall_sentiment", "categories", "positive_keywords", "negative_keywords", "confidence"],
    },
  },
};

const SYSTEM_PROMPT = `Du bist ein Experte für die Analyse von Umzugsfirmen-Bewertungen in der Schweiz.
Analysiere die gegebene Bewertung und extrahiere strukturierte Sentiment-Daten.

Bewertungskriterien:
- Pünktlichkeit: Waren sie rechtzeitig? Haben sie Termine eingehalten?
- Professionalität: Wie verhielten sich die Mitarbeiter? Kompetenz?
- Preis-Leistung: War der Preis fair für die erbrachte Leistung?
- Kommunikation: Wie war die Erreichbarkeit und Information?
- Sorgfalt: Wurde vorsichtig mit dem Umzugsgut umgegangen?

Extrahiere die wichtigsten positiven und negativen Keywords auf Deutsch.
Gib nur Kategorien eine Bewertung, die in der Review erwähnt werden.
Sei konservativ mit der Confidence wenn die Review kurz oder vage ist.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { reviewId, batchProcess } = await req.json();

    // If batch processing, get unanalyzed reviews
    let reviewsToAnalyze: any[] = [];

    if (batchProcess) {
      const { data: unanalyzedReviews, error } = await supabase
        .from("reviews")
        .select("id, provider_id, rating, title, comment")
        .not("id", "in", `(SELECT review_id FROM review_sentiments WHERE review_id IS NOT NULL)`)
        .limit(10);

      if (error) throw error;
      reviewsToAnalyze = unanalyzedReviews || [];
    } else if (reviewId) {
      const { data: review, error } = await supabase
        .from("reviews")
        .select("id, provider_id, rating, title, comment")
        .eq("id", reviewId)
        .single();

      if (error) throw error;
      if (review) reviewsToAnalyze = [review];
    }

    if (reviewsToAnalyze.length === 0) {
      return new Response(
        JSON.stringify({ success: true, analyzed: 0, message: "No reviews to analyze" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = [];

    for (const review of reviewsToAnalyze) {
      try {
        const reviewText = `
Bewertung: ${review.rating}/5 Sterne
Titel: ${review.title || "Kein Titel"}
Kommentar: ${review.comment || "Kein Kommentar"}
        `.trim();

        // Call Lovable AI Gateway with tool calling
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: reviewText },
            ],
            tools: [SENTIMENT_TOOL],
            tool_choice: { type: "function", function: { name: "analyze_review" } },
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`AI Gateway error for review ${review.id}:`, errorText);
          continue;
        }

        const aiData = await aiResponse.json();
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

        if (!toolCall || toolCall.function.name !== "analyze_review") {
          console.error(`No tool call in response for review ${review.id}`);
          continue;
        }

        const analysis = JSON.parse(toolCall.function.arguments);

        // Insert into review_sentiments
        const { error: insertError } = await supabase
          .from("review_sentiments")
          .insert({
            review_id: review.id,
            provider_id: review.provider_id,
            overall_sentiment: analysis.overall_sentiment,
            punctuality_score: analysis.categories?.punctuality,
            professionalism_score: analysis.categories?.professionalism,
            value_for_money_score: analysis.categories?.value_for_money,
            communication_score: analysis.categories?.communication,
            care_with_items_score: analysis.categories?.care_with_items,
            positive_keywords: analysis.positive_keywords || [],
            negative_keywords: analysis.negative_keywords || [],
            confidence: analysis.confidence,
            model_version: "gemini-3-flash-preview",
          });

        if (insertError) {
          console.error(`Insert error for review ${review.id}:`, insertError);
          continue;
        }

        results.push({
          reviewId: review.id,
          sentiment: analysis.overall_sentiment,
          confidence: analysis.confidence,
        });

        console.log(`Analyzed review ${review.id}: sentiment=${analysis.overall_sentiment}, confidence=${analysis.confidence}`);
      } catch (reviewError) {
        console.error(`Error analyzing review ${review.id}:`, reviewError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        analyzed: results.length,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-review-sentiment:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
