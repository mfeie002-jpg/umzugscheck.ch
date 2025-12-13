import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";

export const PriceCalculatorPreview = () => {
  const [rooms, setRooms] = useState([3]);
  const [distance, setDistance] = useState([20]);

  const basePrice = 300;
  const roomMultiplier = 150;
  const distanceMultiplier = 3;
  
  const minPrice = Math.round(basePrice + rooms[0] * roomMultiplier + distance[0] * distanceMultiplier);
  const maxPrice = Math.round(minPrice * 1.4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 shadow-lg"
    >
      <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-primary/10">
          <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-sm sm:text-base">Schnell-Kalkulator</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Grobe Preisschätzung</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <div className="flex justify-between mb-1.5 sm:mb-2">
            <label className="text-xs sm:text-sm font-medium text-foreground">Zimmeranzahl</label>
            <span className="text-xs sm:text-sm font-bold text-primary">{rooms[0]} Zimmer</span>
          </div>
          <Slider
            value={rooms}
            onValueChange={setRooms}
            min={1}
            max={7}
            step={0.5}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1.5 sm:mb-2">
            <label className="text-xs sm:text-sm font-medium text-foreground">Distanz</label>
            <span className="text-xs sm:text-sm font-bold text-primary">{distance[0]} km</span>
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

        <div className="bg-muted/50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Geschätzte Kosten</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            CHF {minPrice.toLocaleString()} – {maxPrice.toLocaleString()}
          </p>
        </div>

        <Link to="/umzugsofferten">
          <Button className="w-full gap-2 h-10 sm:h-11 text-sm sm:text-base active:scale-[0.98] transition-transform">
            Detaillierte Berechnung
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
