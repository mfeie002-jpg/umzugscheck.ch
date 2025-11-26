import { Card, CardContent } from "@/components/ui/card";
import { Brain, ShieldCheck, Award, Eye } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "Schweizer AI statt Werbeliste",
    description: "Intelligente Firmen-Matches basierend auf deinen Anforderungen, nicht auf Werbebudget",
  },
  {
    icon: ShieldCheck,
    title: "Keine Fake-Bewertungen",
    description: "Nur echte, verifizierte Kundenbewertungen von abgeschlossenen Umzügen",
  },
  {
    icon: Award,
    title: "Geprüfte Partner",
    description: "Alle Firmen sind versichert, zertifiziert und mehrfach überprüft",
  },
  {
    icon: Eye,
    title: "Transparent & unabhängig",
    description: "Vollständige Preistransparenz, keine versteckten Gebühren oder Provisionen",
  },
];

export const WhyUsCards = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Warum wir besser sind
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Umzugscheck.ch unterscheidet sich fundamental von anderen Plattformen
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
                <Card className="h-full hover:shadow-medium transition-all text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
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
