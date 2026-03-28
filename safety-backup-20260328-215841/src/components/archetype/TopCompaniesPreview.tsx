/**
 * TOP COMPANIES PREVIEW
 * 
 * Display 3-6 top-rated companies with badges
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, BadgeCheck, TrendingUp, Award, Zap, ThumbsUp, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { TopCompany } from "@/data/archetypeConfig";
import { cn } from "@/lib/utils";

// Badge config
const BADGE_CONFIG: Record<string, { label: string; icon: any; className: string }> = {
  popular: { label: 'Beliebt', icon: TrendingUp, className: 'bg-blue-100 text-blue-700' },
  bestPrice: { label: 'Bestpreis', icon: Zap, className: 'bg-green-100 text-green-700' },
  premium: { label: 'Premium', icon: Award, className: 'bg-purple-100 text-purple-700' },
  verified: { label: 'Geprüft', icon: BadgeCheck, className: 'bg-gray-100 text-gray-700' },
  topRated: { label: 'Top bewertet', icon: ThumbsUp, className: 'bg-yellow-100 text-yellow-700' },
};

interface TopCompaniesPreviewProps {
  companies: TopCompany[];
  placeName: string;
  placeKind: 'canton' | 'city';
}

export const TopCompaniesPreview = memo(({ 
  companies, 
  placeName,
  placeKind,
}: TopCompaniesPreviewProps) => {
  const locationPrefix = placeKind === 'canton' ? 'im Kanton' : 'in';
  
  const scrollToForm = () => {
    const el = document.getElementById('offerten');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="firmen" className="py-16 md:py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Top Umzugsfirmen {locationPrefix} {placeName}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unsere Partner mit den besten Bewertungen
          </p>
        </motion.div>

        {/* Companies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-8">
          {companies.slice(0, 4).map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {company.badges.slice(0, 2).map((badge) => {
                  const config = BADGE_CONFIG[badge];
                  if (!config) return null;
                  const Icon = config.icon;
                  return (
                    <span 
                      key={badge}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                        config.className
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  );
                })}
              </div>

              {/* Company Name */}
              <h3 className="font-semibold text-lg mb-2">{company.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{company.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({company.reviewCount} Bewertungen)
                </span>
              </div>

              {/* Price Level */}
              <div className="text-sm text-muted-foreground mb-3">
                Preislevel: <span className="font-medium">{company.priceLevel}</span>
              </div>

              {/* Pitch */}
              {company.shortPitch && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {company.shortPitch}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* How We Rank Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-8"
        >
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl text-sm">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Wie wir ranken:</strong>
              <span className="text-muted-foreground ml-1">
                Geprüfte Dokumente & Versicherung • Kundenbewertungen • 
                Verfügbarkeit • Preis-Leistungs-Verhältnis
              </span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" className="h-12 px-8" onClick={scrollToForm}>
            Diese Firmen vergleichen
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

TopCompaniesPreview.displayName = 'TopCompaniesPreview';
