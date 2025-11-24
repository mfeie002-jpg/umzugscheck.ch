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

    const { providerId, leadId } = await req.json();

    console.log("Purchase lead request:", { providerId, leadId });

    // Get lead details
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*, calculator_output")
      .eq("id", leadId)
      .single();

    if (leadError) throw leadError;

    // Calculate lead price based on volume
    const volume = lead.calculator_output?.volume || 30;
    let leadPrice = 15; // Base price
    
    if (volume > 50) leadPrice = 30;
    if (volume > 80) leadPrice = 45;

    // Check if provider already purchased this lead
    const { data: existingTransaction } = await supabase
      .from("lead_transactions")
      .select("*")
      .eq("provider_id", providerId)
      .eq("lead_id", leadId)
      .single();

    if (existingTransaction) {
      throw new Error("Lead wurde bereits gekauft");
    }

    // TODO: Process payment with Stripe here
    const stripePaymentIntentId = `pi_${Date.now()}`; // Placeholder

    // Create transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("lead_transactions")
      .insert({
        provider_id: providerId,
        lead_id: leadId,
        amount: leadPrice,
        status: "completed",
        stripe_payment_intent_id: stripePaymentIntentId,
        purchased_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Record in payment history
    await supabase.from("payment_history").insert({
      provider_id: providerId,
      amount: leadPrice,
      payment_type: "per_lead",
      status: "completed",
      description: `Lead purchase: ${lead.from_city} → ${lead.to_city}`,
      stripe_payment_id: stripePaymentIntentId,
      metadata: { lead_id: leadId, transaction_id: transaction.id },
    });

    // Update lead to include this provider
    const currentProviderIds = lead.assigned_provider_ids || [];
    if (!currentProviderIds.includes(providerId)) {
      await supabase
        .from("leads")
        .update({
          assigned_provider_ids: [...currentProviderIds, providerId],
        })
        .eq("id", leadId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction,
        lead: {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          from_city: lead.from_city,
          to_city: lead.to_city,
          move_date: lead.move_date,
          comments: lead.comments,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in purchase-lead:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
