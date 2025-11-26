import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, ArrowRight, Shield, Zap, Clock } from "lucide-react";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { ScrollReveal } from "@/components/ScrollReveal";
import { FAQAccordion } from "@/components/FAQAccordion";
import { InstantCalculator } from "@/components/home/InstantCalculator";

interface ServiceData {
  name: string;
  title: string;
  description: string;
  icon: string;
  priceRange: string;
  backgroundImage: string;
  serviceType: string;
}

const serviceDatabase: { [key: string]: ServiceData } = {
  umzug: {
    name: "Umzug",
    title: "Professionelle Umzüge in der Schweiz – kostenlos vergleichen",
    description: "Geprüfte Umzugsfirmen, faire Preise, sofort verfügbar",
    icon: "🚚",
    priceRange: "CHF 450–2'500",
    backgroundImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
    serviceType: "moving"
  },
  reinigung: {
    name: "Endreinigung",
    title: "Professionelle Endreinigung in der Schweiz – kostenlos vergleichen",
    description: "Geprüfte Reinigungsfirmen, faire Preise, sofort verfügbar",
    icon: "🧹",
    priceRange: "CHF 200–800",
    backgroundImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80",
    serviceType: "cleaning"
  },
  raeumung: {
    name: "Räumung",
    title: "Professionelle Räumungen in der Schweiz – kostenlos vergleichen",
    description: "Geprüfte Räumungsfirmen, faire Preise, sofort verfügbar",
    icon: "📦",
    priceRange: "CHF 300–1'500",
    backgroundImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80",
    serviceType: "clearance"
  },
  firmenumzug: {
    name: "Firmenumzug",
    title: "Professionelle Firmenumzüge in der Schweiz – kostenlos vergleichen",
    description: "Geprüfte Umzugsfirmen, faire Preise, sofort verfügbar",
    icon: "🏢",
    priceRange: "ab CHF 2'000",
    backgroundImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=80",
    serviceType: "office_moving"
  },
  entsorgung: {
    name: "Entsorgung",
    title: "Professionelle Entsorgung in der Schweiz – kostenlos vergleichen",
    description: "Geprüfte Entsorgungsfirmen, faire Preise, sofort verfügbar",
    icon: "♻️",
    priceRange: "CHF 150–600",
    backgroundImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920&q=80",
    serviceType: "disposal"
  },
  lagerung: {
    name: "Lagerung",
    title: "Professionelle Lagerung in der Schweiz – kostenlos vergleichen",
    description: "Geprüfte Lageranbieter, faire Preise, sofort verfügbar",
    icon: "📦",
    priceRange: "ab CHF 100/Monat",
    backgroundImage: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&q=80",
    serviceType: "storage"
  },
  transport: {
    name: "Transport",
    title: "Professionelle Transporte in der Schweiz – kostenlos vergleichen",
    description: "Geprüfte Transportfirmen, faire Preise, sofort verfügbar",
    icon: "🚛",
    priceRange: "CHF 80–400",
    backgroundImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    serviceType: "transport"
  }
};

