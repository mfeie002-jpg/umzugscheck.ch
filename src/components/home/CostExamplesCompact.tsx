import { Home, Building, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const examples = [
  {
    icon: Home,
    title: "2-Zimmer / Stadt",
    price: "CHF 850 – 1'050",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Building,
    title: "4-Zimmer / Zwischen Kantonen",
    price: "CHF 1'800 – 2'500",
    color: "bg-secondary/10 text-secondary"
  },
  {
    icon: Truck,
    title: "Firmenumzug klein",
    price: "CHF 1'500 – 4'500",
    color: "bg-accent/10 text-accent"
  }
];

export const CostExamplesCompact = () => {
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
            Kostenbeispiele
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparente Preise für typische Umzüge in der Schweiz
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-medium transition-all">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-2xl ${example.color} flex items-center justify-center mx-auto mb-4`}>
                    <example.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{example.title}</h3>
                  <p className="text-2xl font-bold text-primary">{example.price}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a href="/rechner">
            <Button size="lg" className="px-8">
              Genauen Preis berechnen
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
