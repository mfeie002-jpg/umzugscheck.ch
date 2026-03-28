import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package, Wrench, Trash2, Sparkles, Building, Piano, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "./AnimatedSection";

interface ServiceCrossSellingProps {
  currentService: string;
  variant?: "compact" | "full";
}

const allServices = [
  { 
    slug: "verpackungsservice", 
    title: "Verpackungsservice", 
    description: "Professionelle Verpackung Ihrer Habseligkeiten",
    icon: Package,
    keywords: ["verpacken", "kartons", "einpacken"]
  },
  { 
    slug: "montage", 
    title: "Möbelmontage", 
    description: "Auf- und Abbau aller Möbeltypen",
    icon: Wrench,
    keywords: ["montage", "aufbau", "abbau", "möbel"]
  },
  { 
    slug: "entsorgung", 
    title: "Entrümpelung", 
    description: "Räumung und umweltgerechte Entsorgung",
    icon: Trash2,
    keywords: ["entrümpelung", "entsorgung", "räumung"]
  },
  { 
    slug: "reinigung", 
    title: "Umzugsreinigung", 
    description: "Endreinigung mit Abnahmegarantie",
    icon: Sparkles,
    keywords: ["reinigung", "putzen", "endreinigung"]
  },
  { 
    slug: "moebellift", 
    title: "Möbellift", 
    description: "Transport über Balkon oder Fenster",
    icon: Building,
    keywords: ["lift", "aussenlift", "balkon"]
  },
  { 
    slug: "klaviertransport", 
    title: "Klaviertransport", 
    description: "Spezialtransport für Instrumente",
    icon: Piano,
    keywords: ["klavier", "flügel", "piano", "instrument"]
  },
  { 
    slug: "seniorenumzug", 
    title: "Seniorenumzug", 
    description: "Einfühlsamer Service für ältere Menschen",
    icon: Users,
    keywords: ["senioren", "alter", "betreut"]
  },
  { 
    slug: "vip-umzug", 
    title: "VIP Umzug", 
    description: "Premium White Glove Service",
    icon: Star,
    keywords: ["vip", "premium", "luxus", "white glove"]
  },
  { 
    slug: "bueroumzug", 
    title: "Büroumzug", 
    description: "Firmenumzug mit minimaler Ausfallzeit",
    icon: Building,
    keywords: ["büro", "firma", "office", "geschäft"]
  },
  { 
    slug: "einlagerung", 
    title: "Einlagerung", 
    description: "Sichere Lagerung für Ihre Möbel",
    icon: Package,
    keywords: ["lager", "storage", "einlagern"]
  }
];

const ServiceCrossSelling = memo(({ currentService, variant = "full" }: ServiceCrossSellingProps) => {
  const otherServices = allServices.filter(s => s.slug !== currentService).slice(0, 4);

  if (variant === "compact") {
    return (
      <div className="bg-muted/30 rounded-xl p-6">
        <h3 className="font-display font-bold text-lg mb-4">Passende Zusatzleistungen</h3>
        <div className="space-y-3">
          {otherServices.slice(0, 3).map((service) => (
            <Link 
              key={service.slug}
              to={`/plan/${service.slug}`}
              className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-alpine/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-alpine/10 flex items-center justify-center flex-shrink-0">
                <service.icon className="h-5 w-5 text-alpine" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm group-hover:text-alpine transition-colors">{service.title}</p>
                <p className="text-xs text-muted-foreground truncate">{service.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-alpine transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-in">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-alpine/10 text-alpine text-sm font-medium rounded-full mb-4">
              Kombinieren & Sparen
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
              Passende Zusatzleistungen
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kombinieren Sie mehrere Services für einen reibungslosen Umzug aus einer Hand
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherServices.map((service, index) => (
            <AnimatedSection key={service.slug} animation="slide-up" delay={index * 100}>
              <Link to={`/plan/${service.slug}`}>
                <Card className="h-full hover:shadow-strong transition-all duration-300 hover:-translate-y-1 group border-2 border-transparent hover:border-alpine/20">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-alpine/10 flex items-center justify-center mb-4 group-hover:bg-alpine group-hover:text-primary-foreground transition-colors">
                      <service.icon className="h-7 w-7 text-alpine group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2 group-hover:text-alpine transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                    <div className="flex items-center text-alpine text-sm font-medium">
                      Mehr erfahren
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-in" delay={400}>
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-forest/10 text-forest px-4 py-2 rounded-full text-sm">
              <span className="font-semibold">💡 Tipp:</span>
              <span>Buchen Sie 2+ Services und erhalten Sie 10% Rabatt</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

ServiceCrossSelling.displayName = "ServiceCrossSelling";

export default ServiceCrossSelling;
