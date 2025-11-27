import { Helmet } from "react-helmet";
import { SkipToContent } from "@/components/SkipToContent";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { PremiumHero } from "@/components/home/PremiumHero";
import { PremiumHowItWorks } from "@/components/home/PremiumHowItWorks";
import { PremiumAIShowcase } from "@/components/home/PremiumAIShowcase";
import { PremiumServices } from "@/components/home/PremiumServices";
import { SocialProofSimple } from "@/components/home/SocialProofSimple";
import { TopCompaniesCards } from "@/components/home/TopCompaniesCards";
import { CostExamplesCompact } from "@/components/home/CostExamplesCompact";
import { WhyUsCards } from "@/components/home/WhyUsCards";
import { FAQCompact } from "@/components/home/FAQCompact";
import { RegionsButtons } from "@/components/home/RegionsButtons";
import { ProviderCTA } from "@/components/home/ProviderCTA";
import { generatePageSchemas, generateSchemaScript } from "@/lib/schema-markup";

const IndexPremium = () => {
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
      answer: "Ja, alle Partnerunternehmen durchlaufen einen strengen Qualifizierungsprozess und werden regelmäßig überprüft."
    },
    {
      question: "Kann ich auch kurzfristig einen Umzug buchen?",
      answer: "Ja, viele unserer Partner bieten auch kurzfristige Umzüge an. Geben Sie einfach Ihr gewünschtes Datum an."
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
        <title>Umzugscheck.ch - Der exklusivste Weg, Ihren Umzug zu planen</title>
        <meta name="description" content="AI-gestützte Schweizer Premium-Vergleiche. Transparente Preise. Handverlesene Firmen. Der erste Schweizer AI-Umzugsrechner auf Premium-Niveau." />
        <script type="application/ld+json">{schemaScript}</script>
      </Helmet>
      
      <SkipToContent />
      
      <main id="main-content" role="main">
        {/* 1. Hero - Ultra Premium with AI Calculator */}
        <PremiumHero />
        
        {/* 2. Social Proof - Immediate Trust */}
        <SocialProofSimple />
        
        {/* 3. How It Works - 3 Premium Steps */}
        <PremiumHowItWorks />
        
        {/* 4. AI Calculator Highlight */}
        <PremiumAIShowcase />
        
        {/* 5. Premium Services - 6 Cards */}
        <PremiumServices />
        
        {/* 6. Top Companies - Handverlesen */}
        <TopCompaniesCards />
        
        {/* 7. Cost Examples - Ultra-Compact */}
        <CostExamplesCompact />
        
        {/* 8. Why We're Better - 4 USPs */}
        <WhyUsCards />
        
        {/* 9. FAQ - 5 Questions */}
        <FAQCompact />
        
        {/* 10. Regions - Main Buttons */}
        <RegionsButtons />
        
        {/* 11. For Companies - Premium CTA */}
        <ProviderCTA />
      </main>
      
      {/* 12. Mobile Sticky CTA */}
      <StickyMobileCTA text="Gratis Premium-Angebote erhalten" />
      
      <ScrollToTop />
    </div>
  );
};

export default IndexPremium;