import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Warehouse, Package, Info, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const storageItems = [
  { id: "boxes", label: "Umzugskartons", unit: "Stück", volume: 0.06, icon: "📦" },
  { id: "furniture", label: "Möbelstücke", unit: "Stück", volume: 0.8, icon: "🛋️" },
  { id: "appliances", label: "Elektrogeräte", unit: "Stück", volume: 0.5, icon: "🔌" },
  { id: "mattresses", label: "Matratzen", unit: "Stück", volume: 0.3, icon: "🛏️" },
];

const pricePerCubicMeter = 35; // CHF per month

export default function StorageCalculator() {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    boxes: 10,
    furniture: 5,
    appliances: 2,
    mattresses: 1,
  });
  const [duration, setDuration] = useState(1);

  const totalVolume = useMemo(() => {
    return storageItems.reduce((total, item) => {
      return total + (quantities[item.id] || 0) * item.volume;
    }, 0);
  }, [quantities]);

  const monthlyPrice = Math.ceil(totalVolume * pricePerCubicMeter);
  const totalPrice = monthlyPrice * duration;

  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Warehouse className="w-5 h-5 shrink-0" />
          <span>Lagerkosten berechnen</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 sm:space-y-6">
        <div className="space-y-5 sm:space-y-4">
          {storageItems.map((item) => (
            <div key={item.id} className="space-y-3 sm:space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium flex items-center gap-2 min-w-0">
                  <span className="text-base sm:text-lg shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </span>
                <Badge variant="outline" className="shrink-0 text-xs sm:text-sm">
                  {quantities[item.id]} {item.unit}
                </Badge>
              </div>
              <Slider
                value={[quantities[item.id]]}
                onValueChange={([value]) =>
                  setQuantities({ ...quantities, [item.id]: value })
                }
                max={item.id === "boxes" ? 50 : 20}
                step={1}
                className="touch-manipulation py-1"
              />
            </div>
          ))}
        </div>

        <div className="space-y-3 sm:space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Lagerdauer</span>
            <Badge variant="outline" className="shrink-0 text-xs sm:text-sm">
              {duration} Monat{duration > 1 ? "e" : ""}
            </Badge>
          </div>
          <Slider
            value={[duration]}
            onValueChange={([value]) => setDuration(value)}
            min={1}
            max={12}
            step={1}
            className="touch-manipulation py-1"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/20"
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Geschätztes Volumen</p>
              <p className="text-lg sm:text-xl font-bold">{totalVolume.toFixed(1)} m³</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Monatliche Kosten</p>
              <p className="text-lg sm:text-xl font-bold">CHF {monthlyPrice}</p>
            </div>
          </div>
          <div className="pt-3 sm:pt-4 border-t border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
              <span className="text-sm sm:font-medium">Gesamtkosten ({duration} Monat{duration > 1 ? "e" : ""})</span>
              <span className="text-xl sm:text-2xl font-bold text-primary">CHF {totalPrice}</span>
            </div>
            <p className="text-xs text-muted-foreground flex items-start sm:items-center gap-1">
              <Info className="w-3 h-3 shrink-0 mt-0.5 sm:mt-0" />
              <span>Preise verstehen sich inkl. Versicherung bis CHF 10'000</span>
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="outline" className="h-12 sm:h-10 min-h-[44px] touch-manipulation">
            Offerte anfordern
          </Button>
          <Button className="h-12 sm:h-10 min-h-[44px] touch-manipulation">
            Jetzt buchen
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}