import { Footer } from "@/components/Footer";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, TrendingUp, Users, Calculator, Building2, Star, ArrowRight, CheckCircle, Phone, Search, Filter, Zap, Award } from "lucide-react";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTASection } from "@/components/CTASection";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { InteractiveSwitzerlandMap } from "@/components/InteractiveSwitzerlandMap";
import { CITIES_MAP } from "@/data/locations";

const cantons = [
  { name: "Zürich", slug: "zuerich", companies: 42, moves: "1'200+", avgPrice: "CHF 1'200" },
  { name: "Bern", slug: "bern", companies: 35, moves: "950+", avgPrice: "CHF 1'100" },
  { name: "Luzern", slug: "luzern", companies: 28, moves: "680+", avgPrice: "CHF 1'050" },
  { name: "Uri", slug: "uri", companies: 12, moves: "180+", avgPrice: "CHF 950" },
  { name: "Schwyz", slug: "schwyz", companies: 18, moves: "420+", avgPrice: "CHF 1'000" },
  { name: "Obwalden", slug: "obwalden", companies: 10, moves: "150+", avgPrice: "CHF 900" },
  { name: "Nidwalden", slug: "nidwalden", companies: 11, moves: "160+", avgPrice: "CHF 920" },
  { name: "Glarus", slug: "glarus", companies: 9, moves: "130+", avgPrice: "CHF 880" },
  { name: "Zug", slug: "zug", companies: 22, moves: "510+", avgPrice: "CHF 1'300" },
  { name: "Freiburg", slug: "freiburg", companies: 26, moves: "620+", avgPrice: "CHF 1'000" },
  { name: "Solothurn", slug: "solothurn", companies: 24, moves: "560+", avgPrice: "CHF 980" },
  { name: "Basel-Stadt", slug: "basel-stadt", companies: 30, moves: "720+", avgPrice: "CHF 1'150" },
  { name: "Basel-Landschaft", slug: "basel-landschaft", companies: 28, moves: "650+", avgPrice: "CHF 1'080" },
  { name: "Schaffhausen", slug: "schaffhausen", companies: 15, moves: "290+", avgPrice: "CHF 950" },
  { name: "Appenzell Ausserrhoden", slug: "appenzell-ausserrhoden", companies: 12, moves: "200+", avgPrice: "CHF 900" },
  { name: "Appenzell Innerrhoden", slug: "appenzell-innerrhoden", companies: 8, moves: "110+", avgPrice: "CHF 880" },
  { name: "St. Gallen", slug: "st-gallen", companies: 32, moves: "780+", avgPrice: "CHF 1'050" },
  { name: "Graubünden", slug: "graubuenden", companies: 20, moves: "410+", avgPrice: "CHF 1'100" },
  { name: "Aargau", slug: "aargau", companies: 38, moves: "890+", avgPrice: "CHF 1'020" },
  { name: "Thurgau", slug: "thurgau", companies: 25, moves: "570+", avgPrice: "CHF 980" },
  { name: "Tessin", slug: "tessin", companies: 27, moves: "640+", avgPrice: "CHF 1'150" },
  { name: "Waadt", slug: "waadt", companies: 36, moves: "850+", avgPrice: "CHF 1'180" },
  { name: "Wallis", slug: "wallis", companies: 29, moves: "690+", avgPrice: "CHF 1'050" },
  { name: "Neuenburg", slug: "neuenburg", companies: 19, moves: "430+", avgPrice: "CHF 1'000" },
  { name: "Genf", slug: "genf", companies: 34, moves: "820+", avgPrice: "CHF 1'250" },
  { name: "Jura", slug: "jura", companies: 13, moves: "240+", avgPrice: "CHF 920" }
];

const popularRoutes = [
  { from: "Zürich", to: "Bern", distance: "125 km", price: "CHF 1'200–1'800" },
  { from: "Basel", to: "Zürich", distance: "87 km", price: "CHF 900–1'400" },
  { from: "Genf", to: "Lausanne", distance: "64 km", price: "CHF 700–1'100" },
  { from: "Luzern", to: "Zürich", distance: "52 km", price: "CHF 650–1'000" }
];

const benefits = [
  { icon: CheckCircle, text: "Lokale Umzugsfirmen mit Ortskenntnis" },
  { icon: Star, text: "Geprüfte Partner mit Top-Bewertungen" },
  { icon: Zap, text: "Schnelle Offerten innerhalb 24 Stunden" },
  { icon: Award, text: "Bis zu 40% günstiger durch Vergleich" }
];

