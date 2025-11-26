import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, CheckCircle2, Shield, Clock, TrendingUp, ArrowRight, Users, Zap, Award, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { Navigation } from "@/components/Navigation";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { generateServiceSchema, generateBreadcrumbSchema, injectSchema } from "@/lib/schema-markup";

interface Company {
  id: string;
  name: string;
  logo: string;
  rating: number;
  review_count: number;
  price_level: string;
  services: string[];
  service_areas: string[];
  verified: boolean;
}

// City data mapping with price ranges
const cityData: { [key: string]: { name: string; canton: string; priceRanges: any } } = {
  zuerich: {
    name: "Zürich",
    canton: "Zürich",
    priceRanges: {
      oneRoom: { min: 450, max: 850 },
      twoThreeRooms: { min: 1200, max: 2200 },
      fourPlusRooms: { min: 2500, max: 4000 },
      office: { min: 3000, max: 6000 }
    }
  },
  bern: {
    name: "Bern",
    canton: "Bern",
    priceRanges: {
      oneRoom: { min: 400, max: 800 },
      twoThreeRooms: { min: 1100, max: 2000 },
      fourPlusRooms: { min: 2300, max: 3800 },
      office: { min: 2800, max: 5500 }
    }
  },
  basel: {
    name: "Basel",
    canton: "Basel-Stadt",
    priceRanges: {
      oneRoom: { min: 420, max: 820 },
      twoThreeRooms: { min: 1150, max: 2100 },
      fourPlusRooms: { min: 2400, max: 3900 },
      office: { min: 2900, max: 5800 }
    }
  },
  luzern: {
    name: "Luzern",
    canton: "Luzern",
    priceRanges: {
      oneRoom: { min: 380, max: 750 },
      twoThreeRooms: { min: 1000, max: 1900 },
      fourPlusRooms: { min: 2200, max: 3600 },
      office: { min: 2600, max: 5200 }
    }
  }
};

