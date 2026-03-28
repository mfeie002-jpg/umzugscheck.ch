import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useSwipeable } from "react-swipeable";

// Service images
import serviceUmzug from "@/assets/service-umzug.jpg";
import serviceReinigung from "@/assets/service-reinigung-new.jpg";
import serviceEntsorgung from "@/assets/service-entsorgung-new.jpg";
import serviceLagerung from "@/assets/service-lagerung.jpg";
import serviceMontage from "@/assets/service-montage.jpg";
import serviceFirmenumzug from "@/assets/service-firmenumzug-new.jpg";

const services = [
  {
    title: "Privatumzug",
    description: "Professionelle Umzüge mit erfahrenen Teams",
    price: "Ab CHF 450",
    link: "/privatumzug",
    image: serviceUmzug
  },
  {
    title: "Reinigung",
    description: "Abnahmegarantierte Endreinigung",
    price: "Ab CHF 280",
    link: "/reinigung",
    image: serviceReinigung
  },
  {
    title: "Entsorgung",
    description: "Fachgerechte Entsorgung von Möbeln",
    price: "Ab CHF 150",
    link: "/entsorgung",
    image: serviceEntsorgung
  },
  {
    title: "Lagerung",
    description: "Sichere Lagerräume für Ihre Möbel",
    price: "Ab CHF 120/Monat",
    link: "/lagerung",
    image: serviceLagerung
  },
  {
    title: "Möbellift",
    description: "Möbel sicher durch das Fenster",
    price: "Ab CHF 350",
    link: "/moebellift",
    image: serviceMontage
  },
  {
    title: "Firmenumzug",
    description: "Business-Umzüge mit Minimalausfallzeit",
    price: "Auf Anfrage",
    link: "/firmenumzug",
    image: serviceFirmenumzug
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
    <section className="py-12 md:py-20 bg-muted/30">
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
                <div className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all h-full border border-border/50 hover:-translate-y-1">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-xl font-bold text-white drop-shadow-lg">{service.title}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
                    <div className="text-primary font-bold">{service.price}</div>
                  </div>
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
              <div className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border/50 h-full">
                <div className="relative h-36 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white drop-shadow-lg">{service.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-muted-foreground text-sm mb-2">{service.description}</p>
                  <div className="text-primary font-bold">{service.price}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
