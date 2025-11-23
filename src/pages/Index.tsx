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

const Index = () => {
  return (
    <div className="min-h-screen">
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
    </div>
  );
};

export default Index;
