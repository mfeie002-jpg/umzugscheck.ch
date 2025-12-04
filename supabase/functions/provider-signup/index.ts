import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
  return phoneRegex.test(phone);
};

const isValidPassword = (password: string): boolean => {
  // Minimum 8 characters, at least one letter and one number
  return password.length >= 8 && password.length <= 128 && 
         /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
};

const isValidString = (str: string, maxLength: number): boolean => {
  return typeof str === 'string' && str.trim().length > 0 && str.length <= maxLength;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limiting - 5 registrations per day per IP
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    const { data: allowed } = await supabase.rpc('check_rate_limit', {
      p_identifier: clientIP,
      p_action_type: 'provider_signup',
      p_max_attempts: 5,
      p_window_minutes: 1440 // 24 hours
    });

    if (!allowed) {
      console.log('Rate limit exceeded for IP:', clientIP);
      return new Response(
        JSON.stringify({ error: 'Zu viele Registrierungsversuche. Bitte versuchen Sie es morgen erneut.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const {
      companyName,
      contactPersonName,
      email,
      password,
      phone,
      website,
      street,
      zip,
      city,
      cantonsServed,
      servicesOffered,
      description,
      fleetSize,
      employeesCount,
      priceLevel,
      maxLeadsPerMonth,
      preferredRegions,
      minJobValue
    } = body;

    // Validate required fields with length limits
    if (!isValidString(companyName, 200)) {
      return new Response(
        JSON.stringify({ error: 'Firmenname ist erforderlich und darf maximal 200 Zeichen haben' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidString(contactPersonName, 100)) {
      return new Response(
        JSON.stringify({ error: 'Kontaktperson ist erforderlich und darf maximal 100 Zeichen haben' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!password || !isValidPassword(password)) {
      return new Response(
        JSON.stringify({ error: 'Passwort muss mindestens 8 Zeichen lang sein und Buchstaben sowie Zahlen enthalten' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!phone || !isValidPhone(phone)) {
      return new Response(
        JSON.stringify({ error: 'Bitte geben Sie eine gültige Telefonnummer ein (8-20 Zeichen)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidString(street, 200)) {
      return new Response(
        JSON.stringify({ error: 'Strasse ist erforderlich und darf maximal 200 Zeichen haben' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidString(zip, 10)) {
      return new Response(
        JSON.stringify({ error: 'PLZ ist erforderlich und darf maximal 10 Zeichen haben' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidString(city, 100)) {
      return new Response(
        JSON.stringify({ error: 'Stadt ist erforderlich und darf maximal 100 Zeichen haben' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate optional fields
    if (website && website.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Website-URL darf maximal 500 Zeichen haben' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (description && description.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Beschreibung darf maximal 2000 Zeichen haben' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!cantonsServed || !Array.isArray(cantonsServed) || cantonsServed.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Bitte wählen Sie mindestens einen Kanton aus' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!servicesOffered || !Array.isArray(servicesOffered) || servicesOffered.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Bitte wählen Sie mindestens eine Dienstleistung aus' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate array lengths
    if (cantonsServed.length > 26) {
      return new Response(
        JSON.stringify({ error: 'Ungültige Kantonsauswahl' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (servicesOffered.length > 20) {
      return new Response(
        JSON.stringify({ error: 'Ungültige Dienstleistungsauswahl' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if email already exists
    const { data: existingProvider } = await supabase
      .from('service_providers')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (existingProvider) {
      return new Response(
        JSON.stringify({ error: 'Diese E-Mail-Adresse ist bereits registriert' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash password using bcrypt
    const bcrypt = await import('https://deno.land/x/bcrypt@v0.4.1/mod.ts');
    const passwordHash = await bcrypt.hash(password);

    // Create service provider
    const { data: provider, error: insertError } = await supabase
      .from('service_providers')
      .insert({
        company_name: companyName.trim(),
        contact_person_name: contactPersonName.trim(),
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        phone: phone.trim(),
        website: website?.trim() || null,
        street: street.trim(),
        zip: zip.trim(),
        city: city.trim(),
        country: 'Schweiz',
        cantons_served: cantonsServed,
        services_offered: servicesOffered,
        description: description?.trim() || null,
        fleet_size: fleetSize || null,
        employees_count: employeesCount || null,
        price_level: priceLevel || 'fair',
        verification_status: 'pending',
        account_status: 'active',
        max_leads_per_month: maxLeadsPerMonth || 50,
        preferred_regions: preferredRegions || cantonsServed,
        min_job_value: minJobValue || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating provider:', insertError);
      return new Response(
        JSON.stringify({ error: 'Fehler bei der Registrierung. Bitte versuchen Sie es erneut.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Provider created successfully:', provider.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Registrierung erfolgreich! Ihr Account wird geprüft und freigeschaltet.',
        providerId: provider.id
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in provider-signup:', error);
    return new Response(
      JSON.stringify({ error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
