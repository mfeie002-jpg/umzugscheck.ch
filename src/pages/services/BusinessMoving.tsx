import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Building2, Shield, Clock, Users, Server, FileText, CheckCircle,
  ArrowRight, Award, Zap, Calendar, Phone, MapPin, Star, 
  Monitor, Lock, Truck, Calculator, BadgeCheck, Briefcase
} from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureList } from "@/components/ui/feature-list";
import { CTASection } from "@/components/CTASection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";
import { motion } from "framer-motion";

export default function BusinessMoving() {
  // 1. Erweiterte FAQs (8 statt 4)
  const faqs = [
    {
      question: "Was kostet ein Firmenumzug in der Schweiz?",
      answer: "Die Kosten für einen Firmenumzug variieren je nach Bürogrösse, Anzahl Arbeitsplätze und Distanz. Ein mittleres Büro (10-20 Arbeitsplätze) kostet durchschnittlich CHF 3'000–6'000. Nutzen Sie unseren Rechner für eine genaue Schätzung."
    },
    {
      question: "Können Firmenumzüge am Wochenende durchgeführt werden?",
      answer: "Ja, die meisten Umzugsfirmen bieten Wochenend- und Nachtumzüge an, damit Ihr Geschäftsbetrieb nicht unterbrochen wird."
    },
    {
      question: "Was ist im Firmenumzug-Service enthalten?",
      answer: "Professioneller Transport, Montage/Demontage von Büromöbeln, sichere Verpackung sensibler IT-Geräte, Projektmanagement und Koordination. Zusätzlich buchbar: IT-Umzug, Archivumzug, Lagerung."
    },
    {
      question: "Wie lange dauert ein Firmenumzug?",
      answer: "Je nach Bürogrösse 1-3 Tage. Kleinere Büros können oft an einem Tag umziehen. Grosse Unternehmen planen mehrere Tage oder Wochenenden ein."
    },
    {
      question: "Wie wird sensible IT-Ausrüstung transportiert?",
      answer: "IT-Equipment wird in speziellen antistatischen Verpackungen transportiert. Server werden von Spezialisten demontiert, transportiert und am neuen Standort wieder in Betrieb genommen."
    },
    {
      question: "Können Sie vertrauliche Dokumente sicher transportieren?",
      answer: "Ja, Archivumzüge mit lückenloser Dokumentation und versiegelten Behältern sind Standard. Auf Wunsch mit Begleitpersonal und GPS-Tracking."
    },
    {
      question: "Was passiert, wenn der Umzug länger dauert als geplant?",
      answer: "Professionelle Firmenumzugsunternehmen kalkulieren Pufferzeiten ein. Bei unvorhergesehenen Verzögerungen wird in Absprache mit Ihnen priorisiert, um den Geschäftsbetrieb zu minimieren."
    },
    {
      question: "Bieten Sie Büromöbel-Montage an?",
      answer: "Ja, De- und Remontage aller Büromöbel ist im Standard-Service enthalten. Dies umfasst Schreibtische, Schränke, Konferenztische und Regalanlagen."
    }
  ];

  // 2. Erweiterte Features
  const features = [
    "Minimale Ausfallzeiten – Umzug am Wochenende oder nachts",
    "IT-Spezialtransport – Server und Hardware sicher transportiert",
    "Projektmanagement – Ein Ansprechpartner koordiniert alles",
    "Archivumzug – Sichere Handhabung vertraulicher Dokumente",
    "Büromöbel-Montage – De- und Remontage inklusive",
    "Versicherungsschutz – Vollständige Absicherung",
    "Zwischenlagerung – Falls am neuen Standort noch Arbeiten laufen",
    "Entsorgung alter Möbel – UmweltgerechteEntsorgung"
  ];

  // 3. Erweiterte Benefits (8 statt 4)
  const benefits = [
    { icon: Clock, title: "Minimale Ausfallzeit", description: "Umzug an Wochenenden oder nachts möglich" },
    { icon: Server, title: "IT-Spezialtransport", description: "Sicherer Transport von Servern und Hardware" },
    { icon: Users, title: "Projektmanagement", description: "Dedizierter Ansprechpartner koordiniert alles" },
    { icon: FileText, title: "Archivumzug", description: "Sichere Handhabung vertraulicher Dokumente" },
    { icon: Monitor, title: "Büroinfrastruktur", description: "Komplette IT-Infrastruktur wird übernommen" },
    { icon: Lock, title: "Datensicherheit", description: "DSGVO-konforme Handhabung aller Daten" },
    { icon: Truck, title: "Spezialfahrzeuge", description: "Klimatisierte LKW für sensible Geräte" },
    { icon: Award, title: "ISO-zertifiziert", description: "Partner mit höchsten Qualitätsstandards" }
  ];

  // 4. NEU: Preisbeispiele für Firmenumzüge
  const priceExamples = [
    { size: "5-10 Arbeitsplätze", type: "Kleinbüro", price: "ab CHF 2'500", time: "1 Tag" },
    { size: "10-25 Arbeitsplätze", type: "Mittleres Büro", price: "ab CHF 5'000", time: "1-2 Tage" },
    { size: "25-50 Arbeitsplätze", type: "Grossbüro", price: "ab CHF 10'000", time: "2-3 Tage" },
    { size: "50-100 Arbeitsplätze", type: "Enterprise", price: "ab CHF 20'000", time: "3-5 Tage" },
    { size: "100+ Arbeitsplätze", type: "Konzern", price: "Auf Anfrage", time: "Nach Plan" },
    { size: "Praxis/Labor", type: "Spezialbetrieb", price: "ab CHF 8'000", time: "1-2 Tage" }
  ];

  // 5. NEU: Checkliste Firmenumzug
  const checklist = [
    "Umzugstermin mindestens 3 Monate im Voraus planen",
    "Mitarbeiter frühzeitig informieren und einbeziehen",
    "IT-Abteilung in Planung einbinden",
    "Inventarliste erstellen und aktualisieren",
    "Mietverträge und Kündigungsfristen prüfen",
    "Adressänderungen bei Geschäftspartnern und Behörden",
    "Telefon- und Internetanschluss am neuen Standort organisieren",
    "Schlüsselverteilung und Zugangsberechtigungen planen"
  ];

  // 6. NEU: Testimonials
  const testimonials = [
    { company: "TechStart AG", location: "Zürich", text: "Unser Büroumzug mit 45 Arbeitsplätzen lief reibungslos. Am Montag waren alle Systeme wieder online.", rating: 5, person: "M. Schneider, CEO" },
    { company: "Kanzlei Weber", location: "Bern", text: "Die Handhabung unserer vertraulichen Akten war vorbildlich. Sehr professionell!", rating: 5, person: "Dr. R. Weber" },
    { company: "Design Studio", location: "Basel", text: "Wochenendumzug perfekt organisiert – am Montag konnten wir normal weiterarbeiten.", rating: 5, person: "L. Meier, Inhaberin" }
  ];

  // 7. NEU: Branchen-Spezialisierungen
  const industries = [
    { icon: Monitor, title: "IT & Tech", description: "Server, Workstations, Netzwerk" },
    { icon: FileText, title: "Kanzleien", description: "Akten und Archivierung" },
    { icon: Briefcase, title: "Finanz", description: "DSGVO-konform & sicher" },
    { icon: Building2, title: "Handel", description: "Lager und Showroom" }
  ];

  // 8. NEU: Ablaufschritte
  const processSteps = [
    { step: "1", title: "Beratung", description: "Kostenlose Vor-Ort-Besichtigung", icon: Users },
    { step: "2", title: "Planung", description: "Detaillierter Umzugsplan", icon: Calendar },
    { step: "3", title: "Vorbereitung", description: "Verpackung & IT-Abbau", icon: Server },
    { step: "4", title: "Transport", description: "Sicherer Umzug", icon: Truck },
    { step: "5", title: "Aufbau", description: "Einrichtung & IT-Setup", icon: Building2 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Firmenumzug Schweiz – Büroumzug professionell planen | bis zu 40% sparen"
        description="Firmenumzug in der Schweiz planen? Vergleichen Sie geprüfte Umzugsfirmen für Büro- und Geschäftsumzüge. Minimale Ausfallzeiten, IT-Spezialtransport, kostenlose Offerten."
        canonicalUrl="https://umzugscheck.ch/firmenumzug"
        keywords="Firmenumzug Schweiz, Büroumzug, Geschäftsumzug, Firmenumzug Kosten, Büroumzug Offerten"
      />
      <ServiceSchema
        name="Firmenumzug Schweiz"
        description="Professionelle Büro- und Geschäftsumzüge in der Schweiz mit minimalen Ausfallzeiten"
        priceRange="CHF 2'500 - CHF 50'000"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "Services", url: "https://umzugscheck.ch/dienstleistungen" },
        { name: "Firmenumzug", url: "https://umzugscheck.ch/firmenumzug" }
      ]} />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs items={[
          { label: "Services", href: "/dienstleistungen" },
          { label: "Firmenumzug" }
        ]} />
      </div>

      {/* 9. Erweiterter Hero */}
      <section className="relative py-20 md:py-28 gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-40 h-40 border border-white/20 rounded-full" />
          <div className="absolute bottom-20 left-10 w-60 h-60 border border-white/10 rounded-full" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <BadgeCheck className="h-5 w-5" />
              <span className="text-sm font-medium">Spezialisiert auf Geschäftsumzüge</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Firmenumzug in der Schweiz planen
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Professionelle Büro- und Geschäftsumzüge mit minimierten Ausfallzeiten. Vergleichen Sie spezialisierte Umzugsfirmen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/umzugsofferten">
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg group">
                  Jetzt Offerten vergleichen
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/umzugsrechner">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white">
                  <Calculator className="mr-2 h-5 w-5" />
                  Kosten berechnen
                </Button>
              </Link>
            </div>

            {/* 10. Trust Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
              {[
                { value: "500+", label: "Firmenumzüge" },
                { value: "99%", label: "Pünktlichkeit" },
                { value: "ISO", label: "Zertifiziert" },
                { value: "24/7", label: "Support" }
              ].map((stat, i) => (
                <div key={i} className="text-center p-3 bg-white/5 rounded-xl">
                  <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 11. NEU: Preisbeispiele */}
      <PageSection>
        <SectionHeading 
          title="Was kostet ein Firmenumzug?" 
          subtitle="Transparente Preisübersicht nach Bürogrösse"
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
                    <h3 className="font-bold">{example.type}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{example.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{example.size}</p>
                  <div className="text-2xl font-bold text-primary">{example.price}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageSection>

      {/* 12. Features */}
      <PageSection variant="muted">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <SectionHeading
              title="Was ist im Firmenumzug enthalten?"
              subtitle="Professioneller Service für Ihren Geschäftsumzug"
              align="left"
            />
            <div className="mt-8">
              <FeatureList features={features} columns={1} size="md" />
            </div>
          </div>
          
          {/* 13. Checkliste */}
          <div>
            <SectionHeading title="Firmenumzug-Checkliste" align="left" />
            <Card className="mt-8">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {checklist.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageSection>

      {/* 14. Ablauf */}
      <PageSection>
        <SectionHeading 
          title="Ablauf eines Firmenumzugs" 
          subtitle="Von der Planung bis zum ersten Arbeitstag am neuen Standort"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mt-10">
          {processSteps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                {item.step}
              </div>
              <item.icon className="h-6 w-6 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </PageSection>

      {/* 15. Benefits */}
      <PageSection variant="muted">
        <SectionHeading
          title="Besonderheiten beim Firmenumzug"
          subtitle="Was uns von anderen unterscheidet"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-10">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card variant="elevated" className="text-center hover-lift h-full">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageSection>

      {/* 16. NEU: Branchen */}
      <PageSection>
        <SectionHeading
          title="Spezialisierung nach Branche"
          subtitle="Erfahrung in allen Geschäftsbereichen"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-10">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <industry.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{industry.title}</h3>
                  <p className="text-sm text-muted-foreground">{industry.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageSection>

      {/* 17. NEU: Testimonials */}
      <PageSection variant="muted">
        <SectionHeading
          title="Das sagen unsere Geschäftskunden"
          subtitle="Erfolgreiche Firmenumzüge in der ganzen Schweiz"
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
                  <div className="border-t pt-4">
                    <div className="font-medium">{testimonial.company}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.person}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {testimonial.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageSection>

      {/* 18. NEU: Kontakt-Box */}
      <PageSection>
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Persönliche Beratung</h3>
              <p className="text-muted-foreground mb-6">
                Für grössere Firmenumzüge bieten wir eine kostenlose Vor-Ort-Besichtigung an.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg">
                    <Phone className="mr-2 h-5 w-5" />
                    Beratung anfordern
                  </Button>
                </Link>
                <Link to="/umzugsofferten">
                  <Button size="lg" variant="outline">
                    Online Offerte erhalten
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* 19. FAQ */}
      <PageSection variant="muted">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Häufige Fragen zum Firmenumzug"
            subtitle="Alles was Sie wissen müssen"
          />
          <div className="mt-10">
            <FAQAccordion items={faqs} variant="compact" />
          </div>
        </div>
      </PageSection>

      {/* 20. CTA */}
      <CTASection
        title="Planen Sie jetzt Ihren Firmenumzug"
        description="Erhalten Sie kostenlose Offerten von spezialisierten Umzugsfirmen"
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}
