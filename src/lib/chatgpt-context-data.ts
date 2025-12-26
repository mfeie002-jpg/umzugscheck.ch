// ============================================================================
// KONTEXT-DATEN FÜR CHATGPT - Was wir bereitstellen können
// ============================================================================

export interface ContextDataItem {
  id: string;
  title: string;
  description: string;
  dataType: 'screenshot' | 'html' | 'json' | 'pdf' | 'analytics' | 'config';
  availability: 'available' | 'planned' | 'manual';
  howToGet: string;
  exampleContent?: string;
  priority: 'P0' | 'P1' | 'P2';
}

export const CONTEXT_DATA_ITEMS: ContextDataItem[] = [
  {
    id: 'desktop-screenshots',
    title: 'Desktop Screenshots (1920x1080)',
    description: 'Full-HD Screenshots jeder Flow-Seite für visuelle Analyse',
    dataType: 'screenshot',
    availability: 'available',
    howToGet: '1-Click Export oder Screenshot Machine',
    priority: 'P0'
  },
  {
    id: 'mobile-screenshots',
    title: 'Mobile Screenshots (390x844)',
    description: 'iPhone-optimierte Screenshots für Mobile-UX-Analyse',
    dataType: 'screenshot',
    availability: 'available',
    howToGet: '1-Click Export oder Screenshot Machine',
    priority: 'P0'
  },
  {
    id: 'rendered-html',
    title: 'Rendered HTML (nach JS)',
    description: 'Vollständig gerenderte HTML nach JavaScript-Ausführung',
    dataType: 'html',
    availability: 'available',
    howToGet: '1-Click Export oder HTML Analyzer',
    priority: 'P0'
  },
  {
    id: 'raw-html',
    title: 'Raw HTML (Server Response)',
    description: 'Original HTML wie vom Server geliefert, ohne JS-Rendering',
    dataType: 'html',
    availability: 'available',
    howToGet: 'SEO HTML Tab in Admin Tools',
    priority: 'P1'
  },
  {
    id: 'flow-configs',
    title: 'Flow Konfigurationen (JSON)',
    description: 'Technische Spezifikation aller Flows mit Steps, Labels, Beschreibungen',
    dataType: 'json',
    availability: 'available',
    howToGet: 'Automatisch im Export enthalten',
    priority: 'P0'
  },
  {
    id: 'step-metadata',
    title: 'Step Metadaten',
    description: 'Name, Beschreibung, URL, Element-Counts pro Step',
    dataType: 'json',
    availability: 'available',
    howToGet: 'meta.json in jedem Step-Ordner',
    priority: 'P1'
  },
  {
    id: 'funnel-analytics',
    title: 'Funnel Analytics Daten',
    description: 'Conversion Rates, Drop-off pro Step, Zeit pro Step',
    dataType: 'analytics',
    availability: 'available',
    howToGet: '/admin/funnel - Daten exportieren',
    priority: 'P0'
  },
  {
    id: 'ab-test-results',
    title: 'A/B Test Resultate',
    description: 'Conversion-Vergleiche zwischen Flow-Varianten',
    dataType: 'analytics',
    availability: 'available',
    howToGet: '/admin/ab-testing',
    priority: 'P0'
  },
  {
    id: 'heatmap-data',
    title: 'Heatmap/Click-Daten',
    description: 'Wo User klicken, scrollen, hovern',
    dataType: 'analytics',
    availability: 'planned',
    howToGet: 'Analytics Tab (simulierte Daten verfügbar)',
    priority: 'P1'
  },
  {
    id: 'lighthouse-scores',
    title: 'Lighthouse Performance Scores',
    description: 'Core Web Vitals, Performance, Accessibility, SEO Scores',
    dataType: 'json',
    availability: 'available',
    howToGet: 'lighthouse Edge Function',
    priority: 'P1'
  },
  {
    id: 'competitor-screenshots',
    title: 'Competitor Screenshots',
    description: 'Screenshots von Wettbewerber-Funnels zum Vergleich',
    dataType: 'screenshot',
    availability: 'available',
    howToGet: 'Screenshot Machine - beliebige URL eingeben',
    priority: 'P1'
  },
  {
    id: 'form-structure',
    title: 'Formular-Struktur Analyse',
    description: 'Alle Formularfelder, Labels, Validierung, Required-Status',
    dataType: 'json',
    availability: 'planned',
    howToGet: 'Aus HTML extrahieren (geplant)',
    priority: 'P2'
  },
  {
    id: 'user-feedback',
    title: 'User Feedback/Reviews',
    description: 'Echte Nutzerbewertungen und Kommentare',
    dataType: 'json',
    availability: 'available',
    howToGet: '/admin/reviews',
    priority: 'P1'
  },
  {
    id: 'session-recordings',
    title: 'Session Recordings',
    description: 'Aufgezeichnete User-Sessions (Video/GIF)',
    dataType: 'analytics',
    availability: 'planned',
    howToGet: 'Hotjar/Clarity Integration (geplant)',
    priority: 'P2'
  },
  {
    id: 'error-logs',
    title: 'JavaScript Error Logs',
    description: 'Console Errors, Network Failures pro Seite',
    dataType: 'json',
    availability: 'planned',
    howToGet: 'Error Tracking Tab (geplant)',
    priority: 'P2'
  },
  {
    id: 'regional-data',
    title: 'Regionale Conversion-Daten',
    description: 'Performance nach Kanton/Stadt aufgeschlüsselt',
    dataType: 'analytics',
    availability: 'available',
    howToGet: '/admin/analytics - Regional Filter',
    priority: 'P1'
  },
  {
    id: 'device-breakdown',
    title: 'Device/Browser Breakdown',
    description: 'Conversion nach Device-Typ, Browser, OS',
    dataType: 'analytics',
    availability: 'available',
    howToGet: '/admin/analytics',
    priority: 'P1'
  },
  {
    id: 'copy-inventory',
    title: 'Text/Copy Inventar',
    description: 'Alle Headlines, CTAs, Labels, Microcopy extrahiert',
    dataType: 'json',
    availability: 'planned',
    howToGet: 'Aus HTML extrahieren (geplant)',
    priority: 'P2'
  },
  {
    id: 'color-palette',
    title: 'Design Tokens / Farben',
    description: 'Verwendete Farben, Fonts, Spacing aus CSS',
    dataType: 'json',
    availability: 'planned',
    howToGet: 'CSS Analyse (geplant)',
    priority: 'P2'
  },
  {
    id: 'pdf-summary',
    title: 'PDF Zusammenfassung',
    description: 'Alle Daten als druckbare PDF mit Screenshots',
    dataType: 'pdf',
    availability: 'available',
    howToGet: 'Manuelles Package - PDF Option',
    priority: 'P1'
  }
];

