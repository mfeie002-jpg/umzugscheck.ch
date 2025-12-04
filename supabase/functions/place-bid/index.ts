import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT token from provider auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing or invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const jwtSecret = Deno.env.get("JWT_SECRET");
    if (!jwtSecret) {
      throw new Error("JWT_SECRET not configured");
    }

    // Import JWT verification
    const { verify } = await import("https://deno.land/x/djwt@v2.8/mod.ts");

    let decodedToken;
    try {
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(jwtSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"]
      );
      decodedToken = await verify(token, key);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { providerId, leadId, bidAmount } = await req.json();

    // Verify the authenticated provider matches the providerId in request
    if (decodedToken.providerId !== providerId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Provider ID mismatch" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Place bid request:", { providerId, leadId, bidAmount });

    // Validate inputs
    if (!providerId || !leadId || !bidAmount) {
      throw new Error("Missing required fields");
    }

    if (bidAmount <= 0) {
      throw new Error("Bid amount must be greater than 0");
    }

    // Get lead details
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError) throw leadError;

    // Check if bidding is enabled
    if (!lead.bidding_enabled) {
      throw new Error("Bidding is not enabled for this lead");
    }

    // Check if bidding has closed
    if (lead.bidding_closes_at && new Date(lead.bidding_closes_at) < new Date()) {
      throw new Error("Bidding has closed for this lead");
    }

    // Check if bid meets minimum requirements
    const minimumBid = lead.current_highest_bid 
      ? lead.current_highest_bid + 1 
      : lead.starting_bid || 10;

    if (bidAmount < minimumBid) {
      throw new Error(`Bid must be at least CHF ${minimumBid}`);
    }

    // Check if provider already has an active bid
    const { data: existingBid } = await supabase
      .from("lead_bids")
      .select("*")
      .eq("provider_id", providerId)
      .eq("lead_id", leadId)
      .eq("status", "active")
      .maybeSingle();

    if (existingBid) {
      // Update existing bid
      const { data: updatedBid, error: updateError } = await supabase
        .from("lead_bids")
        .update({ 
          bid_amount: bidAmount,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingBid.id)
        .select()
        .single();

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({
          success: true,
          bid: updatedBid,
          action: "updated"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      // Create new bid
      const { data: newBid, error: createError } = await supabase
        .from("lead_bids")
        .insert({
          provider_id: providerId,
          lead_id: leadId,
          bid_amount: bidAmount,
          status: "active"
        })
        .select()
        .single();

      if (createError) throw createError;

      return new Response(
        JSON.stringify({
          success: true,
          bid: newBid,
          action: "created"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in place-bid:", error);
    
    // Sanitize error messages - don't expose internal details
    const knownErrors: Record<string, string> = {
      'Bidding is not enabled': 'Gebote sind für diesen Lead nicht aktiviert',
      'Bidding has closed': 'Die Gebotsphase ist beendet',
      'Missing required fields': 'Erforderliche Felder fehlen',
    };
    
    let safeMessage = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
    for (const [key, value] of Object.entries(knownErrors)) {
      if (error.message?.includes(key)) {
        safeMessage = value;
        break;
      }
    }
    
    return new Response(
      JSON.stringify({ error: safeMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
