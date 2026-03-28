import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Truck, Package, Paintbrush, Archive, Wrench, 
  ShieldCheck, Clock, Users, CheckCircle 
} from "lucide-react";

interface ServicePrice {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  basePrice: number;
  unit: string;
  popular?: boolean;
  includes: string[];
}

interface CompanyServicePricingProps {
  companyName: string;
  priceLevel: 'günstig' | 'fair' | 'premium';
}

const services: ServicePrice[] = [
  {
    id: "standard",
    name: "Standard Umzug",
    description: "Kompletter Umzugsservice mit Transport und Trägern",
    icon: <Truck className="h-5 w-5" />,
    basePrice: 120,
    unit: "pro Stunde",
    popular: true,
    includes: ["2 Träger", "Transporter", "Grundversicherung", "Möbelschutz"]
  },
  {
    id: "packservice",
    name: "Packservice",
    description: "Professionelles Ein- und Auspacken Ihrer Gegenstände",
    icon: <Package className="h-5 w-5" />,
    basePrice: 45,
    unit: "pro Stunde",
    includes: ["Verpackungsmaterial", "Beschriftung", "Fachpersonal"]
  },
  {
    id: "cleaning",
    name: "Endreinigung",
    description: "Professionelle Reinigung der alten Wohnung",
    icon: <Paintbrush className="h-5 w-5" />,
    basePrice: 35,
    unit: "pro m²",
    includes: ["Abnahmegarantie", "Reinigungsmittel", "Nachkontrolle"]
  },
  {
    id: "storage",
    name: "Einlagerung",
    description: "Sichere Lagerung Ihrer Möbel und Gegenstände",
    icon: <Archive className="h-5 w-5" />,
    basePrice: 89,
    unit: "pro m³/Monat",
    includes: ["Klimakontrolle", "24h Zugang", "Versicherung"]
  },
  {
    id: "assembly",
    name: "Möbelmontage",
    description: "Ab- und Aufbau von Möbeln durch Fachpersonal",
    icon: <Wrench className="h-5 w-5" />,
    basePrice: 55,
    unit: "pro Stunde",
    includes: ["Werkzeug", "Ersatzteile", "Garantie"]
  }
];

export const CompanyServicePricing = ({
  companyName,
  priceLevel
}: CompanyServicePricingProps) => {
  const getPriceMultiplier = () => {
    switch (priceLevel) {
      case 'günstig': return 0.85;
      case 'premium': return 1.25;
      default: return 1;
    }
  };

  const multiplier = getPriceMultiplier();

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Preisübersicht</CardTitle>
          <Badge variant="outline" className="capitalize">
            {priceLevel} Preissegment
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Richtwerte von {companyName} • Finales Angebot nach Besichtigung
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service) => {
          const adjustedPrice = Math.round(service.basePrice * multiplier);
          
          return (
            <div
              key={service.id}
              className={`p-4 rounded-lg border transition-colors hover:border-primary/50 ${
                service.popular ? 'border-primary/30 bg-primary/5' : 'border-border/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${service.popular ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
                    {service.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{service.name}</h4>
                      {service.popular && (
                        <Badge variant="secondary" className="text-xs">Beliebt</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    CHF {adjustedPrice}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {service.unit}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {service.includes.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span>Alle Preise inkl. MwSt. • Kostenlose Beratung</span>
          </div>
          <Button className="w-full">
            Individuelles Angebot anfordern
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyServicePricing;
