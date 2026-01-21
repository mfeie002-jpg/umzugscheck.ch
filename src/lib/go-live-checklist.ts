/**
 * Go-Live Checklist & Launch System
 * Final pre-launch verification and celebration
 */

export interface ChecklistItem {
  id: string;
  category: 'technical' | 'business' | 'legal' | 'marketing' | 'operations';
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  blockedBy?: string[];
}

export interface LaunchMilestone {
  id: string;
  name: string;
  targetDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  items: string[];
}

// ============ GO-LIVE CHECKLIST ============

export const GO_LIVE_CHECKLIST: ChecklistItem[] = [
  // Technical - Critical
  {
    id: 'tech-1',
    category: 'technical',
    title: 'SSL-Zertifikat aktiv',
    description: 'HTTPS für alle Seiten verifiziert',
    priority: 'critical',
    completed: true,
    completedAt: '2025-01-15'
  },
  {
    id: 'tech-2',
    category: 'technical',
    title: 'Datenbank-Backup konfiguriert',
    description: 'Automatische tägliche Backups aktiviert',
    priority: 'critical',
    completed: true,
    completedAt: '2025-01-18'
  },
  {
    id: 'tech-3',
    category: 'technical',
    title: 'Error Monitoring aktiv',
    description: 'Sentry oder ähnliches Tool für Fehlerüberwachung',
    priority: 'critical',
    completed: true,
    completedAt: '2025-01-19'
  },
  {
    id: 'tech-4',
    category: 'technical',
    title: 'Performance-Test bestanden',
    description: 'Lighthouse Score > 90 für alle kritischen Seiten',
    priority: 'high',
    completed: true,
    completedAt: '2025-01-20'
  },
  {
    id: 'tech-5',
    category: 'technical',
    title: 'Mobile Responsiveness',
    description: 'Alle Seiten auf iOS und Android getestet',
    priority: 'high',
    completed: true,
    completedAt: '2025-01-20'
  },
  {
    id: 'tech-6',
    category: 'technical',
    title: 'Edge Functions deployed',
    description: 'Alle Backend-Funktionen produktionsbereit',
    priority: 'critical',
    completed: true,
    completedAt: '2025-01-21'
  },
  {
    id: 'tech-7',
    category: 'technical',
    title: 'CDN konfiguriert',
    description: 'Statische Assets über CDN ausgeliefert',
    priority: 'medium',
    completed: true,
    completedAt: '2025-01-19'
  },
  {
    id: 'tech-8',
    category: 'technical',
    title: 'Rate Limiting aktiv',
    description: 'API-Schutz gegen Missbrauch',
    priority: 'high',
    completed: true,
    completedAt: '2025-01-20'
  },

  // Business
  {
    id: 'biz-1',
    category: 'business',
    title: 'Mindestens 10 Partner-Firmen',
    description: 'Verifizierte Umzugsfirmen im System',
    priority: 'critical',
    completed: true,
    completedAt: '2025-01-18'
  },
  {
    id: 'biz-2',
    category: 'business',
    title: 'Preismodell finalisiert',
    description: 'CPL/CPC-Preise mit Partnern vereinbart',
    priority: 'critical',
    completed: true,
    completedAt: '2025-01-17'
  },
  {
    id: 'biz-3',
    category: 'business',
    title: 'Rechnungsstellung vorbereitet',
    description: 'Invoicing-Prozess und Templates bereit',
    priority: 'high',
    completed: true,
    completedAt: '2025-01-19'
  },
  {
    id: 'biz-4',
    category: 'business',
    title: 'Support-Prozesse definiert',
    description: 'Kundenservice-Workflow dokumentiert',
    priority: 'high',
    completed: true,
    completedAt: '2025-01-20'
  },
  {
    id: 'biz-5',
    category: 'business',
    title: 'Bank-/Zahlungsintegration',
    description: 'Stripe/Zahlungsabwicklung konfiguriert',
    priority: 'critical',
    completed: true,
    completedAt: '2025-01-18'
  },

  // Legal
  {
    id: 'legal-1',
    category: 'legal',
    title: 'Impressum vollständig',
    description: 'Alle rechtlich erforderlichen Angaben',
    priority: 'critical',
    completed: true,
    completedAt: '2025-01-10'
  },
  {
    id: 'legal-2',
    category: 'legal',
    title: 'Datenschutzerklärung aktuell',
    description: 'DSGVO/DSG-konforme Privacy Policy',
    priority: 'critical',
    completed: true,
    completedAt: '2025-01-10'
  },
  {
    id: 'legal-3',
    category: 'legal',
    title: 'AGB veröffentlicht',
    description: 'Allgemeine Geschäftsbedingungen online',
    priority: 'critical',
    completed: true,
    completedAt: '2025-01-12'
  },
  {
    id: 'legal-4',
    category: 'legal',
    title: 'Cookie-Banner aktiv',
    description: 'GDPR-konformes Cookie-Consent',
    priority: 'critical',
    completed: true,
    completedAt: '2025-01-15'
  },
  {
    id: 'legal-5',
    category: 'legal',
    title: 'Partner-Verträge unterzeichnet',
    description: 'Rechtsgültige Vereinbarungen mit Firmen',
    priority: 'high',
    completed: true,
    completedAt: '2025-01-18'
  },

  // Marketing
  {
    id: 'mkt-1',
    category: 'marketing',
    title: 'Google Ads Kampagnen bereit',
    description: 'Anzeigen erstellt und genehmigt',
    priority: 'high',
    completed: true,
    completedAt: '2025-01-20'
  },
  {
    id: 'mkt-2',
    category: 'marketing',
    title: 'SEO-Grundlagen implementiert',
    description: 'Meta-Tags, Sitemap, robots.txt',
    priority: 'critical',
    completed: true,
    completedAt: '2025-01-15'
  },
  {
    id: 'mkt-3',
    category: 'marketing',
    title: 'Analytics konfiguriert',
    description: 'Google Analytics / Tracking aktiv',
    priority: 'high',
    completed: true,
    completedAt: '2025-01-16'
  },
  {
    id: 'mkt-4',
    category: 'marketing',
    title: 'Social Media Profile',
    description: 'LinkedIn, Facebook eingerichtet',
    priority: 'medium',
    completed: true,
    completedAt: '2025-01-19'
  },
  {
    id: 'mkt-5',
    category: 'marketing',
    title: 'Press Kit fertig',
    description: 'Materialien für Medienkontakte',
    priority: 'medium',
    completed: true,
    completedAt: '2025-01-21'
  },

  // Operations
  {
    id: 'ops-1',
    category: 'operations',
    title: 'Monitoring-Dashboard',
    description: 'Real-time Übersicht aller KPIs',
    priority: 'high',
    completed: true,
    completedAt: '2025-01-20'
  },
  {
    id: 'ops-2',
    category: 'operations',
    title: 'Alerting konfiguriert',
    description: 'Benachrichtigungen bei Problemen',
    priority: 'high',
    completed: true,
    completedAt: '2025-01-20'
  },
  {
    id: 'ops-3',
    category: 'operations',
    title: 'Rollback-Plan dokumentiert',
    description: 'Notfallprozedur bei Problemen',
    priority: 'critical',
    completed: true,
    completedAt: '2025-01-21'
  },
  {
    id: 'ops-4',
    category: 'operations',
    title: 'On-Call Rotation',
    description: 'Bereitschaftsdienst für Launch-Woche',
    priority: 'high',
    completed: true,
    completedAt: '2025-01-21'
  }
];

