import { supabase } from "@/integrations/supabase/client";

interface CheckoutOptions {
  providerId: string;
  leadId?: string;
  amount: number;
  description: string;
  paymentType?: "lead_purchase" | "subscription" | "bid_purchase" | "credit_topup";
  successUrl?: string;
  cancelUrl?: string;
}

export async function createCheckoutSession(options: CheckoutOptions): Promise<{ url: string | null; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        provider_id: options.providerId,
        lead_id: options.leadId,
        amount: options.amount,
        description: options.description,
        payment_type: options.paymentType || "lead_purchase",
        success_url: options.successUrl,
        cancel_url: options.cancelUrl
      }
    });

    if (error) {
      console.error("Checkout error:", error);
      return { url: null, error: error.message };
    }

    return { url: data.url };
  } catch (err: any) {
    console.error("Stripe service error:", err);
    return { url: null, error: err.message };
  }
}

export async function purchaseLead(providerId: string, leadId: string, amount: number, fromCity: string, toCity: string) {
  return createCheckoutSession({
    providerId,
    leadId,
    amount,
    description: `Lead: ${fromCity} → ${toCity}`,
    paymentType: "lead_purchase"
  });
}

export async function purchaseBidWin(providerId: string, leadId: string, bidAmount: number, fromCity: string, toCity: string) {
  return createCheckoutSession({
    providerId,
    leadId,
    amount: bidAmount,
    description: `Gewonnenes Bid: ${fromCity} → ${toCity}`,
    paymentType: "bid_purchase"
  });
}

export async function topUpCredits(providerId: string, amount: number) {
  return createCheckoutSession({
    providerId,
    amount,
    description: `Guthaben aufladen: CHF ${amount}`,
    paymentType: "credit_topup"
  });
}

// Payment history utilities
export async function getProviderPaymentHistory(providerId: string) {
  const { data, error } = await supabase
    .from("payment_history")
    .select("*")
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching payment history:", error);
    return [];
  }

  return data || [];
}

export async function getProviderBalance(providerId: string): Promise<number> {
  const { data, error } = await supabase
    .from("payment_history")
    .select("amount, payment_type, status")
    .eq("provider_id", providerId)
    .eq("status", "completed");

  if (error || !data) return 0;

  return data.reduce((balance, payment) => {
    if (payment.payment_type === "credit_topup") {
      return balance + payment.amount;
    } else {
      return balance - payment.amount;
    }
  }, 0);
}