const ServicePage = () => {
  const { service, city } = useParams<{ service?: string; city?: string }>();
  const serviceKey = service?.toLowerCase() || 'umzug';
  const serviceInfo = serviceDatabase[serviceKey] || serviceDatabase.umzug;

  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, [serviceInfo.serviceType, city]);

  const fetchCompanies = async () => {
    try {
      let query = supabase
        .from("companies")
        .select("*")
        .contains("service_types", [serviceInfo.serviceType])
        .order("rating", { ascending: false })
        .limit(6);

      if (city) {
        query = query.contains("service_areas", [city]);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Geprüfte Profis",
      description: "Nur verifizierte Anbieter mit echten Bewertungen"
    },
    {
      icon: CheckCircle2,
      title: "Schweizer Standards",
      description: "Qualität und Zuverlässigkeit aus der Schweiz"
    },
    {
      icon: Zap,
      title: "Einfach & schnell",
      description: "Offerten in Minuten statt Tagen erhalten"
    }
  ];

  const serviceFAQ = [
    {
      question: `Was kostet ${serviceInfo.name} in der Schweiz?`,
      answer: `Die Kosten variieren je nach Umfang und Region. Durchschnittlich liegen die Preise bei ${serviceInfo.priceRange}.`
    },
    {
      question: `Wie finde ich den besten Anbieter für ${serviceInfo.name}?`,
      answer: "Vergleichen Sie mehrere Offerten auf umzugscheck.ch. Alle Firmen sind geprüft und haben echte Kundenbewertungen."
    },
    {
      question: "Wie schnell erhalte ich Offerten?",
      answer: "In der Regel erhalten Sie innerhalb von 24 Stunden kostenlose Offerten von mehreren Anbietern."
    },
    {
      question: "Sind die Offerten wirklich kostenlos?",
      answer: "Ja, 100% kostenlos und unverbindlich. Sie zahlen nur, wenn Sie sich für einen Anbieter entscheiden."
    }
  ];

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceInfo.name,
    "description": serviceInfo.description,
    "provider": {
      "@type": "Organization",
      "name": "Umzugscheck.ch"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{serviceInfo.title} | Umzugscheck.ch</title>
        <meta name="description" content={`${serviceInfo.description}. ✓ Kostenlose Offerten ✓ Geprüfte Profis ✓ Faire Preise.`} />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-accent/90 to-primary/90 z-0" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url('${serviceInfo.backgroundImage}')` }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="text-7xl mb-6">{serviceInfo.icon}</div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {serviceInfo.title}
              </h1>

              <p className="text-xl md:text-2xl mb-10 text-white/90">
                {serviceInfo.description}
              </p>

              <Link to="/umzugsofferten">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-strong"
                >
                  Jetzt {serviceInfo.name} Offerten vergleichen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <main>
        {/* How it Works */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">
                  So funktioniert's
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { number: 1, title: "Anfrage stellen", description: "Beschreiben Sie Ihre Anforderungen in 2 Minuten" },
                    { number: 2, title: "Anbieter vergleichen", description: "Erhalten Sie kostenlose Offerten von geprüften Profis" },
                    { number: 3, title: "Beste Offerte wählen", description: "Entscheiden Sie sich für das beste Angebot" }
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="text-center p-6 hover:shadow-medium transition-shadow h-full">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                          {step.number}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Calculator */}
        <ScrollReveal>
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                  Preis berechnen
                </h2>
                <p className="text-lg text-muted-foreground text-center mb-12">
                  Kostenloses Angebot in wenigen Minuten
                </p>
                <InstantCalculator />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Top Providers */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Top Anbieter für {serviceInfo.name}
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {companies.map((company, index) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-strong transition-all">
                        <CardContent className="p-6">
                          <div className="text-center mb-4">
                            <div className="text-6xl mb-4">{company.logo}</div>
                            <h3 className="text-xl font-bold mb-2">{company.name}</h3>
                            
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                              <span className="text-2xl font-bold">{company.rating.toFixed(1)}</span>
                              <span className="text-sm text-muted-foreground">
                                ({company.review_count})
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                              {company.verified && (
                                <Badge className="bg-success/10 text-success border-success/30">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Verifiziert
                                </Badge>
                              )}
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                Versichert
                              </Badge>
                              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                <Clock className="h-3 w-3 mr-1" />
                                Express verfügbar
                              </Badge>
                            </div>

                            <p className="text-lg font-bold text-accent mb-4">
                              {serviceInfo.priceRange}
                            </p>
                          </div>

                          <Link to="/umzugsofferten">
                            <Button className="w-full">
                              Offerte anfragen
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </ScrollReveal>

        {/* Price Examples */}
        <ScrollReveal>
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Preisbeispiele für {serviceInfo.name}
              </h2>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Card className="p-6 text-center hover:shadow-medium transition-shadow">
                  <h3 className="text-xl font-bold mb-4">Klein</h3>
                  <p className="text-3xl font-bold text-accent mb-2">
                    {serviceInfo.priceRange.split('–')[0]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Basis-Service, kleine Wohnung
                  </p>
                </Card>

                <Card className="p-6 text-center hover:shadow-medium transition-shadow border-2 border-primary">
                  <Badge className="mb-2">Beliebt</Badge>
                  <h3 className="text-xl font-bold mb-4">Mittel</h3>
                  <p className="text-3xl font-bold text-accent mb-2">
                    {serviceInfo.priceRange}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Standard-Service, mittlere Wohnung
                  </p>
                </Card>

                <Card className="p-6 text-center hover:shadow-medium transition-shadow">
                  <h3 className="text-xl font-bold mb-4">Gross</h3>
                  <p className="text-3xl font-bold text-accent mb-2">
                    Auf Anfrage
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Premium-Service, große Objekte
                  </p>
                </Card>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Why Choose Us */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Warum umzugscheck?
              </h2>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                {whyChooseUs.map((reason, index) => {
                  const Icon = reason.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="text-center p-8 hover:shadow-strong transition-all h-full">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-medium mb-6">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
                        <p className="text-muted-foreground">{reason.description}</p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal>
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                  Häufige Fragen zu {serviceInfo.name}
                </h2>
                <FAQAccordion items={serviceFAQ} />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Final CTA */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-95" />
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-blob-reverse" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center text-white max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Jetzt kostenlose {serviceInfo.name}-Offerten erhalten
              </h2>
              <p className="text-lg md:text-xl mb-10 text-white/90">
                In nur 2 Minuten zur Offerte
              </p>
              <Link to="/umzugsofferten">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-strong"
                >
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm mt-6 text-white/80">
                ✓ 100% kostenlos  ✓ Geprüfte Profis  ✓ Schnelle Antwort
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default ServicePage;
