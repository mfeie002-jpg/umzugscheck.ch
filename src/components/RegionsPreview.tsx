import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/SectionBadge";

const RegionsPreview = () => {
  const regions = [
    { name: "Zürich", slug: "zurich", count: "2000+ Umzüge" },
    { name: "Basel", slug: "basel", count: "800+ Umzüge" },
    { name: "Bern", slug: "bern", count: "600+ Umzüge" },
    { name: "Luzern", slug: "luzern", count: "400+ Umzüge" },
    { name: "St. Gallen", slug: "stgallen", count: "300+ Umzüge" },
    { name: "Winterthur", slug: "winterthur", count: "350+ Umzüge" },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 space-y-4 animate-fade-in">
          <SectionBadge variant="alpine">Servicegebiet</SectionBadge>
          <h2 className="text-balance font-display mt-4">
            Schweizweit <span className="text-gradient">für Sie da</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Von Zürich bis Genf – wir sind in der ganzen Schweiz für Sie im Einsatz.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {regions.map((region, index) => (
            <div 
              key={index} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <Link 
                to={`/area/${region.slug}`}
                className="block p-4 rounded-xl bg-muted/50 hover:bg-alpine/10 border border-transparent hover:border-alpine/30 transition-all duration-300 text-center group"
              >
                <MapPin className="h-5 w-5 text-alpine mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-sm group-hover:text-alpine transition-colors">{region.name}</p>
                <p className="text-xs text-muted-foreground">{region.count}</p>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Link to="/map">
            <Button variant="outline" className="border-2">
              Alle Regionen ansehen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegionsPreview;