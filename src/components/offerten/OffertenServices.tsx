import { Calculator, Sparkles, Trash2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Calculator,
    title: "Umzugsrechner",
    description: "Berechnen Sie in wenigen Schritten eine grobe Kostenschätzung für Ihren Umzug.",
    link: "/rechner",
  },
  {
    icon: Sparkles,
    title: "Reinigung mit Abnahmegarantie",
    description: "Offerten für die Endreinigung inkl. Abnahmegarantie und Übergabeprotokoll.",
    link: "/reinigung",
  },
  {
    icon: Trash2,
    title: "Entsorgung & Räumung",
    description: "Alte Möbel und Sperrgut fachgerecht entsorgen lassen – stressfrei und sauber.",
    link: "/entsorgung",
  },
  {
    icon: Briefcase,
    title: "Firmenumzug",
    description: "Professionelle Unterstützung beim Büroumzug, inkl. Planung und Koordination.",
    link: "/firmenumzug",
  },
];

const tips = [
  "Frühzeitig planen und Offerten rechtzeitig einholen.",
  "Flexible Umzugstermine wählen (z. B. unter der Woche statt Samstag).",
  "Möglichst viel selber packen, wenn Zeit vorhanden ist.",
  "Parkierbewilligungen frühzeitig organisieren.",
  "Leistungen genau vergleichen: Transport, Reinigung, Entsorgung, Versicherung.",
];

const OffertenServices = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-manrope text-3xl md:text-4xl font-bold text-foreground mb-4">
            Weitere Services rund um Ihren Umzug
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Alles aus einer Hand für einen stressfreien Umzug.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={service.link}>
                <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                      <service.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-manrope text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="font-manrope text-2xl font-bold text-foreground mb-6 text-center">
            5 Tipps für einen günstigen Umzug
          </h3>
          
          <div className="space-y-4">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-foreground">{index + 1}</span>
                </div>
                <p className="text-foreground pt-1">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OffertenServices;
