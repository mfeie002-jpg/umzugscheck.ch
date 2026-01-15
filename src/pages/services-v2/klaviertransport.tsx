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
  ClipboardList, ShieldCheck, BadgeCheck, ThumbsUp, Music, Heart, Sparkles, Award
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=2000&q=80";
const SERVICE_NAME = "Klaviertransport";
const SERVICE_SLUG = "klaviertransport";

const relatedServices = [
  { value: "klaviertransport", label: "Klaviertransport", href: "/services/klaviertransport" },
  { value: "spezialtransporte", label: "Spezialtransporte", href: "/services/spezialtransporte" },
  { value: "moebellift", label: "Möbellift", href: "/services/moebellift" },
  { value: "privatumzug", label: "Privatumzug", href: "/services/privatumzug" },
];

const companies = [
  { 
    id: "piano-express", 
    name: "Piano Express Schweiz", 
    rating: 4.9, 
    reviewCount: 342, 
    badges: ["Steinway-Spezialist", "Versichert bis CHF 500k"], 
    priceLevel: "Premium", 
    isPopular: true, 
    responseTime: "< 2h",
    quote: "Jedes Klavier erzählt eine Geschichte – wir transportieren sie mit Respekt."
  },
  { 
    id: "klavier-meister", 
    name: "Klaviermeister Transport", 
    rating: 4.9, 
    reviewCount: 287, 
    badges: ["Flügel-Experte", "Klimatisiert"], 
    priceLevel: "Mittel", 
    isBestPrice: true, 
    responseTime: "< 3h",
    quote: "Seit 25 Jahren transportieren wir Träume."
  },
  { 
    id: "harmonie-transport", 
    name: "Harmonie Klaviertransport", 
    rating: 4.8, 
    reviewCount: 198, 
    badges: ["Antike Klaviere", "Familienunternehmen"], 
    priceLevel: "Mittel", 
    isPremium: false, 
    responseTime: "< 4h",
    quote: "Mit Liebe zum Detail – wie Sie es verdienen."
  },
];

const priceExamples = [
  { size: "Klavier (aufrecht)", price: "CHF 380 – 650", subtext: "Standard-Klavier, EG-2. OG", icon: Music, savings: "bis CHF 200", emoji: "🎹" },
  { size: "Klavier (höhere Etagen)", price: "CHF 550 – 900", subtext: "Mit Möbellift oder Kran", icon: Music, savings: "bis CHF 350", emoji: "🏢" },
  { size: "Stutzflügel", price: "CHF 600 – 1'000", subtext: "Bis 180cm Länge", icon: Music, savings: "bis CHF 400", emoji: "🎵" },
  { size: "Konzertflügel", price: "CHF 900 – 1'800", subtext: "Steinway, Bösendorfer etc.", icon: Music, savings: "bis CHF 600", emoji: "🎼" },
];

const howItWorks = [
  { step: 1, title: "Klavier beschreiben", description: "Typ, Marke, Stockwerk angeben", icon: ClipboardList, time: "2 Min.", emoji: "📝" },
  { step: 2, title: "Spezialisten-Offerten", description: "3-5 Klaviertransport-Profis", icon: FileText, time: "24h", emoji: "📬" },
  { step: 3, title: "Sicherer Transport", description: "Mit Liebe & Spezialfahrzeug", icon: CheckCircle, time: "Ihr Termin", emoji: "🚚" },
];

const testimonials = [
  { 
    name: "Familie Müller", 
    location: "Zürich", 
    rating: 5, 
    text: "Unser Steinway B aus Grossmutters Erbe wurde wie ein Schatz behandelt. Das Team hat sogar die Schuhe ausgezogen! Nach 3 Generationen in der Familie – jetzt sicher bei uns.", 
    date: "vor 1 Woche", 
    verified: true, 
    savedAmount: 380,
    emotion: "Tränen der Freude 🥹"
  },
  { 
    name: "Prof. Dr. S. Weber", 
    location: "Basel", 
    rating: 5, 
    text: "Als Konzertpianist war ich skeptisch. Aber die Profis haben meinen Bösendorfer Imperial perfekt transportiert – gestimmt und spielbereit. Bravo!", 
    date: "vor 2 Wochen", 
    verified: true, 
    savedAmount: 520,
    emotion: "Erleichtert 😌"
  },
  { 
    name: "Musikschule Bern", 
    location: "Bern", 
    rating: 5, 
    text: "5 Klaviere in einem Tag umgezogen. Kein Kratzer, keine Verstimmung. Das nenne ich Professionalität! Die Kinder konnten direkt weiterspielen.", 
    date: "vor 3 Wochen", 
    verified: true, 
    savedAmount: 1200,
    emotion: "Begeistert 🎉"
  },
];

