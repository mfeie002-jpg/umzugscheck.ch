import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Home, Building2, Sparkles, Package, Truck, Warehouse } from "lucide-react";

const relatedServices = [
  { icon: Home, title: "Privatumzug", description: "Kompletter Umzugsservice für Privatkunden in Zürich", link: "/umzug-schweiz", price: "ab CHF 590" },
  { icon: Building2, title: "Firmenumzug", description: "Professionelle Büroumzüge in Zürich", link: "/firmenumzug-schweiz", price: "ab CHF 1'990" },
  { icon: Sparkles, title: "Umzugsreinigung", description: "End- und Umzugsreinigung in Zürich", link: "/umzugsreinigung-schweiz", price: "ab CHF 290" },
  { icon: Package, title: "Entsorgung", description: "Möbelentsorgung und Räumungen", link: "/entsorgung-raeumung", price: "ab CHF 190" },
  { icon: Truck, title: "Kleintransporte", description: "Einzelmöbel und kleine Transporte", link: "/kleintransporte", price: "ab CHF 90" },
  { icon: Warehouse, title: "Einlagerung", description: "Möbellagerung in Zürich", link: "/einlagerung", price: "ab CHF 49/Mt" },
];

export const ZuerichRelatedServices = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Weitere Services in Zürich</h2>
          <p className="text-muted-foreground">Alles rund um Ihren Umzug aus einer Hand</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {relatedServices.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={service.link}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all group">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{service.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                          <p className="text-sm font-medium text-primary">{service.price}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
