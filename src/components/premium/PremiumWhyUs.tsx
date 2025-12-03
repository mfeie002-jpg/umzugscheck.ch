import { Shield, Clock, Eye, Users, Headphones, Award } from "lucide-react";
import { motion } from "framer-motion";

const usps = [
  {
    icon: Shield,
    title: "Nur geprüfte Partner",
    description: "Jede Umzugsfirma wird auf Versicherung, Bewilligungen und Qualität geprüft, bevor sie aufgenommen wird."
  },
  {
    icon: Eye,
    title: "Transparente Preise",
    description: "Keine versteckten Kosten oder bösen Überraschungen. Sie erhalten klare, vergleichbare Offerten."
  },
  {
    icon: Clock,
    title: "Zeit & Nerven sparen",
    description: "Statt dutzende Telefonate führen Sie eine Anfrage aus und erhalten mehrere Angebote."
  },
  {
    icon: Award,
    title: "AI-gestützte Analyse",
    description: "Unser intelligentes System findet die bestpassenden Firmen für Ihre spezifischen Anforderungen."
  },
  {
    icon: Users,
    title: "Lokale Schweizer Experten",
    description: "Alle Partner sind etablierte Schweizer Unternehmen mit regionalem Know-how und Erfahrung."
  },
  {
    icon: Headphones,
    title: "Persönlicher Support",
    description: "Bei Fragen sind wir für Sie da – per Telefon, E-Mail oder Chat. Schweizer Qualität im Service."
  }
];

export const PremiumWhyUs = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Ihre Vorteile
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Warum mit Umzugscheck.ch vergleichen?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Wir haben es uns zur Aufgabe gemacht, Umzüge in der Schweiz einfacher, 
            transparenter und stressfreier zu gestalten.
          </p>
        </motion.div>
        
        {/* USPs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {usps.map((usp, idx) => {
            const Icon = usp.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex gap-5"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{usp.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{usp.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
