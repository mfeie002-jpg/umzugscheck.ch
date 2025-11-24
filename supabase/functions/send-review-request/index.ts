import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { leadId, providerId } = await req.json();

    // Get lead and provider details
    const { data: lead } = await supabase
      .from('leads')
      .select('*, lead_transactions!inner(*)')
      .eq('id', leadId)
      .eq('lead_transactions.provider_id', providerId)
      .single();

    if (!lead) {
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: provider } = await supabase
      .from('service_providers')
      .select('company_name')
      .eq('id', providerId)
      .single();

    // Create review request
    const { data: reviewRequest, error: insertError } = await supabase
      .from('review_requests')
      .insert({
        lead_id: leadId,
        provider_id: providerId,
        customer_email: lead.email,
        customer_name: lead.name,
        request_sent_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Send email via send-email function
    await supabase.functions.invoke('send-email', {
      body: {
        type: 'review_request',
        to: lead.email,
        data: {
          customerName: lead.name,
          companyName: provider?.company_name,
          reviewLink: `${Deno.env.get('SITE_URL')}/bewertung/${reviewRequest.id}`
        }
      }
    });

    console.log('Review request sent:', reviewRequest.id);

    return new Response(
      JSON.stringify({ success: true, reviewRequestId: reviewRequest.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-review-request:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
