import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Home, Building2, Sparkles, Trash2, Package, 
  Wrench, Globe, ArrowRight
} from "lucide-react";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTASection } from "@/components/CTASection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { OrganizationSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";
import servicePrivatumzug from "@/assets/service-privatumzug.jpg";
import serviceFirmenumzug from "@/assets/service-firmenumzug.jpg";
import serviceReinigung from "@/assets/service-reinigung.jpg";
import serviceEntsorgung from "@/assets/service-entsorgung.jpg";

const services = [
  {
    title: "Privatumzug",
    description: "Kompletter Service für Ihren privaten Umzug in der ganzen Schweiz",
    image: servicePrivatumzug,
    link: "/privatumzug",
    icon: Home,
    price: "Ab CHF 500"
  },
  {
    title: "Firmenumzug",
    description: "Professionelle Büro- und Geschäftsumzüge mit minimalen Ausfallzeiten",
    image: serviceFirmenumzug,
    link: "/firmenumzug",
    icon: Building2,
    price: "Ab CHF 2'000"
  },
  {
    title: "Umzugsreinigung",
    description: "End- und Umzugsreinigung mit Abgabegarantie",
    image: serviceReinigung,
    link: "/reinigung",
    icon: Sparkles,
    price: "Ab CHF 300"
  },
  {
    title: "Entsorgung & Räumung",
    description: "Fachgerechte Entsorgung von Möbeln und Hausrat",
    image: serviceEntsorgung,
    link: "/entsorgung",
    icon: Trash2,
    price: "Ab CHF 200"
  },
  {
    title: "Möbellift & Spezialtransporte",
    description: "Für schwere Möbel und enge Treppenhäuser",
    link: "/moebellift",
    icon: Wrench,
    price: "Ab CHF 300"
  },
  {
    title: "Einlagerung",
    description: "Sichere Möbellagerung klimatisiert und versichert",
    link: "/einlagerung",
    icon: Package,
    price: "Ab CHF 100/Monat"
  },
  {
    title: "Umzug mit Reinigung",
    description: "Das Komplettpaket: Umzug und Endreinigung aus einer Hand",
    link: "/umzug-mit-reinigung",
    icon: Sparkles,
    price: "Ab CHF 1'500"
  },
  {
    title: "Internationaler Umzug",
    description: "Weltweite Umzüge ab der Schweiz mit Zollabwicklung",
    link: "/internationale-umzuege",
    icon: Globe,
    price: "Ab CHF 3'000"
  }
];

export default function ServicesOverview() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Alle Dienstleistungen - Umzug, Reinigung & mehr"
        description="Entdecken Sie unser komplettes Service-Portfolio: Privatumzüge, Firmenumzüge, Reinigung, Entsorgung, Lagerung und viele weitere Dienstleistungen."
        keywords="umzug dienstleistungen, umzug services, reinigung, entsorgung, lagerung"
        canonicalUrl="https://umzugscheck.ch/dienstleistungen"
      />
      <OrganizationSchema />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "Dienstleistungen", url: "https://umzugscheck.ch/dienstleistungen" }
      ]} />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div
            ref={heroRef}
            className={cn(
              "max-w-4xl mx-auto text-center transition-all duration-700",
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Unsere Dienstleistungen
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Ihr kompletter Service rund um den Umzug – alles aus einer Hand
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <PageSection variant="muted">
        <div
          ref={gridRef}
          className={cn(
            "transition-all duration-700",
            gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <SectionHeading
            title="Alle Services im Überblick"
            subtitle="Wählen Sie den passenden Service für Ihre Bedürfnisse"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link key={index} to={service.link} className="group">
                <Card variant="elevated" className="h-full hover-lift overflow-hidden">
                  {service.image ? (
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                        <service.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xs font-medium text-white/90 bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                          {service.price}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <service.icon className="h-12 w-12 text-primary" />
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xs font-medium text-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
                          {service.price}
                        </span>
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                      {service.title}
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </PageSection>

      {/* CTA Section */}
      <CTASection
        title="Bereit für Ihren Umzug?"
        description="Holen Sie sich jetzt kostenlose Offerten für alle benötigten Services"
        buttonText="Jetzt Offerte anfragen"
        buttonLink="/rechner"
      />
    </div>
  );
}
