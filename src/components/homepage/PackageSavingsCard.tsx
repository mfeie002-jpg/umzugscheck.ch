import { memo } from "react";
import { motion } from "framer-motion";
import { Package, Sparkles, TrendingDown, CheckCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  label: string;
  priceAdd: number;
  bookingPercent?: number;
}

interface PackageSavingsCardProps {
  services: Service[];
  selectedServices: string[];
  onSelectPackage: (serviceIds: string[]) => void;
}

// Package definitions
const packages = [
  {
    id: "basic",
    name: "Basis",
    services: ["umzug"],
    discount: 0,
    description: "Nur Transport",
    icon: "📦",
    stress: 4, // 1-5
  },
  {
    id: "comfort",
    name: "Komfort",
    services: ["umzug", "einpacken"],
    discount: 10,
    description: "Transport + Einpacken",
    icon: "🎁",
    stress: 3,
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    services: ["umzug", "einpacken", "auspacken"],
    discount: 15,
    description: "Transport + Ein- & Auspacken",
    icon: "⭐",
    stress: 2,
  },
  {
    id: "rundum",
    name: "Rundum-Sorglos",
    services: ["umzug", "einpacken", "auspacken", "reinigung"],
    discount: 20,
    description: "Alles inklusive",
    icon: "🏆",
    stress: 1,
    bestDeal: true,
  },
];

export const PackageSavingsCard = memo(function PackageSavingsCard({
  services,
  selectedServices,
  onSelectPackage,
}: PackageSavingsCardProps) {
  // Calculate total price for current selection
  const calculatePackagePrice = (packageServices: string[]) => {
    return packageServices.reduce((sum, sId) => {
      const service = services.find((s) => s.id === sId);
      return sum + (service?.priceAdd || 0);
    }, 0);
  };

  // Check if a package matches current selection
  const isPackageSelected = (pkg: typeof packages[0]) => {
    return (
      pkg.services.length === selectedServices.length &&
      pkg.services.every((s) => selectedServices.includes(s))
    );
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-xl p-3 border border-primary/20">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Package className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-bold">Paketrabatte nutzen</p>
          <p className="text-[10px] text-muted-foreground">Je mehr Services, desto mehr sparen!</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {packages.map((pkg) => {
          const price = calculatePackagePrice(pkg.services);
          const originalPrice = pkg.discount > 0 ? Math.round(price / (1 - pkg.discount / 100)) : price;
          const savings = originalPrice - price;
          const isSelected = isPackageSelected(pkg);

          return (
            <motion.button
              key={pkg.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPackage(pkg.services)}
              className={`relative p-2.5 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? "border-secondary bg-secondary/10"
                  : pkg.bestDeal
                  ? "border-amber-400/50 bg-amber-50/50 dark:bg-amber-950/20 hover:border-amber-400"
                  : "border-border hover:border-primary/30 bg-card"
              }`}
            >
              {/* Best Deal Badge */}
              {pkg.bestDeal && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="text-[7px] px-1.5 py-0.5 bg-amber-500 text-white border-0">
                    🏆 Bester Deal
                  </Badge>
                </div>
              )}

              {/* Popular Badge */}
              {pkg.popular && !pkg.bestDeal && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="text-[7px] px-1.5 py-0.5 bg-secondary text-secondary-foreground border-0">
                    Beliebt
                  </Badge>
                </div>
              )}

              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{pkg.icon}</span>
                <span className="text-[10px] font-bold">{pkg.name}</span>
                {isSelected && <CheckCircle className="w-3 h-3 text-secondary ml-auto" />}
              </div>

              <p className="text-[8px] text-muted-foreground mb-1.5">{pkg.description}</p>

              {/* Stress Level */}
              <div className="flex items-center gap-1 mb-1.5">
                <span className="text-[8px] text-muted-foreground">Stress:</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-2 h-2 rounded-full ${
                        level <= pkg.stress
                          ? pkg.stress <= 2
                            ? "bg-green-400"
                            : pkg.stress <= 3
                            ? "bg-yellow-400"
                            : "bg-red-400"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Price & Savings */}
              {pkg.discount > 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400">
                    -{pkg.discount}%
                  </span>
                  <span className="text-[8px] text-muted-foreground line-through">
                    +CHF {originalPrice}
                  </span>
                  <span className="text-[9px] font-bold text-primary">+CHF {price}</span>
                </div>
              ) : (
                <span className="text-[9px] font-medium text-muted-foreground">Inkl. Basis</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Booking Stats */}
      <div className="mt-3 pt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>
            <strong>73%</strong> buchen mit Einpackservice · <strong>45%</strong> mit Reinigung
          </span>
        </div>
      </div>
    </div>
  );
});
