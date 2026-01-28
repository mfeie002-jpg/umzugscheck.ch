import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Trash2, Recycle, Leaf, Truck, Phone, Shield, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicePageWrapper from "@/components/ServicePageWrapper";
import ServiceSchema from "@/components/ServiceSchema";
import AnimatedSection from "@/components/AnimatedSection";
import heroImage from "@/assets/service-disposal-navy-alpine.jpg";

const ServiceDisposal = () => {
  const features = [
    {
      icon: Recycle,
      title: "Umweltgerecht",
      description: "Fachgerechte Trennung und Recycling aller Materialien nach Schweizer Standards",
    },
    {
      icon: Shield,
      title: "Zertifiziert",
      description: "Lizenzierte Entsorgung mit Dokumentation und Entsorgungsnachweis",
    },
    {
      icon: Leaf,
      title: "Nachhaltig",
      description: "Wiederverwertung wo möglich, Spenden an soziale Einrichtungen",
    },
    {
      icon: FileCheck,
      title: "Transparent",
      description: "Detaillierte Aufstellung aller Entsorgungskosten vor Arbeitsbeginn",
    },
  ];

  const services = [
    {
      title: "Haushaltsauflösung",
      description: "Komplette Räumung von Wohnungen und Häusern inkl. Reinigung",
      price: "ab CHF 500",
    },
    {
      title: "Sperrmüll",
      description: "Abholung und Entsorgung von Möbeln und Grossgeräten",
      price: "ab CHF 150",
    },
    {
      title: "Elektrogeräte",
      description: "Fachgerechte Entsorgung von Elektro- und Elektronikgeräten",
      price: "ab CHF 50",
    },
    {
      title: "Bauabfälle",
      description: "Entsorgung von Renovierungsabfällen und Baumaterialien",
      price: "ab CHF 200",
    },
    {
      title: "Geschäftsauflösung",
      description: "Räumung von Büros, Praxen und Geschäftsräumen",
      price: "ab CHF 800",
    },
    {
      title: "Messie-Wohnung",
      description: "Diskrete und professionelle Räumung mit Spezialreinigung",
      price: "auf Anfrage",
    },
  ];

  const included = [
    "Kostenlose Vor-Ort-Besichtigung und Offerte",
    "Komplette Räumung aller Gegenstände",
    "Sortierung und fachgerechte Trennung",
    "Umweltgerechte Entsorgung",
    "Recycling aller verwertbaren Materialien",
    "Spenden brauchbarer Gegenstände",
    "Besenreine Übergabe",
    "Entsorgungsnachweis und Dokumentation",
  ];

  const process = [
    {
      step: "1",
      title: "Besichtigung",
      description: "Wir begutachten die Räumlichkeiten und erstellen ein detailliertes Angebot.",
    },
    {
      step: "2",
      title: "Sortierung",
      description: "Gemeinsam entscheiden wir, was entsorgt, gespendet oder aufbewahrt wird.",
    },
    {
      step: "3",
      title: "Räumung",
      description: "Unser Team räumt professionell und effizient alle Gegenstände.",
    },
    {
      step: "4",
      title: "Entsorgung",
      description: "Fachgerechte Trennung und umweltgerechte Entsorgung aller Materialien.",
    },
    {
      step: "5",
      title: "Reinigung",
      description: "Besenreine oder Grundreinigung nach Wunsch.",
    },
    {
      step: "6",
      title: "Übergabe",
      description: "Dokumentation der Entsorgung und Übergabe der sauberen Räume.",
    },
  ];

  return (
    <ServicePageWrapper currentLabel="Entsorgung">
      <ServiceSchema
        name="Entsorgung & Räumung"
        description="Professionelle Entrümpelung und Entsorgung in der Schweiz. Haushaltsauflösung, Sperrmüll, umweltgerechte Entsorgung mit Zertifikat."
        url="https://feierabend-umzuege.ch/plan/disposal"
        priceRange="CHF 50 - CHF 5000"
      />
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle relative overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Professionelle Entrümpelung"
            className="w-full h-full object-cover opacity-15"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-hero mb-4">
              <Trash2 className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-balance font-display">Entsorgung & Räumung</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professionelle Entrümpelung, Haushaltsauflösung und umweltgerechte Entsorgung. 
              Wir kümmern uns um alles – schnell, sauber und nachhaltig.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                  Kostenlose Offerte
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="tel:+41765681302">
                <Button size="lg" variant="outline">
                  <Phone className="mr-2 h-5 w-5" />
                  Anrufen
                </Button>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
              <Recycle className="h-3 w-3 inline mr-1" />
              Nachhaltig
            </span>
            <h2 className="text-balance font-display">Umweltgerechte Entsorgung</h2>
            <p className="text-xl text-muted-foreground">
              Wir setzen auf Nachhaltigkeit und verantwortungsvollen Umgang mit Ressourcen
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
              Services
            </span>
            <h2 className="text-balance font-display">Unsere Entsorgungsleistungen</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-6 hover-lift h-full flex flex-col">
                  <h3 className="text-xl font-semibold mb-2 font-display">{service.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">{service.description}</p>
                  <p className="text-lg font-bold text-alpine">{service.price}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance font-display">Ablauf</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {process.map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-6 h-full">
                  <div className="text-4xl font-bold text-alpine/30 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-2 font-display">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance font-display">Inklusive</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {included.map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <Card className="p-5 hover-lift">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-alpine flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{item}</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <Recycle className="h-16 w-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-balance mb-6 font-display">Räumung benötigt?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Kontaktieren Sie uns für eine kostenlose Besichtigung und ein 
                unverbindliches Angebot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
                    Kostenlose Offerte
                  </button>
                </Link>
                <a href="tel:+41765681302">
                  <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-colors">
                    <Phone className="inline mr-2 h-4 w-4" />
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

export default ServiceDisposal;
