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

const Index = () => {
  // Different parallax speeds for depth effect
  const parallax1 = useParallax(0.15);
  const parallax2 = useParallax(0.25);
  const parallax3 = useParallax(0.1);
  const parallax4 = useParallax(0.3);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Gradients with Parallax */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
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
      
      {/* 1. Hero Section with CTAs */}
      <Hero />
      
      {/* Trust Line under Hero */}
      <ScrollReveal>
        <TrustSignals />
      </ScrollReveal>

      {/* 2. Central Preisrechner Block */}
      <ScrollReveal delay={80}>
        <CalculatorSection />
      </ScrollReveal>

      {/* First CTA after Calculator */}
      <ScrollReveal delay={100}>
        <CTASection />
      </ScrollReveal>

      {/* 3. "So funktioniert es" Section (How It Works) */}
      <ScrollReveal delay={120}>
        <HowItWorks />
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

      {/* Third CTA after Social Proof */}
      <ScrollReveal delay={240}>
        <CTASection />
      </ScrollReveal>

      {/* 8. Services / Bundles Section (Other Calculators) */}
      <ScrollReveal delay={260}>
        <OtherCalculators 
          title="Alles aus einer Hand" 
          description="Umfassende Dienstleistungen für Ihren perfekten Umzug – von Reinigung bis Lagerung"
        />
      </ScrollReveal>

      {/* 9. Ratgeber / Content Teaser (Blog) */}
      <ScrollReveal delay={280}>
        <BlogTeaser />
      </ScrollReveal>

      {/* 10. FAQ Section */}
      <ScrollReveal delay={300}>
        <FAQ />
      </ScrollReveal>

      {/* Final CTA before Footer */}
      <ScrollReveal delay={320}>
        <CTASection />
      </ScrollReveal>

      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Index;
