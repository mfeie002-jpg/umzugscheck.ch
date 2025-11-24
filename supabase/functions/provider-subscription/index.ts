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

    const { action, providerId, planId, subscriptionId } = await req.json();

    console.log("Subscription action:", action, { providerId, planId, subscriptionId });

    switch (action) {
      case "create": {
        // Create new subscription
        const { data: plan, error: planError } = await supabase
          .from("subscription_plans")
          .select("*")
          .eq("id", planId)
          .single();

        if (planError) throw planError;

        // TODO: Create Stripe subscription here
        const stripeSubscriptionId = `stripe_sub_${Date.now()}`; // Placeholder

        const { data: subscription, error: subscriptionError } = await supabase
          .from("provider_subscriptions")
          .insert({
            provider_id: providerId,
            plan_id: planId,
            status: "active",
            start_date: new Date().toISOString(),
            stripe_subscription_id: stripeSubscriptionId,
          })
          .select()
          .single();

        if (subscriptionError) throw subscriptionError;

        // Record payment
        await supabase.from("payment_history").insert({
          provider_id: providerId,
          amount: plan.price_monthly,
          payment_type: "subscription",
          status: "completed",
          description: `Subscription: ${plan.name}`,
          stripe_payment_id: stripeSubscriptionId,
          metadata: { plan_id: planId, subscription_id: subscription.id },
        });

        return new Response(JSON.stringify({ success: true, subscription }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "cancel": {
        // Cancel subscription
        const { error: cancelError } = await supabase
          .from("provider_subscriptions")
          .update({ status: "cancelled", end_date: new Date().toISOString() })
          .eq("id", subscriptionId);

        if (cancelError) throw cancelError;

        return new Response(
          JSON.stringify({ success: true, message: "Subscription cancelled" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get": {
        // Get provider subscription info
        const { data: subscription, error: subError } = await supabase
          .from("provider_subscriptions")
          .select(`
            *,
            subscription_plans (*)
          `)
          .eq("provider_id", providerId)
          .eq("status", "active")
          .single();

        if (subError && subError.code !== "PGRST116") throw subError;

        return new Response(JSON.stringify({ success: true, subscription }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        throw new Error("Invalid action");
    }
  } catch (error: any) {
    console.error("Error in provider-subscription:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
