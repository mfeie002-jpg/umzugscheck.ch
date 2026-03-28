import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Package, Sparkles, Check, ArrowRight, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface ServicePackageRecommendationsProps {
  rooms?: number;
  budget?: string;
}

const packages = [
  {
    id: "basic",
    name: "Basis",
    description: "Transport & Grundservice",
    services: ["Transport", "Be-/Entladen", "Grundversicherung"],
    priceRange: "Ab CHF 600",
    savings: null,
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    description: "Kompletter Umzugsservice",
    services: ["Transport", "Be-/Entladen", "Möbelschutz", "Demontage/Montage", "Versicherung Plus"],
    priceRange: "Ab CHF 950",
    savings: "15% günstiger als Einzelbuchung",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Rundum-Sorglos-Paket",
    services: ["Transport", "Be-/Entladen", "Vollverpackung", "Demontage/Montage", "Endreinigung", "Vollkasko", "Koordination"],
    priceRange: "Ab CHF 1'450",
    savings: "25% günstiger als Einzelbuchung",
    popular: false,
  },
];

const ServicePackageRecommendations = ({ rooms = 3, budget = "standard" }: ServicePackageRecommendationsProps) => {
  const [selectedPackage, setSelectedPackage] = useState(budget);

  const recommendedPackage = rooms <= 2 ? "basic" : rooms <= 4 ? "standard" : "premium";

  return (
    <Card className="border-2 bg-white shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="w-5 h-5 text-primary" />
          Service-Pakete
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Basierend auf Ihrem Umzug empfehlen wir Ihnen
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage} className="space-y-3">
          {packages.map(pkg => {
            const isRecommended = pkg.id === recommendedPackage;
            const isSelected = pkg.id === selectedPackage;
            
            return (
              <div 
                key={pkg.id}
                className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {isRecommended && (
                  <Badge className="absolute -top-2 right-3 bg-accent text-accent-foreground">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Empfohlen
                  </Badge>
                )}
                {pkg.popular && !isRecommended && (
                  <Badge className="absolute -top-2 right-3 bg-blue-500">
                    <Star className="w-3 h-3 mr-1" />
                    Beliebt
                  </Badge>
                )}
                
                <div className="flex items-start gap-3">
                  <RadioGroupItem value={pkg.id} id={pkg.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={pkg.id} className="text-base font-semibold cursor-pointer">
                      {pkg.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {pkg.services.map(service => (
                        <Badge key={service} variant="secondary" className="text-xs font-normal">
                          <Check className="w-3 h-3 mr-1" />
                          {service}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-semibold text-primary">{pkg.priceRange}</span>
                      {pkg.savings && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {pkg.savings}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </RadioGroup>

        <Link to={`/umzugsofferten?package=${selectedPackage}`}>
          <Button className="w-full bg-primary hover:bg-primary-dark">
            Mit {packages.find(p => p.id === selectedPackage)?.name}-Paket fortfahren
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ServicePackageRecommendations;
