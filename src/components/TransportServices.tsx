import { Link } from "react-router-dom";
import { Truck, Package, Building2, Plane, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TransportServices = () => {
  const transportServices = [
    {
      icon: Truck,
      title: "Lokale Transporte",
      description: "Schnelle und zuverlässige Transporte innerhalb der Region Zürich und der gesamten Schweiz.",
      features: ["Same-Day Delivery", "Flexible Zeitfenster", "Eilzustellung möglich"],
      link: "/plan/private"
    },
    {
      icon: Package,
      title: "Möbeltransport",
      description: "Professioneller Transport von Möbeln und Einrichtungsgegenständen mit Spezialequipment.",
      features: ["Sichere Verpackung", "Montage/Demontage", "Versichert"],
      link: "/option/assembly"
    },
    {
      icon: Building2,
      title: "Gewerbe & Industrie",
      description: "Massgeschneiderte Transportlösungen für Unternehmen, Büros und Industrieanlagen.",
      features: ["Projektmanagement", "Lagerlogistik", "IT-Equipment"],
      link: "/plan/office"
    },
    {
      icon: Plane,
      title: "Internationale Fracht",
      description: "Weltweite Transporte mit Zollabwicklung und lückenloser Dokumentation.",
      features: ["Zollabfertigung", "Tracking", "Expressversand"],
      link: "/plan/international"
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
            Transportdienstleistungen
          </span>
          <h2 className="text-balance font-display">Mehr als nur Umzüge</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Als familiengeführtes Transport- und Umzugsunternehmen bieten wir Ihnen umfassende Logistiklösungen
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {transportServices.map((service, index) => (
            <Link key={index} to={service.link}>
              <Card className="p-6 h-full hover-lift cursor-pointer group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <service.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-3 font-display">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-foreground">
                      <span className="w-1 h-1 rounded-full bg-alpine" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-alpine text-sm font-medium group-hover:gap-2 transition-all">
                  Details <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/contact">
            <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
              Transportanfrage stellen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TransportServices;