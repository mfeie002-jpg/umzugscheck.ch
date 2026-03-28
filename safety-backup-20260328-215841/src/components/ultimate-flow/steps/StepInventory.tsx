/**
 * Step 2: Umzugsgut (Hybrid-Inventar)
 * 
 * - Schnellauswahl nach Zimmeranzahl
 * - Optionale detaillierte Inventarliste
 * - Grosse, klickbare Kacheln
 */

import { useState } from "react";
import { Home, Building2, ChevronDown, ChevronUp, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { UltimateFlowData } from "../UltimateSwissFlow";

interface StepInventoryProps {
  data: UltimateFlowData;
  updateData: (updates: Partial<UltimateFlowData>) => void;
}

const ROOM_OPTIONS = [
  { value: "studio", label: "Studio", icon: "🏠", volume: "~15m³" },
  { value: "1-2", label: "1-2 Zimmer", icon: "🏡", volume: "~25m³" },
  { value: "2-3", label: "2-3 Zimmer", icon: "🏘️", volume: "~35m³" },
  { value: "3-4", label: "3-4 Zimmer", icon: "🏢", volume: "~50m³" },
  { value: "4-5", label: "4-5 Zimmer", icon: "🏛️", volume: "~65m³" },
  { value: "5+", label: "5+ Zimmer", icon: "🏰", volume: "~80m³+" },
];

const INVENTORY_ITEMS = [
  { id: "sofa", label: "Sofa/Couch", default: 1 },
  { id: "beds", label: "Betten", default: 2 },
  { id: "tables", label: "Tische", default: 2 },
  { id: "chairs", label: "Stühle", default: 4 },
  { id: "wardrobes", label: "Schränke", default: 2 },
  { id: "boxes", label: "Umzugskartons", default: 20 },
];

export function StepInventory({ data, updateData }: StepInventoryProps) {
  const [showDetails, setShowDetails] = useState(data.inventoryMode === 'detailed');

  const handleRoomSelect = (value: string) => {
    updateData({ roomCount: value });
  };

  const toggleDetails = () => {
    const newMode = showDetails ? 'quick' : 'detailed';
    setShowDetails(!showDetails);
    updateData({ inventoryMode: newMode });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Wie gross ist Ihre Wohnung?
        </h1>
        <p className="text-muted-foreground">
          Wählen Sie die passende Grösse für eine genaue Offerte
        </p>
      </div>

      {/* Room Selection Grid - CRITICAL FIX: Larger text and touch targets for mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ROOM_OPTIONS.map((option) => {
          const isSelected = data.roomCount === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleRoomSelect(option.value)}
              className={cn(
                "flex flex-col items-center justify-center p-4 sm:p-4 rounded-xl border-2 transition-all",
                "min-h-[110px] sm:min-h-[100px] touch-manipulation active:scale-[0.98]",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span className="text-3xl sm:text-2xl mb-1.5">{option.icon}</span>
              <span className={cn(
                "font-semibold text-base sm:text-sm",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {option.label}
              </span>
              <span className="text-sm sm:text-xs text-muted-foreground mt-0.5">
                {option.volume}
              </span>
            </button>
          );
        })}
      </div>

      {/* Details Toggle */}
      <div className="text-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleDetails}
          className="gap-2 text-muted-foreground"
        >
          <Package className="h-4 w-4" />
          Details angeben
          {showDetails ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Detailed Inventory (Collapsible) */}
      {showDetails && (
        <div className="bg-card rounded-xl p-4 border space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            Optional: Präzise Analyse = <span className="text-secondary font-medium">bis 40% sparen</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            {INVENTORY_ITEMS.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <span className="text-sm">{item.label}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-7 h-7 rounded-full bg-background border flex items-center justify-center text-sm"
                    onClick={() => {
                      const current = data.detailedInventory?.[item.id] ?? item.default;
                      updateData({
                        detailedInventory: {
                          ...data.detailedInventory,
                          [item.id]: Math.max(0, current - 1),
                        },
                      });
                    }}
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {data.detailedInventory?.[item.id] ?? item.default}
                  </span>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-full bg-background border flex items-center justify-center text-sm"
                    onClick={() => {
                      const current = data.detailedInventory?.[item.id] ?? item.default;
                      updateData({
                        detailedInventory: {
                          ...data.detailedInventory,
                          [item.id]: current + 1,
                        },
                      });
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tip */}
      {data.roomCount && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
          <p className="text-sm text-primary">
            💡 Bei <strong>{ROOM_OPTIONS.find(r => r.value === data.roomCount)?.label}</strong> liegen die Kosten meist zwischen{" "}
            <strong>CHF 800 - 2'500</strong>
          </p>
        </div>
      )}
    </div>
  );
}
