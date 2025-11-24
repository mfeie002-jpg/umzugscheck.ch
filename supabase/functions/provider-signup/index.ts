import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Validate required fields
    if (!companyName || !contactPersonName || !email || !password || !phone || !street || !zip || !city) {
      return new Response(
        JSON.stringify({ error: 'Alle Pflichtfelder müssen ausgefüllt werden' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!cantonsServed || cantonsServed.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Bitte wählen Sie mindestens einen Kanton aus' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!servicesOffered || servicesOffered.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Bitte wählen Sie mindestens eine Dienstleistung aus' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if email already exists
    const { data: existingProvider } = await supabase
      .from('service_providers')
      .select('id')
      .eq('email', email.toLowerCase())
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
        company_name: companyName,
        contact_person_name: contactPersonName,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        phone,
        website: website || null,
        street,
        zip,
        city,
        country: 'Schweiz',
        cantons_served: cantonsServed,
        services_offered: servicesOffered,
        description: description || null,
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
      JSON.stringify({ error: 'Interner Serverfehler' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
