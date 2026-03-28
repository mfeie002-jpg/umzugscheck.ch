import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Clock, BadgeCheck, Headphones } from "lucide-react";

const guarantees = [
  { icon: Shield, title: "100% Kostenlos", desc: "Keine versteckten Kosten" },
  { icon: Clock, title: "Schnelle Offerten", desc: "Innerhalb 24-48 Std." },
  { icon: BadgeCheck, title: "Geprüfte Firmen", desc: "Alle Partner verifiziert" },
  { icon: Headphones, title: "Persönliche Beratung", desc: "Bei Fragen für Sie da" },
];

export const GuaranteeBanner = memo(function GuaranteeBanner() {
  return (
    <section className="py-10 md:py-14 bg-primary/5 border-y border-primary/10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-xl md:text-2xl font-bold">
            Unsere Garantie für Sie
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {guarantees.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="font-semibold text-sm mb-1">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
