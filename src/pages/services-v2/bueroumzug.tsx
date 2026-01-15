/**
 * Büroumzug Page - B2B Alias for Firmenumzug
 * 
 * This page targets the keyword "Büroumzug" which has different search intent
 * than "Firmenumzug" - more focused on office furniture and less on enterprise moves.
 */

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
  ClipboardList, ShieldCheck, BadgeCheck, ThumbsUp, Building2, Monitor, Users,
  Coffee, Heart, Sparkles, Briefcase, Calendar
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80";
const SERVICE_NAME = "Büroumzug";
const SERVICE_SLUG = "bueroumzug";

const relatedServices = [
  { value: "bueroumzug", label: "Büroumzug", href: "/services/bueroumzug" },
  { value: "firmenumzug", label: "Firmenumzug (gross)", href: "/services/firmenumzug" },
  { value: "montage", label: "Möbelmontage", href: "/services/montage" },
  { value: "entsorgung", label: "Entsorgung", href: "/services/entsorgung" },
];

const priceExamples = [
  { size: "Kleines Büro", workstations: "1-5", price: "CHF 800 – 2'000", time: "1/2 Tag", emoji: "🖥️" },
  { size: "Start-up Büro", workstations: "5-15", price: "CHF 1'500 – 4'000", time: "1 Tag", emoji: "🚀" },
  { size: "Mittleres Büro", workstations: "15-30", price: "CHF 3'000 – 8'000", time: "1-2 Tage", emoji: "🏢" },
  { size: "Grosses Büro", workstations: "30-50", price: "CHF 6'000 – 15'000", time: "2-3 Tage", emoji: "🏛️" },
];

const howItWorks = [
  { step: 1, title: "Büro beschreiben", description: "Arbeitsplätze, Möbel, IT", icon: Building2, time: "3 Min.", emoji: "📝" },
  { step: 2, title: "Offerten erhalten", description: "3-5 spezialisierte Angebote", icon: FileText, time: "24-48h", emoji: "📬" },
  { step: 3, title: "Wochenend-Umzug", description: "Montag produktiv starten", icon: Calendar, time: "Sa-So", emoji: "🎯" },
];

const testimonials = [
  { 
    name: "Start-up Fintech AG", 
    location: "Zürich", 
    workstations: "12 Arbeitsplätze",
    rating: 5, 
    text: "Von Freitag 18 Uhr bis Sonntag Mittag – alles erledigt! Am Montag konnten wir normal weiterarbeiten. Besser geht's nicht.", 
    verified: true, 
    savedAmount: 1800,
    emotion: "Stressfrei 😌"
  },
  { 
    name: "Anwaltskanzlei Weber", 
    location: "Basel", 
    workstations: "8 Arbeitsplätze",
    rating: 5, 
    text: "Unsere Akten wurden mit höchster Sorgfalt behandelt. Diskretion war gewährleistet, alles sauber beschriftet und eingeräumt. Perfekt!", 
    verified: true, 
    savedAmount: 950,
    emotion: "Begeistert 🎉"
  },
  { 
    name: "Marketing Agentur Kreativ", 
    location: "Bern", 
    workstations: "20 Arbeitsplätze",
    rating: 5, 
    text: "Unser Open-Space-Büro mit viel Technik – kein Problem für die Profis. Selbst die Kaffeemaschine funktionierte am Montag wieder!", 
    verified: true, 
    savedAmount: 2400,
    emotion: "Erleichtert 😊"
  },
];

const included = [
  { title: "Büromöbel", icon: Monitor, description: "Schreibtische, Stühle, Regale" },
  { title: "IT-Equipment", icon: Building2, description: "Computer, Monitore, Drucker" },
  { title: "Akten & Ordner", icon: FileText, description: "Sorgfältig verpackt" },
  { title: "Küche & Sozialraum", icon: Coffee, description: "Kaffeemaschine, Kühlschrank" },
  { title: "Montage", icon: ClipboardList, description: "Ab- und Aufbau inklusive" },
  { title: "Versicherung", icon: Shield, description: "Vollversicherung Standard" },
];

