import { Shield, Lock, Award, MapPin, Clock, BadgeCheck } from "lucide-react";
import { memo } from "react";

const badges = [
  {
    icon: Shield,
    title: "Geprüfte Firmen",
    description: "Alle Partner versichert & zertifiziert"
  },
  {
    icon: Lock,
    title: "Sichere Daten",
    description: "SSL-verschlüsselt & DSGVO-konform"
  },
  {
    icon: BadgeCheck,
    title: "Echte Bewertungen",
    description: "Nur verifizierte Kundenmeinungen"
  },
  {
    icon: MapPin,
    title: "Schweizweit",
    description: "Service in allen 26 Kantonen"
  },
  {
    icon: Clock,
    title: "Schnelle Offerten",
    description: "Angebote in 24-48 Stunden"
  },
  {
    icon: Award,
    title: "Bis 40% sparen",
    description: "Durch direkten Vergleich"
  }
];

export const TrustBadges = memo(() => {
  return (
    <section className="py-10 md:py-14 bg-muted/30 border-y border-border" aria-label="Warum Umzugscheck.ch">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-xl md:text-2xl font-bold mb-1.5 text-foreground">
            Warum Umzugscheck.ch?
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            Transparent, sicher und kostenlos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {badges.map((badge, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-4 rounded-xl bg-card shadow-soft hover:shadow-medium transition-shadow border border-border/50"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2.5">
                <badge.icon className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h4 className="font-semibold text-xs md:text-sm mb-0.5 text-foreground">{badge.title}</h4>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-tight">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

TrustBadges.displayName = 'TrustBadges';
