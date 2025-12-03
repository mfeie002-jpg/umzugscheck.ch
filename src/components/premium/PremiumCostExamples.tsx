import { Home, Building, Briefcase, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const examples = [
  {
    icon: Home,
    title: "2.5-Zimmer-Wohnung",
    subtitle: "Umzug innerhalb der Stadt",
    priceRange: "CHF 800 – 1'400",
    details: [
      "Ca. 25-35 m³ Umzugsgut",
      "2-3 Umzugshelfer",
      "4-6 Stunden Arbeitszeit"
    ]
  },
  {
    icon: Building,
    title: "4.5-Zimmer-Wohnung",
    subtitle: "Kanton zu Kanton",
    priceRange: "CHF 1'800 – 3'200",
    details: [
      "Ca. 50-70 m³ Umzugsgut",
      "3-4 Umzugshelfer",
      "6-10 Stunden Arbeitszeit"
    ]
  },
  {
    icon: Briefcase,
    title: "KMU Büroumzug",
    subtitle: "10-15 Arbeitsplätze",
    priceRange: "CHF 4'000 – 8'000",
    details: [
      "IT-Infrastruktur inklusive",
      "Wochenend-Umzug möglich",
      "Minimale Ausfallzeit"
    ]
  }
];

export const PremiumCostExamples = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Preistransparenz
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Was kostet ein Umzug in der Schweiz?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Realistische Preisbeispiele aus echten Schweizer Umzügen. 
            Für Ihr individuelles Angebot nutzen Sie unseren Vergleich.
          </p>
        </motion.div>
        
        {/* Examples Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {examples.map((example, idx) => {
            const Icon = example.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-premium border border-border/50"
              >
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{example.title}</h3>
                    <p className="text-sm text-muted-foreground">{example.subtitle}</p>
                  </div>
                </div>
                
                {/* Price */}
                <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="text-sm text-muted-foreground mb-1">Preisrahmen</div>
                  <div className="text-2xl font-bold text-primary">{example.priceRange}</div>
                </div>
                
                {/* Details */}
                <ul className="space-y-2">
                  {example.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
        
        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-muted/50 rounded-xl p-6 mb-12 flex items-start gap-4"
        >
          <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <strong>Hinweis:</strong> Die angegebenen Preise sind Richtwerte basierend auf durchschnittlichen Schweizer Umzügen. 
            Die tatsächlichen Kosten hängen von Faktoren wie Etage, Zugänglichkeit, Zusatzservices und dem genauen Umfang ab. 
            Mit unserem kostenlosen Vergleich erhalten Sie individuelle Offerten für Ihre spezifische Situation.
          </p>
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/umzugsrechner">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold shadow-copper hover:shadow-lift transition-all">
              Meine Umzugskosten berechnen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
