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
  ClipboardList, ShieldCheck, CircleDollarSign, BadgeCheck, Globe, Plane, Ship, Truck
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80";
const SERVICE_NAME = "Internationaler Umzug";
const SERVICE_SLUG = "international";

const relatedServices = [
  { value: "international", label: "International", href: "/services/international" },
  { value: "privatumzug", label: "Privatumzug", href: "/services/privatumzug" },
  { value: "firmenumzug", label: "Firmenumzug", href: "/services/firmenumzug" },
  { value: "lagerung", label: "Lagerung", href: "/services/lagerung" },
  { value: "packservice", label: "Packservice", href: "/services/packservice" },
];

const companies = [
  { id: "global-move", name: "Global Move AG", rating: 4.9, reviewCount: 312, badges: ["EU-Spezialist", "Zoll-Service"], priceLevel: "Mittel", isPopular: true, responseTime: "< 2h" },
  { id: "swiss-international", name: "Swiss International", rating: 4.8, reviewCount: 245, badges: ["Übersee", "Container"], priceLevel: "Premium", isBestPrice: false, responseTime: "< 4h" },
  { id: "euro-relocation", name: "Euro Relocation", rating: 4.9, reviewCount: 189, badges: ["All-Inclusive", "Tracking"], priceLevel: "Premium", isPremium: true, responseTime: "< 4h" },
];

const priceExamples = [
  { size: "Nachbarländer", price: "CHF 2'000 – 5'000", subtext: "DE, FR, AT, IT", icon: Truck, savings: "bis CHF 2'000" },
  { size: "Europa", price: "CHF 4'000 – 10'000", subtext: "EU-weit", icon: Truck, savings: "bis CHF 4'000" },
  { size: "Übersee Container", price: "CHF 8'000 – 20'000", subtext: "USA, Asien etc.", icon: Ship, savings: "bis CHF 8'000" },
  { size: "Luftfracht", price: "ab CHF 5'000", subtext: "Express weltweit", icon: Plane, savings: "individuell" },
];

const howItWorks = [
  { step: 1, title: "Bedarfsanalyse", description: "Zielland, Umfang & Zeitplan", icon: ClipboardList, time: "5 Min." },
  { step: 2, title: "Offerten erhalten", description: "Spezialisierte Angebote vergleichen", icon: FileText, time: "48h" },
  { step: 3, title: "Umzug durchführen", description: "Inkl. Zollformalitäten", icon: CheckCircle, time: "Nach Plan" },
];

const testimonials = [
  { name: "Familie Weber", location: "Zürich → München", rating: 5, text: "Perfekt organisierter Umzug nach Deutschland. Zollformalitäten wurden komplett übernommen.", date: "vor 2 Wochen", verified: true, savedAmount: 1800 },
  { name: "Michael S.", location: "Basel → London", rating: 5, text: "Trotz Brexit alles reibungslos. Das Team kannte alle Vorschriften.", date: "vor 1 Monat", verified: true, savedAmount: 2500 },
  { name: "Sarah K.", location: "Bern → New York", rating: 5, text: "Container-Umzug in die USA perfekt abgewickelt. Tracking war super!", date: "vor 3 Wochen", verified: true, savedAmount: 4000 },
];

const guarantees = [
  { title: "Zoll-Service", description: "Wir erledigen alle Formalitäten", icon: FileText },
  { title: "Vollversicherung", description: "Internationaler Schutz", icon: ShieldCheck },
  { title: "Door-to-Door", description: "Komplettservice ohne Stress", icon: Globe },
  { title: "Tracking", description: "Ihre Sendung immer im Blick", icon: BadgeCheck },
];

const faqs = [
  { question: "Was kostet ein internationaler Umzug?", answer: "Nachbarländer ab CHF 2'000, EU-weit CHF 4'000-10'000, Übersee CHF 8'000-20'000+. Faktoren: Distanz, Volumen, Transportart (LKW, Container, Luftfracht)." },
  { question: "Welche Dokumente brauche ich?", answer: "Je nach Zielland: Inventarliste, Zolldokumente, Aufenthaltsgenehmigung, Carnet TIR. Wir beraten Sie kostenlos zu den Anforderungen Ihres Ziellandes." },
  { question: "Wie lange dauert ein internationaler Umzug?", answer: "Nachbarländer 1-3 Tage, Europa 3-7 Tage, Übersee per Schiff 4-8 Wochen, Luftfracht 5-10 Tage. Planung sollte 2-3 Monate im Voraus beginnen." },
  { question: "Wie werden meine Möbel versichert?", answer: "Alle Partner bieten internationale Transportversicherung. Wir empfehlen Allgefahrenversicherung für Übersee-Transporte. Selbstbeteiligung und Deckungssumme variieren." },
];

