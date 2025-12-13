import { FileText, Search, CheckCircle, Clock, Shield, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: FileText,
    number: "1",
    title: "Umzugsdetails eingeben",
    description: "In nur 2 Minuten zum Preis",
    details: [
      "Wohnungsgrösse & Zimmeranzahl",
      "Start- und Zieladresse mit Etage",
      "Lift vorhanden oder nicht",
      "Spezialobjekte (Piano, Safe, Aquarium)",
      "Gewünschter Umzugstermin"
    ],
    imageUrl: "https://images.unsplash.com/photo-1554224311-beee460c201f?w=800&auto=format&fit=crop",
    benefit: "Kostenloser AI-Preisrechner",
    benefitIcon: Clock
  },
  {
    icon: Search,
    number: "2",
    title: "Offerten vergleichen",
    description: "Bis zu 5 geprüfte Angebote erhalten",
    details: [
      "Nur verifizierte Schweizer Umzugsfirmen",
      "Transparente Preis-Leistungs-Übersicht",
      "Echte Kundenbewertungen & Ratings",
      "Verfügbarkeit in Echtzeit",
      "Service-Details & Versicherungsschutz"
    ],
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop",
    benefit: "100% kostenlos & unverbindlich",
    benefitIcon: Shield
  },
  {
    icon: CheckCircle,
    number: "3",
    title: "Beste Firma wählen",
    description: "Direkt beauftragen & bis zu 40% sparen",
    details: [
      "Preis-Qualitäts-Verhältnis prüfen",
      "Direkte Kontaktaufnahme zur Firma",
      "Verbindliche Buchung in wenigen Klicks",
      "Umzugs-Coach mit Timeline & Checklisten",
      "Persönliche Betreuung bis zum Einzug"
    ],
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop",
    benefit: "Durchschnittlich 40% günstiger",
    benefitIcon: TrendingDown
  },
];

export const HowItWorksSimple = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/20 via-background to-secondary/10">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Wie funktioniert es?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            In 3 einfachen Schritten zur besten Umzugsfirma – transparent, schnell und bis zu 40% günstiger
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group relative"
            >
              {/* Connector Arrow - Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-32 -right-8 z-10">
                  <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-accent" />
                </div>
              )}

              <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-300 h-full">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={step.imageUrl} 
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  
                  {/* Number Badge */}
                  <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white text-3xl font-bold flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>

                  {/* Benefit Badge */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-accent/95 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                      <step.benefitIcon className="h-4 w-4 text-white" />
                      <span className="text-white text-sm font-semibold">{step.benefit}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-primary font-medium mb-4">
                    {step.description}
                  </p>

                  {/* Details List */}
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/umzugsofferten">
            <Button size="lg" className="text-lg px-8 py-6">
              Jetzt kostenlos starten
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            ⏱️ Dauert nur 2 Minuten · 🔒 100% kostenlos & unverbindlich · ⭐ Über 15'000 zufriedene Kunden
          </p>
        </motion.div>
      </div>
    </section>
  );
};
