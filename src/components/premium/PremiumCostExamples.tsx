import { Home, Building, Briefcase, ArrowRight, Info, TrendingDown, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const examples = [
  {
    icon: Home,
    title: "2.5-Zimmer-Wohnung",
    subtitle: "Umzug innerhalb der Stadt",
    priceRange: "CHF 800 – 1'400",
    savingsPercent: "25%",
    details: [
      "Ca. 25-35 m³ Umzugsgut",
      "2-3 Umzugshelfer",
      "4-6 Stunden Arbeitszeit"
    ],
    popular: true
  },
  {
    icon: Building,
    title: "4.5-Zimmer-Wohnung",
    subtitle: "Kanton zu Kanton",
    priceRange: "CHF 1'800 – 3'200",
    savingsPercent: "30%",
    details: [
      "Ca. 50-70 m³ Umzugsgut",
      "3-4 Umzugshelfer",
      "6-10 Stunden Arbeitszeit"
    ],
    popular: false
  },
  {
    icon: Briefcase,
    title: "KMU Büroumzug",
    subtitle: "10-15 Arbeitsplätze",
    priceRange: "CHF 4'000 – 8'000",
    savingsPercent: "40%",
    details: [
      "IT-Infrastruktur inklusive",
      "Wochenend-Umzug möglich",
      "Minimale Ausfallzeit"
    ],
    popular: false
  }
];

export const PremiumCostExamples = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full text-success font-semibold text-sm uppercase tracking-wider mb-4"
          >
            <TrendingDown className="h-4 w-4" />
            Preistransparenz
          </motion.span>
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
                whileHover={{ y: -8 }}
                className={`relative bg-card rounded-2xl p-8 shadow-premium border transition-all duration-300 ${
                  example.popular ? 'border-primary/30 shadow-lift' : 'border-border/50 hover:border-primary/20 hover:shadow-lift'
                }`}
              >
                {/* Popular Badge */}
                {example.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-copper">
                      Am häufigsten
                    </span>
                  </div>
                )}
                
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-6">
                  <motion.div 
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center flex-shrink-0"
                  >
                    <Icon className="h-7 w-7 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{example.title}</h3>
                    <p className="text-sm text-muted-foreground">{example.subtitle}</p>
                  </div>
                </div>
                
                {/* Price */}
                <div className="mb-6 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10 relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/20 text-success text-xs font-bold rounded-full">
                      <TrendingDown className="h-3 w-3" />
                      bis {example.savingsPercent}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">Preisrahmen</div>
                  <div className="text-2xl font-bold text-primary">{example.priceRange}</div>
                </div>
                
                {/* Details */}
                <ul className="space-y-3">
                  {example.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0" />
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
          className="bg-card rounded-xl p-6 mb-12 flex items-start gap-4 border border-border/50 shadow-sm"
        >
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Info className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Hinweis:</strong> Die angegebenen Preise sind Richtwerte basierend auf durchschnittlichen Schweizer Umzügen. 
              Die tatsächlichen Kosten hängen von Faktoren wie Etage, Zugänglichkeit, Zusatzservices und dem genauen Umfang ab. 
              Mit unserem kostenlosen Vergleich erhalten Sie individuelle Offerten für Ihre spezifische Situation.
            </p>
          </div>
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
            <Button size="lg" className="h-12 sm:h-14 px-5 sm:px-10 text-sm sm:text-lg font-semibold shadow-copper hover:shadow-lift transition-all group">
              <Calculator className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Meine Umzugskosten berechnen</span>
              <span className="sm:hidden">Kosten berechnen</span>
              <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Kostenlos & unverbindlich in 2 Minuten
          </p>
        </motion.div>
      </div>
    </section>
  );
};
