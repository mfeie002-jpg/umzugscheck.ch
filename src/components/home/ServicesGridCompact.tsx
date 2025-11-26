import { Home, Building2, Sparkles, Package, Piano, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Home,
    title: "Privatumzug",
    description: "Komplettservice für Ihren privaten Umzug",
    link: "/dienstleistungen/privatumzug"
  },
  {
    icon: Building2,
    title: "Firmenumzug",
    description: "Professionelle Büro- und Geschäftsumzüge",
    link: "/dienstleistungen/firmenumzug"
  },
  {
    icon: Sparkles,
    title: "Reinigung",
    description: "End- und Umzugsreinigung nach Standard",
    link: "/dienstleistungen/reinigung"
  },
  {
    icon: Package,
    title: "Lagerung",
    description: "Sichere Möbellagerung, kurz- oder langfristig",
    link: "/dienstleistungen/lagerung"
  },
  {
    icon: Piano,
    title: "Klavier / Spezialtransport",
    description: "Sichere Transporte für empfindliche Gegenstände",
    link: "/dienstleistungen/spezialtransport"
  },
  {
    icon: Trash2,
    title: "Räumung / Entsorgung",
    description: "Entrümpelung und fachgerechte Entsorgung",
    link: "/dienstleistungen/entsorgung"
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
                <Card className="h-full hover:shadow-medium transition-all group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
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
          <div className="flex gap-4 min-w-max">
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
                  <Card className="h-full hover:shadow-medium transition-all">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <service.icon className="h-6 w-6 text-primary" />
                      </div>
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
