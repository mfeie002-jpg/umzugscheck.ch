/**
 * Provider Match Card Component
 * 
 * Displays a matched moving provider with their QWB score,
 * ratings, and estimated pricing.
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  Shield, 
  Award,
  ChevronRight,
  Phone,
  Check,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  ProviderMatch, 
  getMatchScoreLabel, 
  getMatchScoreColor 
} from '@/lib/provider-matching';

interface ProviderMatchCardProps {
  match: ProviderMatch;
  rank: number;
  onSelect?: (providerId: string) => void;
  onRequestQuote?: (providerId: string) => void;
  className?: string;
  isSelected?: boolean;
}

const qualityBadges: Record<string, { label: string; color: string }> = {
  elite: { label: 'Elite', color: 'bg-amber-500 text-white' },
  premium: { label: 'Premium', color: 'bg-purple-500 text-white' },
  verified: { label: 'Verifiziert', color: 'bg-blue-500 text-white' },
  standard: { label: 'Standard', color: 'bg-muted text-muted-foreground' },
};

function getQualityTier(rating: number, verified: boolean): keyof typeof qualityBadges {
  if (rating >= 4.8 && verified) return 'elite';
  if (rating >= 4.5 && verified) return 'premium';
  if (verified) return 'verified';
  return 'standard';
}

export const ProviderMatchCard = memo(function ProviderMatchCard({
  match,
  rank,
  onSelect,
  onRequestQuote,
  className,
  isSelected = false,
}: ProviderMatchCardProps) {
  const { provider, matchScore, estimatedPrice, matchReasons, isRecommended } = match;
  const qualityTier = getQualityTier(provider.rating, provider.verified);
  const qualityBadge = qualityBadges[qualityTier];
  const scoreStyle = getMatchScoreColor(matchScore);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
    >
      <Card 
        className={cn(
          'relative overflow-hidden transition-all duration-200',
          isSelected && 'ring-2 ring-primary shadow-lg',
          isRecommended && 'border-primary/50',
          className
        )}
      >
        {/* Rank Badge */}
        {rank <= 3 && (
          <div className={cn(
            'absolute top-0 left-0 w-8 h-8 flex items-center justify-center text-white font-bold text-sm',
            rank === 1 ? 'bg-amber-500' : rank === 2 ? 'bg-gray-400' : 'bg-amber-700'
          )}>
            {rank}
          </div>
        )}
        
        {/* Recommended Badge */}
        {isRecommended && rank === 1 && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-emerald-500 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              Top Match
            </Badge>
          </div>
        )}
        
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Provider Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="h-16 w-16 border-2 border-muted">
                <AvatarImage src={`/logos/${provider.slug}.png`} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {provider.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Provider Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-lg truncate">{provider.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={qualityBadge.color} variant="secondary">
                      {qualityBadge.label}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{provider.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">
                        ({provider.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Match Score */}
                <div className={cn(
                  'flex flex-col items-center px-3 py-2 rounded-lg',
                  scoreStyle
                )}>
                  <span className="text-2xl font-bold">{matchScore}</span>
                  <span className="text-xs">Match</span>
                </div>
              </div>
              
              {/* Match Reasons */}
              {matchReasons.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {matchReasons.slice(0, 4).map((reason, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      {reason}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Quick Stats */}
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {provider.responseTimeHours <= 1 
                      ? '<1h' 
                      : `${provider.responseTimeHours}h`}
                  </span>
                </div>
                {provider.verified && (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Shield className="h-4 w-4" />
                    <span>Geprüft</span>
                  </div>
                )}
                {provider.certifications.includes('ASTAG') && (
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>ASTAG</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Score Breakdown (collapsed by default) */}
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-4 gap-2 text-xs">
              <ScoreBar label="Qualität" value={match.qualityScore} />
              <ScoreBar label="Preis" value={match.priceScore} />
              <ScoreBar label="Reaktion" value={match.responseScore} />
              <ScoreBar label="Passung" value={match.specializationScore} />
            </div>
          </div>
          
          {/* Price & Actions */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Geschätzt</p>
              <p className="text-lg font-bold">
                CHF {estimatedPrice.min.toLocaleString('de-CH')} - {estimatedPrice.max.toLocaleString('de-CH')}
              </p>
            </div>
            
            <div className="flex gap-2">
              {onRequestQuote && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRequestQuote(provider.id)}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Anrufen
                </Button>
              )}
              {onSelect && (
                <Button
                  size="sm"
                  onClick={() => onSelect(provider.id)}
                  className={isSelected ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Ausgewählt
                    </>
                  ) : (
                    <>
                      Auswählen
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Helper Component

interface ScoreBarProps {
  label: string;
  value: number;
}

const ScoreBar = memo(function ScoreBar({ label, value }: ScoreBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <Progress value={value} className="h-1" />
    </div>
  );
});

export default ProviderMatchCard;
