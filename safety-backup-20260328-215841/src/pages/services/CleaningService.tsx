import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Shield, Clock, Users, CheckCircle, Star, Phone, Award, Banknote, Home, Building2, ArrowRight, Calendar, ThumbsUp, Droplets, MapPin, FileCheck, Zap } from "lucide-react";
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

export default function CleaningService() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();
  const { ref: pricesRef, isVisible: pricesVisible } = useScrollAnimation();
  const { ref: processRef, isVisible: processVisible } = useScrollAnimation();
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation();
  const { ref: checklistRef, isVisible: checklistVisible } = useScrollAnimation();
  const { ref: regionsRef, isVisible: regionsVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "Was kostet eine Umzugsreinigung in der Schweiz?",
      answer: "Eine professionelle Umzugsreinigung kostet je nach Wohnungsgrösse CHF 300–800. Eine 3-Zimmer-Wohnung kostet durchschnittlich CHF 450–600."
    },
    {
      question: "Was ist in der Umzugsreinigung enthalten?",
      answer: "Standard-Umzugsreinigung umfasst alle Räume, Küche, Bad, Fenster innen, Böden und Oberflächen gemäss Wohnungsabgabeprotokoll."
    },
    {
      question: "Gibt es eine Abgabegarantie?",
      answer: "Ja, viele Reinigungsfirmen bieten eine Abgabegarantie. Falls der Vermieter die Reinigung nicht akzeptiert, wird kostenlos nachgeputzt."
    },
    {
      question: "Wie lange dauert eine Umzugsreinigung?",
      answer: "Eine 3-Zimmer-Wohnung benötigt ca. 4-6 Stunden. Grössere Wohnungen oder Häuser entsprechend länger."
    },
    {
      question: "Wann sollte ich die Reinigung buchen?",
      answer: "Idealerweise 2-3 Wochen vor dem Umzugstermin, um Ihren Wunschtermin zu sichern. In der Hochsaison (März-September) früher."
    },
    {
      question: "Muss ich bei der Reinigung anwesend sein?",
      answer: "Nein, Sie können den Schlüssel übergeben. Die Firma dokumentiert alles und sendet Ihnen Vorher-Nachher-Fotos."
    },
    {
      question: "Was passiert bei Reklamationen vom Vermieter?",
      answer: "Bei Abgabegarantie wird kostenlos nachgeputzt. Ohne Garantie prüfen Sie die Firma vorher auf Versicherungsschutz."
    },
    {
      question: "Kann ich Reinigung und Umzug kombinieren?",
      answer: "Ja, viele Anbieter bieten Kombi-Pakete an. Das spart oft 10-15% der Gesamtkosten."
    }
  ];

  const cleaningItems = [
    "Alle Räume gründlich reinigen",
    "Küche inkl. Backofen & Kühlschrank",
    "Badezimmer inkl. WC, Dusche & Armaturen",
    "Fenster innen putzen",
    "Böden wischen und saugen",
    "Oberflächen und Schränke reinigen",
    "Storen und Jalousien",
    "Abzugshaube entfetten",
    "Heizkörper reinigen",
    "Steckdosen und Lichtschalter"
  ];

  const benefits = [
    { icon: Shield, title: "Abgabegarantie", description: "Nachputzen kostenlos, falls Vermieter nicht akzeptiert" },
    { icon: Clock, title: "Zeitersparnis", description: "Sie sparen wertvolle Zeit am Umzugstag" },
    { icon: Users, title: "Professionell", description: "Erfahrene Reinigungskräfte mit Profi-Equipment" },
    { icon: Award, title: "Qualitätsstandard", description: "Reinigung nach Schweizer Norm SIA" },
    { icon: FileCheck, title: "Dokumentation", description: "Vorher-Nachher-Fotos für Ihre Sicherheit" },
    { icon: Banknote, title: "Faire Preise", description: "Transparente Festpreise ohne versteckte Kosten" }
  ];

  const priceExamples = [
    { size: "1-2 Zimmer", sqm: "30-50 m²", price: "CHF 280–400", time: "3-4 Std." },
    { size: "3-3.5 Zimmer", sqm: "60-80 m²", price: "CHF 450–600", time: "5-6 Std." },
    { size: "4-4.5 Zimmer", sqm: "90-110 m²", price: "CHF 550–750", time: "6-8 Std." },
    { size: "5+ Zimmer / Haus", sqm: "120+ m²", price: "CHF 700–1'200", time: "8-12 Std." }
  ];

  const processSteps = [
    { step: "1", title: "Offerten anfordern", description: "Füllen Sie unser Formular aus und erhalten Sie bis zu 5 Offerten", icon: FileCheck },
    { step: "2", title: "Angebote vergleichen", description: "Vergleichen Sie Preise, Leistungen und Bewertungen", icon: Star },
    { step: "3", title: "Termin buchen", description: "Wählen Sie Ihre Wunschfirma und vereinbaren Sie den Termin", icon: Calendar },
    { step: "4", title: "Reinigung & Abnahme", description: "Profis reinigen, Sie erhalten Garantie für die Abnahme", icon: ThumbsUp }
  ];

  const testimonials = [
    { name: "Sandra M.", location: "Zürich", rating: 5, text: "Perfekte Reinigung! Vermieter hat sofort abgenommen ohne Beanstandung.", date: "November 2024" },
    { name: "Thomas K.", location: "Bern", rating: 5, text: "Schnell, gründlich und fair im Preis. Absolute Empfehlung!", date: "Oktober 2024" },
    { name: "Maria L.", location: "Basel", rating: 5, text: "Mit Abgabegarantie buchen lohnt sich. Hatte keine Sorgen mehr.", date: "September 2024" }
  ];

  const checklist = [
    "Backofen und Herd entfetten",
    "Kühlschrank komplett abtauen",
    "Dunstabzugshaube reinigen",
    "Kalkablagerungen im Bad entfernen",
    "Fugen in Dusche/Badewanne reinigen",
    "Fenster innen putzen",
    "Storen säubern",
    "Böden wischen und saugen",
    "Schränke innen auswischen",
    "Heizkörper abstauben"
  ];

  const regions = [
    { name: "Zürich", companies: 45 },
    { name: "Bern", companies: 32 },
    { name: "Basel", companies: 28 },
    { name: "Luzern", companies: 22 },
    { name: "Aargau", companies: 35 },
    { name: "St. Gallen", companies: 26 }
  ];

  const relatedServices = [
    { title: "Privatumzug", href: "/privatumzug", icon: Home },
    { title: "Firmenumzug", href: "/firmenumzug", icon: Building2 },
    { title: "Entsorgung", href: "/entsorgung-schweiz", icon: Droplets },
    { title: "Möbellager", href: "/einlagerung", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Umzugsreinigung Schweiz mit Abgabegarantie | Umzugscheck.ch"
        description="Professionelle Umzugsreinigung in der Schweiz mit Abgabegarantie. Vergleichen Sie Angebote und sparen Sie bis zu 40%. End- und Endreinigung für stressfreie Wohnungsabgabe."
        canonicalUrl="https://umzugscheck.ch/umzugsreinigung-schweiz"
        keywords="Umzugsreinigung Schweiz, Endreinigung, Abgabegarantie, Wohnungsreinigung, Umzugsreinigung Kosten, Umzugsreinigung Preise"
      />
      <ServiceSchema
        name="Umzugsreinigung Schweiz"
        description="Professionelle End- und Umzugsreinigung mit Abgabegarantie für stressfreie Wohnungsabgabe"
        priceRange="CHF 300 - CHF 1200"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "Services", url: "https://umzugscheck.ch/dienstleistungen" },
        { name: "Umzugsreinigung", url: "https://umzugscheck.ch/umzugsreinigung-schweiz" }
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
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Mit Abgabegarantie</span>
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Umzugsreinigung mit Abgabegarantie
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Professionelle End- und Endreinigung für eine stressfreie Wohnungsabgabe. Vergleichen Sie Angebote und sparen Sie bis zu 40%.
            </p>
            
            {/* Trust Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">4.8/5</span>
                <span className="text-white/70">Bewertung</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Users className="h-5 w-5" />
                <span className="font-semibold">8'500+</span>
                <span className="text-white/70">Reinigungen</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Award className="h-5 w-5" />
                <span className="font-semibold">150+</span>
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
              <Link to="/rechner/reinigung">
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
            title="Preisbeispiele Umzugsreinigung 2024"
            subtitle="Transparente Festpreise für alle Wohnungsgrössen"
            className="mb-12"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {priceExamples.map((example, index) => (
              <Card key={index} variant="elevated" className="h-full hover-lift text-center overflow-hidden">
                <div className="h-2 gradient-hero" />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1">{example.size}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{example.sqm}</p>
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
            * Preise sind Richtwerte und können je nach Zustand und Region variieren
          </p>
        </motion.div>
      </PageSection>

      {/* Process Steps */}
      <PageSection variant="muted">
        <motion.div
          ref={processRef}
          initial={{ opacity: 0, y: 20 }}
          animate={processVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="So funktioniert's"
            subtitle="In 4 einfachen Schritten zur professionellen Reinigung"
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
            title="Was ist in der Endreinigung enthalten?"
            subtitle="Komplette Reinigung nach Schweizer Standard für Ihre Wohnungsabgabe"
            className="mb-12"
          />
          <FeatureList features={cleaningItems} columns={2} size="md" />
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
            title="Vorteile einer professionellen Umzugsreinigung"
            subtitle="Warum Sie auf Profis setzen sollten"
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
            subtitle="Echte Erfahrungen mit unseren Reinigungspartnern"
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

      {/* Checklist */}
      <PageSection variant="muted">
        <motion.div
          ref={checklistRef}
          initial={{ opacity: 0, y: 20 }}
          animate={checklistVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <SectionHeading
            title="Checkliste für die Wohnungsabgabe"
            subtitle="Diese Punkte prüft Ihr Vermieter bei der Abnahme"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 gap-4">
            {checklist.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-background rounded-lg shadow-soft">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>{item}</span>
              </div>
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
            title="Umzugsreinigung in Ihrer Region"
            subtitle="Geprüfte Reinigungsfirmen in allen Schweizer Kantonen"
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
              <h3 className="text-2xl font-bold mb-2">Persönliche Beratung gewünscht?</h3>
              <p className="text-muted-foreground mb-6">
                Unser Team hilft Ihnen gerne bei Fragen zur Umzugsreinigung
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
            title="Häufige Fragen zur Umzugsreinigung"
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
        title="Bereit für eine professionelle Umzugsreinigung?"
        description="Vergleichen Sie jetzt Angebote und erhalten Sie die beste Reinigung zum besten Preis. 100% kostenlos und unverbindlich."
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}
