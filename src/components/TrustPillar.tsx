import { Shield, Clock, Award, Heart } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const pillars = [
  { icon: Shield, label: "100% Versichert", sublabel: "Vollkasko" },
  { icon: Clock, label: "Pünktlich", sublabel: "Garantiert" },
  { icon: Award, label: "40 Jahre", sublabel: "Erfahrung" },
  { icon: Heart, label: "Familiär", sublabel: "Persönlich" },
];

const TrustPillar = () => {
  return (
    <section className="py-8 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <AnimatedSection key={index} delay={index * 0.1} className="text-center">
              <pillar.icon className="h-8 w-8 mx-auto mb-2 opacity-90" />
              <p className="font-bold text-sm">{pillar.label}</p>
              <p className="text-xs opacity-75">{pillar.sublabel}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustPillar;
