import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star } from "lucide-react";

const services = [
  { name: "Standard Umzug", price: "Ab CHF 490", features: [true, true, false, false, false], rating: 4.2, popular: false },
  { name: "Comfort Umzug", price: "Ab CHF 890", features: [true, true, true, false, false], rating: 4.5, popular: true },
  { name: "Premium Umzug", price: "Ab CHF 1'290", features: [true, true, true, true, true], rating: 4.8, popular: false },
];

const featureLabels = ["Transport", "Möbelschutz", "Ein-/Auspacken", "Reinigung", "Möbelmontage"];

export const BernServiceComparison = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Service-Pakete vergleichen</h2>
        <p className="text-muted-foreground">Finden Sie das passende Paket für Ihren Umzug in Bern</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {services.map((service, i) => (
          <Card key={i} className={`relative ${service.popular ? 'border-2 border-primary shadow-lg' : ''}`}>
            {service.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Beliebt</Badge>
            )}
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
              <div className="flex items-center gap-1 mb-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{service.rating}</span>
              </div>
              <p className="text-2xl font-bold text-primary mb-4">{service.price}</p>
              <ul className="space-y-2">
                {featureLabels.map((label, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    {service.features[j] ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={service.features[j] ? '' : 'text-muted-foreground'}>{label}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);
