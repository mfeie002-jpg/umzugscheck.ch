import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, Scale, CheckCircle, Phone, TruckIcon, Star, Shield, Clock, Users, Award, ArrowRight, Zap, Heart, Lock, Calculator, MessageCircle, ThumbsUp, Banknote } from "lucide-react";
import { Link } from "react-router-dom";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTASection } from "@/components/CTASection";
import { BreadcrumbSchema, FAQSchema } from "@/components/seo/StructuredData";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function SoFunktionierts() {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();
  const { ref: guaranteesRef, isVisible: guaranteesVisible } = useScrollAnimation();

  const steps = [
    {
      number: "1",
      icon: FileText,
      title: "Umzugsdetails angeben",
      description: "Füllen Sie unser kurzes Formular aus (dauert nur 2 Minuten). Geben Sie Ihre Umzugsdetails an: Von wo nach wo, Wohnungsgrösse und gewünschte Services.",
      time: "2 Minuten",
      tip: "Je genauer Ihre Angaben, desto präziser die Offerten"
    },
    {
      number: "2",
      icon: Search,
      title: "Passende Firmen finden",
      description: "Unser KI-Algorithmus durchsucht über 200 geprüfte Umzugsfirmen und findet die besten Matches für Ihren spezifischen Umzug.",
      time: "Automatisch",
      tip: "Wir prüfen Bewertungen, Verfügbarkeit und Preise"
    },
    {
      number: "3",
      icon: Scale,
      title: "Bis zu 5 Offerten erhalten",
      description: "Erhalten Sie kostenlose und unverbindliche Offerten von bis zu 5 qualifizierten Umzugsfirmen direkt per E-Mail oder Telefon.",
      time: "24-48 Stunden",
      tip: "Alle Offerten sind verbindlich und vergleichbar"
    },
    {
      number: "4",
      icon: CheckCircle,
      title: "Offerten vergleichen",
      description: "Vergleichen Sie die erhaltenen Angebote nach Preis, Leistungen, Bewertungen und wählen Sie die Umzugsfirma, die am besten zu Ihnen passt.",
      time: "In Ruhe entscheiden",
      tip: "Nutzen Sie unseren Vergleichsrechner für bessere Übersicht"
    },
    {
      number: "5",
      icon: Phone,
      title: "Firma direkt kontaktieren",
      description: "Kontaktieren Sie Ihre Wunschfirma direkt für weitere Details, Terminvereinbarung oder Fragen. Wir helfen gerne bei Unklarheiten.",
      time: "Jederzeit",
      tip: "Bei Fragen steht unser Support bereit"
    },
    {
      number: "6",
      icon: TruckIcon,
      title: "Entspannt umziehen",
      description: "Lehnen Sie sich zurück, während die Profis Ihren Umzug durchführen. Alle unsere Partnerfirmen sind versichert und zertifiziert.",
      time: "Am Umzugstag",
      tip: "Versicherungsschutz durch alle Partner garantiert"
    }
  ];

  const benefits = [
    { icon: CheckCircle, text: "100% kostenlos und unverbindlich" },
    { icon: Lock, text: "Keine versteckten Gebühren" },
    { icon: Shield, text: "Nur geprüfte und versicherte Firmen" },
    { icon: Banknote, text: "Durchschnittlich 40% Ersparnis" },
    { icon: Heart, text: "Keine Verpflichtung zur Auftragserteilung" },
    { icon: MessageCircle, text: "Persönliche Beratung bei Bedarf" }
  ];

  const stats = [
    { value: "15'000+", label: "Erfolgreiche Umzüge", icon: TruckIcon },
    { value: "200+", label: "Geprüfte Partner", icon: Users },
    { value: "4.8/5", label: "Durchschnittsbewertung", icon: Star },
    { value: "40%", label: "Durchschnittliche Ersparnis", icon: Banknote }
  ];

  const guarantees = [
    { icon: Shield, title: "Qualitätsgarantie", description: "Nur verifizierte und versicherte Umzugsfirmen in unserem Netzwerk" },
    { icon: Lock, title: "Datenschutz", description: "Ihre Daten werden verschlüsselt übertragen und nicht an Dritte verkauft" },
    { icon: ThumbsUp, title: "Zufriedenheitsgarantie", description: "Bei Problemen vermitteln wir zwischen Ihnen und der Firma" },
    { icon: Clock, title: "Schnelle Antwort", description: "Sie erhalten innerhalb von 24-48 Stunden mindestens 3 Offerten" }
  ];

  const faqs = [
    {
      question: "Ist der Service wirklich kostenlos?",
      answer: "Ja, für Sie als Kunde ist unser Service zu 100% kostenlos. Wir finanzieren uns durch eine kleine Vermittlungsgebühr, die die Umzugsfirmen zahlen – nicht Sie."
    },
    {
      question: "Wie werden die Umzugsfirmen ausgewählt?",
      answer: "Alle Partnerfirmen durchlaufen einen strengen Prüfprozess: Versicherungsnachweis, Bewilligungen, Kundenbewertungen und persönliche Qualitätschecks."
    },
    {
      question: "Muss ich mich für eine Firma entscheiden?",
      answer: "Nein, Sie haben keine Verpflichtung. Die Offerten sind unverbindlich und Sie können alle ablehnen, wenn keine passt."
    },
    {
      question: "Wie schnell erhalte ich Offerten?",
      answer: "In der Regel innerhalb von 24-48 Stunden. Bei dringenden Umzügen können Sie uns anrufen für schnellere Bearbeitung."
    },
    {
      question: "Was passiert mit meinen Daten?",
      answer: "Ihre Daten werden nur an die ausgewählten Umzugsfirmen weitergegeben und nicht für Werbezwecke verwendet oder verkauft."
    },
    {
      question: "Kann ich auch nur Reinigung oder Entsorgung anfragen?",
      answer: "Ja, wir vermitteln auch Einzelservices wie Umzugsreinigung, Entsorgung, Möbellagerung oder Möbellift."
    }
  ];

  const testimonials = [
    { name: "Sandra K.", location: "Zürich", text: "Super einfacher Prozess! Hatte innerhalb eines Tages 4 Offerten und konnte entspannt vergleichen.", rating: 5 },
    { name: "Marco B.", location: "Bern", text: "Dank Umzugscheck habe ich über CHF 800 gespart gegenüber meiner ersten Anfrage direkt bei einer Firma.", rating: 5 },
    { name: "Lisa M.", location: "Basel", text: "Sehr professionell und die vermittelte Firma war top. Würde ich jederzeit wieder nutzen.", rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="So funktioniert's – In 6 einfachen Schritten zum Umzug | Umzugscheck.ch"
        description="Erfahren Sie, wie Umzugscheck.ch funktioniert. In nur 6 Schritten von der Offertanfrage bis zum erfolgreichen Umzug. 100% kostenlos und unverbindlich."
        canonicalUrl="https://www.umzugscheck.ch/so-funktionierts"
        keywords="umzug anleitung, umzugsofferten erhalten, umzugsfirmen vergleichen, wie funktioniert umzugscheck"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "So funktioniert's", url: "https://umzugscheck.ch/so-funktionierts" }
      ]} />

      {/* Hero */}
      <section className="relative py-20 md:py-28 gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Nur 2 Minuten bis zur ersten Offerte</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              So funktioniert's
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
              In nur 6 einfachen Schritten zu Ihrem erfolgreichen Umzug – kostenlos, unverbindlich und stressfrei
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzugsofferten">
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg bg-white text-primary hover:bg-white/90">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/umzugsofferten">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white">
                  <Calculator className="mr-2 h-5 w-5" />
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Bar */}
      <motion.section 
        ref={statsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={statsVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-12 bg-white border-b"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Steps */}
      <PageSection variant="default">
        <SectionHeading
          title="Der Weg zu Ihrem Umzug"
          subtitle="6 einfache Schritte zum stressfreien Umzug"
          className="mb-16"
        />
        <div className="max-w-5xl mx-auto space-y-8">
          {steps.map((step, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <Card variant="elevated" className="hover-lift overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-32 bg-primary/5 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r">
                      <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-2">
                        {step.number}
                      </div>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {step.time}
                      </span>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <step.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                          <p className="text-muted-foreground leading-relaxed mb-3">
                            {step.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <Zap className="h-4 w-4" />
                            <span className="font-medium">{step.tip}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </PageSection>

      {/* Guarantees */}
      <motion.section 
        ref={guaranteesRef}
        initial={{ opacity: 0, y: 20 }}
        animate={guaranteesVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <PageSection variant="muted">
          <SectionHeading
            title="Unsere Garantien"
            subtitle="Darauf können Sie sich verlassen"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {guarantees.map((guarantee, index) => (
              <Card key={index} variant="elevated" className="h-full hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <guarantee.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{guarantee.title}</h3>
                  <p className="text-sm text-muted-foreground">{guarantee.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageSection>
      </motion.section>

      {/* Benefits */}
      <PageSection variant="default">
        <SectionHeading
          title="Ihre Vorteile auf einen Blick"
          subtitle="Warum Sie Umzugscheck.ch nutzen sollten"
          className="mb-12"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={index} delay={index * 0.05}>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <benefit.icon className="h-6 w-6 text-green-600 flex-shrink-0" />
                <span className="font-medium">{benefit.text}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </PageSection>

      {/* Testimonials */}
      <PageSection variant="muted">
        <SectionHeading
          title="Das sagen unsere Kunden"
          subtitle="Echte Erfahrungen von echten Menschen"
          className="mb-12"
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <Card variant="elevated" className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </PageSection>

      {/* FAQ */}
      <PageSection variant="default">
        <SectionHeading
          title="Häufige Fragen"
          subtitle="Antworten auf die wichtigsten Fragen"
          className="mb-12"
        />
        <div className="max-w-3xl mx-auto">
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

      {/* Quick Contact */}
      <PageSection variant="muted">
        <div className="max-w-2xl mx-auto">
          <Card variant="elevated" className="overflow-hidden">
            <div className="h-2 gradient-hero" />
            <CardContent className="p-8 text-center">
              <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Noch Fragen?</h3>
              <p className="text-muted-foreground mb-6">
                Unser Team hilft Ihnen gerne persönlich weiter
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button variant="outline" className="h-12 px-6">
                    <Phone className="mr-2 h-4 w-4" />
                    Kontakt aufnehmen
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button variant="outline" className="h-12 px-6">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    FAQ lesen
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* CTA */}
      <CTASection
        title="Bereit loszulegen?"
        description="Starten Sie jetzt und erhalten Sie kostenlose Offerten von geprüften Umzugsfirmen"
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}
