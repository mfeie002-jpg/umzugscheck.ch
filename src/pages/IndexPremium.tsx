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
import { PremiumFooter } from "@/components/premium/PremiumFooter";
import { ComparisonShowcase } from "@/components/home/ComparisonShowcase";

// New logo options for preview
import logoOption1 from "@/assets/logo-option-1.png";
import logoOption2 from "@/assets/logo-option-2.png";
import logoOption3 from "@/assets/logo-option-3.png";

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
      <Helmet>
        <title>Umzugsfirmen vergleichen Schweiz – Kostenlos Offerten erhalten | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Vergleichen Sie Schweizer Umzugsfirmen kostenlos. AI-gestützte Analyse, geprüfte Partner, transparente Preise. Jetzt unverbindlich bis zu 5 Offerten erhalten." 
        />
        <meta name="keywords" content="Umzug Schweiz, Umzugsfirmen vergleichen, Umzugsofferten, Umzugskosten, günstige Umzüge Schweiz" />
        <link rel="canonical" href="https://umzugscheck.ch/" />
        <meta property="og:title" content="Umzugsfirmen vergleichen – Kostenlos & unverbindlich | Umzugscheck.ch" />
        <meta property="og:description" content="Die führende Schweizer Plattform für Umzugsvergleiche. AI-gestützt, transparent, vertrauenswürdig." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://umzugscheck.ch/" />
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

        {/* NEW LOGO OPTIONS - Temporary for review */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">🎨 Neue Logo-Vorschläge</h2>
            <p className="text-center text-muted-foreground mb-12">Wählen Sie Ihren Favoriten</p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-background rounded-2xl p-8 shadow-sm border-2 border-border text-center hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                <img src={logoOption1} alt="Logo Option 1" className="h-32 w-auto mx-auto mb-4 object-contain" />
                <h3 className="font-bold text-lg text-foreground">Option 1</h3>
                <p className="text-sm text-muted-foreground mt-2">Checkmark + Haus, Swiss Red</p>
              </div>
              <div className="bg-background rounded-2xl p-8 shadow-sm border-2 border-border text-center hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                <img src={logoOption2} alt="Logo Option 2" className="h-32 w-auto mx-auto mb-4 object-contain" />
                <h3 className="font-bold text-lg text-foreground">Option 2</h3>
                <p className="text-sm text-muted-foreground mt-2">Pfeil/Bewegung, Orange & Navy</p>
              </div>
              <div className="bg-background rounded-2xl p-8 shadow-sm border-2 border-border text-center hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                <img src={logoOption3} alt="Logo Option 3" className="h-32 w-auto mx-auto mb-4 object-contain" />
                <h3 className="font-bold text-lg text-foreground">Option 3</h3>
                <p className="text-sm text-muted-foreground mt-2">Premium Badge, Navy & Gold</p>
              </div>
            </div>
          </div>
        </section>

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

      <PremiumFooter />
      
      {/* Mobile Sticky CTA */}
      <StickyMobileCTA text="Offerten vergleichen" link="/umzugsofferten" />
      
      <ScrollToTop />
    </div>
  );
};

export default IndexPremium;
