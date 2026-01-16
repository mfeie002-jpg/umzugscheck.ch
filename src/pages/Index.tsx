import { Helmet } from "react-helmet";
import { lazy, Suspense } from "react";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";
import IndexPremiumScreenshot from "@/pages/IndexPremiumScreenshot";
import { SkipToContent } from "@/components/SkipToContent";
// Navigation is rendered by MainLayout in App.tsx
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { ErrorBoundary } from "@/components/homepage/ErrorBoundary";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { HotjarScript } from "@/components/analytics/HotjarScript";
// Core Components (not lazy - above the fold)
import { EnhancedConversionHero } from "@/components/homepage/EnhancedConversionHero";
import { MobileStickyBar } from "@/components/homepage/MobileStickyBar";
import { SocialProofMarquee } from "@/components/homepage/SocialProofMarquee";

// Lazy loaded components (below the fold)
const EnhancedHowItWorks = lazy(() => import("@/components/homepage/EnhancedHowItWorks").then(m => ({ default: m.EnhancedHowItWorks })));
const CompanyComparisonSection = lazy(() => import("@/components/homepage/CompanyComparisonSection").then(m => ({ default: m.CompanyComparisonSection })));
const AIVideoCalculatorSection = lazy(() => import("@/components/homepage/AIVideoCalculatorSection").then(m => ({ default: m.AIVideoCalculatorSection })));
const EnhancedServicesGrid = lazy(() => import("@/components/homepage/EnhancedServicesGrid").then(m => ({ default: m.EnhancedServicesGrid })));
const CostExamplesSection = lazy(() => import("@/components/homepage/CostExamplesSection").then(m => ({ default: m.CostExamplesSection })));
const EnhancedTestimonials = lazy(() => import("@/components/homepage/EnhancedTestimonials").then(m => ({ default: m.EnhancedTestimonials })));
const EnhancedRegionsGrid = lazy(() => import("@/components/homepage/EnhancedRegionsGrid").then(m => ({ default: m.EnhancedRegionsGrid })));

