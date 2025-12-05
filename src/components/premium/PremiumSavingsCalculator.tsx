import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, PiggyBank, TrendingUp, ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const PremiumSavingsCalculator = () => {
  const [rooms, setRooms] = useState([3]);
  const [distance, setDistance] = useState([50]);

  const basePrice = rooms[0] * 800 + distance[0] * 3;
  const savings = Math.round(basePrice * 0.35);
  const finalPrice = basePrice - savings;

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <PiggyBank className="w-4 h-4" />
            Sparrechner
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            So viel können Sie sparen
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Berechnen Sie Ihr Einsparpotenzial mit unserem kostenlosen Vergleichsservice
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Sliders */}
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="font-medium">Anzahl Zimmer</label>
                    <span className="text-primary font-bold">{rooms[0]} Zimmer</span>
                  </div>
                  <Slider
                    value={rooms}
                    onValueChange={setRooms}
                    min={1}
                    max={8}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="font-medium">Distanz</label>
                    <span className="text-primary font-bold">{distance[0]} km</span>
                  </div>
                  <Slider
                    value={distance}
                    onValueChange={setDistance}
                    min={5}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="bg-muted/50 rounded-2xl p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-muted-foreground">Durchschnittspreis</span>
                    <span className="text-xl line-through text-muted-foreground">
                      CHF {basePrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-green-600 font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Ihre Ersparnis
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      - CHF {savings.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg">Mit Umzugscheck</span>
                    <motion.span
                      key={finalPrice}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-bold text-primary"
                    >
                      CHF {finalPrice.toLocaleString()}
                    </motion.span>
                  </div>
                </div>

                <Button asChild className="w-full mt-6 group">
                  <Link to="/umzugsrechner">
                    Jetzt vergleichen
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