const ZurichMovers = () => {
  const { city } = useParams<{ city?: string }>();
  const cityKey = city?.toLowerCase() || 'zuerich';
  const cityInfo = cityData[cityKey] || cityData.zuerich;

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");

  useEffect(() => {
    fetchCompanies();
    injectSchemaData();
  }, [cityInfo.name]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .contains("service_areas", [cityInfo.name])
        .order("rating", { ascending: false })
        .limit(20);

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const injectSchemaData = () => {
    const schemas = [
      generateServiceSchema(
        `Umzugsfirmen ${cityInfo.name}`,
        `Die besten Umzugsfirmen in ${cityInfo.name} vergleichen. Kostenlose Offerten von geprüften lokalen Profis.`,
        `CHF ${cityInfo.priceRanges.oneRoom.min}-${cityInfo.priceRanges.fourPlusRooms.max}`
      ),
      generateBreadcrumbSchema([
        { name: "Startseite", url: "https://umzugscheck.ch" },
        { name: cityInfo.name, url: `https://umzugscheck.ch/${cityKey}` },
        { name: "Umzugsfirmen", url: `https://umzugscheck.ch/${cityKey}/umzugsfirmen` }
      ])
    ];
    injectSchema(schemas);
  };

  const displayedCompanies = showAll ? companies : companies.slice(0, 5);

  const localAdvantages = [
    {
      icon: Clock,
      title: `Schnelle Terminverfügbarkeit in ${cityInfo.name}`,
      description: "Lokale Umzugsfirmen können flexibel auf Ihre Terminwünsche reagieren"
    },
    {
      icon: Shield,
      title: "Regionale Preisstransparenz",
      description: `Faire Preise für ${cityInfo.name} – keine versteckten Kosten`
    },
    {
      icon: Users,
      title: "Erfahrene Teams in der Umgebung",
      description: `Professionelle Umzugshelfer mit lokaler Expertise in ${cityInfo.name}`
    }
  ];

  const localReviews = [
    {
      name: "Sarah M.",
      district: `${cityInfo.name} Zentrum`,
      rating: 5,
      text: `Super schneller Umzug innerhalb von ${cityInfo.name}! Das Team war pünktlich und sehr professionell.`
    },
    {
      name: "Marco B.",
      district: `${cityInfo.name} Nord`,
      rating: 5,
      text: "Preis-Leistung top! Haben mehrere Angebote verglichen und das beste für unseren Umzug gefunden."
    },
    {
      name: "Julia K.",
      district: `${cityInfo.name} Ost`,
      rating: 5,
      text: "Unkompliziert, schnell und freundlich. Würde ich jederzeit weiterempfehlen!"
    }
  ];

  const faqItems = [
    {
      question: `Was kostet ein Umzug in ${cityInfo.name}?`,
      answer: `Die Kosten für einen Umzug in ${cityInfo.name} hängen von verschiedenen Faktoren ab. Ein 1-Zimmer-Umzug kostet etwa CHF ${cityInfo.priceRanges.oneRoom.min}–${cityInfo.priceRanges.oneRoom.max}, während ein 3-Zimmer-Umzug zwischen CHF ${cityInfo.priceRanges.twoThreeRooms.min}–${cityInfo.priceRanges.twoThreeRooms.max} liegt. Nutzen Sie unseren kostenlosen Rechner für eine genaue Schätzung.`
    },
    {
      question: `Wie finde ich die beste Umzugsfirma in ${cityInfo.name}?`,
      answer: `Vergleichen Sie Bewertungen, Preise und Leistungen mehrerer Anbieter. Achten Sie auf Zertifikate, Versicherungen und echte Kundenbewertungen. Mit umzugscheck.ch können Sie kostenlos mehrere Offerten einholen und die beste Firma für Ihre Bedürfnisse finden.`
    },
    {
      question: "Wie lange im Voraus sollte ich einen Umzug buchen?",
      answer: `Idealerweise 4-6 Wochen im Voraus, besonders während der Hochsaison (April-September). Für kurzfristige Umzüge in ${cityInfo.name} haben viele unserer Partner jedoch auch Express-Termine verfügbar.`
    },
    {
      question: "Sind die Offerten wirklich kostenlos?",
      answer: "Ja, absolut! Die Nutzung von umzugscheck.ch ist für Sie 100% kostenlos und unverbindlich. Sie erhalten mehrere Offerten von geprüften Umzugsfirmen ohne versteckte Kosten."
    },
    {
      question: `Welche Zusatzleistungen bieten Umzugsfirmen in ${cityInfo.name}?`,
      answer: "Neben dem reinen Transport bieten viele Firmen Packservice, Möbelmontage, Endreinigung, Entsorgung und Lagerung an. Alle Services können Sie direkt bei der Offertanfrage angeben."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* 1. Hero Section */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
              alt={`${cityInfo.name} Stadtansicht`}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/90" />
          </div>

          <div className="container mx-auto px-4 py-16 relative z-10">
            <ScrollReveal>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl"
              >
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  <MapPin className="w-3 h-3 mr-1" />
                  {cityInfo.name}
                </Badge>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                  Die besten Umzugsfirmen in {cityInfo.name} im Vergleich
                </h1>
                
                <p className="text-lg md:text-xl text-foreground/80 mb-8">
                  Erhalte jetzt kostenlose Offerten von geprüften lokalen Profis.
                </p>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">4.8/5</span>
                    <span className="text-sm text-muted-foreground">Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="text-sm md:text-base font-semibold">Lokale Anbieter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="text-sm md:text-base font-semibold">100% kostenlos</span>
                  </div>
                </div>

                <Link to="/umzugsofferten">
                  <Button size="lg" className="h-12 md:h-14 px-6 md:px-10 text-base md:text-lg bg-accent hover:bg-accent/90 w-full md:w-auto">
                    Jetzt Offerten in {cityInfo.name} vergleichen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </ScrollReveal>
          </div>
        </section>

        {/* 2. Local Calculator */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/20 to-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Umzugsrechner für {cityInfo.name}
                  </h2>
                  <div className="inline-flex items-center gap-2 text-sm bg-success/10 text-success px-4 py-2 rounded-full border border-success/20">
                    <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    7 Personen aus {cityInfo.name} vergleichen gerade Umzüge
                  </div>
                </div>

                <Card className="shadow-strong">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Startadresse</label>
                        <Input
                          placeholder={`z.B. Bahnhofstrasse 1, ${cityInfo.name}`}
                          value={fromAddress}
                          onChange={(e) => setFromAddress(e.target.value)}
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Zieladresse</label>
                        <Input
                          placeholder="Neue Adresse eingeben"
                          value={toAddress}
                          onChange={(e) => setToAddress(e.target.value)}
                          className="h-12"
                        />
                      </div>
                      <Link to="/rechner" className="block">
                        <Button className="w-full h-12 text-base font-bold">
                          Jetzt vergleichen
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 3. Top Companies */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-10 md:mb-12">
                Top-Umzugsfirmen in {cityInfo.name}
              </h2>
            </ScrollReveal>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="h-[380px] animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-40 bg-muted rounded-lg mb-4" />
                      <div className="space-y-3">
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : displayedCompanies.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
                  {displayedCompanies.map((company, idx) => (
                    <ScrollReveal key={company.id} delay={idx * 0.1}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 h-full">
                        <div className="relative h-48">
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-6xl">
                            {company.logo}
                          </div>
                          <div className="absolute top-3 right-3 flex gap-2 flex-wrap">
                            <Badge className="bg-white/90 text-foreground shadow-md">
                              Lokal
                            </Badge>
                            {company.verified && (
                              <Badge className="bg-success/10 text-success border-success/30">
                                Top bewertet
                              </Badge>
                            )}
                          </div>
                        </div>

                        <CardContent className="p-6 space-y-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{company.name}</h3>
                            <div className="flex items-center gap-2 text-sm">
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                              <span className="font-bold text-lg">{company.rating.toFixed(1)}</span>
                              <span className="text-muted-foreground">({company.review_count})</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between py-3 border-t">
                            <span className="text-sm text-muted-foreground">Preis:</span>
                            <span className="text-lg font-bold text-primary">{company.price_level}</span>
                          </div>

                          <Link to="/umzugsofferten">
                            <Button className="w-full">
                              Offerte anfragen
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  ))}
                </div>

                {!showAll && companies.length > 5 && (
                  <div className="text-center">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setShowAll(true)}
                    >
                      Alle {companies.length} Umzugsfirmen anzeigen
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="max-w-2xl mx-auto p-12 text-center">
                <p className="text-muted-foreground">
                  Aktuell keine Firmen in {cityInfo.name} gefunden. Probieren Sie unseren Rechner für alle verfügbaren Optionen.
                </p>
                <Link to="/rechner">
                  <Button className="mt-6">
                    Zum Rechner
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </section>

        {/* 4. Local Benefits */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12">
                Lokale Vorteile in {cityInfo.name}
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
              {localAdvantages.map((advantage, idx) => {
                const Icon = advantage.icon;
                return (
                  <ScrollReveal key={idx} delay={idx * 0.1}>
                    <Card className="text-center p-6 hover:shadow-strong transition-shadow">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-3">{advantage.title}</h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {advantage.description}
                      </p>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Customer Reviews */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12">
                Kundenbewertungen aus {cityInfo.name}
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {localReviews.map((review, idx) => (
                <ScrollReveal key={idx} delay={idx * 0.1}>
                  <Card className="p-6 hover:shadow-strong transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold">{review.name}</h4>
                        <p className="text-sm text-muted-foreground">{review.district}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm md:text-base text-foreground/80 leading-relaxed">{review.text}</p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Price Ranges */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/20 to-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12">
                Preisspannen für Umzüge in {cityInfo.name}
              </h2>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto mb-10">
              <ScrollReveal delay={0.1}>
                <Card className="text-center p-6 hover:border-primary/30 transition-all hover:shadow-md">
                  <Home className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-lg md:text-xl font-bold mb-3">1-Zimmer</h3>
                  <p className="text-xl md:text-2xl font-bold text-primary">
                    CHF {cityInfo.priceRanges.oneRoom.min}–{cityInfo.priceRanges.oneRoom.max}
                  </p>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <Card className="text-center p-6 hover:border-primary/30 transition-all hover:shadow-md">
                  <Home className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-lg md:text-xl font-bold mb-3">2-3 Zimmer</h3>
                  <p className="text-xl md:text-2xl font-bold text-primary">
                    CHF {cityInfo.priceRanges.twoThreeRooms.min}–{cityInfo.priceRanges.twoThreeRooms.max}
                  </p>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <Card className="text-center p-6 hover:border-primary/30 transition-all hover:shadow-md">
                  <Home className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-lg md:text-xl font-bold mb-3">4+ Zimmer</h3>
                  <p className="text-xl md:text-2xl font-bold text-primary">
                    CHF {cityInfo.priceRanges.fourPlusRooms.min}–{cityInfo.priceRanges.fourPlusRooms.max}
                  </p>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <Card className="text-center p-6 hover:border-primary/30 transition-all hover:shadow-md">
                  <Award className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-lg md:text-xl font-bold mb-3">Firmenumzug</h3>
                  <p className="text-xl md:text-2xl font-bold text-primary">
                    ab CHF {cityInfo.priceRanges.office.min}
                  </p>
                </Card>
              </ScrollReveal>
            </div>

            <div className="text-center">
              <Link to="/rechner">
                <Button size="lg" className="bg-accent hover:bg-accent/90 h-12 md:h-14 px-6 md:px-10 text-base md:text-lg">
                  Genauen Preis berechnen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 7. FAQ */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <ScrollReveal>
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12">
                  Häufig gestellte Fragen
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqItems.map((item, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg px-6 bg-card">
                      <AccordionTrigger className="text-left font-semibold hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 8. CTA Section */}
        <section className="py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-95" />
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <ScrollReveal>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
                Bereit für deinen Umzug in {cityInfo.name}?
              </h2>
              <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
                Erhalte jetzt kostenlose Offerten von geprüften Profis in deiner Region.
              </p>
              <Link to="/umzugsofferten">
                <Button size="lg" className="h-12 md:h-14 px-6 md:px-10 text-base md:text-lg bg-white text-primary hover:bg-white/90 shadow-strong w-full md:w-auto">
                  GRATIS OFFERTEN STARTEN
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default ZurichMovers;
