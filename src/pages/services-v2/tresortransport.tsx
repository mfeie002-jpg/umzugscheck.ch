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
  ClipboardList, ShieldCheck, BadgeCheck, ThumbsUp, Vault, Weight, Truck, Award
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=2000&q=80";
const SERVICE_NAME = "Tresortransport";
const SERVICE_SLUG = "tresortransport";

const relatedServices = [
  { value: "tresortransport", label: "Tresortransport", href: "/tresortransport" },
  { value: "spezialtransporte", label: "Spezialtransporte", href: "/spezialtransporte" },
  { value: "firmenumzug", label: "Firmenumzug", href: "/firmenumzug" },
  { value: "lagerung", label: "Lagerung", href: "/lagerung" },
];

const companies = [
  { 
    id: "tresor-profis", 
    name: "Tresor Profis Schweiz", 
    rating: 4.9, 
    reviewCount: 187, 
    badges: ["Schwerlast-Spezialist", "Versichert bis CHF 2 Mio"], 
    priceLevel: "Premium", 
    isPopular: true, 
    responseTime: "< 2h",
    quote: "Sicherheit transportieren – das ist unsere Expertise."
  },
  { 
    id: "schwerlast-express", 
    name: "Schwerlast Express", 
    rating: 4.8, 
    reviewCount: 234, 
    badges: ["Bis 5 Tonnen", "Kran-Service"], 
    priceLevel: "Mittel", 
    isBestPrice: true, 
    responseTime: "< 3h",
    quote: "Kein Tresor ist uns zu schwer."
  },
  { 
    id: "safe-movers", 
    name: "Safe Movers AG", 
    rating: 4.9, 
    reviewCount: 156, 
    badges: ["Bank-Referenzen", "Diskreter Service"], 
    priceLevel: "Premium", 
    isPremium: true, 
    responseTime: "< 4h",
    quote: "Vertrauen Sie den Experten für wertvolle Lasten."
  },
];

const priceExamples = [
  { size: "Kleintresor (bis 100kg)", price: "CHF 250 – 450", subtext: "Büro- oder Heimtresor", icon: Vault, savings: "bis CHF 150", emoji: "🔐" },
  { size: "Mitteltresor (100-300kg)", price: "CHF 450 – 800", subtext: "Mit Spezialequipment", icon: Vault, savings: "bis CHF 250", emoji: "🏦" },
  { size: "Grosstresor (300-800kg)", price: "CHF 800 – 1'500", subtext: "Treppen/Lift-Transport", icon: Weight, savings: "bis CHF 400", emoji: "💰" },
  { size: "Banktresor (800kg+)", price: "CHF 1'500 – 4'000", subtext: "Mit Kran oder Schwerlast-Heber", icon: Weight, savings: "bis CHF 1'000", emoji: "🏛️" },
];

const howItWorks = [
  { step: 1, title: "Tresor beschreiben", description: "Gewicht, Masse, Stockwerk angeben", icon: ClipboardList, time: "2 Min.", emoji: "📋" },
  { step: 2, title: "Spezialisten-Offerten", description: "Zertifizierte Schwerlast-Experten", icon: FileText, time: "24h", emoji: "📬" },
  { step: 3, title: "Sicherer Transport", description: "Mit Spezialfahrzeug & Equipment", icon: CheckCircle, time: "Ihr Termin", emoji: "🚛" },
];

const testimonials = [
  { 
    name: "Thomas K.", 
    location: "Zürich", 
    rating: 5, 
    text: "Unseren 600kg Wertschutztresor haben sie professionell und diskret in unser neues Büro transportiert. Top Service!",
    date: "vor 2 Wochen",
    badge: "Verifiziert",
    highlight: "600kg Tresor"
  },
  { 
    name: "Bank Helvetica", 
    location: "Basel", 
    rating: 5, 
    text: "Regelmässig beauftragen wir Safe Movers für unsere Tresor-Umzüge. Absolute Profis mit höchster Diskretion.",
    date: "vor 1 Monat",
    badge: "Business",
    highlight: "Bank-Referenz"
  },
  { 
    name: "Martina L.", 
    location: "Bern", 
    rating: 5, 
    text: "Mein antiker Tresor aus dem 19. Jahrhundert wurde mit grösster Sorgfalt aus dem 3. Stock transportiert.",
    date: "vor 3 Wochen",
    badge: "Verifiziert",
    highlight: "Antiker Tresor"
  },
];

