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
  ClipboardList, ShieldCheck, BadgeCheck, ThumbsUp, Globe, Plane, Heart, Sparkles, 
  Package, Truck, Ship, Building2
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=2000&q=80";
const SERVICE_NAME = "Auslandsumzug";
const SERVICE_SLUG = "auslandsumzug";

const relatedServices = [
  { value: "auslandsumzug", label: "Auslandsumzug", href: "/services/auslandsumzug" },
  { value: "international", label: "International", href: "/services/international" },
  { value: "privatumzug", label: "Privatumzug", href: "/services/privatumzug" },
  { value: "lagerung", label: "Lagerung", href: "/services/lagerung" },
];

const destinations = [
  { country: "Deutschland", flag: "🇩🇪", priceRange: "CHF 2'500 – 6'000", popular: true },
  { country: "Frankreich", flag: "🇫🇷", priceRange: "CHF 3'000 – 7'000", popular: true },
  { country: "Österreich", flag: "🇦🇹", priceRange: "CHF 2'000 – 5'000", popular: true },
  { country: "Italien", flag: "🇮🇹", priceRange: "CHF 3'000 – 7'000", popular: false },
  { country: "UK", flag: "🇬🇧", priceRange: "CHF 4'000 – 10'000", popular: true },
  { country: "USA", flag: "🇺🇸", priceRange: "CHF 8'000 – 20'000", popular: true },
  { country: "Spanien", flag: "🇪🇸", priceRange: "CHF 4'000 – 9'000", popular: false },
  { country: "Weltweit", flag: "🌍", priceRange: "Auf Anfrage", popular: false },
];

const companies = [
  { 
    id: "swiss-global", 
    name: "Swiss Global Relocations", 
    rating: 4.9, 
    reviewCount: 412, 
    badges: ["FIDI-zertifiziert", "Weltweit"], 
    priceLevel: "Premium", 
    isPopular: true,
    quote: "Wir begleiten Sie ans andere Ende der Welt – und zurück."
  },
  { 
    id: "euro-move", 
    name: "EuroMove Express", 
    rating: 4.8, 
    reviewCount: 356, 
    badges: ["EU-Spezialist", "Wöchentliche Touren"], 
    priceLevel: "Mittel", 
    isBestPrice: true,
    quote: "Europa ist unser Zuhause – und bald auch Ihres."
  },
  { 
    id: "intercontinental", 
    name: "Intercontinental Movers", 
    rating: 4.9, 
    reviewCount: 287, 
    badges: ["Übersee", "Containerservice"], 
    priceLevel: "Premium",
    quote: "Von Zürich in die Welt – sicher und zuverlässig."
  },
];

const howItWorks = [
  { step: 1, title: "Zielland angeben", description: "Wohin geht die Reise?", icon: Globe, time: "2 Min.", emoji: "🌍" },
  { step: 2, title: "Inventar erfassen", description: "Was kommt mit?", icon: Package, time: "5 Min.", emoji: "📦" },
  { step: 3, title: "Offerten vergleichen", description: "3-5 spezialisierte Angebote", icon: FileText, time: "24-48h", emoji: "📬" },
  { step: 4, title: "Entspannt ankommen", description: "Wir kümmern uns um alles", icon: Heart, time: "Ihr Tag", emoji: "🏠" },
];

const testimonials = [
  { 
    name: "Familie Keller", 
    route: "Zürich → München", 
    rating: 5, 
    text: "Der Umzug nach Deutschland war ein Kinderspiel! Zollformalitäten, Transport, alles wurde für uns erledigt. Nach 2 Tagen standen wir in unserer neuen Wohnung – alles da, nichts beschädigt.", 
    verified: true, 
    savedAmount: 2100,
    emotion: "Erleichtert 😌"
  },
  { 
    name: "Dr. M. Schmid", 
    route: "Basel → London", 
    rating: 5, 
    text: "Brexit-Zoll? Kein Problem! Das Team kannte jeden Trick. Mein komplettes Büro und Haushalt kam pünktlich an. Die Investition hat sich gelohnt – kein Stress.", 
    verified: true, 
    savedAmount: 3500,
    emotion: "Begeistert 🎉"
  },
  { 
    name: "Thomas & Sarah", 
    route: "Genf → New York", 
    rating: 5, 
    text: "Ein Umzug über den Atlantik klingt beängstigend. Aber mit den Profis war es wie ein langer Urlaub. Container kam pünktlich, alles intakt. Danke für diesen Service!", 
    verified: true, 
    savedAmount: 5200,
    emotion: "Überwältigt 🥹"
  },
];

const services = [
  { title: "Zollformalitäten", icon: FileText, description: "Wir erledigen alle Papiere für Sie" },
  { title: "Verpackungsservice", icon: Package, description: "Professionelles Ein- & Auspacken" },
  { title: "Containertransport", icon: Ship, description: "See- oder Luftfracht weltweit" },
  { title: "Versicherung", icon: Shield, description: "Vollversicherung für Ihre Güter" },
  { title: "Einlagerung", icon: Building2, description: "Zwischenlagerung bei Bedarf" },
  { title: "Haustier-Umzug", icon: Heart, description: "Auch Ihre Lieblinge kommen mit" },
];

