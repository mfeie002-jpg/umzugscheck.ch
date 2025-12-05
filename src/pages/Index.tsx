import { Helmet } from "react-helmet";
import { SkipToContent } from "@/components/SkipToContent";

// Homepage Components
import { Header } from "@/components/homepage/Header";
import { ScrollProgressBar } from "@/components/homepage/ScrollProgressBar";
import { HeroSection } from "@/components/homepage/HeroSection";
import { PartnerLogos } from "@/components/homepage/PartnerLogos";
import { LiveActivityBanner } from "@/components/homepage/LiveActivityBanner";
import { TrustBadges } from "@/components/homepage/TrustBadges";
import { SocialProofSection } from "@/components/homepage/SocialProofSection";
import { CompanyLogosCarousel } from "@/components/homepage/CompanyLogosCarousel";
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection";
import { VideoTestimonial } from "@/components/homepage/VideoTestimonial";
import { HowItWorksSection } from "@/components/homepage/HowItWorksSection";
import { ServicesSection } from "@/components/homepage/ServicesSection";
import { RegionsSection } from "@/components/homepage/RegionsSection";
import { CostExamplesSection } from "@/components/homepage/CostExamplesSection";
import { USPSection } from "@/components/homepage/USPSection";
import { SeasonalBanner } from "@/components/homepage/SeasonalBanner";
import { NewsletterSection } from "@/components/homepage/NewsletterSection";
import { FAQSection } from "@/components/homepage/FAQSection";
import { CTASection } from "@/components/homepage/CTASection";
import { FloatingElements } from "@/components/homepage/FloatingElements";
import { MobileBottomNav } from "@/components/homepage/MobileBottomNav";
import { BackToTop } from "@/components/homepage/BackToTop";
import { CookieConsent } from "@/components/homepage/CookieConsent";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyCTABar } from "@/components/homepage/StickyCTABar";
import { ServiceComparisonTable } from "@/components/homepage/ServiceComparisonTable";
import { RegionalAvailabilityMap } from "@/components/homepage/RegionalAvailabilityMap";
import { TestimonialRatingBreakdown } from "@/components/homepage/TestimonialRatingBreakdown";
import { ErrorBoundary } from "@/components/homepage/ErrorBoundary";
import { GuaranteeBadges } from "@/components/homepage/GuaranteeBadges";
import { MovingTipsCarousel } from "@/components/homepage/MovingTipsCarousel";
import { CompanyHighlight } from "@/components/homepage/CompanyHighlight";
import { InteractiveSwissMap } from "@/components/homepage/InteractiveSwissMap";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";

const Index = () => {
  useSmoothScroll();
  useKeyboardNavigation();

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
      { "@type": "Organization", "@id": "https://umzugscheck.ch/#organization", "name": "Umzugscheck.ch", "url": "https://umzugscheck.ch", "logo": "https://umzugscheck.ch/logo.png", "description": "Die führende Vergleichsplattform für Umzüge in der Schweiz.", "areaServed": { "@type": "Country", "name": "Switzerland" }, "contactPoint": { "@type": "ContactPoint", "contactType": "customer service", "availableLanguage": ["German", "French", "Italian"], "areaServed": "CH" } },
      { "@type": "WebSite", "@id": "https://umzugscheck.ch/#website", "url": "https://umzugscheck.ch", "name": "Umzugscheck.ch", "potentialAction": { "@type": "SearchAction", "target": "https://umzugscheck.ch/umzugsfirmen?q={search_term_string}", "query-input": "required name=search_term_string" } },
      { "@type": "FAQPage", "mainEntity": faqItems.map(item => ({ "@type": "Question", "name": item.question, "acceptedAnswer": { "@type": "Answer", "text": item.answer } })) },
      { "@type": "AggregateRating", "itemReviewed": { "@type": "Organization", "name": "Umzugscheck.ch" }, "ratingValue": "4.8", "bestRating": "5", "ratingCount": "2847" }
    ]
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Umzugsfirmen vergleichen Schweiz 2025 – Kostenlos Offerten erhalten | Umzugscheck.ch</title>
          <meta name="description" content="Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. KI-Preisrechner, transparente Preise, echte Bewertungen. Jetzt vergleichen & sparen!" />
          <meta name="keywords" content="Umzug Schweiz, Umzugsfirmen vergleichen, Umzugsofferten, Umzugskosten, Umzugsrechner" />
          <link rel="canonical" href="https://umzugscheck.ch/" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://umzugscheck.ch/" />
          <meta property="og:title" content="Umzugscheck.ch – Die Nr. 1 für Umzugsvergleiche in der Schweiz" />
          <meta property="og:description" content="Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. KI-Preisrechner, transparente Preise, echte Bewertungen." />
          <meta property="og:image" content="https://umzugscheck.ch/og-image.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="robots" content="index, follow" />
          <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
        </Helmet>

        <SkipToContent />
        <ScrollProgressBar />
        <StickyCTABar />
        <Header />

        <main id="main-content" role="main" className="pb-20 md:pb-0">
          <HeroSection />
          <PartnerLogos />
          <LiveActivityBanner />
          <GuaranteeBadges />
          <TrustBadges />
          <SocialProofSection />
          <CompanyLogosCarousel />
          <HowItWorksSection />
          <ServicesSection />
          <ServiceComparisonTable />
          <CostExamplesSection />
          <CompanyHighlight />
          <VideoTestimonial />
          <TestimonialsSection />
          <div className="container mx-auto px-4 py-8">
            <TestimonialRatingBreakdown />
          </div>
          <RegionalAvailabilityMap />
          <div className="container mx-auto px-4 py-12">
            <InteractiveSwissMap />
          </div>
          <RegionsSection />
          <USPSection />
          <MovingTipsCarousel />
          <SeasonalBanner />
          <CTASection />
          <FAQSection />
          <NewsletterSection />
        </main>

        <SimplifiedFooter />
        <FloatingElements />
        <MobileBottomNav />
        <BackToTop />
        <CookieConsent />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
