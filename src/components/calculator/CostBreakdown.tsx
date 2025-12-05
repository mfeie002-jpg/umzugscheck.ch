import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CostItem {
  label: string;
  amount: number;
  description?: string;
}

interface CostBreakdownProps {
  basePrice: number;
  items: CostItem[];
  totalMin: number;
  totalMax: number;
  className?: string;
}

export const CostBreakdown = ({ basePrice, items, totalMin, totalMax, className = "" }: CostBreakdownProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const subtotal = basePrice + items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className={`bg-card rounded-xl border border-border overflow-hidden ${className}`}>
      {/* Summary Header */}
      <div className="p-6 bg-gradient-to-br from-primary/5 to-background">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Geschätzte Gesamtkosten</p>
          <p className="text-4xl font-bold text-foreground">
            CHF {totalMin.toLocaleString()} – {totalMax.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Expand Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors border-t border-border"
      >
        <span className="text-sm font-medium">Kostenaufschlüsselung anzeigen</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {/* Breakdown Details */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0 }}
        className="overflow-hidden"
      >
        <div className="p-6 space-y-4">
          {/* Base Price */}
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Grundgebühr</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Basiskosten für Anfahrt und Organisation</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="font-medium">CHF {basePrice.toLocaleString()}</span>
          </div>

          {/* Individual Items */}
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between py-2 border-b border-border"
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{item.label}</span>
                {item.description && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.description}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <span className="font-medium">
                {item.amount > 0 ? `CHF ${item.amount.toLocaleString()}` : "inkl."}
              </span>
            </motion.div>
          ))}

          {/* Subtotal */}
          <div className="flex items-center justify-between py-3 border-t-2 border-border mt-4">
            <span className="font-medium">Zwischensumme</span>
            <span className="font-bold">CHF {subtotal.toLocaleString()}</span>
          </div>

          {/* Range Explanation */}
          <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Warum eine Preisspanne?</p>
            <p>
              Die finale Summe hängt von Faktoren wie exaktem Volumen, Parkplatzsituation 
              und Zugänglichkeit ab. Nach einer kostenlosen Besichtigung erhalten Sie 
              ein verbindliches Angebot.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
