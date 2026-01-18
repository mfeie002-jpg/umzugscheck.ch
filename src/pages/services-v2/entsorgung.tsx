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
  Lock, TrendingDown, FileText, CheckCircle, Warehouse,
  ClipboardList, MessageCircle, ShieldCheck, 
  CircleDollarSign, BadgeCheck, ThumbsUp, Recycle, Wrench, Leaf
} from "lucide-react";
import { useFlowPath } from "@/hooks/useUnifiedAB";

const HERO_BG = "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=2000&q=80";
const SERVICE_NAME = "Entsorgung";
const SERVICE_SLUG = "entsorgung";

const relatedServices = [
  { value: "entsorgung", label: "Entsorgung", href: "/services/entsorgung" },
  { value: "reinigung", label: "Reinigung", href: "/services/reinigung" },
  { value: "lagerung", label: "Lagerung", href: "/services/lagerung" },
  { value: "montage", label: "Möbelmontage", href: "/services/montage" },
  { value: "privatumzug", label: "Privatumzug", href: "/services/privatumzug" },
  { value: "firmenumzug", label: "Firmenumzug", href: "/services/firmenumzug" },
];

const companies = [
  { id: "swiss-recycling", name: "Swiss Recycling AG", rating: 4.9, reviewCount: 287, badges: ["Umweltzertifiziert", "Top Bewertung"], services: ["Haushaltsauflösung", "Sperrgut", "Recycling"], priceLevel: "Mittel", isPopular: true, responseTime: "< 2h" },
  { id: "raeum-profis", name: "Räum-Profis GmbH", rating: 4.7, reviewCount: 198, badges: ["Preis-Sieger"], services: ["Entrümpelung", "Schnellservice", "Wertanrechnung"], priceLevel: "Günstig", isBestPrice: true, responseTime: "< 1h" },
  { id: "oeko-entsorger", name: "Öko-Entsorger Plus", rating: 4.8, reviewCount: 167, badges: ["Premium", "Express 24h"], services: ["Kompletträumung", "Umweltgerecht", "Dokumentation"], priceLevel: "Premium", isPremium: true, responseTime: "< 4h" },
];

const priceExamples = [
  { size: "Einzelmöbel", price: "CHF 80 – 150", subtext: "Sofa, Schrank, Matratze", icon: Package, savings: "bis CHF 60" },
  { size: "Sperrgut 5-10 Stk", price: "CHF 200 – 400", subtext: "Mehrere Möbelstücke", icon: Trash2, savings: "bis CHF 160" },
  { size: "Zimmerräumung", price: "CHF 400 – 800", subtext: "Komplettes Zimmer", icon: Home, savings: "bis CHF 320" },
  { size: "Haushaltsauflösung", price: "ab CHF 1'200", subtext: "Ganzer Haushalt", icon: Building2, savings: "bis CHF 500" },
];

const additionalServices = [
  { title: "Privatumzug", icon: Truck, description: "Kompletter Umzugsservice", link: "/services/privatumzug" },
  { title: "Reinigung", icon: Sparkles, description: "Endreinigung mit Garantie", link: "/services/reinigung" },
  { title: "Möbelmontage", icon: Wrench, description: "Auf- & Abbau Service", link: "/services/montage" },
  { title: "Einlagerung", icon: Warehouse, description: "Sichere Lagerräume", link: "/services/lagerung" },
  { title: "Firmenumzug", icon: Building2, description: "Büro & Gewerbe", link: "/services/firmenumzug" },
  { title: "Möbellift", icon: Package, description: "Für schwere Stücke", link: "/services/moebellift" },
];

const howItWorks = [
  { step: 1, title: "Anfrage stellen", description: "Was soll entsorgt werden?", icon: ClipboardList, time: "30 Sek." },
  { step: 2, title: "Offerten erhalten", description: "3-5 Festpreisangebote", icon: FileText, time: "24-48h" },
  { step: 3, title: "Abholung & Entsorgung", description: "Fachgerecht & umweltfreundlich", icon: CheckCircle, time: "Ihr Termin" },
];

