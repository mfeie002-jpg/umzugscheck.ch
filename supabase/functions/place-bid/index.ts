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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { providerId, leadId, bidAmount } = await req.json();

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
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
