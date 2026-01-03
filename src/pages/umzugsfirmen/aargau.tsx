import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { motion, useInView } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Star, Shield, MapPin, Check, ArrowRight, Users, Clock, 
  Award, Sparkles, Truck, Package, Home, Trash2, Building2,
  Lock, Phone, TrendingDown, FileText, CheckCircle, Sofa, Warehouse,
  ClipboardList, ChevronRight, MessageCircle, Crown, Banknote, ShieldCheck, 
  CircleDollarSign, BadgeCheck, ThumbsUp, Video, Info, Gift
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80";
const CANTON_NAME = "Aargau";
const CANTON_SLUG = "aargau";

const cantons = [
  { value: "aargau", label: "Aargau", href: "/umzugsfirmen/aargau" },
  { value: "zuerich", label: "Zürich", href: "/umzugsfirmen/zuerich" },
  { value: "bern", label: "Bern", href: "/umzugsfirmen/bern" },
  { value: "basel", label: "Basel", href: "/umzugsfirmen/basel" },
  { value: "luzern", label: "Luzern", href: "/umzugsfirmen/luzern" },
  { value: "zug", label: "Zug", href: "/umzugsfirmen/zug" },
];

const companies = [
  { id: "aargauer-umzuege", name: "Aargauer Umzüge AG", rating: 4.9, reviewCount: 234, badges: ["Top Bewertung", "Lokal"], services: ["Privatumzug", "Reinigung", "Möbellift"], priceLevel: "Mittel", isPopular: true, responseTime: "< 2h" },
  { id: "aarau-transporte", name: "Aarau Transporte", rating: 4.7, reviewCount: 156, badges: ["Preis-Sieger"], services: ["Privatumzug", "Entsorgung", "Einlagerung"], priceLevel: "Günstig", isBestPrice: true, responseTime: "< 1h" },
  { id: "baden-moving", name: "Baden Moving GmbH", rating: 4.8, reviewCount: 189, badges: ["Premium"], services: ["Firmenumzug", "Möbellift", "Reinigung"], priceLevel: "Premium", isPremium: true, responseTime: "< 4h" },
];

const priceExamples = [
  { size: "1.5 - 2.5 Zimmer", price: "CHF 480 – 850", subtext: "Studio / kleine Wohnung", icon: Home, savings: "bis CHF 340" },
  { size: "3.5 - 4.5 Zimmer", price: "CHF 720 – 1'150", subtext: "Familienwohnung", icon: Building2, savings: "bis CHF 460" },
  { size: "5+ Zimmer / Haus", price: "ab CHF 1'400", subtext: "Villa / Einfamilienhaus", icon: Home, savings: "bis CHF 560" },
];

const services = [
  { title: "Endreinigung", icon: Sparkles, description: "Wohnungsabnahme garantiert", link: "/services/reinigung" },
  { title: "Ein-/Auspackservice", icon: Package, description: "Professionelles Verpacken", link: "/services/packservice" },
  { title: "Möbelmontage", icon: Sofa, description: "Auf- & Abbau vor Ort", link: "/services/moebelmontage" },
  { title: "Möbellift", icon: Truck, description: "Für schwere Möbel", link: "/services/moebellift" },
  { title: "Einlagerung", icon: Warehouse, description: "Sichere Lagerräume", link: "/services/lagerung" },
  { title: "Entsorgung", icon: Trash2, description: "Fachgerechte Entsorgung", link: "/services/entsorgung" },
];

const howItWorks = [
  { step: 1, title: "Formular ausfüllen", description: "Start, Ziel & Wohnungsgrösse eingeben", icon: ClipboardList, time: "30 Sek." },
  { step: 2, title: "Angebote vergleichen", description: "3-5 Offerten kostenlos erhalten", icon: FileText, time: "24-48h" },
  { step: 3, title: "Umziehen & sparen", description: "Bestes Angebot wählen", icon: CheckCircle, time: "Ihr Termin" },
];

const testimonials = [
  { name: "Peter M.", location: "Aarau → Baden", rating: 5, text: "Sehr professionell! Die Firma aus Baden war pünktlich und sorgfältig. CHF 380 gespart durch den Vergleich.", date: "vor 4 Tagen", verified: true, savedAmount: 380 },
  { name: "Sabine K.", location: "Wettingen → Brugg", rating: 5, text: "Unkomplizierter Service, schnelle Offerten und eine super Umzugsfirma gefunden.", date: "vor 1 Woche", verified: true, savedAmount: 290 },
  { name: "Marco H.", location: "Rheinfelden → Aarau", rating: 5, text: "Der Vergleich hat sich gelohnt. Top Service zum fairen Preis!", date: "vor 2 Wochen", verified: true, savedAmount: 420 },
];

