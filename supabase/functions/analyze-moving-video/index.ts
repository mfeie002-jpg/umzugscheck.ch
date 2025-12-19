import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const isDev = Deno.env.get('ENVIRONMENT') === 'development';
const log = {
  info: (msg: string, data?: any) => isDev && console.log(`[INFO] ${msg}`, data || ''),
  error: (msg: string, error?: any) => console.error(`[ERROR] ${msg}`, error instanceof Error ? error.message : error),
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client for rate limiting
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Rate limiting check
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    const { data: rateLimitData, error: rateLimitError } = await supabaseClient.rpc('check_rate_limit', {
      p_identifier: clientIp,
      p_action_type: 'ai_video_analysis',
      p_max_attempts: 3,
      p_window_minutes: 60
    });

    if (rateLimitError || !rateLimitData) {
      log.error('Rate limit exceeded', { ip: clientIp });
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { video } = await req.json();
    
    if (!video) {
      return new Response(
        JSON.stringify({ error: 'No video provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate video size (base64 encoded)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (video.length > maxSize) {
      return new Response(
        JSON.stringify({ error: 'Video size exceeds 50MB limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    log.info('Analyzing video');

    // Call Lovable AI with vision model for video analysis
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: "text",
                text: `Du bist ein professioneller Umzugsvolumen-Schätzer für Schweizer Umzugsfirmen. Analysiere dieses Video/Bild einer Wohnung und erstelle eine detaillierte Inventarliste.

Deine Aufgaben:
1. Identifiziere alle sichtbaren Räume
2. Zähle alle Möbelstücke und grossen Gegenstände in jedem Raum
3. Schätze das Gesamtvolumen in Kubikmetern (m³)
4. Schätze den Zeitaufwand in Minuten für den Umzug (inkl. Tragen, Verladen, Transport)
5. Erstelle eine detaillierte Item-Liste mit Kategorien und Mengen

Antworte NUR mit einem gültigen JSON-Objekt in diesem Format:
{
  "volume_m3": 25,
  "estimated_effort_min": 240,
  "confidence": 0.85,
  "rooms_detected": ["Wohnzimmer", "Schlafzimmer", "Küche"],
  "items": [
    {"category": "Sofa", "quantity": 1, "icon": "sofa", "volume_per_item": 1.5},
    {"category": "Bett", "quantity": 2, "icon": "bed", "volume_per_item": 2.0},
    {"category": "Kleiderschrank", "quantity": 2, "icon": "wardrobe", "volume_per_item": 2.5},
    {"category": "Esstisch", "quantity": 1, "icon": "table", "volume_per_item": 1.2},
    {"category": "Stühle", "quantity": 6, "icon": "chair", "volume_per_item": 0.3},
    {"category": "Sessel", "quantity": 2, "icon": "armchair", "volume_per_item": 0.8},
    {"category": "TV/Monitor", "quantity": 1, "icon": "tv", "volume_per_item": 0.3},
    {"category": "Bücherregal", "quantity": 1, "icon": "bookshelf", "volume_per_item": 0.8},
    {"category": "Kommoden", "quantity": 2, "icon": "dresser", "volume_per_item": 0.6},
    {"category": "Umzugskartons (geschätzt)", "quantity": 20, "icon": "box", "volume_per_item": 0.06}
  ],
  "special_items": ["Klavier", "Aquarium"],
  "difficulty_notes": "Enge Treppe sichtbar"
}

Wichtig:
- volume_m3: Gesamtvolumen aller Gegenstände
- estimated_effort_min: Geschätzter Zeitaufwand in Minuten (typisch: 4-8 Stunden für eine 3-Zimmer-Wohnung)
- items: Detaillierte Liste mit icon-Namen (sofa, bed, wardrobe, table, chair, armchair, tv, bookshelf, dresser, box, lamp, plant, fridge, washer)
- Sei realistisch und präzise für Schweizer Wohnungen`
              },
              {
                type: "image_url",
                image_url: {
                  url: video
                }
              }
            ]
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      log.error('AI Gateway error', { status: aiResponse.status, errorText });
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    log.info('AI response received');

    const analysisText = aiData.choices[0].message.content;
    log.info('Analysis complete');

    // Parse JSON from the response
    let analysis;
    try {
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || 
                       analysisText.match(/```\n([\s\S]*?)\n```/) ||
                       analysisText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        analysis = JSON.parse(jsonStr);
      } else {
        analysis = JSON.parse(analysisText);
      }

      // Ensure required fields exist
      analysis.id = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      analysis.volume_m3 = analysis.volume_m3 || analysis.estimatedVolumeM3 || 30;
      analysis.estimated_effort_min = analysis.estimated_effort_min || 240;
      analysis.confidence = analysis.confidence || 0.7;
      analysis.items = analysis.items || [];
      
    } catch (parseError) {
      log.error('Failed to parse AI response', parseError);
      
      // Return a fallback response with the new structure
      analysis = {
        id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        volume_m3: 30,
        estimated_effort_min: 300,
        confidence: 0.5,
        rooms_detected: ["Wohnzimmer", "Schlafzimmer"],
        items: [
          { category: "Sofa", quantity: 1, icon: "sofa", volume_per_item: 1.5 },
          { category: "Bett", quantity: 2, icon: "bed", volume_per_item: 2.0 },
          { category: "Kleiderschrank", quantity: 2, icon: "wardrobe", volume_per_item: 2.5 },
          { category: "Esstisch", quantity: 1, icon: "table", volume_per_item: 1.2 },
          { category: "Stühle", quantity: 4, icon: "chair", volume_per_item: 0.3 },
          { category: "Umzugskartons (geschätzt)", quantity: 20, icon: "box", volume_per_item: 0.06 }
        ],
        note: "Analyse konnte nicht vollständig verarbeitet werden. Bitte überprüfen Sie die Werte."
      };
    }

    return new Response(
      JSON.stringify({ success: true, data: analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    log.error('Error in analyze-moving-video', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
