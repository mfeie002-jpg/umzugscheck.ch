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
import { TeamShowcase } from "@/components/home/TeamShowcase";
import { SuccessMetrics } from "@/components/home/SuccessMetrics";
import { PricingTransparency } from "@/components/home/PricingTransparency";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { QuickCalculatorTeaser } from "@/components/home/QuickCalculatorTeaser";
import { SocialProofNotifications } from "@/components/home/SocialProofNotifications";
import { ExitIntentPopup } from "@/components/home/ExitIntentPopup";
import { PartnerCertifications } from "@/components/home/PartnerCertifications";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { ServiceAreaMap } from "@/components/home/ServiceAreaMap";
import { MovingResourcesHub } from "@/components/home/MovingResourcesHub";
import { SeasonalPromotions } from "@/components/home/SeasonalPromotions";
import { InteractiveMovingQuiz } from "@/components/home/InteractiveMovingQuiz";
import { LivePriceComparison } from "@/components/home/LivePriceComparison";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { SuccessStoriesCarousel } from "@/components/home/SuccessStoriesCarousel";
import { SmartPushNotifications } from "@/components/home/SmartPushNotifications";
import { MovingTipsCarousel } from "@/components/home/MovingTipsCarousel";
import { PriceGuaranteeBadge } from "@/components/home/PriceGuaranteeBadge";
import { LiveSupportIndicator } from "@/components/home/LiveSupportIndicator";
import { ReferralProgram } from "@/components/home/ReferralProgram";
import { AvailabilityCalendar } from "@/components/home/AvailabilityCalendar";
import { EcoFriendlyMoving } from "@/components/home/EcoFriendlyMoving";
import { BeforeAfterGallery } from "@/components/home/BeforeAfterGallery";
import { VirtualTourBooking } from "@/components/home/VirtualTourBooking";
import { MobileAppBanner } from "@/components/home/MobileAppBanner";
import { SmartRecommendations } from "@/components/home/SmartRecommendations";
import { AdvancedMicroInteractions } from "@/components/home/AdvancedMicroInteractions";
import { CookieConsent } from "@/components/home/CookieConsent";
import { PriceComparisonChart } from "@/components/home/PriceComparisonChart";
import { EmergencyMovingService } from "@/components/home/EmergencyMovingService";
import { ErrorBoundaryWrapper } from "@/components/ErrorBoundaryWrapper";
import { PerformanceMonitor } from "@/components/home/PerformanceMonitor";
import { AccessibilityEnhancer } from "@/components/home/AccessibilityEnhancer";
import { PrefetchLinks } from "@/components/home/PrefetchLinks";
import { useAnalytics, useScrollTracking, useTimeTracking } from "@/hooks/use-analytics";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { NotificationCenter } from "@/components/NotificationCenter";
import { QuickActionBar } from "@/components/QuickActionBar";
import { ABTestingProvider } from "@/components/home/ABTestingProvider";
import { AdvancedServiceWorker } from "@/components/home/AdvancedServiceWorker";
import { RealTimeUpdates } from "@/components/home/RealTimeUpdates";
import { VoiceSearch } from "@/components/home/VoiceSearch";
import { AdvancedAnalytics } from "@/components/home/AdvancedAnalytics";
import { SmartCaching } from "@/components/home/SmartCaching";

