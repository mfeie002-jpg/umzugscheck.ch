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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { transactionId, conversionStatus, actualJobValue, conversionNotes, lostReason } = await req.json();

    if (!transactionId || !conversionStatus) {
      return new Response(
        JSON.stringify({ error: 'Transaction ID and conversion status are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the provider owns this transaction
    const { data: user } = await supabaseClient.auth.getUser();
    if (!user.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get provider ID from service_providers table
    const { data: provider, error: providerError } = await supabaseClient
      .from('service_providers')
      .select('id')
      .eq('email', user.user.email)
      .single();

    if (providerError || !provider) {
      return new Response(
        JSON.stringify({ error: 'Provider not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update the lead transaction
    const updateData: any = {
      conversion_status: conversionStatus,
      conversion_notes: conversionNotes || null,
    };

    if (conversionStatus === 'converted') {
      updateData.actual_job_value = actualJobValue || null;
      updateData.conversion_date = new Date().toISOString();
    }

    if (conversionStatus === 'lost') {
      updateData.lost_reason = lostReason || null;
    }

    const { data, error } = await supabaseClient
      .from('lead_transactions')
      .update(updateData)
      .eq('id', transactionId)
      .eq('provider_id', provider.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating conversion:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in update-lead-conversion:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
