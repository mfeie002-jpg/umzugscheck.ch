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
  ClipboardList, ShieldCheck, CircleDollarSign, BadgeCheck, ThumbsUp, ArrowUpDown, Home, Building2
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2000&q=80";
const SERVICE_NAME = "Möbellift";
const SERVICE_SLUG = "moebellift";

const relatedServices = [
  { value: "moebellift", label: "Möbellift", href: "/services/moebellift" },
  { value: "privatumzug", label: "Privatumzug", href: "/services/privatumzug" },
  { value: "montage", label: "Möbelmontage", href: "/services/montage" },
  { value: "entsorgung", label: "Entsorgung", href: "/services/entsorgung" },
  { value: "lagerung", label: "Lagerung", href: "/services/lagerung" },
];

const companies = [
  { id: "lift-profi", name: "Lift Profi AG", rating: 4.9, reviewCount: 189, badges: ["24/7 Verfügbar", "Express"], priceLevel: "Mittel", isPopular: true, responseTime: "< 2h" },
  { id: "swiss-lift", name: "Swiss Lift Service", rating: 4.8, reviewCount: 145, badges: ["Preis-Sieger"], priceLevel: "Günstig", isBestPrice: true, responseTime: "< 1h" },
  { id: "premium-lift", name: "Premium Lift", rating: 4.9, reviewCount: 98, badges: ["Spezialtransporte"], priceLevel: "Premium", isPremium: true, responseTime: "< 4h" },
];

const priceExamples = [
  { size: "Halbtag", price: "CHF 400 – 600", subtext: "bis 4 Stunden", icon: Clock, savings: "bis CHF 200" },
  { size: "Ganztag", price: "CHF 700 – 1'000", subtext: "bis 8 Stunden", icon: ArrowUpDown, savings: "bis CHF 400" },
  { size: "Mit Umzug", price: "CHF 200 – 350", subtext: "Zusatz zum Umzug", icon: Home, savings: "bis CHF 140" },
  { size: "Einzelstück", price: "CHF 150 – 300", subtext: "Klavier, Tresor etc.", icon: Building2, savings: "bis CHF 120" },
];

const howItWorks = [
  { step: 1, title: "Anfrage stellen", description: "Stockwerk & Objekte angeben", icon: ClipboardList, time: "30 Sek." },
  { step: 2, title: "Offerten erhalten", description: "Transparente Festpreise", icon: FileText, time: "24h" },
  { step: 3, title: "Lift buchen", description: "Professionelle Durchführung", icon: CheckCircle, time: "Ihr Termin" },
];

const testimonials = [
  { name: "Hans M.", location: "Zürich", rating: 5, text: "Unser Flügel wurde sicher in den 5. Stock transportiert. Ohne den Möbellift undenkbar!", date: "vor 5 Tagen", verified: true, savedAmount: 300 },
  { name: "Petra K.", location: "Bern", rating: 5, text: "Grosses Ecksofa passte nicht ins Treppenhaus. Lift-Team war super professionell!", date: "vor 1 Woche", verified: true, savedAmount: 250 },
  { name: "Thomas R.", location: "Basel", rating: 5, text: "Schnell, sauber, professionell. Der Aufpreis für den Lift hat sich absolut gelohnt.", date: "vor 2 Wochen", verified: true, savedAmount: 180 },
];

const guarantees = [
  { title: "Bis 35m Höhe", description: "Auch für Hochhäuser geeignet", icon: ArrowUpDown },
  { title: "Bis 400kg", description: "Für schwere Möbelstücke", icon: ShieldCheck },
  { title: "Festpreise", description: "Keine versteckten Kosten", icon: CircleDollarSign },
  { title: "Vollversichert", description: "Rundum-Schutz für Ihre Möbel", icon: BadgeCheck },
];

