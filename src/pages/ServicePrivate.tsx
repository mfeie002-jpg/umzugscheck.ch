import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicePageWrapper from "@/components/ServicePageWrapper";
import ServiceSchema from "@/components/ServiceSchema";
import AnimatedSection from "@/components/AnimatedSection";
import privateImage from "@/assets/service-private-new.jpg";

const ServicePrivate = () => {
  const included = [
    "Persönliche Beratung und Besichtigung vor Ort",
    "Detaillierte Planung und Zeitplan",
    "Professionelles Verpackungsmaterial",
    "Fachgerechter Transport aller Güter",
    "Möbelmontage und -demontage",
    "Aufstellen und Platzieren am neuen Standort",
    "Entsorgung von Verpackungsmaterial",
    "Vollständige Versicherung",
  ];

  const process = [
    {
      step: "1",
      title: "Erstberatung",
      description: "Kostenlose Besichtigung und Bedarfsanalyse bei Ihnen zu Hause.",
    },
    {
      step: "2",
      title: "Angebot",
      description: "Transparentes, detailliertes Angebot ohne versteckte Kosten.",
    },
    {
      step: "3",
      title: "Planung",
      description: "Gemeinsame Abstimmung von Terminen und Ablauf.",
    },
    {
      step: "4",
      title: "Verpackung",
      description: "Professionelles Verpacken Ihres gesamten Hausrats.",
    },
    {
      step: "5",
      title: "Transport",
      description: "Sicherer Transport zu Ihrem neuen Zuhause.",
    },
    {
      step: "6",
      title: "Einrichten",
      description: "Aufstellen und Montage nach Ihren Wünschen.",
    },
  ];

  const addons = [
    {
      title: "Endreinigung",
      description: "Professionelle Reinigung der alten Wohnung nach dem Umzug.",
    },
    {
      title: "Malerarbeiten",
      description: "Renovierung und Malerarbeiten in der alten oder neuen Wohnung.",
    },
    {
      title: "Zwischenlagerung",
      description: "Sichere Lagerung Ihres Hausrats in klimatisierten Räumen.",
    },
    {
      title: "Klaviertransport",
      description: "Spezialisierter Transport für Klaviere und Flügel.",
    },
  ];

  return (
    <ServicePageWrapper currentLabel="Privatumzug">
      <ServiceSchema
        name="Privatumzüge"
        description="Professionelle Privatumzüge in der Schweiz. Ihr Zuhause ist in sicheren Händen. Wir behandeln jeden Gegenstand mit der Sorgfalt, die er verdient."
        url="https://feierabend-umzuege.ch/plan/private"
        priceRange="CHF 800 - CHF 3500"
      />
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-4">
                <Home className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-balance">Privatumzüge</h1>
              <p className="text-xl text-muted-foreground">
                Ihr Zuhause ist in sicheren Händen. Wir behandeln jeden Gegenstand mit der Sorgfalt, 
                die er verdient – vom ersten Karton bis zum letzten Möbelstück.
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
                src={privateImage}
                alt="Privatumzug"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance">Was ist im Service enthalten?</h2>
            <p className="text-xl text-muted-foreground">
              Unser Komplettservice für Ihren sorgenfreien Privatumzug
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {included.map((item, index) => (
              <Card key={index} className="p-6 hover-lift">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-alpine flex-shrink-0 mt-0.5" />
                  <p>{item}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance">So läuft Ihr Privatumzug ab</h2>
            <p className="text-xl text-muted-foreground">
              In sechs übersichtlichen Schritten zu Ihrem neuen Zuhause
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {process.map((step, index) => (
              <Card key={index} className="p-6">
                <div className="text-4xl font-bold text-alpine/30 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance">Zusatzleistungen</h2>
            <p className="text-xl text-muted-foreground">
              Erweitern Sie Ihren Umzugsservice nach Bedarf
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {addons.map((addon, index) => (
              <Card key={index} className="p-6 hover-lift text-center">
                <h3 className="font-semibold mb-2">{addon.title}</h3>
                <p className="text-sm text-muted-foreground">{addon.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-3xl mx-auto p-12 text-center">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-6 h-6 text-warm fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-xl text-muted-foreground mb-6 italic">
              "Unser Umzug war dank Feierabend Umzüge eine positive Erfahrung. Das Team war 
              professionell, freundlich und unglaublich sorgfältig. Würden wir jederzeit wieder buchen!"
            </p>
            <p className="font-semibold">Familie Müller</p>
            <p className="text-sm text-muted-foreground">Umzug von Zürich nach Winterthur</p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 bg-gradient-hero text-primary-foreground text-center">
            <h2 className="text-balance mb-6">Bereit für Ihren Privatumzug?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Kontaktieren Sie uns für eine kostenlose Beratung und ein unverbindliches Angebot.
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
          </Card>
        </div>
      </section>

      <Footer />
    </ServicePageWrapper>
  );
};

export default ServicePrivate;
