import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
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
  Lock, Play, Phone, Zap, TrendingDown, Eye, Timer,
  FileText, CheckCircle, CalendarCheck, Sofa, Warehouse,
  ClipboardList, ChevronDown, MessageSquare, HeartHandshake
} from "lucide-react";

// Hero background from Unsplash - Zug lakeside
const HERO_BG = "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2000&q=80";

// Canton options for switcher
const cantons = [
  { value: "zug", label: "Zug", href: "/umzugsfirmen/zug" },
  { value: "zuerich", label: "Zürich", href: "/zuerich/umzugsfirmen" },
  { value: "bern", label: "Bern", href: "/bern/umzugsfirmen" },
  { value: "basel", label: "Basel", href: "/basel/umzugsfirmen" },
  { value: "luzern", label: "Luzern", href: "/luzern/umzugsfirmen" },
];

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
  { size: "1.5 - 2.5 Zimmer", price: "CHF 550 – 900", subtext: "Studio / kleine Wohnung", icon: Home },
  { size: "3.5 - 4.5 Zimmer", price: "CHF 770 – 1'200", subtext: "Familienwohnung", icon: Building2 },
  { size: "5+ Zimmer / Haus", price: "ab CHF 1'500", subtext: "Villa / Einfamilienhaus", icon: Home },
];

const services = [
  { title: "Endreinigung", icon: Sparkles, description: "Wohnungsabnahme garantiert", link: "/services/reinigung" },
  { title: "Ein-/Auspackservice", icon: Package, description: "Professionelles Verpacken", link: "/services/packservice" },
  { title: "Möbelmontage", icon: Sofa, description: "Auf- & Abbau vor Ort", link: "/services/moebelmontage" },
  { title: "Möbellift", icon: Truck, description: "Für schwere Möbel & enge Treppenhäuser", link: "/services/moebellift" },
  { title: "Einlagerung", icon: Warehouse, description: "Sichere Lagerräume in Zug", link: "/services/lagerung" },
  { title: "Entsorgung", icon: Trash2, description: "Fachgerechte Entsorgung (Ökihof)", link: "/services/entsorgung" },
];

const howItWorks = [
  { 
    step: 1, 
    title: "Formular ausfüllen", 
    description: "Geben Sie Ihre Umzugsdaten ein: Start, Ziel, Wohnungsgrösse und Wunschtermin.",
    icon: ClipboardList
  },
  { 
    step: 2, 
    title: "Angebote vergleichen", 
    description: "Erhalten Sie kostenlos 3-5 Offerten von geprüften Firmen und vergleichen Sie transparent.",
    icon: FileText
  },
  { 
    step: 3, 
    title: "Umziehen & sparen", 
    description: "Wählen Sie das beste Angebot und ziehen Sie sorglos um – bis zu 40% günstiger.",
    icon: CheckCircle
  },
];

const usps = [
  { title: "Regionale Expertise", description: "Lokale Firmen kennen Zug, Baar & Cham bestens", icon: MapPin },
  { title: "AI-Video Analyse", description: "Kostenvoranschlag per Video in Minuten", icon: Play },
  { title: "Schweizer Support", description: "Persönliche Beratung auf Deutsch", icon: Phone },
  { title: "100% Gratis", description: "Keine versteckten Kosten, unverbindlich", icon: HeartHandshake },
];

const faqs = [
  {
    question: "Wie erhalte ich kostenlose Offerten?",
    answer: "Füllen Sie unser Online-Formular aus (dauert nur 2 Minuten). Innerhalb von 24-48 Stunden erhalten Sie 3-5 unverbindliche Angebote von geprüften Umzugsfirmen in Zug direkt per E-Mail.",
  },
  {
    question: "Was kostet ein Umzug im Kanton Zug?",
    answer: "Die Kosten variieren je nach Wohnungsgrösse, Etage und Distanz. Ein 2-Zimmer-Umzug innerhalb Zug kostet ca. CHF 550-900, ein 4-Zimmer-Umzug ca. CHF 770-1'200. Mit unserem Vergleich sparen Sie bis zu 40%.",
  },
  {
    question: "Sind die Angebote wirklich gratis und unverbindlich?",
    answer: "Ja, absolut! Das Einholen der Offerten ist 100% kostenlos und unverbindlich. Sie entscheiden selbst, ob und welches Angebot Sie annehmen möchten. Es entstehen keine versteckten Kosten.",
  },
  {
    question: "Wie früh sollte ich in Zug buchen?",
    answer: "Wir empfehlen 4-8 Wochen Vorlauf. Zur Hochsaison (April-September) oder bei Monatsende-Umzügen sind 8-12 Wochen ratsam, da viele Firmen dann ausgebucht sind.",
  },
  {
    question: "Brauche ich eine Halteverbotszone in der Stadt Zug?",
    answer: "In der Altstadt und bei engen Quartieren ist eine Parkbewilligung oft nötig. Die meisten unserer Partnerfirmen übernehmen die Beantragung für Sie. Rechnen Sie mit ca. CHF 50-100 Gebühren.",
  },
];

