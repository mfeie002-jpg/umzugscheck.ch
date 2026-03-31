import { 
  AlertTriangle, Shield, Zap, Target, FileText, Bot, Users, 
  CheckCircle2, XCircle, Clock, Crosshair, Layers, Eye, BookOpen,
  MessageSquare, Briefcase, TrendingDown, Scale
} from 'lucide-react';
import { 
  Reveal, StatusBadge, SeverityBar, Collapsible, 
  SectionHeader, SolutionCard, RiskCard 
} from './shared';

// ─── Section 8: Detailed Solution Blueprint (from PDFs) ───

const SOLUTION_BLOCKS = [
  {
    id: '8.1',
    title: 'Kern-Loop beweisen: Traffic → Lead → Auftrag → DB',
    problem: 'Der Business Case steht und fällt mit einem wirtschaftlich belastbaren Kern-Loop. Dieser ist aktuell NICHT BELEGT.',
    whyCritical: 'Ohne diesen Nachweis bleibt das Modell ein strategisch interessantes Konstrukt, aber kein investierbarer Case.',
    target: 'Ein wöchentlich aktualisierter Funnel mit source-attributed Leads, Endstatus, Auftragswert und Deckungsbeitrag.',
    steps: [
      'CRM oder zentrale Lead-Datenbank als Single Source of Truth definieren.',
      'Pflichtfelder erzwingen: Quelle, Landingpage, Serviceart, Leadstatus, Angebotsstatus, Auftrag ja/nein, Umsatz, DB.',
      'Search Console / Analytics mit CRM verknüpfen: Landingpage → Lead → Auftrag.',
      'Wöchentlichen KPI-Report aufsetzen: Volumen, Qualität, Conversion, Umsatz, DB.',
      'Abweichungen und Datenlücken täglich markieren.',
    ],
    ai: 'Reporting-Agent erstellt KPI-Digests, Anomalie-Checks und Vollständigkeitswarnungen.',
    openclaw: 'Cron-Reminder für fehlende Leadfelder, tägliche KPI-Messages an Entscheider.',
    human: 'Mensch definiert Pflichtfelder, validiert Datenqualität und entscheidet auf Basis der Reports.',
    proof: 'Funnel-Report, source-attributed Auftragsliste, Landingpage-Performance, belastbarer Pipeline-Verlauf.',
    risk: 'Schlechtes Tracking kann falsche Sicherheit erzeugen. Datenqualität muss aktiv geprüft werden.',
  },
  {
    id: '8.2',
    title: 'Economics entromantisieren: Vollkosten und reale DB je Auftrag',
    problem: 'Claims zu CAC und DB sind aktuell zu gross für die vorhandene Beleglage.',
    whyCritical: 'Investoren steigen oft nicht wegen schlechter Zahlen aus, sondern wegen unklarer oder schöngerechneter Zahlen.',
    target: 'Jeder reale Auftrag wird mit Vollkosten, Nachbearbeitung und finalem DB ausgewertet.',
    steps: [
      'Standard-Kalkulationsblatt pro Auftrag definieren.',
      'Direkte Kosten erfassen: Personal, Fahrzeuge, Material, Entsorgung, Fremdleistungen.',
      'Indirekte Kosten erfassen: Disposition, Offertierung, Nachbearbeitung, Fehlerkosten.',
      'Akquisitionskosten nicht "wegdefinieren", sondern als blended CAC rechnen.',
      'Vergleich bauen: interner Auftrag vs. Leadverkauf vs. Partner-Monetarisierung.',
    ],
    ai: 'LLM erzeugt Kalkulationsvorlagen, normalisiert Daten und baut Management-Auswertungen.',
    openclaw: 'Erinnerungen an fehlende Kostenfelder, tägliche offene Kalkulationen, Reporting-Agent für DB-Abweichungen.',
    human: 'Freigabe und Verantwortung für alle Finanzzahlen; echte Kosten müssen manuell bestätigt werden.',
    proof: 'Job-Level P&L, blended CAC, interner vs externer Monetarisierungsvergleich.',
    risk: 'Wenn Kosten zu grob erfasst werden, wird der DB künstlich schön gerechnet.',
  },
  {
    id: '8.3',
    title: 'Hybrid-Governance und Routing-Regeln verbindlich machen',
    problem: 'Der grösste strukturelle Konflikt liegt in der ungeklärten Beziehung zwischen Portal und Eigenausführung.',
    whyCritical: 'Ohne Governance kippt das Modell bei Partnern, Investoren und internem Fokus.',
    target: 'Eine schriftliche, intern verbindliche Routing-Logik mit klaren Regeln, wann ein Lead intern, extern oder hybrid behandelt wird.',
    steps: [
      'Lead-Typen definieren: Premium, Standard, Overflow, nicht-passend, sensibel.',
      'Routing-Regeln je Typ dokumentieren.',
      'Transparenzstandard für Partner festlegen.',
      'Governance-Review mit skeptischem Szenario testen.',
      'Entscheiden, ob "neutraler Vergleich" als Begriff überhaupt noch verwendet werden darf.',
    ],
    ai: 'Contradiction Checker identifiziert Regelkonflikte zwischen Claims, Routing und Partnerlogik.',
    openclaw: 'Interne Freigabe-Workflows, Agent der bei Leads ausserhalb Standardregeln menschliche Freigabe erzwingt.',
    human: 'Nur Menschen entscheiden Governance, Fairness und Risikotoleranz.',
    proof: '1-seitige Hybrid Policy, dokumentierte Partnerreaktionen, konsistente Pitch- und Operations-Sprache.',
    risk: 'Hier ist Vollautomatisierung falsch. Das ist ein Strukturthema, nicht nur ein kommunikatives Thema.',
  },
  {
    id: '8.4',
    title: 'Delivery vor Demand schützen',
    problem: 'Mehr Leads sind wertlos oder zerstörerisch, wenn Fulfillment instabil ist.',
    whyCritical: 'Die operative Seite ist das reale Risiko hinter jedem skalierenden Akquise-Kanal.',
    target: 'Kapazitätsgrenzen, Engpasssignale und Eskalationslogik sind dokumentiert und steuerbar.',
    steps: [
      'Kapazitätsmatrix aufbauen: Crew, Fahrzeuge, Slots, Serviceart, Region, Puffer.',
      'Ampellogik definieren: grün / gelb / rot je Auslastung.',
      'SOPs für Auftragstypen standardisieren.',
      'Angebote und Terminierung an verfügbare Kapazität koppeln.',
      'Quality Log mit Reklamationen, Nachbesserungen und Stornos pflegen.',
    ],
    ai: 'Ops-Readiness-Agent erstellt Vorbereitungschecklisten, Engpasswarnungen und Standard-SOP-Vorlagen.',
    openclaw: 'Cron-Warnungen bei Überlastung, Status-Nachrichten, Task- und Termin-Reminders.',
    human: 'Kapazitätszusagen, Sonderfälle, Schadensfälle und Krisenfälle müssen menschlich bleiben.',
    proof: 'Kapazitätsmatrix, Quality Log, weniger Nachbesserung, planbarere Termine.',
    risk: 'Falsche Automatisierung hier erzeugt falsche Zusagen und operative Schäden.',
  },
  {
    id: '8.5',
    title: 'Claims kontrollieren statt aufblasen',
    problem: 'Die aktuelle Kommunikation enthält mehrere Aussagen, die für Investorengespräche zu gross, zu früh oder zu unbelegt sind.',
    whyCritical: 'Unsaubere Claims bremsen Gespräche früher als mittelmässige Zahlen.',
    target: 'Ein Claim Register mit vier Stufen: sicher / vorsichtig / nicht offensiv / aktuell nicht verwenden.',
    steps: [
      'Alle Kernclaims aus Deck, Investorentexten und internen Narrativen extrahieren.',
      'Jeden Claim klassifizieren: belegt / plausibel / unbelegt / raus.',
      'Für jeden Claim eine zulässige Formulierung definieren.',
      'Pitch und Website gegen das Claim Register prüfen.',
      'Monatlichen Claim-Audit einführen.',
    ],
    ai: 'Claim Risk Checker extrahiert Aussagen, markiert Widersprüche und fehlende Belege.',
    openclaw: 'Geplanter wöchentlicher Claim-Audit-Reminder und Chat-Output an verantwortliche Person.',
    human: 'Finale Freigabe aller Investor- und Marktclaims.',
    proof: 'Konsistentes Wording, weniger Widersprüche, keine Kernbehauptung ohne Status.',
    risk: 'KI kann Claim-Risiko markieren, aber nicht finale Wahrheitsverantwortung tragen.',
  },
  {
    id: '8.6',
    title: 'Partnerakzeptanz real testen statt unterstellen',
    problem: 'Ob Partner das Hybridmodell akzeptieren, ist aktuell NICHT BELEGT.',
    whyCritical: 'Wenn Partner abspringen oder nicht zahlen, bricht die Plattformthese.',
    target: 'Dokumentierter Partnerpilot mit offenem Hybrid-Disclosure und klarer Zahlungslogik.',
    steps: [
      '3-5 Zielpartner identifizieren.',
      'Offen erklären, wie das Hybridmodell funktioniert.',
      'Einwandkatalog und Zahlungsbereitschaft erfassen.',
      'Pilotbedingungen testen: CPL, Response-Zeit, Leadqualität, Wiederbereitschaft.',
      'Entscheiden, ob die Plattformthese tragfähig ist oder reduziert werden muss.',
    ],
    ai: 'Sales/Follow-up-Agent organisiert Outreach, Protokolle, Einwand-Clustering und Nachfassen.',
    openclaw: 'Partnerkommunikation über Messaging, Reminder und Zusammenfassungen; nur mit Human Review.',
    human: 'Verhandlung, Beziehung, Interpretation heikler Rückmeldungen.',
    proof: 'Pilotpartner, Zahlungsbereitschaft, dokumentierte Einwände, Abbruchgründe.',
    risk: 'Wenn man Partnern nur eine geschönte Version zeigt, ist der Test wertlos.',
  },
  {
    id: '8.7',
    title: 'AI-/Video-Logik von Story zu Messsystem machen',
    problem: 'KI-Video und Automatisierung werden aktuell stärker erzählt als gemessen.',
    whyCritical: 'Ohne Accuracy- und ROI-Beweis bleibt die Tech-Story weich.',
    target: 'Klare Aussage, welche Schritte automatisiert sind, wie genau KI schätzt und was dadurch tatsächlich besser wird.',
    steps: [
      'Prozessinventur bauen: Intake, Qualifizierung, Preisvorbereitung, Follow-up, Reporting.',
      'Für jeden Schritt definieren: manuell / teilautomatisiert / vollautomatisiert.',
      'Accuracy-Test: KI-Schätzung vs. reale Besichtigung vs. Endrechnung.',
      'Zeitersparnis und Fehlerquote messen.',
      'Nur belegte Automatisierung im Pitch verwenden.',
    ],
    ai: 'Evaluation-Agent erstellt Accuracy-Reports und Prozesskarten.',
    openclaw: 'Automatisiert Intake-Fragen, fehlende Daten, Reminders und KPI-Meldungen.',
    human: 'Bodenwahrheit und endgültige Preis-/Scope-Entscheidung.',
    proof: 'Automation Inventory, Accuracy Report, gemessene Zeitersparnis.',
    risk: 'KI darf nicht autonom Scope oder Preis final bestätigen.',
  },
  {
    id: '8.8',
    title: 'Investor-Readiness Pack statt Story-Überhang',
    problem: 'Das Material ist aktuell analysierbar, aber noch nicht als kompaktes Proof-Pack organisiert.',
    whyCritical: 'Investoren brauchen schnelle Orientierung, bevor sie Tiefe akzeptieren.',
    target: 'Ein Paket aus 5 Kernunterlagen, das in 10 Minuten orientiert.',
    steps: [
      'KPI Sheet bauen.',
      'Funnel Sheet bauen.',
      'Economics Sheet bauen.',
      'Hybrid Policy bauen.',
      'Ops / Capacity Sheet bauen.',
      'Optional: Claim-Control Sheet für interne Nutzung.',
    ],
    ai: 'Investor Material Agent erstellt Standard-Layouts, aktualisiert Belege und markiert Inkonsistenzen.',
    openclaw: 'Reminder bei veralteten Belegen, DD-Vollständigkeitscheck per Chat.',
    human: 'Finaler Freigabe- und Konsistenzcheck.',
    proof: 'Ein investorfähiges Proof-Pack, nicht nur viele lose Dateien.',
    risk: 'Schöne Unterlagen ohne echte Daten lösen kein Kernproblem.',
  },
];

