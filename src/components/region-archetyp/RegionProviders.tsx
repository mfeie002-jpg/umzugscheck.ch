import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Clock, Shield, CheckCircle, ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { MobileCompanyCard } from "./MobileCompanyCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface Provider {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  badges: string[];
  priceLevel: 'Günstig' | 'Mittel' | 'Premium';
  responseTime: string;
}

interface RegionProvidersProps {
  companies: Provider[];
  regionName: string;
  maxItems?: number;
}

const BADGE_CONFIG: Record<string, { icon: typeof Shield; color: string }> = {
  'Geprüft': { icon: CheckCircle, color: 'text-green-600' },
  'Versichert': { icon: Shield, color: 'text-blue-600' },
  'Swiss Made': { icon: Award, color: 'text-red-600' },
  'Video-Analyse': { icon: CheckCircle, color: 'text-purple-600' },
};

const PRICE_COLORS: Record<string, string> = {
  'Günstig': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Mittel': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Premium': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export const RegionProviders = memo(({ companies, regionName, maxItems = 3 }: RegionProvidersProps) => {
  const displayCompanies = companies.slice(0, maxItems);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleRequestQuote = () => {
    navigate("/umzugsofferten");
  };

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Top Umzugsfirmen in {regionName}
          </h2>
          <p className="text-muted-foreground">
            Geprüfte und bestbewertete Partner in Ihrer Region
          </p>
        </motion.div>

        {/* Mobile: Use MobileCompanyCard with larger touch targets */}
        {isMobile ? (
          <div className="space-y-4 max-w-lg mx-auto">
            {displayCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <MobileCompanyCard
                  company={company}
                  onRequestQuote={handleRequestQuote}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Desktop: Grid layout */
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {displayCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{company.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{company.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({company.reviewCount} Bewertungen)
                      </span>
                    </div>
                  </div>
                  <Badge className={PRICE_COLORS[company.priceLevel]}>
                    {company.priceLevel}
                  </Badge>
                </div>

                {/* Response Time */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Antwortzeit: {company.responseTime}</span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {company.badges.slice(0, 3).map((badge) => {
                    const config = BADGE_CONFIG[badge] || { icon: CheckCircle, color: 'text-gray-600' };
                    const Icon = config.icon;
                    return (
                      <span
                        key={badge}
                        className={`inline-flex items-center gap-1 text-xs ${config.color} bg-muted px-2 py-1 rounded-full`}
                      >
                        <Icon className="w-3 h-3" />
                        {badge}
                      </span>
                    );
                  })}
                </div>

                {/* CTA */}
                <Button
                  variant="outline"
                  className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  asChild
                >
                  <Link to={`/firma/${company.id}`}>
                    Offerte ansehen
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="h-14 px-8 text-base touch-manipulation"
            asChild
          >
            <Link to="/umzugsfirmen">
              Alle {companies.length}+ Firmen in {regionName} ansehen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

RegionProviders.displayName = 'RegionProviders';
