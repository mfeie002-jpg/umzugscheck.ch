import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Privatumzug",
    description: "Komplettservice für Ihren privaten Umzug",
    link: "/dienstleistungen/privatumzug",
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&h=300&fit=crop"
  },
  {
    title: "Firmenumzug",
    description: "Professionelle Büro- und Geschäftsumzüge",
    link: "/dienstleistungen/firmenumzug",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"
  },
  {
    title: "Reinigung",
    description: "End- und Umzugsreinigung nach Standard",
    link: "/dienstleistungen/reinigung",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop"
  },
  {
    title: "Lagerung",
    description: "Sichere Möbellagerung, kurz- oder langfristig",
    link: "/dienstleistungen/lagerung",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop"
  },
  {
    title: "Klavier / Spezialtransport",
    description: "Sichere Transporte für empfindliche Gegenstände",
    link: "/dienstleistungen/spezialtransport",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop"
  },
  {
    title: "Räumung / Entsorgung",
    description: "Entrümpelung und fachgerechte Entsorgung",
    link: "/dienstleistungen/entsorgung",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop"
  }
];

export const ServicesGridCompact = () => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Unsere Dienstleistungen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Alles aus einer Hand – vom Umzug bis zur Reinigung
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={service.link}>
                <Card className="h-full hover:shadow-medium transition-all group cursor-pointer overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max px-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="w-[280px]"
              >
                <Link to={service.link}>
                  <Card className="h-full hover:shadow-medium transition-all overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
