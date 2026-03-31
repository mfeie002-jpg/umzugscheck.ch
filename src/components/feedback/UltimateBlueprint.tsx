import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, XCircle, 
  Shield, Zap, Target, FileText, Clock, BarChart3, Scale, Lightbulb,
  TrendingUp, AlertCircle, Eye, BookOpen, Layers, Bot, Users, Briefcase
} from 'lucide-react';

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
    'LÜCKE': 'bg-red-700/20 text-red-300 border-red-700/30',
    'ANNAHME': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'INVESTOREN-RISIKO': 'bg-red-600/20 text-red-300 border-red-600/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold rounded border ${styles[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {status}
    </span>
  );
};

const ScoreCell = ({ score }: { score: number }) => {
  const color = score <= 3 ? 'text-red-400 bg-red-500/10' : score <= 6 ? 'text-yellow-400 bg-yellow-500/10' : 'text-emerald-400 bg-emerald-500/10';
  return <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${color}`}>{score}</span>;
};

const SeverityBar = ({ level, max = 5 }: { level: number; max?: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: max }).map((_, i) => (
      <div key={i} className={`w-3 h-3 rounded-sm ${i < level ? (level >= 4 ? 'bg-red-500' : level >= 3 ? 'bg-orange-500' : 'bg-yellow-500') : 'bg-white/10'}`} />
    ))}
  </div>
);

const UltimateBlueprint = () => {
  return (
    <div className="space-y-6">
      
      {/* ═══ 26.1: TITEL & ZIEL ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-rose-400" />
            <h3 className="text-xl font-bold text-white">26.1 — Titel & Ziel des Dokuments</h3>
          </div>
          <div className="bg-gradient-to-br from-rose-500/10 via-purple-500/10 to-cyan-500/10 border border-rose-500/20 rounded-xl p-6 space-y-4">
            <h4 className="text-lg font-black text-white text-center">
              Investor Readiness Blueprint<br />
              <span className="text-sm font-normal text-white/60">Strategic Risk, De-Risking & AI-Execution Plan</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-white/70">
              <div><span className="text-white/40">Projekte:</span> Umzugscheck.ch & Feierabendservices.ch</div>
              <div><span className="text-white/40">Datum:</span> März 2026</div>
              <div><span className="text-white/40">Version:</span> 1.0 (Post-Due-Diligence Audit)</div>
              <div><span className="text-white/40">Status:</span> Pre-Live / Setup-Phase</div>
            </div>
            <p className="text-xs text-white/50 border-t border-white/10 pt-3">
              <strong className="text-white/70">Zweck:</strong> Operativer Masterplan zur Vorbereitung auf Seed-Investorengespräche. Bewertet das Hybridmodell schonungslos aus VC-Perspektive. 
              Ziel: Transformation eines aktuell strategisch widersprüchlichen und unbewiesenen Konzepts in einen investierbaren, maximal KI-automatisierten Business Case. 
              Nicht das Ziel: Motivation oder theoretisches Brainstorming. Dies ist ein harter Execution-Blueprint.
            </p>
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.2: EXECUTIVE SUMMARY ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-rose-400" />
            <h3 className="text-xl font-bold text-white">26.2 — Executive Summary</h3>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            <p className="text-sm text-white/70">
              Das Modell kombiniert organische und anzeigengesteuerte Lead-Akquise für Umzüge/Reinigungen im Schweizer Markt mit eigener operativer Ausführung. 
              Über WhatsApp-Katalog und die KI "OpenClaw" werden Leads friktionslos erfasst, vorqualifiziert und in Draft-Offerten umgewandelt. 
              Die profitabelsten Aufträge werden durch Feierabend Services abgewickelt, überschüssige Leads an Partner verkauft. 
              Durch 5 iterativ optimierte Test-Runs (Kill-Switch-Logik) und Meilenstein-Finanzierung (80k CHF) soll das Investorenrisiko minimiert werden.
            </p>
            
            <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="text-3xl font-black text-red-400">3/10</div>
              <div>
                <p className="text-xs font-bold text-red-300">Gesamteinschätzung Investierbarkeit</p>
                <p className="text-xs text-white/50">Aktuell nicht investierbar wegen strategischer Widersprüche und fehlender Proof-Architektur</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg space-y-1">
                <p className="text-xs font-bold text-emerald-400">✦ Wichtigste Stärken</p>
                <ul className="text-xs text-white/60 space-y-0.5">
                  <li>• Innovativer WhatsApp-Katalog-UX-Flow</li>
                  <li>• Modularer Cross-Selling-Ansatz (AOV-Maximierung)</li>
                  <li>• Integrierter 5-Runs-Kill-Switch</li>
                </ul>
              </div>
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg space-y-1">
                <p className="text-xs font-bold text-red-400">✦ Wichtigste Risiken</p>
                <ul className="text-xs text-white/60 space-y-0.5">
                  <li>• B2B-Marktplatz-Boykott wegen Eigenausführungs-Konflikt</li>
                  <li>• Google-Spam-Penalty für KI-Lokalseiten</li>
                  <li>• Operative Margen-Erosion durch GAV-Vorgaben</li>
                </ul>
              </div>
              <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg space-y-1">
                <p className="text-xs font-bold text-yellow-400">✦ Wichtigste Lücken</p>
                <ul className="text-xs text-white/60 space-y-0.5">
                  <li>• Reale Pro-Forma-Kalkulationen (Unit Economics)</li>
                  <li>• Bereinigung des Pitchdecks</li>
                  <li>• Juristische Struktur (Cap Table)</li>
                </ul>
              </div>
              <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg space-y-1">
                <p className="text-xs font-bold text-cyan-400">✦ Wichtigste Hebel</p>
                <ul className="text-xs text-white/60 space-y-0.5">
                  <li>• Strategischer Pivot zum "Tech-Enabled Operator"</li>
                  <li>• Pro-Forma Excel aufsetzen</li>
                  <li>• Human-in-the-Loop für KI-Offerten</li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
              <p className="text-xs text-white/70">
                <strong className="text-violet-300">Investierbarkeits-Urteil:</strong> Das Modell wird investierbar, sobald die Marktplatz-Illusion 
                ("Wir sind neutral") durch eine glasklare Operator-Logik ("Wir sind ein Tech-Handwerker mit Overflow-Vermarktung") 
                ersetzt wird und die physischen Ausführungsmargen mathematisch plausibel simuliert sind.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.3: MODELL-ÜBERSICHT ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-rose-400" />
            <h3 className="text-xl font-bold text-white">26.3 — Modell-Übersicht</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-blue-400">Umzugscheck.ch</p>
              <p className="text-xs text-white/50">Leadmaschine</p>
              <p className="text-xs text-white/60">Digitales Frontend. Generiert Traffic via Paid Ads (Phase 1) und SEO (Phase 2+). Zieht Nutzer durch extrem niedrige Einstiegshürden in den WhatsApp-Funnel.</p>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-orange-400">Feierabendservices.ch</p>
              <p className="text-xs text-white/50">Service-Operations</p>
              <p className="text-xs text-white/60">Der ausführende Muskel. Bietet Premium-Umzüge, Reinigung und Räumung an. Eigene Crews, eigene Qualitätskontrolle.</p>
            </div>
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-cyan-400">KI / Systeme</p>
              <p className="text-xs text-white/50">Der Klebstoff</p>
              <p className="text-xs text-white/60">OpenClaw als Disponent in WhatsApp: qualifiziert Leads, wertet Fotos aus, baut Offerten. Make/Zapier für Operations-Automation.</p>
            </div>
          </div>

          <Collapsible title="Wo Spannungen / Konflikte entstehen">
            <div className="space-y-2">
              <p className="text-xs text-white/60">
                Die Architektur versucht, zwei unvereinbare Geschäftsmodelle gleichzeitig zu sein: 
                Ein <strong className="text-white/80">neutraler Marktplatz</strong> (der vom Vertrauen der B2B-Partner lebt) und 
                ein <strong className="text-white/80">aggressiver Konkurrent</strong> (der die besten Leads selbst behält).
              </p>
              <p className="text-xs text-white/60">
                Zudem kollidiert die "unendliche Skalierbarkeit" der KI-Software hart mit der 
                fehleranfälligen, linearen Realität der physischen Logistik (Möbelschleppen).
              </p>
            </div>
          </Collapsible>
        </section>
      </Reveal>

      {/* ═══ 26.4: INVESTABILITY SCORECARD ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-rose-400" />
            <h3 className="text-xl font-bold text-white">26.4 — Investability Scorecard</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 text-white/40 font-medium">Bewertungsfeld</th>
                  <th className="text-center py-2 text-white/40 font-medium">Score</th>
                  <th className="text-left py-2 text-white/40 font-medium">Status</th>
                  <th className="text-left py-2 text-white/40 font-medium">Begründung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { field: 'Markt & Nachfrage', score: 9, status: 'Stark', reason: '406k Umzüge/Jahr. Inelastische Nachfrage.', badge: 'BEWIESEN' },
                  { field: 'Positionierung', score: 2, status: 'Kritisch', reason: 'Toxischer Konflikt: "Vergleichsportal" vs. "Cherry-Picker".', badge: 'INVESTOREN-RISIKO' },
                  { field: 'Leadgen / Akquise', score: 4, status: 'Mittel', reason: '"0 CHF CAC" SEO-Story ist für Phase 1 unrealistisch. Ads nötig.', badge: 'KRITISCHE LÜCKE' },
                  { field: 'Conversion (UX)', score: 8, status: 'Stark', reason: 'WhatsApp-Katalog-Flow ist exzellent und branchenführend.', badge: 'PLAUSIBEL' },
                  { field: 'Unit Economics', score: 2, status: 'Kritisch', reason: '40-45% DB-Marge unter GAV-Bedingungen.', badge: 'REINE ANNAHME' },
                  { field: 'Operations (Delivery)', score: 3, status: 'Kritisch', reason: 'LKW-Skalierung, Personal, Schäden vs. "92% KI".', badge: 'KRITISCHE LÜCKE' },
                  { field: 'Trust / Brand', score: 3, status: 'Kritisch', reason: '4 Brands zersplittern Budget; "Seit 1980" vs. "KI-Startup" verwirrt.', badge: 'ANNAHME' },
                  { field: 'Automatisierung / KI', score: 7, status: 'Stark', reason: 'Setup steht, aber Haftungsrisiko bei falscher KI-Preiskalkulation.', badge: 'PLAUSIBEL' },
                  { field: 'Investor Narrative', score: 2, status: 'Kritisch', reason: 'Ask-Diskrepanz (80k Web vs 100k Deck) zerstört Vertrauen sofort.', badge: 'RISIKO' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="py-2 text-white/80 font-medium">{row.field}</td>
                    <td className="py-2 text-center"><ScoreCell score={row.score} /></td>
                    <td className="py-2">
                      <span className={`text-xs font-bold ${row.status === 'Stark' ? 'text-emerald-400' : row.status === 'Mittel' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2 text-white/50">{row.reason} <StatusBadge status={row.badge} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.5: RISK MAP ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h3 className="text-xl font-bold text-white">26.5 — Risk Map</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { title: 'B2B-Partner Boykott', desc: 'Partner zahlen nicht für "Rest-Leads", wenn Plattform selbst Premium abwickelt.', why: 'B2B-Kanal bricht weg, Modell implodiert.', prob: 5, sev: 5, badge: 'RISIKO', indicator: '0% Close-Rate bei B2B-Akquise.' },
              { title: 'Funding-Inkonsistenz', desc: '80k Tranchen vs. 100k Loan im Pitchdeck.', why: 'VC bricht DD in Minute 1 wegen fehlender Finance-Hygiene ab.', prob: 5, sev: 5, badge: 'LÜCKE', indicator: 'Kritische Nachfrage im First Pitch.' },
              { title: 'GAV-Verstösse Ops', desc: 'Skalierung mit Freelancern verstösst gegen Schweizer Arbeitsrecht.', why: 'Bussen, Betriebsschliessung, Reputationsschaden.', prob: 3, sev: 4, badge: 'LÜCKE', indicator: 'Hoher Personalturnover.' },
              { title: 'KI-Festpreis Haftung', desc: 'KI schätzt m³ zu tief, Firma muss zum defizitären Fixpreis ausführen.', why: 'Marge wird negativ, Burn-Rate explodiert.', prob: 4, sev: 4, badge: 'ANNAHME', indicator: 'Reale m³ > KI-geschätzte m³.' },
              { title: 'SEO Spam Penalty', desc: 'Google de-indiziert 43.8k KI-Seiten.', why: 'Lead-Strom versiegt, CAC explodiert.', prob: 4, sev: 5, badge: 'ANNAHME', indicator: 'Search Console Drops.' },
            ].map((risk, i) => (
              <div key={i} className="bg-white/5 border border-red-500/20 rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-white">{risk.title}</p>
                    <p className="text-xs text-white/60">{risk.desc}</p>
                  </div>
                  <StatusBadge status={risk.badge} />
                </div>
                <p className="text-xs text-red-300"><strong>Warum kritisch:</strong> {risk.why}</p>
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1">Eintritt: <SeverityBar level={risk.prob} /></span>
                  <span className="flex items-center gap-1">Schwere: <SeverityBar level={risk.sev} /></span>
                </div>
                <p className="text-xs text-white/40"><strong>Frühindikator:</strong> {risk.indicator}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.6: GAP MAP ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">26.6 — Gap Map</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white/5 border border-red-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-red-400">Proof Gaps</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• Kein Beweis, dass KI-Bildschätzung präzise genug für Schweizer Margen ist <StatusBadge status="NICHT BELEGT" /></li>
                <li>• Kein Beweis, dass B2B-Kunden Overflow-Leads kaufen <StatusBadge status="NICHT BELEGT" /></li>
              </ul>
            </div>
            <div className="bg-white/5 border border-orange-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-orange-400">Economics Gaps</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• Kein Financial Model (Excel) für 20k-Tranche bis Break-Even</li>
                <li>• Keine GAV-konforme Pro-Forma-Nachkalkulation eines Standard-Jobs</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-yellow-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-yellow-400">Strategy & Positioning Gaps</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• Versuch, 4 Brands und 10 Revenue-Streams mit Pre-Seed-Geld aufzubauen</li>
                <li>• Zersplitterung des "Sorglos-Paket"-Narrativs durch unklare B2B-Neutralität</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-purple-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-purple-400">Documentation Gaps</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• Kein Cap Table / Organigramm (Trennung Alt-KMU vs. Tech-Holding)</li>
                <li>• "Cherry-Picking" im Pitchdeck ist ein Red Flag für VCs</li>
                <li>• Narrativ "0 CHF CAC" verschleiert Phase-1-Realität (Paid Ads)</li>
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.7: CONTRADICTION MAP ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-400" />
            <h3 className="text-xl font-bold text-white">26.7 — Contradiction Map</h3>
          </div>

          <div className="space-y-3">
            {[
              { 
                id: 'A', title: 'Plattform-Neutralität vs. Eigenausführung', 
                contradiction: 'Webseite claimt neutralen "Schweizer Umzugsvergleich", Deck offenbart Eigenausführung der besten Leads.',
                danger: 'Zerstört Partner-Vertrauen (B2B) und birgt UWG-Risiken (Kunde). VC sieht sofortigen Churn.'
              },
              { 
                id: 'B', title: 'Startup-Skalierung vs. "Familienbetrieb 1980"', 
                contradiction: '92% KI-Startup-Vision vs. 40 Jahre altes KMU-Badge.',
                danger: 'Investor weiss nicht, wem die IP gehört und ob er Altlasten einer alten GmbH mitfinanziert.'
              },
              { 
                id: 'C', title: 'Tech-Story vs. Operative Handwerksrealität', 
                contradiction: 'Software skaliert gratis; Möbelpacker, LKWs und Schadensfälle skalieren teuer und fehleranfällig.',
                danger: 'Unit Economics werden als naiv bewertet ("Tech-Bros, die das Handwerk nicht verstehen").'
              },
            ].map((c) => (
              <div key={c.id} className="bg-white/5 border-l-4 border-red-500 rounded-lg p-4 space-y-2">
                <p className="text-sm font-bold text-white">
                  <span className="text-red-400 mr-2">{c.id})</span>{c.title}
                </p>
                <p className="text-xs text-white/60"><strong className="text-white/80">Widerspruch:</strong> {c.contradiction}</p>
                <p className="text-xs text-red-300"><strong>Gefahr:</strong> {c.danger}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.8: SOLUTION BLUEPRINT ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">26.8 — Solution Blueprint</h3>
          </div>

          <Collapsible title="Lösung 1: Der 'Tech-Operator Pivot' (Auflösung Cherry-Picking)" defaultOpen>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <p className="text-xs text-red-300 font-bold">Problem</p>
                <p className="text-xs text-white/60">Offene Eigenausführungs-Bevorzugung killt den B2B-Marktplatz.</p>
              </div>
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                <p className="text-xs text-emerald-300 font-bold">Zielbild</p>
                <p className="text-xs text-white/60">Ihr seid NICHT "der neutrale Vergleich". Ihr seid "Feierabend Services, die erste KI-gesteuerte Premium-Umzugsfirma der Schweiz". Umzugscheck.ch ist eure interne Inbound-Maschine.</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-2">
                <p className="text-xs text-white/80 font-bold">Umsetzung</p>
                <ol className="text-xs text-white/60 space-y-1 list-decimal list-inside">
                  <li>"Cherry-Picking" aus Deck löschen.</li>
                  <li>Neues Narrativ: "Wir lasten unsere eigene Flotte mit maximaler Marge aus. Den organischen Lead-Overflow verkaufen wir an ausgewählte Partner."</li>
                </ol>
                <div className="flex gap-4 text-xs pt-2 border-t border-white/5">
                  <span className="text-cyan-400">🤖 KI: LLM Contradiction Checker über Deck</span>
                  <span className="text-orange-400">👤 Mensch: Strategische Entscheidung + Pitchen</span>
                </div>
                <p className="text-xs text-emerald-400">✓ Beweis danach: Widerspruchsfreies Pitchdeck</p>
              </div>
            </div>
          </Collapsible>

          <Collapsible title="Lösung 2: Pro-Forma Unit Economics & 80k Runway Model">
            <div className="space-y-3">
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <p className="text-xs text-red-300 font-bold">Problem</p>
                <p className="text-xs text-white/60">Fehlender Beweis der Rentabilität unter Schweizer GAV; Ask-Diskrepanz (80k vs 100k).</p>
              </div>
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                <p className="text-xs text-emerald-300 font-bold">Zielbild</p>
                <p className="text-xs text-white/60">Wasserdichtes Excel, das VCs zeigt: "Diese Jungs kennen ihre Zahlen." Phase 1 (20k) aufgeteilt in Ads-Budget, Software, Ops-Puffer. 1.500 CHF Job auf Rappen genau durchkalkuliert.</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-2">
                <p className="text-xs text-white/80 font-bold">Umsetzung</p>
                <ol className="text-xs text-white/60 space-y-1 list-decimal list-inside">
                  <li>Ask im Pitchdeck zwingend auf 80k anpassen.</li>
                  <li>Excel: Lohn gemäss GAV (inkl. Sozialleistungen), LKW-Miete, Sprit, Ads-CPL (z.B. 150 CHF) abziehen.</li>
                </ol>
                <div className="flex gap-4 text-xs pt-2 border-t border-white/5">
                  <span className="text-cyan-400">🤖 KI: LLM generiert Tabellenstruktur und Formel-Logik</span>
                  <span className="text-orange-400">👤 Mensch: Validierung der echten Lohn- und Marktpreise</span>
                </div>
                <p className="text-xs text-emerald-400">✓ Beweis danach: 1-Slide im Deck: "Unit Economics eines Premium-Jobs"</p>
              </div>
            </div>
          </Collapsible>

          <Collapsible title="Lösung 3: KI-Haftungs-De-Risking (Human-in-the-Loop)">
            <div className="space-y-3">
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <p className="text-xs text-red-300 font-bold">Problem</p>
                <p className="text-xs text-white/60">KI schätzt m³ via WhatsApp-Foto falsch → Festpreis wird zum Verlust.</p>
              </div>
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                <p className="text-xs text-emerald-300 font-bold">Zielbild</p>
                <p className="text-xs text-white/60">Maximale UX-Automatisierung mit 100% operativem Haftungsschutz. KI baut Offerte nur als Draft. Versand erfordert menschlichen Klick.</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-2">
                <p className="text-xs text-white/80 font-bold">Umsetzung</p>
                <ol className="text-xs text-white/60 space-y-1 list-decimal list-inside">
                  <li>AGB-Update: "Preis basiert auf Fotos. Signifikantes Mehrvolumen vor Ort wird nachverrechnet."</li>
                  <li>Workflow-Stopp in OpenClaw vor PDF-Versand.</li>
                </ol>
                <div className="flex gap-4 text-xs pt-2 border-t border-white/5">
                  <span className="text-cyan-400">🤖 OpenClaw: Intake, Foto-Analyse, Preis-Berechnung, PDF-Drafting</span>
                  <span className="text-orange-400">👤 Mensch: 30s Review Fotos vs. Preis → "Approve & Send"</span>
                </div>
                <p className="text-xs text-emerald-400">✓ Beweis danach: Protokollierter 20-Bilder Stresstest (KI vs. Reales Volumen)</p>
              </div>
            </div>
          </Collapsible>
        </section>
      </Reveal>

      {/* ═══ 26.9: AI & AUTOMATION DESIGN ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">26.9 — AI & Automation Design (HITL-Zielarchitektur)</h3>
          </div>
          <p className="text-xs text-white/50">Ziel: KI macht 90% der Routine, Mensch kontrolliert 100% der rechtlichen und operativen Risiken.</p>

          <div className="space-y-2">
            {[
              { area: 'A) Lead Intake & Qualifizierung', goal: '0% Formular-Abbrüche, 24/7 Erreichbarkeit', system: 'WhatsApp Business API + OpenClaw Intake Agent', auto: 'Voll', detail: 'KI fragt 5 Pflichtfelder ab, fordert Fotos an, pitcht Upsells über Katalog.' },
              { area: 'B) Offerten-Vorbereitung (Drafting)', goal: 'Offertenerstellung von 20 Min auf 2 Min', system: 'OpenClaw Vision Estimator + Pricing Engine', auto: 'Teil', detail: 'KI analysiert m³ aus Bildern, wendet Preismatrix an, erstellt PDF. ZWINGENDER Freigabe-Button.' },
              { area: 'C) Follow-up & Kundenkommunikation', goal: 'Conversion-Rate erhöhen ohne manuellen Sales', system: 'OpenClaw Cron/Follow-up Agent', auto: 'Voll', detail: '24h nach Offertenversand: "Haben Sie Fragen zur Offerte?" Checkt vorher CRM-Status.' },
              { area: 'D) Reporting & Investor Updates', goal: '5-Runs-Transparenz ohne Administrationsaufwand', system: 'OpenClaw Data Extraction Agent', auto: 'Voll', detail: 'Zieht freitags CPL aus Google Ads und Deals aus CRM, generiert Run-Status-Report.' },
              { area: 'E) Operations Prep (Disposition)', goal: 'Reibungsloser Übergang Sales → Execution', system: 'Make/Zapier Automatisierung', auto: 'Voll', detail: 'Bei Deal = Won → Kalenderblocker für LKW, Packliste an Zügelteam via WhatsApp.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white">{item.area}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${item.auto === 'Voll' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {item.auto === 'Voll' ? '🤖 Voll-Auto' : '🤖+👤 Teil-Auto'}
                  </span>
                </div>
                <p className="text-xs text-white/50"><strong>Ziel:</strong> {item.goal}</p>
                <p className="text-xs text-white/50"><strong>System:</strong> {item.system}</p>
                <p className="text-xs text-white/60">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.10: IMPLEMENTATION ROADMAP ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">26.10 — Implementation Roadmap</h3>
          </div>

          <div className="space-y-3">
            {[
              { phase: 'PHASE 1', time: 'Sofort / Nächste 7 Tage', title: 'Story & Cleanup', color: 'border-red-500', todos: ['Pitchdeck umschreiben (Tech-Operator Pivot)', 'Ask auf 80k anpassen', 'Brands auf 1 reduzieren'], proof: 'Neues, widerspruchsfreies Pitchdeck', ai: 'LLM Contradiction-Checker über das neue Deck', dont: 'Kein weiteres SEO-Scaling, bevor die Story nicht sitzt' },
              { phase: 'PHASE 2', time: 'Nächste 30 Tage', title: 'Simulated Proof & Compliance', color: 'border-yellow-500', todos: ['Pro-Forma Unit Economics (Excel) bauen', 'GAV-Compliance prüfen', 'KI-Bild-Stresstest (20 Fälle) durchführen'], proof: 'Excel-Kalkulation, Logbuch des KI-Stresstests', ai: 'OpenClaw Vision Skill kalibrieren', dont: '' },
              { phase: 'PHASE 3', time: 'Vor Investorengesprächen', title: 'Live Engine Test', color: 'border-emerald-500', todos: ['500 CHF Test-Ads schalten → WhatsApp-Katalog', '"Human-Approval-Layer" implementieren'], proof: 'Reale CPL-Daten, funktionierende Live-Demo', ai: 'OpenClaw Intake Agent "live" in kontrollierter Testumgebung', dont: '' },
            ].map((p, i) => (
              <div key={i} className={`bg-white/5 border-l-4 ${p.color} rounded-lg p-4 space-y-2`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white/40">{p.phase}</span>
                  <span className="text-sm font-bold text-white">{p.title}</span>
                  <span className="text-xs text-white/40 ml-auto">{p.time}</span>
                </div>
                <ul className="text-xs text-white/60 space-y-0.5">
                  {p.todos.map((t, j) => <li key={j}>• {t}</li>)}
                </ul>
                <div className="flex gap-4 text-xs text-white/50 pt-1 border-t border-white/5">
                  <span><strong className="text-emerald-400">Beweis:</strong> {p.proof}</span>
                </div>
                <p className="text-xs text-cyan-400">🤖 {p.ai}</p>
                {p.dont && <p className="text-xs text-red-300">⛔ {p.dont}</p>}
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.11: MASTER TODO LIST ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">26.11 — Master Todo List</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 text-white/40">Prio</th>
                  <th className="text-left py-2 text-white/40">Thema</th>
                  <th className="text-left py-2 text-white/40">Ziel</th>
                  <th className="text-center py-2 text-white/40">🤖</th>
                  <th className="text-center py-2 text-white/40">👤</th>
                  <th className="text-left py-2 text-white/40">Erfolgskriterium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { prio: 'P1', theme: 'Pitchdeck Pivot', goal: '"Cherry-Picking" entfernen', ai: 'Teilweise', human: 'JA', success: 'Widerspruchsfreies Deck' },
                  { prio: 'P1', theme: 'Funding Ask Sync', goal: '80k überall konsistent', ai: 'Nein', human: 'JA', success: '80k steht überall' },
                  { prio: 'P1', theme: 'Unit Economics Model', goal: 'Pro-Forma inkl. GAV-Löhnen', ai: 'Teilweise', human: 'JA', success: 'Plausible >30% Marge' },
                  { prio: 'P1', theme: 'Human-in-the-Loop', goal: 'KI-Offerten-Freigabe-Button', ai: 'JA', human: 'JA', success: 'Kein autonomer PDF-Versand' },
                  { prio: 'P2', theme: 'KI Foto-Stresstest', goal: 'Fehlerquote dokumentieren', ai: 'JA', human: 'JA', success: '20 Cases ausgewertet' },
                  { prio: 'P2', theme: 'WhatsApp Live-Demo', goal: 'Fehlerfreier Katalog-Flow', ai: 'JA', human: 'Nein', success: '10/10 Fälle fehlerfrei' },
                  { prio: 'P3', theme: 'GAV Legal Check', goal: 'Compliance Helfer-Verträge', ai: 'Teilweise', human: 'JA', success: 'Zero Schwarzarbeit-Risiko' },
                  { prio: 'P3', theme: 'Follow-up Agent', goal: '24h WhatsApp Nachfass', ai: 'JA', human: 'Nein', success: 'Höhere Close-Rate' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className={`py-2 font-bold ${row.prio === 'P1' ? 'text-red-400' : row.prio === 'P2' ? 'text-yellow-400' : 'text-blue-400'}`}>{row.prio}</td>
                    <td className="py-2 text-white/80 font-medium">{row.theme}</td>
                    <td className="py-2 text-white/60">{row.goal}</td>
                    <td className="py-2 text-center">{row.ai === 'JA' ? <span className="text-cyan-400">✓</span> : row.ai === 'Teilweise' ? <span className="text-yellow-400">◐</span> : <span className="text-white/30">✗</span>}</td>
                    <td className="py-2 text-center">{row.human === 'JA' ? <span className="text-orange-400">✓</span> : <span className="text-white/30">✗</span>}</td>
                    <td className="py-2 text-white/50">{row.success}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.12: CLAIM & PITCH CONTROL ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-violet-400" />
            <h3 className="text-xl font-bold text-white">26.12 — Claim & Pitch Control</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-emerald-400">A) Sicher verwenden ✓</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• "Wir senken die UX-Reibung extrem durch Conversational Commerce via WhatsApp."</li>
                <li>• "Wir nutzen eine 5-Runs-Kill-Switch-Logik, um Ihr Kapital zu schützen."</li>
              </ul>
            </div>
            <div className="bg-yellow-500/5 border border-yellow-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-yellow-400">B) Vorsichtig formulieren ⚠</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• "Wir automatisieren Offerten durch KI." → <em className="text-yellow-300">Zusatz: "...aber jeder Fixpreis unterliegt menschlicher Freigabe."</em></li>
                <li>• "Wir zielen auf 40% DB-Marge." → <em className="text-yellow-300">Zusatz: "...basierend auf Pro-Forma-Simulationen unter GAV."</em></li>
              </ul>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-orange-400">C) Zu gross / zu früh ◐</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• "Wir etablieren 10 Revenue Streams." → <em className="text-orange-300">Sagt: "Wir fokussieren 100% auf hochmargige Ausführung + Overflow."</em></li>
                <li>• "Wir nutzen 4 Brands." → <em className="text-orange-300">Sagt: "1 Execution-Brand, 1 Inbound-Maschine."</em></li>
              </ul>
            </div>
            <div className="bg-red-500/5 border border-red-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-red-400">D) GAR NICHT verwenden ✗</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• "Wir betreiben Cherry-Picking." — <em className="text-red-300">Zerstört B2B-Vertrauen präventiv.</em></li>
                <li>• "Wir haben 0 CHF CAC." — <em className="text-red-300">Faktisch falsch für Phase 1.</em> <StatusBadge status="NICHT BELEGT" /></li>
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.13: INVESTOR READINESS CHECKLIST ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">26.13 — Investor Readiness Checklist</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-white/80">Vor dem ersten Investorengespräch (Hygiene)</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li className="flex items-center gap-2"><span className="w-4 h-4 border border-white/20 rounded text-center text-[8px] leading-4">☐</span> Pitchdeck und Website fordern exakt 80k</li>
                <li className="flex items-center gap-2"><span className="w-4 h-4 border border-white/20 rounded text-center text-[8px] leading-4">☐</span> "Cherry-Picking" restlos getilgt</li>
                <li className="flex items-center gap-2"><span className="w-4 h-4 border border-white/20 rounded text-center text-[8px] leading-4">☐</span> WhatsApp-Katalog-Demo funktioniert fehlerfrei</li>
                <li className="flex items-center gap-2"><span className="w-4 h-4 border border-white/20 rounded text-center text-[8px] leading-4">☐</span> Narrativ klar: "Tech-Enabled Operator"</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-white/80">Vor der Due Diligence (Proof)</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li className="flex items-center gap-2"><span className="w-4 h-4 border border-white/20 rounded text-center text-[8px] leading-4">☐</span> Excel: Pro-Forma Unit Economics (inkl. CAC, GAV-Lohn)</li>
                <li className="flex items-center gap-2"><span className="w-4 h-4 border border-white/20 rounded text-center text-[8px] leading-4">☐</span> Legal: Organigramm (Trennung KMU vs. Tech-Startup)</li>
                <li className="flex items-center gap-2"><span className="w-4 h-4 border border-white/20 rounded text-center text-[8px] leading-4">☐</span> Tech: Logbuch KI-Foto-Stresstest</li>
                <li className="flex items-center gap-2"><span className="w-4 h-4 border border-white/20 rounded text-center text-[8px] leading-4">☐</span> Ops: Muster-Arbeitsvertrag zur GAV-Compliance</li>
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.14: FINAL VERDICT ═══ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-rose-400" />
            <h3 className="text-xl font-bold text-white">26.14 — Final Verdict</h3>
          </div>

          <div className="bg-gradient-to-br from-rose-500/10 via-violet-500/10 to-cyan-500/10 border border-rose-500/20 rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-bold text-red-300">Warum aktuell noch nicht investierbar?</p>
              <p className="text-xs text-white/60">
                Weil es strategisch an Masslosigkeit (4 Brands, 10 Revenue Streams) und gefährlicher Naivität 
                ("0 CHF CAC", offenes B2B-Cherry-Picking) leidet. Es pitcht Software-Margen für ein Geschäft, 
                das im Kern aus schwitzenden Menschen und Lastwagen unter hartem Schweizer Arbeitsrecht besteht.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold text-emerald-300">Die 5 Voraussetzungen für Investierbarkeit</p>
              <ol className="text-xs text-white/60 space-y-1 list-decimal list-inside">
                <li>Strategischer Pivot vom "verwirrenden Marktplatz" zur "KI-gesteuerten Next-Gen Umzugsfirma mit Overflow-Vermarktung"</li>
                <li>Saubere finanzielle Modellierung (Pro-Forma Unit Economics)</li>
                <li>Harter Human-in-the-Loop Freigabeprozess für alle KI-Fixpreise</li>
                <li>Absolute Konsistenz im Funding-Ask (80k Meilenstein-Logik)</li>
                <li>Fokus auf EINEN Kern-Funnel (Google Ads → WhatsApp Katalog → Feierabend Services Ausführung)</li>
              </ol>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="text-sm font-bold text-white">Fazit & Handlungsempfehlung</p>
              <p className="text-xs text-white/70 mt-2">
                <strong className="text-cyan-300">Technologisch</strong> (WhatsApp/Lovable) habt ihr der verstaubten Konkurrenz Jahre voraus. 
                <strong className="text-red-300"> Strategisch</strong> steht ihr euch selbst im Weg. 
                Reduziert die Komplexität um 80%. Lasst OpenClaw den Front-Desk vollautomatisch schmeissen. 
                Konzentriert eure menschliche Energie auf den "Approve-Button", die reale physische Ausführung in 
                bester Schweizer Qualität und das Pitching der 80k-Story.
              </p>
              <p className="text-xs text-emerald-400 mt-2 font-bold">
                Wenn ihr diesen Fokus-Schnitt macht, transformiert sich das Projekt von einem "Chaos-Deck" 
                in einen der effizientesten Seed-Cases im Schweizer PropTech-Markt.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

    </div>
  );
};

export default UltimateBlueprint;
