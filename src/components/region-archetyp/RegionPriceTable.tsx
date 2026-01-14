import { memo } from "react";
import { motion } from "framer-motion";
import { Info, TrendingUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PriceMatrix {
  small: { min: number; max: number; label: string };
  medium: { min: number; max: number; label: string };
  large: { min: number; max: number; label: string };
}

interface RegionPriceTableProps {
  prices: PriceMatrix;
  regionName: string;
  priceCoefficient: number;
}

export const RegionPriceTable = memo(({ prices, regionName, priceCoefficient }: RegionPriceTableProps) => {
  const priceRows = [
    { ...prices.small, key: 'small' },
    { ...prices.medium, key: 'medium' },
    { ...prices.large, key: 'large' },
  ];

  const formatPrice = (price: number) => {
    return `CHF ${price.toLocaleString('de-CH')}.-`;
  };

  const getPriceLabel = () => {
    if (priceCoefficient >= 1.15) return { text: 'Städtische Preise', color: 'text-orange-600' };
    if (priceCoefficient >= 1.05) return { text: 'Leicht über Durchschnitt', color: 'text-yellow-600' };
    if (priceCoefficient <= 0.95) return { text: 'Günstige Region', color: 'text-green-600' };
    return { text: 'Durchschnittspreise', color: 'text-primary' };
  };

  const priceLabel = getPriceLabel();

  return (
    <section className="py-10 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Was kostet ein Umzug in {regionName}?
          </h2>
          <p className="text-muted-foreground mb-4">
            Aktuelle Richtpreise für Umzüge in {regionName} und Umgebung
          </p>
          <div className={`inline-flex items-center gap-2 ${priceLabel.color} text-sm font-medium`}>
            <TrendingUp className="w-4 h-4" />
            {priceLabel.text}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-card rounded-xl border border-border overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-2 bg-muted/50 p-4 border-b">
            <div className="font-semibold">Wohnungsgrösse</div>
            <div className="font-semibold text-right">Preisspanne</div>
          </div>

          {/* Table Rows */}
          {priceRows.map((row, index) => (
            <div
              key={row.key}
              className={`grid grid-cols-2 p-4 ${index < priceRows.length - 1 ? 'border-b' : ''}`}
            >
              <div className="text-foreground">{row.label}</div>
              <div className="text-right font-semibold text-primary">
                {formatPrice(row.min)} – {formatPrice(row.max)}
              </div>
            </div>
          ))}

          {/* Disclaimer */}
          <div className="p-4 bg-muted/30 text-xs text-muted-foreground flex items-start gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Preise basieren auf Durchschnittswerten für {regionName}. 
                    Tatsächliche Kosten können je nach Entfernung, Stockwerk und Services variieren.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>
              Richtwerte für Umzüge in {regionName}. Inkl. Transport, Auf-/Abladen. 
              Für ein exaktes Angebot fordern Sie kostenlos Offerten an.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

RegionPriceTable.displayName = 'RegionPriceTable';