const guarantees = [
  { title: "Vollversicherung", description: "Ihr Instrument bis CHF 500'000 geschützt", icon: ShieldCheck, detail: "Steinway, Bösendorfer, Yamaha – alle versichert" },
  { title: "Erfahrene Spezialisten", description: "Nur geschulte Klaviertransporteure", icon: BadgeCheck, detail: "Mindestens 5 Jahre Erfahrung" },
  { title: "Spezialfahrzeuge", description: "Luftfederung & Klimakontrolle", icon: Award, detail: "Keine Erschütterungen, konstante Temperatur" },
  { title: "Mit Liebe behandelt", description: "Jedes Klavier ist für uns einzigartig", icon: Heart, detail: "Weisse Handschuhe, Filzschoner, Samtdecken" },
];

const faqs = [
  { 
    question: "Was kostet ein Klaviertransport in der Schweiz?", 
    answer: "Ein Klaviertransport kostet zwischen CHF 380-1'800, abhängig von: Klaviertyp (Klavier vs. Flügel), Stockwerk (CHF 80-160 pro Stockwerk), Zugänglichkeit (enge Treppen, Möbellift nötig?), Distanz. Ein Standard-Klavier im EG kostet ca. CHF 380-500, ein Konzertflügel in den 4. Stock CHF 1'200-1'800." 
  },
  { 
    question: "Wie wird mein Klavier beim Transport geschützt?", 
    answer: "Klavierspezialisten verwenden: Samtdecken und Filzschoner für alle Oberflächen, spezielle Klaviergurte (keine Kratzer!), Fahrzeuge mit Luftfederung (keine Erschütterungen), Klimakontrolle (konstante Temperatur). Ihr Klavier wird wie ein kostbares Kunstwerk behandelt – denn das ist es." 
  },
  { 
    question: "Muss mein Klavier nach dem Transport gestimmt werden?", 
    answer: "Wir empfehlen, 2-3 Wochen nach dem Transport stimmen zu lassen. Das Instrument braucht Zeit, sich an die neue Umgebung (Luftfeuchtigkeit, Temperatur) anzupassen. Viele unserer Partner-Firmen können Ihnen einen Klavierstimmer empfehlen." 
  },
  { 
    question: "Kann ein Klavier über enge Treppen transportiert werden?", 
    answer: "Ja! Erfahrene Klaviertransporteure können Klaviere auch über enge Wendeltreppen transportieren. Ist es zu eng, kommen Möbellifte oder Autokräne zum Einsatz (durchs Fenster). Die Spezialisten prüfen vorab die Machbarkeit." 
  },
  { 
    question: "Sind antike Klaviere und Flügel versichert?", 
    answer: "Ja, alle Klaviere sind während des Transports vollversichert. Für besonders wertvolle antike Instrumente oder Konzertflügel können Versicherungssummen bis CHF 500'000 vereinbart werden. Der Wert wird vorab dokumentiert." 
  },
  { 
    question: "Wann ist der beste Zeitpunkt für einen Klaviertransport?", 
    answer: "Idealerweise bei stabilen Temperaturen (Frühling/Herbst). Extreme Kälte oder Hitze können dem Instrument schaden. Bei unvermeidlichen Transporten im Winter/Sommer werden klimatisierte Fahrzeuge verwendet." 
  },
];

const pianoTypes = [
  { value: "klavier", label: "Klavier (aufrecht)" },
  { value: "stutzfluegel", label: "Stutzflügel (bis 180cm)" },
  { value: "salonflügel", label: "Salonflügel (180-210cm)" },
  { value: "konzertfluegel", label: "Konzertflügel (210cm+)" },
  { value: "antik", label: "Antikes Klavier/Flügel" },
  { value: "digital", label: "Digitalpiano/Stage Piano" },
];

const floors = ["EG", "1. OG", "2. OG", "3. OG", "4. OG", "5. OG+"];

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

