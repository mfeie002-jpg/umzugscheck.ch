import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Service images
import servicePrivatumzug from "@/assets/service-privatumzug.jpg";
import serviceFirmenumzug from "@/assets/service-firmenumzug-new.jpg";
import serviceReinigung from "@/assets/service-reinigung-new.jpg";
import serviceEntsorgung from "@/assets/service-entsorgung-new.jpg";
import serviceLagerung from "@/assets/service-lagerung.jpg";
import serviceUmzug from "@/assets/service-umzug.jpg";
import serviceMontage from "@/assets/service-montage.jpg";
import serviceInternational from "@/assets/service-international.jpg";

const services = [
  {
    title: "Privatumzug",
    description: "Kompletter Umzugsservice für Ihren Wohnungswechsel – vom Einpacken bis zum Aufbau.",
    link: "/privatumzug",
    image: servicePrivatumzug,
    badge: "Beliebt",
    badgeColor: "bg-green-500"
  },
  {
    title: "Firmenumzug",
    description: "Professionelle Büroumzüge mit minimaler Betriebsunterbrechung für KMUs und Grossfirmen.",
    link: "/firmenumzug",
    image: serviceFirmenumzug,
    badge: null,
    badgeColor: ""
  },
  {
    title: "Endreinigung",
    description: "Professionelle Wohnungsreinigung mit Abnahmegarantie für eine reibungslose Übergabe.",
    link: "/reinigung",
    image: serviceReinigung,
    badge: "Top-Service",
    badgeColor: "bg-primary"
  },
  {
    title: "Entsorgung & Räumung",
    description: "Fachgerechte Entsorgung von Möbeln, Elektrogeräten und Hausrat.",
    link: "/entsorgung",
    image: serviceEntsorgung,
    badge: null,
    badgeColor: ""
  },
  {
    title: "Möbellagerung",
    description: "Sichere und flexible Lagerboxen für kurz- oder langfristige Einlagerung.",
    link: "/lagerung",
    image: serviceLagerung,
    badge: null,
    badgeColor: ""
  },
  {
    title: "Spezialtransporte",
    description: "Sicherer Transport von Klavieren, Tresoren, Kunst und sensiblen Gütern.",
    link: "/spezialtransporte",
    image: serviceUmzug,
    badge: null,
    badgeColor: ""
  },
  {
    title: "Möbelmontage",
    description: "Professioneller Auf- und Abbau Ihrer Möbel durch erfahrene Handwerker.",
    link: "/montage",
    image: serviceMontage,
    badge: null,
    badgeColor: ""
  },
  {
    title: "Internationale Umzüge",
    description: "Weltweite Umzugsservices mit Zollabwicklung und internationaler Logistik.",
    link: "/internationale-umzuege",
    image: serviceInternational,
    badge: "Neu",
    badgeColor: "bg-secondary"
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
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link 
                to={service.link}
                className="group relative block h-full bg-card rounded-2xl overflow-hidden shadow-premium border border-border/50 hover:shadow-lift hover:border-primary/20 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Badge */}
                  {service.badge && (
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${service.badgeColor}`}>
                      {service.badge}
                    </span>
                  )}
                  
                  {/* Title on Image */}
                  <h3 className="absolute bottom-3 left-4 right-4 text-lg font-bold text-white drop-shadow-lg">
                    {service.title}
                  </h3>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {service.description}
                  </p>
                  
                  {/* Link */}
                  <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                    Mehr erfahren
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
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
            <Button variant="secondary" size="lg" className="h-11 sm:h-12 px-5 sm:px-8 text-sm sm:text-base font-semibold group">
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
