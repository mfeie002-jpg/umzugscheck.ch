import { 
  AlertTriangle, CheckCircle2, XCircle, Shield, Zap, Target, FileText, 
  Clock, BarChart3, Scale, Lightbulb, Eye, Layers, Bot, Briefcase, 
  TrendingDown, Crosshair, BookOpen
} from 'lucide-react';
import { 
  Reveal, StatusBadge, ScoreCell, SeverityBar, Collapsible, 
  SectionHeader, SolutionCard, ChecklistItem, RiskCard 
} from './shared';

// ─── Data Constants (single source of truth) ───

const SCORECARD_DATA = [
  { field: 'Markt & Nachfrage', score: 9, status: 'Stark' as const, reason: '406k Umzüge/Jahr (BFS). Inelastische Nachfrage. Markt wächst mit Bevölkerung.', badge: 'BEWIESEN' },
  { field: 'Positionierung', score: 2, status: 'Kritisch' as const, reason: '"Neutraler Vergleich" widerspricht Eigenausführung. Muss entschieden werden.', badge: 'INVESTOREN-RISIKO' },
  { field: 'Leadgen / Akquise', score: 4, status: 'Mittel' as const, reason: 'Phase 1 benötigt zwingend Paid Ads (150-250 CHF CPL geschätzt). SEO erst ab Phase 2+.', badge: 'KRITISCHE LÜCKE' },
  { field: 'Conversion (UX)', score: 8, status: 'Stark' as const, reason: 'WhatsApp-Katalog-Flow eliminiert Formular-Friction. Branchenführend in CH.', badge: 'PLAUSIBEL' },
  { field: 'Unit Economics', score: 2, status: 'Kritisch' as const, reason: '40-45% DB-Marge reine Annahme. Kein Pro-Forma unter GAV-Vollkosten vorhanden.', badge: 'REINE ANNAHME' },
  { field: 'Operations (Delivery)', score: 3, status: 'Kritisch' as const, reason: 'LKW-Skalierung, Personal, Schadensfälle. Physische Logistik ≠ Software-Marge.', badge: 'KRITISCHE LÜCKE' },
  { field: 'Trust / Brand', score: 3, status: 'Kritisch' as const, reason: '4 Brands verwirren. "Seit 1980" vs. "KI-Startup" erzeugt Identitätskrise.', badge: 'ANNAHME' },
  { field: 'Automatisierung / KI', score: 7, status: 'Stark' as const, reason: 'OpenClaw + WhatsApp steht. Aber Haftungsrisiko bei autonomen Fixpreisen.', badge: 'PLAUSIBEL' },
  { field: 'Investor Narrative', score: 2, status: 'Kritisch' as const, reason: 'Ask-Diskrepanz (80k vs. 100k) ist sofortiger Deal-Breaker in jeder DD.', badge: 'RISIKO' },
];

const RISK_DATA = [
  { title: 'B2B-Partner Boykott', desc: 'Partner zahlen nicht für "Rest-Leads", wenn Plattform selbst die Premium-Jobs abwickelt.', why: 'Ohne B2B-Kanal fällt eine ganze Revenue-Säule weg. Das Modell verliert seine Skalierungslogik jenseits eigener Kapazität.', prob: 5, sev: 5, badge: 'RISIKO', indicator: '0% Close-Rate bei den ersten 5 B2B-Akquise-Versuchen.', mitigation: 'Tech-Operator Pivot: Offen kommunizieren, dass Leads nur bei Kapazitätsüberschuss weitergegeben werden. Keine Neutralitäts-Illusion.' },
  { title: 'Funding-Inkonsistenz', desc: '80k Tranchen auf der Website vs. 100k Convertible Loan im Pitchdeck.', why: 'Investor sieht in der ersten DD-Minute zwei verschiedene Zahlen → sofortiger Vertrauensbruch. Kein Recover möglich.', prob: 5, sev: 5, badge: 'LÜCKE', indicator: '"Welcher Betrag stimmt?" als erste Investoren-Frage.', mitigation: 'Sofort: Alle Materialien auf 80k mit 4×20k Meilenstein-Logik vereinheitlichen.' },
  { title: 'GAV-Verstösse Operations', desc: 'Skalierung mit Freelancern/Studenten verstösst ggf. gegen GAV für das Transportgewerbe.', why: 'Bussen bis CHF 200k, Betriebsschliessung, Reputationsschaden. Kein Investor finanziert Compliance-Risiken.', prob: 3, sev: 4, badge: 'LÜCKE', indicator: 'Hoher Personalturnover oder erste SECO-Anfrage.', mitigation: 'Vor Skalierung: GAV-Compliance-Check durch Arbeitsrechtler. Muster-Arbeitsvertrag erstellen.' },
  { title: 'KI-Festpreis Haftung', desc: 'KI schätzt m³ via WhatsApp-Foto zu tief → Firma muss zum defizitären Fixpreis ausführen.', why: 'Ein einziger Grossauftrag mit 30% Fehlschätzung kann den Monatsgewinn eliminieren.', prob: 4, sev: 4, badge: 'ANNAHME', indicator: 'Reales Volumen > KI-geschätztes Volumen in >20% der Fälle.', mitigation: 'Human-in-the-Loop: KI erstellt Draft, Mensch gibt frei. AGB-Klausel für Mehrvolumen-Nachverrechnung.' },
  { title: 'SEO Spam Penalty', desc: 'Google de-indiziert 43.8k automatisch generierte Lokalseiten.', why: 'Der gesamte organische Lead-Strom (Phase 2+ Kern-Strategie) versiegt. CAC explodiert auf reines Paid.', prob: 4, sev: 5, badge: 'ANNAHME', indicator: 'Search Console zeigt Coverage-Drops oder Manual Actions.', mitigation: 'Qualitätsprüfung der Gemeinde-Seiten. Thin Content eliminieren. Unique lokale Daten integrieren.' },
  { title: 'Solo-Founder Überlastung', desc: 'Ein Gründer baut Portal, führt Umzüge durch, pitcht Investoren und managed KI-Systeme parallel.', why: 'Burnout-Risiko, Qualitätsverlust auf allen Fronten, kein Investor finanziert eine Single-Point-of-Failure-Struktur.', prob: 4, sev: 3, badge: 'RISIKO', indicator: 'Response-Time auf Kundenanfragen steigt über 24h.', mitigation: 'KI-Delegation maximieren. Erste Einstellung (Ops-Lead) ab Meilenstein 2 vorsehen.' },
];