const guarantees = [
  { title: "Kostenlos-Garantie", description: "100% gratis, keine versteckten Gebühren", icon: CircleDollarSign },
  { title: "Datenschutz-Garantie", description: "Schweizer Hosting, DSGVO-konform", icon: ShieldCheck },
  { title: "Qualitäts-Garantie", description: "Nur geprüfte & versicherte Firmen", icon: BadgeCheck },
  { title: "Zufriedenheits-Garantie", description: "Wir helfen bei Problemen", icon: ThumbsUp },
];

const faqs = [
  { question: "Wie erhalte ich kostenlose Offerten im Aargau?", answer: "Füllen Sie unser Online-Formular aus (dauert nur 2 Minuten). Innerhalb von 24-48 Stunden erhalten Sie 3-5 unverbindliche Angebote von geprüften Umzugsfirmen im Aargau direkt per E-Mail." },
  { question: "Was kostet ein Umzug im Kanton Aargau?", answer: "Die Kosten variieren je nach Wohnungsgrösse, Etage und Distanz. Ein 2-Zimmer-Umzug innerhalb Aargau kostet ca. CHF 480-850, ein 4-Zimmer-Umzug ca. CHF 720-1'150. Mit unserem Vergleich sparen Sie bis zu 40%." },
  { question: "Sind die Angebote wirklich gratis und unverbindlich?", answer: "Ja, absolut! Das Einholen der Offerten ist 100% kostenlos und unverbindlich. Sie entscheiden selbst, ob und welches Angebot Sie annehmen möchten." },
  { question: "Wie früh sollte ich im Aargau buchen?", answer: "Wir empfehlen 4-8 Wochen Vorlauf. Zur Hochsaison (April-September) oder bei Monatsende-Umzügen sind 8-12 Wochen ratsam." },
  { question: "Sind die Umzugsfirmen versichert?", answer: "Ja! Alle unsere Partnerfirmen sind vollständig versichert (Haftpflicht & Transportversicherung). Bei Schäden sind Sie abgesichert." },
];

const nearbyMunicipalities = [
  { name: "Umzug Aarau", href: "/aarau/umzugsfirmen" },
  { name: "Umzug Baden", href: "/baden/umzugsfirmen" },
  { name: "Umzug Wettingen", href: "/wettingen/umzugsfirmen" },
  { name: "Umzug Brugg", href: "/brugg/umzugsfirmen" },
  { name: "Umzug Rheinfelden", href: "/rheinfelden/umzugsfirmen" },
];

const trustBadges = [
  { name: "Swiss Made", icon: Shield },
  { name: "SSL Encrypted", icon: Lock },
  { name: "Geprüft", icon: BadgeCheck },
];

const AnimatedCounter = ({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);
  return <span ref={ref}>{count.toLocaleString('de-CH')}{suffix}</span>;
};

const FormProgress = ({ fields }: { fields: { from: string; to: string; size: string } }) => {
  const filledCount = [fields.from, fields.to, fields.size].filter(Boolean).length;
  const percentage = (filledCount / 3) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Fortschritt</span>
        <span>{filledCount}/3 Felder</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

const QuickPriceEstimate = ({ size }: { size: string }) => {
  if (!size) return null;
  const estimates: Record<string, { min: number; max: number; savings: number }> = {
    "1-2": { min: 480, max: 850, savings: 340 },
    "2.5-3": { min: 600, max: 950, savings: 380 },
    "3.5-4": { min: 720, max: 1150, savings: 460 },
    "4.5-5": { min: 1000, max: 1500, savings: 500 },
    "5+": { min: 1400, max: 2400, savings: 560 },
  };
  const estimate = estimates[size];
  if (!estimate) return null;
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-green-700 font-medium">Geschätzte Kosten</p>
          <p className="text-lg font-bold text-green-800">CHF {estimate.min.toLocaleString()} – {estimate.max.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-green-700">Potenzielle Ersparnis</p>
          <p className="text-sm font-bold text-green-600">bis CHF {estimate.savings}</p>
        </div>
      </div>
    </motion.div>
  );
};

const WhatsAppButton = () => (
  <motion.a href={`https://wa.me/41791234567?text=Hallo,%20ich%20möchte%20eine%20Umzugsofferte%20für%20${CANTON_NAME}`} target="_blank" rel="noopener noreferrer" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: "spring" }} className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all group">
    <MessageCircle className="w-7 h-7 text-white" />
    <span className="absolute right-full mr-3 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">WhatsApp Chat</span>
  </motion.a>
);

