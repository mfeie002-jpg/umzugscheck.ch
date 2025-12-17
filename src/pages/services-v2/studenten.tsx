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
  ClipboardList, ShieldCheck, CircleDollarSign, BadgeCheck, ThumbsUp, GraduationCap, Truck, Home, Package, Sparkles, Warehouse, Calendar
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80";
const SERVICE_NAME = "Studentenumzug";
const SERVICE_SLUG = "studenten";

const relatedServices = [
  { value: "studenten", label: "Studentenumzug", href: "/services/studenten" },
  { value: "privatumzug", label: "Privatumzug", href: "/services/privatumzug" },
  { value: "reinigung", label: "Reinigung", href: "/services/reinigung" },
  { value: "lagerung", label: "Lagerung", href: "/services/lagerung" },
  { value: "packservice", label: "Packservice", href: "/services/packservice" },
];

const companies = [
  { id: "student-move", name: "Student Move CH", rating: 4.8, reviewCount: 456, badges: ["Studenten-Rabatt", "Flexibel"], priceLevel: "Günstig", isPopular: true, responseTime: "< 1h" },
  { id: "budget-umzug", name: "Budget Umzug", rating: 4.7, reviewCount: 312, badges: ["Preis-Sieger", "Wochenende"], priceLevel: "Günstig", isBestPrice: true, responseTime: "< 2h" },
  { id: "campus-express", name: "Campus Express", rating: 4.9, reviewCount: 234, badges: ["Uni-Partner", "Express"], priceLevel: "Mittel", isPremium: false, responseTime: "< 2h" },
];

const priceExamples = [
  { size: "WG-Zimmer", price: "CHF 300 – 500", subtext: "10-15 m³", icon: Home, savings: "bis CHF 150" },
  { size: "Studio", price: "CHF 500 – 800", subtext: "15-25 m³", icon: Home, savings: "bis CHF 250" },
  { size: "1-2 Zimmer", price: "CHF 700 – 1'200", subtext: "25-40 m³", icon: Home, savings: "bis CHF 400" },
  { size: "Semesterwechsel", price: "ab CHF 250", subtext: "Mini-Umzug", icon: Package, savings: "bis CHF 100" },
];

const additionalServices = [
  { title: "Einlagerung", icon: Warehouse, description: "Semesterferien-Lager", link: "/services/lagerung" },
  { title: "Reinigung", icon: Sparkles, description: "WG-Endreinigung", link: "/services/reinigung" },
  { title: "Packservice", icon: Package, description: "Wir packen für dich", link: "/services/packservice" },
  { title: "Möbellift", icon: Truck, description: "Für schwere Stücke", link: "/services/moebellift" },
];

const howItWorks = [
  { step: 1, title: "Anfrage stellen", description: "WG-Zimmer oder Studio angeben", icon: ClipboardList, time: "30 Sek." },
  { step: 2, title: "Günstige Offerten", description: "Spezielle Studenten-Tarife", icon: FileText, time: "24h" },
  { step: 3, title: "Flexibel umziehen", description: "Auch am Wochenende", icon: CheckCircle, time: "Dein Termin" },
];

const testimonials = [
  { name: "Lena M., ETH", location: "Zürich", rating: 5, text: "Super günstig und flexibel! Der Umzug in meine neue WG hat nur CHF 350 gekostet. Absolut empfehlenswert für Studis!", date: "vor 4 Tagen", verified: true, savedAmount: 150 },
  { name: "Tim R., Uni Bern", location: "Bern", rating: 5, text: "Mit dem Studentenausweis 15% Rabatt bekommen. Das Team war pünktlich und schnell.", date: "vor 1 Woche", verified: true, savedAmount: 120 },
  { name: "Sarah K., ZHAW", location: "Winterthur", rating: 5, text: "Semesteranfang-Stress? Nicht mit diesem Service! Alles war in 2 Stunden erledigt.", date: "vor 2 Wochen", verified: true, savedAmount: 100 },
];

const guarantees = [
  { title: "Studenten-Rabatt", description: "10-20% mit gültigem Ausweis", icon: GraduationCap },
  { title: "Flexible Termine", description: "Auch Wochenende & Abend", icon: Calendar },
  { title: "Budget-freundlich", description: "Ab CHF 300 möglich", icon: CircleDollarSign },
  { title: "Schnell & Unkompliziert", description: "In wenigen Stunden erledigt", icon: Clock },
];

const faqs = [
  { question: "Was kostet ein Studentenumzug?", answer: "Studentenumzüge sind besonders günstig: WG-Zimmer ab CHF 300, Studio ab CHF 500, 1-2 Zimmer ab CHF 700. Mit Studentenausweis gibt's oft 10-20% Rabatt zusätzlich!" },
  { question: "Gibt es Studenten-Rabatte?", answer: "Ja! Die meisten unserer Partner bieten 10-20% Rabatt für Studierende mit gültigem Studentenausweis oder Immatrikulationsbescheinigung. Einfach bei der Anfrage angeben." },
  { question: "Kann ich auch am Wochenende umziehen?", answer: "Ja, Wochenend-Termine sind sehr beliebt bei Studenten und in der Regel verfügbar. Manche Firmen bieten sogar Abend-Termine an." },
  { question: "Was mache ich in den Semesterferien mit meinen Sachen?", answer: "Viele Firmen bieten günstige Einlagerung für Semesterferien an. So musst du nicht alles nach Hause transportieren. Frag nach Studenten-Lagertarifen!" },
  { question: "Brauche ich alles selbst einpacken?", answer: "Für ein kleines Budget: ja, selbst packen spart Geld. Es gibt aber auch günstigen Packservice speziell für Studenten ab ca. CHF 100 extra." },
];

