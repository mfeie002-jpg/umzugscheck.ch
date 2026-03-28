/**
 * ProviderMatchCard - Displays a matched provider with QWB score
 */

import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Clock, 
  Shield, 
  CheckCircle,
  Award,
  Crown,
  Leaf,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProviderMatch, ProviderBadge } from '@/lib/provider-booking';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// ============================================================================
// TYPES
// ============================================================================

interface ProviderMatchCardProps {
  provider: ProviderMatch;
  isSelected?: boolean;
  onSelect?: (provider: ProviderMatch) => void;
  showDetails?: boolean;
  rank?: number;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const BadgeIcon = memo(function BadgeIcon({ 
  type, 
  className 
}: { 
  type: ProviderBadge['type']; 
  className?: string;
}) {
  switch (type) {
    case 'elite':
      return <Crown className={cn('text-purple-600', className)} />;
    case 'premium':
      return <Award className={cn('text-amber-600', className)} />;
    case 'verified':
      return <Shield className={cn('text-blue-600', className)} />;
    case 'eco':
      return <Leaf className={cn('text-green-600', className)} />;
    case 'specialist':
      return <Wrench className={cn('text-slate-600', className)} />;
    default:
      return <CheckCircle className={cn('text-muted-foreground', className)} />;
  }
});

const QWBScoreDisplay = memo(function QWBScoreDisplay({
  score,
  components,
}: {
  score: number;
  components: {
    quality: number;
    price: number;
    response: number;
    specialization: number;
  };
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">{score}</div>
            <div className="text-xs text-muted-foreground">QWB</div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-48">
          <div className="space-y-2">
            <p className="font-semibold text-sm">Quality-Weighted Bidding</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Qualität (40%)</span>
                <span>{components.quality}</span>
              </div>
              <Progress value={components.quality} className="h-1" />
              
              <div className="flex justify-between text-xs">
                <span>Preis (30%)</span>
                <span>{components.price}</span>
              </div>
              <Progress value={components.price} className="h-1" />
              
              <div className="flex justify-between text-xs">
                <span>Reaktion (20%)</span>
                <span>{components.response}</span>
              </div>
              <Progress value={components.response} className="h-1" />
              
              <div className="flex justify-between text-xs">
                <span>Match (10%)</span>
                <span>{components.specialization}</span>
              </div>
              <Progress value={components.specialization} className="h-1" />
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ProviderMatchCard = memo(function ProviderMatchCard({
  provider,
  isSelected = false,
  onSelect,
  showDetails = true,
  rank,
}: ProviderMatchCardProps) {
  const isTopRanked = rank === 1;
  
  return (
    <Card 
      className={cn(
        'transition-all cursor-pointer hover:shadow-md',
        isSelected && 'ring-2 ring-primary',
        isTopRanked && 'border-primary'
      )}
      onClick={() => onSelect?.(provider)}
    >
      {isTopRanked && (
        <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 text-center">
          ⭐ Beste Übereinstimmung
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Logo & Score */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {provider.logo ? (
                <img 
                  src={provider.logo} 
                  alt={provider.providerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {provider.providerName.charAt(0)}
                </span>
              )}
            </div>
            <QWBScoreDisplay 
              score={provider.qwbScore}
              components={{
                quality: provider.qualityScore,
                price: provider.priceScore,
                response: provider.responseScore,
                specialization: provider.specializationScore,
              }}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg">{provider.providerName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{provider.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({provider.reviewCount} Bewertungen)
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold">
                  CHF {provider.bidAmount.toLocaleString('de-CH')}
                </div>
                <div className="text-xs text-muted-foreground">
                  ca. {provider.estimatedDuration}h
                </div>
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {provider.badges.map((badge, idx) => (
                <Badge 
                  key={idx}
                  variant="outline" 
                  className="gap-1 text-xs"
                >
                  <BadgeIcon type={badge.type} className="h-3 w-3" />
                  {badge.label}
                </Badge>
              ))}
            </div>
            
            {showDetails && (
              <>
                {/* Match Reasons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {provider.matchReasons.map((reason, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                    >
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      {reason}
                    </span>
                  ))}
                </div>
                
                {/* Available Slots Preview */}
                <div className="mt-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {provider.availableSlots.length} Termine verfügbar
                  </span>
                  {provider.availableSlots.some(s => s.priceModifier < 1) && (
                    <Badge variant="secondary" className="text-xs">
                      Rabatt möglich
                    </Badge>
                  )}
                </div>
                
                {/* Insurance & Certs */}
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    CHF {(provider.insuranceCoverage / 1000).toFixed(0)}k versichert
                  </span>
                  <span>
                    {provider.certifications.join(' · ')}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Action Button */}
        {onSelect && (
          <div className="mt-4 pt-3 border-t">
            <Button 
              className="w-full"
              variant={isSelected ? 'default' : 'outline'}
            >
              {isSelected ? 'Ausgewählt' : 'Diesen Anbieter wählen'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default ProviderMatchCard;
