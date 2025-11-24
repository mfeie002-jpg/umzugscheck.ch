import { motion } from "framer-motion";
import { Shield, Calculator, TrendingDown, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const transparencyPoints = [
  {
    icon: Calculator,
    title: "KI-Preisrechner",
    description: "Sofortige, präzise Kostenschätzung basierend auf echten Daten",
  },
  {
    icon: Shield,
    title: "Keine versteckten Kosten",
    description: "100% transparente Preisgestaltung – was Sie sehen, ist was Sie zahlen",
  },
  {
    icon: TrendingDown,
    title: "Beste Marktpreise",
    description: "Fairer Preis durch direkten Vergleich mit anderen Anbietern",
  },
  {
    icon: BadgeCheck,
    title: "Fixpreis-Garantie",
    description: "Optional buchbar für absolute Kostensicherheit",
  },
];

export const PricingTransparency = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Transparente Preisgestaltung mit KI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Keine Überraschungen. Keine versteckten Kosten. Nur faire, nachvollziehbare Preise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {transparencyPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{point.title}</h3>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Probieren Sie unseren KI-Preisrechner jetzt aus
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Erhalten Sie in wenigen Sekunden eine präzise Kostenschätzung für Ihren Umzug – 
                basierend auf echten Daten von über 8.200 erfolgreichen Umzügen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/rechner">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all">
                    <Calculator className="w-5 h-5 mr-2" />
                    Jetzt Preis berechnen
                  </Button>
                </Link>
                <Link to="/kontakt">
                  <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/5">
                    Persönliche Beratung
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
