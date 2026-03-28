import { memo } from "react";
import { motion } from "framer-motion";
import { 
  TrendingDown, 
  Scale, 
  Eye, 
  Clock 
} from "lucide-react";

interface RegionWhySaveProps {
  regionName: string;
}

const SAVE_REASONS = [
  {
    icon: Scale,
    title: "Marktvergleich nutzen",
    description: "Preise in der Umzugsbranche variieren stark. Durch den Vergleich mehrerer Anbieter finden Sie das beste Preis-Leistungs-Verhältnis."
  },
  {
    icon: TrendingDown,
    title: "Bis zu 40% sparen",
    description: "Kunden, die mehrere Offerten vergleichen, sparen im Durchschnitt 20-40% gegenüber dem ersten Angebot."
  },
  {
    icon: Eye,
    title: "Transparente Leistungen",
    description: "Vergleichen Sie nicht nur Preise, sondern auch inkludierte Leistungen wie Verpackungsmaterial, Versicherung und Zusatzservices."
  },
  {
    icon: Clock,
    title: "Zeit effizient nutzen",
    description: "Statt einzeln anzufragen, erhalten Sie mit einer Anfrage mehrere Offerten von geprüften Anbietern."
  }
];

export const RegionWhySave = memo(({ regionName }: RegionWhySaveProps) => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Warum Vergleichen sich lohnt
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sparen Sie bei Ihrem Umzug in {regionName} durch einen einfachen Preisvergleich
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SAVE_REASONS.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mx-auto mb-4">
                  <reason.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {reason.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

RegionWhySave.displayName = "RegionWhySave";
