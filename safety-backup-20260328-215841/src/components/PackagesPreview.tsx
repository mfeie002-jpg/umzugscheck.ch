import { CheckCircle, ArrowRight, Star, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedSection from "@/components/AnimatedSection";
import SectionBadge from "@/components/SectionBadge";
import { trackCtaClick } from "@/hooks/useCtaTracking";

const packages = [
  {
    name: "Basis",
    description: "Für Selbstpacker – wir transportieren",
    price: "ab CHF 590",
    features: [
      "Transport Ihrer Möbel",
      "Auf-/Abladen inklusive",
      "Vollversicherung",
      "Erfahrenes Team",
    ],
    link: "/plan/basic",
  },
  {
    name: "Komfort",
    description: "Unser Bestseller – Rundum-sorglos",
    price: "ab CHF 990",
    popular: true,
    features: [
      "Alles aus Basis +",
      "Verpackungsmaterial",
      "Ein-/Auspacken",
      "Möbelmontage",
      "Reinigung Basic",
    ],
    link: "/plan/half",
  },
  {
    name: "Premium",
    description: "Luxus-Service – Sie müssen nichts tun",
    price: "ab CHF 1890",
    features: [
      "Alles aus Komfort +",
      "Komplettreinigung",
      "Entsorgung",
      "Übergabe-Garantie",
      "VIP-Betreuung",
    ],
    link: "/plan/full",
  },
];

// Integrierte Preistransparenz
const included = [
  "Festpreis ohne Überraschungen",
  "Alle Materialien inklusive",
  "Versicherung inklusive",
  "Keine versteckten Kosten",
];

const notIncluded = [
  "Nachträgliche Aufschläge",
  "Stundenbasis ohne Limit",
  "Unversicherte Transporte",
];

const PackagesPreview = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-8 sm:mb-10 lg:mb-12">
          <SectionBadge variant="alpine">Pakete & Preise</SectionBadge>
          <h2 className="text-balance font-display mt-3 sm:mt-4">
            Wählen Sie Ihr <span className="text-gradient">Paket</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
            Von Basis bis Premium – das passende Paket für jeden Bedarf.
          </p>
        </AnimatedSection>

        <Tabs defaultValue="packages" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="packages">Unsere Pakete</TabsTrigger>
            <TabsTrigger value="transparency">Preistransparenz</TabsTrigger>
          </TabsList>

          <TabsContent value="packages">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {packages.map((pkg, index) => (
                <div 
                  key={index} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className={`p-4 sm:p-5 lg:p-6 h-full relative hover:shadow-lg transition-shadow ${
                    pkg.popular 
                      ? "border-2 border-alpine shadow-glow" 
                      : "hover:border-alpine/50"
                  }`}>
                    {pkg.popular && (
                      <div className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2">
                        <div className="flex items-center gap-1 bg-gradient-hero text-primary-foreground px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md whitespace-nowrap">
                          <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                          BELIEBTESTES
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-4 sm:mb-5 pt-1 sm:pt-2">
                      <h3 className="text-lg sm:text-xl font-bold font-display mb-1">{pkg.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3">{pkg.description}</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-alpine">{pkg.price}</p>
                    </div>

                    <ul className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-6">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm">
                          <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-forest flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link 
                      to={pkg.link} 
                      className="block touch-manipulation"
                      onClick={() => trackCtaClick(`Paket ${pkg.name}`, "packages-preview")}
                    >
                      <Button 
                        className={`w-full min-h-[44px] sm:min-h-[48px] text-sm sm:text-base ${
                          pkg.popular ? "bg-gradient-hero" : ""
                        }`}
                        variant={pkg.popular ? "default" : "outline"}
                      >
                        Mehr erfahren
                        <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </Link>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transparency">
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <Card className="p-6 border-forest/30 bg-forest/5 h-full">
                  <h3 className="font-bold text-lg mb-4 text-forest">Bei uns inklusive</h3>
                  <ul className="space-y-3">
                    {included.map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-forest flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <Card className="p-6 border-destructive/30 bg-destructive/5 h-full">
                  <h3 className="font-bold text-lg mb-4 text-destructive">Bei uns NIE</h3>
                  <ul className="space-y-3">
                    {notIncluded.map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <X className="h-5 w-5 text-destructive flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <AnimatedSection className="text-center mt-8 sm:mt-10">
          <Link to="/pricing">
            <Button variant="link" className="text-muted-foreground hover:text-alpine text-sm sm:text-base">
              Alle Pakete im Detail vergleichen
              <ArrowRight className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PackagesPreview;