const guarantees = [
  { title: "Rundum-Sorglos", description: "Alles aus einer Hand – von A bis Z", icon: ShieldCheck },
  { title: "Zollexperten", description: "EU, UK, USA – wir kennen die Regeln", icon: BadgeCheck },
  { title: "Tracking", description: "Verfolgen Sie Ihren Umzug live", icon: Globe },
  { title: "Versichert", description: "Vollversicherung für alle Güter", icon: Shield },
];

const faqs = [
  { 
    question: "Was kostet ein Auslandsumzug?", 
    answer: "Richtpreise: Deutschland ab CHF 2'500, Frankreich/Österreich ab CHF 2'000-3'000, UK ab CHF 4'000, USA ab CHF 8'000. Faktoren: Volumen, Distanz, Zielland, gewählte Services (Verpackung, Zoll, etc.)." 
  },
  { 
    question: "Wie lange dauert ein internationaler Umzug?", 
    answer: "Innerhalb Europas: 2-7 Tage. Übersee per Seefracht: 4-8 Wochen. Per Luftfracht: 1-2 Wochen. Die Dauer hängt von Distanz, Zollprozessen und gewähltem Transportweg ab." 
  },
  { 
    question: "Wer kümmert sich um die Zollformalitäten?", 
    answer: "Unsere Partner übernehmen alle Zollformalitäten für Sie – Ausfuhrdeklaration in der Schweiz, Einfuhrpapiere im Zielland, eventuelle Sondergenehmigungen. Sie müssen nur unterschreiben." 
  },
  { 
    question: "Ist mein Umzugsgut versichert?", 
    answer: "Ja, alle internationalen Umzüge werden vollversichert durchgeführt. Die Standardversicherung deckt typischerweise den Neuwert. Für besonders wertvolle Gegenstände kann eine Zusatzversicherung abgeschlossen werden." 
  },
  { 
    question: "Kann ich auch nur einzelne Möbel ins Ausland transportieren?", 
    answer: "Ja, bei sogenannten Beiladungen wird Ihr Gut mit anderen Transporten kombiniert. Das spart Kosten (oft 30-50% günstiger), dauert aber etwas länger. Ideal für einzelne Möbel oder kleine Mengen." 
  },
  { 
    question: "Was passiert mit meinen Haustieren?", 
    answer: "Viele unserer Partner bieten spezialisierte Haustier-Umzüge an. Für Hunde und Katzen werden EU-Heimtierausweise, Impfungen und ggf. Quarantänebestimmungen organisiert. Auch exotische Tiere können transportiert werden." 
  },
];

const popularCountries = ["Deutschland", "Frankreich", "Österreich", "UK", "USA", "Italien", "Spanien", "Niederlande", "Belgien", "Anderes"];

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

