import { useEffect } from "react";
import { NewHero } from "@/components/home/NewHero";
import { WhyUmzugscheckSimple } from "@/components/home/WhyUmzugscheckSimple";
import { TopCompaniesCards } from "@/components/home/TopCompaniesCards";
import { HowItWorksSimple } from "@/components/home/HowItWorksSimple";
import { SocialProofBlock } from "@/components/home/SocialProofBlock";
import { CTABlock } from "@/components/home/CTABlock";
import { FAQ } from "@/components/FAQ";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { RecentActivityFeed } from "@/components/trust/RecentActivityFeed";
import { SkipToContent } from "@/components/SkipToContent";
import { 
  generateOrganizationSchema, 
  generateServiceSchema, 
  generateFAQSchema,
  generateBreadcrumbSchema,
  injectSchema 
} from "@/lib/schema-markup";

const NewIndex = () => {
  useEffect(() => {
    // Inject structured data for homepage
    const schemas = [
      generateOrganizationSchema(),
      generateServiceSchema(
        "Umzugsvergleich",
        "Vergleichen Sie Umzugsofferten von über 200 geprüften Umzugsfirmen in der Schweiz",
        "CHF 850-1500"
      ),
      generateFAQSchema([
        {
          question: "Wie funktioniert Umzugscheck.ch?",
          answer: "Geben Sie Ihre Umzugsdetails ein, erhalten Sie kostenlose Offerten von bis zu 5 Umzugsfirmen, vergleichen Sie Preise und Bewertungen, und wählen Sie die beste Firma für Ihren Umzug."
        },
        {
          question: "Ist der Service wirklich kostenlos?",
          answer: "Ja, Umzugscheck.ch ist für Privatkunden 100% kostenlos. Sie bezahlen nur die Umzugsfirma, die Sie beauftragen."
        },
        {
          question: "Wie schnell erhalte ich Offerten?",
          answer: "Nach der Eingabe Ihrer Daten erhalten Sie innerhalb von 24 Stunden bis zu 5 unverbindliche Offerten von geprüften Umzugsfirmen."
        }
      ]),
      generateBreadcrumbSchema([
        { name: "Startseite", url: "https://umzugscheck.ch" }
      ])
    ];
    
    injectSchema(schemas);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SkipToContent />
      
      <main id="main-content" role="main">
        {/* 1. Hero Section with Instant Calculator */}
        <NewHero />
        
        {/* 2. Why Umzugscheck - 3 USPs */}
        <WhyUmzugscheckSimple />
        
        {/* 3. Top Companies - Airbnb Style Cards */}
        <TopCompaniesCards />
        
        {/* 4. How It Works - 3 Steps */}
        <HowItWorksSimple />
        
        {/* 5. Social Proof Block */}
        <SocialProofBlock />
        
        {/* 6. CTA Block */}
        <CTABlock />
        
        {/* 7. FAQ Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
                Häufig gestellte Fragen
              </h2>
              <FAQ />
            </div>
          </div>
        </section>
      </main>
      
      {/* 8. Footer */}
      <SimplifiedFooter />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
      
      {/* Sticky Mobile CTA Bar */}
      <StickyMobileCTA />
      
      {/* Recent Activity Feed */}
      <RecentActivityFeed />
    </div>
  );
};

export default NewIndex;
