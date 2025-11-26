import { Truck, Sparkles, Trash2, Package, Home, Wrench, Building2, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useSwipeable } from "react-swipeable";

const services = [
  {
    icon: Truck,
    title: "Umzug",
    description: "Professionelle Umzüge mit erfahrenen Teams",
    price: "Ab CHF 450",
    link: "/dienstleistungen/umzug",
    color: "primary"
  },
  {
    icon: Sparkles,
    title: "Reinigung",
    description: "Abnahmegarantierte Endreinigung",
    price: "Ab CHF 280",
    link: "/dienstleistungen/reinigung",
    color: "secondary"
  },
  {
    icon: Trash2,
    title: "Entsorgung",
    description: "Fachgerechte Entsorgung von Möbeln",
    price: "Ab CHF 150",
    link: "/dienstleistungen/entsorgung",
    color: "accent"
  },
  {
    icon: Package,
    title: "Lagerung",
    description: "Sichere Lagerräume für Ihre Möbel",
    price: "Ab CHF 120/Monat",
    link: "/dienstleistungen/lagerung",
    color: "success"
  },
  {
    icon: Wrench,
    title: "Möbelmontage",
    description: "Auf- und Abbau von Möbeln",
    price: "Ab CHF 80",
    link: "/dienstleistungen/montage",
    color: "happy-purple"
  },
  {
    icon: Home,
    title: "Wohnungsabgabe",
    description: "Komplette Abgabevorbereitung",
    price: "Ab CHF 350",
    link: "/dienstleistungen/wohnungsabgabe",
    color: "happy-teal"
  },
  {
    icon: Building2,
    title: "Firmenumzug",
    description: "Business-Umzüge mit Minimalausfallzeit",
    price: "Auf Anfrage",
    link: "/dienstleistungen/firmenumzug",
    color: "primary"
  },
  {
    icon: Globe,
    title: "International",
    description: "Weltweite Umzüge organisiert",
    price: "Auf Anfrage",
    link: "/dienstleistungen/international",
    color: "secondary"
  }
];

export const ServicesGrid = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 300;
      }
    },
    onSwipedRight: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft -= 300;
      }
    },
  });

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Unsere Dienstleistungen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Alles für Ihren Umzug aus einer Hand – transparent und günstig
          </p>
        </motion.div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={service.link}>
                <div className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-strong transition-all h-full border border-border/50 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-xl bg-${service.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className={`h-7 w-7 text-${service.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
                  <div className="text-primary font-bold">{service.price}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Horizontal Slider */}
        <div 
          {...handlers}
          ref={scrollRef}
          className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {services.map((service, index) => (
            <Link key={index} to={service.link} className="flex-shrink-0 w-[280px] snap-start">
              <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 h-full">
                <div className={`w-14 h-14 rounded-xl bg-${service.color}/10 flex items-center justify-center mb-4`}>
                  <service.icon className={`h-7 w-7 text-${service.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
                <div className="text-primary font-bold">{service.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