const faqs = [
  { question: "Was kostet ein Möbellift?", answer: "Halbtag (4h) ab CHF 400, Ganztag ab CHF 700. Als Zusatz zum Umzug günstiger (CHF 200-350). Einzelstücke ab CHF 150." },
  { question: "Bis zu welcher Höhe funktioniert der Lift?", answer: "Moderne Möbellifte erreichen bis zu 35 Meter Höhe (ca. 10-12 Stockwerke). Für höhere Gebäude gibt es Speziallösungen." },
  { question: "Welche Möbel können transportiert werden?", answer: "Praktisch alle: Sofas, Schränke, Klaviere, Tresore, Betten. Maximale Last je nach Lift 300-500kg." },
  { question: "Brauche ich eine Bewilligung?", answer: "In den meisten Fällen ja. Die Umzugsfirma kümmert sich um die nötigen Bewilligungen und Absperrungen." },
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

export default function MoebelliftServicePage() {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(8);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [location, setLocation] = useState("");
  const [floor, setFloor] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICE_SLUG);

  useEffect(() => {
    const interval = setInterval(() => setLiveViewers(prev => Math.max(5, Math.min(18, prev + Math.floor(Math.random() * 5) - 2))), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("uc_prefill", JSON.stringify({ location, floor, date: moveDate, service: SERVICE_SLUG, source: `${SERVICE_SLUG}-landing`, timestamp: Date.now() }));
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
      { "@type": "Service", "name": SERVICE_NAME, "description": `Professioneller ${SERVICE_NAME} Service in der Schweiz. Für schwere Möbel und hohe Stockwerke.`, "provider": { "@type": "Organization", "name": "Umzugscheck.ch" }, "areaServed": { "@type": "Country", "name": "Schweiz" }, "priceRange": "CHF 150 - CHF 1000" },
      { "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>{SERVICE_NAME} mieten Schweiz | Aussenlift für Umzug | Bis 40% sparen</title>
        <meta name="description" content={`${SERVICE_NAME} mieten in der Schweiz ✓ Bis 35m Höhe ✓ Für schwere Möbel ✓ Festpreise ✓ Kostenlose Offerten!`} />
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
                    <ArrowUpDown className="w-4 h-4 mr-1" /><SelectValue />
                  </SelectTrigger>
                  <SelectContent>{relatedServices.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6">
                  <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative rounded-full h-2.5 w-2.5 bg-green-500"></span></span>
                  <span className="font-bold">{liveViewers}</span> Personen vergleichen gerade
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  {SERVICE_NAME} – <br className="hidden md:block" /><span className="text-secondary">für schwere Fälle</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  <strong>Klaviere, Sofas, Tresore</strong> – sicher in jedes Stockwerk.
                  <span className="text-green-400 font-semibold"> Bis 35m Höhe, bis 400kg.</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left"><div className="text-2xl font-bold text-white"><AnimatedCounter end={432} suffix="+" /></div><div className="text-xs text-white/60">Bewertungen</div></div>
                  <div className="text-center lg:text-left"><div className="text-2xl font-bold text-white"><AnimatedCounter end={45} suffix="+" /></div><div className="text-xs text-white/60">Lift-Fahrzeuge</div></div>
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
                      <h2 className="text-xl font-bold mb-2">Möbellift anfragen</h2>
                      <p className="text-sm text-muted-foreground">Festpreise für Ihren Einsatz</p>
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
                        <Label>Stockwerk</Label>
                        <Select value={floor} onValueChange={setFloor}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder="Wählen..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-3">1.-3. Stock</SelectItem>
                            <SelectItem value="4-6">4.-6. Stock</SelectItem>
                            <SelectItem value="7-10">7.-10. Stock</SelectItem>
                            <SelectItem value="10+">10+ Stock</SelectItem>
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
              <div><div className="text-2xl font-bold text-primary">3'500+</div><div className="text-sm text-muted-foreground">Lift-Einsätze</div></div>
              <div><div className="text-2xl font-bold text-primary">35m</div><div className="text-sm text-muted-foreground">Max. Höhe</div></div>
              <div><div className="text-2xl font-bold text-primary">400kg</div><div className="text-sm text-muted-foreground">Max. Last</div></div>
              <div><div className="text-2xl font-bold text-primary">100%</div><div className="text-sm text-muted-foreground">Versichert</div></div>
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
            <h2 className="text-3xl font-bold text-center mb-12">Preisbeispiele Möbellift</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Möbellift für Ihren Umzug</h2>
            <p className="text-lg mb-8 opacity-90">Schwere Möbel sicher transportiert – Festpreise ohne Überraschungen</p>
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
