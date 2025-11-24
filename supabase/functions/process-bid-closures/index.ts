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

    console.log("Processing bid closures...");

    // Get leads where bidding has closed
    const now = new Date().toISOString();
    const { data: closedLeads, error: leadsError } = await supabase
      .from("leads")
      .select("*")
      .eq("bidding_enabled", true)
      .lte("bidding_closes_at", now);

    if (leadsError) throw leadsError;

    if (!closedLeads || closedLeads.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No leads to process",
          processed: 0
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const results = [];

    for (const lead of closedLeads) {
      try {
        // Call the close_lead_bidding function
        const { data: result, error: closeError } = await supabase
          .rpc("close_lead_bidding", { p_lead_id: lead.id });

        if (closeError) throw closeError;

        if (result?.success && result.winning_provider_id) {
          // Create transaction for the winning bid
          await supabase.from("lead_transactions").insert({
            provider_id: result.winning_provider_id,
            lead_id: lead.id,
            amount: result.winning_amount,
            status: "completed",
            stripe_payment_intent_id: `bid_${result.winning_bid_id}`,
            purchased_at: new Date().toISOString()
          });

          // Add winner to assigned providers
          const currentProviders = lead.assigned_provider_ids || [];
          if (!currentProviders.includes(result.winning_provider_id)) {
            await supabase
              .from("leads")
              .update({
                assigned_provider_ids: [...currentProviders, result.winning_provider_id]
              })
              .eq("id", lead.id);
          }

          // Record in payment history
          await supabase.from("payment_history").insert({
            provider_id: result.winning_provider_id,
            amount: result.winning_amount,
            payment_type: "bid_purchase",
            status: "completed",
            description: `Bid won: ${lead.from_city} → ${lead.to_city}`,
            stripe_payment_id: `bid_${result.winning_bid_id}`,
            metadata: { 
              lead_id: lead.id, 
              bid_id: result.winning_bid_id,
              original_price: lead.starting_bid
            }
          });

          results.push({
            lead_id: lead.id,
            success: true,
            winner: result.winning_provider_id,
            amount: result.winning_amount
          });

          console.log(`Closed bidding for lead ${lead.id}, winner: ${result.winning_provider_id}`);
        } else {
          results.push({
            lead_id: lead.id,
            success: false,
            message: "No bids found"
          });
        }
      } catch (error: any) {
        console.error(`Error processing lead ${lead.id}:`, error);
        results.push({
          lead_id: lead.id,
          success: false,
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in process-bid-closures:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
