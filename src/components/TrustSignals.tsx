import { Shield, Users, Star, Award, CheckCircle2, Clock } from "lucide-react";
import { memo } from "react";

const stats = [
  {
    icon: Users,
    number: "15'000+",
    label: "Erfolgreiche Umzüge",
    color: "text-primary"
  },
  {
    icon: Award,
    number: "200+",
    label: "Geprüfte Umzugsfirmen",
    color: "text-secondary"
  },
  {
    icon: Star,
    number: "4.8/5",
    label: "Ø Kundenbewertung",
    color: "text-swiss-gold"
  },
  {
    icon: Shield,
    number: "100%",
    label: "Kostenlos & unverbindlich",
    color: "text-primary"
  }
];

export const TrustSignals = memo(() => {
  return (
    <section className="py-8 md:py-12 bg-muted/30 border-y border-border" aria-label="Vertrauenssignale">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-4 rounded-xl bg-card border border-border/50 hover:shadow-soft transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted mb-3">
                  <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} aria-hidden="true" />
                </div>
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-0.5">
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Trust Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-6 pt-6 border-t border-border/50 text-xs md:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
              Schweizweit verfügbar
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              Offerten in 24-48h
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
              Versicherte Partner
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});

TrustSignals.displayName = 'TrustSignals';
