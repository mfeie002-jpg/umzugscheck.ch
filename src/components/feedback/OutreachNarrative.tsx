import { motion } from 'framer-motion';
import { 
  Rocket, Heart, Cpu, Timer, Megaphone, ArrowRight, 
  Target, TrendingUp, Globe, Newspaper, Trophy, Zap,
  Building2, Users, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const SourceBadge = () => (
  <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded bg-amber-600/10 text-amber-300">
    [OUTREACH]
  </span>
);

const MESSAGE_PILLARS = [
  { icon: Star, label: 'Professionell', desc: 'Schweizer Qualitätsstandard' },
  { icon: Heart, label: 'Persönlich', desc: 'Individuell begleitet' },
  { icon: Zap, label: 'Schnell & Genau', desc: 'KI-optimierte Prozesse' },
  { icon: Users, label: 'Fair & Transparent', desc: 'Keine versteckten Kosten' },
];

const RACE_MILESTONES = [
  { phase: 'Launch', label: 'Go-Live & erste Leads', weeks: '0–4', status: 'pending' as const },
  { phase: 'Traction', label: 'CPL < CHF 30, 50+ Leads/Mo', weeks: '4–12', status: 'pending' as const },
  { phase: 'Growth', label: 'Top-5 organisch, B2B Pipeline', weeks: '12–26', status: 'pending' as const },
  { phase: '#1 Online', label: 'Marktführer-Position messbar', weeks: '26–52', status: 'pending' as const },
];

const OUTREACH_TARGETS = [
  { audience: 'Swiss Tech Media', outlets: 'Startupticker, Handelszeitung Digital, Netzwoche', angle: 'KI-Startup disrupts Umzugsmarkt' },
  { audience: 'International Tech', outlets: 'TechCrunch, ProductHunt, Wired', angle: '95% AI-built platform in world\'s most competitive economy' },
  { audience: 'Industry Press', outlets: 'Immobilia, HEV Schweiz, PropTech Blogs', angle: 'Digitalisierung der Umzugsbranche — endlich' },
  { audience: 'Startup Community', outlets: 'Swiss Startup Award, Venture Kick, AI Awards', angle: 'Solo-Founder + AI = Full Platform in 5 Monaten' },
];

const OutreachNarrative = () => {
  return (
    <section id="block-31" className="scroll-mt-16 space-y-6">
      {/* Block Header */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Block 31: Outreach Narrative & Market Leadership Race</h2>
          </div>
          <SourceBadge />
        </div>
        <p className="text-xs sm:text-sm text-white/50 mt-1">
          Die offensive Geschichte: Warum dieses Projekt relevant ist, warum die Welt davon erfahren muss, und wie wir messen.
        </p>
      </Reveal>

      {/* ═══ 31.1 — The Human Truth ═══ */}
      <Reveal>
        <Card className="bg-gradient-to-br from-amber-950/40 via-orange-950/30 to-rose-950/20 border-amber-500/20 overflow-hidden">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg text-amber-300 flex items-center gap-2">
              <Heart className="w-4 h-4 flex-shrink-0" />
              31.1 — The Human Truth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            {/* Pull Quote */}
            <div className="relative py-4 sm:py-6">
              <div className="absolute left-0 top-0 text-4xl sm:text-6xl text-amber-500/20 font-serif leading-none">"</div>
              <blockquote className="text-base sm:text-xl md:text-2xl font-light italic text-white/90 pl-6 sm:pl-8 pr-2 leading-relaxed">
                Umziehen ist eines der grössten Ereignisse im Leben eines Menschen. 
                Altes zurücklassen, neu anfangen — oder weitermachen. 
                <span className="text-amber-300 font-medium"> Vom alten Leben ins Neue.</span>
              </blockquote>
              <div className="absolute right-2 bottom-0 text-4xl sm:text-6xl text-amber-500/20 font-serif leading-none">"</div>
            </div>

            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Jeder Mensch geht oder muss durch diesen Prozess. Wir haben uns die Zeit genommen, 
              genau diesen Übergang so zu optimieren und zu professionalisieren, dass er die Wichtigkeit 
              bekommt, die er verdient — und die Personen dank uns so gut wie möglich in diese Transition 
              begleitet werden.
            </p>

            {/* Message Pillars */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4">
              {MESSAGE_PILLARS.map((p) => (
                <div key={p.label} className="bg-white/5 rounded-lg p-2.5 sm:p-3 border border-white/5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <p.icon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-white">{p.label}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-white/40">{p.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* ═══ 31.2 — The Business Case ═══ */}
      <Reveal>
        <Card className="bg-white/[0.02] border-white/10">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
              31.2 — The Business Case: Two Pillars
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Pillar 1 */}
              <div className="bg-gradient-to-b from-blue-950/40 to-blue-950/10 border border-blue-500/20 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-bold text-blue-300">Umzugscheck.ch</h4>
                </div>
                <p className="text-xs text-white/50">Vergleichsportal — Digitale Lead-Engine</p>
                <ul className="text-[10px] sm:text-xs text-white/40 space-y-1 mt-2">
                  <li className="flex items-start gap-1.5"><ArrowRight className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />Offerten vergleichen in 60 Sekunden</li>
                  <li className="flex items-start gap-1.5"><ArrowRight className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />Video-KI-Schätzung, Photo-Upload</li>
                  <li className="flex items-start gap-1.5"><ArrowRight className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />SEO-optimierte Stadt-/Kantonsseiten</li>
                </ul>
              </div>
              {/* Pillar 2 */}
              <div className="bg-gradient-to-b from-emerald-950/40 to-emerald-950/10 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-emerald-300">Feierabendservices.ch</h4>
                </div>
                <p className="text-xs text-white/50">Der Dienstleister — Physische Ausführung</p>
                <ul className="text-[10px] sm:text-xs text-white/40 space-y-1 mt-2">
                  <li className="flex items-start gap-1.5"><ArrowRight className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />Premium-Qualität, Schweizer Standard</li>
                  <li className="flex items-start gap-1.5"><ArrowRight className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />Cherry-Picking der besten Aufträge</li>
                  <li className="flex items-start gap-1.5"><ArrowRight className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />Persönliche Begleitung A–Z</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 text-center">
              <p className="text-xs sm:text-sm text-amber-300 font-medium">
                Zusammen: A–Z Relocation-Optimierung im KI-Zeitalter
              </p>
              <p className="text-[10px] sm:text-xs text-white/40 mt-1">
                In der kompetitivsten Volkswirtschaft der Welt
              </p>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* ═══ 31.3 — The AI Story ═══ */}
      <Reveal>
        <Card className="bg-white/[0.02] border-white/10">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400 flex-shrink-0" />
              31.3 — The AI Story: 90–95% AI-Built
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            {/* Big Stat */}
            <div className="flex items-center justify-center py-4">
              <div className="text-center space-y-1">
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                  95%
                </div>
                <p className="text-xs sm:text-sm text-white/50 font-medium">AI-Built Platform</p>
                <p className="text-[10px] text-white/30">Rest: Founder Vision & Entscheidungen</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/5 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-white">Warum DAS die Story ist:</h4>
              <ul className="text-[10px] sm:text-xs text-white/50 space-y-1.5">
                <li className="flex items-start gap-2">
                  <Zap className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>Das Projekt IST der Beweis für KI-gestützte Unternehmensgründung — nicht nur ein Produkt, sondern ein <strong className="text-white/70">Proof of Concept</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Newspaper className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>Medien-Asset: Die Entstehungsgeschichte selbst generiert PR-Wert und Backlinks</span>
                </li>
                <li className="flex items-start gap-2">
                  <Trophy className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>Positionierung für Awards: Swiss Startup Award, AI Innovation Awards, ProductHunt Launch</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-amber-500/5 to-transparent border-l-2 border-amber-500/30 pl-3 py-2">
              <p className="text-xs text-white/60 italic">
                "Ein Solo-Founder baut mit KI in 5 Monaten eine vollständige Plattform, die gegen etablierte Anbieter 
                mit 20+ Mitarbeitern antritt — in der Schweiz, dem kompetitivsten Markt der Welt."
              </p>
              <p className="text-[10px] text-amber-300/60 mt-1">— Headline-ready Story Angle</p>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* ═══ 31.4 — The Race ═══ */}
      <Reveal>
        <Card className="bg-white/[0.02] border-white/10">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
              <Timer className="w-4 h-4 text-amber-400 flex-shrink-0" />
              31.4 — The Race: Measurable Market Leadership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg p-3 sm:p-4 border border-amber-500/15">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-bold text-amber-300">We're starting the clock.</span>
              </div>
              <p className="text-[10px] sm:text-xs text-white/50">
                Wie lange dauert es, mit welchem Budget, um die #1 Online-Position im Schweizer Umzugsmarkt zu erreichen? 
                Wir messen — bis das Ziel erreicht ist. Das allein ist newsworthy.
              </p>
            </div>

            {/* Race Tracker Timeline */}
            <div className="space-y-0">
              {RACE_MILESTONES.map((m, i) => (
                <div key={m.phase} className="flex gap-3 sm:gap-4 relative">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                      i === 0 ? 'bg-amber-400 border-amber-400' : 'bg-transparent border-white/20'
                    }`} />
                    {i < RACE_MILESTONES.length - 1 && (
                      <div className="w-0.5 h-full bg-white/10 min-h-[40px]" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-4 sm:pb-5 -mt-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white">{m.phase}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 font-mono">{m.weeks} Wo.</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-white/40 mt-0.5">{m.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* KPI Boxes */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                <Timer className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-white">Time-to-Leader</p>
                <p className="text-[10px] text-white/40">Wie viele Wochen bis #1?</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                <TrendingUp className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-white">Budget-to-Leader</p>
                <p className="text-[10px] text-white/40">CHF bis Ziel erreicht</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* ═══ 31.5 — Outreach Positioning ═══ */}
      <Reveal>
        <Card className="bg-white/[0.02] border-white/10">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400 flex-shrink-0" />
              31.5 — Outreach Positioning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6">
            <div className="space-y-2">
              {OUTREACH_TARGETS.map((t) => (
                <div key={t.audience} className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
                    <span className="text-xs sm:text-sm font-bold text-white">{t.audience}</span>
                    <span className="text-[10px] text-white/30">{t.outlets}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <ArrowRight className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-amber-300/70 italic">"{t.angle}"</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-amber-500/10 to-rose-500/5 rounded-lg p-3 sm:p-4 border border-amber-500/10 mt-4">
              <h4 className="text-xs sm:text-sm font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 flex-shrink-0" />
                PR Flywheel
              </h4>
              <p className="text-[10px] sm:text-xs text-white/50 leading-relaxed">
                Das Projekt IST der Content. Jede Milestone-Erreichung (erster Lead, erster zahlender B2B-Partner, 
                SEO Top-5) wird als Story veröffentlicht. Die Transparenz der "Race to #1" generiert organische 
                Berichterstattung, Backlinks und Award-Nominierungen — ein sich selbst verstärkender Kreislauf 
                aus Sichtbarkeit und Autorität.
              </p>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </section>
  );
};

export default OutreachNarrative;
