/**
 * Vision Page Translations - DE/BG
 * Complete translation support for the Vision page
 */

export type VisionLanguage = 'de' | 'bg';

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
          "🔄 City Moving Checklists",
          "🔄 Schema.org SEO Markup",
          "⏳ Lead Bidding System",
          "⏳ Dynamic Pricing Engine",
          "⏳ Provider Quality Scores"
        ]
      },
      {
        phase: "Phase 3: Scale",
        title: "Marketing & Growth",
        description: "Traffic-Akquisition und Monetarisierung",
        items: [
          "⏳ SEO Hub-and-Spoke Strategie",
          "⏳ Google Ads Kampagnen",
          "⏳ Content Marketing (Ratgeber)",
          "⏳ Affiliate Partnerprogramm",
          "⏳ Email Automation Flows",
          "⏳ A/B Testing Framework",
          "⏳ Analytics & Reporting"
        ]
      },
      {
        phase: "Phase 4: Moat",
        title: "Wettbewerbsvorteile",
        description: "Schwer kopierbare Features",
        items: [
          "⏳ AI Video Inventory Scanner",
          "⏳ Escrow/Treuhand System",
          "⏳ Behörden-API Integration",
          "⏳ Partner Operating System",
          "⏳ Micro-Insurance Module",
          "⏳ Circular Economy Hub"
        ]
      }
    ],
    workDone: {
      title: "Was in 3 Monaten entstanden ist",
      subtitle: "Tag und Nacht gearbeitet – hier ist das Ergebnis",
      months: "3 Monate intensive Arbeit",
      items: [
        "200+ React Komponenten entwickelt",
        "50+ Seiten und Routes erstellt",
        "20+ Datenbank-Tabellen designt",
        "10 verschiedene Rechner implementiert",
        "26 Städte mit Neighborhood-Daten",
        "30+ Umzugsfirmen im System",
        "5-stufiger Lead-Funnel gebaut",
        "Mobile-First responsive Design",
        "Dark Mode Support",
        "PDF Export Funktionalität",
        "Vision Page für Stakeholder",
        "Admin Dashboard Grundstruktur",
        "SEO-optimierte Meta Tags",
        "Schema.org Structured Data",
        "Edge Functions für Backend-Logik"
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
          "🔄 City Moving Checklists",
          "🔄 Schema.org SEO маркиране",
          "⏳ Lead Bidding система",
          "⏳ Dynamic Pricing Engine",
          "⏳ Provider Quality Scores"
        ]
      },
      {
        phase: "Фаза 3: Scale",
        title: "Маркетинг & Растеж",
        description: "Привличане на трафик и монетизация",
        items: [
          "⏳ SEO Hub-and-Spoke стратегия",
          "⏳ Google Ads кампании",
          "⏳ Content Marketing (Ratgeber)",
          "⏳ Affiliate партньорска програма",
          "⏳ Email Automation Flows",
          "⏳ A/B Testing Framework",
          "⏳ Analytics & Reporting"
        ]
      },
      {
        phase: "Фаза 4: Moat",
        title: "Конкурентни предимства",
        description: "Трудни за копиране функции",
        items: [
          "⏳ AI Video Inventory Scanner",
          "⏳ Escrow/Ескроу система",
          "⏳ Интеграция с API на властите",
          "⏳ Partner Operating System",
          "⏳ Micro-Insurance модул",
          "⏳ Circular Economy Hub"
        ]
      }
    ],
    workDone: {
      title: "Какво е създадено за 3 месеца",
      subtitle: "Денонощна работа – ето резултата",
      months: "3 месеца интензивна работа",
      items: [
        "200+ React компонента разработени",
        "50+ страници и routes създадени",
        "20+ таблици в базата данни дизайнирани",
        "10 различни калкулатора имплементирани",
        "26 града с данни за квартали",
        "30+ преместващи фирми в системата",
        "5-степенен lead фунел изграден",
        "Mobile-First responsive дизайн",
        "Поддръжка на Dark Mode",
        "PDF Export функционалност",
        "Vision Page за заинтересовани страни",
        "Admin Dashboard базова структура",
        "SEO-оптимизирани мета тагове",
        "Schema.org Structured Data",
        "Edge Functions за backend логика"
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
  }
};

export const visionTranslations: Record<VisionLanguage, VisionTranslations> = {
  de,
  bg
};

export const getVisionTranslation = (lang: VisionLanguage): VisionTranslations => {
  return visionTranslations[lang] || visionTranslations.de;
};
