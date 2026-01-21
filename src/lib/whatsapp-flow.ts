/**
 * WhatsApp Flow System
 * Direct channel for lead capture and communication
 */

export interface WhatsAppConfig {
  phoneNumber: string; // Swiss format: +41...
  defaultMessage: string;
  trackingParams?: Record<string, string>;
}

export interface WhatsAppLead {
  name?: string;
  fromCity?: string;
  toCity?: string;
  moveDate?: string;
  volume?: string;
  message: string;
}

/**
 * Default WhatsApp number for Umzugscheck
 */
export const WHATSAPP_CONFIG: WhatsAppConfig = {
  phoneNumber: '+41445520000', // Placeholder - replace with actual number
  defaultMessage: 'Hallo! Ich interessiere mich für eine Umzugsofferte.',
};

/**
 * Generate WhatsApp click-to-chat URL
 */
export function generateWhatsAppUrl(
  config: WhatsAppConfig = WHATSAPP_CONFIG,
  lead?: Partial<WhatsAppLead>
): string {
  const phoneClean = config.phoneNumber.replace(/[^0-9]/g, '');
  
  let message = config.defaultMessage;
  
  if (lead) {
    const parts: string[] = ['Hallo! Ich möchte eine Umzugsofferte anfragen:'];
    
    if (lead.name) parts.push(`Name: ${lead.name}`);
    if (lead.fromCity && lead.toCity) {
      parts.push(`Umzug: ${lead.fromCity} → ${lead.toCity}`);
    }
    if (lead.moveDate) parts.push(`Datum: ${lead.moveDate}`);
    if (lead.volume) parts.push(`Volumen: ${lead.volume}`);
    if (lead.message) parts.push(`Nachricht: ${lead.message}`);
    
    message = parts.join('\n');
  }
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneClean}?text=${encodedMessage}`;
}

/**
 * Generate WhatsApp share URL for a specific page
 */
export function generateShareUrl(
  url: string,
  text: string = 'Schau dir diesen Umzugsrechner an:'
): string {
  const shareText = `${text}\n${url}`;
  return `https://wa.me/?text=${encodeURIComponent(shareText)}`;
}

/**
 * Track WhatsApp click event
 */
export function trackWhatsAppClick(
  action: 'chat_open' | 'share' | 'lead_submit',
  metadata?: Record<string, string>
): void {
  // Analytics tracking placeholder
  console.log('WhatsApp Event:', action, metadata);
  
  // In production, this would send to analytics:
  // analytics.track('whatsapp_click', { action, ...metadata });
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('41')) {
    // Swiss number
    const local = cleaned.slice(2);
    return `+41 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7)}`;
  }
  
  return phone;
}

/**
 * Check if WhatsApp is likely available (mobile device)
 */
export function isWhatsAppAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|ipad|ipod|windows phone/i.test(userAgent);
  
  // WhatsApp Web also works on desktop, so we return true for all
  return true;
}

/**
 * Pre-fill message templates
 */
export const MESSAGE_TEMPLATES = {
  quote: 'Hallo! Ich möchte eine unverbindliche Umzugsofferte anfragen.',
  question: 'Hallo! Ich habe eine Frage zu meinem geplanten Umzug.',
  urgent: 'Hallo! Ich brauche dringend Hilfe bei einem kurzfristigen Umzug.',
  callback: 'Hallo! Bitte rufen Sie mich zurück. Meine Nummer ist: ',
  feedback: 'Hallo! Ich möchte Feedback zu meiner Erfahrung geben.',
};

/**
 * Get appropriate message template based on context
 */
export function getMessageTemplate(
  context: 'homepage' | 'calculator' | 'provider' | 'urgent' | 'general'
): string {
  switch (context) {
    case 'homepage':
      return MESSAGE_TEMPLATES.quote;
    case 'calculator':
      return 'Hallo! Ich habe gerade den Umzugsrechner benutzt und hätte gerne mehr Informationen.';
    case 'provider':
      return 'Hallo! Ich habe Ihre Firma auf Umzugscheck gefunden und interessiere mich für ein Angebot.';
    case 'urgent':
      return MESSAGE_TEMPLATES.urgent;
    default:
      return MESSAGE_TEMPLATES.quote;
  }
}
