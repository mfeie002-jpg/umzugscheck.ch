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
    console.log("Starting image generation...");
    
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
            content: "Generate a warm, emotional, professional photograph for a Swiss moving company website hero background. Show a happy, relieved family (parents and 2 children) standing in front of their beautiful new modern Swiss house, smiling warmly and watching with peace and satisfaction as professional movers in blue uniforms carefully carry furniture and moving boxes. The family (mother, father, boy, girl) should look relaxed, happy, and relieved - conveying they are NOT doing the hard work themselves. Professional movers working in the background carrying boxes and furniture. Bright, sunny day with warm natural lighting. Modern Swiss/European architectural style house. The mood: relief, happiness, trust, professional service, new beginnings, family joy. Photorealistic photography style, 16:9 landscape aspect ratio, soft focus suitable for website background with text overlay. Ultra high resolution, natural colors, warm atmosphere."
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
