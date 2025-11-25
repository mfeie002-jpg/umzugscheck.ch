import { useParams } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, Star, TrendingDown, ArrowRight, Check } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const cityData: Record<string, {
  name: string;
  description: string;
  priceInfo: string;
  characteristics: string[];
}> = {
  zuerich: {
    name: "Zürich",
    description: "Als grösste Stadt der Schweiz ist Zürich das wirtschaftliche und kulturelle Zentrum. Umzüge in Zürich sind aufgrund der hohen Nachfrage, dichten Bebauung und historischen Altstadt tendenziell teurer.",
    priceInfo: "CHF 1'200 - 3'500",
    characteristics: [
      "Höhere Umzugspreise durch zentrale Lage",
      "Viele Altbauten ohne Lift",
      "Parkplatzsituation oft schwierig",
      "Grosse Auswahl an Umzugsfirmen"
    ]
  },
  bern: {
    name: "Bern",
    description: "Die Bundeshauptstadt mit ihrer UNESCO-geschützten Altstadt erfordert besondere Sorgfalt beim Umzug. Die engen Gassen und historischen Gebäude stellen spezielle Anforderungen an Umzugsfirmen.",
    priceInfo: "CHF 1'000 - 3'000",
    characteristics: [
      "Historische Altstadt mit Zufahrtsbeschränkungen",
      "Mittleres Preisniveau",
      "Viele Treppen in Altstadtgebäuden",
      "Erfahrene lokale Umzugsfirmen"
    ]
  },
  basel: {
    name: "Basel",
    description: "Als Kulturzentrum und Grenzstadt zu Deutschland und Frankreich ist Basel ideal für grenzüberschreitende Umzüge. Die Stadt bietet eine gute Mischung aus Qualität und Preis.",
    priceInfo: "CHF 900 - 2'800",
    characteristics: [
      "Grenzüberschreitende Umzüge möglich",
      "Gutes Preis-Leistungs-Verhältnis",
      "Kompakte Stadtstruktur",
      "Internationale Erfahrung der Anbieter"
    ]
  },
  luzern: {
    name: "Luzern",
    description: "Die touristische Destination am Vierwaldstättersee kombiniert städtisches Leben mit Alpenpanorama. Umzüge profitieren von guter Erreichbarkeit und moderater Preisgestaltung.",
    priceInfo: "CHF 900 - 2'500",
    characteristics: [
      "Zentrale Lage in der Zentralschweiz",
      "Moderate Preise",
      "Gut erreichbar",
      "Tourismus-geprägt"
    ]
  },
  winterthur: {
    name: "Winterthur",
    description: "Die zweitgrösste Stadt im Kanton Zürich bietet attraktive Wohnmöglichkeiten mit guter Anbindung an Zürich. Umzüge sind hier oft günstiger als in der Metropole.",
    priceInfo: "CHF 800 - 2'400",
    characteristics: [
      "Günstigere Alternative zu Zürich",
      "Gute Infrastruktur",
      "Familienfreundlich",
      "Unkomplizierte Zufahrtswege"
    ]
  },
  "st-gallen": {
    name: "St. Gallen",
    description: "Die grösste Stadt der Ostschweiz mit ihrer berühmten Stiftsbibliothek. Umzüge profitieren von der guten regionalen Vernetzung und fairen Preisen.",
    priceInfo: "CHF 850 - 2'600",
    characteristics: [
      "Ostschweiz-Zentrum",
      "Moderate Preise",
      "Historische Altstadt",
      "Gute Verkehrsanbindung"
    ]
  }
};

const dummyCompanies = [
  { name: "Zügel-Profis", rating: 4.8, services: ["Privatumzug", "Reinigung", "Montage"], featured: true },
  { name: "Express Moving", rating: 4.7, services: ["Privatumzug", "Entsorgung"], featured: false },
  { name: "Schweizer Umzüge AG", rating: 4.9, services: ["Privatumzug", "Firmenumzug", "Lagerung"], featured: true },
  { name: "City Movers", rating: 4.6, services: ["Privatumzug", "Packservice"], featured: false }
];

