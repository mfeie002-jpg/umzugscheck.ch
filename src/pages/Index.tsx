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
      <ScrollReveal delay={200}>
        <TopMovers />
      </ScrollReveal>
      <ScrollReveal delay={250}>
        <PopularCantons />
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
