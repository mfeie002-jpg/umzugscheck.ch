import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Helper function to map postal codes to cantons
const getCantonFromPostal = (postalCode: string): string => {
  const code = postalCode.substring(0, 1);
  const codeMap: Record<string, string> = {
    '1': 'VD', '2': 'NE', '3': 'BE', '4': 'BS',
    '5': 'AG', '6': 'LU', '7': 'GR', '8': 'ZH', '9': 'SG'
  };
  return codeMap[code] || 'Other';
};

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
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError) throw leadError;

    // Calculate lead price using quality scoring system with age-based discounts
    const volume = lead.calculator_output?.volume || 30;
    const fromCanton = getCantonFromPostal(lead.from_postal);
    const toCanton = getCantonFromPostal(lead.to_postal);
    const createdAt = lead.created_at;
    
    // Calculate lead age in hours
    const leadDate = new Date(createdAt);
    const now = new Date();
    const hoursOld = Math.floor((now.getTime() - leadDate.getTime()) / (1000 * 60 * 60));
    
    // Canton premium multipliers
    const cantonPremiums: Record<string, number> = {
      'ZH': 1.3, 'ZG': 1.25, 'GE': 1.2, 'BS': 1.2, 'VD': 1.15,
      'BL': 1.1, 'AG': 1.05, 'SG': 1.0, 'BE': 1.0, 'LU': 1.0
    };
    
    const maxPremium = Math.max(
      cantonPremiums[fromCanton] || 1.0,
      cantonPremiums[toCanton] || 1.0
    );
    
    // Base price from volume
    let basePrice = 15;
    if (volume > 80) basePrice = 45;
    else if (volume > 50) basePrice = 30;
    else if (volume > 30) basePrice = 20;
    
    // Location premium
    const locationPremium = Math.round(basePrice * (maxPremium - 1.0));
    
    // Complexity adjustment
    let complexityScore = 15;
    if (lead.calculator_output) {
      const hasExtraServices = lead.calculator_output.extraServices?.length > 0;
      const hasSpecialItems = lead.calculator_output.specialItems?.length > 0;
      const hasDifficultAccess = lead.calculator_output.accessDifficulty === 'difficult';
      const floors = (lead.calculator_output.floorsStart || 0) + (lead.calculator_output.floorsDestination || 0);
      
      if (hasExtraServices) complexityScore += 5;
      if (hasSpecialItems) complexityScore += 5;
      if (hasDifficultAccess) complexityScore += 5;
      if (floors > 4) complexityScore += 5;
    }
    
    const complexityMultiplier = 1 + (complexityScore / 120);
    const complexityAdjustment = Math.round(basePrice * (complexityMultiplier - 1.0));
    
    let priceBeforeDiscount = basePrice + locationPremium + complexityAdjustment;
    
    // Apply age-based discount
    let ageDiscountPercentage = 0;
    if (hoursOld >= 48) {
      ageDiscountPercentage = 30; // 30% off after 48 hours
    } else if (hoursOld >= 24) {
      ageDiscountPercentage = 15; // 15% off after 24 hours
    }
    
    const ageDiscount = Math.round(priceBeforeDiscount * (ageDiscountPercentage / 100));
    const leadPrice = priceBeforeDiscount - ageDiscount;
    
    console.log("Lead pricing breakdown:", {
      basePrice,
      locationPremium,
      complexityAdjustment,
      priceBeforeDiscount,
      hoursOld,
      ageDiscountPercentage,
      ageDiscount,
      finalPrice: leadPrice,
      volume,
      fromCanton,
      toCanton
    });

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
