import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Sun, 
  Cloud, 
  Snowflake,
  Leaf,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MonthData {
  month: string;
  shortMonth: string;
  demand: 'low' | 'medium' | 'high' | 'peak';
  priceIndex: number;
  season: 'winter' | 'spring' | 'summer' | 'fall';
  tip: string;
}

const monthlyData: MonthData[] = [
  { month: 'Januar', shortMonth: 'Jan', demand: 'low', priceIndex: 85, season: 'winter', tip: 'Günstigste Zeit für Umzüge' },
  { month: 'Februar', shortMonth: 'Feb', demand: 'low', priceIndex: 88, season: 'winter', tip: 'Gute Verfügbarkeit' },
  { month: 'März', shortMonth: 'Mär', demand: 'medium', priceIndex: 95, season: 'spring', tip: 'Früh buchen empfohlen' },
  { month: 'April', shortMonth: 'Apr', demand: 'high', priceIndex: 105, season: 'spring', tip: 'Kündigungstermine beachten' },
  { month: 'Mai', shortMonth: 'Mai', demand: 'peak', priceIndex: 115, season: 'spring', tip: 'Höchste Nachfrage' },
  { month: 'Juni', shortMonth: 'Jun', demand: 'peak', priceIndex: 120, season: 'summer', tip: 'Mindestens 6 Wochen vorher buchen' },
  { month: 'Juli', shortMonth: 'Jul', demand: 'high', priceIndex: 110, season: 'summer', tip: 'Sommerhitze beachten' },
  { month: 'August', shortMonth: 'Aug', demand: 'high', priceIndex: 108, season: 'summer', tip: 'Ferienzeit berücksichtigen' },
  { month: 'September', shortMonth: 'Sep', demand: 'high', priceIndex: 112, season: 'fall', tip: 'Kündigungstermine 30.9.' },
  { month: 'Oktober', shortMonth: 'Okt', demand: 'medium', priceIndex: 100, season: 'fall', tip: 'Gutes Preis-Leistungs-Verhältnis' },
  { month: 'November', shortMonth: 'Nov', demand: 'low', priceIndex: 90, season: 'fall', tip: 'Günstige Preise' },
  { month: 'Dezember', shortMonth: 'Dez', demand: 'low', priceIndex: 82, season: 'winter', tip: 'Weihnachtszeit beachten' },
];

const currentMonth = new Date().getMonth();

export const SeasonalInsights = () => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'peak': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const getDemandLabel = (demand: string) => {
    switch (demand) {
      case 'low': return 'Niedrig';
      case 'medium': return 'Mittel';
      case 'high': return 'Hoch';
      case 'peak': return 'Spitze';
      default: return '';
    }
  };

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'winter': return <Snowflake className="h-4 w-4 text-blue-400" />;
      case 'spring': return <Leaf className="h-4 w-4 text-green-500" />;
      case 'summer': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'fall': return <Cloud className="h-4 w-4 text-orange-400" />;
      default: return null;
    }
  };

  const selectedData = monthlyData[selectedMonth];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Saisonale Preisübersicht
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Preisindex basiert auf historischen Daten (100 = Durchschnitt)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Monthly Chart */}
        <div className="flex items-end gap-1 h-32 mb-6">
          {monthlyData.map((data, index) => {
            const height = (data.priceIndex / 120) * 100;
            const isSelected = index === selectedMonth;
            const isCurrent = index === currentMonth;
            
            return (
              <TooltipProvider key={data.month}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => setSelectedMonth(index)}
                      className={`flex-1 rounded-t transition-all ${
                        isSelected ? 'ring-2 ring-primary' : ''
                      } ${getDemandColor(data.demand)}`}
                      style={{ height: `${height}%` }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isCurrent && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                          <Badge variant="outline" className="text-[10px] px-1">
                            Jetzt
                          </Badge>
                        </div>
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <div className="font-semibold">{data.month}</div>
                      <div className="text-sm">Index: {data.priceIndex}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        {/* Month Labels */}
        <div className="flex gap-1 mb-6">
          {monthlyData.map((data, index) => (
            <div 
              key={data.shortMonth}
              className={`flex-1 text-center text-xs ${
                index === selectedMonth ? 'font-bold text-primary' : 'text-muted-foreground'
              }`}
            >
              {data.shortMonth}
            </div>
          ))}
        </div>

        {/* Selected Month Details */}
        <motion.div
          key={selectedMonth}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-muted/50 rounded-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getSeasonIcon(selectedData.season)}
              <span className="font-semibold">{selectedData.month}</span>
            </div>
            <Badge className={getDemandColor(selectedData.demand)}>
              {getDemandLabel(selectedData.demand)} Nachfrage
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-sm text-muted-foreground">Preisindex</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{selectedData.priceIndex}</span>
                {selectedData.priceIndex > 100 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">vs. Durchschnitt</div>
              <div className={`text-2xl font-bold ${
                selectedData.priceIndex > 100 ? 'text-red-500' : 'text-green-500'
              }`}>
                {selectedData.priceIndex > 100 ? '+' : ''}
                {selectedData.priceIndex - 100}%
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-sm">{selectedData.tip}</p>
          </div>
        </motion.div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>Niedrig</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span>Mittel</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span>Hoch</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span>Spitze</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
