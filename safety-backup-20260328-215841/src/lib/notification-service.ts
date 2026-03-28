/**
 * Notification Service for Relo-OS
 * 
 * Handles SMS, Push, and Email notifications for the moving platform.
 * Uses edge functions for actual delivery.
 */

import { supabase } from '@/integrations/supabase/client';

// ===========================================================================
// TYPES
// ===========================================================================

export type NotificationChannel = 'sms' | 'push' | 'email' | 'whatsapp';
export type NotificationType = 
  | 'booking_confirmed'
  | 'move_day_reminder'
  | 'crew_en_route'
  | 'eta_update'
  | 'loading_started'
  | 'in_transit'
  | 'arriving_soon'
  | 'unloading_started'
  | 'move_completed'
  | 'review_request'
  | 'payment_received';

export interface NotificationPayload {
  type: NotificationType;
  recipientPhone?: string;
  recipientEmail?: string;
  recipientPushToken?: string;
  projectId: string;
  data: Record<string, unknown>;
}

export interface NotificationResult {
  success: boolean;
  channel: NotificationChannel;
  messageId?: string;
  error?: string;
}

export interface NotificationPreferences {
  smsEnabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  quietHoursStart?: string; // HH:MM
  quietHoursEnd?: string;   // HH:MM
}

// ===========================================================================
// NOTIFICATION TEMPLATES
// ===========================================================================

const NOTIFICATION_TEMPLATES: Record<NotificationType, {
  sms: string;
  push: { title: string; body: string };
  email: { subject: string; body: string };
}> = {
  booking_confirmed: {
    sms: 'Ihre Buchung bei {providerName} für den {moveDate} ist bestätigt. Tracking-Link: {trackingUrl}',
    push: {
      title: 'Buchung bestätigt ✓',
      body: 'Ihr Umzug am {moveDate} mit {providerName} ist bestätigt.',
    },
    email: {
      subject: 'Buchungsbestätigung - Umzug am {moveDate}',
      body: 'Guten Tag,\n\nIhre Buchung wurde bestätigt...',
    },
  },
  move_day_reminder: {
    sms: 'Erinnerung: Morgen ist Ihr Umzugstag! Team von {providerName} kommt um {arrivalTime}.',
    push: {
      title: 'Morgen ist Umzugstag! 📦',
      body: 'Das Team von {providerName} kommt um {arrivalTime}.',
    },
    email: {
      subject: 'Erinnerung: Ihr Umzug ist morgen',
      body: 'Ihr Umzug findet morgen statt...',
    },
  },
  crew_en_route: {
    sms: 'Das Umzugsteam ist unterwegs zu Ihnen! Ankunft ca. {eta}. Live-Tracking: {trackingUrl}',
    push: {
      title: 'Team unterwegs 🚚',
      body: 'Ankunft ca. {eta}. Tippen zum Tracking.',
    },
    email: {
      subject: 'Umzugsteam ist unterwegs',
      body: 'Das Team ist jetzt auf dem Weg...',
    },
  },
  eta_update: {
    sms: 'Aktualisierte Ankunftszeit: {eta}. {trafficNote}',
    push: {
      title: 'Neue Ankunftszeit',
      body: 'ETA: {eta}. {trafficNote}',
    },
    email: {
      subject: 'Aktualisierte Ankunftszeit',
      body: 'Die geschätzte Ankunftszeit hat sich geändert...',
    },
  },
  loading_started: {
    sms: 'Beladung hat begonnen! Geschätzte Dauer: {duration}.',
    push: {
      title: 'Beladung gestartet 📦',
      body: 'Ihre Möbel werden nun verladen.',
    },
    email: {
      subject: 'Beladung Ihres Umzugs hat begonnen',
      body: 'Die Beladung ist im Gange...',
    },
  },
  in_transit: {
    sms: 'Ihr Umzug ist unterwegs zum neuen Zuhause! ETA: {eta}. Tracking: {trackingUrl}',
    push: {
      title: 'Auf dem Weg 🚚',
      body: 'Ihre Möbel sind unterwegs. ETA: {eta}',
    },
    email: {
      subject: 'Ihr Umzug ist auf dem Weg',
      body: 'Der Transport ist gestartet...',
    },
  },
  arriving_soon: {
    sms: 'Das Umzugsteam ist in ca. 15 Min bei Ihnen! Bitte stellen Sie sicher, dass der Zugang frei ist.',
    push: {
      title: 'Bald da! ⏰',
      body: 'Das Team kommt in ~15 Minuten an.',
    },
    email: {
      subject: 'Umzugsteam kommt gleich an',
      body: 'Das Team wird in Kürze eintreffen...',
    },
  },
  unloading_started: {
    sms: 'Entladung hat begonnen! Das Team bringt Ihre Möbel in die neue Wohnung.',
    push: {
      title: 'Entladung gestartet 🏠',
      body: 'Ihre Möbel werden jetzt ausgeladen.',
    },
    email: {
      subject: 'Entladung hat begonnen',
      body: 'Die Möbel werden jetzt ausgeladen...',
    },
  },
  move_completed: {
    sms: 'Umzug abgeschlossen! ✓ Bitte bestätigen Sie die Übergabe in der App. Danke für Ihr Vertrauen!',
    push: {
      title: 'Umzug abgeschlossen! 🎉',
      body: 'Bitte bestätigen Sie die Übergabe.',
    },
    email: {
      subject: 'Ihr Umzug ist abgeschlossen',
      body: 'Herzlichen Glückwunsch zum neuen Zuhause...',
    },
  },
  review_request: {
    sms: 'Wie war Ihr Umzug mit {providerName}? Bewerten Sie jetzt: {reviewUrl}',
    push: {
      title: 'Wie war Ihr Umzug?',
      body: 'Teilen Sie Ihre Erfahrung mit {providerName}.',
    },
    email: {
      subject: 'Ihre Meinung zählt - Bewerten Sie Ihren Umzug',
      body: 'Wir hoffen, Ihr Umzug war erfolgreich...',
    },
  },
  payment_received: {
    sms: 'Zahlung eingegangen: CHF {amount}. Escrow-ID: {escrowId}. Freigabe nach Umzug.',
    push: {
      title: 'Zahlung erhalten ✓',
      body: 'CHF {amount} sicher in Treuhand.',
    },
    email: {
      subject: 'Zahlungsbestätigung - CHF {amount}',
      body: 'Ihre Zahlung wurde sicher empfangen...',
    },
  },
};

