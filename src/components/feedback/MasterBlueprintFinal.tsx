import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, CheckCircle2, XCircle, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Reveal = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
    {children}
  </motion.div>
);

const Collapsible = ({ title, children, defaultOpen = false, icon: Icon }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean; icon?: React.ComponentType<{ className?: string }>;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 p-3 text-left hover:bg-white/5 transition-colors min-h-[44px]">
        {Icon && <Icon className="w-4 h-4 text-white/40 shrink-0" />}
        {open ? <ChevronDown className="w-4 h-4 text-white/40 shrink-0" /> : <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />}
        <span className="text-sm font-semibold text-white/90">{title}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="p-3 pt-0 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SourceBadge = ({ source }: { source: string }) => {
  const styles: Record<string, string> = {
    'BLUEPRINT FINAL': 'bg-sky-500/10 text-sky-400',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded ${styles[source] || 'bg-gray-500/10 text-gray-400'}`}>
      [{source}]
    </span>
  );
};

// ─── Data ───

const ASSETS = [
  'Umzugscheck.ch Domain & Brand aufgebaut',
  'Feierabendservices.ch als operativer Execution-Arm',
  'Lovable-Plattform mit 20+ Funnels, Rechner, Firmenverzeichnis',
  'AI-Rechner (Foto-Upload, Video-Offerte) als differenzierendes Feature',
  'Grundlegendes Provider-Netzwerk (Partnerfirmen in Kontaktphase)',
  'Flow-Analyse-System mit Score-Tracking über alle Funnels',
];

const SYSTEME = [
  'Multi-Funnel-Architektur (Vergleich, Video, AI-Photo, Rechner)',
  'Firmenverzeichnis mit Profilen, Ratings, regionaler Abdeckung',
  'Lead-Routing-Logik (Matching nach Region, Service, Verfügbarkeit)',
  'Calculator-Engine für Umzug, Reinigung, Entsorgung, Lager',
  'A/B-Test-Framework und Flow-Analyse-Pipeline',
];

const ANNAHMEN = [
  { claim: 'CPL von CHF 20–40 ist erreichbar', status: 'Kein Traffic-Test durchgeführt' },
  { claim: 'Conversion Rate >3% im Hauptfunnel', status: 'Null echte User-Daten' },
  { claim: 'B2B-Provider zahlen CHF 20–50 pro Lead', status: 'Keine Verkaufsgespräche abgeschlossen' },
  { claim: 'Cherry-Picking durch Feierabend funktioniert profitabel', status: 'Kein einziger Auftrag ausgeführt' },
  { claim: '40–45% DB-Marge realistisch', status: 'Keine operative Kostenbasis validiert' },
  { claim: 'AI-Video-Offerte spart 80% der Besichtigungszeit', status: 'Kein Vergleichstest gemacht' },
];

const FEHLEND = [
  'Traffic-Quelle (SEO oder Paid) mit messbarem Volumen',
  'Mindestens 1 zahlender B2B-Partner mit signiertem Vertrag',
  'Unit-Economics-Nachweis: CAC, LTV, DB pro Lead',
  'Operative Execution: Min. 5 abgeschlossene Aufträge (Feierabend)',
  'Governance-Dokument für Hybrid-Modell (Interessenkonflikt-Regelung)',
  'GAV-/Arbeitsrecht-Gutachten für Feierabend-Modell',
  'Data Room mit sauber dokumentierten KPIs',
];

const TENSIONS = [
  { tension: 'Portal vs. Eigenausführung', side_a: 'Neutraler Marktplatz', side_b: 'Eigene Firma bevorzugt', impact: 'Vertrauensverlust bei Partnern, UWG-Risiko' },
  { tension: 'Premium vs. Preisvergleich', side_a: 'Qualitätspositionierung', side_b: 'Günstigste-Firma-Funnel', impact: 'Markenverwirrung, Race-to-Bottom' },
  { tension: 'Skalierung vs. Proof', side_a: '20+ Funnels, 26 Kantone', side_b: 'Null validierte Metriken', impact: 'Ressourcenverschwendung, Investoren-Skepsis' },
  { tension: 'Tech-Bewertung vs. Hybrid-Realität', side_a: 'SaaS-Multiplikator angestrebt', side_b: 'Physische Services inkludiert', impact: 'Bewertungsdiskrepanz, VC-Ablehnung' },
  { tension: 'Automation vs. Kontrolle', side_a: 'KI macht alles (OpenClaw)', side_b: 'Fehlende Guardrails', impact: 'Qualitätsrisiko, Haftungsfragen' },
  { tension: 'Breite vs. Tiefe', side_a: 'Alle Services anbieten', side_b: 'Kernkompetenz unklar', impact: 'Verwässerung der Value Proposition' },
];

const GAP_CATEGORIES = [
  { cat: 'A – Proof of Demand', gaps: ['Kein organischer Traffic nachgewiesen', 'Keine Paid-Kampagne getestet', 'Keine Suchvolumen-Validierung pro Funnel'] },
  { cat: 'B – KPI & Measurement', gaps: ['Kein Source-of-Truth-Funnel implementiert', 'Keine End-to-End Conversion-Messung', 'KPI-Dictionary nicht operativ'] },
  { cat: 'C – Market Validation', gaps: ['Kein TAM/SAM/SOM mit Primärdaten', 'Keine Competitor-Win/Loss-Analyse', 'Keine Preissensitivitäts-Studie'] },
  { cat: 'D – Unit Economics', gaps: ['CAC nicht gemessen', 'LTV reine Projektion', 'DB-Marge nicht operativ validiert'] },
  { cat: 'E – Operations', gaps: ['Kein Auftrag abgeschlossen (Feierabend)', 'Kein SLA-Framework für Provider', 'Keine Skalierungs-Playbooks'] },
  { cat: 'F – Strategy', gaps: ['Hybrid-Governance fehlt', 'Exit-Strategie nicht definiert', 'Wettbewerbsvorteil nicht quantifiziert'] },
  { cat: 'G – Positioning', gaps: ['Pitch-Narrative inkonsistent', 'Claims nicht belastbar', 'Zielgruppen-Priorisierung fehlt'] },
  { cat: 'H – Systems', gaps: ['CRM nicht konfiguriert', 'Billing-System nicht live', 'Provider-Onboarding nicht automatisiert'] },
  { cat: 'I – Documentation', gaps: ['Data Room leer', 'Cap Table nicht finalisiert', 'Shareholder Agreement fehlt'] },
];

const POSITIONING = [
  { area: 'Stage', vorher: 'Wir sind ein skalierbares Tech-Unternehmen', korrigiert: 'Wir sind ein validiertes Pre-Seed-Projekt in der Proof-Phase', warum: 'Ehrlichkeit = Vertrauen. Investoren erkennen Pre-Launch sofort.' },
  { area: 'Kapital', vorher: 'Wir brauchen CHF 250k–500k für Wachstum', korrigiert: 'Wir brauchen CHF 80k für 90 Tage Proof: CPL + Conversion + Unit Economics', warum: 'Kleinere, beweisbare Tranchen reduzieren Risiko für beide Seiten.' },
  { area: 'Portal', vorher: 'Wir sind die führende Schweizer Umzugsplattform', korrigiert: 'Wir bauen die effizienteste Lead-Maschine für Schweizer Umzugsfirmen', warum: '"Führend" ohne Marktanteil ist toxisch. "Effizienteste" ist beweisbar.' },
  { area: 'Economics', vorher: '40–45% DB-Marge bei CHF 3M Revenue', korrigiert: 'Ziel: CPL <CHF 35, DB >25% nach 50 Leads validiert', warum: 'Projizierte Margen ohne Daten sind Fiktion. Micro-Targets sind glaubwürdig.' },
  { area: 'KI', vorher: 'Unsere KI automatisiert 95% aller Prozesse', korrigiert: 'KI übernimmt Intake und Qualifizierung, Menschen entscheiden und liefern', warum: 'Human-in-the-Loop ist glaubwürdiger als Vollautomatisierungs-Fantasie.' },
];

const MasterBlueprintFinal = () => (
  <section id="master-blueprint-final" className="space-y-6">
    <Reveal>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h2 className="text-lg sm:text-xl font-black text-white">Block 30: Master Blueprint — Current State & Positioning</h2>
        <SourceBadge source="BLUEPRINT FINAL" />
      </div>
      <p className="text-xs sm:text-sm text-white/50 mb-4">
        Strukturierte Bestandsaufnahme: Was existiert, was funktioniert, was unbewiesen ist, und wie das Framing korrigiert werden muss.
      </p>
    </Reveal>

    {/* 30.1 Current State Assessment */}
    <Reveal>
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400 shrink-0" />
            30.1 Current State Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-3 sm:px-6">
          <Collapsible title="✅ Assets vorhanden" defaultOpen icon={CheckCircle2}>
            <ul className="space-y-1.5">
              {ASSETS.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-white/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </Collapsible>

          <Collapsible title="⚙️ Systeme funktionierend" icon={CheckCircle2}>
            <ul className="space-y-1.5">
              {SYSTEME.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-white/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Collapsible>

          <Collapsible title="⚠️ Unbewiesene Annahmen" defaultOpen icon={AlertTriangle}>
            <div className="space-y-2">
              {ANNAHMEN.map((a, i) => (
                <div key={i} className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-2.5 space-y-1">
                  <p className="text-xs sm:text-sm text-white/80 font-medium">{a.claim}</p>
                  <p className="text-[11px] sm:text-xs text-orange-400">⚠ {a.status}</p>
                </div>
              ))}
            </div>
          </Collapsible>

          <Collapsible title="❌ Fehlende Bausteine" icon={XCircle}>
            <ul className="space-y-1.5">
              {FEHLEND.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-white/70">
                  <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Collapsible>

          {/* Current State Verdict */}
          <div className="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 rounded-lg p-3 sm:p-4">
            <p className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">Current State Verdict</p>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Die Plattform verfügt über eine beeindruckende technische Infrastruktur und differenzierende Features (AI-Rechner, Video-Offerte). 
              Jedoch fehlt die <span className="text-sky-300 font-semibold">gesamte Beweiskette von Traffic → Lead → Conversion → Revenue</span>. 
              Ohne diesen Nachweis bleibt alles — egal wie technisch fortschrittlich — eine unbewiesene Hypothese.
            </p>
          </div>
        </CardContent>
      </Card>
    </Reveal>

    {/* 30.2 Strategische Spannungsfelder */}
    <Reveal>
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            30.2 Strategische Spannungsfelder
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="space-y-2">
            {TENSIONS.map((t, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-3 space-y-2">
                <p className="text-xs sm:text-sm font-bold text-white">{i + 1}. {t.tension}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-blue-500/5 border border-blue-500/15 rounded p-2">
                    <p className="text-[10px] text-blue-400 font-bold mb-0.5">SEITE A</p>
                    <p className="text-xs text-white/70">{t.side_a}</p>
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/15 rounded p-2">
                    <p className="text-[10px] text-orange-400 font-bold mb-0.5">SEITE B</p>
                    <p className="text-xs text-white/70">{t.side_b}</p>
                  </div>
                </div>
                <div className="bg-red-500/5 border border-red-500/15 rounded p-2">
                  <p className="text-[10px] text-red-400 font-bold mb-0.5">IMPACT</p>
                  <p className="text-xs text-white/70">{t.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Reveal>

    {/* 30.3 Konsolidierte Gap Map */}
    <Reveal>
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
            30.3 Konsolidierte Gap Map (9 Kategorien)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-3 sm:px-6">
          {GAP_CATEGORIES.map((cat, i) => (
            <Collapsible key={i} title={cat.cat}>
              <ul className="space-y-1.5">
                {cat.gaps.map((g, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs sm:text-sm text-white/70">
                    <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </Reveal>

    {/* 30.4 Proof-Stage Positioning Correction */}
    <Reveal>
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-emerald-400 shrink-0" />
            30.4 Proof-Stage Positioning Correction
          </CardTitle>
          <p className="text-xs text-white/40 mt-1">Vom riskanten Framing zum investorentauglichen Pitch</p>
        </CardHeader>
        <CardContent className="space-y-3 px-3 sm:px-6">
          {POSITIONING.map((p, i) => (
            <div key={i} className="border border-white/10 rounded-lg p-3 space-y-2">
              <p className="text-xs font-bold text-sky-400 uppercase">{p.area}</p>
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-red-500/5 border border-red-500/15 rounded p-2">
                  <p className="text-[10px] text-red-400 font-bold mb-0.5">BISHER (RISKANT)</p>
                  <p className="text-xs text-white/60 line-through">{p.vorher}</p>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded p-2">
                  <p className="text-[10px] text-emerald-400 font-bold mb-0.5">KORRIGIERT</p>
                  <p className="text-xs text-white/80 font-medium">{p.korrigiert}</p>
                </div>
              </div>
              <p className="text-[11px] text-white/50 italic">→ {p.warum}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </Reveal>

    {/* 30.5 Final Operating Note */}
    <Reveal>
      <div className="bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-violet-500/10 border border-sky-500/20 rounded-xl p-4 sm:p-6 space-y-4">
        <p className="text-xs font-bold text-sky-400 uppercase tracking-wider">30.5 Final Operating Note</p>
        <p className="text-sm sm:text-base text-white/90 font-bold leading-relaxed">
          3-Schienen-Direktive für die nächsten 90 Tage:
        </p>
        <div className="space-y-3">
          <div className="flex gap-3 items-start bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-3">
            <span className="text-emerald-400 font-black text-lg shrink-0">1</span>
            <div>
              <p className="text-xs font-bold text-emerald-400 mb-0.5">BEWEISEN</p>
              <p className="text-xs sm:text-sm text-white/70">Traffic-Test → CPL messen → Conversion validieren → Unit Economics berechnen. Alles andere ist sekundär.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start bg-amber-500/5 border border-amber-500/15 rounded-lg p-3">
            <span className="text-amber-400 font-black text-lg shrink-0">2</span>
            <div>
              <p className="text-xs font-bold text-amber-400 mb-0.5">BEREINIGEN</p>
              <p className="text-xs sm:text-sm text-white/70">Hybrid-Governance dokumentieren, Interessenkonflikt lösen, Claims auf belegbare Aussagen reduzieren.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start bg-sky-500/5 border border-sky-500/15 rounded-lg p-3">
            <span className="text-sky-400 font-black text-lg shrink-0">3</span>
            <div>
              <p className="text-xs font-bold text-sky-400 mb-0.5">VORBEREITEN</p>
              <p className="text-xs sm:text-sm text-white/70">Data Room aufbauen, Pitch Deck mit echten Zahlen, Investor-FAQ mit ehrlichen Antworten.</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-3 mt-3">
          <p className="text-xs text-white/50 text-center italic">
            «Nicht mehr Mythos bauen. Messmaschine bauen. Und die Messmaschine so aufsetzen, dass Menschen nur noch entscheiden, freigeben und Ausnahmen behandeln.»
          </p>
        </div>
      </div>
    </Reveal>
  </section>
);

export default MasterBlueprintFinal;
