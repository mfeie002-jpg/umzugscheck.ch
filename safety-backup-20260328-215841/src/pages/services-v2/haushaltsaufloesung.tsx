import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
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
const SERVICE_NAME = "HaushaltsauflÃ¶sung";
const SERVICE_SLUG = "haushaltsaufloesung";

const relatedServices = [
  { value: "haushaltsaufloesung", label: "HaushaltsauflÃ¶sung", href: "/haushaltsaufloesung" },
  { value: "entsorgung", label: "Entsorgung", href: "/entsorgung" },
  { value: "reinigung", label: "Reinigung", href: "/reinigung" },
  { value: "seniorenumzug", label: "Seniorenumzug", href: "/seniorenumzug" },
];

const companies = [
  { id: "feierabend-services-gmbh", name: "Feierabend Services GmbH", rating: 4.9, reviewCount: 312, badges: ["Demo", "Top bewertet"], services: ["Umzug", "Firmenumzug", "Reinigung"], priceLevel: "Premium", isPopular: true, responseTime: "< 1h" },
  { 
    id: "aufloesung-express", 
    name: "AuflÃ¶sungs Express Schweiz", 
    rating: 4.9, 
    reviewCount: 423, 
    badges: ["Komplett-Service", "Wertanrechnung"], 
    priceLevel: "Fair", 
    isPopular: true, 
    responseTime: "< 2h",
    quote: "Wir kÃ¼mmern uns um alles â€“ mit Respekt und Sorgfalt."
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
    quote: "Ihr Zuhause in guten HÃ¤nden."
  },
  { 
    id: "zuerich-raeumungen", 
    name: "ZÃ¼rich RÃ¤umungen", 
    rating: 4.9, 
    reviewCount: 289, 
    badges: ["Nachhaltigkeit", "Soziales Engagement"], 
    priceLevel: "GÃ¼nstig", 
    isPremium: false, 
    responseTime: "< 4h",
    quote: "Brauchbares weitergeben, Rest umweltgerecht entsorgen."
  },
];

const priceExamples = [
  { size: "1-Zimmer Wohnung", price: "CHF 800 â€“ 1'500", subtext: "Komplett besenrein", icon: Home, savings: "bis CHF 400", emoji: "ðŸ " },
  { size: "2-3 Zimmer Wohnung", price: "CHF 1'500 â€“ 2'800", subtext: "Inkl. Entsorgung", icon: Home, savings: "bis CHF 700", emoji: "ðŸ¡" },
  { size: "4-5 Zimmer Wohnung", price: "CHF 2'800 â€“ 4'500", subtext: "KomplettauflÃ¶sung", icon: Home, savings: "bis CHF 1'000", emoji: "ðŸ˜ï¸" },
  { size: "Haus / Grossobjekt", price: "CHF 4'500 â€“ 12'000", subtext: "Keller & Estrich inkl.", icon: Home, savings: "bis CHF 2'500", emoji: "ðŸ°" },
];

const howItWorks = [
  { step: 1, title: "Besichtigung anfordern", description: "Kostenlose Vor-Ort-Bewertung", icon: ClipboardList, time: "Termin", emoji: "ðŸ“‹" },
  { step: 2, title: "Festpreis-Offerte", description: "Transparent, keine Ãœberraschungen", icon: FileText, time: "24h", emoji: "ðŸ“¬" },
  { step: 3, title: "Komplette RÃ¤umung", description: "Besenrein mit Abnahmegarantie", icon: CheckCircle, time: "1-3 Tage", emoji: "âœ¨" },
];

const includedServices = [
  { icon: Package, title: "Komplett-RÃ¤umung", desc: "Alle RÃ¤ume inkl. Keller/Estrich" },
  { icon: Trash2, title: "Fachgerechte Entsorgung", desc: "Recycling & SondermÃ¼ll" },
  { icon: Sparkles, title: "Besenreine Ãœbergabe", desc: "Auf Wunsch mit Endreinigung" },
  { icon: Heart, title: "Wertanrechnung", desc: "VerkÃ¤ufliches wird angerechnet" },
];

const testimonials = [
  { 
    name: "Familie MÃ¼ller", 
    location: "ZÃ¼rich", 
    rating: 5, 
    text: "Nach dem Tod meiner Mutter haben sie das Elternhaus wÃ¼rdevoll und respektvoll gerÃ¤umt. Danke fÃ¼r die einfÃ¼hlsame Arbeit.",
    date: "vor 2 Wochen",
    badge: "Verifiziert",
    highlight: "ErbschaftsrÃ¤umung"
  },
  { 
    name: "Peter W.", 
    location: "Basel", 
    rating: 5, 
    text: "5-Zimmer-Wohnung komplett gerÃ¤umt, besenrein Ã¼bergeben. Sogar Wertanrechnung fÃ¼r die antiken MÃ¶bel. Super Service!",
    date: "vor 1 Monat",
    badge: "Verifiziert",
    highlight: "Wertanrechnung"
  },
  { 
    name: "Seniorenheim Sonnenberg", 
    location: "Bern", 
    rating: 5, 
    text: "RegelmÃ¤ssig beauftragen wir das Team fÃ¼r ZimmerrÃ¤umungen. Immer zuverlÃ¤ssig, schnell und respektvoll.",
    date: "vor 3 Wochen",
    badge: "Business",
    highlight: "Seniorenheim"
  },
];

