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
  Building2, Lock, FileText, CheckCircle, Warehouse,
  ClipboardList, ChevronRight, MessageCircle, ShieldCheck, 
  CircleDollarSign, BadgeCheck, ThumbsUp, Briefcase, Server, Monitor
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80";
const SERVICE_NAME = "Firmenumzug";
const SERVICE_SLUG = "firmenumzug";

const relatedServices = [
  { value: "firmenumzug", label: "Firmenumzug", href: "/services/firmenumzug" },
  { value: "privatumzug", label: "Privatumzug", href: "/services/privatumzug" },
  { value: "lagerung", label: "Lagerung", href: "/services/lagerung" },
  { value: "montage", label: "Möbelmontage", href: "/services/montage" },
  { value: "entsorgung", label: "Entsorgung", href: "/services/entsorgung" },
  { value: "international", label: "International", href: "/services/international" },
];

const companies = [
  { id: "business-move", name: "Business Move AG", rating: 4.9, reviewCount: 234, badges: ["IT-Spezialist", "24/7"], services: ["Büroumzug", "Serverumzug", "Archivierung"], priceLevel: "Premium", isPopular: true, responseTime: "< 1h" },
  { id: "office-express", name: "Office Express", rating: 4.8, reviewCount: 189, badges: ["Preis-Sieger", "Wochenende"], services: ["Komplettumzug", "Möbelmontage", "Entsorgung"], priceLevel: "Mittel", isBestPrice: true, responseTime: "< 2h" },
  { id: "corporate-relocation", name: "Corporate Relocation", rating: 4.9, reviewCount: 156, badges: ["Grossunternehmen", "International"], services: ["Projektmanagement", "IT-Umzug", "Einlagerung"], priceLevel: "Premium", isPremium: true, responseTime: "< 4h" },
];

const priceExamples = [
  { size: "Kleines Büro", price: "CHF 2'000 – 5'000", subtext: "bis 10 Arbeitsplätze", icon: Briefcase, savings: "bis CHF 2'000" },
  { size: "Mittleres Büro", price: "CHF 5'000 – 15'000", subtext: "10-50 Arbeitsplätze", icon: Building2, savings: "bis CHF 6'000" },
  { size: "Grosses Büro", price: "CHF 15'000 – 40'000", subtext: "50-150 Arbeitsplätze", icon: Building2, savings: "bis CHF 15'000" },
  { size: "Enterprise", price: "ab CHF 40'000", subtext: "150+ Arbeitsplätze", icon: Building2, savings: "individuell" },
];

const additionalServices = [
  { title: "IT-Umzug", icon: Server, description: "Sichere Server- & Netzwerkmigration", link: "/services/firmenumzug" },
  { title: "Archivierung", icon: Warehouse, description: "Dokumenten- & Akteneinlagerung", link: "/services/lagerung" },
  { title: "Möbelmontage", icon: Monitor, description: "Büromöbel Auf- & Abbau", link: "/services/montage" },
  { title: "Entsorgung", icon: Building2, description: "Alte Büromöbel entsorgen", link: "/services/entsorgung" },
  { title: "Reinigung", icon: Building2, description: "Büroreinigung nach Auszug", link: "/services/reinigung" },
  { title: "Einlagerung", icon: Warehouse, description: "Flexible Lagerlösungen", link: "/services/lagerung" },
];

const howItWorks = [
  { step: 1, title: "Bedarfsanalyse", description: "Umfang, Termine & spezielle Anforderungen", icon: ClipboardList, time: "5 Min." },
  { step: 2, title: "Offerten erhalten", description: "3-5 spezialisierte Firmenumzug-Angebote", icon: FileText, time: "24-48h" },
  { step: 3, title: "Umzug durchführen", description: "Professionelle Abwicklung mit Projektleiter", icon: CheckCircle, time: "Nach Plan" },
];

const testimonials = [
  { name: "Thomas R., CEO", location: "Zürich", rating: 5, text: "Unser Büroumzug mit 80 Arbeitsplätzen lief reibungslos. Die IT wurde am Wochenende migriert, am Montag konnte jeder arbeiten.", date: "vor 2 Wochen", verified: true, savedAmount: 12000 },
  { name: "Sandra M., Office Manager", location: "Bern", rating: 5, text: "Professionelle Planung und Durchführung. Der Projektleiter hatte alles im Griff. Sehr empfehlenswert!", date: "vor 1 Monat", verified: true, savedAmount: 5500 },
  { name: "Peter K., IT-Leiter", location: "Basel", rating: 5, text: "Serverumzug ohne Datenverlust und minimale Ausfallzeit. Das Team wusste genau, was zu tun war.", date: "vor 3 Wochen", verified: true, savedAmount: 8000 },
];

