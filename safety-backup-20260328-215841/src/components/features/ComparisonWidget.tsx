import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  Star, 
  Shield, 
  Clock, 
  TrendingUp,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Company {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  priceRange: string;
  priceLevel: 'günstig' | 'fair' | 'premium';
  responseTime: string;
  insurance: string;
  features: {
    packing: boolean;
    furniture: boolean;
    cleaning: boolean;
    storage: boolean;
    international: boolean;
    weekend: boolean;
  };
  badge?: string;
}

const companies: Company[] = [
  {
    id: '1',
    name: 'SwissMove Pro',
    rating: 4.9,
    reviews: 342,
    priceRange: 'CHF 890 - 1\'200',
    priceLevel: 'fair',
    responseTime: '< 2 Std',
    insurance: 'CHF 100\'000',
    badge: 'Empfohlen',
    features: {
      packing: true,
      furniture: true,
      cleaning: true,
      storage: true,
      international: true,
      weekend: true
    }
  },
  {
    id: '2',
    name: 'Zürich Umzüge',
    rating: 4.7,
    reviews: 218,
    priceRange: 'CHF 750 - 980',
    priceLevel: 'günstig',
    responseTime: '< 4 Std',
    insurance: 'CHF 50\'000',
    badge: 'Günstigster',
    features: {
      packing: true,
      furniture: true,
      cleaning: false,
      storage: true,
      international: false,
      weekend: true
    }
  },
  {
    id: '3',
    name: 'Premium Relocations',
    rating: 5.0,
    reviews: 156,
    priceRange: 'CHF 1\'400 - 1\'800',
    priceLevel: 'premium',
    responseTime: '< 1 Std',
    insurance: 'CHF 200\'000',
    badge: 'Premium',
    features: {
      packing: true,
      furniture: true,
      cleaning: true,
      storage: true,
      international: true,
      weekend: true
    }
  }
];

const featureLabels: Record<string, string> = {
  packing: 'Packservice',
  furniture: 'Möbelmontage',
  cleaning: 'Reinigung',
  storage: 'Lagerung',
  international: 'International',
  weekend: 'Wochenende'
};

export const ComparisonWidget = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const toggleCompany = (id: string) => {
    setSelectedCompanies(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const getPriceLevelColor = (level: string) => {
    switch (level) {
      case 'günstig': return 'bg-green-500/10 text-green-600';
      case 'fair': return 'bg-blue-500/10 text-blue-600';
      case 'premium': return 'bg-purple-500/10 text-purple-600';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="flex items-center justify-between">
          <span>Live-Vergleich</span>
          <Badge variant="outline" className="font-normal">
            <TrendingUp className="h-3 w-3 mr-1" />
            3 Firmen gefunden
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left font-medium">Firma</th>
                {companies.map(company => (
                  <th key={company.id} className="p-4 text-center min-w-[180px]">
                    <div className="space-y-2">
                      {company.badge && (
                        <Badge className="mb-1">{company.badge}</Badge>
                      )}
                      <div className="font-semibold">{company.name}</div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{company.rating}</span>
                        <span className="text-muted-foreground text-sm">
                          ({company.reviews})
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price Row */}
              <tr className="border-b">
                <td className="p-4 font-medium">Preis</td>
                {companies.map(company => (
                  <td key={company.id} className="p-4 text-center">
                    <div className="font-bold text-lg">{company.priceRange}</div>
                    <Badge className={getPriceLevelColor(company.priceLevel)}>
                      {company.priceLevel}
                    </Badge>
                  </td>
                ))}
              </tr>

              {/* Response Time Row */}
              <tr className="border-b">
                <td className="p-4 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Antwortzeit
                  </div>
                </td>
                {companies.map(company => (
                  <td key={company.id} className="p-4 text-center">
                    {company.responseTime}
                  </td>
                ))}
              </tr>

              {/* Insurance Row */}
              <tr className="border-b">
                <td className="p-4 font-medium">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Versicherung
                  </div>
                </td>
                {companies.map(company => (
                  <td key={company.id} className="p-4 text-center">
                    {company.insurance}
                  </td>
                ))}
              </tr>

              {/* Features (expandable) */}
              {expanded && Object.keys(featureLabels).map(feature => (
                <tr key={feature} className="border-b">
                  <td className="p-4 font-medium">{featureLabels[feature]}</td>
                  {companies.map(company => (
                    <td key={company.id} className="p-4 text-center">
                      {company.features[feature as keyof typeof company.features] ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Action Row */}
              <tr>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded(!expanded)}
                    className="text-primary"
                  >
                    {expanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Weniger anzeigen
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Alle Services anzeigen
                      </>
                    )}
                  </Button>
                </td>
                {companies.map(company => (
                  <td key={company.id} className="p-4 text-center">
                    <Button 
                      size="sm"
                      className={selectedCompanies.includes(company.id) ? 'bg-green-500' : ''}
                      onClick={() => toggleCompany(company.id)}
                    >
                      {selectedCompanies.includes(company.id) ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Ausgewählt
                        </>
                      ) : (
                        'Auswählen'
                      )}
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {selectedCompanies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-primary/5 border-t"
          >
            <div className="flex items-center justify-between">
              <span>
                <strong>{selectedCompanies.length}</strong> Firma(en) ausgewählt
              </span>
              <Button>
                Offerten anfordern
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
