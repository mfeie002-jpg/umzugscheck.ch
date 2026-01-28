import { Leaf, Recycle, TreePine } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const EnvironmentBadge = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            <div className="flex items-center gap-2 text-forest">
              <Leaf className="h-5 w-5" />
              <span className="text-sm font-medium">CO2-kompensiert</span>
            </div>
            <div className="flex items-center gap-2 text-forest">
              <Recycle className="h-5 w-5" />
              <span className="text-sm font-medium">Recycling-Partner</span>
            </div>
            <div className="flex items-center gap-2 text-forest">
              <TreePine className="h-5 w-5" />
              <span className="text-sm font-medium">1 Baum pro Umzug</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default EnvironmentBadge;