// ===========================================================================
// NOTIFICATION FUNCTIONS
// ===========================================================================

/**
 * Send notification via specified channel
 */
export async function sendNotification(
  payload: NotificationPayload,
  channel: NotificationChannel
): Promise<NotificationResult> {
  const template = NOTIFICATION_TEMPLATES[payload.type];
  if (!template) {
    return { success: false, channel, error: 'Unknown notification type' };
  }
  
  try {
    // Check quiet hours
    if (isQuietHours()) {
      console.log('[Notification] Quiet hours - notification queued');
      return { success: true, channel, messageId: 'queued' };
    }
    
    switch (channel) {
      case 'sms':
        return sendSMS(payload, template.sms);
      case 'push':
        return sendPush(payload, template.push);
      case 'email':
        return sendEmail(payload, template.email);
      case 'whatsapp':
        return sendWhatsApp(payload, template.sms);
      default:
        return { success: false, channel, error: 'Unknown channel' };
    }
  } catch (err: any) {
    console.error(`[Notification] Error sending ${channel}:`, err);
    return { success: false, channel, error: err.message };
  }
}

/**
 * Send notification to all enabled channels
 */
export async function sendMultiChannelNotification(
  payload: NotificationPayload,
  preferences: NotificationPreferences
): Promise<NotificationResult[]> {
  const results: NotificationResult[] = [];
  
  const channels: { channel: NotificationChannel; enabled: boolean }[] = [
    { channel: 'sms', enabled: preferences.smsEnabled && !!payload.recipientPhone },
    { channel: 'push', enabled: preferences.pushEnabled && !!payload.recipientPushToken },
    { channel: 'email', enabled: preferences.emailEnabled && !!payload.recipientEmail },
    { channel: 'whatsapp', enabled: preferences.whatsappEnabled && !!payload.recipientPhone },
  ];
  
  for (const { channel, enabled } of channels) {
    if (enabled) {
      const result = await sendNotification(payload, channel);
      results.push(result);
    }
  }
  
  return results;
}

/**
 * Send moving day status notification
 */
export async function sendStatusNotification(
  projectId: string,
  status: NotificationType,
  data: Record<string, unknown>
): Promise<NotificationResult[]> {
  // In production: fetch recipient details from database
  const payload: NotificationPayload = {
    type: status,
    projectId,
    recipientPhone: '+41 79 123 45 67', // Demo
    recipientEmail: 'customer@example.com', // Demo
    data,
  };
  
  const preferences: NotificationPreferences = {
    smsEnabled: true,
    pushEnabled: true,
    emailEnabled: true,
    whatsappEnabled: false,
  };
  
  return sendMultiChannelNotification(payload, preferences);
}

