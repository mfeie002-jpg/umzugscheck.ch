import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Shield, CheckCircle2, ArrowRight, Phone, Mail, Calculator, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { LiveActivitySignal } from "@/components/home/LiveActivitySignal";
import { MiniCalculator } from "@/components/home/MiniCalculator";
import { InternalLinks } from "@/components/InternalLinks";
import { CTABlock } from "@/components/home/CTABlock";
import { motion } from "framer-motion";
import { initPerformanceOptimizations } from "@/lib/performance";

const cityData: Record<string, {
  name: string;
  canton: string;
  description: string;
  priceExamples: { size: string; price: string }[];
  advantages: string[];
  faqs: { question: string; answer: string }[];
}> = {
  "zuerich": {
    name: "Zürich",
    canton: "Zürich",
    description: "Die grösste Stadt der Schweiz bietet eine Vielzahl an professionellen Umzugsfirmen mit exzellenter Qualität.",
    priceExamples: [
      { size: "2 Zimmer", price: "CHF 800–1'200" },
      { size: "3 Zimmer", price: "CHF 1'200–1'800" },
      { size: "4+ Zimmer", price: "CHF 1'800–3'000" }
    ],
    advantages: [
      "Kurzfristige Verfügbarkeit",
      "Lokale Teams mit Ortskenntnissen",
      "Faire Preise durch Wettbewerb"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Zürich?", answer: "Ein 3-Zimmer-Umzug innerorts kostet durchschnittlich CHF 1'200–1'800, abhängig von Stockwerk, Distanz und Zusatzservices." },
      { question: "Welche Umzugsfirmen sind in Zürich empfehlenswert?", answer: "Auf umzugscheck.ch finden Sie die am besten bewerteten Zürcher Umzugsfirmen mit echten Kundenbewertungen." },
      { question: "Wie lange im Voraus sollte ich buchen?", answer: "2-4 Wochen im Voraus ist ideal. Express-Umzüge sind bei manchen Anbietern auch kurzfristiger möglich." }
    ]
  },
  "bern": {
    name: "Bern",
    canton: "Bern",
    description: "Die Bundesstadt kombiniert historischen Charme mit moderner Infrastruktur und erfahrenen Umzugsprofis.",
    priceExamples: [
      { size: "2 Zimmer", price: "CHF 750–1'100" },
      { size: "3 Zimmer", price: "CHF 1'100–1'700" },
      { size: "4+ Zimmer", price: "CHF 1'700–2'800" }
    ],
    advantages: [
      "Altstadtkompetenz der lokalen Firmen",
      "Faire Preise für Qualität",
      "Schnelle Verfügbarkeit"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Bern?", answer: "Ein 3-Zimmer-Umzug kostet in Bern durchschnittlich CHF 1'100–1'700." },
      { question: "Können Umzüge in der Altstadt durchgeführt werden?", answer: "Ja, lokale Firmen kennen sich mit Altstadtumzügen und Parkbewilligungen aus." },
      { question: "Welche Services sind verfügbar?", answer: "Umzug, Reinigung, Entsorgung, Lagerung und Möbelmontage." }
    ]
  },
  "basel": {
    name: "Basel",
    canton: "Basel-Stadt",
    description: "Basel im Dreiländereck bietet erstklassige Umzugsfirmen für nationale und internationale Umzüge.",
    priceExamples: [
      { size: "2 Zimmer", price: "CHF 800–1'150" },
      { size: "3 Zimmer", price: "CHF 1'150–1'750" },
      { size: "4+ Zimmer", price: "CHF 1'750–2'900" }
    ],
    advantages: [
      "Internationale Umzugserfahrung",
      "Mehrsprachige Teams",
      "Moderne Infrastruktur"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Basel?", answer: "Ein 3-Zimmer-Umzug innerorts kostet durchschnittlich CHF 1'150–1'750." },
      { question: "Sind internationale Umzüge möglich?", answer: "Ja, viele Basler Firmen sind auf grenzüberschreitende Umzüge spezialisiert." },
      { question: "Wie weit im Voraus sollte ich buchen?", answer: "2-3 Wochen Vorlaufzeit ist optimal. Express-Service ist oft verfügbar." }
    ]
  }
};

