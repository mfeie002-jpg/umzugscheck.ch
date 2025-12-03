import { Home, Building2, Sparkles, Trash2, Package, Truck, Heart, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const services = [
  {
    icon: Home,
    title: "Privatumzug",
    description: "Kompletter Umzugsservice für Ihren Wohnungswechsel – vom Einpacken bis zum Aufbau.",
    link: "/privatumzug",
    color: "primary"
  },
  {
    icon: Building2,
    title: "Firmenumzug",
    description: "Professionelle Büroumzüge mit minimaler Betriebsunterbrechung für KMUs und Grossfirmen.",
    link: "/firmenumzug",
    color: "secondary"
  },
  {
    icon: Sparkles,
    title: "Endreinigung",
    description: "Professionelle Wohnungsreinigung mit Abnahmegarantie für eine reibungslose Übergabe.",
    link: "/reinigung",
    color: "primary"
  },
  {
    icon: Trash2,
    title: "Entsorgung & Räumung",
    description: "Fachgerechte Entsorgung von Möbeln, Elektrogeräten und Hausrat.",
    link: "/entsorgung",
    color: "secondary"
  },
  {
    icon: Package,
    title: "Möbellagerung",
    description: "Sichere und flexible Lagerboxen für kurz- oder langfristige Einlagerung.",
    link: "/lagerung",
    color: "primary"
  },
  {
    icon: Truck,
    title: "Spezialtransporte",
    description: "Sicherer Transport von Klavieren, Tresoren, Kunst und sensiblen Gütern.",
    link: "/spezialtransporte",
    color: "secondary"
  },
  {
    icon: Heart,
    title: "Seniorenumzug",
    description: "Einfühlsamer Rundum-Service für ältere Menschen mit besonderer Betreuung.",
    link: "/seniorenumzug",
    color: "primary"
  },
  {
    icon: Globe,
    title: "Internationale Umzüge",
    description: "Weltweite Umzugsservices mit Zollabwicklung und internationaler Logistik.",
    link: "/internationale-umzuege",
    color: "secondary"
  }
];

export const PremiumServicesGrid = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
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
            Unsere Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Alle Services rund um Ihren Umzug
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Von der Endreinigung bis zum Spezialtransport – finden Sie den passenden Service für Ihre Bedürfnisse.
          </p>
        </motion.div>
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const isBlue = service.color === "secondary";
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link 
                  to={service.link}
                  className="group block h-full bg-card rounded-2xl p-6 shadow-premium border border-border/50 hover:shadow-lift hover:border-primary/20 transition-all"
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${
                    isBlue ? 'bg-secondary/10' : 'bg-primary/10'
                  }`}>
                    <Icon className={`h-7 w-7 ${isBlue ? 'text-secondary' : 'text-primary'}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </p>
                  
                  {/* Link */}
                  <span className="inline-flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Mehr erfahren
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/dienstleistungen">
            <Button variant="outline" size="lg" className="h-12 px-8 font-semibold border-2">
              Alle Services ansehen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
