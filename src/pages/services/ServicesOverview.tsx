import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Home, Building2, Sparkles, Trash2, Package, 
  Wrench, FileText, Truck, Globe, Piano 
} from "lucide-react";
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
    icon: Home
  },
  {
    title: "Firmenumzug",
    description: "Professionelle Büro- und Geschäftsumzüge mit minimalen Ausfallzeiten",
    image: serviceFirmenumzug,
    link: "/firmenumzug",
    icon: Building2
  },
  {
    title: "Umzugsreinigung",
    description: "End- und Umzugsreinigung mit Abgabegarantie",
    image: serviceReinigung,
    link: "/reinigung",
    icon: Sparkles
  },
  {
    title: "Entsorgung & Räumung",
    description: "Fachgerechte Entsorgung von Möbeln und Hausrat",
    image: serviceEntsorgung,
    link: "/entsorgung",
    icon: Trash2
  },
  {
    title: "Möbellift & Spezialtransporte",
    description: "Für schwere Möbel und enge Treppenhäuser",
    link: "/moebellift",
    icon: Wrench
  },
  {
    title: "Internationaler Umzug",
    description: "Weltweite Umzüge ab der Schweiz",
    link: "/internationale-umzuege",
    icon: Globe
  }
];

export default function ServicesOverview() {
  return (
    <>
      <OptimizedSEO
        title="Alle Dienstleistungen - Umzug, Reinigung & mehr"
        description="Entdecken Sie unser komplettes Service-Portfolio: Privatumzüge, Firmenumzüge, Reinigung, Entsorgung, Lagerung und viele weitere Dienstleistungen."
        keywords="umzug dienstleistungen, umzug services, reinigung, entsorgung, lagerung"
        canonicalUrl="https://umzugscheck.ch/dienstleistungen"
      />

      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="gradient-hero text-white py-16 md:py-24">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    Unsere Dienstleistungen
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-white/90">
                    Ihr kompletter Service rund um den Umzug
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Services Grid */}
          <section className="py-16 gradient-light">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                  Alle Services im Überblick
                </h2>
              </ScrollReveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <Link to={service.link}>
                      <Card variant="elevated" className="h-full hover-lift overflow-hidden group cursor-pointer">
                        {service.image && (
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={service.image} 
                              alt={service.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                              <service.icon className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                        )}
                        {!service.image && (
                          <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <service.icon className="h-16 w-16 text-primary" />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="group-hover:text-primary transition-colors">{service.title}</CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full">
                            Mehr erfahren
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 gradient-cta text-white">
            <div className="container mx-auto px-4 text-center">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Bereit für Ihren Umzug?
                </h2>
                <p className="text-xl mb-8 text-white/90">
                  Holen Sie sich jetzt kostenlose Offerten für alle benötigten Services
                </p>
                <Button size="lg" variant="default" asChild className="bg-white text-primary hover:bg-white/90 shadow-premium">
                  <Link to="/rechner">Jetzt Offerte anfragen</Link>
                </Button>
              </ScrollReveal>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
