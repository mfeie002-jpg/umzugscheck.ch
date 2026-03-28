import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Box, Shield, Clock, ThermometerSun, CheckCircle, Package, Star, Phone, Award, Banknote, Home, Building2, ArrowRight, Calendar, MapPin, Zap, Users, Lock, Truck, Eye, Key } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTASection } from "@/components/CTASection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";
import { motion } from "framer-motion";

export default function StorageService() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: useCasesRef, isVisible: useCasesVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation();
  const { ref: pricesRef, isVisible: pricesVisible } = useScrollAnimation();
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation();
  const { ref: sizesRef, isVisible: sizesVisible } = useScrollAnimation();
  const { ref: regionsRef, isVisible: regionsVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "Was kostet Möbellagerung in der Schweiz?",
      answer: "Die Kosten variieren je nach Lagergrösse und Mietdauer. Ein 10m² Lager kostet durchschnittlich CHF 150–250 pro Monat. Langzeitmieten sind oft günstiger."
    },
    {
      question: "Wie sicher ist mein Eigentum im Lager?",
      answer: "Alle Lagerhallen sind videoüberwacht, alarmgesichert und klimatisiert. Ihre Möbel und Gegenstände sind versichert und rund um die Uhr geschützt."
    },
    {
      question: "Kann ich jederzeit auf mein Lager zugreifen?",
      answer: "Ja, bei den meisten Anbietern haben Sie 24/7 Zugang zu Ihrem Lager. Einige Anbieter bieten auch Abholservice an."
    },
    {
      question: "Wie lange kann ich Möbel einlagern?",
      answer: "Von wenigen Wochen bis mehreren Jahren – ganz nach Ihrem Bedarf. Flexible Kündigungsfristen ermöglichen Anpassungen."
    },
    {
      question: "Brauche ich eine Versicherung?",
      answer: "Grundversicherung ist meist inklusive. Für Wertgegenstände empfehlen wir eine Zusatzversicherung."
    },
    {
      question: "Wie berechne ich die richtige Lagergrösse?",
      answer: "Faustregel: Pro Zimmer ca. 5-10m² Lagerfläche. Wir helfen bei der Berechnung."
    },
    {
      question: "Kann ich das Lager besichtigen?",
      answer: "Ja, eine Besichtigung ist vor Vertragsabschluss jederzeit möglich und empfohlen."
    },
    {
      question: "Was darf ich nicht einlagern?",
      answer: "Lebensmittel, Gefahrgut, illegale Waren und lebende Tiere sind nicht erlaubt."
    }
  ];

  const useCases = [
    { icon: Home, title: "Zwischenlagerung bei Umzug", description: "Überbrückung zwischen Auszug und Einzug ohne Stress" },
    { icon: Building2, title: "Renovierung oder Umbau", description: "Möbel sicher lagern während der Arbeiten zu Hause" },
    { icon: Calendar, title: "Auslandsaufenthalt", description: "Langzeitlagerung für Monate oder Jahre im Ausland" },
    { icon: Box, title: "Platzmangel", description: "Saisonale Gegenstände oder selten genutzte Möbel auslagern" },
    { icon: Package, title: "Verkleinerung", description: "Übergangsphase bei Wohnungswechsel in kleinere Wohnung" },
    { icon: Shield, title: "Geschäftliche Nutzung", description: "Archivierung oder Lagerhaltung für Firmen und Selbstständige" }
  ];

  const benefits = [
    { icon: Shield, title: "Sicher & versichert", description: "Videoüberwachung und Alarmanlage 24/7, Vollversicherung inklusive" },
    { icon: ThermometerSun, title: "Klimatisiert", description: "Optimale Temperatur und Luftfeuchtigkeit für Ihre Möbel" },
    { icon: Clock, title: "Flexibler Zugang", description: "24/7 Zugang zu Ihrem Lager mit persönlichem Code" },
    { icon: Package, title: "Alle Grössen", description: "Von 1m² Schliessfach bis 100m² Halle verfügbar" },
    { icon: Key, title: "Kurz- & Langzeit", description: "Flexible Mietdauer ab 1 Woche bis mehrere Jahre" },
    { icon: Truck, title: "Transport inklusive", description: "Abholung und Lieferung auf Wunsch buchbar" }
  ];

  const steps = [
    { step: "1", title: "Lagergrösse wählen", description: "Berechnen Sie Ihren Platzbedarf oder lassen Sie sich beraten" },
    { step: "2", title: "Offerten vergleichen", description: "Erhalten Sie bis zu 5 kostenlose Angebote von geprüften Anbietern" },
    { step: "3", title: "Einlagern", description: "Transport und Einlagerung organisieren – auf Wunsch mit Fullservice" }
  ];

  const priceExamples = [
    { size: "2-5 m²", suitable: "1 Zimmer", price: "CHF 80–150/Mt.", popular: false },
    { size: "5-10 m²", suitable: "2-3 Zimmer", price: "CHF 150–250/Mt.", popular: true },
    { size: "10-20 m²", suitable: "3-4 Zimmer", price: "CHF 250–400/Mt.", popular: false },
    { size: "20+ m²", suitable: "Haus/Firma", price: "CHF 400–800/Mt.", popular: false }
  ];

  const testimonials = [
    { name: "Claudia F.", location: "Zürich", rating: 5, text: "Perfekt für unseren Auslandsaufenthalt. Alles kam unversehrt zurück.", date: "November 2024" },
    { name: "Daniel R.", location: "Basel", rating: 5, text: "Flexible Kündigungsfrist war super. Konnte spontan verlängern.", date: "Oktober 2024" },
    { name: "Sarah K.", location: "Bern", rating: 5, text: "24/7 Zugang ist Gold wert. Konnte auch abends noch Sachen holen.", date: "September 2024" }
  ];

  const storageSizes = [
    { size: "1-2 m²", description: "Schliessfach", items: ["Akten", "Ski", "Koffer", "Kleinmöbel"] },
    { size: "3-5 m²", description: "Box klein", items: ["Kartons", "Fahrräder", "Gartengeräte"] },
    { size: "6-10 m²", description: "Box mittel", items: ["1-2 Zimmer Möbel", "Haushalt"] },
    { size: "12-20 m²", description: "Box gross", items: ["3-4 Zimmer komplett", "Büromöbel"] }
  ];

  const regions = [
    { name: "Zürich", companies: 28 },
    { name: "Bern", companies: 22 },
    { name: "Basel", companies: 18 },
    { name: "Luzern", companies: 15 },
    { name: "Aargau", companies: 24 },
    { name: "St. Gallen", companies: 16 }
  ];

  const relatedServices = [
    { title: "Privatumzug", href: "/privatumzug", icon: Home },
    { title: "Reinigung", href: "/umzugsreinigung-schweiz", icon: CheckCircle },
    { title: "Entsorgung", href: "/entsorgung-schweiz", icon: Box },
    { title: "Möbellift", href: "/moebellift", icon: Truck }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Möbellager & Einlagerung Schweiz – sicher & flexibel | Umzugscheck.ch"
        description="Sichere Möbellagerung in der Schweiz. Klimatisierte Lager mit 24/7 Zugang. Vergleichen Sie Angebote und finden Sie das passende Lager für Ihre Bedürfnisse."
        keywords="möbellager, einlagerung schweiz, möbel lagern, lagerraum, selfstorage, möbel einlagern"
        canonicalUrl="https://www.umzugscheck.ch/einlagerung"
      />
      <ServiceSchema
        name="Möbellager & Einlagerung Schweiz"
        description="Sichere und flexible Lagerlösungen für Möbel und Gegenstände. Klimatisiert, überwacht und versichert."
        priceRange="CHF 80 - CHF 800 pro Monat"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "Services", url: "https://umzugscheck.ch/dienstleistungen" },
        { name: "Einlagerung", url: "https://umzugscheck.ch/einlagerung" }
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
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">24/7 Zugang & Überwachung</span>
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
              <Box className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Möbellager & Einlagerung in der Schweiz
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Sichere und flexible Lagerlösungen für Ihre Möbel und Gegenstände. Klimatisiert, überwacht und versichert.
            </p>
            
            {/* Trust Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">4.9/5</span>
                <span className="text-white/70">Bewertung</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Eye className="h-5 w-5" />
                <span className="font-semibold">24/7</span>
                <span className="text-white/70">Überwachung</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Award className="h-5 w-5" />
                <span className="font-semibold">80+</span>
                <span className="text-white/70">Standorte</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzugsofferten">
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/rechner/lager">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Price Examples */}
      <PageSection variant="default">
        <motion.div
          ref={pricesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={pricesVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Preisübersicht Möbellager 2024"
            subtitle="Transparente Monatstarife für alle Lagergrössen"
            className="mb-12"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {priceExamples.map((example, index) => (
              <Card key={index} variant="elevated" className={cn("h-full hover-lift text-center overflow-hidden relative", example.popular && "ring-2 ring-primary")}>
                {example.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Beliebt
                  </div>
                )}
                <div className="h-2 gradient-hero" />
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-1">{example.size}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{example.suitable}</p>
                  <div className="text-2xl font-bold text-primary mb-2">{example.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </PageSection>

      {/* Storage Size Guide */}
      <PageSection variant="muted">
        <motion.div
          ref={sizesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={sizesVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Welche Lagergrösse brauche ich?"
            subtitle="Orientierungshilfe für Ihre Einlagerung"
            className="mb-12"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {storageSizes.map((size, index) => (
              <Card key={index} variant="elevated" className="h-full">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{size.size}</div>
                  <h3 className="font-semibold mb-4">{size.description}</h3>
                  <ul className="space-y-2">
                    {size.items.map((item, i) => (
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
        </motion.div>
      </PageSection>

      {/* Use Cases */}
      <PageSection variant="default">
        <motion.div
          ref={useCasesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={useCasesVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <SectionHeading
            title="Wann brauche ich ein Möbellager?"
            subtitle="Typische Situationen für Einlagerung"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((item, index) => (
              <Card key={index} variant="elevated" className="hover-lift">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </PageSection>

      {/* Benefits */}
      <PageSection variant="muted">
        <motion.div
          ref={benefitsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={benefitsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Vorteile professioneller Möbellagerung"
            subtitle="Warum Sie auf geprüfte Anbieter setzen sollten"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((item, index) => (
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

      {/* Steps */}
      <PageSection variant="default">
        <motion.div
          ref={stepsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={stepsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="So funktioniert's"
            subtitle="In 3 einfachen Schritten zum passenden Lager"
            className="mb-12"
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((item, index) => (
              <div key={index} className="text-center relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-primary/20" />
                )}
                <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mx-auto mb-6 relative z-10">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
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
            subtitle="Echte Erfahrungen mit unseren Lagerpartnern"
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
            title="Möbellager in Ihrer Region"
            subtitle="Standorte in allen Schweizer Kantonen"
            className="mb-12"
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {regions.map((region, index) => (
              <Link key={index} to={`/umzug/${region.name.toLowerCase()}`}>
                <Card className="hover-lift text-center p-4">
                  <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">{region.name}</h3>
                  <p className="text-xs text-muted-foreground">{region.companies} Standorte</p>
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
              <h3 className="text-2xl font-bold mb-2">Persönliche Beratung gewünscht?</h3>
              <p className="text-muted-foreground mb-6">
                Wir helfen Ihnen, die passende Lagergrösse zu finden
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
            title="Häufige Fragen zur Einlagerung"
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
        title="Bereit für sicheres Möbellager?"
        description="Vergleichen Sie jetzt Angebote für Möbellager und finden Sie die beste Lösung. Kostenlos und unverbindlich."
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}
