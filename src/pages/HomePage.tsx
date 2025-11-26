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
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
        companies={topCompanies}
      />

      <Navigation />

      {/* Breadcrumb for SEO */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Startseite</span>
          </nav>
        </div>
      </div>

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

      {/* Internal Links for SEO */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Umzugsfirmen nach Region
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { name: "Zürich", slug: "/zuerich/umzugsfirmen" },
              { name: "Bern", slug: "/bern/umzugsfirmen" },
              { name: "Basel", slug: "/basel/umzugsfirmen" },
              { name: "Genf", slug: "/genf/umzugsfirmen" },
              { name: "Lausanne", slug: "/lausanne/umzugsfirmen" },
              { name: "Luzern", slug: "/luzern/umzugsfirmen" },
              { name: "St. Gallen", slug: "/stgallen/umzugsfirmen" },
              { name: "Winterthur", slug: "/winterthur/umzugsfirmen" },
            ].map((city) => (
              <Link
                key={city.slug}
                to={city.slug}
                className="no-underline p-4 bg-background rounded-lg border border-border hover:border-primary hover:shadow-medium transition-all text-center"
              >
                <span className="text-foreground font-medium hover:text-primary transition-colors">
                  {city.name}
                </span>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/regionen" className="no-underline">
              <Button variant="outline" size="lg">
                Alle Regionen ansehen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Internal Links */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Unsere Dienstleistungen
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Umzug", slug: "/umzug" },
              { name: "Reinigung", slug: "/reinigung" },
              { name: "Entsorgung", slug: "/entsorgung" },
              { name: "Lagerung", slug: "/lagerung" },
              { name: "Firmenumzug", slug: "/firmenumzug" },
              { name: "Transport", slug: "/transport" },
              { name: "Räumung", slug: "/raeumung" },
              { name: "Umzug mit Reinigung", slug: "/umzug-mit-reinigung" },
            ].map((service) => (
              <Link
                key={service.slug}
                to={service.slug}
                className="no-underline p-6 bg-secondary/40 rounded-lg hover:bg-primary/10 hover:shadow-medium transition-all text-center group"
              >
                <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                  {service.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <StickyMobileCTA text="Kostenlose Offerten – jetzt starten" link="/umzugsofferten" />
    </>
  );
};
