import { Shield, Clock, Heart, Award, Truck, Users } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const highlights = [
  { icon: Shield, text: "Vollversichert" },
  { icon: Clock, text: "Pünktlich" },
  { icon: Heart, text: "Sorgfältig" },
  { icon: Award, text: "Qualitätsgarantie" },
  { icon: Truck, text: "Moderne Flotte" },
  { icon: Users, text: "Familienbetrieb" },
];

export default function ServiceHighlights() {
  return (
    <section className="py-8 border-y border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {highlights.map((item, index) => (
            <AnimatedSection key={index} delay={index * 0.05}>
              <div className="flex items-center gap-2 text-sm">
                <item.icon className="h-4 w-4 text-alpine" />
                <span className="font-medium">{item.text}</span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
