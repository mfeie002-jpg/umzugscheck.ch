import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Sparkles, Trash2, Package, Wrench, Archive, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";

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
        title="Umzugs-Dienstleistungen - Alle Services aus einer Hand | Umzugscheck.ch"
        description="Komplette Umzugsdienstleistungen: Transport, Endreinigung, Entsorgung, Packservice, Möbelmontage und Lagerung. Alles aus einer Hand von geprüften Schweizer Firmen."
        keywords="umzugsdienstleistungen, umzugsservice, endreinigung, entsorgung, packservice, möbelmontage, lagerung"
        canonical="/dienstleistungen"
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
              Alle Umzugsdienstleistungen aus einer Hand
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Von Transport über Reinigung bis zur Lagerung – wir bieten Ihnen den kompletten Service für einen stressfreien Umzug in der ganzen Schweiz
            </p>
            <Button size="lg" asChild>
              <Link to="/rechner/konfigurator">
                <Calculator className="w-5 h-5 mr-2" />
                Gesamtpaket konfigurieren
              </Link>
            </Button>
          </div>

          {/* Services Grid */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Unsere Dienstleistungen im Detail
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" asChild>
                      <Link to={service.link}>
                        {service.linkText}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Kombinations-Vorteile */}
          <section className="mb-16 bg-muted/30 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Vorteile der Service-Kombination
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Alles aus einer Hand",
                  description: "Ein Ansprechpartner für alle Dienstleistungen – kein Koordinationsaufwand zwischen verschiedenen Anbietern."
                },
                {
                  title: "Zeitersparnis",
                  description: "Durch die Bündelung aller Services sparen Sie wertvolle Zeit bei der Organisation Ihres Umzugs."
                },
                {
                  title: "Kostenersparnis",
                  description: "Paketpreise sind günstiger als einzelne Services. Sparen Sie bis zu 20% durch Kombination."
                }
              ].map((benefit, index) => (
                <div key={index} className="bg-background p-6 rounded-xl shadow-sm text-center">
                  <h3 className="font-bold text-xl mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Typische Kombinationen */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Beliebte Service-Kombinationen
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Basic-Umzug",
                  services: ["Umzugstransport", "Möbelmontage"],
                  price: "ab CHF 1'200",
                  description: "Perfekt für kleine Umzüge und Handwerker-erfahrene Kunden"
                },
                {
                  title: "Komfort-Umzug",
                  services: ["Umzugstransport", "Packservice", "Möbelmontage", "Endreinigung"],
                  price: "ab CHF 2'500",
                  description: "Die beliebteste Kombination – stressfrei umziehen",
                  popular: true
                },
                {
                  title: "Rundum-Sorglos-Paket",
                  services: ["Alle Services", "Entsorgung", "Lagerung", "Versicherung Premium"],
                  price: "ab CHF 4'500",
                  description: "Maximaler Komfort für anspruchsvolle Umzüge"
                }
              ].map((combo, index) => (
                <Card key={index} className={combo.popular ? "border-primary border-2 relative" : ""}>
                  {combo.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        Am beliebtesten
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{combo.title}</CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold text-foreground">{combo.price}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {combo.services.map((service, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-muted-foreground mb-4">{combo.description}</p>
                    <Button className="w-full" variant={combo.popular ? "default" : "outline"} asChild>
                      <Link to="/rechner/konfigurator">
                        Paket konfigurieren
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
                <Link to="/rechner">
                  Einzelservice berechnen
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
