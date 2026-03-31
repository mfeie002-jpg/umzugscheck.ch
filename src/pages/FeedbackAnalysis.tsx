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
import AIExecutionMasterplan from '@/components/feedback/AIExecutionMasterplan';
import GeminiBlueprint from '@/components/feedback/GeminiBlueprint';

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
    'ANALYSE 4': 'bg-orange-500/10 text-orange-400',
    'FEEDBACK': 'bg-amber-500/10 text-amber-400',
    'FINAL VERDICT': 'bg-emerald-500/10 text-emerald-400',
    'MASTERPLAN': 'bg-cyan-500/10 text-cyan-400',
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

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 9: INVESTOR READINESS OVERVIEW                  */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="readiness-overview">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 9</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                  Investor Readiness Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-6 text-center">
                  <p className="text-white/50 text-sm mb-1">Gesamtbewertung</p>
                  <p className="text-5xl font-black text-red-400">3<span className="text-2xl text-white/30">/10</span></p>
                  <p className="text-sm text-white/60 mt-2">Nicht investor-ready, sondern proof-ready mit klaren Lücken</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-emerald-400">✓ Was aktuell eher stark ist</h4>
                    {[
                      'Grundproblem ist real: fragmentierter Markt, hohe Reibung, Vertrauens- und Preisproblem',
                      'Produktarbeit ist real: viele Funnel-/Flow-Varianten, KI-/Video-/WhatsApp-Logik',
                      '2-Marken-These ist intellektuell nachvollziehbar',
                      'Gestufte Finanzierungsidee sinnvoller als blindes "all-in"',
                    ].map((item, i) => (
                      <div key={i} className="bg-emerald-500/5 border border-emerald-500/10 rounded p-2 text-xs text-white/70">{item}</div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-red-400">✗ Was aktuell klar zu schwach ist</h4>
                    {[
                      'Kein belegter wirtschaftlicher Kern-Loop',
                      'Unit Economics nicht mit realen Vollkosten belegt',
                      'Partnerlogik nicht validiert',
                      'Delivery-Seite operativ zu wenig dokumentiert',
                      'Pitching verkauft teils Hypothesen als Belegtes',
                    ].map((item, i) => (
                      <div key={i} className="bg-red-500/5 border border-red-500/10 rounded p-2 text-xs text-white/70">{item}</div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-teal-400 mb-2">Substanz</h4>
                    {['Live-Infrastruktur', 'Funnel- und UX-Arbeit', 'Klare Hypothesenlogik', 'Regionaler Startfokus', 'Echte Bereitschaft zum Testen'].map((s, i) => (
                      <p key={i} className="text-xs text-white/60 py-0.5">• {s}</p>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-orange-400 mb-2">Story ohne Beleg</h4>
                    {['"Zero CAC"', '"40–45% DB-Marge"', '"92–95% KI-automatisiert"', '"10 Revenue Streams"', '"4 Brands als Vorteil"', '"Neutrales Vergleichsportal" bei Eigenausführung'].map((s, i) => (
                      <p key={i} className="text-xs text-white/60 py-0.5">• {s}</p>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-sm font-bold text-white mb-2">Hauptproblem-Typ</h4>
                  <p className="text-xs text-white/60">Nicht primär fehlende Grösse, sondern: <strong className="text-white">fehlende Beweise</strong>, <strong className="text-white">fehlende strategische Schärfe</strong>, <strong className="text-white">fehlende operative Glaubwürdigkeit</strong> und ein möglicher <strong className="text-red-400">Modellfehler im Zusammenspiel Portal vs. Eigenausführung</strong>.</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 10: GAP MAP                                     */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="gap-map">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 10</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-400" />
                  Gap Map — Alle Lücken nach Kategorie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="markt" className="w-full">
                  <TabsList className="flex flex-wrap bg-white/5 h-auto gap-1 p-1">
                    {[
                      { value: 'markt', label: 'A: Markt' },
                      { value: 'economics', label: 'B: Economics' },
                      { value: 'traktion', label: 'C: Traktion' },
                      { value: 'ops', label: 'D: Operativ' },
                      { value: 'tech', label: 'E: Tech/SEO' },
                      { value: 'brand', label: 'F: Brand' },
                      { value: 'governance', label: 'G: Governance' },
                      { value: 'pitch', label: 'H: Pitch' },
                      { value: 'story', label: 'I: Story' },
                    ].map(tab => (
                      <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-2 py-1">{tab.label}</TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="markt" className="space-y-4 mt-4">
                    {[
                      { id: 'A1', title: 'Keine belegte Nachfrage-Engine', status: 'KRITISCHE LÜCKE', betrifft: 'Umzugscheck.ch', text: 'Ohne nachgewiesenen organischen oder bezahlten Zufluss ist Umzugscheck keine Engine, sondern Infrastruktur.', fix: 'GSC, Analytics, Top-Queries, Leads pro Landingpage, Conversion nach Kanal — 90-Tage-Trafficdaten.' },
                      { id: 'A2', title: 'Unklare Marktaufnahme für Hybridmodell', status: 'PLAUSIBEL', betrifft: 'Beide', text: 'Nicht belegt, dass der Schweizer Markt genau diese Kombination aus Vergleich + KI + Eigenausführung will.', fix: '10–20 qualitative Kundeninterviews plus erste Nutzungsdaten.' },
                    ].map(gap => (
                      <div key={gap.id} className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-white/40">{gap.id}</span>
                            <h4 className="text-sm font-bold text-white">{gap.title}</h4>
                          </div>
                          <StatusBadge status={gap.status} />
                        </div>
                        <p className="text-xs text-white/50">Betrifft: {gap.betrifft}</p>
                        <p className="text-xs text-white/60">{gap.text}</p>
                        <p className="text-xs text-teal-400">→ Fix: {gap.fix}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="economics" className="space-y-4 mt-4">
                    {[
                      { id: 'B1', title: 'Keine belegten Unit Economics', status: 'KRITISCHE LÜCKE', betrifft: 'Beide (operativ Feierabend)', text: 'Ohne echte Vollkostenrechnung ist die Profitabilitätsstory wertlos.', fix: '5–10 reale Aufträge mit Vollkostenrechnung.' },
                      { id: 'B2', title: 'Überbreites Revenue-Modell ohne primären Driver', status: 'RISIKO', betrifft: 'Beide', text: 'Wenn 10 Streams existieren, aber keiner bewiesen ist, gibt es kein Geschäftsmodell, nur Optionen.', fix: 'Definition: 1 Haupt-Stream, 1 optionaler zweiter.' },
                    ].map(gap => (
                      <div key={gap.id} className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2"><span className="text-xs font-mono text-white/40">{gap.id}</span><h4 className="text-sm font-bold text-white">{gap.title}</h4></div>
                          <StatusBadge status={gap.status} />
                        </div>
                        <p className="text-xs text-white/50">Betrifft: {gap.betrifft}</p>
                        <p className="text-xs text-white/60">{gap.text}</p>
                        <p className="text-xs text-teal-400">→ Fix: {gap.fix}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="traktion" className="space-y-4 mt-4">
                    {[
                      { id: 'C1', title: 'Kein dokumentierter End-to-End-Fall', status: 'KRITISCHE LÜCKE', betrifft: 'Beide', text: 'Ohne Portal→Auftrag→Zahlung-Fall ist das Modell theoretisch.', fix: 'Mind. 3, besser 5–10 dokumentierte End-to-End-Fälle.' },
                      { id: 'C2', title: 'Keine Partner-Validation', status: 'KRITISCHE LÜCKE', betrifft: 'Umzugscheck.ch', text: 'Ohne validierte Partnerseite ist das Plattformmodell nur Behauptung.', fix: '3 Partner-LOIs oder dokumentierte Zahlungsbereitschaftstests.' },
                    ].map(gap => (
                      <div key={gap.id} className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2"><span className="text-xs font-mono text-white/40">{gap.id}</span><h4 className="text-sm font-bold text-white">{gap.title}</h4></div>
                          <StatusBadge status={gap.status} />
                        </div>
                        <p className="text-xs text-white/50">Betrifft: {gap.betrifft}</p>
                        <p className="text-xs text-white/60">{gap.text}</p>
                        <p className="text-xs text-teal-400">→ Fix: {gap.fix}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="ops" className="space-y-4 mt-4">
                    {[
                      { id: 'D1', title: 'Keine belegte Delivery-Kapazität', status: 'KRITISCHE LÜCKE', betrifft: 'Feierabendservices.ch', text: 'Akquise ohne kontrolliertes Fulfillment vernichtet Vertrauen und Marge.', fix: 'Operations-Matrix mit Wochenkapazität, Engpässen und Eskalationslogik.' },
                      { id: 'D2', title: 'Founder als Bottleneck', status: 'KRITISCHE LÜCKE', betrifft: 'Beide', text: 'Solo-Founder mit Portal, Delivery, Pitch, SEO und KI ist nicht skalierbar.', fix: 'Mind. 1 operative + 1 digitale Verantwortlichkeit.' },
                    ].map(gap => (
                      <div key={gap.id} className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2"><span className="text-xs font-mono text-white/40">{gap.id}</span><h4 className="text-sm font-bold text-white">{gap.title}</h4></div>
                          <StatusBadge status={gap.status} />
                        </div>
                        <p className="text-xs text-white/50">Betrifft: {gap.betrifft}</p>
                        <p className="text-xs text-white/60">{gap.text}</p>
                        <p className="text-xs text-teal-400">→ Fix: {gap.fix}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="tech" className="space-y-4 mt-4">
                    {[
                      { id: 'E1', title: 'Automatisierungsclaim nicht operationalisiert', status: 'REINE ANNAHME', betrifft: 'Beide', text: '"92–95% automatisiert" sagt ohne Prozessdefinition nichts.', fix: 'Prozesslandkarte alt vs. neu, Zeit- und Fehlervergleich.' },
                      { id: 'E2', title: 'SEO-Moat ist NICHT BELEGT', status: 'RISIKO', betrifft: 'Umzugscheck.ch', text: 'Rankings sind kein Burggraben wenn Traction, Autorität und Differenzierung fehlen.', fix: 'Wettbewerberanalyse plus echte SEO-Daten.' },
                    ].map(gap => (
                      <div key={gap.id} className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2"><span className="text-xs font-mono text-white/40">{gap.id}</span><h4 className="text-sm font-bold text-white">{gap.title}</h4></div>
                          <StatusBadge status={gap.status} />
                        </div>
                        <p className="text-xs text-white/50">Betrifft: {gap.betrifft}</p>
                        <p className="text-xs text-white/60">{gap.text}</p>
                        <p className="text-xs text-teal-400">→ Fix: {gap.fix}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="brand" className="space-y-4 mt-4">
                    {[
                      { id: 'F1', title: 'Premium vs. Sparlogik', status: 'RISIKO', betrifft: 'Beide', text: 'Feierabend verkauft Premium, Umzugscheck zieht mit Preisvergleich an.', fix: 'Klare Segmentierung: welcher Kanal für welchen Kundentyp.' },
                      { id: 'F2', title: '"Seit 1980" ist stark, aber ungeklärt', status: 'PLAUSIBEL', betrifft: 'Feierabendservices.ch', text: 'Wirkt vertrauensstark, löst aber Herkunfts- und Kapitalfragen aus.', fix: '1 klare Timeline-Slide plus belegbare Historie.' },
                    ].map(gap => (
                      <div key={gap.id} className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2"><span className="text-xs font-mono text-white/40">{gap.id}</span><h4 className="text-sm font-bold text-white">{gap.title}</h4></div>
                          <StatusBadge status={gap.status} />
                        </div>
                        <p className="text-xs text-white/50">Betrifft: {gap.betrifft}</p>
                        <p className="text-xs text-white/60">{gap.text}</p>
                        <p className="text-xs text-teal-400">→ Fix: {gap.fix}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="governance" className="space-y-4 mt-4">
                    {[
                      { id: 'G1', title: 'Keine Governance zwischen Portal und Feierabend', status: 'RISIKO', betrifft: 'Beide', text: 'Ohne Routing-Regeln und Fairnesslogik ist das Modell strukturell angreifbar.', fix: 'Schriftliche Routing-Policy: Portal neutral oder Eigenvertrieb.' },
                      { id: 'G2', title: 'Keine getrennte Messlogik', status: 'KRITISCHE LÜCKE', betrifft: 'Beide', text: 'Ohne getrennte P&Ls sieht man nicht, ob Portal oder Delivery funktioniert.', fix: 'Getrenntes Reporting pro Modellteil.' },
                    ].map(gap => (
                      <div key={gap.id} className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2"><span className="text-xs font-mono text-white/40">{gap.id}</span><h4 className="text-sm font-bold text-white">{gap.title}</h4></div>
                          <StatusBadge status={gap.status} />
                        </div>
                        <p className="text-xs text-white/50">Betrifft: {gap.betrifft}</p>
                        <p className="text-xs text-white/60">{gap.text}</p>
                        <p className="text-xs text-teal-400">→ Fix: {gap.fix}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="pitch" className="space-y-4 mt-4">
                    {[
                      { id: 'H1', title: 'Zu viele unbelegte Claims auf zu wenig Proof', status: 'RISIKO', betrifft: 'Beide', text: 'Pitchdeck wirkt wie Story-Konstruktion statt De-Risking.', fix: 'Claim-by-Claim-Beleg oder Claim streichen.' },
                      { id: 'H2', title: 'Runde 1 nicht als Proof-Phase formuliert', status: 'KRITISCHE LÜCKE', betrifft: 'Beide', text: 'Investoren müssen sehen, dass Runde 1 Proof finanziert, nicht Phantasie.', fix: '1 Seite "Was Runde 1 beweist" mit Proof-Gates.' },
                    ].map(gap => (
                      <div key={gap.id} className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2"><span className="text-xs font-mono text-white/40">{gap.id}</span><h4 className="text-sm font-bold text-white">{gap.title}</h4></div>
                          <StatusBadge status={gap.status} />
                        </div>
                        <p className="text-xs text-white/50">Betrifft: {gap.betrifft}</p>
                        <p className="text-xs text-white/60">{gap.text}</p>
                        <p className="text-xs text-teal-400">→ Fix: {gap.fix}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="story" className="space-y-4 mt-4">
                    {[
                      { id: 'I1', title: 'Modell ist schwer einordenbar', status: 'RISIKO', betrifft: 'Beide', text: 'Investoren wissen nicht, ob sie Portal, Operator, Tech, Leadgen oder lokalen Dienstleister bewerten.', fix: 'Klare Antwort: Was ist das primäre Unternehmen in Runde 1?' },
                      { id: 'I2', title: 'Skalierungsstory läuft Delivery-Realität voraus', status: 'REINE ANNAHME', betrifft: 'Beide', text: 'Nationale Ambition ist zu früh, solange Zürich/Zug nicht bewiesen ist.', fix: 'Pilot-Logik: 1 Region, 1 Funnel, 1 Delivery-Modell, 1 Economics-Satz.' },
                    ].map(gap => (
                      <div key={gap.id} className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2"><span className="text-xs font-mono text-white/40">{gap.id}</span><h4 className="text-sm font-bold text-white">{gap.title}</h4></div>
                          <StatusBadge status={gap.status} />
                        </div>
                        <p className="text-xs text-white/50">Betrifft: {gap.betrifft}</p>
                        <p className="text-xs text-white/60">{gap.text}</p>
                        <p className="text-xs text-teal-400">→ Fix: {gap.fix}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 11: PROOF REQUIREMENTS                          */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="proof-requirements">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 11</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-400" />
                  Proof Requirements — Was belegt werden muss
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { cat: 'A) Mit Zahlen belegen', items: [
                    { title: 'Organischer Traffic', dringlichkeit: 'maximal', wie: 'GSC + Analytics + 90-Tage-Verlauf' },
                    { title: 'Visitor → Lead → Auftrag Funnel', dringlichkeit: 'maximal', wie: 'Conversion-Tracking, CRM-Pflichtfelder, Monatsreport' },
                    { title: 'Vollkosten-DB pro Auftrag', dringlichkeit: 'maximal', wie: '5–10 echte oder pilotnahe Aufträge nachrechnen' },
                    { title: 'Blended CAC', dringlichkeit: 'hoch', wie: 'SEO-/Content-/Tool-/Founder-Aufwand + Paid-Test separat verbuchen' },
                  ]},
                  { cat: 'B) Mit operativen Beweisen belegen', items: [
                    { title: 'Kapazität', dringlichkeit: 'hoch', wie: 'Wochenkapazität, Teamrollen, Subunternehmer-Setup' },
                    { title: 'Nachbesserungs-/Reklamationsrisiko', dringlichkeit: 'hoch', wie: 'Pilotfälle protokollieren, Nacharbeitskosten festhalten' },
                    { title: 'Founder-Entlastung', dringlichkeit: 'hoch', wie: 'Teamplan + zweite Schlüsselperson' },
                  ]},
                  { cat: 'C) Mit Marktbelegen belegen', items: [
                    { title: 'Partner-Zahlungsbereitschaft', dringlichkeit: 'maximal', wie: '3–5 Partnergespräche, Preisreaktion, LOIs' },
                    { title: 'Kundenreaktion auf Hybridlogik', dringlichkeit: 'mittel-hoch', wie: '5–10 Nutzerinterviews, Messaging-Tests' },
                    { title: 'Premium-Zahlungsbereitschaft auf realem Traffic', dringlichkeit: 'hoch', wie: 'Win/Loss-Analyse der ersten Angebote' },
                  ]},
                  { cat: 'D) Mit realer Nutzung belegen', items: [
                    { title: 'Erste echte Portal-Aufträge', dringlichkeit: 'maximal', wie: 'Portal-Lead markieren und bis Zahlung tracken' },
                    { title: 'KI-/Video-/WhatsApp-Nutzung', dringlichkeit: 'hoch', wie: 'Nutzungsquote, Drop-off, Accuracy, Zeitersparnis' },
                    { title: 'Leadqualität nach Kanal', dringlichkeit: 'hoch', wie: 'Kanal-Tagging und Ergebnisbewertung' },
                  ]},
                  { cat: 'E) Mit strategischer Logik erklären', items: [
                    { title: 'Was Umzugscheck in Runde 1 wirklich ist', dringlichkeit: 'maximal', wie: '1 Satz, 1 Modell, 1 Priorität' },
                    { title: 'Wie Portal und Feierabend zusammenspielen', dringlichkeit: 'maximal', wie: 'Routing-Regeln + Transparenz + Reporting' },
                    { title: 'Warum 2 Marken und nicht 4', dringlichkeit: 'hoch', wie: 'Markenfokusentscheidung' },
                  ]},
                ].map((category, ci) => (
                  <Collapsible key={ci} title={category.cat} defaultOpen={ci === 0} icon={CheckCircle2}>
                    <div className="space-y-3">
                      {category.items.map((item, ii) => (
                        <div key={ii} className="bg-white/5 rounded p-3 border border-white/10">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="text-sm font-bold text-white">{item.title}</h5>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${item.dringlichkeit === 'maximal' ? 'bg-red-500/20 text-red-400' : item.dringlichkeit === 'hoch' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {item.dringlichkeit.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-white/50">Wie: {item.wie}</p>
                        </div>
                      ))}
                    </div>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 12: PITCH CLAIM AUDIT (ERWEITERT)               */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="claim-audit-extended">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 12</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-yellow-400" />
                  Pitch Claim Audit — Erweitert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="sicher" className="w-full">
                  <TabsList className="flex bg-white/5 h-auto gap-1 p-1">
                    <TabsTrigger value="sicher" className="text-xs px-2 py-1">✓ Sicher</TabsTrigger>
                    <TabsTrigger value="vorsichtig" className="text-xs px-2 py-1">⚠ Vorsichtig</TabsTrigger>
                    <TabsTrigger value="zugross" className="text-xs px-2 py-1">✗ Zu gross</TabsTrigger>
                    <TabsTrigger value="nicht" className="text-xs px-2 py-1">🚫 Nicht sagen</TabsTrigger>
                  </TabsList>

                  <TabsContent value="sicher" className="space-y-3 mt-4">
                    {[
                      { claim: '"Der Markt ist fragmentiert und vertrauenssensibel."', besser: '"Wir adressieren einen fragmentierten, vertrauens- und prozesssensiblen Umzugsmarkt."' },
                      { claim: '"Wir haben eine Live-Infrastruktur und testen aktiv Funnels."', besser: '"Die Infrastruktur steht; der wirtschaftliche Proof wird in Runde 1 erbracht."' },
                      { claim: '"Runde 1 ist eine Proof-Phase."', besser: '"Runde 1 dient der Validierung von Traffic, Funnel, Unit Economics und Partnerakzeptanz."' },
                    ].map((c, i) => (
                      <div key={i} className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
                        <p className="text-sm text-white font-medium">{c.claim}</p>
                        <p className="text-xs text-teal-400 mt-1">→ Besser: {c.besser}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="vorsichtig" className="space-y-3 mt-4">
                    {[
                      { claim: '"Zwei Marken, ein System."', problem: 'Zusammenspiel noch unbewiesen', besser: '"Wir testen ein 2-Marken-Modell, bei dem Umzugscheck Nachfrage strukturiert und Feierabend ausgewählte Services liefert."' },
                      { claim: '"KI-gestützte Vorqualifikation und Offertierung."', problem: 'ROI, Accuracy, Fehlerreduktion unbelegt', besser: '"Wir automatisieren Teile der Lead-Qualifizierung und Voroffertierung."' },
                      { claim: '"Premium-Positionierung von Feierabend."', problem: 'Premium-Akzeptanz nicht belegt', besser: '"Feierabend wird als qualitäts- und serviceorientierter Anbieter positioniert."' },
                    ].map((c, i) => (
                      <div key={i} className="bg-yellow-500/5 rounded-lg p-3 border border-yellow-500/10">
                        <p className="text-sm text-white font-medium">{c.claim}</p>
                        <p className="text-xs text-orange-400 mt-1">Problem: {c.problem}</p>
                        <p className="text-xs text-teal-400 mt-1">→ Besser: {c.besser}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="zugross" className="space-y-3 mt-4">
                    {[
                      { claim: '"10 Revenue Streams"', besser: '"Runde 1 fokussiert auf 1 Portal-Stream und 1 Service-Stream."' },
                      { claim: '"4 Brands als Wettbewerbsvorteil"', besser: '"Für die Proof-Phase fokussieren wir auf 2 Marken."' },
                      { claim: '"Skalierbares Modell"', besser: '"Wir testen eine skalierbare Nachfrage-Engine und prüfen, wie weit Delivery kontrolliert mitwachsen kann."' },
                    ].map((c, i) => (
                      <div key={i} className="bg-orange-500/5 rounded-lg p-3 border border-orange-500/10">
                        <p className="text-sm text-white font-medium">{c.claim}</p>
                        <p className="text-xs text-teal-400 mt-1">→ Besser: {c.besser}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="nicht" className="space-y-3 mt-4">
                    {[
                      { claim: '"Zero CAC via eigenes Portal"', warum: 'Ignoriert SEO-/Content-/Tech-/Founder-Kosten', besser: '"Potenzial für sinkende marginale Akquisitionskosten bei funktionierendem organischem Inbound."' },
                      { claim: '"90%+ Marge auf Premium"', warum: 'Ökonomisch extrem, ohne Vollkosten-DB', besser: 'Vorerst streichen.' },
                      { claim: '"92–95% KI-automatisiert"', warum: 'Keine Definition, kein ROI', besser: '"Automatisierte Lead-Qualifizierung in klar definierten Prozessschritten."' },
                      { claim: '"200+ geprüfte Firmen"', warum: 'Unklar ob aktiv oder nur gelistet', besser: '"X aktiv gelistete / Y validierte / Ziel 200+."' },
                      { claim: '"Neutrales Vergleichsportal"', warum: 'Kollidiert mit interner Eigenausführung', besser: 'Governance offenlegen oder streichen.' },
                    ].map((c, i) => (
                      <div key={i} className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                        <p className="text-sm text-white font-medium">{c.claim}</p>
                        <p className="text-xs text-red-400 mt-1">Warum nicht: {c.warum}</p>
                        <p className="text-xs text-teal-400 mt-1">→ Besser: {c.besser}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 13: INVESTOR CONFUSION POINTS                   */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="confusion-points">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 13</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Investor Confusion Points — Wo Investoren aussteigen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { frage: 'Ist das ein Portal oder ein Operator?', gefahr: 'Bewertungslogik und Risiko-Profil unterscheiden sich massiv.', investorfrage: '"In was investiere ich eigentlich?"', typ: 'strukturell', fix: 'Für Runde 1 eine Hauptlogik festlegen.' },
                  { frage: 'Ist das ein Marktplatz oder ein Eigenvertriebskanal?', gefahr: 'Governance- und Trust-Risiko.', investorfrage: '"Warum sollten Partner in diesem Setup bleiben?"', typ: 'strukturell', fix: 'Explizite Routing-Policy.' },
                  { frage: 'Ist das ein Tech-/KI-Case oder ein lokaler Servicebetrieb?', gefahr: 'Falsche Investoren werden angesprochen.', investorfrage: '"Wo ist der echte nichtlineare Hebel?"', typ: 'teils strukturell, teils kommunikativ', fix: 'KI als Prozesshebel, nicht als Ersatz für Delivery.' },
                  { frage: 'Ist das Premium oder Preisvergleich?', gefahr: 'Falsche Kundenerwartung.', investorfrage: '"Welcher Kundentyp ist eigentlich der Zielkunde?"', typ: 'kommunikativ mit strukturellem Kern', fix: 'Segmentierung statt Mischsignal.' },
                  { frage: 'Ist das Proof- oder Skalierungsfinanzierung?', gefahr: 'Falsche Erwartung an Output der Runde.', investorfrage: '"Wofür genau werden 80–100k eingesetzt?"', typ: 'kommunikativ', fix: 'Runde 1 als Proof-Gate definieren.' },
                  { frage: 'Ist "seit 1980" Substanz oder nur Vertrauensrahmen?', gefahr: 'Investoren fragen nach Historie, Kapital, Altlasten.', investorfrage: '"Warum braucht ein bestehender Betrieb jetzt dieses Kapital?"', typ: 'kommunikativ', fix: 'Timeline-Slide.' },
                ].map((cp, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-white">{i + 1}. {cp.frage}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${cp.typ.includes('strukturell') ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {cp.typ.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-red-400/80 mb-1">⚠ {cp.gefahr}</p>
                    <p className="text-xs text-white/50 italic mb-1">Investorfrage: {cp.investorfrage}</p>
                    <p className="text-xs text-teal-400">→ {cp.fix}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 14: WHAT MUST BE FIXED                          */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="must-fix">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 14</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-400" />
                  What Must Be Fixed Before Investors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Collapsible title="A) 10 Punkte vor Investorengespräch" defaultOpen={true} icon={AlertTriangle}>
                  <div className="space-y-2">
                    {[
                      { nr: 1, title: 'Hauptmodell definieren', was: 'Portal mit Partnerfokus oder Eigenvertrieb mit Overflow-Partnern', risiko: 'Investor steigt an der Modelllogik aus' },
                      { nr: 2, title: 'GSC + Analytics offenlegen', was: 'Tracking sauber live, 30–90 Tage Verlauf', risiko: 'Akquise-These bleibt leer' },
                      { nr: 3, title: 'End-to-End-Funnel aufsetzen', was: 'CRM, Pflichtfelder, Status bis Zahlung', risiko: 'Keine belastbare Traktion' },
                      { nr: 4, title: 'Job-Level-Vollkosten rechnen', was: '5–10 Jobs sauber kalkulieren', risiko: 'Economics unbrauchbar' },
                      { nr: 5, title: 'Cherry-Picking/Routing regeln', was: 'Schriftliche Routing-Policy + Partner-Logik', risiko: 'Trust-/Partner-Risiko = Kern-KO' },
                      { nr: 6, title: 'Partner-Validation holen', was: '3–5 Gespräche, LOIs, Preisfeedback', risiko: 'Keine Plattform-These' },
                      { nr: 7, title: '2 Marken / 1–2 Revenue-Streams', was: 'Zusatzmarken einfrieren, Revenue-Fokus schneiden', risiko: 'Case wirkt überladen' },
                      { nr: 8, title: 'Automatisierungsclaim definieren', was: 'Prozessliste + KPI-Vergleich', risiko: 'Tech-Story verliert Glaubwürdigkeit' },
                      { nr: 9, title: 'Team-/Kapazitätsplan erstellen', was: 'Zweite Schlüsselperson, Subunternehmer', risiko: 'Operations nicht investierbar' },
                      { nr: 10, title: '12-Monats-Cashflow auf Proof umbauen', was: 'Monatsgenauer Einsatzplan mit Proof-Gates', risiko: 'Ask wirkt unsauber' },
                    ].map(fix => (
                      <div key={fix.nr} className="bg-white/5 rounded p-3 border border-white/10 flex gap-3">
                        <span className="text-red-400 font-bold text-sm min-w-[20px]">{fix.nr}.</span>
                        <div className="flex-1">
                          <h5 className="text-sm font-bold text-white">{fix.title}</h5>
                          <p className="text-xs text-white/50">{fix.was}</p>
                          <p className="text-xs text-red-400/70 mt-0.5">Wenn nicht: {fix.risiko}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Collapsible>

                <Collapsible title="B) 5 Punkte vor Due Diligence" icon={FileText}>
                  <div className="space-y-2">
                    {['Getrennte P&Ls für Portal und Feierabend', '10 echte Vollkostenfälle', 'Partner-LOIs / Vertragsentwürfe / Zahlungsfeedback', 'Lead-Routing- und Governance-Regeln', '12-Monats-Cashflow plus Proof-Milestones'].map((item, i) => (
                      <div key={i} className="bg-white/5 rounded p-2 border border-white/10 text-xs text-white/70 flex gap-2">
                        <span className="text-orange-400 font-bold">{i + 1}.</span> {item}
                      </div>
                    ))}
                    <p className="text-xs text-red-400/60 italic">Wenn das fehlt, wird DD eher Autopsie als Finanzierung.</p>
                  </div>
                </Collapsible>

                <Collapsible title="C) 5 Pitch-Überarbeitungen" icon={Lightbulb}>
                  <div className="space-y-2">
                    {['"Zero CAC" entfernen oder entschärfen', '"92–95% automatisiert" vereinheitlichen und definieren', '"10 Revenue Streams" auf MVP reduzieren', '"Neutrales Vergleichsportal" nur mit Governance', 'Runde 1 klar als Proof-Runde formulieren'].map((item, i) => (
                      <div key={i} className="bg-white/5 rounded p-2 border border-white/10 text-xs text-white/70 flex gap-2">
                        <span className="text-yellow-400 font-bold">{i + 1}.</span> {item}
                      </div>
                    ))}
                  </div>
                </Collapsible>

                <Collapsible title="D) 5 Punkte defensiver darstellen" icon={Shield}>
                  <div className="space-y-2">
                    {['SEO als Asset, nicht als bereits funktionierenden Moat', 'KI als Prozesshebel, nicht als Hauptwerttreiber', 'Feierabend als qualitätsorientiert, nicht als bewiesen "Premium"', '2-Marken-These als Testmodell, nicht als bewiesenes Flywheel', 'Ask als Proof-Finanzierung, nicht als Skalierungskapital'].map((item, i) => (
                      <div key={i} className="bg-white/5 rounded p-2 border border-white/10 text-xs text-white/70 flex gap-2">
                        <span className="text-teal-400 font-bold">{i + 1}.</span> {item}
                      </div>
                    ))}
                    <p className="text-xs text-white/40 italic">Das macht euch nicht kleiner, nur weniger angreifbar.</p>
                  </div>
                </Collapsible>
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 15: INVESTOR READY ROADMAP                      */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="investor-roadmap">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 15</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-400" />
                  Investor Ready Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { phase: 'PHASE 1 — Nächste 14 Tage', color: 'red', items: {
                    aufgaben: ['Modellentscheidung Portal vs. Eigenvertrieb', 'Tracking sauber einrichten', 'CRM/Funnel-Definition fixieren', 'Claims-Liste: Fakt / Hypothese / Zielwert'],
                    beweise: ['Erste GSC-/Analytics-Basis', 'Erste saubere Leadklassifikation', 'Erste Vollkostenstruktur'],
                    pitch: ['"Zero CAC" raus', 'Automatisierungsclaim präzisieren', 'Runde 1 als Proof-Runde formulieren'],
                    risiko: ['Cherry-Picking nicht als impliziten Vorteil stehen lassen', 'Fokus statt Systembreite'],
                  }},
                  { phase: 'PHASE 2 — Nächste 30 Tage', color: 'orange', items: {
                    aufgaben: ['3–5 Partnergespräche mit offener Modelllogik', '5–10 Jobs vollkostenbasiert rechnen', 'KI-/Video-/WhatsApp-Accuracy testen', 'Wettbewerber-Positionierungsvergleich'],
                    beweise: ['Erster Funnel mit echten Zahlen', 'DB je Auftrag', 'Partnerreaktion auf CPL / Hybridmodell'],
                    pitch: ['Revenue-Folie auf MVP umschreiben', 'Proof-Gates Runde 1 → Runde 2 benennen'],
                    risiko: ['Modellkonflikt verkleinern', 'Economics entnebeln', 'Investor Confusion Points reduzieren'],
                  }},
                  { phase: 'PHASE 3 — Vor Investorengespräch', color: 'teal', items: {
                    aufgaben: ['Pitchdeck auf belegbare Aussagen umbauen', '1 Proof Memo erstellen', 'DD-Light-Datenraum vorbereiten'],
                    beweise: ['Organischer Traffic', 'Echter Funnel', 'Reale Vollkosten', 'Partner-Validation', 'Team-/Kapazitätsplan'],
                    pitch: ['Keine Zukunftsarchitektur als Kernstory', 'Kein Multi-Brand-Überbau', 'Kein übergrosser Moat-Claim'],
                    risiko: ['Weniger Widerspruch', 'Weniger Storyinflation', 'Mehr prüfbare Mechanik'],
                  }},
                ].map((phase, pi) => (
                  <div key={pi} className="relative">
                    <div className={`border-l-2 ${phase.color === 'red' ? 'border-red-500' : phase.color === 'orange' ? 'border-orange-500' : 'border-teal-500'} pl-4 space-y-3`}>
                      <h4 className={`text-sm font-black ${phase.color === 'red' ? 'text-red-400' : phase.color === 'orange' ? 'text-orange-400' : 'text-teal-400'}`}>{phase.phase}</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] text-white/40 font-bold mb-1">AUFGABEN</p>
                          {phase.items.aufgaben.map((a, i) => <p key={i} className="text-xs text-white/60">• {a}</p>)}
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 font-bold mb-1">BEWEISE</p>
                          {phase.items.beweise.map((b, i) => <p key={i} className="text-xs text-white/60">• {b}</p>)}
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 font-bold mb-1">PITCH-ANPASSUNGEN</p>
                          {phase.items.pitch.map((p, i) => <p key={i} className="text-xs text-white/60">• {p}</p>)}
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 font-bold mb-1">RISIKO-REDUKTION</p>
                          {phase.items.risiko.map((r, i) => <p key={i} className="text-xs text-white/60">• {r}</p>)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 16: FINAL DECISION FRAME                        */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="final-verdict">
            <Card className="bg-gradient-to-br from-white/[0.04] to-white/[0.02] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 16</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-white" />
                  Final Decision Frame
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { frage: 'Warum noch nicht investierbar?', antwort: 'Der fehlende Beweis eines funktionierenden wirtschaftlichen Kern-Loops. Nicht die Idee ist das Hauptproblem. Der Nachweis ist es.' },
                  { frage: 'Was muss das Team jetzt beweisen?', antwort: 'Dass Umzugscheck echte qualifizierte Nachfrage erzeugt, die in bezahlte und profitabel messbare Aufträge kippt.' },
                  { frage: 'Grösster Kommunikationsfehler?', antwort: 'Hypothesen werden stellenweise wie belegte Systemvorteile verkauft — vor allem bei CAC, Marge, Automatisierung, Neutralität und Multi-Brand-Logik.' },
                  { frage: 'Grösster strategischer Unsicherheitsfaktor?', antwort: 'Ob Portal und Eigenausführung ein echter Vorteil oder ein struktureller Konflikt sind.' },
                  { frage: 'Grösster operativer Unsicherheitsfaktor?', antwort: 'Ob Feierabend bei mehr Nachfrage Qualität, Marge und Kapazität halten kann.' },
                  { frage: 'Grösster unbelegter Werttreiber?', antwort: 'Die Annahme, dass organische Nachfrage + Eigenausführung + Automatisierung zusammen einen echten Venture-Hebel erzeugen.' },
                ].map((v, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-xs text-white/40 font-bold mb-1">{v.frage}</p>
                    <p className="text-sm text-white/80">{v.antwort}</p>
                  </div>
                ))}

                <div className="bg-gradient-to-r from-teal-500/10 to-orange-500/10 border border-teal-500/20 rounded-lg p-6 mt-4">
                  <h4 className="text-sm font-black text-white mb-3">Von "zu früh" zu "prüfenswert" — 6 Bedingungen</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      'Echter Traffic-Nachweis',
                      'Echter Funnel-Nachweis',
                      'Erste bezahlte Portal-Aufträge',
                      'Belegte Vollkosten-DB',
                      'Partner-Validation trotz offenem Modell',
                      'Radikale Vereinfachung auf 2 Marken + 1–2 Revenue-Streams',
                    ].map((cond, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-teal-500/50 flex items-center justify-center">
                          <span className="text-[10px] text-teal-400 font-bold">{i + 1}</span>
                        </div>
                        <span className="text-xs text-white/70">{cond}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4">
                  <p className="text-sm text-white/70">
                    <strong className="text-red-400">Harte Schlussbewertung:</strong> Aktuell ist das Modell nicht investierbar genug für ein sauberes Investorengespräch, weil die gefährlichsten Punkte nicht nur offen, sondern <em>tragend</em> offen sind. Nicht weil das Projekt schwach gedacht ist — sondern weil es noch zu viel Systemarchitektur und zu wenig bewiesene Mechanik hat.
                  </p>
                  <p className="text-xs text-white/40 mt-2 italic">Das ist ein klassischer Gründerfehler. Sehr menschlich, sehr teuer.</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 17: EXECUTIVE ACTION SUMMARY                    */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="executive-action">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 17</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  Executive Action Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white mb-3">5 wichtigste Baustellen</h4>
                  <div className="space-y-2">
                    {[
                      { nr: 1, title: 'Revenue-Loop beweisen', typ: 'Beweisproblem', desc: 'Kein einziger dokumentierter Portal→Auftrag→Zahlung-Fall existiert.' },
                      { nr: 2, title: 'Neutralitätskonflikt lösen', typ: 'Strukturproblem', desc: 'Portal + Eigenausführung ohne Governance = strukturell angreifbar.' },
                      { nr: 3, title: 'Team/Advisor aufbauen', typ: 'Operationsproblem', desc: 'Solo-Founder-Setup ist nicht investierbar.' },
                      { nr: 4, title: 'GSC-Daten & Traffic-Nachweis', typ: 'Beweisproblem', desc: 'Ohne Traffic-Proof ist die SEO-These leer.' },
                      { nr: 5, title: 'Fokus-Cut durchführen', typ: 'Strategieproblem', desc: '4 Brands, 10 Streams = Verzettelung. Runter auf 2 Marken, 1-2 Streams.' },
                    ].map(b => (
                      <div key={b.nr} className="bg-white/5 rounded p-3 border border-white/10 flex gap-3">
                        <span className="text-orange-400 font-bold text-sm min-w-[20px]">{b.nr}.</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h5 className="text-sm font-bold text-white">{b.title}</h5>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">{b.typ}</span>
                          </div>
                          <p className="text-xs text-white/50">{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-red-400 mb-2">3 KRITISCHSTE VOR INVESTOR</h4>
                    {['Revenue-Loop mit echten Zahlen', 'Routing-Governance schriftlich', 'Unit Economics mit Vollkosten'].map((p, i) => (
                      <p key={i} className="text-xs text-white/60 py-0.5">• {p}</p>
                    ))}
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-orange-400 mb-2">3 HÄUFIGSTE SCHEITER-GRÜNDE</h4>
                    {['Kein Proof = kein Investment', 'Operativer Engpass bei Skalierung', 'Partner-Abwanderung durch Cherry-Picking'].map((p, i) => (
                      <p key={i} className="text-xs text-white/60 py-0.5">• {p}</p>
                    ))}
                  </div>
                  <div className="bg-teal-500/5 border border-teal-500/10 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-teal-400 mb-2">3 GRÖSSTE HEBEL</h4>
                    {['5 Jobs mit Vollkosten = Economics-Beweis', 'GSC-Export = Traffic-Beweis', 'Fokus-Cut = Klarheit für alle Stakeholder'].map((p, i) => (
                      <p key={i} className="text-xs text-white/60 py-0.5">• {p}</p>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-sm font-bold text-white mb-2">Problem-Typ-Verteilung</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Kommunikation', count: '~30%', color: 'text-yellow-400' },
                      { label: 'Beweis', count: '~45%', color: 'text-red-400' },
                      { label: 'Modell/Operation', count: '~25%', color: 'text-orange-400' },
                    ].map((t, i) => (
                      <div key={i} className="bg-white/5 rounded p-2">
                        <p className={`text-lg font-bold ${t.color}`}>{t.count}</p>
                        <p className="text-[10px] text-white/40">{t.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 18: MASTER ACTION LIST                          */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="master-actions">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 18</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-teal-400" />
                  Master Action List — Priorisierte Massnahmen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { title: '5 echte Jobs mit Vollkostenrechnung', kategorie: 'Proof / Data', dringlichkeit: 'kritisch', hebel: 'hoch', schwierigkeit: 'mittel', betrifft: 'Feierabend', typ: 'Beweisproblem', output: 'CM2-Nachweis pro Auftragstyp', erfolg: 'CM2 > 25% auf mind. 5 Jobs' },
                  { title: 'GSC-Daten exportieren & aufbereiten', kategorie: 'SEO / Akquise', dringlichkeit: 'kritisch', hebel: 'hoch', schwierigkeit: 'niedrig', betrifft: 'Umzugscheck', typ: 'Beweisproblem', output: '90-Tage-Traffic-Report', erfolg: 'Kommerzielle Queries sichtbar' },
                  { title: 'Routing-Governance definieren', kategorie: 'Legal / Struktur', dringlichkeit: 'kritisch', hebel: 'hoch', schwierigkeit: 'mittel', betrifft: 'Beide', typ: 'Strukturproblem', output: 'Schriftliche Routing-Policy', erfolg: 'Partner können Regeln einsehen' },
                  { title: 'Partner-LOIs einholen (3–5)', kategorie: 'Markt', dringlichkeit: 'hoch', hebel: 'hoch', schwierigkeit: 'mittel', betrifft: 'Umzugscheck', typ: 'Beweisproblem', output: 'LOIs / Zahlungsbereitschafts-Feedback', erfolg: 'Mind. 3 Partner mit Preis-Reaktion' },
                  { title: 'Pitch auf 250–300 CHF Kern reduzieren', kategorie: 'Pitch / Investor', dringlichkeit: 'hoch', hebel: 'hoch', schwierigkeit: 'niedrig', betrifft: 'Beide', typ: 'Kommunikationsproblem', output: 'Überarbeitetes Pitchdeck', erfolg: 'Kein Claim ohne Quelle' },
                  { title: 'Fokus-Cut: 2 Marken, 1–2 Streams', kategorie: 'Positionierung', dringlichkeit: 'hoch', hebel: 'hoch', schwierigkeit: 'niedrig', betrifft: 'Beide', typ: 'Strategieproblem', output: 'Markenstrategie-Dokument', erfolg: 'Zusatzmarken geparkt/redirected' },
                  { title: '500 CHF Paid-Channel-Test', kategorie: 'Conversion', dringlichkeit: 'hoch', hebel: 'mittel', schwierigkeit: 'niedrig', betrifft: 'Umzugscheck', typ: 'Beweisproblem', output: 'CPL-Benchmark', erfolg: 'CPL < 50 CHF' },
                  { title: 'Team-/Advisor-Plan erstellen', kategorie: 'Operations', dringlichkeit: 'hoch', hebel: 'mittel', schwierigkeit: 'mittel', betrifft: 'Beide', typ: 'Operationsproblem', output: 'Organigramm + Hiring-Plan', erfolg: '2. Schlüsselperson identifiziert' },
                  { title: 'End-to-End Funnel-Tracking', kategorie: 'Conversion', dringlichkeit: 'hoch', hebel: 'hoch', schwierigkeit: 'mittel', betrifft: 'Umzugscheck', typ: 'Beweisproblem', output: 'CRM mit Lead-Status bis Zahlung', erfolg: 'Conversion-Rate messbar' },
                  { title: 'Automatisierungsclaim mit Prozessliste', kategorie: 'Proof / Data', dringlichkeit: 'mittel', hebel: 'mittel', schwierigkeit: 'niedrig', betrifft: 'Beide', typ: 'Kommunikationsproblem', output: 'Prozesslandkarte alt vs. neu', erfolg: 'Zeitersparnis in Stunden beziffert' },
                  { title: 'Wettbewerber-Analyse (Movu, Compero)', kategorie: 'Markt', dringlichkeit: 'mittel', hebel: 'mittel', schwierigkeit: 'niedrig', betrifft: 'Umzugscheck', typ: 'Beweisproblem', output: 'Feature-/Preis-/Traffic-Vergleich', erfolg: 'Differenzierung klar dokumentiert' },
                  { title: 'Proof Memo erstellen (1–2 Seiten)', kategorie: 'Pitch / Investor', dringlichkeit: 'mittel', hebel: 'hoch', schwierigkeit: 'mittel', betrifft: 'Beide', typ: 'Kommunikationsproblem', output: 'Investor-ready Proof Memo', erfolg: 'Alle Claims mit Quellen' },
                ].map((action, i) => (
                  <Collapsible key={i} title={`${action.title}`} icon={action.dringlichkeit === 'kritisch' ? AlertTriangle : action.dringlichkeit === 'hoch' ? AlertCircle : Lightbulb}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div><span className="text-white/30">Kategorie:</span> <span className="text-white/70">{action.kategorie}</span></div>
                      <div><span className="text-white/30">Betrifft:</span> <span className="text-white/70">{action.betrifft}</span></div>
                      <div><span className="text-white/30">Dringlichkeit:</span> <span className={action.dringlichkeit === 'kritisch' ? 'text-red-400' : action.dringlichkeit === 'hoch' ? 'text-orange-400' : 'text-yellow-400'}>{action.dringlichkeit}</span></div>
                      <div><span className="text-white/30">Hebel:</span> <span className="text-teal-400">{action.hebel}</span></div>
                      <div><span className="text-white/30">Schwierigkeit:</span> <span className="text-white/70">{action.schwierigkeit}</span></div>
                      <div><span className="text-white/30">Problem-Typ:</span> <span className="text-white/70">{action.typ}</span></div>
                      <div className="col-span-2"><span className="text-white/30">Output:</span> <span className="text-white/70">{action.output}</span></div>
                    </div>
                    <p className="text-xs text-teal-400 mt-2">✓ Erfolg: {action.erfolg}</p>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 19: PRIORITY MATRIX                             */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="priority-matrix">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 19</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-yellow-400" />
                  Priority Matrix — 4 Felder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <h4 className="text-sm font-black text-red-400 mb-3">A) SOFORT — Hoher Hebel, hohe Dringlichkeit</h4>
                    {[
                      { thema: 'Revenue-Proof (5 Jobs mit Vollkosten)', risiko: 'Ohne = keine Economics-Basis' },
                      { thema: 'GSC-Daten exportieren', risiko: 'Ohne = Traffic-These leer' },
                      { thema: 'Fokus-Cut (2 Marken)', risiko: 'Ohne = Verzettelung sichtbar' },
                      { thema: 'Routing-Governance definieren', risiko: 'Ohne = Neutralitätskonflikt offen' },
                    ].map((item, i) => (
                      <div key={i} className="mb-2">
                        <p className="text-xs text-white/70 font-medium">• {item.thema}</p>
                        <p className="text-[10px] text-red-400/60 ml-3">{item.risiko}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                    <h4 className="text-sm font-black text-orange-400 mb-3">B) BALD — Hoher Hebel, nicht sofort kritisch</h4>
                    {[
                      { thema: 'Partner-Validation (3–5 LOIs)', risiko: 'Ohne = Plattformmodell theoretisch' },
                      { thema: 'Teamplan / 2. Schlüsselperson', risiko: 'Ohne = Solo-Founder-Risiko offen' },
                      { thema: 'Paid-Channel-Test (500 CHF)', risiko: 'Ohne = kein CPL-Benchmark' },
                      { thema: 'End-to-End Funnel-Tracking', risiko: 'Ohne = Conversion unmessbar' },
                    ].map((item, i) => (
                      <div key={i} className="mb-2">
                        <p className="text-xs text-white/70 font-medium">• {item.thema}</p>
                        <p className="text-[10px] text-orange-400/60 ml-3">{item.risiko}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <h4 className="text-sm font-black text-yellow-400 mb-3">C) NACHGELAGERT — Sinnvoll, aber nicht entscheidend</h4>
                    {[
                      { thema: 'Internationalisierung', risiko: 'Ablenkung vom regionalen Proof' },
                      { thema: 'Premium-Packages', risiko: 'Erst relevant nach Basis-Revenue' },
                      { thema: 'Exit-Szenarien im Pitch', risiko: 'Zu früh ohne Traktion' },
                      { thema: 'Wettbewerber-Deep-Dive', risiko: 'Gut, aber nicht blockernd' },
                    ].map((item, i) => (
                      <div key={i} className="mb-2">
                        <p className="text-xs text-white/70 font-medium">• {item.thema}</p>
                        <p className="text-[10px] text-yellow-400/60 ml-3">{item.risiko}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                    <h4 className="text-sm font-black text-white/60 mb-3">D) NICHT DISKUTIEREN bis belegt</h4>
                    {[
                      { thema: '6+ Revenue Streams', risiko: 'Wirkt wie Wunschliste' },
                      { thema: '92% Profitabilität / Automatisierung', risiko: 'Undefiniert und unglaubwürdig' },
                      { thema: '"100% safe" Investment', risiko: 'Zerstört Investor-Vertrauen' },
                      { thema: '"Zero CAC"', risiko: 'Widerspruch zur Investitionslogik' },
                    ].map((item, i) => (
                      <div key={i} className="mb-2">
                        <p className="text-xs text-white/70 font-medium">• {item.thema}</p>
                        <p className="text-[10px] text-white/30 ml-3">{item.risiko}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 20: INTERNAL WORKSTREAMS                        */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="workstreams">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 20</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                  Internal Workstreams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { nr: 1, title: 'Markt- und Modellklarheit', ziel: 'Eindeutige Positionierung für Runde 1', fragen: ['Portal oder Eigenvertrieb?', '2 oder 4 Marken?', 'Welcher Haupt-Revenue-Stream?'], deliverables: ['Positionierungspapier', 'Markenfokus-Entscheidung'], risiko: 'Investor Confusion' },
                  { nr: 2, title: 'Proof / Kennzahlen / Nachweise', ziel: 'Belastbare Zahlen für jede Kernthese', fragen: ['Wie viele Jobs für valide CM2?', 'Welche GSC-Metriken relevant?', 'Was ist der echte blended CAC?'], deliverables: ['5–10 Job-Kalkulationen', 'GSC-Report', 'CPL-Test'], risiko: 'Kein Investment ohne Zahlen' },
                  { nr: 3, title: 'Positionierung / Story / Pitch', ziel: 'Pitchdeck das nur Belegtes behauptet', fragen: ['Welche Claims streichen?', 'Wie Runde 1 framen?', 'Was ist die Hauptstory?'], deliverables: ['Überarbeitetes Deck', 'Proof Memo', 'Claim-Control-Liste'], risiko: 'Storyinflation = Vertrauensverlust' },
                  { nr: 4, title: 'Operations / Delivery / Skalierbarkeit', ziel: 'Nachweisbare operative Kompetenz', fragen: ['Wochenkapazität?', 'Subunternehmer-Setup?', 'Reklamationsquote?'], deliverables: ['Operations-Matrix', 'Kapazitätsplan', 'SLA-Entwurf'], risiko: 'Delivery-Engpass bei Wachstum' },
                  { nr: 5, title: 'Portal vs. Eigenausführung', ziel: 'Aufgelöster Governance-Konflikt', fragen: ['Routing-Regeln?', 'Partner-Transparenz?', 'Getrennte P&Ls?'], deliverables: ['Routing-Policy', 'Partner-Kommunikation', 'Getrenntes Reporting'], risiko: 'Cherry-Picking = Partner-KO' },
                  { nr: 6, title: 'Investor Readiness / DD-Vorbereitung', ziel: 'Gesprächsbereiter Case', fragen: ['Was fehlt für DD?', 'Datenraum-Inhalt?', 'Welche Fragen kommen?'], deliverables: ['DD-Light-Mappe', 'FAQ-Vorbereitung', 'Finanzmodell'], risiko: 'Unvorbereitet = unprofessionell' },
                ].map(ws => (
                  <Collapsible key={ws.nr} title={`WS${ws.nr}: ${ws.title}`} icon={Target}>
                    <div className="space-y-2">
                      <p className="text-xs text-teal-400">Ziel: {ws.ziel}</p>
                      <div>
                        <p className="text-[10px] text-white/30 font-bold">OFFENE FRAGEN</p>
                        {ws.fragen.map((f, i) => <p key={i} className="text-xs text-white/50">• {f}</p>)}
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 font-bold">DELIVERABLES</p>
                        {ws.deliverables.map((d, i) => <p key={i} className="text-xs text-white/60">• {d}</p>)}
                      </div>
                      <p className="text-xs text-red-400/60">Risiko wenn nicht gemacht: {ws.risiko}</p>
                    </div>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 21: WHAT TO PROVE FIRST                         */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="prove-first">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 21</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  What To Prove First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: '5 Dinge BEWEISEN', color: 'teal', items: [
                      'Dass der Funnel echte Leads produziert (nicht nur Impressions)',
                      'Dass ein Job profitabel ist (CM2 > 25%)',
                      'Dass Partner bereit sind, für Leads zu zahlen',
                      'Dass Feierabend Qualität bei Volumen halten kann',
                      'Dass 2 Marken sich gegenseitig verstärken (nicht kannibalisieren)',
                    ]},
                    { label: '5 Dinge MESSEN', color: 'orange', items: [
                      'CPL organisch vs. paid',
                      'Conversion-Rate pro Funnel-Step',
                      'Vollkosten pro Auftragstyp',
                      'Time-to-Quote und Time-to-Completion',
                      'Kundenweiterempfehlungsrate',
                    ]},
                    { label: '5 Dinge KLARER FORMULIEREN', color: 'yellow', items: [
                      'Was Umzugscheck in Runde 1 ist (1 Satz)',
                      'Was der Haupt-Revenue-Stream ist',
                      'Was "KI-gestützt" konkret bedeutet',
                      'Warum Eigenausführung ein Vorteil ist',
                      'Was Runde 1 beweist (Proof-Gates)',
                    ]},
                    { label: '5 Dinge TESTEN', color: 'blue', items: [
                      '500 CHF Google Ads → CPL-Benchmark',
                      '3 verschiedene Landing-Page-Varianten',
                      'WhatsApp-Bot vs. Formular Conversion',
                      'Premium-Preis vs. Markt-Preis Akzeptanz',
                      'Partner-Reaktion auf offene Hybridlogik',
                    ]},
                  ].map((block, bi) => (
                    <div key={bi} className={`bg-${block.color}-500/5 border border-${block.color}-500/10 rounded-lg p-4`}>
                      <h4 className={`text-sm font-bold text-${block.color}-400 mb-2`}>{block.label}</h4>
                      {block.items.map((item, i) => (
                        <p key={i} className="text-xs text-white/60 py-0.5">• {item}</p>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4 mt-4">
                  <h4 className="text-sm font-bold text-red-400 mb-2">3 Dinge NICHT MEHR NUR ERZÄHLEN, SONDERN BELEGEN</h4>
                  {[
                    { claim: '"Wir haben einen funktionierenden Funnel"', beweis: '→ Zeige Conversion-Daten' },
                    { claim: '"Die Margen sind attraktiv"', beweis: '→ Zeige 5 echte Job-Kalkulationen' },
                    { claim: '"Partner wollen mit uns arbeiten"', beweis: '→ Zeige LOIs oder Zahlungen' },
                  ].map((c, i) => (
                    <div key={i} className="mb-2">
                      <p className="text-xs text-white/60">{c.claim}</p>
                      <p className="text-xs text-teal-400">{c.beweis}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BLOCK 22: RED FLAGS IN INVESTOR MEETINGS               */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Reveal>
          <section id="red-flags">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">BLOCK 22</Badge>
                  <SourceBadge source="ANALYSE 4" />
                </div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Red Flags in Investor Meetings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { punkt: 'Neutralitätskonflikt', frage: '"Wie stellen Sie sicher, dass Ihr Portal fair vermittelt, wenn Sie die besten Leads selbst bedienen?"', gefahr: 'Investor sieht strukturellen Interessenkonflikt', vorbereitung: 'Routing-Policy schriftlich haben, Prozentsätze nennen', nicht_sagen: '"Wir sind trotzdem neutral" — ohne Governance.' },
                  { punkt: 'Revenue-Nachweis', frage: '"Zeigen Sie mir einen einzigen Portal-Auftrag von Anfang bis Zahlung."', gefahr: 'Wenn keiner existiert, ist der Case theoretisch', vorbereitung: 'Mind. 3 dokumentierte Fälle vor dem Meeting', nicht_sagen: '"Wir sind kurz davor" — ohne Beweis.' },
                  { punkt: 'Solo-Founder-Risiko', frage: '"Was passiert, wenn Sie ausfallen?"', gefahr: 'Key-Person-Dependency = Deal-Breaker', vorbereitung: 'Teamplan + Advisor/Co-Founder-Pipeline', nicht_sagen: '"Ich mache alles selbst, das reicht" — das reicht nie.' },
                  { punkt: 'Unit Economics', frage: '"Wie berechnen Sie die 40-45% DB-Marge? Sind Gründergehalt, Fahrzeug, Versicherung, Nacharbeit drin?"', gefahr: 'Wenn die Antwort "nein" ist, bricht die Economics-These zusammen', vorbereitung: 'Vollkostenrechnung mit allen Positionen', nicht_sagen: 'Jede Marge ohne Vollkosten-Basis.' },
                  { punkt: 'CAC-Claim', frage: '"Sie sagen Zero CAC — aber wer bezahlt die Website, das SEO, Ihre Zeit?"', gefahr: 'Wirkt naiv oder unehrlich', vorbereitung: 'Blended CAC ehrlich berechnen und zeigen', nicht_sagen: '"Zero" — weil es nie Null ist.' },
                  { punkt: 'Skalierbarkeit der Delivery', frage: '"Was passiert bei 50 Aufträgen pro Monat? Bei 200?"', gefahr: 'Keine Antwort = kein Plan', vorbereitung: 'Kapazitätsplanung mit Engpass-Szenarien', nicht_sagen: '"Wir skalieren einfach mit Subunternehmern" — ohne Details.' },
                ].map((rf, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
                    <h4 className="text-sm font-bold text-red-400">{i + 1}. {rf.punkt}</h4>
                    <p className="text-xs text-white/50 italic">Harte Rückfrage: {rf.frage}</p>
                    <p className="text-xs text-orange-400/70">⚠ Gefahr: {rf.gefahr}</p>
                    <p className="text-xs text-teal-400">✓ Vorbereitung: {rf.vorbereitung}</p>
                    <p className="text-xs text-red-400/50">✗ Nicht sagen: {rf.nicht_sagen}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </Reveal>


        {/* ═══════════════════════════════════════════════════════════════
            BLOCK 23 — FINAL STRATEGIC VERDICT
        ═══════════════════════════════════════════════════════════════ */}
        <Reveal>
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-black text-white tracking-tight">23. FINAL STRATEGIC VERDICT</h2>
              <SourceBadge source="FINAL VERDICT" />
            </div>

            {/* 23.1 — Strategische Entscheidung */}
            <Card className="bg-gradient-to-br from-emerald-900/40 via-[#0a1628] to-teal-900/30 border-emerald-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-emerald-400">Strategische Entscheidung: Proof-First Hybrid mit harter Governance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-white/80 leading-relaxed">
                  Von allen analysierten Varianten ist weder der reine SaaS-Pivot noch der reine Operator-Pivot die richtige Linie. 
                  Die beste Linie ist ein <span className="text-emerald-400 font-bold">Proof-First Hybrid mit harter Governance</span>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-red-400 mb-1">✗ Nicht: Pure SaaS</h4>
                    <p className="text-xs text-white/50">Kein Beweis, dass Partnerseite allein trägt. Einziger Execution-Lernkanal würde abgeschnitten.</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-red-400 mb-1">✗ Nicht: Pure Operator</h4>
                    <p className="text-xs text-white/50">Umzugscheck verliert strategischen Wert. Case wird "lokaler Dienstleister mit gutem Intake".</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-emerald-400 mb-1">✓ Richtig: Proof-First Hybrid</h4>
                    <p className="text-xs text-white/50">Hybridmodell brutal präzise begrenzen. Kontrolliertes Testdesign statt struktureller Konflikt.</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-xs text-white/60 italic">
                    "Das Projekt verwechselt stellenweise Infrastruktur mit Traktion. Genau das müsst ihr jetzt heilen."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 23.2 — Die Routing-Regel */}
            <Card className="bg-[#0d1b2a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Die Routing-Regel — Phase 1 Governance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-white/50">Nicht weich. Nicht "je nach Gefühl". Nicht "beste Leads zu uns". Sondern:</p>
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-bold text-emerald-400">Feierabend darf nur Leads übernehmen wenn:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { regel: 'Region', detail: 'Nur Zürich / Zug' },
                      { regel: 'Serviceart', detail: 'Definierte Kernservices' },
                      { regel: 'Grössenklasse', detail: 'Definierter Scope (z.B. 2–4 Zimmer)' },
                      { regel: 'Kapazität', detail: 'Nur wenn Kapazität bestätigt' },
                    ].map((r, i) => (
                      <div key={i} className="bg-white/5 rounded p-2 flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-white">{r.regel}:</span>
                          <span className="text-xs text-white/60 ml-1">{r.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-orange-400/80 mt-2">
                    ⚠ Alles ausserhalb dieses Scopes geht an Partner oder bleibt externes Matching.
                  </p>
                </div>
                <p className="text-xs text-white/40 italic">
                  Dann ist Feierabend kein geheimer Gewinner des Systems, sondern ein klar definierter Pilot-Operator innerhalb eines begrenzten Fensters.
                </p>
              </CardContent>
            </Card>

            {/* 23.3 — Pitch-Formel */}
            <Card className="bg-[#0d1b2a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Pitch-Formel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
                  <p className="text-sm text-white/80 leading-relaxed italic">
                    "Wir finanzieren den Proof eines fokussierten Hybridmodells. Umzugscheck strukturiert und qualifiziert Nachfrage. 
                    Feierabend dient in einem klar begrenzten Startscope als kontrollierter Execution-Case, damit wir Economics, 
                    Routing und Delivery-Qualität real messen können. Ob und wie weit das Modell danach für Partner geöffnet wird, 
                    hängt an definierten Proof-Kriterien."
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-red-400 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> STREICHEN
                    </h4>
                    {[
                      '"neutral" / "unabhängig"',
                      '"Zero CAC"',
                      '"92–95% automatisiert"',
                      '"4 Brands"',
                      '"10 Revenue Streams"',
                      '"skalierbares Ökosystem"',
                      '"Premium" (wenn nicht operationalisiert)',
                      '"seit 1980" als Belastbarkeitsbeweis',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-red-400/70">
                        <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> DRINLASSEN / SCHÄRFEN
                    </h4>
                    {[
                      'Markt ist fragmentiert',
                      'Funnel- und Testing-Arbeit ist real',
                      'Hybrid kann Vorteil sein',
                      'Automatisierung kann Reibung senken',
                      'Diese Runde finanziert Proof, nicht Expansion',
                      'Getrennte Economics (Portal/Vermittlung/Ausführung)',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-emerald-400/70">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 23.4 — 5 wichtigste Entscheidungen */}
            <Card className="bg-[#0d1b2a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">5 wichtigste Entscheidungen — jetzt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { nr: 1, frage: 'Was seid ihr in Phase 1?', antwort: 'Proof-gesteuerter Hybrid-Pilot mit begrenzter Eigenausführung', nicht: 'Kein neutraler Marktplatz. Kein reiner Operator.' },
                  { nr: 2, frage: 'Welche 1 Region zuerst?', antwort: 'Zürich / Zug', nicht: 'Nicht halb Schweiz — ihr seid keine göttliche API.' },
                  { nr: 3, frage: 'Welche 1 Kernservice-Linie?', antwort: 'Die Linie mit standardisierbarem Pricing, modellierbaren Margen, beherrschbarer Delivery', nicht: 'Nicht alles gleichzeitig.' },
                  { nr: 4, frage: 'Welcher 1 Hauptfunnel?', antwort: 'Ein Funnel. Maximal zwei.', nicht: 'Nicht 17 kreative Varianten.' },
                  { nr: 5, frage: 'Was ist der 1 Hauptbeweis?', antwort: 'Profitable, attributable Aufträge', nicht: 'Nicht Traffic. Nicht Keywords. Nicht Flows.' },
                ].map((e) => (
                  <div key={e.nr} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-start gap-3">
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black rounded-full w-6 h-6 flex items-center justify-center shrink-0">{e.nr}</span>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">{e.frage}</h4>
                        <p className="text-xs text-emerald-400">→ {e.antwort}</p>
                        <p className="text-xs text-red-400/60">✗ {e.nicht}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 23.5 — Phase-1 Arbeitsformel */}
            <Card className="bg-gradient-to-br from-[#0d1b2a] to-teal-900/20 border-teal-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-teal-400">Phase-1 Arbeitsformel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Hauptfrage</p>
                  <p className="text-sm text-white font-medium">Ist das Hybridmodell ein echter Vorteil oder ein struktureller Konflikt?</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Phase-1-Ziel</p>
                  <p className="text-sm text-white/80">Beweisen, dass ein digital strukturierter Demand-Layer in einem klar begrenzten Scope profitabel in operativ saubere Aufträge übersetzt werden kann — und dass die definierte Eigenausführung ökonomisch Sinn ergibt.</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">5 Kernbeweise</p>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {['Nachfragequalität', 'Funnel-Conversion', 'Vollkosten-Economics', 'Routing-Logik', 'Delivery-Zuverlässigkeit'].map((b, i) => (
                      <div key={i} className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-2 text-center">
                        <span className="text-xs font-bold text-teal-400">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 23.6 — Operating Plan Template */}
            <Card className="bg-[#0d1b2a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Operating Plan Template</CardTitle>
                <p className="text-xs text-white/40">7-Spalten-Vorlage — ausfüllen, bevor der nächste Pitch stattfindet</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Workstream', 'Owner', 'Deliverable', 'Deadline', 'Abhängigkeit', 'Proof Output', 'Kill Criterion'].map((h) => (
                          <th key={h} className="text-left text-white/60 font-bold py-2 px-2 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { ws: 'Revenue Proof', owner: '—', del: '5 Jobs mit Vollkosten-P&L', deadline: '30 Tage', dep: 'Go-Live', proof: 'CM2 pro Job', kill: 'Kein positiver CM2 nach 5 Jobs' },
                        { ws: 'Demand Validation', owner: '—', del: 'GSC-Export + CPL via Paid', deadline: '14 Tage', dep: 'Keine', proof: 'Organische Impressions + CPL', kill: 'Kein organischer Traffic nach 30d' },
                        { ws: 'Routing Governance', owner: '—', del: 'Schriftliche Routing-Regel', deadline: '7 Tage', dep: 'Keine', proof: 'Dokument + erste Anwendung', kill: '—' },
                        { ws: 'Partner Validation', owner: '—', del: '3 LOIs von Umzugsfirmen', deadline: '30 Tage', dep: 'Revenue Proof', proof: 'Unterschriebene LOIs', kill: 'Null Partner-Interesse' },
                        { ws: 'Team Setup', owner: '—', del: 'Advisor/Co-Founder Pipeline', deadline: '60 Tage', dep: 'Keine', proof: '2+ Gespräche', kill: 'Kein Fortschritt nach 60d' },
                        { ws: 'Pitch Überarbeitung', owner: '—', del: 'Proof Memo (1-2 Seiten)', deadline: '60 Tage', dep: 'Revenue + Demand', proof: 'Fertiges Dokument', kill: '—' },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-2 px-2 text-white font-medium">{row.ws}</td>
                          <td className="py-2 px-2 text-white/40">{row.owner}</td>
                          <td className="py-2 px-2 text-white/70">{row.del}</td>
                          <td className="py-2 px-2 text-teal-400">{row.deadline}</td>
                          <td className="py-2 px-2 text-white/40">{row.dep}</td>
                          <td className="py-2 px-2 text-emerald-400">{row.proof}</td>
                          <td className="py-2 px-2 text-red-400/70">{row.kill}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

          </section>
        </Reveal>

        {/* ═══ BLOCK 24: AI EXECUTION MASTERPLAN ═══ */}
        <Reveal>
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="w-7 h-7 text-cyan-400" />
              <h2 className="text-2xl font-black text-white">Block 24: AI Execution Masterplan</h2>
              <SourceBadge source="MASTERPLAN" />
            </div>
            <p className="text-sm text-white/60">
              Konsolidierung aller Analysen in konkrete Massnahmen, AI-Delegationslogik und Umsetzungsplan. Ziel: maximale Entlastung bei kontrollierbarem Risiko.
            </p>
            <AIExecutionMasterplan />
          </section>
        </Reveal>

        {/* ═══ FOOTER ═══ */}
        <Reveal>
          <div className="text-center py-8 space-y-2">
            <p className="text-xs text-white/30">
              Konsolidiert aus 4 Analyse-Runden + Final Verdict + Masterplan · Stand: März 2026 · Internes Red-Team-Dokument
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              <SourceBadge source="ANALYSE 1" />
              <SourceBadge source="ANALYSE 2" />
              <SourceBadge source="ANALYSE 3" />
              <SourceBadge source="ANALYSE 4" />
              <SourceBadge source="FEEDBACK" />
              <SourceBadge source="FINAL VERDICT" />
              <SourceBadge source="MASTERPLAN" />
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
};

export default FeedbackAnalysis;
