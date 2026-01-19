import { motion } from "framer-motion";

const signals = [
  { emoji: "🛡️", label: "100% Versichert", description: "Alle Partner vollversichert" },
  { emoji: "🏆", label: "Geprüfte Qualität", description: "Strenge Qualitätsstandards" },
  { emoji: "🔒", label: "Datenschutz", description: "Swiss-Hosting, DSGVO-konform" },
  { emoji: "✅", label: "Verifiziert", description: "Alle Firmen überprüft" },
  { emoji: "👥", label: "18'500+ Kunden", description: "Zufriedene Nutzer" },
  { emoji: "⭐", label: "4.7/5 Sterne", description: "Durchschnittsbewertung" },
];

export const BernTrustSignals = () => (
  <section className="py-8 border-y bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        {signals.map((signal, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xl">
              {signal.emoji}
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
