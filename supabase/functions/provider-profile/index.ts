import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const JWT_SECRET = Deno.env.get('JWT_SECRET');

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

async function verifyToken(authHeader: string | null): Promise<any> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Keine gültige Autorisierung');
  }

  const token = authHeader.substring(7);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );

  try {
    const payload = await verify(token, key);
    return payload;
  } catch {
    throw new Error('Ungültiger oder abgelaufener Token');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    const payload = await verifyToken(authHeader);
    const providerId = payload.providerId;

    // GET: Fetch provider profile
    if (req.method === 'GET') {
      const { data: provider, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('id', providerId)
        .single();

      if (error || !provider) {
        return new Response(
          JSON.stringify({ error: 'Profil nicht gefunden' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Remove sensitive data
      const { password_hash, ...providerData } = provider;

      return new Response(
        JSON.stringify({ provider: providerData }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PUT: Update provider profile
    if (req.method === 'PUT') {
      const body = await req.json();
      const {
        companyName,
        contactPersonName,
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
        logoUrl,
        maxLeadsPerMonth,
        preferredRegions,
        minJobValue
      } = body;

      const updateData: any = {};
      
      if (companyName !== undefined) updateData.company_name = companyName;
      if (contactPersonName !== undefined) updateData.contact_person_name = contactPersonName;
      if (phone !== undefined) updateData.phone = phone;
      if (website !== undefined) updateData.website = website;
      if (street !== undefined) updateData.street = street;
      if (zip !== undefined) updateData.zip = zip;
      if (city !== undefined) updateData.city = city;
      if (cantonsServed !== undefined) updateData.cantons_served = cantonsServed;
      if (servicesOffered !== undefined) updateData.services_offered = servicesOffered;
      if (description !== undefined) updateData.description = description;
      if (fleetSize !== undefined) updateData.fleet_size = fleetSize;
      if (employeesCount !== undefined) updateData.employees_count = employeesCount;
      if (priceLevel !== undefined) updateData.price_level = priceLevel;
      if (logoUrl !== undefined) updateData.logo_url = logoUrl;
      if (maxLeadsPerMonth !== undefined) updateData.max_leads_per_month = maxLeadsPerMonth;
      if (preferredRegions !== undefined) updateData.preferred_regions = preferredRegions;
      if (minJobValue !== undefined) updateData.min_job_value = minJobValue;

      const { data: provider, error } = await supabase
        .from('service_providers')
        .update(updateData)
        .eq('id', providerId)
        .select()
        .single();

      if (error) {
        console.error('Error updating provider:', error);
        return new Response(
          JSON.stringify({ error: 'Fehler beim Aktualisieren des Profils' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Remove sensitive data
      const { password_hash, ...providerData } = provider;

      console.log('Provider profile updated:', providerId);

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Profil erfolgreich aktualisiert',
          provider: providerData 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Methode nicht erlaubt' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in provider-profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Interner Serverfehler';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
