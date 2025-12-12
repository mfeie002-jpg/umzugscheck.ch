import { memo } from "react";
import { motion } from "framer-motion";
import { Award, Trophy, Star, Shield } from "lucide-react";

const awards = [
  { icon: Trophy, label: "Top Vergleichsportal 2024" },
  { icon: Award, label: "Swiss Quality Award" },
  { icon: Star, label: "Best User Experience" },
  { icon: Shield, label: "Datenschutz zertifiziert" },
];

export const AwardsBanner = memo(function AwardsBanner() {
  return (
    <section className="py-8 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
      <div className="container">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {awards.map((award, index) => (
            <motion.div
              key={award.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <award.icon className="w-5 h-5 text-swiss-gold" />
              <span className="text-xs font-medium">{award.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
