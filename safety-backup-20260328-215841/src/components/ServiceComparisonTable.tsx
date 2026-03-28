import { Check, X, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ComparisonFeature {
  name: string;
  description?: string;
}

interface ServiceOption {
  name: string;
  price: string;
  description: string;
  features: Record<string, boolean | string | null>;
  recommended?: boolean;
  ctaLink: string;
}

interface ServiceComparisonTableProps {
  title: string;
  subtitle?: string;
  features: ComparisonFeature[];
  services: ServiceOption[];
  className?: string;
}

export const ServiceComparisonTable = ({
  title,
  subtitle,
  features,
  services,
  className,
}: ServiceComparisonTableProps) => {
  const renderValue = (value: boolean | string | null) => {
    if (value === true) {
      return <Check className="h-5 w-5 text-green-600 mx-auto" />;
    }
    if (value === false) {
      return <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />;
    }
    if (value === null) {
      return <Minus className="h-4 w-4 text-muted-foreground/50 mx-auto" />;
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>

      {/* Mobile view - Cards */}
      <div className="md:hidden space-y-4">
        {services.map((service, idx) => (
          <Card
            key={idx}
            className={cn(
              service.recommended && "border-primary border-2 relative"
            )}
          >
            {service.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                Empfohlen
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <div className="text-2xl font-bold text-primary">{service.price}</div>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm">{feature.name}</span>
                  {renderValue(service.features[feature.name])}
                </div>
              ))}
              <Link to={service.ctaLink} className="block pt-2">
                <Button className="w-full" variant={service.recommended ? "default" : "outline"}>
                  Jetzt anfragen
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop view - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 bg-muted/50 rounded-tl-lg"></th>
              {services.map((service, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "p-4 text-center bg-muted/50",
                    idx === services.length - 1 && "rounded-tr-lg",
                    service.recommended && "bg-primary/10"
                  )}
                >
                  {service.recommended && (
                    <span className="block text-xs text-primary font-bold mb-1">
                      ★ Empfohlen
                    </span>
                  )}
                  <div className="font-bold text-lg">{service.name}</div>
                  <div className="text-2xl font-bold text-primary mt-1">{service.price}</div>
                  <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, fIdx) => (
              <tr key={fIdx} className="border-b border-border">
                <td className="p-4 text-sm font-medium">
                  {feature.name}
                  {feature.description && (
                    <p className="text-xs text-muted-foreground font-normal">{feature.description}</p>
                  )}
                </td>
                {services.map((service, sIdx) => (
                  <td
                    key={sIdx}
                    className={cn(
                      "p-4 text-center",
                      service.recommended && "bg-primary/5"
                    )}
                  >
                    {renderValue(service.features[feature.name])}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4"></td>
              {services.map((service, idx) => (
                <td key={idx} className={cn("p-4", service.recommended && "bg-primary/5")}>
                  <Link to={service.ctaLink}>
                    <Button className="w-full" variant={service.recommended ? "default" : "outline"}>
                      Jetzt anfragen
                    </Button>
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Pre-built comparison for moving services
export const MovingServiceComparison = () => {
  const features = [
    { name: "Transport" },
    { name: "Ein- & Ausladen" },
    { name: "Möbel ab-/aufbauen" },
    { name: "Kartons packen" },
    { name: "Verpackungsmaterial" },
    { name: "Reinigung alte Wohnung" },
    { name: "Entsorgung" },
    { name: "Versicherung" },
  ];

  const services = [
    {
      name: "Basic",
      price: "ab CHF 400",
      description: "Nur Transport",
      ctaLink: "/umzugsofferten",
      features: {
        "Transport": true,
        "Ein- & Ausladen": true,
        "Möbel ab-/aufbauen": false,
        "Kartons packen": false,
        "Verpackungsmaterial": false,
        "Reinigung alte Wohnung": false,
        "Entsorgung": false,
        "Versicherung": "Basis",
      },
    },
    {
      name: "Standard",
      price: "ab CHF 800",
      description: "Beliebteste Wahl",
      ctaLink: "/umzugsofferten",
      recommended: true,
      features: {
        "Transport": true,
        "Ein- & Ausladen": true,
        "Möbel ab-/aufbauen": true,
        "Kartons packen": false,
        "Verpackungsmaterial": "Auf Anfrage",
        "Reinigung alte Wohnung": false,
        "Entsorgung": "Optional",
        "Versicherung": "Erweitert",
      },
    },
    {
      name: "Premium",
      price: "ab CHF 1'500",
      description: "Full-Service",
      ctaLink: "/umzugsofferten",
      features: {
        "Transport": true,
        "Ein- & Ausladen": true,
        "Möbel ab-/aufbauen": true,
        "Kartons packen": true,
        "Verpackungsmaterial": true,
        "Reinigung alte Wohnung": true,
        "Entsorgung": true,
        "Versicherung": "Vollkasko",
      },
    },
  ];

  return (
    <ServiceComparisonTable
      title="Umzugsservices im Vergleich"
      subtitle="Finden Sie das passende Paket für Ihren Umzug"
      features={features}
      services={services}
    />
  );
};
