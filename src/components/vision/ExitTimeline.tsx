/**
 * Exit Timeline Component
 * Shows potential exit scenarios and valuations
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Rocket, Building2, TrendingUp, DollarSign, 
  Target, Crown, ArrowRight, Star, Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Exit milestones with valuations
const exitMilestones = [
  {
    phase: "Heute",
    year: "2025",
    status: "current",
    valuation: "0.5-1 Mio",
    description: "MVP fertig, erste Traction",
    multiplier: "n/a",
    color: "from-blue-500 to-blue-600"
  },
  {
    phase: "Seed-Ready",
    year: "2025 Q4",
    status: "upcoming",
    valuation: "2-3 Mio",
    description: "1'000+ Leads/Monat, Profitabel",
    multiplier: "10x ARR",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    phase: "Series A",
    year: "2026",
    status: "future",
    valuation: "10-15 Mio",
    description: "Marktführer Schweiz, DACH-Expansion",
    multiplier: "8x ARR",
    color: "from-purple-500 to-purple-600"
  },
  {
    phase: "Growth",
    year: "2027-28",
    status: "future",
    valuation: "30-50 Mio",
    description: "DACH dominiert, 50k+ Umzüge/Jahr",
    multiplier: "6x ARR",
    color: "from-amber-500 to-amber-600"
  },
  {
    phase: "Exit / IPO",
    year: "2029+",
    status: "future",
    valuation: "100+ Mio",
    description: "Europäischer Leader, IPO-Ready",
    multiplier: "8-10x ARR",
    color: "from-green-500 to-green-600"
  }
];

// Comparable acquisitions
const comparables = [
  {
    company: "MOVU",
    acquirer: "Baloise Group",
    year: 2017,
    description: "Schweizer Umzugs-Plattform",
    valuation: "Undisclosed (geschätzt 5-10 Mio CHF)",
    metrics: "~500 Umzüge/Monat zum Zeitpunkt",
    multiplier: "~8x Revenue",
    relevance: "Direkter Vergleich – wir bauen MOVU 2.0 mit 10x mehr Features"
  },
  {
    company: "Movinga",
    acquirer: "Private Equity",
    year: 2019,
    description: "Deutsches Umzugs-Startup",
    valuation: "~50 Mio EUR (bei Insolvenz)",
    metrics: "Peak: 100+ Mio EUR Bewertung",
    multiplier: "5x Revenue (vor Crash)",
    relevance: "Warnung: Zu schnell skaliert ohne Unit Economics. Wir = Profitabel first."
  },
  {
    company: "Homeday",
    acquirer: "Axel Springer",
    year: 2022,
    description: "PropTech / Immobilien-Makler",
    valuation: "~400 Mio EUR",
    metrics: "Proptech mit Lead-Modell",
    multiplier: "8-10x ARR",
    relevance: "Ähnliches Modell (Lead-Gen + Services) in Immobilien"
  }
];

export const ExitTimeline = memo(() => {
  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-white/10 text-white hover:bg-white/20">
            <Crown className="w-3 h-3 mr-1" />
            Exit-Strategie & Bewertung
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Was ist das Ziel? 🎯
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Wann könnte man die Firma verkaufen und für wie viel?
            Basierend auf vergleichbaren Transaktionen im Markt.
          </p>
        </motion.div>
        
        {/* Exit Timeline */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 transform -translate-x-1/2 hidden md:block" />
            
            <div className="space-y-8">
              {exitMilestones.map((milestone, idx) => (
                <motion.div
                  key={milestone.phase}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative flex items-center gap-8 ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-lg shadow-white/10`}>
                      {milestone.status === 'current' ? (
                        <Sparkles className="w-5 h-5 text-white animate-pulse" />
                      ) : (
                        <Target className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>
                  
                  {/* Content Card */}
                  <div className={`md:w-[45%] ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <Card className={`p-5 ${
                      milestone.status === 'current' 
                        ? 'bg-primary/20 border-primary' 
                        : 'bg-white/5 border-white/10'
                    }`}>
                      <div className={`flex items-center gap-3 mb-3 ${idx % 2 === 0 ? 'md:justify-end' : ''}`}>
                        <Badge variant="outline" className="text-xs">
                          {milestone.year}
                        </Badge>
                        <span className="text-sm font-bold text-white">
                          {milestone.phase}
                        </span>
                        {milestone.status === 'current' && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            Jetzt
                          </Badge>
                        )}
                      </div>
                      
                      <div className={`flex items-end gap-2 mb-2 ${idx % 2 === 0 ? 'md:justify-end' : ''}`}>
                        <span className="text-2xl md:text-3xl font-black text-primary">
                          {milestone.valuation}
                        </span>
                        <span className="text-slate-400 text-sm pb-1">CHF</span>
                      </div>
                      
                      <p className="text-sm text-slate-400 mb-2">{milestone.description}</p>
                      
                      {milestone.multiplier !== "n/a" && (
                        <Badge variant="outline" className="text-xs text-slate-300">
                          {milestone.multiplier}
                        </Badge>
                      )}
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Comparables Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              Vergleichbare Transaktionen
            </h3>
            <p className="text-slate-400 text-sm">
              Was haben ähnliche Firmen bei einem Exit erzielt?
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {comparables.map((comp, idx) => (
              <motion.div
                key={comp.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-5 bg-white/5 border-white/10 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-white">{comp.company}</h4>
                    <Badge variant="outline" className="text-xs">{comp.year}</Badge>
                  </div>
                  
                  <p className="text-xs text-slate-400 mb-3">{comp.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-white">{comp.valuation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-xs text-slate-400">{comp.metrics}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs text-primary flex items-start gap-1">
                      <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      {comp.relevance}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* MOVU Deep Dive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-blue-500/20 border-primary/50">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <div>
                <h4 className="font-bold text-lg text-white mb-2">
                    MOVU → Baloise (2017): Der relevanteste Vergleich
                  </h4>
                  <p className="text-white/90 text-sm leading-relaxed mb-4">
                    <strong className="text-white font-bold">MOVU</strong> wurde 2017 von der Baloise Gruppe übernommen – 
                    die grösste digitale Umzugsplattform der Schweiz zu dem Zeitpunkt.
                    Der Kaufpreis wurde nicht veröffentlicht, wird aber auf <strong className="text-white font-bold">5-10 Mio CHF</strong> geschätzt.
                  </p>
                  
                  <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-600">
                    <p className="text-sm text-white font-bold mb-3">Warum wir mehr wert sein werden:</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckIcon />
                        <span className="text-white"><strong className="font-bold text-primary">10 Revenue Streams</strong> statt nur Lead-Verkauf</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon />
                        <span className="text-white"><strong className="font-bold text-primary">KI-Technologie</strong> (Video, Automation) – MOVU hatte das nicht</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon />
                        <span className="text-white"><strong className="font-bold text-primary">Fintech-Layer</strong> (Escrow) – höhere Stickiness</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon />
                        <span className="text-white"><strong className="font-bold text-primary">90%+ Marge</strong> vs. klassische 20-30%</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p className="mt-4 text-primary font-bold text-base">
                    → Bei vergleichbarer Grösse: 3-5× höhere Bewertung möglich durch Tech + Moats
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Exit Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 grid md:grid-cols-3 gap-4"
          >
            <Card className="p-4 bg-white/5 border-white/10 text-center">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <h5 className="font-bold text-white mb-1">Strategic Acquisition</h5>
              <p className="text-xs text-slate-400">
                Versicherung (Baloise, AXA) oder Immobilien-Portal (Homegate, ImmoScout)
              </p>
            </Card>
            <Card className="p-4 bg-white/5 border-white/10 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <h5 className="font-bold text-white mb-1">Private Equity</h5>
              <p className="text-xs text-slate-400">
                Growth Buyout bei 5-10 Mio ARR, dann Scale-Up für IPO
              </p>
            </Card>
            <Card className="p-4 bg-white/5 border-white/10 text-center">
              <Rocket className="w-8 h-8 mx-auto mb-2 text-amber-400" />
              <h5 className="font-bold text-white mb-1">IPO (Long-term)</h5>
              <p className="text-xs text-slate-400">
                Bei 100+ Mio Umsatz, europäische Marktführerschaft
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

// Helper component
const CheckIcon = () => (
  <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
    <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

ExitTimeline.displayName = 'ExitTimeline';
