/**
 * Vision Page Translations - DE/BG
 * Complete translation support for the Vision page
 */

export type VisionLanguage = 'de' | 'bg';

export interface RevenueStreamTranslation {
  name: string;
  tagline: string;
  scenario: string;
  steps: string[];
  whyValuable: string;
}

export interface ExitMilestoneTranslation {
  phase: string;
  description: string;
}

export interface ComparableTranslation {
  description: string;
  relevance: string;
}

export interface VisionTranslations {
  // Page header
  page: {
    badge: string;
    title: string;
    subtitle: string;
    backToMain: string;
    showAllDetails: string;
    hideDetails: string;
    compactPdf: string;
    downloadPdf: string;
  };
  
  // Customer USPs section
  customerUsps: {
    sectionTitle: string;
    sectionSubtitle: string;
    howItWorks: string;
    yourBenefit: string;
    beforeAfter: string;
    before: string;
    after: string;
    unique: string;
    vision: string;
    items: Array<{
      title: string;
      subtitle: string;
      tagline: string;
      simpleExplanation: string;
      benefit: string;
      painPoint: string;
      solution: string;
      howItWorks: string[];
    }>;
  };
  
  // Investor pillars section
  investorPillars: {
    sectionTitle: string;
    sectionSubtitle: string;
    pillarLabel: string;
    aiLevel: string;
    keyMetric: string;
    items: Array<{
      title: string;
      subtitle: string;
      concept: string;
      financials: string;
    }>;
  };
  
  // Family summary section
  familySummary: {
    badge: string;
    title: string;
    subtitle: string;
    problemTitle: string;
    problemSubtitle: string;
    solutionTitle: string;
    solutionSubtitle: string;
    simpleExplanation: string;
    simpleExplanationText: string;
    tenBenefitsTitle: string;
    tenBenefitsSubtitle: string;
    howWeEarnTitle: string;
    howWeEarnSubtitle: string;
    perCustomer: string;
    averageRevenue: string;
    ourCosts: string;
    almostAutomated: string;
    profitPerCustomer: string;
    margin: string;
    whySpecial: string;
    whySpecialText: string;
    whyNotExists: string;
    whatMakesUnique: string;
    problems: string[];
    moats: Array<{ title: string; desc: string; icon: string }>;
  };
  
  // Roadmap section
  roadmap: {
    title: string;
    subtitle: string;
    completedLabel: string;
    inProgressLabel: string;
    upcomingLabel: string;
    currentPhase: string;
    overallProgress: string;
    phases: Array<{
      phase: string;
      title: string;
      description: string;
      items: string[];
    }>;
    workDone: {
      title: string;
      subtitle: string;
      months: string;
      items: string[];
    };
  };
  
  // Comparison table
  comparison: {
    title: string;
    classic: string;
    us: string;
    features: Array<{
      feature: string;
      classic: string;
      us: string;
    }>;
  };
  
  // NEW: Revenue Stream Examples
  revenueExamples: {
    badge: string;
    title: string;
    subtitle: string;
    quickWins: string;
    standard: string;
    complex: string;
    exampleScenario: string;
    howItWorks: string;
    customerPays: string;
    weGet: string;
    partnerGets: string;
    whyValuable: string;
    streams: RevenueStreamTranslation[];
  };
  
  // NEW: Unit Economics
  unitEconomics: {
    badge: string;
    title: string;
    clarificationTitle: string;
    clarificationText: string;
    revenuePerCustomer: string;
    revenueSubtitle: string;
    totalRevenue: string;
    costsPerCustomer: string;
    costsSubtitle: string;
    totalCosts: string;
    profitPerCustomer: string;
    unitEconomicsLabel: string;
    margin: string;
    whyPossibleTitle: string;
    whyPossibleIntro: string;
    whyPossibleReasons: string[];
    classicProvider: string;
    us: string;
    timesMore: string;
  };
  
  // NEW: Market Potential
  marketPotential: {
    badge: string;
    title: string;
    subtitle: string;
    totalMarket: string;
    movesPerYear: string;
    private: string;
    business: string;
    payingCustomers: string;
    budgetReady: string;
    bookProService: string;
    comparisNote: string;
    ourMarketShare: string;
    basedOnSeo: string;
    conservative: string;
    realistic: string;
    ambitious: string;
    ordersPerYear: string;
    marketShare: string;
    goal: string;
    revenueCalculation: string;
    orders: string;
    revenuePerCustomer: string;
    marginLabel: string;
    profit: string;
    acquisitionStrategy: string;
    keyInsights: string;
    insights: Array<{ title: string; text: string }>;
  };
  
  // NEW: Exit Timeline
  exitTimeline: {
    badge: string;
    title: string;
    subtitle: string;
    now: string;
    comparableTitle: string;
    comparableSubtitle: string;
    movuTitle: string;
    movuText: string;
    whyWeWorthMore: string;
    movuReasons: string[];
    higherValuation: string;
    exitOptions: {
      strategic: { title: string; text: string };
      pe: { title: string; text: string };
      ipo: { title: string; text: string };
    };
    milestones: ExitMilestoneTranslation[];
    comparables: ComparableTranslation[];
  };
  
  // Footer
  footer: {
    questions: string;
    downloadPdf: string;
    toMainPage: string;
  };
}

