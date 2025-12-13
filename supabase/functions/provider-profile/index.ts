import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const JWT_SECRET = Deno.env.get('JWT_SECRET');

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
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

// Input validation constants
const MAX_LENGTHS = {
  companyName: 200,
  contactPersonName: 100,
  phone: 30,
  website: 500,
  street: 200,
  zip: 10,
  city: 100,
  description: 5000,
  logoUrl: 500,
};
const MAX_ARRAY_SIZE = 30;
const VALID_PRICE_LEVELS = ['günstig', 'fair', 'premium'];
const VALID_CANTONS = ['ZH', 'BE', 'LU', 'UR', 'SZ', 'OW', 'NW', 'GL', 'ZG', 'FR', 'SO', 'BS', 'BL', 'SH', 'AR', 'AI', 'SG', 'GR', 'AG', 'TG', 'TI', 'VD', 'VS', 'NE', 'GE', 'JU'];

// URL validation helper
const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// Validation helper that returns error message or null if valid
function validateProfileInput(body: any): string | null {
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

  // Validate string lengths
  if (companyName !== undefined && (typeof companyName !== 'string' || companyName.length > MAX_LENGTHS.companyName)) {
    return `Firmenname zu lang (max ${MAX_LENGTHS.companyName} Zeichen)`;
  }
  if (contactPersonName !== undefined && (typeof contactPersonName !== 'string' || contactPersonName.length > MAX_LENGTHS.contactPersonName)) {
    return `Kontaktperson zu lang (max ${MAX_LENGTHS.contactPersonName} Zeichen)`;
  }
  if (phone !== undefined && (typeof phone !== 'string' || phone.length > MAX_LENGTHS.phone)) {
    return `Telefonnummer zu lang (max ${MAX_LENGTHS.phone} Zeichen)`;
  }
  if (street !== undefined && (typeof street !== 'string' || street.length > MAX_LENGTHS.street)) {
    return `Strasse zu lang (max ${MAX_LENGTHS.street} Zeichen)`;
  }
  if (zip !== undefined && (typeof zip !== 'string' || zip.length > MAX_LENGTHS.zip)) {
    return `PLZ zu lang (max ${MAX_LENGTHS.zip} Zeichen)`;
  }
  if (city !== undefined && (typeof city !== 'string' || city.length > MAX_LENGTHS.city)) {
    return `Stadt zu lang (max ${MAX_LENGTHS.city} Zeichen)`;
  }
  if (description !== undefined && (typeof description !== 'string' || description.length > MAX_LENGTHS.description)) {
    return `Beschreibung zu lang (max ${MAX_LENGTHS.description} Zeichen)`;
  }

  // Validate URLs
  if (website !== undefined && website !== '' && !isValidUrl(website)) {
    return 'Ungültige Website-URL (muss mit http:// oder https:// beginnen)';
  }
  if (logoUrl !== undefined && logoUrl !== '' && !isValidUrl(logoUrl)) {
    return 'Ungültige Logo-URL (muss mit http:// oder https:// beginnen)';
  }

  // Validate priceLevel enum
  if (priceLevel !== undefined && !VALID_PRICE_LEVELS.includes(priceLevel)) {
    return `Ungültiges Preisniveau. Erlaubt: ${VALID_PRICE_LEVELS.join(', ')}`;
  }

  // Validate arrays
  if (cantonsServed !== undefined) {
    if (!Array.isArray(cantonsServed) || cantonsServed.length > MAX_ARRAY_SIZE) {
      return `Kantone müssen als Liste angegeben werden (max ${MAX_ARRAY_SIZE})`;
    }
    const invalidCantons = cantonsServed.filter((c: string) => !VALID_CANTONS.includes(c));
    if (invalidCantons.length > 0) {
      return `Ungültige Kantone: ${invalidCantons.join(', ')}`;
    }
  }
  if (servicesOffered !== undefined && (!Array.isArray(servicesOffered) || servicesOffered.length > MAX_ARRAY_SIZE)) {
    return `Dienstleistungen müssen als Liste angegeben werden (max ${MAX_ARRAY_SIZE})`;
  }
  if (preferredRegions !== undefined && (!Array.isArray(preferredRegions) || preferredRegions.length > MAX_ARRAY_SIZE)) {
    return `Bevorzugte Regionen müssen als Liste angegeben werden (max ${MAX_ARRAY_SIZE})`;
  }

  // Validate numeric fields
  if (fleetSize !== undefined && (typeof fleetSize !== 'number' || fleetSize < 0 || fleetSize > 1000)) {
    return 'Flottengrösse muss eine Zahl zwischen 0 und 1000 sein';
  }
  if (employeesCount !== undefined && (typeof employeesCount !== 'number' || employeesCount < 0 || employeesCount > 10000)) {
    return 'Mitarbeiterzahl muss eine Zahl zwischen 0 und 10000 sein';
  }
  if (maxLeadsPerMonth !== undefined && (typeof maxLeadsPerMonth !== 'number' || maxLeadsPerMonth < 0 || maxLeadsPerMonth > 10000)) {
    return 'Maximale Leads pro Monat muss eine Zahl zwischen 0 und 10000 sein';
  }
  if (minJobValue !== undefined && (typeof minJobValue !== 'number' || minJobValue < 0 || minJobValue > 1000000)) {
    return 'Minimaler Auftragswert muss eine Zahl zwischen 0 und 1000000 sein';
  }

  return null;
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
      
      // Validate input
      const validationError = validateProfileInput(body);
      if (validationError) {
        return new Response(
          JSON.stringify({ error: validationError }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

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