const guarantees = [
  { title: "Wochenend-Service", description: "Umzug Sa/So möglich", icon: Calendar },
  { title: "Keine Ausfallzeit", description: "Mo produktiv starten", icon: Clock },
  { title: "Festpreisgarantie", description: "Keine versteckten Kosten", icon: BadgeCheck },
  { title: "Vollversichert", description: "Ihr Equipment ist sicher", icon: Shield },
];

const faqs = [
  { 
    question: "Was kostet ein Büroumzug?", 
    answer: "Ein kleines Büro (5-10 Arbeitsplätze) kostet ca. CHF 1'500-3'000, ein mittleres Büro (15-30 AP) CHF 3'000-8'000. Die Kosten hängen von: Anzahl Arbeitsplätze, Menge an IT-Equipment, Distanz, gewähltem Zeitpunkt (Werktag vs. Wochenende)." 
  },
  { 
    question: "Kann der Umzug am Wochenende stattfinden?", 
    answer: "Ja! Die meisten Büroumzüge finden am Wochenende statt, um Geschäftsausfälle zu vermeiden. Viele Anbieter haben sich darauf spezialisiert. Typisch: Abbau Freitag ab 17 Uhr, Aufbau Samstag/Sonntag, Montag produktiv." 
  },
  { 
    question: "Wie werden Computer und Monitore transportiert?", 
    answer: "IT-Equipment wird in speziellen Polsterboxen oder den Originalverpackungen transportiert. Kabel werden beschriftet und pro Arbeitsplatz gebündelt. Bei grösseren Umzügen empfehlen wir eine vorherige IT-Inventarisierung." 
  },
  { 
    question: "Wer baut die Büromöbel auf?", 
    answer: "Bei den meisten Anbietern ist die Möbelmontage (Ab- und Aufbau) im Preis enthalten. USM, Vitra oder andere Systemmmöbel werden von geschulten Teams montiert. Fragen Sie explizit nach, ob Montage inklusive ist." 
  },
  { 
    question: "Wie lange dauert ein Büroumzug?", 
    answer: "Richtwerte: 5-10 Arbeitsplätze: 1/2 bis 1 Tag, 15-30 Arbeitsplätze: 1-2 Tage, 30+ Arbeitsplätze: 2-3 Tage. Bei guter Vorbereitung (Kartons gepackt, IT vorbereitet) geht es schneller." 
  },
];

