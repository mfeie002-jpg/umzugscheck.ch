import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, CheckCircle2, ArrowRight, Clock, Shield, Zap } from "lucide-react";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Input } from "@/components/ui/input";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface CityData {
  name: string;
  canton: string;
  districts: string[];
  priceRanges: {
    twoRooms: { min: number; max: number };
    threeRooms: { min: number; max: number };
    office: { min: number };
  };
}

const cityDatabase: { [key: string]: CityData } = {
  zuerich: {
    name: "Zürich",
    canton: "Zürich",
    districts: ["Wiedikon", "Altstetten", "Oerlikon", "Enge", "Seefeld"],
    priceRanges: {
      twoRooms: { min: 800, max: 1500 },
      threeRooms: { min: 1400, max: 2400 },
      office: { min: 3000 }
    }
  },
  basel: {
    name: "Basel",
    canton: "Basel-Stadt",
    districts: ["Kleinbasel", "Grossbasel", "Riehen", "Bettingen"],
    priceRanges: {
      twoRooms: { min: 750, max: 1400 },
      threeRooms: { min: 1300, max: 2200 },
      office: { min: 2800 }
    }
  },
  bern: {
    name: "Bern",
    canton: "Bern",
    districts: ["Länggasse", "Breitenrain", "Kirchenfeld", "Mattenhof"],
    priceRanges: {
      twoRooms: { min: 700, max: 1300 },
      threeRooms: { min: 1200, max: 2100 },
      office: { min: 2700 }
    }
  },
  luzern: {
    name: "Luzern",
    canton: "Luzern",
    districts: ["Altstadt", "Neustadt", "Littau", "Kriens"],
    priceRanges: {
      twoRooms: { min: 680, max: 1250 },
      threeRooms: { min: 1150, max: 2000 },
      office: { min: 2600 }
    }
  },
  stgallen: {
    name: "St. Gallen",
    canton: "St. Gallen",
    districts: ["West", "Ost", "Bruggen", "Lachen"],
    priceRanges: {
      twoRooms: { min: 650, max: 1200 },
      threeRooms: { min: 1100, max: 1900 },
      office: { min: 2500 }
    }
  },
  winterthur: {
    name: "Winterthur",
    canton: "Zürich",
    districts: ["Altstadt", "Töss", "Veltheim", "Seen"],
    priceRanges: {
      twoRooms: { min: 650, max: 1200 },
      threeRooms: { min: 1100, max: 1900 },
      office: { min: 2500 }
    }
  },
  lausanne: {
    name: "Lausanne",
    canton: "Vaud",
    districts: ["Centre", "Ouchy", "Flon", "Malley"],
    priceRanges: {
      twoRooms: { min: 750, max: 1400 },
      threeRooms: { min: 1300, max: 2200 },
      office: { min: 2800 }
    }
  },
  genf: {
    name: "Genf",
    canton: "Genf",
    districts: ["Plainpalais", "Eaux-Vives", "Servette", "Carouge"],
    priceRanges: {
      twoRooms: { min: 850, max: 1600 },
      threeRooms: { min: 1500, max: 2600 },
      office: { min: 3200 }
    }
  },
  zug: {
    name: "Zug",
    canton: "Zug",
    districts: ["Altstadt", "Oberwil", "Lorzen", "Herti"],
    priceRanges: {
      twoRooms: { min: 800, max: 1500 },
      threeRooms: { min: 1400, max: 2400 },
      office: { min: 3000 }
    }
  },
  lugano: {
    name: "Lugano",
    canton: "Tessin",
    districts: ["Centro", "Molino Nuovo", "Loreto", "Breganzona"],
    priceRanges: {
      twoRooms: { min: 700, max: 1300 },
      threeRooms: { min: 1200, max: 2100 },
      office: { min: 2700 }
    }
  }
};

