import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, ArrowRight, Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface QuoteOption {
  id: string;
  companyName: string;
  price: number;
  rating: number;
  features: {
    name: string;
    included: boolean;
  }[];
  recommended?: boolean;
}

interface QuoteComparisonTableProps {
  quotes?: QuoteOption[];
}

const DEFAULT_QUOTES: QuoteOption[] = [
  {
    id: "1",
    companyName: "Budget Move",
    price: 890,
    rating: 4.2,
    features: [
      { name: "Transport", included: true },
      { name: "Verpackung", included: false },
      { name: "Montage", included: false },
      { name: "Versicherung", included: true },
      { name: "Entsorgung", included: false },
    ],
  },
  {
    id: "2",
    companyName: "ZüriMove",
    price: 1290,
    rating: 4.7,
    recommended: true,
    features: [
      { name: "Transport", included: true },
      { name: "Verpackung", included: true },
      { name: "Montage", included: true },
      { name: "Versicherung", included: true },
      { name: "Entsorgung", included: false },
    ],
  },
  {
    id: "3",
    companyName: "Premium Umzüge",
    price: 1690,
    rating: 4.9,
    features: [
      { name: "Transport", included: true },
      { name: "Verpackung", included: true },
      { name: "Montage", included: true },
      { name: "Versicherung", included: true },
      { name: "Entsorgung", included: true },
    ],
  },
];

export const QuoteComparisonTable = ({ quotes = DEFAULT_QUOTES }: QuoteComparisonTableProps) => {
  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="pb-3 bg-muted/30">
        <CardTitle className="text-lg">Offerten im Vergleich</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-sm">Leistung</th>
                {quotes.map((quote) => (
                  <th key={quote.id} className="p-4 text-center min-w-[140px]">
                    <div className="space-y-2">
                      {quote.recommended && (
                        <Badge className="bg-primary">
                          <Crown className="h-3 w-3 mr-1" />
                          Empfohlen
                        </Badge>
                      )}
                      <p className="font-semibold">{quote.companyName}</p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm">{quote.rating}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price Row */}
              <tr className="border-b bg-primary/5">
                <td className="p-4 font-medium">Preis</td>
                {quotes.map((quote) => (
                  <td key={quote.id} className="p-4 text-center">
                    <span className="text-xl font-bold text-primary">
                      CHF {quote.price.toLocaleString()}
                    </span>
                  </td>
                ))}
              </tr>
              
              {/* Feature Rows */}
              {DEFAULT_QUOTES[0].features.map((feature, index) => (
                <tr key={feature.name} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                  <td className="p-4 text-sm">{feature.name}</td>
                  {quotes.map((quote) => (
                    <td key={quote.id} className="p-4 text-center">
                      {quote.features[index]?.included ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Action Row */}
              <tr className="border-t">
                <td className="p-4"></td>
                {quotes.map((quote) => (
                  <td key={quote.id} className="p-4 text-center">
                    <Link to="/umzugsofferten">
                      <Button 
                        size="sm" 
                        variant={quote.recommended ? "default" : "outline"}
                        className="w-full"
                      >
                        Auswählen
                      </Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteComparisonTable;