const TODO_DATA = [
  { prio: 'P1', theme: 'Pitchdeck Pivot', goal: '"Cherry-Picking" entfernen, Tech-Operator Narrativ', ai: 'Teilweise' as const, human: true, success: 'Widerspruchsfreies Deck, 0 Red Flags' },
  { prio: 'P1', theme: 'Funding Ask Sync', goal: '80k mit 4×20k Meilenstein-Logik überall konsistent', ai: 'Nein' as const, human: true, success: '80k steht in Deck, Web, One-Pager identisch' },
  { prio: 'P1', theme: 'Unit Economics Model', goal: 'Pro-Forma Vollkostenrechnung inkl. GAV-Löhne', ai: 'Teilweise' as const, human: true, success: 'Excel zeigt plausible >30% DB-Marge nach GAV' },
  { prio: 'P1', theme: 'Human-in-the-Loop', goal: 'Freigabe-Button vor jedem KI-Offerten-Versand', ai: 'JA' as const, human: true, success: 'Kein autonomer PDF-Versand möglich' },
  { prio: 'P1', theme: 'Brand Consolidation', goal: '4 Brands → 2 (Feierabend + Umzugscheck)', ai: 'Nein' as const, human: true, success: 'Website, Pitch, Materialien zeigen nur 2 Brands' },
  { prio: 'P2', theme: 'KI Foto-Stresstest', goal: 'Fehlerquote der m³-Schätzung dokumentieren', ai: 'JA' as const, human: true, success: '20 Cases, <15% Abweichung im Median' },
  { prio: 'P2', theme: 'WhatsApp Live-Demo', goal: 'Fehlerfreier End-to-End Katalog-Flow', ai: 'JA' as const, human: false, success: 'Funktioniert in 10/10 Live-Tests' },
  { prio: 'P2', theme: '500 CHF Ads-Test', goal: 'Reale CPL-Daten für den Pitch', ai: 'Teilweise' as const, human: true, success: 'CPL < 200 CHF, >5 qualifizierte Leads' },
  { prio: 'P3', theme: 'GAV Legal Check', goal: 'Compliance der Helfer-Verträge absichern', ai: 'Teilweise' as const, human: true, success: 'Anwalts-Bestätigung, Zero Schwarzarbeit-Risiko' },
  { prio: 'P3', theme: 'Cap Table / Organigramm', goal: 'Juristische Trennung KMU vs. Tech-Startup', ai: 'Nein' as const, human: true, success: 'Sauberes Organigramm im Pitch-Anhang' },
  { prio: 'P3', theme: 'Follow-up Agent', goal: '24h automatische WhatsApp-Nachfass-Regel', ai: 'JA' as const, human: false, success: 'Messbar höhere Close-Rate vs. Baseline' },
];