export default function AuslandsumzugPage() {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(8);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICE_SLUG);

  useEffect(() => {
    const interval = setInterval(() => setLiveViewers(prev => Math.max(5, Math.min(18, prev + Math.floor(Math.random() * 5) - 2))), 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("uc_prefill", JSON.stringify({ 
      location: fromLocation, 
      destination: toCountry,
      date: moveDate, 
      service: SERVICE_SLUG, 
      source: `${SERVICE_SLUG}-landing`, 
      timestamp: Date.now() 
    }));
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
      { 
        "@type": "Service", 
        "name": "Auslandsumzug Schweiz", 
        "description": "Professioneller Auslandsumzug ab der Schweiz. Weltweit, zollabgewickelt, vollversichert.", 
        "provider": { "@type": "Organization", "name": "Umzugscheck.ch" }, 
        "areaServed": { "@type": "Country", "name": "Schweiz" }, 
        "priceRange": "CHF 2000 - CHF 50000+",
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "1055" }
      },
      { "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>Auslandsumzug Schweiz | International Umziehen | Zoll & Versicherung inkl.</title>
        <meta name="description" content="Auslandsumzug ab der Schweiz ✓ Weltweit ✓ Zollformalitäten inklusive ✓ Vollversichert ✓ Kostenlose Offerten ✓ Deutschland, Frankreich, UK, USA & mehr!" />
        <link rel="canonical" href="https://umzugscheck.ch/services/auslandsumzug" />
        <meta property="og:title" content="Auslandsumzug ab der Schweiz – Ihr neues Abenteuer beginnt" />
        <meta property="og:description" content="Professioneller Auslandsumzug mit Rundum-Service. Zoll, Transport, Versicherung – alles aus einer Hand." />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <Header />

      <main>
        {/* HERO */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_BG})` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/75 to-blue-900/50" />
          </div>

          <div className="container relative z-10 px-4 py-12 md:py-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                <Select value={selectedService} onValueChange={handleServiceChange}>
                  <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white text-sm mb-4">
                    <Globe className="w-4 h-4 mr-1" /><SelectValue />
                  </SelectTrigger>
                  <SelectContent>{relatedServices.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-6">
                  <Plane className="w-4 h-4" />
                  <span className="font-medium">In 150+ Länder weltweit</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  Ihr Abenteuer beginnt <br className="hidden md:block" />
                  <span className="text-blue-400">– wir kümmern uns um den Rest</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  Egal ob München, London oder New York – wir bringen 
                  <strong className="text-blue-300"> Ihr Zuhause ans Ziel</strong>. 
                  <span className="block mt-2 text-green-400">Zoll inklusive. Vollversichert. Stressfrei.</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-white"><AnimatedCounter end={3520} suffix="+" /></div>
                    <div className="text-xs text-white/60">Auslandsumzüge</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-white">150+</div>
                    <div className="text-xs text-white/60">Länder</div>
                  </div>
                  <div className="text-2xl font-bold text-amber-400 flex items-center gap-1 justify-center lg:justify-start">
                    <Star className="w-6 h-6 fill-amber-400" />4.9
                  </div>
                </div>

                <div className="lg:hidden space-y-3">
                  <Button asChild size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-6">
                    <Link to="/umzugsofferten">🌍 Auslandsumzug planen<ArrowRight className="ml-2 w-5 h-5" /></Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
                <Card className="bg-white/[0.98] backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-3 text-sm font-medium">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Internationale Umzugsexperten
                  </div>
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <span className="text-4xl mb-3 block">✈️</span>
                      <h2 className="text-xl font-bold mb-2">Wohin geht die Reise?</h2>
                      <p className="text-sm text-muted-foreground">Kostenlose Beratung & Offerten</p>
                    </div>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Von wo in der Schweiz?</Label>
                        <div className="relative mt-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input value={fromLocation} onChange={e => setFromLocation(e.target.value)} placeholder="PLZ oder Ort" className="pl-10" required />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">In welches Land?</Label>
                        <Select value={toCountry} onValueChange={setToCountry}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder="Zielland wählen..." /></SelectTrigger>
                          <SelectContent>
                            {popularCountries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Gewünschter Zeitraum</Label>
                        <Input type="date" value={moveDate} onChange={e => setMoveDate(e.target.value)} className="mt-1" />
                      </div>
                      <Button type="submit" size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-6">
                        Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />Kostenlos & unverbindlich
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* DESTINATION PRICES */}
        <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-y">
          <div className="container px-4">
            <h2 className="text-xl font-bold text-center mb-6">Beliebte Zielländer</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {destinations.filter(d => d.popular).map((d, i) => (
                <Card key={i} className="text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setToCountry(d.country); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  <CardContent className="p-4">
                    <span className="text-3xl mb-2 block">{d.flag}</span>
                    <h3 className="font-bold">{d.country}</h3>
                    <p className="text-sm text-blue-600 font-medium">{d.priceRange}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">So funktioniert Ihr Auslandsumzug</h2>
              <p className="text-muted-foreground">Von der Planung bis zur Ankunft – alles aus einer Hand</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {howItWorks.map((step, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl mb-4">{step.emoji}</div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm mb-3">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                  <Badge variant="secondary" className="mt-2">{step.time}</Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Glücklich angekommen</h2>
              <p className="text-muted-foreground">Geschichten von Menschen, die den Schritt gewagt haben</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-blue-100">
                    <CardContent className="p-6">
                      <Badge className="bg-blue-100 text-blue-700 mb-3">{t.route}</Badge>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                      </div>
                      <p className="text-muted-foreground mb-4 italic">"{t.text}"</p>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium">{t.name}</p>
                        {t.verified && <Badge variant="secondary" className="bg-green-100 text-green-700"><Check className="w-3 h-3 mr-1" />Verifiziert</Badge>}
                      </div>
                      <div className="pt-3 border-t flex items-center justify-between">
                        <span className="text-sm">{t.emotion}</span>
                        <span className="text-sm text-green-600 font-medium">Gespart: CHF {t.savedAmount.toLocaleString('de-CH')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Alles inklusive</h2>
              <p className="text-muted-foreground">Full-Service für Ihren internationalen Umzug</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {services.map((s, i) => (
                <Card key={i} className="text-center p-6 hover:shadow-md transition-shadow">
                  <s.icon className="w-10 h-10 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="container px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-5xl mb-6 block">🌍</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Bereit für Ihr neues Abenteuer?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Egal ob EU oder Übersee – erhalten Sie kostenlos Offerten von internationalen Umzugsspezialisten. 
                Wir kümmern uns um alles, damit Sie sich auf das Wichtige konzentrieren können: Ihr neues Leben.
              </p>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90 font-bold text-lg px-8 py-6">
                <Link to="/umzugsofferten">
                  Jetzt Auslandsumzug planen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-background">
          <div className="container px-4 max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Häufige Fragen zum Auslandsumzug</h2>
              <p className="text-muted-foreground">Alles, was Sie wissen müssen</p>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
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
        </section>
      </main>

      <SimplifiedFooter />

      {/* STICKY BAR */}
      {showStickyBar && (
        <motion.div 
          initial={{ y: 100 }} 
          animate={{ y: 0 }} 
          className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 py-3 px-4 lg:hidden"
        >
          <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 font-bold py-5">
            <Link to="/umzugsofferten">🌍 Jetzt Offerte anfragen</Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
