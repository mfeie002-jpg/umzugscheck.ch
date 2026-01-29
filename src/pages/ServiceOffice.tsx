import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Building2, Clock, Shield, Briefcase, Phone, Users, Server, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicePageWrapper from "@/components/ServicePageWrapper";
import ServiceSchema from "@/components/ServiceSchema";
import AnimatedSection from "@/components/AnimatedSection";
import officeImage from "@/assets/service-office-navy-alpine.jpg";

const ServiceOffice = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Minimale Ausfallzeit",
      description: "Umzug über Wochenende oder nachts – Ihr Geschäft läuft weiter",
    },
    {
      icon: Shield,
      title: "Versichert & Zertifiziert",
      description: "Vollständiger Versicherungsschutz für Ihre Büroeinrichtung",
    },
    {
      icon: Briefcase,
      title: "Projektmanagement",
      description: "Ihr persönlicher Umzugsmanager koordiniert alle Details",
    },
  ];

  const included = [
    "Detaillierte Vorplanung mit Projektmanager",
    "Wochenend- oder Nachtumzüge möglich",
    "Professioneller IT-Equipment Transport",
    "Büromöbel-Demontage und -Montage",
    "Archivumzug mit Nummerierungssystem",
    "Etikettierung aller Gegenstände",
    "Sicherer Transport sensibler Daten",
    "Entsorgung alter Büromöbel",
    "Vollversicherung aller Güter",
    "Koordination mit Hausverwaltung",
  ];

  const process = [
    {
      step: "1",
      title: "Bedarfsanalyse",
      description: "Vor-Ort Besichtigung und detaillierte Planung mit Ihrem Team.",
    },
    {
      step: "2",
      title: "Projektplan",
      description: "Individueller Zeitplan mit minimalem Einfluss auf Ihren Betrieb.",
    },
    {
      step: "3",
      title: "Vorbereitung",
      description: "Etikettierung und Systematisierung für reibungslosen Ablauf.",
    },
    {
      step: "4",
      title: "Umzug",
      description: "Professionelle Durchführung nach Plan, oft über Wochenende.",
    },
    {
      step: "5",
      title: "Installation",
      description: "Aufbau und Platzierung nach Ihrem Büroplan.",
    },
    {
      step: "6",
      title: "Nachkontrolle",
      description: "Gemeinsame Abnahme und Sicherstellung Ihrer Zufriedenheit.",
    },
  ];

  return (
    <ServicePageWrapper currentLabel="Büroumzug">
      <ServiceSchema
        name="Büroumzüge"
        description="Effiziente Büro- und Firmenumzüge mit minimaler Ausfallzeit. Professionelle Planung und Durchführung für Ihr Unternehmen."
        url="https://feierabend-umzuege.ch/plan/office"
        priceRange="CHF 1500 - CHF 15000"
      />
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-4 mx-auto lg:mx-0">
                <Building2 className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-balance">Büroumzüge</h1>
              <p className="text-xl text-muted-foreground">
                Minimale Ausfallzeit, maximale Effizienz. Wir planen und koordinieren Ihren 
                Geschäftsumzug so, dass Ihr Betrieb praktisch unterbrechungsfrei weiterläuft.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
                src={officeImage}
                alt="Büroumzug"
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
              Vorteile
            </span>
            <h2 className="text-balance font-display">Warum Feierabend für Ihren Büroumzug?</h2>
            <p className="text-xl text-muted-foreground">
              Erfahrung und Professionalität für reibungslose Geschäftsumzüge
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
              <Card className="p-8 text-center hover-lift h-full">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-6">
                  <benefit.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3 font-display">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
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
              <FileText className="h-3 w-3 inline mr-1" />
              Leistungen
            </span>
            <h2 className="text-balance font-display">Komplettservice für Büroumzüge</h2>
            <p className="text-xl text-muted-foreground">
              Von der Planung bis zur Inbetriebnahme – alles aus einer Hand
            </p>
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

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-warm bg-warm/10 rounded-full">
              Ablauf
            </span>
            <h2 className="text-balance font-display">Ablauf Ihres Büroumzugs</h2>
            <p className="text-xl text-muted-foreground">
              Strukturiert, effizient und perfekt koordiniert
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {process.map((step, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-6 h-full">
                  <div className="text-4xl font-bold text-alpine/30 mb-4">{step.step}</div>
                  <h3 className="text-xl font-semibold mb-2 font-display">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
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
                "Unser Büroumzug über das Wochenende war perfekt organisiert. Am Montag konnten wir 
                pünktlich weiterarbeiten. Absolut professionell!"
              </p>
              <p className="font-semibold">TechStart AG</p>
              <p className="text-sm text-muted-foreground">Büroumzug Zürich, 45 Arbeitsplätze</p>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <Building2 className="h-16 w-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-balance mb-6 font-display">Ihr Büroumzug steht an?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Kontaktieren Sie uns für eine kostenlose Bedarfsanalyse und ein massgeschneidertes Angebot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
                    Jetzt Offerte anfragen
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

export default ServiceOffice;
