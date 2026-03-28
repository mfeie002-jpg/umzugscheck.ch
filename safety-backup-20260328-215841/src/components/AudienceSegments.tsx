import { Building2, Home, HeartHandshake, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { trackCtaClick } from "@/hooks/useCtaTracking";

const AudienceSegments = () => {
  const segments = [
    {
      icon: Home,
      title: "Für Familien",
      description: "Sorgenfrei umziehen – wir kümmern uns um alles",
      link: "/plan/private",
      color: "alpine",
    },
    {
      icon: HeartHandshake,
      title: "Für Senioren",
      description: "Mit Geduld und besonderer Fürsorge",
      link: "/plan/senior",
      color: "warm",
    },
    {
      icon: Building2,
      title: "Für Firmen",
      description: "Minimale Ausfallzeit, maximale Effizienz",
      link: "/plan/office",
      color: "forest",
    },
    {
      icon: Briefcase,
      title: "Für Singles",
      description: "Kompakt und preiswert",
      link: "/plan/student",
      color: "alpine",
    },
  ];

  return (
    <section className="py-10 lg:py-14 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <p className="text-center text-xs sm:text-sm font-medium text-muted-foreground mb-4 sm:mb-6">
            Für jede Lebenssituation das richtige Angebot
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {segments.map((segment, index) => (
              <Link 
                key={index}
                to={segment.link}
                onClick={() => trackCtaClick(segment.title, 'audience-segments')}
                className="block p-4 sm:p-5 rounded-xl bg-card border border-border hover:border-alpine/30 hover:shadow-medium transition-all duration-200 group text-center animate-fade-in touch-manipulation"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl mx-auto mb-2 sm:mb-3 flex items-center justify-center transition-transform group-hover:scale-110 ${
                  segment.color === 'warm' ? 'bg-warm/10' :
                  segment.color === 'forest' ? 'bg-forest/10' :
                  'bg-alpine/10'
                }`}>
                  <segment.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    segment.color === 'warm' ? 'text-warm' :
                    segment.color === 'forest' ? 'text-forest' :
                    'text-alpine'
                  }`} />
                </div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-alpine transition-colors">
                  {segment.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-snug">{segment.description}</p>
                <div className="mt-2 text-alpine text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  Mehr erfahren <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default AudienceSegments;