// German translations (default)
const de: VisionTranslations = {
  page: {
    badge: "Interne Präsentation",
    title: "Umzugscheck.ch Vision",
    subtitle: "Die vollständige Übersicht für Familie und Investoren – was wir bauen, warum es funktioniert und wohin die Reise geht.",
    backToMain: "Zurück zur Hauptseite",
    showAllDetails: "Alle Details anzeigen",
    hideDetails: "Details verbergen",
    compactPdf: "Kompakt-PDF",
    downloadPdf: "Als PDF herunterladen"
  },
  customerUsps: {
    sectionTitle: "10 Kunden-Vorteile",
    sectionSubtitle: "Was unsere Plattform für Familien einzigartig macht",
    howItWorks: "So funktioniert's",
    yourBenefit: "Ihr Vorteil",
    beforeAfter: "Vorher vs. Nachher anzeigen",
    before: "Früher",
    after: "Jetzt",
    unique: "Einzigartig",
    vision: "Vision",
    items: [
      { title: "Der «Magische Blick»", subtitle: "AI Video-Analyse", tagline: "Bis zu 40% sparen", simpleExplanation: "Filmen Sie Ihre Wohnung mit dem Handy. Die KI zählt alles automatisch und berechnet das exakte Volumen.", benefit: "Kein Hausbesuch nötig – exakte Offerten in Minuten statt Tagen.", painPoint: "Früher: Fremde Leute im Haus, ungenaue Schätzungen, Überraschungen bei der Rechnung.", solution: "Jetzt: 2 Minuten Video = präzise Offerte. Die KI erkennt jeden Schrank.", howItWorks: ["📱 Video aufnehmen", "🤖 KI analysiert", "📋 5 Offerten erhalten"] },
      { title: "Der «Sicherheits-Tresor»", subtitle: "Treuhand-Zahlung", tagline: "100% Betrugsschutz", simpleExplanation: "Ihr Geld bleibt sicher auf einem Treuhandkonto – die Firma kriegt es erst nach erfolgreichem Umzug.", benefit: "100% Schutz vor Betrug. Zahlen Sie erst, wenn alles okay ist.", painPoint: "Früher: Vorkasse an unbekannte Firmen, Angst vor Betrug, keine Kontrolle.", solution: "Jetzt: Geld bei uns sicher verwahrt. Sie klicken «OK» → Firma wird bezahlt.", howItWorks: ["💰 Zahlung an Tresor", "🚛 Umzug erfolgt", "✅ Bestätigen → Auszahlung"] },
      { title: "Der «Bürokratie-Butler»", subtitle: "Autopilot für Papierkram", tagline: "Ein Klick = Alles erledigt", simpleExplanation: "Wir melden Sie bei der Gemeinde um, kündigen Strom/Internet und bestellen alles Neue.", benefit: "Sie sparen Stunden. Keine Warteschleifen, kein Ämter-Stress.", painPoint: "Früher: Endlose Formulare, Warteschleifen beim Amt, Chaos mit Anbietern.", solution: "Jetzt: Ein Klick. Unser Roboter erledigt den ganzen Papierkram.", howItWorks: ["📝 Daten eingeben", "🤖 Autopilot startet", "📬 Alles bestätigt"] },
      { title: "Die «Alles-Glänzt»-Garantie", subtitle: "Zertifizierte Endreinigung", tagline: "Garantierte Abnahme", simpleExplanation: "Wir organisieren die Putzfirma – mit Garantie. Meckert der Vermieter, kommt sie kostenlos nochmal.", benefit: "Sie geben nur den Schlüssel ab. Der Stress bleibt bei uns.", painPoint: "Früher: Stress mit Vermieter, Kaution-Streit, selbst putzen oder hoffen.", solution: "Jetzt: Profis mit Garantie. Meckert jemand? Wir regeln das – ohne Sie.", howItWorks: ["🧹 Reinigung buchen", "✨ Wohnung blitzt", "🔑 Schlüssel abgeben"] },
      { title: "Der Entrümpelungs-Knopf", subtitle: "Circular Economy", tagline: "Weniger = Billiger", simpleExplanation: "Markieren Sie im Video, was weg kann. Wir holen es vor dem Umzug ab – und Sie sparen Geld.", benefit: "Weniger Volumen = billigerer Umzug. Starten Sie ohne Altlasten.", painPoint: "Früher: Altes Zeug mitschleppen, höhere Kosten, Chaos nach dem Umzug.", solution: "Jetzt: Vorher aussortieren. Wir holen ab, spenden oder verkaufen für Sie.", howItWorks: ["🏷️ Im Video markieren", "🚚 Wir holen ab", "♻️ Spenden/Verkaufen"] },
      { title: "Der «Fair-Preis-Wächter»", subtitle: "Transparenter Marktplatz", tagline: "5 Offerten vergleichen", simpleExplanation: "Sie bekommen 5 geprüfte Angebote nebeneinander. Wir filtern unrealistische Billig-Angebote raus.", benefit: "Sie sehen sofort, wer fair ist. Kein Preis-Dschungel mehr.", painPoint: "Früher: Ein Angebot, keine Vergleichsmöglichkeit, Unsicherheit beim Preis.", solution: "Jetzt: 5 geprüfte Firmen im direkten Vergleich. KI filtert Abzocker.", howItWorks: ["📋 Anfrage stellen", "📊 5 Offerten in 24h", "⚖️ Fair vergleichen"] },
      { title: "Der «Neue-Heimat»-Guide", subtitle: "Relocation Intelligence", tagline: "Ab Tag 1 zuhause", simpleExplanation: "Eine interaktive Karte zeigt alles Wichtige: Bäcker, Arzt, Müllabfuhr, Schule – am neuen Ort.", benefit: "Ab Tag 1 zuhause fühlen. Kein Suchen, kein Fragen.", painPoint: "Früher: Fremd in der neuen Gegend, endloses Suchen, Wochen bis man ankommt.", solution: "Jetzt: Wir liefern das Wissen der Nachbarn digital mit.", howItWorks: ["📍 Neue Adresse", "🗺️ Interaktive Karte", "🏪 Alle Infos parat"] },
      { title: "Versicherung, die zahlt", subtitle: "Smart Insurance", tagline: "Video = Beweis", simpleExplanation: "Wir haben Video-Beweise vom Zustand Ihrer Möbel – vor dem Umzug. Schäden werden sofort bezahlt.", benefit: "Bei Schäden zahlt die Versicherung sofort. Keine Formular-Schlachten.", painPoint: "Früher: Keine Beweise, endlose Formulare, Streit mit Versicherung.", solution: "Jetzt: Video-Beweis vor dem Umzug. Schaden? KI vergleicht vorher/nachher → Geld.", howItWorks: ["📹 Video = Beweis", "📦 Umzug", "💰 Schaden → Sofort Geld"] },
      { title: "Immer erreichbar", subtitle: "Omni-Channel Concierge", tagline: "0 Minuten Wartezeit", simpleExplanation: "WhatsApp, Telefon oder Chat – Sie kriegen sofort Antwort. Keine Warteschleife, keine Hotline-Hölle.", benefit: "Wenn Sie nervös sind, sind wir da. KI löst 95% der Fragen sofort.", painPoint: "Früher: Hotline-Warteschleife, E-Mail ohne Antwort, Stress am Umzugstag.", solution: "Jetzt: Sofort-Antwort via WhatsApp/Chat. Mensch da, wenn nötig.", howItWorks: ["💬 WhatsApp/Chat", "🤖 KI antwortet", "👤 Mensch wenn nötig"] },
      { title: "Möbel-Taxi & Montage", subtitle: "Handyman Service", tagline: "Keinen Finger rühren", simpleExplanation: "Lampen abmontieren, Bilder aufhängen, IKEA-Schrank aufbauen – alles im Service inklusive.", benefit: "Sie müssen am Umzugstag keinen Schraubenzieher anfassen.", painPoint: "Früher: Selbst abbauen, selbst aufbauen, Stunden mit Werkzeug.", solution: "Jetzt: Wir machen alles. Sie entspannen. Montage ist eingeplant.", howItWorks: ["🔧 Demontage", "🚚 Transport", "🛠️ Aufbau am Ziel"] }
    ]
  },
  investorPillars: {
    sectionTitle: "10 Investoren-Säulen",
    sectionSubtitle: "Das strategische Fundament für exponentielles Wachstum",
    pillarLabel: "Säule",
    aiLevel: "KI-Grad",
    keyMetric: "Key Metric",
    items: [
      { title: "Computer Vision Asset", subtitle: "AI Acquisition Engine", concept: "Proprietäre Datenbasis aus Millionen Videos – Tech-Monopol auf Inventar-Erkennung.", financials: "Lizenz: 20 CHF/Scan. Spart Firmen ~150 CHF pro Besichtigung." },
      { title: "Fintech & Escrow", subtitle: "Cashflow-Hebel", concept: "Wir kontrollieren den Geldfluss (GMV). Wir sind nicht nur Makler, wir sind die Bank.", financials: "Float & Fees: 2'000 CHF Float + 1.5% Fee (30 CHF/Transaktion)." },
      { title: "Dynamic Pricing Engine", subtitle: "Yield Management", concept: "Wir diktieren Marktpreise basierend auf Angebot/Nachfrage (wie Uber Surge).", financials: "Standard: 15% Take-Rate. Peak: 20-25%. +10% Umsatz." },
      { title: "B2B / HR-Relocation Suite", subtitle: "High Value LTV", concept: "SaaS für HR-Abteilungen (Expat-Umzüge). Hohe Warenkörbe.", financials: "Abo 500 CHF/Monat + Provision ~3'000 CHF/Umzug." },
      { title: "Bureaucracy API Layer", subtitle: "Recurring Revenue", concept: "Direkte Schnittstellen zu Behörden & Versorgern. Schwer kopierbar.", financials: "Service: 49 CHF/Kunde + 100 CHF Affiliate (Telco/Strom)." },
      { title: "Partner Operating System", subtitle: "Vendor Lock-in", concept: "Umzugsfirmen nutzen unsere Dispo-Software. Wechselkosten extrem hoch.", financials: "SaaS: 99 CHF/Monat + 15% Provision (225 CHF/Umzug)." },
      { title: "Micro-Insurance", subtitle: "Insurtech Margin", concept: "Sekundengenaue Policen basierend auf Videodaten. Wir kennen das Risiko.", financials: "Prämie: 50-99 CHF. Schadenquote niedrig. Marge: ~60%." },
      { title: "Circular Economy Hub", subtitle: "Pre-Move Disposal", concept: "Monetarisierung von Altmöbeln. Doppelte Einnahmequelle.", financials: "Entsorgungsgebühr: 50-200 CHF + Resale: 20%." },
      { title: "Relocation Data Intelligence", subtitle: "Data Monetization", concept: "Wir wissen als Erste, wer wohin zieht und wie kaufkräftig.", financials: "Lead-Verkauf: 50-150 CHF (3× verkaufbar)." },
      { title: "Lean Operations", subtitle: "Die 95/5 Formel", concept: "Umsatz wächst, Headcount bleibt flach. Exponentielle Profitabilität.", financials: "3 Mitarbeiter für 10'000 Umzüge. Spart ~2 Mio CHF/Jahr." }
    ]
  },
  familySummary: {
    badge: "Für die Familie erklärt",
    title: "Was ich baue 🚀",
    subtitle: "Eine einfache Zusammenfassung für Mama, Papa und alle, die verstehen wollen,",
    problemTitle: "Das Problem heute",
    problemSubtitle: "Umziehen in der Schweiz ist Stress pur",
    solutionTitle: "Meine Lösung: Umzugscheck.ch",
    solutionSubtitle: "Die intelligenteste Umzugs-Plattform der Schweiz",
    simpleExplanation: "Einfach erklärt",
    simpleExplanationText: "Stell dir vor: Du filmst deine Wohnung mit dem Handy → Die KI erkennt alle Möbel → Du bekommst 5 faire Preise → Ein Klick und alles wird organisiert: Umzugsfirma, Reinigung, Ummeldung, sogar Tipps für deine neue Nachbarschaft! 🏠",
    tenBenefitsTitle: "10 Vorteile für Familien",
    tenBenefitsSubtitle: "Was Kunden bei uns bekommen – alles aus einer Hand",
    howWeEarnTitle: "Wie wir Geld verdienen 💰",
    howWeEarnSubtitle: "Nicht nur eine Einnahmequelle – sondern zehn verschiedene!",
    perCustomer: "Pro Kunde verdienen wir:",
    averageRevenue: "durchschnittlich",
    ourCosts: "Unsere Kosten pro Kunde:",
    almostAutomated: "fast alles automatisiert",
    profitPerCustomer: "= Gewinn pro Kunde",
    margin: ">90% Marge!",
    whySpecial: "Warum ist das besonders?",
    whySpecialText: "Normale Firmen haben 10-30% Marge. Wir haben über 90%, weil fast alles von Künstlicher Intelligenz erledigt wird. Wir brauchen nur 3-5 Mitarbeiter für Tausende von Kunden.",
    whyNotExists: "Warum gibt es das noch nicht?",
    whatMakesUnique: "Was uns von allen anderen unterscheidet",
    problems: [
      "Keine Ahnung, welche Firma seriös ist",
      "Preise variieren wild (1'000 – 5'000 CHF)",
      "Stundenlange Telefonate, keine Antwort",
      "Papierkram: Gemeinde, Strom, Internet...",
      "Angst vor Betrug und versteckten Kosten",
      "Nach dem Umzug: fremd in neuer Gegend"
    ],
    moats: [
      { title: "KI-Video-Technologie", desc: "Wir haben eigene KI entwickelt, die Möbel in Videos erkennt. Das kann sonst niemand.", icon: "🧠" },
      { title: "Treuhand-System (Fintech)", desc: "Wir kontrollieren den Geldfluss – wie eine Bank für Umzüge. Das schafft Vertrauen.", icon: "🏦" },
      { title: "Behörden-Schnittstellen", desc: "Wir haben direkte Verbindungen zu Gemeinden und Versorgern aufgebaut. Extrem schwer zu kopieren.", icon: "🔌" },
      { title: "95% Automatisierung", desc: "Während andere 50 Mitarbeiter brauchen, machen wir das mit 3 Leuten + KI.", icon: "🤖" }
    ]
  },
  roadmap: {
    title: "Der Weg zum Marktführer",
    subtitle: "Wo wir stehen und was kommt",
    completedLabel: "Abgeschlossen",
    inProgressLabel: "In Arbeit",
    upcomingLabel: "Geplant",
    currentPhase: "Aktuelle Phase",
    overallProgress: "Gesamtfortschritt bis Live-Launch",
    phases: [
      {
        phase: "Phase 1: Fundament",
        title: "Technologie & MVP",
        description: "Die Grundlagen für alles, was kommt",
        items: [
          "✅ Komplettes Frontend mit React/TypeScript",
          "✅ Supabase Backend & Datenbank",
          "✅ 10 verschiedene Umzugs-Rechner",
          "✅ Firmen-Verzeichnis mit 30+ Providern",
          "✅ Mehrstufiger Offerten-Funnel",
          "✅ SEO-optimierte Landing Pages",
          "✅ Mobile-First Design",
          "✅ Admin Dashboard Grundstruktur"
        ]
      },
      {
        phase: "Phase 2: Intelligence",
        title: "Relocation Database & UX",
        description: "Daten-Fundament und Conversion-Optimierung",
        items: [
          "✅ Neighborhood Profiles (26 Städte)",
          "✅ POIs & lokale Informationen",
          "✅ Newcomer Kit UI-Komponenten",
          "✅ City Moving Checklists",
          "✅ Schema.org SEO Markup",
          "✅ Neighborhood Comparison Tool",
          "✅ Post-Move Checklist (20+ Tasks)",
          "✅ AI Cost Predictor Engine"
        ]
      },
      {
        phase: "Phase 3: Scale",
        title: "Marketing & Growth",
        description: "Traffic-Akquisition und Monetarisierung",
        items: [
          "✅ WhatsApp-First Flow Integration",
          "✅ Capacity Radar (Echtzeit-Verfügbarkeit)",
          "✅ Provider Live-Chat Widget",
          "✅ Buddy Matching (LKW-Sharing)",
          "✅ Lead Bidding System (Echtzeit-Auktionen)",
          "✅ Email Automation Framework",
          "✅ Stripe Payment Integration",
          "✅ SEO Hub-and-Spoke Strategie",
          "✅ A/B Testing Framework",
          "🔄 Google Ads Kampagnen"
        ]
      },
      {
        phase: "Phase 4: Moat",
        title: "Wettbewerbsvorteile",
        description: "Schwer kopierbare Features",
        items: [
          "✅ AR Inventory Scanner (Raum-für-Raum)",
          "✅ Escrow/Treuhand System",
          "✅ Quality Badge System",
          "✅ Behörden-API Integration",
          "✅ Partner Operating System (SaaS)",
          "✅ Micro-Insurance Module",
          "✅ AI Video Inventory (Computer Vision)",
          "✅ Verpackungsservice-Modul (Upsell)",
          "✅ Kreislaufwirtschaft (Circular Economy)",
          "✅ Data Journalism (Marktstatistiken)"
        ]
      },
      {
        phase: "Phase 5: Launch",
        title: "Conversion & Go-Live",
        description: "Finales Tuning und Marktstart",
        items: [
          "✅ Golden Flow Conversion-Optimierung",
          "✅ Performance & Lighthouse Audit",
          "✅ Final Security Review",
          "🔄 Provider Onboarding (erste 10 Partner)",
          "🔄 Google Ads Kampagnen",
          "⏳ Soft Launch (Beta-Kunden)",
          "⏳ Press Kit & PR Vorbereitung",
          "⏳ Go-Live 🚀"
        ]
      }
    ],
    workDone: {
      title: "Was in 3+ Monaten entstanden ist",
      subtitle: "Tag und Nacht gearbeitet – hier ist das Ergebnis",
      months: "3+ Monate intensive Arbeit",
      items: [
        "340+ React Komponenten entwickelt",
        "105+ Seiten und Routes erstellt",
        "38+ Datenbank-Tabellen designt",
        "10 verschiedene Rechner implementiert",
        "26 Städte mit Neighborhood-Daten",
        "30+ Umzugsfirmen im System",
        "5-stufiger Lead-Funnel gebaut",
        "17+ Extended Features implementiert",
        "AI Cost Predictor mit CH-Daten",
        "WhatsApp-First Integration",
        "Capacity Radar (Live-Verfügbarkeit)",
        "Buddy Matching für LKW-Sharing",
        "AR Inventory Scanner",
        "AI Video Inventory (Computer Vision)",
        "Verpackungsservice-Modul (Upsell)",
        "Kreislaufwirtschaft (Circular Economy)",
        "Data Journalism (Marktstatistiken)",
        "Provider Live-Chat System",
        "Lead Bidding System (Auktionen)",
        "Escrow/Treuhand System",
        "Email Automation Framework",
        "Stripe Payment Integration",
        "Behörden-API (11 Services)",
        "Partner OS (Mover SaaS)",
        "Micro-Insurance (4 Tarife)",
        "Post-Move Checklist (7 Kategorien)",
        "Neighborhood Comparison (11 Metriken)",
        "SEO Hub-and-Spoke Architektur",
        "A/B Testing Framework (6 Tests)",
        "Performance Monitor (Core Web Vitals)",
        "Launch Readiness Dashboard",
        "Vision Page für Stakeholder",
        "Dark Mode + Mobile-First Design"
      ]
    }
  },
  comparison: {
    title: "Klassischer Umzug vs. Umzugscheck.ch",
    classic: "Klassisch",
    us: "Mit uns",
    features: [
      { feature: "Inventar-Aufnahme", classic: "Hausbesuch (2h + 150 CHF)", us: "2 Min Video-Scan" },
      { feature: "Preisvergleich", classic: "3 Anrufe, 3 Tage warten", us: "5 Offerten in 24h" },
      { feature: "Zahlungssicherheit", classic: "Vorkasse an Firma", us: "Treuhand-Konto" },
      { feature: "Bürokratie", classic: "Selbst erledigen", us: "1-Klick Autopilot" },
      { feature: "Endreinigung", classic: "Selbst organisieren", us: "Mit Garantie inklusive" },
      { feature: "Versicherung", classic: "Streit bei Schäden", us: "Video-Beweis = sofort Geld" }
    ]
  },
  footer: {
    questions: "Fragen? Sprich mich einfach an.",
    downloadPdf: "PDF herunterladen",
    toMainPage: "Zur Hauptseite"
  },
  
  // NEW SECTIONS - German
  revenueExamples: {
    badge: "10 Einnahmequellen im Detail",
    title: "Konkrete Beispiele: So verdienen wir Geld",
    subtitle: "Jede Einnahmequelle erklärt mit einem echten Beispiel-Szenario. Von einfach (sofort umsetzbar) bis komplex (braucht Aufbau).",
    quickWins: "Quick Win",
    standard: "Standard",
    complex: "Komplex",
    exampleScenario: "📌 Beispiel-Szenario",
    howItWorks: "🔄 So funktioniert's",
    customerPays: "Kunde zahlt",
    weGet: "Wir bekommen",
    partnerGets: "Partner erhält",
    whyValuable: "💡 Warum wertvoll",
    streams: [
      { name: "Affiliate Telco/Energie", tagline: "Kunde wechselt Anbieter → Wir kassieren", scenario: "Familie Müller zieht um und braucht Internet am neuen Ort. Wir empfehlen Swisscom.", steps: ["Kunde gibt neue Adresse ein", "Wir zeigen passende Internet/Strom-Angebote", "Kunde klickt auf 'Jetzt wechseln'", "Anbieter zahlt uns 80-150 CHF Provision"], whyValuable: "Zero-Cost Revenue: Wir verdienen, ohne etwas zu liefern. Pure Vermittlung." },
      { name: "Lead-Verkauf (CPL)", tagline: "Umzugsfirma zahlt für qualifizierte Anfrage", scenario: "Herr Schmidt sucht Umzugsfirma für 3-Zimmer-Wohnung. 3 Firmen bekommen seine Anfrage.", steps: ["Kunde füllt Offerten-Formular aus", "Wir matchen mit 3-5 passenden Firmen", "Jede Firma zahlt 15-45 CHF pro Lead", "Firmen kontaktieren Kunde direkt"], whyValuable: "Skaliert perfekt: Mehr Traffic = linear mehr Revenue. Kein Fulfillment nötig." },
      { name: "Basis-Provision (Take-Rate)", tagline: "15% von jedem Umzug über unsere Plattform", scenario: "Umzug Zürich → Bern, 30m³. Umzugsfirma berechnet CHF 1'500.", steps: ["Kunde bucht Umzug über unsere Plattform", "Umzugsfirma führt Umzug durch", "Kunde zahlt an uns (Treuhand)", "Wir behalten 15% und zahlen 85% an Firma"], whyValuable: "Unser Kern-Revenue: Je mehr Umzüge, desto mehr verdienen wir. Durchschnitt: CHF 225/Umzug." },
      { name: "Reinigung mit Garantie", tagline: "Abnahme-Garantie = Premium-Preis", scenario: "4-Zimmer-Wohnung, 85m². Reinigung mit Abnahme-Garantie.", steps: ["Kunde bucht 'Garantie-Reinigung'", "Zertifizierte Putzfirma reinigt", "Falls Vermieter reklamiert: kostenlose Nachbesserung", "Wir behalten 20% für Garantie-Risiko"], whyValuable: "Höhere Marge als Standard wegen Garantie-Versprechen. Cross-Sell zu jedem Umzug." },
      { name: "Bürokratie-Autopilot", tagline: "Ein Klick = Alles umgemeldet", scenario: "Komplette Ummeldung: Gemeinde, Strom, Internet, Versicherung, Post.", steps: ["Kunde gibt alte + neue Adresse ein", "Wählt Services: Gemeinde, Strom, Post, etc.", "Zahlt CHF 49 Pauschal", "Unser Bot erledigt alles automatisch"], whyValuable: "98% Marge da vollautomatisch. Spart Kunden 5-8 Stunden Arbeit." },
      { name: "Escrow / Treuhand-Fees", tagline: "Wir halten das Geld = Wir verdienen am Float", scenario: "Umzug für CHF 2'000. Kunde zahlt vorab an uns. Firma wird nach Abschluss bezahlt.", steps: ["Kunde bucht Umzug und zahlt an Treuhand-Konto", "Geld liegt 7-14 Tage bei uns", "Nach erfolgreichem Umzug: 'Bestätigen' klicken", "Firma wird ausbezahlt, wir behalten 1.5% Fee"], whyValuable: "Doppelter Vorteil: Fee + Float-Zinsen. Bei 1'000 Umzügen/Monat = 1.5 Mio Float!" },
      { name: "Circular Economy", tagline: "Altes Zeug wird zu Geld", scenario: "Kunde will altes Sofa, Schrank und Matratze loswerden.", steps: ["Kunde markiert im Video was weg soll", "Wir holen ab (CHF 80-200 je nach Menge)", "Brauchbares wird auf Ricardo/Tutti verkauft", "Wir behalten Entsorgungsgebühr + 20% vom Verkauf"], whyValuable: "Doppelte Einnahme: Entsorgung bezahlt + Weiterverkauf. Reduziert auch Umzugskosten." },
      { name: "Micro-Insurance", tagline: "Video-Beweis = Sofort-Zahlung bei Schäden", scenario: "Umzugsversicherung für Hausrat im Wert von CHF 50'000.", steps: ["Kunde macht Video-Inventar vor Umzug", "Wählt Versicherungs-Paket (Basic/Premium)", "Bei Schaden: KI vergleicht Vorher/Nachher-Video", "Automatische Auszahlung innerhalb 48h"], whyValuable: "60% Marge weil Video-Beweise die Schadenquote minimieren. Klassische Versicherung: 20% Marge." },
      { name: "Partner SaaS (MRR)", tagline: "Umzugsfirmen zahlen monatlich für unsere Software", scenario: "Umzugsfirma 'Blitz-Umzüge' nutzt unser Dispo-System.", steps: ["Firma meldet sich für Partner-Portal an", "Nutzt Lead-Management, Kapazitätsplanung, Auto-Bidding", "Zahlt CHF 99/Monat Abo", "Zusätzlich: 15% Provision pro vermitteltem Auftrag"], whyValuable: "Recurring Revenue! 100 Partner × 99 CHF = 10k MRR. Plus Lock-in Effekt." },
      { name: "B2B HR-Relocation", tagline: "Enterprise-Kunden mit hohen Warenkörben", scenario: "Credit Suisse relociert 5 Expats von London nach Zürich.", steps: ["HR-Abteilung bucht Relocation-Paket", "Wir organisieren: Umzug, Wohnung, Schule, Behörden", "Monatliches Abo + Provision pro Mitarbeiter", "LTV pro Enterprise-Kunde: >50'000 CHF"], whyValuable: "High-Value Segment: Ein Firmen-Kunde = 50 Privatkunden. Lange Verträge." }
    ]
  },
  
  unitEconomics: {
    badge: "Unit Economics pro Kunde",
    title: "Wie sich 553 CHF pro Kunde zusammensetzen",
    clarificationTitle: "Warum \"10 Einnahmequellen\" und \"6 Umsatzströme\"?",
    clarificationText: "10 Einnahmequellen = Alle möglichen Revenue Streams (inkl. B2B, Partner SaaS, etc.). 6 Umsatzströme = Was ein typischer Privatkunde nutzt und generiert. Die 553 CHF sind der Durchschnitt bei Privatkunden. Mit B2B/Enterprise-Kunden steigt der Wert deutlich höher.",
    revenuePerCustomer: "Umsatz pro Kunde",
    revenueSubtitle: "6 Umsatzströme bei Privatkunden",
    totalRevenue: "Total Umsatz",
    costsPerCustomer: "Kosten pro Kunde",
    costsSubtitle: "Fast alles automatisiert",
    totalCosts: "Total Kosten",
    profitPerCustomer: "Gewinn pro Kunde",
    unitEconomicsLabel: "Die Unit Economics",
    margin: "Marge",
    whyPossibleTitle: "Warum ist 90%+ Marge möglich?",
    whyPossibleIntro: "Normale Firmen haben 10-30% Marge, weil sie viele Mitarbeiter brauchen. Wir haben > 90% weil:",
    whyPossibleReasons: [
      "95% KI-Automatisierung – Fast keine manuellen Prozesse",
      "10 Revenue Streams – Mehr verdienen pro Kunde als nur Provision",
      "SEO-First – Niedrige Akquisekosten durch organischen Traffic",
      "3-5 Mitarbeiter reichen für 10'000+ Kunden/Jahr"
    ],
    classicProvider: "Klassischer Vermittler",
    us: "Wir",
    timesMore: "× mehr"
  },
  
  marketPotential: {
    badge: "📊 Marktanalyse Schweiz",
    title: "Marktpotenzial & Wachstumsstrategie",
    subtitle: "Basierend auf Post-Daten, Comparis-Studien und Branchen-Insights",
    totalMarket: "Gesamtmarkt",
    movesPerYear: "Umzugsaufträge pro Jahr in der Schweiz",
    private: "Privat",
    business: "Business",
    payingCustomers: "Zahlende Kunden",
    budgetReady: "Kunden mit Budget & Bereitschaft",
    bookProService: "buchen Profi-Service",
    comparisNote: "Laut Comparis-Umfrage nutzen ~⅓ einen professionellen Umzugsdienst",
    ourMarketShare: "Unser realistischer Marktanteil",
    basedOnSeo: "Basierend auf SEO-Dominanz + gezieltem Marketing",
    conservative: "Konservativ (Jahr 1)",
    realistic: "Realistisch (Jahr 2-3)",
    ambitious: "Ambitioniert (Jahr 4+)",
    ordersPerYear: "Aufträge/Jahr",
    marketShare: "Marktanteil",
    goal: "Ziel",
    revenueCalculation: "Revenue-Rechnung (5% Marktanteil)",
    orders: "Aufträge",
    revenuePerCustomer: "× Umsatz/Kunde",
    marginLabel: "Marge 90%",
    profit: "Gewinn",
    acquisitionStrategy: "Kundenakquisitions-Strategie",
    keyInsights: "💡 Schlüssel-Erkenntnisse",
    insights: [
      { title: "Fokus auf 165k", text: "Nicht alle 450k erreichen — nur die ~165k+ mit Budget & Bereitschaft targetieren" },
      { title: "Business = Höherer Profit", text: "Firmenumzüge sind weniger, aber 100% Service-Bereitschaft & höherer Auftragswert" },
      { title: "5-Sek TV = Awareness", text: "Kurze Spots (\"Es gibt diesen Service!\") bei selektierten Sendern & Zeiten" }
    ]
  },
  
  exitTimeline: {
    badge: "Exit-Strategie & Bewertung",
    title: "Was ist das Ziel? 🎯",
    subtitle: "Wann könnte man die Firma verkaufen und für wie viel? Basierend auf vergleichbaren Transaktionen im Markt.",
    now: "Jetzt",
    comparableTitle: "Vergleichbare Transaktionen",
    comparableSubtitle: "Was haben ähnliche Firmen bei einem Exit erzielt?",
    movuTitle: "MOVU → Baloise (2017): Der relevanteste Vergleich",
    movuText: "MOVU wurde 2017 von der Baloise Gruppe übernommen – die grösste digitale Umzugsplattform der Schweiz zu dem Zeitpunkt. Der Kaufpreis wurde nicht veröffentlicht, wird aber auf 5-10 Mio CHF geschätzt.",
    whyWeWorthMore: "Warum wir mehr wert sein werden:",
    movuReasons: [
      "10 Revenue Streams statt nur Lead-Verkauf",
      "KI-Technologie (Video, Automation) – MOVU hatte das nicht",
      "Fintech-Layer (Escrow) – höhere Stickiness",
      "90%+ Marge vs. klassische 20-30%"
    ],
    higherValuation: "→ Bei vergleichbarer Grösse: 3-5× höhere Bewertung möglich durch Tech + Moats",
    exitOptions: {
      strategic: { title: "Strategic Acquisition", text: "Versicherung (Baloise, AXA) oder Immobilien-Portal (Homegate, ImmoScout)" },
      pe: { title: "Private Equity", text: "Growth Buyout bei 5-10 Mio ARR, dann Scale-Up für IPO" },
      ipo: { title: "IPO (Long-term)", text: "Bei 100+ Mio Umsatz, europäische Marktführerschaft" }
    },
    milestones: [
      { phase: "Heute", description: "MVP fertig, erste Traction" },
      { phase: "Seed-Ready", description: "1'000+ Leads/Monat, Profitabel" },
      { phase: "Series A", description: "Marktführer Schweiz, DACH-Expansion" },
      { phase: "Growth", description: "DACH dominiert, 50k+ Umzüge/Jahr" },
      { phase: "Exit / IPO", description: "Europäischer Leader, IPO-Ready" }
    ],
    comparables: [
      { description: "Schweizer Umzugs-Plattform", relevance: "Direkter Vergleich – wir bauen MOVU 2.0 mit 10x mehr Features" },
      { description: "Deutsches Umzugs-Startup", relevance: "Warnung: Zu schnell skaliert ohne Unit Economics. Wir = Profitabel first." },
      { description: "PropTech / Immobilien-Makler", relevance: "Ähnliches Modell (Lead-Gen + Services) in Immobilien" }
    ]
  }
};

