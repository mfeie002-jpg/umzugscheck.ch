/**
 * Zug Related Services Component
 * #101+: Cross-sell related services
 */

import { motion } from "framer-motion";
import { 
  Truck, Sparkles, Warehouse, Trash2, 
  Wrench, Building2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Sparkles,
    title: "Umzugsreinigung",
    description: "Endreinigung mit Abgabegarantie",
    href: "/services/reinigung",
    badge: "Beliebt",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Warehouse,
    title: "Einlagerung",
    description: "Sichere Zwischenlagerung in Zug",
    href: "/services/lagerung",
    badge: null,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    icon: Trash2,
    title: "Entsorgung",
    description: "Möbelentsorgung & Räumung",
    href: "/services/entsorgung",
    badge: null,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    icon: Building2,
    title: "Firmenumzug",
    description: "Büro- & Geschäftsumzüge",
    href: "/services/firmenumzug",
    badge: "Professionell",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: Wrench,
    title: "Möbelmontage",
    description: "Auf- und Abbau Service",
    href: "/services/moebelmontage",
    badge: null,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Truck,
    title: "Möbellift",
    description: "Für schwierige Zugänge",
    href: "/services/moebellift",
    badge: "Zug Altstadt",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
];

export const ZugRelatedServices = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge variant="outline" className="mb-4">
            Weitere Services
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Alles aus einer Hand
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Unsere Partnerfirmen im Kanton Zug bieten noch mehr
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={service.href}
                className="block group h-full"
              >
                <div className="bg-background rounded-xl p-4 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all h-full flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-xl ${service.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <service.icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{service.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {service.description}
                  </p>
                  {service.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {service.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link to="/services">
            <Button variant="outline">
              Alle Services ansehen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
