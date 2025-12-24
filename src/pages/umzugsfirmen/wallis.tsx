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
import { Star, ArrowRight, Home, Building2, TrendingDown } from "lucide-react";

const CANTON_NAME = "Wallis";
const CANTON_SLUG = "wallis";
const HERO_BG = "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2000&q=80";

const companies = [
  { id: "walliser-umzuege", name: "Walliser Umzüge AG", rating: 4.9, reviewCount: 145, isPopular: true },
  { id: "sion-transporte", name: "Sion Transporte", rating: 4.7, reviewCount: 112, isBestPrice: true },
  { id: "zermatt-moving", name: "Zermatt Moving", rating: 4.8, reviewCount: 87, isPremium: true },
];

const priceExamples = [
  { size: "1.5 - 2.5 Zimmer", price: "CHF 520 – 900", icon: Home, savings: "bis CHF 360" },
  { size: "3.5 - 4.5 Zimmer", price: "CHF 800 – 1'280", icon: Building2, savings: "bis CHF 510" },
  { size: "5+ Zimmer", price: "ab CHF 1'450", icon: Home, savings: "bis CHF 580" },
];

const faqs = [
  { question: "Was kostet ein Umzug im Wallis?", answer: "Ein 2-Zimmer-Umzug kostet ca. CHF 520-900, ein 4-Zimmer-Umzug ca. CHF 800-1'280." },
  { question: "Bieten Firmen zweisprachigen Service?", answer: "Ja! Im Wallis sprechen viele Firmen Deutsch und Französisch." },
];

const AnimatedCounter = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => { if (!isInView) return; let startTime: number; const animate = (t: number) => { if (!startTime) startTime = t; const p = Math.min((t - startTime) / 2000, 1); setCount(Math.floor(p * end)); if (p < 1) requestAnimationFrame(animate); }; requestAnimationFrame(animate); }, [isInView, end]);
  return <span ref={ref}>{count.toLocaleString('de-CH')}{suffix}</span>;
};

