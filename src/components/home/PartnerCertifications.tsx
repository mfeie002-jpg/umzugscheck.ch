import { motion } from "framer-motion";
import { Shield, Award, Truck, Users, Star, BadgeCheck } from "lucide-react";

const certifications = [
  {
    icon: Shield,
    title: "ISO 9001 Zertifiziert",
    description: "Qualitätsmanagement",
  },
  {
    icon: Award,
    title: "Schweizer Qualität",
    description: "100% Swiss Made",
  },
  {
    icon: Truck,
    title: "Lizenziert & Versichert",
    description: "CHF 10 Mio. Deckung",
  },
  {
    icon: Users,
    title: "Familienunternehmen",
    description: "Seit 2016",
  },
  {
    icon: Star,
    title: "Top bewertet",
    description: "4.9/5 Sterne",
  },
  {
    icon: BadgeCheck,
    title: "Geprüfte Firma",
    description: "TÜV zertifiziert",
  },
];

export const PartnerCertifications = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Ausgezeichnet & Zertifiziert
          </h3>
          <p className="text-muted-foreground">
            Ihre Sicherheit ist unsere Priorität
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold text-sm text-foreground mb-1">
                  {cert.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {cert.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
