import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Truck, Sparkles, Package, Building2, Recycle, CheckCircle2 } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { InternalLinks } from "@/components/InternalLinks";
import { CTABlock } from "@/components/home/CTABlock";
import { HowItWorksSimple } from "@/components/home/HowItWorksSimple";
import { WhyUsCards } from "@/components/home/WhyUsCards";
import { motion } from "framer-motion";
import { initPerformanceOptimizations } from "@/lib/performance";

const serviceData: Record<string, {
  name: string;
  title: string;
  subtitle: string;
  ctaText: string;
  icon: any;
  heroImage: string;
  priceExamples: { description: string; price: string }[];
  faqs: { question: string; answer: string }[];
}> = {
  "umzug": {
    name: "Umzug",
    title: "Umzug in der Schweiz",
    subtitle: "Geprüfte Umzugsfirmen, faire Preise, schnelle Verfügbarkeit",
    ctaText: "Jetzt Umzugsofferten vergleichen",
    icon: Truck,
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
    priceExamples: [
      { description: "2 Zimmer innerorts", price: "CHF 650–1'050" },
      { description: "3 Zimmer innerorts", price: "CHF 950–1'600" },
      { description: "4 Zimmer Fernumzug", price: "CHF 1'800–3'200" }
    ],
    faqs: [
      { question: "Was kostet ein Umzug in der Schweiz?", answer: "Die Kosten variieren je nach Zimmeranzahl, Distanz und Stockwerk. Ein 3-Zimmer-Umzug innerorts kostet durchschnittlich CHF 950–1'600." },
      { question: "Wie finde ich die beste Umzugsfirma?", answer: "Vergleichen Sie mehrere Offerten auf umzugscheck.ch. Achten Sie auf Bewertungen, Versicherungsschutz und transparente Preise." },
      { question: "Sind die Offerten wirklich kostenlos?", answer: "Ja, 100% kostenlos und unverbindlich. Sie zahlen nur, wenn Sie sich für eine Firma entscheiden." }
    ]
  },
  "reinigung": {
    name: "Endreinigung",
    title: "Endreinigung mit Abnahmegarantie",
    subtitle: "Geprüfte Reinigungsfirmen mit Fixpreis-Angeboten",
    ctaText: "Jetzt Reinigungs-Offerten vergleichen",
    icon: Sparkles,
    heroImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80",
    priceExamples: [
      { description: "2 Zimmer Endreinigung", price: "CHF 350–550" },
      { description: "3 Zimmer Endreinigung", price: "CHF 450–700" },
      { description: "4 Zimmer mit Abnahmegarantie", price: "CHF 600–900" }
    ],
    faqs: [
      { question: "Was beinhaltet eine Endreinigung?", answer: "Eine Endreinigung umfasst alle Räume, Böden, Fenster, Sanitäranlagen und Küche nach Auszugsprotokoll." },
      { question: "Was ist eine Abnahmegarantie?", answer: "Bei Abnahmegarantie wird nachgereinigt, falls der Vermieter etwas beanstandet – ohne Zusatzkosten." }
    ]
  },
  "raeumung": {
    name: "Räumung",
    title: "Räumung & Entrümpelung",
    subtitle: "Professionelle Wohnungs- und Hausräumungen",
    ctaText: "Jetzt Räumungs-Offerten vergleichen",
    icon: Package,
    heroImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80",
    priceExamples: [
      { description: "2 Zimmer Räumung", price: "CHF 450–900" },
      { description: "Keller-Räumung", price: "CHF 200–450" },
      { description: "Haushaltsauflösung", price: "CHF 1'200–2'500" }
    ],
    faqs: [
      { question: "Was kostet eine Wohnungsräumung?", answer: "Eine 2-Zimmer-Räumung kostet CHF 450–900, abhängig von Menge und Entsorgungsaufwand." },
      { question: "Wird alles entsorgt?", answer: "Ja, professionelle Räumungsfirmen entsorgen alles fachgerecht und umweltfreundlich." }
    ]
  },
  "firmenumzug": {
    name: "Firmenumzug",
    title: "Firmenumzug in der Schweiz",
    subtitle: "Professionelle Planung für minimale Ausfallzeiten",
    ctaText: "Jetzt Firmenumzug-Offerten vergleichen",
    icon: Building2,
    heroImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=80",
    priceExamples: [
      { description: "Kleines Büro (5 Plätze)", price: "CHF 900–1'800" },
      { description: "KMU (20 Mitarbeiter)", price: "CHF 3'500–8'000" },
      { description: "IT-Server-Transport", price: "CHF 500–1'200" }
    ],
    faqs: [
      { question: "Was kostet ein Firmenumzug?", answer: "Die Kosten variieren stark je nach Bürogröße. Ein kleines Büro (5 Arbeitsplätze) kostet CHF 900–1'800." },
      { question: "Können Umzüge am Wochenende stattfinden?", answer: "Ja, viele Anbieter bieten Wochenend-Umzüge für minimale Betriebsunterbrechung." }
    ]
  },
  "entsorgung": {
    name: "Entsorgung",
    title: "Sperrgut & Entsorgung",
    subtitle: "Schnelle und umweltgerechte Entsorgung",
    ctaText: "Jetzt Entsorgungs-Offerten vergleichen",
    icon: Recycle,
    heroImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920&q=80",
    priceExamples: [
      { description: "Sperrgut klein", price: "CHF 90–150" },
      { description: "Haushalt-Sperrgut", price: "CHF 250–450" },
      { description: "Elektroschrott", price: "CHF 50–120" }
    ],
    faqs: [
      { question: "Was kostet Sperrgut-Entsorgung?", answer: "Kleine Sperrgutmengen kosten CHF 90–150." },
      { question: "Wird alles umweltgerecht entsorgt?", answer: "Ja, professionelle Anbieter entsorgen nach Schweizer Umweltstandards." }
    ]
  },
  "lagerung": {
    name: "Lagerung",
    title: "Selfstorage & Möbellagerung",
    subtitle: "Sichere und flexible Lagerlösungen",
    ctaText: "Jetzt Lager-Offerten vergleichen",
    icon: Package,
    heroImage: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&q=80",
    priceExamples: [
      { description: "5–8 m³ Lagerraum", price: "ab CHF 90/Monat" },
      { description: "10–15 m³ Lagerraum", price: "ab CHF 180/Monat" },
      { description: "Klimatisiert", price: "ab CHF 120/Monat" }
    ],
    faqs: [
      { question: "Was kostet Möbellagerung?", answer: "5–8 m³ kosten ab CHF 90/Monat." },
      { question: "Sind die Lagerräume klimatisiert?", answer: "Viele Anbieter bieten klimatisierte Räume für empfindliche Gegenstände." }
    ]
  },
  "transport": {
    name: "Transport",
    title: "Möbeltransport & Kleintransporte",
    subtitle: "Schnelle und sichere Transporte",
    ctaText: "Jetzt Transport-Offerten vergleichen",
    icon: Truck,
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    priceExamples: [
      { description: "Sofa-Transport", price: "CHF 90–180" },
      { description: "Kleinumzug", price: "CHF 250–450" },
      { description: "Klaviertransport", price: "CHF 300–600" }
    ],
    faqs: [
      { question: "Was kostet ein Möbeltransport?", answer: "Ein Sofa-Transport innerorts kostet CHF 90–180." },
      { question: "Ist der Transport versichert?", answer: "Ja, alle Transporte sind vollversichert." }
    ]
  },
  "umzug-mit-reinigung": {
    name: "Umzug + Reinigung",
    title: "Umzug + Endreinigung aus einer Hand",
    subtitle: "Komplettpaket für stressfreien Umzug",
    ctaText: "Jetzt Kombi-Offerten vergleichen",
    icon: Truck,
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
    priceExamples: [
      { description: "2 Zimmer Kombi", price: "CHF 1'100–1'800" },
      { description: "3 Zimmer Kombi", price: "CHF 1'500–2'300" },
      { description: "4 Zimmer Kombi", price: "CHF 2'200–3'500" }
    ],
    faqs: [
      { question: "Was kostet ein Kombi-Paket?", answer: "Ein 3-Zimmer-Kombi-Paket kostet CHF 1'500–2'300." },
      { question: "Spart man mit Kombi-Paketen?", answer: "Ja, Kombi-Pakete sind 10-15% günstiger als separate Buchungen." }
    ]
  }
};

