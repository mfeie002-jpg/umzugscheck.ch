import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  type: 'new_lead' | 'bid_update' | 'review_submitted' | 'performance_milestone';
  recipientId: string;
  title: string;
  message: string;
  data?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: NotificationPayload = await req.json();

    // Send push notification if user has enabled it
    // This would integrate with web push API or Firebase Cloud Messaging
    
    // For now, log the notification
    console.log('Notification sent:', {
      type: payload.type,
      recipient: payload.recipientId,
      title: payload.title
    });

    // Broadcast via Supabase Realtime
    await supabase
      .channel('notifications')
      .send({
        type: 'broadcast',
        event: payload.type,
        payload: {
          recipientId: payload.recipientId,
          title: payload.title,
          message: payload.message,
          data: payload.data,
          timestamp: new Date().toISOString()
        }
      });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
