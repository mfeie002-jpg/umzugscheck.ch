import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";

const WasKostetEinUmzug = () => {
  return (
    <>
      <SEOHead
        title="Was kostet ein Umzug in der Schweiz 2025? | Umzugscheck.ch"
        description="Umfassender Ratgeber zu Umzugskosten in der Schweiz. Preise, Kostenfaktoren und Spartipps für Ihren Umzug 2025."
        canonical="https://umzugscheck.ch/ratgeber/was-kostet-ein-umzug"
      />
      
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Was kostet ein Umzug in der Schweiz?
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Umfassender Preisguide für 2025 – von der 1-Zimmer-Wohnung bis zum Einfamilienhaus. 
                  Verstehen Sie die Kostenfaktoren und sparen Sie bei Ihrem nächsten Umzug.
                </p>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto space-y-12">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Durchschnittliche Umzugskosten in der Schweiz</h2>
                  <p className="text-muted-foreground mb-8">
                    Die Kosten für einen Umzug in der Schweiz variieren stark je nach Umfang, 
                    Distanz und zusätzlichen Services. Hier finden Sie realistische Richtwerte für 2025:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>1-2 Zimmer Wohnung</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary mb-2">
                          CHF 1000–2000
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Durchschnitt: CHF 1500
                        </p>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>Bis 30m³ Volumen</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>Lokaler Umzug</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>Ohne Zusatzleistungen</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>3-4 Zimmer Wohnung</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary mb-2">
                          CHF 2000–3500
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Durchschnitt: CHF 2750
                        </p>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>30-50m³ Volumen</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>Mittlere Distanz</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>Standardservice</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Einfamilienhaus</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary mb-2">
                          CHF 3500–6000+
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Durchschnitt: CHF 4500
                        </p>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>50-80m³ Volumen</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>Längere Distanz möglich</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>Oft mit Zusatzleistungen</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Firmenumzug</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary mb-2">
                          CHF 2500–10000+
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Je nach Bürogrösse
                        </p>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>Variabel nach Umfang</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>IT-Equipment-Handling</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>Oft am Wochenende/Abend</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-6">Was beeinflusst die Umzugskosten?</h2>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Volumen des Hausrats
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Je mehr Sie umziehen, desto höher die Kosten. Das Volumen wird in Kubikmetern (m³) gemessen. 
                          Als Faustregel gilt: Pro Zimmer rechnet man mit ca. 10-15m³.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Distanz
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Lokale Umzüge innerhalb einer Stadt sind günstiger als Fernumzüge über mehrere Kantone. 
                          Ab 100km Distanz steigen die Kosten deutlich.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Stockwerke & Lift
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Jedes zusätzliche Stockwerk ohne Lift erhöht den Aufwand. Umzüge in den 4. Stock ohne Lift 
                          können 30-40% teurer sein als Erdgeschoss mit Lift.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Zusatzleistungen
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-3">
                          Services wie Einpacken, Montage, Reinigung oder Entsorgung erhöhen die Kosten:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>Einpackservice: +CHF 500-1500</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>Endreinigung: +CHF 300-800</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>Möbelmontage: +CHF 200-600</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>Entsorgung: +CHF 150-500</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Zeitpunkt
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Sommer (Mai-September) ist Hochsaison. Monatsende und Wochenenden sind teurer. 
                          Unter der Woche im Winter können Sie bis zu 20% sparen.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-6 h-6 text-primary" />
                      Spartipps für Ihren Umzug
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span><strong>Vergleichen Sie Offerten:</strong> Holen Sie mindestens 3-5 Angebote ein</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span><strong>Ausmisten:</strong> Je weniger Sie umziehen, desto günstiger wird es</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span><strong>Nebensaison nutzen:</strong> Winter und unter der Woche sind günstiger</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span><strong>Selbst packen:</strong> Kartons selbst packen spart 500-1500 CHF</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span><strong>Frühzeitig buchen:</strong> Last-Minute-Umzüge sind oft teurer</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center pt-8">
                  <Card className="inline-block border-primary/20 bg-primary/5">
                    <CardContent className="p-8">
                      <Calculator className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-4">
                        Berechnen Sie Ihre Umzugskosten
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Nutzen Sie unseren kostenlosen Rechner für eine präzise Schätzung
                      </p>
                      <Link to="/rechner/umzugskosten">
                        <Button size="lg">
                          Zum Kostenrechner
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default WasKostetEinUmzug;
