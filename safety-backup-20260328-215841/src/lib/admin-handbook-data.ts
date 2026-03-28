/**
 * Admin Handbook Data
 * Structured documentation for all admin sections
 */

export interface HandbookSection {
  id: string;
  title: string;
  category: string;
  route: string;
  description: string;
  features: string[];
  whenToUse: string;
  badge?: string;
  highlight?: boolean;
  external?: boolean;
}

export interface HandbookCategory {
  id: string;
  title: string;
  icon: string;
  sections: HandbookSection[];
}

export const HANDBOOK_DATA: HandbookCategory[] = [
  {
    id: 'command-centers',
    title: '🎯 Command Centers',
    icon: 'Target',
    sections: [
      {
        id: 'unified-command',
        title: 'Unified Command Center',
        category: 'Command Centers',
        route: '/internal/command-center',
        description: 'Das zentrale Entscheidungscockpit für SCALE/HOLD/STOP-Aktionen.',
        features: [
          'Echtzeit-KPI-Übersicht (Revenue, CM2, CAC, Cash Runway)',
          'Kill-Switch-Status für kritische Metriken',
          'Lead-Performance-Tracking',
          'Schnellaktionen für operative Entscheidungen'
        ],
        whenToUse: 'Täglich morgens für Statuscheck, bei wichtigen Entscheidungen',
        badge: 'HQ',
        highlight: true
      },
      {
        id: 'flow-command',
        title: 'Flow Command Center',
        category: 'Command Centers',
        route: '/flow-command-center',
        description: 'Zentrales Dashboard für alle Flow-Analysen und UX-Optimierungen.',
        features: [
          'Flow-Ranking nach Score',
          'Issue-Tracking und Lösungsstatus',
          'Vergleich zwischen Flow-Varianten',
          'AI-Feedback-Integration'
        ],
        whenToUse: 'Bei UX-Optimierungen, A/B-Test-Auswertungen',
        external: true
      },
      {
        id: 'finance',
        title: 'Finance & P&L',
        category: 'Command Centers',
        route: '/internal/finance',
        description: 'Vollständiges Finanz-Dashboard mit Szenario-Simulation.',
        features: [
          'Tägliche P&L-Tabelle (30 Tage Historie)',
          'CM2-Berechnung und CAC-Tracking',
          'Cash-Runway-Projektion',
          'Szenario-Simulator für What-If-Analysen'
        ],
        whenToUse: 'Wöchentliche Finanzplanung, Budgetentscheidungen',
        badge: 'CFO'
      },
      {
        id: 'paid-media',
        title: 'Paid Media Control',
        category: 'Command Centers',
        route: '/internal/paid-media-control',
        description: 'Kontrolle und Monitoring aller bezahlten Werbekampagnen.',
        features: [
          'CPL-Tracking (7-Tage-Durchschnitt)',
          'ROI-Berechnung pro Kampagne',
          'Automatische Kill-Switches',
          'Budget-Verteilung nach Kanal'
        ],
        whenToUse: 'Täglich zur Kampagnenüberwachung'
      },
      {
        id: 'roadmap',
        title: '90-Day Roadmap',
        category: 'Command Centers',
        route: '/internal/launch-roadmap',
        description: 'Strategische Roadmap für Launch und Wachstum.',
        features: [
          'Wochenweise Meilensteine',
          'Feature-Prioritäten',
          'Team-Zuweisungen',
          'Fortschrittstracking'
        ],
        whenToUse: 'Sprint-Planung, Stakeholder-Updates'
      }
    ]
  },
  {
    id: 'ai-automation',
    title: '🧠 AI & Automation',
    icon: 'Brain',
    sections: [
      {
        id: 'ai-command',
        title: 'AI Command Center',
        category: 'AI & Automation',
        route: '/admin/ai-command',
        description: 'Zentraler Hub für alle AI-gestützten Operationen.',
        features: [
          'AI-Analyse-Dashboard',
          'Prompt-Management',
          'Model-Auswahl (GPT-5, Gemini 2.5)',
          'Batch-Verarbeitung'
        ],
        whenToUse: 'AI-gestützte Analysen, Content-Generierung',
        badge: '⚡',
        highlight: true
      },
      {
        id: 'task-queue',
        title: 'Task Queue (AI Autopilot)',
        category: 'AI & Automation',
        route: '/admin/task-queue',
        description: 'Automatisierte Task-Generierung und -Ausführung.',
        features: [
          'Queue Überblick: Alle pending/in-progress/done Tasks',
          'Agent Runner: Ausführung einzelner CODEX/COPILOT Tasks',
          'Task-Generierung aus Flow-Scores und UX-Issues',
          'Copy für VS Code Export'
        ],
        whenToUse: 'Kontinuierliche Verbesserungen automatisieren',
        badge: 'AUTO'
      },
      {
        id: 'chatgpt-export',
        title: '1-Click ChatGPT Export',
        category: 'AI & Automation',
        route: '/admin/chatgpt',
        description: 'Schnellexport für ChatGPT Deep Research.',
        features: [
          'Kompletter Codebase-Export',
          'Strukturiertes Markdown für AI-Analyse',
          'KPI-Daten inkludiert'
        ],
        whenToUse: 'Tiefenanalyse mit externen AI-Tools',
        badge: 'NEU'
      },
      {
        id: 'prompt-library',
        title: 'Prompt Library',
        category: 'AI & Automation',
        route: '/admin/ai-export',
        description: 'Sammlung wiederverwendbarer AI-Prompts.',
        features: [
          'Kategorisierte Prompt-Vorlagen',
          'CODEX vs. COPILOT Prompts',
          'Export-Funktionen'
        ],
        whenToUse: 'Standardisierte AI-Prompts nutzen'
      }
    ]
  },
  {
    id: 'lead-distribution',
    title: '📞 Lead & Distribution',
    icon: 'Route',
    sections: [
      {
        id: 'lead-routing',
        title: 'Lead Routing Brain',
        category: 'Lead & Distribution',
        route: '/internal/lead-routing',
        description: 'Intelligente Lead-Verteilung mit AI-Scoring.',
        features: [
          'Lead-Score-Berechnung (0-100)',
          'Tier-System: Tier 1 → feierabendumzug, Tier 2 → Marketplace',
          'Kapazitäts-Matching',
          'Echtzeit-Routing'
        ],
        whenToUse: 'Lead-Qualität optimieren, Routing-Regeln anpassen',
        badge: 'AI'
      },
      {
        id: 'partners',
        title: 'Partner Network',
        category: 'Lead & Distribution',
        route: '/internal/partners',
        description: 'Partnerverwaltung und Onboarding.',
        features: [
          'Partner-Directory',
          'Onboarding-Workflow',
          'Kanton-Coverage-Map',
          'Dispute Center & Mystery Shopping'
        ],
        whenToUse: 'Partner verwalten, Qualität sichern',
        badge: 'B2B'
      },
      {
        id: 'leads',
        title: 'Leads verwalten',
        category: 'Lead & Distribution',
        route: '/admin/leads',
        description: 'CRUD für alle eingegangenen Leads.',
        features: [
          'Lead-Liste mit Filter',
          'Status-Tracking',
          'Kontakthistorie',
          'Export-Funktionen'
        ],
        whenToUse: 'Leads bearbeiten und nachverfolgen'
      }
    ]
  },
  {
    id: 'testing',
    title: '🧪 Testing & Experimente',
    icon: 'FlaskConical',
    sections: [
      {
        id: 'ab-testing',
        title: 'A/B Testing',
        category: 'Testing & Experimente',
        route: '/admin/ab-testing',
        description: 'Zentrales A/B-Test-Management.',
        features: [
          'Unified A/B: Globale Test-Übersicht',
          'Flow Details: Flow-Varianten-Vergleich',
          'Nav Details: Navigation-Varianten',
          'Rankings: Firmen-Ranking-Tests'
        ],
        whenToUse: 'Vor jeder größeren Änderung',
        highlight: true
      },
      {
        id: 'flow-tester',
        title: 'Flow Tester',
        category: 'Testing & Experimente',
        route: '/flow-tester',
        description: 'Interaktiver Flow-Durchlauf-Tester.',
        features: [
          'Schritt-für-Schritt-Navigation',
          'Screenshot-Capture pro Step',
          'Issue-Markierung'
        ],
        whenToUse: 'Flows manuell testen und dokumentieren',
        external: true
      }
    ]
  },
  {
    id: 'analytics',
    title: '📊 Analytics & Reports',
    icon: 'BarChart3',
    sections: [
      {
        id: 'analytics-overview',
        title: 'Übersicht',
        category: 'Analytics & Reports',
        route: '/admin/analytics',
        description: 'Globales Analytics-Dashboard.',
        features: [
          'Traffic-Übersicht',
          'Conversion-Raten',
          'Trend-Analyse'
        ],
        whenToUse: 'Tägliche Performance-Übersicht'
      },
      {
        id: 'funnel',
        title: 'Funnel Analytics',
        category: 'Analytics & Reports',
        route: '/admin/funnel',
        description: 'Detaillierte Funnel-Analyse.',
        features: [
          'Drop-off-Punkte identifizieren',
          'Step-by-Step-Conversion',
          'Vergleich zwischen Flows'
        ],
        whenToUse: 'Conversion-Optimierung'
      },
      {
        id: 'conversions',
        title: 'Conversion Events',
        category: 'Analytics & Reports',
        route: '/admin/conversions',
        description: 'Event-Tracking und -Analyse.',
        features: [
          'flow_start, step_view, step_complete Events',
          'flow_submit, flow_success, flow_error',
          'flow_abandon Tracking'
        ],
        whenToUse: 'Detailliertes Event-Debugging'
      }
    ]
  },
  {
    id: 'relo-os',
    title: '🚚 Relo-OS Journey',
    icon: 'Truck',
    sections: [
      {
        id: 'relo-phases',
        title: 'Relo-OS Phasen',
        category: 'Relo-OS Journey',
        route: '/admin/relo-os-phases',
        description: 'Status-Dashboard aller 6 Relo-OS Phasen.',
        features: [
          'Phase 1: Route - Adressen-Initialisierung',
          'Phase 2: Inventar - AI Video Scan + LiDAR',
          'Phase 3: Offerte - Dynamic Pricing Engine',
          'Phase 4-6: Buchung, Umzug, Übergabe'
        ],
        whenToUse: 'Entwicklungsfortschritt tracken',
        badge: 'DEV',
        highlight: true
      },
      {
        id: 'invisible-move',
        title: 'Invisible Move Demo',
        category: 'Relo-OS Journey',
        route: '/invisible-move-demo',
        description: 'Interaktive Demo des kompletten Relo-OS Flows.',
        features: [
          'Vollständiger 6-Phasen-Durchlauf',
          'Interaktive Komponenten',
          'Demo-Daten'
        ],
        whenToUse: 'Stakeholder-Präsentationen',
        external: true
      }
    ]
  },
  {
    id: 'companies',
    title: '🏢 Firmen & Partner',
    icon: 'Building2',
    sections: [
      {
        id: 'companies',
        title: 'Firmen',
        category: 'Firmen & Partner',
        route: '/admin/companies',
        description: 'Firmenverwaltung.',
        features: [
          'Firmenprofile bearbeiten',
          'Logo/Bilder verwalten',
          'Bewertungen moderieren'
        ],
        whenToUse: 'Firmendaten pflegen'
      },
      {
        id: 'reviews',
        title: 'Bewertungen',
        category: 'Firmen & Partner',
        route: '/admin/reviews',
        description: 'Review-Moderation.',
        features: [
          'Freigabe-Workflow',
          'Spam-Erkennung',
          'Antwort-Management'
        ],
        whenToUse: 'Bewertungen moderieren'
      },
      {
        id: 'rankings',
        title: 'Rankings',
        category: 'Firmen & Partner',
        route: '/admin/rankings',
        description: 'Firmen-Ranking-Verwaltung.',
        features: [
          'Ranking-Score-Formel',
          'Featured-Positionen',
          'Sponsoring-Slots'
        ],
        whenToUse: 'Rankings anpassen'
      }
    ]
  },
  {
    id: 'billing',
    title: '💰 Billing & Finance',
    icon: 'CreditCard',
    sections: [
      {
        id: 'billing',
        title: 'Abrechnung',
        category: 'Billing & Finance',
        route: '/admin/billing',
        description: 'Rechnungsstellung und Zahlungen.',
        features: [
          'Offene Rechnungen',
          'Zahlungseingänge',
          'Mahnwesen'
        ],
        whenToUse: 'Rechnungen verwalten'
      },
      {
        id: 'dynamic-pricing',
        title: 'Dynamische Preise',
        category: 'Billing & Finance',
        route: '/admin/dynamic-pricing',
        description: 'Preisanpassungen in Echtzeit.',
        features: [
          'Saisonalität (Zügeltage)',
          'Kapazitätsauslastung',
          'Nachfrage-Peaks'
        ],
        whenToUse: 'Preisstrategien anpassen'
      }
    ]
  },
  {
    id: 'email',
    title: '📧 E-Mail & Automations',
    icon: 'Mail',
    sections: [
      {
        id: 'email-automation',
        title: 'E-Mail Automation',
        category: 'E-Mail & Automations',
        route: '/admin/email-automation',
        description: 'Automatisierte E-Mail-Sequenzen.',
        features: [
          'Trigger-basierte Kampagnen',
          'Drip-Sequenzen',
          'A/B-Tests für Subject Lines'
        ],
        whenToUse: 'E-Mail-Marketing aufsetzen'
      },
      {
        id: 'email-templates',
        title: 'E-Mail Templates',
        category: 'E-Mail & Automations',
        route: '/admin/email-templates',
        description: 'Template-Editor.',
        features: [
          'HTML-Editor',
          'Variablen-Platzhalter',
          'Preview-Funktion'
        ],
        whenToUse: 'E-Mail-Vorlagen erstellen'
      }
    ]
  },
  {
    id: 'launch',
    title: '🚀 Launch & Growth',
    icon: 'Rocket',
    sections: [
      {
        id: 'go-live',
        title: 'Go-Live Checklist',
        category: 'Launch & Growth',
        route: '/admin/go-live',
        description: 'Launch-Readiness-Prüfung.',
        features: [
          'Security Audit (18 Checks)',
          'Performance Audit (Core Web Vitals)',
          'RLS-Policies',
          'SSL/HTTPS'
        ],
        whenToUse: 'Vor dem Launch',
        badge: '✓'
      },
      {
        id: 'post-launch',
        title: 'Post-Launch',
        category: 'Launch & Growth',
        route: '/admin/post-launch',
        description: 'Post-Launch-Monitoring.',
        features: [
          'Echtzeit-Alerts',
          'Performance-Tracking',
          'User-Feedback'
        ],
        whenToUse: 'Nach dem Launch',
        badge: 'LIVE'
      }
    ]
  },
  {
    id: 'tools',
    title: '🔧 Tools & Export',
    icon: 'Wrench',
    sections: [
      {
        id: 'admin-tools',
        title: 'Admin Tools',
        category: 'Tools & Export',
        route: '/admin/tools',
        description: 'Allgemeine Admin-Werkzeuge.',
        features: [
          'Cache leeren',
          'Logs einsehen',
          'Debug-Modus'
        ],
        whenToUse: 'Technische Wartung'
      },
      {
        id: 'code-export',
        title: 'Code Export',
        category: 'Tools & Export',
        route: '/admin/code-export',
        description: 'Codebase-Export.',
        features: [
          'Vollständiger Export',
          'Selektiver Export',
          'Git-Integration'
        ],
        whenToUse: 'Code sichern oder teilen'
      },
      {
        id: 'documentation',
        title: 'Dokumentation',
        category: 'Tools & Export',
        route: '/admin/documentation',
        description: 'Interne Dokumentation.',
        features: [
          'API-Referenz',
          'Komponenten-Docs',
          'Onboarding-Guides'
        ],
        whenToUse: 'Nachschlagen'
      }
    ]
  }
];