const nearbyMunicipalities = [
  { name: "Umzug Baar", href: "/baar/umzugsfirmen" },
  { name: "Umzug Cham", href: "/cham/umzugsfirmen" },
  { name: "Umzug Rotkreuz", href: "/rotkreuz/umzugsfirmen" },
  { name: "Umzug Steinhausen", href: "/steinhausen/umzugsfirmen" },
  { name: "Umzug Hünenberg", href: "/huenenberg/umzugsfirmen" },
];

const ZugLandingPage = () => {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(23);
  const [recentRequests, setRecentRequests] = useState(47);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [apartmentSize, setApartmentSize] = useState("");
  const [selectedCanton, setSelectedCanton] = useState("zug");

  // Simulate live viewers & recent requests
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => Math.max(15, Math.min(35, prev + Math.floor(Math.random() * 5) - 2)));
      setRecentRequests(prev => prev + Math.floor(Math.random() * 3));
    }, 4000);
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
    localStorage.setItem("uc_prefill", JSON.stringify({
      from: fromLocation,
      to: toLocation,
      size: apartmentSize,
      source: "zug-landing",
      timestamp: Date.now(),
    }));
    navigate("/umzugsofferten");
  };

  const handleCantonChange = (value: string) => {
    setSelectedCanton(value);
    const canton = cantons.find(c => c.value === value);
    if (canton && value !== "zug") {
      navigate(canton.href);
    }
  };

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": "Umzugscheck.ch - Kanton Zug",
        "description": "Vergleiche 30+ geprüfte Umzugsfirmen im Kanton Zug. Kostenlose Offerten für Zug, Baar, Cham & Rotkreuz.",
        "areaServed": { "@type": "Place", "name": "Kanton Zug, Schweiz" },
        "priceRange": "CHF 550 - CHF 3000",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "2847"
        }
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
        <title>Umzug Zug – Jetzt gratis Umzugsfirma finden | Bis 40% sparen</title>
        <meta name="description" content="Vergleiche 30+ geprüfte Umzugsfirmen im Kanton Zug ✓ Kostenlose Offerten ✓ Zug, Baar, Cham & Rotkreuz ✓ Endreinigung mit Abnahmegarantie ✓ Bis zu 40% sparen!" />
        <meta name="keywords" content="Umzugsfirma Zug, Umzug Zug, Umzugsfirmen Baar, Umzug Cham, Umzugsreinigung Zug, Möbellift Zug, Umzugskosten Zug" />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsfirmen/zug" />
        <meta property="og:title" content="Umzug Zug – Jetzt gratis Umzugsfirma finden und sparen" />
        <meta property="og:description" content="Vergleiche 30+ geprüfte Umzugsfirmen im Kanton Zug. Bis zu 40% sparen!" />
        <meta property="og:url" content="https://umzugscheck.ch/umzugsfirmen/zug" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${HERO_BG})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-primary/40" />
          </div>

          <div className="container relative z-10 px-4 py-16 md:py-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center lg:text-left"
              >
                {/* Canton Switcher */}
                <div className="inline-flex items-center gap-2 mb-4">
                  <Select value={selectedCanton} onValueChange={handleCantonChange}>
                    <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cantons.map((canton) => (
                        <SelectItem key={canton.value} value={canton.value}>
                          {canton.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Live Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  {liveViewers} Personen in Zug vergleichen gerade
                </motion.div>

                {/* H1 */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  Umzug Zug – <br className="hidden md:block" />
                  <span className="text-secondary">Jetzt gratis Firmen finden</span>
                </h1>

                {/* Subline */}
                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  Vergleichen Sie <strong>30+ geprüfte Umzugsfirmen</strong> aus Zug, Baar, Cham & Rotkreuz. 
                  <span className="text-green-400 font-semibold"> Kostenlose Offerten – bis zu 40% sparen.</span>
                </p>

                {/* Trust Stats Row */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-5 mb-8">
                  <div className="flex items-center gap-2 text-white/90">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold">4.8/5</span>
                    <span className="text-white/60 text-sm">(2'847)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span>100% Geprüft</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span>30+ Firmen</span>
                  </div>
                </div>

                {/* Mobile CTA */}
                <div className="lg:hidden space-y-3">
                  <Button 
                    asChild
                    size="lg" 
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6 shadow-[0_4px_20px_rgba(220,38,38,0.4)]"
                  >
                    <Link to="/umzugsofferten">
                      Jetzt Offerten anfordern
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <div className="flex items-center justify-center gap-1.5 text-white/60 text-sm">
                    <Check className="w-4 h-4 text-green-400" />
                    100% kostenlos & unverbindlich
                  </div>
                </div>
              </motion.div>

              {/* Right: Glassmorphism Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden lg:block"
              >
                <Card className="bg-white/[0.97] backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    {/* Activity Indicator */}
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      {recentRequests} Anfragen heute in Zug
                    </div>

                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        Jetzt gratis vergleichen
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        In 2 Minuten zu 3-5 unverbindlichen Offerten
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
                        Jetzt Offerten anfordern
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
                      Daten bleiben in der Schweiz · SSL verschlüsselt
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TRUST / SOCIAL PROOF BAR */}
        <section className="py-6 bg-muted/40 border-y border-border">
          <div className="container px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {/* Rating Summary */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-bold">4.8/5</span>
                <span className="text-xs text-muted-foreground">(2'847 Bewertungen)</span>
              </div>

              <div className="hidden md:block h-6 w-px bg-border" />

              {/* Stats */}
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-bold">30+</span>
                <span className="text-muted-foreground">Firmen in Zug</span>
              </div>

              <div className="hidden md:block h-6 w-px bg-border" />

              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-primary" />
                <span className="font-bold">15'000+</span>
                <span className="text-muted-foreground">vermittelte Umzüge</span>
              </div>

              <div className="hidden md:block h-6 w-px bg-border" />

              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">Geprüft & Versichert</span>
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
              <Badge variant="secondary" className="mb-4">Unsere Top-Partner</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Top Umzugsfirmen im Kanton Zug
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Geprüfte & versicherte Anbieter mit Erfahrung in Zug, Baar, Cham und Umgebung
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

            <div className="text-center mt-10">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/umzugsofferten">
                  Alle 30+ Firmen vergleichen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="outline" className="mb-4">Preisübersicht</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Was kostet ein Umzug in Zug?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Typische Preise für Umzüge im Kanton Zug (inkl. Transport, Träger & Material)
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
                  <Card className="text-center h-full hover:shadow-lg transition-shadow border-border/50 hover:border-primary/30">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-7 h-7 text-secondary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{item.size}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{item.subtext}</p>
                      <p className="text-2xl font-bold text-secondary">{item.price}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground mb-6 max-w-2xl mx-auto">
                * Richtwerte für Umzüge innerhalb des Kantons Zug. Finale Preise variieren je nach Etage, Zugang, Distanz und Zusatzleistungen.
              </p>
              <Button asChild variant="outline" size="lg">
                <Link to="/umzugsofferten">
                  <TrendingDown className="mr-2 w-5 h-5" />
                  Jetzt gratis Preise berechnen
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* POPULAR SERVICES */}
        <section className="py-16 md:py-20">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="secondary" className="mb-4">Zusatzservices</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Beliebte Services in Zug
              </h2>
              <p className="text-lg text-muted-foreground">
                Alles aus einer Hand – von Reinigung bis Möbellift
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={service.link}>
                    <Card className="h-full hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer group">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <service.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">{service.title}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="outline" className="mb-4">So funktioniert's</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                In 3 Schritten zu Ihrer Umzugsofferte
              </h2>
              <p className="text-lg text-muted-foreground">
                Einfach, schnell und 100% kostenlos
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="text-center relative"
                >
                  {/* Connector Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                  )}
                  
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                    <step.icon className="w-10 h-10 text-primary" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/umzugsofferten">
                  Jetzt starten – 100% kostenlos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* WHY US / USP */}
        <section className="py-16 md:py-20">
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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {usps.map((usp, index) => (
                <motion.div
                  key={usp.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-shadow border-border/50">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <usp.icon className="w-7 h-7 text-secondary" />
                      </div>
                      <h3 className="font-bold text-base mb-2">{usp.title}</h3>
                      <p className="text-sm text-muted-foreground">{usp.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="outline" className="mb-4">FAQ</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Häufige Fragen zu Umzügen in Zug
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
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
        <section className="py-10 bg-muted/30 border-t border-border">
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
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-6">
                Bereit für Ihren Umzug?
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Kostenlose Umzugsofferten <br className="hidden md:block" />jetzt anfordern!
              </h2>
              <p className="text-lg text-primary-foreground/85 mb-8 max-w-xl mx-auto">
                Vergleichen Sie 30+ geprüfte Umzugsfirmen in Zug und sparen Sie bis zu 40% – 100% gratis & unverbindlich.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6 shadow-xl"
                >
                  <Link to="/umzugsofferten">
                    Jetzt Offerten anfordern
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Keine versteckten Kosten
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  100% unverbindlich
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  30 Tage Umzugs-Garantie
                </div>
              </div>
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
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/95 backdrop-blur-lg border-t border-border p-3 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">30+ geprüfte Firmen</p>
                <p className="text-sm font-bold">Bis 40% sparen</p>
              </div>
              <Button 
                asChild
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shrink-0"
              >
                <Link to="/umzugsofferten">
                  Gratis Offerten
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZugLandingPage;
