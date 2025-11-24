import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PriceDropNotification {
  leadId: string;
  previousPrice: number;
  newPrice: number;
  dropPercentage: number;
  leadDetails: any;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Checking for leads with price drops...');

    // Get all active leads that haven't been purchased yet
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .eq('status', 'new')
      .or('bidding_enabled.eq.true,bidding_enabled.is.null');

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      throw leadsError;
    }

    const notifications: PriceDropNotification[] = [];

    for (const lead of leads || []) {
      const createdAt = new Date(lead.created_at);
      const now = new Date();
      const hoursOld = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      // Check if lead just crossed 24h or 48h threshold
      const justCrossed24h = hoursOld >= 24 && hoursOld < 25;
      const justCrossed48h = hoursOld >= 48 && hoursOld < 49;

      if (justCrossed24h || justCrossed48h) {
        const dropPercentage = justCrossed24h ? 15 : 30;
        
        // Calculate original and new price (simplified)
        const basePrice = 30;
        const previousPrice = basePrice;
        const newPrice = Math.round(basePrice * (1 - dropPercentage / 100));

        notifications.push({
          leadId: lead.id,
          previousPrice,
          newPrice,
          dropPercentage,
          leadDetails: {
            from_city: lead.from_city,
            to_city: lead.to_city,
            volume: lead.calculator_output?.volumeM3 || lead.calculator_output?.volume,
            move_date: lead.move_date,
          },
        });

        console.log(`Price drop detected for lead ${lead.id}: ${dropPercentage}% off`);
      }
    }

    // Get matching providers for each lead with price drop
    const providerNotifications = new Map<string, PriceDropNotification[]>();

    for (const notification of notifications) {
      const { data: lead } = await supabase
        .from('leads')
        .select('assigned_provider_ids')
        .eq('id', notification.leadId)
        .single();

      if (lead?.assigned_provider_ids) {
        for (const providerId of lead.assigned_provider_ids) {
          if (!providerNotifications.has(providerId)) {
            providerNotifications.set(providerId, []);
          }
          providerNotifications.get(providerId)!.push(notification);
        }
      }
    }

    // Send email notifications to providers
    const emailsSent: string[] = [];

    for (const [providerId, providerNotifs] of providerNotifications.entries()) {
      const { data: provider } = await supabase
        .from('service_providers')
        .select('email, company_name')
        .eq('id', providerId)
        .single();

      if (provider?.email) {
        // TODO: Integrate with email service (SendGrid, Resend, etc.)
        console.log(`Would send email to ${provider.email} about ${providerNotifs.length} price drops`);
        
        // For now, just log the notification
        providerNotifs.forEach(notif => {
          console.log(`  - Lead ${notif.leadId}: ${notif.previousPrice} CHF → ${notif.newPrice} CHF (${notif.dropPercentage}% off)`);
        });

        emailsSent.push(provider.email);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          notificationsGenerated: notifications.length,
          providersNotified: emailsSent.length,
          notifications,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in notify-price-drop:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