// ─── Section 16: Red Flags for Investor Meetings ───

const RED_FLAGS = [
  {
    question: 'Wie viele bezahlte Aufträge kamen nachweislich über Umzugscheck?',
    whyDangerous: 'Weil sonst der Hybrid-Beweis fehlt.',
    mustPrepare: 'Source-attributed CRM + Rechnungen.',
    dontSay: '"Portal bringt schon zuverlässig profitable Aufträge."',
  },
  {
    question: 'Warum bleiben Partner, wenn ihr die besten Jobs selbst nehmt?',
    whyDangerous: 'Weil hier der Strukturkonflikt sichtbar wird.',
    mustPrepare: 'Partnerpilot, Routing-Regeln, ehrliche Hybrid-Policy.',
    dontSay: '"Das wird schon kein Problem sein."',
  },
  {
    question: 'Wie rechnet ihr die 40-45% DB?',
    whyDangerous: 'Weil ungeprüfte Margen sofort Misstrauen erzeugen.',
    mustPrepare: 'Vollkostenblatt mit echten Jobs.',
    dontSay: '"Diese Marge ist realistisch, weil…"',
  },
  {
    question: 'Was bedeutet 92-95% automatisiert?',
    whyDangerous: 'Prozentbehauptungen ohne Definition wirken wie Buzzword-Schutzlack.',
    mustPrepare: 'Prozessinventur, Automation Inventory, ROI.',
    dontSay: '"Fast alles läuft automatisiert."',
  },
  {
    question: 'Ist das ein Portal, ein Marktplatz oder ein Servicebetrieb?',
    whyDangerous: 'Weil unklare Modellidentität Vertrauen und Bewertungslogik beschädigt.',
    mustPrepare: '1-seitige Modelllogik.',
    dontSay: '"Wir sind im Grunde alles gleichzeitig."',
  },
];

