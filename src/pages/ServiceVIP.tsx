import { Link } from "react-router-dom";
import { ArrowRight, Crown, Lock, Star, Clock, Shield, Phone, Gem, Eye, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicePageWrapper from "@/components/ServicePageWrapper";
import ServiceSchema from "@/components/ServiceSchema";
import AnimatedSection from "@/components/AnimatedSection";
import vipImage from "@/assets/service-vip-navy-alpine.jpg";

const ServiceVIP = () => {
  const features = [
    {
      icon: Crown,
      title: "Persönlicher Manager",
      description: "Ihr dedizierter Ansprechpartner koordiniert jeden Aspekt Ihres Umzugs und steht Ihnen 24/7 zur Verfügung",
    },
    {
      icon: Lock,
      title: "Absolute Diskretion",
      description: "Höchste Vertraulichkeit und Privatsphäre garantiert – alle Mitarbeiter unterliegen strengster Geheimhaltung",
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Umzüge zu jeder Tages- und Nachtzeit, auch an Feiertagen – flexibel nach Ihren Wünschen",
    },
    {
      icon: Star,
      title: "White-Glove Service",
      description: "Höchste Qualitätsstandards und Samthandschuhe für Ihre wertvollsten Besitztümer",
    },
    {
      icon: Shield,
      title: "Premium Versicherung",
      description: "Umfassender Vollkaskoschutz für Kunstwerke, Antiquitäten und Luxusgüter ohne Limit",
    },
    {
      icon: Gem,
      title: "Exklusive Partner",
      description: "Zugang zu unserem Netzwerk aus Innenarchitekten, Kunstexperten und Concierge-Services",
    },
  ];

  const services = [
    {
      title: "Vorab-Services",
      items: [
        "Persönliche Beratung bei Ihnen zu Hause zu Ihrer Wunschzeit",
        "Detaillierte Inventarisierung mit Fotodokumentation",
        "Koordination mit Architekten, Innenarchitekten und Designern",
        "Organisation von Handwerkern und Renovierungen",
        "Grundrissplanung und 3D-Visualisierung der neuen Räume",
      ],
    },
    {
      title: "Premium Verpackung",
      items: [
        "Massgeschneiderte Holzkisten für Kunstwerke und Antiquitäten",
        "Klimakontrollierte Verpackung für empfindliche Gegenstände",
        "Spezieller Schutz für Designer-Möbel und Luxusgüter",
        "Säurefreies Verpackungsmaterial für Textilien und Dokumente",
        "Dokumentation jedes einzelnen verpackten Gegenstands",
      ],
    },
    {
      title: "Transport & Handling",
      items: [
        "Separate, klimatisierte Fahrzeuge für wertvolle Gegenstände",
        "GPS-Tracking in Echtzeit für volle Transparenz",
        "Persönliche Begleitung während des gesamten Transports",
        "Luftgefederte Spezialfahrzeuge für erschütterungsfreien Transport",
        "Bewachter Transport auf Wunsch",
      ],
    },
    {
      title: "Einrichtung & Vollendung",
      items: [
        "Präzise Platzierung nach detailliertem Grundriss",
        "Installation von Kunstwerken durch zertifizierte Spezialisten",
        "Styling und finale Einrichtung nach Ihren Wünschen",
        "Endabnahme mit persönlicher Begehung",
        "Nachbesserungen und Feinjustierungen inklusive",
      ],
    },
    {
      title: "Zusatzleistungen",
      items: [
        "Haustierbetreuung während des Umzugs",
        "Temporäre Unterkunft in Premium-Hotels organisiert",
        "Umzugsbegleitung und Betreuung für die ganze Familie",
        "Internationale Koordination bei Auslandsumzügen",
        "Verbindung zu exklusiven Concierge-Partnern",
        "Weinkeller-Transport mit Klimakontrolle",
      ],
    },
  ];

  const testimonials = [
    {
      quote: "Der diskreteste und professionellste Umzugsservice, den ich je erlebt habe. Meine Kunstsammlung wurde mit höchster Sorgfalt behandelt.",
      author: "Privatkunde",
      location: "Zürich Goldküste",
    },
    {
      quote: "Unser Umzug von der Schweiz nach Monaco war makellos. Jedes Detail wurde perfekt koordiniert.",
      author: "Familie M.",
      location: "Internationaler Umzug",
    },
  ];

  return (
    <ServicePageWrapper currentLabel="VIP Service">
      <ServiceSchema
        name="VIP Premium Umzugsservice"
        description="Exklusiver Premium-Umzugsservice für höchste Ansprüche. Diskretion, höchste Qualität und persönliche 24/7 Betreuung."
        url="https://feierabend-umzuege.ch/plan/vip"
        priceRange="CHF 5000 - CHF 50000"
      />
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-warm rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                <Crown className="h-8 w-8" />
              </div>
              <h1 className="text-balance font-display">VIP Premium Service</h1>
              <p className="text-xl opacity-90">
                Exklusiver Umzugsservice für höchste Ansprüche. Diskret, luxuriös und 
                massgeschneidert nach Ihren individuellen Wünschen – ohne Kompromisse.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg" variant="secondary" className="group">
                    Persönliches Angebot
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="tel:+41765681302">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary">
                    <Phone className="mr-2 h-5 w-5" />
                    Direkter Kontakt
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-strong">
              <img
                src={vipImage}
                alt="VIP Premium Umzugsservice"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                <Crown className="h-4 w-4 text-warm" />
                <span className="text-sm font-semibold text-foreground">Premium</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-warm bg-warm/10 rounded-full">
              <Star className="h-3 w-3 inline mr-1" />
              Exklusiv
            </span>
            <h2 className="text-balance font-display">Premium Features</h2>
            <p className="text-xl text-muted-foreground">
              Service auf höchstem Niveau – für Kunden mit höchsten Ansprüchen
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-8 hover-lift h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-hero mb-6">
                    <feature.icon className="h-7 w-7 text-primary-foreground" />
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
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
              Leistungen
            </span>
            <h2 className="text-balance font-display">Unser VIP-Service umfasst</h2>
            <p className="text-xl text-muted-foreground">
              Umfassende Betreuung von der ersten Idee bis zum letzten Detail
            </p>
          </AnimatedSection>

          <div className="max-w-5xl mx-auto space-y-6">
            {services.map((service, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className={`p-8 ${index === services.length - 1 ? 'bg-gradient-hero text-primary-foreground' : ''}`}>
                  <h3 className="text-xl font-semibold mb-4 font-display">{service.title}</h3>
                  <ul className="space-y-3">
                    {service.items.map((item, idx) => (
                      <li key={idx} className={`flex items-start gap-3 ${index === services.length - 1 ? 'opacity-90' : 'text-muted-foreground'}`}>
                        <span className={index === services.length - 1 ? 'text-white' : 'text-alpine'}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
                <Eye className="h-3 w-3 inline mr-1" />
                Vertraulich
              </span>
              <h2 className="text-balance font-display">Diskretion garantiert</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Alle unsere VIP-Mitarbeiter unterliegen strengster Vertraulichkeitserklärung. 
                Ihre Privatsphäre ist uns heilig.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <Card className="p-8">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-warm fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.3}>
              <Card className="mt-8 p-8 text-center bg-muted/50">
                <p className="text-muted-foreground italic text-lg">
                  "Unser VIP-Service richtet sich an Kunden, die höchste Qualität, absolute Diskretion 
                  und individuellen Service erwarten. Wir erfüllen Ihre Wünsche – auch die aussergewöhnlichen."
                </p>
                <p className="mt-4 font-semibold">– Ihr Feierabend VIP-Team</p>
              </Card>
            </AnimatedSection>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-alpine rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Crown className="h-16 w-16 mx-auto opacity-80" />
              <h2 className="text-balance font-display">Interessiert am VIP-Service?</h2>
              <p className="text-xl opacity-90">
                Kontaktieren Sie uns für ein persönliches, vertrauliches Beratungsgespräch. 
                Gerne besuchen wir Sie auch diskret vor Ort.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link to="/contact">
                  <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
                    Persönliches Angebot anfragen
                  </button>
                </Link>
                <a href="tel:+41765681302">
                  <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-colors">
                    <Phone className="inline mr-2 h-4 w-4" />
                    Direkter Kontakt
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

export default ServiceVIP;
