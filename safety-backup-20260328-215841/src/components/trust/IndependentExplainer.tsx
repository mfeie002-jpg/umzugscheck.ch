import { Scale, Users, TrendingDown, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const IndependentExplainer = () => {
  return (
    <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Scale className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">100% Unabhängiger Vergleich</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Umzugscheck.ch ist komplett unabhängig und nicht an einzelne Umzugsfirmen gebunden. 
              Wir verdienen unser Geld ausschliesslich durch faire Vermittlungsgebühren – 
              nie durch Bevorzugung bestimmter Anbieter.
            </p>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <span>Keine versteckten Gebühren für Sie als Kunde</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-accent" />
                </div>
                <span>Objektive Bewertungen von echten Kunden</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-4 h-4 text-accent" />
                </div>
                <span>Durchschnittlich 30-40% Kostenersparnis durch Vergleich</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
