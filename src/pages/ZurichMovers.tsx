import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, CheckCircle2, Shield, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { InstantCalculator } from "@/components/home/InstantCalculator";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { FAQ } from "@/components/FAQ";
import { generateServiceSchema, generateBreadcrumbSchema, injectSchema } from "@/lib/schema-markup";

const topCompanies = [
  {
    name: "Zügelprofi Zürich",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
    rating: 4.9,
    reviews: 287,
    price: "Ab CHF 850",
    badges: ["Lokal", "Top bewertet"],
    location: "Zürich"
  },
  {
    name: "Swiss Move Zürich",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
    rating: 4.8,
    reviews: 195,
    price: "Ab CHF 780",
    badges: ["Express verfügbar", "Versichert"],
    location: "Zürich"
  },
  {
    name: "Umzugsteam Zürich",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&q=80",
    rating: 4.7,
    reviews: 142,
    price: "Ab CHF 920",
    badges: ["Lokal", "Versichert"],
    location: "Zürich"
  },
];

const reviews = [
  {
    name: "Sarah M.",
    district: "Zürich Oerlikon",
    rating: 5,
    text: "Sehr professionell und pünktlich. Der Umzug lief reibungslos!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
  },
  {
    name: "Thomas K.",
    district: "Zürich Altstetten",
    rating: 5,
    text: "Faire Preise und freundliches Team. Kann ich nur empfehlen.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80"
  },
  {
    name: "Maria L.",
    district: "Zürich Seefeld",
    rating: 5,
    text: "Schnelle Terminvergabe und sehr sorgfältiger Transport.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
  },
];

const priceRanges = [
  { type: "1-Zimmer", price: "CHF 450 – 850" },
  { type: "2-3 Zimmer", price: "CHF 1'200 – 2'200" },
  { type: "4+ Zimmer", price: "CHF 2'500 – 4'000" },
  { type: "Firmenumzug", price: "ab CHF 3'000" },
];

const ZurichMovers = () => {
  useEffect(() => {
    const schemas = [
      generateServiceSchema(
        "Umzugsfirmen Zürich",
        "Die besten Umzugsfirmen in Zürich vergleichen. Kostenlose Offerten von geprüften lokalen Profis.",
        "CHF 850-2500"
      ),
      generateBreadcrumbSchema([
        { name: "Startseite", url: "https://umzugscheck.ch" },
        { name: "Zürich", url: "https://umzugscheck.ch/zuerich" },
        { name: "Umzugsfirmen", url: "https://umzugscheck.ch/zuerich/umzugsfirmen" }
      ])
    ];
    injectSchema(schemas);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* 1. Hero Section */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
              alt="Zürich Stadtansicht"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/90" />
          </div>

          <div className="container mx-auto px-4 py-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <MapPin className="w-3 h-3 mr-1" />
                Zürich
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                Die besten Umzugsfirmen in Zürich im Vergleich
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/80 mb-8">
                Erhalte jetzt kostenlose Offerten von geprüften lokalen Profis.
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">4.8/5</span>
                  <span className="text-muted-foreground">Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-semibold">15+ lokale Anbieter</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-semibold">100% kostenlos</span>
                </div>
              </div>

              <Link to="/umzugsofferten">
                <Button size="lg" className="h-14 px-10 text-lg bg-accent hover:bg-accent/90">
                  Jetzt Offerten in Zürich vergleichen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 2. Local Calculator */}
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Umzugsrechner für Zürich
                </h2>
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-green-50 px-4 py-2 rounded-full border border-green-200">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  7 Personen aus Zürich vergleichen gerade Umzüge
                </div>
              </div>
              <InstantCalculator />
            </div>
          </div>
        </section>

        {/* 3. Top Companies */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Top-Umzugsfirmen in Zürich
            </h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
              {topCompanies.map((company, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-border"
                >
                  <div className="relative h-48">
                    <img
                      src={company.image}
                      alt={company.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {company.badges.map((badge, i) => (
                        <Badge key={i} className="bg-white/90 text-foreground">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{company.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{company.rating}</span>
                        <span className="text-muted-foreground">({company.reviews})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t">
                      <span className="text-lg font-bold text-primary">{company.price}</span>
                      <Shield className="h-5 w-5 text-success" />
                    </div>

                    <Link to="/umzugsofferten">
                      <Button className="w-full">
                        Offerte anfragen
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/firmen">
                <Button size="lg" variant="outline">
                  Alle Umzugsfirmen in Zürich anzeigen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 4. Local Benefits */}
        <section className="py-16 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Lokale Vorteile in Zürich
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Schnelle Terminverfügbarkeit</h3>
                <p className="text-muted-foreground">
                  Lokale Teams in Zürich reagieren schneller auf Ihre Anfrage
                </p>
              </div>
              <div className="text-center p-6">
                <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Regionale Preisstransparenz</h3>
                <p className="text-muted-foreground">
                  Vergleichen Sie Preise von Zürich-spezifischen Anbietern
                </p>
              </div>
              <div className="text-center p-6">
                <Shield className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Erfahrene Teams</h3>
                <p className="text-muted-foreground">
                  Umzugsexperten mit jahrelanger Erfahrung in Zürich
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Customer Reviews */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Kundenbewertungen aus Zürich
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-2xl p-6 shadow-md border border-border"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full"
                    />
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
                  <p className="text-foreground/80">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Price Ranges */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Preisspannen für Umzüge in Zürich
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-10">
              {priceRanges.map((range, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-xl p-6 text-center shadow-md border border-border hover:border-primary/30 transition-all"
                >
                  <h3 className="text-xl font-bold mb-3">{range.type}</h3>
                  <p className="text-2xl font-bold text-primary">{range.price}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/rechner">
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  Genauen Preis berechnen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 7. FAQ */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Häufig gestellte Fragen
              </h2>
              <FAQ />
            </div>
          </div>
        </section>

        {/* 8. CTA Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-95" />
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bereit für deinen Umzug in Zürich?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Erhalte jetzt kostenlose Offerten von geprüften Profis in deiner Region.
            </p>
            <Link to="/umzugsofferten">
              <Button size="lg" className="h-14 px-10 text-lg bg-white text-primary hover:bg-white/90">
                GRATIS OFFERTEN STARTEN
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default ZurichMovers;