export default function City() {
  const { slug } = useParams<{ slug: string }>();
  const city = cityData[slug || ""] || cityData.zuerich;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Umzugsfirmen in ${city.name}`,
    "description": `Vergleichen Sie Umzugsfirmen in ${city.name}. Kostenlose Offerten von geprüften Anbietern.`,
    "url": `https://umzugscheck.ch/umzugsfirmen/${slug}`
  };

  return (
    <>
      <SEOHead
        title={`Umzugsfirmen in ${city.name} vergleichen - Beste Anbieter finden | Umzugscheck.ch`}
        description={`${city.description} Vergleichen Sie jetzt kostenlos Umzugsofferten von geprüften Firmen in ${city.name}.`}
        keywords={`umzugsfirmen ${city.name.toLowerCase()}, umzug ${city.name.toLowerCase()}, umzugskosten ${city.name.toLowerCase()}, zügelunternehmen ${city.name.toLowerCase()}`}
        canonical={`/umzugsfirmen/${slug}`}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "Umzugsfirmen", href: "/umzugsfirmen" },
              { label: city.name, href: `/umzugsfirmen/${slug}` }
            ]}
          />

          {/* Hero */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Umzugsfirmen in {city.name}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl">
              {city.description}
            </p>
          </div>

          {/* CTA Box */}
          <Card className="mb-12 border-primary/20 bg-primary/5">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Eine Anfrage – mehrere Umzugsofferten für {city.name}
                  </h2>
                  <p className="text-muted-foreground">
                    Vergleichen Sie kostenlos und unverbindlich Angebote von geprüften Umzugsfirmen
                  </p>
                </div>
                <Button asChild size="lg" className="shrink-0">
                  <Link to="/offerte">
                    Offerte für Umzug in {city.name} anfordern
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* City Characteristics */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Umzug in {city.name} – das sollten Sie wissen</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-primary" />
                    Typische Umzugskosten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary mb-2">{city.priceInfo}</p>
                  <p className="text-sm text-muted-foreground">
                    Durchschnittliche Preisspanne für einen 3-Zimmer-Umzug innerhalb von {city.name}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Besonderheiten</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {city.characteristics.map((char, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{char}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Company Listings */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Umzugsfirmen in {city.name}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {dummyCompanies.map((company, index) => (
                <Card key={index} className={company.featured ? "border-primary" : ""}>
                  <CardHeader>
                    {company.featured && (
                      <div className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded mb-2 w-fit">
                        <Star className="h-3 w-3 fill-current" />
                        Empfohlen
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{company.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{city.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{company.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {company.services.map((service, idx) => (
                          <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/offerte">Offerte anfragen</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Price Info */}
          <section className="mb-12 bg-muted/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Was kostet ein Umzug in {city.name}?
            </h2>
            <p className="text-muted-foreground mb-4">
              Die Umzugskosten in {city.name} variieren je nach Wohnungsgrösse, Distanz und gewünschten 
              Zusatzleistungen. Typischerweise bewegen sich die Preise im Bereich von {city.priceInfo} 
              für einen Standard-Umzug einer 3-Zimmer-Wohnung.
            </p>
            <p className="text-muted-foreground mb-6">
              Faktoren wie Stockwerk, Lift-Verfügbarkeit, Parkplatzsituation und spezielle Anforderungen 
              können die Kosten beeinflussen. Durch den Vergleich mehrerer Offerten können Sie bis zu 40% sparen.
            </p>
            <Button asChild variant="outline">
              <Link to="/preise">
                <TrendingDown className="mr-2 h-4 w-4" />
                Alle Preise ansehen
              </Link>
            </Button>
          </section>

          {/* Other Cities */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Umzugsfirmen in anderen Städten</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(cityData)
                .filter(([key]) => key !== slug)
                .map(([key, data]) => (
                  <Button key={key} asChild variant="outline">
                    <Link to={`/umzugsfirmen/${key}`}>{data.name}</Link>
                  </Button>
                ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
