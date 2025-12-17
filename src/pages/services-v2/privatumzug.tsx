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
import { Progress } from "@/components/ui/progress";
import {
  Star, Shield, MapPin, Check, ArrowRight, Users, Clock, 
  Award, Sparkles, Truck, Package, Home, Trash2, Building2,
  Lock, Phone, TrendingDown, FileText, CheckCircle, Sofa, Warehouse,
  ClipboardList, ChevronRight, MessageCircle, Crown, Banknote, ShieldCheck, 
  CircleDollarSign, BadgeCheck, ThumbsUp, Video, Info, Gift, Wrench
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=2000&q=80";
const SERVICE_NAME = "Privatumzug";
const SERVICE_SLUG = "privatumzug";

const relatedServices = [
  { value: "privatumzug", label: "Privatumzug", href: "/services/privatumzug" },
  { value: "firmenumzug", label: "Firmenumzug", href: "/services/firmenumzug" },
  { value: "reinigung", label: "Reinigung", href: "/services/reinigung" },
  { value: "entsorgung", label: "Entsorgung", href: "/services/entsorgung" },
  { value: "lagerung", label: "Lagerung", href: "/services/lagerung" },
  { value: "montage", label: "Möbelmontage", href: "/services/montage" },
];

const companies = [
  { id: "umzug-express", name: "Umzug Express AG", rating: 4.9, reviewCount: 487, badges: ["Top Bewertung", "Express"], services: ["Komplettumzug", "Verpackung", "Möbelmontage"], priceLevel: "Mittel", isPopular: true, responseTime: "< 2h" },
  { id: "swiss-move", name: "Swiss Move GmbH", rating: 4.8, reviewCount: 356, badges: ["Preis-Sieger"], services: ["Privatumzug", "Seniorenumzug", "Studentenumzug"], priceLevel: "Günstig", isBestPrice: true, responseTime: "< 1h" },
  { id: "premium-umzug", name: "Premium Umzug", rating: 4.9, reviewCount: 298, badges: ["Premium", "Versichert"], services: ["Full-Service", "Kunsttransport", "Klaviertransport"], priceLevel: "Premium", isPremium: true, responseTime: "< 4h" },
];

const priceExamples = [
  { size: "1-2 Zimmer", price: "CHF 600 – 1'200", subtext: "Studio / kleine Wohnung", icon: Home, savings: "bis CHF 400" },
  { size: "3-3.5 Zimmer", price: "CHF 1'200 – 2'000", subtext: "Standard Wohnung", icon: Building2, savings: "bis CHF 800" },
  { size: "4-5 Zimmer", price: "CHF 1'800 – 3'500", subtext: "Grosse Wohnung", icon: Home, savings: "bis CHF 1'400" },
  { size: "Haus / Villa", price: "ab CHF 3'000", subtext: "Einfamilienhaus", icon: Home, savings: "bis CHF 1'500" },
];

const additionalServices = [
  { title: "Reinigung", icon: Sparkles, description: "Umzugsreinigung mit Abnahmegarantie", link: "/services/reinigung" },
  { title: "Entsorgung", icon: Trash2, description: "Professionelle Räumung", link: "/services/entsorgung" },
  { title: "Möbelmontage", icon: Wrench, description: "Auf- & Abbau Service", link: "/services/montage" },
  { title: "Einlagerung", icon: Warehouse, description: "Sichere Lagerräume", link: "/services/lagerung" },
  { title: "Möbellift", icon: Package, description: "Für schwere Stücke", link: "/services/moebellift" },
  { title: "Packservice", icon: Package, description: "Wir packen für Sie", link: "/services/packservice" },
];

const howItWorks = [
  { step: 1, title: "Anfrage stellen", description: "Von/Nach, Wohnungsgrösse und Termin angeben", icon: ClipboardList, time: "30 Sek." },
  { step: 2, title: "Offerten erhalten", description: "3-5 unverbindliche Angebote", icon: FileText, time: "24-48h" },
  { step: 3, title: "Firma wählen & umziehen", description: "Vergleichen und beauftragen", icon: CheckCircle, time: "Ihr Termin" },
];

const testimonials = [
  { name: "Michael S.", location: "Zürich", rating: 5, text: "Der Umzug lief reibungslos. Das Team war pünktlich, professionell und hat alles sicher transportiert. Durch den Vergleich CHF 600 gespart!", date: "vor 3 Tagen", verified: true, savedAmount: 600 },
  { name: "Anna B.", location: "Bern", rating: 5, text: "Fantastischer Service! Die Möbel wurden sorgfältig behandelt und der Preis war fair. Absolut empfehlenswert.", date: "vor 1 Woche", verified: true, savedAmount: 450 },
  { name: "Peter M.", location: "Basel", rating: 5, text: "Von der Offerte bis zum Einzug alles perfekt. Die Firma hat sogar die Möbel montiert. Top!", date: "vor 2 Wochen", verified: true, savedAmount: 800 },
];

const guarantees = [
  { title: "Versicherungsschutz", description: "Vollversicherung für Ihre Möbel", icon: ShieldCheck },
  { title: "Fixpreis-Garantie", description: "Keine versteckten Kosten", icon: CircleDollarSign },
  { title: "Geprüfte Firmen", description: "Nur zertifizierte Umzugsunternehmen", icon: BadgeCheck },
  { title: "Zufriedenheits-Garantie", description: "Wir helfen bei Problemen", icon: ThumbsUp },
];

const faqs = [
  { question: "Was kostet ein Privatumzug?", answer: "Die Kosten variieren je nach Wohnungsgrösse und Distanz: 2-Zimmer ca. CHF 600-1'200, 3-4 Zimmer ca. CHF 1'200-2'500, 5+ Zimmer ab CHF 2'500. Mit unserem Vergleich sparen Sie bis zu 40%." },
  { question: "Was ist im Umzugsservice inbegriffen?", answer: "Ein Standard-Umzug beinhaltet: Transport aller Möbel und Kartons, Be- und Entladen, Fahrzeug inkl. Fahrer. Optional: Verpackungsmaterial, Ein-/Auspacken, Möbelmontage, Reinigung." },
  { question: "Wie lange dauert ein Umzug?", answer: "Je nach Wohnungsgrösse: 2-3 Zimmer ca. 4-6 Stunden, 4-5 Zimmer ca. 6-8 Stunden, Haus/Villa ganztägig. Faktoren: Stockwerk, Lift, Distanz, Möbelmenge." },
  { question: "Muss ich selbst einpacken?", answer: "Nein, die meisten Firmen bieten einen Packservice an. Sie können zwischen Selbstpacken, Teilpacken (z.B. nur Fragiles) oder Vollpackservice wählen." },
  { question: "Wie weit im Voraus sollte ich buchen?", answer: "Wir empfehlen 4-8 Wochen Vorlaufzeit, in der Hochsaison (Frühling/Sommer) eher 8-12 Wochen. Für kurzfristige Umzüge finden wir oft noch Lösungen." },
];

const regions = ["Zürich", "Bern", "Basel", "Luzern", "Aargau", "St. Gallen", "Zug", "Thurgau"];

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

const FormProgress = ({ fields }: { fields: { location: string; size: string; date: string } }) => {
  const filledCount = [fields.location, fields.size, fields.date].filter(Boolean).length;
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
    "1-2": { min: 600, max: 1200, savings: 400 },
    "2.5-3": { min: 1000, max: 1600, savings: 600 },
    "3.5-4": { min: 1400, max: 2200, savings: 800 },
    "4.5-5": { min: 1800, max: 3000, savings: 1200 },
    "5+": { min: 2500, max: 5000, savings: 1500 },
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
  <motion.a href={`https://wa.me/41791234567?text=Hallo,%20ich%20möchte%20eine%20Offerte%20für%20einen%20${SERVICE_NAME}`} target="_blank" rel="noopener noreferrer" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: "spring" }} className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all group">
    <MessageCircle className="w-7 h-7 text-white" />
    <span className="absolute right-full mr-3 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">WhatsApp Chat</span>
  </motion.a>
);

