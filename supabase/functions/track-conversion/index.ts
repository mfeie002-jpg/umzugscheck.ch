/**
 * Conversion Tracking Edge Function
 * 
 * Persists UTM/gclid attribution data and conversion events to Supabase.
 * Critical for paid media ROI tracking.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConversionPayload {
  event_type: 'form_start' | 'form_submit' | 'call_click' | 'whatsapp_start' | 'chat_start' | 'company_view' | 'lead_created';
  visitor_id: string;
  session_id?: string;
  // Attribution data
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  // Context
  page_url?: string;
  referrer?: string;
  device_type?: 'mobile' | 'tablet' | 'desktop';
  // Conversion data
  lead_id?: string;
  company_id?: string;
  estimated_value?: number;
  metadata?: Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: ConversionPayload = await req.json();

    // Validate required fields
    if (!payload.event_type || !payload.visitor_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: event_type, visitor_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client IP for geo approximation
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Build conversion record
    const conversionRecord = {
      event_type: payload.event_type,
      visitor_id: payload.visitor_id,
      session_id: payload.session_id || null,
      // UTM data
      utm_source: payload.utm_source || null,
      utm_medium: payload.utm_medium || null,
      utm_campaign: payload.utm_campaign || null,
      utm_content: payload.utm_content || null,
      utm_term: payload.utm_term || null,
      // Click IDs (critical for Google/Meta Ads)
      gclid: payload.gclid || null,
      gbraid: payload.gbraid || null,
      wbraid: payload.wbraid || null,
      fbclid: payload.fbclid || null,
      // Context
      page_url: payload.page_url || null,
      referrer: payload.referrer || null,
      device_type: payload.device_type || 'desktop',
      client_ip: clientIP,
      // Conversion data
      lead_id: payload.lead_id || null,
      company_id: payload.company_id || null,
      estimated_value: payload.estimated_value || null,
      metadata: payload.metadata || null,
      // Timestamps
      created_at: new Date().toISOString(),
    };

    // Insert into conversion_events table
    const { data, error } = await supabase
      .from('conversion_events')
      .insert(conversionRecord)
      .select('id')
      .single();

    if (error) {
      console.error('Error storing conversion:', error);
      
      // If table doesn't exist, log and return success anyway (non-blocking)
      if (error.code === '42P01') {
        console.warn('conversion_events table not found - event logged but not persisted');
        return new Response(
          JSON.stringify({ success: true, warning: 'Table not configured', event_logged: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Conversion tracked:', payload.event_type, 'visitor:', payload.visitor_id);

    return new Response(
      JSON.stringify({ success: true, conversion_id: data?.id }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in track-conversion:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