// ─── Section 15: Human vs AI Responsibility Model ───

const RESPONSIBILITY_MODEL = [
  { tier: 'Vollautomatisierbar', tasks: 'KPI-Digests, Reminder, offene Datenfelder, Dateiorganisation, Standard-Reporting, Erstkontakt-Datenaufnahme', color: 'bg-emerald-500/20 text-emerald-400' },
  { tier: 'KI + Human Review', tasks: 'Angebotsentwürfe, Partner-Outreach-Entwürfe, Investor-Material-Entwürfe, Content-/SEO-Briefings, Claim-Prüfung', color: 'bg-blue-500/20 text-blue-400' },
  { tier: 'Human Approval Required', tasks: 'Finale Preise, harte Claims, Partnerterms, Routing-Ausnahmen, Investor-Outreach, Publikationsfreigabe', color: 'bg-yellow-500/20 text-yellow-400' },
  { tier: 'Human Only', tasks: 'Governance, Fairness, Risikoübernahme, heikle Kundengespräche, Verhandlungen, Modellentscheidungen', color: 'bg-orange-500/20 text-orange-400' },
  { tier: 'Never Blindly Automate', tasks: 'Verbindliche Preisversprechen, sensible Fälle, DD-/Investor-Claims, Überlastungsentscheidungen, rechtlich heikle Aussagen', color: 'bg-red-500/20 text-red-400' },
];

