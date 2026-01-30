/**
 * Pain vs Gain Section - Problem Solver Cards
 * 
 * Purpose: Agitate user's problem, then show solution
 * Psychology: Problem → Solution pattern increases desire
 * 
 * Placement: Between Stats/TrustRibbon and "How it works"
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Ban, 
  ShieldCheck, 
  Phone,
  CircleDollarSign,
  Sparkles,
  CheckCircle2
} from "lucide-react";

const painPoints = [
  {
    id: "hidden-costs",
    pain: {
      icon: CircleDollarSign,
      title: "Versteckte Kosten?",
      description: "Plötzlich teure Extras am Umzugstag",
    },
    solution: {
      icon: CheckCircle2,
      title: "Fixpreis-Garantie",
      description: "Transparente Preise vorab, keine Überraschungen",
    },
    color: "from-red-500/10 to-emerald-500/10",
  },
  {
    id: "damage",
    pain: {
      icon: Ban,
      title: "Möbel beschädigt?",
      description: "Wer haftet bei Kratzern und Bruch?",
    },
    solution: {
      icon: ShieldCheck,
      title: "Versicherte Partner",
      description: "Alle Firmen mit geprüfter Haftpflicht",
    },
    color: "from-orange-500/10 to-emerald-500/10",
  },
  {
    id: "calls",
    pain: {
      icon: Phone,
      title: "Endlose Anrufe?",
      description: "Zehn Firmen kontaktieren für ein Angebot",
    },
    solution: {
      icon: Sparkles,
      title: "Ein Formular",
      description: "Bis zu 5 geprüfte Offerten automatisch",
    },
    color: "from-yellow-500/10 to-emerald-500/10",
  },
];

export const PainGainSection = memo(function PainGainSection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-5xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Warum einen Stress-Umzug riskieren?
          </h2>
          <p className="text-muted-foreground">
            Wir lösen die häufigsten Umzugs-Probleme
          </p>
        </motion.div>

        {/* Problem → Solution Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {painPoints.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl overflow-hidden border border-border/50 
                         bg-gradient-to-b ${item.color} hover:shadow-lg transition-shadow`}
            >
              {/* Pain (Top) */}
              <div className="p-5 border-b border-border/30 bg-card/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <item.pain.icon className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {item.pain.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.pain.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 
                              w-8 h-8 rounded-full bg-background border border-border 
                              flex items-center justify-center z-10">
                <span className="text-primary font-bold">↓</span>
              </div>
              
              {/* Solution (Bottom) */}
              <div className="p-5 pt-6 bg-card/80">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <item.solution.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm">
                      {item.solution.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.solution.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default PainGainSection;
