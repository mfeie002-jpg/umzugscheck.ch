/**
 * Quick Quote Widget
 * 
 * Compact inline calculator for quick price estimation
 * Drives engagement and leads into full funnel
 */

import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, ArrowRight, MapPin, Home, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface QuickQuoteWidgetProps {
  variant?: 'inline' | 'card' | 'sidebar';
  className?: string;
}

const ROOM_OPTIONS = [
  { value: "1", label: "1 Zimmer", basePrice: 400 },
  { value: "2", label: "2 Zimmer", basePrice: 700 },
  { value: "3", label: "3 Zimmer", basePrice: 1100 },
  { value: "4", label: "4 Zimmer", basePrice: 1500 },
  { value: "5", label: "5+ Zimmer", basePrice: 2000 },
];

export const QuickQuoteWidget = memo(function QuickQuoteWidget({
  variant = 'card',
  className
}: QuickQuoteWidgetProps) {
  const [fromPLZ, setFromPLZ] = useState("");
  const [toPLZ, setToPLZ] = useState("");
  const [rooms, setRooms] = useState("");
  const [showEstimate, setShowEstimate] = useState(false);

  const calculateEstimate = () => {
    if (rooms) {
      setShowEstimate(true);
    }
  };

  const getEstimate = () => {
    const roomOption = ROOM_OPTIONS.find(r => r.value === rooms);
    if (!roomOption) return { min: 400, max: 800 };
    
    const basePrice = roomOption.basePrice;
    // Add distance factor (simplified)
    const distanceFactor = fromPLZ && toPLZ ? 1.2 : 1;
    
    return {
      min: Math.round(basePrice * 0.8 * distanceFactor),
      max: Math.round(basePrice * 1.4 * distanceFactor),
    };
  };

  const estimate = getEstimate();

  if (variant === 'inline') {
    return (
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        <Select value={rooms} onValueChange={(v) => { setRooms(v); setShowEstimate(true); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Zimmerzahl" />
          </SelectTrigger>
          <SelectContent>
            {ROOM_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <AnimatePresence>
          {showEstimate && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-muted-foreground">≈</span>
              <span className="font-bold text-primary">
                CHF {estimate.min.toLocaleString()} – {estimate.max.toLocaleString()}
              </span>
              <Button asChild size="sm" className="ml-2">
                <Link to="/umzugsofferten">
                  Exakte Offerte
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={cn(
        "p-4 rounded-xl border border-border bg-card sticky top-24",
        className
      )}>
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold">Schnellrechner</h3>
        </div>
        
        <div className="space-y-3">
          <Select value={rooms} onValueChange={setRooms}>
            <SelectTrigger>
              <Home className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Wohnungsgrösse" />
            </SelectTrigger>
            <SelectContent>
              {ROOM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={calculateEstimate} 
            className="w-full"
            disabled={!rooms}
          >
            Preis berechnen
          </Button>
          
          <AnimatePresence>
            {showEstimate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="pt-3 border-t border-border"
              >
                <p className="text-sm text-muted-foreground mb-1">Geschätzte Kosten:</p>
                <p className="text-xl font-bold text-primary mb-3">
                  CHF {estimate.min.toLocaleString()} – {estimate.max.toLocaleString()}
                </p>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/umzugsofferten">
                    Verbindliche Offerten holen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <div className={cn(
      "p-6 rounded-2xl border border-border bg-card shadow-lg",
      className
    )}>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-secondary/10">
          <Calculator className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Schnellrechner</h3>
          <p className="text-sm text-muted-foreground">Erhalten Sie eine erste Preisschätzung</p>
        </div>
      </div>
      
      <div className="grid gap-4 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Von PLZ"
              value={fromPLZ}
              onChange={(e) => setFromPLZ(e.target.value)}
              className="pl-10"
              maxLength={4}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <Input
              placeholder="Nach PLZ"
              value={toPLZ}
              onChange={(e) => setToPLZ(e.target.value)}
              className="pl-10"
              maxLength={4}
            />
          </div>
        </div>
        
        <Select value={rooms} onValueChange={setRooms}>
          <SelectTrigger>
            <Home className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Wohnungsgrösse wählen" />
          </SelectTrigger>
          <SelectContent>
            {ROOM_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={calculateEstimate} 
        className="w-full mb-4"
        size="lg"
        disabled={!rooms}
      >
        <Truck className="w-5 h-5 mr-2" />
        Preis schätzen
      </Button>
      
      <AnimatePresence>
        {showEstimate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-primary/5 border border-primary/20"
          >
            <p className="text-sm text-muted-foreground mb-1 text-center">Geschätzte Kosten:</p>
            <p className="text-2xl font-bold text-primary text-center mb-3">
              CHF {estimate.min.toLocaleString()} – {estimate.max.toLocaleString()}
            </p>
            <Button asChild variant="default" className="w-full" size="lg">
              <Link to="/umzugsofferten">
                Jetzt verbindliche Offerten erhalten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Kostenlos & unverbindlich
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default QuickQuoteWidget;