const testimonials = [
  { name: "Peter K.", location: "Basel", rating: 5, text: "Musste einen kompletten Haushalt auflösen. Die Firma war sehr professionell und einfühlsam. Alles in einem Tag erledigt!", date: "vor 5 Tagen", verified: true, savedAmount: 450 },
  { name: "Ursula B.", location: "Zürich", rating: 5, text: "Schnell, sauber und fair im Preis. Die Wertanrechnung für noch brauchbare Möbel hat die Kosten deutlich gesenkt.", date: "vor 1 Woche", verified: true, savedAmount: 320 },
  { name: "Hans M.", location: "Bern", rating: 5, text: "Innerhalb von 48h war alles weg. Super Service!", date: "vor 2 Wochen", verified: true, savedAmount: 280 },
];

const guarantees = [
  { title: "Umwelt-Garantie", description: "Fachgerechte Trennung & Recycling", icon: Leaf },
  { title: "Fixpreis-Garantie", description: "Keine versteckten Zusatzkosten", icon: CircleDollarSign },
  { title: "Qualitäts-Garantie", description: "Nur geprüfte & versicherte Firmen", icon: BadgeCheck },
  { title: "Schnell-Garantie", description: "Oft innerhalb von 48h möglich", icon: Clock },
];

const faqs = [
  { question: "Was kann alles entsorgt werden?", answer: "Praktisch alles: Möbel, Elektrogeräte, Matratzen, Teppiche, Bücher, Kleider, Hausrat, Gartenabfälle. Sondermüll (Farben, Chemikalien) wird separat und fachgerecht behandelt." },
  { question: "Wie werden die Kosten berechnet?", answer: "Die Kosten richten sich nach Menge, Art der Gegenstände und Aufwand. Die meisten Firmen bieten Pauschalpreise nach Besichtigung oder Fotobewertung an." },
  { question: "Was passiert mit noch brauchbaren Sachen?", answer: "Viele Anbieter prüfen, ob Gegenstände gespendet oder weiterverkauft werden können. Dies wird oft auf die Entsorgungskosten angerechnet (Wertanrechnung)." },
  { question: "Wie schnell kann eine Entsorgung erfolgen?", answer: "Bei Standardentsorgungen oft innerhalb von 48-72 Stunden. Für größere Haushaltsauflösungen wird ein Termin nach Aufwand vereinbart." },
  { question: "Sind die Firmen versichert?", answer: "Ja, alle unsere Partnerfirmen sind vollständig versichert. Bei Schäden am Gebäude oder Treppenhaus sind Sie abgesichert." },
];

const regions = ["Zürich", "Bern", "Basel", "Luzern", "Aargau", "Solothurn", "Zug", "Thurgau"];

const trustBadges = [
  { name: "Umweltzertifiziert", icon: Leaf },
  { name: "Versichert", icon: Shield },
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

const WhatsAppButton = () => (
  <motion.a href={`https://wa.me/41791234567?text=Hallo,%20ich%20möchte%20eine%20Offerte%20für%20${SERVICE_NAME}`} target="_blank" rel="noopener noreferrer" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: "spring" }} className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all group">
    <MessageCircle className="w-7 h-7 text-white" />
    <span className="absolute right-full mr-3 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">WhatsApp Chat</span>
  </motion.a>
);

