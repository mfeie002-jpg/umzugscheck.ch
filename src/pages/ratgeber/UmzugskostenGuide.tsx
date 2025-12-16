import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, TrendingDown, Home, Truck, 
  Sparkles, Package, ArrowRight, Info
} from "lucide-react";
import { Link } from "react-router-dom";

const priceExamples = [
  { size: "1-Zimmer", local: "CHF 400–600", longDistance: "CHF 800–1'200" },
  { size: "2-Zimmer", local: "CHF 600–900", longDistance: "CHF 1'200–1'800" },
  { size: "3-Zimmer", local: "CHF 900–1'400", longDistance: "CHF 1'600–2'500" },
  { size: "4-Zimmer", local: "CHF 1'200–1'800", longDistance: "CHF 2'200–3'500" },
  { size: "5+ Zimmer / Haus", local: "CHF 1'800–3'000", longDistance: "CHF 3'500–6'000" },
];

const costFactors = [
  { icon: Home, title: "Wohnungsgrösse", description: "Mehr Zimmer = mehr Aufwand und Material" },
  { icon: Truck, title: "Distanz", description: "Lokale Umzüge sind günstiger als Langstrecken" },
  { icon: Package, title: "Möbelmenge", description: "Je mehr Möbel, desto höher die Kosten" },
  { icon: Sparkles, title: "Zusatzservices", description: "Reinigung, Montage, Entsorgung kosten extra" },
];

const savingTips = [
  "Entrümpeln Sie vor dem Umzug – weniger Volumen = weniger Kosten",
  "Vergleichen Sie mindestens 3 Offerten von verschiedenen Firmen",
  "Buchen Sie frühzeitig – Last-Minute-Umzüge sind teurer",
  "Wählen Sie einen Termin unter der Woche statt am Wochenende",
  "Packen Sie selbst ein, wenn Sie Zeit haben",
  "Nutzen Sie gebrauchte Umzugskartons",
];

export default function UmzugskostenGuide() {
  return (
    <>
      <OptimizedSEO
        title="Umzugskosten Schweiz 2025 | Preise & Spartipps | Umzugscheck.ch"
        description="Was kostet ein Umzug in der Schweiz? Aktuelle Preisübersicht für 1-5 Zimmer Wohnungen, Kostenfaktoren und Spartipps. Jetzt informieren und bis zu 40% sparen."
        canonicalUrl="https://www.umzugscheck.ch/umzugskosten-guide/"
      />
      
      <div className="min-h-screen bg-gradient-elegant">
        {/* Hero */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-95" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                <Calculator className="w-3 h-3 mr-1" />
                Preisübersicht 2025
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Was kostet ein Umzug in der Schweiz?
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Transparente Preisübersicht, Kostenfaktoren und praktische Tipps, um bei Ihrem Umzug bis zu 40% zu sparen.
              </p>
              <Link to="/umzugsofferten">
                <Button size="lg" variant="secondary">
                  Kostenlose Offerten vergleichen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Price Table */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Umzugskosten nach Wohnungsgrösse
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                Durchschnittliche Preise für professionelle Umzugsfirmen in der Schweiz (2025)
              </p>
              
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Wohnungsgrösse</th>
                        <th className="px-6 py-4 text-center font-semibold">Lokal (bis 30km)</th>
                        <th className="px-6 py-4 text-center font-semibold">Langstrecke (50km+)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceExamples.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                          <td className="px-6 py-4 font-medium">{row.size}</td>
                          <td className="px-6 py-4 text-center">{row.local}</td>
                          <td className="px-6 py-4 text-center">{row.longDistance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border-t flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Preise sind Richtwerte und können je nach Anbieter, Saison und Zusatzleistungen variieren.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Cost Factors */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Was beeinflusst die Umzugskosten?
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                Diese Faktoren bestimmen den Endpreis Ihres Umzugs
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {costFactors.map((factor, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <factor.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{factor.title}</h3>
                        <p className="text-sm text-muted-foreground">{factor.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Saving Tips */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 justify-center mb-4">
                <TrendingDown className="w-8 h-8 text-green-500" />
                <h2 className="text-2xl sm:text-3xl font-bold">
                  So sparen Sie beim Umzug
                </h2>
              </div>
              <p className="text-center text-muted-foreground mb-8">
                Mit diesen Tipps können Sie bis zu 40% der Umzugskosten einsparen
              </p>
              
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {savingTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-green-600">{idx + 1}</span>
                        </div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Jetzt exakte Preise erhalten
              </h2>
              <p className="text-muted-foreground mb-6">
                Vergleichen Sie kostenlos Offerten von geprüften Umzugsfirmen und finden Sie den besten Preis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/umzugsofferten">
                  <Button size="lg">
                    Offerten vergleichen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/umzugsrechner">
                  <Button size="lg" variant="outline">
                    <Calculator className="w-4 h-4 mr-2" />
                    Preisrechner nutzen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
