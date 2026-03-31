import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, ChevronRight, Zap, Target, Shield, Clock,
  AlertTriangle, CheckCircle2, BarChart3, Cpu, Users, Bot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ─── Reusable sub-components ───
const Collapsible = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 p-3 text-left hover:bg-white/5 transition-colors">
        {open ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4 text-white/40" />}
        <span className="text-sm font-medium text-white">{title}</span>
      </button>
      {open && <div className="px-3 pb-3 space-y-2">{children}</div>}
    </div>
  );
};

const MasterBadge = ({ source }: { source: string }) => (
  <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded bg-cyan-500/10 text-cyan-400">
    [{source}]
  </span>
);

const PriorityDot = ({ p }: { p: string }) => {
  const colors: Record<string, string> = { P1: 'bg-red-500', P2: 'bg-orange-400', P3: 'bg-yellow-400', P4: 'bg-white/30' };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[p] || 'bg-white/20'}`} />;
};

const DelegationBadge = ({ level }: { level: string }) => {
  const styles: Record<string, string> = {
    A: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    B: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    C: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    D: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    E: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  const labels: Record<string, string> = {
    A: 'Voll KI', B: 'KI + Kontrolle', C: 'KI bereitet vor', D: 'Grösstenteils Mensch', E: 'Muss Mensch',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold rounded border ${styles[level]}`}>
      {level}: {labels[level]}
    </span>
  );
};

const Reveal = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
    {children}
  </motion.div>
);

const NumberedList = ({ items }: { items: string[] }) => (
  <ol className="space-y-1.5 text-sm text-white/70">
    {items.map((item, i) => (
      <li key={i} className="flex gap-2">
        <span className="text-cyan-400 font-bold min-w-[20px]">{i + 1}.</span>
        <span>{item}</span>
      </li>
    ))}
  </ol>
);

