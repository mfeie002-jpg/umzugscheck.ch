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
    const { images } = await req.json();
    
    if (!images || images.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No images provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Analyzing', images.length, 'images');

    // Prepare content array with system prompt and images
    const content: any[] = [
      {
        type: "text",
        text: `You are a professional moving volume estimator. Analyze the uploaded photos of rooms and furniture to estimate moving volume and create an inventory.

Your task:
1. Identify all rooms visible in the photos
2. Count all furniture items and large objects in each room
3. Estimate the volume in cubic meters for each room
4. Identify large furniture items that need special handling
5. Provide a confidence score (0-1) for your estimate

Return your analysis as a JSON object with this structure:
{
  "estimatedVolume": "XX m³",
  "rooms": [
    {
      "name": "Room name (e.g., Wohnzimmer, Schlafzimmer, Küche)",
      "items": number of items counted,
      "volume": "XX m³"
    }
  ],
  "largeItems": ["Item 1", "Item 2", ...],
  "confidence": 0.XX
}

Be detailed and accurate. For Swiss homes, use German room names (Wohnzimmer, Schlafzimmer, Küche, Badezimmer, etc.).`
      }
    ];

    // Add all images to the content array
    for (const imageBase64 of images) {
      content.push({
        type: "image_url",
        image_url: {
          url: imageBase64
        }
      });
    }

    // Call Lovable AI with vision model
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
            content: content
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
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
    console.log('AI response received');

    const analysisText = aiData.choices[0].message.content;
    console.log('Analysis:', analysisText);

    // Parse JSON from the response
    let analysis;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || 
                       analysisText.match(/```\n([\s\S]*?)\n```/);
      
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1]);
      } else {
        analysis = JSON.parse(analysisText);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Raw response:', analysisText);
      
      // Return a fallback response
      analysis = {
        estimatedVolume: "30 m³",
        rooms: [
          { name: "Verschiedene Räume", items: 10, volume: "30 m³" }
        ],
        largeItems: ["Verschiedene Möbel"],
        confidence: 0.5,
        note: "Analyse konnte nicht vollständig verarbeitet werden. Bitte überprüfen Sie die Werte."
      };
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-moving-photos:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
