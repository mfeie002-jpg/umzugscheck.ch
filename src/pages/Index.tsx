import { Helmet } from "react-helmet";
import { SkipToContent } from "@/components/SkipToContent";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { PremiumHeroSection } from "@/components/premium/PremiumHeroSection";
import { PremiumSocialProof } from "@/components/premium/PremiumSocialProof";
import { PremiumHowItWorks } from "@/components/premium/PremiumHowItWorks";
import { PremiumAIShowcase } from "@/components/premium/PremiumAIShowcase";
import { PremiumServicesGrid } from "@/components/premium/PremiumServicesGrid";
import { PremiumRegions } from "@/components/premium/PremiumRegions";
import { PremiumCostExamples } from "@/components/premium/PremiumCostExamples";
import { PremiumWhyUs } from "@/components/premium/PremiumWhyUs";
import { PremiumFAQ } from "@/components/premium/PremiumFAQ";
import { PremiumProviderCTA } from "@/components/premium/PremiumProviderCTA";

// New Enhanced Components
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { InstantPriceEstimator } from "@/components/InstantPriceEstimator";
import { MoveTimeline } from "@/components/MoveTimeline";
import { RecentlyViewedCompanies } from "@/components/RecentlyViewedCompanies";
import { MoveProgressTracker } from "@/components/MoveProgressTracker";
import { QuickActionsWidget } from "@/components/QuickActionsWidget";

const Index = () => {
  const faqItems = [
    { question: "Wie funktioniert der Vergleich genau?", answer: "Sie füllen unser kurzes Formular mit Ihren Umzugsdetails aus. Unser AI-System analysiert Ihre Anforderungen und findet passende, geprüfte Umzugsfirmen. Innerhalb von 24-48 Stunden erhalten Sie mehrere unverbindliche Offerten." },
    { question: "Kostet mich der Service etwas?", answer: "Nein, unser Vergleichsservice ist für Sie als Kunde zu 100% kostenlos und unverbindlich. Es entstehen keinerlei Verpflichtungen." },
    { question: "Wie werden die Umzugsfirmen ausgewählt?", answer: "Alle Partner durchlaufen einen strengen Prüfprozess. Wir verifizieren Versicherungen, Bewilligungen, Kundenbewertungen und Qualitätsstandards." },
    { question: "Wie schnell erhalte ich Angebote?", answer: "In der Regel erhalten Sie innerhalb von 24-48 Stunden mehrere Offerten von passenden Umzugsfirmen." },
    { question: "Sind die Angebote verbindlich?", answer: "Die Offerten sind Richtangebote basierend auf Ihren Angaben. Nach einer Besichtigung erstellt die Firma ein verbindliches Angebot." },
    { question: "Was passiert, wenn etwas beschädigt wird?", answer: "Alle unsere Partnerfirmen sind vollumfänglich versichert. Im unwahrscheinlichen Fall eines Schadens sind Sie geschützt." },
    { question: "Kann ich auch Firmenumzüge vergleichen?", answer: "Ja, unser Service deckt sowohl Privatumzüge als auch Firmen- und Büroumzüge ab." },
    { question: "In welchen Regionen ist der Service verfügbar?", answer: "Unser Service ist schweizweit verfügbar. Wir haben Partner in allen 26 Kantonen." }
  ];

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": "https://umzugscheck.ch/#organization", "name": "Umzugscheck.ch", "url": "https://umzugscheck.ch", "description": "Die führende Schweizer Plattform für den Vergleich von Umzugsfirmen.", "areaServed": "CH" },
      { "@type": "WebSite", "@id": "https://umzugscheck.ch/#website", "url": "https://umzugscheck.ch", "name": "Umzugscheck.ch" },
      { "@type": "FAQPage", "mainEntity": faqItems.map(item => ({ "@type": "Question", "name": item.question, "acceptedAnswer": { "@type": "Answer", "text": item.answer } })) },
      { "@type": "AggregateRating", "itemReviewed": { "@type": "Organization", "name": "Umzugscheck.ch" }, "ratingValue": "4.8", "bestRating": "5", "ratingCount": "2847" }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzugsfirmen vergleichen Schweiz – Kostenlos Offerten erhalten | Umzugscheck.ch</title>
        <meta name="description" content="Vergleichen Sie Schweizer Umzugsfirmen kostenlos. AI-gestützte Analyse, geprüfte Partner, transparente Preise. Jetzt unverbindlich bis zu 5 Offerten erhalten." />
        <meta name="keywords" content="Umzug Schweiz, Umzugsfirmen vergleichen, Umzugsofferten, Umzugskosten" />
        <link rel="canonical" href="https://umzugscheck.ch/" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>
      
      <SkipToContent />
      
      <main id="main-content" role="main">
        <PremiumHeroSection />
        
        {/* Quick Actions Widget */}
        <section className="container mx-auto px-4 -mt-6 relative z-10">
          <QuickActionsWidget />
        </section>
        
        <PremiumSocialProof />
        
        {/* Enhanced Tools Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Ihre Umzugs-Tools</h2>
              <p className="text-muted-foreground mt-2">Alles was Sie für Ihren Umzug brauchen</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <InstantPriceEstimator />
              <LiveActivityFeed />
              <MoveProgressTracker />
            </div>
          </div>
        </section>
        
        <PremiumHowItWorks />
        <PremiumAIShowcase />
        
        {/* Recently Viewed & Timeline Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6">
              <RecentlyViewedCompanies />
              <MoveTimeline />
            </div>
          </div>
        </section>
        
        <PremiumServicesGrid />
        <PremiumRegions />
        <PremiumCostExamples />
        <PremiumWhyUs />
        <PremiumFAQ items={faqItems} />
        <PremiumProviderCTA />
      </main>

      <StickyMobileCTA text="Offerten vergleichen" link="/umzugsofferten" />
      <ScrollToTop />
    </div>
  );
};

export default Index;
