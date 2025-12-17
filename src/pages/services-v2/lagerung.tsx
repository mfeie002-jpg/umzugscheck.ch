import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { motion, useInView } from "framer-motion";
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
  Star, Shield, Check, ArrowRight, Users, Clock, 
  Award, Sparkles, Truck, Package, Home, Trash2, Building2,
  Lock, TrendingDown, FileText, CheckCircle, Warehouse,
  ClipboardList, MessageCircle, ShieldCheck, 
  CircleDollarSign, BadgeCheck, ThumbsUp, Wrench, Key, Thermometer
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=2000&q=80";
const SERVICE_NAME = "Lagerung & Selfstorage";
const SERVICE_SLUG = "lagerung";

const relatedServices = [
  { value: "lagerung", label: "Lagerung", href: "/services/lagerung" },
  { value: "reinigung", label: "Reinigung", href: "/services/reinigung" },
  { value: "entsorgung", label: "Entsorgung", href: "/services/entsorgung" },
  { value: "montage", label: "Möbelmontage", href: "/services/montage" },
  { value: "privatumzug", label: "Privatumzug", href: "/services/privatumzug" },
  { value: "firmenumzug", label: "Firmenumzug", href: "/services/firmenumzug" },
];

const companies = [
  { id: "swiss-storage", name: "Swiss Storage AG", rating: 4.9, reviewCount: 234, badges: ["Klimatisiert", "Top Bewertung"], services: ["Selfstorage", "Möbellager", "24/7 Zugang"], priceLevel: "Mittel", isPopular: true, responseTime: "< 2h" },
  { id: "lagerprofis", name: "LagerProfis GmbH", rating: 4.7, reviewCount: 178, badges: ["Preis-Sieger"], services: ["Günstige Lager", "Flexibel", "Versichert"], priceLevel: "Günstig", isBestPrice: true, responseTime: "< 1h" },
  { id: "premium-lager", name: "Premium Lager Plus", rating: 4.8, reviewCount: 145, badges: ["Premium", "Videoüberwacht"], services: ["Klimakontrolle", "Concierge", "Abholservice"], priceLevel: "Premium", isPremium: true, responseTime: "< 4h" },
];

const priceExamples = [
  { size: "2-4 m³", price: "ab CHF 60/Mt.", subtext: "Kartons & Kleinmöbel", icon: Package, savings: "bis CHF 25" },
  { size: "5-8 m³", price: "ab CHF 90/Mt.", subtext: "1-2 Zimmer Inhalt", icon: Home, savings: "bis CHF 35" },
  { size: "10-15 m³", price: "ab CHF 150/Mt.", subtext: "3-4 Zimmer Inhalt", icon: Building2, savings: "bis CHF 60" },
  { size: "20+ m³", price: "ab CHF 250/Mt.", subtext: "Ganzer Haushalt", icon: Warehouse, savings: "bis CHF 100" },
];

const additionalServices = [
  { title: "Privatumzug", icon: Truck, description: "Kompletter Umzugsservice", link: "/services/privatumzug" },
  { title: "Reinigung", icon: Sparkles, description: "Endreinigung mit Garantie", link: "/services/reinigung" },
  { title: "Entsorgung", icon: Trash2, description: "Professionelle Räumung", link: "/services/entsorgung" },
  { title: "Möbelmontage", icon: Wrench, description: "Auf- & Abbau Service", link: "/services/montage" },
  { title: "Firmenumzug", icon: Building2, description: "Büro & Gewerbe", link: "/services/firmenumzug" },
  { title: "Möbellift", icon: Package, description: "Für schwere Stücke", link: "/services/moebellift" },
];

const howItWorks = [
  { step: 1, title: "Bedarf ermitteln", description: "Wie viel Platz benötigen Sie?", icon: ClipboardList, time: "30 Sek." },
  { step: 2, title: "Offerten vergleichen", description: "Preise & Standorte vergleichen", icon: FileText, time: "Sofort" },
  { step: 3, title: "Lager mieten & einlagern", description: "Flexibel, sicher, 24/7 Zugang", icon: Key, time: "Ab sofort" },
];

const testimonials = [
  { name: "Marco S.", location: "Bern", rating: 5, text: "Perfekt für unseren Umzug. Die Möbel waren 2 Monate sicher eingelagert. Alles war in einwandfreiem Zustand!", date: "vor 4 Tagen", verified: true, savedAmount: 120 },
  { name: "Anna K.", location: "Zürich", rating: 5, text: "Super Preis-Leistung. Der 24/7 Zugang ist Gold wert. Sehr zu empfehlen!", date: "vor 1 Woche", verified: true, savedAmount: 85 },
  { name: "Stefan M.", location: "Basel", rating: 5, text: "Klimatisiertes Lager für meine Kunstsammlung. Absolut professionell!", date: "vor 2 Wochen", verified: true, savedAmount: 150 },
];

