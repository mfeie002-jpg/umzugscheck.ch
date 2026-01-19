import { motion } from "framer-motion";
import { Shield, Lock, Award, CheckCircle, Handshake } from "lucide-react";

const badges = [
  { icon: Shield, label: "Versicherte Partner", bg: "bg-green-50 dark:bg-green-950/30" },
  { icon: Lock, label: "SSL Verschlüsselt", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { icon: Award, label: "Top bewertet", bg: "bg-amber-50 dark:bg-amber-950/30" },
  { icon: CheckCircle, label: "Geprüfte Firmen", bg: "bg-secondary/10" },
  { icon: Handshake, label: "Unabhängig", bg: "bg-purple-50 dark:bg-purple-950/30" },
];

export const TrustBadges = () => {
  return (
    <section className="py-10 md:py-12 border-b border-border/50 bg-gradient-to-r from-muted/20 via-background to-muted/20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <span className="text-base">✨</span>
          <span className="text-sm font-medium text-muted-foreground">Warum uns vertrauen?</span>
        </motion.div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl ${badge.bg} border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-default`}
            >
              <div className={`w-8 h-8 rounded-lg ${badge.bg} flex items-center justify-center`}>
                <badge.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-sm text-foreground">{badge.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
