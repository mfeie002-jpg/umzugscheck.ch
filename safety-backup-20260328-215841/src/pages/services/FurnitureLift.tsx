import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, Clock, Shield, DollarSign, Wrench, TrendingUp, CheckCircle, Star, Phone, Award, Home, Building2, ArrowRight, Calendar, MapPin, Zap, Users, Truck, Package, AlertTriangle, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTASection } from "@/components/CTASection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";
import { motion } from "framer-motion";

export default function FurnitureLift() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();
  const { ref: situationsRef, isVisible: situationsVisible } = useScrollAnimation();
  const { ref: pricesRef, isVisible: pricesVisible } = useScrollAnimation();
  const { ref: processRef, isVisible: processVisible } = useScrollAnimation();
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation();
  const { ref: typesRef, isVisible: typesVisible } = useScrollAnimation();
  const { ref: regionsRef, isVisible: regionsVisible } = useScrollAnimation();

  const benefits = [
    { icon: Clock, title: "Zeitersparnis", description: "Bis zu 70% schneller als Tragen über Treppen" },
    { icon: Shield, title: "Sicher", description: "Keine Beschädigungen an Möbeln, Wänden oder Türen" },
    { icon: DollarSign, title: "Kosteneffizient", description: "Spart Personalkosten und reduziert Umzugszeit" },
    { icon: Wrench, title: "Professionell", description: "Erfahrene Bedienung durch zertifiziertes Fachpersonal" },
    { icon: TrendingUp, title: "Höhe", description: "Bis zu 32 Meter Höhe erreichbar (10. Stock)" },
    { icon: ArrowUp, title: "Schwere Lasten", description: "Tragkraft bis 400kg für Klaviere, Tresore, Schränke" },
  ];

  const situations = [
    { icon: Home, title: "Enge Treppenhäuser", description: "Wenn grosse Möbel nicht durch das Treppenhaus passen" },
    { icon: Package, title: "Schwere Gegenstände", description: "Klaviere, Tresore, grosse Schränke, Sofas, Betten" },
    { icon: Building2, title: "Hohe Stockwerke", description: "Ab 3. Stock ohne Lift besonders empfehlenswert" },
    { icon: Clock, title: "Zeitdruck", description: "Wenn der Umzug schnell gehen muss" },
    { icon: Shield, title: "Wertvolle Möbel", description: "Antike oder empfindliche Stücke schonend transportieren" },
    { icon: Users, title: "Personalmangel", description: "Wenn wenige Helfer für schwere Lasten verfügbar" }
  ];

  const faqs = [
    {
      question: "Was kostet ein Möbellift in der Schweiz?",
      answer: "Ein Möbellift kostet je nach Dauer und Höhe CHF 300–800. Die Kosten hängen von Einsatzdauer, Stockwerkhöhe und Zugänglichkeit ab."
    },
    {
      question: "Wann macht ein Möbellift Sinn?",
      answer: "Bei engen Treppenhäusern, schweren Möbeln (Klaviere, Safes), hohen Stockwerken ohne Lift oder wenn das Treppenhaus geschont werden soll."
    },
    {
      question: "Brauche ich eine Bewilligung für einen Möbellift?",
      answer: "Ja, in den meisten Gemeinden benötigen Sie eine temporäre Parkplatzbewilligung für den Lift-Standplatz auf der Strasse."
    },
    {
      question: "Wie lange dauert ein Möbellift-Einsatz?",
      answer: "Durchschnittlich 2-4 Stunden, abhängig von der Anzahl der zu transportierenden Gegenstände und der Höhe."
    },
    {
      question: "Bis zu welcher Höhe kann ein Möbellift reichen?",
      answer: "Standard-Möbellifte erreichen bis 32 Meter (ca. 10. Stock). Für höhere Gebäude gibt es Speziallösungen."
    },
    {
      question: "Wie breit muss das Fenster oder der Balkon sein?",
      answer: "Mindestens 80cm Breite. Grössere Öffnungen sind besser für voluminöse Möbel wie Sofas."
    },
    {
      question: "Was passiert bei schlechtem Wetter?",
      answer: "Bei leichtem Regen ist der Einsatz möglich. Bei Sturm oder Gewitter wird der Termin verschoben."
    },
    {
      question: "Kann ich den Möbellift separat buchen?",
      answer: "Ja, viele Anbieter bieten Möbellifte auch ohne kompletten Umzugsservice an."
    }
  ];

  const priceExamples = [
    { height: "Bis 3. Stock", time: "2-3 Std.", price: "CHF 300–450", items: "Standardeinsatz" },
    { height: "4.-6. Stock", time: "3-4 Std.", price: "CHF 450–600", items: "Mittlere Höhe" },
    { height: "7.-10. Stock", time: "4-5 Std.", price: "CHF 600–800", items: "Hohe Gebäude" },
    { height: "Spezialeinsatz", time: "Individuell", price: "Auf Anfrage", items: "Klaviere, Tresore" }
  ];

  const processSteps = [
    { step: "1", title: "Anfrage stellen", description: "Beschreiben Sie Ihre Situation und die zu transportierenden Gegenstände" },
    { step: "2", title: "Besichtigung", description: "Prüfung der Zugänglichkeit und Bewilligungen" },
    { step: "3", title: "Termin buchen", description: "Verbindliche Offerte und Terminvereinbarung" },
    { step: "4", title: "Einsatz", description: "Professioneller Transport über Balkon oder Fenster" }
  ];

  const testimonials = [
    { name: "Markus W.", location: "Zürich", rating: 5, text: "Unser Flügel kam sicher in den 5. Stock. Ohne Möbellift undenkbar!", date: "November 2024" },
    { name: "Lisa M.", location: "Bern", rating: 5, text: "Enges Treppenhaus war kein Problem mehr. Alles in 3 Stunden erledigt.", date: "Oktober 2024" },
    { name: "Stefan B.", location: "Basel", rating: 5, text: "Schnell, sauber und professionell. Klare Empfehlung!", date: "September 2024" }
  ];

  const liftTypes = [
    { type: "Standard-Lift", height: "Bis 20m", capacity: "200kg", suitable: "Möbel, Kartons, Kleinteile" },
    { type: "Gross-Lift", height: "Bis 32m", capacity: "400kg", suitable: "Sofas, grosse Schränke, Betten" },
    { type: "Spezial-Lift", height: "Bis 40m", capacity: "600kg", suitable: "Klaviere, Tresore, Maschinen" }
  ];

  const regions = [
    { name: "Zürich", companies: 18 },
    { name: "Bern", companies: 14 },
    { name: "Basel", companies: 12 },
    { name: "Luzern", companies: 10 },
    { name: "Aargau", companies: 15 },
    { name: "St. Gallen", companies: 11 }
  ];

  const relatedServices = [
    { title: "Privatumzug", href: "/privatumzug", icon: Home },
    { title: "Firmenumzug", href: "/firmenumzug", icon: Building2 },
    { title: "Möbellager", href: "/einlagerung", icon: Package },
    { title: "Entsorgung", href: "/entsorgung-schweiz", icon: Truck }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Möbellift mieten Schweiz – Schnell, sicher & professionell | Umzugscheck.ch"
        description="Möbellift für Ihren Umzug mieten. Schneller Transport schwerer Möbel über Balkon oder Fenster. Bis 32m Höhe, 400kg Tragkraft. Jetzt Offerten vergleichen."
        keywords="möbellift mieten, möbellift umzug, möbellift schweiz, aussenlift, möbellift kosten, möbellift zürich"
        canonicalUrl="https://umzugscheck.ch/moebellift"
      />
      <ServiceSchema
        name="Möbellift mieten Schweiz"
        description="Schneller und sicherer Transport schwerer Möbel über Balkon oder Fenster mit professionellem Möbellift"
        priceRange="CHF 300 - CHF 800"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "Services", url: "https://umzugscheck.ch/dienstleistungen" },
        { name: "Möbellift", url: "https://umzugscheck.ch/moebellift" }
      ]} />

      {/* Hero Section with trust stats */}
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
              <Ruler className="h-4 w-4" />
              <span className="text-sm font-medium">Bis 32m Höhe & 400kg Tragkraft</span>
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
              <ArrowUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Möbellift mieten
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Schwere Möbel sicher und schnell transportieren – über Balkon oder Fenster direkt in Ihre Wohnung
            </p>
            
            {/* Trust Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">4.8/5</span>
                <span className="text-white/70">Bewertung</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">70%</span>
                <span className="text-white/70">Zeitersparnis</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Award className="h-5 w-5" />
                <span className="font-semibold">50+</span>
                <span className="text-white/70">Partner</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rechner">
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg">
                  Jetzt Offerte anfragen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/umzugsfirmen">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white">
                  Umzugsfirmen vergleichen
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
            title="Preisbeispiele Möbellift 2024"
            subtitle="Transparente Preise je nach Einsatzhöhe"
            className="mb-12"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {priceExamples.map((example, index) => (
              <Card key={index} variant="elevated" className="h-full hover-lift text-center overflow-hidden">
                <div className="h-2 gradient-hero" />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1">{example.height}</h3>
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
        </motion.div>
      </PageSection>

      {/* Lift Types */}
      <PageSection variant="muted">
        <motion.div
          ref={typesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={typesVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Möbellift-Typen im Überblick"
            subtitle="Der richtige Lift für jeden Bedarf"
            className="mb-12"
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {liftTypes.map((lift, index) => (
              <Card key={index} variant="elevated" className="h-full hover-lift">
                <CardContent className="p-6 text-center">
                  <ArrowUp className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-4">{lift.type}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Höhe:</span>
                      <span className="font-semibold">{lift.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tragkraft:</span>
                      <span className="font-semibold">{lift.capacity}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <span className="text-muted-foreground">{lift.suitable}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </PageSection>

      {/* Benefits Section */}
      <PageSection variant="default">
        <motion.div
          ref={benefitsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={benefitsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Vorteile eines Möbellifts"
            subtitle="Warum Sie auf einen professionellen Möbellift setzen sollten"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} variant="elevated" className="h-full hover-lift">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
            subtitle="In 4 einfachen Schritten zum Möbellift"
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
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </PageSection>

      {/* When to use Section */}
      <PageSection variant="default">
        <motion.div
          ref={situationsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={situationsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Wann braucht man einen Möbellift?"
            subtitle="Typische Situationen für den Möbellift-Einsatz"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {situations.map((situation, index) => (
              <Card key={index} variant="elevated" className="hover-lift">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <situation.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{situation.title}</h3>
                  <p className="text-sm text-muted-foreground">{situation.description}</p>
                </CardContent>
              </Card>
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
            subtitle="Echte Erfahrungen mit Möbellift-Einsätzen"
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
            title="Möbellift in Ihrer Region"
            subtitle="Professionelle Möbellift-Anbieter schweizweit"
            className="mb-12"
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {regions.map((region, index) => (
              <Link key={index} to={`/umzug/${region.name.toLowerCase()}`}>
                <Card className="hover-lift text-center p-4">
                  <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">{region.name}</h3>
                  <p className="text-xs text-muted-foreground">{region.companies} Anbieter</p>
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
              <h3 className="text-2xl font-bold mb-2">Beratung gewünscht?</h3>
              <p className="text-muted-foreground mb-6">
                Wir prüfen, ob ein Möbellift für Ihre Situation geeignet ist
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button variant="outline" className="h-12 px-6">
                    <Phone className="mr-2 h-4 w-4" />
                    Kontakt aufnehmen
                  </Button>
                </Link>
                <Link to="/rechner">
                  <Button variant="cta" className="h-12 px-6">
                    <Zap className="mr-2 h-4 w-4" />
                    Jetzt Offerte anfragen
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* FAQ Section */}
      <PageSection variant="muted">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Häufige Fragen zum Möbellift"
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

      {/* CTA Section */}
      <CTASection
        title="Möbellift für Ihren Umzug benötigt?"
        description="Holen Sie sich jetzt Offerten von Umzugsfirmen mit Möbellift-Service. Kostenlos und unverbindlich."
        buttonText="Jetzt Offerte anfragen"
        buttonLink="/rechner"
      />
    </div>
  );
}
