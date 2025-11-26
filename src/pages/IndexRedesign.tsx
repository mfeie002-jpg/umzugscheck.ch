import { SkipToContent } from "@/components/SkipToContent";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { RedesignHero } from "@/components/home/RedesignHero";
import { RedesignHowItWorks } from "@/components/home/RedesignHowItWorks";
import { AICalculatorShowcase } from "@/components/home/AICalculatorShowcase";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { FeaturedCompanies } from "@/components/home/FeaturedCompanies";
import { USPGrid } from "@/components/home/USPGrid";
import { CostExamples } from "@/components/home/CostExamples";
import { TestimonialsSlider } from "@/components/home/TestimonialsSlider";
import { ProviderCTA } from "@/components/home/ProviderCTA";
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
        {/* 1. Hero mit AI-Rechner */}
        <RedesignHero />
        
        {/* 2. So funktioniert's - 4 Steps */}
        <RedesignHowItWorks />
        
        {/* 3. AI-Rechner Showcase */}
        <AICalculatorShowcase />
        
        {/* 4. Services Grid */}
        <ServicesGrid />
        
        {/* 5. Top Umzugsfirmen mit Filter */}
        <FeaturedCompanies />
        
        {/* 6. Warum umzugscheck.ch - 4 USPs */}
        <USPGrid />
        
        {/* 7. Kostenbeispiele */}
        <CostExamples />
        
        {/* 8. Testimonials Slider */}
        <TestimonialsSlider />
        
        {/* 9. Für Umzugsfirmen CTA */}
        <ProviderCTA />
        
        {/* 10. FAQ - 2 Spalten Desktop */}
        <FAQSection />
        
        {/* 11. Regionen */}
        <RegionsSection />
      </main>
      
      {/* 12. Mobile Sticky CTA */}
      <StickyMobileCTA text="Gratis Angebote erhalten" />
      
      <ScrollToTop />
    </div>
  );
};

export default IndexRedesign;
