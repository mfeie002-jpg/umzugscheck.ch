import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PostalCodeResult {
  postalCode: string;
  city: string;
  canton: string;
  latitude: number;
  longitude: number;
  valid: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postalCode, query } = await req.json();
    const swissPostApiKey = Deno.env.get('SWISS_POST_API_KEY');

    if (!swissPostApiKey) {
      console.error('SWISS_POST_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!postalCode && !query) {
      return new Response(
        JSON.stringify({ error: 'Either postalCode or query parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Validating postal code: ${postalCode || query}`);

    // Swiss Post GeoPost API endpoint
    // Note: This is a placeholder URL - adjust based on actual Swiss Post API documentation
    const apiUrl = query 
      ? `https://api.post.ch/geopost/v1/search?query=${encodeURIComponent(query)}`
      : `https://api.post.ch/geopost/v1/postalcode/${encodeURIComponent(postalCode)}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${swissPostApiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Swiss Post API error: ${response.status} ${response.statusText}`);
      
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: 'Postal code not found' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to validate postal code' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Swiss Post API response:', JSON.stringify(data));

    // Parse the response based on Swiss Post API structure
    // Adjust this based on actual API response format
    const results: PostalCodeResult[] = [];

    if (Array.isArray(data.results)) {
      for (const item of data.results) {
        results.push({
          postalCode: item.zip || item.postalCode || '',
          city: item.city || item.town || '',
          canton: item.canton || item.state || '',
          latitude: item.latitude || item.lat || 0,
          longitude: item.longitude || item.lng || 0,
          valid: true,
        });
      }
    } else if (data.zip || data.postalCode) {
      // Single result
      results.push({
        postalCode: data.zip || data.postalCode || '',
        city: data.city || data.town || '',
        canton: data.canton || data.state || '',
        latitude: data.latitude || data.lat || 0,
        longitude: data.longitude || data.lng || 0,
        valid: true,
      });
    }

    if (results.length === 0) {
      return new Response(
        JSON.stringify({ valid: false, error: 'No results found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        valid: true, 
        results: query ? results : results[0] 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-postal-code function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: errorMessage 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
