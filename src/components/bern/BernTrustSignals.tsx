import { motion } from "framer-motion";
import { Shield, Award, Lock, CheckCircle, Users, Star } from "lucide-react";

const signals = [
  { icon: Shield, label: "100% Versichert", description: "Alle Partner vollversichert" },
  { icon: Award, label: "Geprüfte Qualität", description: "Strenge Qualitätsstandards" },
  { icon: Lock, label: "Datenschutz", description: "Swiss-Hosting, DSGVO-konform" },
  { icon: CheckCircle, label: "Verifiziert", description: "Alle Firmen überprüft" },
  { icon: Users, label: "18'500+ Kunden", description: "Zufriedene Nutzer" },
  { icon: Star, label: "4.7/5 Sterne", description: "Durchschnittsbewertung" },
];

export const BernTrustSignals = () => (
  <section className="py-8 border-y bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        {signals.map((signal, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <signal.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden md:block">
              <p className="font-medium text-sm">{signal.label}</p>
              <p className="text-xs text-muted-foreground">{signal.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
