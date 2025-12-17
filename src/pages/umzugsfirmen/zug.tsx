import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Star, Shield, MapPin, Check, ArrowRight, Users, Clock, 
  Award, Sparkles, Truck, Package, Home, Trash2, Building2,
  Lock, Play, Phone, Zap, TrendingDown, Eye, Timer
} from "lucide-react";

// Hero background from Unsplash - Zug lakeside
const HERO_BG = "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2000&q=80";

// Mock company data for Zug
const companies = [
  {
    id: "zuger-umzuege",
    name: "Zuger Umzüge AG",
    rating: 4.9,
    reviewCount: 187,
    badges: ["Top Bewertung", "Lokal"],
    services: ["Privatumzug", "Reinigung", "Möbellift"],
    priceLevel: "Mittel",
    availability: "Verfügbar",
    isPopular: true,
  },
  {
    id: "happy-move-baar",
    name: "Happy Move Baar",
    rating: 4.7,
    reviewCount: 134,
    badges: ["Preis-Sieger"],
    services: ["Privatumzug", "Entsorgung", "Einlagerung"],
    priceLevel: "Günstig",
    availability: "Sofort verfügbar",
    isBestPrice: true,
  },
  {
    id: "see-transporte",
    name: "See-Transporte Cham",
    rating: 4.8,
    reviewCount: 98,
    badges: ["Premium"],
    services: ["Firmenumzug", "Möbellift", "Reinigung"],
    priceLevel: "Premium",
    availability: "Ab 20. Dez",
    isPremium: true,
  },
  {
    id: "zentralschweiz-umzug",
    name: "Zentralschweiz Umzug",
    rating: 4.6,
    reviewCount: 156,
    badges: ["Regional"],
    services: ["Privatumzug", "Firmenumzug", "Lagerung"],
    priceLevel: "Mittel",
    availability: "Verfügbar",
  },
];

const priceExamples = [
  { size: "1.5 - 2.5 Zimmer", price: "CHF 900 – 1'500", icon: Home },
  { size: "3.5 - 4.5 Zimmer", price: "CHF 1'600 – 2'600", icon: Building2 },
  { size: "Einfamilienhaus", price: "ab CHF 2'800", icon: Home },
];

const localServices = [
  { title: "Endreinigung mit Abnahmegarantie", icon: Sparkles, description: "Garantierte Wohnungsabnahme" },
  { title: "Möbellagerung in Zug", icon: Package, description: "Sichere Lagermöglichkeiten" },
  { title: "Entsorgung (Ökihof Service)", icon: Trash2, description: "Fachgerechte Entsorgung" },
];

const usps = [
  { title: "Regionale Expertise", description: "Firmen kennen Zug, Baar & Cham", icon: MapPin },
  { title: "AI-Video Analyse", description: "Kostenvoranschlag per Video", icon: Play },
  { title: "Schweizer Support", description: "Persönliche Beratung auf Deutsch", icon: Phone },
];

const faqs = [
  {
    question: "Wie früh muss ich in Zug eine Umzugsfirma buchen?",
    answer: "Im Kanton Zug empfehlen wir 4-8 Wochen Vorlauf. Zur Hochsaison (April-September) oder bei Monatsende-Umzügen sind 8-12 Wochen ratsam, da viele internationale Firmen hier ansässig sind.",
  },
  {
    question: "Brauche ich eine Halteverbotszone in der Stadt Zug?",
    answer: "In der Altstadt und bei engen Quartieren ist eine Parkbewilligung oft nötig. Die meisten unserer Partnerfirmen übernehmen die Beantragung für Sie. Rechnen Sie mit ca. CHF 50-100 Gebühren.",
  },
  {
    question: "Was kostet eine Umzugsreinigung in Zug?",
    answer: "Eine professionelle Endreinigung mit Abnahmegarantie kostet in Zug ca. CHF 400-800 für eine 3.5-Zimmer-Wohnung. Viele Firmen bieten Kombiangebote mit dem Umzug an.",
  },
];

const nearbyMunicipalities = [
  { name: "Umzug Baar", href: "/baar/umzugsfirmen" },
  { name: "Umzug Cham", href: "/cham/umzugsfirmen" },
  { name: "Umzug Rotkreuz", href: "/rotkreuz/umzugsfirmen" },
  { name: "Umzug Steinhausen", href: "/steinhausen/umzugsfirmen" },
];

