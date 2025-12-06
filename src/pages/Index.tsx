import { Helmet } from "react-helmet";
import { lazy, Suspense } from "react";
import { SkipToContent } from "@/components/SkipToContent";

// Core Components (Always loaded)
import { Header } from "@/components/homepage/Header";
import { HeroSection } from "@/components/homepage/HeroSection";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { ErrorBoundary } from "@/components/homepage/ErrorBoundary";

// Lazy loaded components for performance
const PartnerLogos = lazy(() => import("@/components/homepage/PartnerLogos").then(m => ({ default: m.PartnerLogos })));
const TrustBadges = lazy(() => import("@/components/homepage/TrustBadges").then(m => ({ default: m.TrustBadges })));
const HowItWorksSection = lazy(() => import("@/components/homepage/HowItWorksSection").then(m => ({ default: m.HowItWorksSection })));
const ServicesSection = lazy(() => import("@/components/homepage/ServicesSection").then(m => ({ default: m.ServicesSection })));
const CostExamplesSection = lazy(() => import("@/components/homepage/CostExamplesSection").then(m => ({ default: m.CostExamplesSection })));
const RegionsSection = lazy(() => import("@/components/homepage/RegionsSection").then(m => ({ default: m.RegionsSection })));
const FAQSection = lazy(() => import("@/components/homepage/FAQSection").then(m => ({ default: m.FAQSection })));
const CTASection = lazy(() => import("@/components/homepage/CTASection").then(m => ({ default: m.CTASection })));
const USPSection = lazy(() => import("@/components/homepage/USPSection").then(m => ({ default: m.USPSection })));
const TestimonialsSection = lazy(() => import("@/components/homepage/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const SocialProofSection = lazy(() => import("@/components/homepage/SocialProofSection").then(m => ({ default: m.SocialProofSection })));
const GuaranteeBadges = lazy(() => import("@/components/homepage/GuaranteeBadges").then(m => ({ default: m.GuaranteeBadges })));

// Loading fallback
const LoadingFallback = () => (
  <div className="h-32 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

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
      { "@type": "Organization", "@id": "https://umzugscheck.ch/#organization", "name": "Umzugscheck.ch", "url": "https://umzugscheck.ch", "logo": "https://umzugscheck.ch/logo.png", "description": "Die führende Vergleichsplattform für Umzüge in der Schweiz.", "areaServed": { "@type": "Country", "name": "Switzerland" } },
      { "@type": "WebSite", "@id": "https://umzugscheck.ch/#website", "url": "https://umzugscheck.ch", "name": "Umzugscheck.ch" },
      { "@type": "FAQPage", "mainEntity": faqItems.map(item => ({ "@type": "Question", "name": item.question, "acceptedAnswer": { "@type": "Answer", "text": item.answer } })) }
    ]
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Umzugsfirmen vergleichen Schweiz 2025 – Kostenlos Offerten erhalten | Umzugscheck.ch</title>
          <meta name="description" content="Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. KI-Preisrechner, transparente Preise, echte Bewertungen. Jetzt vergleichen & sparen!" />
          <link rel="canonical" href="https://umzugscheck.ch/" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Umzugscheck.ch – Die Nr. 1 für Umzugsvergleiche in der Schweiz" />
          <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
        </Helmet>

        <SkipToContent />
        <Header />

        <main id="main-content" role="main" className="pb-20 md:pb-0">
          <HeroSection />
          
          <Suspense fallback={<LoadingFallback />}>
            <PartnerLogos />
          </Suspense>
          
          <Suspense fallback={<LoadingFallback />}>
            <GuaranteeBadges />
          </Suspense>
          
          <Suspense fallback={<LoadingFallback />}>
            <TrustBadges />
          </Suspense>
          
          <Suspense fallback={<LoadingFallback />}>
            <SocialProofSection />
          </Suspense>
          
          <Suspense fallback={<LoadingFallback />}>
            <HowItWorksSection />
          </Suspense>
          
          <Suspense fallback={<LoadingFallback />}>
            <ServicesSection />
          </Suspense>
          
          <Suspense fallback={<LoadingFallback />}>
            <CostExamplesSection />
          </Suspense>
          
          <Suspense fallback={<LoadingFallback />}>
            <TestimonialsSection />
          </Suspense>
          
          <Suspense fallback={<LoadingFallback />}>
            <RegionsSection />
          </Suspense>
          
          <Suspense fallback={<LoadingFallback />}>
            <USPSection />
          </Suspense>
          
          <Suspense fallback={<LoadingFallback />}>
            <FAQSection />
          </Suspense>
          
          <Suspense fallback={<LoadingFallback />}>
            <CTASection />
          </Suspense>
        </main>

        <SimplifiedFooter />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
