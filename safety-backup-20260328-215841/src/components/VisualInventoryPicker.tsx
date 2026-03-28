/**
 * Visual Inventory Picker - Gamification Component
 * SVG-Icons Grid for item selection with smart defaults
 */

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sofa, Bed, Table2 as Table, Tv, Refrigerator, WashingMachine,
  Armchair, Lamp, BookOpen, Monitor, Printer, Archive,
  Bike, Dumbbell, Baby, Dog, Piano, Package,
  Plus, Minus, Check, Sparkles, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Inventory item type
interface InventoryItem {
  id: string;
  name: string;
  icon: React.ElementType;
  category: 'wohnzimmer' | 'schlafzimmer' | 'kueche' | 'buero' | 'sonstiges';
  weight: number; // kg
  volume: number; // m³
  defaultCount?: number;
  popular?: boolean;
}

// All available items
const INVENTORY_ITEMS: InventoryItem[] = [
  // Wohnzimmer
  { id: 'sofa', name: 'Sofa', icon: Sofa, category: 'wohnzimmer', weight: 80, volume: 1.5, defaultCount: 1, popular: true },
  { id: 'sessel', name: 'Sessel', icon: Armchair, category: 'wohnzimmer', weight: 30, volume: 0.5 },
  { id: 'tv', name: 'Fernseher', icon: Tv, category: 'wohnzimmer', weight: 20, volume: 0.2, defaultCount: 1, popular: true },
  { id: 'wohnzimmertisch', name: 'Wohnzimmertisch', icon: Table, category: 'wohnzimmer', weight: 30, volume: 0.3 },
  { id: 'stehlampe', name: 'Stehlampe', icon: Lamp, category: 'wohnzimmer', weight: 5, volume: 0.1 },
  { id: 'buecherregal', name: 'Bücherregal', icon: BookOpen, category: 'wohnzimmer', weight: 60, volume: 0.8 },
  
  // Schlafzimmer
  { id: 'bett', name: 'Bett', icon: Bed, category: 'schlafzimmer', weight: 100, volume: 2.0, defaultCount: 1, popular: true },
  { id: 'matratze', name: 'Matratze', icon: Bed, category: 'schlafzimmer', weight: 25, volume: 0.5, defaultCount: 1 },
  { id: 'kleiderschrank', name: 'Kleiderschrank', icon: Archive, category: 'schlafzimmer', weight: 120, volume: 2.5, defaultCount: 1, popular: true },
  { id: 'kommode', name: 'Kommode', icon: Archive, category: 'schlafzimmer', weight: 40, volume: 0.5 },
  
  // Küche
  { id: 'kuehlschrank', name: 'Kühlschrank', icon: Refrigerator, category: 'kueche', weight: 70, volume: 0.8, defaultCount: 1, popular: true },
  { id: 'waschmaschine', name: 'Waschmaschine', icon: WashingMachine, category: 'kueche', weight: 80, volume: 0.6, defaultCount: 1 },
  { id: 'esstisch', name: 'Esstisch', icon: Table, category: 'kueche', weight: 50, volume: 1.0, defaultCount: 1 },
  
  // Büro
  { id: 'schreibtisch', name: 'Schreibtisch', icon: Table, category: 'buero', weight: 40, volume: 0.8 },
  { id: 'burostuhl', name: 'Bürostuhl', icon: Armchair, category: 'buero', weight: 15, volume: 0.3 },
  { id: 'monitor', name: 'Monitor', icon: Monitor, category: 'buero', weight: 8, volume: 0.1 },
  { id: 'drucker', name: 'Drucker', icon: Printer, category: 'buero', weight: 10, volume: 0.1 },
  
  // Sonstiges
  { id: 'kartons', name: 'Umzugskartons', icon: Package, category: 'sonstiges', weight: 15, volume: 0.06, defaultCount: 20, popular: true },
  { id: 'fahrrad', name: 'Fahrrad', icon: Bike, category: 'sonstiges', weight: 15, volume: 0.4 },
  { id: 'fitnessgeraet', name: 'Fitnessgerät', icon: Dumbbell, category: 'sonstiges', weight: 50, volume: 0.5 },
  { id: 'kinderbett', name: 'Kinderbett', icon: Baby, category: 'sonstiges', weight: 30, volume: 0.8 },
  { id: 'klavier', name: 'Klavier', icon: Piano, category: 'sonstiges', weight: 250, volume: 1.5 },
];

// Category labels
const CATEGORIES = {
  wohnzimmer: { label: 'Wohnzimmer', emoji: '🛋️' },
  schlafzimmer: { label: 'Schlafzimmer', emoji: '🛏️' },
  kueche: { label: 'Küche', emoji: '🍳' },
  buero: { label: 'Büro', emoji: '💼' },
  sonstiges: { label: 'Sonstiges', emoji: '📦' },
};

