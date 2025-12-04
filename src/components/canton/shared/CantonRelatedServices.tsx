import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Home, Building2, Sparkles, Package, Truck, Warehouse } from "lucide-react";
import { Link } from "react-router-dom";

interface CantonRelatedServicesProps {
  cantonName: string;
  cantonSlug: string;
}

export const CantonRelatedServices = ({ cantonName, cantonSlug }: CantonRelatedServicesProps) => {
  const relatedServices = [
    { icon: Home, title: "Privatumzug", desc: "Wohnungswechsel leicht gemacht", link: "/privatumzug", tag: "Beliebt" },
    { icon: Building2, title: "Firmenumzug", desc: "Professionelle Büroumzüge", link: "/firmenumzug-schweiz", tag: null },
    { icon: Sparkles, title: "Umzug + Reinigung", desc: "Alles aus einer Hand", link: "/umzug-mit-reinigung", tag: "Kombi" },
    { icon: Package, title: "Entsorgung", desc: "Entrümpelung & Räumung", link: "/entsorgung-raeumung", tag: null },
    { icon: Warehouse, title: "Einlagerung", desc: "Sichere Lagerräume", link: "/einlagerung", tag: null },
    { icon: Truck, title: "Möbeltransport", desc: "Einzelne Möbelstücke", link: "/kleintransporte", tag: null },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Weitere Services in {cantonName}</h2>
          <p className="text-muted-foreground">Entdecken Sie alle Umzugsdienstleistungen</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {relatedServices.map((service, i) => {
            const Icon = service.icon;
            return (
              <Link key={i} to={service.link}>
                <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{service.title}</h3>
                          {service.tag && <Badge variant="secondary" className="text-xs">{service.tag}</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{service.desc}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
