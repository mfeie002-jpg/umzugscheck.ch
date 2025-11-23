import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { TrustSignals } from "@/components/TrustSignals";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustBadges } from "@/components/TrustBadges";
import { TopMovers } from "@/components/TopMovers";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { FAQ } from "@/components/FAQ";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <TrustSignals />
      <HowItWorks />
      <TrustBadges />
      <TopMovers />
      <WhyChooseUs />
      <CTASection />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
