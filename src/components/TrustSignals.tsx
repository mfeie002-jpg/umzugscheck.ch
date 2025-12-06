import { Shield, Users, Star, Award, CheckCircle2, Clock, Zap } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

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
    label: "Geprüfte Firmen",
    color: "text-secondary"
  },
  {
    icon: Star,
    number: "4.8/5",
    label: "Ø Bewertung",
    color: "text-swiss-gold"
  },
  {
    icon: Shield,
    number: "100%",
    label: "Kostenlos",
    color: "text-primary"
  }
];

const quickTrust = [
  { icon: CheckCircle2, text: "Schweizweit" },
  { icon: Zap, text: "Offerten in 24h" },
  { icon: Shield, text: "Versicherte Partner" },
];

export const TrustSignals = memo(() => {
  return (
    <section className="py-6 md:py-10 bg-muted/30 border-y border-border" aria-label="Vertrauenssignale">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Stats Grid - More compact */}
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-2 md:p-4 rounded-lg bg-card border border-border/40 hover:border-primary/30 transition-colors"
              >
                <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color} mx-auto mb-1.5`} aria-hidden="true" />
                <div className="text-base md:text-xl lg:text-2xl font-bold text-foreground">
                  {stat.number}
                </div>
                <div className="text-[10px] md:text-xs text-muted-foreground font-medium leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Trust Row - More compact */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-4 pt-4 border-t border-border/40 text-xs text-muted-foreground">
            {quickTrust.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                <item.icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {item.text}
              </span>
            ))}
            <Link 
              to="/umzugsofferten" 
              className="text-primary font-medium hover:underline underline-offset-2"
            >
              Jetzt vergleichen →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});

TrustSignals.displayName = 'TrustSignals';