const guarantees = [
  { title: "Sicherheits-Garantie", description: "Alarmgesichert & videoüberwacht", icon: ShieldCheck },
  { title: "Flexibilitäts-Garantie", description: "Jederzeit kündbar, keine Mindestlaufzeit", icon: Key },
  { title: "Versicherungs-Garantie", description: "Grundversicherung inklusive", icon: BadgeCheck },
  { title: "Zugangs-Garantie", description: "24/7 Zugang zu Ihren Sachen", icon: Clock },
];

const faqs = [
  { question: "Wie groß sollte mein Lagerraum sein?", answer: "Faustregel: Pro Zimmer ca. 3-5 m³. Ein 3-Zimmer-Haushalt braucht etwa 10-15 m³. Unsere Partner helfen Ihnen bei der Berechnung." },
  { question: "Sind meine Sachen versichert?", answer: "Ja, eine Grundversicherung ist bei den meisten Anbietern inklusive. Für wertvolle Gegenstände empfehlen wir eine Zusatzversicherung." },
  { question: "Kann ich jederzeit an meine Sachen?", answer: "Bei den meisten Anbietern haben Sie 24/7 Zugang per PIN-Code oder Schlüsselkarte. Einige bieten auch Concierge-Service." },
  { question: "Wie lange ist die Mindestmietdauer?", answer: "Viele Anbieter vermieten bereits ab 1 Monat, ohne lange Kündigungsfristen. Ideal für Umzüge oder temporäre Lösungen." },
  { question: "Gibt es klimatisierte Lagerräume?", answer: "Ja, viele Anbieter bieten klimatisierte Räume für empfindliche Gegenstände wie Kunstwerke, Wein oder Elektronik." },
];

const regions = ["Zürich", "Bern", "Basel", "Luzern", "Genf", "Lausanne", "Winterthur", "St. Gallen"];

const trustBadges = [
  { name: "Videoüberwacht", icon: Shield },
  { name: "Versichert", icon: BadgeCheck },
  { name: "24/7 Zugang", icon: Key },
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

const WhatsAppButton = () => (
  <motion.a href={`https://wa.me/41791234567?text=Hallo,%20ich%20suche%20einen%20Lagerraum`} target="_blank" rel="noopener noreferrer" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: "spring" }} className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all group">
    <MessageCircle className="w-7 h-7 text-white" />
    <span className="absolute right-full mr-3 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">WhatsApp Chat</span>
  </motion.a>
);

