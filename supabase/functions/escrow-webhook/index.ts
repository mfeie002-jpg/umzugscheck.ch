import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    const { action, escrowId, data } = body;

    console.log(`Processing escrow action: ${action} for escrow: ${escrowId}`);

    switch (action) {
      case "fund": {
        // Mark escrow as funded after payment confirmation
        const { paymentIntentId } = data;
        
        const { error: updateError } = await supabase
          .from("escrow_transactions")
          .update({
            status: "funded",
            funded_at: new Date().toISOString(),
            stripe_payment_intent_id: paymentIntentId
          })
          .eq("id", escrowId)
          .eq("status", "pending");

        if (updateError) {
          throw new Error(`Failed to fund escrow: ${updateError.message}`);
        }

        // Log event
        await supabase.from("escrow_events").insert({
          escrow_id: escrowId,
          event_type: "funded",
          event_data: { payment_intent_id: paymentIntentId },
          created_by: "system"
        });

        return new Response(
          JSON.stringify({ success: true, message: "Escrow funded successfully" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "release": {
        // Release funds to provider
        const { data: escrow, error: fetchError } = await supabase
          .from("escrow_transactions")
          .select("*")
          .eq("id", escrowId)
          .single();

        if (fetchError || !escrow) {
          throw new Error("Escrow transaction not found");
        }

        if (escrow.status !== "funded") {
          throw new Error("Escrow must be funded to release");
        }

        if (!escrow.customer_confirmed || !escrow.provider_confirmed) {
          throw new Error("Both parties must confirm before release");
        }

        // Update status to released
        const { error: releaseError } = await supabase
          .from("escrow_transactions")
          .update({
            status: "released",
            released_at: new Date().toISOString(),
            service_completed_at: new Date().toISOString()
          })
          .eq("id", escrowId);

        if (releaseError) {
          throw new Error(`Failed to release escrow: ${releaseError.message}`);
        }

        // Record payout in payment history
        await supabase.from("payment_history").insert({
          provider_id: escrow.provider_id,
          amount: escrow.provider_payout,
          currency: escrow.currency,
          payment_type: "escrow_payout",
          status: "completed",
          description: `Escrow payout for ${escrow.service_type || "service"}`,
          metadata: { escrow_id: escrowId }
        });

        return new Response(
          JSON.stringify({ success: true, message: "Escrow released successfully" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "refund": {
        // Refund to customer
        const { reason } = data;

        const { error: refundError } = await supabase
          .from("escrow_transactions")
          .update({
            status: "refunded",
            dispute_resolution: reason || "Refund processed",
            resolved_at: new Date().toISOString(),
            resolved_by: "system"
          })
          .eq("id", escrowId);

        if (refundError) {
          throw new Error(`Failed to refund escrow: ${refundError.message}`);
        }

        return new Response(
          JSON.stringify({ success: true, message: "Escrow refunded successfully" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "dispute": {
        // Open dispute
        const { reason } = data;

        const { error: disputeError } = await supabase
          .from("escrow_transactions")
          .update({
            status: "disputed",
            disputed_at: new Date().toISOString(),
            dispute_reason: reason
          })
          .eq("id", escrowId)
          .eq("status", "funded");

        if (disputeError) {
          throw new Error(`Failed to open dispute: ${disputeError.message}`);
        }

        // TODO: Send notification emails to both parties and admin

        return new Response(
          JSON.stringify({ success: true, message: "Dispute opened successfully" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Escrow webhook error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
