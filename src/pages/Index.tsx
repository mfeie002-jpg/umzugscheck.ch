import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HowItWorks } from "@/components/HowItWorks";
import { TopMovers } from "@/components/TopMovers";
import { PopularCantons } from "@/components/PopularCantons";
import { FAQ } from "@/components/FAQ";
import { CTASection } from "@/components/CTASection";
import { useParallax } from "@/hooks/use-parallax";
import { ScrollToTop } from "@/components/ScrollToTop";
import { BlogTeaser } from "@/components/BlogTeaser";
import { ComparisonPreview } from "@/components/ComparisonPreview";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { LiveActivityIndicator } from "@/components/trust/LiveActivityIndicator";
import { EmotionalHero } from "@/components/home/EmotionalHero";
import { ServiceCarousel } from "@/components/home/ServiceCarousel";
import { PremiumWhyChooseUs } from "@/components/home/PremiumWhyChooseUs";
import { ReviewsShowcase } from "@/components/home/ReviewsShowcase";
import { TrustCertificates } from "@/components/home/TrustCertificates";

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
      
      {/* 1. NEW: Emotional Hero with AI Calculator as Primary USP */}
      <EmotionalHero />
      
      {/* 2. Trust Certificates & Security Badges */}
      <ScrollReveal>
        <TrustCertificates />
      </ScrollReveal>
      
      {/* 3. Service Carousel - All services at a glance */}
      <ScrollReveal delay={80}>
        <ServiceCarousel />
      </ScrollReveal>

      {/* 4. How It Works - 4 steps */}
      <ScrollReveal delay={100}>
        <HowItWorks />
      </ScrollReveal>

      {/* 5. NEW: Premium Why Choose Us with family business focus */}
      <ScrollReveal delay={120}>
        <PremiumWhyChooseUs />
      </ScrollReveal>
      
      {/* First CTA */}
      <ScrollReveal delay={140}>
        <CTASection />
      </ScrollReveal>

      {/* 6. NEW: Reviews Showcase with verified customer feedback */}
      <ScrollReveal delay={160}>
        <ReviewsShowcase />
      </ScrollReveal>

      {/* 7. Comparison Preview Section */}
      <ScrollReveal delay={180}>
        <ComparisonPreview />
      </ScrollReveal>

      {/* 8. Top Umzugsfirmen Section */}
      <ScrollReveal delay={200}>
        <TopMovers />
      </ScrollReveal>

      {/* Second CTA */}
      <ScrollReveal delay={220}>
        <CTASection />
      </ScrollReveal>

      {/* 9. Popular Regions */}
      <ScrollReveal delay={240}>
        <PopularCantons />
      </ScrollReveal>

      {/* 10. Blog Teaser */}
      <ScrollReveal delay={260}>
        <BlogTeaser />
      </ScrollReveal>

      {/* 11. FAQ Section */}
      <ScrollReveal delay={280}>
        <FAQ />
      </ScrollReveal>

      {/* Final CTA */}
      <ScrollReveal delay={300}>
        <CTASection />
      </ScrollReveal>

      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
      
      {/* Sticky Mobile CTA Bar */}
      <StickyMobileCTA />
      
      {/* Live Activity Indicator */}
      <LiveActivityIndicator />
    </div>
  );
};

export default Index;
