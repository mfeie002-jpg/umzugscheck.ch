import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Truck, Package, TrendingUp, Users, Wrench, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { FAQ } from "@/components/FAQ";
import { GradientCTA } from "@/components/home/GradientCTA";
import { EmotionalHero } from "@/components/home/EmotionalHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { generatePageSchemas, generateSchemaScript } from "@/lib/schema-markup";
import { generateMetaData, generateOGTags } from "@/lib/seo-meta";
import { getKeywordsForPage } from "@/lib/seo-keywords";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Helmet } from "react-helmet";

const priceCategories = [
  { icon: Home, type: "1 Zimmer", price: "CHF 450 – 850", gradient: "from-blue-500 to-cyan-500" },
  { icon: Home, type: "2 Zimmer", price: "CHF 650 – 1'300", gradient: "from-purple-500 to-pink-500" },
  { icon: Home, type: "3 Zimmer", price: "CHF 1'200 – 2'200", gradient: "from-orange-500 to-red-500" },
  { icon: Home, type: "4+ Zimmer", price: "ab CHF 2'000", gradient: "from-green-500 to-emerald-500" },
  { icon: Truck, type: "Firmenumzug", price: "individuell", gradient: "from-indigo-500 to-blue-500" },
];

const priceFactors = [
  { icon: Package, title: "Volumen", description: "Anzahl und Größe der Möbel und Kartons" },
  { icon: TrendingUp, title: "Distanz", description: "Entfernung zwischen alter und neuer Wohnung" },
  { icon: Home, title: "Stockwerk", description: "Etage und Verfügbarkeit von Aufzügen" },
  { icon: Users, title: "Teamgröße", description: "Anzahl der benötigten Umzugshelfer" },
  { icon: Wrench, title: "Zusatzservices", description: "Montage, Reinigung, Entsorgung, Verpackung" },
];

const examples = [
  {
    title: "3-Zimmer Umzug Zürich → Winterthur",
    details: "3 Zimmer, 2 Personen, 4. Stock mit Lift",
    price: "CHF 1'280",
    savings: "35% gespart",
  },
  {
    title: "2-Zimmer Umzug Basel Stadt",
    details: "2 Zimmer, 1 Person, 2. Stock ohne Lift",
    price: "CHF 890",
    savings: "28% gespart",
  },
  {
    title: "4.5-Zimmer Umzug Bern",
    details: "4.5 Zimmer, Familie, Erdgeschoss",
    price: "CHF 2'450",
    savings: "42% gespart",
  },
];

const Pricing = () => {
  // Generate SEO meta data
  const metaData = generateMetaData({ type: 'main-page', pageName: 'preise' });
  const currentUrl = 'https://www.umzugscheck.ch/preise';
  const ogTags = generateOGTags(metaData, currentUrl);
  
  // Generate keywords
  const keywords = getKeywordsForPage('preise');
  
  // Generate Schema.org structured data
  const schemas = generatePageSchemas({ type: 'preise', url: currentUrl });
  const schemaScript = generateSchemaScript(schemas);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <link rel="canonical" href={currentUrl} />
        
        {/* Keywords */}
        {keywords && keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(', ')} />
        )}
        
        {/* OpenGraph Tags */}
        <meta property="og:title" content={ogTags['og:title']} />
        <meta property="og:description" content={ogTags['og:description']} />
        <meta property="og:type" content={ogTags['og:type']} />
        <meta property="og:url" content={ogTags['og:url']} />
        <meta property="og:image" content={ogTags['og:image']} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content={ogTags['twitter:card']} />
        <meta name="twitter:title" content={ogTags['twitter:title']} />
        <meta name="twitter:description" content={ogTags['twitter:description']} />
        <meta name="twitter:image" content={ogTags['twitter:image']} />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">{schemaScript}</script>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs items={[{ label: "Preise" }]} />
      </div>

      {/* 1. Hero */}
      <EmotionalHero
        title="Was kostet ein Umzug in der Schweiz?"
        subtitle="Hier findest du transparente Richtpreise und kannst echte Offerten vergleichen."
        primaryCTA={{
          text: "Umzugspreis jetzt berechnen",
          link: "/rechner"
        }}
        badgeText="Transparente Preise"
        trustBadges={false}
        backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80"
      />

      <main>
        {/* 2. Price Overview */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Preisübersicht nach Wohnungsgröße
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {priceCategories.map((category, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-strong transition-all hover:-translate-y-2">
                      <div className={`h-2 bg-gradient-to-r ${category.gradient}`} />
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient}`}>
                            <category.icon className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{category.type}</h3>
                            <p className="text-2xl font-bold text-accent">{category.price}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 3. Price Factors */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Was beeinflusst den Preis?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {priceFactors.map((factor, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-medium transition-shadow h-full border-border/50">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
                        <factor.icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{factor.title}</h3>
                      <p className="text-muted-foreground">{factor.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 4. Price Examples */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Echte Preisbeispiele
              </h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {examples.map((example, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Card className="hover:shadow-strong transition-all hover:-translate-y-2 h-full">
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-xl font-bold">{example.title}</h3>
                        <p className="text-muted-foreground">{example.details}</p>
                        <div className="flex items-center justify-between py-3 border-t border-b">
                          <span className="text-sm text-muted-foreground">Endpreis:</span>
                          <span className="text-2xl font-bold text-accent">{example.price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-success">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-medium">{example.savings} durch Vergleich</span>
                        </div>
                        <Link to="/rechner">
                          <Button className="w-full" variant="outline">
                            Meinen Preis berechnen
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 5. Calculator CTA */}
        <GradientCTA
          title="Berechne deinen genauen Umzugspreis"
          description="In 2 Minuten zur individuellen Kostenschätzung"
          buttonText="Jetzt Preis berechnen"
          buttonLink="/rechner"
        />

        {/* 6. FAQ */}
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
      </main>

      <SimplifiedFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default Pricing;
