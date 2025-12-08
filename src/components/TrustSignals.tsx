import { Shield, Users, Star, Award, CheckCircle2, Zap, TrendingUp } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const stats = [
  {
    icon: Users,
    number: "15'000+",
    label: "Umzüge",
    color: "text-primary"
  },
  {
    icon: Award,
    number: "200+",
    label: "Firmen",
    color: "text-secondary"
  },
  {
    icon: Star,
    number: "4.8",
    label: "Bewertung",
    color: "text-swiss-gold"
  },
  {
    icon: TrendingUp,
    number: "40%",
    label: "Ersparnis",
    color: "text-emerald-600"
  }
];

const quickTrust = [
  { icon: CheckCircle2, text: "Schweizweit" },
  { icon: Zap, text: "24h Offerten" },
  { icon: Shield, text: "Versichert" },
];

export const TrustSignals = memo(() => {
  return (
    <section className="py-4 md:py-6 bg-muted/40 border-y border-border/50 min-h-[120px] md:min-h-[140px]" aria-label="Vertrauenssignale">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Stats Grid - Ultra compact - Fixed height for CLS prevention */}
          <div className="grid grid-cols-4 gap-1.5 md:gap-3">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="text-center p-2 md:p-3 rounded-lg bg-card border border-border/30 hover:border-primary/30 hover:shadow-soft transition-all min-h-[64px] md:min-h-[80px]"
              >
                <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color} mx-auto mb-1`} aria-hidden="true" />
                <div className="text-sm md:text-lg lg:text-xl font-bold text-foreground">
                  {stat.number}
                </div>
                <div className="text-[9px] md:text-[11px] text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Quick Trust Row - More compact */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-5 mt-3 pt-3 border-t border-border/30 text-[11px] md:text-xs text-muted-foreground">
            {quickTrust.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                <item.icon className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" aria-hidden="true" />
                {item.text}
              </span>
            ))}
            <Link 
              to="/umzugsofferten" 
              className="text-primary font-semibold hover:underline underline-offset-2 flex items-center gap-1"
            >
              Jetzt vergleichen
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});

TrustSignals.displayName = 'TrustSignals';
