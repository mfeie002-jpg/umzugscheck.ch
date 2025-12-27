/**
 * VisualInventory - Gamified Icon-based Inventory Selection (Prio 4)
 * 
 * Implements:
 * - Icon-grid with counters for quick selection
 * - Room-based grouping
 * - Smart defaults based on room count
 * - Touch-friendly interface
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Sofa,
  BedDouble,
  Armchair,
  Lamp,
  Tv,
  Table,
  Monitor,
  BookOpen,
  Refrigerator,
  Utensils,
  WashingMachine,
  Bath,
  Package,
  Bike,
  Car,
  Dumbbell,
  Music,
  Baby,
  Dog,
  Flower2,
  Plus,
  Minus,
  RotateCcw,
  Check,
  Home,
  ChefHat,
  Moon,
  Briefcase,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ============================================
// TYPES
// ============================================

interface InventoryItem {
  id: string;
  name: string;
  icon: LucideIcon;
  defaultCount?: number;
  category: RoomCategory;
}

type RoomCategory = "wohnzimmer" | "schlafzimmer" | "kueche" | "bad" | "buero" | "keller" | "sonstiges";

interface InventoryState {
  [itemId: string]: number;
}

interface VisualInventoryProps {
  rooms: number;
  onInventoryChange?: (inventory: InventoryState, totalItems: number) => void;
  initialInventory?: InventoryState;
  compact?: boolean;
}

// ============================================
// INVENTORY ITEMS CONFIGURATION
// ============================================

const ROOM_CONFIG: Record<RoomCategory, { label: string; icon: LucideIcon; color: string }> = {
  wohnzimmer: { label: "Wohnzimmer", icon: Sofa, color: "text-blue-600" },
  schlafzimmer: { label: "Schlafzimmer", icon: Moon, color: "text-purple-600" },
  kueche: { label: "Küche", icon: ChefHat, color: "text-orange-600" },
  bad: { label: "Bad", icon: Bath, color: "text-cyan-600" },
  buero: { label: "Büro", icon: Briefcase, color: "text-green-600" },
  keller: { label: "Keller/Lager", icon: Warehouse, color: "text-gray-600" },
  sonstiges: { label: "Sonstiges", icon: Package, color: "text-pink-600" },
};

const INVENTORY_ITEMS: InventoryItem[] = [
  // Wohnzimmer
  { id: "sofa", name: "Sofa", icon: Sofa, category: "wohnzimmer", defaultCount: 1 },
  { id: "sessel", name: "Sessel", icon: Armchair, category: "wohnzimmer", defaultCount: 0 },
  { id: "couchtisch", name: "Couchtisch", icon: Table, category: "wohnzimmer", defaultCount: 1 },
  { id: "tv", name: "TV/Fernseher", icon: Tv, category: "wohnzimmer", defaultCount: 1 },
  { id: "tv-moebel", name: "TV-Möbel", icon: Package, category: "wohnzimmer", defaultCount: 1 },
  { id: "stehlampe", name: "Stehlampe", icon: Lamp, category: "wohnzimmer", defaultCount: 1 },
  { id: "buecherregal", name: "Bücherregal", icon: BookOpen, category: "wohnzimmer", defaultCount: 0 },
  
  // Schlafzimmer
  { id: "doppelbett", name: "Doppelbett", icon: BedDouble, category: "schlafzimmer", defaultCount: 1 },
  { id: "einzelbett", name: "Einzelbett", icon: BedDouble, category: "schlafzimmer", defaultCount: 0 },
  { id: "kleiderschrank", name: "Kleiderschrank", icon: Package, category: "schlafzimmer", defaultCount: 1 },
  { id: "kommode", name: "Kommode", icon: Package, category: "schlafzimmer", defaultCount: 1 },
  { id: "nachttisch", name: "Nachttisch", icon: Table, category: "schlafzimmer", defaultCount: 2 },
  
  // Küche
  { id: "kuehlschrank", name: "Kühlschrank", icon: Refrigerator, category: "kueche", defaultCount: 1 },
  { id: "waschmaschine", name: "Waschmaschine", icon: WashingMachine, category: "kueche", defaultCount: 1 },
  { id: "tumbler", name: "Tumbler", icon: WashingMachine, category: "kueche", defaultCount: 0 },
  { id: "esstisch", name: "Esstisch", icon: Utensils, category: "kueche", defaultCount: 1 },
  { id: "stuehle", name: "Stühle", icon: Armchair, category: "kueche", defaultCount: 4 },
  { id: "geschirrspueler", name: "Geschirrspüler", icon: Package, category: "kueche", defaultCount: 0 },
  
  // Bad
  { id: "badmoebel", name: "Badmöbel", icon: Bath, category: "bad", defaultCount: 1 },
  { id: "waschbecken-schrank", name: "Waschbecken-Schrank", icon: Package, category: "bad", defaultCount: 1 },
  
  // Büro
  { id: "schreibtisch", name: "Schreibtisch", icon: Table, category: "buero", defaultCount: 0 },
  { id: "buero-stuhl", name: "Bürostuhl", icon: Armchair, category: "buero", defaultCount: 0 },
  { id: "computer", name: "Computer/Monitor", icon: Monitor, category: "buero", defaultCount: 0 },
  { id: "drucker", name: "Drucker", icon: Package, category: "buero", defaultCount: 0 },
  
  // Keller/Lager
  { id: "kartons", name: "Umzugskartons", icon: Package, category: "keller", defaultCount: 15 },
  { id: "velo", name: "Velo/Fahrrad", icon: Bike, category: "keller", defaultCount: 0 },
  { id: "auto-reifen", name: "Autoreifen", icon: Car, category: "keller", defaultCount: 0 },
  { id: "sportgeraete", name: "Sportgeräte", icon: Dumbbell, category: "keller", defaultCount: 0 },
  
  // Sonstiges
  { id: "pflanze-gross", name: "Grosse Pflanze", icon: Flower2, category: "sonstiges", defaultCount: 0 },
  { id: "klavier", name: "Klavier/Piano", icon: Music, category: "sonstiges", defaultCount: 0 },
  { id: "kinderbett", name: "Kinderbett", icon: Baby, category: "sonstiges", defaultCount: 0 },
  { id: "haustier-zubehoer", name: "Haustier-Zubehör", icon: Dog, category: "sonstiges", defaultCount: 0 },
];

// Smart defaults based on room count
const getSmartDefaults = (rooms: number): InventoryState => {
  const defaults: InventoryState = {};
  
  INVENTORY_ITEMS.forEach(item => {
    let count = item.defaultCount || 0;
    
    // Adjust based on room count
    if (rooms >= 4) {
      // Larger apartments
      if (item.id === "sessel") count = 1;
      if (item.id === "einzelbett") count = 1;
      if (item.id === "stuehle") count = 6;
      if (item.id === "kartons") count = 25;
      if (item.id === "schreibtisch") count = 1;
      if (item.id === "buero-stuhl") count = 1;
    } else if (rooms <= 2) {
      // Smaller apartments
      if (item.id === "kartons") count = 10;
      if (item.id === "stuehle") count = 2;
      if (item.id === "nachttisch") count = 1;
    }
    
    if (count > 0) {
      defaults[item.id] = count;
    }
  });
  
  return defaults;
};

// ============================================
// ITEM COUNTER COMPONENT
// ============================================

const ItemCounter = ({
  item,
  count,
  onCountChange,
  compact = false,
}: {
  item: InventoryItem;
  count: number;
  onCountChange: (newCount: number) => void;
  compact?: boolean;
}) => {
  const Icon = item.icon;
  const hasCount = count > 0;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative flex flex-col items-center p-2 rounded-xl border-2 transition-all cursor-pointer select-none",
        hasCount 
          ? "border-primary bg-primary/5 shadow-sm" 
          : "border-border bg-background hover:border-muted-foreground/50",
        compact ? "p-1.5" : "p-3"
      )}
      onClick={() => onCountChange(count + 1)}
    >
      {/* Icon */}
      <div className={cn(
        "flex items-center justify-center rounded-lg mb-1",
        hasCount ? "text-primary" : "text-muted-foreground",
        compact ? "w-8 h-8" : "w-10 h-10"
      )}>
        <Icon className={compact ? "h-5 w-5" : "h-6 w-6"} />
      </div>
      
      {/* Name */}
      <span className={cn(
        "text-center font-medium leading-tight",
        compact ? "text-[10px]" : "text-xs",
        hasCount ? "text-foreground" : "text-muted-foreground"
      )}>
        {item.name}
      </span>
      
      {/* Counter */}
      {hasCount && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2"
        >
          <Badge 
            className={cn(
              "h-5 min-w-5 flex items-center justify-center p-0 text-xs font-bold",
              "bg-primary text-primary-foreground"
            )}
          >
            {count}
          </Badge>
        </motion.div>
      )}
      
      {/* Controls */}
      {hasCount && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 opacity-0 hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 rounded-full bg-background/80"
            onClick={(e) => {
              e.stopPropagation();
              onCountChange(Math.max(0, count - 1));
            }}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 rounded-full bg-background/80"
            onClick={(e) => {
              e.stopPropagation();
              onCountChange(count + 1);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export function VisualInventory({
  rooms,
  onInventoryChange,
  initialInventory,
  compact = false,
}: VisualInventoryProps) {
  const [inventory, setInventory] = useState<InventoryState>(() => 
    initialInventory || getSmartDefaults(rooms)
  );
  const [activeTab, setActiveTab] = useState<RoomCategory>("wohnzimmer");

  // Apply smart defaults when rooms change
  useEffect(() => {
    if (!initialInventory) {
      setInventory(getSmartDefaults(rooms));
    }
  }, [rooms, initialInventory]);

  // Notify parent of changes
  useEffect(() => {
    const totalItems = Object.values(inventory).reduce((sum, count) => sum + count, 0);
    onInventoryChange?.(inventory, totalItems);
  }, [inventory, onInventoryChange]);

  const updateCount = (itemId: string, newCount: number) => {
    setInventory(prev => {
      const updated = { ...prev };
      if (newCount <= 0) {
        delete updated[itemId];
      } else {
        updated[itemId] = newCount;
      }
      return updated;
    });
  };

  const resetToDefaults = () => {
    setInventory(getSmartDefaults(rooms));
  };

  const totalItems = Object.values(inventory).reduce((sum, count) => sum + count, 0);
  const selectedCategories = new Set(
    INVENTORY_ITEMS.filter(item => (inventory[item.id] || 0) > 0).map(item => item.category)
  );

  const roomCategories = Object.entries(ROOM_CONFIG) as [RoomCategory, typeof ROOM_CONFIG[RoomCategory]][];

  return (
    <div className="space-y-4">
      {/* Header with summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Package className="h-3 w-3 mr-1" />
            {totalItems} Gegenstände
          </Badge>
          <Badge variant="outline" className="text-muted-foreground">
            {selectedCategories.size} Räume
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetToDefaults}
          className="text-xs"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Smart Reset
        </Button>
      </div>

      {/* Room Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RoomCategory)}>
        <TabsList className="w-full flex-wrap h-auto p-1 gap-1">
          {roomCategories.map(([key, config]) => {
            const RoomIcon = config.icon;
            const hasItems = INVENTORY_ITEMS
              .filter(item => item.category === key)
              .some(item => (inventory[item.id] || 0) > 0);
            
            return (
              <TabsTrigger
                key={key}
                value={key}
                className={cn(
                  "flex-1 min-w-fit text-xs px-2 py-1.5 gap-1",
                  hasItems && "ring-1 ring-primary/30"
                )}
              >
                <RoomIcon className={cn("h-3 w-3", config.color)} />
                <span className="hidden sm:inline">{config.label}</span>
                {hasItems && <Check className="h-3 w-3 text-green-600" />}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {roomCategories.map(([key]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className={cn(
              "grid gap-2",
              compact 
                ? "grid-cols-4 sm:grid-cols-6" 
                : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5"
            )}>
              <AnimatePresence mode="popLayout">
                {INVENTORY_ITEMS.filter(item => item.category === key).map(item => (
                  <ItemCounter
                    key={item.id}
                    item={item}
                    count={inventory[item.id] || 0}
                    onCountChange={(count) => updateCount(item.id, count)}
                    compact={compact}
                  />
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick summary of selected items */}
      {totalItems > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-muted/50 rounded-lg"
        >
          <p className="text-xs text-muted-foreground mb-2">Ausgewählt:</p>
          <div className="flex flex-wrap gap-1">
            {INVENTORY_ITEMS.filter(item => (inventory[item.id] || 0) > 0)
              .slice(0, 8)
              .map(item => {
                const Icon = item.icon;
                return (
                  <Badge key={item.id} variant="secondary" className="text-xs gap-1">
                    <Icon className="h-3 w-3" />
                    {inventory[item.id]}x {item.name}
                  </Badge>
                );
              })}
            {Object.keys(inventory).length > 8 && (
              <Badge variant="outline" className="text-xs">
                +{Object.keys(inventory).length - 8} weitere
              </Badge>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default VisualInventory;
