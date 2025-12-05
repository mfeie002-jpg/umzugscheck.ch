import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PriceFactor {
  name: string;
  impact: "increase" | "decrease" | "neutral";
  description: string;
}

interface PriceFactorsProps {
  factors: PriceFactor[];
}

export const PriceFactors = ({ factors }: PriceFactorsProps) => {
  const getIcon = (impact: PriceFactor["impact"]) => {
    switch (impact) {
      case "increase":
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case "decrease":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getColor = (impact: PriceFactor["impact"]) => {
    switch (impact) {
      case "increase":
        return "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950";
      case "decrease":
        return "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950";
      default:
        return "border-border bg-muted/30";
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        Preisfaktoren
      </h3>
      <div className="grid gap-2">
        {factors.map((factor, index) => (
          <motion.div
            key={factor.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-start gap-3 p-3 rounded-lg border ${getColor(factor.impact)}`}
          >
            <div className="mt-0.5">{getIcon(factor.impact)}</div>
            <div>
              <p className="font-medium text-sm">{factor.name}</p>
              <p className="text-xs text-muted-foreground">{factor.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Example usage helper
export const getDefaultPriceFactors = (data: {
  hasElevator?: boolean;
  floor?: number;
  distance?: number;
  weekend?: boolean;
  monthEnd?: boolean;
}): PriceFactor[] => {
  const factors: PriceFactor[] = [];

  if (data.hasElevator) {
    factors.push({
      name: "Lift vorhanden",
      impact: "decrease",
      description: "Reduziert den Zeitaufwand erheblich"
    });
  } else if (data.floor && data.floor > 2) {
    factors.push({
      name: `${data.floor}. Stock ohne Lift`,
      impact: "increase",
      description: "Erhöhter Zeitaufwand für Möbeltransport"
    });
  }

  if (data.distance && data.distance > 50) {
    factors.push({
      name: "Längere Distanz",
      impact: "increase",
      description: `${data.distance} km erfordert mehr Fahrzeit`
    });
  } else if (data.distance && data.distance < 20) {
    factors.push({
      name: "Kurze Distanz",
      impact: "decrease",
      description: "Lokaler Umzug spart Fahrkosten"
    });
  }

  if (data.weekend) {
    factors.push({
      name: "Wochenend-Zuschlag",
      impact: "increase",
      description: "Sa/So-Termine sind teurer"
    });
  }

  if (data.monthEnd) {
    factors.push({
      name: "Monatsende",
      impact: "increase",
      description: "Hohe Nachfrage = höhere Preise"
    });
  }

  return factors;
};
