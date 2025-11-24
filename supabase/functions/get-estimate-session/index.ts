import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const sessionId = url.searchParams.get('id');

    if (!sessionId) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Session ID is required', code: 'INVALID_INPUT' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching estimate session:', sessionId);

    // Fetch estimate session
    const { data: session, error: sessionError } = await supabase
      .from('estimate_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      console.error('Error fetching estimate session:', sessionError);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Estimate session not found', code: 'NOT_FOUND' } }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Estimate session has expired', code: 'EXPIRED' } }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch matching companies
    let companies = [];
    if (session.matching_company_ids && session.matching_company_ids.length > 0) {
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('id, name, logo, rating, review_count, price_level, services, verified')
        .in('id', session.matching_company_ids)
        .order('rating', { ascending: false })
        .limit(6);

      if (!companiesError && companiesData) {
        companies = companiesData;
      }
    }

    console.log('Fetched estimate session with companies:', companies.length);

    // Mark session as viewed for A/B testing tracking
    if (!session.viewed_companies) {
      await supabase
        .from('estimate_sessions')
        .update({ viewed_companies: true })
        .eq('id', sessionId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...session,
          companies,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-estimate-session:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
