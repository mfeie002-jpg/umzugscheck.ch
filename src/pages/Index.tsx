import { Helmet } from "react-helmet";
import { SkipToContent } from "@/components/SkipToContent";
import { ScrollToTop } from "@/components/ScrollToTop";

// New Homepage Components
import { Header } from "@/components/homepage/Header";
import { HeroSection } from "@/components/homepage/HeroSection";
import { SocialProofSection } from "@/components/homepage/SocialProofSection";
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection";
import { HowItWorksSection } from "@/components/homepage/HowItWorksSection";
import { USPSection } from "@/components/homepage/USPSection";
import { FAQSection } from "@/components/homepage/FAQSection";
import { CTASection } from "@/components/homepage/CTASection";
import { FloatingElements } from "@/components/homepage/FloatingElements";
import { MobileBottomNav } from "@/components/homepage/MobileBottomNav";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";

const Index = () => {
  // FAQ data for Schema.org
  const faqItems = [
    { question: "Wie funktioniert der Vergleich genau?", answer: "Sie füllen unser kurzes Formular mit Ihren Umzugsdetails aus. Unser AI-System analysiert Ihre Anforderungen und findet passende, geprüfte Umzugsfirmen. Innerhalb von 24-48 Stunden erhalten Sie mehrere unverbindliche Offerten." },
    { question: "Kostet mich der Service etwas?", answer: "Nein, unser Vergleichsservice ist für Sie als Kunde zu 100% kostenlos und unverbindlich. Es entstehen keinerlei Verpflichtungen." },
    { question: "Wie werden die Umzugsfirmen ausgewählt?", answer: "Alle Partner durchlaufen einen strengen Prüfprozess. Wir verifizieren Versicherungen, Bewilligungen, Kundenbewertungen und Qualitätsstandards." },
    { question: "Wie schnell erhalte ich Angebote?", answer: "In der Regel erhalten Sie innerhalb von 24-48 Stunden mehrere Offerten von passenden Umzugsfirmen. Bei dringenden Anfragen geht es oft noch schneller." },
    { question: "Sind die Angebote verbindlich?", answer: "Die Offerten sind Richtangebote basierend auf Ihren Angaben. Nach einer Besichtigung oder Detailklärung erstellt die Firma ein verbindliches Angebot." },
    { question: "Was passiert, wenn etwas beschädigt wird?", answer: "Alle unsere Partnerfirmen sind vollumfänglich versichert. Im unwahrscheinlichen Fall eines Schadens sind Sie über die Transportversicherung der Umzugsfirma geschützt." },
    { question: "Kann ich auch Firmenumzüge vergleichen?", answer: "Ja, unser Service deckt sowohl Privatumzüge als auch Firmen- und Büroumzüge ab." },
    { question: "In welchen Regionen ist der Service verfügbar?", answer: "Unser Service ist schweizweit verfügbar. Wir haben geprüfte Partner in allen 26 Kantonen." }
  ];

  // Complete Schema.org structured data
  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://umzugscheck.ch/#organization",
        "name": "Umzugscheck.ch",
        "url": "https://umzugscheck.ch",
        "logo": "https://umzugscheck.ch/logo.png",
        "description": "Die führende Vergleichsplattform für Umzüge in der Schweiz. Kostenlos, transparent und einfach.",
        "areaServed": {
          "@type": "Country",
          "name": "Switzerland"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+41-44-XXX-XX-XX",
          "contactType": "customer service",
          "availableLanguage": ["German", "French", "Italian"],
          "areaServed": "CH"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://umzugscheck.ch/#website",
        "url": "https://umzugscheck.ch",
        "name": "Umzugscheck.ch",
        "publisher": {
          "@id": "https://umzugscheck.ch/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://umzugscheck.ch/umzugsfirmen?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://umzugscheck.ch/#faq",
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
          "name": "Umzugscheck.ch",
          "@id": "https://umzugscheck.ch/#organization"
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
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Umzugsfirmen vergleichen Schweiz 2025 – Kostenlos Offerten erhalten | Umzugscheck.ch</title>
        <meta name="title" content="Umzugsfirmen vergleichen Schweiz 2025 – Kostenlos Offerten erhalten | Umzugscheck.ch" />
        <meta name="description" content="Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. KI-Preisrechner, transparente Preise, echte Bewertungen. Jetzt vergleichen & sparen!" />
        <meta name="keywords" content="Umzug Schweiz, Umzugsfirmen vergleichen, Umzugsofferten, Umzugskosten, Umzugsrechner, Zürich, Basel, Bern" />
        <link rel="canonical" href="https://umzugscheck.ch/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://umzugscheck.ch/" />
        <meta property="og:title" content="Umzugscheck.ch – Die Nr. 1 für Umzugsvergleiche in der Schweiz" />
        <meta property="og:description" content="Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. KI-Preisrechner, transparente Preise, echte Bewertungen. Jetzt vergleichen & sparen!" />
        <meta property="og:image" content="https://umzugscheck.ch/og-image.jpg" />
        <meta property="og:site_name" content="Umzugscheck.ch" />
        <meta property="og:locale" content="de_CH" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://umzugscheck.ch/" />
        <meta name="twitter:title" content="Umzugscheck.ch – Die Nr. 1 für Umzugsvergleiche in der Schweiz" />
        <meta name="twitter:description" content="Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. KI-Preisrechner, transparente Preise, echte Bewertungen. Jetzt vergleichen & sparen!" />
        <meta name="twitter:image" content="https://umzugscheck.ch/og-image.jpg" />

        {/* Additional */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="German" />
        <meta name="geo.region" content="CH" />
        <meta name="geo.placename" content="Switzerland" />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <SkipToContent />
      <Header />

      <main id="main-content" role="main" className="pb-20 md:pb-0">
        <HeroSection />
        <SocialProofSection />
        <TestimonialsSection />
        <HowItWorksSection />
        <USPSection />
        <CTASection />
        <FAQSection />
      </main>

      <SimplifiedFooter />
      <FloatingElements />
      <MobileBottomNav />
      <ScrollToTop />
    </div>
  );
};

export default Index;
