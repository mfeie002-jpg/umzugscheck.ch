import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!STRIPE_SECRET_KEY) {
      throw new Error("Stripe not configured");
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { 
      provider_id, 
      lead_id, 
      amount, 
      description,
      payment_type = "lead_purchase",
      success_url,
      cancel_url 
    } = await req.json();

    if (!provider_id || !amount) {
      throw new Error("Missing required fields: provider_id, amount");
    }

    // Get provider info
    const { data: provider } = await supabase
      .from("service_providers")
      .select("email, company_name")
      .eq("id", provider_id)
      .single();

    if (!provider) {
      throw new Error("Provider not found");
    }

    // Check if customer exists in Stripe
    let customerId: string | undefined;
    const customers = await stripe.customers.list({ email: provider.email, limit: 1 });
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: provider.email,
        name: provider.company_name,
        metadata: { provider_id }
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "chf",
            product_data: {
              name: description || "Lead Purchase",
              description: lead_id ? `Lead ID: ${lead_id}` : "Umzugscheck.ch Service"
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: success_url || "https://umzugscheckv2.lovable.app/anbieter/dashboard?payment=success",
      cancel_url: cancel_url || "https://umzugscheckv2.lovable.app/anbieter/dashboard?payment=canceled",
      metadata: {
        provider_id,
        lead_id: lead_id || "",
        amount: String(amount),
        payment_type
      }
    });

    // Create pending payment record
    await supabase.from("payment_history").insert({
      provider_id,
      amount,
      payment_type,
      status: "pending",
      stripe_payment_id: session.id,
      description: description || "Lead purchase",
      metadata: { checkout_session_id: session.id, lead_id }
    });

    return new Response(
      JSON.stringify({ 
        sessionId: session.id, 
        url: session.url 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
