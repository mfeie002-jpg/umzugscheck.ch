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
  Star, Shield, MapPin, Check, ArrowRight, Clock, Lock, FileText, CheckCircle,
  ClipboardList, ShieldCheck, CircleDollarSign, BadgeCheck, ThumbsUp, Package, Box, Home
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2000&q=80";
const SERVICE_NAME = "Packservice";
const SERVICE_SLUG = "packservice";

const relatedServices = [
  { value: "packservice", label: "Packservice", href: "/services/packservice" },
  { value: "privatumzug", label: "Privatumzug", href: "/services/privatumzug" },
  { value: "reinigung", label: "Reinigung", href: "/services/reinigung" },
  { value: "entsorgung", label: "Entsorgung", href: "/services/entsorgung" },
  { value: "lagerung", label: "Lagerung", href: "/services/lagerung" },
];

const companies = [
  { id: "pack-profi", name: "Pack Profi AG", rating: 4.9, reviewCount: 234, badges: ["Fragiles-Spezialist", "Express"], priceLevel: "Mittel", isPopular: true, responseTime: "< 2h" },
  { id: "swiss-pack", name: "Swiss Pack Service", rating: 4.8, reviewCount: 189, badges: ["Preis-Sieger"], priceLevel: "Günstig", isBestPrice: true, responseTime: "< 1h" },
  { id: "premium-pack", name: "Premium Packing", rating: 4.9, reviewCount: 156, badges: ["Kunsttransport", "Versichert"], priceLevel: "Premium", isPremium: true, responseTime: "< 4h" },
];

const priceExamples = [
  { size: "Nur Fragiles", price: "CHF 200 – 400", subtext: "Glas, Porzellan, Bilder", icon: Package, savings: "bis CHF 150" },
  { size: "Teilservice", price: "CHF 400 – 800", subtext: "Küche & fragile Gegenstände", icon: Box, savings: "bis CHF 300" },
  { size: "Vollservice", price: "CHF 800 – 1'500", subtext: "Komplette Wohnung", icon: Home, savings: "bis CHF 600" },
  { size: "Auspacken inkl.", price: "CHF 1'200 – 2'000", subtext: "Ein- und Auspacken", icon: Package, savings: "bis CHF 800" },
];

const howItWorks = [
  { step: 1, title: "Anfrage stellen", description: "Umfang & Wunschtermin angeben", icon: ClipboardList, time: "30 Sek." },
  { step: 2, title: "Offerten erhalten", description: "Transparente Festpreise", icon: FileText, time: "24h" },
  { step: 3, title: "Profis packen", description: "Material & Arbeit inklusive", icon: CheckCircle, time: "Ihr Termin" },
];

const testimonials = [
  { name: "Claudia M.", location: "Zürich", rating: 5, text: "Das Pack-Team war unglaublich effizient! In 4 Stunden war die ganze Wohnung verpackt. Alles heil angekommen.", date: "vor 4 Tagen", verified: true, savedAmount: 350 },
  { name: "Stefan R.", location: "Bern", rating: 5, text: "Fragiles wurde super sorgfältig verpackt. Jedes Glas in Seidenpapier. Sehr professionell!", date: "vor 1 Woche", verified: true, savedAmount: 280 },
  { name: "Maria K.", location: "Basel", rating: 5, text: "Der Vollservice hat sich absolut gelohnt. Kein Stress, kein Chaos. Klare Empfehlung!", date: "vor 2 Wochen", verified: true, savedAmount: 500 },
];

const guarantees = [
  { title: "Material inklusive", description: "Kartons, Papier, Folie", icon: Box },
  { title: "Bruch-Garantie", description: "Versicherung für Fragiles", icon: ShieldCheck },
  { title: "Festpreise", description: "Keine versteckten Kosten", icon: CircleDollarSign },
  { title: "Profi-Team", description: "Erfahrene Packer", icon: BadgeCheck },
];

const faqs = [
  { question: "Was kostet ein Packservice?", answer: "Nur Fragiles ab CHF 200, Teilservice CHF 400-800, Vollservice CHF 800-1'500. Material (Kartons, Papier) ist inklusive." },
  { question: "Was ist im Material enthalten?", answer: "Alle nötigen Kartons, Packpapier, Luftpolsterfolie, Klebeband, Beschriftungsmaterial. Nach dem Umzug können Kartons abgeholt werden." },
  { question: "Wie lange dauert das Packen?", answer: "2-3 Zimmer ca. 3-4 Stunden, 4-5 Zimmer ca. 5-7 Stunden. Profis arbeiten zu zweit oder dritt für maximale Effizienz." },
  { question: "Wird auch ausgepackt?", answer: "Ja, viele Firmen bieten Ein- und Auspack-Service an. So sind Sie am neuen Ort sofort eingerichtet, ohne selbst auspacken zu müssen." },
];

const regions = ["Zürich", "Bern", "Basel", "Luzern", "Aargau", "St. Gallen", "Zug"];

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

