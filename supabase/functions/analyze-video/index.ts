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
  special_handling_notes?: string;
  dimensions?: { width: number; height: number; depth: number };
}

interface AnalysisResult {
  items: AnalysisItem[];
  rooms: { name: string; item_count: number; volume_m3: number }[];
  total_volume_m3: number;
  total_weight_kg: number;
  estimated_boxes: number;
  estimated_hours: number;
  recommended_truck_size: 'transporter' | 'small' | 'medium' | 'large' | 'xl';
  recommended_crew_size: number;
  fragility_score: number;
  price_min: number;
  price_max: number;
  summary: string;
  confidence_score: number;
  special_handling_items: string[];
  accessibility_notes: string[];
}

// Enhanced prompt for better accuracy
const SYSTEM_PROMPT = `Du bist ein Schweizer Umzugsexperte mit 20+ Jahren Erfahrung. Analysiere die Bilder einer Wohnung SEHR GENAU und erstelle ein präzises Inventar.

## KRITISCHE ANWEISUNGEN:
1. ZÄHLE JEDEN EINZELNEN GEGENSTAND - keine Schätzungen!
2. Achte auf VERSTECKTE Gegenstände (in Schränken, hinter Türen, gestapelt)
3. Berücksichtige ALLE Räume die du siehst
4. Bei Unsicherheit: LIEBER MEHR als weniger schätzen (Kunde bevorzugt das)

## KATEGORIEN (wähle präzise):
- furniture: Sofas, Betten, Schränke, Tische, Stühle, Kommoden, Regale
- electronics: TV, Computer, Drucker, Haushaltsgeräte
- fragile: Glas, Spiegel, Kunstwerke, Lampen, Porzellan
- heavy: Klavier, Tresor, Fitnessgeräte, Waschmaschine
- plants: Zimmerpflanzen (beachte Höhe!)
- art: Gemälde, Skulpturen, Sammlerstücke
- boxes: Kartons, Kisten, Behälter
- other: Alles andere

## SPEZIALHANDLING ERFORDERLICH FÜR:
- Klaviere/Flügel → Spezialisten nötig
- Antiquitäten → Versicherung, extra Polsterung
- Grosse Pflanzen → Klimakontrolle
- Aquarien → Wassertransport
- Tresore → Schwerlast
- Kunstwerke → Klimakiste
- Elektronik > 65" → Originalverpackung empfohlen

## VOLUMEN-RICHTLINIEN (m³):
- 3-Sitzer Sofa: 1.5-2.0
- Doppelbett mit Matratze: 1.0-1.5
- Kleiderschrank gross: 1.5-2.5
- Esstisch 6 Personen: 0.5-0.8
- Bürostuhl: 0.3-0.4
- Fernseher 55": 0.15
- Waschmaschine: 0.4
- Umzugskarton gross: 0.08
- Zimmerpflanze: 0.1-0.5

## GEWICHT-RICHTLINIEN (kg):
- Sofa: 50-100
- Doppelbett: 80-150
- Kleiderschrank voll: 100-200
- Waschmaschine: 70-90
- Kühlschrank: 60-100
- Klavier: 200-350

## PREISBERECHNUNG (CHF, Schweizer Markt 2024):
Basispreis pro m³: 60-80 CHF
+ Etagenzuschlag ohne Lift: 30 CHF pro Etage
+ Fragile Gegenstände: +15%
+ Schwere Gegenstände: +20%
+ Klavier: +300-500 CHF pauschal
+ Wochenendaufschlag: +20%

## TRUCK-EMPFEHLUNG:
- bis 15m³: transporter
- 15-25m³: small (3.5t)
- 25-40m³: medium (7.5t)
- 40-60m³: large (12t)
- 60+m³: xl (18t+)

## TEAM-EMPFEHLUNG:
- bis 20m³: 2 Personen
- 20-40m³: 3 Personen
- 40-60m³: 4 Personen
- 60+m³: 5+ Personen

WICHTIG: Gib bei JEDEM Item einen confidence score (0-1). Unter 0.7 = "manuell prüfen" vermerken.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analysis_id, video_url, frame_urls, move_project_id } = await req.json();
    
    console.log(`[Relo-OS] Starting enhanced video analysis for: ${analysis_id}`);
    
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

    const imageUrls = frame_urls && frame_urls.length > 0 ? frame_urls : [];
    const hasImages = imageUrls.length > 0;

    // Build user content with multi-frame support
    const userContent: any[] = [];
    
    if (hasImages) {
      userContent.push({
        type: "text",
        text: `Analysiere diese ${imageUrls.length} Bilder einer Wohnung für einen Schweizer Umzug. 
        
