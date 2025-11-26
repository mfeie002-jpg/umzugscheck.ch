import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface InternalLinksProps {
  type: 'service' | 'city' | 'city-service';
  currentService?: string;
  currentCity?: string;
}

const services = [
  { slug: 'umzug', name: 'Umzug' },
  { slug: 'reinigung', name: 'Reinigung' },
  { slug: 'raeumung', name: 'Räumung' },
  { slug: 'firmenumzug', name: 'Firmenumzug' },
  { slug: 'transport', name: 'Transport' },
  { slug: 'lagerung', name: 'Lagerung' },
  { slug: 'entsorgung', name: 'Entsorgung' },
  { slug: 'umzug-mit-reinigung', name: 'Umzug + Reinigung' }
];

const cities = [
  { slug: 'zuerich', name: 'Zürich' },
  { slug: 'bern', name: 'Bern' },
  { slug: 'basel', name: 'Basel' },
  { slug: 'genf', name: 'Genf' },
  { slug: 'lausanne', name: 'Lausanne' },
  { slug: 'lugano', name: 'Lugano' },
  { slug: 'luzern', name: 'Luzern' },
  { slug: 'winterthur', name: 'Winterthur' },
  { slug: 'st-gallen', name: 'St. Gallen' },
  { slug: 'zug', name: 'Zug' },
  { slug: 'biel', name: 'Biel' },
  { slug: 'aarau', name: 'Aarau' }
];

export const InternalLinks = ({ type, currentService, currentCity }: InternalLinksProps) => {
  // Service page links
  if (type === 'service' && currentService) {
    const relatedServices = services.filter(s => s.slug !== currentService).slice(0, 3);
    const topCities = cities.slice(0, 6);

    return (
      <section className="py-12 md:py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              Weitere Services & Regionen
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Related Services */}
              <div>
                <h3 className="text-xl font-bold mb-4">Weitere Services</h3>
                <div className="space-y-3">
                  {relatedServices.map(service => (
                    <Link 
                      key={service.slug}
                      to={`/${service.slug}/`}
                      className="flex items-center justify-between p-3 bg-background rounded-lg hover:shadow-md transition-shadow"
                    >
                      <span className="font-medium">{service.name}</span>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Cities */}
              <div>
                <h3 className="text-xl font-bold mb-4">Beliebte Städte</h3>
                <div className="grid grid-cols-2 gap-3">
                  {topCities.map(city => (
                    <Link 
                      key={city.slug}
                      to={`/${city.slug}/umzugsfirmen/`}
                      className="p-3 bg-background rounded-lg hover:shadow-md transition-shadow text-center font-medium"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <Link to="/umzugsofferten/" className="text-primary hover:underline font-medium">
                Offerten vergleichen
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/preise/" className="text-primary hover:underline font-medium">
                Preise ansehen
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/" className="text-primary hover:underline font-medium">
                Zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // City page links
  if (type === 'city' && currentCity) {
    const nearbyCities = cities.filter(c => c.slug !== currentCity).slice(0, 6);
    const allServices = services.slice(0, 6);

    return (
      <section className="py-12 md:py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              Weitere Regionen & Services
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Nearby Cities */}
              <div>
                <h3 className="text-xl font-bold mb-4">Weitere Städte</h3>
                <div className="grid grid-cols-2 gap-3">
                  {nearbyCities.map(city => (
                    <Link 
                      key={city.slug}
                      to={`/${city.slug}/umzugsfirmen/`}
                      className="p-3 bg-background rounded-lg hover:shadow-md transition-shadow text-center font-medium"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Services in this city */}
              <div>
                <h3 className="text-xl font-bold mb-4">Services in dieser Region</h3>
                <div className="space-y-3">
                  {allServices.map(service => (
                    <Link 
                      key={service.slug}
                      to={`/${currentCity}/${service.slug}/`}
                      className="flex items-center justify-between p-3 bg-background rounded-lg hover:shadow-md transition-shadow"
                    >
                      <span className="font-medium">{service.name}</span>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // City-Service page links
  if (type === 'city-service' && currentCity && currentService) {
    const nearbyCities = cities.filter(c => c.slug !== currentCity).slice(0, 4);
    const relatedServices = services.filter(s => s.slug !== currentService).slice(0, 3);

    return (
      <section className="py-12 md:py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              Weitere Optionen
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Same service, other cities */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">In anderen Städten</h3>
                <div className="space-y-2">
                  {nearbyCities.map(city => (
                    <Link 
                      key={city.slug}
                      to={`/${city.slug}/${currentService}/`}
                      className="block text-primary hover:underline"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </Card>

              {/* Other services, same city */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Weitere Services</h3>
                <div className="space-y-2">
                  {relatedServices.map(service => (
                    <Link 
                      key={service.slug}
                      to={`/${currentCity}/${service.slug}/`}
                      className="block text-primary hover:underline"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </Card>

              {/* Main links */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Hauptseiten</h3>
                <div className="space-y-2">
                  <Link to={`/${currentCity}/umzugsfirmen/`} className="block text-primary hover:underline">
                    Alle Firmen in der Region
                  </Link>
                  <Link to={`/${currentService}/`} className="block text-primary hover:underline">
                    Schweizweit vergleichen
                  </Link>
                  <Link to="/umzugsofferten/" className="block text-primary hover:underline">
                    Offerten erhalten
                  </Link>
                  <Link to="/preise/" className="block text-primary hover:underline">
                    Preise ansehen
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
};
