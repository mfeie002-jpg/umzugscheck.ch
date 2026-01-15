import { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  Star, Shield, ArrowRight, Clock, FileText, CheckCircle,
  ClipboardList, Users, Award, Hammer, Package
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=80";

const priceExamples = [
  { size: "1 Helfer / Stunde", price: "CHF 35 – 50", subtext: "Einzelne Aufgaben", emoji: "👤" },
  { size: "2 Helfer / halber Tag", price: "CHF 280 – 400", subtext: "4 Stunden Einsatz", emoji: "👥" },
  { size: "2 Helfer / ganzer Tag", price: "CHF 500 – 750", subtext: "8 Stunden Einsatz", emoji: "💪" },
  { size: "Team (3-4 Helfer)", price: "CHF 800 – 1'200", subtext: "Ganzer Tag, grosse Projekte", emoji: "🏋️" },
];

const howItWorks = [
  { step: 1, title: "Bedarf angeben", description: "Anzahl Helfer, Datum, Aufgaben", icon: ClipboardList, time: "2 Min.", emoji: "📝" },
  { step: 2, title: "Helfer-Offerten", description: "Geprüfte Anbieter melden sich", icon: FileText, time: "24h", emoji: "📬" },
  { step: 3, title: "Zupacken lassen", description: "Professionelle Unterstützung", icon: CheckCircle, time: "Ihr Termin", emoji: "🤝" },
];

const services = [
  { icon: Package, title: "Kisten tragen", desc: "Schleppen und Transport" },
  { icon: Hammer, title: "Möbel ab-/aufbauen", desc: "Demontage & Montage" },
  { icon: Users, title: "Ein-/Ausladen", desc: "Transporter beladen" },
  { icon: Shield, title: "Schwere Gegenstände", desc: "Waschmaschine, Kühlschrank etc." },
];

const testimonials = [
  { 
    name: "Sarah M.", 
    location: "Zürich", 
    rating: 5, 
    text: "Zwei super nette Helfer haben mir den ganzen Umzug erleichtert. In 5 Stunden war alles erledigt!",
    date: "vor 1 Woche"
  },
  { 
    name: "Marco L.", 
    location: "Basel", 
    rating: 5, 
    text: "Endlich bezahlbare Umzugshelfer gefunden. Die Jungs waren pünktlich, fleissig und haben sogar beim Aufbauen geholfen.",
    date: "vor 2 Wochen"
  },
  { 
    name: "Lena K.", 
    location: "Bern", 
    rating: 5, 
    text: "Als Studentin konnte ich mir keine teure Umzugsfirma leisten. Die Helfer waren die perfekte Lösung!",
    date: "vor 3 Wochen"
  },
];

const faqs = [
  {
    question: "Was kostet ein Umzugshelfer pro Stunde?",
    answer: "Umzugshelfer kosten in der Schweiz durchschnittlich CHF 35-50 pro Stunde. Bei Buchung für einen ganzen Tag gibt es oft Pauschalpreise ab CHF 250 pro Helfer."
  },
  {
    question: "Sind die Helfer versichert?",
    answer: "Ja, alle Helfer über unsere Plattform sind haftpflichtversichert. Schäden an Ihrem Eigentum sind abgedeckt."
  },
  {
    question: "Kann ich nur Helfer ohne Transporter buchen?",
    answer: "Ja, Sie können reine Tragehilfe buchen, wenn Sie selbst einen Transporter haben. Alternativ vermitteln wir auch Helfer mit Fahrzeug."
  },
  {
    question: "Wie kurzfristig kann ich Helfer buchen?",
    answer: "Oft ist auch kurzfristige Buchung am Vortag oder sogar am selben Tag möglich. Je früher Sie buchen, desto besser die Auswahl."
  },
];

const trustSignals = [
  { icon: Shield, text: "Versicherte Helfer", color: "text-green-600" },
  { icon: Award, text: "Geprüfte Profile", color: "text-blue-600" },
  { icon: Clock, text: "Flexible Buchung", color: "text-purple-600" },
  { icon: Users, text: "2'500+ Helfer schweizweit", color: "text-orange-600" },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Umzugshelfer Schweiz",
  "description": "Professionelle Umzugshelfer in der Schweiz. Flexible Buchung, versichert, ab CHF 35/Stunde.",
  "provider": {
    "@type": "Organization",
    "name": "Umzugscheck.ch",
    "url": "https://umzugscheck.ch"
  },
  "areaServed": { "@type": "Country", "name": "Switzerland" },
  "serviceType": "Umzugshelfer"
};

export default function UmzugshelferPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    anzahl: "",
    dauer: "",
    plz: "",
    aufgaben: ""
  });
  
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/umzugsofferten?service=umzugshelfer&" + new URLSearchParams(formData as any).toString());
  };

  return (
    <>
      <Helmet>
        <title>Umzugshelfer Schweiz | Ab CHF 35/Stunde | Umzugscheck.ch</title>
        <meta name="description" content="Professionelle Umzugshelfer in der Schweiz ✓ Ab CHF 35/Stunde ✓ Versichert ✓ Flexible Buchung ✓ Jetzt kostenlose Offerten vergleichen!" />
        <meta name="keywords" content="Umzugshelfer, Umzugshilfe, Tragehilfe, Möbelträger, Umzug Helfer, Schweiz" />
        <link rel="canonical" href="https://umzugscheck.ch/umzugshelfer" />
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
                💪 Flexible Unterstützung
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Umzugshelfer Schweiz
                <span className="block text-2xl md:text-3xl font-normal mt-2 text-white/90">
                  Ab CHF 35/Stunde. Versichert. Zuverlässig.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Starke Hände, wenn Sie sie brauchen – flexible Umzugshilfe für jeden Bedarf.
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
                        <Label htmlFor="anzahl" className="text-foreground">Anzahl Helfer</Label>
                        <Select onValueChange={(v) => setFormData({...formData, anzahl: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Helfer</SelectItem>
                            <SelectItem value="2">2 Helfer</SelectItem>
                            <SelectItem value="3">3 Helfer</SelectItem>
                            <SelectItem value="4+">4+ Helfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="dauer" className="text-foreground">Einsatzdauer</Label>
                        <Select onValueChange={(v) => setFormData({...formData, dauer: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2-3h">2-3 Stunden</SelectItem>
                            <SelectItem value="halbtag">Halber Tag (4h)</SelectItem>
                            <SelectItem value="ganztag">Ganzer Tag (8h)</SelectItem>
                            <SelectItem value="mehrere">Mehrere Tage</SelectItem>
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
                        <Label htmlFor="aufgaben" className="text-foreground">Hauptaufgabe</Label>
                        <Select onValueChange={(v) => setFormData({...formData, aufgaben: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tragen">Kisten tragen</SelectItem>
                            <SelectItem value="moebel">Möbel ab-/aufbauen</SelectItem>
                            <SelectItem value="laden">Ein-/Ausladen</SelectItem>
                            <SelectItem value="komplett">Alles zusammen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-14 text-lg" size="lg">
                      Kostenlose Offerten erhalten
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      ✓ 100% kostenlos & unverbindlich • ✓ Versicherte Helfer • ✓ Schweizweit
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Wobei helfen wir?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {services.map((service, i) => (
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
            <h2 className="text-3xl font-bold text-center mb-4">Umzugshelfer Preise</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Transparente Richtpreise für Umzugshelfer in der Schweiz
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {priceExamples.map((price, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{price.emoji}</div>
                    <h3 className="font-semibold mb-2">{price.size}</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{price.price}</div>
                    <div className="text-sm text-muted-foreground">{price.subtext}</div>
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
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-muted-foreground">{t.location} • {t.date}</div>
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
              Starke Helfer für Ihren Umzug?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Jetzt kostenlos Offerten von geprüften Umzugshelfern erhalten
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="h-14 px-8 text-lg"
              onClick={() => navigate("/umzugsofferten?service=umzugshelfer")}
            >
              Jetzt Helfer finden
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
    </>
  );
}