export default function EntsorgungServicePage() {
  const navigate = useNavigate();
  const flowPath = useFlowPath();
  const [liveViewers, setLiveViewers] = useState(18);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [location, setLocation] = useState("");
  const [disposalType, setDisposalType] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICE_SLUG);

  useEffect(() => {
    const interval = setInterval(() => setLiveViewers(prev => Math.max(12, Math.min(30, prev + Math.floor(Math.random() * 7) - 3))), 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("uc_prefill", JSON.stringify({ location, disposalType, service: SERVICE_SLUG, source: `${SERVICE_SLUG}-landing`, timestamp: Date.now() }));
    navigate(flowPath);
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
      { "@type": "Service", "name": SERVICE_NAME, "description": `Professionelle ${SERVICE_NAME} und Räumung in der Schweiz. Umweltgerecht und versichert.`, "provider": { "@type": "Organization", "name": "Umzugscheck.ch" }, "areaServed": { "@type": "Country", "name": "Schweiz" }, "priceRange": "CHF 80 - CHF 3000", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "1856" } },
      { "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>{SERVICE_NAME} & Räumung Schweiz | Umweltgerecht & günstig</title>
        <meta name="description" content={`Professionelle ${SERVICE_NAME} in der Schweiz ✓ Umweltgerecht ✓ Kostenlose Offerten ✓ Geprüfte Firmen ✓ Bis zu 40% sparen!`} />
        <link rel="canonical" href={`https://umzugscheck.ch/services/${SERVICE_SLUG}`} />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <Header />

      <main>
        {/* 1. HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${HERO_BG})` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-green-900/40" />
          </div>

          <div className="container relative z-10 px-4 py-12 md:py-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Select value={selectedService} onValueChange={handleServiceChange}>
                    <SelectTrigger className="w-[160px] bg-white/10 border-white/20 text-white text-sm">
                      <Recycle className="w-4 h-4 mr-1" />
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
                  {SERVICE_NAME} & Räumung – <br className="hidden md:block" />
                  <span className="text-green-400">umweltgerecht & günstig</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  Vergleichen Sie <strong>120+ geprüfte Entsorgungsfirmen</strong> in der Schweiz.
                  <span className="text-green-400 font-semibold"> Bis zu 40% sparen.</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white"><AnimatedCounter end={1856} suffix="+" /></div>
                    <div className="text-xs text-white/60">Bewertungen</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white"><AnimatedCounter end={120} suffix="+" /></div>
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
                  <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-6 shadow-[0_4px_20px_rgba(34,197,94,0.4)]">
                    <Link to={flowPath}>Jetzt Offerten anfordern<ArrowRight className="ml-2 w-5 h-5" /></Link>
                  </Button>
                  <p className="text-white/60 text-sm flex items-center justify-center gap-2"><Check className="w-4 h-4 text-green-400" />100% kostenlos & unverbindlich</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
                <Card className="bg-white/[0.98] backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-foreground mb-2">Jetzt gratis vergleichen</h2>
                      <p className="text-sm text-muted-foreground">In 2 Minuten zu 3-5 Festpreisangeboten</p>
                    </div>
                    <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="location" className="text-sm font-medium">Standort (PLZ oder Ort)</Label>
                        <Input id="location" placeholder="z.B. 8000 Zürich" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1.5 h-12" autoFocus />
                      </div>
                      <div>
                        <Label htmlFor="type" className="text-sm font-medium">Was soll entsorgt werden?</Label>
                        <Select value={disposalType} onValueChange={setDisposalType}>
                          <SelectTrigger className="mt-1.5 h-12"><SelectValue placeholder="Bitte wählen..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="einzelmoebel">Einzelmöbel</SelectItem>
                            <SelectItem value="sperrgut">Sperrgut (mehrere Stücke)</SelectItem>
                            <SelectItem value="zimmer">Zimmerräumung</SelectItem>
                            <SelectItem value="wohnung">Wohnungsauflösung</SelectItem>
                            <SelectItem value="haus">Haushaltsauflösung</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-6 shadow-[0_4px_20px_rgba(34,197,94,0.4)]">
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
              <div><div className="text-2xl font-bold text-green-600">120+</div><div className="text-xs text-muted-foreground">Geprüfte Firmen</div></div>
              <div><div className="text-2xl font-bold text-green-600">1'800+</div><div className="text-xs text-muted-foreground">Bewertungen</div></div>
              <div><div className="text-2xl font-bold text-green-600">4.8★</div><div className="text-xs text-muted-foreground">Durchschnitt</div></div>
              <div><div className="text-2xl font-bold text-green-600">48h</div><div className="text-xs text-muted-foreground">Express möglich</div></div>
            </div>
          </div>
        </section>

        {/* 3. TESTIMONIALS */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Kundenstimmen</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Das sagen unsere Kunden zur {SERVICE_NAME}</h2>
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
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Beste Entsorgungsfirmen der Schweiz</h2>
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
                        {company.isPopular && <Badge className="bg-green-600">Beliebt</Badge>}
                        {company.isBestPrice && <Badge className="bg-blue-600">Preis-Tipp</Badge>}
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
              <Button asChild variant="outline" size="lg"><Link to="/firmen?service=entsorgung">Alle Entsorgungsfirmen<ArrowRight className="ml-2 w-4 h-4" /></Link></Button>
            </div>
          </div>
        </section>

        {/* 5. PRICING */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Preise</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{SERVICE_NAME} Kosten 2024</h2>
              <p className="text-muted-foreground">Durchschnittliche Preise für professionelle Entsorgung</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {priceExamples.map((price, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="text-center h-full">
                    <CardContent className="p-6">
                      <price.icon className="w-10 h-10 mx-auto mb-4 text-green-600" />
                      <h3 className="font-bold mb-1">{price.size}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{price.subtext}</p>
                      <p className="text-2xl font-bold text-green-600 mb-2">{price.price}</p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><TrendingDown className="w-3 h-3 mr-1" />{price.savings}</Badge>
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
                        <service.icon className="w-8 h-8 mx-auto mb-2 text-green-600" />
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

        {/* 7. FEATURE CTA - Umweltgerecht */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-green-50 via-background to-green-50/30">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-green-200 overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="p-8 flex flex-col justify-center">
                      <Badge className="w-fit mb-4 bg-green-100 text-green-700 border-green-200"><Leaf className="w-3 h-3 mr-1" />Umweltgerecht</Badge>
                      <h2 className="text-2xl font-bold mb-3">Fachgerechte Entsorgung & Recycling</h2>
                      <p className="text-muted-foreground mb-6">Alle unsere Partner entsorgen umweltgerecht. Was recycelt werden kann, wird recycelt. Was gespendet werden kann, wird gespendet.</p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-600" />Fachgerechte Trennung</li>
                        <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-600" />Maximales Recycling</li>
                        <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-600" />Wertanrechnung möglich</li>
                      </ul>
                      <Button asChild size="lg" className="w-fit bg-green-600 hover:bg-green-700"><Link to="/umzugsofferten"><Recycle className="mr-2 w-4 h-4" />Umweltgerechte Offerten anfordern</Link></Button>
                    </div>
                    <div className="bg-gradient-to-br from-green-100 to-green-50 p-8 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-green-200 flex items-center justify-center"><Leaf className="w-16 h-16 text-green-600" /></div>
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
              <h2 className="text-2xl md:text-3xl font-bold mb-3">In 3 Schritten zur Entsorgung</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-green-600" />
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
              <h2 className="text-2xl font-bold mb-6">{SERVICE_NAME} in der Schweiz</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>Professionelle Entsorgung und Räumung ist mehr als nur "Dinge wegwerfen". In der Schweiz gelten strenge Umweltvorschriften, die eine fachgerechte Trennung und Entsorgung vorschreiben.</p>
                <p>Unsere geprüften Entsorgungsfirmen kümmern sich um alles: von der Abholung über die Sortierung bis zur umweltgerechten Entsorgung oder Wiederverwertung. Viele Firmen bieten auch eine Wertanrechnung für noch brauchbare Gegenstände an.</p>
                <p>Durch den Vergleich von über 120 Firmen sparen unsere Kunden im Durchschnitt 30-40% bei gleichbleibender Qualität.</p>
              </div>
              <div className="mt-8">
                <h3 className="font-bold mb-4">Verfügbare Regionen</h3>
                <div className="flex flex-wrap gap-2">
                  {regions.map(r => (<Link key={r} to={`/umzugsfirmen/${r.toLowerCase()}`}><Badge variant="outline" className="hover:bg-green-50 cursor-pointer">{r}</Badge></Link>))}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-bold mb-4">Weitere Services</h3>
                <div className="flex flex-wrap gap-2">
                  <Link to="/services/reinigung"><Badge variant="outline" className="hover:bg-green-50">Reinigung</Badge></Link>
                  <Link to="/services/privatumzug"><Badge variant="outline" className="hover:bg-green-50">Privatumzug</Badge></Link>
                  <Link to="/services/lagerung"><Badge variant="outline" className="hover:bg-green-50">Lagerung</Badge></Link>
                  <Link to="/services/montage"><Badge variant="outline" className="hover:bg-green-50">Möbelmontage</Badge></Link>
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
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Häufige Fragen zur {SERVICE_NAME}</h2>
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
        <section className="py-16 md:py-20 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-white/20 text-white border-white/30 mb-6">Jetzt starten</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Bereit für eine stressfreie Entsorgung?</h2>
              <p className="text-lg text-white/80 mb-8">Vergleichen Sie jetzt kostenlos Offerten von geprüften Entsorgungsfirmen und sparen Sie bis zu 40%.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-green-700 hover:bg-white/90 font-bold text-lg py-6 px-8 shadow-xl">
                  <Link to="/umzugsofferten">Kostenlos Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 py-6 px-8">
                  <Link to="/firmen?service=entsorgung">Firmen ansehen</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/60 flex items-center justify-center gap-2"><Shield className="w-4 h-4" />100% kostenlos · Unverbindlich · Geprüfte Anbieter</p>
            </div>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
      <WhatsAppButton />

      {showStickyBar && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t shadow-lg p-4">
          <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
            <Link to="/umzugsofferten">Kostenlos Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
