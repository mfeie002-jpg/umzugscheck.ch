import { Shield, Lock, Award, MapPin, Clock, BadgeCheck, LucideIcon } from "lucide-react";
import { memo } from "react";
import { cn } from "@/lib/utils";

interface TrustBadge {
  icon: LucideIcon;
  title: string;
  description: string;
}

const defaultBadges: TrustBadge[] = [
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

interface TrustBadgesProps {
  badges?: TrustBadge[];
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
  columns?: 2 | 3 | 4 | 6;
}

export const TrustBadges = memo(({
  badges = defaultBadges,
  title = "Warum Umzugscheck.ch?",
  subtitle = "Transparent, sicher und kostenlos",
  variant = 'default',
  className,
  columns = 6
}: TrustBadgesProps) => {
  if (variant === 'inline') {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-4 sm:gap-6", className)}>
        {badges.slice(0, 4).map((badge, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <badge.icon className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="font-medium text-foreground">{badge.title}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
        {badges.slice(0, 4).map((badge, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-sm"
          >
            <badge.icon className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="font-medium">{badge.title}</span>
          </div>
        ))}
      </div>
    );
  }

  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  };

  return (
    <section 
      className={cn("py-10 md:py-14 bg-muted/30 border-y border-border", className)} 
      aria-label="Warum Umzugscheck.ch"
    >
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h3 className="text-xl md:text-2xl font-bold mb-1.5 text-foreground">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm md:text-base text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={cn(
          "grid gap-4 max-w-6xl mx-auto",
          columnClasses[columns]
        )}>
          {badges.map((badge, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-4 rounded-xl bg-card shadow-soft hover:shadow-medium transition-shadow border border-border/50"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2.5">
                <badge.icon className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h4 className="font-semibold text-xs md:text-sm mb-0.5 text-foreground">
                {badge.title}
              </h4>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-tight">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

TrustBadges.displayName = 'TrustBadges';
