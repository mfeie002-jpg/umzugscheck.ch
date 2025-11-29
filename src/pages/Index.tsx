import { SkipToContent } from "@/components/SkipToContent";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { RedesignHero } from "@/components/home/RedesignHero";
import { SocialProofSimple } from "@/components/home/SocialProofSimple";
import { RedesignHowItWorks } from "@/components/home/RedesignHowItWorks";
import { AICalculatorShowcase } from "@/components/home/AICalculatorShowcase";
import { ServicesGridCompact } from "@/components/home/ServicesGridCompact";
import { TopCompaniesCards } from "@/components/home/TopCompaniesCards";
import { CostExamplesCompact } from "@/components/home/CostExamplesCompact";
import { WhyUsCards } from "@/components/home/WhyUsCards";
import { FAQCompact } from "@/components/home/FAQCompact";
import { RegionsButtons } from "@/components/home/RegionsButtons";
import { ProviderCTA } from "@/components/home/ProviderCTA";
import { Helmet } from "react-helmet";
import { generatePageSchemas, generateSchemaScript } from "@/lib/schema-markup";

const Index = () => {
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
        {/* 1. Hero - Centered with AI Calculator */}
        <RedesignHero />
        
        {/* 2. Social Proof - Immediate Trust */}
        <SocialProofSimple />
        
        {/* 3. How It Works - 3 Steps */}
        <RedesignHowItWorks />
        
        {/* 4. AI Calculator Highlight */}
        <AICalculatorShowcase />
        
        {/* 5. Services - 6 Cards */}
        <ServicesGridCompact />
        
        {/* 6. Top Companies - 3 Cards with Filters */}
        <TopCompaniesCards />
        
        {/* 7. Cost Examples - Ultra-Compact */}
        <CostExamplesCompact />
        
        {/* 8. Why We're Better - 4 USPs */}
        <WhyUsCards />
        
        {/* 9. FAQ - 5 Questions */}
        <FAQCompact />
        
        {/* 10. Regions - Main Buttons */}
        <RegionsButtons />
        
        {/* 11. For Companies - Mini Section */}
        <ProviderCTA />
      </main>
      
      {/* 12. Mobile Sticky CTA */}
      <StickyMobileCTA text="Offerten vergleichen" link="/umzug-offerte" />
      
      <ScrollToTop />
    </div>
  );
};

export default Index;
