import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Truck, Clock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PackageComparisonProps {
  currentType: string;
  onSelect: (type: string) => void;
  basePrice: number;
}

const packages = [
  {
    id: "standard",
    name: "Standard",
    description: "Perfekt für flexible Terminplanung",
    icon: Truck,
    multiplier: 1,
    badge: "Beliebt",
    badgeColor: "bg-blue-500",
    features: [
      { name: "Transport & Möbel", included: true },
      { name: "Professionelles Team", included: true },
      { name: "Basis-Versicherung", included: true },
      { name: "Flexible Termine", included: true },
      { name: "Express-Termine", included: false },
      { name: "Persönlicher Manager", included: false },
      { name: "White-Glove Service", included: false },
      { name: "Premium-Versicherung", included: false },
    ],
  },
  {
    id: "express",
    name: "Express",
    description: "Für kurzfristige Umzüge",
    icon: Clock,
    multiplier: 1.3,
    badge: "Empfohlen",
    badgeColor: "bg-alpine",
    features: [
      { name: "Transport & Möbel", included: true },
      { name: "Professionelles Team", included: true },
      { name: "Basis-Versicherung", included: true },
      { name: "Flexible Termine", included: true },
      { name: "Express-Termine", included: true },
      { name: "Persönlicher Manager", included: false },
      { name: "White-Glove Service", included: false },
      { name: "Premium-Versicherung", included: true },
    ],
  },
  {
    id: "premium",
    name: "Premium VIP",
    description: "Rundum-Sorglos-Paket",
    icon: Sparkles,
    multiplier: 1.5,
    badge: "VIP",
    badgeColor: "bg-gradient-to-r from-amber-500 to-orange-500",
    features: [
      { name: "Transport & Möbel", included: true },
      { name: "Professionelles Team", included: true },
      { name: "Basis-Versicherung", included: true },
      { name: "Flexible Termine", included: true },
      { name: "Express-Termine", included: true },
      { name: "Persönlicher Manager", included: true },
      { name: "White-Glove Service", included: true },
      { name: "Premium-Versicherung", included: true },
    ],
  },
];

const PackageComparison = ({ currentType, onSelect, basePrice }: PackageComparisonProps) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {packages.map((pkg, index) => {
          const Icon = pkg.icon;
          const isSelected = currentType === pkg.id;
          const price = Math.round(basePrice * pkg.multiplier);
          
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "relative p-5 cursor-pointer transition-all h-full",
                  isSelected 
                    ? "border-2 border-alpine shadow-lg shadow-alpine/20 bg-alpine/5" 
                    : "border-2 hover:border-alpine/30"
                )}
                onClick={() => onSelect(pkg.id)}
              >
                {/* Badge */}
                <Badge className={cn("absolute -top-2.5 left-1/2 -translate-x-1/2", pkg.badgeColor)}>
                  {pkg.badge}
                </Badge>
                
                {/* Header */}
                <div className="text-center mb-4 pt-2">
                  <div className={cn(
                    "w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3",
                    isSelected ? "bg-alpine text-white" : "bg-muted"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </div>
                
                {/* Price */}
                <div className="text-center mb-4 p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-alpine">
                    CHF {price.toLocaleString('de-CH')}
                  </div>
                  {pkg.multiplier > 1 && (
                    <div className="text-xs text-muted-foreground">
                      +{Math.round((pkg.multiplier - 1) * 100)}% zum Basispreis
                    </div>
                  )}
                </div>
                
                {/* Features */}
                <ul className="space-y-2 mb-4">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={cn(!feature.included && "text-muted-foreground/50")}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                {/* Select Button */}
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className={cn("w-full", isSelected && "bg-alpine hover:bg-alpine/90")}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(pkg.id);
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Ausgewählt
                    </>
                  ) : (
                    "Auswählen"
                  )}
                </Button>
                
                {/* Selected indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-alpine text-white rounded-full p-1.5"
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Comparison hint */}
      <p className="text-center text-sm text-muted-foreground">
        Klicken Sie auf ein Paket um es auszuwählen. Der Preis wird automatisch angepasst.
      </p>
    </div>
  );
};

export default PackageComparison;
