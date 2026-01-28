import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, HeartHandshake, Clock, Users, Phone, Heart, Home, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicePageWrapper from "@/components/ServicePageWrapper";
import ServiceSchema from "@/components/ServiceSchema";
import AnimatedSection from "@/components/AnimatedSection";
import seniorImage from "@/assets/service-senior-navy-alpine.jpg";

const ServiceSenior = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Mehr Zeit",
      description: "Wir nehmen uns die Zeit, die Sie brauchen. Kein Zeitdruck, kein Stress – alles in Ihrem Tempo.",
    },
    {
      icon: HeartHandshake,
      title: "Mit Herz",
      description: "Einfühlsam und verständnisvoll begleiten wir Sie durch diesen wichtigen Lebensabschnitt.",
    },
    {
      icon: Users,
      title: "Familie einbeziehen",
      description: "Gerne koordinieren wir mit Angehörigen, Betreuern und Pflegepersonal.",
    },
    {
      icon: Home,
      title: "Einrichtungshilfe",
      description: "Wir helfen beim Einrichten und sorgen dafür, dass Sie sich sofort wohlfühlen.",
    },
  ];

  const included = [
    "Einfühlsame persönliche Betreuung durch erfahrenes Team",
    "Zeitlich flexible Planung ohne jeden Zeitdruck",
    "Unterstützung beim Aussortieren und Entrümpeln",
    "Koordination mit Altersheim, Residenz oder Pflegeheim",
    "Möbelauswahl für die neue, oft kleinere Wohnung",
    "Professionelle und sorgfältige Verpackung",
    "Schonender Transport aller Gegenstände",
    "Einrichtung nach Ihren persönlichen Wünschen",
    "Fachgerechte Entsorgung nicht benötigter Gegenstände",
    "Kontakt zu sozialen Diensten und Hilfsorganisationen",
    "Nachbetreuung und Nachbesserungen nach dem Umzug",
    "Unterstützung bei Adressänderungen und Formalitäten",
  ];

  const faqs = [
    {
      q: "Können Angehörige beim Umzug dabei sein?",
      a: "Selbstverständlich! Wir koordinieren gerne mit der Familie und beziehen alle Beteiligten in die Planung ein. Oft ist es für Senioren beruhigend, wenn vertraute Personen anwesend sind.",
    },
    {
      q: "Was passiert mit Möbeln, die nicht mehr benötigt werden?",
      a: "Wir kümmern uns um die Entsorgung oder Spende nicht benötigter Gegenstände. Auf Wunsch vermitteln wir auch Kontakte zu Brockenhäusern oder organisieren den Verkauf wertvoller Stücke.",
    },
    {
      q: "Wie lange dauert ein Seniorenumzug?",
      a: "Das bestimmen Sie! Wir passen uns Ihrem Tempo an. Manche Umzüge dauern einen Tag, andere verteilen wir auf mehrere Termine – ganz wie es für Sie am angenehmsten ist.",
    },
    {
      q: "Bieten Sie auch Hilfe bei Behördengängen?",
      a: "Ja, wir unterstützen bei Adressänderungen, Ummeldungen und anderen Formalitäten. Gerne übernehmen wir diese Aufgaben für Sie oder helfen Ihnen dabei.",
    },
    {
      q: "Was kostet ein Seniorenumzug?",
      a: "Die Kosten hängen vom Umfang und den gewünschten Leistungen ab. Nach einer persönlichen Besichtigung erstellen wir Ihnen ein transparentes, faires Angebot ohne versteckte Kosten.",
    },
  ];

  const process = [
    {
      step: "1",
      title: "Erstes Gespräch",
      description: "Wir besuchen Sie zu Hause für ein unverbindliches Kennenlernen und besprechen Ihre Wünsche.",
    },
    {
      step: "2",
      title: "Gemeinsame Planung",
      description: "Zusammen mit Ihnen und ggf. Angehörigen planen wir jeden Schritt des Umzugs.",
    },
    {
      step: "3",
      title: "Aussortieren",
      description: "Wir helfen beim Entscheiden, was mitkommt und kümmern uns um den Rest.",
    },
    {
      step: "4",
      title: "Sanfter Umzug",
      description: "In Ihrem Tempo ziehen wir um – schonend, sorgfältig und mit viel Geduld.",
    },
    {
      step: "5",
      title: "Einrichtung",
      description: "Wir richten Ihre neue Wohnung ein, damit Sie sich sofort wohlfühlen.",
    },
    {
      step: "6",
      title: "Nachbetreuung",
      description: "Auch nach dem Umzug sind wir für Sie da, falls noch etwas angepasst werden muss.",
    },
  ];

  return (
    <ServicePageWrapper currentLabel="Seniorenumzug">
      <ServiceSchema
        name="Seniorenumzüge"
        description="Einfühlsame Umzugsbegleitung für Senioren. Mit Geduld, Sorgfalt und persönlicher Betreuung in Ihr neues Zuhause."
        url="https://feierabend-umzuege.ch/plan/senior"
        priceRange="CHF 1200 - CHF 4000"
      />
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-4">
                <HeartHandshake className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-balance font-display">Seniorenumzüge</h1>
              <p className="text-xl text-muted-foreground">
                Mit Herz, Zeit und Verständnis begleiten wir Senioren beim Umzug ins Altersheim, 
                betreutes Wohnen oder eine kleinere Wohnung. Einfühlsam, geduldig und professionell.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                    Beratungsgespräch
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
                src={seniorImage}
                alt="Seniorenumzug mit Feierabend Umzüge"
                className="w-full h-full object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-warm bg-warm/10 rounded-full">
              <Heart className="h-3 w-3 inline mr-1" />
              Mit Einfühlungsvermögen
            </span>
            <h2 className="text-balance font-display">Warum wir anders sind</h2>
            <p className="text-xl text-muted-foreground">
              Seniorenumzüge brauchen besondere Aufmerksamkeit und viel Einfühlungsvermögen
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              Ablauf
            </span>
            <h2 className="text-balance font-display">So begleiten wir Sie</h2>
            <p className="text-xl text-muted-foreground">
              Schritt für Schritt zu Ihrem neuen Zuhause – in Ihrem Tempo
            </p>
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
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
              <Shield className="h-3 w-3 inline mr-1" />
              Komplett-Service
            </span>
            <h2 className="text-balance font-display">Unser Rundum-Service</h2>
            <p className="text-xl text-muted-foreground">
              Von der ersten Planung bis zum letzten Bild an der Wand
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
                "Das Team von Feierabend war unglaublich geduldig und einfühlsam. Sie haben meiner 
                Mutter den Umzug ins Altersheim so leicht wie möglich gemacht. Jeder Gegenstand wurde 
                mit grösster Sorgfalt behandelt. Herzlichen Dank!"
              </p>
              <p className="font-semibold">Thomas S.</p>
              <p className="text-sm text-muted-foreground">Umzug seiner Mutter ins Pflegeheim Zürich</p>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <HeartHandshake className="h-16 w-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-balance mb-6 font-display">Brauchen Sie Unterstützung?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Rufen Sie uns an für ein unverbindliches Beratungsgespräch. Wir sind für Sie da – 
                mit Zeit, Geduld und Verständnis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
                    Kontakt aufnehmen
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

export default ServiceSenior;
