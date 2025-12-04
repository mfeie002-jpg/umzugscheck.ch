import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, TrendingUp } from "lucide-react";

const districts = [
  { name: "Bern Altstadt", companies: 8, avgPrice: "CHF 890", popular: true },
  { name: "Köniz", companies: 6, avgPrice: "CHF 750", popular: false },
  { name: "Thun", companies: 5, avgPrice: "CHF 720", popular: true },
  { name: "Biel/Bienne", companies: 5, avgPrice: "CHF 680", popular: false },
  { name: "Burgdorf", companies: 3, avgPrice: "CHF 650", popular: false },
  { name: "Langenthal", companies: 3, avgPrice: "CHF 620", popular: false },
];

export const BernInteractiveMap = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  return (
    <Card className="border-2 border-primary/10">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Regionen im Kanton Bern</h3>
        <div className="grid grid-cols-2 gap-2">
          {districts.map((district) => (
            <button
              key={district.name}
              onClick={() => setSelectedDistrict(district.name === selectedDistrict ? null : district.name)}
              className={`p-3 rounded-lg text-left transition-all ${
                selectedDistrict === district.name
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-muted/50 hover:bg-muted border-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{district.name}</span>
                {district.popular && <Badge variant="secondary" className="text-xs">Beliebt</Badge>}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {district.companies}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {district.avgPrice}
                </span>
              </div>
            </button>
          ))}
        </div>
        {selectedDistrict && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{selectedDistrict}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {districts.find(d => d.name === selectedDistrict)?.companies} Umzugsfirmen verfügbar. 
              Durchschnittspreis: {districts.find(d => d.name === selectedDistrict)?.avgPrice}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
