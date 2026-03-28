import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calculator, CheckCircle2 } from "lucide-react";

interface RatgeberConversionRailProps {
  variant?: "inline" | "sidebar" | "bottom";
  title?: string;
  description?: string;
}

export const RatgeberConversionRail = ({
  variant = "inline",
  title = "Bereit für Ihren Umzug?",
  description = "Vergleichen Sie jetzt kostenlos Offerten von geprüften Umzugsfirmen."
}: RatgeberConversionRailProps) => {
  if (variant === "sidebar") {
    return (
      <Card className="sticky top-24 border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Kostenlos & unverbindlich
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                3-5 Offerten in 24h
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Bis zu 40% sparen
              </li>
            </ul>
            <Link to="/umzugsofferten" className="block">
              <Button className="w-full">
                Kostenlos Offerten erhalten
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "bottom") {
    return (
      <section className="py-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl my-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzugsofferten">
                <Button size="lg" className="w-full sm:w-auto">
                  Kostenlos Offerten erhalten
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/umzugsfirmen">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Firmen vergleichen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default inline variant
  return (
    <div className="my-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Link to="/umzugsofferten">
          <Button className="flex-shrink-0">
            Jetzt Offerten erhalten
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