const ZugLandingPage = () => {
  const [liveViewers, setLiveViewers] = useState(12);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [apartmentSize, setApartmentSize] = useState("");

  // Simulate live viewers
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => Math.max(8, Math.min(20, prev + Math.floor(Math.random() * 5) - 2)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Show sticky bar after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store in localStorage and redirect
    localStorage.setItem("uc_prefill", JSON.stringify({
      from: fromLocation,
      to: toLocation,
      size: apartmentSize,
      source: "zug-landing",
      timestamp: Date.now(),
    }));
    window.location.href = "/umzugsofferten";
  };

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": "Umzugscheck.ch - Kanton Zug",
        "description": "Vergleiche 20+ geprüfte Umzugsfirmen im Kanton Zug. Kostenlose Offerten für Zug, Baar, Cham & Rotkreuz.",
        "areaServed": { "@type": "Place", "name": "Kanton Zug, Schweiz" },
        "priceRange": "CHF 900 - CHF 4500",
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://umzugscheck.ch" },
          { "@type": "ListItem", "position": 2, "name": "Umzugsfirmen", "item": "https://umzugscheck.ch/umzugsfirmen" },
          { "@type": "ListItem", "position": 3, "name": "Kanton Zug", "item": "https://umzugscheck.ch/umzugsfirmen/zug" },
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>Umzugsfirma Zug vergleichen – 20+ geprüfte Firmen | Bis 40% sparen</title>
        <meta name="description" content="Vergleiche 20+ geprüfte Umzugsfirmen im Kanton Zug. Kostenlose Offerten für Zug, Baar, Cham & Rotkreuz. Reinigung mit Abnahmegarantie. Bis zu 40% sparen!" />
        <meta name="keywords" content="Umzugsfirma Zug, Umzug Zug, Umzugsfirmen Baar, Umzug Cham, Umzugsreinigung Zug, Möbellift Zug" />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsfirmen/zug" />
        <meta property="og:title" content="Umzugsfirma Zug vergleichen – Kostenlose Offerten" />
        <meta property="og:description" content="Vergleiche 20+ geprüfte Umzugsfirmen im Kanton Zug. Bis zu 40% sparen!" />
        <meta property="og:url" content="https://umzugscheck.ch/umzugsfirmen/zug" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${HERO_BG})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/75 to-slate-800/70" />
          </div>

          <div className="container relative z-10 px-4 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center lg:text-left"
              >
                {/* Live Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {liveViewers} Personen in Zug vergleichen gerade
                </motion.div>

                {/* H1 */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  Umzugsfirma Zug <br className="hidden md:block" />
                  <span className="text-secondary">vergleichen</span>
                </h1>

                {/* Subline */}
                <p className="text-lg md:text-xl text-white/80 mb-6 max-w-xl mx-auto lg:mx-0">
                  Vergleichen Sie 20+ geprüfte Firmen aus Zug, Baar, Cham & Rotkreuz. 
                  <span className="text-green-400 font-semibold"> Bis zu 40% Kosten sparen.</span>
                </p>

                {/* Trust Stats */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                  <div className="flex items-center gap-2 text-white/90">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="font-semibold">4.8/5</span>
                    <span className="text-white/60">(2'847 Bewertungen)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span>100% Geprüft</span>
                  </div>
                </div>

                {/* Mobile CTA */}
                <div className="lg:hidden">
                  <Button 
                    asChild
                    size="lg" 
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6 shadow-[0_4px_20px_rgba(220,38,38,0.4)]"
                  >
                    <Link to="/umzugsofferten">
                      Kostenlos Offerten erhalten
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>

              {/* Right: Glassmorphism Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden lg:block"
              >
                <Card className="bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        Jetzt kostenlos vergleichen
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        In 2 Minuten zu 3-5 Offerten
                      </p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="from" className="text-sm font-medium">Von (PLZ oder Ort)</Label>
                        <Input
                          id="from"
                          placeholder="z.B. 6300 Zug"
                          value={fromLocation}
                          onChange={(e) => setFromLocation(e.target.value)}
                          className="mt-1.5 h-12"
                          autoFocus
                        />
                      </div>

                      <div>
                        <Label htmlFor="to" className="text-sm font-medium">Nach (PLZ oder Ort)</Label>
                        <Input
                          id="to"
                          placeholder="z.B. 6340 Baar"
                          value={toLocation}
                          onChange={(e) => setToLocation(e.target.value)}
                          className="mt-1.5 h-12"
                        />
                      </div>

                      <div>
                        <Label htmlFor="size" className="text-sm font-medium">Wohnungsgrösse</Label>
                        <Select value={apartmentSize} onValueChange={setApartmentSize}>
                          <SelectTrigger className="mt-1.5 h-12">
                            <SelectValue placeholder="Bitte wählen..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 Zimmer</SelectItem>
                            <SelectItem value="2.5-3">2.5-3 Zimmer</SelectItem>
                            <SelectItem value="3.5-4">3.5-4 Zimmer</SelectItem>
                            <SelectItem value="4.5-5">4.5-5 Zimmer</SelectItem>
                            <SelectItem value="5+">5+ Zimmer / Haus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        type="submit"
                        size="lg" 
                        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6 shadow-[0_4px_20px_rgba(220,38,38,0.4)]"
                      >
                        Kostenlos Offerten erhalten
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </form>

                    {/* Trust Ticks */}
                    <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-border">
                      {["Kostenlos", "Unverbindlich", "Geprüfte Firmen"].map((item) => (
                        <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-green-500" />
                          {item}
                        </div>
                      ))}
                    </div>

                    {/* Privacy Note */}
                    <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground">
                      <Lock className="w-3 h-3" />
                      Daten bleiben in der Schweiz
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF BAR */}
        <section className="py-8 bg-muted/30 border-y border-border">
          <div className="container px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {/* Rating Summary */}
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold">4.8/5</span>
                  <span className="text-muted-foreground"> Sterne</span>
                </div>
              </div>

              {/* Media Mentions (Grayscale) */}
              {["Blick", "20min", "NZZ"].map((media) => (
                <span key={media} className="text-lg font-semibold text-muted-foreground/50 tracking-tight">
                  {media}
                </span>
              ))}

              {/* Stats */}
              <div className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">15'000+</span> vermittelte Umzüge
              </div>
            </div>
          </div>
        </section>

        {/* TOP PROVIDERS IN ZUG */}
        <section className="py-16 md:py-20">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Top Umzugsfirmen im Kanton Zug
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Geprüfte Anbieter mit Erfahrung in Zug, Baar, Cham und Umgebung
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group border-border/50 hover:border-secondary/30">
                    <CardContent className="p-5">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {company.badges.map((badge) => (
                          <Badge 
                            key={badge} 
                            variant="secondary"
                            className={`text-xs ${
                              badge === "Top Bewertung" ? "bg-amber-100 text-amber-800" :
                              badge === "Preis-Sieger" ? "bg-green-100 text-green-800" :
                              badge === "Premium" ? "bg-purple-100 text-purple-800" :
                              "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>

                      {/* Company Name */}
                      <h3 className="font-bold text-lg mb-2 group-hover:text-secondary transition-colors">
                        {company.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(company.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{company.rating}</span>
                        <span className="text-xs text-muted-foreground">({company.reviewCount})</span>
                      </div>

                      {/* Services */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {company.services.slice(0, 3).map((service) => (
                          <span key={service} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            {service}
                          </span>
                        ))}
                      </div>

                      {/* Availability */}
                      <div className="flex items-center gap-1.5 text-sm text-green-600 mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        {company.availability}
                      </div>

                      {/* CTA */}
                      <Button variant="outline" className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:border-secondary transition-all">
                        Offerte ansehen
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/umzugsofferten">
                  Alle {companies.length}+ Firmen vergleichen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* PRICE GUIDE */}
        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Was kostet ein Umzug in Zug?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Durchschnittliche Preise für Umzüge im Kanton Zug (inkl. Transport & Tragen)
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {priceExamples.map((item, index) => (
                <motion.div
                  key={item.size}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center h-full hover:shadow-lg transition-shadow border-border/50">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-7 h-7 text-secondary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{item.size}</h3>
                      <p className="text-2xl font-bold text-secondary">{item.price}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6 max-w-2xl mx-auto">
              * Richtwerte für Umzüge innerhalb des Kantons Zug. Finale Preise hängen von Etage, Zugang, Distanz und Zusatzleistungen ab.
            </p>
          </div>
        </section>

        {/* LOCAL SERVICES */}
        <section className="py-16 md:py-20">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Beliebte Zusatzservices in Zug
              </h2>
              <p className="text-lg text-muted-foreground">
                Alles aus einer Hand – von Reinigung bis Entsorgung
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {localServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                        <service.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US / USP */}
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Warum Umzugscheck.ch?
              </h2>
              <p className="text-lg text-muted-foreground">
                Die smarteste Art, Umzugsfirmen in Zug zu vergleichen
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {usps.map((usp, index) => (
                <motion.div
                  key={usp.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <usp.icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{usp.title}</h3>
                  <p className="text-muted-foreground">{usp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-16 md:py-20">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Häufige Fragen zu Umzügen in Zug
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AccordionItem value={`item-${index}`} className="border border-border rounded-xl px-6 bg-card">
                      <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* SEO FOOTER LINKS */}
        <section className="py-12 bg-muted/30 border-t border-border">
          <div className="container px-4">
            <h3 className="font-semibold text-lg mb-4 text-center">
              Umzugsfirmen in der Nähe von Zug
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {nearbyMunicipalities.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Bereit für Ihren Umzug in Zug?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Vergleichen Sie jetzt kostenlos 20+ geprüfte Umzugsfirmen und sparen Sie bis zu 40%.
              </p>
              <Button 
                asChild
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6 shadow-xl"
              >
                <Link to="/umzugsofferten">
                  Kostenlos Offerten erhalten
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <SimplifiedFooter />

      {/* Sticky Mobile CTA */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t border-border p-4 shadow-2xl"
          >
            <Button 
              asChild
              size="lg" 
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-5"
            >
              <Link to="/umzugsofferten">
                Gratis Offerten erhalten
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZugLandingPage;
