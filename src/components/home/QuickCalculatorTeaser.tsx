import { motion } from "framer-motion";
import { Calculator, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const QuickCalculatorTeaser = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 left-10 w-96 h-96 bg-primary rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-accent rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="max-w-5xl mx-auto bg-card/80 backdrop-blur-sm border-2 border-primary/30 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left side - Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-semibold">KI-gestützte Berechnung</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                      Umzugspreis in 60 Sekunden berechnen
                    </h2>
                    
                    <p className="text-lg text-muted-foreground mb-6">
                      Unser KI-Preisrechner analysiert Ihre Angaben und liefert eine präzise 
                      Kostenschätzung – basierend auf echten Daten von über 8.200 Umzügen.
                    </p>
                    
                    <ul className="space-y-3 mb-8">
                      {[
                        "Sofortige Preisberechnung ohne Wartezeit",
                        "100% kostenlos & unverbindlich",
                        "Vergleich mit Marktpreisen",
                        "Detaillierte Kostenübersicht",
                      ].map((feature, index) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-center gap-3 text-foreground"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <ArrowRight className="w-4 h-4 text-primary" />
                          </div>
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <Link to="/rechner">
                      <Button 
                        size="lg" 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all group w-full md:w-auto"
                      >
                        <Calculator className="w-5 h-5 mr-2" />
                        Jetzt kostenlos berechnen
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>

                {/* Right side - Visual */}
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-8 md:p-12 flex items-center justify-center relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="relative"
                  >
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
                      <Calculator className="w-24 h-24 md:w-32 md:h-32 text-primary-foreground" />
                    </div>
                    
                    {/* Floating elements */}
                    <motion.div
                      animate={{ y: [-10, 10, -10] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -top-4 -right-4 bg-card border-2 border-primary/30 rounded-lg px-4 py-2 shadow-lg"
                    >
                      <p className="text-sm font-semibold text-foreground">CHF 850-1200</p>
                    </motion.div>
                    
                    <motion.div
                      animate={{ y: [10, -10, 10] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute -bottom-4 -left-4 bg-card border-2 border-accent/30 rounded-lg px-4 py-2 shadow-lg"
                    >
                      <p className="text-sm font-semibold text-foreground">3.5 Zimmer</p>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
