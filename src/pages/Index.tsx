import { ScrollReveal } from "@/components/ScrollReveal";
import { HowItWorks } from "@/components/HowItWorks";
import { TopMovers } from "@/components/TopMovers";
import { PopularCantons } from "@/components/PopularCantons";
import { FAQ } from "@/components/FAQ";
import { CTASection } from "@/components/CTASection";
import { useParallax } from "@/hooks/use-parallax";
import { BlogTeaser } from "@/components/BlogTeaser";
import { ComparisonPreview } from "@/components/ComparisonPreview";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { LiveActivityIndicator } from "@/components/trust/LiveActivityIndicator";
import { EmotionalHero } from "@/components/home/EmotionalHero";
import { ServiceCarousel } from "@/components/home/ServiceCarousel";
import { PremiumWhyChooseUs } from "@/components/home/PremiumWhyChooseUs";
import { ReviewsShowcase } from "@/components/home/ReviewsShowcase";
import { TrustCertificates } from "@/components/home/TrustCertificates";
import { TrustCounter } from "@/components/home/TrustCounter";
import { LiveActivityCounter } from "@/components/home/LiveActivityCounter";
import { AICalculatorExplainer } from "@/components/home/AICalculatorExplainer";
import { VideoTestimonials } from "@/components/VideoTestimonials";
import { InteractiveCalculatorDemo } from "@/components/InteractiveCalculatorDemo";
import { LiveChatSupport } from "@/components/LiveChatSupport";
import { SEOHead } from "@/components/SEOHead";

const Index = () => {
  // Different parallax speeds for depth effect
  const parallax1 = useParallax(0.15);
  const parallax2 = useParallax(0.25);
  const parallax3 = useParallax(0.1);
  const parallax4 = useParallax(0.3);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SEOHead
        title="Umzugscheck.ch - KI-Preisrechner für Schweizer Umzüge | Transparent & Fair"
        description="Vergleichen Sie Umzugsofferten mit unserem KI-Preisrechner. Erhalten Sie in Sekunden präzise Offerten von über 200 geprüften Umzugsfirmen in der ganzen Schweiz. Transparent, fair und 100% schweizerisch."
        keywords="umzug schweiz, umzugsfirma, umzugsofferte, ki preisrechner, umzugskosten, zürich, bern, basel, genf, lausanne, familienunternehmen"
        canonical="/"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "name": "Umzugscheck.ch",
              "url": "https://umzugscheck.ch",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://umzugscheck.ch/firmen?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@type": "MovingCompany",
              "name": "Umzugscheck.ch",
              "description": "Führende Vergleichsplattform für Umzüge in der Schweiz mit KI-Preisrechner",
              "url": "https://umzugscheck.ch",
              "logo": "https://umzugscheck.ch/assets/umzugscheck-logo.png",
              "image": "https://umzugscheck.ch/assets/hero-moving-family.jpg",
              "telephone": "+41-44-567-89-00",
              "email": "info@umzugscheck.ch",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Bahnhofstrasse 100",
                "addressLocality": "Zürich",
                "postalCode": "8001",
                "addressCountry": "CH"
              },
              "areaServed": {
                "@type": "Country",
                "name": "Schweiz"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "12000",
                "bestRating": "5",
                "worstRating": "1"
              },
              "priceRange": "CHF",
              "openingHours": "Mo-Fr 08:00-18:00",
              "sameAs": [
                "https://www.facebook.com/umzugscheck",
                "https://www.linkedin.com/company/umzugscheck",
                "https://www.instagram.com/umzugscheck"
              ]
            }
          ]
        }}
      />
      
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

      {/* 1. NEW: Emotional Hero with AI Calculator as Primary USP */}
      <EmotionalHero />
      
      {/* 2. Live Activity Counter */}
      <LiveActivityCounter />
      
      {/* 3. AI Calculator Explainer - How it works */}
      <ScrollReveal>
        <AICalculatorExplainer />
      </ScrollReveal>
      
      {/* 4. Trust Counter with Stats, Ratings & Team */}
      <ScrollReveal>
        <TrustCounter />
      </ScrollReveal>
      
      {/* 5. Service Carousel - All services at a glance */}
      <ScrollReveal delay={80}>
        <ServiceCarousel />
      </ScrollReveal>

      {/* 6. How It Works - 4 steps */}
      <ScrollReveal delay={100}>
        <HowItWorks />
      </ScrollReveal>

      {/* 7. Premium Why Choose Us with family business focus */}
      <ScrollReveal delay={120}>
        <PremiumWhyChooseUs />
      </ScrollReveal>
      
      {/* 8. Trust Certificates & Security Badges */}
      <ScrollReveal delay={140}>
        <TrustCertificates />
      </ScrollReveal>
      
      {/* First CTA */}
      <ScrollReveal delay={140}>
        <CTASection />
      </ScrollReveal>

      {/* 6. Interactive Calculator Demo */}
      <ScrollReveal delay={160}>
        <InteractiveCalculatorDemo />
      </ScrollReveal>

      {/* 7. NEW: Reviews Showcase with verified customer feedback */}
      <ScrollReveal delay={180}>
        <ReviewsShowcase />
      </ScrollReveal>

      {/* 8. Video Testimonials */}
      <ScrollReveal delay={200}>
        <VideoTestimonials />
      </ScrollReveal>

      {/* 9. Comparison Preview Section */}
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

      {/* Sticky Mobile CTA Bar */}
      <StickyMobileCTA />
      
      {/* Live Activity Indicator */}
      <LiveActivityIndicator />
      
      {/* Live Chat Support */}
      <LiveChatSupport />
    </div>
  );
};

export default Index;
