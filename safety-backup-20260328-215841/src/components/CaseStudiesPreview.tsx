import { motion } from "framer-motion";
import { Star, ArrowRight, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import SectionBadge from "@/components/SectionBadge";
import referenceFamily from "@/assets/reference-family.jpg";
import referenceCorporate from "@/assets/reference-corporate.jpg";
import referenceInternational from "@/assets/reference-international.jpg";

const CaseStudiesPreview = () => {
  const cases = [
    {
      title: "Familie Meier",
      subtitle: "5-Zimmer Villa → Neubau",
      description: "Komplettumzug mit Einlagerung während der Renovierung. Alles reibungslos in 3 Tagen.",
      image: referenceFamily,
      location: "Zürich → Zollikon",
      rating: 5,
      stats: { rooms: "5 Zimmer", duration: "3 Tage", items: "~120m³" },
    },
    {
      title: "Tech Startup AG",
      subtitle: "Büroumzug 30 Mitarbeiter",
      description: "Wochenendumzug ohne Arbeitsausfall. IT-Equipment sicher transportiert.",
      image: referenceCorporate,
      location: "Winterthur → Zürich",
      rating: 5,
      stats: { rooms: "400m² Büro", duration: "1 Wochenende", items: "~80m³" },
    },
    {
      title: "Herr & Frau Schmidt",
      subtitle: "Rückkehr aus Deutschland",
      description: "Internationaler Umzug mit Zollabwicklung. Schlüsselfertig ins neue Zuhause.",
      image: referenceInternational,
      location: "München → Basel",
      rating: 5,
      stats: { rooms: "4 Zimmer", duration: "2 Tage", items: "~90m³" },
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12 lg:mb-16 space-y-4">
          <SectionBadge variant="alpine">Referenzen</SectionBadge>
          <h2 className="text-balance font-display mt-4">
            Erfolgreiche <span className="text-gradient">Umzugsprojekte</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Einblicke in ausgewählte Projekte – jeder Umzug eine Erfolgsgeschichte.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {cases.map((caseStudy, index) => (
            <AnimatedSection key={index} delay={index * 0.15}>
              <Card className="overflow-hidden h-full hover-lift group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(caseStudy.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 text-warm fill-warm" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {caseStudy.location}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1">{caseStudy.title}</h3>
                  <p className="text-sm text-alpine font-medium mb-2">{caseStudy.subtitle}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {caseStudy.description}
                  </p>
                  <div className="flex gap-3 text-xs">
                    {Object.entries(caseStudy.stats).map(([key, value]) => (
                      <span key={key} className="px-2 py-1 rounded bg-muted">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <Link to="/references">
            <Button variant="outline" className="border-2">
              Alle Referenzen ansehen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CaseStudiesPreview;
