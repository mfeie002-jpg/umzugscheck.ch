import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Home, Shield, Clock, TrendingUp, CheckCircle, Package, 
  Star, Users, Truck, Calculator, Phone, MapPin, Award,
  ArrowRight, BadgeCheck, Heart, Zap, Calendar, FileText
} from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTASection } from "@/components/CTASection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";
import { motion } from "framer-motion";

export default function PrivateMoving() {
  // 1. Erweiterte FAQs (8 statt 4)
  const faqs = [
    {
      question: "Was kostet ein Privatumzug in der Schweiz?",
      answer: "Die Kosten hängen von Wohnungsgrösse, Distanz und Stockwerk ab. Ein 3-Zimmer-Umzug kostet durchschnittlich CHF 1'200–1'800. Mit unserem Preisrechner erhalten Sie eine genaue Schätzung."
    },
    {
      question: "Was ist im Privatumzug-Service enthalten?",
      answer: "Der Standard-Service umfasst Transport, Ein- und Ausladen sowie Montage/Demontage einfacher Möbel. Zusatzleistungen wie Packservice, Reinigung oder Entsorgung können optional gebucht werden."
    },
    {
      question: "Wie lange im Voraus sollte ich einen Umzug buchen?",
      answer: "Wir empfehlen 2-4 Wochen Vorlauf. In der Hauptsaison (Sommer) kann es sinnvoll sein, noch früher zu buchen. Kurzfristige Umzüge sind oft auch möglich."
    },
    {
      question: "Sind die Umzugsfirmen versichert?",
      answer: "Ja, alle Umzugsfirmen auf umzugscheck.ch sind versichert und zertifiziert. Ihre Möbel und Gegenstände sind während des Transports geschützt."
    },
    {
      question: "Was muss ich vor dem Umzug vorbereiten?",
      answer: "Sortieren Sie Ihre Sachen, beschriften Sie Kartons, informieren Sie Vermieter und Behörden, und sichern Sie einen Parkplatz für den Umzugswagen."
    },
    {
      question: "Kann ich nur bestimmte Möbel transportieren lassen?",
      answer: "Ja, Sie können auch Teilumzüge buchen – z.B. nur schwere Möbel oder einzelne Räume. Die meisten Firmen bieten flexible Pakete an."
    },
    {
      question: "Was passiert bei Beschädigungen während des Umzugs?",
      answer: "Alle Partner-Firmen sind versichert. Dokumentieren Sie Schäden sofort und melden Sie diese der Umzugsfirma. Die Versicherung übernimmt die Kosten."
    },
    {
      question: "Bieten Sie auch Umzüge am Wochenende an?",
      answer: "Ja, viele Umzugsfirmen arbeiten auch samstags. Wochenendumzüge können etwas teurer sein, sind aber bei den meisten Anbietern verfügbar."
    }
  ];

  // 2. Erweiterte Vorteile (8 statt 6)
  const benefits = [
    { icon: Clock, title: "Zeitersparnis", description: "Profis erledigen Ihren Umzug in der Hälfte der Zeit" },
    { icon: Shield, title: "Versicherungsschutz", description: "Vollkasko-Versicherung für alle Möbel und Gegenstände" },
    { icon: TrendingUp, title: "Bis zu 40% sparen", description: "Durch Vergleich finden Sie garantiert die besten Preise" },
    { icon: CheckCircle, title: "Stressfrei", description: "Entspannt umziehen ohne körperliche Belastung" },
    { icon: Package, title: "Komplettservice", description: "Packen, Transportieren, Montieren – alles aus einer Hand" },
    { icon: Home, title: "15+ Jahre Erfahrung", description: "Unsere Partner haben Zehntausende Umzüge durchgeführt" },
    { icon: Award, title: "Geprüfte Partner", description: "Nur verifizierte Firmen mit Top-Bewertungen" },
    { icon: Heart, title: "Persönliche Betreuung", description: "Ein Ansprechpartner von Anfang bis Ende" }
  ];

  // 3. Detaillierter Ablauf (5 statt 3 Schritte)
  const steps = [
    { step: "1", title: "Formular ausfüllen", description: "Geben Sie Ihre Umzugsdetails in 2 Minuten ein", icon: FileText },
    { step: "2", title: "Offerten erhalten", description: "Bis zu 5 kostenlose Angebote innerhalb 24h", icon: Calculator },
    { step: "3", title: "Vergleichen", description: "Preise, Bewertungen und Leistungen prüfen", icon: TrendingUp },
    { step: "4", title: "Buchen", description: "Wunschfirma direkt kontaktieren und buchen", icon: Calendar },
    { step: "5", title: "Umziehen", description: "Entspannt einziehen – Profis erledigen den Rest", icon: Truck }
  ];

  // 4. NEU: Preisbeispiele
  const priceExamples = [
    { size: "1.5-Zimmer", distance: "Lokal (bis 20km)", price: "ab CHF 450", time: "3-4 Std." },
    { size: "2.5-Zimmer", distance: "Lokal (bis 20km)", price: "ab CHF 750", time: "4-5 Std." },
    { size: "3.5-Zimmer", distance: "Lokal (bis 20km)", price: "ab CHF 1'100", time: "5-7 Std." },
    { size: "4.5-Zimmer", distance: "Lokal (bis 20km)", price: "ab CHF 1'500", time: "6-8 Std." },
    { size: "5.5-Zimmer", distance: "Kantonsübergreifend", price: "ab CHF 2'200", time: "8-10 Std." },
    { size: "Haus", distance: "National", price: "ab CHF 3'500", time: "1-2 Tage" }
  ];

  // 5. NEU: Checkliste
  const checklist = [
    "Umzugsdatum mindestens 4 Wochen im Voraus planen",
    "Kündigungsfristen für alte Wohnung prüfen",
    "Adressänderung bei Post, Bank, Versicherungen",
    "Umzugskartons rechtzeitig besorgen",
    "Parkplatz für Umzugswagen reservieren",
    "Zählerstände ablesen und dokumentieren",
    "Nachsendeauftrag bei der Post einrichten",
    "Schlüsselübergabe mit Vermieter vereinbaren"
  ];

  // 6. NEU: Testimonials
  const testimonials = [
    { name: "Sandra M.", location: "Zürich", text: "Dank umzugscheck.ch haben wir 600 CHF gespart. Die Firma war pünktlich und super freundlich!", rating: 5 },
    { name: "Thomas K.", location: "Bern", text: "Innerhalb von 24 Stunden 4 Offerten erhalten. So einfach war Umzugsplanung noch nie.", rating: 5 },
    { name: "Familie Weber", location: "Basel", text: "Von der ersten Anfrage bis zum Einzug – alles hat perfekt geklappt. Sehr empfehlenswert!", rating: 5 }
  ];

  // 7. NEU: Zusatzservices
  const additionalServices = [
    { title: "Packservice", description: "Profis packen Ihre Sachen sicher ein", link: "/rechner/packservice" },
    { title: "Umzugsreinigung", description: "Endreinigung mit Abgabegarantie", link: "/reinigung" },
    { title: "Möbelmontage", description: "Auf- und Abbau aller Möbel", link: "/rechner/moebelmontage" },
    { title: "Einlagerung", description: "Sichere Zwischenlagerung Ihrer Möbel", link: "/einlagerung" }
  ];

  // 8. NEU: Regionen
  const topRegions = [
    { name: "Zürich", count: 42 },
    { name: "Bern", count: 35 },
    { name: "Basel", count: 28 },
    { name: "Luzern", count: 22 },
    { name: "Aargau", count: 38 },
    { name: "St. Gallen", count: 25 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Privatumzug Schweiz – Umzugsfirmen vergleichen & bis zu 40% sparen"
        description="Privatumzug in der Schweiz planen? Vergleichen Sie geprüfte Umzugsfirmen kostenlos. Bis zu 5 Offerten erhalten und bis zu 40% sparen. 15'000+ erfolgreiche Umzüge."
        keywords="privatumzug, privatumzug schweiz, umzug wohnung, wohnungsumzug, umzugsfirma, umzug kosten"
        canonicalUrl="https://www.umzugscheck.ch/privatumzug"
      />
      <ServiceSchema
        name="Privatumzug Schweiz"
        description="Kompletter Service für private Wohnungsumzüge in der ganzen Schweiz"
        priceRange="CHF 450 - CHF 3'500"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "Services", url: "https://umzugscheck.ch/dienstleistungen" },
        { name: "Privatumzug", url: "https://umzugscheck.ch/privatumzug" }
      ]} />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs items={[
          { label: "Services", href: "/dienstleistungen" },
          { label: "Privatumzug" }
        ]} />
      </div>

      {/* 9. Erweiterter Hero mit Stats */}
      <PageSection 
        variant="primary" 
        spacing="xl" 
        className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border border-white/30 rounded-full" />
          <div className="absolute bottom-20 right-10 w-48 h-48 border border-white/20 rounded-full" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <BadgeCheck className="h-5 w-5" />
              <span className="text-sm font-medium">15'000+ erfolgreiche Umzüge</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
              Privatumzug in der Schweiz
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Finden Sie die beste Umzugsfirma für Ihren privaten Umzug. Kostenlose Offerten vergleichen und bis zu 40% sparen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/umzugsofferten">
                <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 bg-white text-primary hover:bg-white/90 shadow-lg group">
                  Jetzt Offerten vergleichen
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/rechner">
                <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 border-white/30 bg-white/10 hover:bg-white/20 text-white">
                  <Calculator className="mr-2 h-5 w-5" />
                  Kosten berechnen
                </Button>
              </Link>
            </div>

            {/* 10. Trust Stats im Hero */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
              {[
                { value: "200+", label: "Partnerfirmen" },
                { value: "4.8/5", label: "Bewertung" },
                { value: "40%", label: "Ersparnis" },
                { value: "26", label: "Kantone" }
              ].map((stat, i) => (
                <div key={i} className="text-center p-3 bg-white/5 rounded-xl">
                  <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </PageSection>

      {/* 11. NEU: Preisbeispiele Section */}
      <PageSection>
        <SectionHeading 
          title="Was kostet ein Privatumzug?" 
          subtitle="Transparente Preisübersicht für Ihren Umzug"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mt-10">
          {priceExamples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">{example.size}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{example.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{example.distance}</p>
                  <div className="text-2xl font-bold text-primary">{example.price}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/rechner">
            <Button variant="outline" size="lg">
              <Calculator className="mr-2 h-5 w-5" />
              Exakten Preis berechnen
            </Button>
          </Link>
        </div>
      </PageSection>

      {/* Was ist ein Privatumzug + Checkliste */}
      <PageSection variant="muted">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* 12. Erweiterter Content */}
          <div>
            <SectionHeading title="Was ist ein Privatumzug?" align="left" size="md" />
            <div className="prose prose-lg max-w-none mt-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Ein Privatumzug bezeichnet den Wohnungswechsel von Privatpersonen oder Familien. 
                Professionelle Umzugsfirmen übernehmen dabei den Transport Ihrer Möbel und persönlichen Gegenstände 
                von der alten zur neuen Wohnung – sicher, schnell und stressfrei.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Je nach Bedarf können Sie zwischen verschiedenen Service-Leveln wählen: vom einfachen Transport 
                bis zum Rundum-sorglos-Paket mit Packservice, Montage und Reinigung. Unsere Partner-Firmen 
                sind alle geprüft, versichert und haben Top-Bewertungen von echten Kunden.
              </p>
            </div>
            
            {/* 13. Quick Contact */}
            <div className="mt-8 p-6 bg-background rounded-xl border">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Haben Sie Fragen?
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Unser Team berät Sie gerne kostenlos und unverbindlich.
              </p>
              <Link to="/kontakt">
                <Button variant="outline" size="sm">
                  Kontakt aufnehmen
                </Button>
              </Link>
            </div>
          </div>
          
          {/* 14. Checkliste */}
          <div>
            <SectionHeading title="Umzugs-Checkliste" align="left" size="md" />
            <Card className="mt-6">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {checklist.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t">
                  <Link to="/ratgeber" className="text-sm text-primary hover:underline flex items-center gap-1">
                    Komplette Umzugs-Checkliste herunterladen
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageSection>

      {/* 15. Erweiterte Vorteile */}
      <PageSection>
        <SectionHeading
          title="Vorteile eines professionellen Privatumzugs"
          subtitle="Warum Sie mit umzugscheck.ch die richtige Wahl treffen"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-10">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageSection>

      {/* 16. Erweiterter Ablauf mit Icons */}
      <PageSection variant="muted">
        <SectionHeading 
          title="So funktioniert's" 
          subtitle="In 5 einfachen Schritten zu Ihrem erfolgreichen Umzug"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mt-10">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                  {item.step}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-primary/20 -translate-y-1/2" />
                )}
              </div>
              <item.icon className="h-6 w-6 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </PageSection>

      {/* 17. NEU: Testimonials */}
      <PageSection>
        <SectionHeading 
          title="Das sagen unsere Kunden" 
          subtitle="Über 15'000 zufriedene Umzugskunden in der Schweiz"
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageSection>

      {/* 18. NEU: Zusatzservices */}
      <PageSection variant="muted">
        <SectionHeading 
          title="Ergänzende Services" 
          subtitle="Alles aus einer Hand für Ihren stressfreien Umzug"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-10">
          {additionalServices.map((service, index) => (
            <Link key={index} to={service.link}>
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <span className="text-primary text-sm flex items-center gap-1">
                    Mehr erfahren
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </PageSection>

      {/* 19. NEU: Regionen-Sektion */}
      <PageSection>
        <SectionHeading 
          title="Umzugsfirmen in Ihrer Region" 
          subtitle="Finden Sie lokale Partner in allen Schweizer Kantonen"
        />
        <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto mt-10">
          {topRegions.map((region, index) => (
            <Link key={index} to={`/umzugsfirmen/${region.name.toLowerCase()}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{region.name}</span>
                <span className="text-xs text-muted-foreground">({region.count})</span>
              </motion.div>
            </Link>
          ))}
          <Link to="/regionen">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full cursor-pointer"
            >
              Alle 26 Kantone
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Link>
        </div>
      </PageSection>

      {/* 20. Erweiterte FAQ */}
      <PageSection variant="muted">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Häufige Fragen zum Privatumzug"
            subtitle="Alles was Sie wissen müssen"
          />
          <div className="mt-10">
            <FAQAccordion items={faqs} variant="compact" />
          </div>
          <div className="text-center mt-8">
            <Link to="/faq" className="text-primary hover:underline text-sm">
              Alle FAQ ansehen →
            </Link>
          </div>
        </div>
      </PageSection>

      {/* Erweitertes CTA */}
      <CTASection
        title="Bereit für Ihren Privatumzug?"
        description="Vergleichen Sie jetzt kostenlos Umzugsfirmen und sparen Sie bis zu 40%"
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}
