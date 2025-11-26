import { StandardHero } from "@/components/common/StandardHero";
import { StandardCard } from "@/components/common/StandardCard";
import { CompanyCard } from "@/components/common/CompanyCard";
import { PriceExampleBlock } from "@/components/common/PriceExampleBlock";
import { HowItWorksSimple } from "@/components/home/HowItWorksSimple";
import { SocialProofSimple } from "@/components/home/SocialProofSimple";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTABlock } from "@/components/home/CTABlock";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { MiniCalculator } from "@/components/home/MiniCalculator";
import { LiveSignal } from "@/components/common/LiveSignal";
import { SEOHead } from "@/components/SEOHead";
import { Star, DollarSign, Zap } from "lucide-react";
import { useFullAnalytics } from "@/hooks/use-analytics";
import { Navigation } from "@/components/Navigation";

/**
 * Homepage - Complete Rebuild
 * Premium Swiss design with conversion-first UX
 */
export const HomePage = () => {
  useFullAnalytics();

  const faqItems = [
    {
      question: "Wie funktioniert umzugscheck.ch?",
      answer: "Beschreibe deinen Umzug in 2 Minuten, erhalte kostenlose Offerten von geprüften Schweizer Umzugsfirmen und wähle das beste Angebot. Einfach, transparent und unverbindlich."
    },
    {
      question: "Was kostet der Service?",
      answer: "Der Vergleich und die Offerten sind 100% kostenlos für dich. Die Umzugsfirmen bezahlen uns für die Vermittlung, nicht du."
    },
    {
      question: "Wie schnell erhalte ich Offerten?",
      answer: "Innerhalb von 24 Stunden erhältst du bis zu 5 kostenlose Offerten von passenden Umzugsfirmen aus deiner Region."
    },
    {
      question: "Sind die Firmen geprüft?",
      answer: "Ja, alle Umzugsfirmen werden von uns geprüft und müssen Qualitätsstandards erfüllen. Zudem kannst du echte Kundenbewertungen einsehen."
    },
    {
      question: "Muss ich mich verpflichten?",
      answer: "Nein, der Service ist komplett unverbindlich. Du entscheidest selbst, welche Offerte du annimmst oder ob du gar keine auswählst."
    },
    {
      question: "In welchen Regionen seid ihr aktiv?",
      answer: "Wir vermitteln Umzugsfirmen in der ganzen Schweiz: Zürich, Bern, Basel, Genf, Lausanne, Luzern und alle anderen Kantone."
    }
  ];

  const topCompanies = [
    {
      id: "company-1",
      name: "Swiss Moving AG",
      rating: 4.9,
      reviewCount: 245,
      priceLevel: "fair" as const,
      services: ["Umzug", "Reinigung", "Lagerung"],
      regions: ["Zürich", "Winterthur"],
      verified: true,
      tagline: "Zuverlässig und pünktlich seit 2010"
    },
    {
      id: "company-2",
      name: "Alpen Transport GmbH",
      rating: 4.8,
      reviewCount: 189,
      priceLevel: "günstig" as const,
      services: ["Umzug", "Entsorgung"],
      regions: ["Bern", "Thun"],
      verified: true,
      tagline: "Günstig und professionell"
    },
    {
      id: "company-3",
      name: "Genève Déménagement",
      rating: 4.7,
      reviewCount: 156,
      priceLevel: "premium" as const,
      services: ["Umzug", "Firmenumzug", "Lagerung"],
      regions: ["Genf", "Lausanne"],
      verified: true,
      sponsored: true,
      tagline: "Premium Service für anspruchsvolle Kunden"
    }
  ];

  const uspCards = [
    {
      icon: Star,
      title: "Geprüfte Qualität",
      description: "Nur verifizierte & bewertete Schweizer Umzugsfirmen."
    },
    {
      icon: DollarSign,
      title: "100% Kostenlos",
      description: "Du zahlst nichts. Die Firmen bewerben sich bei dir."
    },
    {
      icon: Zap,
      title: "Schnell & unkompliziert",
      description: "Offerten in Minuten statt Tagen."
    }
  ];

  const priceExamples = [
    { size: "1-2 Zimmer", distance: "bis 20 km", priceRange: "CHF 450-850", icon: "home" as const },
    { size: "3-4 Zimmer", distance: "bis 50 km", priceRange: "CHF 1'200-2'200", icon: "trending" as const },
    { size: "Haus / 5+ Zimmer", distance: "über 50 km", priceRange: "ab CHF 2'500", icon: "dollar" as const }
  ];

  return (
    <>
      <SEOHead
        pageType="home"
        url="https://www.umzugscheck.ch/"
        faqs={faqItems}
      />

      <Navigation />

      {/* Hero Section */}
      <StandardHero
        h1="Dein stressfreier Umzug beginnt hier"
        subtitle="Vergleiche geprüfte Schweizer Umzugsfirmen & erhalte kostenlose Offerten in 2 Minuten"
        ctaText="JETZT GRATIS OFFERTEN VERGLEICHEN"
        ctaLink="/umzugsofferten"
        secondaryCtaText="Kosten berechnen"
        secondaryCtaLink="/rechner"
      >
        <MiniCalculator />
        <div className="mt-6">
          <LiveSignal />
        </div>
      </StandardHero>

      {/* USPs */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Warum umzugscheck.ch?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Die transparente Vergleichsplattform für deinen stressfreien Umzug
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {uspCards.map((usp, index) => (
              <StandardCard
                key={index}
                icon={usp.icon}
                title={usp.title}
                description={usp.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-16 md:py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Top Umzugsfirmen in der Schweiz
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Von Kunden empfohlen, von uns geprüft
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {topCompanies.map((company) => (
              <CompanyCard key={company.id} {...company} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorksSimple />

      {/* Price Examples */}
      <PriceExampleBlock
        title="Was kostet ein Umzug?"
        subtitle="Transparente Preisbeispiele für die Schweiz"
        examples={priceExamples}
      />

      {/* Social Proof */}
      <SocialProofSimple />

      {/* CTA Block */}
      <CTABlock
        title="Bereit für deinen stressfreien Umzug?"
        description="Vergleiche jetzt kostenlos und spare bis zu 40% auf deinem Umzug"
        buttonText="Jetzt Offerten vergleichen"
        buttonLink="/umzugsofferten"
      />

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Häufig gestellte Fragen
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <StickyMobileCTA text="Kostenlose Offerten – jetzt starten" link="/umzugsofferten" />
    </>
  );
};
