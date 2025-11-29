import { useParams } from "react-router-dom";
import { StandardHero } from "@/components/common/StandardHero";
import { CompanyCard } from "@/components/common/CompanyCard";
import { PriceExampleBlock } from "@/components/common/PriceExampleBlock";
import { StandardCard } from "@/components/common/StandardCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTABlock } from "@/components/home/CTABlock";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { MiniCalculator } from "@/components/home/MiniCalculator";
import { LiveSignal } from "@/components/common/LiveSignal";
import { InternalLinkBlock } from "@/components/InternalLinkBlock";
import { SEOHead } from "@/components/SEOHead";
import { Navigation } from "@/components/Navigation";
import { getCityData } from "@/data/cities-complete-fixed";
import { useFullAnalytics } from "@/hooks/use-analytics";
import { MapPin, Clock, Users } from "lucide-react";

/**
 * City Page Template
 * Dynamic template for all 14 major Swiss cities
 */
export const CityPage = () => {
  const { city } = useParams<{ city: string }>();
  useFullAnalytics();
  
  const cityData = getCityData(city || 'zuerich');

  const topCompanies = [
    {
      id: "company-1",
      name: `${cityData.name} Umzüge AG`,
      rating: 4.9,
      reviewCount: 245,
      priceLevel: "fair" as const,
      services: ["Umzug", "Reinigung", "Lagerung"],
      regions: [cityData.name],
      verified: true,
      tagline: "Ihr lokaler Umzugspartner"
    },
    {
      id: "company-2",
      name: `Express Move ${cityData.name}`,
      rating: 4.8,
      reviewCount: 189,
      priceLevel: "günstig" as const,
      services: ["Umzug", "Entsorgung"],
      regions: [cityData.name],
      verified: true,
      tagline: "Schnell und zuverlässig"
    },
    {
      id: "company-3",
      name: `Premium Transport ${cityData.name}`,
      rating: 4.7,
      reviewCount: 156,
      priceLevel: "premium" as const,
      services: ["Umzug", "Firmenumzug", "Lagerung"],
      regions: [cityData.name],
      verified: true,
      sponsored: true,
      tagline: "Premium Service"
    },
    {
      id: "company-4",
      name: "SwissMove Local",
      rating: 4.6,
      reviewCount: 134,
      priceLevel: "fair" as const,
      services: ["Umzug", "Reinigung"],
      regions: [cityData.name],
      verified: true,
      tagline: "Vertrauenswürdig seit 2015"
    },
    {
      id: "company-5",
      name: "Zuver Umzug",
      rating: 4.5,
      reviewCount: 112,
      priceLevel: "günstig" as const,
      services: ["Umzug"],
      regions: [cityData.name],
      verified: true,
      tagline: "Budget-freundlich"
    }
  ];

  const advantages = [
    {
      icon: MapPin,
      title: "Lokale Expertise",
      description: `Unsere Partner kennen ${cityData.name} und die Region wie ihre Westentasche.`
    },
    {
      icon: Clock,
      title: "Schnelle Verfügbarkeit",
      description: "Kurzfristige Termine oft schon in 1-2 Wochen möglich."
    },
    {
      icon: Users,
      title: "Geprüfte Anbieter",
      description: "Alle Firmen sind versichert und von uns verifiziert."
    }
  ];

  const faqItems = [
    {
      question: `Was kostet ein Umzug in ${cityData.name}?`,
      answer: `Die Kosten in ${cityData.name} variieren je nach Wohnungsgröße und Distanz. Ein 3-Zimmer-Umzug kostet durchschnittlich CHF 1'200-2'200.`
    },
    {
      question: `Wie lange im Voraus sollte ich einen Umzug in ${cityData.name} buchen?`,
      answer: `Idealerweise 4-6 Wochen im Voraus. In der Hauptsaison (Mai-September) empfehlen wir 8-12 Wochen Vorlauf.`
    },
    {
      question: `Gibt es Parkierungsbeschränkungen in ${cityData.name}?`,
      answer: `Ja, für Umzüge in ${cityData.name} benötigen Sie oft eine Parkbewilligung. Die Umzugsfirmen helfen bei der Organisation.`
    },
    {
      question: `Welche Stadtteile von ${cityData.name} werden abgedeckt?`,
      answer: `Alle Stadtteile und Quartiere von ${cityData.name} sowie die umliegenden Gemeinden werden vollständig abgedeckt.`
    }
  ];

  return (
    <>
      <SEOHead
        pageType="city"
        city={city}
        url={`https://www.umzugscheck.ch/${city}/umzugsfirmen`}
        faqs={faqItems}
        companies={topCompanies}
      />

      {/* Hero */}
      <StandardHero
        h1={`Umzugsfirmen in ${cityData.name}`}
        subtitle={`Vergleiche geprüfte lokale Umzugsfirmen in ${cityData.name} und erhalte kostenlose Offerten`}
        ctaText={`Offerten in ${cityData.name} vergleichen`}
        ctaLink="/umzugsofferten"
        backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80&auto=format&fit=crop"
      >
        <MiniCalculator />
        <div className="mt-6">
          <LiveSignal />
        </div>
      </StandardHero>

      {/* Top Companies */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Top Umzugsfirmen in {cityData.name}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Von Kunden in {cityData.name} empfohlen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {topCompanies.map((company) => (
              <CompanyCard key={company.id} {...company} />
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 md:py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Vorteile eines Umzugs in {cityData.name}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {advantages.map((advantage, index) => (
              <StandardCard
                key={index}
                icon={advantage.icon}
                title={advantage.title}
                description={advantage.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Price Examples */}
      <PriceExampleBlock
        title={`Umzugskosten in ${cityData.name}`}
        subtitle="Typische Preisbeispiele für Ihre Region"
        examples={cityData.priceExamples}
        cityName={cityData.name}
      />

      {/* Internal Links */}
      <InternalLinkBlock
        title={`Weitere Services in ${cityData.name}`}
        links={[
          { text: `Endreinigung ${cityData.name}`, url: `/${city}/reinigung` },
          { text: `Firmenumzug ${cityData.name}`, url: `/${city}/firmenumzug` },
          { text: `Möbellagerung ${cityData.name}`, url: `/${city}/lagerung` },
          { text: `Entsorgung ${cityData.name}`, url: `/${city}/entsorgung` },
        ]}
      />

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Häufige Fragen zu Umzügen in {cityData.name}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABlock
        title={`Umzug in ${cityData.name} geplant?`}
        description="Vergleiche jetzt kostenlos lokale Umzugsfirmen"
        buttonText={`Offerten in ${cityData.name} sichern`}
        buttonLink="/umzugsofferten"
      />

      <SimplifiedFooter />
      <StickyMobileCTA text="Kostenlose Offerten" link="/umzugsofferten" />
    </>
  );
};
