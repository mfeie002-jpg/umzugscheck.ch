import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calculator, ArrowRight, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const MovingCostCalculatorMini = () => {
  const [rooms, setRooms] = useState([3]);
  const [distance, setDistance] = useState([25]);
  const [showResult, setShowResult] = useState(false);

  const basePrice = rooms[0] * 400;
  const distancePrice = distance[0] * 2.5;
  const minPrice = Math.round((basePrice + distancePrice) * 0.85);
  const maxPrice = Math.round((basePrice + distancePrice) * 1.2);
  const savings = Math.round(maxPrice * 0.25);

  return (
    <Card className="border-primary/20 shadow-lg overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary to-primary/50" />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Schnell-Kalkulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Zimmeranzahl</span>
              <span className="font-semibold">{rooms[0]} Zimmer</span>
            </div>
            <Slider
              value={rooms}
              onValueChange={(value) => {
                setRooms(value);
                setShowResult(true);
              }}
              min={1}
              max={7}
              step={0.5}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Entfernung</span>
              <span className="font-semibold">{distance[0]} km</span>
            </div>
            <Slider
              value={distance}
              onValueChange={(value) => {
                setDistance(value);
                setShowResult(true);
              }}
              min={5}
              max={200}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-primary/5 border border-primary/20"
            >
              <div className="text-center mb-3">
                <p className="text-sm text-muted-foreground">Geschätzte Kosten</p>
                <p className="text-2xl font-bold text-primary">
                  CHF {minPrice.toLocaleString()} – {maxPrice.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-md py-2">
                <TrendingDown className="h-4 w-4" />
                <span>Bis zu CHF {savings} sparen mit Vergleich</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Link to="/umzugsofferten">
          <Button className="w-full" size="lg">
            Genaue Offerten erhalten
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default MovingCostCalculatorMini;
