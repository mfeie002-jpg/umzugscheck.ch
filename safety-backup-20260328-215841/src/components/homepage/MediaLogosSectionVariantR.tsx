/**
 * Social Proof Variant R (V18): Local Trust Signals
 * 
 * Region-specific trust with "Top bewertet", "Lokal" badges:
 * Based on UX research highlighting the power of local relevance
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Award, BadgeCheck, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

const LOCAL_COMPANIES = [
  {
    name: 'Swiss Move Zürich',
    region: 'Zürich',
    rating: 4.9,
    reviews: 203,
    badges: ['Top bewertet', 'Lokal'],
    responseTime: '< 2h'
  },
  {
    name: 'Premium Move Basel',
    region: 'Basel',
    rating: 4.8,
    reviews: 156,
    badges: ['Geprüft', 'Versichert'],
    responseTime: '< 4h'
  },
  {
    name: 'Family Move Bern',
    region: 'Bern',
    rating: 4.9,
    reviews: 178,
    badges: ['Top bewertet', 'ASTAG'],
    responseTime: '< 3h'
  },
];

export const MediaLogosSectionVariantR = memo(function MediaLogosSectionVariantR({ className }: Props) {
  return (
    <section className={cn("py-10 bg-muted/30", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm text-primary mb-3">
            <MapPin className="w-4 h-4" />
            <span>Lokale Partner in Ihrer Region</span>
          </div>
          <h3 className="text-xl font-bold">Top bewertete Umzugsfirmen in Ihrer Nähe</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Alle Partner sind geprüft, versichert und in Ihrer Region aktiv
          </p>
        </div>
        
        {/* Company Cards */}
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {LOCAL_COMPANIES.map((company, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-background rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Company Header */}
              <div className="p-4 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{company.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" />
                      {company.region}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{company.rating}</span>
                  </div>
                </div>
              </div>
              
              {/* Badges */}
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {company.badges.map((badge, bidx) => (
                    <span
                      key={bidx}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                        badge === 'Top bewertet' 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : badge === 'Lokal'
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {badge === 'Top bewertet' && <Award className="w-2.5 h-2.5" />}
                      {badge === 'Lokal' && <MapPin className="w-2.5 h-2.5" />}
                      {badge === 'Geprüft' && <BadgeCheck className="w-2.5 h-2.5" />}
                      {badge}
                    </span>
                  ))}
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{company.reviews} Bewertungen</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Antwort {company.responseTime}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center mt-8">
          <a 
            href="/umzugsfirmen" 
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
          >
            Alle 200+ Partner ansehen
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantR;
