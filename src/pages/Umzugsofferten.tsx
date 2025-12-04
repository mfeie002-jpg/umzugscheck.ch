import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, Shield, Clock, TrendingDown, ArrowRight, Star, MapPin,
  Users, Zap, Award, ChevronRight, Sparkles, ChevronLeft,
  BadgeCheck, Building2, Home, Truck, Timer, 
  ThumbsUp, Quote, MessageCircle
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ENHANCED_COMPANIES } from "@/data/enhanced-companies";
import { Footer } from "@/components/Footer";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { generatePageSchemas } from "@/lib/schema-markup";
import { motion, AnimatePresence } from "framer-motion";
import { swissPostalCodes } from "@/lib/swiss-postal-codes";
import heroImage from "@/assets/happy-couple-moving.jpg";

// Filter postal codes
const filterPostalCodes = (query: string): string[] => {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return swissPostalCodes
    .filter(p => 
      p.code.startsWith(q) || 
      p.city.toLowerCase().includes(q) ||
      `${p.code} - ${p.city}`.toLowerCase().includes(q)
    )
    .slice(0, 100)
    .map(p => `${p.code} - ${p.city} (${p.canton})`);
};

// Testimonials data
const testimonials = [
  {
    name: "Sarah M.",
    location: "Zürich → Basel",
    rating: 5,
    text: "Innerhalb von 24h hatte ich 4 Offerten. Die Ersparnis von CHF 650 war enorm!",
    saved: "CHF 650",
    avatar: "SM"
  },
  {
    name: "Marco B.",
    location: "Bern → Luzern", 
    rating: 5,
    text: "Super einfach! 3 Minuten Formular, 5 Offerten erhalten, beste Firma gewählt.",
    saved: "CHF 420",
    avatar: "MB"
  },
  {
    name: "Lisa K.",
    location: "Winterthur → Zürich",
    rating: 5,
    text: "Die Vergleichsmöglichkeit war Gold wert. Konnte Preise direkt vergleichen.",
    saved: "CHF 380",
    avatar: "LK"
  }
];

// FAQ data
const faqs = [
  {
    question: "Ist der Vergleich wirklich kostenlos?",
    answer: "Ja, 100% kostenlos und unverbindlich. Umzugscheck.ch wird von den Umzugsfirmen finanziert, nicht von Ihnen."
  },
  {
    question: "Wie schnell erhalte ich Offerten?",
    answer: "Die meisten Nutzer erhalten innerhalb von 24 Stunden 3-5 konkrete Offerten per E-Mail."
  },
  {
    question: "Wie viel kann ich wirklich sparen?",
    answer: "Unsere Daten zeigen durchschnittliche Einsparungen von 25-40%. Bei grösseren Umzügen oft CHF 500-1'000+."
  },
  {
    question: "Sind alle Firmen geprüft?",
    answer: "Ja. Jede Partnerfirma durchläuft unsere Qualitätsprüfung: Versicherungsnachweis, Handelsregister-Eintrag und Bewertungen."
  },
  {
    question: "Muss ich eine Offerte annehmen?",
    answer: "Nein, absolut keine Verpflichtung. Sie vergleichen in Ruhe und entscheiden selbst."
  }
];

// Regions
const regions = [
  { name: "Zürich", slug: "zuerich", count: 42 },
  { name: "Bern", slug: "bern", count: 28 },
  { name: "Basel", slug: "basel", count: 24 },
  { name: "Luzern", slug: "luzern", count: 18 },
  { name: "Aargau", slug: "aargau", count: 22 },
  { name: "St. Gallen", slug: "st-gallen", count: 16 },
  { name: "Zug", slug: "zug", count: 12 },
  { name: "Schwyz", slug: "schwyz", count: 8 },
  { name: "Thurgau", slug: "thurgau", count: 10 },
  { name: "Solothurn", slug: "solothurn", count: 11 },
  { name: "Graubünden", slug: "graubuenden", count: 9 },
  { name: "Wallis", slug: "wallis", count: 14 }
];

// Top companies
const topCompanies = ENHANCED_COMPANIES
  .filter(c => c.is_featured && c.rating && c.rating >= 4.5)
  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
  .slice(0, 3);

