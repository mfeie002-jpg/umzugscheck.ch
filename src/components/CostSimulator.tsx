import { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  Home,
  Truck,
  Package,
  Clock
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

interface CostSimulatorProps {
  basePrice: number;
  currentPrice: number;
  rooms: number;
  distance: number;
  floor: number;
  hasLift: boolean;
  moveType: string;
  packing: boolean;
  assembly: boolean;
  storage: boolean;
}

const CostSimulator = ({
  basePrice,
  currentPrice,
  rooms,
  distance,
  floor,
  hasLift,
  moveType,
  packing,
  assembly,
  storage,
}: CostSimulatorProps) => {
  const { language } = useLanguage();

  const translations: Record<string, Record<string, string>> = {
    de: {
      title: "Kosten-Simulator",
      subtitle: "Sehen Sie wie verschiedene Optionen den Preis beeinflussen",
      priceImpact: "Preiseinfluss",
      savingPotential: "Sparpotenzial",
      basePrice: "Basispreis",
      rooms: "Zimmer",
      distance: "Distanz",
      floor: "Stockwerk",
      packing: "Packservice",
      assembly: "Montage",
      storage: "Lagerung",
      moveType: "Umzugsart",
      withLift: "Mit Lift sparen Sie",
      noLift: "Ohne Lift kostet extra",
      standardSaves: "Standard statt Express spart",
      expressCosts: "Express kostet extra",
      tips: "Spartipps",
      tip1: "Wählen Sie einen Werktag für günstigere Preise",
      tip2: "Vermeiden Sie Monatsende (höhere Nachfrage)",
      tip3: "Standard-Service ist oft ausreichend",
      costBreakdown: "Kostenaufteilung",
    },
    fr: {
      title: "Simulateur de coûts",
      subtitle: "Voyez comment les options affectent le prix",
      priceImpact: "Impact sur le prix",
      savingPotential: "Potentiel d'économie",
      basePrice: "Prix de base",
      rooms: "Pièces",
      distance: "Distance",
      floor: "Étage",
      packing: "Emballage",
      assembly: "Montage",
      storage: "Stockage",
      moveType: "Type",
      withLift: "Avec ascenseur vous économisez",
      noLift: "Sans ascenseur coûte en plus",
      standardSaves: "Standard au lieu d'Express économise",
      expressCosts: "Express coûte en plus",
      tips: "Conseils d'économie",
      tip1: "Choisissez un jour de semaine pour de meilleurs prix",
      tip2: "Évitez la fin du mois (forte demande)",
      tip3: "Le service standard est souvent suffisant",
      costBreakdown: "Répartition des coûts",
    },
    it: {
      title: "Simulatore di costi",
      subtitle: "Vedi come le opzioni influenzano il prezzo",
      priceImpact: "Impatto sul prezzo",
      savingPotential: "Potenziale di risparmio",
      basePrice: "Prezzo base",
      rooms: "Stanze",
      distance: "Distanza",
      floor: "Piano",
      packing: "Imballaggio",
      assembly: "Montaggio",
      storage: "Deposito",
      moveType: "Tipo",
      withLift: "Con ascensore risparmi",
      noLift: "Senza ascensore costa in più",
      standardSaves: "Standard invece di Express risparmia",
      expressCosts: "Express costa in più",
      tips: "Consigli per risparmiare",
      tip1: "Scegli un giorno feriale per prezzi migliori",
      tip2: "Evita fine mese (alta domanda)",
      tip3: "Il servizio standard è spesso sufficiente",
      costBreakdown: "Ripartizione dei costi",
    },
    en: {
      title: "Cost Simulator",
      subtitle: "See how different options affect the price",
      priceImpact: "Price Impact",
      savingPotential: "Saving Potential",
      basePrice: "Base Price",
      rooms: "Rooms",
      distance: "Distance",
      floor: "Floor",
      packing: "Packing",
      assembly: "Assembly",
      storage: "Storage",
      moveType: "Move Type",
      withLift: "With elevator you save",
      noLift: "Without elevator costs extra",
      standardSaves: "Standard instead of Express saves",
      expressCosts: "Express costs extra",
      tips: "Saving Tips",
      tip1: "Choose a weekday for better prices",
      tip2: "Avoid month-end (high demand)",
      tip3: "Standard service is often sufficient",
      costBreakdown: "Cost Breakdown",
    },
  };

  const t = translations[language] || translations.de;

  // Calculate individual cost impacts
  const costBreakdown = useMemo(() => {
    const roomsCost = rooms * 400;
    const distanceCost = distance * 2;
    const floorCost = !hasLift ? floor * 100 : 0;
    const packingCost = packing ? 500 : 0;
    const assemblyCost = assembly ? 300 : 0;
    const storageCost = storage ? 200 : 0;
    
    let typeCost = 0;
    if (moveType === "express") typeCost = Math.round((basePrice + roomsCost + distanceCost) * 0.3);
    if (moveType === "premium") typeCost = Math.round((basePrice + roomsCost + distanceCost) * 0.5);

    return [
      { name: t.basePrice, value: basePrice, icon: Home, color: "#1e3a5f" },
      { name: t.rooms, value: roomsCost, icon: Home, color: "#2563eb" },
      { name: t.distance, value: distanceCost, icon: Truck, color: "#059669" },
      { name: t.floor, value: floorCost, icon: ArrowUp, color: "#d97706" },
      { name: t.packing, value: packingCost, icon: Package, color: "#7c3aed" },
      { name: t.assembly, value: assemblyCost, icon: Package, color: "#db2777" },
      { name: t.storage, value: storageCost, icon: Package, color: "#0891b2" },
      { name: t.moveType, value: typeCost, icon: Clock, color: "#dc2626" },
    ].filter(item => item.value > 0);
  }, [rooms, distance, floor, hasLift, packing, assembly, storage, moveType, basePrice, t]);

  // Calculate savings scenarios
  const savingsScenarios = useMemo(() => {
    const scenarios = [];
    
    // Lift savings
    if (!hasLift && floor > 0) {
      scenarios.push({
        label: t.noLift,
        amount: floor * 100,
        type: "cost",
      });
    } else if (hasLift && floor > 0) {
      scenarios.push({
        label: t.withLift,
        amount: floor * 100,
        type: "saving",
      });
    }

    // Move type savings
    if (moveType === "express") {
      scenarios.push({
        label: t.expressCosts,
        amount: Math.round(basePrice * 0.3),
        type: "cost",
      });
    } else if (moveType === "premium") {
      scenarios.push({
        label: t.expressCosts,
        amount: Math.round(basePrice * 0.5),
        type: "cost",
      });
    } else {
      scenarios.push({
        label: t.standardSaves,
        amount: Math.round(basePrice * 0.3),
        type: "saving",
      });
    }

    return scenarios;
  }, [hasLift, floor, moveType, basePrice, t]);

  // Price progression data for area chart
  const priceProgressionData = useMemo(() => {
    let cumulative = 0;
    return costBreakdown.map((item) => {
      cumulative += item.value;
      return {
        name: item.name,
        value: item.value,
        cumulative,
      };
    });
  }, [costBreakdown]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-alpine" />
        <div>
          <h3 className="font-semibold">{t.title}</h3>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      {/* Cost Breakdown Bar Chart */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">{t.costBreakdown}</p>
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
              <Tooltip
                formatter={(value: number) => [`CHF ${value.toLocaleString("de-CH")}`, ""]}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Price Chart */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">{t.priceImpact}</p>
        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceProgressionData}>
              <defs>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-45} textAnchor="end" height={40} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}`} />
              <Tooltip
                formatter={(value: number) => [`CHF ${value.toLocaleString("de-CH")}`, ""]}
                contentStyle={{ fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#1e3a5f"
                fill="url(#colorCumulative)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings/Costs Indicators */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">{t.savingPotential}</p>
        <div className="space-y-2">
          {savingsScenarios.map((scenario, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-2 rounded-lg flex items-center justify-between ${
                scenario.type === "saving"
                  ? "bg-green-50 dark:bg-green-900/20"
                  : "bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="flex items-center gap-2">
                {scenario.type === "saving" ? (
                  <ArrowDown className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowUp className="h-4 w-4 text-red-600" />
                )}
                <span className="text-xs">{scenario.label}</span>
              </div>
              <span
                className={`text-sm font-bold ${
                  scenario.type === "saving" ? "text-green-600" : "text-red-600"
                }`}
              >
                {scenario.type === "saving" ? "-" : "+"}CHF {scenario.amount}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="p-3 bg-alpine/5 rounded-lg space-y-1">
        <p className="text-xs font-medium text-alpine">💡 {t.tips}</p>
        <ul className="text-xs text-muted-foreground space-y-0.5">
          <li>• {t.tip1}</li>
          <li>• {t.tip2}</li>
          <li>• {t.tip3}</li>
        </ul>
      </div>
    </div>
  );
};

export default CostSimulator;
