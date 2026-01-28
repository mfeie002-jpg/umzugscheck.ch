import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Verify password using Web Crypto API (PBKDF2)
async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    // Parse the stored hash format: $pbkdf2$iterations$salt$hash
    const parts = storedHash.split('$');
    if (parts.length !== 5 || parts[1] !== 'pbkdf2') {
      console.error('Invalid hash format');
      return false;
    }

    const iterations = parseInt(parts[2], 10);
    const saltHex = parts[3];
    const expectedHashHex = parts[4];

    const encoder = new TextEncoder();
    
    // Decode hex salt to bytes
    const saltBytes = new Uint8Array(saltHex.length / 2);
    for (let i = 0; i < saltHex.length; i += 2) {
      saltBytes[i / 2] = parseInt(saltHex.substring(i, i + 2), 16);
    }

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBytes,
        iterations: iterations,
        hash: "SHA-256"
      },
      keyMaterial,
      256
    );

    // Convert to hex for comparison
    const hashArray = new Uint8Array(derivedBits);
    const hashHex = Array.from(hashArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return hashHex === expectedHashHex;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const JWT_SECRET = Deno.env.get('JWT_SECRET');
    
    if (!JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'Serverkonfigurationsfehler' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'E-Mail und Passwort sind erforderlich' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find provider by email
    const { data: provider, error: selectError } = await supabase
      .from('service_providers')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (selectError || !provider) {
      return new Response(
        JSON.stringify({ error: 'Ungültige Anmeldedaten' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify password using PBKDF2
    const passwordMatch = await verifyPassword(password, provider.password_hash);

    if (!passwordMatch) {
      return new Response(
        JSON.stringify({ error: 'Ungültige Anmeldedaten' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check account status
    if (provider.account_status !== 'active') {
      return new Response(
        JSON.stringify({ error: 'Ihr Account ist deaktiviert. Bitte kontaktieren Sie den Support.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate JWT token
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );

    const token = await create(
      { alg: 'HS256', typ: 'JWT' },
      {
        providerId: provider.id,
        email: provider.email,
        exp: getNumericDate(60 * 60 * 24 * 7), // 7 days
      },
      key
    );

    // Remove sensitive data
    const { password_hash, ...providerData } = provider;

    console.log('Provider logged in:', provider.id);

    return new Response(
      JSON.stringify({
        success: true,
        token,
        provider: providerData
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in provider-login:', error);
    return new Response(
      JSON.stringify({ error: 'Interner Serverfehler' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
