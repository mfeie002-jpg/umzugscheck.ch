import { motion } from "framer-motion";
import { Home, Building2, Briefcase, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import AnimatedSection from "./AnimatedSection";
import SectionBadge from "./SectionBadge";

const moveTypes = [
  {
    icon: Home,
    title: "Privatumzug",
    description: "Für Familien & Paare",
    href: "/plan/privatumzug",
    color: "alpine",
  },
  {
    icon: Building2,
    title: "Wohnungswechsel",
    description: "Studio bis 5+ Zimmer",
    href: "/plan/wohnungswechsel",
    color: "forest",
  },
  {
    icon: Briefcase,
    title: "Firmenumzug",
    description: "Büro & Geschäft",
    href: "/plan/bueroumzug",
    color: "warm",
  },
  {
    icon: Globe,
    title: "International",
    description: "EU & Weltweit",
    href: "/plan/international",
    color: "alpine",
  },
];

const MoveTypeSelector = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-8">
          <SectionBadge>Umzugsart wählen</SectionBadge>
          <h2 className="text-2xl md:text-3xl font-bold mt-4">
            Was möchten Sie <span className="text-gradient-warm">umziehen</span>?
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {moveTypes.map((type, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <Link to={type.href}>
                <Card className="p-6 text-center hover-lift cursor-pointer group h-full">
                  <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                    type.color === 'alpine' ? 'bg-alpine/10' :
                    type.color === 'forest' ? 'bg-forest/10' :
                    'bg-warm/10'
                  } group-hover:scale-110 transition-transform`}>
                    <type.icon className={`h-6 w-6 ${
                      type.color === 'alpine' ? 'text-alpine' :
                      type.color === 'forest' ? 'text-forest' :
                      'text-warm'
                    }`} />
                  </div>
                  <h3 className="font-bold text-sm md:text-base">{type.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoveTypeSelector;
