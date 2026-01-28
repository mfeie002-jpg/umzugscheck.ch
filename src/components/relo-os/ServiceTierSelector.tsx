/**
 * Service Tier Selector Component
 * 
 * Displays the 3 service tiers (Essential, Comfort, Premium)
 * with pricing and features for selection.
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Sparkles, Shield, Truck, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ServiceTier, 
  SERVICE_TIERS, 
  TierPrice, 
  formatPrice 
} from '@/lib/move-pricing-engine';

interface ServiceTierSelectorProps {
  tiers: {
    essential: TierPrice;
    comfort: TierPrice;
    premium: TierPrice;
  };
  selectedTier: ServiceTier;
  onSelect: (tier: ServiceTier) => void;
  className?: string;
}

const tierIcons: Record<ServiceTier, React.ReactNode> = {
  essential: <Truck className="h-6 w-6" />,
  comfort: <Package className="h-6 w-6" />,
  premium: <Sparkles className="h-6 w-6" />,
};

const tierColors: Record<ServiceTier, { bg: string; border: string; accent: string }> = {
  essential: {
    bg: 'bg-muted/30',
    border: 'border-muted',
    accent: 'text-foreground',
  },
  comfort: {
    bg: 'bg-primary/5',
    border: 'border-primary',
    accent: 'text-primary',
  },
  premium: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-500',
    accent: 'text-amber-600 dark:text-amber-400',
  },
};

export const ServiceTierSelector = memo(function ServiceTierSelector({
  tiers,
  selectedTier,
  onSelect,
  className,
}: ServiceTierSelectorProps) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-3', className)}>
      {SERVICE_TIERS.map((tier, index) => {
        const tierPrice = tiers[tier.id];
        const isSelected = selectedTier === tier.id;
        const colors = tierColors[tier.id];
        
        return (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={cn(
                'relative cursor-pointer transition-all duration-200 hover:shadow-lg',
                colors.bg,
                isSelected 
                  ? `ring-2 ring-offset-2 ${colors.border} shadow-lg` 
                  : 'border hover:border-primary/50'
              )}
              onClick={() => onSelect(tier.id)}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground shadow-md">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Beliebteste Wahl
                  </Badge>
                </div>
              )}
              
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    {tierIcons[tier.id]}
                  </div>
                  <div>
                    <h3 className={cn('font-bold text-lg', colors.accent)}>
                      {tier.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  </div>
                </div>
                
                {/* Price */}
                <div className="py-4 border-y">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {formatPrice(tierPrice.total)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fixpreis inkl. MwSt.
                  </p>
                </div>
                
                {/* Features */}
                <ul className="space-y-2">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className={cn(
                        'h-4 w-4 mt-0.5 flex-shrink-0',
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      )} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Selection Button */}
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(tier.id);
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Ausgewählt
                    </>
                  ) : (
                    'Auswählen'
                  )}
                </Button>
                
                {/* Guarantee Badge for Premium */}
                {tier.id === 'premium' && (
                  <div className="flex items-center justify-center gap-2 pt-2 text-xs text-amber-600">
                    <Shield className="h-4 w-4" />
                    <span>Mit Abgabegarantie</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
});

export default ServiceTierSelector;