const EnhancedFAQ = lazy(() => import("@/components/homepage/EnhancedFAQ").then(m => ({ default: m.EnhancedFAQ })));
const EnhancedFinalCTA = lazy(() => import("@/components/homepage/EnhancedFinalCTA").then(m => ({ default: m.EnhancedFinalCTA })));
const CookieConsentBanner = lazy(() => import("@/components/CookieConsentBanner").then(m => ({ default: m.CookieConsentBanner })));
const AlternativeContactSection = lazy(() => import("@/components/homepage/AlternativeContactSection").then(m => ({ default: m.AlternativeContactSection })));


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
  if (isScreenshotRenderMode()) {
    return <IndexPremiumScreenshot />;
  }

  const faqItems = [
    { question: "Wie funktioniert der Vergleich genau?", answer: "Sie füllen unser kurzes Formular mit Ihren Umzugsdetails aus. Unser Experten-System analysiert Ihre Anforderungen und findet passende, geprüfte Umzugsfirmen. Innerhalb von 24-48 Stunden erhalten Sie mehrere unverbindliche Offerten." },
    { question: "Kostet mich der Service etwas?", answer: "Nein, unser Vergleichsservice ist für Sie als Kunde zu 100% kostenlos und unverbindlich. Es entstehen keinerlei Verpflichtungen." },
    { question: "Wie werden die Umzugsfirmen ausgewählt?", answer: "Alle Partner durchlaufen einen strengen Prüfprozess. Wir verifizieren Versicherungen, Bewilligungen, Kundenbewertungen und Qualitätsstandards." },
    { question: "Wie schnell erhalte ich Offerten?", answer: "In der Regel erhalten Sie innerhalb von 24-48 Stunden 3–5 Offerten von passenden Umzugsfirmen per E-Mail." },
    { question: "Sind die Offerten verbindlich?", answer: "Die Offerten sind Richtpreise basierend auf Ihren Angaben. Nach einer Besichtigung erstellt die Firma eine verbindliche Offerte." },
    { question: "Was passiert, wenn etwas beschädigt wird?", answer: "Alle unsere Partnerfirmen sind vollumfänglich versichert. Im unwahrscheinlichen Fall eines Schadens sind Sie geschützt." },
    { question: "Kann ich auch Firmenumzüge vergleichen?", answer: "Ja, unser Service deckt sowohl Privatumzüge als auch Firmen- und Büroumzüge ab." },
    { question: "In welchen Regionen ist der Service verfügbar?", answer: "Unser Service ist schweizweit verfügbar. Wir haben Partner in allen 26 Kantonen." }
  ];

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": "https://umzugscheck.ch/#organization", "name": "Umzugscheck.ch", "url": "https://umzugscheck.ch", "logo": "https://umzugscheck.ch/logo.png", "description": "Die führende Vergleichsplattform für Umzüge in der Schweiz.", "areaServed": { "@type": "Country", "name": "Switzerland" }, "contactPoint": { "@type": "ContactPoint", "telephone": "+41-44-123-45-67", "contactType": "customer service", "availableLanguage": ["German", "French", "Italian"] } },
      { "@type": "WebSite", "@id": "https://umzugscheck.ch/#website", "url": "https://umzugscheck.ch", "name": "Umzugscheck.ch", "potentialAction": { "@type": "SearchAction", "target": "https://umzugscheck.ch/suche?q={search_term_string}", "query-input": "required name=search_term_string" } },
      { "@type": "FAQPage", "mainEntity": faqItems.map(item => ({ "@type": "Question", "name": item.question, "acceptedAnswer": { "@type": "Answer", "text": item.answer } })) },
      { "@type": "AggregateRating", "itemReviewed": { "@type": "Organization", "name": "Umzugscheck.ch" }, "ratingValue": "4.8", "bestRating": "5", "worstRating": "1", "ratingCount": "2847" },
      { "@type": "Service", "name": "Umzugsvergleich Schweiz", "provider": { "@type": "Organization", "name": "Umzugscheck.ch" }, "serviceType": "Moving Quote Comparison", "areaServed": { "@type": "Country", "name": "Switzerland" }, "description": "Kostenloser Vergleich von über 200 Schweizer Umzugsfirmen" }
    ]
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Helmet>
          <html lang="de-CH" />
          <title>Umzugsfirmen vergleichen Schweiz 2025 – Kostenlos Offerten erhalten | Umzugscheck.ch</title>
          <meta name="description" content="Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. Smart-Preisrechner, transparente Preise, echte Bewertungen. Jetzt vergleichen & bis zu 40% sparen!" />
          <meta name="keywords" content="Umzug Schweiz, Umzugsfirma vergleichen, Umzugsofferten, Umzugskosten, Zürich, Bern, Basel, günstig umziehen" />
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <link rel="canonical" href="https://umzugscheck.ch/" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://umzugscheck.ch/" />
          <meta property="og:title" content="Umzugscheck.ch – Die Nr. 1 für Umzugsvergleiche in der Schweiz" />
          <meta property="og:description" content="Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. Bis zu 40% sparen!" />
          <meta property="og:image" content="https://umzugscheck.ch/og-image.jpg" />
          <meta property="og:locale" content="de_CH" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Umzugscheck.ch – Umzugsfirmen vergleichen" />
          <meta name="twitter:description" content="Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen." />
          <meta name="theme-color" content="#0050A8" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
        </Helmet>

        <ScrollProgress />
        <SkipToContent />

        <main id="main-content" role="main">
          {/* 1. Hero with Multi-Step Form + Visual Element */}
          <EnhancedConversionHero />
          
          {/* 2. Social proof immediately after hero */}
          <SocialProofMarquee />
          
          
          {/* 3. How it works - simplified process */}
          <Suspense fallback={<SectionSkeleton height="350px" />}>
            <EnhancedHowItWorks />
          </Suspense>
          
          {/* 4. Company comparison - core value */}
          <Suspense fallback={<SectionSkeleton height="500px" />}>
            <CompanyComparisonSection />
          </Suspense>
          
          {/* 5. KI Video Calculator - Innovation highlight */}
          <Suspense fallback={<SectionSkeleton height="500px" />}>
            <AIVideoCalculatorSection />
          </Suspense>

          {/* 6. Services grid */}
          <Suspense fallback={<SectionSkeleton height="400px" />}>
            <EnhancedServicesGrid />
          </Suspense>
          
          {/* 7. Cost Examples - Preisbeispiele */}
          <Suspense fallback={<SectionSkeleton height="500px" />}>
            <CostExamplesSection />
          </Suspense>
          
          {/* 8. Testimonials */}
          <Suspense fallback={<SectionSkeleton height="350px" />}>
            <EnhancedTestimonials />
          </Suspense>
          
          {/* 9. Alternative Contact - Phone/WhatsApp/Email */}
          <Suspense fallback={<SectionSkeleton height="200px" />}>
            <AlternativeContactSection />
          </Suspense>
          
          {/* 10. Regions */}
          <Suspense fallback={<SectionSkeleton height="300px" />}>
            <EnhancedRegionsGrid />
          </Suspense>
          

          {/* 12. Media logos - trust signals - moved inline to footer */}
          
          {/* 13. FAQ */}
          <Suspense fallback={<SectionSkeleton height="400px" />}>
            <EnhancedFAQ />
          </Suspense>
          
          {/* 14. Final CTA */}
          <Suspense fallback={<SectionSkeleton height="300px" />}>
            <EnhancedFinalCTA />
          </Suspense>
        </main>

        <SimplifiedFooter />
        
        {/* Single mobile CTA approach */}
        <MobileStickyBar />
        
        {/* WhatsApp floating button - appears after 30 seconds */}
        <FloatingWhatsApp 
          phoneNumber="41780980000" 
          message="Hallo! Ich interessiere mich für einen Umzug und hätte gerne mehr Informationen."
          delayMs={30000}
        />
        
        {/* Hotjar session recording & heatmaps */}
        <HotjarScript />
        
        <Suspense fallback={null}>
          <CookieConsentBanner />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
