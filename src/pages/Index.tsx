import { Helmet } from "react-helmet";
import { lazy, Suspense } from "react";
import { SkipToContent } from "@/components/SkipToContent";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { ErrorBoundary } from "@/components/homepage/ErrorBoundary";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { FloatingCTA } from "@/components/ui/floating-cta";

// Core Components (not lazy - above the fold)
import { ConversionHero } from "@/components/homepage/ConversionHero";
import { TrustBand } from "@/components/homepage/TrustBand";
import { MediaLogosSection } from "@/components/homepage/MediaLogosSection";
import { MobileStickyBar } from "@/components/homepage/MobileStickyBar";

// Lazy loaded components (below the fold)
const EnhancedHowItWorks = lazy(() => import("@/components/homepage/EnhancedHowItWorks").then(m => ({ default: m.EnhancedHowItWorks })));
const CompanyComparisonSection = lazy(() => import("@/components/homepage/CompanyComparisonSection").then(m => ({ default: m.CompanyComparisonSection })));
const EnhancedServicesGrid = lazy(() => import("@/components/homepage/EnhancedServicesGrid").then(m => ({ default: m.EnhancedServicesGrid })));
const EnhancedTestimonials = lazy(() => import("@/components/homepage/EnhancedTestimonials").then(m => ({ default: m.EnhancedTestimonials })));
const EnhancedRegionsGrid = lazy(() => import("@/components/homepage/EnhancedRegionsGrid").then(m => ({ default: m.EnhancedRegionsGrid })));
const EnhancedUSPSection = lazy(() => import("@/components/homepage/EnhancedUSPSection").then(m => ({ default: m.EnhancedUSPSection })));
const EnhancedFAQ = lazy(() => import("@/components/homepage/EnhancedFAQ").then(m => ({ default: m.EnhancedFAQ })));
const EnhancedFinalCTA = lazy(() => import("@/components/homepage/EnhancedFinalCTA").then(m => ({ default: m.EnhancedFinalCTA })));
const CookieConsent = lazy(() => import("@/components/homepage/CookieConsent").then(m => ({ default: m.CookieConsent })));

// Skeleton placeholders with fixed heights to prevent CLS
const SectionSkeleton = ({ height = "400px" }: { height?: string }) => (
  <div 
    className="w-full flex items-center justify-center bg-muted/10"
    style={{ minHeight: height }}
  >
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
      { "@type": "FAQPage", "mainEntity": faqItems.map(item => ({ "@type": "Question", "name": item.question, "acceptedAnswer": { "@type": "Answer", "text": item.answer } })) },
      { "@type": "AggregateRating", "itemReviewed": { "@type": "Organization", "name": "Umzugscheck.ch" }, "ratingValue": "4.8", "bestRating": "5", "ratingCount": "2847" }
    ]
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Helmet>
          <html lang="de-CH" />
          <title>Umzugsfirmen vergleichen Schweiz 2025 – Kostenlos Offerten erhalten | Umzugscheck.ch</title>
          <meta name="description" content="Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. KI-Preisrechner, transparente Preise, echte Bewertungen. Jetzt vergleichen & sparen!" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://umzugscheck.ch/" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://umzugscheck.ch/" />
          <meta property="og:title" content="Umzugscheck.ch – Die Nr. 1 für Umzugsvergleiche in der Schweiz" />
          <meta property="og:description" content="Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. Bis zu 40% sparen!" />
          <meta property="og:image" content="https://umzugscheck.ch/og-image.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
        </Helmet>

        <ScrollProgress />
        <SkipToContent />
        <Header />

        <main id="main-content" role="main">
          <ConversionHero />
          <TrustBand />
          <MediaLogosSection />
          
          <Suspense fallback={<SectionSkeleton height="450px" />}>
            <EnhancedHowItWorks />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton height="600px" />}>
            <CompanyComparisonSection />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton height="500px" />}>
            <EnhancedServicesGrid />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton height="400px" />}>
            <EnhancedTestimonials />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton height="400px" />}>
            <EnhancedUSPSection />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton height="350px" />}>
            <EnhancedRegionsGrid />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton height="500px" />}>
            <EnhancedFAQ />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton height="350px" />}>
            <EnhancedFinalCTA />
          </Suspense>
        </main>

        <SimplifiedFooter />
        <MobileStickyBar />
        <FloatingCTA />
        <Suspense fallback={null}>
          <CookieConsent />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
