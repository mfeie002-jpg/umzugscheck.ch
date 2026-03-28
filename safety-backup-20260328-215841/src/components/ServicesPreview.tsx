import { Link } from "react-router-dom";
import { Home, Building2, HeartHandshake, ArrowRight, CheckCircle, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import SectionBadge from "@/components/SectionBadge";
import LazyImage from "@/components/LazyImage";
import { trackCtaClick } from "@/hooks/useCtaTracking";
import familyImage from "@/assets/moving-family.jpg";
import officeImage from "@/assets/moving-office.jpg";
import seniorImage from "@/assets/service-senior-new.jpg";

const ServicesPreview = () => {
  const services = [
    {
      icon: Home,
      title: "Privatumzüge",
      description: "Ob Wohnung oder Haus – Ihr Zuhause ist in sicheren Händen. Wir kümmern uns um alles.",
      features: ["Komplettservice", "Möbelmontage", "Reinigung auf Wunsch"],
      image: familyImage,
      link: "/plan/private",
      popular: true,
    },
    {
      icon: Building2,
      title: "Büroumzüge",
      description: "Minimale Ausfallzeit, maximale Effizienz. Professionelle Planung für Ihr Geschäft.",
      features: ["Wochenendumzüge", "IT-Equipment", "Archivierung"],
      image: officeImage,
      link: "/plan/office",
    },
    {
      icon: HeartHandshake,
      title: "Seniorenumzüge",
      description: "Mit besonderer Fürsorge und Geduld. Wir begleiten Sie bei diesem wichtigen Schritt.",
      features: ["Persönliche Betreuung", "Entrümpelung", "Koordination"],
      image: seniorImage,
      link: "/plan/senior",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-8 sm:mb-10 lg:mb-12">
          <SectionBadge>Unsere Leistungen</SectionBadge>
          <h2 className="text-balance font-display mt-3 sm:mt-4">
            Was wir für Sie <span className="text-gradient">tun können</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
            Von der kleinen Wohnung bis zum grossen Büro – passende Lösungen für jeden Bedarf.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10">
          {services.map((service, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <Link to={service.link} className="block h-full group" onClick={() => trackCtaClick(service.title, 'services-preview')}>
                <Card className={`overflow-hidden h-full transition-all duration-300 ${
                  service.popular 
                    ? 'border-2 border-alpine shadow-glow' 
                    : 'hover:shadow-strong hover:border-alpine'
                }`}>
                  {service.popular && (
                    <div className="bg-gradient-hero text-primary-foreground text-xs font-bold px-4 py-1.5 text-center">
                      AM BELIEBTESTEN
                    </div>
                  )}
                  
                  {/* Image - optimized with lazy loading */}
                  <div className="relative h-36 sm:h-40 md:h-44 overflow-hidden">
                    <LazyImage 
                      src={service.image} 
                      alt={`${service.title} - Feierabend Umzüge`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                        <Truck className="w-4 h-4 text-alpine" />
                      </div>
                      <span className="text-white text-xs font-semibold drop-shadow-lg">Feierabend Umzüge</span>
                    </div>
                  </div>

                  {/* Content - mobile optimized padding */}
                  <div className="p-4 sm:p-5 lg:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-alpine/10 flex items-center justify-center flex-shrink-0">
                        <service.icon className="h-4 w-4 sm:h-5 sm:w-5 text-alpine" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-display group-hover:text-alpine transition-colors">
                        {service.title}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {service.description}
                    </p>

                    <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-alpine flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center text-sm sm:text-base text-alpine font-medium">
                      Mehr erfahren
                      <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <Link to="/services">
            <Button size="lg" variant="outline" className="border-2">
              Alle Leistungen ansehen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ServicesPreview;