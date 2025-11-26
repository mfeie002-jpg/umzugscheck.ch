import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { TrustSignals } from "@/components/TrustSignals";
import { HowItWorks } from "@/components/HowItWorks";
import { TopMovers } from "@/components/TopMovers";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { PopularCantons } from "@/components/PopularCantons";
import { FAQ } from "@/components/FAQ";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CalculatorSection } from "@/components/CalculatorSection";
import { useParallax } from "@/hooks/use-parallax";
import { ScrollToTop } from "@/components/ScrollToTop";
import { OtherCalculators } from "@/components/OtherCalculators";
import { BlogTeaser } from "@/components/BlogTeaser";
import { SocialProofMetrics } from "@/components/SocialProofMetrics";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { ComparisonPreview } from "@/components/ComparisonPreview";
import { VideoEstimatorTeaser } from "@/components/VideoEstimatorTeaser";
import { TrustCounter } from "@/components/trust/TrustCounter";
import { LiveActivityIndicator } from "@/components/trust/LiveActivityIndicator";
import { RecentActivityFeed } from "@/components/trust/RecentActivityFeed";
import { TrustMicroSignals } from "@/components/trust/TrustMicroSignals";
import { SecurityBadges } from "@/components/trust/SecurityBadges";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { VerifiedPartners } from "@/components/trust/VerifiedPartners";
import { SkipToContent } from "@/components/SkipToContent";
import { 
  generateOrganizationSchema, 
  generateServiceSchema, 
  generateFAQSchema,
  generateBreadcrumbSchema,
  injectSchema 
} from "@/lib/schema-markup";

const Index = () => {
  // Different parallax speeds for depth effect
  const parallax1 = useParallax(0.15);
  const parallax2 = useParallax(0.25);
  const parallax3 = useParallax(0.1);
  const parallax4 = useParallax(0.3);

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
    <div className="min-h-screen relative overflow-hidden">
      <SkipToContent />
      
      {/* Animated Background Gradients with Parallax */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div 
          className="absolute top-0 -left-4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" 
          style={{ 
            animationDuration: '8s',
            transform: `translateY(${parallax1}px)`
          }}>
        </div>
        <div 
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl animate-pulse" 
          style={{ 
            animationDuration: '10s', 
            animationDelay: '2s',
            transform: `translateY(${parallax2}px)`
          }}>
        </div>
        <div 
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/6 rounded-full blur-3xl animate-pulse" 
          style={{ 
            animationDuration: '12s', 
            animationDelay: '4s',
            transform: `translateY(${parallax3}px)`
          }}>
        </div>
        <div 
          className="absolute top-2/3 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" 
          style={{ 
            animationDuration: '9s', 
            animationDelay: '1s',
            transform: `translateY(${parallax4}px)`
          }}>
        </div>
      </div>
      
      {/* Subtle Grid Pattern Overlay */}
      <div className="fixed inset-0 -z-10 opacity-[0.02] pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
             backgroundSize: '50px 50px'
           }}>
      </div>

      <Navigation />
      
      {/* Main Content */}
      <main id="main-content" role="main">
        {/* 1. Hero Section with CTAs */}
        <Hero />
      
      {/* Trust Line under Hero */}
      <ScrollReveal>
        <TrustSignals />
      </ScrollReveal>

      <ScrollReveal>
        <div className="container mx-auto px-4 py-4">
          <TrustMicroSignals />
        </div>
      </ScrollReveal>

      {/* 2. Central Preisrechner Block */}
      <ScrollReveal delay={80}>
        <CalculatorSection />
      </ScrollReveal>

      {/* 2.5 Comparison Feature - Second Most Important USP */}
      <ScrollReveal delay={90}>
        <ComparisonPreview />
      </ScrollReveal>

      {/* First CTA after Calculator */}
      <ScrollReveal delay={100}>
        <CTASection />
      </ScrollReveal>

      {/* 3. "So funktioniert es" Section (How It Works) */}
      <ScrollReveal delay={120}>
        <HowItWorks />
      </ScrollReveal>

      {/* Trust Counter moved lower - after How It Works */}
      <ScrollReveal delay={130}>
        <TrustCounter />
      </ScrollReveal>

      {/* 4. Top Umzugsfirmen Section */}
      <ScrollReveal delay={140}>
        <TopMovers />
      </ScrollReveal>

      {/* Second CTA after Top Companies */}
      <ScrollReveal delay={160}>
        <CTASection />
      </ScrollReveal>

      {/* 5. Regionen / Kantone Section */}
      <ScrollReveal delay={180}>
        <PopularCantons />
      </ScrollReveal>

      {/* 6. "Warum Umzugscheck.ch?" Section (USP/Benefits) */}
      <ScrollReveal delay={200}>
        <WhyChooseUs />
      </ScrollReveal>

      {/* 7. Social Proof & Kennzahlen (Metrics + Testimonials) */}
      <ScrollReveal delay={220}>
        <SocialProofMetrics />
      </ScrollReveal>

      {/* 7.5 Bekannt aus & geprüft von Section */}
      <ScrollReveal delay={230}>
        <VerifiedPartners />
      </ScrollReveal>

      {/* Third CTA after Social Proof */}
      <ScrollReveal delay={240}>
        <CTASection />
      </ScrollReveal>

      {/* 8. Video Estimator Teaser */}
      <ScrollReveal delay={250}>
        <VideoEstimatorTeaser />
      </ScrollReveal>

      {/* 9. Services / Bundles Section (Other Calculators) */}
      <ScrollReveal delay={260}>
        <OtherCalculators 
          title="Alles aus einer Hand" 
          description="Umfassende Dienstleistungen für Ihren perfekten Umzug – von Reinigung bis Lagerung"
        />
      </ScrollReveal>

      {/* 10. Ratgeber / Content Teaser (Blog) */}
      <ScrollReveal delay={280}>
        <BlogTeaser />
      </ScrollReveal>

      {/* 11. FAQ Section */}
      <ScrollReveal delay={300}>
        <FAQ />
      </ScrollReveal>

      {/* Final CTA before Footer */}
      <ScrollReveal delay={320}>
        <CTASection />
      </ScrollReveal>
      </main>

      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
      
      {/* Sticky Mobile CTA Bar */}
      <StickyMobileCTA />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Live Activity Indicators */}
      <LiveActivityIndicator />
      <RecentActivityFeed />
    </div>
  );
};

export default Index;