Erstelle ein VOLLSTÄNDIGES Inventar mit:
- Jedem sichtbaren Möbelstück
- Geschätzten Kartons für Kleinkram
- Spezialgegenständen die besondere Behandlung brauchen

Die Bilder zeigen verschiedene Räume/Winkel. Vermeide Duplikate wenn dasselbe Item in mehreren Bildern erscheint.`
      });
      
      // Add all frames (max 20 for better analysis)
      for (const url of imageUrls.slice(0, 20)) {
        userContent.push({
          type: "image_url",
          image_url: { url, detail: "high" }
        });
      }
    } else {
      userContent.push({
        type: "text",
        text: `Keine Bilder bereitgestellt. Erstelle ein realistisches Beispiel-Inventar für eine typische Schweizer 3.5-Zimmer-Wohnung (ca. 75m² Wohnfläche) mit:
- Wohnzimmer, Schlafzimmer, Kinderzimmer/Büro, Küche, Bad
- Typische Schweizer Möblierung (IKEA-Niveau)
- Ca. 30-40 Einzelitems
- Realistisches Volumen von 25-35m³`
      });
    }

    console.log(`[Relo-OS] Calling AI with ${imageUrls.length} frames...`);

    // Call Lovable AI Gateway with enhanced tool calling
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
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
                        quantity: { type: "number", minimum: 1 },
                        weight_kg: { type: "number", minimum: 0.1 },
                        volume_m3: { type: "number", minimum: 0.01 },
                        room_name: { type: "string" },
                        confidence: { type: "number", minimum: 0, maximum: 1 },
                        requires_special_handling: { type: "boolean" },
                        special_handling_notes: { type: "string" },
                        dimensions: {
                          type: "object",
                          properties: {
                            width: { type: "number" },
                            height: { type: "number" },
                            depth: { type: "number" }
                          }
                        }
                      },
                      required: ["name", "category", "quantity", "weight_kg", "volume_m3", "confidence", "requires_special_handling"]
                    }
                  },
                  rooms: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        item_count: { type: "number" },
                        volume_m3: { type: "number" }
                      },
                      required: ["name", "item_count", "volume_m3"]
                    }
                  },
                  total_volume_m3: { type: "number" },
                  total_weight_kg: { type: "number" },
                  estimated_boxes: { type: "number" },
                  estimated_hours: { type: "number" },
                  recommended_truck_size: { type: "string", enum: ["transporter", "small", "medium", "large", "xl"] },
                  recommended_crew_size: { type: "number", minimum: 2, maximum: 8 },
                  fragility_score: { type: "number", minimum: 0, maximum: 100 },
                  price_min: { type: "number" },
                  price_max: { type: "number" },
                  summary: { type: "string" },
                  confidence_score: { type: "number", minimum: 0, maximum: 1 },
                  special_handling_items: { type: "array", items: { type: "string" } },
                  accessibility_notes: { type: "array", items: { type: "string" } }
                },
                required: [
                  "items", "rooms", "total_volume_m3", "total_weight_kg", 
                  "estimated_boxes", "estimated_hours", "recommended_truck_size",
                  "recommended_crew_size", "fragility_score", "price_min", 
                  "price_max", "summary", "confidence_score",
                  "special_handling_items", "accessibility_notes"
                ]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_inventory" } },
        temperature: 0.3 // Lower for more consistent results
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("[Relo-OS] AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded. Bitte versuche es später erneut.");
      }
      if (aiResponse.status === 402) {
        throw new Error("Credits erschöpft. Bitte Workspace aufladen.");
      }
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log("[Relo-OS] AI Response received, parsing...");

    // Extract structured result
    let analysisResult: AnalysisResult;
    
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        analysisResult = JSON.parse(toolCall.function.arguments);
        console.log(`[Relo-OS] Parsed ${analysisResult.items.length} items, ${analysisResult.total_volume_m3}m³`);
      } catch (parseError) {
        console.error("[Relo-OS] Failed to parse tool response:", parseError);
        throw new Error("Failed to parse AI response");
      }
    } else {
      console.warn("[Relo-OS] No tool call found, using fallback");
      analysisResult = generateFallbackResult();
    }

    // Validate and enhance result
    analysisResult = validateAndEnhanceResult(analysisResult);

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
        manually_verified: item.confidence < 0.7 ? false : null, // Flag low-confidence items
        notes: item.special_handling_notes || null
      }));

      const { error: insertError } = await supabase
        .from('video_analysis_items')
        .insert(itemsToInsert);

      if (insertError) {
        console.error("[Relo-OS] Error inserting items:", insertError);
      } else {
        console.log(`[Relo-OS] Saved ${itemsToInsert.length} items to database`);
      }
    }

    // Update the analysis record with enhanced data
    const roomNames = analysisResult.rooms.map(r => r.name);
    
    const { error: updateError } = await supabase
      .from('video_analyses')
      .update({
        status: 'analyzed',
        rooms: roomNames,
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
      console.error("[Relo-OS] Error updating analysis:", updateError);
      throw updateError;
    }

    // If linked to a move_project, update the digital twin
    if (move_project_id) {
      await updateMoveProjectDigitalTwin(supabase, move_project_id, analysisResult);
    }

    // Send notification
    try {
      await supabase.functions.invoke('send-analysis-notification', {
        body: { analysis_id, type: 'completed' }
      });
    } catch (notifyError) {
      console.error("[Relo-OS] Notification failed:", notifyError);
    }

    console.log(`[Relo-OS] Analysis complete: ${analysisResult.items.length} items, CHF ${analysisResult.price_min}-${analysisResult.price_max}`);

    return new Response(
      JSON.stringify({
        success: true,
        analysis_id,
        result: analysisResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("[Relo-OS] Analysis error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unbekannter Fehler' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper: Generate fallback result for edge cases
function generateFallbackResult(): AnalysisResult {
  return {
    items: [
      { name: "Sofa 3-Sitzer", category: "furniture", quantity: 1, weight_kg: 70, volume_m3: 1.8, room_name: "Wohnzimmer", confidence: 0.5, requires_special_handling: false },
      { name: "Doppelbett", category: "furniture", quantity: 1, weight_kg: 100, volume_m3: 1.2, room_name: "Schlafzimmer", confidence: 0.5, requires_special_handling: false },
      { name: "Kleiderschrank", category: "furniture", quantity: 1, weight_kg: 120, volume_m3: 2.0, room_name: "Schlafzimmer", confidence: 0.5, requires_special_handling: false },
      { name: "Esstisch", category: "furniture", quantity: 1, weight_kg: 40, volume_m3: 0.6, room_name: "Wohnzimmer", confidence: 0.5, requires_special_handling: false },
      { name: "Stühle", category: "furniture", quantity: 4, weight_kg: 20, volume_m3: 0.6, room_name: "Wohnzimmer", confidence: 0.5, requires_special_handling: false },
      { name: "Umzugskartons (geschätzt)", category: "boxes", quantity: 30, weight_kg: 450, volume_m3: 2.4, room_name: "Diverse", confidence: 0.3, requires_special_handling: false },
    ],
    rooms: [
      { name: "Wohnzimmer", item_count: 3, volume_m3: 3.0 },
      { name: "Schlafzimmer", item_count: 2, volume_m3: 3.2 },
      { name: "Diverse", item_count: 1, volume_m3: 2.4 }
    ],
    total_volume_m3: 30,
    total_weight_kg: 2000,
    estimated_boxes: 35,
    estimated_hours: 5,
    recommended_truck_size: "medium",
    recommended_crew_size: 3,
    fragility_score: 25,
    price_min: 1200,
    price_max: 1800,
    summary: "⚠️ Automatische Analyse konnte nicht vollständig durchgeführt werden. Bitte manuell überprüfen. Dies ist eine Schätzung für eine typische 3.5-Zimmer-Wohnung.",
    confidence_score: 0.35,
    special_handling_items: [],
    accessibility_notes: ["Bitte Zugangssituation manuell prüfen"]
  };
}

// Helper: Validate and enhance analysis result
function validateAndEnhanceResult(result: AnalysisResult): AnalysisResult {
  // Ensure minimum values
  result.total_volume_m3 = Math.max(result.total_volume_m3, 5);
  result.total_weight_kg = Math.max(result.total_weight_kg, 200);
  result.estimated_boxes = Math.max(result.estimated_boxes, 10);
  result.estimated_hours = Math.max(result.estimated_hours, 2);
  result.recommended_crew_size = Math.max(result.recommended_crew_size, 2);
  
  // Validate price range
  if (result.price_min >= result.price_max) {
    result.price_max = result.price_min * 1.4;
  }
  
  // Ensure minimum prices based on volume (Swiss market)
  const minPricePerM3 = 55;
  const calculatedMinPrice = result.total_volume_m3 * minPricePerM3;
  if (result.price_min < calculatedMinPrice) {
    result.price_min = Math.round(calculatedMinPrice);
    result.price_max = Math.round(calculatedMinPrice * 1.5);
  }
  
  // Add platform fee
  result.price_min += 49;
  result.price_max += 49;
  
  // Round prices
  result.price_min = Math.round(result.price_min / 10) * 10;
  result.price_max = Math.round(result.price_max / 10) * 10;
  
  return result;
}

// Helper: Update move project with digital twin data
async function updateMoveProjectDigitalTwin(
  supabase: any, 
  projectId: string, 
  result: AnalysisResult
) {
  try {
    const digitalTwin = {
      rooms: result.rooms.map(r => ({
        id: crypto.randomUUID(),
        name: r.name,
        type: r.name.toLowerCase(),
        items: result.items
          .filter(i => i.room_name === r.name)
          .map(i => ({
            id: crypto.randomUUID(),
            name: i.name,
            category: i.category,
            volume: i.volume_m3,
            weight: i.weight_kg,
            fragility: i.requires_special_handling ? 'high' : 'low',
            specialHandling: i.special_handling_notes ? [i.special_handling_notes] : undefined,
            confidence: i.confidence
          })),
        volume: r.volume_m3,
        weight: result.items
          .filter(i => i.room_name === r.name)
          .reduce((sum, i) => sum + i.weight_kg, 0),
        scanConfidence: result.confidence_score
      })),
      totalVolume: result.total_volume_m3,
      totalWeight: result.total_weight_kg,
      totalItems: result.items.reduce((sum, i) => sum + i.quantity, 0),
      estimatedBoxes: result.estimated_boxes,
      recommendedTruckSize: result.recommended_truck_size,
      recommendedCrewSize: result.recommended_crew_size,
      estimatedDuration: result.estimated_hours,
      fragilityScore: result.fragility_score,
      specialHandling: result.special_handling_items,
      confidence: result.confidence_score,
      scannedAt: new Date().toISOString()
    };

    await supabase
      .from('move_projects')
      .update({
        digital_twin: digitalTwin,
        total_volume: result.total_volume_m3,
        total_weight: result.total_weight_kg,
        status: 'quote_ready'
      })
      .eq('id', projectId);

    console.log(`[Relo-OS] Updated move project ${projectId} with digital twin`);
  } catch (error) {
    console.error(`[Relo-OS] Failed to update move project:`, error);
  }
}