export default function ServiceOptimized() {
  const { service: serviceSlug, city: citySlug } = useParams<{ service?: string; city?: string }>();
  const serviceKey = serviceSlug?.toLowerCase() || 'umzug';
  const serviceInfo = serviceData[serviceKey] || serviceData.umzug;
  const ServiceIcon = serviceInfo.icon;

  useEffect(() => {
    initPerformanceOptimizations();
  }, []);

  // Build URL and titles based on whether it's city-service or just service
  const isCityService = !!citySlug;
  const cityName = citySlug ? citySlug.charAt(0).toUpperCase() + citySlug.slice(1) : null;
  const currentUrl = isCityService
    ? `https://umzugscheck.ch/${citySlug}/${serviceKey}/`
    : `https://umzugscheck.ch/${serviceKey}/`;

  const pageTitle = isCityService
    ? `${serviceInfo.name} in ${cityName}`
    : serviceInfo.title;

  return (
    <div className="min-h-screen bg-background">
      {/* SEO */}
      <SEOHead
        pageType={isCityService ? "city-service" : "service"}
        service={serviceKey}
        city={citySlug}
        url={currentUrl}
        faqs={serviceInfo.faqs}
      />

      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary via-accent to-primary overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${serviceInfo.heroImage}')` }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
                <ServiceIcon className="h-10 w-10" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {pageTitle}
              </h1>

              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                {serviceInfo.subtitle}
              </p>

              <Link to="/umzugsofferten">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="h-14 px-10 text-lg font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  {serviceInfo.ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How it Works */}
      <HowItWorksSimple />

      {/* Price Examples */}
      <ScrollReveal>
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Preise für {serviceInfo.name}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {serviceInfo.priceExamples.map((example, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="text-center p-8 shadow-medium hover:shadow-strong transition-shadow">
                      <div className="text-sm text-muted-foreground mb-2">{example.description}</div>
                      <div className="text-3xl font-bold text-accent mb-4">{example.price}</div>
                      <div className="text-xs text-muted-foreground">Richtwert</div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Why Us */}
      <WhyUsCards />

      {/* CTA */}
      <CTABlock
        title={`Bereit für ${serviceInfo.name}?`}
        description="Vergleichen Sie jetzt kostenlos Angebote von geprüften Schweizer Anbietern"
        buttonText={serviceInfo.ctaText.toUpperCase()}
        buttonLink="/umzugsofferten"
      />

      {/* FAQ */}
      <ScrollReveal>
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Häufige Fragen
                </h2>
                <p className="text-lg text-muted-foreground">
                  Alles über {serviceInfo.name}
                </p>
              </div>
              <FAQAccordion items={serviceInfo.faqs} variant="compact" />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Internal Links */}
      <InternalLinks type="service" currentService={serviceKey} />

      
      <StickyMobileCTA />
    </div>
  );
}
