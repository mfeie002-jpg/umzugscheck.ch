import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const JWT_SECRET = Deno.env.get('JWT_SECRET') || 'default-secret-change-in-production';

// Input validation
function validateEmail(email: string): boolean {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

function sanitizeString(str: string, maxLength: number = 255): string {
  return str.trim().slice(0, maxLength);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Validate email format
    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Ungültige E-Mail-Adresse' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeString(email, 255).toLowerCase();

    // Rate limit login attempts (max 10 per 15 minutes per email)
    const { data: rateLimitOk } = await supabase.rpc('check_rate_limit', {
      p_identifier: sanitizedEmail,
      p_action_type: 'provider_login',
      p_max_attempts: 10,
      p_window_minutes: 15
    });

    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ error: 'Zu viele Login-Versuche. Bitte versuchen Sie es später erneut.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find provider by email
    const { data: provider, error: selectError } = await supabase
      .from('service_providers')
      .select('*')
      .eq('email', sanitizedEmail)
      .maybeSingle();

    if (selectError || !provider) {
      return new Response(
        JSON.stringify({ error: 'Ungültige Anmeldedaten' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify password
    const bcrypt = await import('https://deno.land/x/bcrypt@v0.4.1/mod.ts');
    const passwordMatch = await bcrypt.compare(password, provider.password_hash);

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