export default function WallisLandingPage() {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(12);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [apartmentSize, setApartmentSize] = useState("");

  useEffect(() => { const i = setInterval(() => setLiveViewers(p => Math.max(7, Math.min(22, p + Math.floor(Math.random() * 7) - 3))), 3500); return () => clearInterval(i); }, []);
  useEffect(() => { const h = () => setShowStickyBar(window.scrollY > 700); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  const handleFormSubmit = (e: React.FormEvent) => { e.preventDefault(); localStorage.setItem("uc_prefill", JSON.stringify({ from: fromLocation, to: toLocation, size: apartmentSize, source: `${CANTON_SLUG}-landing`, timestamp: Date.now() })); navigate("/umzugsofferten"); };

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Umzug {CANTON_NAME} – Gratis Umzugsfirma finden | Bis 40% sparen</title><meta name="description" content={`Vergleiche 18+ geprüfte Umzugsfirmen im Kanton ${CANTON_NAME} ✓ Sion, Brig, Zermatt ✓ Bis zu 40% sparen!`} /><link rel="canonical" href={`https://umzugscheck.ch/umzugsfirmen/${CANTON_SLUG}`} /></Helmet>
      <Header />
      <main>
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_BG})` }}><div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-primary/40" /></div>
          <div className="container relative z-10 px-4 py-12"><div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6"><span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative rounded-full h-2.5 w-2.5 bg-green-500"></span></span><span className="font-bold">{liveViewers}</span> Personen vergleichen gerade</motion.div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5">Umzug {CANTON_NAME} – <br className="hidden md:block" /><span className="text-secondary">Jetzt gratis vergleichen</span></h1>
              <p className="text-lg text-white/85 mb-6">Vergleichen Sie <strong>18+ geprüfte Umzugsfirmen</strong> in Sion, Brig & Zermatt.<span className="text-green-400 font-semibold"> Bis zu 40% sparen.</span></p>
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0"><div><div className="text-2xl font-bold text-white"><AnimatedCounter end={1123} suffix="+" /></div><div className="text-xs text-white/60">Bewertungen</div></div><div><div className="text-2xl font-bold text-white"><AnimatedCounter end={18} suffix="+" /></div><div className="text-xs text-white/60">Firmen</div></div><div className="text-2xl font-bold text-amber-400 flex items-center gap-1"><Star className="w-6 h-6 fill-amber-400" />4.8</div></div>
              <div className="lg:hidden"><Button asChild size="lg" className="w-full bg-secondary font-bold text-lg py-6"><Link to="/umzugsofferten">Jetzt Offerten anfordern<ArrowRight className="ml-2 w-5 h-5" /></Link></Button></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
              <Card className="bg-white/[0.98] backdrop-blur-xl border-0 shadow-2xl rounded-2xl"><CardContent className="p-8">
                <h2 className="text-xl font-bold mb-6 text-center">Jetzt gratis vergleichen</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div><Label>Umzug von</Label><Input placeholder="8001 oder Zürich" value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} className="mt-1.5 h-12" /></div>
                  <div><Label>Umzug nach</Label><Input placeholder="8001 oder Zürich" value={toLocation} onChange={(e) => setToLocation(e.target.value)} className="mt-1.5 h-12" /></div>
                  <div><Label>Wohnungsgrösse</Label><Select value={apartmentSize} onValueChange={setApartmentSize}><SelectTrigger className="mt-1.5 h-12"><SelectValue placeholder="Bitte wählen..." /></SelectTrigger><SelectContent><SelectItem value="1-2">1-2 Zimmer</SelectItem><SelectItem value="3-4">3-4 Zimmer</SelectItem><SelectItem value="5+">5+ Zimmer</SelectItem></SelectContent></Select></div>
                  <Button type="submit" size="lg" className="w-full bg-secondary font-bold text-lg py-6">Kostenlos Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Button>
                </form>
              </CardContent></Card>
            </motion.div>
          </div></div>
        </section>
        <section className="py-6 bg-muted/50 border-y"><div className="container px-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"><div><div className="text-2xl font-bold text-primary">18+</div><div className="text-xs text-muted-foreground">Geprüfte Firmen</div></div><div><div className="text-2xl font-bold text-primary">1'100+</div><div className="text-xs text-muted-foreground">Bewertungen</div></div><div><div className="text-2xl font-bold text-primary">4.8★</div><div className="text-xs text-muted-foreground">Durchschnitt</div></div><div><div className="text-2xl font-bold text-green-600">40%</div><div className="text-xs text-muted-foreground">Ersparnis</div></div></div></div></section>
        <section className="py-12 bg-muted/30"><div className="container px-4"><div className="text-center mb-10"><Badge variant="secondary" className="mb-3">Top Firmen</Badge><h2 className="text-2xl font-bold">Beste Umzugsfirmen im {CANTON_NAME}</h2></div><div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">{companies.map((c) => (<Card key={c.id}><CardContent className="p-6"><div className="flex justify-between mb-4"><div><h3 className="font-bold">{c.name}</h3><div className="flex items-center gap-1 mt-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span>{c.rating}</span><span className="text-muted-foreground text-sm">({c.reviewCount})</span></div></div>{c.isPopular && <Badge className="bg-primary">Beliebt</Badge>}{c.isBestPrice && <Badge className="bg-green-600">Preis-Tipp</Badge>}</div></CardContent></Card>))}</div></div></section>
        <section className="py-12"><div className="container px-4"><div className="text-center mb-10"><Badge variant="secondary" className="mb-3">Preise</Badge><h2 className="text-2xl font-bold">Umzugskosten im {CANTON_NAME}</h2></div><div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">{priceExamples.map((p, i) => (<Card key={i} className="text-center"><CardContent className="p-6"><p.icon className="w-10 h-10 mx-auto mb-4 text-primary" /><h3 className="font-bold mb-1">{p.size}</h3><p className="text-2xl font-bold text-primary mb-2">{p.price}</p><Badge variant="outline" className="bg-green-50 text-green-700"><TrendingDown className="w-3 h-3 mr-1" />{p.savings}</Badge></CardContent></Card>))}</div></div></section>
        <section className="py-12 bg-muted/30"><div className="container px-4"><div className="text-center mb-10"><Badge variant="secondary" className="mb-3">FAQ</Badge><h2 className="text-2xl font-bold">Häufige Fragen</h2></div><div className="max-w-3xl mx-auto"><Accordion type="single" collapsible className="space-y-2">{faqs.map((f, i) => (<AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-lg border px-4"><AccordionTrigger className="text-left font-medium">{f.question}</AccordionTrigger><AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent></AccordionItem>))}</Accordion></div></div></section>
        <section className="py-12"><div className="container px-4"><div className="max-w-3xl mx-auto"><h2 className="text-2xl font-bold mb-6">Umzugsfirmen im Kanton {CANTON_NAME}</h2><p className="text-muted-foreground mb-6">Das Wallis ist der drittgrösste Kanton der Schweiz und bekannt für seine Berglandschaft. Hauptort ist Sion.</p><div className="mt-6 flex flex-wrap gap-2"><Link to="/umzugsfirmen/fribourg"><Badge variant="outline">Fribourg</Badge></Link><Link to="/umzugsfirmen/bern"><Badge variant="outline">Bern</Badge></Link><Link to="/umzugsfirmen/tessin"><Badge variant="outline">Tessin</Badge></Link></div></div></div></section>
        <section className="py-16 bg-gradient-to-br from-primary to-primary/80 text-white"><div className="container px-4 text-center"><h2 className="text-3xl font-bold mb-4">Bereit für Ihren Umzug im {CANTON_NAME}?</h2><Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6"><Link to="/umzugsofferten">Kostenlos Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link></Button></div></section>
      </main>
      <SimplifiedFooter />
      {showStickyBar && (<motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg p-3 lg:hidden"><Button asChild size="lg" className="w-full bg-secondary font-bold"><Link to="/umzugsofferten">Kostenlos Offerten erhalten</Link></Button></motion.div>)}
    </div>
  );
}