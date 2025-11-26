import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Award, CheckCircle2, ArrowRight, Truck, Sparkles, Package, Building2, Home, Recycle } from "lucide-react";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { generateMetaData, generateOGTags } from "@/lib/seo-meta";
import { InternalLinks } from "@/components/InternalLinks";

interface ServiceData {
  name: string;
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundImage: string;
  icon: any;
  priceExamples: { description: string; price: string }[];
  usps: { icon: any; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

const serviceData: Record<string, ServiceData> = {
  umzug: {
    name: "Umzug",
    title: "Professioneller Umzug in der Schweiz – kostenlos Offerten vergleichen",
    subtitle: "Geprüfte Umzugsfirmen, faire Preise, schnelle Verfügbarkeit",
    ctaText: "Jetzt Umzugsofferten vergleichen",
    backgroundImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
    icon: Truck,
    priceExamples: [
      { description: "2 Zimmer innerorts", price: "CHF 650–1'050" },
      { description: "3 Zimmer innerorts", price: "CHF 950–1'600" },
      { description: "4 Zimmer Fernumzug", price: "CHF 1'800–3'200" }
    ],
    usps: [
      { icon: Shield, title: "Geprüfte Profis", description: "Nur verifizierte Umzugsfirmen mit echten Bewertungen" },
      { icon: CheckCircle2, title: "Faire Preise", description: "Transparente Preisgestaltung ohne versteckte Kosten" },
      { icon: Clock, title: "Schnelle Verfügbarkeit", description: "Express-Umzüge innerhalb von 24-48h möglich" }
    ],
    faqs: [
      { question: "Was kostet ein Umzug in der Schweiz?", answer: "Die Kosten variieren je nach Zimmeranzahl, Distanz und Stockwerk. Ein 3-Zimmer-Umzug innerorts kostet durchschnittlich CHF 950–1'600." },
      { question: "Wie finde ich die beste Umzugsfirma?", answer: "Vergleichen Sie mehrere Offerten auf umzugscheck.ch. Achten Sie auf Bewertungen, Versicherungsschutz und transparente Preise." },
      { question: "Sind die Offerten wirklich kostenlos?", answer: "Ja, 100% kostenlos und unverbindlich. Sie zahlen nur, wenn Sie sich für eine Firma entscheiden." },
      { question: "Wie schnell erhalte ich Angebote?", answer: "In der Regel innerhalb von 24 Stunden von mehreren geprüften Anbietern." }
    ]
  },
  reinigung: {
    name: "Endreinigung",
    title: "Endreinigung mit Abnahmegarantie – kostenlos vergleichen",
    subtitle: "Nur geprüfte Reinigungsfirmen. Fixpreis-Angebote möglich",
    ctaText: "Reinigungs-Offerten vergleichen",
    backgroundImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80",
    icon: Sparkles,
    priceExamples: [
      { description: "2 Zimmer Endreinigung", price: "CHF 350–550" },
      { description: "3 Zimmer Endreinigung", price: "CHF 450–700" },
      { description: "4 Zimmer mit Abnahmegarantie", price: "CHF 600–900" }
    ],
    usps: [
      { icon: Shield, title: "Abnahmegarantie", description: "Professionelle Reinigung mit Garantie für die Wohnungsabnahme" },
      { icon: CheckCircle2, title: "Fixpreise", description: "Transparente Festpreise ohne Überraschungen" },
      { icon: Clock, title: "Kurzfristig verfügbar", description: "Auch Last-Minute-Termine möglich" }
    ],
    faqs: [
      { question: "Was beinhaltet eine Endreinigung?", answer: "Eine Endreinigung umfasst alle Räume, Böden, Fenster, Sanitäranlagen und Küche nach Auszugsprotokoll." },
      { question: "Was ist eine Abnahmegarantie?", answer: "Bei Abnahmegarantie wird nachgereinigt, falls der Vermieter etwas beanstandet – ohne Zusatzkosten." },
      { question: "Wie lange dauert eine Endreinigung?", answer: "Je nach Wohnungsgröße 3-8 Stunden. 3-Zimmer-Wohnungen dauern ca. 4-6 Stunden." },
      { question: "Muss ich Reinigungsmittel bereitstellen?", answer: "Nein, professionelle Reinigungsfirmen bringen alle Mittel und Geräte mit." }
    ]
  },
  raeumung: {
    name: "Räumung",
    title: "Räumung & Entrümpelung – sofort Angebote vergleichen",
    subtitle: "Geprüfte Anbieter für Wohnungs- und Hausräumungen",
    ctaText: "Räumungs-Offerten vergleichen",
    backgroundImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80",
    icon: Package,
    priceExamples: [
      { description: "2 Zimmer Räumung", price: "CHF 450–900" },
      { description: "Keller-Räumung", price: "CHF 200–450" },
      { description: "Haushaltsauflösung komplett", price: "CHF 1'200–2'500" }
    ],
    usps: [
      { icon: Recycle, title: "Fachgerechte Entsorgung", description: "Umweltgerechte Entsorgung und Recycling inklusive" },
      { icon: CheckCircle2, title: "Komplettservice", description: "Von Demontage bis Entsorgung alles aus einer Hand" },
      { icon: Clock, title: "Express möglich", description: "Auch kurzfristige Räumungen innerhalb weniger Tage" }
    ],
    faqs: [
      { question: "Was kostet eine Wohnungsräumung?", answer: "Die Kosten hängen von Größe, Menge und Entsorgungsaufwand ab. Eine 2-Zimmer-Räumung kostet CHF 450–900." },
      { question: "Wird alles entsorgt?", answer: "Ja, professionelle Räumungsfirmen entsorgen alles fachgerecht und umweltfreundlich." },
      { question: "Können auch Wertgegenstände verwertet werden?", answer: "Viele Anbieter bieten Verwertung an – das senkt die Gesamtkosten." },
      { question: "Wie schnell kann geräumt werden?", answer: "Express-Räumungen sind oft innerhalb von 2-3 Tagen möglich." }
    ]
  },
  firmenumzug: {
    name: "Firmenumzug",
    title: "Firmenumzug in der Schweiz – professionelle Anbieter vergleichen",
    subtitle: "Schnell, sicher und mit Planung durch erfahrene Profis",
    ctaText: "Firmenumzug-Offerten vergleichen",
    backgroundImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=80",
    icon: Building2,
    priceExamples: [
      { description: "Kleines Büro (5 Arbeitsplätze)", price: "CHF 900–1'800" },
      { description: "KMU Umzug (20 Mitarbeiter)", price: "CHF 3'500–8'000" },
      { description: "IT-Server-Transport", price: "CHF 500–1'200" }
    ],
    usps: [
      { icon: Shield, title: "Professionelle Planung", description: "Detaillierte Umzugsplanung für minimale Ausfallzeiten" },
      { icon: CheckCircle2, title: "IT-Transport", description: "Sicherer Transport von Servern und IT-Infrastruktur" },
      { icon: Clock, title: "Wochenend-Umzüge", description: "Umzüge außerhalb der Geschäftszeiten möglich" }
    ],
    faqs: [
      { question: "Was kostet ein Firmenumzug?", answer: "Die Kosten variieren stark je nach Bürogröße und IT-Infrastruktur. Ein kleines Büro (5 Arbeitsplätze) kostet CHF 900–1'800." },
      { question: "Können Umzüge am Wochenende stattfinden?", answer: "Ja, viele Anbieter bieten Wochenend- und Nacht-Umzüge für minimale Betriebsunterbrechung." },
      { question: "Wie wird IT-Equipment transportiert?", answer: "Professionelle Firmen nutzen spezielle Verpackung und Transport für Server und IT-Hardware." },
      { question: "Gibt es Versicherungsschutz?", answer: "Ja, professionelle Firmen bieten Vollversicherung für Büromöbel und IT-Equipment." }
    ]
  },
  transport: {
    name: "Transport",
    title: "Möbeltransport & Kleintransporte – sofort Offerten erhalten",
    subtitle: "Schnelle und sichere Transporte in der ganzen Schweiz",
    ctaText: "Transport-Offerten vergleichen",
    backgroundImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    icon: Truck,
    priceExamples: [
      { description: "Sofa-Transport innerorts", price: "CHF 90–180" },
      { description: "Kleinumzug (1-2 Möbel)", price: "CHF 250–450" },
      { description: "Klaviertransport", price: "CHF 300–600" }
    ],
    usps: [
      { icon: Shield, title: "Versicherter Transport", description: "Vollversicherung für wertvolle Möbel und Gegenstände" },
      { icon: CheckCircle2, title: "Flexible Termine", description: "Auch kurzfristige Transporte innerhalb 24-48h" },
      { icon: Clock, title: "Schnelle Abwicklung", description: "Einfache Buchung, schnelle Durchführung" }
    ],
    faqs: [
      { question: "Was kostet ein Möbeltransport?", answer: "Ein einfacher Sofa-Transport innerorts kostet CHF 90–180. Größere oder schwere Möbel kosten mehr." },
      { question: "Können auch schwere Gegenstände transportiert werden?", answer: "Ja, professionelle Anbieter transportieren auch Klaviere, Tresore und andere Schwergüter." },
      { question: "Ist der Transport versichert?", answer: "Ja, alle Transporte sind vollversichert gegen Schäden." },
      { question: "Wie kurzfristig kann transportiert werden?", answer: "Express-Transporte sind oft innerhalb von 24-48 Stunden möglich." }
    ]
  },
  lagerung: {
    name: "Lagerung",
    title: "Selfstorage & Möbellagerung – beste Anbieter vergleichen",
    subtitle: "Sichere und flexible Lagerlösungen in Ihrer Nähe",
    ctaText: "Lager-Offerten vergleichen",
    backgroundImage: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&q=80",
    icon: Package,
    priceExamples: [
      { description: "5–8 m³ Lagerraum", price: "ab CHF 90/Monat" },
      { description: "10–15 m³ Lagerraum", price: "ab CHF 180/Monat" },
      { description: "Klimatisierte Lagerung", price: "ab CHF 120/Monat" }
    ],
    usps: [
      { icon: Shield, title: "Sichere Lagerung", description: "24/7 Überwachung und Versicherungsschutz" },
      { icon: CheckCircle2, title: "Flexible Laufzeiten", description: "Monatlich kündbar ohne lange Bindung" },
      { icon: Home, title: "Klimatisiert", description: "Klimatisierte Räume für empfindliche Gegenstände" }
    ],
    faqs: [
      { question: "Was kostet Möbellagerung?", answer: "Die Kosten hängen vom Volumen ab. 5–8 m³ kosten ab CHF 90/Monat." },
      { question: "Sind die Lagerräume klimatisiert?", answer: "Viele Anbieter bieten klimatisierte Räume für empfindliche Gegenstände." },
      { question: "Wie flexibel sind die Laufzeiten?", answer: "Die meisten Anbieter bieten monatlich kündbare Verträge." },
      { question: "Ist die Lagerung versichert?", answer: "Ja, professionelle Lageranbieter bieten Versicherungsschutz für gelagerte Güter." }
    ]
  },
  entsorgung: {
    name: "Entsorgung",
    title: "Sperrgut & Entsorgung – Angebote sofort vergleichen",
    subtitle: "Schnelle und umweltgerechte Entsorgung in der ganzen Schweiz",
    ctaText: "Entsorgungs-Offerten vergleichen",
    backgroundImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920&q=80",
    icon: Recycle,
    priceExamples: [
      { description: "Sperrgut klein (1-2 Möbel)", price: "CHF 90–150" },
      { description: "Haushalt-Sperrgut", price: "CHF 250–450" },
      { description: "Elektroschrott-Entsorgung", price: "CHF 50–120" }
    ],
    usps: [
      { icon: Recycle, title: "Umweltgerecht", description: "Fachgerechte Entsorgung und Recycling" },
      { icon: CheckCircle2, title: "Schnelle Abholung", description: "Oft innerhalb von 24-48 Stunden möglich" },
      { icon: Shield, title: "Zertifiziert", description: "Zertifizierte Entsorgungsbetriebe" }
    ],
    faqs: [
      { question: "Was kostet Sperrgut-Entsorgung?", answer: "Kleine Sperrgutmengen (1-2 Möbel) kosten CHF 90–150." },
      { question: "Wird alles umweltgerecht entsorgt?", answer: "Ja, professionelle Anbieter entsorgen nach Schweizer Umweltstandards." },
      { question: "Wie schnell kann entsorgt werden?", answer: "Express-Entsorgungen sind oft innerhalb von 24-48 Stunden möglich." },
      { question: "Können auch Elektrogeräte entsorgt werden?", answer: "Ja, Elektroschrott wird fachgerecht nach VREG-Standard entsorgt." }
    ]
  },
  "umzug-mit-reinigung": {
    name: "Umzug + Reinigung",
    title: "Umzug + Endreinigung aus einer Hand – sofort Angebote vergleichen",
    subtitle: "Komplettpaket für stressfreien Umzug mit Abnahmegarantie",
    ctaText: "Kombi-Offerten vergleichen",
    backgroundImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
    icon: Truck,
    priceExamples: [
      { description: "2 Zimmer Kombi-Paket", price: "CHF 1'100–1'800" },
      { description: "3 Zimmer Kombi-Paket", price: "CHF 1'500–2'300" },
      { description: "4 Zimmer mit Abnahmegarantie", price: "CHF 2'200–3'500" }
    ],
    usps: [
      { icon: Shield, title: "Alles aus einer Hand", description: "Umzug und Reinigung von einem Anbieter koordiniert" },
      { icon: CheckCircle2, title: "Abnahmegarantie", description: "Garantierte Wohnungsabnahme inklusive" },
      { icon: Award, title: "Kostenersparnis", description: "Kombi-Pakete günstiger als Einzelbuchung" }
    ],
    faqs: [
      { question: "Was kostet ein Kombi-Paket?", answer: "Ein 3-Zimmer-Kombi-Paket (Umzug + Reinigung) kostet CHF 1'500–2'300." },
      { question: "Spart man mit Kombi-Paketen?", answer: "Ja, Kombi-Pakete sind 10-15% günstiger als separate Buchungen." },
      { question: "Ist die Abnahmegarantie inklusive?", answer: "Viele Anbieter inkludieren Abnahmegarantie im Kombi-Paket." },
      { question: "Kann ich Umzug und Reinigung zeitlich trennen?", answer: "Ja, die Reinigung kann flexibel vor oder nach dem Umzug erfolgen." }
    ]
  }
};

const ServicePage = () => {
  const { service } = useParams<{ service?: string }>();
  const serviceKey = service?.toLowerCase() || 'umzug';
  const serviceInfo = serviceData[serviceKey] || serviceData.umzug;
  const ServiceIcon = serviceInfo.icon;

  // Generate SEO meta data
  const metaData = generateMetaData({ type: 'service', service: serviceKey });
  const currentUrl = `https://umzugscheck.ch/${serviceKey}/`;
  const ogTags = generateOGTags(metaData, currentUrl);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <link rel="canonical" href={currentUrl} />
        
        {/* OpenGraph Tags */}
        <meta property="og:title" content={ogTags['og:title']} />
        <meta property="og:description" content={ogTags['og:description']} />
        <meta property="og:type" content={ogTags['og:type']} />
        <meta property="og:url" content={ogTags['og:url']} />
        <meta property="og:image" content={ogTags['og:image']} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content={ogTags['twitter:card']} />
        <meta name="twitter:title" content={ogTags['twitter:title']} />
        <meta name="twitter:description" content={ogTags['twitter:description']} />
        <meta name="twitter:image" content={ogTags['twitter:image']} />
      </Helmet>

      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-accent/90 to-primary/90 z-0" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url('${serviceInfo.backgroundImage}')` }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
                <ServiceIcon className="h-10 w-10 text-white" />
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                {serviceInfo.title}
              </h1>

              <p className="text-lg md:text-xl mb-8 md:mb-10 text-white/90">
                {serviceInfo.subtitle}
              </p>

              <Link to="/umzugsofferten">
                <Button 
                  size="lg" 
                  className="h-12 md:h-14 px-8 md:px-10 text-base md:text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-lg"
                >
                  {serviceInfo.ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <main>
        {/* How it Works */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12">
                  So funktioniert's
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { number: 1, title: "Anfrage stellen", description: "Beschreiben Sie Ihre Anforderungen in 2 Minuten" },
                    { number: 2, title: "Anbieter vergleichen", description: "Erhalten Sie kostenlose Offerten von geprüften Profis" },
                    { number: 3, title: "Beste Offerte wählen", description: "Entscheiden Sie sich für das beste Angebot" }
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="text-center p-6 hover:shadow-md transition-shadow h-full">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                          {step.number}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Price Examples */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12">
                Preisbeispiele für {serviceInfo.name}
              </h2>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {serviceInfo.priceExamples.map((example, index) => (
                  <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold mb-4">{example.description}</h3>
                    <p className="text-3xl font-bold text-accent mb-2">
                      {example.price}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Why Choose Us */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12">
                Warum umzugscheck?
              </h2>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                {serviceInfo.usps.map((usp, index) => {
                  const Icon = usp.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="text-center p-6 md:p-8 hover:shadow-lg transition-all h-full">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-md mb-6">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{usp.title}</h3>
                        <p className="text-muted-foreground">{usp.description}</p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12">
                  Häufige Fragen zu {serviceInfo.name}
                </h2>
                <FAQAccordion items={serviceInfo.faqs} />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Internal Links */}
        <InternalLinks type="service" currentService={serviceKey} />

        {/* Final CTA */}
        <section className="py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-95" />
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-blob-reverse" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center text-white max-w-3xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
                Jetzt kostenlose {serviceInfo.name}-Offerten erhalten
              </h2>
              <p className="text-base md:text-lg mb-8 md:mb-10 text-white/90">
                In nur 2 Minuten zur Offerte
              </p>
              <Link to="/umzugsofferten">
                <Button 
                  size="lg" 
                  className="h-12 md:h-14 px-8 md:px-10 text-base md:text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-lg"
                >
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm mt-6 text-white/80">
                ✓ 100% kostenlos  ✓ Geprüfte Profis  ✓ Schnelle Antwort
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default ServicePage;