// Bulgarian translations
const bg: VisionTranslations = {
  page: {
    badge: "Вътрешна презентация",
    title: "Umzugscheck.ch Визия",
    subtitle: "Пълен преглед за семейството и инвеститорите – какво строим, защо работи и накъде отиваме.",
    backToMain: "Обратно към началото",
    showAllDetails: "Покажи всички детайли",
    hideDetails: "Скрий детайлите",
    compactPdf: "Компактен PDF",
    downloadPdf: "Изтегли като PDF"
  },
  customerUsps: {
    sectionTitle: "10 предимства за клиенти",
    sectionSubtitle: "Какво прави нашата платформа уникална за семействата",
    howItWorks: "Как работи",
    yourBenefit: "Вашата полза",
    beforeAfter: "Покажи преди и след",
    before: "Преди",
    after: "Сега",
    unique: "Уникално",
    vision: "Визия",
    items: [
      { title: "«Магическият поглед»", subtitle: "AI видео анализ", tagline: "Спестете до 40%", simpleExplanation: "Заснемете апартамента си с телефона. AI брои всичко автоматично и изчислява точния обем.", benefit: "Не е нужно посещение – точни оферти за минути вместо дни.", painPoint: "Преди: Непознати хора в дома, неточни оценки, изненади в сметката.", solution: "Сега: 2 минути видео = прецизна оферта. AI разпознава всеки шкаф.", howItWorks: ["📱 Запиши видео", "🤖 AI анализира", "📋 Получи 5 оферти"] },
      { title: "«Сейфът за сигурност»", subtitle: "Ескроу плащане", tagline: "100% защита от измами", simpleExplanation: "Парите ви остават в защитена ескроу сметка – фирмата ги получава едва след успешен преместване.", benefit: "100% защита от измами. Плащате едва когато всичко е наред.", painPoint: "Преди: Авансово плащане на непознати фирми, страх от измама, без контрол.", solution: "Сега: Парите при нас са сигурни. Вие натискате «ОК» → фирмата получава плащане.", howItWorks: ["💰 Плащане в сейф", "🚛 Преместване", "✅ Потвърдете → Изплащане"] },
      { title: "«Бюрократичният иконом»", subtitle: "Автопилот за документи", tagline: "Един клик = Всичко готово", simpleExplanation: "Ние ви пререгистрираме в общината, прекратяваме ток/интернет и поръчваме всичко ново.", benefit: "Спестявате часове. Без чакане на опашки, без стрес в службите.", painPoint: "Преди: Безкрайни формуляри, чакане в службите, хаос с доставчици.", solution: "Сега: Един клик. Нашият робот свършва цялата бюрокрация.", howItWorks: ["📝 Въведете данни", "🤖 Автопилот тръгва", "📬 Всичко потвърдено"] },
      { title: "Гаранция «Всичко блести»", subtitle: "Сертифицирано крайно почистване", tagline: "Гарантирано приемане", simpleExplanation: "Ние организираме почистващата фирма – с гаранция. Ако хазяинът се оплаче, идват безплатно отново.", benefit: "Вие само предавате ключа. Стресът е наш.", painPoint: "Преди: Стрес с хазяина, спор за депозита, сами чистим или се надяваме.", solution: "Сега: Професионалисти с гаранция. Някой се оплаква? Ние решаваме – без вас.", howItWorks: ["🧹 Резервирай почистване", "✨ Апартаментът блести", "🔑 Предай ключа"] },
      { title: "Бутонът за разчистване", subtitle: "Кръгова икономика", tagline: "По-малко = По-евтино", simpleExplanation: "Маркирайте във видеото какво може да се изхвърли. Ние го взимаме преди преместването – и вие спестявате пари.", benefit: "По-малък обем = по-евтино преместване. Започнете без стар багаж.", painPoint: "Преди: Влачене на стари неща, по-високи разходи, хаос след преместването.", solution: "Сега: Сортирайте предварително. Ние взимаме, даряваме или продаваме за вас.", howItWorks: ["🏷️ Маркирай във видео", "🚚 Ние взимаме", "♻️ Дарение/Продажба"] },
      { title: "«Пазителят на честни цени»", subtitle: "Прозрачен пазар", tagline: "Сравнете 5 оферти", simpleExplanation: "Получавате 5 проверени оферти една до друга. Ние филтрираме нереалистично евтините оферти.", benefit: "Веднага виждате кой е честен. Без ценови джунгла.", painPoint: "Преди: Една оферта, без сравнение, несигурност с цената.", solution: "Сега: 5 проверени фирми в директно сравнение. AI филтрира измамниците.", howItWorks: ["📋 Подайте заявка", "📊 5 оферти за 24ч", "⚖️ Сравнете честно"] },
      { title: "Пътеводител «Нов дом»", subtitle: "Relocation Intelligence", tagline: "Като у дома от ден 1", simpleExplanation: "Интерактивна карта показва всичко важно: пекарна, лекар, сметосъбиране, училище – на новото място.", benefit: "От ден 1 се чувствате като у дома. Без търсене, без питане.", painPoint: "Преди: Непознати в новия район, безкрайно търсене, седмици докато свикнете.", solution: "Сега: Доставяме знанието на съседите дигитално.", howItWorks: ["📍 Нов адрес", "🗺️ Интерактивна карта", "🏪 Цялата информация"] },
      { title: "Застраховка, която плаща", subtitle: "Smart Insurance", tagline: "Видео = Доказателство", simpleExplanation: "Имаме видео доказателство за състоянието на мебелите ви – преди преместването. Щетите се изплащат веднага.", benefit: "При щети застраховката плаща веднага. Без битки с формуляри.", painPoint: "Преди: Без доказателства, безкрайни формуляри, спорове със застраховка.", solution: "Сега: Видео доказателство преди преместване. Щета? AI сравнява преди/след → Пари.", howItWorks: ["📹 Видео = Доказателство", "📦 Преместване", "💰 Щета → Веднага пари"] },
      { title: "Винаги на линия", subtitle: "Omni-Channel Concierge", tagline: "0 минути чакане", simpleExplanation: "WhatsApp, телефон или чат – получавате отговор веднага. Без чакане, без адска гореща линия.", benefit: "Когато сте нервни, ние сме тук. AI решава 95% от въпросите веднага.", painPoint: "Преди: Чакане на гореща линия, имейл без отговор, стрес в деня на преместване.", solution: "Сега: Мигновен отговор през WhatsApp/чат. Човек ако е нужно.", howItWorks: ["💬 WhatsApp/Чат", "🤖 AI отговаря", "👤 Човек ако трябва"] },
      { title: "Такси за мебели и монтаж", subtitle: "Handyman Service", tagline: "Без да мръднете пръст", simpleExplanation: "Демонтаж на лампи, окачване на картини, сглобяване на IKEA шкаф – всичко включено в услугата.", benefit: "В деня на преместване не пипате отвертка.", painPoint: "Преди: Сами разглобявате, сами сглобявате, часове с инструменти.", solution: "Сега: Ние правим всичко. Вие се отпускате. Монтажът е планиран.", howItWorks: ["🔧 Демонтаж", "🚚 Транспорт", "🛠️ Монтаж на място"] }
    ]
  },
  investorPillars: {
    sectionTitle: "10 стълба за инвеститори",
    sectionSubtitle: "Стратегическата основа за експоненциален растеж",
    pillarLabel: "Стълб",
    aiLevel: "AI ниво",
    keyMetric: "Ключов показател",
    items: [
      { title: "Computer Vision актив", subtitle: "AI Acquisition Engine", concept: "Собствена база данни от милиони видеа – технологичен монопол върху разпознаване на инвентар.", financials: "Лиценз: 20 CHF/сканиране. Спестява на фирми ~150 CHF на посещение." },
      { title: "Fintech & Escrow", subtitle: "Cashflow лост", concept: "Контролираме паричния поток (GMV). Не сме просто брокер, ние сме банката.", financials: "Float & Такси: 2'000 CHF Float + 1.5% такса (30 CHF/транзакция)." },
      { title: "Dynamic Pricing Engine", subtitle: "Yield Management", concept: "Диктуваме пазарни цени базирано на търсене/предлагане (като Uber Surge).", financials: "Стандартно: 15% Take-Rate. Пикове: 20-25%. +10% приходи." },
      { title: "B2B / HR-Relocation Suite", subtitle: "Висок LTV", concept: "SaaS за HR отдели (експат премествания). Високи кошници.", financials: "Абонамент 500 CHF/месец + комисионна ~3'000 CHF/преместване." },
      { title: "Bureaucracy API Layer", subtitle: "Recurring Revenue", concept: "Директни интерфейси към власти и доставчици. Трудно за копиране.", financials: "Услуга: 49 CHF/клиент + 100 CHF Affiliate (телеком/ток)." },
      { title: "Partner Operating System", subtitle: "Vendor Lock-in", concept: "Преместващи фирми използват нашия диспечерски софтуер. Разходи за смяна – изключително високи.", financials: "SaaS: 99 CHF/месец + 15% комисионна (225 CHF/преместване)." },
      { title: "Micro-Insurance", subtitle: "Insurtech Margin", concept: "Застрахователни полици базирани на видео данни. Познаваме риска.", financials: "Премия: 50-99 CHF. Ниска щетност. Марж: ~60%." },
      { title: "Circular Economy Hub", subtitle: "Pre-Move Disposal", concept: "Монетизация на стари мебели. Двоен източник на приходи.", financials: "Такса за извозване: 50-200 CHF + Препродажба: 20%." },
      { title: "Relocation Data Intelligence", subtitle: "Data Monetization", concept: "Ние знаем първи кой къде се мести и каква е покупателната му способност.", financials: "Продажба на лийдове: 50-150 CHF (3× продаваемо)." },
      { title: "Lean Operations", subtitle: "Формулата 95/5", concept: "Приходите растат, headcount остава плосък. Експоненциална рентабилност.", financials: "3 служители за 10'000 премествания. Спестява ~2 млн. CHF/година." }
    ]
  },
  familySummary: {
    badge: "Обяснено за семейството",
    title: "Какво строя 🚀",
    subtitle: "Просто обяснение за мама, татко и всички, които искат да разберат",
    problemTitle: "Проблемът днес",
    problemSubtitle: "Преместването в Швейцария е чист стрес",
    solutionTitle: "Моето решение: Umzugscheck.ch",
    solutionSubtitle: "Най-интелигентната платформа за преместване в Швейцария",
    simpleExplanation: "Просто обяснено",
    simpleExplanationText: "Представи си: Заснемаш апартамента с телефона → AI разпознава всички мебели → Получаваш 5 честни цени → Един клик и всичко е организирано: преместваща фирма, почистване, пререгистрация, дори съвети за новия квартал! 🏠",
    tenBenefitsTitle: "10 предимства за семействата",
    tenBenefitsSubtitle: "Какво клиентите получават при нас – всичко от едно място",
    howWeEarnTitle: "Как печелим пари 💰",
    howWeEarnSubtitle: "Не само един източник на приходи – а десет различни!",
    perCustomer: "На клиент печелим:",
    averageRevenue: "средно",
    ourCosts: "Нашите разходи на клиент:",
    almostAutomated: "почти всичко автоматизирано",
    profitPerCustomer: "= Печалба на клиент",
    margin: ">90% марж!",
    whySpecial: "Защо е това специално?",
    whySpecialText: "Нормалните фирми имат 10-30% марж. Ние имаме над 90%, защото почти всичко се прави от Изкуствен Интелект. Нужни са ни само 3-5 служители за хиляди клиенти.",
    whyNotExists: "Защо това все още не съществува?",
    whatMakesUnique: "Какво ни отличава от всички други",
    problems: [
      "Не знаем коя фирма е сериозна",
      "Цените варират диво (1'000 – 5'000 CHF)",
      "Часове по телефона, без отговор",
      "Бюрокрация: община, ток, интернет...",
      "Страх от измама и скрити разходи",
      "След преместване: непознати в нов район"
    ],
    moats: [
      { title: "AI-Видео технология", desc: "Разработихме собствен AI, който разпознава мебели във видеа. Никой друг не може.", icon: "🧠" },
      { title: "Ескроу система (Fintech)", desc: "Контролираме паричния поток – като банка за премествания. Това създава доверие.", icon: "🏦" },
      { title: "Интерфейси с властите", desc: "Изградихме директни връзки с общини и доставчици. Изключително трудно за копиране.", icon: "🔌" },
      { title: "95% автоматизация", desc: "Докато други се нуждаят от 50 служители, ние го правим с 3 души + AI.", icon: "🤖" }
    ]
  },
  roadmap: {
    title: "Пътят към лидерство на пазара",
    subtitle: "Къде сме и какво предстои",
    completedLabel: "Завършено",
    inProgressLabel: "В процес",
    upcomingLabel: "Планирано",
    currentPhase: "Текуща фаза",
    overallProgress: "Общ напредък до Live-Launch",
    phases: [
      {
        phase: "Фаза 1: Основа",
        title: "Технология & MVP",
        description: "Основата за всичко, което идва",
        items: [
          "✅ Пълен Frontend с React/TypeScript",
          "✅ Supabase Backend & Бази данни",
          "✅ 10 различни калкулатора за преместване",
          "✅ Каталог на фирми с 30+ доставчици",
          "✅ Многостепенен офертен фунел",
          "✅ SEO-оптимизирани Landing Pages",
          "✅ Mobile-First дизайн",
          "✅ Admin Dashboard базова структура"
        ]
      },
      {
        phase: "Фаза 2: Intelligence",
        title: "Relocation Database & UX",
        description: "Основа от данни и оптимизация на конверсии",
        items: [
          "✅ Профили на квартали (26 града)",
          "✅ POIs & локална информация",
          "✅ Newcomer Kit UI компоненти",
          "✅ City Moving Checklists",
          "✅ Schema.org SEO маркиране",
          "✅ Сравнение на квартали",
          "✅ Post-Move чеклист (20+ задачи)",
          "✅ AI Cost Predictor Engine"
        ]
      },
      {
        phase: "Фаза 3: Scale",
        title: "Маркетинг & Растеж",
        description: "Привличане на трафик и монетизация",
        items: [
          "✅ WhatsApp-First Flow интеграция",
          "✅ Capacity Radar (реално време)",
          "✅ Provider Live-Chat Widget",
          "✅ Buddy Matching (споделяне на камион)",
          "🔄 SEO Hub-and-Spoke стратегия",
          "🔄 A/B Testing Framework",
          "⏳ Google Ads кампании",
          "⏳ Email Automation Flows"
        ]
      },
      {
        phase: "Фаза 4: Moat",
        title: "Конкурентни предимства",
        description: "Трудни за копиране функции",
        items: [
          "✅ AR Inventory Scanner (стая по стая)",
          "🔄 AI Video Inventory (Computer Vision)",
          "⏳ Escrow/Ескроу система",
          "⏳ Интеграция с API на властите",
          "⏳ Partner Operating System",
          "⏳ Micro-Insurance модул"
        ]
      }
    ],
    workDone: {
      title: "Какво е създадено за 3+ месеца",
      subtitle: "Денонощна работа – ето резултата",
      months: "3+ месеца интензивна работа",
      items: [
        "250+ React компонента разработени",
        "60+ страници и routes създадени",
        "25+ таблици в базата данни",
        "10 различни калкулатора",
        "26 града с данни за квартали",
        "30+ преместващи фирми в системата",
        "5-степенен lead фунел изграден",
        "10 Extended Features имплементирани",
        "AI Cost Predictor с CH данни",
        "WhatsApp-First интеграция",
        "Capacity Radar (живи данни)",
        "Buddy Matching за споделяне на камион",
        "AR Inventory Scanner",
        "Provider Live-Chat система",
        "Post-Move чеклист (7 категории)",
        "Сравнение на квартали (11 метрики)",
        "Vision Page за заинтересовани страни",
        "Dark Mode + Mobile-First дизайн"
      ]
    }
  },
  comparison: {
    title: "Класическо преместване vs. Umzugscheck.ch",
    classic: "Класически",
    us: "С нас",
    features: [
      { feature: "Инвентаризация", classic: "Посещение (2ч + 150 CHF)", us: "2 мин видео сканиране" },
      { feature: "Сравнение на цени", classic: "3 обаждания, 3 дни чакане", us: "5 оферти за 24ч" },
      { feature: "Сигурност на плащане", classic: "Авансово на фирма", us: "Ескроу сметка" },
      { feature: "Бюрокрация", classic: "Сами", us: "1-клик автопилот" },
      { feature: "Крайно почистване", classic: "Сами организираме", us: "С гаранция включено" },
      { feature: "Застраховка", classic: "Спорове при щети", us: "Видео доказателство = веднага пари" }
    ]
  },
  footer: {
    questions: "Въпроси? Просто ме попитай.",
    downloadPdf: "Изтегли PDF",
    toMainPage: "Към началната страница"
  },
  
  // NEW SECTIONS - Bulgarian
  revenueExamples: {
    badge: "10 източника на приходи в детайли",
    title: "Конкретни примери: Как печелим пари",
    subtitle: "Всеки източник на приходи обяснен с реален пример. От прост (веднага приложим) до сложен (нужен е развитие).",
    quickWins: "Бърза победа",
    standard: "Стандартен",
    complex: "Сложен",
    exampleScenario: "📌 Примерен сценарий",
    howItWorks: "🔄 Как работи",
    customerPays: "Клиентът плаща",
    weGet: "Ние получаваме",
    partnerGets: "Партньорът получава",
    whyValuable: "💡 Защо е ценно",
    streams: [
      { name: "Affiliate Телеком/Енергия", tagline: "Клиент сменя доставчик → Ние печелим", scenario: "Семейство Мюлер се мести и има нужда от интернет на новото място. Препоръчваме Swisscom.", steps: ["Клиент въвежда нов адрес", "Показваме подходящи оферти за интернет/ток", "Клиент кликва 'Смени сега'", "Доставчикът ни плаща 80-150 CHF комисионна"], whyValuable: "Приход без разходи: Печелим, без да доставяме нищо. Чисто посредничество." },
      { name: "Продажба на лийдове (CPL)", tagline: "Преместваща фирма плаща за квалифицирана заявка", scenario: "Г-н Шмидт търси преместваща фирма за 3-стаен апартамент. 3 фирми получават заявката му.", steps: ["Клиент попълва формуляр за оферти", "Свързваме с 3-5 подходящи фирми", "Всяка фирма плаща 15-45 CHF на лийд", "Фирмите контактуват клиента директно"], whyValuable: "Скалира перфектно: Повече трафик = линейно повече приходи. Не е нужно изпълнение." },
      { name: "Базова комисионна (Take-Rate)", tagline: "15% от всяко преместване през платформата", scenario: "Преместване Цюрих → Берн, 30м³. Преместващата фирма таксува 1'500 CHF.", steps: ["Клиент резервира преместване през платформата", "Преместващата фирма извършва преместването", "Клиент плаща на нас (ескроу)", "Задържаме 15% и плащаме 85% на фирмата"], whyValuable: "Наш основен приход: Повече премествания, повече печалба. Средно: 225 CHF/преместване." },
      { name: "Почистване с гаранция", tagline: "Гаранция за приемане = Premium цена", scenario: "4-стаен апартамент, 85м². Почистване с гаранция за приемане.", steps: ["Клиент резервира 'Гаранция-Почистване'", "Сертифицирана почистваща фирма чисти", "Ако хазяинът се оплаче: безплатна корекция", "Задържаме 20% за гаранционен риск"], whyValuable: "По-висок марж от стандарта заради гаранцията. Cross-sell към всяко преместване." },
      { name: "Бюрократичен автопилот", tagline: "Един клик = Всичко пререгистрирано", scenario: "Пълна пререгистрация: община, ток, интернет, застраховка, поща.", steps: ["Клиент въвежда стар + нов адрес", "Избира услуги: община, ток, поща и т.н.", "Плаща 49 CHF фиксирано", "Нашият бот прави всичко автоматично"], whyValuable: "98% марж защото е напълно автоматизирано. Спестява на клиентите 5-8 часа работа." },
      { name: "Ескроу / Такси за доверие", tagline: "Ние държим парите = Печелим от float", scenario: "Преместване за 2'000 CHF. Клиент плаща предварително на нас. Фирмата получава след завършване.", steps: ["Клиент резервира и плаща в ескроу сметка", "Парите са при нас 7-14 дни", "След успешно преместване: натиснете 'Потвърди'", "Фирмата получава, ние задържаме 1.5% такса"], whyValuable: "Двойна полза: Такса + лихви от float. При 1'000 премествания/месец = 1.5 млн. CHF float!" },
      { name: "Кръгова икономика", tagline: "Старите неща стават пари", scenario: "Клиент иска да се отърве от стар диван, шкаф и матрак.", steps: ["Клиент маркира във видеото какво да махнем", "Ние взимаме (80-200 CHF според количеството)", "Годното се продава в Ricardo/Tutti", "Задържаме такса за извозване + 20% от продажбата"], whyValuable: "Двоен приход: Платено извозване + препродажба. Намалява и разходите за преместване." },
      { name: "Микро-застраховка", tagline: "Видео доказателство = Незабавно плащане при щети", scenario: "Застраховка за домашни вещи на стойност 50'000 CHF.", steps: ["Клиент прави видео инвентар преди преместване", "Избира застрахователен пакет (Basic/Premium)", "При щета: AI сравнява преди/след видео", "Автоматично изплащане в рамките на 48ч"], whyValuable: "60% марж защото видео доказателствата минимизират щетите. Класическа застраховка: 20% марж." },
      { name: "Партньорски SaaS (MRR)", tagline: "Преместващи фирми плащат месечно за нашия софтуер", scenario: "Преместваща фирма 'Blitz-Umzüge' използва нашата диспечерска система.", steps: ["Фирма се регистрира за партньорски портал", "Използва управление на лийдове, планиране на капацитет, авто-bidding", "Плаща 99 CHF/месец абонамент", "Допълнително: 15% комисионна на посредничена поръчка"], whyValuable: "Recurring Revenue! 100 партньори × 99 CHF = 10k MRR. Плюс lock-in ефект." },
      { name: "B2B HR-Relocation", tagline: "Enterprise клиенти с високи кошници", scenario: "Credit Suisse релокира 5 експата от Лондон в Цюрих.", steps: ["HR отдел резервира релокационен пакет", "Ние организираме: преместване, жилище, училище, власти", "Месечен абонамент + комисионна на служител", "LTV на Enterprise клиент: >50'000 CHF"], whyValuable: "High-Value сегмент: Един фирмен клиент = 50 частни клиенти. Дълги договори." }
    ]
  },
  
  unitEconomics: {
    badge: "Unit Economics на клиент",
    title: "Как се събират 553 CHF на клиент",
    clarificationTitle: "Защо \"10 източника на приходи\" и \"6 потока на приходи\"?",
    clarificationText: "10 източника на приходи = Всички възможни Revenue Streams (вкл. B2B, Partner SaaS и т.н.). 6 потока на приходи = Какво използва и генерира типичен частен клиент. 553 CHF е средната стойност при частни клиенти. С B2B/Enterprise клиенти стойността расте значително.",
    revenuePerCustomer: "Приходи на клиент",
    revenueSubtitle: "6 потока на приходи при частни клиенти",
    totalRevenue: "Общо приходи",
    costsPerCustomer: "Разходи на клиент",
    costsSubtitle: "Почти всичко автоматизирано",
    totalCosts: "Общо разходи",
    profitPerCustomer: "Печалба на клиент",
    unitEconomicsLabel: "Unit Economics",
    margin: "Марж",
    whyPossibleTitle: "Защо е възможен 90%+ марж?",
    whyPossibleIntro: "Нормалните фирми имат 10-30% марж, защото имат нужда от много служители. Ние имаме > 90% защото:",
    whyPossibleReasons: [
      "95% AI-автоматизация – Почти няма ръчни процеси",
      "10 Revenue Streams – Печелим повече на клиент от само комисионна",
      "SEO-First – Ниски разходи за привличане чрез органичен трафик",
      "3-5 служители достигат за 10'000+ клиенти/година"
    ],
    classicProvider: "Класически посредник",
    us: "Ние",
    timesMore: "× повече"
  },
  
  marketPotential: {
    badge: "📊 Пазарен анализ Швейцария",
    title: "Пазарен потенциал & Стратегия за растеж",
    subtitle: "Базирано на данни от Пощата, проучвания на Comparis и insights от индустрията",
    totalMarket: "Общ пазар",
    movesPerYear: "Поръчки за преместване годишно в Швейцария",
    private: "Частни",
    business: "Бизнес",
    payingCustomers: "Платежоспособни клиенти",
    budgetReady: "Клиенти с бюджет и готовност",
    bookProService: "резервират професионална услуга",
    comparisNote: "Според проучване на Comparis ~⅓ използват професионална услуга за преместване",
    ourMarketShare: "Нашият реалистичен пазарен дял",
    basedOnSeo: "Базирано на SEO доминация + целеви маркетинг",
    conservative: "Консервативно (Година 1)",
    realistic: "Реалистично (Година 2-3)",
    ambitious: "Амбициозно (Година 4+)",
    ordersPerYear: "Поръчки/година",
    marketShare: "Пазарен дял",
    goal: "Цел",
    revenueCalculation: "Изчисление на приходи (5% пазарен дял)",
    orders: "Поръчки",
    revenuePerCustomer: "× Приходи/клиент",
    marginLabel: "Марж 90%",
    profit: "Печалба",
    acquisitionStrategy: "Стратегия за привличане на клиенти",
    keyInsights: "💡 Ключови insights",
    insights: [
      { title: "Фокус върху 165k", text: "Не достигаме всички 450k — таргетираме само ~165k+ с бюджет и готовност" },
      { title: "Бизнес = По-висока печалба", text: "Фирмените премествания са по-малко, но 100% готовност за услуга и по-висока стойност на поръчка" },
      { title: "5-сек ТВ = Awareness", text: "Кратки спотове (\"Има такава услуга!\") при избрани канали и часове" }
    ]
  },
  
  exitTimeline: {
    badge: "Exit-Стратегия & Оценка",
    title: "Каква е целта? 🎯",
    subtitle: "Кога може да се продаде фирмата и за колко? Базирано на сравними транзакции на пазара.",
    now: "Сега",
    comparableTitle: "Сравними транзакции",
    comparableSubtitle: "Какво са постигнали подобни фирми при Exit?",
    movuTitle: "MOVU → Baloise (2017): Най-релевантното сравнение",
    movuText: "MOVU беше придобита през 2017 от Baloise Group – най-голямата дигитална платформа за преместване в Швейцария към този момент. Цената не беше публикувана, но се оценява на 5-10 млн. CHF.",
    whyWeWorthMore: "Защо ние ще струваме повече:",
    movuReasons: [
      "10 Revenue Streams вместо само продажба на лийдове",
      "AI технология (видео, автоматизация) – MOVU нямаше това",
      "Fintech слой (Escrow) – по-висока stickiness",
      "90%+ марж vs. класически 20-30%"
    ],
    higherValuation: "→ При сравним размер: 3-5× по-висока оценка възможна чрез Tech + Moats",
    exitOptions: {
      strategic: { title: "Стратегическо придобиване", text: "Застраховка (Baloise, AXA) или имотен портал (Homegate, ImmoScout)" },
      pe: { title: "Private Equity", text: "Growth Buyout при 5-10 млн. ARR, после Scale-Up за IPO" },
      ipo: { title: "IPO (дългосрочно)", text: "При 100+ млн. приходи, европейско лидерство" }
    },
    milestones: [
      { phase: "Днес", description: "MVP готов, първа Traction" },
      { phase: "Seed-Ready", description: "1'000+ лийда/месец, Профитабилна" },
      { phase: "Series A", description: "Лидер в Швейцария, DACH-Експанзия" },
      { phase: "Growth", description: "DACH доминирана, 50k+ премествания/година" },
      { phase: "Exit / IPO", description: "Европейски лидер, IPO-Ready" }
    ],
    comparables: [
      { description: "Швейцарска платформа за преместване", relevance: "Директно сравнение – ние строим MOVU 2.0 с 10× повече функции" },
      { description: "Немски преместващ стартъп", relevance: "Предупреждение: Твърде бързо скалиране без Unit Economics. Ние = Първо профитабилни." },
      { description: "PropTech / Имотен брокер", relevance: "Подобен модел (Lead-Gen + Services) в имоти" }
    ]
  }
};

export const visionTranslations: Record<VisionLanguage, VisionTranslations> = {
  de,
  bg
};

export const getVisionTranslation = (lang: VisionLanguage): VisionTranslations => {
  return visionTranslations[lang] || visionTranslations.de;
};