// Room presets
const ROOM_PRESETS = {
  '1': { name: 'Studio', multiplier: 0.5 },
  '2': { name: '2-Zimmer', multiplier: 0.8 },
  '3': { name: '3-Zimmer', multiplier: 1.0 },
  '4': { name: '4-Zimmer', multiplier: 1.3 },
  '5': { name: '5-Zimmer', multiplier: 1.6 },
  '6+': { name: '6+ Zimmer', multiplier: 2.0 },
};

interface VisualInventoryPickerProps {
  roomCount?: string;
  onInventoryChange?: (inventory: Record<string, number>, stats: { totalWeight: number; totalVolume: number }) => void;
  className?: string;
}

export const VisualInventoryPicker = ({
  roomCount = '3',
  onInventoryChange,
  className,
}: VisualInventoryPickerProps) => {
  const [inventory, setInventory] = useState<Record<string, number>>(() => {
    // Initialize with smart defaults based on room count
    const preset = ROOM_PRESETS[roomCount as keyof typeof ROOM_PRESETS] || ROOM_PRESETS['3'];
    const defaults: Record<string, number> = {};
    
    INVENTORY_ITEMS.forEach(item => {
      if (item.defaultCount) {
        defaults[item.id] = Math.round(item.defaultCount * preset.multiplier);
      }
    });
    
    return defaults;
  });
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Calculate totals
  const stats = INVENTORY_ITEMS.reduce(
    (acc, item) => {
      const count = inventory[item.id] || 0;
      return {
        totalWeight: acc.totalWeight + count * item.weight,
        totalVolume: acc.totalVolume + count * item.volume,
        totalItems: acc.totalItems + count,
      };
    },
    { totalWeight: 0, totalVolume: 0, totalItems: 0 }
  );

  const updateCount = useCallback((itemId: string, delta: number) => {
    setInventory(prev => {
      const currentCount = prev[itemId] || 0;
      const newCount = Math.max(0, currentCount + delta);
      const newInventory = { ...prev, [itemId]: newCount };
      
      // Calculate new stats
      const newStats = INVENTORY_ITEMS.reduce(
        (acc, item) => {
          const count = newInventory[item.id] || 0;
          return {
            totalWeight: acc.totalWeight + count * item.weight,
            totalVolume: acc.totalVolume + count * item.volume,
          };
        },
        { totalWeight: 0, totalVolume: 0 }
      );
      
      onInventoryChange?.(newInventory, newStats);
      return newInventory;
    });
  }, [onInventoryChange]);

  const filteredItems = activeCategory 
    ? INVENTORY_ITEMS.filter(item => item.category === activeCategory)
    : INVENTORY_ITEMS.filter(item => item.popular);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Inventar-Assistent
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Smart Defaults für {ROOM_PRESETS[roomCount as keyof typeof ROOM_PRESETS]?.name || '3-Zimmer'}
          </Badge>
        </div>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="p-2 bg-background rounded-lg text-center">
            <div className="text-lg font-bold text-primary">{stats.totalItems}</div>
            <div className="text-xs text-muted-foreground">Gegenstände</div>
          </div>
          <div className="p-2 bg-background rounded-lg text-center">
            <div className="text-lg font-bold text-primary">{Math.round(stats.totalWeight)} kg</div>
            <div className="text-xs text-muted-foreground">Gewicht</div>
          </div>
          <div className="p-2 bg-background rounded-lg text-center">
            <div className="text-lg font-bold text-primary">{stats.totalVolume.toFixed(1)} m³</div>
            <div className="text-xs text-muted-foreground">Volumen</div>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Inventar-Vollständigkeit</span>
            <span>{Math.min(100, Math.round((stats.totalItems / 30) * 100))}%</span>
          </div>
          <Progress value={Math.min(100, (stats.totalItems / 30) * 100)} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
            className="text-xs"
          >
            ⭐ Beliebt
          </Button>
          {Object.entries(CATEGORIES).map(([key, { label, emoji }]) => (
            <Button
              key={key}
              variant={activeCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(key)}
              className="text-xs"
            >
              {emoji} {label}
            </Button>
          ))}
        </div>
        
        {/* Item Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const count = inventory[item.id] || 0;
              const IconComponent = item.icon;
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "relative p-3 rounded-lg border-2 transition-all",
                    count > 0 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {/* Count Badge */}
                  {count > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-6 min-w-6 flex items-center justify-center bg-primary text-xs">
                      {count}
                    </Badge>
                  )}
                  
                  {/* Icon & Name */}
                  <div className="flex flex-col items-center text-center mb-2">
                    <IconComponent className={cn(
                      "h-8 w-8 mb-1.5",
                      count > 0 ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className="text-xs font-medium line-clamp-1">{item.name}</span>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateCount(item.id, -1)}
                      disabled={count === 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">{count}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateCount(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        {/* Summary CTA */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-sm font-medium text-foreground">
                Geschätztes Transportvolumen: <span className="text-primary font-bold">{stats.totalVolume.toFixed(1)} m³</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Entspricht ca. {Math.ceil(stats.totalVolume / 15)} Lieferwagen-Ladungen
              </div>
            </div>
            <Button size="sm" className="gap-2">
              <Check className="h-4 w-4" />
              Inventar speichern
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualInventoryPicker;
