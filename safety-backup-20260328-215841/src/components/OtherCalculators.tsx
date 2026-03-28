import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calculator, Sparkles, Trash2, Package, Wrench, Box, Settings, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalculatorItem {
  icon: any;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

const calculators: CalculatorItem[] = [
  {
    icon: Calculator,
    title: "Umzugsrechner",
    description: "Berechnen Sie Ihre kompletten Umzugskosten",
    href: "/rechner"
  },
  {
    icon: Sparkles,
    title: "Reinigungsrechner",
    description: "Kosten für Endreinigung kalkulieren",
    href: "/rechner/reinigung",
    badge: "Bald"
  },
  {
    icon: Trash2,
    title: "Entsorgungsrechner",
    description: "Entsorgungskosten ermitteln",
    href: "/rechner/entsorgung",
    badge: "Bald"
  },
  {
    icon: Box,
    title: "Lagerrechner",
    description: "Lagerkosten berechnen",
    href: "/rechner/lager",
    badge: "Bald"
  },
  {
    icon: Package,
    title: "Packservice",
    description: "Packservice-Kosten kalkulieren",
    href: "/rechner/packservice",
    badge: "Bald"
  },
  {
    icon: Wrench,
    title: "Möbelmontage",
    description: "Montagekosten berechnen",
    href: "/rechner/moebelmontage",
    badge: "Bald"
  }
];

interface OtherCalculatorsProps {
  currentPath?: string;
  title?: string;
  description?: string;
}

export const OtherCalculators = ({ 
  currentPath, 
  title = "Weitere Rechner",
  description = "Planen Sie Ihren Umzug komplett – von der Reinigung bis zur Entsorgung"
}: OtherCalculatorsProps) => {
  const filteredCalculators = calculators.filter(calc => calc.href !== currentPath);

  return (
    <section className="py-16 md:py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCalculators.map((calc, index) => (
              <Link
                key={index}
                to={calc.href}
                className="group"
              >
                <Card className={cn(
                  "h-full transition-all duration-300 hover:shadow-strong hover:-translate-y-1",
                  "border-2 hover:border-primary/30"
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <calc.icon className="w-7 h-7 text-primary" />
                      </div>
                      {calc.badge && (
                        <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-full bg-accent/10 text-accent">
                          {calc.badge}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                      {calc.title}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {calc.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Konfigurator Teaser */}
          <div className="mt-8">
            <Link to="/rechner/konfigurator">
              <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5 hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex w-16 h-16 rounded-xl bg-accent/10 items-center justify-center mb-4">
                    <Settings className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Gesamtpreis-Konfigurator</h3>
                  <p className="text-muted-foreground mb-4">
                    Kombinieren Sie alle Services und erhalten Sie ein komplettes Angebot für Ihren Umzug
                  </p>
                  <span className="inline-flex items-center gap-2 text-accent font-semibold group">
                    Zum Konfigurator
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
