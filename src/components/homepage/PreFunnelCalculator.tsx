import { memo, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Home, MapPin, TrendingDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";

// Price calculation based on rooms and distance
const calculatePriceRange = (rooms: number, distanceKm: number) => {
  // Base price per room
  const basePricePerRoom = 350;
  // Price per km for distance
  const pricePerKm = 2.5;
  
  // Calculate base price
  const basePrice = rooms * basePricePerRoom + distanceKm * pricePerKm;
  
  // Add variance for min/max
  const minPrice = Math.round(basePrice * 0.75);
  const maxPrice = Math.round(basePrice * 1.25);
  
  return { min: minPrice, max: maxPrice };
};

// Format CHF price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

interface PreFunnelCalculatorProps {
  onComplete?: (data: { rooms: number; distance: number; priceRange: { min: number; max: number } }) => void;
  className?: string;
}

export const PreFunnelCalculator = memo(function PreFunnelCalculator({
  onComplete,
  className = ""
}: PreFunnelCalculatorProps) {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(3);
  const [distance, setDistance] = useState(20);
  const [isHovering, setIsHovering] = useState(false);
  
  const priceRange = useMemo(() => calculatePriceRange(rooms, distance), [rooms, distance]);
  
  const roomLabels = [
    { value: 1, label: "1 Zimmer" },
    { value: 2, label: "2 Zimmer" },
    { value: 3, label: "3 Zimmer" },
    { value: 4, label: "4 Zimmer" },
    { value: 5, label: "5 Zimmer" },
    { value: 6, label: "6+ Zimmer / Haus" },
  ];
  
  const handleContinue = () => {
    if (onComplete) {
      onComplete({ rooms, distance, priceRange });
    }
    // Navigate to main funnel with pre-filled data
    navigate(`/umzugsofferten?rooms=${rooms}&distance=${distance}`);
  };

  return (
    <div className={`bg-card rounded-2xl border border-border shadow-premium p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Schnell-Check
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">
          Was kostet Ihr Umzug?
        </h3>
        <p className="text-sm text-muted-foreground">
          Erhalten Sie in Sekunden eine erste Preisschätzung
        </p>
      </div>
      
      {/* Sliders */}
      <div className="space-y-6">
        {/* Rooms Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Home className="w-4 h-4 text-primary" />
              Wohnungsgrösse
            </label>
            <span className="text-sm font-bold text-primary">
              {roomLabels.find(r => r.value === rooms)?.label}
            </span>
          </div>
          <Slider
            value={[rooms]}
            onValueChange={(value) => setRooms(value[0])}
            min={1}
            max={6}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>1 Zi.</span>
            <span>3 Zi.</span>
            <span>6+ Zi.</span>
          </div>
        </div>
        
        {/* Distance Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Distanz
            </label>
            <span className="text-sm font-bold text-primary">
              {distance} km
            </span>
          </div>
          <Slider
            value={[distance]}
            onValueChange={(value) => setDistance(value[0])}
            min={5}
            max={200}
            step={5}
            className="py-2"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>5 km</span>
            <span>100 km</span>
            <span>200 km</span>
          </div>
        </div>
      </div>
      
      {/* Price Result */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${rooms}-${distance}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="mt-6 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 rounded-xl p-4 border border-primary/20"
        >
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Geschätzte Kosten</p>
            <div className="flex items-center justify-center gap-2">
              <motion.span
                key={priceRange.min}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-primary"
              >
                {formatPrice(priceRange.min)}
              </motion.span>
              <span className="text-muted-foreground">–</span>
              <motion.span
                key={priceRange.max}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-primary"
              >
                {formatPrice(priceRange.max)}
              </motion.span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              *Richtpreis inkl. MwSt. – der exakte Preis hängt von Details ab
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Savings Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-2 mt-4 text-sm"
      >
        <TrendingDown className="w-4 h-4 text-green-500" />
        <span className="text-green-700 dark:text-green-400 font-medium">
          Bis zu {formatPrice(Math.round(priceRange.max * 0.4))} sparen durch Vergleich
        </span>
      </motion.div>
      
      {/* CTA Button */}
      <Button
        onClick={handleContinue}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="w-full mt-4 h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-cta"
      >
        <span>Exakten Preis berechnen</span>
        <motion.div
          animate={{ x: isHovering ? 4 : 0 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <ArrowRight className="w-5 h-5 ml-2" />
        </motion.div>
      </Button>
      
      <p className="text-center text-[10px] text-muted-foreground mt-3">
        Kostenlos • Unverbindlich • In 2 Minuten
      </p>
    </div>
  );
});
