import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Contact {
  name: string;
  email: string;
  phone: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { estimateSessionId, selectedCompanyIds, contact, message } = await req.json() as {
      estimateSessionId: string;
      selectedCompanyIds: string[];
      contact: Contact;
      message?: string;
    };

    // Validate input
    if (!estimateSessionId || !selectedCompanyIds || !contact?.name || !contact?.email) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Missing required fields', code: 'INVALID_INPUT' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Invalid email format', code: 'INVALID_EMAIL' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate phone format (optional but must be valid if provided)
    if (contact.phone) {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(contact.phone) || contact.phone.length < 7 || contact.phone.length > 20) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Invalid phone format', code: 'INVALID_PHONE' } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate string lengths
    if (contact.name.length > 200 || contact.email.length > 200) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Input too long', code: 'INPUT_TOO_LONG' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating funnel lead for estimate session:', estimateSessionId);

    // Track company selection count for A/B testing
    await supabase
      .from('estimate_sessions')
      .update({ 
        selected_companies: selectedCompanyIds.length,
        submitted_lead: false,
      })
      .eq('id', estimateSessionId);

    // Fetch estimate session
    const { data: session, error: sessionError } = await supabase
      .from('estimate_sessions')
      .select('*')
      .eq('id', estimateSessionId)
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

    const moveDetails = session.move_details;
    const estimate = session.estimate;

    // Create lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        estimate_session_id: estimateSessionId,
        selected_company_ids: selectedCompanyIds,
        name: contact.name,
        email: contact.email,
        phone: contact.phone || null,
        from_postal: moveDetails.fromPostal,
        from_city: moveDetails.fromCity,
        to_postal: moveDetails.toPostal,
        to_city: moveDetails.toCity,
        move_date: moveDetails.moveDate || null,
        calculator_type: 'quick',
        calculator_input: moveDetails,
        calculator_output: estimate,
        comments: message || null,
        assigned_provider_ids: selectedCompanyIds,
        status: 'new',
        lead_source: 'funnel',
      })
      .select()
      .single();

    if (leadError) {
      console.error('Error creating lead:', leadError);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Failed to create lead', code: 'DATABASE_ERROR' } }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark session as converted for A/B testing
    await supabase
      .from('estimate_sessions')
      .update({ submitted_lead: true })
      .eq('id', estimateSessionId);

    console.log('Created funnel lead:', lead.id);

    return new Response(
      JSON.stringify({ success: true, data: lead }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-funnel-lead:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