export default function LagerungServicePage() {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(16);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [location, setLocation] = useState("");
  const [storageSize, setStorageSize] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICE_SLUG);

  useEffect(() => {
    const interval = setInterval(() => setLiveViewers(prev => Math.max(10, Math.min(28, prev + Math.floor(Math.random() * 7) - 3))), 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("uc_prefill", JSON.stringify({ location, storageSize, service: SERVICE_SLUG, source: `${SERVICE_SLUG}-landing`, timestamp: Date.now() }));
    navigate("/umzugsofferten");
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    const service = relatedServices.find(s => s.value === value);
    if (service && value !== SERVICE_SLUG) navigate(service.href);
  };

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", "name": SERVICE_NAME, "description": "Sichere Lagerung und Selfstorage in der Schweiz. Flexibel, versichert, 24/7 Zugang.", "provider": { "@type": "Organization", "name": "Umzugscheck.ch" }, "areaServed": { "@type": "Country", "name": "Schweiz" }, "priceRange": "CHF 60 - CHF 500/Monat", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "1423" } },
      { "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>Lagerung & Selfstorage Schweiz | Sicher & flexibel ab CHF 60</title>
        <meta name="description" content="Sichere Lagerung in der Schweiz ✓ Selfstorage ab CHF 60/Mt. ✓ 24/7 Zugang ✓ Versichert ✓ Flexibel kündbar!" />
        <link rel="canonical" href={`https://umzugscheck.ch/services/${SERVICE_SLUG}`} />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <Header />

      <main>
        {/* 1. HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${HERO_BG})` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-amber-900/40" />
          </div>

          <div className="container relative z-10 px-4 py-12 md:py-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Select value={selectedService} onValueChange={handleServiceChange}>
                    <SelectTrigger className="w-[160px] bg-white/10 border-white/20 text-white text-sm">
                      <Warehouse className="w-4 h-4 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {relatedServices.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-6">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <span className="font-bold">{liveViewers}</span> Personen suchen gerade
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  {SERVICE_NAME} – <br className="hidden md:block" />
                  <span className="text-amber-400">sicher & flexibel</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  Finden Sie <strong>100+ sichere Lagerräume</strong> in der Schweiz.
                  <span className="text-amber-400 font-semibold"> Ab CHF 60/Monat.</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white"><AnimatedCounter end={1423} suffix="+" /></div>
                    <div className="text-xs text-white/60">Bewertungen</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white"><AnimatedCounter end={100} suffix="+" /></div>
                    <div className="text-xs text-white/60">Standorte</div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-6 h-6 fill-amber-400" />4.8<span className="text-xs text-white/60 font-normal ml-1">/ 5</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  {trustBadges.map((badge) => (<div key={badge.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs text-white/80"><badge.icon className="w-3.5 h-3.5" />{badge.name}</div>))}
                </div>

                <div className="lg:hidden space-y-3">
                  <Button asChild size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg py-6 shadow-[0_4px_20px_rgba(245,158,11,0.4)]">
                    <Link to="/umzugsofferten">Jetzt Lager finden<ArrowRight className="ml-2 w-5 h-5" /></Link>
                  </Button>
                  <p className="text-white/60 text-sm flex items-center justify-center gap-2"><Check className="w-4 h-4 text-amber-400" />Unverbindlich anfragen</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
                <Card className="bg-white/[0.98] backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-foreground mb-2">Lagerraum finden</h2>
                      <p className="text-sm text-muted-foreground">Vergleichen Sie Preise und Standorte</p>
                    </div>
                    <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="location" className="text-sm font-medium">Standort (PLZ oder Ort)</Label>
                        <Input id="location" placeholder="z.B. 8000 Zürich" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1.5 h-12" autoFocus />
                      </div>
                      <div>
                        <Label htmlFor="size" className="text-sm font-medium">Benötigte Grösse</Label>
                        <Select value={storageSize} onValueChange={setStorageSize}>
                          <SelectTrigger className="mt-1.5 h-12"><SelectValue placeholder="Bitte wählen..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2-4">2-4 m³ (Kartons & Kleinmöbel)</SelectItem>
                            <SelectItem value="5-8">5-8 m³ (1-2 Zimmer)</SelectItem>
                            <SelectItem value="10-15">10-15 m³ (3-4 Zimmer)</SelectItem>
                            <SelectItem value="20+">20+ m³ (Ganzer Haushalt)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg py-6 shadow-[0_4px_20px_rgba(245,158,11,0.4)]">
                        Lagerräume vergleichen<ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2"><Lock className="w-3.5 h-3.5" />Unverbindlich & kostenlos</p>
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
              <div><div className="text-2xl font-bold text-amber-600">100+</div><div className="text-xs text-muted-foreground">Standorte</div></div>
              <div><div className="text-2xl font-bold text-amber-600">1'400+</div><div className="text-xs text-muted-foreground">Bewertungen</div></div>
              <div><div className="text-2xl font-bold text-amber-600">4.8★</div><div className="text-xs text-muted-foreground">Durchschnitt</div></div>
              <div><div className="text-2xl font-bold text-amber-600">24/7</div><div className="text-xs text-muted-foreground">Zugang möglich</div></div>
            </div>
          </div>
        </section>

        {/* 3. TESTIMONIALS */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Kundenstimmen</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Das sagen unsere Kunden zur Lagerung</h2>
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
              <Badge variant="secondary" className="mb-3">Top Anbieter</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Beste Lageranbieter der Schweiz</h2>
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
                        {company.isPopular && <Badge className="bg-amber-600">Beliebt</Badge>}
                        {company.isBestPrice && <Badge className="bg-blue-600">Preis-Tipp</Badge>}
                        {company.isPremium && <Badge className="bg-purple-600">Premium</Badge>}
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
              <Button asChild variant="outline" size="lg"><Link to="/firmen?service=lagerung">Alle Lageranbieter<ArrowRight className="ml-2 w-4 h-4" /></Link></Button>
            </div>
          </div>
        </section>

        {/* 5. PRICING */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Preise</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Lagerung Kosten 2024</h2>
              <p className="text-muted-foreground">Monatliche Preise für sichere Lagerräume</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {priceExamples.map((price, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="text-center h-full">
                    <CardContent className="p-6">
                      <price.icon className="w-10 h-10 mx-auto mb-4 text-amber-600" />
                      <h3 className="font-bold mb-1">{price.size}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{price.subtext}</p>
                      <p className="text-2xl font-bold text-amber-600 mb-2">{price.price}</p>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><TrendingDown className="w-3 h-3 mr-1" />{price.savings}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. ADDITIONAL SERVICES */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Weitere Services</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Kombinieren & sparen</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
              {additionalServices.map((service, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link to={service.link}>
                    <Card className="h-full hover:shadow-md transition-shadow text-center">
                      <CardContent className="p-4">
                        <service.icon className="w-8 h-8 mx-auto mb-2 text-amber-600" />
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

        {/* 7. FEATURE CTA - Klimatisiert */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-amber-50 via-background to-amber-50/30">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-amber-200 overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="p-8 flex flex-col justify-center">
                      <Badge className="w-fit mb-4 bg-amber-100 text-amber-700 border-amber-200"><Thermometer className="w-3 h-3 mr-1" />Klimatisiert</Badge>
                      <h2 className="text-2xl font-bold mb-3">Optimale Lagerbedingungen</h2>
                      <p className="text-muted-foreground mb-6">Für empfindliche Gegenstände wie Kunstwerke, Wein oder Elektronik bieten wir klimatisierte Lagerräume mit konstanter Temperatur und Luftfeuchtigkeit.</p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-amber-600" />Konstante Temperatur</li>
                        <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-amber-600" />Kontrollierte Luftfeuchtigkeit</li>
                        <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-amber-600" />Ideal für Wertgegenstände</li>
                      </ul>
                      <Button asChild size="lg" className="w-fit bg-amber-500 hover:bg-amber-600"><Link to="/umzugsofferten"><Warehouse className="mr-2 w-4 h-4" />Klimatisiertes Lager finden</Link></Button>
                    </div>
                    <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-8 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-amber-200 flex items-center justify-center"><Thermometer className="w-16 h-16 text-amber-600" /></div>
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
              <h2 className="text-2xl md:text-3xl font-bold mb-3">In 3 Schritten zum Lagerraum</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-amber-600" />
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
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3"><g.icon className="w-6 h-6 text-amber-600" /></div>
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
              <h2 className="text-2xl font-bold mb-6">Lagerung & Selfstorage in der Schweiz</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>Ob Umzug, Renovierung oder einfach Platzmangel – sichere Lagerräume sind in der Schweiz gefragter denn je. Selfstorage bietet flexible Lösungen für jeden Bedarf.</p>
                <p>Unsere Partner bieten moderne, videoüberwachte Lagerräume mit 24/7 Zugang. Von kleinen Boxen für Kartons bis hin zu grossen Lagerräumen für ganze Haushalte ist alles verfügbar.</p>
                <p>Die meisten Anbieter vermieten bereits ab 1 Monat ohne lange Kündigungsfristen. Ideal für temporäre Lagerlösungen während eines Umzugs.</p>
              </div>
              <div className="mt-8">
                <h3 className="font-bold mb-4">Verfügbare Regionen</h3>
                <div className="flex flex-wrap gap-2">
                  {regions.map(r => (<Link key={r} to={`/umzugsfirmen/${r.toLowerCase()}`}><Badge variant="outline" className="hover:bg-amber-50 cursor-pointer">{r}</Badge></Link>))}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-bold mb-4">Weitere Services</h3>
                <div className="flex flex-wrap gap-2">
                  <Link to="/services/reinigung"><Badge variant="outline" className="hover:bg-amber-50">Reinigung</Badge></Link>
                  <Link to="/services/privatumzug"><Badge variant="outline" className="hover:bg-amber-50">Privatumzug</Badge></Link>
                  <Link to="/services/entsorgung"><Badge variant="outline" className="hover:bg-amber-50">Entsorgung</Badge></Link>
                  <Link to="/services/montage"><Badge variant="outline" className="hover:bg-amber-50">Möbelmontage</Badge></Link>
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
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Häufige Fragen zur Lagerung</h2>
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
        <section className="py-16 md:py-20 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-white/20 text-white border-white/30 mb-6">Jetzt starten</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Bereit für sicheres Einlagern?</h2>
              <p className="text-lg text-white/80 mb-8">Finden Sie jetzt den perfekten Lagerraum in Ihrer Nähe. Flexibel, sicher und günstig.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-amber-700 hover:bg-white/90 font-bold text-lg py-6 px-8 shadow-xl">
                  <Link to="/umzugsofferten">Lagerraum finden<ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 py-6 px-8">
                  <Link to="/firmen?service=lagerung">Anbieter ansehen</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/60 flex items-center justify-center gap-2"><Shield className="w-4 h-4" />Unverbindlich · Versichert · 24/7 Zugang</p>
            </div>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
      <WhatsAppButton />

      {showStickyBar && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t shadow-lg p-4">
          <Button asChild size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold">
            <Link to="/umzugsofferten">Lagerraum finden<ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
