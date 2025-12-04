import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Minus } from "lucide-react";

const services = [
  { name: "Transport & Verladung", basic: true, standard: true, premium: true },
  { name: "Ein- & Auspacken", basic: false, standard: true, premium: true },
  { name: "Möbelmontage", basic: false, standard: true, premium: true },
  { name: "Verpackungsmaterial", basic: false, standard: "inkl.", premium: "Premium" },
  { name: "Versicherung", basic: "Basis", standard: "Erweitert", premium: "Vollkasko" },
  { name: "Parkbewilligung", basic: false, standard: true, premium: true },
  { name: "Endreinigung", basic: false, standard: false, premium: true },
  { name: "Entsorgung Altmöbel", basic: false, standard: false, premium: true },
  { name: "Einlagerung", basic: false, standard: "Optional", premium: "30 Tage inkl." },
  { name: "Persönlicher Berater", basic: false, standard: false, premium: true },
];

const packages = [
  { name: "Basic", price: "ab CHF 590", color: "bg-muted", description: "Nur Transport" },
  { name: "Standard", price: "ab CHF 1'290", color: "bg-primary/10", description: "Beliebteste Wahl", popular: true },
  { name: "Premium", price: "ab CHF 2'490", color: "bg-accent/10", description: "Rundum-Sorglos" },
];

const renderValue = (value: boolean | string) => {
  if (value === true) return <Check className="h-5 w-5 text-success mx-auto" />;
  if (value === false) return <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />;
  return <span className="text-sm text-center block">{value}</span>;
};

export const ZuerichServiceComparison = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Umzugspakete vergleichen</h2>
          <p className="text-muted-foreground">Wählen Sie das passende Paket für Ihren Umzug in Zürich</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl mx-auto">
            <thead>
              <tr>
                <th className="text-left p-3"></th>
                {packages.map((pkg) => (
                  <th key={pkg.name} className="p-3 text-center min-w-[140px]">
                    <Card className={`${pkg.color} border-2 ${pkg.popular ? "border-primary" : "border-transparent"}`}>
                      <CardContent className="p-4">
                        {pkg.popular && (
                          <Badge className="mb-2 bg-primary">Beliebt</Badge>
                        )}
                        <h3 className="font-bold text-lg">{pkg.name}</h3>
                        <p className="text-xl font-bold text-primary mt-1">{pkg.price}</p>
                        <p className="text-xs text-muted-foreground mt-1">{pkg.description}</p>
                      </CardContent>
                    </Card>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((service, i) => (
                <tr key={service.name} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                  <td className="p-3 text-sm font-medium">{service.name}</td>
                  <td className="p-3">{renderValue(service.basic)}</td>
                  <td className="p-3">{renderValue(service.standard)}</td>
                  <td className="p-3">{renderValue(service.premium)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
