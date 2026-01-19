/**
 * GoldenFlowResultTeaser - Blurred preview of matching companies
 * 
 * Phase 2.1: Result Teasing (Glimp Method)
 * Shows blurred results before contact form to increase conversion
 */

import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle, Lock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MatchedCompany {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  priceLevel: 'günstig' | 'fair' | 'premium';
  distance: string;
  matchScore: number;
}

interface GoldenFlowResultTeaserProps {
  matchedCompanies?: number;
  onUnlock?: () => void;
  fromCity?: string;
  toCity?: string;
  className?: string;
}

// Generate demo companies based on region
const generateDemoCompanies = (fromCity?: string): MatchedCompany[] => [
  { id: '1', name: `Express Umzüge ${fromCity || 'Zürich'}`, rating: 4.9, reviewCount: 342, priceLevel: 'fair', distance: '2.3 km', matchScore: 98 },
  { id: '2', name: 'Sorglos Umzug AG', rating: 4.8, reviewCount: 189, priceLevel: 'günstig', distance: '4.1 km', matchScore: 95 },
  { id: '3', name: 'Premium Move GmbH', rating: 5.0, reviewCount: 87, priceLevel: 'premium', distance: '5.8 km', matchScore: 92 },
];

export function GoldenFlowResultTeaser({ 
  matchedCompanies = 3,
  onUnlock,
  fromCity,
  toCity,
  className 
}: GoldenFlowResultTeaserProps) {
  const companies = generateDemoCompanies(fromCity).slice(0, matchedCompanies);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("relative", className)}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-3"
        >
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">{companies.length} passende Firmen gefunden!</span>
        </motion.div>
        {fromCity && toCity && (
          <p className="text-xs text-muted-foreground">
            Für Ihren Umzug von {fromCity} nach {toCity}
          </p>
        )}
      </div>
      
      {/* Blurred company cards */}
      <div className="relative">
        {/* Blur overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/60 to-background backdrop-blur-[2px] rounded-xl" />
        
        {/* Company cards (partially visible) */}
        <div className="space-y-3 pb-16">
          {companies.slice(0, 3).map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className={cn(
                "p-4 rounded-xl border bg-card",
                index > 0 && "blur-[1px]"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{company.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {company.rating}
                      </span>
                      <span>({company.reviewCount} Bewertungen)</span>
                    </div>
                  </div>
                </div>
                
                {/* Match score */}
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{company.matchScore}%</div>
                  <div className="text-[10px] text-muted-foreground">Match</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-3 text-xs">
                <span className={cn(
                  "px-2 py-0.5 rounded-full",
                  company.priceLevel === 'günstig' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                  company.priceLevel === 'fair' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                  company.priceLevel === 'premium' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                )}>
                  {company.priceLevel}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {company.distance}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Unlock CTA overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 text-center">
          {onUnlock ? (
            <Button
              onClick={onUnlock}
              size="lg"
              className="w-full max-w-sm mx-auto h-14 text-lg font-bold bg-gradient-to-r from-secondary to-secondary/90 shadow-xl hover:shadow-2xl transition-all"
            >
              <Eye className="w-5 h-5 mr-2" />
              Jetzt Offerten ansehen
            </Button>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary-foreground">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Formular ausfüllen = Offerten erhalten</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Nur noch Kontaktdaten eingeben
          </p>
        </div>
      </div>
    </motion.div>
  );
}
