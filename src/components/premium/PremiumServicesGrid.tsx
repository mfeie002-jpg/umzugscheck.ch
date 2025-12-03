import { Home, Building2, Sparkles, Trash2, Package, Truck, Heart, Globe, ArrowRight, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const services = [
  {
    icon: Home,
    title: "Privatumzug",
    description: "Kompletter Umzugsservice für Ihren Wohnungswechsel – vom Einpacken bis zum Aufbau.",
    link: "/privatumzug",
    color: "primary",
    badge: "Beliebt",
    badgeColor: "bg-success/10 text-success"
  },
  {
    icon: Building2,
    title: "Firmenumzug",
    description: "Professionelle Büroumzüge mit minimaler Betriebsunterbrechung für KMUs und Grossfirmen.",
    link: "/firmenumzug",
    color: "secondary",
    badge: null,
    badgeColor: ""
  },
  {
    icon: Sparkles,
    title: "Endreinigung",
    description: "Professionelle Wohnungsreinigung mit Abnahmegarantie für eine reibungslose Übergabe.",
    link: "/reinigung",
    color: "primary",
    badge: "Top-Service",
    badgeColor: "bg-primary/10 text-primary"
  },
  {
    icon: Trash2,
    title: "Entsorgung & Räumung",
    description: "Fachgerechte Entsorgung von Möbeln, Elektrogeräten und Hausrat.",
    link: "/entsorgung",
    color: "secondary",
    badge: null,
    badgeColor: ""
  },
  {
    icon: Package,
    title: "Möbellagerung",
    description: "Sichere und flexible Lagerboxen für kurz- oder langfristige Einlagerung.",
    link: "/lagerung",
    color: "primary",
    badge: null,
    badgeColor: ""
  },
  {
    icon: Truck,
    title: "Spezialtransporte",
    description: "Sicherer Transport von Klavieren, Tresoren, Kunst und sensiblen Gütern.",
    link: "/spezialtransporte",
    color: "secondary",
    badge: null,
    badgeColor: ""
  },
  {
    icon: Heart,
    title: "Seniorenumzug",
    description: "Einfühlsamer Rundum-Service für ältere Menschen mit besonderer Betreuung.",
    link: "/seniorenumzug",
    color: "primary",
    badge: null,
    badgeColor: ""
  },
  {
    icon: Globe,
    title: "Internationale Umzüge",
    description: "Weltweite Umzugsservices mit Zollabwicklung und internationaler Logistik.",
    link: "/internationale-umzuege",
    color: "secondary",
    badge: "Neu",
    badgeColor: "bg-secondary/10 text-secondary"
  }
];

export const PremiumServicesGrid = () => {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full text-secondary font-semibold text-sm uppercase tracking-wider mb-4"
          >
            <Star className="h-4 w-4" />
            Unsere Services
          </motion.span>
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
                  className="group relative block h-full bg-card rounded-2xl p-6 shadow-premium border border-border/50 hover:shadow-lift hover:border-primary/20 transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badge */}
                  {service.badge && (
                    <motion.span
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 + 0.2 }}
                      className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold ${service.badgeColor}`}
                    >
                      {service.badge}
                    </motion.span>
                  )}
                  
                  {/* Icon */}
                  <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
                    isBlue ? 'bg-secondary/10' : 'bg-primary/10'
                  }`}>
                    <Icon className={`h-7 w-7 ${isBlue ? 'text-secondary' : 'text-primary'}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="relative text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="relative text-sm text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </p>
                  
                  {/* Link */}
                  <span className="relative inline-flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    Mehr erfahren
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
        
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: "8+", label: "Service-Kategorien" },
            { value: "200+", label: "Partner-Firmen" },
            { value: "26", label: "Schweizer Kantone" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/dienstleistungen">
            <Button variant="outline" size="lg" className="h-11 sm:h-12 px-5 sm:px-8 text-sm sm:text-base font-semibold border-2 group">
              <span className="hidden sm:inline">Alle Services ansehen</span>
              <span className="sm:hidden">Mehr Services</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
