import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Piano, Shield, Users, Truck, Phone, Award, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicePageWrapper from "@/components/ServicePageWrapper";
import ServiceSchema from "@/components/ServiceSchema";
import AnimatedSection from "@/components/AnimatedSection";
import pianoImage from "@/assets/service-piano-navy-alpine.jpg";

const ServicePiano = () => {
  const features = [
    {
      icon: Shield,
      title: "Vollversicherung",
      description: "Premium-Versicherungsschutz für Ihr wertvolles Instrument ohne Selbstbehalt",
    },
    {
      icon: Users,
      title: "Spezialistenteam",
      description: "Geschulte Klaviertransporteure mit jahrelanger Erfahrung",
    },
    {
      icon: Truck,
      title: "Spezialequipment",
      description: "Klimatisierte Fahrzeuge mit Luftfederung und Spezialhebesystemen",
    },
    {
      icon: Award,
      title: "Zertifiziert",
      description: "Von Steinway & Sons und Bösendorfer empfohlener Transportservice",
    },
  ];

  const instruments = [
    { name: "Klaviere", price: "ab CHF 350" },
    { name: "Flügel", price: "ab CHF 650" },
    { name: "Konzertflügel", price: "ab CHF 1'200" },
    { name: "Digitalpianos", price: "ab CHF 150" },
    { name: "Cembalo", price: "ab CHF 500" },
    { name: "Harmonium/Orgel", price: "ab CHF 400" },
  ];

  const included = [
    "Kostenlose Vor-Ort-Besichtigung",
    "Professionelle Schutzverpackung",
    "Spezialhebesysteme für schwere Instrumente",
    "Klimatisierter Transport",
    "Aufstellung und Nivellierung am Zielort",
    "Stimm-Empfehlung nach Transport",
    "Premium-Vollversicherung inklusive",
    "Nachkontrolle nach 24 Stunden",
  ];

  const process = [
    {
      step: "1",
      title: "Besichtigung",
      description: "Wir begutachten Ihr Instrument und die Zugangssituation vor Ort.",
    },
    {
      step: "2",
      title: "Angebot",
      description: "Sie erhalten ein detailliertes Festpreisangebot ohne versteckte Kosten.",
    },
    {
      step: "3",
      title: "Vorbereitung",
      description: "Am Transporttag wird Ihr Instrument sorgfältig verpackt und gesichert.",
    },
    {
      step: "4",
      title: "Transport",
      description: "Schonender Transport mit luftgefederten Spezialfahrzeugen.",
    },
    {
      step: "5",
      title: "Aufstellung",
      description: "Präzise Platzierung und Nivellierung am neuen Standort.",
    },
    {
      step: "6",
      title: "Nachbetreuung",
      description: "Kontrolle nach 24h und Stimmer-Empfehlung für optimalen Klang.",
    },
  ];

  return (
    <ServicePageWrapper currentLabel="Klaviertransport">
      <ServiceSchema
        name="Klaviertransport & Flügeltransport"
        description="Professioneller Klaviertransport in der Schweiz. Spezialistenteam für Klaviere, Flügel und Konzertflügel. Vollversichert und schonend."
        url="https://feierabend-umzuege.ch/plan/piano"
        priceRange="CHF 150 - CHF 2000"
      />
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-4 mx-auto lg:mx-0">
                <Piano className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-balance font-display">Klaviertransport</h1>
              <p className="text-xl text-muted-foreground">
                Ihr Klavier oder Flügel verdient höchste Sorgfalt. Mit Spezialequipment, 
                geschultem Team und Premium-Versicherung transportieren wir Ihr kostbares 
                Instrument sicher ans Ziel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/contact">
                  <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                    Kostenlose Besichtigung
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
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-strong">
              <img
                src={pianoImage}
                alt="Klaviertransport Feierabend Umzüge"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-warm text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Award className="h-4 w-4" />
                Spezialisiert
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
              Spezialisiert
            </span>
            <h2 className="text-balance font-display">Warum Feierabend für Ihren Klaviertransport?</h2>
            <p className="text-xl text-muted-foreground">
              Über 500 erfolgreich transportierte Klaviere und Flügel
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
              Preisübersicht
            </span>
            <h2 className="text-balance font-display">Transportpreise</h2>
            <p className="text-xl text-muted-foreground">
              Faire Festpreise für jeden Instrumententyp
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {instruments.map((instrument, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-6 hover-lift text-center">
                  <h3 className="text-xl font-semibold mb-2 font-display">{instrument.name}</h3>
                  <p className="text-2xl font-bold text-alpine">{instrument.price}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3}>
            <Card className="mt-8 p-6 bg-warm/10 border-warm/30 max-w-4xl mx-auto">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warm flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Wichtig: Exakte Preise nach Besichtigung</h4>
                  <p className="text-sm text-muted-foreground">
                    Die angegebenen Preise sind Richtwerte. Der endgültige Festpreis hängt von 
                    Zugangssituation, Stockwerk und Distanz ab. Nach der kostenlosen Besichtigung 
                    erhalten Sie ein verbindliches Angebot.
                  </p>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
              Inklusive
            </span>
            <h2 className="text-balance font-display">Im Preis enthalten</h2>
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

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
              Ablauf
            </span>
            <h2 className="text-balance font-display">So transportieren wir Ihr Instrument</h2>
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
                "Mein Steinway Flügel wurde mit unglaublicher Sorgfalt transportiert. Das Team 
                wusste genau, was zu tun ist. Absolut empfehlenswert für jeden Musikliebhaber!"
              </p>
              <p className="font-semibold">Prof. M. Wagner</p>
              <p className="text-sm text-muted-foreground">Konzertflügel-Transport Zürich nach Luzern</p>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <Piano className="h-16 w-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-balance mb-6 font-display">Ihr Instrument sicher transportiert</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Vereinbaren Sie jetzt eine kostenlose Besichtigung und erhalten Sie 
                Ihr verbindliches Festpreisangebot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
                    Kostenlose Besichtigung
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

export default ServicePiano;