const CityMovers = () => {
  const { city } = useParams<{ city?: string }>();
  const cityKey = city?.toLowerCase().replace(/ü/g, 'ue').replace(/ä/g, 'ae').replace(/ö/g, 'oe') || 'zuerich';
  const cityInfo = cityDatabase[cityKey] || cityDatabase.zuerich;

  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(7);
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");

  useEffect(() => {
    fetchCompanies();
    const interval = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * 8) + 5);
    }, 8000);
    return () => clearInterval(interval);
  }, [cityInfo.name]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .contains("service_areas", [cityInfo.name])
        .order("rating", { ascending: false })
        .limit(5);

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const localAdvantages = [
    {
      icon: Shield,
      title: `Erfahrene Teams aus ${cityInfo.name}`,
      description: "Lokale Experten kennen die Region und Gegebenheiten"
    },
    {
      icon: Zap,
      title: "Schnelle Terminverfügbarkeit",
      description: "Kurzfristige Termine dank lokaler Präsenz möglich"
    },
    {
      icon: CheckCircle2,
      title: "Regionale Preistransparenz",
      description: `Faire Preise abgestimmt auf ${cityInfo.canton}`
    }
  ];

  const localReviews = [
    {
      name: "Sarah M.",
      district: cityInfo.districts[0],
      rating: 5,
      text: `Super Umzug in ${cityInfo.name}! Die Firma war pünktlich und sehr professionell.`
    },
    {
      name: "Marco B.",
      district: cityInfo.districts[1],
      rating: 5,
      text: "Schnell, günstig und stressfrei. Kann ich nur weiterempfehlen!"
    },
    {
      name: "Julia K.",
      district: cityInfo.districts[2],
      rating: 5,
      text: "Sehr zufrieden mit dem Service. Alles lief reibungslos."
    }
  ];

  const cityFAQ = [
    {
      question: `Was kostet ein Umzug in ${cityInfo.name}?`,
      answer: `Die Kosten variieren je nach Wohnungsgröße und Distanz. Ein 2-Zimmer-Umzug in ${cityInfo.name} kostet durchschnittlich CHF ${cityInfo.priceRanges.twoRooms.min}–${cityInfo.priceRanges.twoRooms.max}.`
    },
    {
      question: `Wie finde ich die beste Umzugsfirma in ${cityInfo.name}?`,
      answer: `Vergleichen Sie mehrere Offerten auf umzugscheck.ch. Alle Firmen sind geprüft und haben echte Kundenbewertungen.`
    },
    {
      question: "Wie weit im Voraus sollte ich buchen?",
      answer: "Mindestens 2–3 Wochen vor dem Umzugstermin. In der Hauptsaison besser 4–6 Wochen."
    },
    {
      question: `Gibt es Umzugsfirmen mit Lager in ${cityInfo.name}?`,
      answer: "Ja, viele lokale Anbieter bieten Lagerservice an. Details finden Sie in den Firmenprofilen."
    }
  ];

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Umzugsfirmen in ${cityInfo.name}`,
    "description": `Vergleichen Sie die besten Umzugsfirmen in ${cityInfo.name}. Kostenlose Offerten von geprüften lokalen Profis.`,
    "provider": {
      "@type": "Organization",
      "name": "Umzugscheck.ch"
    },
    "areaServed": {
      "@type": "City",
      "name": cityInfo.name
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Die besten Umzugsfirmen in {cityInfo.name} vergleichen | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content={`Vergleichen Sie Umzugsfirmen in ${cityInfo.name}. ✓ Kostenlose Offerten ✓ Geprüfte Profis ✓ Faire Preise. Jetzt starten!`}
        />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs 
          items={[
            { label: "Regionen", href: "/regionen" },
            { label: cityInfo.name }
          ]} 
        />
      </div>

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-accent/90 to-primary/90 z-0" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80')"
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center text-white">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <MapPin className="h-4 w-4 mr-2" />
                {cityInfo.name}, {cityInfo.canton}
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Die besten Umzugsfirmen in {cityInfo.name} im Vergleich
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Erhalte kostenlose Offerten von geprüften lokalen Umzugsprofis.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                  <span className="font-bold">4.8/5</span>
                </div>
                <div className="h-4 w-px bg-white/30" />
                <span className="font-medium">15'000+ Umzüge</span>
                <div className="h-4 w-px bg-white/30" />
                <span className="font-medium">Nur geprüfte Firmen</span>
              </div>

              <Link to="/umzugsofferten">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-strong"
                >
                  Jetzt Offerten in {cityInfo.name} vergleichen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <main>
        {/* Local Calculator */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <Card className="shadow-strong">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        Kostenloses Angebot in {cityInfo.name}
                      </h2>
                      <p className="text-muted-foreground">
                        In 3 Schritten zur Offerte
                      </p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Startadresse</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder={`z.B. ${cityInfo.name}, Bahnhofstrasse 1`}
                            value={fromAddress}
                            onChange={(e) => setFromAddress(e.target.value)}
                            className="pl-11 h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Zieladresse</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="z.B. Winterthur, Marktgasse 10"
                            value={toAddress}
                            onChange={(e) => setToAddress(e.target.value)}
                            className="pl-11 h-12"
                          />
                        </div>
                      </div>
                    </div>

                    <Link to="/umzugsofferten">
                      <Button className="w-full h-14 text-lg font-bold shadow-medium">
                        Jetzt vergleichen
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>

                    <div className="mt-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-green-800">
                          {activeUsers} Personen aus {cityInfo.name} vergleichen gerade Umzugsfirmen
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Top Companies */}
        <ScrollReveal>
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Top Umzugsfirmen in {cityInfo.name}
                </h2>
                <p className="text-lg text-muted-foreground">
                  Geprüfte und bewertete lokale Profis
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {companies.slice(0, 5).map((company, index) => (
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
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                <MapPin className="h-3 w-3 mr-1" />
                                Lokal
                              </Badge>
                              {company.verified && (
                                <Badge className="bg-success/10 text-success border-success/30">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Top bewertet
                                </Badge>
                              )}
                              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                <Clock className="h-3 w-3 mr-1" />
                                Express verfügbar
                              </Badge>
                            </div>

                            <p className="text-lg font-bold text-accent mb-4">
                              Ab CHF {cityInfo.priceRanges.twoRooms.min}
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

              <div className="text-center">
                <Link to="/firmen">
                  <Button variant="outline" size="lg">
                    Alle Umzugsfirmen in {cityInfo.name} anzeigen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Local Advantages */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Vorteile lokaler Anbieter
              </h2>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                {localAdvantages.map((advantage, index) => {
                  const Icon = advantage.icon;
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
                        <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
                        <p className="text-muted-foreground">{advantage.description}</p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Local Reviews */}
        <ScrollReveal>
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Bewertungen aus {cityInfo.name}
              </h2>

              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {localReviews.map((review, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-medium transition-shadow h-full">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4">"{review.text}"</p>
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {cityInfo.name} {review.district}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Price Examples */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Preisbeispiele für {cityInfo.name}
              </h2>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Card className="p-6 hover:shadow-medium transition-shadow">
                  <h3 className="text-xl font-bold mb-4">2-Zimmer in {cityInfo.name}</h3>
                  <p className="text-3xl font-bold text-accent mb-2">
                    CHF {cityInfo.priceRanges.twoRooms.min}–{cityInfo.priceRanges.twoRooms.max}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Innerhalb {cityInfo.name}, inkl. Transport
                  </p>
                </Card>

                <Card className="p-6 hover:shadow-medium transition-shadow">
                  <h3 className="text-xl font-bold mb-4">3-Zimmer über Stadtgrenze</h3>
                  <p className="text-3xl font-bold text-accent mb-2">
                    CHF {cityInfo.priceRanges.threeRooms.min}–{cityInfo.priceRanges.threeRooms.max}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {cityInfo.name} → Region, 30-50 km
                  </p>
                </Card>

                <Card className="p-6 hover:shadow-medium transition-shadow">
                  <h3 className="text-xl font-bold mb-4">Firmenumzug</h3>
                  <p className="text-3xl font-bold text-accent mb-2">
                    ab CHF {cityInfo.priceRanges.office.min}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Büroumzug, individuell kalkuliert
                  </p>
                </Card>
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
                  Häufige Fragen zu Umzügen in {cityInfo.name}
                </h2>
                <FAQAccordion items={cityFAQ} />
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
                Jetzt Offerten für {cityInfo.name} sichern
              </h2>
              <p className="text-lg md:text-xl mb-10 text-white/90">
                Kostenlos, unverbindlich und in nur 2 Minuten
              </p>
              <Link to="/umzugsofferten">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-strong"
                >
                  Jetzt kostenlose Offerten erhalten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm mt-6 text-white/80">
                ✓ 100% kostenlos  ✓ Nur geprüfte Firmen  ✓ Schnelle Antwort
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

export default CityMovers;
