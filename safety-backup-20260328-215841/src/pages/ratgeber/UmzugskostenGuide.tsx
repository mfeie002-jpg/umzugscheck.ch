import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, TrendingDown, Home, Truck, 
  Sparkles, Package, ArrowRight, Info, BookOpen, Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { RatgeberConversionRail } from "@/components/RatgeberConversionRail";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

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

const tableOfContents = [
  { id: "preise", label: "Preisübersicht" },
  { id: "faktoren", label: "Kostenfaktoren" },
  { id: "spartipps", label: "Spartipps" },
];

export default function UmzugskostenGuide() {
  return (
    <>
      <OptimizedSEO
        title="Umzugskosten Schweiz 2025 | Preise & Spartipps | Umzugscheck.ch"
        description="Was kostet ein Umzug in der Schweiz? Aktuelle Preisübersicht für 1-5 Zimmer Wohnungen, Kostenfaktoren und Spartipps. Jetzt informieren und bis zu 40% sparen."
        canonicalUrl="https://www.umzugscheck.ch/ratgeber/umzugskosten/"
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
              <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
                Transparente Preisübersicht, Kostenfaktoren und praktische Tipps, um bei Ihrem Umzug bis zu 40% zu sparen.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-white/70 mb-8">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  5 Min. Lesezeit
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  Aktualisiert: Dez 2024
                </span>
              </div>
              <Link to="/umzugsofferten">
                <Button size="lg" variant="secondary">
                  Kostenlose Offerten vergleichen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Table of Contents */}
              <Card className="mb-8">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                    Inhaltsverzeichnis
                  </h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-primary hover:underline"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>

              {/* Price Table */}
              <section id="preise" className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Umzugskosten nach Wohnungsgrösse
                </h2>
                <p className="text-muted-foreground mb-6">
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
              </section>

              {/* Mid-article CTA */}
              <RatgeberConversionRail 
                variant="inline"
                title="Jetzt Preise vergleichen"
                description="Erhalten Sie in 2 Minuten unverbindliche Offerten von geprüften Firmen."
              />

              {/* Cost Factors */}
              <section id="faktoren" className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Was beeinflusst die Umzugskosten?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Diese Faktoren bestimmen den Endpreis Ihres Umzugs
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {costFactors.map((factor, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-5 flex items-start gap-4">
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
              </section>

              {/* Saving Tips */}
              <section id="spartipps" className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingDown className="w-8 h-8 text-green-500" />
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    So sparen Sie beim Umzug
                  </h2>
                </div>
                <p className="text-muted-foreground mb-6">
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
              </section>

              {/* Related Guides */}
              <section className="mb-12">
                <h3 className="font-bold text-lg mb-4">Weitere Ratgeber</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link to="/ratgeber/checkliste">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                      <CardContent className="p-4">
                        <div className="font-medium">Umzugscheckliste</div>
                        <p className="text-sm text-muted-foreground">Alle wichtigen Schritte für Ihren Umzug</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link to="/ratgeber/tipps">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                      <CardContent className="p-4">
                        <div className="font-medium">Umzugstipps</div>
                        <p className="text-sm text-muted-foreground">Praktische Tipps von Experten</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </section>

              {/* Bottom CTA */}
              <RatgeberConversionRail variant="bottom" />
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <RatgeberConversionRail variant="sidebar" />
            </aside>
          </div>
        </div>

        {/* Sticky Mobile CTA */}
        <StickyMobileCTA />
      </div>
    </>
  );
}
