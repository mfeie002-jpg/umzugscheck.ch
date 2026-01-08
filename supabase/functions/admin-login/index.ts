import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !anonKey) {
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

    const url = `${supabaseUrl}/auth/v1/token?grant_type=password`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        apikey: anonKey,
        authorization: `Bearer ${anonKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password, gotrue_meta_security: {} }),
    });

    const payloadText = await resp.text();
    let payload: any = null;
    try {
      payload = payloadText ? JSON.parse(payloadText) : null;
    } catch {
      payload = null;
    }

    if (!resp.ok) {
      // Normalize common auth errors
      const message =
        payload?.error_description ||
        payload?.msg ||
        payload?.message ||
        payload?.error ||
        "Anmeldung fehlgeschlagen";

      return new Response(
        JSON.stringify({ error: message, status: resp.status }),
        { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Return tokens (client will set session)
    return new Response(
      JSON.stringify({
        access_token: payload?.access_token,
        refresh_token: payload?.refresh_token,
        expires_in: payload?.expires_in,
        token_type: payload?.token_type,
        user: payload?.user,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in admin-login:", error);
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