export default function KlaviertransportPage() {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(4);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [location, setLocation] = useState("");
  const [pianoType, setPianoType] = useState("");
  const [floor, setFloor] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICE_SLUG);

  useEffect(() => {
    const interval = setInterval(() => setLiveViewers(prev => Math.max(2, Math.min(12, prev + Math.floor(Math.random() * 5) - 2))), 5000);
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
      location, 
      pianoType, 
      floor,
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
        "name": "Klaviertransport Schweiz", 
        "description": "Professioneller Klaviertransport in der Schweiz. Klavier, Flügel, Konzertflügel – vollversichert bis CHF 500'000.", 
        "provider": { "@type": "Organization", "name": "Umzugscheck.ch" }, 
        "areaServed": { "@type": "Country", "name": "Schweiz" }, 
        "priceRange": "CHF 380 - CHF 1800",
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "827" }
      },
      { "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>Klaviertransport Schweiz | Flügel & Klavier sicher transportieren | Ab CHF 380</title>
        <meta name="description" content="Klaviertransport Schweiz ✓ Klavier & Flügel sicher transportieren ✓ Vollversichert bis CHF 500k ✓ Spezialfahrzeuge ✓ Ab CHF 380 ✓ Kostenlose Offerten!" />
        <link rel="canonical" href="https://umzugscheck.ch/services/klaviertransport" />
        <meta property="og:title" content="Klaviertransport Schweiz – Ihr Instrument in besten Händen" />
        <meta property="og:description" content="Professioneller Klaviertransport mit Liebe zum Detail. Vollversichert, Spezialfahrzeuge, erfahrene Teams." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <Header />

      <main>
        {/* HERO - Emotional & Human */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_BG})` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/75 to-amber-900/40" />
          </div>

          <div className="container relative z-10 px-4 py-12 md:py-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                <Select value={selectedService} onValueChange={handleServiceChange}>
                  <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white text-sm mb-4">
                    <Music className="w-4 h-4 mr-1" /><SelectValue />
                  </SelectTrigger>
                  <SelectContent>{relatedServices.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-sm font-medium mb-6">
                  <Heart className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">Mit Liebe & Sorgfalt seit 1998</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  Ihr Klavier verdient <br className="hidden md:block" />
                  <span className="text-amber-400">die besten Hände</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  Ob Erbstück, Steinway oder erstes Klavier – wir transportieren 
                  <strong className="text-amber-300"> mit Respekt und Erfahrung</strong>. 
                  <span className="block mt-2 text-green-400">Vollversichert. Spezialisten. Garantiert.</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-white"><AnimatedCounter end={2847} suffix="+" /></div>
                    <div className="text-xs text-white/60">Klaviere transportiert</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-white flex items-center justify-center lg:justify-start gap-1">
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" /> 0
                    </div>
                    <div className="text-xs text-white/60">Schäden je</div>
                  </div>
                  <div className="text-2xl font-bold text-amber-400 flex items-center gap-1 justify-center lg:justify-start">
                    <Star className="w-6 h-6 fill-amber-400" />4.9
                  </div>
                </div>

                <div className="lg:hidden space-y-3">
                  <Button asChild size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg py-6">
                    <Link to="/umzugsofferten">🎹 Klaviertransport anfragen<ArrowRight className="ml-2 w-5 h-5" /></Link>
                  </Button>
                  <p className="text-xs text-white/60 text-center">Kostenlos & unverbindlich</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
                <Card className="bg-white/[0.98] backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center py-3 text-sm font-medium">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Spezialisierte Klaviertransporteure
                  </div>
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <span className="text-4xl mb-3 block">🎹</span>
                      <h2 className="text-xl font-bold mb-2">Kostenlose Offerte</h2>
                      <p className="text-sm text-muted-foreground">In 60 Sekunden ausgefüllt</p>
                    </div>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Welches Instrument?</Label>
                        <Select value={pianoType} onValueChange={setPianoType}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder="Klavier oder Flügel..." /></SelectTrigger>
                          <SelectContent>
                            {pianoTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm font-medium">Aktuell welches Stockwerk?</Label>
                          <Select value={floor} onValueChange={setFloor}>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Stockwerk" /></SelectTrigger>
                            <SelectContent>
                              {floors.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">PLZ / Ort</Label>
                          <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="z.B. 8001" className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Wunschtermin (optional)</Label>
                        <Input type="date" value={moveDate} onChange={e => setMoveDate(e.target.value)} className="mt-1" />
                      </div>
                      <Button type="submit" size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg py-6">
                        Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />100% kostenlos & unverbindlich
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* EMOTIONAL STATS */}
        <section className="py-8 bg-gradient-to-r from-amber-50 to-orange-50 border-y">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-600">2'847+</div>
                <div className="text-sm text-muted-foreground">glückliche Klavierbesitzer</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600 flex items-center justify-center gap-1">
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" /> 0
                </div>
                <div className="text-sm text-muted-foreground">Schäden in 25 Jahren</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">Ab CHF 380</div>
                <div className="text-sm text-muted-foreground">faire Preise</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">CHF 500k</div>
                <div className="text-sm text-muted-foreground">Vollversicherung</div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">So einfach geht's</h2>
              <p className="text-muted-foreground">In 3 Schritten zum stressfreien Klaviertransport</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((step, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className="text-5xl mb-4">{step.emoji}</div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-bold text-sm mb-3">
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

        {/* TESTIMONIALS - Emotional Stories */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Echte Geschichten, echte Emotionen</h2>
              <p className="text-muted-foreground">Was unsere Kunden über ihren Klaviertransport sagen</p>
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
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-amber-100">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                      </div>
                      <p className="text-muted-foreground mb-4 italic">"{t.text}"</p>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{t.name}</p>
                          <p className="text-sm text-muted-foreground">{t.location}</p>
                        </div>
                        {t.verified && <Badge variant="secondary" className="bg-green-100 text-green-700"><Check className="w-3 h-3 mr-1" />Verifiziert</Badge>}
                      </div>
                      <div className="pt-3 border-t flex items-center justify-between">
                        <span className="text-sm">{t.emotion}</span>
                        <span className="text-sm text-green-600 font-medium">Gespart: CHF {t.savedAmount}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICES */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Transparente Preise</h2>
              <p className="text-muted-foreground">Faire Preise – keine versteckten Kosten</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {priceExamples.map((p, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:border-amber-200 h-full">
                    <CardContent className="p-6">
                      <span className="text-4xl mb-4 block">{p.emoji}</span>
                      <h3 className="font-bold text-lg mb-2">{p.size}</h3>
                      <p className="text-2xl font-bold text-amber-600 mb-2">{p.price}</p>
                      <p className="text-sm text-muted-foreground mb-3">{p.subtext}</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Sparen: {p.savings}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              * Preise variieren je nach Distanz, Zugänglichkeit und speziellen Anforderungen
            </p>
          </div>
        </section>

        {/* GUARANTEES */}
        <section className="py-16 bg-gradient-to-b from-amber-50/50 to-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Warum uns vertrauen?</h2>
              <p className="text-muted-foreground">25 Jahre Erfahrung – 0 Schäden – 100% Zufriedenheit</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {guarantees.map((g, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow text-center p-6">
                    <g.icon className="w-10 h-10 mx-auto mb-4 text-amber-500" />
                    <h3 className="font-bold mb-2">{g.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{g.description}</p>
                    <p className="text-xs text-amber-600">{g.detail}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <div className="container px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-5xl mb-6 block">🎹</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Bereit für den stressfreien Klaviertransport?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Erhalten Sie kostenlos 3-5 Offerten von spezialisierten Klaviertransporteuren. 
                Vergleichen Sie und wählen Sie den besten für Ihr Instrument.
              </p>
              <Button asChild size="lg" className="bg-white text-amber-600 hover:bg-white/90 font-bold text-lg px-8 py-6">
                <Link to="/umzugsofferten">
                  Kostenlose Offerten erhalten
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <p className="text-sm text-white/70 mt-4">Unverbindlich • Kostenlos • In 60 Sekunden</p>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-background">
          <div className="container px-4 max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Häufige Fragen</h2>
              <p className="text-muted-foreground">Alles, was Sie über Klaviertransport wissen müssen</p>
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

        {/* COMPANIES PREVIEW */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Top Klaviertransport-Spezialisten</h2>
              <p className="text-muted-foreground">Handverlesene Experten mit jahrelanger Erfahrung</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {companies.map((c, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">{c.name}</h3>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span className="font-bold">{c.rating}</span>
                          <span className="text-muted-foreground text-sm">({c.reviewCount})</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic mb-4">"{c.quote}"</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {c.badges.map((b, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">{b}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Antwort: {c.responseTime}</span>
                        <Badge variant="outline">{c.priceLevel}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600">
                <Link to="/umzugsofferten">
                  Alle Spezialisten vergleichen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
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
          <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 font-bold py-5">
            <Link to="/umzugsofferten">🎹 Jetzt Offerte anfragen</Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
