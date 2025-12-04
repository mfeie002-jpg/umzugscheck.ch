/**
 * Zug Mini Price Calculator Component
 * #10-15: Quick inline calculator for instant estimates
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ArrowRight, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ZugPriceCalculatorMini = () => {
  const [rooms, setRooms] = useState(3);
  const [distance, setDistance] = useState(10);
  const [floor, setFloor] = useState(2);
  const [showResult, setShowResult] = useState(false);

  // Simple price calculation
  const basePrice = rooms * 400;
  const distancePrice = distance * 15;
  const floorPrice = floor * 50;
  const minPrice = Math.round((basePrice + distancePrice + floorPrice) * 0.85);
  const maxPrice = Math.round((basePrice + distancePrice + floorPrice) * 1.15);

  const handleCalculate = () => {
    setShowResult(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-primary/5 via-background to-primary/10 rounded-2xl p-6 sm:p-8 border border-border/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">Schnell-Kalkulator</h3>
          <p className="text-sm text-muted-foreground">Sofortige Preisschätzung</p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          <Sparkles className="w-3 h-3 mr-1" />
          KI-gestützt
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Rooms Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Zimmeranzahl</label>
            <span className="text-sm font-bold text-primary">{rooms} Zimmer</span>
          </div>
          <Slider
            value={[rooms]}
            onValueChange={(v) => { setRooms(v[0]); setShowResult(false); }}
            min={1}
            max={7}
            step={0.5}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1 Zi.</span>
            <span>7 Zi.</span>
          </div>
        </div>

        {/* Distance Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Distanz
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Entfernung zwischen altem und neuem Wohnort</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <span className="text-sm font-bold text-primary">{distance} km</span>
          </div>
          <Slider
            value={[distance]}
            onValueChange={(v) => { setDistance(v[0]); setShowResult(false); }}
            min={1}
            max={100}
            step={1}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Lokal</span>
            <span>100 km</span>
          </div>
        </div>

        {/* Floor Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Stockwerk (ohne Lift)</label>
            <span className="text-sm font-bold text-primary">{floor}. OG</span>
          </div>
          <Slider
            value={[floor]}
            onValueChange={(v) => { setFloor(v[0]); setShowResult(false); }}
            min={0}
            max={6}
            step={1}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>EG</span>
            <span>6. OG</span>
          </div>
        </div>

        {/* Calculate Button */}
        <Button 
          onClick={handleCalculate}
          className="w-full"
          size="lg"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Preis berechnen
        </Button>

        {/* Result Display */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-background rounded-xl p-4 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">Geschätzte Kosten:</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    CHF {minPrice.toLocaleString("de-CH")}
                  </span>
                  <span className="text-muted-foreground">–</span>
                  <span className="text-2xl font-bold text-foreground">
                    {maxPrice.toLocaleString("de-CH")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * Richtwert für Umzüge im Kanton Zug
                </p>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Detaillierte Offerten erhalten
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