const UltimateBlueprint = () => {
  return (
    <div className="space-y-6">
      
      {/* ═══ 26.1: DOKUMENTEN-KONTEXT ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={FileText} number="26.1" title="Dokumenten-Kontext & Methodologie" />
          <div className="bg-gradient-to-br from-rose-500/10 via-purple-500/10 to-cyan-500/10 border border-rose-500/20 rounded-xl p-6 space-y-4">
            <h4 className="text-lg font-black text-white text-center">
              Investor Readiness Blueprint — Ultimate Edition
              <br />
              <span className="text-sm font-normal text-white/60">Konsolidierung aus 5 Analyse-Runden + Gemini-Audit</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-white/70">
              <div><span className="text-white/40">Projekte:</span> Umzugscheck.ch & Feierabendservices.ch</div>
              <div><span className="text-white/40">Datum:</span> 31. März 2026</div>
              <div><span className="text-white/40">Version:</span> 2.0 (Quality-Reviewed)</div>
              <div><span className="text-white/40">Status:</span> Pre-Live / Setup-Phase</div>
            </div>
            <div className="border-t border-white/10 pt-3 space-y-2">
              <p className="text-xs text-white/50">
                <strong className="text-white/70">Zweck:</strong> Dieses Dokument konsolidiert alle Erkenntnisse aus 5 unabhängigen Analyse-Runden 
                (inkl. Gemini-Audit) in ein einziges, operativ nutzbares Strategie- und Investor-Readiness-Dokument.
              </p>
              <p className="text-xs text-white/50">
                <strong className="text-white/70">Methodologie:</strong> Jede Bewertung folgt der skeptischsten plausiblen Interpretation. 
                Unbelegte Claims werden als Risiko, nicht als Pluspunkt behandelt. Quellen: Lovable-Analyse (Prompt 1-4), 
                Meta-Feedback, Gemini-Audit, öffentlich verfügbare BFS-Daten.
              </p>
              <p className="text-xs text-white/50">
                <strong className="text-white/70">Wichtiger Kontext:</strong> Beide Projekte sind Pre-Revenue / Pre-Traction. 
                Die Bewertung erfolgt als Startup-Assessment, nicht als Bestandsgeschäft-Analyse. 
                Fehlende Traktion ist daher kein automatisches Kill-Kriterium, aber fehlende Beweisarchitektur ist eines.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.2: EXECUTIVE SUMMARY ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={BarChart3} number="26.2" title="Executive Summary" />
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            <p className="text-sm text-white/70 leading-relaxed">
              Das Hybridmodell kombiniert ein SEO-/Ads-getriebenes Vergleichsportal (umzugscheck.ch) als Lead-Maschine 
              mit einem eigenen operativen Service-Betrieb (feierabendservices.ch). Die KI "OpenClaw" verbindet beide Seiten 
              über WhatsApp: Lead-Intake, Foto-basierte Volumenschätzung, automatisierte Draft-Offerten. 
              Finanzierungsmodell: 80k CHF in 4 Meilenstein-Tranchen à 20k mit Kill-Switch-Logik nach jedem Run.
            </p>
            
            <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-black text-red-400">3/10</div>
                <p className="text-[10px] text-white/40 mt-1">Investierbarkeit</p>
              </div>
              <div className="border-l border-white/10 pl-4 space-y-1">
                <p className="text-xs font-bold text-red-300">Aktuell nicht investierbar</p>
                <p className="text-xs text-white/50">
                  Gründe: Strategischer Identitätskonflikt (Marktplatz vs. Operator), fehlende Unit Economics, 
                  Funding-Inkonsistenz, zu viele Brands/Revenue-Streams für Pre-Seed.
                </p>
                <p className="text-xs text-emerald-400/70">
                  Aber: Starker Markt (406k Umzüge/Jahr), innovative UX (WhatsApp-Katalog), 
                  und strukturierte Kill-Switch-Logik zeigen operative Reife.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg space-y-1">
                <p className="text-xs font-bold text-emerald-400">✦ Stärken (belegt/plausibel)</p>
                <ul className="text-xs text-white/60 space-y-0.5">
                  <li>• WhatsApp-Katalog-UX eliminiert Formular-Friction</li>
                  <li>• Modularer Cross-Selling (Umzug → Reinigung → Entsorgung)</li>
                  <li>• 5-Runs-Kill-Switch schützt Investorenkapital</li>
                  <li>• 406k Umzüge/Jahr = beweisbar grosser Markt</li>
                </ul>
              </div>
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg space-y-1">
                <p className="text-xs font-bold text-red-400">✦ Risiken (kritisch)</p>
                <ul className="text-xs text-white/60 space-y-0.5">
                  <li>• Cherry-Picking zerstört B2B-Vertrauen präventiv</li>
                  <li>• 43.8k KI-Seiten → Google Spam-Penalty-Risiko</li>
                  <li>• GAV-Compliance bei Freelancer-Skalierung ungeklärt</li>
                  <li>• Solo-Founder betreibt Portal + Umzüge + KI + Pitch</li>
                </ul>
              </div>
              <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg space-y-1">
                <p className="text-xs font-bold text-yellow-400">✦ Kritische Lücken</p>
                <ul className="text-xs text-white/60 space-y-0.5">
                  <li>• Keine Pro-Forma-Kalkulation unter GAV-Vollkosten</li>
                  <li>• Kein Cap Table / Organigramm (Alt-KMU vs. Tech)</li>
                  <li>• Kein dokumentierter End-to-End Portal-Umsatz</li>
                  <li>• Ask-Diskrepanz: 80k Website vs. 100k Deck</li>
                </ul>
              </div>
              <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg space-y-1">
                <p className="text-xs font-bold text-cyan-400">✦ Grösste Hebel (sofort umsetzbar)</p>
                <ul className="text-xs text-white/60 space-y-0.5">
                  <li>• Pivot: "Tech-Enabled Operator" statt "Neutraler Vergleich"</li>
                  <li>• Unit Economics Excel mit GAV-Vollkosten</li>
                  <li>• Human-in-the-Loop für alle KI-Fixpreise</li>
                  <li>• 500 CHF Ads-Test für reale CPL-Daten</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.3: MODELL-ÜBERSICHT ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Layers} number="26.3" title="Modell-Übersicht & Spannungsfelder" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-blue-400">🔍 Umzugscheck.ch</p>
              <p className="text-xs text-white/40 font-medium">LEAD-MASCHINE</p>
              <p className="text-xs text-white/60">SEO-Seiten + Paid Ads → Vergleichsportal-UX → WhatsApp-Katalog-Funnel. Zielt auf maximale Lead-Erfassung bei minimaler Friction.</p>
              <p className="text-xs text-white/40 mt-2">Phase 1: Google Ads · Phase 2+: Organisch</p>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-orange-400">🚛 Feierabendservices.ch</p>
              <p className="text-xs text-white/40 font-medium">SERVICE-EXECUTION</p>
              <p className="text-xs text-white/60">Premium-Umzüge, Endreinigung, Räumung. Eigene Crews. Qualitätskontrolle. Der physische Wertschöpfungsanker.</p>
              <p className="text-xs text-white/40 mt-2">Marge: Ziel 40-45% DB (unbewiesen)</p>
            </div>
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-cyan-400">🤖 KI / OpenClaw</p>
              <p className="text-xs text-white/40 font-medium">SYSTEMKLEBSTOFF</p>
              <p className="text-xs text-white/60">Lead-Qualifizierung via WhatsApp, Foto-basierte m³-Schätzung (Vision), Draft-Offerten, 24h Follow-up, Reporting.</p>
              <p className="text-xs text-white/40 mt-2">Guardrail: Human-Approval vor Versand</p>
            </div>
          </div>

          <Collapsible title="Kernspannung: Marktplatz vs. Operator (das zentrale Strukturproblem)" defaultOpen>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <p className="text-xs text-white/70 leading-relaxed">
                  <strong className="text-red-300">Das Problem:</strong> Die Architektur versucht, ein <em>neutrales Vergleichsportal</em> zu sein 
                  (das vom Vertrauen der B2B-Partner lebt) und gleichzeitig ein <em>aggressiver Konkurrent</em> (der die besten Leads selbst behält). 
                  Das ist kein Optimierungsproblem — es ist ein <strong className="text-white">struktureller Widerspruch</strong>, 
                  der beide Modellhälften beschädigt.
                </p>
              </div>
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                <p className="text-xs text-white/70 leading-relaxed">
                  <strong className="text-emerald-300">Die Lösung (konsolidiert aus allen Analysen):</strong> Nicht "neutral" sein. 
                  Offen als <strong className="text-white">Tech-Enabled Operator</strong> auftreten: "Wir sind Feierabend Services, 
                  die erste KI-gesteuerte Premium-Umzugsfirma der Schweiz. Umzugscheck.ch ist unsere Inbound-Maschine. 
                  Was wir kapazitätsbedingt nicht selbst schaffen, geben wir an ausgewählte Partner weiter."
                </p>
              </div>
            </div>
          </Collapsible>

          <Collapsible title="Zweite Spannung: Software-Skalierung vs. physische Logistik">
            <p className="text-xs text-white/60">
              KI-Systeme skalieren nahezu kostenlos. Möbelpacker, Transporter, Schadensfälle und Schweizer Arbeitsrecht skalieren 
              teuer und fehleranfällig. Jeder Investor wird fragen: "Wo genau endet die Software-Marge und beginnt die Handwerks-Realität?" 
              Ohne Pro-Forma-Kalkulation bleibt das eine offene Flanke.
            </p>
          </Collapsible>
        </section>
      </Reveal>

      {/* ═══ 26.4: INVESTABILITY SCORECARD ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Target} number="26.4" title="Investability Scorecard" />
          <p className="text-xs text-white/40">Gewichteter Durchschnitt: 4.7/10 · Median: 3/10 · Kritische Felder (Score ≤3): 5 von 9</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 text-white/40 font-medium">Bewertungsfeld</th>
                  <th className="text-center py-2 text-white/40 font-medium w-16">Score</th>
                  <th className="text-left py-2 text-white/40 font-medium w-20">Status</th>
                  <th className="text-left py-2 text-white/40 font-medium">Begründung & Belegstatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {SCORECARD_DATA.map((row, i) => (
                  <tr key={i} className={row.score <= 3 ? 'bg-red-500/5' : ''}>
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
          <SectionHeader icon={AlertTriangle} number="26.5" title="Risk Map (erweitert)" />
          <p className="text-xs text-white/40">6 Risiken nach Eintrittswahrscheinlichkeit × Schweregrad priorisiert. Neu: Mitigations-Strategien pro Risiko.</p>
          
          <div className="space-y-3">
            {RISK_DATA.map((risk, i) => (
              <RiskCard key={i} {...risk} />
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.6: GAP MAP ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Eye} number="26.6" title="Gap Map (5 Kategorien)" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white/5 border border-red-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-red-400">🔴 Proof Gaps</p>
              <ul className="text-xs text-white/60 space-y-1.5">
                <li>• KI-Bildschätzung: Keine Validierung gegen reale m³ <StatusBadge status="NICHT BELEGT" /></li>
                <li>• B2B-Overflow-Modell: Kein Partner hat bezahlt <StatusBadge status="NICHT BELEGT" /></li>
                <li>• Portal-Umsatz: Kein End-to-End Revenue dokumentiert <StatusBadge status="NICHT BELEGT" /></li>
              </ul>
            </div>
            <div className="bg-white/5 border border-orange-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-orange-400">🟠 Economics Gaps</p>
              <ul className="text-xs text-white/60 space-y-1.5">
                <li>• Kein Financial Model (Excel) das 20k → Break-Even zeigt</li>
                <li>• Keine GAV-konforme Vollkostenrechnung (Sozialleistungen, BVG, UVG)</li>
                <li>• Kein realer CPL-Benchmark (nur Annahme: 150-250 CHF)</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-yellow-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-yellow-400">🟡 Strategy Gaps</p>
              <ul className="text-xs text-white/60 space-y-1.5">
                <li>• 4 Brands + 10 Revenue-Streams bei 80k Budget = Verzettelung</li>
                <li>• Keine klare Startwette: 1 Region, 1 Service, 1 Zielgruppe</li>
                <li>• Positioning ungeklärt: Marktplatz vs. Operator</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-purple-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-purple-400">🟣 Documentation Gaps</p>
              <ul className="text-xs text-white/60 space-y-1.5">
                <li>• Kein Cap Table / Organigramm (Trennung Alt-KMU vs. Tech-Holding)</li>
                <li>• Ask-Diskrepanz nicht bereinigt (80k vs. 100k)</li>
                <li>• "Cherry-Picking" steht noch im Deck</li>
              </ul>
            </div>
            <div className="md:col-span-2 bg-white/5 border border-cyan-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-cyan-400">🔵 Messaging Gaps</p>
              <ul className="text-xs text-white/60 space-y-1.5">
                <li>• "0 CHF CAC" Claim ist toxisch — verschleiert Phase-1-Realität (Paid Ads zwingend nötig)</li>
                <li>• "92% KI-Automatisierung" übertreibt den aktuellen Stand — Draft-Offerten ≠ autonome Preisgebung</li>
                <li>• "Seit 1980" vs. "KI-Startup" erzeugt Brand-Verwirrung — Investor weiss nicht, was er finanziert</li>
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.7: CONTRADICTION MAP ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={XCircle} number="26.7" title="Contradiction Map" />

          <div className="space-y-3">
            {[
              { 
                id: 'A', title: 'Plattform-Neutralität vs. Eigenausführung', 
                contradiction: 'Webseite claimt neutralen "Schweizer Umzugsvergleich", Deck offenbart Eigenausführung der besten Leads ("Cherry-Picking").',
                danger: 'Zerstört Partner-Vertrauen (B2B-Kanal bricht weg) und birgt UWG-Risiken (Kunde wird getäuscht). VC sieht sofortigen Churn.',
                resolution: 'Tech-Operator Pivot: Offen als "KI-gesteuerte Premium-Umzugsfirma mit Overflow-Vermarktung" auftreten.'
              },
              { 
                id: 'B', title: 'Startup-Skalierung vs. "Familienbetrieb 1980"', 
                contradiction: '92% KI-Startup-Vision vs. 40 Jahre altes KMU-Badge auf der gleichen Website.',
                danger: 'Investor weiss nicht, wem die IP gehört und ob er Altlasten einer GmbH mitfinanziert. Brand-Identitätskrise.',
                resolution: 'Sauberes Organigramm: Tech-Startup als eigene Entität. Alt-KMU als Referenz für operatives Know-how, nicht als rechtliche Basis.'
              },
              { 
                id: 'C', title: 'Software-Marge vs. Handwerks-Realität', 
                contradiction: 'Pitch suggeriert Software-artige Skalierung. Kern-Geschäft besteht aus LKWs, Packern und Schadensfällen.',
                danger: 'Unit Economics werden als naiv bewertet. VCs fragen: "Habt ihr schon mal einen LKW gemietet?"',
                resolution: 'Pro-Forma Kalkulation: Ehrliche Vollkostenrechnung zeigt, wo Software-Effizienz hilft und wo nicht.'
              },
            ].map((c) => (
              <div key={c.id} className="bg-white/5 border-l-4 border-red-500 rounded-lg p-4 space-y-2">
                <p className="text-sm font-bold text-white">
                  <span className="text-red-400 mr-2">{c.id})</span>{c.title}
                </p>
                <p className="text-xs text-white/60"><strong className="text-white/80">Widerspruch:</strong> {c.contradiction}</p>
                <p className="text-xs text-red-300"><strong>Gefahr:</strong> {c.danger}</p>
                <p className="text-xs text-emerald-400/80"><strong>Auflösung:</strong> {c.resolution}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.8: SOLUTION BLUEPRINT ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Lightbulb} number="26.8" title="Solution Blueprint (3 Kernlösungen)" />

          <Collapsible title="Lösung 1: Tech-Operator Pivot — Auflösung der Positioning-Krise" defaultOpen>
            <SolutionCard
              problem="Offene Eigenausführungs-Bevorzugung ('Cherry-Picking') killt den B2B-Marktplatz und erzeugt UWG-Risiken gegenüber Kunden."
              target="Klare Positionierung als 'Feierabend Services — die erste KI-gesteuerte Premium-Umzugsfirma der Schweiz'. Umzugscheck.ch wird zur internen Inbound-Maschine, nicht zum neutralen Marktplatz."
              steps={[
                '"Cherry-Picking" aus sämtlichem Material löschen (Deck, Website, One-Pager, E-Mails).',
                'Neues Narrativ formulieren: "Wir lasten unsere eigene Flotte mit maximaler Marge aus. Overflow-Leads verkaufen wir an ausgewählte Partner."',
                'LLM Contradiction Checker über alle Materialien laufen lassen — automatisierte Suche nach Marktplatz-Begriffen.',
                'Brands von 4 auf 2 reduzieren: Feierabend (Execution) + Umzugscheck (Inbound).',
              ]}
              ai="LLM scannt Deck/Website auf alte Marktplatz-Claims. Kann auch alternative Formulierungen vorschlagen."
              human="Strategische Grundsatzentscheidung: 'Wir sind Operator, nicht Marktplatz.' Dann Pitch-Training."
              proof="Widerspruchsfreies Pitchdeck. Kein Investor findet 'neutral', 'Vergleich' oder 'Cherry-Picking' mehr."
            />
          </Collapsible>

          <Collapsible title="Lösung 2: Pro-Forma Unit Economics unter GAV-Bedingungen">
            <SolutionCard
              problem="Keine einzige belastbare Zahl zur Rentabilität. DB-Marge von 40-45% ist reine Annahme ohne GAV-Vollkosten."
              target="Wasserdichtes Excel-Modell, das zeigt: 'Wir kennen unsere Zahlen.' Ein fiktiver 1.500 CHF Standard-Job wird auf Rappen genau durchkalkuliert."
              steps={[
                'Funding-Ask in ALLEN Materialien auf 80k mit 4×20k Meilenstein-Logik vereinheitlichen.',
                'Vollkostenblatt pro Service erstellen: Lohn (GAV + AHV/IV/EO + BVG + UVG), LKW-Miete/km, Sprit, Verbrauchsmaterial, Versicherung.',
                'Ads-Budget für Phase 1 simulieren: Angenommen CPL = 200 CHF, Conversion = 25% → Kosten pro Auftrag = 800 CHF.',
                '4 Szenarien modellieren: Best Case, Base Case, Conservative, Worst Case.',
              ]}
              ai="LLM generiert Excel-Tabellenstruktur und Formellogik. Kann auch GAV-Mindestlöhne recherchieren."
              human="Validierung aller Lohn- und Marktpreise gegen reale Schweizer Daten. Kein LLM-Output ohne menschliche Prüfung."
              proof="1-Slide im Deck: 'Unit Economics eines Premium-3.5-Zimmer-Umzugs'. Zeigt >30% DB-Marge nach GAV."
            />
          </Collapsible>

          <Collapsible title="Lösung 3: KI-Haftungs-De-Risking (Human-in-the-Loop)">
            <SolutionCard
              problem="KI schätzt m³ via WhatsApp-Foto falsch → Firma muss zum defizitären Fixpreis ausführen. Ein einziger Grossauftrag kann den Monatsgewinn eliminieren."
              target="Maximale UX-Automatisierung bei 100% operativem Haftungsschutz. KI erstellt Draft, Mensch gibt frei. Keine autonomen Fixpreise."
              steps={[
                'AGB-Update: "Preis basiert auf Fotomaterial. Signifikantes Mehrvolumen vor Ort wird nachverrechnet."',
                'OpenClaw-Workflow: Harter Stopp vor PDF-Versand → Dashboard zeigt Fotos + Preiskalkulation → 1-Klick "Approve & Send".',
                '20-Bilder Stresstest: KI-Schätzung vs. reales Volumen dokumentieren. Akzeptable Fehlerquote definieren (<15%).',
                'Eskalations-Regel: Bei m³ > Schwellenwert automatisch "Vor-Ort-Besichtigung empfohlen" vorschlagen.',
              ]}
              ai="OpenClaw übernimmt: Intake, Foto-Analyse (Vision Skill), Preisberechnung, PDF-Layout. ~2 Min statt ~20 Min."
              human="30 Sekunden Review: Fotos anschauen, Preis prüfen, 'Approve' klicken. Bei Zweifeln: Rückfrage an Kunden."
              proof="Logbuch des 20-Bilder Stresstests. Dokumentierte Fehlerquote. Funktionierender Approval-Workflow."
            />
          </Collapsible>
        </section>
      </Reveal>

      {/* ═══ 26.9: AI & AUTOMATION DESIGN ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Bot} number="26.9" title="AI & Automation Design (HITL-Architektur)" />
          <p className="text-xs text-white/50">Prinzip: KI automatisiert 90% der Routine. Mensch kontrolliert 100% der Haftungs- und Preisrisiken.</p>

          <div className="space-y-2">
            {[
              { area: 'A) Lead Intake', goal: '24/7 Erreichbarkeit, 0% Formular-Abbrüche', system: 'WhatsApp Business API + OpenClaw', auto: 'Voll', detail: 'KI fragt 5 Pflichtfelder ab (Von/Nach, Zimmer, Datum, Kontakt), fordert Fotos an, pitcht Cross-Sells.', guardrail: 'Fallback auf menschlichen Support bei >2 Rückfragen.' },
              { area: 'B) Offerten-Drafting', goal: 'Von 20 Min auf 2 Min pro Offerte', system: 'OpenClaw Vision + Pricing Engine', auto: 'Teil', detail: 'Vision Skill analysiert m³ aus Fotos, wendet Preismatrix an (Distanz × m³ × Stockwerk), generiert PDF-Draft.', guardrail: 'ZWINGEND: Menschlicher Freigabe-Klick vor jedem Versand.' },
              { area: 'C) Follow-up', goal: 'Conversion steigern ohne Sales-Personal', system: 'OpenClaw Cron Agent', auto: 'Voll', detail: '24h nach Offertenversand: WhatsApp-Nachricht "Haben Sie Fragen?". Checkt vorher CRM: Won/Lost → kein Follow-up.', guardrail: 'Max 2 Follow-ups. Opt-out respektieren.' },
              { area: 'D) Investor Reporting', goal: '5-Runs-Transparenz automatisch', system: 'OpenClaw Data Agent', auto: 'Voll', detail: 'Freitags: CPL aus Google Ads + Deals aus CRM → automatischer Run-Status-Report (PDF/Dashboard).', guardrail: 'Mensch prüft Report vor Versand an Investoren.' },
              { area: 'E) Ops Disposition', goal: 'Sales → Execution reibungslos', system: 'Make/Zapier', auto: 'Voll', detail: 'Deal = Won → Kalenderblocker für LKW + Packliste an Zügelteam via WhatsApp + Bestätigung an Kunden.', guardrail: 'Manuelle Prüfung bei Jobs > 5k CHF oder Spezialtransport.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white">{item.area}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${item.auto === 'Voll' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {item.auto === 'Voll' ? '🤖 Voll-Auto' : '🤖+👤 Teil-Auto'}
                  </span>
                </div>
                <p className="text-xs text-white/50"><strong>Ziel:</strong> {item.goal} · <strong>System:</strong> {item.system}</p>
                <p className="text-xs text-white/60">{item.detail}</p>
                <p className="text-xs text-orange-400/70">⚡ Guardrail: {item.guardrail}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.10: IMPLEMENTATION ROADMAP ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Clock} number="26.10" title="Implementation Roadmap (3 Phasen)" />

          <div className="space-y-3">
            {[
              { phase: 'PHASE 1', time: '7 Tage', title: 'Story & Cleanup', color: 'border-red-500', 
                todos: ['Pitchdeck auf Tech-Operator Pivot umschreiben', 'Ask auf 80k (4×20k) in ALLEN Materialien', 'Brands von 4 auf 2 konsolidieren', '"Cherry-Picking", "0 CHF CAC", "neutral" aus allem löschen'], 
                proof: 'Neues Pitchdeck — LLM Contradiction Check bestätigt 0 Widersprüche', 
                ai: 'LLM Contradiction Checker + Formulierungs-Vorschläge', 
                dont: 'Kein SEO-Scaling, keine neuen Features, bevor Story nicht sitzt' },
              { phase: 'PHASE 2', time: '30 Tage', title: 'Simulated Proof & Compliance', color: 'border-yellow-500', 
                todos: ['Pro-Forma Excel bauen (GAV-Vollkosten, 4 Szenarien)', 'KI-Bild-Stresstest: 20 Fälle, Fehlerquote dokumentieren', 'GAV-Compliance mit Arbeitsrechtler prüfen', 'Cap Table / Organigramm erstellen'], 
                proof: 'Excel-Kalkulation + Stresstest-Logbuch + Anwalts-Bestätigung', 
                ai: 'OpenClaw Vision Skill kalibrieren, LLM für Excel-Strukturen', 
                dont: '' },
              { phase: 'PHASE 3', time: 'Vor Investor-Pitch', title: 'Live Engine Test', color: 'border-emerald-500', 
                todos: ['500 CHF Test-Ads → WhatsApp-Katalog → reale CPL messen', 'Human-Approval-Layer implementieren und testen', 'End-to-End Demo: Investor kann auf seinem Handy den Flow durchspielen'], 
                proof: 'Reale CPL < 200 CHF, funktionierende Live-Demo, min. 5 qualifizierte Leads', 
                ai: 'OpenClaw Intake Agent live in kontrollierter Testumgebung', 
                dont: '' },
            ].map((p, i) => (
              <div key={i} className={`bg-white/5 border-l-4 ${p.color} rounded-lg p-4 space-y-2`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white bg-white/10 px-2 py-0.5 rounded">{p.phase}</span>
                  <span className="text-sm font-bold text-white">{p.title}</span>
                  <span className="text-xs text-white/40 ml-auto">{p.time}</span>
                </div>
                <ul className="text-xs text-white/60 space-y-0.5">
                  {p.todos.map((t, j) => <li key={j}>• {t}</li>)}
                </ul>
                <div className="text-xs text-white/50 pt-1 border-t border-white/5">
                  <span><strong className="text-emerald-400">Beweis:</strong> {p.proof}</span>
                </div>
                <p className="text-xs text-cyan-400">🤖 {p.ai}</p>
                {p.dont && <p className="text-xs text-red-300">⛔ Nicht tun: {p.dont}</p>}
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.11: MASTER TODO LIST ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={CheckCircle2} number="26.11" title="Master Todo List (priorisiert)" />

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 text-white/40 w-12">Prio</th>
                  <th className="text-left py-2 text-white/40">Thema</th>
                  <th className="text-left py-2 text-white/40">Ziel</th>
                  <th className="text-center py-2 text-white/40 w-10" title="KI-übernehmbar">🤖</th>
                  <th className="text-center py-2 text-white/40 w-10" title="Mensch nötig">👤</th>
                  <th className="text-left py-2 text-white/40">Erfolgskriterium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {TODO_DATA.map((row, i) => (
                  <tr key={i} className={row.prio === 'P1' ? 'bg-red-500/5' : ''}>
                    <td className={`py-2 font-bold ${row.prio === 'P1' ? 'text-red-400' : row.prio === 'P2' ? 'text-yellow-400' : 'text-blue-400'}`}>{row.prio}</td>
                    <td className="py-2 text-white/80 font-medium">{row.theme}</td>
                    <td className="py-2 text-white/60">{row.goal}</td>
                    <td className="py-2 text-center">{row.ai === 'JA' ? <span className="text-cyan-400">✓</span> : row.ai === 'Teilweise' ? <span className="text-yellow-400">◐</span> : <span className="text-white/30">✗</span>}</td>
                    <td className="py-2 text-center">{row.human ? <span className="text-orange-400">✓</span> : <span className="text-white/30">✗</span>}</td>
                    <td className="py-2 text-white/50">{row.success}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-white/30">P1 = Sofort (7 Tage) · P2 = Kurzfristig (30 Tage) · P3 = Vor Investorengespräch</p>
        </section>
      </Reveal>

      {/* ═══ 26.12: CLAIM & PITCH CONTROL ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Scale} number="26.12" title="Claim & Pitch Control" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-emerald-400">A) Sicher verwenden ✓</p>
              <p className="text-[10px] text-white/30 mb-1">Belegt oder strukturell plausibel</p>
              <ul className="text-xs text-white/60 space-y-1.5">
                <li>• "Conversational Commerce via WhatsApp senkt UX-Reibung massiv." <span className="text-emerald-400/50">(gebaut, logisch)</span></li>
                <li>• "5-Runs-Kill-Switch schützt Ihr Kapital mit harter Exit-Logik." <span className="text-emerald-400/50">(strukturell stark)</span></li>
                <li>• "406k Umzüge/Jahr in der Schweiz — inelastischer Markt." <span className="text-emerald-400/50">(BFS-belegt)</span></li>
              </ul>
            </div>
            <div className="bg-yellow-500/5 border border-yellow-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-yellow-400">B) Vorsichtig formulieren ⚠</p>
              <p className="text-[10px] text-white/30 mb-1">Nur mit Einschränkung verwenden</p>
              <ul className="text-xs text-white/60 space-y-1.5">
                <li>• "KI-automatisierte Offerten" → <em className="text-yellow-300">Zusatz: "...mit zwingender menschlicher Freigabe vor Versand."</em></li>
                <li>• "40% DB-Marge" → <em className="text-yellow-300">Zusatz: "...laut Pro-Forma-Simulation unter GAV-Bedingungen."</em></li>
                <li>• "Cross-Selling AOV-Steigerung" → <em className="text-yellow-300">Zusatz: "...basierend auf Marktanalyse, noch nicht live getestet."</em></li>
              </ul>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-orange-400">C) Zu gross / zu früh ◐</p>
              <p className="text-[10px] text-white/30 mb-1">Abschwächen oder weglassen</p>
              <ul className="text-xs text-white/60 space-y-1.5">
                <li>• "10 Revenue Streams" → <em className="text-orange-300">"Fokus auf Execution-Marge + Lead-Overflow als Bonus."</em></li>
                <li>• "4 Brands" → <em className="text-orange-300">"2 Brands: Feierabend (Execution) + Umzugscheck (Inbound)."</em></li>
                <li>• "92% KI-Automatisierung" → <em className="text-orange-300">"KI übernimmt Intake und Drafting, Mensch entscheidet."</em></li>
              </ul>
            </div>
            <div className="bg-red-500/5 border border-red-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-red-400">D) NICHT verwenden ✗</p>
              <p className="text-[10px] text-white/30 mb-1">Toxisch — sofort entfernen</p>
              <ul className="text-xs text-white/60 space-y-1.5">
                <li>• <span className="line-through">"Cherry-Picking"</span> — <em className="text-red-300">Zerstört B2B-Vertrauen präventiv</em></li>
                <li>• <span className="line-through">"0 CHF CAC"</span> — <em className="text-red-300">Faktisch falsch für Phase 1 (Ads nötig)</em></li>
                <li>• <span className="line-through">"Neutraler Vergleich"</span> — <em className="text-red-300">Widerspricht Eigenausführung</em></li>
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.13: INVESTOR READINESS CHECKLIST ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Shield} number="26.13" title="Investor Readiness Checklist" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-white/80">🏥 Hygiene (vor erstem Gespräch)</p>
              <ul className="text-xs text-white/60 space-y-1.5">
                <ChecklistItem text="Pitchdeck + Website fordern exakt 80k (4×20k)" />
                <ChecklistItem text="'Cherry-Picking' restlos aus aller Kommunikation getilgt" />
                <ChecklistItem text="WhatsApp-Katalog-Demo funktioniert auf dem Handy fehlerfrei" />
                <ChecklistItem text="Narrativ klar: 'Tech-Enabled Operator', NICHT 'Neutraler Marktplatz'" />
                <ChecklistItem text="Brands konsolidiert: Max. 2 (Feierabend + Umzugscheck)" />
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-white/80">📊 Proof (vor Due Diligence)</p>
              <ul className="text-xs text-white/60 space-y-1.5">
                <ChecklistItem text="Excel: Pro-Forma Unit Economics (GAV, CAC, 4 Szenarien)" />
                <ChecklistItem text="Legal: Organigramm (Alt-KMU vs. Tech-Startup getrennt)" />
                <ChecklistItem text="Tech: Logbuch KI-Foto-Stresstest (20 Cases, <15% Fehlerquote)" />
                <ChecklistItem text="Ops: Muster-Arbeitsvertrag zur GAV-Compliance" />
                <ChecklistItem text="Ads: Reale CPL-Daten aus 500 CHF Testbudget" />
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ 26.14: FINAL VERDICT ═══ */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader icon={Briefcase} number="26.14" title="Final Verdict" />

          <div className="bg-gradient-to-br from-rose-500/10 via-violet-500/10 to-cyan-500/10 border border-rose-500/20 rounded-xl p-6 space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-bold text-red-300">Warum aktuell noch nicht investierbar?</p>
              <p className="text-xs text-white/60 leading-relaxed">
                Weil das Modell strategisch an <strong className="text-white/80">Masslosigkeit</strong> (4 Brands, 10 Revenue Streams, Multi-Region) 
                und <strong className="text-white/80">gefährlicher Naivität</strong> ("0 CHF CAC", offenes Cherry-Picking, Ask-Diskrepanz) leidet. 
                Es pitcht Software-Margen für ein Geschäft, das im Kern aus schwitzenden Menschen und Lastwagen 
                unter hartem Schweizer Arbeitsrecht besteht. Das ist nicht unlösbar — aber aktuell unbewiesen.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold text-emerald-300">Die 5 Voraussetzungen für Investierbarkeit</p>
              <ol className="text-xs text-white/70 space-y-2 list-decimal list-inside">
                <li><strong className="text-white/90">Positioning-Pivot:</strong> Vom "verwirrenden Marktplatz" zur "KI-gesteuerten Next-Gen Umzugsfirma mit Overflow-Vermarktung"</li>
                <li><strong className="text-white/90">Financial Proof:</strong> Pro-Forma Unit Economics mit GAV-Vollkosten, die &gt;30% DB-Marge zeigen</li>
                <li><strong className="text-white/90">Risk Control:</strong> Human-in-the-Loop Freigabeprozess für alle KI-Fixpreise implementiert</li>
                <li><strong className="text-white/90">Narrative Consistency:</strong> 80k Ask in 4×20k Meilensteinen — überall identisch, keine Diskrepanz</li>
                <li><strong className="text-white/90">Focus:</strong> 1 Kern-Funnel (Google Ads → WhatsApp → Feierabend Services), 1 Region, 1 Kernservice</li>
              </ol>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <p className="text-sm font-bold text-white">Fazit</p>
              <p className="text-xs text-white/70 leading-relaxed">
                <strong className="text-cyan-300">Technologisch</strong> (WhatsApp-Katalog, OpenClaw, Lovable-Stack) habt ihr der verstaubten Schweizer 
                Umzugsbranche Jahre voraus. <strong className="text-red-300">Strategisch</strong> steht ihr euch selbst im Weg. 
                Reduziert die Komplexität um 80%. Lasst OpenClaw den Front-Desk schmeissen. 
                Konzentriert eure menschliche Energie auf drei Dinge: den "Approve-Button", 
                die physische Ausführung in Schweizer Qualität, und das Pitching der 80k-Story.
              </p>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <p className="text-xs text-emerald-400 font-bold leading-relaxed">
                  Wenn ihr diesen Fokus-Schnitt macht, transformiert sich das Projekt von einem "interessanten Chaos-Deck" 
                  in einen der effizientesten Seed-Cases im Schweizer PropTech-/Service-Markt. 
                  Die Infrastruktur steht. Jetzt fehlt nur noch die Beweisarchitektur.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

    </div>
  );
};

export default UltimateBlueprint;
