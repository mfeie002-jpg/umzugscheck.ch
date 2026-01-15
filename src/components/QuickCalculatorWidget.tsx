/**
 * Quick Calculator Widget
 * Mini price estimator for hero sections
 * Compact, mobile-friendly, leads to full calculator
 */

import { useState, memo } from "react";
import { Calculator, ArrowRight, Home, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface QuickCalculatorWidgetProps {
  variant?: 'compact' | 'expanded' | 'inline';
  showResult?: boolean;
  className?: string;
  onCalculate?: (result: { min: number; max: number }) => void;
}

export const QuickCalculatorWidget = memo(({
  variant = 'compact',
  showResult = true,
  className,
  onCalculate
}: QuickCalculatorWidgetProps) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<string>("3");
  const [fromPLZ, setFromPLZ] = useState<string>("");
  const [toPLZ, setToPLZ] = useState<string>("");
  const [result, setResult] = useState<{ min: number; max: number } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePrice = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const basePrice = 850;
      const roomMultiplier = parseInt(rooms) * 220;
      
      // Simple distance estimation based on PLZ difference
      const plzDiff = Math.abs(
        parseInt(fromPLZ.substring(0, 2) || "0") - 
        parseInt(toPLZ.substring(0, 2) || "0")
      );
      const distanceMultiplier = plzDiff * 15;
      
      const min = Math.round(basePrice + roomMultiplier + distanceMultiplier * 0.8);
      const max = Math.round(basePrice + roomMultiplier + distanceMultiplier * 1.4);
      
      const newResult = { min, max };
      setResult(newResult);
      setIsCalculating(false);
      onCalculate?.(newResult);
    }, 600);
  };

  const handleGetOffers = () => {
    // Pass data to full calculator
    const params = new URLSearchParams({
      rooms,
      from: fromPLZ,
      to: toPLZ
    });
    navigate(`/umzugsofferten?${params.toString()}`);
  };

  if (variant === 'inline') {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <Select value={rooms} onValueChange={setRooms}>
          <SelectTrigger className="w-28 bg-white">
            <SelectValue placeholder="Zimmer" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <SelectItem key={n} value={String(n)}>{n} Zimmer</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGetOffers} className="gap-2">
          <Calculator className="w-4 h-4" />
          Preis berechnen
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-xl border border-border/50 overflow-hidden",
      variant === 'expanded' ? "p-6" : "p-4",
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">Schnellrechner</h3>
          <p className="text-xs text-muted-foreground">Unverbindliche Schätzung</p>
        </div>
      </div>

      {/* Form */}
      <div className={cn(
        "grid gap-3",
        variant === 'expanded' ? "sm:grid-cols-2" : ""
      )}>
        {/* Rooms */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Home className="w-3 h-3" />
            Zimmer
          </label>
          <Select value={rooms} onValueChange={setRooms}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Zimmer / Studio</SelectItem>
              <SelectItem value="2">2 Zimmer</SelectItem>
              <SelectItem value="3">3 Zimmer</SelectItem>
              <SelectItem value="4">4 Zimmer</SelectItem>
              <SelectItem value="5">5 Zimmer</SelectItem>
              <SelectItem value="6">6+ Zimmer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* From PLZ */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Von PLZ
          </label>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="z.B. 8001"
            value={fromPLZ}
            onChange={(e) => setFromPLZ(e.target.value.replace(/\D/g, '').substring(0, 4))}
            className="h-10"
            maxLength={4}
          />
        </div>

        {/* To PLZ */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Nach PLZ
          </label>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="z.B. 3000"
            value={toPLZ}
            onChange={(e) => setToPLZ(e.target.value.replace(/\D/g, '').substring(0, 4))}
            className="h-10"
            maxLength={4}
          />
        </div>

        {/* Calculate Button */}
        <div className={cn(
          "flex items-end",
          variant === 'expanded' ? "" : "col-span-full"
        )}>
          <Button 
            onClick={calculatePrice}
            disabled={isCalculating || !fromPLZ || !toPLZ}
            className="w-full h-10"
          >
            {isCalculating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Berechne...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Schätzen
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-border/50"
          >
            <div className="bg-primary/5 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Geschätzte Kosten</p>
              <p className="text-2xl font-bold text-primary">
                CHF {result.min.toLocaleString('de-CH')} – {result.max.toLocaleString('de-CH')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Basierend auf {rooms} Zimmer, ohne Zusatzleistungen
              </p>
              
              <Button 
                onClick={handleGetOffers}
                className="w-full mt-3 bg-primary hover:bg-primary/90"
              >
                Kostenlose Offerten erhalten
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

QuickCalculatorWidget.displayName = 'QuickCalculatorWidget';

export default QuickCalculatorWidget;
