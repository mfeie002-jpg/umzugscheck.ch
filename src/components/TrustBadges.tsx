import { Shield, Lock, Award, MapPin, Clock, BadgeCheck } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "Geprüfte Firmen",
    description: "Alle Partner sind versichert und zertifiziert"
  },
  {
    icon: Lock,
    title: "Sichere Daten",
    description: "SSL-verschlüsselt & DSGVO-konform"
  },
  {
    icon: BadgeCheck,
    title: "Verifizierte Bewertungen",
    description: "Nur echte Kundenmeinungen"
  },
  {
    icon: MapPin,
    title: "Schweizweite Abdeckung",
    description: "Service in allen 26 Kantonen"
  },
  {
    icon: Clock,
    title: "Schnelle Offerten",
    description: "Angebote innerhalb 24 Stunden"
  },
  {
    icon: Award,
    title: "Beste Preise",
    description: "Sparen Sie bis zu 40%"
  }
];

export const TrustBadges = () => {
  return (
    <section className="py-12 md:py-16 bg-secondary/30 border-y">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Warum Umzugscheck.ch?
          </h3>
          <p className="text-muted-foreground">
            Transparent, sicher und kostenlos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
          {badges.map((badge, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-4 rounded-xl bg-white shadow-soft hover:shadow-medium transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-3">
                <badge.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm mb-1">{badge.title}</h4>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
