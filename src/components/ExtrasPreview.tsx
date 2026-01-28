import { Package, Wrench, Sparkles, Trash2, Warehouse } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";
import SectionBadge from "@/components/SectionBadge";
import { trackCtaClick } from "@/hooks/useCtaTracking";

const ExtrasPreview = () => {
  const extras = [
    {
      icon: Package,
      title: "Verpackungsservice",
      description: "Wir verpacken alles professionell – von Geschirr bis Kunstwerke.",
      link: "/plan/packing",
    },
    {
      icon: Wrench,
      title: "Möbelmontage",
      description: "Auf- und Abbau Ihrer Möbel durch erfahrene Handwerker.",
      link: "/plan/assembly",
    },
    {
      icon: Sparkles,
      title: "Reinigung",
      description: "Professionelle Übergabereinigung für die Abgabe Ihrer Wohnung.",
      link: "/plan/cleaning",
    },
    {
      icon: Trash2,
      title: "Entsorgung",
      description: "Umweltgerechte Entrümpelung und Recycling von Altmöbeln.",
      link: "/plan/disposal",
    },
    {
      icon: Warehouse,
      title: "Lagerung",
      description: "Sichere, klimatisierte Lagerräume für Ihre Möbel.",
      link: "/plan/storage",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-8 sm:mb-10 lg:mb-12 space-y-2 sm:space-y-3">
          <SectionBadge variant="warm">Zusatzleistungen</SectionBadge>
          <h2 className="text-balance font-display mt-3 sm:mt-4">
            Alles aus <span className="text-gradient-warm">einer Hand</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Ergänzen Sie Ihren Umzug mit unseren Zusatzleistungen.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {extras.map((extra, index) => (
            <Link 
              key={index} 
              to={extra.link} 
              className="block h-full group touch-manipulation"
              onClick={() => trackCtaClick(extra.title, 'extras-preview')}
            >
              <Card className="p-4 sm:p-5 h-full hover-lift text-center transition-all duration-200 hover:border-warm/50 animate-fade-in" style={{ animationDelay: `${index * 0.08}s` }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-warm/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-warm/20 group-hover:scale-110 transition-all">
                  <extra.icon className="h-5 w-5 sm:h-6 sm:w-6 text-warm" />
                </div>
                <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2 group-hover:text-warm transition-colors">{extra.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">{extra.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtrasPreview;
