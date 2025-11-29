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
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Unsere Dienstleistungen
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Professionelle Services für jeden Umzug
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={service.link}>
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer border-slate-200 overflow-hidden">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-bold mb-2 text-slate-900">{service.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
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
