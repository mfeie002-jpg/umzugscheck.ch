import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Link } from "react-router-dom";
import { 
  Star, Shield, Clock, TrendingUp, CheckCircle, ArrowRight, MapPin, Users, Truck, Zap, 
  ChevronRight, Building2, Home, Package, LucideIcon, Video, Lock, BadgeCheck, 
  CircleDollarSign, ThumbsUp, ShieldCheck, ClipboardList, FileText, MessageCircle
} from "lucide-react";

export interface CantonCompany {
  name: string;
  rating: number;
  reviews: number;
  priceLevel: string;
  sponsored: boolean;
  available: boolean;
  badge: string | null;
}

export interface CantonPriceExample {
  size: string;
  range: string;
  avg: string;
}

export interface CantonService {
  name: string;
  icon: LucideIcon;
  link: string;
}

export interface CantonUSP {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export interface CantonFAQ {
  question: string;
  answer: string;
}

export interface CantonTestimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  verified?: boolean;
  savedAmount?: number;
}

export interface CantonGuarantee {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface CantonHowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  time?: string;
}

export interface CantonConfig {
  name: string;
  slug: string;
  tagline: string;
  icon: LucideIcon;
  iconColor?: string;
  cities: string[];
  companies: CantonCompany[];
  priceExamples: CantonPriceExample[];
  services: CantonService[];
  usps: CantonUSP[];
  faqs: CantonFAQ[];
  testimonials?: CantonTestimonial[];
  guarantees?: CantonGuarantee[];
  howItWorks?: CantonHowItWorksStep[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  localInfo: {
    title: string;
    paragraphs: { title?: string; text: string }[];
  };
  notificationCity: string;
  activeUsersBase: number;
}

interface CantonTemplateProps {
  config: CantonConfig;
  children?: ReactNode;
}

// Default data for cantons that don't have custom data yet
const defaultTestimonials: CantonTestimonial[] = [
  { name: "Thomas M.", location: "", rating: 5, text: "Sehr professionell und pünktlich. Die Vergleichsmöglichkeit hat mir viel Zeit gespart!", date: "vor 3 Tagen", verified: true, savedAmount: 320 },
  { name: "Sandra K.", location: "", rating: 5, text: "Dank dem Vergleich konnte ich über CHF 400 sparen. Absolut empfehlenswert!", date: "vor 1 Woche", verified: true, savedAmount: 420 },
  { name: "Peter L.", location: "", rating: 5, text: "Schnelle Offerten und super Service. Die Firma war sehr zuverlässig.", date: "vor 2 Wochen", verified: true, savedAmount: 280 },
];

const defaultGuarantees: CantonGuarantee[] = [
  { title: "Versicherungs-Garantie", description: "Alle Partner sind vollversichert", icon: ShieldCheck },
  { title: "Fixpreis-Garantie", description: "Keine versteckten Zusatzkosten", icon: CircleDollarSign },
  { title: "Qualitäts-Garantie", description: "Nur geprüfte Umzugsfirmen", icon: BadgeCheck },
  { title: "Zufriedenheits-Garantie", description: "Wir helfen bei Problemen", icon: ThumbsUp },
];

const defaultHowItWorks: CantonHowItWorksStep[] = [
  { step: 1, title: "Anfrage stellen", description: "Umzugsdaten eingeben", icon: ClipboardList, time: "30 Sek." },
  { step: 2, title: "Offerten erhalten", description: "3-5 kostenlose Angebote", icon: FileText, time: "24-48h" },
  { step: 3, title: "Firma wählen", description: "Vergleichen und buchen", icon: CheckCircle, time: "Ihr Termin" },
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

export const CantonTemplate = ({ config, children }: CantonTemplateProps) => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [rooms, setRooms] = useState("3");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState(config.activeUsersBase);
  const [showNotification, setShowNotification] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = config.testimonials?.length ? config.testimonials : defaultTestimonials.map(t => ({ ...t, location: config.name }));
  const guarantees = config.guarantees?.length ? config.guarantees : defaultGuarantees;
  const howItWorks = config.howItWorks?.length ? config.howItWorks : defaultHowItWorks;

  useEffect(() => {
    const i = setInterval(() => setActiveUsers(p => Math.max(config.activeUsersBase - 4, p + Math.floor(Math.random() * 3) - 1)), 5000);
    return () => clearInterval(i);
  }, [config.activeUsersBase]);

  useEffect(() => {
    const t = setTimeout(() => setShowNotification(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial(prev => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleServiceToggle = (s: string) => setSelectedServices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const Icon = config.icon;

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": `Umzugsfirmen ${config.name}`,
        "description": config.seo.description,
        "areaServed": { "@type": "AdministrativeArea", "name": config.name },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": config.companies.reduce((sum, c) => sum + c.reviews, 0).toString() }
      },
      {
        "@type": "FAQPage",
        "mainEntity": config.faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>{config.seo.title}</title>
        <meta name="description" content={config.seo.description} />
        <meta name="keywords" content={config.seo.keywords} />
        <link rel="canonical" href={`https://umzugscheck.ch/umzugsfirmen/${config.slug}`} />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      {/* Live Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 100 }} 
            className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium">Neue Buchung in {config.notificationCity}</p>
                <p className="text-xs text-muted-foreground">vor {Math.floor(Math.random() * 10) + 1} Minuten</p>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-muted-foreground hover:text-foreground">×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-full text-success text-sm font-medium mb-4">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                </span>
                <span className="font-bold">{activeUsers}</span> Personen vergleichen gerade
              </motion.div>

              <Badge className="mb-4 bg-accent/10 text-accent border-accent/30">
                <Icon className="h-3 w-3 mr-1" />{config.tagline}
              </Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Umzugsfirmen in <span className="text-primary">{config.name}</span> vergleichen
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                Finden Sie die besten Umzugsfirmen in {config.name} und Umgebung. Kostenlose Offerten von geprüften Partnern – <span className="text-primary font-semibold">bis zu 40% sparen</span>.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary"><AnimatedCounter end={config.companies.reduce((sum, c) => sum + c.reviews, 0)} suffix="+" /></div>
                  <div className="text-xs text-muted-foreground">Bewertungen</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary"><AnimatedCounter end={config.companies.length * 20} suffix="+" /></div>
                  <div className="text-xs text-muted-foreground">Firmen</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-amber-500 flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />4.8
                  </div>
                  <div className="text-xs text-muted-foreground">Bewertung</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Daten bleiben in der Schweiz</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-2 border-primary/20 shadow-2xl bg-card/95">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Schnelle Offerte</h3>
                      <p className="text-xs text-muted-foreground">In 2 Minuten</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Von</Label>
                        <select value={fromCity} onChange={e => setFromCity(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm">
                          <option value="">Wählen</option>
                          {config.cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm">Nach</Label>
                        <select value={toCity} onChange={e => setToCity(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm">
                          <option value="">Wählen</option>
                          {config.cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Grösse</Label>
                      <select value={rooms} onChange={e => setRooms(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm">
                        {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r === 5 ? '5+' : r} Zimmer</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block">Services</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Reinigung", "Entsorgung", "Packen", "Montage"].map(s => (
                          <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox checked={selectedServices.includes(s)} onCheckedChange={() => handleServiceToggle(s)} />
                            {s}
                          </label>
                        ))}
                      </div>
                    </div>
                    <Link to={`/umzugsofferten?from=${fromCity}&to=${toCity}&rooms=${rooms}&region=${config.slug}`}>
                      <Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90">
                        Kostenlos Offerten erhalten
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground">✓ Kostenlos ✓ Unverbindlich ✓ Keine Anmeldung</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STATS BAR */}
      <section className="py-8 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { icon: Shield, label: "100% Versichert", desc: "Alle Partner vollversichert" },
              { icon: BadgeCheck, label: "Geprüfte Qualität", desc: "Strenge Qualitätsstandards" },
              { icon: Lock, label: "Datenschutz", desc: "Swiss-Hosting, DSGVO-konform" },
              { icon: CheckCircle, label: "Verifiziert", desc: "Alle Firmen überprüft" },
              { icon: Users, label: `${(config.activeUsersBase * 650).toLocaleString()}+ Kunden`, desc: "Zufriedene Nutzer" },
              { icon: Star, label: "4.8/5 Sterne", desc: "Durchschnittsbewertung" },
            ].map((signal, i) => {
              const SIcon = signal.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <SIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="hidden md:block">
                    <p className="font-medium text-sm">{signal.label}</p>
                    <p className="text-xs text-muted-foreground">{signal.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. TESTIMONIALS */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Das sagen unsere Kunden aus {config.name}</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, j) => <Star key={j} className={`h-4 w-4 ${j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">"{t.text}"</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.location} · {t.date}</p>
                      </div>
                      {t.verified && (
                        <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                          <CheckCircle className="h-3 w-3 mr-1" />Verifiziert
                        </Badge>
                      )}
                    </div>
                    {t.savedAmount && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-success font-medium">💰 CHF {t.savedAmount} gespart</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TOP COMPANIES */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Top Umzugsfirmen in {config.name}</h2>
          <div className="space-y-3 max-w-4xl mx-auto">
            {config.companies.map((c, i) => (
              <Card key={c.name} className={`hover:shadow-lg transition-all ${c.sponsored ? 'border-primary/30 bg-primary/5' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{c.name}</h3>
                        {c.sponsored && <Badge variant="outline" className="text-xs bg-primary/10">Gesponsert</Badge>}
                        {c.badge && <Badge variant="secondary" className="text-xs">{c.badge}</Badge>}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {c.rating} ({c.reviews} Bewertungen)
                        <Badge variant="outline" className="text-xs">{c.priceLevel}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.available ? (
                        <Badge className="bg-success/10 text-success">Verfügbar</Badge>
                      ) : (
                        <Badge variant="outline">Ausgebucht</Badge>
                      )}
                      <Button size="sm" className="bg-primary">Offerte</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to={`/firmen?region=${config.slug}`}>
              <Button variant="outline" size="lg">
                Alle Umzugsfirmen in {config.name}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. PRICING EXAMPLES */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Umzugspreise in {config.name}</h2>
          <p className="text-center text-muted-foreground mb-8">Richtwerte für Umzüge innerhalb des Kantons</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {config.priceExamples.map((p, i) => (
              <motion.div key={p.size} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="text-center hover:shadow-lg transition-all h-full">
                  <CardContent className="p-6">
                    <Home className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">{p.size}</h3>
                    <p className="text-2xl font-bold text-primary">{p.avg}</p>
                    <p className="text-sm text-muted-foreground">{p.range}</p>
                    <Badge className="mt-3 bg-success/10 text-success border-0">Bis 40% sparen</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">So funktioniert's</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center relative">
                  {i < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-primary/20" />
                  )}
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                    <StepIcon className="h-7 w-7 text-primary" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {step.time && <Badge variant="outline" className="mt-2">{step.time}</Badge>}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. AI VIDEO CALCULATOR CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto overflow-hidden border-2 border-primary/20">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/30">
                    <Video className="h-3 w-3 mr-1" />Neu: KI-Video-Analyse
                  </Badge>
                  <h3 className="text-2xl font-bold mb-3">Umzugskosten per Video berechnen</h3>
                  <p className="text-muted-foreground mb-4">
                    Filmen Sie einfach Ihre Wohnung. Unsere KI analysiert automatisch Ihr Inventar und berechnet den Umzugspreis.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["Automatische Volumenberechnung", "Präzise Kostenschätzung", "In 5 Minuten erledigt"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to="/video-schaetzung">
                    <Button className="w-full md:w-auto">
                      Video-Schätzung starten
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="h-16 w-16 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 8. GUARANTEES */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Unsere Garantien</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {guarantees.map((g, i) => {
              const GIcon = g.icon;
              return (
                <motion.div key={g.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="h-full hover:shadow-lg transition-all text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <GIcon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{g.title}</h3>
                      <p className="text-sm text-muted-foreground">{g.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. SERVICES */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Zusatzservices in {config.name}</h2>
          <p className="text-center text-muted-foreground mb-8">Alles aus einer Hand für Ihren Umzug</p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {config.services.map(s => {
              const ServiceIcon = s.icon;
              return (
                <Link key={s.name} to={s.link}>
                  <Card className="hover:shadow-lg hover:border-primary/30 transition-all h-full">
                    <CardContent className="p-4 text-center">
                      <ServiceIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">{s.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. LOCAL INFO */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">{config.localInfo.title}</h2>
          <div className="prose prose-gray max-w-none text-muted-foreground">
            {config.localInfo.paragraphs.map((p, i) => (
              <div key={i}>
                {p.title && <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">{p.title}</h3>}
                <p className="mb-4">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {config.cities.map(city => (
              <Badge key={city} variant="outline" className="text-sm">
                <MapPin className="h-3 w-3 mr-1" />{city}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-8">Häufige Fragen zu Umzügen in {config.name}</h2>
          <FAQAccordion items={config.faqs} />
        </div>
      </section>

      {children}

      {/* 12. FINAL CTA */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Bereit für Ihren Umzug in {config.name}?</h2>
          <p className="mb-6 opacity-90 max-w-xl mx-auto">Vergleichen Sie jetzt kostenlos die besten Umzugsfirmen und sparen Sie bis zu 40%</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/umzugsofferten">
              <Button size="lg" variant="secondary" className="h-12 px-8 font-semibold">
                Jetzt Offerten erhalten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="tel:+41441234567">
              <Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <MessageCircle className="mr-2 h-4 w-4" />
                Beratung anrufen
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* STICKY MOBILE BAR */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border p-3 md:hidden shadow-lg">
            <Link to="/umzugsofferten">
              <Button className="w-full h-12 font-semibold">
                Kostenlos Offerten erhalten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