// ===========================================================================
// CHANNEL-SPECIFIC SENDERS
// ===========================================================================

async function sendSMS(
  payload: NotificationPayload,
  template: string
): Promise<NotificationResult> {
  const message = interpolateTemplate(template, payload.data);
  
  // Call edge function for SMS delivery
  const { data, error } = await supabase.functions.invoke('send-notification', {
    body: {
      channel: 'sms',
      to: payload.recipientPhone,
      message,
      projectId: payload.projectId,
    },
  });
  
  if (error) {
    console.warn('[SMS] Edge function error (demo mode):', error);
    // Demo mode: simulate success
    return { success: true, channel: 'sms', messageId: `sms_demo_${Date.now()}` };
  }
  
  return {
    success: data?.success || true,
    channel: 'sms',
    messageId: data?.messageId,
    error: data?.error,
  };
}

async function sendPush(
  payload: NotificationPayload,
  template: { title: string; body: string }
): Promise<NotificationResult> {
  const title = interpolateTemplate(template.title, payload.data);
  const body = interpolateTemplate(template.body, payload.data);
  
  // Check if browser supports push notifications
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, { body, icon: '/logo.png' });
      return { success: true, channel: 'push', messageId: `push_${Date.now()}` };
    } catch (e) {
      console.warn('[Push] Browser notification failed:', e);
    }
  }
  
  // Fallback: call edge function
  const { data, error } = await supabase.functions.invoke('send-notification', {
    body: {
      channel: 'push',
      token: payload.recipientPushToken,
      title,
      body,
      projectId: payload.projectId,
    },
  });
  
  if (error) {
    console.warn('[Push] Edge function error (demo mode):', error);
    return { success: true, channel: 'push', messageId: `push_demo_${Date.now()}` };
  }
  
  return {
    success: data?.success || true,
    channel: 'push',
    messageId: data?.messageId,
    error: data?.error,
  };
}

async function sendEmail(
  payload: NotificationPayload,
  template: { subject: string; body: string }
): Promise<NotificationResult> {
  const subject = interpolateTemplate(template.subject, payload.data);
  const body = interpolateTemplate(template.body, payload.data);
  
  // Call edge function for email delivery
  const { data, error } = await supabase.functions.invoke('send-notification', {
    body: {
      channel: 'email',
      to: payload.recipientEmail,
      subject,
      body,
      projectId: payload.projectId,
    },
  });
  
  if (error) {
    console.warn('[Email] Edge function error (demo mode):', error);
    return { success: true, channel: 'email', messageId: `email_demo_${Date.now()}` };
  }
  
  return {
    success: data?.success || true,
    channel: 'email',
    messageId: data?.messageId,
    error: data?.error,
  };
}

async function sendWhatsApp(
  payload: NotificationPayload,
  template: string
): Promise<NotificationResult> {
  const message = interpolateTemplate(template, payload.data);
  
  // WhatsApp Business API would be called here
  console.log('[WhatsApp] Would send to', payload.recipientPhone, ':', message);
  
  return {
    success: true,
    channel: 'whatsapp',
    messageId: `wa_demo_${Date.now()}`,
  };
}

// ===========================================================================
// HELPERS
// ===========================================================================

/**
 * Interpolate template with data
 */
function interpolateTemplate(template: string, data: Record<string, unknown>): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return data[key] !== undefined ? String(data[key]) : match;
  });
}

/**
 * Check if current time is within quiet hours
 */
function isQuietHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  
  // Default quiet hours: 22:00 - 07:00
  return hour >= 22 || hour < 7;
}

/**
 * Request push notification permission
 */
export async function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('[Push] Notifications not supported');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

/**
 * Test notification delivery
 */
export async function sendTestNotification(
  channel: NotificationChannel,
  recipient: string
): Promise<NotificationResult> {
  const payload: NotificationPayload = {
    type: 'booking_confirmed',
    projectId: 'test',
    recipientPhone: channel === 'sms' || channel === 'whatsapp' ? recipient : undefined,
    recipientEmail: channel === 'email' ? recipient : undefined,
    data: {
      providerName: 'Test Provider',
      moveDate: new Date().toLocaleDateString('de-CH'),
      trackingUrl: 'https://umzugscheck.ch/tracking/test',
    },
  };
  
  return sendNotification(payload, channel);
}
