import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Package, Truck, Crown } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import AnimatedSection from "./AnimatedSection";

const packages = [
  {
    name: "Basic",
    subtitle: "Do-it-yourself",
    price: "ab CHF 600",
    description: "Sie packen, wir transportieren",
    features: [
      "Transport mit Profis",
      "Versicherungsschutz",
      "Fachgerechte Beladung",
      "Möbelschutz inklusive"
    ],
    href: "/plan/basic",
    icon: Package,
    popular: false
  },
  {
    name: "Comfort",
    subtitle: "Bestseller",
    price: "ab CHF 1'200",
    description: "Das perfekte Mittelpaket",
    features: [
      "Alles aus Basic",
      "Ein- und Auspacken auf Wunsch",
      "Möbelmontage",
      "Entsorgung Verpackungsmaterial"
    ],
    href: "/plan/half",
    icon: Truck,
    popular: true
  },
  {
    name: "Premium",
    subtitle: "Rundum sorglos",
    price: "ab CHF 2'500",
    description: "Wir übernehmen alles",
    features: [
      "Alles aus Comfort",
      "Komplettes Einpacken",
      "Reinigung alte Wohnung",
      "Persönlicher Umzugsberater"
    ],
    href: "/plan/full",
    icon: Crown,
    popular: false
  }
];

export default function PackagesOverview() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full mb-4">
            Pakete
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
            Das passende Paket für <span className="text-gradient">jeden Bedarf</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Wählen Sie den Serviceumfang, der am besten zu Ihnen passt
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {packages.map((pkg, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <Card className={`p-6 h-full flex flex-col relative ${pkg.popular ? 'border-alpine border-2 shadow-lg' : ''}`}>
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-alpine text-alpine-foreground rounded-full">
                    Beliebt
                  </span>
                )}
                
                <div className="text-center mb-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${pkg.popular ? 'bg-alpine text-alpine-foreground' : 'bg-alpine/10'}`}>
                    <pkg.icon className={`w-7 h-7 ${pkg.popular ? '' : 'text-alpine'}`} />
                  </div>
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground">{pkg.subtitle}</p>
                </div>

                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-alpine">{pkg.price}</p>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-alpine flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={pkg.href}>
                  <Button 
                    variant={pkg.popular ? "default" : "outline"} 
                    className="w-full"
                  >
                    Mehr erfahren
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="text-center">
          <Link to="/plan/compare" className="inline-flex items-center text-alpine font-medium hover:underline">
            Alle Pakete im Detail vergleichen
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
