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
  ClipboardList, ShieldCheck, BadgeCheck, ThumbsUp, Home, Heart, Sparkles, Award, Trash2, Package
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2000&q=80";
const SERVICE_NAME = "Haushaltsauflösung";
const SERVICE_SLUG = "haushaltsaufloesung";

const relatedServices = [
  { value: "haushaltsaufloesung", label: "Haushaltsauflösung", href: "/haushaltsaufloesung" },
  { value: "entsorgung", label: "Entsorgung", href: "/entsorgung" },
  { value: "reinigung", label: "Reinigung", href: "/reinigung" },
  { value: "seniorenumzug", label: "Seniorenumzug", href: "/seniorenumzug" },
];

const companies = [
  { 
    id: "aufloesung-express", 
    name: "Auflösungs Express Schweiz", 
    rating: 4.9, 
    reviewCount: 423, 
    badges: ["Komplett-Service", "Wertanrechnung"], 
    priceLevel: "Fair", 
    isPopular: true, 
    responseTime: "< 2h",
    quote: "Wir kümmern uns um alles – mit Respekt und Sorgfalt."
  },
  { 
    id: "haushalts-profis", 
    name: "Haushaltsprofis AG", 
    rating: 4.8, 
    reviewCount: 367, 
    badges: ["Seniorenfreundlich", "Besenrein-Garantie"], 
    priceLevel: "Mittel", 
    isBestPrice: true, 
    responseTime: "< 3h",
    quote: "Ihr Zuhause in guten Händen."
  },
  { 
    id: "zuerich-raeumungen", 
    name: "Zürich Räumungen", 
    rating: 4.9, 
    reviewCount: 289, 
    badges: ["Nachhaltigkeit", "Soziales Engagement"], 
    priceLevel: "Günstig", 
    isPremium: false, 
    responseTime: "< 4h",
    quote: "Brauchbares weitergeben, Rest umweltgerecht entsorgen."
  },
];

const priceExamples = [
  { size: "1-Zimmer Wohnung", price: "CHF 800 – 1'500", subtext: "Komplett besenrein", icon: Home, savings: "bis CHF 400", emoji: "🏠" },
  { size: "2-3 Zimmer Wohnung", price: "CHF 1'500 – 2'800", subtext: "Inkl. Entsorgung", icon: Home, savings: "bis CHF 700", emoji: "🏡" },
  { size: "4-5 Zimmer Wohnung", price: "CHF 2'800 – 4'500", subtext: "Komplettauflösung", icon: Home, savings: "bis CHF 1'000", emoji: "🏘️" },
  { size: "Haus / Grossobjekt", price: "CHF 4'500 – 12'000", subtext: "Keller & Estrich inkl.", icon: Home, savings: "bis CHF 2'500", emoji: "🏰" },
];

const howItWorks = [
  { step: 1, title: "Besichtigung anfordern", description: "Kostenlose Vor-Ort-Bewertung", icon: ClipboardList, time: "Termin", emoji: "📋" },
  { step: 2, title: "Festpreis-Offerte", description: "Transparent, keine Überraschungen", icon: FileText, time: "24h", emoji: "📬" },
  { step: 3, title: "Komplette Räumung", description: "Besenrein mit Abnahmegarantie", icon: CheckCircle, time: "1-3 Tage", emoji: "✨" },
];

const includedServices = [
  { icon: Package, title: "Komplett-Räumung", desc: "Alle Räume inkl. Keller/Estrich" },
  { icon: Trash2, title: "Fachgerechte Entsorgung", desc: "Recycling & Sondermüll" },
  { icon: Sparkles, title: "Besenreine Übergabe", desc: "Auf Wunsch mit Endreinigung" },
  { icon: Heart, title: "Wertanrechnung", desc: "Verkäufliches wird angerechnet" },
];

const testimonials = [
  { 
    name: "Familie Müller", 
    location: "Zürich", 
    rating: 5, 
    text: "Nach dem Tod meiner Mutter haben sie das Elternhaus würdevoll und respektvoll geräumt. Danke für die einfühlsame Arbeit.",
    date: "vor 2 Wochen",
    badge: "Verifiziert",
    highlight: "Erbschaftsräumung"
  },
  { 
    name: "Peter W.", 
    location: "Basel", 
    rating: 5, 
    text: "5-Zimmer-Wohnung komplett geräumt, besenrein übergeben. Sogar Wertanrechnung für die antiken Möbel. Super Service!",
    date: "vor 1 Monat",
    badge: "Verifiziert",
    highlight: "Wertanrechnung"
  },
  { 
    name: "Seniorenheim Sonnenberg", 
    location: "Bern", 
    rating: 5, 
    text: "Regelmässig beauftragen wir das Team für Zimmerräumungen. Immer zuverlässig, schnell und respektvoll.",
    date: "vor 3 Wochen",
    badge: "Business",
    highlight: "Seniorenheim"
  },
];

