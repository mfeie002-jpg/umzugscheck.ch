import { Shield, Clock, Eye, Users, Headphones, Award, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";

const usps = [
  {
    icon: Shield,
    title: "Geprüfte Partner",
    description: "Jede Firma wird auf Versicherung und Qualität geprüft.",
    stat: "200+"
  },
  {
    icon: Eye,
    title: "Transparente Preise",
    description: "Klare, vergleichbare Offerten ohne versteckte Kosten.",
    stat: "100%"
  },
  {
    icon: Clock,
    title: "Zeit sparen",
    description: "Eine Anfrage, mehrere Angebote in 24-48h.",
    stat: "3 Std."
  },
  {
    icon: Award,
    title: "AI-Analyse",
    description: "Intelligente Matching für die besten Firmen.",
    stat: "98%"
  },
  {
    icon: Users,
    title: "Lokale Experten",
    description: "Schweizer Firmen mit regionalem Know-how.",
    stat: "26 Kantone"
  },
  {
    icon: Headphones,
    title: "Support",
    description: "Persönliche Hilfe per Telefon, E-Mail oder Chat.",
    stat: "< 2h"
  }
];

const trustBadges = [
  { text: "100% kostenlos" },
  { text: "Unverbindlich" },
  { text: "Swiss Datenschutz" },
  { text: "Kein Spam" },
];

export const PremiumWhyUs = memo(() => {
  return (
    <section className="py-14 md:py-20 bg-muted/30" aria-labelledby="why-us-heading">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block text-primary font-semibold text-xs uppercase tracking-wider mb-2">
            Ihre Vorteile
          </span>
          <h2 id="why-us-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Warum Umzugscheck.ch?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            Umzüge einfacher, transparenter und stressfreier.
          </p>
        </motion.div>
        
        {/* USPs Grid - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
          {usps.map((usp, idx) => {
            const Icon = usp.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/20 hover:shadow-soft transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-foreground text-sm truncate">{usp.title}</h3>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded flex-shrink-0">
                        {usp.stat}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-snug line-clamp-2">{usp.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Trust Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-5 text-xs text-muted-foreground">
            {trustBadges.map((badge, i) => (
              <span key={i} className="flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                {badge.text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

PremiumWhyUs.displayName = 'PremiumWhyUs';
