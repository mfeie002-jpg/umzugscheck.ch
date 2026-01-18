import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Clock, Percent, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useFlowPath } from "@/hooks/useUnifiedAB";

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  companyName: string;
  code?: string;
}

const SEASONAL_DEALS: Deal[] = [
  {
    id: "1",
    title: "Winter-Spezial",
    description: "15% Rabatt auf alle Umzüge im Januar",
    discount: "15%",
    validUntil: "31.01.2025",
    companyName: "ZüriMove AG",
    code: "WINTER15",
  },
  {
    id: "2",
    title: "Neukunden-Bonus",
    description: "CHF 100 Rabatt für Erstanfragen",
    discount: "CHF 100",
    validUntil: "28.02.2025",
    companyName: "Mehrere Firmen",
  },
  {
    id: "3",
    title: "Kombi-Angebot",
    description: "Umzug + Reinigung zum Paketpreis",
    discount: "20%",
    validUntil: "15.01.2025",
    companyName: "BernExpress",
    code: "KOMBI20",
  },
];

export const SeasonalDealsWidget = () => {
  const flowPath = useFlowPath();
  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Gift className="h-5 w-5 text-amber-600" />
          Aktuelle Angebote
          <Badge variant="secondary" className="ml-auto bg-amber-100 text-amber-700">
            <Sparkles className="h-3 w-3 mr-1" />
            Limitiert
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {SEASONAL_DEALS.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg bg-white border border-amber-100 hover:border-amber-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-amber-500 hover:bg-amber-600">
                    <Percent className="h-3 w-3 mr-1" />
                    {deal.discount}
                  </Badge>
                  <span className="text-sm font-semibold">{deal.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{deal.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{deal.companyName}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Bis {deal.validUntil}
                  </span>
                </div>
                {deal.code && (
                  <div className="mt-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      Code: {deal.code}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        <Link to={flowPath}>
          <Button variant="outline" className="w-full mt-2 border-amber-300 hover:bg-amber-50">
            Alle Angebote ansehen
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SeasonalDealsWidget;
