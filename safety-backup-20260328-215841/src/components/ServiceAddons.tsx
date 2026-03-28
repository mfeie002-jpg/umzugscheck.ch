import { Wrench, Paintbrush, Sofa, Trash2, Package, Key } from "lucide-react";
import { Card } from "@/components/ui/card";
import AnimatedSection from "./AnimatedSection";
import SectionBadge from "./SectionBadge";

const addons = [
  { icon: Wrench, title: "Möbelmontage", price: "ab CHF 50" },
  { icon: Paintbrush, title: "Malerarbeiten", price: "ab CHF 200" },
  { icon: Sofa, title: "Möbelentsorgung", price: "ab CHF 80" },
  { icon: Trash2, title: "Entrümpelung", price: "ab CHF 150" },
  { icon: Package, title: "Verpackungsmaterial", price: "inkl." },
  { icon: Key, title: "Schlüsselübergabe", price: "inkl." },
];

const ServiceAddons = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-10">
          <SectionBadge variant="alpine">Zusatzleistungen</SectionBadge>
          <h2 className="text-2xl md:text-3xl font-bold mt-4">
            Alles aus <span className="text-gradient-hero">einer Hand</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {addons.map((addon, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <Card className="p-4 text-center hover-lift cursor-pointer h-full">
                <addon.icon className="h-6 w-6 mx-auto mb-2 text-alpine" />
                <h3 className="font-medium text-sm">{addon.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{addon.price}</p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceAddons;