const faqs = [
  {
    question: "Was kostet eine Haushaltsauflösung in der Schweiz?",
    answer: "Die Kosten hängen von der Grösse der Wohnung und dem Räumungsaufwand ab. Eine 2-3 Zimmer Wohnung kostet ca. CHF 1'500-2'800. Bei wertvollen Gegenständen kann eine Wertanrechnung den Preis reduzieren."
  },
  {
    question: "Was passiert mit brauchbaren Gegenständen?",
    answer: "Verkäufliches wird angerechnet oder auf Wunsch gespendet. Viele unserer Partner arbeiten mit Brockenhäusern und sozialen Einrichtungen zusammen, um brauchbaren Hausrat weiterzugeben."
  },
  {
    question: "Wie schnell kann eine Haushaltsauflösung erfolgen?",
    answer: "Je nach Grösse dauert eine Räumung 1-3 Tage. In dringenden Fällen bieten wir Express-Service innerhalb von 24-48 Stunden an."
  },
  {
    question: "Ist eine Endreinigung inbegriffen?",
    answer: "Die besenreine Übergabe ist Standard. Eine professionelle Endreinigung mit Abnahmegarantie kann optional dazu gebucht werden – oft als Paket günstiger."
  },
  {
    question: "Räumt ihr auch Keller und Estrich?",
    answer: "Ja, die Komplettauflösung umfasst alle Räume inkl. Keller, Estrich, Garage und Gartenhäuschen. Sie erhalten einen Festpreis für das gesamte Objekt."
  },
];

const trustSignals = [
  { icon: Shield, text: "Festpreis-Garantie", color: "text-green-600" },
  { icon: Award, text: "Über 10'000 Auflösungen", color: "text-blue-600" },
  { icon: Heart, text: "Respektvoller Umgang", color: "text-pink-600" },
  { icon: Sparkles, text: "Besenrein-Garantie", color: "text-purple-600" },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Haushaltsauflösung Schweiz",
  "description": "Professionelle Haushaltsauflösung in der Schweiz. Komplette Räumung, Entsorgung und besenreine Übergabe zum Festpreis.",
  "provider": {
    "@type": "Organization",
    "name": "Umzugscheck.ch",
    "url": "https://umzugscheck.ch"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Switzerland"
  },
  "serviceType": "Haushaltsauflösung"
};

export default function HaushaltsaufloesungPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    zimmer: "",
    plz: "",
    grund: "",
    zeitrahmen: ""
  });
  
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/umzugsofferten?service=haushaltsaufloesung&" + new URLSearchParams(formData as any).toString());
  };

  return (
    <>
      <Helmet>
        <title>Haushaltsauflösung Schweiz | Komplett-Service zum Festpreis | Umzugscheck.ch</title>
        <meta name="description" content="Professionelle Haushaltsauflösung in der Schweiz ✓ Festpreis-Garantie ✓ Besenrein ✓ Wertanrechnung ✓ Jetzt kostenlose Offerten vergleichen!" />
        <meta name="keywords" content="Haushaltsauflösung, Wohnungsauflösung, Räumung, Entrümpelung, Nachlassauflösung, Schweiz" />
        <link rel="canonical" href="https://umzugscheck.ch/haushaltsaufloesung" />
        <meta property="og:title" content="Haushaltsauflösung Schweiz | Komplett-Service" />
        <meta property="og:description" content="Professionelle Haushaltsauflösung zum Festpreis. Besenrein mit Wertanrechnung." />
        <meta property="og:url" content="https://umzugscheck.ch/haushaltsaufloesung" />
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
                🏠 Komplett-Service
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Haushaltsauflösung Schweiz
                <span className="block text-2xl md:text-3xl font-normal mt-2 text-white/90">
                  Festpreis. Besenrein. Stressfrei.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Wir kümmern uns um alles – von der Räumung bis zur besenreinen Übergabe. Respektvoll und professionell.
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
                        <Label htmlFor="zimmer" className="text-foreground">Wohnungsgrösse</Label>
                        <Select onValueChange={(v) => setFormData({...formData, zimmer: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Grösse wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Zimmer</SelectItem>
                            <SelectItem value="2-3">2-3 Zimmer</SelectItem>
                            <SelectItem value="4-5">4-5 Zimmer</SelectItem>
                            <SelectItem value="haus">Haus / Grossobjekt</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="grund" className="text-foreground">Anlass</Label>
                        <Select onValueChange={(v) => setFormData({...formData, grund: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Anlass wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="umzug">Umzug</SelectItem>
                            <SelectItem value="erbschaft">Erbschaft / Nachlass</SelectItem>
                            <SelectItem value="seniorenheim">Umzug ins Heim</SelectItem>
                            <SelectItem value="mieterauswechsel">Mieterauswechsel</SelectItem>
                            <SelectItem value="sonstiges">Sonstiges</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="plz" className="text-foreground">PLZ</Label>
                        <Input 
                          id="plz"
                          placeholder="z.B. 8001"
                          value={formData.plz}
                          onChange={(e) => setFormData({...formData, plz: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zeitrahmen" className="text-foreground">Zeitrahmen</Label>
                        <Select onValueChange={(v) => setFormData({...formData, zeitrahmen: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Wann?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sofort">So schnell wie möglich</SelectItem>
                            <SelectItem value="1-2wochen">In 1-2 Wochen</SelectItem>
                            <SelectItem value="1monat">In ca. 1 Monat</SelectItem>
                            <SelectItem value="flexibel">Flexibel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-14 text-lg" size="lg">
                      Kostenlose Offerten erhalten
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      ✓ 100% kostenlos & unverbindlich • ✓ Festpreis-Garantie • ✓ Schweizweit
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Included Services */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Was ist inbegriffen?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {includedServices.map((service, i) => (
                <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <service.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
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
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Haushaltsauflösung Preise</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Transparente Richtpreise für Ihre Haushaltsauflösung in der Schweiz
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
        <section className="py-16">
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
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Häufige Fragen</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4 bg-background">
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
              Bereit für Ihre Haushaltsauflösung?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Erhalten Sie jetzt kostenlose Festpreis-Offerten von geprüften Räumungs-Experten
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="h-14 px-8 text-lg"
              onClick={() => navigate("/umzugsofferten?service=haushaltsaufloesung")}
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
