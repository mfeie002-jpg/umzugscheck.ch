import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, XCircle, Shield, Zap, Target } from 'lucide-react';

// ─── Local Collapsible ───
const Collapsible = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors">
        <span className="text-sm font-semibold text-white/90">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-white/40" /> : <ChevronRight className="w-4 h-4 text-white/40" />}
      </button>
      {open && <div className="px-3 pb-3 space-y-2">{children}</div>}
    </div>
  );
};

const Reveal = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
    {children}
  </motion.div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'BEWIESEN': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'PLAUSIBEL': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'NICHT BELEGT': 'bg-red-500/20 text-red-400 border-red-500/30',
    'REINE ANNAHME': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'RISIKO': 'bg-red-600/20 text-red-300 border-red-600/30',
    'KRITISCHE LÜCKE': 'bg-red-700/20 text-red-300 border-red-700/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold rounded border ${styles[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {status}
    </span>
  );
};

const SourceBadge = () => (
  <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded bg-violet-500/10 text-violet-400">
    [GEMINI]
  </span>
);

const ScoreCell = ({ score }: { score: number }) => {
  const color = score <= 3 ? 'text-red-400 bg-red-500/10' : score <= 6 ? 'text-yellow-400 bg-yellow-500/10' : 'text-emerald-400 bg-emerald-500/10';
  return <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${color}`}>{score}</span>;
};

const GeminiBlueprint = () => {
  return (
    <div className="space-y-6">
      {/* ═══ BLOCK 25 HEADER ═══ */}
      <Reveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Block 25: Gemini Investor Readiness Blueprint <SourceBadge />
            </h2>
            <p className="text-xs text-white/50">Post-Due-Diligence Audit · Version 1.0 · März 2026</p>
          </div>
        </div>
      </Reveal>

      {/* ═══ 25.1 EXECUTIVE SUMMARY ═══ */}
      <Reveal>
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-violet-500/40 via-purple-500/20 to-fuchsia-500/40">
          <div className="rounded-2xl bg-black/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Executive Summary</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Investierbarkeit</span>
                <span className="text-2xl font-black text-red-400">3/10</span>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Das Modell kombiniert Lead-Akquise für Umzüge/Reinigungen im Schweizer Markt mit eigener operativer Ausführung. 
              Über WhatsApp-Katalog und OpenClaw werden Leads erfasst, vorqualifiziert und in Draft-Offerten umgewandelt. 
              Profitabelste Aufträge werden selbst abgewickelt, überschüssige Leads an Partner verkauft.
            </p>
            <p className="text-xs text-white/50">
              Aktueller Status: <StatusBadge status="NICHT BELEGT" /> Pre-Live / Setup-Phase. Technologie steht, aber Live-Traffic, Unit Economics und B2B-PoC fehlen.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                <p className="text-xs font-bold text-emerald-400 mb-1">Stärken</p>
                <ul className="text-xs text-white/60 space-y-1">
                  <li>• WhatsApp-Katalog-UX (branchenführend)</li>
                  <li>• Modularer Cross-Selling-Ansatz (AOV)</li>
                  <li>• 5-Runs-Kill-Switch-Logik</li>
                </ul>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                <p className="text-xs font-bold text-red-400 mb-1">Risiken</p>
                <ul className="text-xs text-white/60 space-y-1">
                  <li>• B2B-Boykott wegen Cherry-Picking</li>
                  <li>• Google-Spam-Penalty für KI-Seiten</li>
                  <li>• GAV-Margen-Erosion</li>
                </ul>
              </div>
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3">
                <p className="text-xs font-bold text-orange-400 mb-1">Lücken</p>
                <ul className="text-xs text-white/60 space-y-1">
                  <li>• Reale Pro-Forma-Kalkulationen</li>
                  <li>• Pitchdeck-Bereinigung</li>
                  <li>• Juristische Struktur (Cap Table)</li>
                </ul>
              </div>
              <div className="bg-violet-500/5 border border-violet-500/20 rounded-lg p-3">
                <p className="text-xs font-bold text-violet-400 mb-1">Hebel</p>
                <ul className="text-xs text-white/60 space-y-1">
                  <li>• Pivot zu "Tech-Enabled Operator"</li>
                  <li>• Human-in-the-Loop für KI-Offerten</li>
                  <li>• Fokus auf Eigenmarge + Overflow</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ═══ 25.2 INVESTABILITY SCORECARD ═══ */}
      <Reveal>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-400" /> Investability Scorecard
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 text-white/50 font-medium">Feld</th>
                  <th className="text-center py-2 text-white/50 font-medium w-16">Score</th>
                  <th className="text-left py-2 text-white/50 font-medium">Status</th>
                  <th className="text-left py-2 text-white/50 font-medium hidden sm:table-cell">Begründung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { field: 'Markt & Nachfrage', score: 9, status: 'BEWIESEN', reason: '406k Umzüge/Jahr. Inelastische Nachfrage.' },
                  { field: 'Positionierung', score: 2, status: 'RISIKO', reason: 'Toxischer Konflikt: "Vergleichsportal" vs. "Cherry-Picker".' },
                  { field: 'Leadgen / Akquise', score: 4, status: 'KRITISCHE LÜCKE', reason: '"0 CHF CAC" SEO-Story ist für Phase 1 unrealistisch.' },
                  { field: 'Conversion (UX)', score: 8, status: 'PLAUSIBEL', reason: 'WhatsApp-Katalog-Flow ist exzellent und branchenführend.' },
                  { field: 'Unit Economics', score: 2, status: 'REINE ANNAHME', reason: '40-45% DB-Marge unter GAV-Bedingungen.' },
                  { field: 'Operations (Delivery)', score: 3, status: 'KRITISCHE LÜCKE', reason: 'LKW-Skalierung, Personal, Schäden vs. "92% KI".' },
                  { field: 'Trust / Brand', score: 3, status: 'RISIKO', reason: '4 Brands zersplittern Budget; "Seit 1980" vs. "KI-Startup".' },
                  { field: 'Automatisierung / KI', score: 7, status: 'PLAUSIBEL', reason: 'Setup steht, Haftungsrisiko bei KI-Preiskalkulation.' },
                  { field: 'Investor Narrative', score: 2, status: 'RISIKO', reason: 'Ask-Diskrepanz (80k vs 100k) zerstört Vertrauen.' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="py-2 text-white/80 font-medium">{row.field}</td>
                    <td className="py-2 text-center"><ScoreCell score={row.score} /></td>
                    <td className="py-2"><StatusBadge status={row.status} /></td>
                    <td className="py-2 text-white/50 hidden sm:table-cell">{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* ═══ 25.3 RISK MAP ═══ */}
      <Reveal>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" /> Risk Map
          </h3>
          <div className="space-y-3">
            {[
              { title: 'B2B-Partner Boykott', desc: 'Partner zahlen nicht für "Rest-Leads", wenn Plattform selbst Premium abwickelt.', danger: 'B2B-Kanal bricht weg, Modell implodiert.', wk: 5, schwere: 5, indicator: '0% Close-Rate bei B2B-Akquise' },
              { title: 'Funding-Inkonsistenz', desc: '80k Tranchen vs. 100k Loan im Pitchdeck.', danger: 'VC bricht DD in Minute 1 ab.', wk: 5, schwere: 5, indicator: 'Kritische Nachfrage im First Pitch' },
              { title: 'GAV-Verstösse Ops', desc: 'Skalierung mit Freelancern verstösst gegen Schweizer Arbeitsrecht.', danger: 'Bussen, Betriebsschliessung, Reputationsschaden.', wk: 3, schwere: 4, indicator: 'Hoher Personalturnover' },
              { title: 'KI-Festpreis Haftung', desc: 'KI schätzt m³ zu tief, Firma muss zum defizitären Fixpreis ausführen.', danger: 'Marge wird negativ, Burn-Rate explodiert.', wk: 4, schwere: 4, indicator: 'Reale m³ > KI-geschätzte m³' },
              { title: 'SEO Spam Penalty', desc: 'Google de-indiziert 43.8k KI-Seiten.', danger: 'Lead-Strom versiegt, CAC explodiert.', wk: 4, schwere: 5, indicator: 'Search Console Drops' },
            ].map((risk, i) => (
              <div key={i} className="bg-red-500/5 border border-red-500/15 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white/90">{risk.title}</p>
                  <StatusBadge status="RISIKO" />
                </div>
                <p className="text-xs text-white/60">{risk.desc}</p>
                <p className="text-xs text-red-300/80">⚠ Gefahr: {risk.danger}</p>
                <div className="flex gap-4 text-xs text-white/40">
                  <span>Eintritts-WK: <strong className="text-white/70">{risk.wk}/5</strong></span>
                  <span>Schweregrad: <strong className="text-white/70">{risk.schwere}/5</strong></span>
                </div>
                <p className="text-xs text-yellow-400/60">Frühindikator: {risk.indicator}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ═══ 25.4 GAP MAP ═══ */}
      <Reveal>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-3">
          <h3 className="text-lg font-bold text-white">Gap Map</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { cat: 'Proof Gaps', color: 'red', items: ['KI-Bildschätzung Präzision nicht belegt', 'B2B-Kunden kaufen Overflow-Leads nicht belegt'] },
              { cat: 'Economics Gaps', color: 'orange', items: ['Kein Financial Model bis Break-Even', 'Keine GAV-konforme Pro-Forma'] },
              { cat: 'Strategy & Positioning', color: 'yellow', items: ['4 Brands + 10 Revenue-Streams mit Pre-Seed', '"Sorglos-Paket" vs. unklare B2B-Neutralität'] },
              { cat: 'Documentation', color: 'purple', items: ['Kein Cap Table / Organigramm', '"Cherry-Picking" im Deck ist Red Flag', '"0 CHF CAC" verschleiert Phase-1-Realität'] },
            ].map((gap, i) => (
              <div key={i} className={`bg-${gap.color}-500/5 border border-${gap.color}-500/15 rounded-lg p-3`}>
                <p className={`text-xs font-bold text-${gap.color}-400 mb-2`}>{gap.cat}</p>
                <ul className="text-xs text-white/60 space-y-1">
                  {gap.items.map((item, j) => <li key={j}>• {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ═══ 25.5 CONTRADICTION MAP ═══ */}
      <Reveal>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" /> Contradiction Map
          </h3>
          <div className="space-y-3">
            {[
              { label: 'A', title: 'Plattform-Neutralität vs. Eigenausführung', widerspruch: 'Website claimt neutralen "Schweizer Umzugsvergleich", Deck offenbart Eigenausführung der besten Leads.', gefahr: 'Zerstört Partner-Vertrauen (B2B) und birgt UWG-Risiken. VC sieht sofortigen Churn.' },
              { label: 'B', title: 'Startup-Skalierung vs. "Familienbetrieb 1980"', widerspruch: '92% KI-Startup-Vision vs. 40 Jahre altes KMU-Badge.', gefahr: 'Investor weiss nicht, wem die IP gehört und ob er Altlasten mitfinanziert.' },
              { label: 'C', title: 'Tech-Story vs. Operative Handwerksrealität', widerspruch: 'Software skaliert gratis; Möbelpacker, LKWs und Schadensfälle skalieren teuer.', gefahr: 'Unit Economics werden als naiv bewertet ("Tech-Bros, die das Handwerk nicht verstehen").' },
            ].map((c, i) => (
              <div key={i} className="border-l-4 border-red-500/60 bg-red-500/5 rounded-r-lg p-3 space-y-1">
                <p className="text-sm font-bold text-white/90">{c.label}) {c.title}</p>
                <p className="text-xs text-white/60"><strong className="text-white/70">Widerspruch:</strong> {c.widerspruch}</p>
                <p className="text-xs text-red-300/80"><strong>Gefahr:</strong> {c.gefahr}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ═══ 25.6 SOLUTION BLUEPRINT ═══ */}
      <Reveal>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-400" /> Solution Blueprint
          </h3>
          <div className="space-y-4">
            {[
              {
                num: 1, title: 'Der "Tech-Operator Pivot"',
                problem: 'Offene Eigenausführungs-Bevorzugung killt den B2B-Marktplatz.',
                loesung: 'Pitch und Copywriting umbauen: Ihr seid NICHT "der neutrale Vergleich". Ihr seid "Feierabend Services, die erste KI-gesteuerte Premium-Umzugsfirma der Schweiz". Umzugscheck.ch ist eure interne Inbound-Maschine.',
                schritte: ['"Cherry-Picking" aus Deck löschen', 'Neues Narrativ: "Wir lasten eigene Flotte aus. Overflow verkaufen wir an Partner."'],
                ki: 'LLM Contradiction Checker scannt Deck auf alte Marktplatz-Begriffe.',
                mensch: 'Strategische Entscheidung treffen und pitchen.',
                prio: 'Sofort (P1)',
              },
              {
                num: 2, title: 'Pro-Forma Unit Economics & 80k Runway',
                problem: 'Fehlender Rentabilitätsbeweis unter Schweizer GAV; Ask-Diskrepanz.',
                loesung: 'Financial Model aufbauen. Phase 1 (20k) aufteilen: Ads-Budget, Software, Ops-Puffer. Fiktiver 1.500 CHF Job auf Rappen durchkalkulieren.',
                schritte: ['Ask im Pitchdeck zwingend auf 80k anpassen', 'Excel: Lohn gemäss GAV, LKW-Miete, Sprit, Ads-CPL abziehen'],
                ki: 'LLM generiert Tabellenstruktur und Formel-Logik.',
                mensch: 'Validierung der echten Lohn- und Marktpreise.',
                prio: 'Sofort (P1)',
              },
              {
                num: 3, title: 'KI-Haftungs-De-Risking (HITL)',
                problem: 'KI schätzt m³ via Foto falsch → Festpreis wird zum Verlust.',
                loesung: 'KI baut Offerte nur als Draft. Versand erfordert menschlichen Klick. AGB-Vorbehaltsklausel ergänzen.',
                schritte: ['AGB-Update: "Preis basiert auf Fotos. Mehrvolumen wird nachverrechnet."', 'Workflow-Stopp in OpenClaw vor PDF-Versand'],
                ki: 'Intake, Foto-Analyse (Vision Skill), Preis-Berechnung, PDF-Drafting.',
                mensch: '30 Sekunden Review: Fotos vs. Preis → Klick auf "Approve & Send".',
                prio: 'Phase 2 (P1)',
              },
            ].map((sol, i) => (
              <div key={i} className="bg-violet-500/5 border border-violet-500/15 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold">{sol.num}</span>
                  <p className="text-sm font-bold text-white/90">{sol.title}</p>
                  <span className="ml-auto text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">{sol.prio}</span>
                </div>
                <p className="text-xs text-red-300/70">Problem: {sol.problem}</p>
                <p className="text-xs text-white/60">{sol.loesung}</p>
                <div className="space-y-1">
                  {sol.schritte.map((s, j) => <p key={j} className="text-xs text-white/50">→ {s}</p>)}
                </div>
                <div className="flex gap-4 text-xs mt-1">
                  <span className="text-cyan-400/70">🤖 KI: {sol.ki}</span>
                </div>
                <p className="text-xs text-yellow-400/70">👤 Mensch: {sol.mensch}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ═══ 25.7 AI & AUTOMATION DESIGN ═══ */}
      <Reveal>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-3">
          <h3 className="text-lg font-bold text-white">AI & Automation Design (HITL-Modell)</h3>
          <p className="text-xs text-white/50">Ziel: KI macht 90% der Routine, Mensch kontrolliert 100% der Risiken.</p>
          <div className="space-y-2">
            {[
              { id: 'A', title: 'Lead Intake & Qualifizierung', auto: 'Voll', system: 'WhatsApp API + OpenClaw Intake Agent', detail: 'KI fragt 5 Pflichtfelder ab, fordert Fotos an, pitcht Upsells.' },
              { id: 'B', title: 'Offerten-Vorbereitung', auto: 'Teil', system: 'OpenClaw Vision Estimator + Pricing Engine', detail: 'KI analysiert m³, wendet Preismatrix an, erstellt PDF. ZWINGENDER Freigabe-Button.' },
              { id: 'C', title: 'Follow-up & Kommunikation', auto: 'Voll', system: 'OpenClaw Cron/Follow-up Agent', detail: '24h nach Offertenversand: automatische Rückfrage via WhatsApp.' },
              { id: 'D', title: 'Reporting & Investor Updates', auto: 'Voll', system: 'OpenClaw Data Extraction Agent', detail: 'Freitags: CPL aus Ads + Deals aus CRM → Run-Status-Report.' },
              { id: 'E', title: 'Operations Prep', auto: 'Voll', system: 'Make/Zapier Automation', detail: 'Deal = Won → Kalenderblocker, Packliste an Team via WhatsApp.' },
            ].map((area, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-white/90">{area.id}) {area.title}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${area.auto === 'Voll' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {area.auto === 'Voll' ? '🤖 Voll-Auto' : '⚡ Teil-Auto + HITL'}
                  </span>
                </div>
                <p className="text-xs text-violet-400/70">{area.system}</p>
                <p className="text-xs text-white/50 mt-1">{area.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ═══ 25.8 IMPLEMENTATION ROADMAP ═══ */}
      <Reveal>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-3">
          <h3 className="text-lg font-bold text-white">Implementation Roadmap</h3>
          <div className="space-y-4">
            {[
              { phase: 'Phase 1: Sofort / 7 Tage', label: 'Story & Cleanup', color: 'red', todos: ['Pitchdeck umschreiben (Tech-Operator Pivot)', 'Ask auf 80k anpassen', 'Brands auf 1 reduzieren'], beweis: 'Neues, widerspruchsfreies Pitchdeck', ki: 'LLM Contradiction-Checker', nicht: 'Kein SEO-Scaling, bevor Story sitzt' },
              { phase: 'Phase 2: 30 Tage', label: 'Simulated Proof & Compliance', color: 'orange', todos: ['Pro-Forma Unit Economics (Excel)', 'GAV-Compliance prüfen', 'KI-Bild-Stresstest (20 Fälle)'], beweis: 'Excel-Kalkulation + KI-Stresstest-Logbuch', ki: 'OpenClaw Vision Skill kalibrieren', nicht: 'Keine Live-Leads ohne HITL' },
              { phase: 'Phase 3: Pre-Investor', label: 'Live Engine Test', color: 'emerald', todos: ['500 CHF Test-Ads schalten', 'Human-Approval-Layer implementieren', 'WhatsApp-Katalog Live-Demo'], beweis: 'Reale CPL-Daten + Live-Demo', ki: 'OpenClaw Intake Agent live (kontrolliert)', nicht: 'Keine autonomen Fixpreise' },
            ].map((phase, i) => (
              <div key={i} className="relative pl-6">
                <div className={`absolute left-0 top-1 w-3 h-3 rounded-full bg-${phase.color}-500/60`} />
                {i < 2 && <div className="absolute left-[5px] top-4 w-0.5 h-full bg-white/10" />}
                <div className="space-y-2">
                  <p className="text-sm font-bold text-white/90">{phase.phase} <span className="text-white/40 font-normal">— {phase.label}</span></p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-white/50 font-medium mb-1">To-dos:</p>
                      {phase.todos.map((t, j) => <p key={j} className="text-white/60">→ {t}</p>)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-white/50"><strong>Beweis:</strong> {phase.beweis}</p>
                      <p className="text-cyan-400/60">🤖 {phase.ki}</p>
                      <p className="text-red-300/60">⛔ {phase.nicht}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ═══ 25.9 CLAIM & PITCH CONTROL ═══ */}
      <Reveal>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-3">
          <h3 className="text-lg font-bold text-white">Claim & Pitch Control</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
              <p className="text-xs font-bold text-emerald-400 mb-2">✅ Sicher verwenden</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• "UX-Reibung senken durch Conversational Commerce via WhatsApp"</li>
                <li>• "5-Runs-Kill-Switch-Logik schützt Investorenkapital"</li>
              </ul>
            </div>
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-xs font-bold text-yellow-400 mb-2">⚠️ Vorsichtig formulieren</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• "KI-Offertenerstellung" → Zusatz: "…mit menschlicher Freigabe"</li>
                <li>• "40% DB-Marge" → Zusatz: "…Pro-Forma unter GAV"</li>
              </ul>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3">
              <p className="text-xs font-bold text-orange-400 mb-2">🔶 Zu gross / zu früh</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• "10 Revenue Streams" → Fokus auf Ausführung + Overflow</li>
                <li>• "4 Brands" → 1 Execution-Brand + 1 Inbound-Maschine</li>
              </ul>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
              <p className="text-xs font-bold text-red-400 mb-2">🚫 GAR NICHT verwenden</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• "Cherry-Picking" — zerstört B2B-Vertrauen</li>
                <li>• "0 CHF CAC" — faktisch falsch für Phase 1</li>
              </ul>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ═══ 25.10 INVESTOR READINESS CHECKLIST ═══ */}
      <Reveal>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-violet-400" /> Investor Readiness Checklist
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-white/60 mb-2">Vor dem ersten Gespräch (Hygiene)</p>
              <div className="space-y-1">
                {[
                  'Pitchdeck und Website fordern exakt 80k',
                  '"Cherry-Picking" restlos getilgt',
                  'WhatsApp-Katalog-Demo funktioniert fehlerfrei',
                  'Narrativ klar: "Tech-Enabled Operator"',
                ].map((item, i) => (
                  <label key={i} className="flex items-start gap-2 text-xs text-white/60">
                    <input type="checkbox" className="mt-0.5 rounded border-white/20" />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-white/60 mb-2">Vor Due Diligence (Proof)</p>
              <div className="space-y-1">
                {[
                  'Pro-Forma Unit Economics (inkl. GAV)',
                  'Juristisches Organigramm (KMU vs. Startup)',
                  'KI-Foto-Stresstest Logbuch',
                  'Muster-Arbeitsvertrag zur GAV-Compliance',
                ].map((item, i) => (
                  <label key={i} className="flex items-start gap-2 text-xs text-white/60">
                    <input type="checkbox" className="mt-0.5 rounded border-white/20" />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ═══ 25.11 FINAL VERDICT ═══ */}
      <Reveal>
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-violet-500/40 via-red-500/20 to-violet-500/40">
          <div className="rounded-2xl bg-black/80 p-5 space-y-4">
            <h3 className="text-lg font-bold text-white">Final Verdict — Gemini</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Aktuell nicht investierbar, weil es strategisch an <strong className="text-red-400">Masslosigkeit</strong> (4 Brands, 10 Revenue Streams) 
              und <strong className="text-red-400">gefährlicher Naivität</strong> ("0 CHF CAC", offenes B2B-Cherry-Picking) leidet. 
              Es pitcht Software-Margen für ein Geschäft, das im Kern aus schwitzenden Menschen und Lastwagen unter hartem Schweizer Arbeitsrecht besteht.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-bold text-white/60">Die 5 Voraussetzungen für Investierbarkeit:</p>
              {[
                'Strategischer Pivot: "KI-gesteuerte Next-Gen Umzugsfirma mit Overflow-Vermarktung"',
                'Saubere finanzielle Modellierung (Pro-Forma Unit Economics)',
                'Harter Human-in-the-Loop Freigabeprozess für alle KI-Fixpreise',
                'Absolute Konsistenz im Funding-Ask (80k Meilenstein-Logik)',
                'Fokus auf EINEN Kern-Funnel (Google Ads → WhatsApp → Feierabend Ausführung)',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-xs text-white/70">{item}</p>
                </div>
              ))}
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 mt-3">
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                <strong>Fazit:</strong> Technologisch (WhatsApp/Lovable) habt ihr der verstaubten Konkurrenz Jahre voraus. 
                Strategisch steht ihr euch selbst im Weg. Reduziert die Komplexität um 80%. 
                Wenn ihr diesen Fokus-Schnitt macht, transformiert sich das Projekt von einem "Chaos-Deck" 
                in einen der effizientesten Seed-Cases im Schweizer PropTech-Markt.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default GeminiBlueprint;
