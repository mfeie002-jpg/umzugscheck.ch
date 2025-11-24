import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MoveDetails {
  fromPostal: string;
  fromCity: string;
  toPostal: string;
  toCity: string;
  rooms: string;
  movingType: string;
  floorsFrom: string;
  floorsTo: string;
  hasElevatorFrom: boolean;
  hasElevatorTo: boolean;
  moveDate?: string;
  calculatorType?: string;
  [key: string]: any; // Allow additional properties for different calculator types
}

interface Estimate {
  priceMin: number;
  priceMax: number;
  volumeM3: number;
  estimatedHours: number;
  distance: number;
  breakdown?: {
    basePrice: number;
    distanceFee: number;
    floorFee: number;
    elevatorDiscount: number;
    total: number;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { moveDetails, estimate } = await req.json() as {
      moveDetails: MoveDetails;
      estimate: Estimate;
    };

    // Validate input
    if (!moveDetails || !estimate) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Move details and estimate are required', code: 'INVALID_INPUT' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating estimate session with move details:', moveDetails);

    // Determine service type from calculator type
    const calculatorType = moveDetails.calculatorType || 'quick';
    const serviceTypeMap: Record<string, string> = {
      'quick': 'moving',
      'advanced': 'moving',
      'video': 'moving',
      'cleaning': 'cleaning',
      'disposal': 'disposal',
      'storage': 'storage',
      'packing': 'packing',
      'assembly': 'assembly',
    };
    const serviceType = serviceTypeMap[calculatorType] || 'moving';

    // Find matching providers based on location, value, AND service type
    const estimatedValue = (estimate.priceMin + estimate.priceMax) / 2;
    let matchingProviderIds: string[] = [];

    if (serviceType === 'moving') {
      // Use existing provider matching for moving services
      const { data: providerIds, error: matchError } = await supabase.rpc(
        'find_matching_providers',
        {
          lead_from_postal: moveDetails.fromPostal || '8000',
          lead_to_postal: moveDetails.toPostal || '8000',
          estimated_value: estimatedValue,
        }
      );

      if (matchError) {
        console.error('Error finding matching providers:', matchError);
      } else {
        matchingProviderIds = providerIds || [];
      }
    } else {
      // For other services, find companies offering that service type
      const { data: companies, error: compError } = await supabase
        .from('companies')
        .select('id')
        .contains('service_types', [serviceType])
        .limit(20);

      if (!compError && companies) {
        matchingProviderIds = companies.map(c => c.id);
      }
    }

    console.log('Found matching companies for', serviceType, ':', matchingProviderIds);

    // Assign A/B test variant (simple random assignment)
    const variants = ['default', 'variant_a', 'variant_b'];
    const funnelVariant = variants[Math.floor(Math.random() * variants.length)];

    // Create estimate session
    const { data: session, error: sessionError } = await supabase
      .from('estimate_sessions')
      .insert({
        move_details: moveDetails,
        estimate,
        matching_company_ids: matchingProviderIds,
        funnel_variant: funnelVariant,
        viewed_companies: false,
        selected_companies: 0,
        submitted_lead: false,
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating estimate session:', sessionError);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Failed to create estimate session', code: 'DATABASE_ERROR' } }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Created estimate session:', session.id);

    return new Response(
      JSON.stringify({ success: true, data: session }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-estimate-session:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
