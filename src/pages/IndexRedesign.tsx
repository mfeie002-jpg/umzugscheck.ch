import { SkipToContent } from "@/components/SkipToContent";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { RedesignHero } from "@/components/home/RedesignHero";
import { TrustBand } from "@/components/homepage/TrustBand";
import { USPGrid } from "@/components/home/USPGrid";
import { FeaturedCompanies } from "@/components/home/FeaturedCompanies";
import { RedesignHowItWorks } from "@/components/home/RedesignHowItWorks";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { CostExamples } from "@/components/home/CostExamples";
import { TestimonialsSlider } from "@/components/home/TestimonialsSlider";
import { PremiumProviderCTA } from "@/components/premium/PremiumProviderCTA";
import { FAQSection } from "@/components/home/FAQSection";
import { RegionsSection } from "@/components/home/RegionsSection";
import { Helmet } from "react-helmet";
import { generatePageSchemas, generateSchemaScript } from "@/lib/schema-markup";

const IndexRedesign = () => {
  const faqData = [
    {
      question: "Wie funktioniert umzugscheck.ch?",
      answer: "Geben Sie Ihre Umzugsdetails ein, erhalten Sie kostenlose Offerten von bis zu 5 geprüften Umzugsfirmen, vergleichen Sie Preise und Bewertungen, und wählen Sie die beste Firma für Ihren Umzug."
    },
    {
      question: "Ist der Service wirklich kostenlos?",
      answer: "Ja, umzugscheck.ch ist für Privatkunden 100% kostenlos und unverbindlich. Sie bezahlen nur die Umzugsfirma, die Sie beauftragen."
    },
    {
      question: "Wie schnell erhalte ich Offerten?",
      answer: "Nach der Eingabe Ihrer Daten erhalten Sie innerhalb von 24 Stunden bis zu 5 unverbindliche Offerten von geprüften Umzugsfirmen."
    },
    {
      question: "Sind die Umzugsfirmen geprüft?",
      answer: "Ja, alle unsere Partner durchlaufen einen strengen Prüfprozess. Wir verifizieren Versicherungen, Bewilligungen und Kundenbewertungen."
    },
    {
      question: "Kann ich auch nur eine Offerte anfragen?",
      answer: "Ja, Sie können selbst entscheiden, von wie vielen Firmen Sie Offerten erhalten möchten. Sie haben die volle Kontrolle."
    }
  ];

  const schemas = generatePageSchemas(
    { type: 'home', url: 'https://www.umzugscheck.ch/' },
    faqData
  );
  const schemaScript = generateSchemaScript(schemas);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzugscheck.ch - Umzugsofferten vergleichen & bis 40% sparen</title>
        <meta name="description" content="Vergleichen Sie kostenlos Offerten von geprüften Schweizer Umzugsfirmen. In 2 Minuten bis zu 5 Angebote erhalten und bis 40% sparen." />
        <script type="application/ld+json">{schemaScript}</script>
      </Helmet>
      
      <SkipToContent />
      
      <main id="main-content" role="main">
        {/* 1. Hero mit Rechner - Emotionales Bild + Conversion */}
        <RedesignHero />
        
        {/* 2. Trust Band - Sofortiger Social Proof */}
        <TrustBand />
        
        {/* 3. Warum umzugscheck.ch - USPs früh zeigen */}
        <USPGrid />
        
        {/* 4. Top Firmen - Vertrauen durch echte Partner */}
        <FeaturedCompanies />
        
        {/* 5. Services - Komplettangebot zeigen */}
        <ServicesGrid />
        
        {/* 6. Kostenbeispiele - Preistransparenz */}
        <CostExamples />
        
        {/* 7. So funktioniert's - Prozess erklären */}
        <RedesignHowItWorks />
        
        {/* 8. Testimonials - Kundenstimmen */}
        <TestimonialsSlider />
        
        {/* 9. B2B CTA - Für Firmen */}
        <PremiumProviderCTA />
        
        {/* 10. FAQ - SEO + Nutzerfragen */}
        <FAQSection />
        
        {/* 11. Regionen - Lokales SEO */}
        <RegionsSection />
      </main>
      
      {/* Mobile Sticky CTA */}
      <StickyMobileCTA text="Gratis Offerten erhalten" />
      
      <ScrollToTop />
    </div>
  );
};

export default IndexRedesign;