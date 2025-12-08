import { Helmet } from "react-helmet";
import { SkipToContent } from "@/components/SkipToContent";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { AnimatedSection } from "@/components/ui/animated-section";
import { PremiumHeroSection } from "@/components/premium/PremiumHeroSection";
import { PremiumSocialProof } from "@/components/premium/PremiumSocialProof";
import { PremiumHowItWorks } from "@/components/premium/PremiumHowItWorks";
import { PremiumFAQ } from "@/components/premium/PremiumFAQ";
import { TrustSignals } from "@/components/TrustSignals";
import { memo, useMemo, lazy, Suspense } from "react";
import { SectionSkeleton } from "@/components/ui/section-skeleton";

// Lazy load below-fold sections for better performance
const LazyPremiumCostExamples = lazy(() => import("@/components/premium/PremiumCostExamples").then(m => ({ default: m.PremiumCostExamples })));
const LazyPremiumProviderCTA = lazy(() => import("@/components/premium/PremiumProviderCTA").then(m => ({ default: m.PremiumProviderCTA })));
const LazyPremiumAIShowcase = lazy(() => import("@/components/premium/PremiumAIShowcase").then(m => ({ default: m.PremiumAIShowcase })));
const LazyPremiumServicesGrid = lazy(() => import("@/components/premium/PremiumServicesGrid").then(m => ({ default: m.PremiumServicesGrid })));
const LazyPremiumRegions = lazy(() => import("@/components/premium/PremiumRegions").then(m => ({ default: m.PremiumRegions })));
const LazyPremiumWhyUs = lazy(() => import("@/components/premium/PremiumWhyUs").then(m => ({ default: m.PremiumWhyUs })));
const LazyComparisonShowcase = lazy(() => import("@/components/home/ComparisonShowcase").then(m => ({ default: m.ComparisonShowcase })));

