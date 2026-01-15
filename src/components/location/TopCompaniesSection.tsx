/**
 * TOP COMPANIES SECTION
 * 
 * Displays top-rated moving companies with badges
 * Includes "How we rank" transparency box
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Star, Shield, Clock, Award, TrendingUp, 
  CheckCircle, ArrowRight, BadgeCheck, Flame, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopCompany {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  priceLevel: 'Günstig' | 'Mittel' | 'Premium';
  badges: string[];
}

interface TopCompaniesSectionProps {
  companies: TopCompany[];
  locationName: string;
  variant?: 'canton' | 'city';
  className?: string;
}

const badgeConfig: Record<string, { icon: typeof Star; label: string; color: string }> = {
  popular: { icon: Flame, label: 'Beliebt', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  bestPrice: { icon: TrendingUp, label: 'Bestpreis', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  premium: { icon: Crown, label: 'Premium', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  verified: { icon: BadgeCheck, label: 'Geprüft', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  topRated: { icon: Star, label: 'Top bewertet', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
};

const priceLevelColors: Record<string, string> = {
  'Günstig': 'text-green-600',
  'Mittel': 'text-blue-600',
  'Premium': 'text-purple-600',
};

export const TopCompaniesSection = memo(({
  companies,
  locationName,
  variant = 'canton',
  className,
}: TopCompaniesSectionProps) => {
  
  const scrollToOfferten = () => {
    const element = document.getElementById('offerten');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="firmen" className={cn("py-16 scroll-mt-20", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Top Anbieter
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Top Umzugsfirmen {variant === 'canton' ? 'im Kanton' : 'in'} {locationName}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Diese Firmen gehören zu den bestbewerteten Anbietern in Ihrer Region.
            </p>
          </div>

          {/* Company Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {companies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{company.name}</h3>
                    <p className={cn("text-sm font-medium", priceLevelColors[company.priceLevel])}>
                      Preis: {company.priceLevel}
                    </p>
                  </div>
                  
                  {/* Rating */}
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-lg">{company.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {company.reviewCount} Bewertungen
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {company.badges.map((badge) => {
                    const config = badgeConfig[badge];
                    if (!config) return null;
                    const BadgeIcon = config.icon;
                    
                    return (
                      <span
                        key={badge}
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                          config.color
                        )}
                      >
                        <BadgeIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* How We Rank Box */}
          <div className="bg-muted/50 rounded-2xl p-6 border border-border mb-8">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              So ranken wir Umzugsfirmen
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { icon: BadgeCheck, label: 'Geprüft', desc: 'Dokumente & Versicherung verifiziert' },
                { icon: Star, label: 'Bewertungen', desc: 'Qualität & Kundenzufriedenheit' },
                { icon: Clock, label: 'Verfügbarkeit', desc: 'Reaktionszeit & Terminflexibilität' },
                { icon: TrendingUp, label: 'Preis-Leistung', desc: 'Faires Verhältnis garantiert' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={scrollToOfferten}
              className="h-14 px-8 text-lg"
            >
              Diese Firmen vergleichen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

TopCompaniesSection.displayName = 'TopCompaniesSection';