const cities = ["Zürich", "Bern", "Basel", "Lausanne", "Genf", "St. Gallen", "Luzern", "Winterthur"];

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

export default function StudentenumzugPage() {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(15);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICE_SLUG);

  useEffect(() => {
    const interval = setInterval(() => setLiveViewers(prev => Math.max(10, Math.min(28, prev + Math.floor(Math.random() * 5) - 2))), 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("uc_prefill", JSON.stringify({ location, roomType, date: moveDate, service: SERVICE_SLUG, source: `${SERVICE_SLUG}-landing`, timestamp: Date.now() }));
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
      { "@type": "Service", "name": SERVICE_NAME, "description": `Günstiger ${SERVICE_NAME} in der Schweiz. Spezielle Studenten-Tarife ab CHF 300.`, "provider": { "@type": "Organization", "name": "Umzugscheck.ch" }, "areaServed": { "@type": "Country", "name": "Schweiz" }, "priceRange": "CHF 300 - CHF 1200" },
      { "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>{SERVICE_NAME} Schweiz | Günstig & Flexibel | Ab CHF 300</title>
        <meta name="description" content={`Günstiger ${SERVICE_NAME} in der Schweiz ✓ Studenten-Rabatte ✓ Ab CHF 300 ✓ Flexible Termine ✓ Auch am Wochenende!`} />
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
                  <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white text-sm mb-4">
                    <GraduationCap className="w-4 h-4 mr-1" /><SelectValue />
                  </SelectTrigger>
                  <SelectContent>{relatedServices.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6">
                  <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative rounded-full h-2.5 w-2.5 bg-green-500"></span></span>
                  <span className="font-bold">{liveViewers}</span> Studenten vergleichen gerade
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  {SERVICE_NAME} – <br className="hidden md:block" /><span className="text-secondary">günstig & flexibel</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  Spezielle Tarife für Studierende.
                  <span className="text-green-400 font-semibold"> Ab CHF 300 – mit Studenten-Rabatt!</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left"><div className="text-2xl font-bold text-white"><AnimatedCounter end={2100} suffix="+" /></div><div className="text-xs text-white/60">Studentenumzüge</div></div>
                  <div className="text-center lg:text-left"><div className="text-2xl font-bold text-white">ab 300</div><div className="text-xs text-white/60">CHF</div></div>
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
                      <Badge className="mb-2 bg-green-500/20 text-green-700 border-green-500/30"><GraduationCap className="w-3 h-3 mr-1" />Studenten-Special</Badge>
                      <h2 className="text-xl font-bold mb-2">Studenten-Offerte</h2>
                      <p className="text-sm text-muted-foreground">Günstige Tarife ab CHF 300</p>
                    </div>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <Label>Wohnort</Label>
                        <div className="relative mt-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="PLZ oder Ort" className="pl-10" required />
                        </div>
                      </div>
                      <div>
                        <Label>Wohnungstyp</Label>
                        <Select value={roomType} onValueChange={setRoomType}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder="Wählen..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wg">WG-Zimmer</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="1-2">1-2 Zimmer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Wunschtermin</Label>
                        <Input type="date" value={moveDate} onChange={e => setMoveDate(e.target.value)} className="mt-1" />
                      </div>
                      <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90 font-bold text-lg py-6">
                        Studenten-Offerte erhalten<ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5"><Lock className="w-3.5 h-3.5" />100% kostenlos & unverbindlich</p>
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
              <div><div className="text-2xl font-bold text-primary">2'100+</div><div className="text-sm text-muted-foreground">Studentenumzüge</div></div>
              <div><div className="text-2xl font-bold text-primary">ab CHF 300</div><div className="text-sm text-muted-foreground">WG-Zimmer</div></div>
              <div><div className="text-2xl font-bold text-primary">10-20%</div><div className="text-sm text-muted-foreground">Studenten-Rabatt</div></div>
              <div><div className="text-2xl font-bold text-primary">7 Tage</div><div className="text-sm text-muted-foreground">die Woche</div></div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Das sagen andere Studis</h2>
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
                    {t.savedAmount && <div className="mt-3 pt-3 border-t"><p className="text-sm text-green-600 font-medium">Ersparnis: CHF {t.savedAmount}</p></div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PRICES */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Preisbeispiele für Studenten</h2>
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
            <h2 className="text-3xl font-bold text-center mb-12">Deine Vorteile</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {guarantees.map((g, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4"><g.icon className="w-6 h-6 text-green-600" /></div>
                    <h3 className="font-bold mb-2">{g.title}</h3>
                    <p className="text-sm text-muted-foreground">{g.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ADDITIONAL SERVICES */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Ergänzende Services</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalServices.map((s, i) => (
                <Link key={i} to={s.link}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <s.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                      <h3 className="font-bold mb-2">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.description}</p>
                    </CardContent>
                  </Card>
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

        {/* CITIES */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Studentenumzug in deiner Uni-Stadt</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {cities.map((city) => (
                <Link key={city} to={`/umzugsfirmen/${city.toLowerCase()}`}>
                  <Badge variant="outline" className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors">
                    {city}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Günstig umziehen als Student</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">Spezielle Studenten-Tarife ab CHF 300 – mit 10-20% Rabatt für alle mit gültigem Studentenausweis!</p>
            <Button asChild size="lg" variant="secondary" className="font-bold px-8 py-6">
              <Link to="/umzugsofferten">Jetzt Studenten-Offerte erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </div>
        </section>

        {/* STICKY BAR */}
        {showStickyBar && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 p-4 lg:hidden">
            <Button asChild size="lg" className="w-full bg-secondary hover:bg-secondary/90 font-bold">
              <Link to="/umzugsofferten">Studenten-Offerte erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </motion.div>
        )}
      </main>

      <SimplifiedFooter />
    </div>
  );
}
