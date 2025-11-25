import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Sparkles, Trash2, Package, Wrench, Archive, Calculator, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Umzugsdienstleistungen",
  "provider": {
    "@type": "Organization",
    "name": "Umzugscheck.ch"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Switzerland"
  },
  "description": "Umfassende Umzugsdienstleistungen: Transport, Reinigung, Entsorgung, Lagerung, Montage und Packservice."
};

const Dienstleistungen = () => {
  const services = [
    {
      icon: Truck,
      title: "Umzugsservice",
      description: "Professioneller Transport Ihres gesamten Hausrats von A nach B mit erfahrenen Umzugshelfern und modernen Fahrzeugen.",
      features: [
        "Kompletter Transport",
        "Erfahrene Umzugshelfer",
        "Moderne Fahrzeugflotte",
        "Schweizweite Abdeckung"
      ],
      link: "/rechner",
      linkText: "Umzug berechnen"
    },
    {
      icon: Sparkles,
      title: "Endreinigung",
      description: "Professionelle Wohnungsreinigung nach Auszug mit Abnahmegarantie. Erfüllt alle Standards der Schweizer Vermieter.",
      features: [
        "Abnahmegarantie",
        "Alle Räume inklusive",
        "Professionelle Geräte",
        "Ökologische Reinigungsmittel"
      ],
      link: "/rechner/reinigung",
      linkText: "Reinigung berechnen"
    },
    {
      icon: Trash2,
      title: "Entsorgung & Räumung",
      description: "Fachgerechte Entsorgung von Möbeln, Elektrogeräten und Hausrat. Komplette Wohnungsräumungen bei Bedarf.",
      features: [
        "Sperrgut-Entsorgung",
        "Elektronik-Recycling",
        "Wohnungsräumungen",
        "Umweltgerechte Entsorgung"
      ],
      link: "/rechner/entsorgung",
      linkText: "Entsorgung berechnen"
    },
    {
      icon: Package,
      title: "Packservice",
      description: "Professionelles Ein- und Auspacken aller Gegenstände. Wir bringen das passende Verpackungsmaterial mit.",
      features: [
        "Komplettes Ein-/Auspacken",
        "Verpackungsmaterial inklusive",
        "Schutz für empfindliche Güter",
        "Zeitersparnis"
      ],
      link: "/rechner/packservice",
      linkText: "Packservice berechnen"
    },
    {
      icon: Wrench,
      title: "Möbelmontage",
      description: "Fachgerechter Auf- und Abbau Ihrer Möbel. Von Schränken über Küchen bis hin zu komplexen Einrichtungen.",
      features: [
        "Fachgerechte Montage",
        "Küchenmontage",
        "Schranksysteme",
        "Professionelles Werkzeug"
      ],
      link: "/rechner/moebelmontage",
      linkText: "Montage berechnen"
    },
    {
      icon: Archive,
      title: "Lagerung",
      description: "Sichere Einlagerung Ihrer Möbel und Gegenstände. Flexible Laufzeiten von wenigen Tagen bis zu mehreren Monaten.",
      features: [
        "Sichere Lagerräume",
        "Flexible Laufzeiten",
        "Klimatisiert verfügbar",
        "Versicherter Schutz"
      ],
      link: "/rechner/lager",
      linkText: "Lagerung berechnen"
    }
  ];

  return (
    <>
      <SEOHead
        title="Umzugsdienstleistungen Schweiz - Alle Services im Überblick | Umzugscheck.ch"
        description="Alle Umzugsdienstleistungen auf einen Blick: Transport, Reinigung, Entsorgung, Lagerung, Möbelmontage und Packservice. Vergleichen Sie Anbieter und Preise."
        keywords="umzugsdienstleistungen, umzugsservice, reinigung, entsorgung, lagerung, möbelmontage, packservice"
        canonical="/dienstleistungen"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "Dienstleistungen", href: "/dienstleistungen" }
            ]}
          />

          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Umzugs-Dienstleistungen im Überblick
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Für verschiedene Umzugsthemen finden Sie bei uns die passenden Firmen – 
              vom Privatumzug über Reinigung bis zur Lagerung
            </p>
            <Button size="lg" asChild>
              <Link to="/offerte">
                <Calculator className="w-5 h-5 mr-2" />
                Offerte anfordern
              </Link>
            </Button>
          </div>

          {/* Services Grid */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Truck,
                  title: "Privatumzug",
                  description: "Kompletter Umzugsservice für Privatpersonen und Familien. Von der 1-Zimmer-Wohnung bis zum Einfamilienhaus.",
                  link: "/rechner/umzugskosten"
                },
                {
                  icon: Calculator,
                  title: "Firmenumzug",
                  description: "Professionelle Büro- und Firmenumzüge mit minimaler Ausfallzeit. IT-Equipment, Möbel und sensible Unterlagen.",
                  link: "/rechner/umzugskosten"
                },
                {
                  icon: Sparkles,
                  title: "Umzugsreinigung mit Abgabegarantie",
                  description: "Professionelle Endreinigung nach Schweizer Standards. Mit Abnahmegarantie für stressfreie Wohnungsübergabe.",
                  link: "/rechner/reinigung"
                },
                {
                  icon: Trash2,
                  title: "Entsorgung & Entrümpelung",
                  description: "Fachgerechte Entsorgung von Möbeln, Elektrogeräten und Hausrat. Komplette Wohnungsräumungen bei Bedarf.",
                  link: "/rechner/entsorgung"
                },
                {
                  icon: Archive,
                  title: "Möbellager & Zwischenlagerung",
                  description: "Sichere Einlagerung Ihrer Möbel und Gegenstände in klimatisierten Räumen. Flexibel von Tagen bis Monaten.",
                  link: "/rechner/lager"
                },
                {
                  icon: Wrench,
                  title: "Klavier- & Spezialtransport",
                  description: "Fachgerechter Transport von Klavieren, Flügeln, Tresoren und anderen schweren oder empfindlichen Gegenständen.",
                  link: "/offerte"
                },
                {
                  icon: Package,
                  title: "Einpackservice",
                  description: "Professionelles Ein- und Auspacken aller Gegenstände mit dem richtigen Verpackungsmaterial für sicheren Transport.",
                  link: "/rechner/packservice"
                },
                {
                  icon: Wrench,
                  title: "Montage & Demontage",
                  description: "Fachgerechter Auf- und Abbau von Möbeln, Küchen und komplexen Einrichtungen durch erfahrene Monteure.",
                  link: "/rechner/moebelmontage"
                }
              ].map((service, index) => (
                <Card key={index} className="hover:shadow-strong hover:border-primary/40 transition-all group">
                  <CardHeader>
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <service.icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {service.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                      <Link to={service.link}>
                        Mehr erfahren
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Multi-Service CTA */}
          <section className="mb-16 bg-secondary/5 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Brauchst du Hilfe bei mehreren Themen gleichzeitig?
              </h2>
              <p className="text-muted-foreground mb-6">
                Kombinieren Sie verschiedene Services und erhalten Sie ein Gesamtangebot – 
                oft günstiger als Einzelbuchungen.
              </p>
              <Link to="/offerte">
                <Button size="lg" className="shadow-accent">
                  Offerte anfordern
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Bereit für Ihren stressfreien Umzug?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Konfigurieren Sie jetzt Ihr individuelles Umzugspaket
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/rechner/konfigurator">
                  <Calculator className="w-5 h-5 mr-2" />
                  Gesamtpaket konfigurieren
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/offerte">
                  Offerte anfordern
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Dienstleistungen;
