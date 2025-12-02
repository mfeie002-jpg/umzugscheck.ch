import { Card, CardContent } from "@/components/ui/card";
import { Brain, ShieldCheck, Award, Eye } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "Mehrere Offerten statt nur einer",
    description: "Erhalten Sie bis zu 5 Angebote und wählen Sie das beste für Sie",
  },
  {
    icon: ShieldCheck,
    title: "Geprüfte & bewertete Umzugsfirmen",
    description: "Alle Partner sind versichert, zertifiziert und mehrfach überprüft",
  },
  {
    icon: Award,
    title: "Schweizer Plattform mit Qualitätsfokus",
    description: "Lokaler Support und höchste Schweizer Qualitätsstandards",
  },
  {
    icon: Eye,
    title: "Zeitersparnis: eine Anfrage, viele Angebote",
    description: "In 2 Minuten mehrere Offerten statt mühsamer Einzelanfragen",
  },
];

export const WhyUsCards = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 heading-premium">
            Warum umzugscheck.ch?
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto body-premium">
            Ihre Vorteile auf einen Blick
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card variant="elevated" className="h-full hover:shadow-strong hover:-translate-y-1 transition-all duration-300 text-center border-0 bg-white">
                  <CardContent className="p-4 md:p-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-3 md:mb-5 shadow-medium">
                      <Icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <h3 className="text-sm md:text-lg font-bold mb-2 md:mb-3 text-slate-900 leading-tight">{feature.title}</h3>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
