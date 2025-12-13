import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

// Validate webhook secret for internal calls
function validateWebhookSecret(req: Request): boolean {
  const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.warn("WEBHOOK_SECRET not configured - allowing request for backward compatibility");
    return true;
  }
  const providedSecret = req.headers.get("x-webhook-secret") || req.headers.get("X-Webhook-Secret");
  return providedSecret === webhookSecret;
}

interface SMSRequest {
  providerId: string;
  phoneNumber: string;
  message: string;
  type: 'new_lead' | 'urgent_lead' | 'review' | 'payment';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate webhook secret
  if (!validateWebhookSecret(req)) {
    console.error("Invalid or missing webhook secret");
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { providerId, phoneNumber, message, type }: SMSRequest = await req.json();

    // Validate phone number format (Swiss)
    const phoneRegex = /^\+41[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      // Try to format the number
      let formattedPhone = phoneNumber.replace(/\s+/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+41' + formattedPhone.substring(1);
      }
      if (!phoneRegex.test(formattedPhone)) {
        throw new Error("Invalid phone number format. Expected Swiss format: +41XXXXXXXXX");
      }
    }

    // Log SMS attempt (for demo purposes, actual SMS sending requires Twilio setup)
    console.log(`SMS notification requested:`, {
      providerId,
      phoneNumber,
      type,
      messageLength: message.length,
    });

    // Check if Twilio is configured
    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.log("Twilio not configured - SMS simulation mode");
      
      // Simulate successful SMS for demo
      return new Response(
        JSON.stringify({ 
          success: true, 
          simulated: true,
          message: "SMS would be sent (Twilio not configured)",
          details: {
            to: phoneNumber,
            body: message.substring(0, 160),
            type,
          }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send actual SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    
    const smsResponse = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: phoneNumber,
        From: twilioPhoneNumber,
        Body: message.substring(0, 160), // SMS character limit
      }),
    });

    const smsResult = await smsResponse.json();

    if (!smsResponse.ok) {
      throw new Error(`Twilio error: ${smsResult.message || 'Unknown error'}`);
    }

    console.log(`SMS sent successfully:`, smsResult.sid);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sid: smsResult.sid,
        status: smsResult.status 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-sms-notification:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
