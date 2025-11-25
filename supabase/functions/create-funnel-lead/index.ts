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

// Input validation
function validateEmail(email: string): boolean {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^\+?[0-9\s\-\(\)]{8,20}$/.test(phone);
}

function sanitizeString(str: string, maxLength: number = 1000): string {
  return str.trim().slice(0, maxLength);
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

    // Validate required fields
    if (!estimateSessionId || !selectedCompanyIds || !contact?.name || !contact?.email) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Fehlende erforderliche Felder', code: 'MISSING_FIELDS' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    if (!validateEmail(contact.email)) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Ungültige E-Mail-Adresse', code: 'INVALID_EMAIL' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate phone if provided
    if (contact.phone && !validatePhone(contact.phone)) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Ungültige Telefonnummer', code: 'INVALID_PHONE' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize inputs
    const sanitizedContact = {
      name: sanitizeString(contact.name, 100),
      email: sanitizeString(contact.email, 255),
      phone: contact.phone ? sanitizeString(contact.phone, 20) : undefined
    };
    const sanitizedMessage = message ? sanitizeString(message, 2000) : undefined;

    // Check rate limit (3 submissions per hour per email)
    const { data: rateLimitOk } = await supabase.rpc('check_rate_limit', {
      p_identifier: sanitizedContact.email,
      p_action_type: 'lead_submission',
      p_max_attempts: 3,
      p_window_minutes: 60
    });

    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: { message: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.', code: 'RATE_LIMIT_EXCEEDED' }
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        name: sanitizedContact.name,
        email: sanitizedContact.email,
        phone: sanitizedContact.phone || null,
        from_postal: moveDetails.fromPostal,
        from_city: moveDetails.fromCity,
        to_postal: moveDetails.toPostal,
        to_city: moveDetails.toCity,
        move_date: moveDetails.moveDate || null,
        calculator_type: 'quick',
        calculator_input: moveDetails,
        calculator_output: estimate,
        comments: sanitizedMessage || null,
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
