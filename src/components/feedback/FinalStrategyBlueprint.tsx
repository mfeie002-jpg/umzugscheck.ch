import { useState } from 'react';
import { 
  Target, AlertTriangle, CheckCircle2, Zap, Shield, Clock,
  ChevronDown, ChevronRight, Bot, Users, Cpu, FileText,
  TrendingUp, BarChart3, Scale, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// ─── Local Collapsible ───
const Collapsible = ({ title, children, defaultOpen = false, icon: Icon }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean; icon?: React.ComponentType<{ className?: string }>;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 sm:px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors text-left">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon className="w-4 h-4 text-teal-400 shrink-0" />}
          <span className="font-semibold text-sm text-white truncate">{title}</span>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-white/50 shrink-0" /> : <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="p-3 sm:p-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusDot = ({ color }: { color: 'red' | 'yellow' | 'green' | 'orange' }) => {
  const c = { red: 'bg-red-500', yellow: 'bg-yellow-500', green: 'bg-emerald-500', orange: 'bg-orange-500' };
  return <span className={`inline-block w-2 h-2 rounded-full ${c[color]} shrink-0 mt-1.5`} />;
};

const ERKENNTNISSE = [
  'Da das Projekt pre-launch ist, sind alle Traffic-, CPL- und Conversion-Metriken aktuell reine Theorie und NICHT BELEGT.',
  'Das Hybrid-Modell (Lead-Plattform + Cherry-Picking durch Eigenausführung Feierabendservices) zerstört den Marktplatz-Netzwerkeffekt strukturell.',
  'Eine "SaaS-Tech-Bewertung" (High Multiple) ist unmöglich, wenn operative Logistik-CapEx (LKW, Handwerker) das Budget belasten.',
  'Der Schweizer CPC für Umzüge bei Google Ads ist mit bis zu 8 CHF extrem hoch. Ein rentabler Lead-Verkauf erfordert perfekte Conversion-Rates.',
  'B2B-Partner im Schweizer Handwerk zahlen traditionell ungerne Prepaid; dies ist ein extremes Liquiditätsrisiko und NICHT BELEGT.',
  'WhatsApp-Automatisierung für B2C-Leads birgt ohne lokales, wasserdichtes Consent-Management massive revDSG-Risiken.',
  'UWG Art. 3 (Täuschung) verbietet es, als neutrales Portal aufzutreten, aber den eigenen Betrieb im Algorithmus zu bevorzugen.',
  'KI skaliert die Lead-Erfassung exponentiell, aber nicht das physische Möbeltragen. Die "95% KI"-Story muss auf das Backend limitiert werden.',
  'KI-basierte Volumenschätzung via Smartphone-Video (z.B. CubicCalC oder Yembo) ist der eigentliche, skalierbare operative Moat.',
  'OpenClaw ermöglicht als lokale Orchestrierungsschicht die Automatisierung von 80% des administrativen Backends.',
];

const RISIKEN = [
  'UWG-Klage durch getäuschte B2B-Partner (Cherry-Picking).',
  'revDSG-Bussen durch Metadaten-Abfluss an Meta (WhatsApp).',
  'B2B-Churn-Rate explodiert wegen schlechter Lead-Qualität.',
  'Google Ads CPL übersteigt den kumulierten Lead-Verkaufswert.',
  '80.000 CHF Budget verbrennen in Logistik-Overhead statt in Software-Skalierung.',
  'KI-Volumenschätzung halluziniert, was zu ruinösen Festpreisen führt.',
  'Kunden brechen den High-Ticket-Sales-Funnel im Chatbot ab.',
  'Reputationsverlust der Plattform durch Schäden bei der Eigenausführung.',
  'VCs lehnen ab, weil Cap-Table und operative Entitäten nicht getrennt sind.',
  'Gründer-Burnout durch Code + Umzugsteams gleichzeitig.',
];

const LUECKEN = [
  'Harte Google Ads CPL-Testdaten aus der Schweiz.',
  'B2B-Partner LOIs für Prepaid-Leads.',
  'AGB mit UWG- und DSG-Sicherheitsnetz.',
  'Getrennte P&L-Modelle für SaaS und Operations.',
  'Beweis der KI-Video-Scan-Genauigkeit (Accuracy-Test).',
  'Klarer revDSG-Consent-Flow vor dem Intake.',
  'Automatisierte, Stripe-basierte Lead-Routing-Logik.',
  'Pre-Launch-Warteliste / Pilot-Kunden.',
  'Adress-Validierung zur Vermeidung von Fake-Leads.',
  'Klares "Pure SaaS"-Narrativ für Investoren.',
];

const MASSNAHMEN = [
  { action: 'Pivot: 100% Fokus auf SaaS-Leadgen', detail: 'Feierabendservices wird als Operations-Sparte aus dem Pitch gestrichen.' },
  { action: 'Micro-Test: 500 CHF Google Ads', detail: 'Search Test zur CPL-Ermittlung.' },
  { action: 'B2B-Validierung: 20 Partner Kaltakquise', detail: 'Validierung des Prepaid-Modells.' },
  { action: 'OpenClaw-Setup', detail: 'Installation als lokales KI-Betriebssystem für Backoffice-Tasks.' },
  { action: 'API-Integration Post', detail: 'Einbau der Adress-Validierung.' },
  { action: 'Legal Check', detail: 'Erstberatung beim IT-Anwalt (UWG/revDSG).' },
  { action: 'P&L-Trennung', detail: 'Erstellung reiner Software-Economics.' },
  { action: 'Video-KI Integration', detail: 'Setup von CubicCalC o.ä. für Volumenschätzung.' },
  { action: 'Pitchdeck-Bereinigung', detail: 'Entfernung aller "Hybrid/Cherry-Picking"-Claims.' },
  { action: 'B2B-Wallet Bau', detail: 'Stripe API für automatisiertes Inkasso einrichten.' },
];

const P1_TODOS = [
  { task: 'Strategie-Pivot vollziehen', detail: 'Feierabendservices aus dem Investor-Pitch entfernen. Fokus auf 100% neutrale SaaS-Lead-Engine.', result: 'Neues Pitchdeck V2' },
  { task: 'Google Ads CPL Micro-Test', detail: '500 CHF Testbudget auf Landingpage in Zürich/Aargau schalten.', result: 'Harter CPL-Wert in CHF' },
  { task: 'B2B Cold-Call Validierung', detail: '20 Kaltakquise-Calls bei Umzugsfirmen für das Prepaid-Lead-Modell.', result: '3 LOIs' },
  { task: 'P&L-Modellierung SaaS', detail: 'Finanzplan exklusiv für Software, Marketing und Legal bauen.', result: '80k CHF Runway-Calc' },
  { task: 'Pitchdeck Claim-Audit', detail: 'Alle "Wir picken die besten Leads"-Aussagen löschen.', result: 'Cleanes Deck' },
];

const P2_TODOS = [
  { task: 'Legal Stress-Test', detail: 'Anwaltliche Kurzprüfung (revDSG für WhatsApp & UWG für Routing).', result: 'Legal Memo' },
  { task: 'OpenClaw Backend Setup', detail: 'Lokale Installation für Cron-Jobs und Routing.', result: 'Laufende HEARTBEAT.md' },
  { task: 'Video-KI Evaluation', detail: 'CubicCalC oder Yembo API testen.', result: 'Accuracy Report (< 5%)' },
  { task: 'Swiss Post API Integration', detail: 'Adress-Autocomplete im Formular einbauen.', result: '100% valide Adressen' },
];

const AI_DELEGATION = [
  { cat: 'A', label: 'Voll durch KI machbar', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', items: [
    'Adressvalidierung: Swiss Post API',
    'Volumenschätzung (m³): CubicCalC / Yembo API',
    'Lead Routing & Inkasso: OpenClaw + Stripe API',
    'KPI-Reporting: OpenClaw HEARTBEAT.md',
  ]},
  { cat: 'B', label: 'Grösstenteils KI (mit Kontrolle)', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400', items: [
    'SEO Content Erstellung: OpenClaw SEO Agent → Mensch klickt "Publish"',
    'Follow-ups für fehlende Daten: OpenClaw Reminder Agent',
  ]},
  { cat: 'C', label: 'KI bereitet vor, Mensch prüft', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', items: [
    'P&L / Financial Modeling: LLM strukturiert, Mensch verifiziert',
    'Legal Docs: LLM entwirft AGB-Grundgerüst, IT-Anwalt prüft',
  ]},
  { cat: 'D/E', label: 'Muss menschlich bleiben', color: 'bg-red-500/10 border-red-500/20 text-red-400', items: [
    'Strategischer Pivot: Entscheidung Feierabendservices isolieren',
    'B2B-Kaltakquise: Vertrauensaufbau bei Schweizer Handwerkern',
    'Investoren-Pitches: Verhandlung und Due Diligence Q&A',
    'Budget-Freigaben: Erhöhung Google Ads Budgets',
  ]},
];

