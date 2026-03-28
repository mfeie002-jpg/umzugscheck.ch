import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";
import AnimatedSection from "./AnimatedSection";
import zurichImage from "@/assets/city-zurich-branded.jpg";
import baselImage from "@/assets/city-basel-branded.jpg";
import bernImage from "@/assets/city-bern-branded.jpg";
import genevaImage from "@/assets/city-geneva-branded.jpg";

interface CityData {
  name: string;
  region: string;
  href: string;
  image: string;
}

const cities: CityData[] = [
  { name: "Zürich", region: "Grossraum Zürich", href: "/area/zurich", image: zurichImage },
  { name: "Basel", region: "Nordwestschweiz", href: "/area/basel", image: baselImage },
  { name: "Bern", region: "Mittelland", href: "/area/bern", image: bernImage },
  { name: "Genf", region: "Romandie", href: "/area/geneva", image: genevaImage },
];

export default function ServiceAreas() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full mb-4">
            <MapPin className="inline-block w-3 h-3 mr-1" />
            Servicegebiet
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
            Umzüge in der ganzen <span className="text-gradient">Schweiz</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Von Zürich bis Genf – wir sind in allen Schweizer Städten für Sie da
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cities.map((city, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <Link to={city.href}>
                <Card className="overflow-hidden hover-lift group">
                  <div className="relative h-48">
                    <img
                      src={city.image}
                      alt={`Umzüge in ${city.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-xl">{city.name}</h3>
                      <p className="text-sm text-white/80">{city.region}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4} className="text-center">
          <Link
            to="/map"
            className="inline-flex items-center text-alpine font-medium hover:underline"
          >
            Alle Standorte entdecken
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
