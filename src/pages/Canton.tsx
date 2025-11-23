import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Star, MapPin, ArrowRight } from "lucide-react";

const CANTON_INFO: Record<string, {
  name: string;
  description: string;
  cities: string[];
  priceRange: { studio: string; twoRooms: string; threeRooms: string; house: string };
}> = {
  zuerich: {
    name: "Zürich",
    description: "Als grösster Kanton und Wirtschaftszentrum der Schweiz bietet Zürich eine breite Auswahl an Umzugsfirmen. Die Preise variieren je nach Stadtlage und Erreichbarkeit.",
    cities: ["Zürich", "Winterthur", "Uster", "Dietikon", "Wetzikon"],
    priceRange: {
      studio: "CHF 800-1'200",
      twoRooms: "CHF 1'200-1'800",
      threeRooms: "CHF 1'800-2'800",
      house: "CHF 3'500-6'000",
    },
  },
  bern: {
    name: "Bern",
    description: "Die Bundesstadt und ihr Umland bieten solide Umzugsdienstleistungen mit fairen Preisen. Viele Familienbetriebe mit langjähriger Erfahrung.",
    cities: ["Bern", "Köniz", "Ostermundigen", "Burgdorf", "Steffisburg"],
    priceRange: {
      studio: "CHF 700-1'000",
      twoRooms: "CHF 1'000-1'500",
      threeRooms: "CHF 1'500-2'400",
      house: "CHF 3'000-5'500",
    },
  },
  basel: {
    name: "Basel",
    description: "Basel-Stadt bietet qualitativ hochwertige Umzugsservices mit internationalem Standard. Perfekt für grenzüberschreitende Umzüge.",
    cities: ["Basel", "Riehen", "Bettingen"],
    priceRange: {
      studio: "CHF 750-1'100",
      twoRooms: "CHF 1'100-1'700",
      threeRooms: "CHF 1'700-2'600",
      house: "CHF 3'200-5'800",
    },
  },
};

const Canton = () => {
  const { canton } = useParams<{ canton: string }>();
  const cantonKey = canton?.toLowerCase() || "";
  const info = CANTON_INFO[cantonKey];

  if (!info) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Kanton nicht gefunden</h2>
            <p className="text-muted-foreground mb-6">Diese Seite ist noch nicht verfügbar.</p>
            <Link to="/">
              <Button>Zurück zur Startseite</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 gradient-hero text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
                <MapPin className="w-3 h-3 mr-1" />
                Kanton {info.name}
              </Badge>
              <h1 className="mb-6">Umzug im Kanton {info.name}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">{info.description}</p>
              <Link to="/rechner">
                <Button size="lg" className="bg-accent hover:bg-accent/90 shadow-accent group">
                  Jetzt Offerten vergleichen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Price Guide */}
        <section className="py-12 md:py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Typische Umzugskosten in {info.name}</h2>
                <p className="text-muted-foreground">
                  Durchschnittliche Preise für lokale Umzüge (ca. 20-30 km)
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingDown className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Studio / 1 Zimmer</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{info.priceRange.studio}</div>
                    <p className="text-sm text-muted-foreground">≈ 20 m³</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingDown className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">2 Zimmer</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{info.priceRange.twoRooms}</div>
                    <p className="text-sm text-muted-foreground">≈ 35 m³</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingDown className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">3-4 Zimmer</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{info.priceRange.threeRooms}</div>
                    <p className="text-sm text-muted-foreground">≈ 50-65 m³</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingDown className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Haus / 5+ Zimmer</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{info.priceRange.house}</div>
                    <p className="text-sm text-muted-foreground">≈ 80-120 m³</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  *Preise sind Richtwerte und können je nach Umzugsdetails variieren.
                </p>
                <Link to="/rechner">
                  <Button variant="outline" size="lg">
                    Genaue Berechnung starten
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Cities */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Umzug in {info.name}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {info.cities.map((city) => (
                  <Link key={city} to={`/${city.toLowerCase()}/umzug`}>
                    <Card className="hover:shadow-medium transition-shadow cursor-pointer">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{city}</h3>
                          <p className="text-sm text-muted-foreground">Umzugsfirmen finden</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Companies */}
        <section className="py-12 md:py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Empfohlene Umzugsfirmen</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="hover:shadow-strong transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center text-2xl">
                          🚛
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">Beispiel Firma {i}</h3>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                            ))}
                            <span className="text-sm ml-1">4.8 (120)</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Profil ansehen
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center">
                <Link to={`/firmen?canton=${info.name}`}>
                  <Button size="lg">
                    Alle Firmen in {info.name} anzeigen
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Häufige Fragen</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2">Wie viel kostet ein Umzug in {info.name}?</h3>
                    <p className="text-sm text-muted-foreground">
                      Die Kosten variieren je nach Wohnungsgrösse, Distanz und zusätzlichen Services. Ein 3-Zimmer-Umzug
                      kostet durchschnittlich {info.priceRange.threeRooms}.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2">Wie lange dauert ein Umzug?</h3>
                    <p className="text-sm text-muted-foreground">
                      Ein Standardumzug (3 Zimmer, 30 km) dauert mit professionellem Team etwa 6-8 Stunden inklusive
                      Be- und Entladen.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2">Sind die Umzugsfirmen versichert?</h3>
                    <p className="text-sm text-muted-foreground">
                      Alle auf Umzugscheck.ch gelisteten Firmen sind versichert und zertifiziert. Prüfen Sie die Details
                      im jeweiligen Firmenprofil.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Canton;