const GUARDRAILS = [
  { system: 'KI Video-Schätzung', risk: 'KI unterschätzt Volumen; LKW zu klein', guard: 'Disclaimer + Flag bei > 40m³', human: 'Nur bei Flag' },
  { system: 'OpenClaw Routing', risk: 'Falscher Lead an falschen Partner', guard: 'Keine autonomen Stripe-Refunds', human: 'Bei B2B-Reklamation' },
  { system: 'SEO Content Agent', risk: 'Halluzinierte Garantien auf Landingpages', guard: 'Nur CMS-Draft-Modus', human: 'Zwingend (Publish)' },
  { system: 'WhatsApp Intake', risk: 'revDSG-Verstoss durch Meta-Metadaten', guard: 'Web-Formular-Opt-In vor WhatsApp', human: 'Anwalts-Freigabe' },
];

const PHASES = [
  { phase: '1', title: 'Pivot & Setup', time: 'Sofort / 7 Tage', color: 'border-red-500/30',
    todos: 'Hybrid-Modell im Pitchdeck killen. Lovable-Landingpage mit Analytics live schalten.',
    proof: 'Keiner. Reine Vorbereitung.',
    systems: 'Basis-Setup OpenClaw lokal.',
    risk: 'UWG/Cherry-Picking-Widerspruch intern beenden.' },
  { phase: '2', title: 'Data & Proof', time: '30 Tage', color: 'border-orange-500/30',
    todos: '500 CHF Google Ads Test. Kaltakquise 20 B2B-Firmen.',
    proof: 'Echter CPL-Wert. 3 LOIs.',
    systems: 'OpenClaw zieht tägliche Ad-Kosten.',
    risk: 'B2B Onboarding bewusst manuell.' },
  { phase: '3', title: 'Systematische Skalierung', time: '60 Tage', color: 'border-yellow-500/30',
    todos: 'Video-KI (CubicCalC) + Stripe-Routing. Legal Check abschliessen.',
    proof: 'Erster vollautomatisierter Lead-Verkauf (Zero-Touch).',
    systems: 'Voll funktionsfähiger OpenClaw Routing Agent.',
    risk: 'KI-Schätzungsfehler überwachen.' },
  { phase: '4', title: 'Due Diligence Prep', time: 'Vor Investoren', color: 'border-emerald-500/30',
    todos: 'P&L-Modelle bereinigen. Data Room strukturieren.',
    proof: 'Unit Economics bewiesen. B2B-LOIs belegt.',
    systems: 'Alles dokumentiert.',
    risk: 'Pitch-Training.' },
];

