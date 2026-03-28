import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Recycle, Leaf, Home, Truck, CheckCircle, Star, Phone, Award, Banknote, Shield, Building2, ArrowRight, Calendar, ThumbsUp, MapPin, FileCheck, Zap, Clock, Users, Trash2, Package, AlertTriangle } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureList } from "@/components/ui/feature-list";
import { CTASection } from "@/components/CTASection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";
import { motion } from "framer-motion";

export default function DisposalService() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: pricesRef, isVisible: pricesVisible } = useScrollAnimation();
  const { ref: processRef, isVisible: processVisible } = useScrollAnimation();
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation();
  const { ref: itemsRef, isVisible: itemsVisible } = useScrollAnimation();
  const { ref: regionsRef, isVisible: regionsVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "Was kostet eine Entsorgung in der Schweiz?",
      answer: "Die Kosten hängen von Menge und Art der Gegenstände ab. Kleine Entsorgungen starten bei CHF 200, grössere Wohnungsräumungen bei CHF 800–2'000."
    },
    {
      question: "Welche Gegenstände können entsorgt werden?",
      answer: "Möbel, Elektrogeräte, Hausrat, Sperrmüll. Sonderfall: Sondermüll wie Chemikalien oder Asbest benötigen Spezialentsorgung."
    },
    {
      question: "Ist die Entsorgung umweltfreundlich?",
      answer: "Ja, alle Partner-Firmen entsorgen fachgerecht und trennen recycelbare Materialien. Viele bieten CO₂-Kompensation an."
    },
    {
      question: "Kann die Entsorgung mit dem Umzug kombiniert werden?",
      answer: "Ja, Sie können Umzug und Entsorgung als Paket buchen – oft günstiger als getrennte Services."
    },
    {
      question: "Wie schnell kann die Entsorgung erfolgen?",
      answer: "Express-Entsorgung ist oft innerhalb von 24-48 Stunden möglich. Standardtermine in 3-5 Werktagen."
    },
    {
      question: "Was passiert mit brauchbaren Gegenständen?",
      answer: "Viele Firmen arbeiten mit Brockenhäusern zusammen. Gute Stücke werden gespendet statt entsorgt."
    },
    {
      question: "Muss ich beim Entrümpeln helfen?",
      answer: "Nein, das Team übernimmt alles – vom Ausräumen bis zum Abtransport. Sie müssen nicht anwesend sein."
    },
    {
      question: "Gibt es versteckte Kosten?",
      answer: "Bei seriösen Anbietern nicht. Bestehen Sie auf einem Festpreis nach Besichtigung."
    }
  ];

  const services = [
    { icon: Home, title: "Wohnungsräumung", description: "Komplette Räumung von Wohnungen und Häusern inkl. Keller und Estrich" },
    { icon: Recycle, title: "Sperrmüll", description: "Fachgerechte Entsorgung von Sperrmüll und Altmöbeln" },
    { icon: Leaf, title: "Umweltfreundlich", description: "Recycling und nachhaltige Entsorgung mit CO₂-Kompensation" },
    { icon: Building2, title: "Geschäftsräumung", description: "Büroauflösungen und gewerbliche Räumungen" },
    { icon: Trash2, title: "Entrümpelung", description: "Messie-Wohnungen und stark vermüllte Räume" },
    { icon: Package, title: "Nachlassräumung", description: "Pietätvolle Räumung von Erbschaften" }
  ];

  const features = [
    "Komplette Wohnungsräumung auf Wunsch",
    "Fachgerechte Möbelentsorgung",
    "Elektrogeräte-Recycling (SENS)",
    "Sperrmüll-Abholung vor Ort",
    "Umweltgerechte Trennung aller Materialien",
    "Kombination mit Umzug möglich",
    "Besenreine Übergabe optional",
    "Keller und Estrich inklusive"
  ];

  const priceExamples = [
    { type: "Einzelmöbel", items: "1-5 Teile", price: "CHF 150–350", time: "1-2 Std." },
    { type: "Zimmerräumung", items: "1 Zimmer", price: "CHF 400–700", time: "2-3 Std." },
    { type: "Wohnungsräumung", items: "3-4 Zi.", price: "CHF 800–1'500", time: "4-6 Std." },
    { type: "Hausräumung", items: "Ganzes Haus", price: "CHF 1'500–4'000", time: "1-2 Tage" }
  ];

  const processSteps = [
    { step: "1", title: "Anfrage stellen", description: "Beschreiben Sie kurz was entsorgt werden soll", icon: FileCheck },
    { step: "2", title: "Besichtigung", description: "Kostenlose Vor-Ort-Besichtigung für Festpreis", icon: Calendar },
    { step: "3", title: "Offerte erhalten", description: "Verbindlicher Festpreis ohne versteckte Kosten", icon: Banknote },
    { step: "4", title: "Entsorgung", description: "Profis räumen komplett – Sie müssen nichts tun", icon: ThumbsUp }
  ];

  const testimonials = [
    { name: "Peter H.", location: "Zürich", rating: 5, text: "Nachlassräumung meiner Eltern wurde sehr pietätvoll und professionell durchgeführt.", date: "November 2024" },
    { name: "Anna S.", location: "Basel", rating: 5, text: "In nur 4 Stunden war die ganze Wohnung leer. Super Team!", date: "Oktober 2024" },
    { name: "Marco B.", location: "Bern", rating: 5, text: "Fairer Festpreis, keine Überraschungen. Sehr empfehlenswert.", date: "September 2024" }
  ];

  const disposableItems = [
    { category: "Möbel", items: ["Sofas", "Schränke", "Betten", "Tische", "Stühle"] },
    { category: "Elektro", items: ["Waschmaschinen", "Kühlschränke", "TVs", "Computer"] },
    { category: "Sperrmüll", items: ["Matratzen", "Teppiche", "Vorhänge", "Dekoration"] },
    { category: "Sondermüll*", items: ["Farben", "Öle", "Batterien", "Chemikalien"] }
  ];

  const regions = [
    { name: "Zürich", companies: 38 },
    { name: "Bern", companies: 29 },
    { name: "Basel", companies: 25 },
    { name: "Luzern", companies: 20 },
    { name: "Aargau", companies: 32 },
    { name: "St. Gallen", companies: 22 }
  ];

  const relatedServices = [
    { title: "Privatumzug", href: "/privatumzug", icon: Home },
    { title: "Reinigung", href: "/umzugsreinigung-schweiz", icon: Recycle },
    { title: "Möbellager", href: "/einlagerung", icon: Package },
    { title: "Möbellift", href: "/moebellift", icon: Truck }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Entsorgung & Räumung Schweiz – Fachgerecht & umweltfreundlich | Umzugscheck.ch"
        description="Professionelle Entsorgung und Wohnungsräumung in der Schweiz. Umweltfreundlich, fachgerecht und günstig. Kostenlose Besichtigung & Festpreis."
        canonicalUrl="https://umzugscheck.ch/entsorgung-schweiz"
        keywords="Entsorgung Schweiz, Räumung, Sperrmüll, Möbelentsorgung, Haushaltsauflösung, Entrümpelung, Nachlassräumung"
      />
      <ServiceSchema
        name="Entsorgung & Räumung Schweiz"
        description="Fachgerechte und umweltfreundliche Entsorgung von Möbeln, Hausrat und Sperrmüll"
        priceRange="CHF 150 - CHF 4000"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "Services", url: "https://umzugscheck.ch/dienstleistungen" },
        { name: "Entsorgung", url: "https://umzugscheck.ch/entsorgung-schweiz" }
      ]} />

      {/* Hero with trust stats */}
      <section className="relative py-20 md:py-28 gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 20 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Leaf className="h-4 w-4" />
              <span className="text-sm font-medium">100% Umweltgerecht</span>
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
              <Recycle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Entsorgung & Räumung in der Schweiz
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Fachgerechte und umweltfreundliche Entsorgung von Möbeln, Hausrat und Sperrmüll. Kostenlose Besichtigung mit Festpreisgarantie.
            </p>
            
            {/* Trust Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">4.7/5</span>
                <span className="text-white/70">Bewertung</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Recycle className="h-5 w-5" />
                <span className="font-semibold">95%</span>
                <span className="text-white/70">Recyclingquote</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Award className="h-5 w-5" />
                <span className="font-semibold">120+</span>
                <span className="text-white/70">Partner</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzugsofferten">
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/rechner/entsorgung">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <PageSection variant="default">
        <motion.div
          ref={servicesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={servicesVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Unsere Entsorgungsservices"
            subtitle="Professionelle Lösungen für jeden Bedarf"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((item, index) => (
              <Card key={index} variant="elevated" className="h-full hover-lift">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </PageSection>

      {/* Price Examples */}
      <PageSection variant="muted">
        <motion.div
          ref={pricesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={pricesVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Preisbeispiele Entsorgung 2024"
            subtitle="Transparente Festpreise nach kostenloser Besichtigung"
            className="mb-12"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {priceExamples.map((example, index) => (
              <Card key={index} variant="elevated" className="h-full hover-lift text-center overflow-hidden">
                <div className="h-2 gradient-hero" />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1">{example.type}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{example.items}</p>
                  <div className="text-2xl font-bold text-primary mb-2">{example.price}</div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{example.time}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            * Endpreis wird nach kostenloser Besichtigung verbindlich festgelegt
          </p>
        </motion.div>
      </PageSection>

      {/* Process Steps */}
      <PageSection variant="default">
        <motion.div
          ref={processRef}
          initial={{ opacity: 0, y: 20 }}
          animate={processVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="So funktioniert's"
            subtitle="In 4 einfachen Schritten zur professionellen Entsorgung"
            className="mb-12"
          />
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {processSteps.map((item, index) => (
              <div key={index} className="text-center relative">
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-primary/20" />
                )}
                <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mx-auto mb-4 relative z-10">
                  {item.step}
                </div>
                <item.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </PageSection>

      {/* What we dispose */}
      <PageSection variant="muted">
        <motion.div
          ref={itemsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={itemsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Was wir entsorgen"
            subtitle="Fachgerechte Entsorgung für alle Gegenstände"
            className="mb-12"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {disposableItems.map((category, index) => (
              <Card key={index} variant="elevated" className="h-full">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    {category.category === "Sondermüll*" && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    {category.category}
                  </h3>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            * Sondermüll erfordert spezielle Behandlung und kann Mehrkosten verursachen
          </p>
        </motion.div>
      </PageSection>

      {/* Features */}
      <PageSection variant="default">
        <motion.div
          ref={featuresRef}
          initial={{ opacity: 0, y: 20 }}
          animate={featuresVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <SectionHeading
            title="Unser Leistungsumfang"
            subtitle="Alles aus einer Hand für Ihre Entrümpelung"
            className="mb-12"
          />
          <FeatureList features={features} columns={2} size="md" />
        </motion.div>
      </PageSection>

      {/* Testimonials */}
      <PageSection variant="muted">
        <motion.div
          ref={testimonialsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={testimonialsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Das sagen unsere Kunden"
            subtitle="Echte Erfahrungen mit unseren Entsorgungspartnern"
            className="mb-12"
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="elevated" className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </PageSection>

      {/* Regions */}
      <PageSection variant="default">
        <motion.div
          ref={regionsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={regionsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Entsorgung in Ihrer Region"
            subtitle="Geprüfte Entsorgungsfirmen in allen Schweizer Kantonen"
            className="mb-12"
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {regions.map((region, index) => (
              <Link key={index} to={`/umzug/${region.name.toLowerCase()}`}>
                <Card className="hover-lift text-center p-4">
                  <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">{region.name}</h3>
                  <p className="text-xs text-muted-foreground">{region.companies} Firmen</p>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </PageSection>

      {/* Related Services */}
      <PageSection variant="muted">
        <SectionHeading
          title="Weitere Services"
          subtitle="Entdecken Sie unsere verwandten Dienstleistungen"
          className="mb-12"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {relatedServices.map((service, index) => (
            <Link key={index} to={service.href}>
              <Card variant="elevated" className="h-full hover-lift group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{service.title}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </PageSection>

      {/* Quick Contact Box */}
      <PageSection variant="default">
        <div className="max-w-2xl mx-auto">
          <Card variant="elevated" className="overflow-hidden">
            <div className="h-2 gradient-hero" />
            <CardContent className="p-8 text-center">
              <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Kostenlose Besichtigung gewünscht?</h3>
              <p className="text-muted-foreground mb-6">
                Lassen Sie Ihre Räumung unverbindlich vor Ort einschätzen
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button variant="outline" className="h-12 px-6">
                    <Phone className="mr-2 h-4 w-4" />
                    Kontakt aufnehmen
                  </Button>
                </Link>
                <Link to="/umzugsofferten">
                  <Button variant="cta" className="h-12 px-6">
                    <Zap className="mr-2 h-4 w-4" />
                    Jetzt Offerten erhalten
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* FAQ */}
      <PageSection variant="muted">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Häufige Fragen zur Entsorgung"
            subtitle="Antworten auf die wichtigsten Fragen"
            className="mb-12"
          />
          <FAQAccordion items={faqs} variant="compact" />
          <div className="text-center mt-8">
            <Link to="/faq">
              <Button variant="outline">
                Alle FAQ anzeigen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </PageSection>

      {/* CTA */}
      <CTASection
        title="Benötigen Sie eine professionelle Entsorgung?"
        description="Erhalten Sie kostenlose Offerten von geprüften Entsorgungsfirmen. Festpreisgarantie nach Besichtigung."
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}
