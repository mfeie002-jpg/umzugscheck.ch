import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertPayload {
  alert_type: string;
  company_name?: string;
  message: string;
  threshold_value?: number;
  current_value?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: AlertPayload = await req.json();

    console.log('Processing ranking alert:', payload);

    // Get admin email settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('email_automation_settings')
      .select('*')
      .eq('alert_type', payload.alert_type)
      .eq('enabled', true)
      .single();

    if (settingsError || !settings) {
      console.log('No active alert settings found for:', payload.alert_type);
      return new Response(
        JSON.stringify({ success: true, message: 'No active alerts configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check frequency - don't send if recently sent
    if (settings.last_sent_at) {
      const lastSent = new Date(settings.last_sent_at);
      const now = new Date();
      const hoursSinceLastSent = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);

      const frequencyHours: Record<string, number> = {
        immediate: 0,
        hourly: 1,
        daily: 24,
        weekly: 168,
      };

      const hoursSinceFrequency = frequencyHours[settings.frequency] || 24;

      if (hoursSinceLastSent < hoursSinceFrequency) {
        console.log('Alert sent too recently, skipping');
        return new Response(
          JSON.stringify({ success: true, message: 'Alert frequency not met' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check threshold if applicable
    if (settings.threshold_value && payload.current_value !== undefined) {
      if (payload.current_value < settings.threshold_value) {
        console.log('Threshold not met, skipping alert');
        return new Response(
          JSON.stringify({ success: true, message: 'Threshold not met' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Send email notification (mock for now - would integrate with email service)
    console.log('Would send email alert:', {
      type: payload.alert_type,
      company: payload.company_name,
      message: payload.message,
    });

    // Update last_sent_at
    await supabaseClient
      .from('email_automation_settings')
      .update({ last_sent_at: new Date().toISOString() })
      .eq('id', settings.id);

    return new Response(
      JSON.stringify({ success: true, message: 'Alert sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error sending ranking alert:', error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