const faqs = [
  {
    question: "Was kostet ein Tresortransport in der Schweiz?",
    answer: "Die Kosten für einen Tresortransport hängen vom Gewicht, Zugänglichkeit und Transportweg ab. Kleintresore bis 100kg kosten CHF 250-450, Grosstresore bis 800kg CHF 800-1'500. Für Banktresore über 800kg rechnen Sie mit CHF 1'500-4'000 inkl. Kran-Service."
  },
  {
    question: "Bis zu welchem Gewicht transportiert ihr Tresore?",
    answer: "Unsere Partner transportieren Tresore bis zu 5 Tonnen. Für sehr schwere Tresore setzen wir Spezialkräne, Hubwagen und verstärkte Transportfahrzeuge ein. Jeder Transport wird individuell geplant."
  },
  {
    question: "Ist mein Tresor während des Transports versichert?",
    answer: "Ja, alle unsere Partner sind vollversichert. Die Deckungssummen reichen von CHF 500'000 bis CHF 2 Mio. Bei wertvollen Tresorinhalten empfehlen wir eine zusätzliche Transportversicherung."
  },
  {
    question: "Wie wird der Tresor aus dem Gebäude gebracht?",
    answer: "Je nach Situation nutzen wir Treppensteiger, Möbellifte, Aussenkräne oder Schwerlast-Hubwagen. Bei engen Treppenhäusern kann ein Fassadenlift oder Demontage von Türrahmen nötig sein."
  },
  {
    question: "Wie lange dauert ein Tresortransport?",
    answer: "Ein Standardtransport dauert 2-4 Stunden. Bei Grosstresoren oder komplexen Zugangssituationen kann es einen halben bis ganzen Tag dauern. Wir planen jeden Transport sorgfältig voraus."
  },
];

const trustSignals = [
  { icon: Shield, text: "Versichert bis CHF 2 Mio", color: "text-green-600" },
  { icon: Award, text: "Zertifizierte Schwerlast-Experten", color: "text-blue-600" },
  { icon: Lock, text: "Diskret & vertraulich", color: "text-purple-600" },
  { icon: Clock, text: "Schweizweit innert 48h", color: "text-orange-600" },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Tresortransport Schweiz",
  "description": "Professioneller Tresortransport in der Schweiz. Schwerlast-Experten für Tresore bis 5 Tonnen mit Vollversicherung.",
  "provider": {
    "@type": "Organization",
    "name": "Umzugscheck.ch",
    "url": "https://umzugscheck.ch"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Switzerland"
  },
  "serviceType": "Tresortransport"
};