const faqs = [
  {
    question: "Was kostet eine HaushaltsauflÃ¶sung in der Schweiz?",
    answer: "Die Kosten hÃ¤ngen von der GrÃ¶sse der Wohnung und dem RÃ¤umungsaufwand ab. Eine 2-3 Zimmer Wohnung kostet ca. CHF 1'500-2'800. Bei wertvollen GegenstÃ¤nden kann eine Wertanrechnung den Preis reduzieren."
  },
  {
    question: "Was passiert mit brauchbaren GegenstÃ¤nden?",
    answer: "VerkÃ¤ufliches wird angerechnet oder auf Wunsch gespendet. Viele unserer Partner arbeiten mit BrockenhÃ¤usern und sozialen Einrichtungen zusammen, um brauchbaren Hausrat weiterzugeben."
  },
  {
    question: "Wie schnell kann eine HaushaltsauflÃ¶sung erfolgen?",
    answer: "Je nach GrÃ¶sse dauert eine RÃ¤umung 1-3 Tage. In dringenden FÃ¤llen bieten wir Express-Service innerhalb von 24-48 Stunden an."
  },
  {
    question: "Ist eine Endreinigung inbegriffen?",
    answer: "Die besenreine Ãœbergabe ist Standard. Eine professionelle Endreinigung mit Abnahmegarantie kann optional dazu gebucht werden â€“ oft als Paket gÃ¼nstiger."
  },
  {
    question: "RÃ¤umt ihr auch Keller und Estrich?",
    answer: "Ja, die KomplettauflÃ¶sung umfasst alle RÃ¤ume inkl. Keller, Estrich, Garage und GartenhÃ¤uschen. Sie erhalten einen Festpreis fÃ¼r das gesamte Objekt."
  },
];

const trustSignals = [
  { icon: Shield, text: "Festpreis-Garantie", color: "text-green-600" },
  { icon: Award, text: "Ãœber 10'000 AuflÃ¶sungen", color: "text-blue-600" },
  { icon: Heart, text: "Respektvoller Umgang", color: "text-pink-600" },
  { icon: Sparkles, text: "Besenrein-Garantie", color: "text-purple-600" },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "HaushaltsauflÃ¶sung Schweiz",
  "description": "Professionelle HaushaltsauflÃ¶sung in der Schweiz. Komplette RÃ¤umung, Entsorgung und besenreine Ãœbergabe zum Festpreis.",
  "provider": {
    "@type": "Organization",
    "name": "Umzugscheck.ch",
    "url": "https://umzugscheck.ch"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Switzerland"
  },
  "serviceType": "HaushaltsauflÃ¶sung"
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
        <title>HaushaltsauflÃ¶sung Schweiz | Komplett-Service zum Festpreis | Umzugscheck.ch</title>
        <meta name="description" content="Professionelle HaushaltsauflÃ¶sung in der Schweiz âœ“ Festpreis-Garantie âœ“ Besenrein âœ“ Wertanrechnung âœ“ Jetzt kostenlose Offerten vergleichen!" />
        <meta name="keywords" content="HaushaltsauflÃ¶sung, WohnungsauflÃ¶sung, RÃ¤umung, EntrÃ¼mpelung, NachlassauflÃ¶sung, Schweiz" />
        <link rel="canonical" href="https://umzugscheck.ch/haushaltsaufloesung" />
        <meta property="og:title" content="HaushaltsauflÃ¶sung Schweiz | Komplett-Service" />
        <meta property="og:description" content="Professionelle HaushaltsauflÃ¶sung zum Festpreis. Besenrein mit Wertanrechnung." />
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
                ðŸ  Komplett-Service
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                HaushaltsauflÃ¶sung Schweiz
                <span className="block text-2xl md:text-3xl font-normal mt-2 text-white/90">
                  Festpreis. Besenrein. Stressfrei.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Wir kÃ¼mmern uns um alles â€“ von der RÃ¤umung bis zur besenreinen Ãœbergabe. Respektvoll und professionell.
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
                        <Label htmlFor="zimmer" className="text-foreground">WohnungsgrÃ¶sse</Label>
                        <Select onValueChange={(v) => setFormData({...formData, zimmer: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="GrÃ¶sse wÃ¤hlen" />
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
                            <SelectValue placeholder="Anlass wÃ¤hlen" />
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
                            <SelectItem value="sofort">So schnell wie mÃ¶glich</SelectItem>
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
                      âœ“ 100% kostenlos & unverbindlich â€¢ âœ“ Festpreis-Garantie â€¢ âœ“ Schweizweit
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
            <h2 className="text-3xl font-bold text-center mb-4">HaushaltsauflÃ¶sung Preise</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Transparente Richtpreise fÃ¼r Ihre HaushaltsauflÃ¶sung in der Schweiz
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
                        <div className="text-sm text-muted-foreground">{t.location} â€¢ {t.date}</div>
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
            <h2 className="text-3xl font-bold text-center mb-12">HÃ¤ufige Fragen</h2>
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
              Bereit fÃ¼r Ihre HaushaltsauflÃ¶sung?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Erhalten Sie jetzt kostenlose Festpreis-Offerten von geprÃ¼ften RÃ¤umungs-Experten
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