export default function AargauLandingPage() {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(19);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [apartmentSize, setApartmentSize] = useState("");
  const [selectedCanton, setSelectedCanton] = useState(CANTON_SLUG);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setLiveViewers(prev => Math.max(12, Math.min(35, prev + Math.floor(Math.random() * 7) - 3))), 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial(prev => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("uc_prefill", JSON.stringify({ from: fromLocation, to: toLocation, size: apartmentSize, source: `${CANTON_SLUG}-landing`, timestamp: Date.now() }));
    navigate("/umzugsofferten");
  };

  const handleCantonChange = (value: string) => {
    setSelectedCanton(value);
    const canton = cantons.find(c => c.value === value);
    if (canton && value !== CANTON_SLUG) navigate(canton.href);
  };

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "LocalBusiness", "name": `Umzugscheck.ch - Kanton ${CANTON_NAME}`, "description": `Vergleiche 40+ geprüfte Umzugsfirmen im Kanton ${CANTON_NAME}. Kostenlose Offerten für Aarau, Baden, Wettingen & Brugg.`, "areaServed": { "@type": "Place", "name": `Kanton ${CANTON_NAME}, Schweiz` }, "priceRange": "CHF 480 - CHF 2800", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "3124" } },
      { "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>Umzug {CANTON_NAME} – Jetzt gratis Umzugsfirma finden | Bis 40% sparen</title>
        <meta name="description" content={`Vergleiche 40+ geprüfte Umzugsfirmen im Kanton ${CANTON_NAME} ✓ Kostenlose Offerten ✓ Aarau, Baden, Wettingen & Brugg ✓ Bis zu 40% sparen!`} />
        <link rel="canonical" href={`https://umzugscheck.ch/umzugsfirmen/${CANTON_SLUG}`} />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <main>
        {/* 1. HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${HERO_BG})` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-primary/40" />
          </div>

          <div className="container relative z-10 px-4 py-12 md:py-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Select value={selectedCanton} onValueChange={handleCantonChange}>
                    <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {cantons.map((canton) => (<SelectItem key={canton.value} value={canton.value}>{canton.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="font-bold">{liveViewers}</span> Personen vergleichen gerade
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  Umzug {CANTON_NAME} – <br className="hidden md:block" />
                  <span className="text-secondary">Jetzt gratis vergleichen</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  Vergleichen Sie <strong>40+ geprüfte Umzugsfirmen</strong> aus Aarau, Baden, Wettingen & Brugg.
                  <span className="text-green-400 font-semibold"> Bis zu 40% sparen.</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white"><AnimatedCounter end={3124} suffix="+" /></div>
                    <div className="text-xs text-white/60">Bewertungen</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white"><AnimatedCounter end={40} suffix="+" /></div>
                    <div className="text-xs text-white/60">Firmen</div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-6 h-6 fill-amber-400" />4.8<span className="text-xs text-white/60 font-normal ml-1">/ 5</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  {trustBadges.map((badge) => (<div key={badge.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs text-white/80"><badge.icon className="w-3.5 h-3.5" />{badge.name}</div>))}
                </div>

                <div className="lg:hidden space-y-3">
                  <Button asChild size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6 shadow-[0_4px_20px_rgba(220,38,38,0.4)]">
                    <Link to="/umzugsofferten">Jetzt Offerten anfordern<ArrowRight className="ml-2 w-5 h-5" /></Link>
                  </Button>
                  <p className="text-white/60 text-sm flex items-center justify-center gap-2"><Check className="w-4 h-4 text-green-400" />100% kostenlos & unverbindlich</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
                <Card className="bg-white/[0.98] backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-foreground mb-2">Jetzt gratis vergleichen</h2>
                      <p className="text-sm text-muted-foreground">In 2 Minuten zu 3-5 unverbindlichen Offerten</p>
                    </div>
                    <FormProgress fields={{ from: fromLocation, to: toLocation, size: apartmentSize }} />
                    <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="from" className="text-sm font-medium flex items-center gap-1">Umzug von<TooltipProvider><Tooltip><TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent>Ihr aktueller Wohnort</TooltipContent></Tooltip></TooltipProvider></Label>
                        <Input id="from" placeholder="5000 oder Aarau" value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} className="mt-1.5 h-12" autoFocus />
                      </div>
                      <div>
                        <Label htmlFor="to" className="text-sm font-medium">Umzug nach</Label>
                        <Input id="to" placeholder="z.B. 5400 oder Baden" value={toLocation} onChange={(e) => setToLocation(e.target.value)} className="mt-1.5 h-12" />
                      </div>
                      <div>
                        <Label htmlFor="size" className="text-sm font-medium">Wohnungsgrösse</Label>
                        <Select value={apartmentSize} onValueChange={setApartmentSize}>
                          <SelectTrigger className="mt-1.5 h-12"><SelectValue placeholder="Bitte wählen..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1 - 2 Zimmer</SelectItem>
                            <SelectItem value="2.5-3">2.5 - 3 Zimmer</SelectItem>
                            <SelectItem value="3.5-4">3.5 - 4 Zimmer</SelectItem>
                            <SelectItem value="4.5-5">4.5 - 5 Zimmer</SelectItem>
                            <SelectItem value="5+">5+ Zimmer / Haus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <QuickPriceEstimate size={apartmentSize} />
                      <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6 shadow-[0_4px_20px_rgba(220,38,38,0.4)]">
                        Kostenlos Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2"><Lock className="w-3.5 h-3.5" />100% kostenlos & unverbindlich</p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. TRUST STATS BAR */}
        <section className="py-6 bg-muted/50 border-y">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div><div className="text-2xl font-bold text-primary">40+</div><div className="text-xs text-muted-foreground">Geprüfte Firmen</div></div>
              <div><div className="text-2xl font-bold text-primary">3'100+</div><div className="text-xs text-muted-foreground">Bewertungen</div></div>
              <div><div className="text-2xl font-bold text-primary">4.8★</div><div className="text-xs text-muted-foreground">Durchschnitt</div></div>
              <div><div className="text-2xl font-bold text-green-600">40%</div><div className="text-xs text-muted-foreground">Ersparnis möglich</div></div>
            </div>
          </div>
        </section>

        {/* 3. TESTIMONIALS */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Kundenstimmen</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Das sagen unsere Kunden im {CANTON_NAME}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-3">{[...Array(5)].map((_, j) => (<Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />))}</div>
                      <p className="text-sm text-muted-foreground mb-4">"{t.text}"</p>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-sm">{t.name}</p><p className="text-xs text-muted-foreground">{t.location}</p></div>
                        {t.verified && <Badge variant="outline" className="text-xs"><CheckCircle className="w-3 h-3 mr-1" />Verifiziert</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. TOP COMPANIES */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Top Firmen</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Beste Umzugsfirmen im {CANTON_NAME}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {companies.map((company, i) => (
                <motion.div key={company.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold">{company.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{company.rating}</span>
                            <span className="text-muted-foreground text-sm">({company.reviewCount})</span>
                          </div>
                        </div>
                        {company.isPopular && <Badge className="bg-primary">Beliebt</Badge>}
                        {company.isBestPrice && <Badge className="bg-green-600">Preis-Tipp</Badge>}
                        {company.isPremium && <Badge className="bg-amber-600">Premium</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">{company.services.map(s => (<Badge key={s} variant="outline" className="text-xs">{s}</Badge>))}</div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Antwortzeit: {company.responseTime}</span>
                        <span className="font-medium">{company.priceLevel}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg"><Link to="/firmen">Alle Firmen ansehen<ArrowRight className="ml-2 w-4 h-4" /></Link></Button>
            </div>
          </div>
        </section>

        {/* 5. PRICING */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Preise</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Umzugskosten im {CANTON_NAME}</h2>
              <p className="text-muted-foreground">Durchschnittliche Preise für Umzüge innerhalb des Kantons</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {priceExamples.map((price, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="text-center h-full">
                    <CardContent className="p-6">
                      <price.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                      <h3 className="font-bold mb-1">{price.size}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{price.subtext}</p>
                      <p className="text-2xl font-bold text-primary mb-2">{price.price}</p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><TrendingDown className="w-3 h-3 mr-1" />{price.savings}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. SERVICES */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Services</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Zusatzleistungen im {CANTON_NAME}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
              {services.map((service, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link to={service.link}>
                    <Card className="h-full hover:shadow-md transition-shadow text-center">
                      <CardContent className="p-4">
                        <service.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-medium text-sm mb-1">{service.title}</h3>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. AI VIDEO CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-primary/20 overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="p-8 flex flex-col justify-center">
                      <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/20"><Sparkles className="w-3 h-3 mr-1" />KI-Technologie</Badge>
                      <h2 className="text-2xl font-bold mb-3">Video-Analyse für präzise Offerten</h2>
                      <p className="text-muted-foreground mb-6">Filmen Sie Ihre Wohnung und unsere KI berechnet automatisch das Volumen und die Kosten.</p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-600" />Exakte Volumenschätzung</li>
                        <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-600" />Präzisere Offerten</li>
                        <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-600" />Schneller als Inventarliste</li>
                      </ul>
                      <Button asChild size="lg" className="w-fit"><Link to="/rechner/video"><Video className="mr-2 w-4 h-4" />Video-Analyse starten</Link></Button>
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center"><Video className="w-16 h-16 text-primary" /></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 8. HOW IT WORKS */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">So funktioniert's</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">In 3 Schritten zum besten Angebot</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{step.time}</div>
                  <h3 className="font-bold mb-2">Schritt {step.step}: {step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. GUARANTEES */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Garantien</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Unsere Versprechen an Sie</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {guarantees.map((g, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3"><g.icon className="w-6 h-6 text-green-600" /></div>
                  <h3 className="font-bold text-sm mb-1">{g.title}</h3>
                  <p className="text-xs text-muted-foreground">{g.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. LOCAL SEO CONTENT */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Umzugsfirmen im Kanton {CANTON_NAME}</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>Der Kanton Aargau ist einer der grössten Kantone der Schweiz und bietet eine hervorragende Anbindung an Zürich, Basel und Bern. Mit Städten wie Aarau, Baden, Wettingen und Brugg ist der Kanton ein beliebter Wohn- und Arbeitsort.</p>
                <p>Unsere geprüften Umzugsfirmen im Aargau bieten professionelle Dienstleistungen für Privat- und Firmenumzüge. Ob Umzug innerhalb von Baden, von Aarau nach Zürich oder international – hier finden Sie den passenden Partner.</p>
                <p>Dank des Vergleichs von über 40 Firmen sparen unsere Kunden im Durchschnitt 35% bei gleichbleibender Qualität.</p>
              </div>
              <div className="mt-8">
                <h3 className="font-bold mb-4">Beliebte Umzugsrouten im {CANTON_NAME}</h3>
                <div className="flex flex-wrap gap-2">
                  {nearbyMunicipalities.map(m => (<Link key={m.href} to={m.href}><Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">{m.name}</Badge></Link>))}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-bold mb-4">Andere Kantone</h3>
                <div className="flex flex-wrap gap-2">
                  <Link to="/umzugsfirmen/zuerich"><Badge variant="outline" className="hover:bg-primary/10">Zürich</Badge></Link>
                  <Link to="/umzugsfirmen/bern"><Badge variant="outline" className="hover:bg-primary/10">Bern</Badge></Link>
                  <Link to="/umzugsfirmen/basel"><Badge variant="outline" className="hover:bg-primary/10">Basel</Badge></Link>
                  <Link to="/umzugsfirmen/luzern"><Badge variant="outline" className="hover:bg-primary/10">Luzern</Badge></Link>
                  <Link to="/umzugsfirmen/zug"><Badge variant="outline" className="hover:bg-primary/10">Zug</Badge></Link>
                  <Link to="/umzugsfirmen/stgallen"><Badge variant="outline" className="hover:bg-primary/10">St. Gallen</Badge></Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. FAQ */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">FAQ</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Häufige Fragen zum Umzug im {CANTON_NAME}</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-lg border px-4">
                    <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* 12. FINAL CTA */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
          <div className="container px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bereit für Ihren Umzug im {CANTON_NAME}?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Vergleichen Sie jetzt kostenlos 40+ geprüfte Umzugsfirmen und sparen Sie bis zu 40%.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6"><Link to="/umzugsofferten">Kostenlos Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10"><Link to="/rechner/video"><Video className="mr-2 w-5 h-5" />Video-Analyse nutzen</Link></Button>
            </div>
            <p className="mt-6 text-sm text-white/60 flex items-center justify-center gap-2"><Shield className="w-4 h-4" />100% kostenlos & unverbindlich</p>
          </div>
        </section>
      </main>

      <WhatsAppButton />

      {/* Sticky Mobile Bar */}
      {showStickyBar && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg p-3 lg:hidden">
          <Button asChild size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold">
            <Link to="/umzugsofferten">Kostenlos Offerten erhalten<ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