const destinations = ["Deutschland", "Frankreich", "Österreich", "Italien", "UK", "USA", "Spanien", "Portugal"];

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

export default function InternationalServicePage() {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(9);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICE_SLUG);

  useEffect(() => {
    const interval = setInterval(() => setLiveViewers(prev => Math.max(5, Math.min(20, prev + Math.floor(Math.random() * 5) - 2))), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("uc_prefill", JSON.stringify({ location: fromLocation, destination: toCountry, date: moveDate, service: SERVICE_SLUG, source: `${SERVICE_SLUG}-landing`, timestamp: Date.now() }));
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
      { "@type": "Service", "name": SERVICE_NAME, "description": `${SERVICE_NAME} aus der Schweiz. Europa, Übersee, Zollformalitäten inklusive.`, "provider": { "@type": "Organization", "name": "Umzugscheck.ch" }, "areaServed": { "@type": "Place", "name": "Weltweit" }, "priceRange": "CHF 2000 - CHF 50000" },
      { "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>{SERVICE_NAME} Schweiz | Europa & Übersee | Zoll inklusive</title>
        <meta name="description" content={`${SERVICE_NAME} aus der Schweiz ✓ Europa & Übersee ✓ Zollformalitäten inklusive ✓ Vollversichert ✓ Kostenlose Offerten!`} />
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
                    <Globe className="w-4 h-4 mr-1" /><SelectValue />
                  </SelectTrigger>
                  <SelectContent>{relatedServices.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6">
                  <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative rounded-full h-2.5 w-2.5 bg-green-500"></span></span>
                  <span className="font-bold">{liveViewers}</span> planen gerade einen Auslandsumzug
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  {SERVICE_NAME} – <br className="hidden md:block" /><span className="text-secondary">weltweit sorglos</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  <strong>Europa, USA, Asien</strong> – Zollformalitäten inklusive.
                  <span className="text-green-400 font-semibold"> Vollversichert & door-to-door.</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left"><div className="text-2xl font-bold text-white"><AnimatedCounter end={746} suffix="+" /></div><div className="text-xs text-white/60">Auslandsumzüge</div></div>
                  <div className="text-center lg:text-left"><div className="text-2xl font-bold text-white"><AnimatedCounter end={85} suffix="+" /></div><div className="text-xs text-white/60">Länder</div></div>
                  <div className="text-2xl font-bold text-amber-400 flex items-center gap-1"><Star className="w-6 h-6 fill-amber-400" />4.9</div>
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
                      <h2 className="text-xl font-bold mb-2">Kostenlose Beratung</h2>
                      <p className="text-sm text-muted-foreground">Offerten für Ihren Auslandsumzug</p>
                    </div>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <Label>Von (Schweiz)</Label>
                        <div className="relative mt-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input value={fromLocation} onChange={e => setFromLocation(e.target.value)} placeholder="PLZ oder Ort" className="pl-10" required />
                        </div>
                      </div>
                      <div>
                        <Label>Nach (Land)</Label>
                        <Select value={toCountry} onValueChange={setToCountry}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder="Zielland..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="deutschland">Deutschland</SelectItem>
                            <SelectItem value="frankreich">Frankreich</SelectItem>
                            <SelectItem value="oesterreich">Österreich</SelectItem>
                            <SelectItem value="italien">Italien</SelectItem>
                            <SelectItem value="uk">Grossbritannien</SelectItem>
                            <SelectItem value="usa">USA</SelectItem>
                            <SelectItem value="andere">Anderes Land</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Gewünschter Zeitraum</Label>
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
              <div><div className="text-2xl font-bold text-primary">1'200+</div><div className="text-sm text-muted-foreground">Auslandsumzüge/Jahr</div></div>
              <div><div className="text-2xl font-bold text-primary">85+</div><div className="text-sm text-muted-foreground">Zielländer</div></div>
              <div><div className="text-2xl font-bold text-primary">100%</div><div className="text-sm text-muted-foreground">Zoll inkl.</div></div>
              <div><div className="text-2xl font-bold text-primary">Door-to-Door</div><div className="text-sm text-muted-foreground">Service</div></div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Erfolgreiche Auslandsumzüge</h2>
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
                    {t.savedAmount && <div className="mt-3 pt-3 border-t"><p className="text-sm text-green-600 font-medium">Ersparnis: CHF {t.savedAmount.toLocaleString()}</p></div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PRICES */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Preisbeispiele International</h2>
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

        {/* DESTINATIONS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Beliebte Zielländer</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {destinations.map(d => (
                <Badge key={d} variant="outline" className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors">
                  <Globe className="w-3 h-3 mr-1" />{d}
                </Badge>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Planen Sie Ihren Auslandsumzug</h2>
            <p className="text-lg mb-8 opacity-90">Kostenlose Beratung & Offerten von Spezialisten</p>
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
