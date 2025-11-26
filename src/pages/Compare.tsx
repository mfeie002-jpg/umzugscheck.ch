import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, TrendingDown, Shield, BarChart3, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

interface Company {
  id: string;
  name: string;
  logo: string;
  rating: number;
  review_count: number;
  price_level: string;
  services: string[];
  verified: boolean;
}

const Compare = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("rating", { ascending: false })
        .limit(6);

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasService = (company: Company, serviceKey: string) => {
    return company.services.some(s => 
      s.toLowerCase().includes(serviceKey.toLowerCase())
    );
  };

  const whyCompareReasons = [
    {
      icon: TrendingDown,
      title: "Spart bis zu 40%",
      description: "Durch den Vergleich mehrerer Angebote finden Sie die besten Preise für Ihren Umzug."
    },
    {
      icon: Shield,
      title: "Höhere Qualität",
      description: "Geprüfte Firmen mit echten Kundenbewertungen – nur verifizierte Profis in unserem Netzwerk."
    },
    {
      icon: BarChart3,
      title: "Transparenz",
      description: "Leistungen, Preise und Bewertungen auf einen Blick – faire Vergleichsbasis für Ihre Entscheidung."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                  Umzugsfirmen vergleichen:<br className="hidden md:block" /> So findest du die besten Preise
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8">
                  Erhalte kostenlose Offerten von geprüften Schweizer Umzugsfirmen und spare bis zu 40%
                </p>
                <Link to="/rechner">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold">
                    Jetzt vergleichen
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Comparison Table - Desktop */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/20 to-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
                Vergleichen Sie die Top-Umzugsfirmen
              </h2>
            </ScrollReveal>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <ScrollReveal>
                <Card className="shadow-strong">
                  <CardContent className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-primary/5 to-primary/10 border-b-2 border-border">
                          <th className="p-4 text-left font-bold">Firma</th>
                          <th className="p-4 text-center font-bold">Sterne</th>
                          <th className="p-4 text-center font-bold">Preis</th>
                          <th className="p-4 text-center font-bold">Verfügbarkeit</th>
                          <th className="p-4 text-center font-bold">Services</th>
                          <th className="p-4 text-center font-bold">Aktion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                              Lade Firmen...
                            </td>
                          </tr>
                        ) : (
                          companies.map((company, index) => (
                            <tr 
                              key={company.id} 
                              className={`border-b border-border hover:bg-secondary/20 transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-secondary/5'
                              }`}
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="text-3xl">{company.logo}</div>
                                  <div>
                                    <div className="font-bold">{company.name}</div>
                                    {company.verified && (
                                      <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30 mt-1">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Verifiziert
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < Math.floor(company.rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-bold">{company.rating.toFixed(1)}</span>
                                  <span className="text-xs text-muted-foreground">({company.review_count})</span>
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <span className="font-bold text-primary">{company.price_level}</span>
                              </td>
                              <td className="p-4 text-center">
                                <Badge className="bg-success/10 text-success border-success/30">
                                  Verfügbar
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-1 justify-center max-w-[200px] mx-auto">
                                  {hasService(company, 'transport') && (
                                    <Badge variant="secondary" className="text-xs">Transport</Badge>
                                  )}
                                  {hasService(company, 'pack') && (
                                    <Badge variant="secondary" className="text-xs">Packen</Badge>
                                  )}
                                  {hasService(company, 'clean') && (
                                    <Badge variant="secondary" className="text-xs">Reinigung</Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <Link to="/rechner">
                                  <Button size="sm" className="shadow-md">
                                    Offerte anfragen
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Mobile: Airbnb-style Swipeable Cards */}
            <div className="md:hidden">
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {loading ? (
                  <Card className="flex-shrink-0 w-[85vw] snap-center">
                    <CardContent className="p-6 text-center text-muted-foreground">
                      Lade Firmen...
                    </CardContent>
                  </Card>
                ) : (
                  companies.map((company, index) => (
                    <ScrollReveal key={company.id} delay={index * 0.1}>
                      <Card className="flex-shrink-0 w-[85vw] snap-center shadow-strong hover:shadow-xl transition-shadow">
                        <CardContent className="p-5">
                          {/* Company Header */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="text-4xl">{company.logo}</div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg mb-1 truncate">{company.name}</h3>
                              <div className="flex items-center gap-1 mb-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-bold text-sm">{company.rating.toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">({company.review_count})</span>
                              </div>
                              {company.verified && (
                                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Verifiziert
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between py-2 border-b border-border">
                              <span className="text-sm text-muted-foreground">Preis:</span>
                              <span className="font-bold text-primary">{company.price_level}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-border">
                              <span className="text-sm text-muted-foreground">Verfügbarkeit:</span>
                              <Badge className="bg-success/10 text-success border-success/30">
                                Verfügbar
                              </Badge>
                            </div>
                            <div className="py-2">
                              <span className="text-sm text-muted-foreground mb-2 block">Services:</span>
                              <div className="flex flex-wrap gap-2">
                                {hasService(company, 'transport') && (
                                  <Badge variant="secondary" className="text-xs">Transport</Badge>
                                )}
                                {hasService(company, 'pack') && (
                                  <Badge variant="secondary" className="text-xs">Packen</Badge>
                                )}
                                {hasService(company, 'clean') && (
                                  <Badge variant="secondary" className="text-xs">Reinigung</Badge>
                                )}
                                {hasService(company, 'storage') && (
                                  <Badge variant="secondary" className="text-xs">Lagerung</Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* CTA */}
                          <Link to="/rechner">
                            <Button className="w-full shadow-md">
                              Offerte anfragen
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  ))
                )}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                ← Wischen Sie, um mehr Firmen zu sehen →
              </p>
            </div>
          </div>
        </section>

        {/* Why Compare */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
                Warum Umzugsfirmen vergleichen?
              </h2>
              <p className="text-center text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto">
                Ein Vergleich lohnt sich immer – hier sind die wichtigsten Vorteile
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              {whyCompareReasons.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <Card className="text-center p-6 md:p-8 hover:shadow-strong transition-shadow border-primary/10">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{reason.title}</h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {reason.description}
                      </p>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Reviews + Trust */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/20 to-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                Was unsere Nutzer sagen
              </h2>
              <p className="text-center text-muted-foreground mb-8 md:mb-12">
                Über 15'000 zufriedene Kunden vertrauen auf umzugscheck.ch
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  name: "Sarah M.",
                  location: "Zürich",
                  rating: 5,
                  text: "Dank dem Vergleich habe ich CHF 800 gespart! Die Offerten waren schnell da und die Firmen sehr professionell."
                },
                {
                  name: "Marco B.",
                  location: "Bern",
                  rating: 5,
                  text: "Super Service! Konnte in nur 5 Minuten mehrere Angebote vergleichen und die beste Firma für meinen Umzug finden."
                },
                {
                  name: "Julia K.",
                  location: "Basel",
                  rating: 5,
                  text: "Transparent, schnell und kostenlos. Genau so sollte ein Vergleichsportal sein. Absolut empfehlenswert!"
                }
              ].map((review, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <Card className="p-6 hover:shadow-strong transition-shadow">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
                      "{review.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-bold text-primary">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{review.name}</div>
                        <div className="text-xs text-muted-foreground">{review.location}</div>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Block */}
        <section className="py-12 md:py-16 gradient-hero text-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  Bereit für den Vergleich?
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8">
                  Starten Sie jetzt Ihren kostenlosen Vergleich und finden Sie die beste Umzugsfirma für Ihre Bedürfnisse
                </p>
                <Link to="/rechner">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold">
                    GRATIS OFFERTEN STARTEN
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Compare;
