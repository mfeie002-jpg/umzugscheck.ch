import { Suspense } from "react";
import { GlobalNav } from "@/components/rebrand/GlobalNav";
import { HeroRebrand } from "@/components/rebrand/HeroRebrand";
import { TrustGrid } from "@/components/rebrand/TrustGrid";
import { ServiceShowcase } from "@/components/rebrand/ServiceShowcase";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

const RebrandShowcase = () => {
  return (
    <div className="min-h-screen bg-surface-canvas text-text-main">
      <ScrollProgress />
      <GlobalNav />
      <main>
        <HeroRebrand />
        <TrustGrid />
        <ServiceShowcase />
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default RebrandShowcase;
