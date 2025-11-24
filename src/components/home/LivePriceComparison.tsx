import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Home, Truck } from "lucide-react";

export const LivePriceComparison = () => {
  const [rooms, setRooms] = useState([2]);
  const [distance, setDistance] = useState([50]);

  const calculatePrice = (roomCount: number, distanceKm: number) => {
    const basePrice = 400;
    const roomPrice = roomCount * 200;
    const distancePrice = distanceKm * 2;
    return Math.round(basePrice + roomPrice + distancePrice);
  };

  const minPrice = calculatePrice(rooms[0], distance[0]);
  const maxPrice = Math.round(minPrice * 1.3);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Live-Preisvergleich
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Spielen Sie mit den Parametern und sehen Sie sofort, wie sich der Preis verändert
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="shadow-xl border-2 border-primary/20 bg-card">
            <CardContent className="p-8">
              {/* Price Display */}
              <motion.div
                key={`${rooms[0]}-${distance[0]}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mb-12 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl"
              >
                <p className="text-sm text-muted-foreground mb-2">
                  Geschätzter Preis
                </p>
                <div className="flex items-center justify-center gap-4">
                  <motion.span
                    className="text-5xl font-bold text-primary"
                    key={minPrice}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    CHF {minPrice}
                  </motion.span>
                  <span className="text-2xl text-muted-foreground">-</span>
                  <motion.span
                    className="text-5xl font-bold text-primary"
                    key={maxPrice}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    {maxPrice}
                  </motion.span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Basierend auf Ihren Angaben
                </p>
              </motion.div>

              {/* Sliders */}
              <div className="space-y-8">
                {/* Rooms Slider */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-primary" />
                      <label className="font-semibold text-foreground">
                        Anzahl Zimmer
                      </label>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {rooms[0]}
                    </span>
                  </div>
                  <Slider
                    value={rooms}
                    onValueChange={setRooms}
                    min={1}
                    max={7}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>1 Zimmer</span>
                    <span>7+ Zimmer</span>
                  </div>
                </div>

                {/* Distance Slider */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      <label className="font-semibold text-foreground">
                        Distanz
                      </label>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {distance[0]} km
                    </span>
                  </div>
                  <Slider
                    value={distance}
                    onValueChange={setDistance}
                    min={5}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>5 km</span>
                    <span>200 km</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="mt-8 p-4 bg-secondary/20 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  💡 Dies ist eine ungefähre Schätzung. Für eine exakte Offerte nutzen Sie unseren detaillierten Rechner.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