const guarantees = [
  { title: "Minimale Ausfallzeit", description: "Umzug am Wochenende möglich", icon: Clock },
  { title: "IT-Sicherheit", description: "Erfahrung mit Server & Netzwerk", icon: Server },
  { title: "Vollversicherung", description: "Umfassender Schutz für Inventar", icon: ShieldCheck },
  { title: "Projektmanagement", description: "Dedizierter Ansprechpartner", icon: Briefcase },
];

const faqs = [
  { question: "Wie lange dauert ein Firmenumzug?", answer: "Die Dauer hängt von der Unternehmensgrösse ab: Kleines Büro (bis 10 MA) 1-2 Tage, mittleres Büro (10-50 MA) 2-5 Tage, grosses Büro (50+ MA) 1-2 Wochen. Umzüge am Wochenende minimieren Ausfallzeiten." },
  { question: "Was kostet ein Firmenumzug?", answer: "Richtwerte: Kleines Büro ab CHF 2'000, mittleres Büro CHF 5'000-15'000, grosses Büro CHF 15'000-40'000+. Faktoren: Arbeitsplätze, IT-Infrastruktur, Distanz, spezielle Anforderungen." },
  { question: "Wie wird die IT sicher umgezogen?", answer: "Spezialisierte IT-Umzugsfirmen sichern alle Daten, bauen Server & Netzwerk fachgerecht ab, transportieren in klimatisierten Fahrzeugen und bauen am neuen Standort wieder auf. Testläufe vor dem 'Go-Live'." },
  { question: "Können wir am Wochenende umziehen?", answer: "Ja, viele Firmen bieten Wochenend- und Nachtumzüge an, um Ausfallzeiten zu minimieren. So kann am Freitag abgebaut und am Montag normal gearbeitet werden." },
  { question: "Wer ist während des Umzugs Ansprechpartner?", answer: "Bei grösseren Umzügen gibt es einen dedizierten Projektleiter, der die gesamte Koordination übernimmt und als zentraler Ansprechpartner für Ihr Unternehmen fungiert." },
];

const regions = ["Zürich", "Bern", "Basel", "Luzern", "Aargau", "St. Gallen", "Zug", "Genf"];

