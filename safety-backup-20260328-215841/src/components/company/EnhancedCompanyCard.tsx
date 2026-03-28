/**
 * EnhancedCompanyCard - Premium company card with Capacity + Quality badges
 * Unified card component for all company listings
 */

import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, ArrowRight, Verified, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFlowPath } from '@/hooks/useUnifiedAB';
import { QualityBadgeIndicator } from './QualityBadgeIndicator';
import { CapacityBadge } from '@/components/capacity/CapacityBadge';
import { trackProfileView } from '@/lib/monetization-events';

interface EnhancedCompanyCardProps {
  id: string;
  name: string;
  logo?: string;
  image?: string;
  rating: number;
  reviewCount: number;
  priceFrom?: string;
  priceLevel?: 'günstig' | 'fair' | 'premium';
  regions?: string[];
  description?: string;
  badges?: string[];
  specialOffer?: string;
  isSponsored?: boolean;
  isVerified?: boolean;
  responseTimeHours?: number;
  successRate?: number;
  profileCompleteness?: number;
  yearsInBusiness?: number;
  // Capacity data
  availableSlots?: number;
  totalSlots?: number;
  // Animation
  delay?: number;
  variant?: 'default' | 'compact' | 'featured';
}

export const EnhancedCompanyCard = memo(function EnhancedCompanyCard({
  id,
  name,
  logo,
  image,
  rating,
  reviewCount,
  priceFrom,
  priceLevel,
  regions = [],
  description,
  badges = [],
  specialOffer,
  isSponsored = false,
  isVerified = false,
  responseTimeHours = 24,
  successRate = 85,
  profileCompleteness = 70,
  yearsInBusiness = 3,
  availableSlots,
  totalSlots = 10,
  delay = 0,
  variant = 'default',
}: EnhancedCompanyCardProps) {
  const flowPath = useFlowPath();
  
  // Provider metrics for quality badge
  const providerMetrics = {
    rating,
    reviewCount,
    isVerified,
    responseTimeHours,
    successRate,
    profileCompleteness,
    yearsInBusiness,
  };

  const priceLevelColors = {
    günstig: 'bg-green-100 text-green-700 border-green-200',
    fair: 'bg-blue-100 text-blue-700 border-blue-200',
    premium: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
      >
        <Card className="overflow-hidden hover:shadow-md transition-all group">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                {logo ? (
                  <img src={logo} alt={name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-2xl">🏢</span>
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{name}</h3>
                  <QualityBadgeIndicator provider={providerMetrics} size="sm" />
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({reviewCount})</span>
                  </div>
                  {availableSlots !== undefined && (
                    <CapacityBadge 
                      availableSlots={availableSlots} 
                      totalSlots={totalSlots}
                      size="sm"
                    />
                  )}
                </div>
              </div>
              
              {/* CTA */}
              <Link to={flowPath}>
                <Button size="sm" className="gap-1">
                  Offerte
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 h-full group ${
        isSponsored ? 'border-2 border-primary/30 bg-primary/5' : ''
      }`}>
        {/* Image Section */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
          {image ? (
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {logo || '🏢'}
            </div>
          )}
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isSponsored && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                Gesponsert
              </Badge>
            )}
            {specialOffer && (
              <Badge className="bg-green-600 text-white text-xs">
                🎉 Angebot
              </Badge>
            )}
          </div>
          
          {/* Right Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {badges.slice(0, 2).map((badge, idx) => (
              <Badge 
                key={idx}
                className="bg-white/95 text-foreground shadow-md text-xs font-medium backdrop-blur-sm"
              >
                {badge}
              </Badge>
            ))}
          </div>

          {/* Capacity Badge - Bottom */}
          {availableSlots !== undefined && (
            <div className="absolute bottom-3 right-3">
              <CapacityBadge 
                availableSlots={availableSlots} 
                totalSlots={totalSlots}
                size="md"
              />
            </div>
          )}
        </div>

        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-foreground truncate">{name}</h3>
                {isVerified && (
                  <Verified className="h-5 w-5 text-blue-500 flex-shrink-0" />
                )}
              </div>
              {regions.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{regions.slice(0, 2).join(', ')}</span>
                </div>
              )}
            </div>
            <QualityBadgeIndicator provider={providerMetrics} size="md" />
          </div>

          {/* Rating & Price Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-bold">{rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({reviewCount} Bewertungen)
              </span>
            </div>
            {priceLevel && (
              <Badge 
                variant="outline" 
                className={`text-xs ${priceLevelColors[priceLevel]}`}
              >
                {priceLevel}
              </Badge>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}

          {/* Special Offer */}
          {specialOffer && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                🎉 {specialOffer}
              </p>
            </div>
          )}

          {/* Price */}
          {priceFrom && (
            <div className="py-2 border-t border-border">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground">Ab</span>
                <span className="text-2xl font-bold text-accent">{priceFrom}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link to={`/umzugsfirmen/${id}`} className="flex-1">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => trackProfileView(id)}
              >
                Firma ansehen
              </Button>
            </Link>
            <Link to={flowPath} className="flex-1">
              <Button className="w-full gap-2">
                Offerte
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default EnhancedCompanyCard;
