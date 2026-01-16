/**
 * Optimized Company Card Component
 * - Mobile-first design with 48px touch targets
 * - Proper loading states
 * - Conversion-optimized CTAs
 */
import { memo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Phone, ArrowRight, Shield, Clock, BadgeCheck, Award, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { trackCompanyView, trackCompanyCall, trackCompanyQuoteRequest } from "@/lib/conversion-events";

interface CompanyCardOptimizedProps {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  priceLevel: 'günstig' | 'fair' | 'premium';
  priceRange?: { min: number; max: number };
  city?: string;
  regions?: string[];
  services?: string[];
  badges?: string[];
  isVerified?: boolean;
  isSponsored?: boolean;
  responseTime?: string;
  phone?: string;
  rank?: number;
  onRequestQuote?: () => void;
  className?: string;
}

const priceLevelConfig = {
  günstig: { label: 'Günstig', color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' },
  fair: { label: 'Fair', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' },
  premium: { label: 'Premium', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' }
};

export const CompanyCardOptimized = memo(function CompanyCardOptimized({
  id,
  name,
  slug,
  logo,
  rating,
  reviewCount,
  priceLevel,
  priceRange,
  city,
  regions,
  services,
  badges,
  isVerified,
  isSponsored,
  responseTime,
  phone,
  rank,
  onRequestQuote,
  className
}: CompanyCardOptimizedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const priceConfig = priceLevelConfig[priceLevel] || priceLevelConfig.fair;
  
  const handleViewProfile = useCallback(() => {
    trackCompanyView(id, name, window.location.pathname, city);
  }, [id, name, city]);
  
  const handleCall = useCallback(() => {
    trackCompanyCall(id, name, window.location.pathname);
  }, [id, name]);
  
  const handleRequestQuote = useCallback(() => {
    trackCompanyQuoteRequest(id, name, window.location.pathname, city);
    onRequestQuote?.();
  }, [id, name, city, onRequestQuote]);
  
  return (
    <Card className={cn(
      "relative p-4 sm:p-5 transition-all duration-200 hover:shadow-md",
      isSponsored && "border-primary/30 bg-primary/[0.02]",
      className
    )}>
      {/* Sponsored Badge */}
      {isSponsored && (
        <Badge variant="outline" className="absolute -top-2 right-4 text-[10px] bg-background border-primary/30 text-primary">
          Gesponsert
        </Badge>
      )}
      
      {/* Main Content */}
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Rank & Logo */}
        <div className="flex flex-col items-center gap-2">
          {rank && (
            <span className="text-xs font-bold text-muted-foreground">#{rank}</span>
          )}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
            {logo ? (
              <img 
                src={logo} 
                alt={name} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">
                {name.charAt(0)}
              </span>
            )}
          </div>
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name & Badges */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-foreground truncate flex items-center gap-1.5">
                {name}
                {isVerified && (
                  <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </h3>
              
              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({reviewCount} Bewertungen)
                </span>
              </div>
            </div>
            
            {/* Price Level Badge */}
            <Badge variant="outline" className={cn("text-xs shrink-0", priceConfig.color)}>
              {priceConfig.label}
            </Badge>
          </div>
          
          {/* Quick Info Row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
            {city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {city}
              </span>
            )}
            {responseTime && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {responseTime}
              </span>
            )}
            {isVerified && (
              <span className="inline-flex items-center gap-1 text-primary">
                <Shield className="w-3 h-3" />
                Geprüft
              </span>
            )}
          </div>
          
          {/* Price Range */}
          {priceRange && (
            <p className="text-sm font-medium text-foreground mt-2">
              CHF {priceRange.min.toLocaleString()} – {priceRange.max.toLocaleString()}
            </p>
          )}
        </div>
      </div>
      
      {/* Expandable Details */}
      {(services?.length || badges?.length || regions?.length) && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-3 w-full justify-center py-2 touch-manipulation"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Weniger' : 'Mehr Details'}
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-1 space-y-2 border-t">
                {/* Services */}
                {services && services.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {services.slice(0, 5).map(service => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Regions */}
                {regions && regions.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Aktiv in: {regions.slice(0, 4).join(', ')}
                    {regions.length > 4 && ` +${regions.length - 4} mehr`}
                  </p>
                )}
                
                {/* Badges/Certifications */}
                {badges && badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {badges.map(badge => (
                      <span key={badge} className="inline-flex items-center gap-1 text-xs text-primary">
                        <Award className="w-3 h-3" />
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </>
      )}
      
      {/* CTAs - Mobile optimized with 48px touch targets */}
      <div className="flex gap-2 mt-4">
        <Button
          onClick={handleRequestQuote}
          className="flex-1 h-12 sm:h-11 text-sm font-semibold active:scale-[0.98] transition-transform touch-manipulation"
        >
          Offerte anfragen
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
        
        {phone && (
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-12 w-12 sm:h-11 sm:w-11 flex-shrink-0 active:scale-[0.98] transition-transform touch-manipulation"
            onClick={handleCall}
          >
            <a href={`tel:${phone}`} aria-label={`${name} anrufen`}>
              <Phone className="w-5 h-5" />
            </a>
          </Button>
        )}
        
        {slug && (
          <Button
            variant="ghost"
            asChild
            className="hidden sm:flex h-11 px-4 text-sm"
            onClick={handleViewProfile}
          >
            <Link to={`/firma/${slug}`}>
              Profil
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
});

// Loading skeleton
export const CompanyCardSkeleton = memo(function CompanyCardSkeleton() {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton className="flex-1 h-11" />
        <Skeleton className="w-11 h-11" />
      </div>
    </Card>
  );
});

export default CompanyCardOptimized;