export default function Umzugsofferten() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Form state
  const [fromLocation, setFromLocation] = useState(searchParams.get("from") || "");
  const [toLocation, setToLocation] = useState(searchParams.get("to") || "");
  const [rooms, setRooms] = useState(searchParams.get("rooms") || "3.5");
  
  // Testimonial slider
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Postal code suggestions
  const fromSuggestions = fromLocation.length >= 1 ? filterPostalCodes(fromLocation) : [];
  const toSuggestions = toLocation.length >= 1 ? filterPostalCodes(toLocation) : [];

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromLocation && toLocation) {
      navigate(`/rechner?from=${encodeURIComponent(fromLocation)}&to=${encodeURIComponent(toLocation)}&rooms=${rooms}`);
    }
  };

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const currentUrl = 'https://www.umzugscheck.ch/umzugsofferten';
  const schemas = generatePageSchemas({ type: 'offerten', url: currentUrl }, faqs);

  return (
    <>
      <Helmet>
        <title>Umzugsofferten vergleichen & bis zu 40% sparen | umzugscheck.ch</title>
        <meta name="description" content="Gratis Offerten von geprüften Schweizer Umzugsfirmen – schnell, transparent und unverbindlich. Vergleichen und sparen Sie bis zu 40%." />
        <link rel="canonical" href={currentUrl} />
        <script type="application/ld+json">{JSON.stringify(schemas)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-muted/30 via-background to-primary/5">
          <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
              
              {/* Left: Image + Content */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Emotional Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[16/10]">
                  <img 
                    src={heroImage} 
                    alt="Glückliches Paar beim Umzug" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-white/95 text-foreground shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
                      Nr. 1 Umzugsvergleich der Schweiz
                    </Badge>
                  </div>
                </div>

                {/* Headline */}
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    Umzugsofferten vergleichen und{" "}
                    <span className="text-primary">bis zu 40% sparen</span>
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Gratis Offerten von geprüften Schweizer Umzugsfirmen – schnell, transparent und unverbindlich.
                  </p>
                </div>
              </motion.div>

              {/* Right: Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="shadow-2xl border-0 overflow-hidden">
                  <div className="bg-primary px-6 py-4 text-primary-foreground">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-bold text-lg">Jetzt Offerten erhalten</h2>
                        <p className="text-primary-foreground/80 text-sm">Kostenlos & unverbindlich</p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* From */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Start-PLZ/Ort</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="z.B. 8001 Zürich"
                            value={fromLocation}
                            onChange={(e) => setFromLocation(e.target.value)}
                            className="pl-10 h-12"
                            list="from-suggestions"
                            required
                          />
                          <datalist id="from-suggestions">
                            {fromSuggestions.slice(0, 8).map((s, i) => (
                              <option key={i} value={s} />
                            ))}
                          </datalist>
                        </div>
                      </div>

                      {/* To */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Ziel-PLZ/Ort</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          <Input
                            type="text"
                            placeholder="z.B. 3011 Bern"
                            value={toLocation}
                            onChange={(e) => setToLocation(e.target.value)}
                            className="pl-10 h-12"
                            list="to-suggestions"
                            required
                          />
                          <datalist id="to-suggestions">
                            {toSuggestions.slice(0, 8).map((s, i) => (
                              <option key={i} value={s} />
                            ))}
                          </datalist>
                        </div>
                      </div>

                      {/* Rooms */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Zimmerzahl</label>
                        <div className="grid grid-cols-5 gap-2">
                          {["1.5", "2.5", "3.5", "4.5", "5.5+"].map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setRooms(size)}
                              className={`py-3 rounded-lg text-sm font-medium transition-all border ${
                                rooms === size 
                                  ? "bg-primary text-primary-foreground border-primary" 
                                  : "bg-muted/50 text-foreground border-border hover:border-primary/50"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Submit */}
                      <Button type="submit" size="lg" className="w-full h-14 text-lg mt-2">
                        Jetzt Offerten erhalten
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>

                      {/* Trust hints */}
                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          100% kostenlos
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5 text-blue-500" />
                          Unverbindlich
                        </span>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== TRUST BAR ===== */}
        <section className="border-y border-border bg-muted/30 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-primary" />
                <span className="font-medium">Geprüfte Firmen</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-medium">100% kostenlos</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-primary" />
                <span className="font-medium">Bis zu 40% sparen</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="font-medium">Offerten in 24h</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS SLIDER ===== */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Das sagen unsere Kunden</h2>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-muted-foreground">4.8/5 Bewertung</span>
                </div>
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                            {testimonials[currentTestimonial].avatar}
                          </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <Quote className="w-8 h-8 text-primary/20 mb-2 mx-auto md:mx-0" />
                          <p className="text-lg text-foreground mb-4">
                            "{testimonials[currentTestimonial].text}"
                          </p>
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <div>
                              <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
                              <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].location}</p>
                            </div>
                            <Badge variant="secondary" className="w-fit mx-auto md:mx-0">
                              Gespart: {testimonials[currentTestimonial].saved}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button variant="outline" size="icon" onClick={prevTestimonial}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentTestimonial(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentTestimonial ? "bg-primary w-6" : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <Button variant="outline" size="icon" onClick={nextTestimonial}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== BENEFITS SECTION ===== */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Warum Offerten vergleichen?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Sparen Sie Zeit und Geld mit unserem kostenlosen Vergleichsservice
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: TrendingDown, title: "Preisvorteil", desc: "Sparen Sie durchschnittlich 25-40% durch Vergleichen mehrerer Angebote" },
                { icon: Timer, title: "Schnelle Terminfindung", desc: "Erhalten Sie innerhalb von 24h konkrete Offerten mit Terminen" },
                { icon: BadgeCheck, title: "Seriöse Anbieter", desc: "Alle Firmen sind geprüft, versichert und haben positive Bewertungen" },
                { icon: ThumbsUp, title: "Bessere Qualität", desc: "Vergleichen Sie nicht nur Preise, sondern auch Leistungen und Bewertungen" }
              ].map((item, i) => (
                <Card key={i} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROCESS SECTION ===== */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">So einfach geht's</h2>
              <p className="text-muted-foreground">In 3 Schritten zu Ihren Umzugsofferten</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { step: 1, title: "Formular ausfüllen", desc: "Geben Sie Start, Ziel und Wohnungsgrösse ein – dauert nur 2 Minuten", icon: Home },
                { step: 2, title: "Offerten erhalten", desc: "Erhalten Sie innerhalb von 24h bis zu 5 unverbindliche Offerten per E-Mail", icon: Truck },
                { step: 3, title: "Beste Firma wählen", desc: "Vergleichen Sie Preise, Bewertungen und wählen Sie Ihren Favoriten", icon: Award }
              ].map((item, i) => (
                <div key={i} className="relative">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-primary/10" />
                  )}
                  <div className="text-center">
                    <div className="relative inline-flex">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <item.icon className="w-10 h-10 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TOP PARTNERS SECTION ===== */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Top-bewertete Umzugsfirmen</h2>
              <p className="text-muted-foreground">Unsere bestbewerteten Partner</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {topCompanies.map((company, i) => (
                <Card key={i} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{company.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{company.rating}</span>
                          <span className="text-muted-foreground text-sm">({company.review_count} Bewertungen)</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      Professionelle Umzugsfirma mit langjähriger Erfahrung in der Schweiz.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to={`/umzugsfirmen/${company.slug}`}>
                          Firma ansehen
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <Link to={`/rechner?company=${company.id}`}>
                          Offerte anfordern
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link to="/umzugsfirmen">
                  Alle Firmen anzeigen
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ===== REGIONAL SECTION ===== */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Umzugsfirmen in Ihrer Region</h2>
              <p className="text-muted-foreground">Finden Sie lokale Umzugsexperten</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
              {regions.map((region, i) => (
                <Link
                  key={i}
                  to={`/${region.slug}`}
                  className="group p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-medium text-sm">{region.name}</p>
                  <p className="text-xs text-muted-foreground">{region.count} Firmen</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Häufige Fragen</h2>
                <p className="text-muted-foreground">Alles was Sie wissen müssen</p>
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-xl px-6">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA SECTION ===== */}
        <section className="py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Jetzt kostenlose Umzugsofferten vergleichen
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Sparen Sie Zeit und Geld mit unserem kostenlosen Vergleichsservice. 
                Unverbindlich und ohne versteckte Kosten.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="h-14 px-8 text-lg"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Offerten erhalten
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-14 px-8 text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link to="/rechner">
                    Zum Preisrechner
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-primary-foreground/60 mt-6">
                Bereits über 15'000 erfolgreiche Umzüge verglichen
              </p>
            </div>
          </div>
        </section>

        {/* Live Chat Button */}
        <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
          <Button 
            size="lg" 
            className="rounded-full w-14 h-14 shadow-xl"
            asChild
          >
            <Link to="/kontakt">
              <MessageCircle className="w-6 h-6" />
            </Link>
          </Button>
        </div>

        <Footer />
        <StickyMobileCTA />
      </div>
    </>
  );
}
