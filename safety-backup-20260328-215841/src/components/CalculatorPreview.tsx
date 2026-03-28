import { Link } from "react-router-dom";
import { Calculator, ArrowRight, Home, Building2, Globe } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import AnimatedSection from "./AnimatedSection";

const moveTypes = [
  { icon: Home, label: "Privatumzug", price: "ab CHF 600" },
  { icon: Building2, label: "Büroumzug", price: "ab CHF 1'500" },
  { icon: Globe, label: "International", price: "ab CHF 3'000" }
];

export default function CalculatorPreview() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full mb-4">
              Kostenrechner
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
              Was kostet Ihr <span className="text-gradient">Umzug?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Erhalten Sie in wenigen Minuten eine unverbindliche Kostenschätzung 
              für Ihren Umzug. Transparent und ohne versteckte Kosten.
            </p>

            <div className="space-y-4 mb-8">
              {moveTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-alpine/10 flex items-center justify-center">
                      <type.icon className="w-5 h-5 text-alpine" />
                    </div>
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <span className="text-alpine font-semibold">{type.price}</span>
                </div>
              ))}
            </div>

            <Link to="/calculator">
              <Button size="lg" className="min-h-[52px]">
                <Calculator className="mr-2 h-5 w-5" />
                Jetzt berechnen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <Card className="p-8 bg-gradient-hero text-primary-foreground">
              <div className="text-center">
                <Calculator className="h-16 w-16 mx-auto mb-6 opacity-90" />
                <h3 className="text-2xl font-bold mb-4">Interaktiver Kostenrechner</h3>
                <p className="opacity-90 mb-6">
                  Geben Sie Ihre Umzugsdetails ein und erhalten Sie sofort eine 
                  realistische Kostenschätzung basierend auf über 10'000 durchgeführten Umzügen.
                </p>
                <ul className="text-left space-y-2 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Echtzeit-Preisberechnung
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    PDF-Export möglich
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Verschiedene Pakete vergleichen
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Unverbindlich & kostenlos
                  </li>
                </ul>
                <Link to="/calculator" className="block">
                  <Button variant="secondary" size="lg" className="w-full">
                    Zum Rechner
                  </Button>
                </Link>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