// ─── Enhanced Claim Control (from PDF 2) ───

const CLAIM_CONTROL_ENHANCED = [
  { category: 'Sicher verwendbar', claim: 'Wir adressieren einen fragmentierten und vertrauenssensiblen Entscheidungsprozess.', proven: 'Problemstellung und Grundlogik', notProven: 'keine tragende Lücke', better: 'Unverändert nutzbar.' },
  { category: 'Sicher verwendbar', claim: 'Es gibt bereits echte Funnel- und Prozessarbeit, nicht nur Story.', proven: 'Vorhandene Flows / operative Struktur', notProven: 'Wirtschaftliche Wirkung NICHT BELEGT', better: 'Mit "Proof in Arbeit" ergänzen.' },
  { category: 'Vorsichtig', claim: 'Die Kombination aus Portal und Eigenausführung kann ein Vorteil sein.', proven: 'Plausible vertikale Integration', notProven: 'Ökonomischer Netto-Vorteil NICHT BELEGT', better: '"Wir validieren derzeit, ob…"' },
  { category: 'Vorsichtig', claim: 'Automatisierung verbessert Teile des Prozesses.', proven: 'Prozessansatz', notProven: 'ROI und Umfang NICHT BELEGT', better: '"Automatisierung unterstützt derzeit Intake, Follow-up und Reporting."' },
  { category: 'Nicht offensiv', claim: 'Skalierbares Modell für den Schweizer Markt.', proven: 'Scale-Potenzial als Hypothese', notProven: 'Nicht-lineare Skalierung NICHT BELEGT', better: '"Lokal validierbares Modell mit Scale-Potenzial."' },
  { category: 'Nicht offensiv', claim: '4 Brands als Verteidigungslinie.', proven: 'Markenliste vorhanden', notProven: 'Strategischer Nutzen NICHT BELEGT', better: '"Fokus aktuell auf Kernmarken."' },
  { category: 'Nicht offensiv', claim: '10 Revenue Streams.', proven: 'Denkbare Monetarisierungswege', notProven: 'Priorisierung / Traction NICHT BELEGT', better: '"Kurzfristig Fokus auf 1-2 Revenue Driver."' },
  { category: 'Nicht verwenden', claim: 'Zero CAC.', proven: 'Kein belastbarer Vollkosten-Nachweis', notProven: 'Blended CAC NICHT BELEGT', better: '"Strukturell günstigere organische Akquise als Ziel."' },
  { category: 'Nicht verwenden', claim: '40-45% DB-Marge.', proven: 'Zielgrösse im Pitch', notProven: 'Reale Vollkostenbasis NICHT BELEGT', better: '"Marge wird gegen reale Jobs validiert."' },
  { category: 'Nicht verwenden', claim: '92-95% automatisiert.', proven: 'Keine Prozessdefinition', notProven: 'Umfang / ROI NICHT BELEGT', better: '"Teile der Lead- und Admin-Strecke sind automatisiert."' },
  { category: 'Nicht verwenden', claim: 'Neutrales Vergleichsportal.', proven: 'Widerspricht Eigenausführung', notProven: 'Faire Governance NICHT BELEGT', better: '"Hybridmodell mit Eigenausführung; kein Neutralitätsclaim."' },
];

// ─── Contradiction Map Enhanced (from PDF 2) ───

