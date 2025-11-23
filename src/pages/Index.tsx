import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { TrustSignals } from "@/components/TrustSignals";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustBadges } from "@/components/TrustBadges";
import { TopMovers } from "@/components/TopMovers";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { PopularCantons } from "@/components/PopularCantons";
import { FAQ } from "@/components/FAQ";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { TopPicks } from "@/components/TopPicks";
import { VerifiedBadge } from "@/components/trust/VerifiedBadge";
import { IndependentExplainer } from "@/components/trust/IndependentExplainer";
import { CalculatorSection } from "@/components/CalculatorSection";
import { Testimonials } from "@/components/Testimonials";
import { useParallax } from "@/hooks/use-parallax";
import { ScrollToTop } from "@/components/ScrollToTop";

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
      <Hero />
      <ScrollReveal>
        <TrustSignals />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <HowItWorks />
      </ScrollReveal>
      <ScrollReveal delay={150}>
        <TrustBadges />
      </ScrollReveal>
      <ScrollReveal delay={175}>
        <CalculatorSection />
      </ScrollReveal>
      <ScrollReveal delay={190}>
        <Testimonials />
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <TopMovers />
      </ScrollReveal>
      <ScrollReveal delay={220}>
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
              <VerifiedBadge />
              <IndependentExplainer />
            </div>
          </div>
        </section>
      </ScrollReveal>
      <ScrollReveal delay={250}>
        <PopularCantons />
      </ScrollReveal>
      <ScrollReveal delay={270}>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <TopPicks />
            </div>
          </div>
        </section>
      </ScrollReveal>
      <ScrollReveal delay={300}>
        <WhyChooseUs />
      </ScrollReveal>
      <ScrollReveal delay={350}>
        <CTASection />
      </ScrollReveal>
      <ScrollReveal delay={400}>
        <FAQ />
      </ScrollReveal>
      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Index;