// ─── Master Todo Data ───
const todos = [
  { id: 'T1', title: 'Modellentscheidung schriftlich fixieren', desc: 'Festlegen, was Umzugscheck in Phase 1 tatsächlich ist.', cat: 'Positionierung', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'E', system: 'LLM für Strukturvorlagen', risk: 'Investor-Verwirrung, Governance-Angriff' },
  { id: 'T2', title: 'Lead-Routing-Policy bauen', desc: 'Klare Regeln, welche Leads intern vs. extern gehen.', cat: 'Angebotslogik / Trust', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'C', system: 'LLM + Contradiction Checker', risk: 'Hybridmodell bleibt toxisch' },
  { id: 'T3', title: 'Proof-Scorecard für Runde 1', desc: '5-7 Kernhypothesen, KPIs, Kill-Criteria.', cat: 'Daten / KPIs', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'C', system: 'KPI Audit Agent + LLM', risk: 'Tranchierung wirkt beliebig' },
  { id: 'T4', title: 'Getrennte Mini-P&Ls', desc: 'Umzugscheck + Feierabend getrennt modellieren.', cat: 'Economics', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'C', system: 'Spreadsheet + Reporting Agent', risk: 'Economics bleiben blendend' },
  { id: 'T5', title: 'Vollkostenmodell je Service-Linie', desc: 'Realistisches Vollkostenblatt pro Service.', cat: 'Operations / Economics', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'C', system: 'Economics Model Agent', risk: 'Margen-Illusion' },
  { id: 'T6', title: 'Startwette definieren', desc: '1 Region, 1 Service, 1 Zielgruppe, 1 Funnel.', cat: 'Markt / Positionierung', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'E', system: 'Research Agent', risk: 'Verzettelung' },
  { id: 'T7', title: 'Claim-Audit durchführen', desc: 'Alle Claims grün/gelb/rot klassifizieren.', cat: 'Trust / Pitch', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'B', system: 'Claim Risk Checker', risk: 'Gespräche kippen wegen Widersprüchen' },
  { id: 'T8', title: 'Pitch radikal zurückbauen', desc: 'Von Scale-Theater auf Proof-Runde umbauen.', cat: 'Pitch / Investoren', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'B', system: 'Investor Material Agent', risk: 'Glaubwürdigkeitsbruch' },
  { id: 'T9', title: 'Partnerstatus-Matrix aufbauen', desc: 'Partner clustern: aktiv, geprüft, priorisiert.', cat: 'Markt / Trust', p: 'P1', wirkung: 'mittel', dring: 'hoch', del: 'B', system: 'CRM + Data Agent', risk: 'Plattformseite inhaltsleer' },
  { id: 'T10', title: '"Geprüft"-Standard definieren', desc: 'Was "geprüft" konkret bedeutet dokumentieren.', cat: 'Trust / Legal', p: 'P1', wirkung: 'mittel', dring: 'hoch', del: 'C', system: 'LLM + Legal Template', risk: 'Vertrauensclaim fällt auseinander' },
  { id: 'T11', title: 'Partnerpilot starten', desc: '10-20 echte Partnergespräche dokumentieren.', cat: 'Markt / Proof', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'B', system: 'Sales/Follow-up Agent', risk: 'Portalthese bleibt Fantasie' },
  { id: 'T12', title: 'Operations-Capacity-Map', desc: 'Kapazität, Crew, Engpässe abbilden.', cat: 'Operations', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'C', system: 'Ops Readiness Agent', risk: 'Nachfrage schadet' },
  { id: 'T13', title: 'Serviceportfolio ausdünnen', desc: 'Kern- vs. Nebenservices trennen.', cat: 'Positionierung / Ops', p: 'P2', wirkung: 'hoch', dring: 'hoch', del: 'E', system: 'LLM Portfolioanalyse', risk: 'Operative Verzettelung' },
  { id: 'T14', title: 'Hauptfunnel auswählen', desc: '1 Hauptfunnel + max 1 Kontrollvariante.', cat: 'Conversion / KPIs', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'C', system: 'Funnel Analysis Agent', risk: 'Testchaos statt Lernkurve' },
  { id: 'T15', title: 'Tracking- und CRM-System', desc: 'Source, Status, Routing, Outcome tracken.', cat: 'Daten / Automatisierung', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'B', system: 'OpenClaw + CRM + Workflows', risk: 'Erster Traffic = kein Proof' },
  { id: 'T16', title: 'Video/AI-Offertelogik + Guardrails', desc: 'KI bereitet vor, Mensch gibt Preis frei.', cat: 'Conversion / Ops / KI', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'C', system: 'Offer Prep Agent + Approval', risk: 'Falsche Preise, Streit' },
  { id: 'T17', title: 'Datenschutz-/Consent-Pfad', desc: 'Video, Messaging, Datenweitergabe regeln.', cat: 'Legal / Trust', p: 'P2', wirkung: 'mittel', dring: 'hoch', del: 'C', system: 'Legal Doc Agent', risk: 'Daten- und Markenrisiko' },
  { id: 'T18', title: 'Investor-Ready-Pack', desc: 'Funding Memo, Scorecard, P&Ls, Routing bündeln.', cat: 'Pitch / Investoren', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'B', system: 'Investor Material Agent', risk: 'Erstgespräch bleibt Story' },
  { id: 'T19', title: 'OpenClaw-/AI-Orchestrierung', desc: 'Welche Prozesse welche Agenten übernehmen.', cat: 'Automatisierung / KI', p: 'P2', wirkung: 'hoch', dring: 'mittel', del: 'B', system: 'OpenClaw + Skills + Workflow', risk: 'Automatisiert das Falsche' },
  { id: 'T20', title: 'Guardrail- und Eskalationssystem', desc: 'Freigabe-/Eskalationslogik für alle kritischen Aktionen.', cat: 'Legal / Trust / KI', p: 'P1', wirkung: 'hoch', dring: 'hoch', del: 'C', system: 'OpenClaw + Approval Workflows', risk: 'Halluzinationen, falsche Angebote' },
];