// Get available context data
export const getAvailableContextData = (): ContextDataItem[] => {
  return CONTEXT_DATA_ITEMS.filter(item => item.availability === 'available');
};

// Get planned context data
export const getPlannedContextData = (): ContextDataItem[] => {
  return CONTEXT_DATA_ITEMS.filter(item => item.availability === 'planned');
};

// Get by priority
export const getContextDataByPriority = (priority: 'P0' | 'P1' | 'P2'): ContextDataItem[] => {
  return CONTEXT_DATA_ITEMS.filter(item => item.priority === priority);
};

// Get checklist markdown
export const getContextDataChecklistMarkdown = (): string => {
  const available = getAvailableContextData();
  const planned = getPlannedContextData();
  
  return `# 📦 Kontext-Daten für ChatGPT Analyse

## ✅ Verfügbar (${available.length} Datenquellen)

${available.map(item => `### ${item.title}
- **Typ:** ${item.dataType}
- **Priorität:** ${item.priority}
- **Beschreibung:** ${item.description}
- **Wie erhalten:** ${item.howToGet}
`).join('\n')}

## 🔜 Geplant (${planned.length} Datenquellen)

${planned.map(item => `### ${item.title}
- **Typ:** ${item.dataType}
- **Priorität:** ${item.priority}
- **Beschreibung:** ${item.description}
- **Status:** In Entwicklung
`).join('\n')}

---

## Empfohlene Kombination für maximale Analyse-Qualität:

1. **Screenshots** (Desktop + Mobile) - Visueller Kontext
2. **Rendered HTML** - Technische Struktur
3. **Funnel Analytics** - Performance-Daten
4. **A/B Test Results** - Was funktioniert besser
5. **Lighthouse Scores** - Performance-Metriken

*Mit diesen 5 Datenquellen hat ChatGPT alles für eine fundierte Analyse.*
`;
};
