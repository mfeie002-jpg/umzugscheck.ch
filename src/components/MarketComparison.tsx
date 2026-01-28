import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Info, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MarketComparisonProps {
  estimatedPrice: number;
  rooms: number;
  distance: number;
  moveType: string;
}

// Average market prices in CHF based on Swiss moving industry data
const marketData = {
  baseRates: {
    zurich: { perRoom: 450, perKm: 2.5 },
    bern: { perRoom: 420, perKm: 2.3 },
    basel: { perRoom: 430, perKm: 2.4 },
    geneva: { perRoom: 480, perKm: 2.8 },
    average: { perRoom: 440, perKm: 2.5 },
  },
  basePrice: 750,
  expressMultiplier: 1.35,
  premiumMultiplier: 1.55,
};

const MarketComparison = ({ estimatedPrice, rooms, distance, moveType }: MarketComparisonProps) => {
  const { language } = useLanguage();

  const translations: Record<string, Record<string, string>> = {
    de: {
      title: "Marktvergleich Schweiz",
      yourEstimate: "Ihre Schätzung",
      marketAverage: "Marktdurchschnitt",
      difference: "Differenz",
      belowAverage: "unter Durchschnitt",
      aboveAverage: "über Durchschnitt",
      atAverage: "im Durchschnitt",
      savings: "Sie sparen",
      extra: "Mehrkosten",
      disclaimer: "Basierend auf Durchschnittspreisen Schweizer Umzugsfirmen 2024",
      zurich: "Zürich",
      bern: "Bern",
      basel: "Basel",
      geneva: "Genf",
      regionPrices: "Regionale Preise",
    },
    fr: {
      title: "Comparaison du marché suisse",
      yourEstimate: "Votre estimation",
      marketAverage: "Moyenne du marché",
      difference: "Différence",
      belowAverage: "sous la moyenne",
      aboveAverage: "au-dessus de la moyenne",
      atAverage: "dans la moyenne",
      savings: "Vous économisez",
      extra: "Coût supplémentaire",
      disclaimer: "Basé sur les prix moyens des déménageurs suisses 2024",
      zurich: "Zurich",
      bern: "Berne",
      basel: "Bâle",
      geneva: "Genève",
      regionPrices: "Prix régionaux",
    },
    it: {
      title: "Confronto mercato svizzero",
      yourEstimate: "La tua stima",
      marketAverage: "Media di mercato",
      difference: "Differenza",
      belowAverage: "sotto la media",
      aboveAverage: "sopra la media",
      atAverage: "nella media",
      savings: "Risparmi",
      extra: "Costo aggiuntivo",
      disclaimer: "Basato sui prezzi medi dei traslocatori svizzeri 2024",
      zurich: "Zurigo",
      bern: "Berna",
      basel: "Basilea",
      geneva: "Ginevra",
      regionPrices: "Prezzi regionali",
    },
    en: {
      title: "Swiss Market Comparison",
      yourEstimate: "Your Estimate",
      marketAverage: "Market Average",
      difference: "Difference",
      belowAverage: "below average",
      aboveAverage: "above average",
      atAverage: "at average",
      savings: "You save",
      extra: "Extra cost",
      disclaimer: "Based on average Swiss moving company prices 2024",
      zurich: "Zurich",
      bern: "Bern",
      basel: "Basel",
      geneva: "Geneva",
      regionPrices: "Regional Prices",
    },
  };

  const t = translations[language] || translations.de;

  const calculateMarketPrice = (region: keyof typeof marketData.baseRates) => {
    const rates = marketData.baseRates[region];
    let baseCalc = marketData.basePrice + (rooms * rates.perRoom) + (distance * rates.perKm);
    
    if (moveType === "express") {
      baseCalc *= marketData.expressMultiplier;
    } else if (moveType === "premium") {
      baseCalc *= marketData.premiumMultiplier;
    }
    
    return Math.round(baseCalc);
  };

  const marketPrices = useMemo(() => ({
    zurich: calculateMarketPrice("zurich"),
    bern: calculateMarketPrice("bern"),
    basel: calculateMarketPrice("basel"),
    geneva: calculateMarketPrice("geneva"),
    average: calculateMarketPrice("average"),
  }), [rooms, distance, moveType]);

  const difference = estimatedPrice - marketPrices.average;
  const percentDiff = Math.round((difference / marketPrices.average) * 100);
  const isBelow = difference < -50;
  const isAbove = difference > 50;

  const getComparisonStatus = () => {
    if (isBelow) return { icon: TrendingDown, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" };
    if (isAbove) return { icon: TrendingUp, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" };
    return { icon: Minus, color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30" };
  };

  const status = getComparisonStatus();
  const StatusIcon = status.icon;

  const regionNames: Record<string, string> = {
    zurich: t.zurich,
    bern: t.bern,
    basel: t.basel,
    geneva: t.geneva,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-alpine" />
          <h3 className="font-semibold">{t.title}</h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{t.disclaimer}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main Comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-alpine/10 text-center">
          <p className="text-xs text-muted-foreground mb-1">{t.yourEstimate}</p>
          <p className="text-xl font-bold text-alpine">CHF {estimatedPrice.toLocaleString("de-CH")}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted text-center">
          <p className="text-xs text-muted-foreground mb-1">{t.marketAverage}</p>
          <p className="text-xl font-bold">CHF {marketPrices.average.toLocaleString("de-CH")}</p>
        </div>
      </div>

      {/* Difference Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-3 rounded-lg ${status.bg} flex items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-5 w-5 ${status.color}`} />
          <span className="text-sm font-medium">
            {isBelow ? t.belowAverage : isAbove ? t.aboveAverage : t.atAverage}
          </span>
        </div>
        <div className="text-right">
          <span className={`text-lg font-bold ${status.color}`}>
            {difference > 0 ? "+" : ""}{difference.toLocaleString("de-CH")} CHF
          </span>
          <span className="text-xs text-muted-foreground block">
            ({percentDiff > 0 ? "+" : ""}{percentDiff}%)
          </span>
        </div>
      </motion.div>

      {/* Regional Prices */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {t.regionPrices}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(["zurich", "bern", "basel", "geneva"] as const).map((region) => {
            const regionPrice = marketPrices[region];
            const regionDiff = estimatedPrice - regionPrice;
            const isLower = regionDiff < 0;
            
            return (
              <div
                key={region}
                className="p-2 rounded-lg border bg-background text-xs flex justify-between items-center"
              >
                <span className="text-muted-foreground">{regionNames[region]}</span>
                <div className="text-right">
                  <span className="font-medium">CHF {regionPrice.toLocaleString("de-CH")}</span>
                  <span className={`block text-[10px] ${isLower ? "text-green-600" : "text-red-600"}`}>
                    {regionDiff > 0 ? "+" : ""}{regionDiff}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketComparison;
