import { Star, Users, Truck, Award } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const stats = [
  { icon: Users, value: "10'000+", label: "Zufriedene Kunden" },
  { icon: Truck, value: "15+", label: "Fahrzeuge" },
  { icon: Star, value: "4.9", label: "Google Bewertung" },
  { icon: Award, value: "44", label: "Jahre Erfahrung" },
];

export default function SocialProof() {
  return (
    <section className="py-12 bg-gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-3 opacity-80" />
                <p className="text-3xl lg:text-4xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
