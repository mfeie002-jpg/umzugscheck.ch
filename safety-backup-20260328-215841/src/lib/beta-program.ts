/**
 * Soft Launch / Beta Program System
 * Beta user management, feedback collection, and early adoption metrics
 */

export interface BetaUser {
  id: string;
  email: string;
  name: string;
  company?: string;
  type: 'customer' | 'provider' | 'tester';
  status: 'invited' | 'active' | 'churned';
  invitedAt: Date;
  activatedAt?: Date;
  source: 'waitlist' | 'referral' | 'manual' | 'partner';
  feedbackCount: number;
  npsScore?: number;
  tags: string[];
}

export interface BetaFeedback {
  id: string;
  userId: string;
  type: 'bug' | 'feature' | 'ux' | 'general' | 'praise';
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'reviewed' | 'planned' | 'resolved' | 'wontfix';
  screenshotUrl?: string;
  pageUrl?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface BetaMetrics {
  totalInvited: number;
  totalActivated: number;
  activationRate: number;
  avgSessionsPerUser: number;
  avgFeedbackPerUser: number;
  npsScore: number;
  topFeatureRequests: string[];
  topBugs: string[];
  retentionDay7: number;
  retentionDay30: number;
}

// Beta launch phases
export const BETA_PHASES = [
  {
    id: 'alpha',
    name: 'Alpha (Intern)',
    description: 'Interne Tests mit Team und Familie',
    targetUsers: 10,
    duration: '1 Woche',
    criteria: [
      'Alle Kernfunktionen stabil',
      'Keine kritischen Bugs',
      'Performance akzeptabel',
    ],
    status: 'completed' as const,
  },
  {
    id: 'closed-beta',
    name: 'Closed Beta',
    description: 'Einladungsbasiert, handverlesene Nutzer',
    targetUsers: 50,
    duration: '2 Wochen',
    criteria: [
      'Golden Flow funktioniert E2E',
      'Provider-Integration getestet',
      'Feedback-System aktiv',
    ],
    status: 'active' as const,
  },
  {
    id: 'open-beta',
    name: 'Open Beta',
    description: 'Öffentlich zugänglich mit Beta-Hinweis',
    targetUsers: 500,
    duration: '4 Wochen',
    criteria: [
      'NPS Score > 40',
      'Aktivierungsrate > 60%',
      'Kritische Bugs < 5',
    ],
    status: 'upcoming' as const,
  },
  {
    id: 'soft-launch',
    name: 'Soft Launch',
    description: 'Voller Betrieb ohne Marketing-Push',
    targetUsers: 2000,
    duration: '4 Wochen',
    criteria: [
      'Conversion Rate > 8%',
      'Provider-Netzwerk stabil',
      'Support-Last tragbar',
    ],
    status: 'upcoming' as const,
  },
  {
    id: 'full-launch',
    name: 'Full Launch 🚀',
    description: 'Öffentlicher Go-Live mit Marketing',
    targetUsers: 10000,
    duration: 'Ongoing',
    criteria: [
      'Alle KPIs im Zielbereich',
      'Skalierbarkeit bestätigt',
      'PR & Ads bereit',
    ],
    status: 'upcoming' as const,
  },
];

// Beta checklist
export const BETA_CHECKLIST = {
  technical: [
    { id: 't1', task: 'Golden Flow E2E funktional', done: true },
    { id: 't2', task: 'Error Tracking (Sentry-ähnlich) aktiv', done: true },
    { id: 't3', task: 'Performance Monitoring läuft', done: true },
    { id: 't4', task: 'Datenbank-Backups konfiguriert', done: true },
    { id: 't5', task: 'Rate Limiting implementiert', done: true },
    { id: 't6', task: 'Edge Functions stabil', done: true },
  ],
  product: [
    { id: 'p1', task: 'Preisrechner validiert', done: true },
    { id: 'p2', task: 'Lead-Formular funktional', done: true },
    { id: 'p3', task: 'E-Mail-Benachrichtigungen aktiv', done: true },
    { id: 'p4', task: 'Provider-Matching getestet', done: true },
    { id: 'p5', task: 'Feedback-Widget integriert', done: true },
    { id: 'p6', task: 'Mobile UX optimiert', done: true },
  ],
  business: [
    { id: 'b1', task: 'Erste 5 Provider onboarded', done: false },
    { id: 'b2', task: 'Pricing-Modell finalisiert', done: true },
    { id: 'b3', task: 'AGB & Datenschutz aktuell', done: true },
    { id: 'b4', task: 'Support-Prozess definiert', done: true },
    { id: 'b5', task: 'KPI-Dashboard eingerichtet', done: true },
    { id: 'b6', task: 'Eskalationspfade klar', done: true },
  ],
};

// Feedback categories
export const FEEDBACK_CATEGORIES = [
  { id: 'calculator', label: 'Preisrechner', icon: '🧮' },
  { id: 'search', label: 'Firmensuche', icon: '🔍' },
  { id: 'booking', label: 'Buchungsprozess', icon: '📅' },
  { id: 'profile', label: 'Firmenprofil', icon: '🏢' },
  { id: 'mobile', label: 'Mobile App', icon: '📱' },
  { id: 'payment', label: 'Zahlung', icon: '💳' },
  { id: 'communication', label: 'Kommunikation', icon: '💬' },
  { id: 'other', label: 'Sonstiges', icon: '📝' },
];

// Sample beta metrics
export const CURRENT_BETA_METRICS: BetaMetrics = {
  totalInvited: 50,
  totalActivated: 32,
  activationRate: 64,
  avgSessionsPerUser: 3.2,
  avgFeedbackPerUser: 1.8,
  npsScore: 47,
  topFeatureRequests: [
    'WhatsApp-Benachrichtigungen',
    'Mehr Filter bei Firmensuche',
    'PDF-Export der Offerten',
    'Vergleichsfunktion',
  ],
  topBugs: [
    'Ladezeit auf Mobilgeräten',
    'Formular-Validierung Edge Cases',
  ],
  retentionDay7: 58,
  retentionDay30: 42,
};

// Beta invite templates
export const BETA_INVITE_TEMPLATES = {
  customer: {
    subject: 'Exklusiver Beta-Zugang: Umzugscheck.ch',
    body: `Hallo {name},

Sie wurden für den exklusiven Beta-Test von Umzugscheck.ch ausgewählt!

Als Beta-Tester erhalten Sie:
✅ Frühzugang zu allen Features
✅ Direkten Draht zum Entwicklerteam
✅ CHF 50 Gutschrift auf Ihren ersten Umzug

Ihr persönlicher Zugangslink: {link}

Wir freuen uns auf Ihr Feedback!

Beste Grüsse
Das Umzugscheck-Team`,
  },
  provider: {
    subject: 'Partner-Einladung: Umzugscheck.ch Beta',
    body: `Guten Tag {name},

Wir laden {company} herzlich ein, Teil unserer Beta-Partner zu werden.

Ihre Vorteile als Early Adopter:
✅ 3 Monate kostenfreie Nutzung
✅ Bevorzugte Platzierung beim Launch
✅ Direkter Input zur Produktentwicklung
✅ Exklusive Partner-Konditionen

Registrierungslink: {link}

Bei Fragen stehen wir jederzeit zur Verfügung.

Freundliche Grüsse
Umzugscheck.ch`,
  },
};

// NPS survey config
export const NPS_SURVEY = {
  question: 'Wie wahrscheinlich ist es, dass Sie Umzugscheck.ch einem Freund empfehlen?',
  followUp: {
    detractors: 'Was können wir besser machen?',
    passives: 'Was fehlt, um uns weiterzuempfehlen?',
    promoters: 'Was gefällt Ihnen am besten?',
  },
  triggerAfterActions: 3,
  cooldownDays: 14,
};

// Calculate NPS from scores
export const calculateNPS = (scores: number[]): number => {
  if (scores.length === 0) return 0;
  
  const promoters = scores.filter(s => s >= 9).length;
  const detractors = scores.filter(s => s <= 6).length;
  
  const promoterPercent = (promoters / scores.length) * 100;
  const detractorPercent = (detractors / scores.length) * 100;
  
  return Math.round(promoterPercent - detractorPercent);
};

// Get NPS category
export const getNPSCategory = (score: number): 'detractor' | 'passive' | 'promoter' => {
  if (score <= 6) return 'detractor';
  if (score <= 8) return 'passive';
  return 'promoter';
};

// Beta feature flags
export const BETA_FEATURE_FLAGS = {
  whatsappFlow: { enabled: true, rollout: 100 },
  videoInventory: { enabled: true, rollout: 50 },
  arScanner: { enabled: false, rollout: 0 },
  escrowPayment: { enabled: true, rollout: 100 },
  buddyMatching: { enabled: true, rollout: 30 },
  liveChat: { enabled: true, rollout: 100 },
};
