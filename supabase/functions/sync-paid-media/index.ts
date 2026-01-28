import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleAdsMetrics {
  campaign_id: string;
  campaign_name: string;
  campaign_type: string;
  date: string;
  impressions: number;
  clicks: number;
  cost_micros: number;
  conversions: number;
  conversion_value: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { platform, action, manual_data } = await req.json();

    // Create sync log entry
    const { data: syncLog, error: syncLogError } = await supabase
      .from('paid_media_sync_log')
      .insert({
        platform: platform || 'google_ads',
        sync_type: action === 'manual' ? 'manual' : 'scheduled',
        status: 'running',
      })
      .select()
      .single();

    if (syncLogError) throw syncLogError;

    let recordsSynced = 0;

    if (action === 'manual' && manual_data) {
      // Manual data import
      recordsSynced = await importManualData(supabase, platform, manual_data);
    } else if (platform === 'google_ads') {
      // Google Ads API sync (placeholder - requires OAuth setup)
      recordsSynced = await syncGoogleAds(supabase);
    }

    // Update sync log
    await supabase
      .from('paid_media_sync_log')
      .update({
        status: 'success',
        records_synced: recordsSynced,
        completed_at: new Date().toISOString(),
      })
      .eq('id', syncLog.id);

    // Check kill switches after sync
    await supabase.rpc('check_paid_media_kill_switches');

    return new Response(
      JSON.stringify({
        success: true,
        records_synced: recordsSynced,
        sync_id: syncLog.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Sync error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function importManualData(supabase: any, platform: string, data: any[]): Promise<number> {
  let count = 0;

  for (const row of data) {
    // Upsert campaign
    const { data: campaign } = await supabase
      .from('paid_media_campaigns')
      .upsert({
        platform,
        campaign_id: row.campaign_id,
        campaign_name: row.campaign_name,
        campaign_type: row.campaign_type || 'unknown',
        daily_budget_chf: row.daily_budget || null,
      }, { onConflict: 'platform,campaign_id' })
      .select()
      .single();

    if (campaign) {
      // Insert daily metrics
      await supabase
        .from('paid_media_daily_metrics')
        .upsert({
          campaign_id: campaign.id,
          date: row.date,
          impressions: row.impressions || 0,
          clicks: row.clicks || 0,
          cost_chf: row.cost_chf || row.cost || 0,
          conversions: row.conversions || 0,
          conversion_value_chf: row.conversion_value_chf || row.conversion_value || 0,
        }, { onConflict: 'campaign_id,date' });

      count++;
    }
  }

  return count;
}

async function syncGoogleAds(supabase: any): Promise<number> {
  // Placeholder for Google Ads API integration
  // Requires:
  // - GOOGLE_ADS_DEVELOPER_TOKEN
  // - GOOGLE_ADS_CLIENT_ID
  // - GOOGLE_ADS_CLIENT_SECRET
  // - GOOGLE_ADS_REFRESH_TOKEN
  // - GOOGLE_ADS_CUSTOMER_ID
  
  const googleAdsToken = Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN');
  const googleAdsRefreshToken = Deno.env.get('GOOGLE_ADS_REFRESH_TOKEN');
  
  if (!googleAdsToken || !googleAdsRefreshToken) {
    console.log('Google Ads credentials not configured - skipping API sync');
    return 0;
  }

  // TODO: Implement actual Google Ads API call
  // 1. Get access token using refresh token
  // 2. Call Google Ads API for campaign metrics
  // 3. Transform and store data

  return 0;
}
