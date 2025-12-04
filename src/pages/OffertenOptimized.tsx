import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, Clock, TrendingDown, ArrowRight, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { FAQAccordion } from "@/components/FAQAccordion";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Helmet } from "react-helmet";
import { generateMetaData, generateOGTags } from "@/lib/seo-meta";
import { generatePageSchemas, generateSchemaScript } from "@/lib/schema-markup";
import { getKeywordsForPage } from "@/lib/seo-keywords";

const faqs = [
  {
    question: "Was kostet ein Umzug in der Schweiz?",
    answer: "Die Kosten variieren je nach Umfang, Distanz und zusätzlichen Services. Ein 2-Zimmer-Umzug kostet durchschnittlich CHF 800-1'500, ein 4-Zimmer-Umzug CHF 1'500-3'000. Mit unserem Vergleich sparen Sie bis zu 40%."
  },
  {
    question: "Sind die Offerten wirklich kostenlos?",
    answer: "Ja, 100%. Umzugscheck.ch ist für Privatkunden vollständig kostenlos und unverbindlich. Sie bezahlen nur die Umzugsfirma, die Sie beauftragen."
  },
  {
    question: "Wie viele Offerten sollte ich einholen?",
    answer: "Wir empfehlen 3-5 Offerten zu vergleichen. Das gibt Ihnen einen guten Marktüberblick und zeigt, welche Firma das beste Preis-Leistungs-Verhältnis bietet."
  },
  {
    question: "Wie lange dauert der Vergleich?",
    answer: "Das Ausfüllen des Formulars dauert 2-3 Minuten. Innerhalb von 24 Stunden erhalten Sie passende Offerten von geprüften Umzugsfirmen."
  },
  {
    question: "Sind alle Firmen geprüft und versichert?",
    answer: "Ja, alle Partner-Firmen auf Umzugscheck.ch sind geprüft, versichert und zertifiziert. Wir arbeiten nur mit seriösen Schweizer Umzugsunternehmen."
  }
];

const regions = [
  "Zürich", "Bern", "Basel", "Luzern", "Aargau", "St. Gallen",
  "Zug", "Schwyz", "Thurgau", "Solothurn", "Graubünden", "Wallis"
];

export default function OffertenOptimized() {
  const metaData = generateMetaData({ type: 'main-page', pageName: 'offerten' });
  const currentUrl = 'https://www.umzugscheck.ch/offerten';
  const ogTags = generateOGTags(metaData, currentUrl);
  const keywords = getKeywordsForPage('offerten');
  const schemas = generatePageSchemas({ type: 'offerten', url: currentUrl }, faqs);
  const schemaScript = generateSchemaScript(schemas);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <link rel="canonical" href={currentUrl} />
        <meta name="keywords" content={keywords.join(', ')} />
        
        <meta property="og:title" content={ogTags['og:title']} />
        <meta property="og:description" content={ogTags['og:description']} />
        <meta property="og:type" content={ogTags['og:type']} />
        <meta property="og:url" content={ogTags['og:url']} />
        <meta property="og:image" content={ogTags['og:image']} />
        
        <meta name="twitter:card" content={ogTags['twitter:card']} />
        <meta name="twitter:title" content={ogTags['twitter:title']} />
        <meta name="twitter:description" content={ogTags['twitter:description']} />
        <meta name="twitter:image" content={ogTags['twitter:image']} />

        <script type="application/ld+json">{schemaScript}</script>
      </Helmet>

      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs items={[{ label: "Offerten" }]} />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-primary z-0" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80')" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Umzugsofferten vergleichen und bis zu 40% sparen
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/95">
                Erhalten Sie kostenlose Offerten von geprüften Schweizer Umzugsfirmen – schnell, transparent und unverbindlich.
              </p>
              
              <Link to="/rechner">
                <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-accent hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  Jetzt Offerten erhalten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <div className="flex flex-wrap justify-center gap-6 mt-10">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Geprüfte Anbieter</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <TrendingDown className="w-5 h-5" />
                  <span className="text-sm font-medium">Bis zu 40% günstiger</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">100% kostenlos</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main>
        {/* Why Multiple Offers */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Warum mehrere Offerten vergleichen?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Ein Vergleich lohnt sich immer – hier ist warum
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    icon: TrendingDown,
                    title: "Preisunterschiede bis zu 40%",
                    description: "Die Preise variieren stark zwischen Anbietern"
                  },
                  {
                    icon: Clock,
                    title: "Schnellere Terminfindung",
                    description: "Mehr Firmen bedeuten flexible Terminwahl"
                  },
                  {
                    icon: Shield,
                    title: "Nur seriöse Anbieter",
                    description: "Alle Partner sind geprüft und versichert"
                  },
                  {
                    icon: Star,
                    title: "Bessere Qualität",
                    description: "Vergleichen Sie Bewertungen und Services"
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Card key={idx} className="p-6 text-center hover:shadow-strong transition-all">
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-base mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 3-Step Process */}
        <ScrollReveal>
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                So einfach geht's
              </h2>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  { num: 1, title: "Formular ausfüllen", desc: "Beschreiben Sie Ihren Umzug in 2-3 Minuten" },
                  { num: 2, title: "Offerten erhalten", desc: "Innerhalb von 24h von 3-5 geprüften Firmen" },
                  { num: 3, title: "Beste Firma wählen", desc: "Vergleichen Sie und sparen Sie bis zu 40%" }
                ].map((step, idx) => (
                  <div key={idx} className="text-center">
                    <div className="w-16 h-16 gradient-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-accent">
                      {step.num}
                    </div>
                    <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/rechner">
                  <Button variant="cta" size="lg" className="h-14 px-10 text-lg font-bold">
                    Jetzt kostenlos vergleichen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Region Links */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-secondary/20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Umzugsofferten nach Region
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {regions.map((region) => (
                  <Link
                    key={region}
                    to={`/kanton/${region.toLowerCase().replace(' ', '-')}`}
                    className="group"
                  >
                    <Card className="p-4 text-center hover:shadow-strong transition-all hover:-translate-y-1">
                      <MapPin className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {region}
                      </span>
                    </Card>
                  </Link>
                ))}
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
                  Häufig gestellte Fragen
                </h2>
                <FAQAccordion items={faqs} variant="compact" />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Final CTA */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 gradient-cta opacity-95" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Jetzt kostenlose Umzugsofferten vergleichen
              </h2>
              <p className="text-xl mb-8 text-white/95">
                Sparen Sie Zeit und Geld mit unserem kostenlosen Vergleichsservice
              </p>
              <Link to="/rechner">
                <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-accent hover:bg-white/90 shadow-xl">
                  Offerten erhalten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm mt-6 text-white/80">
                ✓ 100% kostenlos  ✓ Unverbindlich  ✓ In 2 Minuten
              </p>
            </div>
          </div>
        </section>
      </main>

      
      <StickyMobileCTA />
    </div>
  );
}
