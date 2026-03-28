import { supabase } from "@/integrations/supabase/client";

type EmailTemplate = "lead_notification" | "bid_update" | "welcome_provider" | "lead_won" | "payment_confirmation";

interface EmailData {
  to: string;
  subject: string;
  template: EmailTemplate;
  data: Record<string, any>;
}

export async function sendEmail(emailData: EmailData): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: emailData
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (err: any) {
    console.error("Email service error:", err);
    return { success: false, error: err.message };
  }
}

// Pre-built notification functions
export async function notifyProviderNewLead(
  providerEmail: string,
  lead: {
    from_city: string;
    to_city: string;
    move_date: string;
    volume?: string;
    estimated_value?: number;
    bidding_enabled?: boolean;
    starting_bid?: number;
    bidding_closes_at?: string;
  }
) {
  return sendEmail({
    to: providerEmail,
    subject: `🚚 Neuer Lead: ${lead.from_city} → ${lead.to_city}`,
    template: "lead_notification",
    data: lead
  });
}

export async function notifyBidUpdate(
  providerEmail: string,
  bidData: {
    message: string;
    from_city: string;
    to_city: string;
    your_bid: number;
    highest_bid: number;
    time_remaining: string;
  }
) {
  return sendEmail({
    to: providerEmail,
    subject: `🔔 Bid-Update: ${bidData.from_city} → ${bidData.to_city}`,
    template: "bid_update",
    data: bidData
  });
}

export async function notifyLeadWon(
  providerEmail: string,
  winData: {
    from_city: string;
    to_city: string;
    winning_bid: number;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
  }
) {
  return sendEmail({
    to: providerEmail,
    subject: `🏆 Lead gewonnen: ${winData.from_city} → ${winData.to_city}`,
    template: "lead_won",
    data: winData
  });
}

export async function sendWelcomeEmail(providerEmail: string, companyName: string) {
  return sendEmail({
    to: providerEmail,
    subject: `🎉 Willkommen bei Umzugscheck.ch, ${companyName}!`,
    template: "welcome_provider",
    data: { company_name: companyName }
  });
}

export async function sendPaymentConfirmation(
  email: string,
  paymentData: {
    amount: number;
    description: string;
    transaction_id: string;
    date: string;
  }
) {
  return sendEmail({
    to: email,
    subject: `✅ Zahlung bestätigt - CHF ${paymentData.amount}`,
    template: "payment_confirmation",
    data: paymentData
  });
}
