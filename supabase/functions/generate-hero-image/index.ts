import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY') || '';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Starting hero image generation...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: "Generate a warm, emotional, professional photograph for a Swiss moving company website hero background. Show a happy, relieved family (parents with 2 children, ages 6-10) standing in front of their beautiful modern Swiss house on a sunny day, smiling warmly and peacefully watching professional movers in blue work uniforms carefully carrying furniture and moving boxes. The family (mother, father, daughter, son) should look relaxed, happy, and deeply relieved - conveying the feeling that they are NOT doing the hard physical work themselves but trusting professionals to handle everything. Professional movers working diligently in the background carrying boxes and furniture. Bright sunny day with warm natural golden hour lighting. Clean modern Swiss/European architectural style house with mountains visible in far background. The overall mood: profound relief, happiness, trust in professionals, new beginnings, family joy and peace of mind. Photorealistic professional photography style, 16:9 landscape aspect ratio, soft focus suitable for website background with text overlay capability. Ultra high resolution 1920x1080, natural warm colors, inviting atmosphere that makes viewers feel the emotional weight lifted off their shoulders."
          }
        ],
        modalities: ["image", "text"]
      })
    });

    console.log("Response status:", response.status);

    const data = await response.json();
    console.log("AI Response data:", JSON.stringify(data).substring(0, 200));
    
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error('No image URL in response:', data);
      throw new Error('No image generated');
    }

    console.log("Image generated successfully, URL length:", imageUrl.length);
    
    return new Response(
      JSON.stringify({ success: true, imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating hero image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