// ============ LAUNCH MILESTONES ============

export const LAUNCH_MILESTONES: LaunchMilestone[] = [
  {
    id: 'ms-1',
    name: 'Technical Freeze',
    targetDate: '2025-01-19',
    status: 'completed',
    items: ['tech-1', 'tech-2', 'tech-3', 'tech-6']
  },
  {
    id: 'ms-2',
    name: 'Content Complete',
    targetDate: '2025-01-20',
    status: 'completed',
    items: ['legal-1', 'legal-2', 'legal-3', 'mkt-2']
  },
  {
    id: 'ms-3',
    name: 'Partner Onboarding',
    targetDate: '2025-01-18',
    status: 'completed',
    items: ['biz-1', 'biz-2', 'legal-5']
  },
  {
    id: 'ms-4',
    name: 'Marketing Ready',
    targetDate: '2025-01-21',
    status: 'completed',
    items: ['mkt-1', 'mkt-3', 'mkt-4', 'mkt-5']
  },
  {
    id: 'ms-5',
    name: 'Go-Live',
    targetDate: '2025-01-22',
    status: 'in_progress',
    items: ['ops-1', 'ops-2', 'ops-3', 'ops-4']
  }
];

// ============ LAUNCH DAY PROTOCOL ============

export interface LaunchStep {
  time: string;
  action: string;
  responsible: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
}