const trustBadges = [
  { name: "B2B Spezialist", icon: Briefcase },
  { name: "ISO zertifiziert", icon: BadgeCheck },
  { name: "Vollversichert", icon: Shield },
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

export default function FirmenumzugServicePage() {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(12);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [companySize, setCompanySize] = useState("");
  const [location, setLocation] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICE_SLUG);

  useEffect(() => {
    const interval = setInterval(() => setLiveViewers(prev => Math.max(8, Math.min(25, prev + Math.floor(Math.random() * 5) - 2))), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("uc_prefill", JSON.stringify({ location, companySize, date: moveDate, service: SERVICE_SLUG, source: `${SERVICE_SLUG}-landing`, timestamp: Date.now() }));
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
      { "@type": "Service", "name": SERVICE_NAME, "description": `Professioneller ${SERVICE_NAME} in der Schweiz. IT-Umzug, Büromöbel, minimale Ausfallzeiten.`, "provider": { "@type": "Organization", "name": "Umzugscheck.ch" }, "areaServed": { "@type": "Country", "name": "Schweiz" }, "priceRange": "CHF 2000 - CHF 100000+", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "579" } },
      { "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>{SERVICE_NAME} Schweiz | Büroumzug & IT-Umzug | Bis 40% sparen</title>
        <meta name="description" content={`Professioneller ${SERVICE_NAME} in der Schweiz ✓ IT-Spezialist ✓ Minimale Ausfallzeiten ✓ Vollversichert ✓ Kostenlose Offerten!`} />
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
                    <Building2 className="w-4 h-4 mr-1" /><SelectValue />
                  </SelectTrigger>
                  <SelectContent>{relatedServices.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6">
                  <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative rounded-full h-2.5 w-2.5 bg-green-500"></span></span>
                  <span className="font-bold">{liveViewers}</span> Firmen vergleichen gerade
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  {SERVICE_NAME} – <br className="hidden md:block" /><span className="text-secondary">ohne Ausfallzeiten</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  Spezialisierte Firmen für <strong>Büro- & IT-Umzüge</strong>. Umzug am Wochenende möglich.
                  <span className="text-green-400 font-semibold"> Bis zu 40% sparen.</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left"><div className="text-2xl md:text-3xl font-bold text-white"><AnimatedCounter end={579} suffix="+" /></div><div className="text-xs text-white/60">Bewertungen</div></div>
                  <div className="text-center lg:text-left"><div className="text-2xl md:text-3xl font-bold text-white"><AnimatedCounter end={85} suffix="+" /></div><div className="text-xs text-white/60">Spezialisten</div></div>
                  <div className="text-2xl md:text-3xl font-bold text-amber-400 flex items-center gap-1"><Star className="w-6 h-6 fill-amber-400" />4.9</div>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  {trustBadges.map(b => <div key={b.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs text-white/80"><b.icon className="w-3.5 h-3.5" />{b.name}</div>)}
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
                      <p className="text-sm text-muted-foreground">Spezialisierte Firmenumzug-Offerten</p>
                    </div>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <Label>Unternehmensgrösse</Label>
                        <Select value={companySize} onValueChange={setCompanySize}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder="Arbeitsplätze..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 Arbeitsplätze</SelectItem>
                            <SelectItem value="10-50">10-50 Arbeitsplätze</SelectItem>
                            <SelectItem value="50-150">50-150 Arbeitsplätze</SelectItem>
                            <SelectItem value="150+">150+ Arbeitsplätze</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Aktueller Standort</Label>
                        <div className="relative mt-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="PLZ oder Ort" className="pl-10" required />
                        </div>
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
              <div><div className="text-2xl font-bold text-primary">2'500+</div><div className="text-sm text-muted-foreground">Firmenumzüge</div></div>
              <div><div className="text-2xl font-bold text-primary">CHF 8'500</div><div className="text-sm text-muted-foreground">Ø Ersparnis</div></div>
              <div><div className="text-2xl font-bold text-primary">99.8%</div><div className="text-sm text-muted-foreground">Termingenau</div></div>
              <div><div className="text-2xl font-bold text-primary">0</div><div className="text-sm text-muted-foreground">Datenverluste</div></div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Erfolgreiche Firmenumzüge</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-3">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                      <p className="text-muted-foreground mb-4">"{t.text}"</p>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium">{t.name}</p><p className="text-sm text-muted-foreground">{t.location} · {t.date}</p></div>
                        {t.verified && <Badge variant="secondary"><Check className="w-3 h-3 mr-1" />Verifiziert</Badge>}
                      </div>
                      {t.savedAmount && <div className="mt-3 pt-3 border-t"><p className="text-sm text-green-600 font-medium">Ersparnis: CHF {t.savedAmount.toLocaleString()}</p></div>}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPANIES */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Top Firmenumzug-Spezialisten</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {companies.map(c => (
                <Card key={c.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  {c.isPopular && <Badge className="absolute top-3 right-3 bg-amber-500">Beliebt</Badge>}
                  {c.isBestPrice && <Badge className="absolute top-3 right-3 bg-green-500">Preis-Tipp</Badge>}
                  {c.isPremium && <Badge className="absolute top-3 right-3 bg-purple-500">Enterprise</Badge>}
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2">{c.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="font-medium">{c.rating}</span>
                      <span className="text-sm text-muted-foreground">({c.reviewCount})</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">{c.badges.map(b => <Badge key={b} variant="outline" className="text-xs">{b}</Badge>)}</div>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-muted-foreground">{c.priceLevel}</span>
                      <span className="text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1" />{c.responseTime}</span>
                    </div>
                    <Button asChild className="w-full"><Link to="/umzugsofferten">Offerte anfordern</Link></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PRICES */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Preisbeispiele Firmenumzug</h2>
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
            <h2 className="text-3xl font-bold text-center mb-12">Ergänzende Services</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalServices.map((s, i) => (
                <Link key={i} to={s.link}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl"><s.icon className="w-6 h-6 text-primary" /></div>
                      <div><h3 className="font-bold mb-1">{s.title}</h3><p className="text-sm text-muted-foreground">{s.description}</p></div>
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
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><step.icon className="w-8 h-8 text-primary" /></div>
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
                <Link key={r} to={`/umzugsfirmen/${r.toLowerCase()}`}>
                  <Badge variant="outline" className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"><MapPin className="w-3 h-3 mr-1" />{r}</Badge>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Planen Sie Ihren Firmenumzug</h2>
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