const Index = () => {
  // Analytics hooks
  useAnalytics();
  useScrollTracking();
  useTimeTracking();
  
  // Different parallax speeds for depth effect
  const parallax1 = useParallax(0.15);
  const parallax2 = useParallax(0.25);
  const parallax3 = useParallax(0.1);
  const parallax4 = useParallax(0.3);

  return (
    <ABTestingProvider>
      {/* Global Enhancements */}
      <AccessibilityEnhancer />
      <PrefetchLinks />
      <PerformanceMonitor />
      <AdvancedServiceWorker />
      <AdvancedAnalytics />
      <SmartCaching />
      <RealTimeUpdates />
      
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
      <ErrorBoundaryWrapper>
        <EmotionalHero />
      </ErrorBoundaryWrapper>
      
      {/* 2. Live Activity Counter */}
      <LiveActivityCounter />
      
      {/* 3. Success Metrics */}
      <ScrollReveal>
        <SuccessMetrics />
      </ScrollReveal>
      
      {/* 4. AI Calculator Explainer - How it works */}
      <ScrollReveal>
        <AICalculatorExplainer />
      </ScrollReveal>
      
      {/* 5. Quick Calculator Teaser - Prominent CTA */}
      <ScrollReveal delay={60}>
        <QuickCalculatorTeaser />
      </ScrollReveal>
      
      {/* 6. Trust Counter with Stats, Ratings & Team */}
      <ScrollReveal delay={80}>
        <TrustCounter />
      </ScrollReveal>
      
      {/* 6a. Advanced Micro-Interactions */}
      <AdvancedMicroInteractions />
      
      {/* 7. Service Carousel - All services at a glance */}
      <ScrollReveal delay={100}>
        <ServiceCarousel />
      </ScrollReveal>

      {/* 8. Process Timeline - Detailed steps */}
      <ScrollReveal delay={120}>
        <ProcessTimeline />
      </ScrollReveal>

      {/* 9. Premium Why Choose Us with family business focus */}
      <ScrollReveal delay={140}>
        <PremiumWhyChooseUs />
      </ScrollReveal>
      
      {/* 10. Team Showcase - Meet the family */}
      <ScrollReveal delay={160}>
        <TeamShowcase />
      </ScrollReveal>
      
      {/* 11. Trust Certificates & Security Badges */}
      <ScrollReveal delay={180}>
        <TrustCertificates />
      </ScrollReveal>
      
      {/* 11a. Partner Certifications */}
      <PartnerCertifications />
      
      {/* 11b. Price Guarantee Badge */}
      <PriceGuaranteeBadge />
      
      {/* First CTA */}
      <ScrollReveal delay={200}>
        <CTASection />
      </ScrollReveal>
      
      {/* 11c. Seasonal Promotions */}
      <ScrollReveal delay={210}>
        <SeasonalPromotions />
      </ScrollReveal>
      
      {/* 11d. Moving Tips Carousel */}
      <MovingTipsCarousel />

      {/* 12. Pricing Transparency */}
      <ScrollReveal delay={220}>
        <PricingTransparency />
      </ScrollReveal>

      {/* 13. Interactive Calculator Demo */}
      <ScrollReveal delay={240}>
        <InteractiveCalculatorDemo />
      </ScrollReveal>
      
      {/* 13a. Live Price Comparison */}
      <ScrollReveal delay={250}>
        <LivePriceComparison />
      </ScrollReveal>
      
      {/* 13b. Price Comparison Chart */}
      <ScrollReveal delay={255}>
        <PriceComparisonChart />
      </ScrollReveal>
      
      {/* 13c. Smart Recommendations */}
      <ScrollReveal delay={260}>
        <SmartRecommendations />
      </ScrollReveal>

      {/* 14. Reviews Showcase with verified customer feedback */}
      <ScrollReveal delay={260}>
        <ReviewsShowcase />
      </ScrollReveal>

      {/* 15. Video Testimonials */}
      <ScrollReveal delay={280}>
        <VideoTestimonials />
      </ScrollReveal>
      
      {/* 15a. Success Stories Carousel */}
      <ScrollReveal delay={290}>
        <SuccessStoriesCarousel />
      </ScrollReveal>

      {/* 16. Comparison Preview Section */}
      <ScrollReveal delay={300}>
        <ComparisonPreview />
      </ScrollReveal>

      {/* 17. Top Umzugsfirmen Section */}
      <ScrollReveal delay={320}>
        <TopMovers />
      </ScrollReveal>

      {/* Second CTA */}
      <ScrollReveal delay={340}>
        <CTASection />
      </ScrollReveal>
      
      {/* 17a. Interactive Moving Quiz */}
      <ScrollReveal delay={350}>
        <InteractiveMovingQuiz />
      </ScrollReveal>

      {/* 18. Service Area Map */}
      <ScrollReveal delay={360}>
        <ServiceAreaMap />
      </ScrollReveal>
      
      {/* 19. Popular Regions */}
      <ScrollReveal delay={380}>
        <PopularCantons />
      </ScrollReveal>
      
      {/* 19a. Moving Resources Hub */}
      <ScrollReveal delay={390}>
        <MovingResourcesHub />
      </ScrollReveal>
      
      {/* 19b. Eco-Friendly Moving */}
      <ScrollReveal delay={395}>
        <EcoFriendlyMoving />
      </ScrollReveal>
      
      {/* 19c. Before/After Gallery */}
      <ScrollReveal delay={400}>
        <BeforeAfterGallery />
      </ScrollReveal>
      
      {/* 19d. Virtual Tour Booking */}
      <ScrollReveal delay={405}>
        <VirtualTourBooking />
      </ScrollReveal>
      
      {/* 19e. Availability Calendar */}
      <ScrollReveal delay={410}>
        <AvailabilityCalendar />
      </ScrollReveal>
      
      {/* 19f. Referral Program */}
      <ScrollReveal delay={415}>
        <ReferralProgram />
      </ScrollReveal>
      
      {/* 19g. Emergency Moving Service */}
      <ScrollReveal delay={420}>
        <EmergencyMovingService />
      </ScrollReveal>

      {/* 20. Blog Teaser */}
      <ScrollReveal delay={425}>
        <BlogTeaser />
      </ScrollReveal>
      
      {/* 20a. Newsletter Signup */}
      <ScrollReveal delay={435}>
        <NewsletterSignup />
      </ScrollReveal>

      {/* 21. FAQ Section */}
      <ScrollReveal delay={445}>
        <FAQ />
      </ScrollReveal>

      {/* Final CTA */}
      <ScrollReveal delay={455}>
        <CTASection />
      </ScrollReveal>

      {/* Sticky Mobile CTA Bar */}
      <StickyMobileCTA />
      
      {/* Live Activity Indicator */}
      <LiveActivityIndicator />
      
      {/* Live Chat Support */}
      <LiveChatSupport />
      
      {/* Social Proof Notifications */}
      <SocialProofNotifications />
      
      {/* Exit Intent Popup */}
      <ExitIntentPopup />
      
      {/* WhatsApp Button */}
      <WhatsAppButton />
      
      {/* Push Notifications Prompt */}
      <SmartPushNotifications />
      
      {/* Live Support Indicator */}
      <LiveSupportIndicator />
      
      {/* Mobile App Banner */}
      <MobileAppBanner />
      
      {/* Cookie Consent */}
      <CookieConsent />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Offline Indicator */}
      <OfflineIndicator />
      
      {/* Notification Center */}
      <NotificationCenter />
      
      {/* Quick Action Bar */}
      <QuickActionBar />
      
      {/* Voice Search */}
      <VoiceSearch />
      </div>
    </ABTestingProvider>
  );
};

export default Index;
