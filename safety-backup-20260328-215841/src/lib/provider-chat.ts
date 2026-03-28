/**
 * Provider Live-Chat System
 * Real-time messaging between users and moving providers
 */

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderType: 'user' | 'provider' | 'system';
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'document' | 'location';
  url: string;
  name: string;
  size?: number;
}

export interface ChatSession {
  id: string;
  providerId: string;
  providerName: string;
  providerLogo?: string;
  userId: string;
  userName: string;
  leadId?: string;
  status: 'active' | 'archived' | 'pending';
  createdAt: Date;
  lastMessageAt: Date;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface QuickReply {
  id: string;
  label: string;
  message: string;
  category: 'greeting' | 'question' | 'scheduling' | 'pricing';
}

// Pre-defined quick replies for common scenarios
export const QUICK_REPLIES: QuickReply[] = [
  {
    id: 'greeting',
    label: 'Grüezi',
    message: 'Grüezi! Ich interessiere mich für Ihre Umzugsdienstleistungen.',
    category: 'greeting',
  },
  {
    id: 'availability',
    label: 'Verfügbarkeit',
    message: 'Sind Sie an meinem gewünschten Umzugsdatum verfügbar?',
    category: 'scheduling',
  },
  {
    id: 'quote',
    label: 'Offerte',
    message: 'Könnten Sie mir bitte eine detaillierte Offerte zusenden?',
    category: 'pricing',
  },
  {
    id: 'visit',
    label: 'Besichtigung',
    message: 'Wäre eine Vorbesichtigung für eine genauere Schätzung möglich?',
    category: 'scheduling',
  },
  {
    id: 'services',
    label: 'Services',
    message: 'Welche zusätzlichen Services bieten Sie an? (Verpackung, Möbelmontage, etc.)',
    category: 'question',
  },
  {
    id: 'insurance',
    label: 'Versicherung',
    message: 'Wie sind meine Möbel während des Transports versichert?',
    category: 'question',
  },
  {
    id: 'payment',
    label: 'Zahlung',
    message: 'Welche Zahlungsmöglichkeiten bieten Sie an?',
    category: 'pricing',
  },
  {
    id: 'thanks',
    label: 'Danke',
    message: 'Vielen Dank für Ihre Hilfe!',
    category: 'greeting',
  },
];

/**
 * Generate a unique chat ID
 */
export function generateChatId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique message ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new chat session
 */
export function createChatSession(
  providerId: string,
  providerName: string,
  userId: string,
  userName: string,
  leadId?: string
): ChatSession {
  const now = new Date();
  const chatId = generateChatId();
  
  const welcomeMessage: ChatMessage = {
    id: generateMessageId(),
    chatId,
    senderId: 'system',
    senderType: 'system',
    senderName: 'System',
    content: `Willkommen! Sie können jetzt direkt mit ${providerName} chatten. Bitte beschreiben Sie Ihren Umzug.`,
    timestamp: now,
    read: true,
  };
  
  return {
    id: chatId,
    providerId,
    providerName,
    userId,
    userName,
    leadId,
    status: 'active',
    createdAt: now,
    lastMessageAt: now,
    unreadCount: 0,
    messages: [welcomeMessage],
  };
}

/**
 * Add a message to a chat session
 */
export function addMessage(
  session: ChatSession,
  content: string,
  senderType: 'user' | 'provider',
  senderName: string,
  attachments?: ChatAttachment[]
): ChatSession {
  const message: ChatMessage = {
    id: generateMessageId(),
    chatId: session.id,
    senderId: senderType === 'user' ? session.userId : session.providerId,
    senderType,
    senderName,
    content,
    timestamp: new Date(),
    read: false,
    attachments,
  };
  
  return {
    ...session,
    messages: [...session.messages, message],
    lastMessageAt: message.timestamp,
    unreadCount: senderType === 'provider' ? session.unreadCount + 1 : session.unreadCount,
  };
}

/**
 * Mark messages as read
 */
export function markMessagesAsRead(session: ChatSession): ChatSession {
  return {
    ...session,
    unreadCount: 0,
    messages: session.messages.map(msg => ({
      ...msg,
      read: true,
    })),
  };
}

/**
 * Format timestamp for display
 */
export function formatMessageTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Jetzt';
  if (diffMins < 60) return `vor ${diffMins} Min.`;
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  if (diffDays < 7) return `vor ${diffDays} Tagen`;
  
  return date.toLocaleDateString('de-CH', {
    day: '2-digit',
    month: '2-digit',
  });
}

/**
 * Get chat status badge info
 */
export function getChatStatusInfo(status: ChatSession['status']): {
  label: string;
  color: string;
} {
  const statusInfo = {
    active: { label: 'Aktiv', color: 'bg-green-500' },
    pending: { label: 'Wartend', color: 'bg-yellow-500' },
    archived: { label: 'Archiviert', color: 'bg-muted' },
  };
  return statusInfo[status];
}

/**
 * Simulate provider typing indicator
 */
export function simulateTyping(callback: () => void, minMs = 1000, maxMs = 3000): void {
  const delay = minMs + Math.random() * (maxMs - minMs);
  setTimeout(callback, delay);
}

/**
 * Generate auto-response for demo purposes
 */
export function generateAutoResponse(userMessage: string, providerName: string): string {
  const responses = [
    `Vielen Dank für Ihre Nachricht! Wir von ${providerName} werden uns schnellstmöglich bei Ihnen melden.`,
    `Grüezi! Das klingt nach einem interessanten Umzugsprojekt. Können Sie mir mehr Details geben?`,
    `Danke für Ihre Anfrage. Wir haben momentan gute Verfügbarkeit und können Ihnen gerne eine Offerte erstellen.`,
    `Wir freuen uns über Ihr Interesse! Ein Mitarbeiter wird sich in Kürze mit Ihnen in Verbindung setzen.`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}