const Regionen = () => {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();
  const { ref: routesRef, isVisible: routesVisible } = useScrollAnimation();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCantons = cantons.filter(canton => 
    canton.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCompanies = cantons.reduce((sum, c) => sum + c.companies, 0);
  const totalMoves = "15'000+";

  return (
    <>
      <OptimizedSEO
        title="Umzugsfirmen in allen Regionen der Schweiz | Umzugscheck.ch"
        description="Finden Sie geprüfte Umzugsfirmen in allen 26 Schweizer Kantonen. Transparente Preise, echte Kundenbewertungen und kostenlose Offerten."
        keywords="umzugsfirmen schweiz, umzug kantone, umzugsfirmen region, umzug zürich, umzug bern, umzug basel"
        canonicalUrl="https://umzugscheck.ch/regionen"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "Regionen", url: "https://umzugscheck.ch/regionen" }
      ]} />
      
      <div className="min-h-screen flex flex-col">

        {/* Hero Section */}
        <section className="relative py-20 md:py-28 gradient-hero text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          <div className="container mx-auto px-4 relative">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">Alle 26 Kantone abgedeckt</span>
                </div>
                <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
                  Umzugsfirmen in allen Regionen der Schweiz
                </h1>
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
                  Finden Sie geprüfte Umzugsfirmen in Ihrem Kanton – transparente Preise und echte Kundenbewertungen
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/umzugsofferten">
                    <Button size="lg" variant="cta" className="h-14 px-8 text-lg bg-white text-primary hover:bg-white/90">
                      Offerten vergleichen
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/umzugsofferten">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white">
                      <Calculator className="mr-2 h-5 w-5" />
                      Kosten berechnen
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Key Stats */}
        <motion.section 
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={statsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="py-12 bg-white border-b border-border"
        >
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <Card variant="elevated" className="p-6 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">26</div>
                <div className="text-sm text-muted-foreground">Alle Kantone</div>
              </Card>
              <Card variant="elevated" className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">{totalCompanies}+</div>
                <div className="text-sm text-muted-foreground">Umzugsfirmen</div>
              </Card>
              <Card variant="elevated" className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">{totalMoves}</div>
                <div className="text-sm text-muted-foreground">Vermittelte Umzüge</div>
              </Card>
              <Card variant="elevated" className="p-6 text-center">
                <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">4.8/5</div>
                <div className="text-sm text-muted-foreground">Durchschnitt</div>
              </Card>
            </div>
          </div>
        </motion.section>

        {/* Benefits */}
        <PageSection variant="muted">
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={index} delay={index * 0.05}>
                  <div className="flex items-center gap-3 p-4 bg-background rounded-lg shadow-soft">
                    <benefit.icon className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </PageSection>

        {/* Interactive Map */}
        <PageSection variant="default">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <InteractiveSwitzerlandMap />
            </ScrollReveal>
          </div>
        </PageSection>

        {/* Search & Cantons Grid */}
        <PageSection variant="default">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-8">
                <SectionHeading
                  title="Wählen Sie Ihren Kanton"
                  subtitle="Umzugsfirmen in Ihrer Region vergleichen – lokale Expertise, faire Preise"
                  className="mb-8"
                />
                
                {/* Search */}
                <div className="max-w-md mx-auto relative mb-8">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Kanton suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCantons.map((canton, index) => (
                <ScrollReveal key={canton.slug} delay={index * 0.02}>
                  <div className="h-full flex flex-col gap-3">
                    <Link to={`/umzugsfirmen/kanton-${canton.slug}`}>
                      <Card variant="elevated" className="p-6 hover-lift border-2 hover:border-primary/30 h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{canton.name}</h3>
                          <p className="text-sm text-muted-foreground">Ø {canton.avgPrice}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{canton.companies}</span>
                          <span className="text-muted-foreground">Firmen</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          <span className="font-semibold">{canton.moves}</span>
                          <span className="text-muted-foreground">Umzüge</span>
                        </div>
                      </div>
                    </Card>
                    </Link>

                    {/* City links (internal linking) */}
                    <div className="flex flex-wrap gap-2">
                      {Object.values(CITIES_MAP)
                        .filter((c) => c.cantonSlug === canton.slug)
                        .slice(0, 6)
                        .map((c) => (
                          <Link
                            key={c.slug}
                            to={`/umzugsfirmen/${c.slug}`}
                            className="text-xs px-3 py-1 rounded-full border border-border/70 hover:bg-muted/50 transition-colors"
                          >
                            {c.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {filteredCantons.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">Kein Kanton gefunden für "{searchTerm}"</p>
              </div>
            )}
          </div>
        </PageSection>

        {/* Popular Routes */}
        <PageSection variant="muted">
          <motion.div
            ref={routesRef}
            initial={{ opacity: 0, y: 20 }}
            animate={routesVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              title="Beliebte Umzugsrouten"
              subtitle="Häufige Strecken mit Preisübersicht"
              className="mb-12"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {popularRoutes.map((route, index) => (
                <Card key={index} variant="elevated" className="p-6 hover-lift text-center">
                  <div className="text-lg font-bold mb-2">{route.from} → {route.to}</div>
                  <div className="text-sm text-muted-foreground mb-3">{route.distance}</div>
                  <div className="text-lg font-bold text-primary">{route.price}</div>
                </Card>
              ))}
            </div>
          </motion.div>
        </PageSection>

        {/* Quick Contact */}
        <PageSection variant="default">
          <div className="max-w-2xl mx-auto">
            <Card variant="elevated" className="overflow-hidden">
              <div className="h-2 gradient-hero" />
              <div className="p-8 text-center">
                <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Persönliche Beratung</h3>
                <p className="text-muted-foreground mb-6">
                  Unser Team hilft Ihnen, die richtige Umzugsfirma in Ihrer Region zu finden
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/kontakt">
                    <Button variant="outline" className="h-12 px-6">
                      <Phone className="mr-2 h-4 w-4" />
                      Kontakt aufnehmen
                    </Button>
                  </Link>
                  <Link to="/umzugsofferten">
                    <Button variant="cta" className="h-12 px-6">
                      <Zap className="mr-2 h-4 w-4" />
                      Offerten erhalten
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </PageSection>

        {/* CTA Section */}
        <CTASection
          title="Bereit für Ihren Umzug?"
          description="Erhalten Sie kostenlose Offerten von geprüften Umzugsfirmen in Ihrer Region"
          buttonText="Jetzt Offerten erhalten"
          buttonLink="/umzugsofferten"
        />

        <Footer />
        <ScrollToTop />
        <StickyMobileCTA />
      </div>
    </>
  );
};

export default Regionen;
