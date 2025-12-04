import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, TrendingDown, Shield, BarChart3, ArrowRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

import { EmotionalHero } from "@/components/home/EmotionalHero";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { generatePageSchemas, generateSchemaScript } from "@/lib/schema-markup";

interface Company {
  id: string;
  name: string;
  logo: string;
  rating: number;
  review_count: number;
  price_level: string;
  services: string[];
  verified: boolean;
  service_areas: string[];
}

const Compare = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentUrl = 'https://www.umzugscheck.ch/vergleich/';
  const schemas = generatePageSchemas({ type: 'vergleich', url: currentUrl });
  const schemaScript = generateSchemaScript(schemas);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("rating", { ascending: false })
        .limit(8);

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriceDisplay = (priceLevel: string) => {
    switch (priceLevel?.toLowerCase()) {
      case 'günstig':
        return { text: 'Ab CHF 450', color: 'text-green-600' };
      case 'fair':
        return { text: 'Ab CHF 650', color: 'text-blue-600' };
      case 'premium':
        return { text: 'Ab CHF 1200', color: 'text-purple-600' };
      default:
        return { text: 'Auf Anfrage', color: 'text-muted-foreground' };
    }
  };

  const whyCompareReasons = [
    {
      icon: TrendingDown,
      title: "Bis zu 40% sparen",
      description: "Vergleich mehrerer Angebote garantiert bessere Preise"
    },
    {
      icon: Shield,
      title: "Höhere Qualität",
      description: "Nur geprüfte Firmen mit echten Kundenbewertungen"
    },
    {
      icon: BarChart3,
      title: "Schnelle Angebote",
      description: "Offerten in Minuten statt Tagen"
    }
  ];

  return (
    <>
      <OptimizedSEO
        title="Umzugsfirmen vergleichen – Transparent, schnell & kostenlos"
        description="Finde die besten Umzugsangebote für deinen Umzug in der Schweiz. Kostenloser Vergleich von Preisen, Bewertungen und Services."
        keywords="umzugsfirmen vergleichen, umzug vergleich, umzugsangebote vergleichen"
        canonicalUrl={currentUrl}
        schemaMarkup={schemas}
      />
      
      <div className="min-h-screen bg-background">

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs items={[{ label: "Vergleich" }]} />
      </div>

      {/* Hero */}
      <EmotionalHero
        title="Umzugsfirmen vergleichen: Transparent, schnell, kostenlos"
        subtitle="Finde die besten Angebote für deinen Umzug in der Schweiz."
        primaryCTA={{
          text: "JETZT GRATIS VERGLEICH STARTEN",
          link: "/umzugsofferten"
        }}
        badgeText="100% kostenlos & unverbindlich"
        trustBadges={false}
        backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80"
      />

      <main>
        {/* Filter & Sort Bar */}
        <section className="py-6 bg-white border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">Alle Preise</Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">Top Bewertet</Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">Günstigste</Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">Sofort verfügbar</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Comparison Table */}
        <section className="py-12 md:py-16 hidden md:block">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-center mb-12">
                Die besten Umzugsfirmen im Vergleich
              </h2>
            </ScrollReveal>

            <Card className="shadow-strong overflow-hidden">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary/5 to-primary/10 border-b-2 border-border">
                      <th className="p-4 text-left font-bold text-foreground">Firma</th>
                      <th className="p-4 text-center font-bold text-foreground">Bewertung</th>
                      <th className="p-4 text-center font-bold text-foreground">Preis</th>
                      <th className="p-4 text-center font-bold text-foreground">Verfügbarkeit</th>
                      <th className="p-4 text-center font-bold text-foreground">Services</th>
                      <th className="p-4 text-center font-bold text-foreground">Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-muted-foreground">
                          Firmen werden geladen...
                        </td>
                      </tr>
                    ) : (
                      companies.map((company, index) => {
                        const priceInfo = getPriceDisplay(company.price_level);
                        return (
                          <tr 
                            key={company.id} 
                            className="border-b border-border hover:bg-secondary/10 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="text-4xl">{company.logo}</div>
                                <div>
                                  <div className="font-bold text-foreground">{company.name}</div>
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
                                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xl font-bold text-foreground">{company.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">({company.review_count} Bewertungen)</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`font-bold text-lg ${priceInfo.color}`}>{priceInfo.text}</span>
                            </td>
                            <td className="p-4 text-center">
                              <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                                Sofort verfügbar
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 justify-center max-w-[200px] mx-auto">
                                <Badge variant="secondary" className="text-xs">Umzug</Badge>
                                <Badge variant="secondary" className="text-xs">Reinigung</Badge>
                                <Badge variant="secondary" className="text-xs">Montage</Badge>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <Link to="/umzugsofferten">
                                <Button className="shadow-md">
                                  Offerte anfragen
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mobile: Airbnb-style Cards */}
        <section className="py-12 md:hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Die besten Umzugsfirmen
            </h2>

            <div className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Firmen werden geladen...
                  </CardContent>
                </Card>
              ) : (
                companies.map((company, index) => {
                  const priceInfo = getPriceDisplay(company.price_level);
                  return (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="shadow-strong hover:shadow-xl transition-all">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="text-5xl">{company.logo}</div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1">{company.name}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                <span className="text-lg font-bold">{company.rating.toFixed(1)}</span>
                                <span className="text-sm text-muted-foreground">({company.review_count})</span>
                              </div>
                              {company.verified && (
                                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Verifiziert
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between py-2 border-b border-border">
                              <span className="text-sm text-muted-foreground">Preis:</span>
                              <span className={`font-bold ${priceInfo.color}`}>{priceInfo.text}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-border">
                              <span className="text-sm text-muted-foreground">Verfügbarkeit:</span>
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                Sofort verfügbar
                              </Badge>
                            </div>
                            <div className="py-2">
                              <span className="text-sm text-muted-foreground mb-2 block">Services:</span>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="text-xs">Umzug</Badge>
                                <Badge variant="secondary" className="text-xs">Reinigung</Badge>
                                <Badge variant="secondary" className="text-xs">Entsorgung</Badge>
                              </div>
                            </div>
                          </div>

                          <Link to="/umzugsofferten">
                            <Button className="w-full h-12 text-base font-bold">
                              Offerte anfragen
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* Why Compare */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Warum vergleichen?
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Ein Vergleich spart Zeit, Geld und Nerven
              </p>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                {whyCompareReasons.map((reason, index) => {
                  const Icon = reason.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="text-center p-8 hover:shadow-strong transition-all h-full border-border/50">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
                          <Icon className="w-8 h-8 text-white" />
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

        {/* Reviews Block */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Was unsere Nutzer sagen
              </h2>

              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    name: "Sarah M.",
                    location: "Zürich",
                    text: "Dank dem Vergleich habe ich CHF 800 gespart! Sehr empfehlenswert."
                  },
                  {
                    name: "Marco B.",
                    location: "Bern",
                    text: "Super einfach und schnell. Die Offerten kamen innerhalb von 24 Stunden."
                  },
                  {
                    name: "Julia K.",
                    location: "Basel",
                    text: "Transparent und kostenlos. Genau so sollte ein Vergleichsportal sein!"
                  }
                ].map((review, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-medium transition-shadow h-full">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4">"{review.text}"</p>
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <p className="text-sm text-muted-foreground">{review.location}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
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
                Bereit für deinen stressfreien Umzug?
              </h2>
              <p className="text-lg md:text-xl mb-10 text-white/90">
                Starte jetzt den kostenlosen Vergleich
              </p>
              <Link to="/umzugsofferten">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-strong"
                >
                  Vergleich starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      
      <StickyMobileCTA />
    </div>
    </>
  );
};

export default Compare;
