import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star } from "lucide-react";
import { track } from "@/utils/track";
import { cn } from "@/lib/utils";

type Package = {
  id: string;
  name: string;
  price: string;
  pricePerMonth?: string;
  features: string[];
  isBestseller?: boolean;
  isRecommended?: boolean;
  colorClass?: string;
};

type PackageCardProps = {
  packages: Package[];
  onSelectPackage?: (packageId: string) => void;
  preselectedPackage?: string;
};

/**
 * Package Cards mit Bestseller Highlighting
 * Kann als preselected markiert werden (z.B. fuer Pricing-Ads)
 */
export function PackageCards({
  packages,
  onSelectPackage,
  preselectedPackage,
}: PackageCardProps) {
  const handleSelect = (packageId: string, packageName: string) => {
    track("package_selected", { package_id: packageId, package_name: packageName });
    onSelectPackage?.(packageId);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {packages.map((pkg) => {
        const isPreselected = pkg.id === preselectedPackage;
        const isBestseller = pkg.isBestseller || pkg.isRecommended;

        return (
          <Card
            key={pkg.id}
            className={cn(
              "relative transition-all duration-300",
              isBestseller && "border-2 border-primary shadow-lg md:scale-105",
              isPreselected && "ring-2 ring-primary ring-offset-2"
            )}
          >
            {isBestseller && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 animate-pulse">
                  <Star className="h-4 w-4 fill-current" />
                  Bestseller
                </div>
              </div>
            )}

            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>

              <div className="mb-6">
                <div className="text-3xl font-bold text-primary">{pkg.price}</div>
                {pkg.pricePerMonth && (
                  <div className="text-sm text-muted-foreground mt-1">{pkg.pricePerMonth}</div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full",
                  isBestseller && "bg-primary hover:bg-primary/90",
                  isPreselected && "bg-green-600 hover:bg-green-700"
                )}
                size="lg"
                onClick={() => handleSelect(pkg.id, pkg.name)}
              >
                {isPreselected ? "Ausgewaehlt" : "Paket waehlen"}
              </Button>

              {isBestseller && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-xs text-center font-medium text-primary">
                    Meist gebucht - Bestes Preis-Leistungs-Verhaeltnis
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