export const KILL_SWITCHES = [
  { condition: 'CPL > CHF 90 (7d avg)', action: 'PAUSE ADS' },
  { condition: 'CM2 < 20% für 5 Jobs', action: 'STOP Operations' },
  { condition: 'Claims > 5% Revenue', action: 'PAUSE ADS' },
  { condition: 'Cash Runway < 1 Monat', action: 'Emergency Mode' },
  { condition: 'Marketplace Fill Rate < 70%', action: 'Pause Distribution' },
  { condition: 'Disputes > 15%', action: 'Pause Marketplace' },
];

export const QUICK_LINKS = [
  { action: 'Morgen-Check', route: '/internal/command-center' },
  { action: 'Leads bearbeiten', route: '/admin/leads' },
  { action: 'Neue Kampagne', route: '/internal/paid-media-control' },
  { action: 'Flow optimieren', route: '/flow-command-center' },
  { action: 'AI-Task starten', route: '/admin/task-queue' },
];

// Helper to get tooltip for a route
export function getTooltipForRoute(route: string): string | null {
  for (const category of HANDBOOK_DATA) {
    for (const section of category.sections) {
      if (section.route === route) {
        return section.description;
      }
    }
  }
  return null;
}

// Helper to search handbook
export function searchHandbook(query: string): HandbookSection[] {
  const lowerQuery = query.toLowerCase();
  const results: HandbookSection[] = [];
  
  for (const category of HANDBOOK_DATA) {
    for (const section of category.sections) {
      if (
        section.title.toLowerCase().includes(lowerQuery) ||
        section.description.toLowerCase().includes(lowerQuery) ||
        section.features.some(f => f.toLowerCase().includes(lowerQuery)) ||
        section.category.toLowerCase().includes(lowerQuery)
      ) {
        results.push(section);
      }
    }
  }
  
  return results;
}
