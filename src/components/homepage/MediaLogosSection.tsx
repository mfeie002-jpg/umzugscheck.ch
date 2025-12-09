import { memo } from "react";
import { motion } from "framer-motion";

const mediaLogos = [
  { name: "20 Minuten", abbrev: "20min" },
  { name: "Blick", abbrev: "Blick" },
  { name: "Watson", abbrev: "Watson" },
  { name: "Tages-Anzeiger", abbrev: "Tagi" },
  { name: "NZZ", abbrev: "NZZ" },
  { name: "SRF", abbrev: "SRF" },
];

const trustBadges = [
  { name: "TCS geprüft", icon: "🛡️" },
  { name: "Swiss Made", icon: "🇨🇭" },
  { name: "ASTAG Partner", icon: "✓" },
];

export const MediaLogosSection = memo(function MediaLogosSection() {
  return (
    <section className="py-8 md:py-10 bg-muted/20 border-y border-border/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-6">
            Bekannt aus & geprüft von
          </p>
          
          {/* Media Logos */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-6">
            {mediaLogos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="px-4 py-2 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 hover:bg-background transition-all duration-200">
                  <span className="text-sm md:text-base font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    {logo.abbrev}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20"
              >
                <span className="text-sm">{badge.icon}</span>
                <span className="text-xs font-medium text-primary">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});
