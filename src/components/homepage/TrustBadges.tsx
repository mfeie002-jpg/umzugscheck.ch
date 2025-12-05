import { motion } from "framer-motion";
import { Shield, Lock, Award, CheckCircle, HeartHandshake } from "lucide-react";

const badges = [
  { icon: Shield, label: "Versicherte Partner", color: "text-green-600" },
  { icon: Lock, label: "SSL Verschlüsselt", color: "text-blue-600" },
  { icon: Award, label: "Top bewertet", color: "text-amber-600" },
  { icon: CheckCircle, label: "Geprüfte Firmen", color: "text-secondary" },
  { icon: HeartHandshake, label: "Unabhängig", color: "text-purple-600" },
];

export const TrustBadges = () => {
  return (
    <section className="py-8 border-b border-border">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <badge.icon className={`w-5 h-5 ${badge.color}`} />
              <span className="font-medium">{badge.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
