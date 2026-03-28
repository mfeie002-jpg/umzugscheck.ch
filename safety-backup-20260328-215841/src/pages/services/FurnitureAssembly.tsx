import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Wrench, Shield, Clock, Users, CheckCircle, Star, Award, Banknote, Home, Building2, ArrowRight, Calendar, ThumbsUp, MapPin, FileCheck, Zap, Package, Sofa, BedDouble, BookOpen } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureList } from "@/components/ui/feature-list";
import { CTASection } from "@/components/CTASection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";
import { motion } from "framer-motion";

export default function FurnitureAssembly() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();
  const { ref: pricesRef, isVisible: pricesVisible } = useScrollAnimation();
  const { ref: processRef, isVisible: processVisible } = useScrollAnimation();
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation();
  const { ref: regionsRef, isVisible: regionsVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "Was kostet Möbelmontage in der Schweiz?",
      answer: "Die Kosten variieren je nach Möbelstück: IKEA-Schrank CHF 80–150, Küchenmontage CHF 200–500, komplette Wohnung CHF 400–1'200. Stundenpreise liegen bei CHF 60–90."
    },
    {
      question: "Welche Möbel werden montiert?",
      answer: "Alle Arten: IKEA & Flatpack-Möbel, Küchen, Schlafzimmer, Büromöbel, Regalsysteme, Einbauschränke und mehr."
    },
    {
      question: "Muss ich das Werkzeug stellen?",
      answer: "Nein, professionelle Monteure bringen ihr eigenes Werkzeug mit – inklusive Spezialwerkzeug für verschiedene Möbelsysteme."
    },
    {
      question: "Wie lange dauert die Montage?",
      answer: "Ein PAX-Schrank ca. 1-2 Stunden, eine komplette Küche 1-2 Tage. Bei der Buchung erhalten Sie eine Zeitschätzung."
    },
    {
      question: "Kann ich Montage mit Umzug kombinieren?",
      answer: "Ja, viele Umzugsfirmen bieten Montage als Zusatzservice an. Kombi-Pakete sind oft günstiger."
    },
    {
      question: "Was passiert bei Schäden während der Montage?",
      answer: "Professionelle Monteure sind versichert. Bei Beschädigungen wird der Schaden ersetzt."
    },
    {
      question: "Wird auch demontiert?",
      answer: "Ja, Demontage ist oft Teil des Services – ideal beim Umzug oder Wohnungswechsel."
    },
    {
      question: "Wie buche ich einen Monteur?",
      answer: "Über unser Formular in 2 Minuten. Sie erhalten bis zu 5 Offerten von geprüften Monteuren."
    }
  ];

  const services = [
    { icon: Package, title: "IKEA & Flatpack", description: "Professionelle Montage aller IKEA-Möbel und Flatpack-Systeme" },
    { icon: Sofa, title: "Wohnzimmer", description: "Regale, Schrankwände, TV-Möbel, Vitrinen, Sideboards" },
    { icon: BedDouble, title: "Schlafzimmer", description: "Betten, Kleiderschränke, Kommoden, Nachttische" },
    { icon: Home, title: "Küchenmontage", description: "Einbauküchen, Arbeitsplatten, Elektrogeräte-Anschluss" },
    { icon: Building2, title: "Büromöbel", description: "Schreibtische, Bürostühle, Aktenschränke, Regale" },
    { icon: BookOpen, title: "Regalsysteme", description: "Bücherregale, begehbare Schränke, Raumteiler" }
  ];

  const features = [
    "Professionelle Montage aller Möbelmarken",
    "Demontage beim Auszug inklusive",
    "IKEA, Micasa, Pfister & mehr",
    "Küchenmontage mit Geräteanschluss",
    "Einbauschränke nach Mass",
    "Reparatur & Nachbesserung",
    "Abholung & Lieferung möglich",
    "Entsorgung von Verpackungsmaterial"
  ];

  const priceExamples = [
    { type: "IKEA PAX Schrank", time: "1-2 Std.", price: "CHF 80–150" },
    { type: "Bett mit Lattenrost", time: "1-1.5 Std.", price: "CHF 70–120" },
    { type: "Küche komplett", time: "1-2 Tage", price: "CHF 500–1'500" },
    { type: "Wohnung komplett", time: "0.5-1 Tag", price: "CHF 400–1'200" }
  ];

  const processSteps = [
    { step: "1", title: "Anfrage stellen", description: "Beschreiben Sie welche Möbel montiert werden sollen", icon: FileCheck },
    { step: "2", title: "Offerten erhalten", description: "Bis zu 5 Angebote von geprüften Monteuren", icon: Star },
    { step: "3", title: "Termin wählen", description: "Flexibler Termin – auch abends & Wochenende", icon: Calendar },
    { step: "4", title: "Montage", description: "Profis montieren – Sie lehnen sich zurück", icon: ThumbsUp }
  ];

  const testimonials = [
    { name: "Lisa M.", location: "Zürich", rating: 5, text: "Komplette IKEA-Küche in einem Tag montiert. Perfekte Arbeit!", date: "November 2024" },
    { name: "Stefan R.", location: "Basel", rating: 5, text: "PAX-Schrank und Bett aufgebaut während ich arbeitete. Super Service.", date: "Oktober 2024" },
    { name: "Monika K.", location: "Bern", rating: 5, text: "Umzug mit Demontage und Wiedermontage – alles aus einer Hand.", date: "September 2024" }
  ];

  const benefits = [
    { icon: Wrench, title: "Professionell", description: "Erfahrene Monteure mit dem richtigen Werkzeug" },
    { icon: Clock, title: "Zeitsparend", description: "Sie sparen Stunden an Aufbauzeit" },
    { icon: Shield, title: "Versichert", description: "Vollversicherung gegen Schäden während der Montage" },
    { icon: Award, title: "Garantie", description: "Nachbesserung bei Problemen inklusive" },
    { icon: Banknote, title: "Faire Preise", description: "Transparente Festpreise ohne Überraschungen" },
    { icon: Zap, title: "Flexibel", description: "Termine auch abends und am Wochenende" }
  ];

  const regions = [
    { name: "Zürich", companies: 42 },
    { name: "Bern", companies: 28 },
    { name: "Basel", companies: 24 },
    { name: "Luzern", companies: 18 },
    { name: "Aargau", companies: 32 },
    { name: "St. Gallen", companies: 22 }
  ];

  const relatedServices = [
    { title: "Privatumzug", href: "/privatumzug", icon: Home },
    { title: "Firmenumzug", href: "/firmenumzug", icon: Building2 },
    { title: "Möbellift", href: "/moebellift", icon: Package },
    { title: "Einlagerung", href: "/einlagerung", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Möbelmontage Schweiz – IKEA & Küchen Aufbau | Umzugscheck.ch"
        description="Professionelle Möbelmontage in der Schweiz. IKEA-Aufbau, Küchenmontage, Schränke & mehr. Bis zu 5 kostenlose Offerten von geprüften Monteuren."
        canonicalUrl="https://umzugscheck.ch/moebelmontage"
        keywords="Möbelmontage Schweiz, IKEA Montage, Küchenmontage, Möbel aufbauen, Schrank montieren"
      />
      <ServiceSchema
        name="Möbelmontage Schweiz"
        description="Professionelle Möbelmontage und -demontage durch geprüfte Monteure"
        priceRange="CHF 70 - CHF 1500"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "Services", url: "https://umzugscheck.ch/dienstleistungen" },
        { name: "Möbelmontage", url: "https://umzugscheck.ch/moebelmontage" }
      ]} />

      {/* Hero Section */}
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
              <Wrench className="h-4 w-4" />
              <span className="text-sm font-medium">Professionelle Monteure</span>
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Möbelmontage vom Profi
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              IKEA, Küchen, Schränke & mehr – professionell montiert. Sparen Sie Zeit und Nerven mit geprüften Monteuren.
            </p>
            
            {/* Trust Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">4.9/5</span>
                <span className="text-white/70">Bewertung</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Users className="h-5 w-5" />
                <span className="font-semibold">12'000+</span>
                <span className="text-white/70">Montagen</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Award className="h-5 w-5" />
                <span className="font-semibold">180+</span>
                <span className="text-white/70">Monteure</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzugsofferten">
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/rechner/moebelmontage">
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
            title="Preisbeispiele Möbelmontage 2024"
            subtitle="Transparente Festpreise für alle Möbelarten"
            className="mb-12"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {priceExamples.map((example, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow text-center overflow-hidden">
                <div className="h-2 gradient-hero" />
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-1">{example.type}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{example.time}</p>
                  <div className="text-2xl font-bold text-primary">{example.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            * Preise sind Richtwerte und können je nach Komplexität variieren
          </p>
        </motion.div>
      </PageSection>

      {/* Services Grid */}
      <PageSection variant="muted">
        <motion.div
          ref={servicesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={servicesVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Was wir montieren"
            subtitle="Professionelle Montage für alle Möbelarten"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
            subtitle="In 4 einfachen Schritten zur professionellen Montage"
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

      {/* Benefits */}
      <PageSection variant="muted">
        <motion.div
          ref={benefitsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={benefitsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Vorteile professioneller Möbelmontage"
            subtitle="Warum Sie auf Profis setzen sollten"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((item, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
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

      {/* Testimonials */}
      <PageSection variant="default">
        <motion.div
          ref={testimonialsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={testimonialsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Das sagen unsere Kunden"
            subtitle="Echte Erfahrungen mit unseren Montagepartnern"
            className="mb-12"
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
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
      <PageSection variant="muted">
        <motion.div
          ref={regionsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={regionsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Möbelmontage in Ihrer Region"
            subtitle="Geprüfte Monteure in der ganzen Schweiz"
            className="mb-12"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {regions.map((region, index) => (
              <Link key={index} to={`/umzugsfirmen/${region.name.toLowerCase()}`}>
                <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">{region.name}</h3>
                    <p className="text-xs text-muted-foreground">{region.companies} Monteure</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </PageSection>

      {/* Features List */}
      <PageSection variant="default">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            title="Unser Montage-Service umfasst"
            subtitle="Alles aus einer Hand für Ihre Möbel"
            className="mb-12"
          />
          <FeatureList features={features} columns={2} size="md" />
        </div>
      </PageSection>

      {/* Related Services */}
      <PageSection variant="muted">
        <SectionHeading
          title="Ergänzende Services"
          subtitle="Kombinieren Sie Montage mit anderen Dienstleistungen"
          className="mb-12"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {relatedServices.map((service, index) => (
            <Link key={index} to={service.href}>
              <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{service.title}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </PageSection>

      {/* FAQ */}
      <PageSection variant="default">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Häufige Fragen zur Möbelmontage"
            subtitle="Alles was Sie wissen müssen"
            className="mb-12"
          />
          <FAQAccordion items={faqs} />
        </div>
      </PageSection>

      {/* CTA */}
      <CTASection
        title="Möbel montieren lassen?"
        description="Vergleichen Sie jetzt kostenlos Angebote von geprüften Monteuren in Ihrer Region."
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}
