import { Shield, Award, CheckCircle, Star } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const certifications = [
  { icon: Shield, label: "ISO 9001" },
  { icon: Award, label: "Swiss Made" },
  { icon: CheckCircle, label: "TÜV geprüft" },
  { icon: Star, label: "Top Rated" },
];

const CertificationBadges = () => {
  return (
    <section className="py-8 border-y border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {certifications.map((cert, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <cert.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{cert.label}</span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationBadges;