export default function PackserviceServicePage() {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(11);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [location, setLocation] = useState("");
  const [apartmentSize, setApartmentSize] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICE_SLUG);

  useEffect(() => {
    const interval = setInterval(() => setLiveViewers(prev => Math.max(7, Math.min(22, prev + Math.floor(Math.random() * 5) - 2))), 3800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      { "@type": "Service", "name": SERVICE_NAME, "description": `Professioneller ${SERVICE_NAME} in der Schweiz. Einpacken, Material, Fragiles.`, "provider": { "@type": "Organization", "name": "Umzugscheck.ch" }, "areaServed": { "@type": "Country", "name": "Schweiz" }, "priceRange": "CHF 200 - CHF 2000" },
      { "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>{SERVICE_NAME} Schweiz | Professionell Ein- & Auspacken | Bis 40% sparen</title>
        <meta name="description" content={`Professioneller ${SERVICE_NAME} in der Schweiz ✓ Material inklusive ✓ Fragiles-Spezialist ✓ Festpreise ✓ Kostenlose Offerten!`} />
        <link rel="canonical" href={`https://umzugscheck.ch/services/${SERVICE_SLUG}`} />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <Header />

      <main>
        {/* HERO */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_BG})` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-primary/40" />
          </div>

          <div className="container relative z-10 px-4 py-12 md:py-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                <Select value={selectedService} onValueChange={handleServiceChange}>
                  <SelectTrigger className="w-[160px] bg-white/10 border-white/20 text-white text-sm mb-4">
                    <Package className="w-4 h-4 mr-1" /><SelectValue />
                  </SelectTrigger>
                  <SelectContent>{relatedServices.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6">
                  <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative rounded-full h-2.5 w-2.5 bg-green-500"></span></span>
                  <span className="font-bold">{liveViewers}</span> Personen vergleichen gerade
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  {SERVICE_NAME} – <br className="hidden md:block" /><span className="text-secondary">stressfrei packen lassen</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  <strong>Profis packen für Sie</strong> – Material inklusive.
                  <span className="text-green-400 font-semibold"> Fragiles sicher verpackt.</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left"><div className="text-2xl font-bold text-white"><AnimatedCounter end={579} suffix="+" /></div><div className="text-xs text-white/60">Bewertungen</div></div>
                  <div className="text-center lg:text-left"><div className="text-2xl font-bold text-white"><AnimatedCounter end={85} suffix="+" /></div><div className="text-xs text-white/60">Pack-Teams</div></div>
                  <div className="text-2xl font-bold text-amber-400 flex items-center gap-1"><Star className="w-6 h-6 fill-amber-400" />4.8</div>
                </div>

                <div className="lg:hidden space-y-3">
                  <Button asChild size="lg" className="w-full bg-secondary hover:bg-secondary/90 font-bold text-lg py-6">
                    <Link to="/umzugsofferten">Jetzt Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
                <Card className="bg-white/[0.98] backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold mb-2">Packservice anfragen</h2>
                      <p className="text-sm text-muted-foreground">Material inklusive, Festpreise</p>
                    </div>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <Label>Ort</Label>
                        <div className="relative mt-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="PLZ oder Ort" className="pl-10" required />
                        </div>
                      </div>
                      <div>
                        <Label>Wohnungsgrösse</Label>
                        <Select value={apartmentSize} onValueChange={setApartmentSize}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder="Wählen..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 Zimmer</SelectItem>
                            <SelectItem value="2.5-3">2.5-3 Zimmer</SelectItem>
                            <SelectItem value="3.5-4">3.5-4 Zimmer</SelectItem>
                            <SelectItem value="4.5-5">4.5-5 Zimmer</SelectItem>
                            <SelectItem value="5+">5+ Zimmer / Haus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Wunschtermin</Label>
                        <Input type="date" value={moveDate} onChange={e => setMoveDate(e.target.value)} className="mt-1" />
                      </div>
                      <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90 font-bold text-lg py-6">
                        Kostenlos Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5"><Lock className="w-3.5 h-3.5" />Ihre Daten sind sicher</p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-8 bg-muted/30 border-y">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div><div className="text-2xl font-bold text-primary">8'000+</div><div className="text-sm text-muted-foreground">Wohnungen gepackt</div></div>
              <div><div className="text-2xl font-bold text-primary">0</div><div className="text-sm text-muted-foreground">Bruchschäden</div></div>
              <div><div className="text-2xl font-bold text-primary">4.8/5</div><div className="text-sm text-muted-foreground">Bewertung</div></div>
              <div><div className="text-2xl font-bold text-primary">100%</div><div className="text-sm text-muted-foreground">Material inkl.</div></div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Kundenstimmen</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <Card key={i} className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-3">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                    <p className="text-muted-foreground mb-4">"{t.text}"</p>
                    <div className="flex items-center justify-between">
                      <div><p className="font-medium">{t.name}</p><p className="text-sm text-muted-foreground">{t.location}</p></div>
                      {t.verified && <Badge variant="secondary"><Check className="w-3 h-3 mr-1" />Verifiziert</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PRICES */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Preisbeispiele Packservice</h2>
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

        {/* HOW IT WORKS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">So funktioniert's</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><step.icon className="w-8 h-8 text-primary" /></div>
                  <div className="text-sm text-primary font-medium mb-2">Schritt {step.step}</div>
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

        {/* FAQ */}
        <section className="py-16 bg-background">
          <div className="container px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Häufige Fragen</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-muted/30 rounded-lg border px-6">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Lassen Sie packen statt selbst zu packen</h2>
            <p className="text-lg mb-8 opacity-90">Professioneller Packservice – Material inklusive, Festpreise</p>
            <Button asChild size="lg" variant="secondary" className="font-bold text-lg px-8 py-6">
              <Link to="/umzugsofferten">Jetzt Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <SimplifiedFooter />

      {showStickyBar && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t z-50 lg:hidden">
          <Button asChild size="lg" className="w-full bg-secondary hover:bg-secondary/90 font-bold">
            <Link to="/umzugsofferten">Jetzt Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
