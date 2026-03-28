/**
 * MediaLogosSection VARIANT H - "Pain vs Gain"
 * 
 * VERSION 8: Problem solver cards approach
 * Based on feedback: "Agitate the user's problem to make them want the solution"
 * 
 * Structure:
 * - Card 1: Fear (Hidden costs) → Solution (Fixed price)
 * - Card 2: Risk (Damage) → Solution (Insured partners)
 * - Card 3: Stress (Endless calls) → Solution (Verified offers only)
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle,
  ShieldCheck,
  PhoneOff,
  Receipt,
  Package,
  Filter,
  ArrowRight
} from "lucide-react";

const painGainCards = [
  {
    id: "costs",
    painIcon: Receipt,
    painTitle: "Versteckte Kosten?",
    painDescription: "Überraschungen bei der Endabrechnung",
    gainIcon: ShieldCheck,
    gainTitle: "Fixpreis-Garantie",
    gainDescription: "Transparente Offerten ohne Nachzahlungen",
    color: "from-amber-500/10 to-emerald-500/10",
  },
  {
    id: "damage",
    painIcon: Package,
    painTitle: "Möbel beschädigt?",
    painDescription: "Wer zahlt bei Schäden?",
    gainIcon: ShieldCheck,
    gainTitle: "Alle Partner versichert",
    gainDescription: "Haftpflicht- & Transportversicherung geprüft",
    color: "from-red-500/10 to-emerald-500/10",
  },
  {
    id: "stress",
    painIcon: PhoneOff,
    painTitle: "Endlose Anrufe?",
    painDescription: "Dutzende Firmen kontaktieren",
    gainIcon: Filter,
    gainTitle: "Nur geprüfte Offerten",
    gainDescription: "1 Anfrage → max. 5 passende Angebote",
    color: "from-orange-500/10 to-emerald-500/10",
  },
];

export const MediaLogosSectionVariantH = memo(function MediaLogosSectionVariantH() {
  return (
    <section className="py-8 md:py-10 bg-gradient-to-b from-muted/30 to-background border-b border-border/30">
      <div className="container max-w-5xl px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Warum einen Stressumzug riskieren?
          </h3>
          <p className="text-xs text-muted-foreground">
            Typische Probleme – und wie wir sie lösen
          </p>
        </motion.div>

        {/* Pain → Gain Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {painGainCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className={`relative overflow-hidden rounded-xl border border-border bg-gradient-to-br ${card.color} p-4`}
            >
              {/* Pain Section */}
              <div className="flex items-start gap-3 mb-3 pb-3 border-b border-border/50">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <card.painIcon className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-destructive" />
                    <span className="text-xs font-semibold text-destructive">Problem</span>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">{card.painTitle}</h4>
                  <p className="text-[11px] text-muted-foreground">{card.painDescription}</p>
                </div>
              </div>
              
              {/* Arrow */}
              <div className="flex justify-center mb-3">
                <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
              </div>
              
              {/* Gain Section */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <card.gainIcon className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-600">Lösung</span>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">{card.gainTitle}</h4>
                  <p className="text-[11px] text-muted-foreground">{card.gainDescription}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantH;
