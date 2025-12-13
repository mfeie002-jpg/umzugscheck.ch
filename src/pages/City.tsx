import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
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
  Home,
  Phone,
  Mail
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FAQAccordion } from "@/components/FAQAccordion";
import { LoadingSkeletonCompany } from "@/components/LoadingSkeletonCompany";
import { Helmet } from "react-helmet";
import { generateMetaData, generateOGTags } from "@/lib/seo-meta";
import { generatePageSchemas, generateSchemaScript } from "@/lib/schema-markup";
import { getKeywordsForPage } from "@/lib/seo-keywords";

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
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (city) {
      fetchCompanies();
    }
  }, [city]);

  const fetchCompanies = async () => {
    if (!city) return;
    
    setLoading(true);
    try {
      // Try to find companies that serve this city or canton
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .or(`service_areas.cs.{${city.name}},service_areas.cs.{${city.canton}}`)
        .order("rating", { ascending: false })
        .limit(6);

      if (!error && data) {
        setCompanies(data);
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4">Stadt nicht gefunden</h1>
            <Link to="/">
              <Button>Zurück zur Startseite</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const currentUrl = `https://www.umzugscheck.ch/${slug}/umzugsfirmen/`;
  const metaData = generateMetaData({ type: 'city', city: slug });
  const ogTags = generateOGTags(metaData, currentUrl);
  const keywords = getKeywordsForPage('city', slug);
  
  const companyList = companies.map(c => ({
    name: c.name,
    rating: c.rating,
    reviewCount: c.review_count
  }));
  
  const schemas = generatePageSchemas(
    { type: 'city', city: slug!, url: currentUrl },
    undefined,
    companyList
  );
  const schemaScript = generateSchemaScript(schemas);

  return (
    <div className="min-h-screen flex-col">
      <Helmet>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <link rel="canonical" href={currentUrl} />
        <meta name="keywords" content={keywords.join(', ')} />
        
        {/* OpenGraph Tags */}
        <meta property="og:title" content={ogTags['og:title']} />
        <meta property="og:description" content={ogTags['og:description']} />
        <meta property="og:type" content={ogTags['og:type']} />
        <meta property="og:url" content={ogTags['og:url']} />
        <meta property="og:image" content={ogTags['og:image']} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content={ogTags['twitter:card']} />
        <meta name="twitter:title" content={ogTags['twitter:title']} />
        <meta name="twitter:description" content={ogTags['twitter:description']} />
        <meta name="twitter:image" content={ogTags['twitter:image']} />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {schemaScript}
        </script>
      </Helmet>
      
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs
            items={[
              { label: "Kantone", href: "/" },
              { label: `Kanton ${city.canton}`, href: `/kanton/${city.cantonSlug}` },
              { label: city.name },
            ]}
          />
        </div>

        {/* Hero Section */}
        <section className="gradient-hero text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              
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
                    <Link to="/umzugsofferten">
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

              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <LoadingSkeletonCompany key={index} />
                  ))}
                </div>
              ) : companies.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {companies.slice(0, 4).map((company) => (
                      <Card key={company.id} className="hover-lift border-2 hover:border-primary/20 transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-light to-primary/5 flex items-center justify-center text-3xl shadow-soft flex-shrink-0">
                              {company.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-bold text-lg">{company.name}</h3>
                                {company.verified && (
                                  <Badge className="bg-success text-white border-0 flex-shrink-0">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Geprüft
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(company.rating)
                                          ? "fill-accent text-accent"
                                          : "fill-muted text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="font-bold">{company.rating}</span>
                                <span className="text-sm text-muted-foreground">
                                  ({company.review_count})
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {company.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-4 text-sm">
                            {company.phone && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {company.email && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {company.price_level && (
                              <Badge variant="secondary" className="ml-auto">
                                {company.price_level}
                              </Badge>
                            )}
                          </div>
                          
                          <Link to={`/firmen/${company.id}`}>
                            <Button className="w-full bg-primary hover:bg-primary-dark">
                              Profil ansehen
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="text-center">
                    <Link to={`/firmen?canton=${city.canton}`}>
                      <Button size="lg" variant="outline">
                        Alle Firmen in {city.name} anzeigen
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Aktuell sind keine Firmen für {city.name} verfügbar.
                    </p>
                    <Link to="/firmen">
                      <Button variant="outline">Alle Firmen durchsuchen</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-12 text-center">Häufige Fragen zu Umzügen in {city.name}</h2>
              <FAQAccordion 
                items={[
                  {
                    question: `Was kostet ein Umzug in ${city.name} durchschnittlich?`,
                    answer: `Die Kosten variieren je nach Grösse der Wohnung und Distanz. Im Durchschnitt zahlen Sie für einen Umzug in ${city.name} etwa CHF ${city.avgPrice.toLocaleString()}. Für eine genaue Schätzung nutzen Sie unseren kostenlosen Umzugsrechner.`
                  },
                  {
                    question: `Wie lange dauert ein Umzug in ${city.name}?`,
                    answer: "Ein durchschnittlicher Umzug (3-Zimmer-Wohnung) dauert etwa 6-8 Stunden. Die genaue Dauer hängt von der Menge des Umzugsguts, den örtlichen Gegebenheiten (Stockwerk, Lift, Parkplatz) und der Entfernung ab."
                  },
                  {
                    question: `Benötige ich eine Parkbewilligung für den Umzug in ${city.name}?`,
                    answer: `In vielen Quartieren von ${city.name} wird eine Parkbewilligung für den Umzugswagen empfohlen oder ist sogar Pflicht. Ihre Umzugsfirma kann Sie dabei unterstützen oder die Bewilligung für Sie bei der Stadt beantragen.`
                  },
                  {
                    question: "Wie weit im Voraus sollte ich meinen Umzug buchen?",
                    answer: "Wir empfehlen, Ihren Umzug mindestens 4-6 Wochen im Voraus zu planen. Während der Hochsaison (Mai-September) sollten Sie noch früher buchen. Mit Umzugscheck.ch können Sie schnell mehrere Offerten vergleichen."
                  },
                  {
                    question: "Welche zusätzlichen Services bieten Umzugsfirmen an?",
                    answer: "Viele Umzugsfirmen bieten Zusatzservices wie Packservice, Endreinigung, Entsorgung, Möbelmontage und Lagerung an. Diese Services können Sie bei der Offerten-Anfrage direkt miteinbeziehen."
                  }
                ]}
              />
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
};

export default City;
