import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

interface InternalLinkingSectionProps {
  currentCity?: string;
  showServices?: boolean;
}

const InternalLinkingSection = ({ currentCity, showServices = true }: InternalLinkingSectionProps) => {
  const allCities = [
    { name: "Zürich", href: "/area/zurich", region: "Deutschschweiz", nearby: ["Winterthur", "Uster", "Dietikon", "Kloten"] },
    { name: "Basel", href: "/area/basel", region: "Deutschschweiz", nearby: ["Aarau", "Solothurn", "Fribourg"] },
    { name: "Bern", href: "/area/bern", region: "Deutschschweiz", nearby: ["Thun", "Köniz", "Interlaken", "Fribourg"] },
    { name: "Luzern", href: "/area/luzern", region: "Zentralschweiz", nearby: ["Emmen", "Zug", "Baar"] },
    { name: "Winterthur", href: "/area/winterthur", region: "Deutschschweiz", nearby: ["Zürich", "Wil", "Frauenfeld"] },
    { name: "St. Gallen", href: "/area/stgallen", region: "Ostschweiz", nearby: ["Wil", "Rapperswil", "Kreuzlingen"] },
    { name: "Lausanne", href: "/area/lausanne", region: "Romandie", nearby: ["Genf", "Yverdon", "Fribourg"] },
    { name: "Genf", href: "/area/geneva", region: "Romandie", nearby: ["Lausanne", "Yverdon"] },
    { name: "Lugano", href: "/area/lugano", region: "Tessin", nearby: ["Bellinzona", "Locarno"] },
    { name: "Aarau", href: "/area/aarau", region: "Deutschschweiz", nearby: ["Baden", "Olten", "Zürich"] },
    { name: "Chur", href: "/area/chur", region: "Graubünden", nearby: ["Davos", "St. Gallen"] },
    { name: "Thun", href: "/area/thun", region: "Bern", nearby: ["Bern", "Interlaken"] },
    { name: "Fribourg", href: "/area/fribourg", region: "Westschweiz", nearby: ["Bern", "Lausanne"] },
    { name: "Schaffhausen", href: "/area/schaffhausen", region: "Deutschschweiz", nearby: ["Winterthur", "Frauenfeld", "Kreuzlingen"] },
    { name: "Zug", href: "/area/zug", region: "Zentralschweiz", nearby: ["Luzern", "Baar", "Zürich"] },
    { name: "Baden", href: "/area/baden", region: "Aargau", nearby: ["Zürich", "Aarau", "Dietikon"] },
    { name: "Interlaken", href: "/area/interlaken", region: "Bern", nearby: ["Thun", "Bern"] },
    { name: "Davos", href: "/area/davos", region: "Graubünden", nearby: ["Chur"] },
    { name: "Kloten", href: "/area/kloten", region: "Zürich", nearby: ["Zürich", "Dübendorf", "Bülach"] },
    { name: "Dübendorf", href: "/area/duebendorf", region: "Zürich", nearby: ["Zürich", "Kloten", "Uster"] },
    { name: "Uster", href: "/area/uster", region: "Zürich", nearby: ["Zürich", "Wetzikon", "Dübendorf"] },
    { name: "Wetzikon", href: "/area/wetzikon", region: "Zürich", nearby: ["Uster", "Rapperswil"] },
    { name: "Bülach", href: "/area/buelach", region: "Zürich", nearby: ["Kloten", "Winterthur"] },
    { name: "Wil", href: "/area/wil", region: "St. Gallen", nearby: ["St. Gallen", "Winterthur", "Frauenfeld"] },
    { name: "Emmen", href: "/area/emmen", region: "Luzern", nearby: ["Luzern", "Zug"] },
    { name: "Baar", href: "/area/baar", region: "Zug", nearby: ["Zug", "Luzern", "Zürich"] },
    { name: "Adliswil", href: "/area/adliswil", region: "Zürich", nearby: ["Zürich", "Horgen", "Thalwil"] },
    { name: "Horgen", href: "/area/horgen", region: "Zürich", nearby: ["Zürich", "Adliswil", "Wädenswil"] },
    { name: "Dietikon", href: "/area/dietikon", region: "Zürich", nearby: ["Zürich", "Baden", "Schlieren"] },
    { name: "Frauenfeld", href: "/area/frauenfeld", region: "Thurgau", nearby: ["Winterthur", "Kreuzlingen", "Schaffhausen"] },
    { name: "Kreuzlingen", href: "/area/kreuzlingen", region: "Thurgau", nearby: ["Frauenfeld", "St. Gallen"] },
  ];

  const services = [
    { name: "Privatumzüge", href: "/plan/private" },
    { name: "Büroumzüge", href: "/plan/office" },
    { name: "Seniorenumzüge", href: "/plan/senior" },
    { name: "VIP Service", href: "/plan/vip" },
    { name: "Verpackungsservice", href: "/plan/packing" },
    { name: "Möbelmontage", href: "/plan/assembly" },
    { name: "Lagerung", href: "/plan/storage" },
    { name: "Internationale Umzüge", href: "/plan/international" },
  ];

  // Get nearby cities based on current city's connections
  const currentCityData = currentCity ? allCities.find(c => c.name === currentCity) : null;
  const nearbyCitiesFromConnections = currentCityData?.nearby || [];
  
  const nearbyCities = currentCity 
    ? allCities.filter(c => nearbyCitiesFromConnections.includes(c.name) || (c.name !== currentCity && c.region === currentCityData?.region)).slice(0, 8)
    : allCities.slice(0, 8);

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-in">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Nearby Cities */}
            <div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-4">
                <MapPin className="inline-block h-5 w-5 text-alpine mr-2" />
                {currentCity ? `Umzug von/nach ${currentCity}` : 'Umzug in Ihrer Region'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {nearbyCities.map((city) => (
                  <Link
                    key={city.name}
                    to={city.href}
                    className="flex items-center gap-2 p-3 rounded-lg bg-background hover:bg-alpine/10 transition-colors group text-sm"
                  >
                    <span className="text-foreground group-hover:text-alpine transition-colors">
                      Umzug {city.name}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-alpine transition-colors ml-auto" />
                  </Link>
                ))}
              </div>
              <Link 
                to="/map" 
                className="inline-flex items-center gap-2 mt-4 text-alpine hover:underline text-sm font-medium"
              >
                Alle Regionen ansehen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Services */}
            {showServices && (
              <div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-4">
                  Unsere Umzugsservices
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      to={service.href}
                      className="flex items-center gap-2 p-3 rounded-lg bg-background hover:bg-alpine/10 transition-colors group text-sm"
                    >
                      <span className="text-foreground group-hover:text-alpine transition-colors">
                        {service.name}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-alpine transition-colors ml-auto" />
                    </Link>
                  ))}
                </div>
                <Link 
                  to="/services" 
                  className="inline-flex items-center gap-2 mt-4 text-alpine hover:underline text-sm font-medium"
                >
                  Alle Services ansehen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default InternalLinkingSection;
