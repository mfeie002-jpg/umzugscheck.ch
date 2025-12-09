import { motion } from "framer-motion";
import { Shield, Award, Lock, CheckCircle, Verified } from "lucide-react";

const seals = [
  {
    icon: Shield,
    title: "SSL Gesichert",
    subtitle: "256-bit Verschlüsselung",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Award,
    title: "Top Bewertung",
    subtitle: "4.8/5 Sterne",
    gradient: "from-amber-500 to-orange-500"
  },
  {
    icon: Lock,
    title: "Datenschutz",
    subtitle: "DSGVO konform",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: CheckCircle,
    title: "Geprüft",
    subtitle: "200+ Partner",
    gradient: "from-purple-500 to-pink-500"
  }
];

export const TrustSeals = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
      {seals.map((seal, index) => (
        <motion.div
          key={seal.title}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${seal.gradient} flex items-center justify-center shadow-sm`}>
            <seal.icon className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">{seal.title}</p>
            <p className="text-xs text-muted-foreground">{seal.subtitle}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
