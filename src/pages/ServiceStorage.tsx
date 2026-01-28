import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Warehouse, Shield, Thermometer, Lock, Package, Clock, Key, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicePageWrapper from "@/components/ServicePageWrapper";
import ServiceSchema from "@/components/ServiceSchema";
import AnimatedSection from "@/components/AnimatedSection";
import storageImage from "@/assets/service-storage-navy-alpine.jpg";

const ServiceStorage = () => {
  const features = [
    {
      icon: Thermometer,
      title: "Klimatisiert",
      description: "Konstante Temperatur und Luftfeuchtigkeit für optimalen Schutz Ihrer wertvollen Gegenstände",
    },
    {
      icon: Lock,
      title: "24/7 Überwachung",
      description: "Videoüberwachung, Alarmsysteme und moderne Sicherheitstechnik rund um die Uhr",
    },
    {
      icon: Shield,
      title: "Vollversichert",
      description: "Umfassende Versicherung Ihres eingelagerten Eigentums gegen alle Risiken",
    },
    {
      icon: Key,
      title: "Flexibler Zugang",
      description: "Zugriff auf Ihre Gegenstände nach Terminvereinbarung jederzeit möglich",
    },
  ];

  const options = [
    {
      title: "Kurzzeit-Lagerung",
      description: "Perfekt für Übergangszeiten zwischen zwei Umzügen oder während Renovierungen",
      duration: "1-3 Monate",
      price: "ab CHF 150/Monat",
    },
    {
      title: "Langzeit-Lagerung",
      description: "Sichere und günstige Aufbewahrung für längere Zeiträume mit Mengenrabatt",
      duration: "3+ Monate",
      price: "ab CHF 120/Monat",
    },
    {
      title: "Möbellagerung",
      description: "Speziell konzipierte Bereiche für Möbel, Sofas und grössere Einrichtungsgegenstände",
      duration: "Flexibel",
      price: "ab CHF 80/Monat",
    },
    {
      title: "Archiv-Lagerung",
      description: "Für Geschäftsunterlagen, Dokumente und sensible Daten mit Zugangskontrolle",
      duration: "Langfristig",
      price: "ab CHF 50/Monat",
    },
  ];

  const storageItems = {
    private: [
      "Möbel und Einrichtungsgegenstände",
      "Haushaltsgeräte und Elektronik",
      "Persönliche Gegenstände und Erinnerungsstücke",
      "Saisonale Artikel (Ski, Velos, Gartenmöbel)",
      "Kunstwerke und Antiquitäten",
      "Musikinstrumente (Klaviere, etc.)",
    ],
    business: [
      "Büromöbel und -ausstattung",
      "Archive, Akten und Dokumente",
      "Lagerware und Inventar",
      "IT-Equipment und Server",
      "Messestände und Werbematerial",
      "Saisonale Dekoration",
    ],
  };

  return (
    <ServicePageWrapper currentLabel="Einlagerung">
      <ServiceSchema
        name="Einlagerung & Lagerung"
        description="Sichere, klimatisierte Lagerräume für Ihre Möbel und persönlichen Gegenstände. Flexibel, überwacht und vollversichert."
        url="https://feierabend-umzuege.ch/plan/storage"
        priceRange="CHF 50 - CHF 500"
      />
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-4">
                <Warehouse className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-balance font-display">Einlagerung & Lagerung</h1>
              <p className="text-xl text-muted-foreground">
                Sichere, klimatisierte Lagerräume für Ihre Möbel und persönlichen Gegenstände. 
                Flexibel, 24/7 überwacht und vollversichert – für Privat und Geschäft.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                    Offerte anfragen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="tel:+41765681302">
                  <Button size="lg" variant="outline">
                    Anrufen
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-strong">
              <img
                src={storageImage}
                alt="Feierabend Umzüge Lagerung"
                className="w-full h-full object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
              Unsere Vorteile
            </span>
            <h2 className="text-balance font-display">Sichere Lagerlösungen</h2>
            <p className="text-xl text-muted-foreground">
              Höchste Sicherheit und optimale Bedingungen für Ihr Eigentum
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-8 text-center hover-lift h-full">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-6">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 font-display">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-warm bg-warm/10 rounded-full">
              Flexibel
            </span>
            <h2 className="text-balance font-display">Lager-Optionen</h2>
            <p className="text-xl text-muted-foreground">
              Flexible Lösungen für jeden Bedarf und jedes Budget
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {options.map((option, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-6 hover-lift h-full flex flex-col">
                  <h3 className="text-xl font-semibold mb-2 font-display">{option.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">{option.description}</p>
                  <div className="space-y-1">
                    <div className="text-sm text-alpine font-medium">{option.duration}</div>
                    <div className="text-lg font-bold">{option.price}</div>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-5xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
                <Package className="h-3 w-3 inline mr-1" />
                Was lagern?
              </span>
              <h2 className="text-3xl font-semibold font-display">Was können Sie bei uns einlagern?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <AnimatedSection animation="slide-left">
                <Card className="p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-xl font-display">Privat</h3>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    {storageItems.private.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-alpine mr-3 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </AnimatedSection>
              <AnimatedSection animation="slide-right">
                <Card className="p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-xl font-display">Geschäftlich</h3>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    {storageItems.business.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-alpine mr-3 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-4xl mx-auto">
            <Card className="p-8 bg-background">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold font-display">Einfacher Zugang zu Ihrem Lager</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Sie möchten auf Ihre eingelagerten Gegenstände zugreifen? Kein Problem! Wir bieten 
                flexible Zugangsmöglichkeiten für Ihre Bequemlichkeit.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Während Geschäftszeiten</h4>
                  <p className="text-sm text-muted-foreground">Mo-Fr 08:00-18:00</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Nach Vereinbarung</h4>
                  <p className="text-sm text-muted-foreground">Auch Samstags möglich</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Teillieferungen</h4>
                  <p className="text-sm text-muted-foreground">Jederzeit möglich</p>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <Card className="max-w-3xl mx-auto p-12 text-center">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-warm fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-xl text-muted-foreground mb-6 italic">
                "Während unserer Renovierung haben wir unsere komplette Einrichtung bei Feierabend 
                eingelagert. Alles war perfekt geschützt und wir konnten jederzeit auf einzelne 
                Sachen zugreifen. Sehr empfehlenswert!"
              </p>
              <p className="font-semibold">Barbara & Peter K.</p>
              <p className="text-sm text-muted-foreground">6 Monate Einlagerung während Hausrenovation</p>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <Warehouse className="h-16 w-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-balance mb-6 font-display">Brauchen Sie Lagerraum?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Kontaktieren Sie uns für eine Beratung und ein individuelles Angebot – 
                massgeschneidert auf Ihre Bedürfnisse.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
                    Jetzt Offerte anfragen
                  </button>
                </Link>
                <a href="tel:+41765681302">
                  <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-colors">
                    Anrufen
                  </button>
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </ServicePageWrapper>
  );
};

export default ServiceStorage;