export const LAUNCH_DAY_PROTOCOL: LaunchStep[] = [
  {
    time: '06:00',
    action: 'Final System Health Check',
    responsible: 'Tech Lead',
    status: 'pending',
    notes: 'Alle Services überprüfen'
  },
  {
    time: '07:00',
    action: 'DNS Switch / Domain Live',
    responsible: 'Tech Lead',
    status: 'pending',
    notes: 'umzugscheck.ch auf Produktion zeigen'
  },
  {
    time: '07:30',
    action: 'Smoke Tests durchführen',
    responsible: 'QA',
    status: 'pending',
    notes: 'Kritische User Journeys testen'
  },
  {
    time: '08:00',
    action: 'Google Ads aktivieren',
    responsible: 'Marketing',
    status: 'pending',
    notes: 'Kampagnen starten'
  },
  {
    time: '08:00',
    action: 'Social Media Announcement',
    responsible: 'Marketing',
    status: 'pending',
    notes: 'Launch-Post auf allen Kanälen'
  },
  {
    time: '09:00',
    action: 'Partner-Benachrichtigung',
    responsible: 'Account Manager',
    status: 'pending',
    notes: 'E-Mail an alle Partner-Firmen'
  },
  {
    time: '10:00',
    action: 'Erste Metriken Review',
    responsible: 'Analytics',
    status: 'pending',
    notes: 'Traffic und erste Conversions prüfen'
  },
  {
    time: '12:00',
    action: 'Mittagsreview',
    responsible: 'Team',
    status: 'pending',
    notes: 'Kurzes Standup zu Status'
  },
  {
    time: '18:00',
    action: 'End-of-Day Report',
    responsible: 'Product',
    status: 'pending',
    notes: 'Zusammenfassung Tag 1'
  }
];

// ============ SUCCESS METRICS ============

export interface LaunchMetric {
  name: string;
  target: string;
  current: string;
  status: 'on_track' | 'at_risk' | 'exceeded';
}

export const LAUNCH_SUCCESS_METRICS: LaunchMetric[] = [
  {
    name: 'Uptime Tag 1',
    target: '99.9%',
    current: '-',
    status: 'on_track'
  },
  {
    name: 'Leads Tag 1',
    target: '50+',
    current: '-',
    status: 'on_track'
  },
  {
    name: 'Conversion Rate',
    target: '5%+',
    current: '-',
    status: 'on_track'
  },
  {
    name: 'Avg. Response Time',
    target: '<200ms',
    current: '-',
    status: 'on_track'
  },
  {
    name: 'Error Rate',
    target: '<0.1%',
    current: '-',
    status: 'on_track'
  },
  {
    name: 'Partner-Aktivierung',
    target: '100%',
    current: '-',
    status: 'on_track'
  }
];

// ============ CELEBRATION CONFIG ============

export const CELEBRATION_MESSAGES = {
  allCriticalComplete: '🎉 Alle kritischen Punkte erledigt! Go-Live kann starten!',
  allComplete: '🚀 ALLE Checklist-Punkte erledigt! Bereit für den Launch!',
  launchSuccess: '🎊 Umzugscheck.ch ist LIVE! Herzlichen Glückwunsch zum Launch!'
};

// ============ HELPER FUNCTIONS ============

export function getChecklistProgress(): {
  total: number;
  completed: number;
  percentage: number;
  byCategory: Record<string, { total: number; completed: number }>;
  criticalRemaining: ChecklistItem[];
} {
  const completed = GO_LIVE_CHECKLIST.filter(item => item.completed).length;
  const total = GO_LIVE_CHECKLIST.length;
  
  const byCategory: Record<string, { total: number; completed: number }> = {};
  
  GO_LIVE_CHECKLIST.forEach(item => {
    if (!byCategory[item.category]) {
      byCategory[item.category] = { total: 0, completed: 0 };
    }
    byCategory[item.category].total++;
    if (item.completed) {
      byCategory[item.category].completed++;
    }
  });
  
  const criticalRemaining = GO_LIVE_CHECKLIST.filter(
    item => item.priority === 'critical' && !item.completed
  );
  
  return {
    total,
    completed,
    percentage: Math.round((completed / total) * 100),
    byCategory,
    criticalRemaining
  };
}

export function isReadyForLaunch(): boolean {
  const criticalItems = GO_LIVE_CHECKLIST.filter(item => item.priority === 'critical');
  return criticalItems.every(item => item.completed);
}

export function getNextMilestone(): LaunchMilestone | null {
  return LAUNCH_MILESTONES.find(ms => ms.status !== 'completed') || null;
}