export default function CityOptimized() {
  const { city: citySlug } = useParams<{ city: string }>();
  const cityInfo = citySlug ? cityData[citySlug] : null;
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initPerformanceOptimizations();
    if (cityInfo) {
      fetchCompanies();
    }
  }, [cityInfo]);

  const fetchCompanies = async () => {
    if (!cityInfo) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .or(`service_areas.cs.{${cityInfo.name}},service_areas.cs.{${cityInfo.canton}}`)
        .order("rating", { ascending: false })
        .limit(5);

      if (!error && data) {
        setCompanies(data);
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!cityInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Stadt nicht gefunden</h1>
          <Link to="/">
            <Button>Zurück zur Startseite</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = `https://umzugscheck.ch/${citySlug}/umzugsfirmen/`;

  return (
    <div className="min-h-screen bg-background">
      {/* SEO */}
      <SEOHead
        pageType="city"
        city={citySlug}
        url={currentUrl}
        faqs={cityInfo.faqs}
        companies={companies}
      />

      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80')] bg-cover bg-center opacity-5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 text-sm px-4 py-2 bg-accent/10 text-accent border-accent/20">
                {cityInfo.canton}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                Die besten Umzugsfirmen in {cityInfo.name}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Kostenlose Offerten von geprüften lokalen Umzugsprofis
              </p>

              <Link to="/umzugsofferten">
                <Button size="lg" variant="cta" className="h-14 px-10 text-lg font-bold shadow-accent">
                  Offerten in {cityInfo.name} vergleichen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Calculator + Live Signal */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <ScrollReveal>
              <LiveActivitySignal />
            </ScrollReveal>
            <ScrollReveal>
              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <MiniCalculator />
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Top Umzugsfirmen in {cityInfo.name}
              </h2>
              <p className="text-lg text-muted-foreground">
                Geprüfte und bewertete Firmen für Ihren Umzug
              </p>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="h-64 animate-pulse bg-muted" />
              ))}
            </div>
          ) : companies.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {companies.slice(0, 5).map((company, idx) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="hover:shadow-strong transition-all duration-300 h-full group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{company.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-accent text-accent" />
                              <span className="font-bold">{company.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ({company.review_count})
                            </span>
                          </div>
                        </div>
                        {company.verified && (
                          <Badge className="bg-success text-white">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Geprüft
                          </Badge>
                        )}
                      </div>
                      
                      {company.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {company.description}
                        </p>
                      )}
                      
                      <Link to={`/firmen/${company.id}`}>
                        <Button className="w-full">
                          Offerte anfragen
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Derzeit keine Firmen verfügbar.</p>
            </div>
          )}
        </div>
      </section>

      {/* Advantages */}
      <ScrollReveal>
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Vorteile eines lokalen Umzugs in {cityInfo.name}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {cityInfo.advantages.map((advantage, idx) => (
                  <Card key={idx} className="text-center p-6 shadow-medium hover:shadow-strong transition-shadow">
                    <CheckCircle2 className="w-10 h-10 text-accent mx-auto mb-4" />
                    <p className="font-semibold">{advantage}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Price Examples */}
      <ScrollReveal>
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Umzugspreise in {cityInfo.name}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {cityInfo.priceExamples.map((example, idx) => (
                  <Card key={idx} className="text-center p-8 shadow-medium">
                    <div className="text-sm text-muted-foreground mb-2">{example.size}</div>
                    <div className="text-3xl font-bold text-accent mb-4">{example.price}</div>
                    <div className="text-xs text-muted-foreground">Richtwert</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <CTABlock
        title={`Jetzt Offerten in ${cityInfo.name} sichern`}
        description="Vergleichen Sie kostenlos Angebote von geprüften lokalen Umzugsfirmen"
        buttonText="JETZT GRATIS OFFERTEN ERHALTEN"
        buttonLink="/umzugsofferten"
      />

      {/* FAQ */}
      <ScrollReveal>
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Häufige Fragen
                </h2>
                <p className="text-lg text-muted-foreground">
                  Alles über Umzüge in {cityInfo.name}
                </p>
              </div>
              <FAQAccordion items={cityInfo.faqs} variant="compact" />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Internal Links */}
      <InternalLinks type="city" currentCity={citySlug} />

      <SimplifiedFooter />
      <StickyMobileCTA />
    </div>
  );
}
