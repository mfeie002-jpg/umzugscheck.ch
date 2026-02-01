/**
 * Guarantees Section - Risk Reversal
 * 
 * Purpose: Address transaction fears after showing the tech (Video Rechner)
 * Key message: "You are protected"
 * 
 * Placement: After AIVideoCalculatorSection
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  ClipboardCheck, 
  CreditCard, 
  RotateCcw,
  Award,
  Lock
} from "lucide-react";

const guarantees = [
  {
    id: "abnahme",
    icon: ClipboardCheck,
    title: "Abnahmegarantie",
    description: "Bei Reinigung: Wir vermitteln nur Firmen mit Übergabe-Garantie für Schweizer Vermieter.",
    highlight: "Pflicht für Mietwohnungen",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "versicherung",
    icon: Shield,
    title: "Vollversicherung",
    description: "Alle Partner mit Haftpflicht- und Transportversicherung. Bei Schaden sind Sie geschützt.",
    highlight: "Bis CHF 2 Mio.",
    color: "text-[#E2001A]",
    bgColor: "bg-[#E2001A]/10",
  },
  {
    id: "zahlung",
    icon: CreditCard,
    title: "Sichere Zahlung",
    description: "Sie zahlen direkt an die Umzugsfirma – wir verdienen an der Vermittlung, nicht an Ihnen.",
    highlight: "Transparenter Geldfluss",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "storno",
    icon: RotateCcw,
    title: "Flexible Stornierung",
    description: "Die meisten Partner erlauben kostenlose Stornierung bis 48h vor dem Umzug.",
    highlight: "Keine versteckten Gebühren",
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
];

export const GuaranteesSection = memo(function GuaranteesSection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container max-w-5xl px-4">
        {/* Header with Shield Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full 
                          bg-primary/10 border-2 border-primary/20 mb-4">
            <Award className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Ihre Sicherheits-Garantien
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Wir überlassen nichts dem Zufall. Diese Absicherungen sind bei 
            jedem Umzug über unsere Plattform inklusive.
          </p>
        </motion.div>

        {/* Guarantee Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {guarantees.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4 p-5 rounded-xl bg-card border border-border/50 
                         hover:border-primary/30 hover:shadow-md transition-all group"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center 
                              flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full 
                                   ${item.bgColor} ${item.color} whitespace-nowrap`}>
                    {item.highlight}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Trust Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Alle Garantien ohne Zusatzkosten für Sie</span>
        </motion.div>
      </div>
    </section>
  );
});

export default GuaranteesSection;
