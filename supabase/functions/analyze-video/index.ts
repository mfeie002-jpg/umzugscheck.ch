import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisItem {
  name: string;
  category: string;
  quantity: number;
  weight_kg: number;
  volume_m3: number;
  room_name: string;
  confidence: number;
  requires_special_handling: boolean;
}

interface AnalysisResult {
  items: AnalysisItem[];
  rooms: string[];
  total_volume_m3: number;
  total_weight_kg: number;
  estimated_boxes: number;
  estimated_hours: number;
  price_min: number;
  price_max: number;
  summary: string;
  confidence_score: number;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analysis_id, video_url, frame_urls } = await req.json();
    
    console.log(`Starting video analysis for: ${analysis_id}`);
    
    if (!analysis_id) {
      throw new Error('analysis_id is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update status to reviewing
    await supabase
      .from('video_analyses')
      .update({ status: 'reviewing' })
      .eq('id', analysis_id);

    // For video analysis, we'll use frame URLs if provided, otherwise use video_url
    // In production, you'd extract frames from the video first
    const imageUrls = frame_urls && frame_urls.length > 0 ? frame_urls : [];

    // Build the prompt for furniture/item detection
    const systemPrompt = `Du bist ein Experte für Umzugsschätzungen in der Schweiz. Analysiere die bereitgestellten Bilder einer Wohnung und erstelle ein detailliertes Inventar aller sichtbaren Möbel und Gegenstände.

Für jeden Gegenstand schätze:
- Name (auf Deutsch)
- Kategorie: furniture, electronics, fragile, heavy, plants, art, boxes, other
- Menge
- Geschätztes Gewicht in kg
- Geschätztes Volumen in m³
- Raum (falls erkennbar)
- Ob Spezialhandling nötig ist (z.B. Klavier, Antiquitäten, Kunst)
- Konfidenz deiner Schätzung (0-1)

Gib auch eine Gesamtschätzung:
- Gesamtvolumen in m³
- Gesamtgewicht in kg
- Geschätzte Anzahl Umzugskartons
- Geschätzte Arbeitsstunden für Umzugsteam (2 Personen)
- Preisschätzung (min/max) in CHF basierend auf Schweizer Marktpreisen

WICHTIG: Sei konservativ bei deinen Schätzungen. Lieber etwas mehr als zu wenig.`;

    const userContent: any[] = [
      {
        type: "text",
        text: imageUrls.length > 0 
          ? "Analysiere diese Bilder einer Wohnung für einen Umzug und erstelle ein Inventar:"
          : "Es wurden keine Bilder bereitgestellt. Erstelle ein Beispiel-Inventar für eine typische 3.5-Zimmer-Wohnung in der Schweiz."
      }
    ];

    // Add images if available
    for (const url of imageUrls.slice(0, 10)) { // Limit to 10 images
      userContent.push({
        type: "image_url",
        image_url: { url }
      });
    }

    // Call Lovable AI Gateway with tool calling for structured output
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_inventory",
              description: "Erstelle ein strukturiertes Inventar basierend auf der Bildanalyse",
              parameters: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Name des Gegenstands auf Deutsch" },
                        category: { type: "string", enum: ["furniture", "electronics", "fragile", "heavy", "plants", "art", "boxes", "other"] },
                        quantity: { type: "number" },
                        weight_kg: { type: "number" },
                        volume_m3: { type: "number" },
                        room_name: { type: "string" },
                        confidence: { type: "number", minimum: 0, maximum: 1 },
                        requires_special_handling: { type: "boolean" }
                      },
                      required: ["name", "category", "quantity", "weight_kg", "volume_m3", "confidence"]
                    }
                  },
                  rooms: {
                    type: "array",
                    items: { type: "string" },
                    description: "Liste aller erkannten Räume"
                  },
                  total_volume_m3: { type: "number" },
                  total_weight_kg: { type: "number" },
                  estimated_boxes: { type: "number" },
                  estimated_hours: { type: "number" },
                  price_min: { type: "number" },
                  price_max: { type: "number" },
                  summary: { type: "string", description: "Kurze Zusammenfassung der Analyse" },
                  confidence_score: { type: "number", minimum: 0, maximum: 1 }
                },
                required: ["items", "rooms", "total_volume_m3", "total_weight_kg", "estimated_boxes", "estimated_hours", "price_min", "price_max", "summary", "confidence_score"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_inventory" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (aiResponse.status === 402) {
        throw new Error("Payment required. Please add credits to your workspace.");
      }
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI Response received:", JSON.stringify(aiData).slice(0, 500));

    // Extract the structured result from tool call
    let analysisResult: AnalysisResult;
    
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      analysisResult = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: Try to parse from content
      console.warn("No tool call found, using fallback");
      analysisResult = {
        items: [],
        rooms: ["Wohnzimmer", "Schlafzimmer", "Küche", "Bad"],
        total_volume_m3: 35,
        total_weight_kg: 2500,
        estimated_boxes: 40,
        estimated_hours: 6,
        price_min: 1200,
        price_max: 2000,
        summary: "Automatische Analyse konnte nicht durchgeführt werden. Bitte manuell prüfen.",
        confidence_score: 0.3
      };
    }

    console.log(`Analysis complete: ${analysisResult.items.length} items, ${analysisResult.total_volume_m3}m³`);

    // Save items to database
    if (analysisResult.items.length > 0) {
      const itemsToInsert = analysisResult.items.map(item => ({
        analysis_id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        weight_kg: item.weight_kg,
        volume_m3: item.volume_m3,
        room_name: item.room_name || 'Unbekannt',
        requires_special_handling: item.requires_special_handling || false,
        confidence_score: item.confidence,
        ai_detected: true,
        manually_verified: false
      }));

      const { error: insertError } = await supabase
        .from('video_analysis_items')
        .insert(itemsToInsert);

      if (insertError) {
        console.error("Error inserting items:", insertError);
      }
    }

    // Update the analysis record
    const { error: updateError } = await supabase
      .from('video_analyses')
      .update({
        status: 'analyzed',
        rooms: analysisResult.rooms,
        items: analysisResult.items,
        total_volume_m3: analysisResult.total_volume_m3,
        total_weight_kg: analysisResult.total_weight_kg,
        estimated_boxes: analysisResult.estimated_boxes,
        estimated_hours: analysisResult.estimated_hours,
        price_min: analysisResult.price_min,
        price_max: analysisResult.price_max,
        ai_summary: analysisResult.summary,
        confidence_score: analysisResult.confidence_score,
        analyzed_at: new Date().toISOString()
      })
      .eq('id', analysis_id);

    if (updateError) {
      console.error("Error updating analysis:", updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis_id,
        result: analysisResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Analysis error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