export default function PrivatumzugServicePage() {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(28);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [location, setLocation] = useState("");
  const [apartmentSize, setApartmentSize] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICE_SLUG);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setLiveViewers(prev => Math.max(18, Math.min(45, prev + Math.floor(Math.random() * 7) - 3))), 3500);
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
    localStorage.setItem("uc_prefill", JSON.stringify({ location, size: apartmentSize, date: moveDate, service: SERVICE_SLUG, source: `${SERVICE_SLUG}-landing`, timestamp: Date.now() }));
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
      { "@type": "Service", "name": SERVICE_NAME, "description": `Professioneller ${SERVICE_NAME} in der Schweiz. Vergleichen Sie Angebote und sparen Sie bis zu 40%.`, "provider": { "@type": "Organization", "name": "Umzugscheck.ch" }, "areaServed": { "@type": "Country", "name": "Schweiz" }, "priceRange": "CHF 600 - CHF 5000", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "3541" } },
      { "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>{SERVICE_NAME} Schweiz | Umzugsfirmen vergleichen & bis 40% sparen</title>
        <meta name="description" content={`Professioneller ${SERVICE_NAME} in der Schweiz ✓ Geprüfte Umzugsfirmen ✓ Kostenlose Offerten ✓ Vollversicherung ✓ Bis zu 40% sparen!`} />
        <link rel="canonical" href={`https://umzugscheck.ch/services/${SERVICE_SLUG}`} />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${HERO_BG})` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-primary/40" />
          </div>

          <div className="container relative z-10 px-4 py-12 md:py-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Select value={selectedService} onValueChange={handleServiceChange}>
                    <SelectTrigger className="w-[160px] bg-white/10 border-white/20 text-white text-sm">
                      <Truck className="w-4 h-4 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {relatedServices.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
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
                  {SERVICE_NAME} – <br className="hidden md:block" />
                  <span className="text-secondary">stressfrei umziehen</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  Vergleichen Sie <strong>200+ geprüfte Umzugsfirmen</strong> in der Schweiz.
                  <span className="text-green-400 font-semibold"> Bis zu 40% sparen.</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white"><AnimatedCounter end={3541} suffix="+" /></div>
                    <div className="text-xs text-white/60">Bewertungen</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white"><AnimatedCounter end={200} suffix="+" /></div>
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
                    <Link to="/umzugsofferten">Jetzt Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link>
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
                    <FormProgress fields={{ location, size: apartmentSize, date: moveDate }} />
                    <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="location" className="text-sm font-medium">Von (PLZ oder Ort)</Label>
                        <div className="relative mt-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="z.B. 8001 Zürich" className="pl-10" required />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="size" className="text-sm font-medium">Wohnungsgrösse</Label>
                        <Select value={apartmentSize} onValueChange={setApartmentSize}>
                          <SelectTrigger id="size" className="mt-1"><SelectValue placeholder="Wählen..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 Zimmer</SelectItem>
                            <SelectItem value="2.5-3">2.5-3 Zimmer</SelectItem>
                            <SelectItem value="3.5-4">3.5-4 Zimmer</SelectItem>
                            <SelectItem value="4.5-5">4.5-5 Zimmer</SelectItem>
                            <SelectItem value="5+">5+ Zimmer / Haus</SelectItem>
                          </SelectContent>
                        </Select>
                        <QuickPriceEstimate size={apartmentSize} />
                      </div>
                      <div>
                        <Label htmlFor="date" className="text-sm font-medium">Umzugsdatum</Label>
                        <Input id="date" type="date" value={moveDate} onChange={(e) => setMoveDate(e.target.value)} className="mt-1" />
                      </div>
                      <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6">
                        Kostenlos Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />Ihre Daten sind sicher & werden nicht weitergegeben
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TRUST STATS */}
        <section className="py-8 bg-muted/30 border-y border-border">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div><div className="text-2xl md:text-3xl font-bold text-primary">15'000+</div><div className="text-sm text-muted-foreground">Umzüge vermittelt</div></div>
              <div><div className="text-2xl md:text-3xl font-bold text-primary">CHF 850</div><div className="text-sm text-muted-foreground">Ø Ersparnis</div></div>
              <div><div className="text-2xl md:text-3xl font-bold text-primary">4.8/5</div><div className="text-sm text-muted-foreground">Kundenbewertung</div></div>
              <div><div className="text-2xl md:text-3xl font-bold text-primary">100%</div><div className="text-sm text-muted-foreground">Kostenlos</div></div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Das sagen unsere Kunden</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                      </div>
                      <p className="text-muted-foreground mb-4">"{t.text}"</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{t.name}</p>
                          <p className="text-sm text-muted-foreground">{t.location} · {t.date}</p>
                        </div>
                        {t.verified && <Badge variant="secondary" className="text-xs"><Check className="w-3 h-3 mr-1" />Verifiziert</Badge>}
                      </div>
                      {t.savedAmount && <div className="mt-3 pt-3 border-t"><p className="text-sm text-green-600 font-medium">Ersparnis: CHF {t.savedAmount}</p></div>}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TOP COMPANIES */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Top Umzugsfirmen</h2>
            <p className="text-center text-muted-foreground mb-12">Geprüfte Partner mit besten Bewertungen</p>
            <div className="grid md:grid-cols-3 gap-6">
              {companies.map((c, i) => (
                <Card key={c.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  {c.isPopular && <Badge className="absolute top-3 right-3 bg-amber-500">Beliebt</Badge>}
                  {c.isBestPrice && <Badge className="absolute top-3 right-3 bg-green-500">Preis-Tipp</Badge>}
                  {c.isPremium && <Badge className="absolute top-3 right-3 bg-purple-500">Premium</Badge>}
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2">{c.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="ml-1 font-medium">{c.rating}</span></div>
                      <span className="text-sm text-muted-foreground">({c.reviewCount} Bewertungen)</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {c.badges.map(b => <Badge key={b} variant="outline" className="text-xs">{b}</Badge>)}
                    </div>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-muted-foreground">Preisniveau: {c.priceLevel}</span>
                      <span className="text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1" />{c.responseTime}</span>
                    </div>
                    <Button asChild className="w-full"><Link to="/umzugsofferten">Offerte anfordern</Link></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PRICE EXAMPLES */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Preisbeispiele {SERVICE_NAME}</h2>
            <p className="text-center text-muted-foreground mb-12">Durchschnittliche Kosten nach Wohnungsgrösse</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {priceExamples.map((p, i) => (
                <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <p.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                    <h3 className="font-bold mb-1">{p.size}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{p.subtext}</p>
                    <p className="text-2xl font-bold text-primary mb-2">{p.price}</p>
                    <p className="text-sm text-green-600">Sparen: {p.savings}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ADDITIONAL SERVICES */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Ergänzende Services</h2>
            <p className="text-center text-muted-foreground mb-12">Alles aus einer Hand für Ihren Umzug</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalServices.map((s, i) => (
                <Link key={i} to={s.link}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl"><s.icon className="w-6 h-6 text-primary" /></div>
                      <div>
                        <h3 className="font-bold mb-1">{s.title}</h3>
                        <p className="text-sm text-muted-foreground">{s.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto self-center" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">So funktioniert's</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-sm text-primary font-medium mb-2">Schritt {step.step} · {step.time}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GUARANTEES */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Unsere Garantien</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {guarantees.map((g, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="p-6">
                    <g.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                    <h3 className="font-bold mb-2">{g.title}</h3>
                    <p className="text-sm text-muted-foreground">{g.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* REGIONS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-8">{SERVICE_NAME} in Ihrer Region</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {regions.map(r => (
                <Link key={r} to={`/umzugsfirmen/${r.toLowerCase().replace(/\s/g, '-')}`}>
                  <Badge variant="outline" className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors">
                    <MapPin className="w-3 h-3 mr-1" />{r}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Häufige Fragen</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-lg border px-6">
                  <AccordionTrigger className="text-left font-medium py-4">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bereit für Ihren stressfreien Umzug?</h2>
            <p className="text-lg mb-8 opacity-90">Vergleichen Sie jetzt kostenlos und sparen Sie bis zu 40%</p>
            <Button asChild size="lg" variant="secondary" className="font-bold text-lg px-8 py-6">
              <Link to="/umzugsofferten">Jetzt Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
      <WhatsAppButton />

      {/* Sticky Mobile CTA */}
      {showStickyBar && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border z-50 lg:hidden">
          <Button asChild size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold">
            <Link to="/umzugsofferten">Jetzt Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
