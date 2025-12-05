import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, MapPin } from "lucide-react";

interface PriceData {
  canton: string;
  price: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

const priceData: PriceData[] = [
  { canton: 'Zürich', price: 1850, change: 2.3, trend: 'up' },
  { canton: 'Bern', price: 1650, change: -1.5, trend: 'down' },
  { canton: 'Basel', price: 1720, change: 0.8, trend: 'up' },
  { canton: 'Luzern', price: 1480, change: 0, trend: 'stable' },
  { canton: 'Genf', price: 2100, change: 3.2, trend: 'up' },
  { canton: 'St. Gallen', price: 1380, change: -0.5, trend: 'down' },
  { canton: 'Aargau', price: 1520, change: 1.1, trend: 'up' },
  { canton: 'Wallis', price: 1290, change: -2.1, trend: 'down' },
];

export const PriceTicker = () => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-green-500" />;
      default: return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-500';
      case 'down': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="w-full bg-muted/30 border-y border-border/50 py-2 overflow-hidden">
      <motion.div
        className="flex gap-8"
        animate={{ x: [0, -1920] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {[...priceData, ...priceData].map((item, index) => (
          <div key={index} className="flex items-center gap-2 whitespace-nowrap">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-sm">{item.canton}</span>
            <span className="text-sm">CHF {item.price.toLocaleString()}</span>
            <div className={`flex items-center gap-1 ${getTrendColor(item.trend)}`}>
              {getTrendIcon(item.trend)}
              <span className="text-xs">
                {item.change > 0 ? '+' : ''}{item.change}%
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
