import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, AlertTriangle, Shield, TrendingUp, Target, 
  CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronRight,
  FileText, Lightbulb, Clock, Zap, BarChart3, Scale
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ─── Status Badge Component ───
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

const SourceBadge = ({ source }: { source: string }) => {
  const styles: Record<string, string> = {
    'ANALYSE 1': 'bg-teal-500/10 text-teal-400',
    'ANALYSE 2': 'bg-blue-500/10 text-blue-400',
    'ANALYSE 3': 'bg-purple-500/10 text-purple-400',
    'FEEDBACK': 'bg-orange-500/10 text-orange-400',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded ${styles[source] || 'bg-gray-500/10 text-gray-400'}`}>
      [{source}]
    </span>
  );
};

// ─── Severity Bar ───
const SeverityBar = ({ level, max = 5 }: { level: number; max?: number }) => (
  <div className="flex gap-0.5 items-center">
    {Array.from({ length: max }).map((_, i) => (
      <div
        key={i}
        className={`h-2 w-4 rounded-sm ${
          i < level
            ? level >= 4 ? 'bg-red-500' : level >= 3 ? 'bg-orange-500' : 'bg-yellow-500'
            : 'bg-white/10'
        }`}
      />
    ))}
    <span className="text-xs text-white/40 ml-1">{level}/{max}</span>
  </div>
);

// ─── Collapsible Section ───
const Collapsible = ({ title, children, defaultOpen = false, icon: Icon }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean; icon?: React.ComponentType<{ className?: string }>;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-teal-400" />}
          <span className="font-semibold text-sm text-white">{title}</span>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronRight className="w-4 h-4 text-white/50" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── ScrollReveal ───
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
);

// ═══════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════
const FeedbackAnalysis = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/investoren" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Zurück zu /investoren
          </Link>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
            INTERNES DOKUMENT
          </Badge>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">

        {/* ═══ BLOCK 1: READINESS SCORE ═══ */}
        <Reveal>
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">BLOCK 1</Badge>
              <h1 className="text-2xl font-bold">Investor Readiness Score</h1>
            </div>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full border-4 border-red-500/50 flex items-center justify-center bg-red-500/10">
                      <span className="text-4xl font-black text-red-400">3</span>
                      <span className="text-lg text-red-400/60">/10</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-white/70 text-sm leading-relaxed">
                      <strong className="text-white">Infrastruktur stark, Traktion fehlend.</strong> Das System zeigt beeindruckende technische Tiefe 
                      (43'890 Keywords, 130+ Landingpages, 20 Funnels, KI-Automatisierung), aber <span className="text-red-400">kein einziger 
                      dokumentierter End-to-End-Umsatz über das Portal</span>. Ohne bewiesenen Revenue-Loop ist das Modell nicht investierbar.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <SourceBadge source="ANALYSE 1" />
                      <SourceBadge source="ANALYSE 2" />
                      <SourceBadge source="ANALYSE 3" />
                      <SourceBadge source="FEEDBACK" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                    <p className="text-xs text-emerald-400 font-semibold mb-1">STARK</p>
                    <p className="text-xs text-white/60">Technische Infrastruktur, SEO-Vorbereitung, KI-Automatisierung, Bootstrapped-Execution</p>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                    <p className="text-xs text-red-400 font-semibold mb-1">SCHWACH</p>
                    <p className="text-xs text-white/60">Keine Traktion, kein Revenue, kein Team, keine Partner-Validierung, kein GSC-Beweis</p>
                  </div>
                  <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                    <p className="text-xs text-yellow-400 font-semibold mb-1">KERNPROBLEM</p>
                    <p className="text-xs text-white/60">Infrastruktur wird mit Traktion verwechselt. Viel gebaut ≠ Geschäft bewiesen.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══ BLOCK 2: TOP 7 KILL POINTS ═══ */}
        <Reveal delay={0.05}>
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">BLOCK 2</Badge>
              <h2 className="text-xl font-bold">Top 7 Kill Points</h2>
            </div>

            <div className="space-y-2">
              {[
                { title: 'Kein bewiesener wirtschaftlicher Kern-Loop', severity: 5, status: 'KRITISCHE LÜCKE', source: 'ANALYSE 1',
                  desc: 'Kein einziger dokumentierter Fall: Traffic → Lead → Auftrag → Bezahlung → Marge. Ohne diesen Proof ist alles andere Infrastruktur-Theater.',
                  fix: 'Mindestens 3–5 echte Portal-getriebene Aufträge dokumentieren inkl. Vollkostenrechnung.' },
                { title: 'Cherry-Picking / Neutralitätskonflikt', severity: 5, status: 'RISIKO', source: 'ANALYSE 2',
                  desc: 'Leads mit Score >60 werden exklusiv an Feierabendservices geroutet. Partner-Firmen bekommen nur den Rest. Struktureller Interessenkonflikt.',
                  fix: 'Governance-Modell definieren: Transparente Routing-Regeln oder klare Trennung mit Opt-in.' },
                { title: 'Solo-Founder-Bottleneck', severity: 4, status: 'RISIKO', source: 'ANALYSE 3',
                  desc: '4 Marken, 20 Funnels, operative Ausführung, Tech, SEO, Sales — alles eine Person. Bus-Factor = 1. Kein Team, kein Advisor.',
                  fix: 'Minimum: 1 operativer Partner oder Advisor. Teamplan im Pitch.' },
                { title: 'Kein organischer Traffic bewiesen', severity: 4, status: 'NICHT BELEGT', source: 'ANALYSE 1',
                  desc: '43\'890 Keywords indexiert ≠ Traffic. Keine GSC-Daten, keine realen Besucherzahlen, keine Conversion-Daten vom echten Nutzer.',
                  fix: 'GSC-Screenshot mit Impressions, Clicks, CTR für die letzten 90 Tage.' },
                { title: 'Unit Economics nicht belastbar', severity: 4, status: 'REINE ANNAHME', source: 'ANALYSE 2',
                  desc: '553 CHF/Kunde ist eine Modellrechnung, kein Messwert. Keine Vollkostenrechnung (Personal, Fahrt, Material, Nacharbeit, Support).',
                  fix: 'Vollkostenrechnung für 3–10 echte Jobs. CM2 berechnen. Break-even-Punkt definieren.' },
                { title: 'SEO als Single Point of Failure', severity: 3, status: 'RISIKO', source: 'ANALYSE 3',
                  desc: 'Gesamtes Akquisemodell basiert auf organischem Google-Traffic. Kein Paid, kein Referral, kein Partnership-Channel. Ein Google-Update kann den gesamten Zufluss zerstören.',
                  fix: 'Diversifikations-Plan: Mindestens 1 alternativer Kanal mit Budget-Test (Google Ads, Partnerschaften).' },
                { title: 'Zu viele Marken, zu wenig Fokus', severity: 3, status: 'PLAUSIBEL', source: 'FEEDBACK',
                  desc: 'Umzugscheck, Feierabendservices, Moving Expert, Relocation OS — 4 Marken ohne klare Hierarchie. Verwässert Ressourcen und Pitch.',
                  fix: 'Fokus-Cut auf 2 Kernmarken. Rest stillgelegt oder als Feature unter Dachmarke.' },
              ].map((point, i) => (
                <Collapsible key={i} title={`${i + 1}. ${point.title}`} icon={AlertTriangle} defaultOpen={i === 0}>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={point.status} />
                      <SourceBadge source={point.source} />
                      <SeverityBar level={point.severity} />
                    </div>
                    <p className="text-sm text-white/60">{point.desc}</p>
                    <div className="bg-teal-500/10 rounded p-2 border border-teal-500/20">
                      <p className="text-xs text-teal-400"><strong>Fix:</strong> {point.fix}</p>
                    </div>
                  </div>
                </Collapsible>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ═══ BLOCK 3: UNBELEGTE ANNAHMEN ═══ */}
        <Reveal delay={0.05}>
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">BLOCK 3</Badge>
              <h2 className="text-xl font-bold">Unbelegte Annahmen</h2>
            </div>

            <div className="grid gap-2">
              {[
                { claim: 'SEO-Traffic wird organisch skalieren', status: 'NICHT BELEGT', source: 'ANALYSE 1', why: 'Keine GSC-Daten, keine realen Besucherzahlen' },
                { claim: '553 CHF Customer Lifetime Value', status: 'REINE ANNAHME', source: 'ANALYSE 2', why: 'Modellrechnung ohne reale Datenbasis' },
                { claim: '0 CHF Customer Acquisition Cost', status: 'REINE ANNAHME', source: 'ANALYSE 2', why: 'Ignoriert Infrastrukturkosten, Zeitaufwand, Opportunity Costs' },
                { claim: '92% Profitabilitäts-Wahrscheinlichkeit', status: 'NICHT BELEGT', source: 'ANALYSE 1', why: 'KI-generierte Zahl ohne Validierung gegen reale Marktdaten' },
                { claim: 'Premium-Kunden kommen über Vergleichsportale', status: 'PLAUSIBEL', source: 'ANALYSE 2', why: 'Marktverhalten unklar — Premium-Segment nutzt oft Empfehlungen' },
                { claim: 'WhatsApp-Automatisierung ersetzt Vertriebsteam', status: 'PLAUSIBEL', source: 'ANALYSE 3', why: 'Funktioniert für einfache Flows, aber Eskalation/Komplexität unklar' },
                { claim: '6 Revenue Streams gleichzeitig ab Start', status: 'REINE ANNAHME', source: 'ANALYSE 3', why: 'Kein einziger Revenue Stream ist validiert — 6 gleichzeitig hochspekulativ' },
                { claim: 'Partnerfirmen akzeptieren Cherry-Picking-Modell', status: 'NICHT BELEGT', source: 'ANALYSE 2', why: 'Keine Partner-Gespräche dokumentiert' },
                { claim: 'Schweizer Markt als Proof-of-Concept für international', status: 'PLAUSIBEL', source: 'FEEDBACK', why: 'Denkbar, aber Marktspezifika (Regulierung, Sprache) limitieren Übertragbarkeit' },
                { claim: 'KI-Inventarerkennung erreicht Produktionsreife', status: 'PLAUSIBEL', source: 'ANALYSE 3', why: 'Tech existiert, aber Genauigkeit und Edge Cases nicht getestet im Feld' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2 sm:items-center bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-white/40 text-xs font-mono w-5 flex-shrink-0">{i + 1}.</span>
                    <span className="text-sm text-white/80">{item.claim}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={item.status} />
                    <SourceBadge source={item.source} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ═══ BLOCK 4: WIDERSPRÜCHE ═══ */}
        <Reveal delay={0.05}>
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">BLOCK 4</Badge>
              <h2 className="text-xl font-bold">Widersprüche & Spannungsfelder</h2>
            </div>

            <div className="grid gap-3">
              {[
                { tension: 'Plattform-Neutralität vs. Eigenausführung', left: 'Umzugscheck als neutraler Vergleich', right: 'Feierabendservices bekommt die besten Leads', source: 'ANALYSE 2',
                  resolution: 'Klare Governance: Entweder echte Neutralität mit Opt-in oder offene Positionierung als "Plattform + eigener Service"' },
                { tension: 'Tech-Startup vs. Handwerksbetrieb', left: 'Pitch als skalierbares Tech-Modell', right: 'Delivery erfordert Transporter, Personal, Materialien', source: 'ANALYSE 1',
                  resolution: 'Im Pitch klar trennen: Tech-Layer (skalierbar) vs. Service-Layer (linear). Getrennte Margenmodelle zeigen.' },
                { tension: 'Bootstrapped-Stolz vs. Kapital-Bedarf', left: '"Alles ohne Fremdkapital gebaut"', right: '80k CHF Funding gesucht', source: 'ANALYSE 3',
                  resolution: 'Narrativ schärfen: Bootstrapping = Proof of Execution. Kapital = Beschleunigung, nicht Rettung.' },
                { tension: 'Premium-Positionierung vs. Preistransparenz', left: 'Feierabendservices als Premium-Anbieter', right: 'Umzugscheck als Preisvergleichsportal', source: 'FEEDBACK',
                  resolution: 'Klar definieren: Vergleich für Massenmarkt, Premium als Eigenmarke für Qualitätssegment. Nicht vermischen.' },
                { tension: 'Automatisierung vs. Servicequalität', left: '95% KI-automatisiert, WhatsApp-Bot', right: 'Umzüge erfordern menschliche Flexibilität', source: 'ANALYSE 2',
                  resolution: 'Automatisierung für Akquise/Admin/Pricing. Menschliche Qualität für Ausführung. Trennlinie klar machen.' },
                { tension: '4 Marken vs. Solo-Founder', left: 'Umzugscheck, Feierabendservices, Moving Expert, Relocation OS', right: '1 Person für alles', source: 'FEEDBACK',
                  resolution: 'Fokus-Cut: 2 Kernmarken (Umzugscheck + Feierabendservices). Rest als Feature-Labels, nicht als eigenständige Marken.' },
              ].map((item, i) => (
                <Card key={i} className="bg-white/5 border-white/10">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        <h3 className="text-sm font-semibold text-white">{item.tension}</h3>
                      </div>
                      <SourceBadge source={item.source} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-blue-500/10 rounded p-2 border border-blue-500/20">
                        <p className="text-blue-400">{item.left}</p>
                      </div>
                      <div className="bg-orange-500/10 rounded p-2 border border-orange-500/20">
                        <p className="text-orange-400">{item.right}</p>
                      </div>
                    </div>
                    <div className="bg-teal-500/10 rounded p-2 border border-teal-500/20">
                      <p className="text-xs text-teal-400"><Lightbulb className="w-3 h-3 inline mr-1" />{item.resolution}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ═══ BLOCK 5: PITCH CLAIM AUDIT ═══ */}
        <Reveal delay={0.05}>
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">BLOCK 5</Badge>
              <h2 className="text-xl font-bold">Pitch Claim Audit</h2>
            </div>

            <Tabs defaultValue="safe" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 w-full flex">
                <TabsTrigger value="safe" className="flex-1 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">✅ Sicher sagbar</TabsTrigger>
                <TabsTrigger value="careful" className="flex-1 text-xs data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">⚠️ Vorsichtig</TabsTrigger>
                <TabsTrigger value="risky" className="flex-1 text-xs data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">🔶 Zu gross</TabsTrigger>
                <TabsTrigger value="no" className="flex-1 text-xs data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">🚫 Nicht sagen</TabsTrigger>
              </TabsList>

              <TabsContent value="safe" className="space-y-2 mt-3">
                {[
                  { claim: '"Komplett bootstrapped aufgebaut"', why: 'Nachweisbar. Kein Fremdkapital geflossen.' },
                  { claim: '"20 funktionierende Funnels live"', why: 'Technisch prüfbar auf der Plattform.' },
                  { claim: '"KI-automatisierte Prozesse für Akquise und Pricing"', why: 'Code und Flows existieren nachweislich.' },
                  { claim: '"130+ Landingpages indexiert"', why: 'Über Sitemap und Google-Index prüfbar.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 bg-emerald-500/5 rounded-lg px-3 py-2 border border-emerald-500/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white/80">{item.claim}</p>
                      <p className="text-xs text-white/40 mt-0.5">{item.why}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="careful" className="space-y-2 mt-3">
                {[
                  { claim: '"Hybrid-Modell mit Plattform und Eigenausführung"', why: 'Korrekt, aber der Interessenkonflikt muss proaktiv adressiert werden.', better: 'Hinzufügen: "mit klarer Governance-Trennung geplant"' },
                  { claim: '"WhatsApp-Automatisierung skaliert ohne Personalaufbau"', why: 'Für einfache Anfragen plausibel, aber Eskalationspfade fehlen.', better: '"Automatisierung für Standard-Anfragen, Human Handoff für Komplexfälle"' },
                  { claim: '"KI-Preiskalkulation mit Marktdaten"', why: 'System existiert, aber Genauigkeit nicht validiert.', better: '"KI-gestützte Preisindikation, wird laufend kalibriert"' },
                ].map((item, i) => (
                  <div key={i} className="bg-yellow-500/5 rounded-lg px-3 py-2 border border-yellow-500/10 space-y-1">
                    <div className="flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-white/80">{item.claim}</p>
                    </div>
                    <p className="text-xs text-white/40 ml-6">{item.why}</p>
                    <p className="text-xs text-teal-400 ml-6">→ Besser: {item.better}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="risky" className="space-y-2 mt-3">
                {[
                  { claim: '"553 CHF Customer Lifetime Value"', problem: 'Modellrechnung, kein Messwert. Zu früh als Fakt präsentiert.', better: '"Ziel-CLV von 250–300 CHF basierend auf Marktvergleich"' },
                  { claim: '"6 Revenue Streams"', problem: 'Kein einziger ist validiert. Klang nach Komplexität statt Fokus.', better: '"1 primärer Revenue Stream (CPL), 2 geplante Erweiterungen"' },
                  { claim: '"Exit-Potential 15–25x Multiple"', problem: 'Rein hypothetisch. Kein Comparables-Beleg.', better: 'Komplett rausnehmen oder ins Appendix verschieben.' },
                ].map((item, i) => (
                  <div key={i} className="bg-orange-500/5 rounded-lg px-3 py-2 border border-orange-500/10 space-y-1">
                    <div className="flex gap-2 items-start">
                      <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-white/80">{item.claim}</p>
                    </div>
                    <p className="text-xs text-white/40 ml-6">{item.problem}</p>
                    <p className="text-xs text-teal-400 ml-6">→ Besser: {item.better}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="no" className="space-y-2 mt-3">
                {[
                  { claim: '"100% safe Investment"', why: 'Gibt es nicht. Wirkt unseriös und naiv auf jeden erfahrenen Investor.' },
                  { claim: '"0 CHF Kundenakquisekosten"', why: 'Ökonomisch falsch. Ignoriert Infrastruktur, Zeit, Opportunitätskosten.' },
                  { claim: '"Disruptieren den Schweizer Umzugsmarkt"', why: 'Zu grosse Worte für Pre-Revenue. "Disruption" ist earned, nicht claimed.' },
                  { claim: '"Marktführer werden"', why: 'Ohne Marktanteil, Revenue oder Bekanntheit zu früh.' },
                ].map((item, i) => (
                  <div key={i} className="bg-red-500/5 rounded-lg px-3 py-2 border border-red-500/10">
                    <div className="flex gap-2 items-start">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-white/80">{item.claim}</p>
                        <p className="text-xs text-white/40 mt-0.5">{item.why}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </section>
        </Reveal>

        {/* ═══ BLOCK 6: PROOF CHECKLIST ═══ */}
        <Reveal delay={0.05}>
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">BLOCK 6</Badge>
              <h2 className="text-xl font-bold">Proof Checklist — Vor Investorengesprächen</h2>
            </div>

            <div className="space-y-2">
              {[
                { proof: 'Google Search Console Daten (90 Tage)', category: 'Traffic', urgency: 5, how: 'GSC-Screenshot: Impressions, Clicks, CTR, Top Queries' },
                { proof: '3–5 dokumentierte Portal-getriebene Aufträge', category: 'Revenue', urgency: 5, how: 'Fallstudien: Lead-Eingang → Auftrag → Abschluss → Zahlung → Marge' },
                { proof: 'Vollkostenrechnung (CM1 + CM2)', category: 'Economics', urgency: 5, how: 'Excel mit allen Kosten: Personal, Material, Fahrt, Nacharbeit, Overhead' },
                { proof: 'Mindestens 1 Partner-Validierung', category: 'Partner', urgency: 4, how: 'Dokumentiertes Gespräch mit Umzugsfirma über Hybrid-Modell + Reaktion' },
                { proof: 'CPL-Test mit 500 CHF Budget', category: 'CAC', urgency: 4, how: 'Google Ads Kampagne: Kosten pro qualifiziertem Lead messen' },
                { proof: 'Team-/Advisor-Plan', category: 'Team', urgency: 3, how: 'Mindestens 1 Name mit Commitment (operativ oder beratend)' },
                { proof: 'Cashflow-Prognose 12 Monate', category: 'Finanzen', urgency: 3, how: 'Bottom-up mit realistischen Annahmen, nicht Top-down-Marktprozent' },
                { proof: 'KI-Accuracy-Test (Inventar/Pricing)', category: 'Tech', urgency: 3, how: '20 Testfälle: KI-Schätzung vs. realer Preis → Abweichung dokumentieren' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2 sm:items-center bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.urgency >= 5 ? 'bg-red-500' : item.urgency >= 4 ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm text-white/80">{item.proof}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-[10px] border-white/20 text-white/50">{item.category}</Badge>
                    <SeverityBar level={item.urgency} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ═══ BLOCK 7: 30-TAGE DE-RISKING ═══ */}
        <Reveal delay={0.05}>
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">BLOCK 7</Badge>
              <h2 className="text-xl font-bold">30-Tage De-Risking Plan</h2>
            </div>

            <Tabs defaultValue="14d" className="w-full">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="14d" className="text-xs data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
                  <Clock className="w-3 h-3 mr-1" /> 14 Tage
                </TabsTrigger>
                <TabsTrigger value="30d" className="text-xs data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
                  <Target className="w-3 h-3 mr-1" /> 30 Tage
                </TabsTrigger>
                <TabsTrigger value="pre" className="text-xs data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
                  <FileText className="w-3 h-3 mr-1" /> Vor Investoren
                </TabsTrigger>
              </TabsList>

              <TabsContent value="14d" className="mt-3">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-teal-400">Woche 1–2: Traktion beweisen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      'GSC-Daten exportieren und aufbereiten (Impressions, Clicks, Top-30 Keywords)',
                      '3 echte Umzugsaufträge über den Funnel generieren und komplett dokumentieren',
                      'Vollkostenrechnung pro Auftrag erstellen (alle Kosten, nicht nur Deckungsbeitrag)',
                      'Google Ads Test: 500 CHF Budget, CPL messen',
                      'Modellentscheidung treffen: Ist Umzugscheck Vergleich oder Inbound-Kanal?',
                    ].map((step, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <Zap className="w-3 h-3 text-teal-400 mt-1 flex-shrink-0" />
                        <p className="text-xs text-white/70">{step}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="30d" className="mt-3">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-teal-400">Woche 3–4: Modell validieren</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      '5–10 echte Aufträge dokumentiert inkl. Marge (Ziel: CM2 > 25%)',
                      '1 Partner-Gespräch dokumentiert: Reaktion auf Hybrid-Modell',
                      'Marken-Fokus: 2 Kernmarken definiert, Rest stillgelegt',
                      'Cashflow-Prognose 12 Monate (Bottom-up, nicht Top-down)',
                      'Pitch Deck auf 2–4 Seiten Proof Memo reduziert',
                    ].map((step, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <Target className="w-3 h-3 text-orange-400 mt-1 flex-shrink-0" />
                        <p className="text-xs text-white/70">{step}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pre" className="mt-3">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-teal-400">Vor dem Investorengespräch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      'Bewiesener Revenue-Loop: Traffic → Lead → Auftrag → Zahlung → Marge',
                      'Echte Unit Economics: CPL, CM1, CM2, Break-even-Punkt',
                      'Governance-Modell für Neutralitätskonflikt dokumentiert',
                      'Mindestens 1 Advisor oder Partner mit Name und Commitment',
                      '"100% safe" und Exit-Multiples komplett entfernt',
                      'One-Liner für das Modell: 1 Satz, der alles erklärt',
                      'Internes Red-Team-Dokument für eigene Vorbereitung auf harte Fragen',
                    ].map((step, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <Shield className="w-3 h-3 text-purple-400 mt-1 flex-shrink-0" />
                        <p className="text-xs text-white/70">{step}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </Reveal>

        {/* ═══ BLOCK 8: STRATEGISCHE EMPFEHLUNG ═══ */}
        <Reveal delay={0.05}>
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">BLOCK 8</Badge>
              <h2 className="text-xl font-bold">Strategische Empfehlung</h2>
            </div>

            <Card className="bg-gradient-to-br from-teal-500/10 to-orange-500/10 border-teal-500/20">
              <CardContent className="pt-6 space-y-6">
                {/* Core Insight */}
                <div className="text-center space-y-2">
                  <p className="text-lg font-bold text-white">
                    «Das Projekt verwechselt stellenweise<br />Infrastruktur mit Traktion.»
                  </p>
                  <p className="text-sm text-white/50">— Wichtigste Erkenntnis aus allen Analyse-Runden</p>
                </div>

                <div className="h-px bg-white/10" />

                {/* 3 Strategic Decisions */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-sm">1</div>
                      <h3 className="text-sm font-semibold">Fokus-Cut</h3>
                    </div>
                    <p className="text-xs text-white/60">2 Marken, 1 Revenue Stream, 1 Kernmodell. Alles andere wird Feature oder pausiert. Ressourcen bündeln statt verteilen.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">2</div>
                      <h3 className="text-sm font-semibold">2-Dokumente-Strategie</h3>
                    </div>
                    <p className="text-xs text-white/60">Intern: Red-Team-Dokument (brutal ehrlich). Extern: 2–4 Seiten Proof Memo (nüchtern, belegt, fokussiert auf die nächsten 90 Tage).</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">3</div>
                      <h3 className="text-sm font-semibold">Proof-before-Pitch</h3>
                    </div>
                    <p className="text-xs text-white/60">Kein Investorengespräch ohne: 3 dokumentierte Aufträge, GSC-Daten, Vollkostenrechnung, CM2 {'>'} 25%.</p>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Key Metrics */}
                <div>
                  <p className="text-xs text-white/40 mb-2 font-semibold">5 KENNZAHLEN FÜR DIE NÄCHSTEN 30 TAGE</p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { label: 'Echte Aufträge', target: '5–10' },
                      { label: 'CM2 pro Job', target: '> 25%' },
                      { label: 'CPL (Google Ads)', target: '< 50 CHF' },
                      { label: 'GSC Clicks/Tag', target: 'Messwert' },
                      { label: 'Partner-Gespräche', target: '≥ 1' },
                    ].map((metric, i) => (
                      <div key={i} className="bg-white/5 rounded p-2 border border-white/10 text-center">
                        <p className="text-xs text-white/40">{metric.label}</p>
                        <p className="text-sm font-bold text-teal-400 mt-0.5">{metric.target}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* Footer */}
        <Reveal>
          <div className="text-center py-8 space-y-2">
            <p className="text-xs text-white/30">
              Konsolidiert aus 4 Analyse-Runden · Stand: März 2026 · Internes Red-Team-Dokument
            </p>
            <div className="flex justify-center gap-2">
              <SourceBadge source="ANALYSE 1" />
              <SourceBadge source="ANALYSE 2" />
              <SourceBadge source="ANALYSE 3" />
              <SourceBadge source="FEEDBACK" />
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
};

export default FeedbackAnalysis;
