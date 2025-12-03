import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import servicePrivatumzug from "@/assets/service-privatumzug.jpg";
import serviceFirmenumzug from "@/assets/service-firmenumzug.jpg";
import serviceReinigung from "@/assets/service-reinigung.jpg";
import serviceEntsorgung from "@/assets/service-entsorgung.jpg";

const services = [
  {
    title: "Privatumzug",
    description: "Kompletter Service für Ihren privaten Umzug",
    link: "/dienstleistungen/privatumzug",
    image: servicePrivatumzug
  },
  {
    title: "Firmenumzug",
    description: "Professionelle Büro- und Geschäftsumzüge",
    link: "/dienstleistungen/firmenumzug",
    image: serviceFirmenumzug
  },
  {
    title: "Reinigung",
    description: "End- und Umzugsreinigung nach Standard",
    link: "/dienstleistungen/reinigung",
    image: serviceReinigung
  },
  {
    title: "Entsorgung",
    description: "Fachgerechte Entsorgung & Räumung",
    link: "/dienstleistungen/entsorgung",
    image: serviceEntsorgung
  }
];

export const ServicesGridCompact = () => {
  return (
    <section className="py-12 md:py-28 bg-gradient-elegant">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 text-slate-900 heading-premium">
            Unsere Dienstleistungen
          </h2>
          <p className="text-sm md:text-xl text-slate-600 max-w-2xl mx-auto body-premium">
            Professionelle Services für jeden Umzug – alles aus einer Hand
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={service.link}>
                <Card variant="elevated" className="h-full hover:shadow-strong hover:-translate-y-2 transition-all duration-300 group cursor-pointer overflow-hidden border-0">
                  <div className="relative h-28 md:h-40 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 right-2 md:right-3">
                      <h3 className="text-sm md:text-lg font-bold text-white drop-shadow-lg">{service.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-3 md:p-5 text-center bg-white">
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