const officeSizes = [
  { value: "1-5", label: "1-5 Arbeitsplätze" },
  { value: "5-15", label: "5-15 Arbeitsplätze" },
  { value: "15-30", label: "15-30 Arbeitsplätze" },
  { value: "30-50", label: "30-50 Arbeitsplätze" },
  { value: "50+", label: "50+ Arbeitsplätze" },
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

export default function BueroumzugPage() {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(5);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [location, setLocation] = useState("");
  const [officeSize, setOfficeSize] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICE_SLUG);

  useEffect(() => {
    const interval = setInterval(() => setLiveViewers(prev => Math.max(3, Math.min(15, prev + Math.floor(Math.random() * 5) - 2))), 4500);
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
      officeSize, 
      date: moveDate, 
      service: SERVICE_SLUG, 
      moveType: "business",
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
        "name": "Büroumzug Schweiz", 
        "description": "Professioneller Büroumzug in der Schweiz. Wochenend-Service, IT-Umzug inklusive, Festpreisgarantie.", 
        "provider": { "@type": "Organization", "name": "Umzugscheck.ch" }, 
        "areaServed": { "@type": "Country", "name": "Schweiz" }, 
        "priceRange": "CHF 800 - CHF 15000+",
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "623" }
      },
      { "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>Büroumzug Schweiz | Wochenend-Service | Festpreis ab CHF 800</title>
        <meta name="description" content="Büroumzug Schweiz ✓ Wochenend-Service ✓ IT-Umzug inklusive ✓ Möbelmontage ✓ Festpreisgarantie ✓ Ab CHF 800 ✓ Kostenlose Offerten!" />
        <link rel="canonical" href="https://umzugscheck.ch/services/bueroumzug" />
        <meta property="og:title" content="Büroumzug – Montag wieder produktiv" />
        <meta property="og:description" content="Professioneller Büroumzug am Wochenende. IT, Möbel, Akten – alles aus einer Hand." />
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
                  <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white text-sm mb-4">
                    <Building2 className="w-4 h-4 mr-1" /><SelectValue />
                  </SelectTrigger>
                  <SelectContent>{relatedServices.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Wochenend-Service verfügbar</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  Büroumzug? <br className="hidden md:block" />
                  <span className="text-blue-400">Montag wieder produktiv.</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  Wir züügeln Ihr Büro am Wochenende – 
                  <strong className="text-blue-300"> IT, Möbel, Akten</strong>. 
                  <span className="block mt-2 text-green-400">Festpreis. Keine Überraschungen.</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-white"><AnimatedCounter end={1850} suffix="+" /></div>
                    <div className="text-xs text-white/60">Büros umgezogen</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-xs text-white/60">Ausfalltage</div>
                  </div>
                  <div className="text-2xl font-bold text-amber-400 flex items-center gap-1 justify-center lg:justify-start">
                    <Star className="w-6 h-6 fill-amber-400" />4.9
                  </div>
                </div>

                <div className="lg:hidden space-y-3">
                  <Button asChild size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-6">
                    <Link to="/umzugsofferten">🏢 Büroumzug anfragen<ArrowRight className="ml-2 w-5 h-5" /></Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
                <Card className="bg-white/[0.98] backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-3 text-sm font-medium">
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    Speziell für KMU & Start-ups
                  </div>
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <span className="text-4xl mb-3 block">🏢</span>
                      <h2 className="text-xl font-bold mb-2">Kostenlose Büroumzug-Offerte</h2>
                      <p className="text-sm text-muted-foreground">Inkl. Möbelmontage & IT-Transport</p>
                    </div>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Bürogrösse</Label>
                        <Select value={officeSize} onValueChange={setOfficeSize}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder="Anzahl Arbeitsplätze..." /></SelectTrigger>
                          <SelectContent>
                            {officeSizes.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Aktueller Standort</Label>
                        <div className="relative mt-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="PLZ oder Ort" className="pl-10" />
                        </div>
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

        {/* STATS */}
        <section className="py-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-y">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">Ab CHF 800</div>
                <div className="text-sm text-muted-foreground">Kleine Büros</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">Wochenende</div>
                <div className="text-sm text-muted-foreground">Service verfügbar</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">Festpreis</div>
                <div className="text-sm text-muted-foreground">Keine Überraschungen</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-muted-foreground">Inklusive Montage</div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICE EXAMPLES */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Preisbeispiele Büroumzug</h2>
              <p className="text-muted-foreground">Inkl. Transport, Montage & Versicherung</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {priceExamples.map((p, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="text-center hover:shadow-lg transition-all h-full">
                    <CardContent className="p-6">
                      <span className="text-4xl mb-4 block">{p.emoji}</span>
                      <h3 className="font-bold text-lg mb-1">{p.size}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{p.workstations} Arbeitsplätze</p>
                      <p className="text-2xl font-bold text-blue-600 mb-2">{p.price}</p>
                      <Badge variant="secondary">Dauer: {p.time}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Was ist inklusive?</h2>
              <p className="text-muted-foreground">Alles, was Sie für einen reibungslosen Büroumzug brauchen</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {included.map((item, i) => (
                <Card key={i} className="text-center p-6 hover:shadow-md transition-shadow">
                  <item.icon className="w-10 h-10 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Erfolgreiche Büroumzüge</h2>
              <p className="text-muted-foreground">Was unsere Geschäftskunden sagen</p>
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
                  <Card className="h-full hover:shadow-lg transition-all border-blue-100">
                    <CardContent className="p-6">
                      <Badge className="bg-blue-100 text-blue-700 mb-3">{t.workstations}</Badge>
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
                        <span className="text-sm text-green-600 font-medium">Gespart: CHF {t.savedAmount.toLocaleString('de-CH')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="container px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-5xl mb-6 block">🏢</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Bereit für den stressfreien Büroumzug?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Erhalten Sie kostenlos 3-5 Offerten von spezialisierten Büroumzug-Firmen. 
                Wochenend-Service, Festpreise, keine Überraschungen.
              </p>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90 font-bold text-lg px-8 py-6">
                <Link to="/umzugsofferten">
                  Kostenlose Offerten erhalten
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
              <h2 className="text-3xl font-bold mb-3">Häufige Fragen zum Büroumzug</h2>
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
            <Link to="/umzugsofferten">🏢 Jetzt Offerte anfragen</Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
