import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Shield, CheckCircle2, Clock, Users, TrendingDown,
  Home, Building2, Sparkles, ArrowUpFromLine, Package, Trash2,
  ChevronRight, Phone, MessageCircle, ArrowRight, Play,
  Award, Lock, Zap, MapPin, Calendar, Calculator,
  ChevronDown, Quote, Truck, BadgeCheck, Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ============================================
// ZUG V3 - CONVERSION-OPTIMIZED LANDING PAGE
// Focus: Lead Generation, Trust, Clarity
// ============================================

const ZugV3Landing = () => {
  const [fromPLZ, setFromPLZ] = useState("");
  const [toPLZ, setToPLZ] = useState("");
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Was kostet ein Umzug in Zug durchschnittlich?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die Kosten variieren je nach Wohnungsgrösse. Für eine 2.5-Zimmer-Wohnung rechnen Sie mit CHF 700-900, für 3.5 Zimmer mit CHF 850-1'200."
        }
      },
      {
        "@type": "Question",
        "name": "Sind die Offerten wirklich kostenlos und unverbindlich?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, alle Offerten sind 100% kostenlos und unverbindlich. Sie gehen keine Verpflichtung ein."
        }
      },
      {
        "@type": "Question",
        "name": "Wie viele Offerten erhalte ich?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sie erhalten bis zu 5 Offerten von geprüften Umzugsfirmen aus der Region Zug."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Umzugsfirma Zug – Kostenlos Offerten vergleichen & bis 40% sparen</title>
        <meta name="description" content="Umzug in Zug geplant? ✔️ Kostenlose Offerten von geprüften Umzugsfirmen erhalten ✔️ Bis 40% sparen ✔️ 200+ Partner – Jetzt Angebot sichern!" />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsfirmen/zug-v3" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* ============================================ */}
        {/* HERO SECTION - Above the Fold */}
        {/* ============================================ */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background with overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1573166364902-982ae9e0fdcc?w=1920&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
          </div>

          <div className="container relative z-10 py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Trust badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="h-4 w-4 fill-current" />
                  <span>4.8/5 Sterne • 15'000+ erfolgreiche Umzüge</span>
                </div>

                {/* H1 Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Umzug Zug –{" "}
                  <span className="text-primary">Jetzt gratis vergleichen</span>
                </h1>

                {/* USP Sub-headline */}
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    200+ geprüfte Partner
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Echte Kundenbewertungen
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Bis 40% sparen
                  </span>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4 py-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">97</div>
                    <div className="text-sm text-muted-foreground">Umzüge diese Woche</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">Ø 4.8</div>
                    <div className="text-sm text-muted-foreground">Kundenbewertung</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">40%</div>
                    <div className="text-sm text-muted-foreground">Ersparnis möglich</div>
                  </div>
                </div>

                {/* Mobile CTA */}
                <div className="lg:hidden">
                  <Link to="/umzugsofferten">
                    <Button size="lg" className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
                      Jetzt Offerte erhalten
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    100% kostenlos & unverbindlich
                  </p>
                </div>
              </motion.div>

              {/* Right: Form Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                      Kostenlose Offerten erhalten
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      In nur 2 Minuten zu Ihren Angeboten
                    </p>
                  </div>

                  <form className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Von (PLZ oder Ort)
                      </label>
                      <Input
                        placeholder="z.B. 6300 Zug"
                        value={fromPLZ}
                        onChange={(e) => setFromPLZ(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Nach (PLZ oder Ort)
                      </label>
                      <Input
                        placeholder="z.B. 8001 Zürich"
                        value={toPLZ}
                        onChange={(e) => setToPLZ(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <Link to="/umzugsofferten" className="block">
                      <Button className="w-full h-14 text-lg bg-primary hover:bg-primary/90">
                        Jetzt Offerten erhalten
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </form>

                  {/* Trust indicators */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Lock className="h-4 w-4" />
                        SSL-gesichert
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        Datenschutz
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Gratis
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* TRUST SECTION */}
        {/* ============================================ */}
        <section className="py-8 bg-muted/30 border-y border-border">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
              {/* Trust badges */}
              {[
                { icon: Shield, label: "Geprüfte Partner" },
                { icon: Star, label: "4.8/5 Bewertung" },
                { icon: Lock, label: "100% Datensicher" },
                { icon: Award, label: "Swiss Quality" },
                { icon: Users, label: "15'000+ Kunden" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground">
                  <badge.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* TOP COMPANIES PREVIEW */}
        {/* ============================================ */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Beliebte Umzugsfirmen in Zug
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Geprüft & empfohlen – Diese Partner stehen für Qualität und Zuverlässigkeit
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Zuger Umzüge AG", rating: 4.9, reviews: 187, price: "€€", since: 2018, specialty: "Privatumzüge" },
                { name: "Alpentransport Zug", rating: 4.8, reviews: 143, price: "€€€", since: 2015, specialty: "Firmenumzüge" },
                { name: "City Moving Zug", rating: 4.7, reviews: 98, price: "€", since: 2020, specialty: "Kleine Umzüge" },
              ].map((company, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Truck className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-sm">
                      <BadgeCheck className="h-4 w-4" />
                      Geprüft
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{company.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{company.rating}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">({company.reviews} Bewertungen)</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-muted px-2 py-1 rounded text-sm">{company.price}</span>
                    <span className="bg-muted px-2 py-1 rounded text-sm">Seit {company.since}</span>
                    <span className="bg-muted px-2 py-1 rounded text-sm">{company.specialty}</span>
                  </div>

                  <Link to="/umzugsofferten">
                    <Button variant="outline" className="w-full">
                      Offerte anfragen
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/umzugsofferten">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Alle Firmen vergleichen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* PRICE EXAMPLES */}
        {/* ============================================ */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Preisbeispiele für Umzüge in Zug
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transparente Richtpreise – Ihr individuelles Angebot kann abweichen
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { rooms: "1.5 Zimmer", price: "500–700", included: "Transport, 2 Helfer" },
                { rooms: "2.5 Zimmer", price: "700–900", included: "Transport, 2-3 Helfer" },
                { rooms: "3.5 Zimmer", price: "850–1'200", included: "Transport, 3 Helfer, Verpackung" },
                { rooms: "4.5+ Zimmer", price: "1'200–1'800", included: "Full-Service möglich" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.rooms}</h3>
                  <div className="text-3xl font-bold text-primary mb-2">
                    CHF {item.price}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.included}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Preise gelten für Umzüge innerhalb des Kantons Zug. Individuelle Faktoren beeinflussen den Endpreis.
              </p>
              <Link to="/umzugsofferten">
                <Button variant="outline" size="lg">
                  <Calculator className="mr-2 h-5 w-5" />
                  Ihren genauen Preis berechnen
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SERVICES */}
        {/* ============================================ */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Unsere Services in Zug
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Alles aus einer Hand – von Privatumzug bis Endreinigung
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  icon: Home, 
                  title: "Privatumzug", 
                  desc: "Stressfrei umziehen mit Profis – von der Planung bis zum Auspacken",
                  link: "/privatumzug"
                },
                { 
                  icon: Building2, 
                  title: "Firmenumzug", 
                  desc: "Büroumzug mit minimaler Ausfallzeit – professionell organisiert",
                  link: "/firmenumzug"
                },
                { 
                  icon: Sparkles, 
                  title: "Reinigungsservice", 
                  desc: "Endreinigung mit Abnahmegarantie für Ihre Wohnungsübergabe",
                  link: "/reinigung"
                },
                { 
                  icon: ArrowUpFromLine, 
                  title: "Möbellift", 
                  desc: "Schonendes Heben schwerer Möbel – auch in höhere Stockwerke",
                  link: "/umzug"
                },
                { 
                  icon: Package, 
                  title: "Lagerung", 
                  desc: "Sichere Einlagerung Ihrer Möbel – kurz- oder langfristig",
                  link: "/lagerung"
                },
                { 
                  icon: Trash2, 
                  title: "Entsorgung", 
                  desc: "Professionelle Entrümpelung und fachgerechte Entsorgung",
                  link: "/entsorgung"
                },
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.desc}</p>
                  <Link 
                    to={service.link}
                    className="text-primary font-medium inline-flex items-center hover:underline"
                  >
                    Mehr erfahren
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* HOW IT WORKS - 3 Steps */}
        {/* ============================================ */}
        <section className="py-16 lg:py-20 bg-primary/5">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                So funktioniert's
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                In 3 einfachen Schritten zu Ihrer kostenlosen Umzugsofferte
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  step: 1,
                  icon: Calendar,
                  title: "Anfrage stellen",
                  desc: "Füllen Sie das Online-Formular in nur 2 Minuten aus. Geben Sie Start, Ziel und Umzugsdatum an.",
                  highlight: "Dauert nur 2 Minuten"
                },
                {
                  step: 2,
                  icon: Package,
                  title: "Offerten erhalten",
                  desc: "Erhalten Sie bis zu 5 Angebote von geprüften Umzugsfirmen aus der Region Zug.",
                  highlight: "Kostenlos & unverbindlich"
                },
                {
                  step: 3,
                  icon: TrendingDown,
                  title: "Vergleichen & Sparen",
                  desc: "Vergleichen Sie Preise und Bewertungen. Wählen Sie das beste Angebot und sparen Sie bis zu 40%.",
                  highlight: "Bis 40% Ersparnis"
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative text-center"
                >
                  {/* Step number */}
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  
                  {/* Connector line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-primary/20" />
                  )}

                  <div className="bg-card border border-border rounded-xl p-6">
                    <item.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground mb-3">{item.desc}</p>
                    <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                      {item.highlight}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/umzugsofferten">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                  Jetzt starten – Kostenlos & unverbindlich
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* TESTIMONIALS */}
        {/* ============================================ */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Das sagen unsere Kunden
              </h2>
              <div className="flex items-center justify-center gap-2 text-lg">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-semibold">4.8/5</span>
                <span className="text-muted-foreground">basierend auf 1'247 Bewertungen</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Familie Meier",
                  location: "Zug",
                  rating: 5,
                  text: "Der Umzug mit Umzugscheck war super einfach! Wir haben 3 Angebote erhalten und CHF 350 gespart. Absolut empfehlenswert!",
                  saved: "350"
                },
                {
                  name: "Thomas K.",
                  location: "Baar",
                  rating: 5,
                  text: "Schnell, professionell und günstig. Die Firma war pünktlich und hat alles sorgfältig transportiert. Top Service!",
                  saved: "280"
                },
                {
                  name: "Sarah M.",
                  location: "Cham",
                  rating: 5,
                  text: "Ich war skeptisch, aber der Vergleich hat sich gelohnt. Super transparenter Prozess und freundliche Umzugshelfer.",
                  saved: "420"
                },
              ].map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  <p className="text-foreground mb-4 italic">"{review.text}"</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.location}</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                      CHF {review.saved} gespart
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* FAQ SECTION */}
        {/* ============================================ */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Häufige Fragen
              </h2>
              <p className="text-lg text-muted-foreground">
                Antworten auf die wichtigsten Fragen zum Umzug in Zug
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: "Was kostet ein Umzug in Zug durchschnittlich?",
                  a: "Die Kosten variieren je nach Wohnungsgrösse, Distanz und Zusatzleistungen. Für eine 2.5-Zimmer-Wohnung innerhalb von Zug rechnen Sie mit CHF 700-900. Für 3.5 Zimmer mit CHF 850-1'200. Mit unserem Vergleich können Sie bis zu 40% sparen."
                },
                {
                  q: "Sind die Offerten wirklich kostenlos und unverbindlich?",
                  a: "Ja, absolut! Die Anfrage und alle erhaltenen Offerten sind 100% kostenlos und unverbindlich. Sie gehen keine Verpflichtung ein und können frei entscheiden, ob und welches Angebot Sie annehmen."
                },
                {
                  q: "Wie viele Offerten erhalte ich?",
                  a: "Sie erhalten bis zu 5 Offerten von geprüften Umzugsfirmen aus der Region Zug. So können Sie Preise und Leistungen optimal vergleichen und das beste Angebot wählen."
                },
                {
                  q: "Wie werden die Umzugsfirmen geprüft?",
                  a: "Alle Partner durchlaufen einen strengen Qualitätsprozess. Wir prüfen Lizenzen, Versicherungen und Kundenbewertungen. Nur Firmen mit nachweislich hoher Qualität werden in unser Netzwerk aufgenommen."
                },
                {
                  q: "Wie früh sollte ich meinen Umzug in Zug planen?",
                  a: "Wir empfehlen, mindestens 4-6 Wochen vor dem Umzugstermin Offerten einzuholen. In beliebten Zeiten (Monatsende, Sommerferien) sollten Sie noch früher planen. Je früher, desto mehr Auswahl und bessere Preise."
                },
                {
                  q: "Kann ich auch nur eine Endreinigung anfragen?",
                  a: "Ja, wir vermitteln auch Reinigungsservices separat. Sie können eine professionelle Endreinigung mit Abnahmegarantie anfragen – ideal für die Wohnungsübergabe in Zug."
                },
              ].map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`faq-${i}`}
                  className="bg-card border border-border rounded-xl px-6"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ============================================ */}
        {/* FINAL CTA */}
        {/* ============================================ */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Bereit für einen entspannten Umzug in Zug?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Fordern Sie jetzt Ihre kostenlosen Offerten an und sparen Sie bis zu 40%!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/umzugsofferten">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
                  >
                    Jetzt kostenlos Offerten erhalten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="tel:+41412345678">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    041 234 56 78
                  </Button>
                </a>
              </div>

              <div className="flex items-center justify-center gap-6 mt-8 text-sm opacity-80">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  100% kostenlos
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Unverbindlich
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Geprüfte Partner
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* STICKY MOBILE CTA */}
        {/* ============================================ */}
        <AnimatePresence>
          {showStickyCTA && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
            >
              <div className="bg-card/95 backdrop-blur-lg border-t border-border p-4 shadow-2xl">
                <Link to="/umzugsofferten" className="block">
                  <Button className="w-full h-14 text-lg bg-primary hover:bg-primary/90">
                    Jetzt Offerte erhalten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  100% kostenlos & unverbindlich
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================ */}
        {/* CHAT BUBBLE */}
        {/* ============================================ */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-40 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Chat öffnen"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      </div>
    </>
  );
};

export default ZugV3Landing;