export default function TresortransportPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tresorTyp: "",
    gewicht: "",
    vonPLZ: "",
    nachPLZ: "",
    stockwerk: ""
  });
  
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/umzugsofferten?service=tresortransport&" + new URLSearchParams(formData as any).toString());
  };

  return (
    <>
      <Helmet>
        <title>Tresortransport Schweiz | Schwerlast-Experten bis 5t | Umzugscheck.ch</title>
        <meta name="description" content="Professioneller Tresortransport in der Schweiz ✓ Bis 5 Tonnen ✓ Versichert bis CHF 2 Mio ✓ Diskret & sicher ✓ Jetzt kostenlose Offerten vergleichen!" />
        <meta name="keywords" content="Tresortransport, Tresor transportieren, Schwerlasttransport, Safe Transport, Tresor Umzug, Schweiz" />
        <link rel="canonical" href="https://umzugscheck.ch/tresortransport" />
        <meta property="og:title" content="Tresortransport Schweiz | Schwerlast-Experten" />
        <meta property="og:description" content="Professioneller Tresortransport bis 5 Tonnen. Versichert, diskret, schweizweit." />
        <meta property="og:url" content="https://umzugscheck.ch/tresortransport" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
      </Helmet>

      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="container mx-auto px-4 py-16 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center text-white"
            >
              <Badge className="bg-primary/90 text-white mb-4 text-sm px-4 py-1">
                🔐 Schwerlast-Spezialisten
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Tresortransport Schweiz
                <span className="block text-2xl md:text-3xl font-normal mt-2 text-white/90">
                  Sicher. Diskret. Bis 5 Tonnen.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Ihr Tresor in sicheren Händen – Transport mit Vollversicherung, Spezialequipment und höchster Diskretion.
              </p>

              {/* Trust Signals */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {trustSignals.map((signal, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <signal.icon className={`w-4 h-4 ${signal.color}`} />
                    <span className="text-sm text-white">{signal.text}</span>
                  </div>
                ))}
              </div>

              {/* Quick Form */}
              <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tresorTyp" className="text-foreground">Tresortyp</Label>
                        <Select onValueChange={(v) => setFormData({...formData, tresorTyp: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Tresortyp wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="klein">Kleintresor (bis 100kg)</SelectItem>
                            <SelectItem value="mittel">Mitteltresor (100-300kg)</SelectItem>
                            <SelectItem value="gross">Grosstresor (300-800kg)</SelectItem>
                            <SelectItem value="bank">Banktresor (800kg+)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="stockwerk" className="text-foreground">Stockwerk</Label>
                        <Select onValueChange={(v) => setFormData({...formData, stockwerk: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Stockwerk wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eg">Erdgeschoss</SelectItem>
                            <SelectItem value="1">1. Stock</SelectItem>
                            <SelectItem value="2">2. Stock</SelectItem>
                            <SelectItem value="3">3. Stock+</SelectItem>
                            <SelectItem value="keller">Keller/UG</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vonPLZ" className="text-foreground">Von PLZ</Label>
                        <Input 
                          id="vonPLZ"
                          placeholder="z.B. 8001"
                          value={formData.vonPLZ}
                          onChange={(e) => setFormData({...formData, vonPLZ: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nachPLZ" className="text-foreground">Nach PLZ</Label>
                        <Input 
                          id="nachPLZ"
                          placeholder="z.B. 3011"
                          value={formData.nachPLZ}
                          onChange={(e) => setFormData({...formData, nachPLZ: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-14 text-lg" size="lg">
                      Kostenlose Offerten erhalten
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      ✓ 100% kostenlos & unverbindlich • ✓ Schweizweit • ✓ Versichert
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">So funktioniert's</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-4">{step.emoji}</div>
                  <div className="text-sm text-muted-foreground mb-2">{step.time}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Price Examples */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Tresortransport Preise</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Transparente Richtpreise für Ihren Tresortransport in der Schweiz
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {priceExamples.map((price, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{price.emoji}</div>
                    <h3 className="font-semibold mb-2">{price.size}</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{price.price}</div>
                    <div className="text-sm text-muted-foreground mb-2">{price.subtext}</div>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      Sparen Sie {price.savings}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Das sagen unsere Kunden</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((t, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{t.text}"</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-sm text-muted-foreground">{t.location} • {t.date}</div>
                      </div>
                      <Badge variant="secondary">{t.badge}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Häufige Fragen</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-medium">
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

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bereit für Ihren Tresortransport?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Erhalten Sie jetzt kostenlose Offerten von zertifizierten Schwerlast-Experten
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="h-14 px-8 text-lg"
              onClick={() => navigate("/umzugsofferten?service=tresortransport")}
            >
              Jetzt Offerten erhalten
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
    </>
  );
}