const CONTRADICTIONS_ENHANCED = [
  { contra: 'Plattform-Neutralität vs Eigenausführung', why: 'Ein Vergleichsportal wirkt neutral; Cherry-Picking bevorzugt Eigeninteresse.', who: 'Partner, Investoren, intern', result: 'Vertrauensbruch, Partner-Rückzug, Governance-Risiko', fix: 'Entweder klare Firewalls oder ehrliche Positionierung als Hybrid-Eigenvertrieb mit Partner-Overflow.' },
  { contra: 'Premium Delivery vs Vergleichslogik', why: 'Vergleich zieht preisorientiertes Verhalten an; Premium braucht Qualitätslogik.', who: 'Kunden, Investoren', result: 'Falsche Kundenerwartung, geringere Premium-Conversion', fix: 'Premium-Leads separat qualifizieren und nicht direkt aus Vergleichssignalen ableiten.' },
  { contra: 'Skalierungsstory vs lokale Delivery-Realität', why: 'Software-Narrativ trifft auf personalintensive lokale Ausführung.', who: 'Investoren, intern', result: 'Falsche Scale-Erwartung, Operations-Überlastung', fix: 'Scale erst nach lokalem Kernbeweis erzählen.' },
  { contra: 'Tech-/KI-Story vs Servicekomplexität', why: 'KI kann Intake strukturieren, aber nicht jede lokale Ausnahme auflösen.', who: 'Kunden, intern, Investoren', result: 'Fehlangebote, Scope-Miss, Vertrauensverlust', fix: 'KI als Assistenz, nicht als autonomer Kernmoat positionieren.' },
  { contra: 'Multi-Brand vs Klarheit', why: 'Mehr Marken sollen Reichweite schaffen, verwässern aber Fokus und Ownership.', who: 'Kunden, Investoren, intern', result: 'Verwirrung, Scope Drift, höhere operative Reibung', fix: 'Auf zwei Kernmarken reduzieren.' },
  { contra: 'Leadgen vs Delivery', why: 'Mehr Nachfrage ist nur gut, wenn Delivery mithält.', who: 'Kunden, intern, Investoren', result: 'Schlechte Servicequalität, Stornos, negative Reviews', fix: 'Fulfillment-Kapazität vor Demand-Skalierung fixieren.' },
];

// ─── Appendix ───

const OPEN_QUESTIONS = [
  'Ist Umzugscheck strategisch primär Portal, Eigenvertrieb oder Hybrid-Overflow-Modell?',
  'Ist interne Ausführung real profitabler als reine Lead-Monetarisierung?',
  'Akzeptieren Partner das Modell, wenn es offen erklärt wird?',
  'Wie stark reduzieren Automatisierung und Video-Logik tatsächlich manuelle Arbeit oder Fehlangebote?',
  'Wo liegt die Delivery-Grenze, bevor Qualität oder Marge kippt?',
  'Welche Servicearten sind wirtschaftlich erste Priorität?',
  'Welche KPI-Schwellen definieren Runde 1 als Erfolg oder Misserfolg?',
  'Welche Angebots-/Accuracy-Grenzen sind akzeptabel?',
  'Welcher Investorentyp passt: strategischer Operator, Angel oder klassischer VC?',
];

const AGENT_SKILL_LIST = [
  'Lead Intake Agent', 'Missing Data Collector', 'Qualification Agent', 'Follow-up Agent',
  'Offer Prep Agent', 'KPI Audit Agent', 'Claim Risk Checker', 'Contradiction Checker',
  'Investor Material Agent', 'Proof Collection Agent', 'Ops Readiness Agent',
  'Data Room Curator', 'DD Readiness Checker', 'Partner Pilot Agent',
  'Accuracy Test Agent', 'Capacity Alert Agent', 'Quality Control Agent',
];

const GLOSSARY = [
  { term: 'BEWIESEN', def: 'Direkt aus Material oder belastbarer Systemrealität ableitbar.' },
  { term: 'PLAUSIBEL ABER UNBEWIESEN', def: 'Logisch, aber ohne harten Nachweis.' },
  { term: 'KRITISCHE LÜCKE', def: 'Fehlender Baustein für Investor-Readiness.' },
  { term: 'INVESTOREN-RISIKO', def: 'Punkt, der Gespräche abbremst oder kippt.' },
  { term: 'Human Approval Layer', def: 'Freigabeschicht für Preise, Claims, Governance und Ausnahmen.' },
];

// ─── Main Component ───

