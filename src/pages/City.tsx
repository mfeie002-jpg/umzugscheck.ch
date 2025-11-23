import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  TrendingDown, 
  Star, 
  Shield, 
  CheckCircle2,
  ArrowRight,
  Calculator,
  Users,
  Home
} from "lucide-react";

const cityData: Record<string, {
  name: string;
  canton: string;
  cantonSlug: string;
  population: string;
  description: string;
  priceRange: { min: number; max: number };
  avgPrice: number;
  neighborhoods: string[];
  companies: { name: string; rating: number; reviews: number }[];
}> = {
  "zuerich": {
    name: "Zürich",
    canton: "Zürich",
    cantonSlug: "zuerich",
    population: "434'000",
    description: "Als grösste Stadt der Schweiz und wirtschaftliches Zentrum bietet Zürich eine Vielzahl an professionellen Umzugsfirmen. Die Stadt zeichnet sich durch gute Verkehrsanbindungen aus, was Umzüge erleichtert.",
    priceRange: { min: 800, max: 4500 },
    avgPrice: 2200,
    neighborhoods: ["Zürich-Altstetten", "Zürich-Oerlikon", "Zürich-Wiedikon", "Zürich-Höngg", "Zürich-Seefeld"],
    companies: [
      { name: "Züri Umzüge AG", rating: 4.8, reviews: 127 },
      { name: "Swiss Move Solutions", rating: 4.9, reviews: 203 },
      { name: "Express Umzugsfirma", rating: 4.7, reviews: 89 }
    ]
  },
  "winterthur": {
    name: "Winterthur",
    canton: "Zürich",
    cantonSlug: "zuerich",
    population: "115'000",
    description: "Winterthur ist die sechstgrösste Stadt der Schweiz und liegt im Kanton Zürich. Dank der kompakten Stadtstruktur und guten Erreichbarkeit sind Umzüge hier oft effizienter und kostengünstiger als in Zürich.",
    priceRange: { min: 700, max: 3800 },
    avgPrice: 1900,
    neighborhoods: ["Winterthur-Stadt", "Winterthur-Seen", "Winterthur-Töss", "Winterthur-Veltheim"],
    companies: [
      { name: "Umzüge Winterthur GmbH", rating: 4.7, reviews: 85 },
      { name: "Reliable Movers", rating: 4.6, reviews: 62 }
    ]
  },
  "bern": {
    name: "Bern",
    canton: "Bern",
    cantonSlug: "bern",
    population: "134'000",
    description: "Die Bundesstadt Bern kombiniert historischen Charme mit modernem Wohnen. Viele Umzüge finden in der malerischen Altstadt statt, was besondere Anforderungen an die Umzugsfirmen stellt.",
    priceRange: { min: 750, max: 4200 },
    avgPrice: 2100,
    neighborhoods: ["Bern-Bümpliz", "Bern-Länggasse", "Bern-Mattenhof", "Bern-Kirchenfeld"],
    companies: [
      { name: "Bern Movers Pro", rating: 4.8, reviews: 134 },
      { name: "Capital Umzüge AG", rating: 4.7, reviews: 98 }
    ]
  },
  "basel": {
    name: "Basel",
    canton: "Basel-Stadt",
    cantonSlug: "basel",
    population: "178'000",
    description: "Basel liegt im Dreiländereck und ist ein wichtiges Kulturzentrum. Die Stadt bietet moderne Infrastruktur und viele erfahrene Umzugsfirmen für nationale und internationale Umzüge.",
    priceRange: { min: 800, max: 4300 },
    avgPrice: 2150,
    neighborhoods: ["Basel-Gundeldingen", "Basel-Kleinhüningen", "Basel-Riehen", "Basel-Bettingen"],
    companies: [
      { name: "Basel Transport Services", rating: 4.9, reviews: 156 },
      { name: "Dreiland Umzüge", rating: 4.6, reviews: 87 }
    ]
  }
};

