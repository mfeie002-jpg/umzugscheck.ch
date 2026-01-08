import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !anonKey) {
      console.error("admin-login: missing env", { requestId, hasUrl: !!supabaseUrl, hasKey: !!anonKey });
      return new Response(
        JSON.stringify({ error: "Backend ist nicht korrekt konfiguriert." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { email, password } = await req.json().catch(() => ({ email: "", password: "" }));

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "E-Mail und Passwort sind erforderlich" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    console.log("admin-login: attempt", { requestId, email: String(email).toLowerCase() });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(email).toLowerCase(),
      password: String(password),
    });

    if (error) {
      console.warn("admin-login: failed", { requestId, message: error.message, status: (error as any).status });
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: (error as any).status || 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!data?.session?.access_token || !data?.session?.refresh_token) {
      console.error("admin-login: missing session tokens", { requestId });
      return new Response(
        JSON.stringify({ error: "Anmeldung fehlgeschlagen" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log("admin-login: success", { requestId, userId: data.user?.id });

    return new Response(
      JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        token_type: data.session.token_type,
        user: data.user,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("admin-login: unexpected error", { requestId, error });
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