// ─── Main Component ───
const AIExecutionMasterplan = () => {
  return (
    <div className="space-y-8">

      {/* ═══ 24.1 FINAL STRATEGIC SUMMARY ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">24.1 — Final Strategic Summary</h2>
            <MasterBadge source="MASTERPLAN" />
          </div>
          <p className="text-sm text-white/60">
            Das Projekt scheitert nicht an fehlender Energie oder Vision. Es scheitert daran, dass die tragende Kernmechanik nicht sauber bewiesen, nicht sauber begrenzt und nicht sauber regiert ist.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Collapsible title="10 wichtigste Erkenntnisse">
              <NumberedList items={[
                'Kernproblem ist nicht fehlender Traffic, sondern fehlende Beweisarchitektur.',
                'Hybridmodell = grösster Hebel UND grösstes Risiko.',
                'Umzugscheck + Feierabend zusammen aktuell zu unscharf geregelt.',
                'Pitch-Story ist grösser als der Belegstand.',
                'Portal- und Eigenausführungs-Economics nicht sauber getrennt.',
                'Delivery-Seite ist operativ riskanter als die Story suggeriert.',
                'Claims zu KI, Automatisierung, SEO, Margen sind zu stark formuliert.',
                'Build-Intensität ist real, aber kein Geschäftsbeweis.',
                'Vor Investoren braucht ihr weniger Vision, mehr Messlogik.',
                'Richtige Linie = fokussierter Proof-First-Hybrid mit harter Governance.',
              ]} />
            </Collapsible>

            <Collapsible title="10 wichtigste Risiken">
              <NumberedList items={[
                'Plattform vs. Eigenausführung bleibt strukturell ungeklärt.',
                'Lead-Routing wirkt unfair oder opportunistisch.',
                'Portal- und Service-Economics werden vermischt.',
                'Delivery wird Engpass, bevor Funnel bewiesen.',
                'SEO-/Traffic-These wird zu früh wie ein Asset verkauft.',
                'Partnerseite akzeptiert das Modell nicht.',
                'KI-/Video-/Automatisierungsclaims halten operativ nicht stand.',
                'Pitch erzeugt Skepsis wegen zu vieler starker Claims.',
                'Zu viele Marken, Revenue Streams, Flows verdünnen Fokus.',
                'Frühe Automatisierung ohne Guardrails = Fehler + Markenrisiko.',
              ]} />
            </Collapsible>

            <Collapsible title="10 wichtigste Lücken">
              <NumberedList items={[
                'Keine schriftliche Modelldefinition.',
                'Keine schriftliche Routing-Policy.',
                'Keine getrennten Mini-P&Ls.',
                'Kein Proof-Scorecard-Set für Runde 1.',
                'Kein belastbares Vollkostenmodell pro Auftrag.',
                'Keine klare Startwette: Region, Service, Funnel.',
                'Keine Partner-Logik mit Qualitätsstufen.',
                'Keine definierte Claim-Kontrolle.',
                'Keine saubere Operations-Capacity-Map.',
                'Keine AI-/Automation-Governance mit Human Approval Layer.',
              ]} />
            </Collapsible>

            <Collapsible title="10 wichtigste Massnahmen">
              <NumberedList items={[
                'Hybridmodell schriftlich definieren.',
                'Routing-Regeln schriftlich festlegen.',
                'Proof-KPIs und Kill-Criteria definieren.',
                'Portal- und Service-Economics trennen.',
                'Vollkostenmodell für Feierabend bauen.',
                '2 Marken / 1 Region / 1 Service / 1 Funnel festlegen.',
                'Partner-Matrix und Partnerpilot aufbauen.',
                'Pitch claim-by-claim redigieren.',
                'AI-/Automation-Schicht mit Approval-Logik designen.',
                'Investor-Ready-Pack aufbauen.',
              ]} />
            </Collapsible>
          </div>

          <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <CardContent className="pt-4">
              <h3 className="text-sm font-bold text-cyan-400 mb-3">5 Punkte, die über Investierbarkeit entscheiden</h3>
              <ol className="space-y-2 text-sm text-white/80">
                <li className="flex gap-2"><span className="text-cyan-400 font-bold">1.</span> Ist das Hybridmodell sauber regiert oder strukturell widersprüchlich?</li>
                <li className="flex gap-2"><span className="text-cyan-400 font-bold">2.</span> Erzeugt Umzugscheck nachweisbar qualifizierte Nachfrage?</li>
                <li className="flex gap-2"><span className="text-cyan-400 font-bold">3.</span> Ist Eigenausführung profitabler oder klar steuerbar vs. Vermittlung?</li>
                <li className="flex gap-2"><span className="text-cyan-400 font-bold">4.</span> Kann Feierabend im Startscope operativ sauber liefern?</li>
                <li className="flex gap-2"><span className="text-cyan-400 font-bold">5.</span> Ist der Pitch endlich kleiner, härter und beweisorientiert genug?</li>
              </ol>
            </CardContent>
          </Card>
        </section>
      </Reveal>

      {/* ═══ 24.2 MASTER TODO LIST ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">24.2 — Master Todo List (T1–T20)</h2>
          </div>
          <div className="space-y-2">
            {todos.map((t) => (
              <Collapsible key={t.id} title={`${t.id}: ${t.title}`}>
                <p className="text-xs text-white/60 mb-2">{t.desc}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div><span className="text-white/40">Kategorie:</span> <span className="text-white/70">{t.cat}</span></div>
                  <div className="flex items-center gap-1"><span className="text-white/40">Priorität:</span> <PriorityDot p={t.p} /> <span className="text-white/70">{t.p}</span></div>
                  <div><span className="text-white/40">Wirkung:</span> <span className="text-white/70">{t.wirkung}</span></div>
                  <div><span className="text-white/40">Dringlichkeit:</span> <span className="text-white/70">{t.dring}</span></div>
                </div>
                <p className="text-xs text-red-400/70 mt-1">Risiko: {t.risk}</p>
              </Collapsible>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 24.3 AI DELEGATION MAP ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">24.3 — AI Delegation Map</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {['A', 'B', 'C', 'D', 'E'].map(l => <DelegationBadge key={l} level={l} />)}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="text-left py-2 px-2">ID</th>
                  <th className="text-left py-2 px-2">Todo</th>
                  <th className="text-left py-2 px-2">Level</th>
                  <th className="text-left py-2 px-2">System</th>
                  <th className="text-left py-2 px-2">Freigabe</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((t) => {
                  const rowColors: Record<string, string> = {
                    A: 'bg-emerald-500/5', B: 'bg-teal-500/5', C: 'bg-yellow-500/5', D: 'bg-orange-500/5', E: 'bg-red-500/5'
                  };
                  return (
                    <tr key={t.id} className={`border-b border-white/5 ${rowColors[t.del]}`}>
                      <td className="py-2 px-2 text-cyan-400 font-mono">{t.id}</td>
                      <td className="py-2 px-2 text-white/70">{t.title}</td>
                      <td className="py-2 px-2"><DelegationBadge level={t.del} /></td>
                      <td className="py-2 px-2 text-white/50">{t.system}</td>
                      <td className="py-2 px-2 text-white/50">{t.del === 'A' ? 'Nein' : 'Ja'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </Reveal>

      {/* ═══ 24.4 HUMAN MINIMUM MODEL ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">24.4 — Human Minimum Model</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: '🤖 Voll Automatisiert', color: 'border-emerald-500/30', items: ['Lead-Erfassung', 'CRM-Einträge & Status', 'Erinnerungen & Follow-ups', 'KPI-Rohreporting', 'Claim-Scanning', 'SEO-Briefing-Pipeline', 'Dokumentversionierung'] },
              { title: '👁️ Review / Freigabe', color: 'border-teal-500/30', items: ['Preisfreigaben', 'Lead-Routing Grenzfälle', 'Partner-Freigaben', 'Investor-Claims', 'Pitch-Finalisierung', 'Milestone-Freigaben'] },
              { title: '⚡ Nur bei Ausnahmen', color: 'border-yellow-500/30', items: ['Unklare Offerten', 'Widersprüche Funnel/CRM', 'Leads ausserhalb Scope', 'Hohe Preisabweichungen', 'KI-Fehlklassifikationen', 'Kapazitäts-Überlastung'] },
              { title: '🧠 Bewusst Menschlich', color: 'border-red-500/30', items: ['Modellentscheidung', 'Routing-Governance', 'Partnerbeziehungen', 'Investorengespräche', 'Kill-/Go-Entscheide', 'Risikoübernahme', 'Markenentscheidungen'] },
            ].map((col) => (
              <Card key={col.title} className={`bg-white/5 ${col.color}`}>
                <CardHeader className="pb-2"><CardTitle className="text-sm">{col.title}</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-white/60">
                    {col.items.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 24.5 AI SYSTEM ARCHITECTURE ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">24.5 — AI System Architecture</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: 'A', title: 'Intake / Lead-Erfassung', system: 'WhatsApp + OpenClaw Intake Agent', auto: 'Datenerfassung, Standardfragen', human: 'Nur Sonderfälle' },
              { id: 'B', title: 'Qualifizierung', system: 'Qualification Agent + Scope Check', auto: 'Vorqualifikation, Red-Flag-Erkennung', human: 'Hohe Werte, Sonderfälle' },
              { id: 'C', title: 'Kommunikation / Follow-up', system: 'Follow-up Agent + Cron', auto: 'Erinnerungen, Standardantworten', human: 'Verhandlung, Eskalation' },
              { id: 'D', title: 'Offerten / Angebotslogik', system: 'Offer Prep Agent + Human Approval', auto: 'Strukturierung, Kostentreiber', human: 'Preisfreigabe zwingend' },
              { id: 'E', title: 'Terminierung / Ops-Vorbereitung', system: 'Ops Readiness Agent', auto: 'Slot-Vorschläge, Checklisten', human: 'Finaler Dispatch' },
              { id: 'F', title: 'Reporting / KPIs', system: 'KPI Audit Agent + Daily Report', auto: 'KPI-Zusammenzug, Abweichungsalarme', human: 'Interpretation' },
              { id: 'G', title: 'SEO / Content', system: 'SEO Briefing Agent + Pipeline', auto: 'Briefs, Cluster, Seitenentwürfe', human: 'Publikationsfreigabe' },
              { id: 'H', title: 'Investor / Pitch', system: 'Investor Material Agent', auto: 'Redlines, Versionierung', human: 'Jede finale Aussage' },
              { id: 'I', title: 'Entscheidung / Freigabe', system: 'Human Approval Layer + Policy Engine', auto: 'Approval-Requests, Audit-Logs', human: 'Mensch entscheidet' },
              { id: 'J', title: 'Monitoring / QC', system: 'Cron + Audit Agents + Alerts', auto: 'Tägliche Checks, KPI-Warnungen', human: 'Nur Eskalationen' },
            ].map((area) => (
              <Card key={area.id} className="bg-white/5 border-white/10">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-mono text-xs">{area.id})</span>
                    <h3 className="text-sm font-bold text-white">{area.title}</h3>
                  </div>
                  <p className="text-xs text-cyan-400/70">{area.system}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-emerald-400">Auto:</span> <span className="text-white/60">{area.auto}</span></div>
                    <div><span className="text-orange-400">Mensch:</span> <span className="text-white/60">{area.human}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 24.6 OPENCLAW MAXIMUM USE PLAN ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">24.6 — OpenClaw Maximum Use Plan</h2>
          </div>
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="cron">Cron / Reminder</TabsTrigger>
              <TabsTrigger value="messaging">Messaging</TabsTrigger>
              <TabsTrigger value="control">Kontrolle</TabsTrigger>
              <TabsTrigger value="nogo">Nicht geeignet</TabsTrigger>
            </TabsList>
            <TabsContent value="skills" className="mt-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Lead Intake Skill', 'Missing Data Skill', 'Scope Check Skill', 'Offer Prep Skill', 'Margin Check Skill', 'KPI Audit Skill', 'Claim Risk Checker', 'Investor Material Skill', 'SEO Briefing Skill', 'Capacity Alert Skill', 'Routing Policy Checker', 'Contradiction Checker'].map(s => (
                  <Badge key={s} variant="outline" className="justify-center py-1.5 text-xs text-cyan-400 border-cyan-500/30">{s}</Badge>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="agents" className="mt-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Lead Intake Agent', 'Qualification Agent', 'Offer Prep Agent', 'Partner Follow-up Agent', 'KPI Audit Agent', 'Investor Material Agent', 'Contradiction Checker', 'Ops Readiness Agent', 'Proof Collection Agent', 'Claim Risk Checker'].map(a => (
                  <Badge key={a} variant="outline" className="justify-center py-1.5 text-xs text-teal-400 border-teal-500/30">{a}</Badge>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="cron" className="mt-3">
              <ul className="space-y-1.5 text-xs text-white/70">
                {['Täglicher KPI-Report', 'Täglicher offene-Leads-Check', 'Follow-up auf unvollständige Leads', 'Täglicher Claim-Drift-Check', 'Wöchentlicher Partnerstatus-Check', 'Wöchentlicher Funnel-Health-Report', 'Täglicher Capacity Alert', 'DD-Dokument-Completeness-Check'].map((c, i) => (
                  <li key={i} className="flex items-center gap-2"><Clock className="w-3 h-3 text-cyan-400" /> {c}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="messaging" className="mt-3">
              <ul className="space-y-1.5 text-xs text-white/70">
                {['Erstkontakt', 'Standardfragen', 'Datennachforderung', 'Video-/Foto-Anforderung', 'Terminfenster-Abfrage', 'Statusupdates'].map((m, i) => (
                  <li key={i}>• {m}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="control" className="mt-3">
              <ul className="space-y-1.5 text-xs text-white/70">
                {['Widersprüchliche Claims markieren', 'Fehlende CRM-Felder melden', 'Leads ohne Outcome markieren', 'Offerten ohne Freigabe blocken', 'Routing ausserhalb der Policy markieren'].map((c, i) => (
                  <li key={i} className="flex items-center gap-2"><Shield className="w-3 h-3 text-yellow-400" /> {c}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="nogo" className="mt-3">
              <ul className="space-y-1.5 text-xs text-red-400/70">
                {['Finale Preisfreigabe', 'Finale Lead-Routing-Entscheidung bei Grenzfällen', 'Rechtliche Freigaben', 'Investorenaussagen final autorisieren', 'Partnerverhandlungen autonom führen', 'Kritische operative Disposition ohne Menschen', 'Öffentliche Claims ohne Review'].map((n, i) => (
                  <li key={i} className="flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> {n}</li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
          <Card className="bg-red-500/5 border-red-500/20 mt-3">
            <CardContent className="pt-3">
              <p className="text-xs text-red-400/80">
                <strong>Sicherheitshinweis:</strong> OpenClaw nur selbst gehostet, isoliert, mit minimalen Berechtigungen, ohne unkontrollierte Skills, mit Human Approval vor kritischen Aktionen. Die Sicherheitsrisiken (Prompt Injection, breite Rechte) sind real.
              </p>
            </CardContent>
          </Card>
        </section>
      </Reveal>

      {/* ═══ 24.7 80/20 AUTOMATION PLAN ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">24.7 — 80/20 Automation Plan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: '⚡ Kurzfristig realistisch', items: ['Lead Intake Automation', 'CRM Auto-Logging', 'KPI Daily Reporting', 'Claim Risk Scanning', 'Missing-Data Follow-up'] },
              { title: '🎯 Strategisch wertvoll', items: ['Routing Policy Check', 'Offer Prep + Human Approval', 'KPI Audit Agent', 'Investor Material Agent', 'Capacity Alert System'] },
              { title: '🔄 Grösste Routineentlastung', items: ['CRM Updates', 'Follow-up fehlende Daten', 'Tägliche Reports', 'Dokumentversionierung', 'Standard-Partnernachfassungen'] },
              { title: '📊 Investoren + Ops gleichzeitig', items: ['KPI Daily Reporting', 'Claim Risk Scanning', 'Offer Prep + Guardrails', 'Routing Policy Check', 'Investor Material Consolidation'] },
            ].map((block) => (
              <Card key={block.title} className="bg-white/5 border-white/10">
                <CardHeader className="pb-2"><CardTitle className="text-sm">{block.title}</CardTitle></CardHeader>
                <CardContent>
                  <ol className="space-y-1 text-xs text-white/70">
                    {block.items.map((item, i) => <li key={i} className="flex gap-2"><span className="text-cyan-400">{i + 1}.</span> {item}</li>)}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 24.8 IMPLEMENTATION ROADMAP ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">24.8 — Implementation Roadmap</h2>
          </div>
          <div className="space-y-4">
            {[
              { phase: 'Phase 1', time: '7 Tage', color: 'border-l-red-500', todos: 'T1, T2, T3, T6, T7, T8', ki: 'Claim Risk Checker, Contradiction Checker, Routing Draft', proof: 'Klare Mess- und Entscheidungslogik', risk: 'Modell bleibt weich, Team diskutiert statt entscheidet' },
              { phase: 'Phase 2', time: '30 Tage', color: 'border-l-orange-400', todos: 'T4, T5, T9, T10, T11, T14, T15, T16, T18', ki: 'KPI Audit, CRM Automation, Partner Follow-up, Offer Prep', proof: 'Modellierte Economics, Partnerreaktionen, Datenstruktur', risk: 'Datenqualität, Automatisierungsfehler' },
              { phase: 'Phase 3', time: '60 Tage', color: 'border-l-yellow-400', todos: 'T12, T13, T17, T19, T20 + Live-Test', ki: 'Capacity Alert, Daily Audit, Funnel Health, Proof Collection', proof: 'Erste attributable Fälle, Routing-/Engpassdaten', risk: 'KI beschleunigt Fehler, Delivery kippt' },
              { phase: 'Phase 4', time: 'Vor Investoren', color: 'border-l-emerald-500', todos: 'Proof-Pack, Pitch, DD-Prep, Kill-Questions', ki: 'DD Prep Agent, Claim Risk Checker, KPI Consolidation', proof: 'Funnel, Economics, Governance, Ops-Realität', risk: 'Rückfall in Scale-Theater' },
            ].map((p) => (
              <Card key={p.phase} className={`bg-white/5 border-white/10 border-l-4 ${p.color}`}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{p.phase}</h3>
                    <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-500/30">{p.time}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div><span className="text-white/40">Todos:</span> <span className="text-white/70">{p.todos}</span></div>
                    <div><span className="text-white/40">KI-Delegationen:</span> <span className="text-cyan-400/70">{p.ki}</span></div>
                    <div><span className="text-white/40">Beweise:</span> <span className="text-emerald-400/70">{p.proof}</span></div>
                    <div><span className="text-white/40">Risiken:</span> <span className="text-red-400/70">{p.risk}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 24.9 CONTROL, RISKS & GUARDRAILS ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">24.9 — Control, Risks & Guardrails</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { area: 'Lead Intake', risk: 'Falsche Klassifikation, falsches Routing', escalation: 'Unvollständige Leads → Mensch', noblind: 'Bewertung ohne Scope Check' },
              { area: 'Offer Prep', risk: 'Falsche Preise → Marge weg, Streit', escalation: 'Alles ausserhalb Bandbreiten', noblind: 'Verbindliche Offerten' },
              { area: 'Routing', risk: 'Unfair oder falsch → Partnerkonflikt', escalation: 'Jeder Policy-Verstoss', noblind: 'Hochwertige Grenzfälle' },
              { area: 'KPI Reporting', risk: 'Falsche Daten → falsche Entscheidungen', escalation: 'KPI-Sprünge, fehlende Daten', noblind: 'Strategische Schlussfolgerungen' },
              { area: 'Claim Scanning', risk: 'Unbelegte Aussagen rutschen durch', escalation: 'Jede neue Zahl/Superlativ', noblind: 'Finale Investoren-Claims' },
              { area: 'OpenClaw Skills', risk: 'Prompt Injection, zu breite Rechte', escalation: 'Ungeplante Aktionen', noblind: 'Shell-Zugriffe auf Produktiv' },
            ].map((g) => (
              <Card key={g.area} className="bg-white/5 border-white/10">
                <CardContent className="pt-4 space-y-1.5 text-xs">
                  <h3 className="text-sm font-bold text-white">{g.area}</h3>
                  <div><span className="text-red-400">Risiko:</span> <span className="text-white/60">{g.risk}</span></div>
                  <div><span className="text-yellow-400">Eskalation:</span> <span className="text-white/60">{g.escalation}</span></div>
                  <div><span className="text-orange-400">Nicht blind:</span> <span className="text-white/60">{g.noblind}</span></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 24.10 FINAL EXECUTIVE OUTPUT ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">24.10 — Final Executive Output</h2>
          </div>

          <Collapsible title="A) 20 wichtigste To-dos insgesamt" defaultOpen>
            <NumberedList items={todos.map(t => `${t.id}: ${t.title}`)} />
          </Collapsible>

          <Collapsible title="B) 10 To-dos, die KI stark übernehmen kann">
            <NumberedList items={[
              'Claim-Audit', 'Pitch-Redlining', 'CRM Auto-Logging', 'KPI Daily Reporting',
              'Missing-Data Follow-up', 'Partner-Reaktionsprotokolle', 'Funnel-Entscheidungsvorlagen',
              'Investor-Material-Konsolidierung', 'SEO-/Content-Briefings', 'Daily Audit / Capacity Alerts'
            ]} />
          </Collapsible>

          <Collapsible title="C) 10 To-dos, die beim Menschen bleiben müssen">
            <NumberedList items={[
              'Modellentscheidung', 'Routing-Governance', 'Preisfreigabe', 'Service-Scope-Entscheide',
              'Partnerverhandlungen', 'Investorengespräche', 'Finale Claims', 'Risikoübernahme',
              'Kill-/Go-Entscheide', 'Rechtliche Freigaben'
            ]} />
          </Collapsible>

          <Collapsible title="D) 10 To-dos vor Investorengesprächen">
            <NumberedList items={[
              'Modelldefinition', 'Routing-Policy', 'Proof-Scorecard', 'Getrennte Mini-P&Ls',
              'Vollkostenmodell', 'Startscope', 'Claim-Audit', 'Entgifteter Pitch',
              'Investor-Ready-Pack', 'Guardrail-/Freigabelogik'
            ]} />
          </Collapsible>

          <Collapsible title="E) 5 nächste Schritte, wenn ihr morgen anfangen wollt" defaultOpen>
            <NumberedList items={[
              'Modell und Routing schriftlich festlegen.',
              'Startscope auf 1 Region, 1 Kernservice, 1 Hauptfunnel reduzieren.',
              'Proof-Scorecard und Tranche-Logik bauen.',
              'Mini-P&Ls und Vollkostenmodell aufsetzen.',
              'Claim-Audit und Pitch-Redline durchführen.',
            ]} />
          </Collapsible>

          <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20 mt-4">
            <CardContent className="pt-4 space-y-3">
              <h3 className="text-sm font-bold text-cyan-400">Endurteil</h3>
              <p className="text-sm text-white/80">
                Die richtige Reihenfolge: <strong className="text-white">Erst Modellklarheit → dann Messlogik → dann Economics → dann Guardrails → dann erst breite Automatisierung.</strong>
              </p>
              <p className="text-xs text-white/50 italic">
                Nicht mehr Mythos bauen. Messmaschine bauen. Und die Messmaschine so aufsetzen, dass Menschen nur noch entscheiden, freigeben und Ausnahmen behandeln.
              </p>
            </CardContent>
          </Card>
        </section>
      </Reveal>

    </div>
  );
};

export default AIExecutionMasterplan;
