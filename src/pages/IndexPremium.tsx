import { Helmet } from "react-helmet";
import { SkipToContent } from "@/components/SkipToContent";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { ScrollProgress } from "@/components/ui/scroll-progress";
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

import { ComparisonShowcase } from "@/components/home/ComparisonShowcase";

const IndexPremium = () => {
  const faqItems = [
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
      answer: "Alle unsere Partnerfirmen sind vollumfänglich versichert. Im unwahrscheinlichen Fall eines Schadens sind Sie durch die Transportversicherung der Umzugsfirma geschützt. Wir arbeiten nur mit versicherten Partnern zusammen."
    },
    {
      question: "Kann ich auch Firmenumzüge vergleichen?",
      answer: "Ja, unser Service deckt sowohl Privatumzüge als auch Firmen- und Büroumzüge ab. Wir haben spezialisierte Partner für jeden Umzugstyp."
    },
    {
      question: "In welchen Regionen ist der Service verfügbar?",
      answer: "Unser Service ist schweizweit verfügbar. Wir haben Partner in allen 26 Kantonen und decken sowohl städtische als auch ländliche Gebiete ab."
    }
  ];

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://umzugscheck.ch/#organization",
        "name": "Umzugscheck.ch",
        "url": "https://umzugscheck.ch",
        "logo": "https://umzugscheck.ch/logo.png",
        "description": "Die führende Schweizer Plattform für den Vergleich von Umzugsfirmen.",
        "areaServed": "CH",
        "sameAs": []
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
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      },
      {
        "@type": "AggregateRating",
        "itemReviewed": {
          "@type": "Organization",
          "name": "Umzugscheck.ch"
        },
        "ratingValue": "4.8",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "2847"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Helmet>
        <title>Umzugsfirmen vergleichen Schweiz 2025 – Kostenlos Offerten erhalten | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Vergleichen Sie 200+ geprüfte Schweizer Umzugsfirmen kostenlos. KI-gestützte Preisanalyse, echte Bewertungen, bis zu 40% sparen. Jetzt unverbindlich bis zu 5 Offerten erhalten!" 
        />
        <meta name="keywords" content="Umzug Schweiz 2025, Umzugsfirmen vergleichen, Umzugsofferten, Umzugskosten Rechner, günstige Umzugsfirma, beste Umzugsfirma Schweiz" />
        <link rel="canonical" href="https://umzugscheck.ch/" />
        <meta property="og:title" content="Umzugsfirmen vergleichen Schweiz – Die Nr. 1 Plattform | Umzugscheck.ch" />
        <meta property="og:description" content="200+ geprüfte Umzugsfirmen. KI-Preisrechner. Echte Bewertungen. Bis zu 40% sparen!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://umzugscheck.ch/" />
        <meta property="og:image" content="https://umzugscheck.ch/lovable-uploads/d4aa8c36-01f9-47b7-8e18-bd2a8e22467a.png" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>
      
      <SkipToContent />
      
      <main id="main-content" role="main">
        {/* 1. Hero Section */}
        <PremiumHeroSection />
        
        {/* 2. Social Proof & Testimonials */}
        <PremiumSocialProof />
        
        {/* 3. How It Works - 3 Steps */}
        <PremiumHowItWorks />

        {/* 4. Comparison Feature - Premium Showcase (Option 4) */}
        <ComparisonShowcase variant="premium" />
        
        {/* 5. AI Calculator Showcase */}
        <PremiumAIShowcase />
        
        {/* 6. Services Grid */}
        <PremiumServicesGrid />
        
        {/* 7. Regions */}
        <PremiumRegions />
        
        {/* 8. Cost Examples */}
        <PremiumCostExamples />
        
        {/* 9. Why Us / USPs */}
        <PremiumWhyUs />
        
        {/* 10. FAQ */}
        <PremiumFAQ items={faqItems} />
        
        {/* 11. Provider CTA */}
        <PremiumProviderCTA />
      </main>
      
      {/* Mobile Sticky CTA */}
      <StickyMobileCTA text="Offerten vergleichen" link="/umzugsofferten" />
      
      <ScrollToTop />
    </div>
  );
};

export default IndexPremium;