const ExternalBlueprintContent = () => {
  const categoryColor = (cat: string) => {
    if (cat === 'Sicher verwendbar') return 'text-emerald-400 bg-emerald-500/10';
    if (cat === 'Vorsichtig') return 'text-yellow-400 bg-yellow-500/10';
    if (cat === 'Nicht offensiv') return 'text-orange-400 bg-orange-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  return (
    <div className="space-y-8">

      {/* ═══ DETAILED SOLUTION BLUEPRINT ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Target} number="27.1" title="Solution Blueprint — Detaillierte Umsetzungsblöcke" />
          <p className="text-xs text-white/50">
            8 konkrete Lösungsblöcke aus den externen Blueprint-Dokumenten. Jeder Block: Problem → Zielzustand → Schritte → KI-Rolle → Mensch → Beweis.
          </p>
          <div className="space-y-3">
            {SOLUTION_BLOCKS.map((block) => (
              <Collapsible key={block.id} title={`${block.id} — ${block.title}`} icon={Crosshair}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                      <p className="text-[10px] uppercase text-red-400 font-bold mb-1">Problem</p>
                      <p className="text-xs text-white/70">{block.problem}</p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                      <p className="text-[10px] uppercase text-red-400 font-bold mb-1">Warum kritisch</p>
                      <p className="text-xs text-white/70">{block.whyCritical}</p>
                    </div>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                    <p className="text-[10px] uppercase text-emerald-400 font-bold mb-1">Zielzustand</p>
                    <p className="text-xs text-white/70">{block.target}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-[10px] uppercase text-white/40 font-bold mb-2">Umsetzungsschritte</p>
                    <ol className="space-y-1.5">
                      {block.steps.map((step, i) => (
                        <li key={i} className="flex gap-2 text-xs text-white/70">
                          <span className="text-cyan-400 font-bold shrink-0">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-2.5">
                      <p className="text-[10px] uppercase text-cyan-400 font-bold mb-1 flex items-center gap-1"><Bot className="w-3 h-3" /> KI-Rolle</p>
                      <p className="text-white/60">{block.ai}</p>
                    </div>
                    <div className="bg-violet-500/5 border border-violet-500/20 rounded-lg p-2.5">
                      <p className="text-[10px] uppercase text-violet-400 font-bold mb-1 flex items-center gap-1"><Zap className="w-3 h-3" /> OpenClaw</p>
                      <p className="text-white/60">{block.openclaw}</p>
                    </div>
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-2.5">
                      <p className="text-[10px] uppercase text-amber-400 font-bold mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Mensch</p>
                      <p className="text-white/60">{block.human}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2.5">
                      <p className="text-[10px] uppercase text-emerald-400 font-bold mb-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Gewünschte Beweise</p>
                      <p className="text-white/60">{block.proof}</p>
                    </div>
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-2.5">
                      <p className="text-[10px] uppercase text-orange-400 font-bold mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Verbleibende Risiken</p>
                      <p className="text-white/60">{block.risk}</p>
                    </div>
                  </div>
                </div>
              </Collapsible>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ ENHANCED CONTRADICTION MAP ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Scale} number="27.2" title="Contradiction Map — Mit Entschärfungsstrategien" />
          <p className="text-xs text-white/50">
            Zentrale Widersprüche im Modell mit konkreten Auflösungsvorschlägen.
          </p>
          <div className="space-y-3">
            {CONTRADICTIONS_ENHANCED.map((c, i) => (
              <div key={i} className="border-l-2 border-red-500/50 bg-white/[0.02] rounded-r-lg p-4 space-y-2">
                <h4 className="text-sm font-bold text-white">{c.contra}</h4>
                <p className="text-xs text-white/60">{c.why}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div><span className="text-white/40">Betroffen:</span> <span className="text-white/70">{c.who}</span></div>
                  <div><span className="text-white/40">Folge:</span> <span className="text-red-400/80">{c.result}</span></div>
                  <div><span className="text-white/40">Entschärfung:</span> <span className="text-emerald-400/80">{c.fix}</span></div>
                </div>
              </div>
            ))}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-xs text-white/60 italic">
                <strong className="text-white/80">Wichtiger Grundsatz:</strong> Nicht jeder Widerspruch ist ein Todesurteil. Aber jeder Widerspruch, der unbewusst bleibt, wird in Investorengesprächen und im operativen Alltag zum Problem. Die Aufgabe ist nicht, Widersprüche wegzudiskutieren, sondern sie in Regeln, Routing und Messung zu übersetzen.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ ENHANCED CLAIM CONTROL ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Eye} number="27.3" title="Claim & Pitch Control — Mit besseren Formulierungen" />
          <p className="text-xs text-white/50">
            Investoren verzeihen mittelmässige Zahlen eher als schlechte Claim-Disziplin.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-2 text-white/40 font-medium">Kategorie</th>
                  <th className="text-left py-2 px-2 text-white/40 font-medium">Claim</th>
                  <th className="text-left py-2 px-2 text-white/40 font-medium">Was belegt</th>
                  <th className="text-left py-2 px-2 text-white/40 font-medium">Was NICHT BELEGT</th>
                  <th className="text-left py-2 px-2 text-white/40 font-medium">Bessere Formulierung</th>
                </tr>
              </thead>
              <tbody>
                {CLAIM_CONTROL_ENHANCED.map((c, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-2 px-2">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${categoryColor(c.category)}`}>
                        {c.category}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-white/70 max-w-[200px]">{c.claim}</td>
                    <td className="py-2 px-2 text-white/50">{c.proven}</td>
                    <td className="py-2 px-2 text-red-400/70">{c.notProven}</td>
                    <td className="py-2 px-2 text-emerald-400/70 italic">{c.better}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Reveal>

      {/* ═══ HUMAN VS AI RESPONSIBILITY MODEL ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Users} number="27.4" title="Human vs AI Responsibility Model" />
          <p className="text-xs text-white/50">
            Der Mensch bleibt dort, wo Risikoübernahme, Beziehung und finale Verantwortung liegen.
          </p>
          <div className="space-y-2">
            {RESPONSIBILITY_MODEL.map((r, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/[0.02] border border-white/10 rounded-lg p-3">
                <span className={`shrink-0 px-2 py-1 rounded text-[10px] font-bold ${r.color}`}>
                  {r.tier}
                </span>
                <p className="text-xs text-white/60">{r.tasks}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-sm font-bold text-white mb-2">Human Minimum Model</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-cyan-400 font-bold mb-1">AI / Agent System</p>
                <ul className="space-y-1 text-white/60">
                  <li>• sammelt Daten</li>
                  <li>• fasst nach</li>
                  <li>• bereitet Angebote & Dokumente vor</li>
                  <li>• warnt bei Abweichungen</li>
                  <li>• hält Routine und Reporting stabil</li>
                </ul>
              </div>
              <div>
                <p className="text-amber-400 font-bold mb-1">Mensch</p>
                <ul className="space-y-1 text-white/60">
                  <li>• priorisiert</li>
                  <li>• gibt frei</li>
                  <li>• behandelt Ausnahmen</li>
                  <li>• führt Beziehungen</li>
                  <li>• trägt Risiko und Verantwortung</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ RED FLAGS FOR INVESTOR MEETINGS ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={AlertTriangle} number="27.5" title="Red Flags for Investor Meetings" />
          <p className="text-xs text-white/50">
            Das sind die Stellen, an denen Gespräche kippen können, wenn die Antworten weich bleiben.
          </p>
          <div className="space-y-3">
            {RED_FLAGS.map((rf, i) => (
              <div key={i} className="bg-red-500/[0.03] border border-red-500/20 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-white">"{rf.question}"</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-red-500/10 rounded p-2">
                    <p className="text-[10px] uppercase text-red-400 font-bold mb-1">Warum gefährlich</p>
                    <p className="text-white/60">{rf.whyDangerous}</p>
                  </div>
                  <div className="bg-emerald-500/10 rounded p-2">
                    <p className="text-[10px] uppercase text-emerald-400 font-bold mb-1">Was vorbereitet sein muss</p>
                    <p className="text-white/60">{rf.mustPrepare}</p>
                  </div>
                  <div className="bg-orange-500/10 rounded p-2">
                    <p className="text-[10px] uppercase text-orange-400 font-bold mb-1">Was man NICHT sagen sollte</p>
                    <p className="text-white/60 italic">{rf.dontSay}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ INVESTOR READINESS CHECKLIST (Enhanced) ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={CheckCircle2} number="27.6" title="Investor Readiness Checklist — Enhanced" />
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-2 text-white/40 font-medium">Phase</th>
                  <th className="text-left py-2 px-2 text-white/40 font-medium">Was vorhanden sein muss</th>
                  <th className="text-left py-2 px-2 text-white/40 font-medium">Warum</th>
                  <th className="text-left py-2 px-2 text-white/40 font-medium">Wer / was liefert es</th>
                </tr>
              </thead>
              <tbody className="text-white/60">
                <tr className="border-b border-white/5">
                  <td className="py-2 px-2 font-bold text-white/80">Vor erstem Gespräch</td>
                  <td className="py-2 px-2">KPI Sheet, Funnel Sheet, Job Economics, Hybrid Policy, Claim Register</td>
                  <td className="py-2 px-2">Ohne diese fünf Elemente ist der Case zu weich</td>
                  <td className="py-2 px-2">CRM + Reporting Layer + Human Approval</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 px-2 font-bold text-white/80">Vor Due Diligence</td>
                  <td className="py-2 px-2">Partnerstatus, Quality Log, Accuracy-Test, Cashflow/Proof Gates, Dokumente</td>
                  <td className="py-2 px-2">DD bleibt an Struktur und Beweislücken hängen</td>
                  <td className="py-2 px-2">Ops / Finance / Reporting / Legal</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 px-2 font-bold text-white/80">Vor Datenraum</td>
                  <td className="py-2 px-2">Nachvollziehbare Historie, Beispielaufträge, Routing-Regeln, Claim-Kontrolle</td>
                  <td className="py-2 px-2">Tiefe Gespräche brauchen Konsistenz</td>
                  <td className="py-2 px-2">Investor Material Agent + Human Review</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 px-2 font-bold text-white/80">Vor Skalierung</td>
                  <td className="py-2 px-2">Capacity Guardrails, Eskalationslogik, Pricing Rules, Monitoring</td>
                  <td className="py-2 px-2">Demand ohne Control = operative Schäden</td>
                  <td className="py-2 px-2">Ops Readiness System + Human Approval</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 px-2 font-bold text-white/80">Vor Storytelling</td>
                  <td className="py-2 px-2">Jeder harte Claim hat Status, Quelle und bessere Formulierung</td>
                  <td className="py-2 px-2">Sonst entsteht Vertrauensschaden</td>
                  <td className="py-2 px-2">Claim Risk Checker + Final Human Sign-off</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </Reveal>

      {/* ═══ 30/60/90 DAY ROADMAP (Enhanced from PDFs) ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Clock} number="27.7" title="30 / 60 / 90 Day Roadmap — Konsolidiert" />
          <p className="text-xs text-white/50">Nicht alles gleichzeitig. Erst Proof, dann Stabilität, dann Investor-Readiness.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-2 text-white/40 font-medium">Phase</th>
                  <th className="text-left py-2 px-2 text-white/40 font-medium">Ziel</th>
                  <th className="text-left py-2 px-2 text-white/40 font-medium">Wichtigste Deliverables</th>
                  <th className="text-left py-2 px-2 text-white/40 font-medium">Bewusst NICHT priorisieren</th>
                </tr>
              </thead>
              <tbody className="text-white/60">
                <tr className="border-b border-white/5">
                  <td className="py-2 px-2 font-bold text-cyan-400">0–7 Tage</td>
                  <td className="py-2 px-2">Claim Freeze, Funnel-Tracking, Modellreduktion</td>
                  <td className="py-2 px-2">Source-of-Truth, Claim Register, Hybrid-Policy Draft, Analytics-Dashboard</td>
                  <td className="py-2 px-2 text-white/40">Keine neuen Marken, keine Zukunftsarchitektur</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 px-2 font-bold text-cyan-400">30 Tage</td>
                  <td className="py-2 px-2">Kernbeweise erzeugen</td>
                  <td className="py-2 px-2">Portal→Auftrag-Belege, Job-Level DB, Partnerpilot, Accuracy-Test, Ops-Matrix</td>
                  <td className="py-2 px-2 text-white/40">Keine nationale Scale-Story, kein SaaS-Narrativ</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 px-2 font-bold text-cyan-400">60 Tage</td>
                  <td className="py-2 px-2">Investor-Readiness herstellen</td>
                  <td className="py-2 px-2">Proof-Pack, Pitch Redline, DD-Struktur, Quality Log, Governance final</td>
                  <td className="py-2 px-2 text-white/40">Keine unbewiesenen Kernclaims mehr</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 px-2 font-bold text-amber-400">Vor Investoren</td>
                  <td className="py-2 px-2">Proof first, Story second</td>
                  <td className="py-2 px-2">Economics Sheet, Hybrid Policy, Ops Sheet</td>
                  <td className="py-2 px-2 text-white/40">Keine Diskussion über 0 CAC / 40-45% DB / 92-95% Automation</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 px-2 font-bold text-amber-400">Vor Skalierung</td>
                  <td className="py-2 px-2">System, Ops und Guardrails stabilisieren</td>
                  <td className="py-2 px-2">Freigabelogik, Exception Handling, Monitoring, Partner-/Ops-Grenzen</td>
                  <td className="py-2 px-2 text-white/40">Keine aggressive Demand-Skalierung ohne Delivery-Puffer</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-xs text-white/60 italic">
              <strong className="text-white/80">Roadmap-Grundsatz:</strong> Jede Phase muss den Hybrid-Beweis härter machen. Neue Visionselemente ohne zusätzlichen Proof sind taktisch falsch.
            </p>
          </div>
        </section>
      </Reveal>

      {/* ═══ APPENDIX ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={BookOpen} number="27.8" title="Appendix — Quellen, Glossar & offene Fragen" />
          
          <Collapsible title="Begriffslogik / Glossar" icon={BookOpen}>
            <div className="space-y-2">
              {GLOSSARY.map((g, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <StatusBadge status={g.term} />
                  <span className="text-white/60">{g.def}</span>
                </div>
              ))}
            </div>
          </Collapsible>

          <Collapsible title="Offene Kernfragen" icon={AlertTriangle}>
            <ol className="space-y-1.5">
              {OPEN_QUESTIONS.map((q, i) => (
                <li key={i} className="flex gap-2 text-xs text-white/60">
                  <span className="text-orange-400 font-bold shrink-0">{i + 1}.</span>
                  {q}
                </li>
              ))}
            </ol>
          </Collapsible>

          <Collapsible title="Empfohlene Agenten / Skills" icon={Bot}>
            <div className="flex flex-wrap gap-1.5">
              {AGENT_SKILL_LIST.map((a, i) => (
                <span key={i} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] rounded font-medium">
                  {a}
                </span>
              ))}
            </div>
          </Collapsible>

          <Collapsible title="Arbeitsgrundlagen / Quellen" icon={FileText}>
            <ul className="space-y-1 text-xs text-white/60">
              <li>• Pitch Deck v3 / Ecosystem Business Case</li>
              <li>• Kritische Analyse PDF (9 Seiten, Investor Due Diligence Perspektive)</li>
              <li>• Deep Dive Due Diligence II (PDF)</li>
              <li>• Investor-/Vision-bezogene Screens und interne Analysen</li>
              <li>• Dokumentierte Funnel-/Flow-Bestände</li>
              <li>• OpenClaw-Dokumentation: Gateway, Multi-Agent Routing, Cron, Security (Stand 31.03.2026)</li>
              <li>• Gemini Investor Readiness Blueprint (v1.0)</li>
              <li>• Lovable-Analyse Prompt 1–4 + Meta-Feedback</li>
            </ul>
          </Collapsible>
        </section>
      </Reveal>

    </div>
  );
};

export default ExternalBlueprintContent;
