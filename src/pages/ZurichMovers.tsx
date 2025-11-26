import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { EmotionalHero } from "@/components/home/EmotionalHero";
import { InstantCalculator } from "@/components/home/InstantCalculator";
import { AirbnbCompanyCard } from "@/components/home/AirbnbCompanyCard";
import { GradientCTA } from "@/components/home/GradientCTA";
import { FAQ } from "@/components/FAQ";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
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

// City data mapping
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
  // ... add more cities as needed
};

const ZurichMovers = () => {
  const { city } = useParams<{ city?: string }>();
  const cityKey = city?.toLowerCase() || 'zuerich';
  const cityInfo = cityData[cityKey] || cityData.zuerich;

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

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
      district: `${cityInfo.name} Oerlikon`,
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

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero */}
      <EmotionalHero
        title={`Die besten Umzugsfirmen in ${cityInfo.name} im Vergleich`}
        subtitle="Erhalte jetzt kostenlose Offerten von geprüften lokalen Profis."
        primaryCTA={{
          text: `Jetzt Offerten in ${cityInfo.name} vergleichen`,
          link: "/umzugsofferten"
        }}
        badgeText={cityInfo.name}
        cityName={cityInfo.name}
        backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
      />

      <main>
        {/* 2. Local Calculator */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Umzugsrechner für {cityInfo.name}
                </h2>
              </div>
              <InstantCalculator
                cityName={cityInfo.name}
                activityMessage={`7 Personen aus ${cityInfo.name} vergleichen gerade Umzüge`}
              />
            </div>
          </section>
        </ScrollReveal>

        {/* 3. Top Companies */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Top-Umzugsfirmen in {cityInfo.name}
                </h2>
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {[...Array(5)].map((_, i) => (
                    <Card key={i} className="h-[420px] animate-pulse">
                      <div className="h-56 bg-muted" />
                      <CardContent className="p-6 space-y-4">
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : displayedCompanies.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
                    {displayedCompanies.map((company, idx) => (
                      <AirbnbCompanyCard
                        key={company.id}
                        id={company.id}
                        name={company.name}
                        logo={company.logo}
                        rating={company.rating}
                        reviewCount={company.review_count}
                        priceFrom={`Ab CHF ${cityInfo.priceRanges.oneRoom.min}`}
                        badges={["Lokal", company.verified ? "Top bewertet" : "Geprüft"]}
                        delay={idx * 0.1}
                      />
                    ))}
                  </div>

                  {!showAll && companies.length > 5 && (
                    <div className="text-center">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setShowAll(true)}
                        className="h-12 px-8"
                      >
                        Alle {companies.length} Umzugsfirmen anzeigen
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Card className="max-w-2xl mx-auto p-12 text-center">
                  <p className="text-muted-foreground mb-6">
                    Aktuell keine Firmen in {cityInfo.name} gefunden. Probieren Sie unseren Rechner für alle verfügbaren Optionen.
                  </p>
                  <Link to="/rechner">
                    <Button>
                      Zum Rechner
                      <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          </section>
        </ScrollReveal>

        {/* 4. Local Benefits */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Lokale Vorteile in {cityInfo.name}
              </h2>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
                {localAdvantages.map((advantage, idx) => {
                  const Icon = advantage.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <Card className="text-center p-8 hover:shadow-strong transition-shadow h-full">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold mb-3">{advantage.title}</h3>
                        <p className="text-muted-foreground text-sm">{advantage.description}</p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 5. Customer Reviews */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Kundenbewertungen aus {cityInfo.name}
              </h2>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {localReviews.map((review, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Card className="p-6 h-full">
                      <div className="flex gap-1 mb-4">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                      <p className="text-foreground/90 mb-4">"{review.text}"</p>
                      <div className="border-t pt-4">
                        <p className="font-semibold">{review.name}</p>
                        <p className="text-sm text-muted-foreground">{review.district}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 6. Price Ranges */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Preisspannen für Umzüge in {cityInfo.name}
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-2">1-Zimmer</h3>
                  <p className="text-3xl font-bold text-accent">
                    CHF {cityInfo.priceRanges.oneRoom.min}–{cityInfo.priceRanges.oneRoom.max}
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-2">2–3 Zimmer</h3>
                  <p className="text-3xl font-bold text-accent">
                    CHF {cityInfo.priceRanges.twoThreeRooms.min}–{cityInfo.priceRanges.twoThreeRooms.max}
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-2">Firmenumzug</h3>
                  <p className="text-3xl font-bold text-accent">
                    ab CHF {cityInfo.priceRanges.office.min}
                  </p>
                </Card>
              </div>

              <div className="text-center mt-10">
                <Link to="/rechner">
                  <Button size="lg" className="h-12 px-8">
                    Genauen Preis berechnen
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 7. FAQ */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">
                  Häufig gestellte Fragen
                </h2>
                <FAQ />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 8. CTA */}
        <GradientCTA
          title={`Jetzt Offerten für ${cityInfo.name} sichern`}
          description="Vergleiche kostenlos und spare bis zu 40%"
          buttonText="Kostenlose Offerten erhalten"
          buttonLink="/umzugsofferten"
        />
      </main>

      <SimplifiedFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default ZurichMovers;
