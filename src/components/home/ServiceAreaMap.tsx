import { motion } from "framer-motion";
import { MapPin, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const cantons = [
  { name: "Zürich", companies: 45 },
  { name: "Bern", companies: 38 },
  { name: "Basel-Stadt", companies: 28 },
  { name: "Aargau", companies: 32 },
  { name: "Luzern", companies: 24 },
  { name: "St. Gallen", companies: 26 },
  { name: "Genf", companies: 22 },
  { name: "Waadt", companies: 20 },
  { name: "Zug", companies: 18 },
  { name: "Thurgau", companies: 16 },
  { name: "Solothurn", companies: 14 },
  { name: "Graubünden", companies: 12 },
];

export const ServiceAreaMap = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Schweizweite Abdeckung
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Wir verbinden Sie mit den besten Umzugsfirmen in allen Schweizer Kantonen
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Map visualization */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-8">
                <div className="aspect-square relative">
                  {/* Simple Switzerland map representation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Decorative pins */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="absolute"
                          style={{
                            top: `${20 + Math.random() * 60}%`,
                            left: `${20 + Math.random() * 60}%`,
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                            <MapPin className="w-5 h-5 text-primary-foreground" />
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Central icon */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
                          <MapPin className="w-10 h-10 text-primary-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <p className="text-2xl font-bold text-foreground mb-2">
                    26 Kantone
                  </p>
                  <p className="text-muted-foreground">
                    Vollständige Abdeckung in der ganzen Schweiz
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Canton list */}
          <div>
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
              {cantons.map((canton, index) => (
                <motion.div
                  key={canton.name}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-all hover:border-primary/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {canton.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {canton.companies} geprüfte Firmen
                            </p>
                          </div>
                        </div>
                        <Link to={`/${canton.name.toLowerCase()}/umzugsfirmen`}>
                          <Button variant="ghost" size="sm">
                            Anzeigen
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <Link to="/regionen">
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Alle Regionen anzeigen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
