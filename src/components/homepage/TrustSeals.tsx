import { motion } from "framer-motion";
import { Shield, Award, Lock, CheckCircle } from "lucide-react";

const seals = [
  {
    icon: Shield,
    title: "SSL Gesichert",
    subtitle: "256-bit Verschlüsselung"
  },
  {
    icon: Award,
    title: "Top Bewertung",
    subtitle: "4.8/5 Sterne"
  },
  {
    icon: Lock,
    title: "Datenschutz",
    subtitle: "DSGVO konform"
  },
  {
    icon: CheckCircle,
    title: "Geprüft",
    subtitle: "200+ Partner"
  }
];

export const TrustSeals = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
      {seals.map((seal, index) => (
        <motion.div
          key={seal.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <seal.icon className="h-5 w-5 text-primary" />
          <div className="text-left">
            <p className="text-xs font-medium text-foreground">{seal.title}</p>
            <p className="text-xs">{seal.subtitle}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
