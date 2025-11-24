import { Truck, Sparkles, Package, Wrench, Home, Archive, Trash2, Boxes } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Truck,
    title: "Umzug",
    description: "Professioneller Transport",
    color: "text-primary",
    bgColor: "bg-primary/10",
    link: "/rechner"
  },
  {
    icon: Sparkles,
    title: "Endreinigung",
    description: "Mit Abnahmegarantie",
    color: "text-accent",
    bgColor: "bg-accent/10",
    link: "/reinigungsrechner"
  },
  {
    icon: Trash2,
    title: "Entsorgung",
    description: "Fachgerechte Räumung",
    color: "text-warning",
    bgColor: "bg-warning/10",
    link: "/entsorgungsrechner"
  },
  {
    icon: Archive,
    title: "Lagerung",
    description: "Sichere Aufbewahrung",
    color: "text-info",
    bgColor: "bg-info/10",
    link: "/lagerrechner"
  },
  {
    icon: Package,
    title: "Packservice",
    description: "Professionelle Verpackung",
    color: "text-success",
    bgColor: "bg-success/10",
    link: "/packservice-rechner"
  },
  {
    icon: Wrench,
    title: "Möbelmontage",
    description: "Auf- & Abbau",
    color: "text-primary",
    bgColor: "bg-primary/10",
    link: "/moebelmontage-rechner"
  },
  {
    icon: Home,
    title: "Handwerker",
    description: "Malerarbeiten & mehr",
    color: "text-accent",
    bgColor: "bg-accent/10",
    link: "/kontakt"
  },
  {
    icon: Boxes,
    title: "Alles-in-einem",
    description: "Komplettpaket",
    color: "text-success",
    bgColor: "bg-success/10",
    link: "/gesamtpreis-konfigurator"
  }
];

export const ServiceCarousel = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-subtle border-y border-border overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-semibold text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Premium Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Alles aus einer Hand</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Von Umzug bis Endreinigung – wir bieten Ihnen das komplette Servicepaket
          </p>
        </div>

        {/* Horizontal scrolling carousel */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:grid md:grid-cols-4 lg:grid-cols-4 md:overflow-visible">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="flex-shrink-0 w-64 md:w-auto snap-center group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="h-full border-2 border-border hover:border-primary/30 hover-lift hover-shine transition-all cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl ${service.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className={`w-8 h-8 ${service.color}`} />
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Gradient fade on mobile */}
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden"></div>
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <Link to="/rechner" className="text-primary font-semibold hover:underline inline-flex items-center gap-2 group">
            Alle Services ansehen
            <Sparkles className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};