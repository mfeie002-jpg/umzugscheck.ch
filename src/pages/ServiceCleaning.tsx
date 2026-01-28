import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Sparkles, Shield, Clock, Award, Phone, Home, Building, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicePageWrapper from "@/components/ServicePageWrapper";
import ServiceSchema from "@/components/ServiceSchema";
import AnimatedSection from "@/components/AnimatedSection";
import heroImage from "@/assets/service-cleaning-navy-alpine.jpg";

const ServiceCleaning = () => {
  const features = [
    {
      icon: Award,
      title: "Abnahmegarantie",
      description: "Wir garantieren die erfolgreiche Abnahme durch Ihre Verwaltung",
    },
    {
      icon: Shield,
      title: "Versichert",
      description: "Vollständiger Versicherungsschutz für alle Reinigungsarbeiten",
    },
    {
      icon: Clock,
      title: "Flexibel",
      description: "Kurzfristige Termine möglich – auch am Wochenende",
    },
    {
      icon: Sparkles,
      title: "Professionell",
      description: "Geschultes Personal mit professioneller Ausrüstung",
    },
  ];

  const services = [
    {
      title: "Endreinigung Standard",
      description: "Besenreine Übergabe nach Mietvertrag",
      price: "ab CHF 250",
      includes: ["Alle Böden gereinigt", "Fenster innen", "Küche komplett", "Badezimmer"],
    },
    {
      title: "Endreinigung Plus",
      description: "Gründliche Reinigung inkl. schwer zugänglicher Stellen",
      price: "ab CHF 400",
      includes: ["Alles aus Standard", "Fenster innen & aussen", "Backofen & Kühlschrank", "Jalousien/Storen"],
    },
    {
      title: "Endreinigung Premium",
      description: "Perfekte Reinigung mit Abnahmegarantie",
      price: "ab CHF 600",
      includes: ["Alles aus Plus", "Teppichreinigung", "Abnahmegarantie", "Nachbesserung gratis"],
      popular: true,
    },
  ];

  const included = [
    "Reinigung aller Böden (Parkett, Fliesen, Laminat)",
    "Fensterreinigung innen und aussen",
    "Küche komplett (inkl. Geräte)",
    "Badezimmer und WC gründlich gereinigt",
    "Türen, Rahmen und Sockelleisten",
    "Einbauschränke innen und aussen",
    "Balkon/Terrasse gefegt",
    "Keller und Estrich besenrein",
  ];

  const faqs = [
    {
      q: "Was ist, wenn die Abnahme nicht klappt?",
      a: "Mit unserem Premium-Paket garantieren wir die erfolgreiche Abnahme. Sollte die Verwaltung Mängel feststellen, beheben wir diese kostenlos.",
    },
    {
      q: "Wie kurzfristig kann ich buchen?",
      a: "In der Regel können wir Termine innerhalb von 2-3 Tagen anbieten. In dringenden Fällen auch kurzfristiger – rufen Sie uns einfach an.",
    },
    {
      q: "Muss ich während der Reinigung anwesend sein?",
      a: "Nein, das ist nicht nötig. Sie können uns die Schlüssel übergeben und wir sperren am Ende ab. Fotos der gereinigten Wohnung senden wir Ihnen zu.",
    },
  ];

  return (
    <ServicePageWrapper currentLabel="Reinigung">
      <ServiceSchema
        name="Endreinigung & Umzugsreinigung"
        description="Professionelle Endreinigung für Ihre Wohnungsübergabe in der Schweiz. Mit Abnahmegarantie für erfolgreiche Wohnungsübergabe."
        url="https://feierabend-umzuege.ch/plan/cleaning"
        priceRange="CHF 250 - CHF 1500"
      />
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle relative overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Professionelle Endreinigung"
            className="w-full h-full object-cover opacity-15"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-hero mb-4">
              <Sparkles className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-balance font-display">Endreinigung</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professionelle Umzugsreinigung mit Abnahmegarantie. Wir sorgen dafür, 
              dass Ihre Wohnungsübergabe reibungslos verläuft – garantiert.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                  Offerte anfragen
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
              Vorteile
            </span>
            <h2 className="text-balance font-display">Warum unsere Endreinigung?</h2>
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
              Pakete
            </span>
            <h2 className="text-balance font-display">Unsere Reinigungspakete</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className={`p-8 hover-lift h-full flex flex-col relative ${service.popular ? 'border-2 border-alpine shadow-lg' : ''}`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-alpine text-white text-xs px-3 py-1 rounded-full font-semibold">
                      Empfohlen
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2 font-display">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <p className="text-2xl font-bold text-alpine mb-6">{service.price}</p>
                  <ul className="space-y-2 flex-grow">
                    {service.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-alpine flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="mt-6">
                    <Button className={`w-full ${service.popular ? 'bg-alpine hover:bg-alpine/90' : ''}`} variant={service.popular ? 'default' : 'outline'}>
                      Jetzt buchen
                    </Button>
                  </Link>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance font-display">Was wird gereinigt?</h2>
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
          <AnimatedSection className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-8 text-center font-display">Häufige Fragen</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <Card className="p-6">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
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
                "Die Abnahme lief perfekt! Die Verwaltung war begeistert und wir hatten 
                keine Beanstandungen. Super Team, sehr gründlich!"
              </p>
              <p className="font-semibold">Familie Schneider</p>
              <p className="text-sm text-muted-foreground">Endreinigung 4.5-Zimmer-Wohnung Zürich</p>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <Key className="h-16 w-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-balance mb-6 font-display">Stressfreie Wohnungsübergabe</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Buchen Sie jetzt Ihre Endreinigung und geniessen Sie eine 
                reibungslose Wohnungsübergabe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
                    Jetzt buchen
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

export default ServiceCleaning;
