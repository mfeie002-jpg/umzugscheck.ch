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
import { KICalculatorShowcase } from "@/components/home/KICalculatorShowcase";
import { useFullAnalytics } from "@/hooks/use-analytics";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RegionCard } from "@/components/home/RegionCard";
import { ServiceCard } from "@/components/home/ServiceCard";
import { WhyUmzugscheckSimple } from "@/components/home/WhyUmzugscheckSimple";
import { TopCompaniesWithLogos } from "@/components/home/TopCompaniesWithLogos";
import { ForProvidersSection } from "@/components/home/ForProvidersSection";

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


  const priceExamples = [
    { 
      size: "1-2 Zimmer Wohnung", 
      distance: "bis 20 km", 
      priceRange: "CHF 450-850", 
      icon: "home" as const,
      duration: "3-5 Stunden",
      volume: "15-25 m³",
      imageUrl: "https://images.unsplash.com/photo-1502672260066-6bc36a27ca20?w=800&auto=format&fit=crop",
      included: [
        "2-3 Umzugshelfer",
        "Kleiner Umzugswagen (20-30 m³)",
        "Standard-Transportversicherung",
        "Be- und Entladen",
        "Kurze Strecken ohne Zuschlag"
      ]
    },
    { 
      size: "3-4 Zimmer Wohnung", 
      distance: "bis 50 km", 
      priceRange: "CHF 1'200-2'200", 
      icon: "trending" as const,
      duration: "6-8 Stunden",
      volume: "30-45 m³",
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop",
      included: [
        "3-4 erfahrene Umzugshelfer",
        "Grosser Umzugswagen (40-50 m³)",
        "Vollkasko-Transportversicherung",
        "Möbeldemontage & Montage",
        "Spezial-Tragegurte & Schutzdecken",
        "Entsorgung Verpackungsmaterial"
      ]
    },
    { 
      size: "Haus / 5+ Zimmer", 
      distance: "über 50 km", 
      priceRange: "ab CHF 2'500", 
      icon: "dollar" as const,
      duration: "1-2 Tage",
      volume: "50-80+ m³",
      imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop",
      included: [
        "4-6 professionelle Umzugshelfer",
        "Mehrere Fahrzeuge bei Bedarf",
        "Premium-Transportversicherung",
        "Komplette Möbeldemontage & Montage",
        "Spezialtransporte (Piano, Tresor, etc.)",
        "Einpack-Service & Kartonage",
        "Zwischenlagerung möglich",
        "Endreinigung optional"
      ]
    }
  ];

  return (
    <>
      <SEOHead
        pageType="home"
        url="https://www.umzugscheck.ch/"
        faqs={faqItems}
        companies={topCompanies}
      />

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

      {/* Services with Rich Content - MOVED UP (Priority #1 after hero) */}
      <section className="py-16 bg-gradient-to-br from-happy-yellow/10 via-happy-pink/10 to-happy-purple/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Unsere Dienstleistungen
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Alle Umzugsdienstleistungen an einem Ort – transparent, günstig und verlässlich
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <ServiceCard
              name="Privatumzug"
              slug="/umzug"
              description="Professioneller Umzug für Privathaushalte mit Komplettservice von A bis Z."
              imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop"
              averageCost="CHF 1'200-2'500"
              savings="bis 40%"
            />
            <ServiceCard
              name="Endreinigung"
              slug="/reinigung"
              description="Professionelle Wohnungsreinigung nach Mietvertrag – abnahmegarantiert."
              imageUrl="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop"
              averageCost="CHF 350-800"
              savings="bis 30%"
            />
            <ServiceCard
              name="Entsorgung"
              slug="/entsorgung"
              description="Fachgerechte Entrümpelung und Entsorgung von Möbeln und Hausrat."
              imageUrl="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop"
              averageCost="CHF 400-1'200"
              savings="bis 35%"
            />
            <ServiceCard
              name="Lagerung"
              slug="/lagerung"
              description="Sichere Möbellagerung in klimatisierten Lagerräumen ab CHF 50/Monat."
              imageUrl="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop"
              averageCost="CHF 150-400/Mt"
              savings="bis 25%"
            />
            <ServiceCard
              name="Firmenumzug"
              slug="/firmenumzug"
              description="Büroumzug mit minimalem Betriebsausfall – termingerecht und effizient."
              imageUrl="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop"
              averageCost="CHF 3'500-8'000"
              savings="bis 35%"
            />
            <ServiceCard
              name="Möbeltransport"
              slug="/transport"
              description="Einzeltransporte von Möbeln und sperrigen Gütern – schnell und sicher."
              imageUrl="https://images.unsplash.com/photo-1586864387634-700a61161b76?w=800&auto=format&fit=crop"
              averageCost="CHF 200-600"
              savings="bis 30%"
            />
            <ServiceCard
              name="Räumung"
              slug="/raeumung"
              description="Komplette Haushaltsauflösung und Wohnungsräumung inkl. Entsorgung."
              imageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop"
              averageCost="CHF 800-2'000"
              savings="bis 40%"
            />
            <ServiceCard
              name="Kombi-Service"
              slug="/umzug-mit-reinigung"
              description="Umzug + Reinigung als Paket – alles aus einer Hand zum Sparpreis."
              imageUrl="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop"
              averageCost="CHF 1'800-3'500"
              savings="bis 45%"
            />
          </div>
        </div>
      </section>

      {/* KI Calculator Showcase */}
      <KICalculatorShowcase />

      {/* Top Companies with Real Logos and People */}
      <TopCompaniesWithLogos />

      {/* Why Umzugscheck - 6 USPs */}
      <WhyUmzugscheckSimple />

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

      {/* For Providers Section */}
      <ForProvidersSection />

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

      {/* Regions with Rich Content */}
      <section className="py-16 bg-gradient-to-br from-happy-coral/10 to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Umzugsfirmen nach Region
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Finde geprüfte Umzugsfirmen in deiner Region und spare bis zu 40% durch unseren Vergleich
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
            <RegionCard
              name="Zürich"
              slug="/zuerich/umzugsfirmen"
              description="Die grösste Stadt der Schweiz mit höchster Umzugsdichte. Profitiere von starker Konkurrenz."
              imageUrl="https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&auto=format&fit=crop"
              averageCost="CHF 1'800-3'200"
              savings="bis 40%"
            />
            <RegionCard
              name="Bern"
              slug="/bern/umzugsfirmen"
              description="Hauptstadt mit breitem Angebot an professionellen Umzugsunternehmen zu fairen Preisen."
              imageUrl="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop"
              averageCost="CHF 1'600-2'800"
              savings="bis 35%"
            />
            <RegionCard
              name="Basel"
              slug="/basel/umzugsfirmen"
              description="Grenzregion mit internationaler Erfahrung und attraktiven Preisen durch Wettbewerb."
              imageUrl="https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&auto=format&fit=crop"
              averageCost="CHF 1'700-2'900"
              savings="bis 38%"
            />
            <RegionCard
              name="Genf"
              slug="/genf/umzugsfirmen"
              description="Internationale Stadt mit mehrsprachigen Umzugsteams und Premium-Service."
              imageUrl="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop"
              averageCost="CHF 1'900-3'400"
              savings="bis 42%"
            />
          </div>
          
          <div className="text-center">
            <Link to="/regionen" className="no-underline">
              <Button variant="outline" size="lg">
                Alle 26 Kantone ansehen
              </Button>
            </Link>
          </div>
        </div>
      </section>


      <StickyMobileCTA text="Kostenlose Offerten – jetzt starten" link="/umzugsofferten" />
    </>
  );
};