const City = () => {
  const { slug } = useParams();
  const city = slug ? cityData[slug] : null;

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4">Stadt nicht gefunden</h1>
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
        {/* Hero Section */}
        <section className="gradient-hero text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-white/80 mb-4">
                <Link to={`/kanton/${city.cantonSlug}`} className="hover:text-white transition-colors">
                  Kanton {city.canton}
                </Link>
                <span>/</span>
                <span>{city.name}</span>
              </div>
              
              <h1 className="mb-6">
                Umzug in {city.name}
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8">
                {city.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{city.population} Einwohner</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  <span>Ø CHF {city.avgPrice.toLocaleString()} pro Umzug</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  <span>Geprüfte Firmen</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Price Overview */}
        <section className="py-16 md:py-20 bg-gradient-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="mb-4">Umzugskosten in {city.name}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Hier finden Sie eine Übersicht der durchschnittlichen Umzugskosten in {city.name}.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="shadow-medium">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      CHF {city.priceRange.min.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">Minimum</div>
                    <div className="text-sm text-muted-foreground mt-2">1-2 Zimmer</div>
                  </CardContent>
                </Card>

                <Card className="shadow-strong border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-accent mb-2">
                      CHF {city.avgPrice.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">Durchschnitt</div>
                    <div className="text-sm text-muted-foreground mt-2">3-4 Zimmer</div>
                  </CardContent>
                </Card>

                <Card className="shadow-medium">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      CHF {city.priceRange.max.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">Maximum</div>
                    <div className="text-sm text-muted-foreground mt-2">5+ Zimmer / Haus</div>
                  </CardContent>
                </Card>
              </div>

              {/* Calculator CTA */}
              <Card className="shadow-strong bg-primary text-white">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                        <Calculator className="w-8 h-8" />
                        <h3 className="text-2xl font-bold">Berechnen Sie Ihre Umzugskosten</h3>
                      </div>
                      <p className="text-white/90">
                        Erhalten Sie in 60 Sekunden eine präzise Kostenschätzung für Ihren Umzug in {city.name}.
                      </p>
                    </div>
                    <Link to="/rechner">
                      <Button size="lg" variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm">
                        Jetzt berechnen
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="mb-8">Beliebte Quartiere in {city.name}</h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                {city.neighborhoods.map((neighborhood) => (
                  <Card key={neighborhood} className="shadow-medium hover:shadow-strong transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">{neighborhood}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Companies */}
        <section className="py-16 md:py-20 bg-gradient-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="mb-4">Top Umzugsfirmen in {city.name}</h2>
                <p className="text-lg text-muted-foreground">
                  Geprüfte und bewertete Umzugsfirmen für Ihren Umzug in {city.name}.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {city.companies.map((company) => (
                  <Card key={company.name} className="shadow-strong hover:shadow-strong transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{company.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{company.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ({company.reviews} Bewertungen)
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-success-light text-success border-success/20">
                          <Shield className="w-3 h-3 mr-1" />
                          Geprüft
                        </Badge>
                      </div>
                      <Link to={`/firmen/${company.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Button variant="outline" className="w-full">
                          Firma ansehen
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Link to="/firmen">
                  <Button size="lg" variant="outline">
                    Alle Firmen in {city.name} anzeigen
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-12 text-center">Häufige Fragen zu Umzügen in {city.name}</h2>
              <div className="space-y-6">
                <Card className="shadow-medium">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-3">
                      Was kostet ein Umzug in {city.name} durchschnittlich?
                    </h3>
                    <p className="text-muted-foreground">
                      Die Kosten variieren je nach Grösse der Wohnung und Distanz. 
                      Im Durchschnitt zahlen Sie für einen Umzug in {city.name} etwa CHF {city.avgPrice.toLocaleString()}.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-medium">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-3">
                      Wie lange dauert ein Umzug in {city.name}?
                    </h3>
                    <p className="text-muted-foreground">
                      Ein durchschnittlicher Umzug (3-Zimmer-Wohnung) dauert etwa 6-8 Stunden. 
                      Die genaue Dauer hängt von der Menge des Umzugsguts und den örtlichen Gegebenheiten ab.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-medium">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-3">
                      Benötige ich eine Parkbewilligung für den Umzug?
                    </h3>
                    <p className="text-muted-foreground">
                      In vielen Quartieren von {city.name} wird eine Parkbewilligung empfohlen. 
                      Ihre Umzugsfirma kann Sie dabei unterstützen oder die Bewilligung für Sie beantragen.
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

export default City;
