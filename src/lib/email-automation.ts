import { supabase } from '@/integrations/supabase/client';

export interface EmailCampaign {
  id: string;
  name: string;
  campaignType: 'welcome' | 'reminder' | 'follow_up' | 'review_request';
  subject: string;
  bodyTemplate: string;
  triggerEvent: string;
  triggerDelayHours: number;
  isActive: boolean;
}

export interface EmailQueueItem {
  id: string;
  scheduled_for: string;
  campaign_id: string;
  recipient_email: string;
  recipient_name?: string;
  lead_id?: string;
  status: 'pending' | 'sent' | 'failed';
  metadata?: any;
  created_at?: string;
  sent_at?: string;
  error_message?: string;
}

/**
 * Schedule welcome email when lead is created
 */
export const scheduleWelcomeEmail = async (
  leadId: string,
  recipientEmail: string,
  recipientName: string
) => {
  try {
    // Get welcome email campaign
    const { data: campaign } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('campaign_type', 'welcome')
      .eq('is_active', true)
      .single();

    if (!campaign) return;

    // Schedule email
    const scheduledFor = new Date(Date.now() + campaign.trigger_delay_hours * 60 * 60 * 1000);
    
    await supabase
      .from('email_queue')
      .insert({
        campaign_id: campaign.id,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        lead_id: leadId,
        scheduled_for: scheduledFor.toISOString(),
        status: 'pending'
      });

    console.log('Welcome email scheduled for', recipientEmail);
  } catch (error) {
    console.error('Error scheduling welcome email:', error);
  }
};

/**
 * Schedule reminder email
 */
export const scheduleReminderEmail = async (
  leadId: string,
  recipientEmail: string,
  recipientName: string,
  daysDelay: number = 3
) => {
  try {
    const { data: campaign } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('campaign_type', 'reminder')
      .eq('is_active', true)
      .single();

    if (!campaign) return;

    const scheduledFor = new Date(Date.now() + daysDelay * 24 * 60 * 60 * 1000);
    
    await supabase
      .from('email_queue')
      .insert({
        campaign_id: campaign.id,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        lead_id: leadId,
        scheduled_for: scheduledFor.toISOString(),
        status: 'pending',
        metadata: { daysDelay }
      });

    console.log('Reminder email scheduled for', recipientEmail);
  } catch (error) {
    console.error('Error scheduling reminder email:', error);
  }
};

/**
 * Schedule follow-up email after quote is sent
 */
export const scheduleFollowUpEmail = async (
  leadId: string,
  recipientEmail: string,
  recipientName: string,
  companyNames: string[]
) => {
  try {
    const { data: campaign } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('campaign_type', 'follow_up')
      .eq('is_active', true)
      .single();

    if (!campaign) return;

    const scheduledFor = new Date(Date.now() + campaign.trigger_delay_hours * 60 * 60 * 1000);
    
    await supabase
      .from('email_queue')
      .insert({
        campaign_id: campaign.id,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        lead_id: leadId,
        scheduled_for: scheduledFor.toISOString(),
        status: 'pending',
        metadata: { companyNames }
      });

    console.log('Follow-up email scheduled for', recipientEmail);
  } catch (error) {
    console.error('Error scheduling follow-up email:', error);
  }
};

/**
 * Schedule review request email after move is completed
 */
export const scheduleReviewRequestEmail = async (
  leadId: string,
  recipientEmail: string,
  recipientName: string,
  companyId: string,
  companyName: string
) => {
  try {
    const { data: campaign } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('campaign_type', 'review_request')
      .eq('is_active', true)
      .single();

    if (!campaign) return;

    // Schedule 7 days after move completion
    const scheduledFor = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await supabase
      .from('email_queue')
      .insert({
        campaign_id: campaign.id,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        lead_id: leadId,
        scheduled_for: scheduledFor.toISOString(),
        status: 'pending',
        metadata: { companyId, companyName }
      });

    console.log('Review request email scheduled for', recipientEmail);
  } catch (error) {
    console.error('Error scheduling review request email:', error);
  }
};

/**
 * Get pending emails for admin dashboard
 */
export const getPendingEmails = async () => {
  try {
    const { data, error } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .order('scheduled_for', { ascending: true })
      .limit(100);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching pending emails:', error);
    return [];
  }
};

/**
 * Track conversion in analytics
 */
export const trackConversion = async (
  city: string,
  service: string,
  conversionType: 'lead_created' | 'quote_requested' | 'company_contacted',
  leadId?: string,
  companyId?: string,
  sourcePage?: string
) => {
  try {
    await supabase
      .from('conversion_analytics')
      .insert({
        city,
        service,
        conversion_type: conversionType,
        lead_id: leadId,
        company_id: companyId,
        source_page: sourcePage,
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      });
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
};
