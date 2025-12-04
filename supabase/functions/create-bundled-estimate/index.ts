import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Rate limiting - 5 bundled estimates per hour per IP
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    const { data: allowed } = await supabase.rpc('check_rate_limit', {
      p_identifier: clientIP,
      p_action_type: 'create_bundled_estimate',
      p_max_attempts: 5,
      p_window_minutes: 60
    });

    if (!allowed) {
      console.log('Rate limit exceeded for bundled estimate, IP:', clientIP);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Zu viele Anfragen. Bitte warten Sie.', code: 'RATE_LIMIT' } }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { estimateSessionIds } = await req.json() as {
      estimateSessionIds: string[];
    };

    // Validate input
    if (!estimateSessionIds || !Array.isArray(estimateSessionIds) || estimateSessionIds.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'No estimate sessions provided', code: 'INVALID_INPUT' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate max sessions (prevent abuse)
    if (estimateSessionIds.length > 10) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Too many sessions (max 10)', code: 'INVALID_INPUT' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate UUIDs format
    for (const id of estimateSessionIds) {
      if (!uuidRegex.test(id)) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Invalid session ID format', code: 'INVALID_INPUT' } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('Creating bundled estimate for sessions:', estimateSessionIds.length);

    // Fetch all estimate sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('estimate_sessions')
      .select('*')
      .in('id', estimateSessionIds);

    if (sessionsError || !sessions || sessions.length === 0) {
      console.error('Error fetching sessions:', sessionsError);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Estimate sessions not found', code: 'NOT_FOUND' } }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate combined pricing
    let totalMin = 0;
    let totalMax = 0;
    const allCompanyIds: string[] = [];

    for (const session of sessions) {
      totalMin += session.estimate.priceMin || 0;
      totalMax += session.estimate.priceMax || 0;
      
      if (session.matching_company_ids) {
        allCompanyIds.push(...session.matching_company_ids);
      }
    }

    // Validate calculated totals
    if (totalMin < 0 || totalMax < 0 || totalMin > 10000000 || totalMax > 10000000) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Invalid price calculation', code: 'CALCULATION_ERROR' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get unique company IDs
    const uniqueCompanyIds = [...new Set(allCompanyIds)];

    // Create bundled estimate
    const { data: bundled, error: bundledError } = await supabase
      .from('bundled_estimates')
      .insert({
        estimate_session_ids: estimateSessionIds,
        total_price_min: totalMin,
        total_price_max: totalMax,
      })
      .select()
      .single();

    if (bundledError) {
      console.error('Error creating bundled estimate:', bundledError);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Failed to create bundled estimate', code: 'DATABASE_ERROR' } }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Created bundled estimate:', bundled.id);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...bundled,
          sessions,
          uniqueCompanyIds,
        },
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-bundled-estimate:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
