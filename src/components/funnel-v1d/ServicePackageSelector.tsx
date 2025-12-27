/**
 * V1.d Service Package Selector
 * 
 * Simplified 3-package model (Audit #4):
 * - "Selbst packen" (Basic)
 * - "Einpacken lassen" (Comfort)
 * - "Rundum-Sorglos" (Premium)
 * 
 * No dual selection confusion - one clear choice.
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Sparkles, Crown, Check, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ServicePackage {
  id: string;
  label: string;
  description: string;
  services: string[];
  priceRange: string;
  icon: React.ReactNode;
  popular?: boolean;
  recommended?: boolean;
}

const packages: ServicePackage[] = [
  {
    id: "basic",
    label: "Selbst packen",
    description: "Transport durch Profis, Sie packen selbst",
    services: ["umzug"],
    priceRange: "Ab CHF 480",
    icon: <Package className="w-5 h-5" />,
  },
  {
    id: "comfort",
    label: "Einpacken lassen",
    description: "Wir übernehmen das Packen für Sie",
    services: ["umzug", "einpacken", "auspacken"],
    priceRange: "Ab CHF 780",
    icon: <Sparkles className="w-5 h-5" />,
    popular: true,
  },
  {
    id: "premium",
    label: "Rundum-Sorglos",
    description: "Alles inklusive – Sie heben keinen Finger",
    services: ["umzug", "einpacken", "auspacken", "reinigung"],
    priceRange: "Ab CHF 1'280",
    icon: <Crown className="w-5 h-5" />,
    recommended: true,
  },
];

const addOns = [
  { id: "entsorgung", label: "Entsorgung", price: "+CHF 150–300" },
  { id: "lagerung", label: "Zwischenlagerung", price: "+CHF 100–200/Mt" },
];

interface ServicePackageSelectorProps {
  selectedPackage: string;
  selectedAddOns: string[];
  onPackageChange: (packageId: string, services: string[]) => void;
  onAddOnToggle: (addOnId: string) => void;
}

export const ServicePackageSelector = memo(function ServicePackageSelector({
  selectedPackage,
  selectedAddOns,
  onPackageChange,
  onAddOnToggle,
}: ServicePackageSelectorProps) {
  const [showAddOns, setShowAddOns] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold">Wie viel möchten Sie selbst machen?</label>
      </div>

      <div className="space-y-2">
        {packages.map((pkg) => {
          const isSelected = selectedPackage === pkg.id;
          
          return (
            <motion.button
              key={pkg.id}
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onPackageChange(pkg.id, pkg.services)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                {pkg.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{pkg.label}</p>
                  {pkg.popular && (
                    <Badge variant="secondary" className="text-[9px] py-0">
                      Beliebt
                    </Badge>
                  )}
                  {pkg.recommended && (
                    <Badge className="text-[9px] py-0 bg-secondary text-secondary-foreground">
                      Empfohlen
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">{pkg.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-primary">{pkg.priceRange}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Add-ons (Optional) */}
      <button
        type="button"
        onClick={() => setShowAddOns(!showAddOns)}
        className="w-full flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {showAddOns ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" />
            Add-ons ausblenden
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            Add-ons hinzufügen (optional)
          </>
        )}
      </button>

      <AnimatePresence>
        {showAddOns && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-2"
          >
            {addOns.map((addOn) => {
              const isSelected = selectedAddOns.includes(addOn.id);
              
              return (
                <button
                  key={addOn.id}
                  type="button"
                  onClick={() => onAddOnToggle(addOn.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "border-primary/50 bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                    </div>
                    <span className="text-sm">{addOn.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{addOn.price}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
