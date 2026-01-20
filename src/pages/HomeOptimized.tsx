import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { NewHero } from "@/components/home/NewHero";
import { WhyUmzugscheckSimple } from "@/components/home/WhyUmzugscheckSimple";
import { AirbnbCompanyCard } from "@/components/home/AirbnbCompanyCard";
import { HowItWorksSimple } from "@/components/home/HowItWorksSimple";
import { SocialProofSimple } from "@/components/home/SocialProofSimple";
import { GradientCTA } from "@/components/home/GradientCTA";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Vision10PillarSection } from "@/components/homepage/Vision10PillarSection";
import { CustomerUSPVisualCards } from "@/components/homepage/CustomerUSPVisualCards";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { ScrollReveal } from "@/components/ScrollReveal";
import { initPerformanceOptimizations } from "@/lib/performance";
import { useEffect } from "react";

const topCompanies = [
  {
    id: "1",
    name: "Swiss Premium Movers",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
    rating: 4.9,
    reviewCount: 234,
    priceFrom: "CHF 850",
    badges: ["Top bewertet", "Versichert"],
  },
  {
    id: "2",
    name: "Zürich Umzug Express",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
    rating: 4.8,
    reviewCount: 189,
    priceFrom: "CHF 750",
    badges: ["Beliebt", "Express verfügbar"],
  },
  {
    id: "3",
    name: "Alpen Transport AG",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
    rating: 4.7,
    reviewCount: 156,
    priceFrom: "CHF 900",
    badges: ["Top bewertet", "Versichert"],
  }
];

const faqs = [
  {
    question: "Wie viel kostet ein Umzug in der Schweiz?",
    answer: "Die Kosten variieren je nach Zimmeranzahl, Distanz und Stockwerk. Ein 3-Zimmer-Umzug innerorts kostet durchschnittlich CHF 1'200–1'800. Nutzen Sie unseren kostenlosen Preisrechner für eine genaue Schätzung."
  },
  {
    question: "Wie erhalte ich kostenlose Umzugsofferten?",
    answer: "Einfach das Formular ausfüllen (dauert 2 Minuten), und Sie erhalten bis zu 5 kostenlose Offerten von geprüften Umzugsfirmen. Vollkommen unverbindlich."
  },
  {
    question: "Sind alle Umzugsfirmen geprüft?",
    answer: "Ja, wir arbeiten nur mit verifizierten und versicherten Schweizer Umzugsfirmen. Alle haben echte Kundenbewertungen."
  },
  {
    question: "Wie schnell erhalte ich Angebote?",
    answer: "In der Regel innerhalb von 24 Stunden. Oft sogar schneller. Sie können die Angebote dann in Ruhe vergleichen."
  },
  {
    question: "Muss ich mich für ein Angebot entscheiden?",
    answer: "Nein, der Vergleich ist 100% kostenlos und unverbindlich. Sie entscheiden selbst, ob und welche Firma Sie beauftragen."
  }
];

export default function HomeOptimized() {
  useEffect(() => {
    initPerformanceOptimizations();
  }, []);

  const currentUrl = "https://umzugscheck.ch/";

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Head */}
      <SEOHead
        pageType="home"
        url={currentUrl}
        faqs={faqs}
      />

      {/* Hero with Calculator */}
      <NewHero />

      {/* Why Umzugscheck */}
      <ScrollReveal>
        <WhyUmzugscheckSimple />
      </ScrollReveal>

      {/* Top Companies */}
      <ScrollReveal>
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Top Umzugsfirmen
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Geprüfte Umzugsfirmen mit echten Bewertungen
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
              {topCompanies.map((company, idx) => (
                <AirbnbCompanyCard key={company.id} {...company} delay={idx * 0.1} />
              ))}
            </div>

            <div className="text-center">
              <Link to="/firmen">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Alle 150+ Umzugsfirmen ansehen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* How it Works */}
      <ScrollReveal>
        <HowItWorksSimple />
      </ScrollReveal>

      {/* Social Proof */}
      <ScrollReveal>
        <SocialProofSimple />
      </ScrollReveal>

      {/* 10 Kunden-USPs - Visuelle Infografik-Karten */}
      <ScrollReveal>
        <CustomerUSPVisualCards />
      </ScrollReveal>

      {/* Vision 10 Pillars - Kunden & Investoren USPs (Tabs) */}
      <ScrollReveal>
        <Vision10PillarSection />
      </ScrollReveal>

      {/* CTA Gradient */}
      <GradientCTA
        title="Bereit für Ihren stressfreien Umzug?"
        description="Vergleichen Sie jetzt kostenlos Angebote von geprüften Schweizer Umzugsfirmen."
        buttonText="JETZT GRATIS OFFERTEN VERGLEICHEN"
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
                  Alles, was Sie über Umzugscheck.ch wissen müssen
                </p>
              </div>
              <FAQAccordion items={faqs} variant="compact" />
            </div>
          </div>
        </section>
      </ScrollReveal>


      {/* Sticky Mobile CTA */}
      <StickyMobileCTA />
    </div>
  );
}