const TOMORROW_STEPS = [
  'Pitchdeck öffnen und Feierabendservices als operatives Business restlos entfernen.',
  'Lovable-Landingpage mit Analytics-Tracking live schalten.',
  '500 CHF auf Google Ads laden und Search-Kampagne (Zürich/Aargau) starten.',
  'OpenClaw lokal installieren und erste Workspace-Files (AGENTS.md) anlegen.',
  'Liste mit 20 lokalen Zügelfirmen für Kaltakquise exportieren.',
];

const FinalStrategyBlueprint = () => {
  return (
    <div className="space-y-6">

      {/* ─── 1. FINAL STRATEGIC SUMMARY ─── */}
      <Collapsible title="1. Final Strategic Summary — Die 10×4 Erkenntnisse" icon={Target} defaultOpen>
        <div className="space-y-4">
          <Collapsible title="10 wichtigste Erkenntnisse" icon={Lightbulb}>
            <div className="space-y-2">
              {ERKENNTNISSE.map((e, i) => (
                <div key={i} className="flex gap-2 text-xs sm:text-sm text-white/70">
                  <StatusDot color={i < 3 ? 'red' : i < 6 ? 'orange' : 'yellow'} />
                  <span><strong className="text-white/90">{i + 1}.</strong> {e}</span>
                </div>
              ))}
            </div>
          </Collapsible>

          <Collapsible title="10 wichtigste Risiken" icon={AlertTriangle}>
            <div className="space-y-2">
              {RISIKEN.map((r, i) => (
                <div key={i} className="flex gap-2 text-xs sm:text-sm text-white/70">
                  <StatusDot color="red" />
                  <span><strong className="text-white/90">{i + 1}.</strong> {r}</span>
                </div>
              ))}
            </div>
          </Collapsible>

          <Collapsible title="10 wichtigste Lücken" icon={FileText}>
            <div className="space-y-2">
              {LUECKEN.map((l, i) => (
                <div key={i} className="flex gap-2 text-xs sm:text-sm text-white/70">
                  <StatusDot color="orange" />
                  <span><strong className="text-white/90">{i + 1}.</strong> {l}</span>
                </div>
              ))}
            </div>
          </Collapsible>

          <Collapsible title="10 wichtigste Massnahmen" icon={Zap}>
            <div className="space-y-2">
              {MASSNAHMEN.map((m, i) => (
                <div key={i} className="flex gap-2 text-xs sm:text-sm text-white/70">
                  <StatusDot color="green" />
                  <div><strong className="text-white/90">{i + 1}. {m.action}</strong> — {m.detail}</div>
                </div>
              ))}
            </div>
          </Collapsible>

          {/* 5 Investierbarkeits-Punkte */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs font-bold text-emerald-400 mb-2">5 PUNKTE, DIE ÜBER INVESTIERBARKEIT ENTSCHEIDEN</p>
              <ol className="space-y-1.5 text-xs sm:text-sm text-white/70 list-decimal list-inside">
                <li>Radikaler Fokus auf ein Asset-Light-Geschäftsmodell (Software/Plattform).</li>
                <li>Empirischer Beweis der Unit Economics (LTV {'>'} 3x CAC).</li>
                <li>Nachweisbarer B2B-Bedarf (LOIs für Prepaid-Zahlungsbereitschaft).</li>
                <li>Rechtliche und datenschutztechnische Unangreifbarkeit.</li>
                <li>Ein nachweisbar automatisiertes, skalierbares Tech-Backend.</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </Collapsible>

      {/* ─── 2. MASTER TODO LIST ─── */}
      <Collapsible title="2. Master Todo List — P1 / P2 / P3" icon={CheckCircle2}>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-red-400 mb-2">P1 — KRITISCH / SOFORT</p>
            <div className="space-y-2">
              {P1_TODOS.map((t, i) => (
                <Card key={i} className="bg-red-500/5 border-red-500/15">
                  <CardContent className="p-3">
                    <p className="text-sm font-semibold text-white">{t.task}</p>
                    <p className="text-xs text-white/60 mt-1">{t.detail}</p>
                    <p className="text-[10px] text-emerald-400 mt-1.5">→ Ergebnis: {t.result}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-orange-400 mb-2">P2 — HOCH / 14 TAGE</p>
            <div className="space-y-2">
              {P2_TODOS.map((t, i) => (
                <Card key={i} className="bg-orange-500/5 border-orange-500/15">
                  <CardContent className="p-3">
                    <p className="text-sm font-semibold text-white">{t.task}</p>
                    <p className="text-xs text-white/60 mt-1">{t.detail}</p>
                    <p className="text-[10px] text-emerald-400 mt-1.5">→ Ergebnis: {t.result}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-yellow-400 mb-2">P3 — VOR SKALIERUNG</p>
            <div className="space-y-2">
              {[
                { task: 'B2B Routing & Payment Automatisierung', detail: 'Stripe API für Zero-Touch Billing.', result: 'Automatisches Inkasso' },
                { task: 'Data Room Setup', detail: 'Dokumente für Due Diligence strukturieren.', result: 'Teilbarer Link' },
                { task: 'SEO Programmatic Pipeline', detail: 'OpenClaw Agent für lokale Landingpages.', result: 'Sinkender blended CPL' },
              ].map((t, i) => (
                <Card key={i} className="bg-yellow-500/5 border-yellow-500/15">
                  <CardContent className="p-3">
                    <p className="text-sm font-semibold text-white">{t.task}</p>
                    <p className="text-xs text-white/60 mt-1">{t.detail}</p>
                    <p className="text-[10px] text-emerald-400 mt-1.5">→ Ergebnis: {t.result}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Collapsible>

      {/* ─── 3. AI DELEGATION MAP ─── */}
      <Collapsible title="3. AI Delegation Map — Was KI kann, was Mensch muss" icon={Bot}>
        <div className="space-y-3">
          {AI_DELEGATION.map((cat) => (
            <Card key={cat.cat} className={`${cat.color} border`}>
              <CardContent className="p-3">
                <p className={`text-xs font-bold mb-2 ${cat.color.split(' ')[2]}`}>
                  [{cat.cat}] {cat.label}
                </p>
                <ul className="space-y-1">
                  {cat.items.map((item, j) => (
                    <li key={j} className="text-xs sm:text-sm text-white/70 flex gap-2">
                      <span className="text-white/30">•</span> {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Collapsible>

      {/* ─── 4. HUMAN MINIMUM MODEL ─── */}
      <Collapsible title="4. Human Minimum Model — Was der Gründer noch tut" icon={Users}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-3">
              <p className="text-xs font-bold text-blue-400 mb-2">MENSCH (Gründer)</p>
              <ul className="space-y-1.5 text-xs text-white/70">
                <li>→ Priorisiert neue Features in Lovable</li>
                <li>→ Gibt frei: Ads-Budgets, AGB-Änderungen, Partner</li>
                <li>→ Behandelt Ausnahmen: Stripe-Ausfälle, Spezialfälle</li>
                <li>→ Führt Beziehungen: Top 20 Firmen, Investoren</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-3">
              <p className="text-xs font-bold text-emerald-400 mb-2">SYSTEM (KI + APIs)</p>
              <ul className="space-y-1.5 text-xs text-white/70">
                <li>→ Sammelt Leads, validiert Adressen</li>
                <li>→ Berechnet Kubikmeter per Video</li>
                <li>→ Bucht Geld von B2B-Wallets ab</li>
                <li>→ Routet Offerten, mahnt Daten an</li>
                <li>→ Liefert morgens KPI-Summary</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Collapsible>

      {/* ─── 5. AI SYSTEM ARCHITECTURE ─── */}
      <Collapsible title="5. AI System Architecture — Intake bis Reporting" icon={Cpu}>
        <div className="space-y-2">
          {[
            { label: 'A) Intake', system: 'Lovable Web-App + Swiss Post API', human: 'Keine' },
            { label: 'B) Qualifizierung', system: 'CubicCalC / Yembo API (Video → Inventar)', human: 'Nur bei API-Fehlern' },
            { label: 'C) Follow-up', system: 'OpenClaw Follow-up Agent (E-Mail)', human: 'Bei Beschwerden' },
            { label: 'D) Routing & Payment', system: 'OpenClaw + Stripe Connect (Zero-Touch)', human: 'Keine' },
            { label: 'E) Reporting', system: 'OpenClaw HEARTBEAT.md + Cron', human: 'Keine (liest Summary)' },
            { label: 'F) Investor Prep', system: 'LLM als Claim Risk Checker', human: 'Pitchdeck-Entscheidungen' },
          ].map((a, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] sm:grid-cols-3 gap-2 text-xs bg-white/5 rounded-lg p-2.5 border border-white/5">
              <div className="font-semibold text-white">{a.label}</div>
              <div className="text-white/60">{a.system}</div>
              <div className="text-white/40">{a.human}</div>
            </div>
          ))}
        </div>
      </Collapsible>

      {/* ─── 6. OPENCLAW MAXIMUM USE ─── */}
      <Collapsible title="6. OpenClaw Maximum Use Plan" icon={Zap}>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-bold text-cyan-400 mb-2">SKILLS</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {['stripe-api-skill: B2B-Guthaben & Abbuchungen', 'google-ads-skill: Gestriger CPA', 'database-skill: Lead-Status R/W'].map((s, i) => (
                <div key={i} className="text-xs text-white/60 bg-cyan-500/5 border border-cyan-500/10 rounded p-2">{s}</div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-cyan-400 mb-2">AGENTEN</p>
            <div className="space-y-1.5">
              {[
                'Lead Routing Agent: Matchmaking (PLZ, Serviceart, Guthaben) → Lead-Verteilung',
                'Daily Analyst Agent: HEARTBEAT.md + Warnung bei CPL > 70 CHF',
                'SEO Briefing Agent: Wöchentliche Suchtrend-Analyse + Content-Briefings',
              ].map((a, i) => (
                <div key={i} className="text-xs text-white/60 flex gap-2"><span className="text-cyan-400">→</span> {a}</div>
              ))}
            </div>
          </div>
          <Card className="bg-red-500/5 border-red-500/20">
            <CardContent className="p-3">
              <p className="text-xs font-bold text-red-400 mb-1">GRENZEN (NICHT erlaubt)</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• Keine autonomen rechtsverbindlichen Preisgarantien</li>
                <li>• Keine eigenständigen AGB-Änderungen</li>
                <li>• Keine öffentlichen WhatsApp-Bots ohne Limitierung</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Collapsible>

      {/* ─── 7. 80/20 AUTOMATION PLAN ─── */}
      <Collapsible title="7. 80/20 Automation Plan — Top 10 Hebel" icon={BarChart3}>
        <div className="space-y-1.5">
          {[
            { n: 1, name: 'KI-Video-Inventar', replaces: '100% manuelle Volumenberechnung', timing: 'Kurzfristig' },
            { n: 2, name: 'Auto B2B-Routing & Stripe', replaces: '100% Debitorenmanagement', timing: 'Kurzfristig' },
            { n: 3, name: 'Swiss Post Validierung', replaces: '100% Fake-Leads', timing: 'Kurzfristig' },
            { n: 4, name: 'OpenClaw Heartbeat', replaces: '100% Dashboard-Checking', timing: 'Kurzfristig' },
            { n: 5, name: 'Auto Follow-ups', replaces: 'Manuelle Nachfass-E-Mails', timing: 'Kurzfristig' },
            { n: 6, name: 'Lead Scoring', replaces: 'Manuelles Tier-Sorting', timing: 'Mittelfristig' },
            { n: 7, name: 'Programmatic SEO', replaces: 'Manuelle Landingpages', timing: 'Mittelfristig' },
            { n: 8, name: 'Claim Risk Checker', replaces: 'Manuelle Deck-Prüfung', timing: 'Mittelfristig' },
            { n: 9, name: 'B2B Self-Service Portal', replaces: 'Manuelles Onboarding', timing: 'Langfristig' },
            { n: 10, name: 'WhatsApp Intake', replaces: 'Web-only Lead-Erfassung', timing: 'Langfristig' },
          ].map((a) => (
            <div key={a.n} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs bg-white/5 rounded p-2 border border-white/5">
              <span className="font-bold text-white w-6 shrink-0">#{a.n}</span>
              <span className="font-semibold text-white flex-1">{a.name}</span>
              <span className="text-white/50 flex-1">Ersetzt: {a.replaces}</span>
              <Badge className={`text-[10px] w-fit ${a.timing === 'Kurzfristig' ? 'bg-emerald-500/20 text-emerald-400' : a.timing === 'Mittelfristig' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {a.timing}
              </Badge>
            </div>
          ))}
        </div>
      </Collapsible>

      {/* ─── 8. IMPLEMENTATION ROADMAP ─── */}
      <Collapsible title="8. Implementation Roadmap — 4 Phasen" icon={Clock}>
        <div className="space-y-3">
          {PHASES.map((p) => (
            <Card key={p.phase} className={`bg-white/5 border ${p.color}`}>
              <CardContent className="p-3 sm:p-4 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-white/10 text-white text-[10px]">PHASE {p.phase}</Badge>
                  <span className="text-sm font-bold text-white">{p.title}</span>
                  <span className="text-[10px] text-white/40">{p.time}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div><span className="text-white/40">To-dos:</span> <span className="text-white/70">{p.todos}</span></div>
                  <div><span className="text-white/40">Beweise:</span> <span className="text-white/70">{p.proof}</span></div>
                  <div><span className="text-white/40">Systeme:</span> <span className="text-white/70">{p.systems}</span></div>
                  <div><span className="text-white/40">Risiko-Fokus:</span> <span className="text-white/70">{p.risk}</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Collapsible>

      {/* ─── 9. GUARDRAILS ─── */}
      <Collapsible title="9. Control, Risks & Guardrails" icon={Shield}>
        <div className="space-y-2">
          {GUARDRAILS.map((g, i) => (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white/5 rounded-lg p-2.5 border border-white/5">
              <div><span className="text-white/40 block text-[10px]">System</span><span className="text-white font-semibold">{g.system}</span></div>
              <div><span className="text-white/40 block text-[10px]">Hauptrisiko</span><span className="text-red-400/80">{g.risk}</span></div>
              <div><span className="text-white/40 block text-[10px]">Guardrail</span><span className="text-white/70">{g.guard}</span></div>
              <div><span className="text-white/40 block text-[10px]">Human</span><span className="text-yellow-400/80">{g.human}</span></div>
            </div>
          ))}
        </div>
      </Collapsible>

      {/* ─── 10. FINAL EXECUTIVE OUTPUT ─── */}
      <Collapsible title="10. Final Executive Output" icon={TrendingUp} defaultOpen>
        <div className="space-y-4">
          {/* Tomorrow Steps */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs font-bold text-emerald-400 mb-2">🎯 5 SCHRITTE FÜR MORGEN FRÜH</p>
              <ol className="space-y-2 list-decimal list-inside">
                {TOMORROW_STEPS.map((s, i) => (
                  <li key={i} className="text-xs sm:text-sm text-white/80">{s}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Final Verdict */}
          <Card className="bg-gradient-to-br from-red-500/10 via-orange-500/5 to-emerald-500/10 border-white/10">
            <CardContent className="p-4 sm:p-6 space-y-3">
              <p className="text-xs font-bold text-white/50 tracking-widest">FINAL VERDICT</p>
              <p className="text-sm text-red-400 font-semibold">
                Das Modell ist in seiner aktuellen Hybrid-Form nicht investierbar (UWG-Risiko, CapEx-Burn, B2B-Churn).
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                Löst du den Interessenkonflikt, beweist den CPL durch den Micro-Test und implementierst die vorgeschlagene 
                Zero-Touch KI-Architektur (Video-API + Stripe + OpenClaw), verwandelt sich das Projekt von einer unkalkulierbaren 
                Logistikbude in eine <strong className="text-emerald-400">hochattraktive, skalierbare Pre-Seed SaaS-Plattform 
                mit 70% Erfolgschance</strong>.
              </p>
              <p className="text-sm font-bold text-white">Setze den Pivot jetzt um.</p>
            </CardContent>
          </Card>
        </div>
      </Collapsible>

    </div>
  );
};

export default FinalStrategyBlueprint;