const IndexPremium = () => {
  // FAQ data - memoized
  const faqItems = useMemo(() => [
    {
      question: "Wie funktioniert der Vergleich genau?",
      answer: "Sie füllen unser kurzes Formular mit Ihren Umzugsdetails aus. Unser AI-System analysiert Ihre Anforderungen und findet passende, geprüfte Umzugsfirmen in Ihrer Region. Innerhalb von 24-48 Stunden erhalten Sie mehrere unverbindliche Offerten zum Vergleichen."
    },
    {
      question: "Kostet mich der Service etwas?",
      answer: "Nein, unser Vergleichsservice ist für Sie als Kunde zu 100% kostenlos und unverbindlich. Es entstehen keinerlei Verpflichtungen durch die Anfrage."
    },
    {
      question: "Wie werden die Umzugsfirmen ausgewählt?",
      answer: "Alle Partner auf unserer Plattform durchlaufen einen strengen Prüfprozess. Wir verifizieren Versicherungen, Bewilligungen, Kundenbewertungen und Qualitätsstandards. Nur seriöse Schweizer Unternehmen werden aufgenommen."
    },
    {
      question: "Wie schnell erhalte ich Angebote?",
      answer: "In der Regel erhalten Sie innerhalb von 24-48 Stunden mehrere Offerten von passenden Umzugsfirmen. Bei dringenden Anfragen kann es auch schneller gehen."
    },
    {
      question: "Sind die Angebote verbindlich?",
      answer: "Die Offerten, die Sie erhalten, sind Richtangebote basierend auf Ihren Angaben. Nach einer Besichtigung oder detaillierten Abklärung erstellt die gewählte Firma ein verbindliches Angebot."
    },
    {
      question: "Was passiert, wenn etwas beschädigt wird?",
      answer: "Alle unsere Partnerfirmen sind vollumfänglich versichert. Im unwahrscheinlichen Fall eines Schadens sind Sie durch die Transportversicherung der Umzugsfirma geschützt."
    },
    {
      question: "Kann ich auch Firmenumzüge vergleichen?",
      answer: "Ja, unser Service deckt sowohl Privatumzüge als auch Firmen- und Büroumzüge ab. Wir haben spezialisierte Partner für jeden Umzugstyp."
    },
    {
      question: "In welchen Regionen ist der Service verfügbar?",
      answer: "Unser Service ist schweizweit verfügbar. Wir haben Partner in allen 26 Kantonen und decken sowohl städtische als auch ländliche Gebiete ab."
    }
  ], []);

  // Memoized schema
  const schemaScript = useMemo(() => JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://umzugscheck.ch/#organization",
        "name": "Umzugscheck.ch",
        "url": "https://umzugscheck.ch",
        "logo": "https://umzugscheck.ch/logo.png",
        "description": "Die führende Schweizer Plattform für den Vergleich von Umzugsfirmen.",
        "areaServed": "CH"
      },
      {
        "@type": "WebSite",
        "@id": "https://umzugscheck.ch/#website",
        "url": "https://umzugscheck.ch",
        "name": "Umzugscheck.ch",
        "publisher": { "@id": "https://umzugscheck.ch/#organization" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": { "@type": "Answer", "text": item.answer }
        }))
      },
      {
        "@type": "AggregateRating",
        "itemReviewed": { "@type": "Organization", "name": "Umzugscheck.ch" },
        "ratingValue": "4.8",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "2847"
      }
    ]
  }), [faqItems]);

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Helmet>
        <title>Umzugsfirmen vergleichen Schweiz 2025 – Kostenlos | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Vergleichen Sie 200+ geprüfte Schweizer Umzugsfirmen kostenlos. KI-Preisanalyse, echte Bewertungen, bis zu 40% sparen. Jetzt Offerten erhalten!" 
        />
        <meta name="keywords" content="Umzug Schweiz, Umzugsfirmen vergleichen, Umzugsofferten, günstige Umzugsfirma" />
        <link rel="canonical" href="https://umzugscheck.ch/" />
        <meta property="og:title" content="Umzugsfirmen vergleichen Schweiz | Umzugscheck.ch" />
        <meta property="og:description" content="200+ geprüfte Umzugsfirmen. KI-Rechner. Bis zu 40% sparen!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://umzugscheck.ch/" />
        <meta property="og:locale" content="de_CH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <meta name="geo.region" content="CH" />
        <script type="application/ld+json">{schemaScript}</script>
      </Helmet>
      
      <SkipToContent />
      
      <main id="main-content" role="main">
        {/* Hero - Critical */}
        <PremiumHeroSection />
        
        {/* Trust */}
        <TrustSignals />
        
        {/* Social Proof */}
        <AnimatedSection animation="fade-up">
          <PremiumSocialProof />
        </AnimatedSection>
        
        {/* How It Works */}
        <AnimatedSection animation="fade-up">
          <PremiumHowItWorks />
        </AnimatedSection>

        {/* Comparison - Lazy */}
        <Suspense fallback={<SectionSkeleton height="min-h-[400px]" variant="cards" />}>
          <AnimatedSection animation="fade-in">
            <LazyComparisonShowcase variant="premium" />
          </AnimatedSection>
        </Suspense>
        
        {/* AI Calculator - Lazy */}
        <Suspense fallback={<SectionSkeleton height="min-h-[500px]" />}>
          <AnimatedSection animation="scale">
            <LazyPremiumAIShowcase />
          </AnimatedSection>
        </Suspense>
        
        {/* Services - Lazy */}
        <Suspense fallback={<SectionSkeleton height="min-h-[400px]" variant="cards" />}>
          <AnimatedSection animation="fade-up">
            <LazyPremiumServicesGrid />
          </AnimatedSection>
        </Suspense>
        
        {/* Cost Examples - Lazy */}
        <Suspense fallback={<SectionSkeleton height="min-h-[350px]" variant="cards" />}>
          <AnimatedSection animation="fade-up">
            <LazyPremiumCostExamples />
          </AnimatedSection>
        </Suspense>
        
        {/* Regions - Lazy */}
        <Suspense fallback={<SectionSkeleton height="min-h-[300px]" />}>
          <AnimatedSection animation="slide-left">
            <LazyPremiumRegions />
          </AnimatedSection>
        </Suspense>
        
        {/* Why Us - Lazy */}
        <Suspense fallback={<SectionSkeleton height="min-h-[400px]" variant="cards" />}>
          <AnimatedSection animation="scale">
            <LazyPremiumWhyUs />
          </AnimatedSection>
        </Suspense>
        
        {/* FAQ */}
        <AnimatedSection animation="fade-in">
          <PremiumFAQ items={faqItems} />
        </AnimatedSection>
        
        {/* Provider CTA - Lazy */}
        <Suspense fallback={<SectionSkeleton height="min-h-[200px]" />}>
          <AnimatedSection animation="fade-up">
            <LazyPremiumProviderCTA />
          </AnimatedSection>
        </Suspense>
      </main>
      
      <StickyMobileCTA />
      <ScrollToTop />
    </div>
  );
};

export default memo(IndexPremium);
