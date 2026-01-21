import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    // In production, verify webhook signature
    // For now, parse the event directly
    const event = JSON.parse(body);

    console.log("Stripe webhook event:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { provider_id, lead_id, amount, payment_type } = session.metadata || {};

        if (provider_id && lead_id) {
          // Record the payment
          await supabase.from("payment_history").insert({
            provider_id,
            amount: parseFloat(amount) / 100,
            payment_type: payment_type || "lead_purchase",
            status: "completed",
            stripe_payment_id: session.payment_intent,
            description: `Lead purchase via Stripe`,
            metadata: { session_id: session.id, lead_id }
          });

          // Update lead transaction
          await supabase.from("lead_transactions").update({
            status: "completed",
            stripe_payment_intent_id: session.payment_intent
          }).eq("lead_id", lead_id).eq("provider_id", provider_id);

          console.log(`Payment completed for provider ${provider_id}, lead ${lead_id}`);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("Payment intent succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.log("Payment failed:", paymentIntent.id, paymentIntent.last_payment_error?.message);
        
        if (paymentIntent.metadata?.provider_id) {
          await supabase.from("payment_history").insert({
            provider_id: paymentIntent.metadata.provider_id,
            amount: paymentIntent.amount / 100,
            payment_type: "failed",
            status: "failed",
            stripe_payment_id: paymentIntent.id,
            description: paymentIntent.last_payment_error?.message || "Payment failed"
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const { provider_id } = subscription.metadata || {};

        if (provider_id) {
          await supabase.from("provider_subscriptions").upsert({
            provider_id,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: "stripe_subscription_id" });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await supabase.from("provider_subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        console.log("Invoice paid:", invoice.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
