/**
 * Pillar Page: /umzugsfirmen-schweiz
 * 
 * SEO-optimierte Hub-Seite die alle 26 Kantone verlinkt
 * Starke interne Verlinkung für SEO-Cluster
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, Star, ArrowRight, Search, Shield, 
  CheckCircle, Building2, Truck, ChevronRight,
  Clock, BadgeCheck, Home
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CANTONS, getRegionBySlug, type Canton } from "@/data/regions-database";
import { FAQAccordion } from "@/components/FAQAccordion";

// Group cantons by region for better UX
const REGION_GROUPS = [
  {
    name: "Deutschschweiz",
    cantons: ["zuerich", "bern", "luzern", "basel-stadt", "aargau", "st-gallen", "zug", "thurgau", "schaffhausen", "solothurn", "schwyz", "glarus", "uri", "obwalden", "nidwalden", "appenzell-ausserrhoden", "appenzell-innerrhoden"]
  },
  {
    name: "Westschweiz",
    cantons: ["genf", "waadt", "freiburg", "neuenburg", "jura", "wallis"]
  },
  {
    name: "Südschweiz",
    cantons: ["tessin", "graubuenden"]
  }
];

const PILLAR_FAQS = [
  {
    question: "Wie finde ich die beste Umzugsfirma in meiner Region?",
    answer: "Nutzen Sie unseren kostenlosen Vergleichsservice: Geben Sie Ihre Umzugsdaten ein und erhalten Sie bis zu 5 Offerten von geprüften Umzugsfirmen in Ihrer Region. Vergleichen Sie Preise, Bewertungen und Services – und sparen Sie bis zu 40%."
  },
  {
    question: "Was kostet ein Umzug in der Schweiz durchschnittlich?",
    answer: "Die Kosten variieren je nach Region und Umfang: Eine 3.5-Zimmer-Wohnung kostet zwischen CHF 800 und CHF 2'500. In Zürich und Genf sind die Preise tendenziell höher als in ländlichen Kantonen. Mit unserem Vergleich finden Sie das beste Preis-Leistungs-Verhältnis."
  },
  {
    question: "Sind alle Umzugsfirmen auf Umzugscheck.ch geprüft?",
    answer: "Ja, alle Partner durchlaufen einen strengen Qualitätscheck: Versicherungsnachweis, Handelsregistereintrag, Kundenbewertungen und persönliche Verifizierung. Nur Firmen mit mindestens 4.0 Sternen werden aufgenommen."
  },
  {
    question: "Wie schnell erhalte ich Offerten?",
    answer: "In der Regel erhalten Sie innerhalb von 24 Stunden 3-5 unverbindliche Offerten. Bei dringenden Anfragen können Sie telefonisch eine Express-Vermittlung anfordern."
  },
  {
    question: "Kann ich auch nur einzelne Services buchen?",
    answer: "Absolut! Neben Komplettumzügen bieten unsere Partner auch Einzelservices: Reinigung, Entsorgung, Möbelmontage, Packservice oder Lagerung. Wählen Sie einfach die gewünschten Services bei der Anfrage aus."
  }
];

const UmzugsfirmenSchweizPillar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter cantons by search
  const filteredCantons = useMemo(() => {
    if (!searchTerm) return CANTONS;
    const term = searchTerm.toLowerCase();
    return CANTONS.filter(c => 
      c.name.toLowerCase().includes(term) || 
      c.slug.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Stats for the page
  const totalCompanies = 200;
  const totalReviews = 15000;
  const avgRating = 4.8;

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Umzugsfirmen Schweiz - Alle Kantone vergleichen",
        "description": "Vergleichen Sie 200+ geprüfte Umzugsfirmen in allen 26 Schweizer Kantonen. Kostenlose Offerten, bis zu 40% sparen.",
        "url": "https://umzugscheck.ch/umzugsfirmen-schweiz"
      },
      {
        "@type": "ItemList",
        "name": "Umzugsfirmen nach Kanton",
        "numberOfItems": 26,
        "itemListElement": CANTONS.map((canton, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": `Umzugsfirmen ${canton.name}`,
          "url": `https://umzugscheck.ch/umzugsfirmen/${canton.slug}`
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": PILLAR_FAQS.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzugsfirmen Schweiz: Alle 26 Kantone vergleichen | Umzugscheck.ch</title>
        <meta name="description" content="Vergleichen Sie 200+ geprüfte Umzugsfirmen in allen 26 Schweizer Kantonen. Kostenlose Offerten erhalten und bis zu 40% sparen. Zürich, Bern, Basel, Genf und mehr." />
        <meta name="keywords" content="umzugsfirmen schweiz, umzugsunternehmen schweiz, umzugsfirma finden, umzug schweiz, umzugsfirmen vergleichen" />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsfirmen-schweiz" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <MapPin className="w-3 h-3 mr-1" />
              Alle 26 Kantone
            </Badge>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Umzugsfirmen in der <span className="text-primary">Schweiz</span> vergleichen
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Finden Sie die besten Umzugsfirmen in Ihrem Kanton. Kostenlose Offerten von 
              <span className="text-primary font-semibold"> 200+ geprüften Partnern</span> – 
              und sparen Sie bis zu 40%.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto mb-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{totalCompanies}+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Firmen</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{(totalReviews / 1000).toFixed(0)}k+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Bewertungen</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 md:w-6 md:h-6 fill-amber-400 text-amber-400" />
                  <span className="text-2xl md:text-3xl font-bold">{avgRating}</span>
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">Ø Bewertung</div>
              </div>
            </div>

            {/* Quick CTA */}
            <Link to="/umzugsofferten">
              <Button size="lg" className="h-12 md:h-14 px-8 text-base md:text-lg font-semibold">
                Jetzt kostenlos Offerten erhalten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { icon: Shield, label: "100% Versichert" },
              { icon: BadgeCheck, label: "Geprüfte Partner" },
              { icon: Clock, label: "Schnelle Offerten" },
              { icon: CheckCircle, label: "Kostenlos & Unverbindlich" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <item.icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Canton Search */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Kanton suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Canton Grid by Region */}
          {searchTerm ? (
            // Search results
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">
                {filteredCantons.length} Kantone gefunden
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {filteredCantons.map((canton) => (
                  <CantonCard key={canton.slug} canton={canton} />
                ))}
              </div>
            </div>
          ) : (
            // Grouped by region
            <div className="space-y-10">
              {REGION_GROUPS.map((group) => {
                const groupCantons = CANTONS.filter(c => group.cantons.includes(c.slug));
                return (
                  <div key={group.name} className="max-w-5xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {group.name}
                      <Badge variant="secondary" className="ml-2">{groupCantons.length} Kantone</Badge>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                      {groupCantons.map((canton) => (
                        <CantonCard key={canton.slug} canton={canton} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Alle Umzugsservices im Überblick
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: "Privatumzug", icon: Home, link: "/privatumzug", desc: "Wohnungsumzüge" },
                { title: "Firmenumzug", icon: Building2, link: "/firmenumzug", desc: "Büro & Gewerbe" },
                { title: "Reinigung", icon: CheckCircle, link: "/umzugsreinigung", desc: "Mit Abgabegarantie" },
                { title: "Entsorgung", icon: Truck, link: "/entsorgung", desc: "Räumung & Mulden" },
                { title: "Lagerung", icon: Building2, link: "/lagerung", desc: "Kurz- & Langzeit" },
                { title: "Spezialtransporte", icon: Truck, link: "/spezialtransporte", desc: "Klavier, Kunst, etc." },
              ].map((service, i) => (
                <Link key={i} to={service.link}>
                  <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all group">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <service.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{service.title}</h3>
                        <p className="text-xs text-muted-foreground">{service.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              So einfach funktioniert's
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: 1, title: "Anfrage stellen", desc: "Umzugsdaten eingeben – dauert nur 2 Minuten", time: "2 Min." },
                { step: 2, title: "Offerten erhalten", desc: "3-5 kostenlose Angebote von geprüften Firmen", time: "24-48h" },
                { step: 3, title: "Firma wählen", desc: "Vergleichen, auswählen und bis zu 40% sparen", time: "Ihr Tempo" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                        {item.step}
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                      <Badge variant="secondary">{item.time}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Häufige Fragen zu Umzugsfirmen in der Schweiz
            </h2>
            <FAQAccordion items={PILLAR_FAQS} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Bereit für Ihren Umzug?
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-xl mx-auto">
            Erhalten Sie jetzt kostenlose Offerten von geprüften Umzugsfirmen in Ihrem Kanton.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/umzugsofferten">
              <Button size="lg" variant="secondary" className="h-12 px-8 font-semibold">
                Offerten anfordern
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/preisrechner">
              <Button size="lg" variant="outline" className="h-12 px-8 font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Kosten berechnen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Canton Card Component
const CantonCard = ({ canton }: { canton: Canton }) => {
  const regionData = getRegionBySlug(canton.slug);
  const companyCount = regionData?.topCompanies?.length || 10;
  const avgRating = regionData?.stats?.avgRating || 4.7;

  return (
    <Link to={`/umzugsfirmen/${canton.slug}`}>
      <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {canton.short}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{avgRating}</span>
            </div>
          </div>
          <h3 className="font-semibold group-hover:text-primary transition-colors text-sm md:text-base">
            {canton.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {companyCount}+ Firmen
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default UmzugsfirmenSchweizPillar;
