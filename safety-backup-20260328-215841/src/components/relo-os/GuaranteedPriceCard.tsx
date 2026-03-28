/**
 * Guaranteed Price Card Component
 * 
 * Phase 3: Displays the binding fixed price with
 * Swiss consumer protection compliance.
 */

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Check,
  Clock,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Lock,
  Award,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  GuaranteedQuote,
  PriceGuaranteeResult,
} from '@/lib/guaranteed-price-engine';

interface GuaranteedPriceCardProps {
  result: PriceGuaranteeResult;
  onAccept: () => void;
  onChangeTier: (tier: 'essential' | 'comfort' | 'premium') => void;
  isAccepting?: boolean;
  className?: string;
}

const guaranteeBadges: Record<GuaranteedQuote['guaranteeLevel'], { label: string; color: string; icon: React.ReactNode }> = {
  'swiss_certified': {
    label: 'Swiss Certified',
    color: 'bg-emerald-500 text-white',
    icon: <Award className="h-3 w-3" />,
  },
  'premium': {
    label: 'Premium Garantie',
    color: 'bg-purple-500 text-white',
    icon: <Shield className="h-3 w-3" />,
  },
  'standard': {
    label: 'Standard Garantie',
    color: 'bg-blue-500 text-white',
    icon: <Check className="h-3 w-3" />,
  },
};

export const GuaranteedPriceCard = memo(function GuaranteedPriceCard({
  result,
  onAccept,
  onChangeTier,
  isAccepting = false,
  className,
}: GuaranteedPriceCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { quote, breakdown, savingsVsEstimate, guaranteeExplanation } = result;
  const badge = guaranteeBadges[quote.guaranteeLevel];
  
  const isFixed = quote.guaranteeType === 'binding_fixed';
  const validUntil = new Date(quote.bindingUntil);
  const daysRemaining = Math.ceil((validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-emerald-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-primary" />
            {isFixed ? 'Garantierter Festpreis' : 'Preisschätzung'}
          </CardTitle>
          <Badge className={badge.color}>
            {badge.icon}
            <span className="ml-1">{badge.label}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        {/* Main Price Display */}
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block"
          >
            <span className="text-5xl font-bold text-primary">
              CHF {quote.finalPrice.toLocaleString('de-CH')}
            </span>
          </motion.div>
          
          {isFixed && (
            <div className="mt-2 flex items-center justify-center gap-2 text-emerald-600">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Bindender Fixpreis</span>
            </div>
          )}
          
          {savingsVsEstimate > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Sparen Sie bis zu CHF {savingsVsEstimate.toLocaleString('de-CH')} gegenüber traditionellen Schätzungen
            </p>
          )}
        </div>
        
        {/* Tier Selection Pills */}
        <div className="flex gap-2 justify-center">
          {(['essential', 'comfort', 'premium'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => onChangeTier(tier)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                quote.selectedTier === tier
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
              <span className="ml-2 opacity-75">
                CHF {quote.tierPrices[tier].toLocaleString('de-CH')}
              </span>
            </button>
          ))}
        </div>
        
        {/* Confidence Indicator */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Berechnungsgenauigkeit</span>
            <span className="text-sm font-bold text-primary">
              {Math.round(quote.confidenceLevel * 100)}%
            </span>
          </div>
          <Progress value={quote.confidenceLevel * 100} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {quote.confidenceLevel >= 0.9
              ? 'Höchste Genauigkeit durch AI-Inventaranalyse'
              : quote.confidenceLevel >= 0.75
              ? 'Gute Genauigkeit – Festpreis möglich'
              : 'Video-Scan empfohlen für Festpreis'}
          </p>
        </div>
        
        {/* Validity Timer */}
        <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm">Gültig noch</span>
          </div>
          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
            {daysRemaining} Tage
          </Badge>
        </div>
        
        {/* Insurance & Protection Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <Shield className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Versicherung bis</p>
            <p className="font-bold">CHF {quote.insuranceCoverage.toLocaleString('de-CH')}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <FileCheck className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Schadenschutz</p>
            <p className="font-bold">{quote.damageProtection ? 'Inklusive' : 'Optional'}</p>
          </div>
        </div>
        
        {/* Details Collapsible */}
        <Collapsible open={showDetails} onOpenChange={setShowDetails}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span>Details & Garantiebedingungen</span>
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
              <p className="whitespace-pre-line">{guaranteeExplanation}</p>
              
              <div className="border-t pt-3 mt-3">
                <h4 className="font-medium mb-2">Preisaufschlüsselung</h4>
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Basispreis</span>
                    <span>CHF {breakdown.basePrice.toLocaleString('de-CH')}</span>
                  </div>
                  {breakdown.distanceSurcharge > 0 && (
                    <div className="flex justify-between">
                      <span>Distanz</span>
                      <span>+CHF {breakdown.distanceSurcharge}</span>
                    </div>
                  )}
                  {breakdown.floorSurcharge > 0 && (
                    <div className="flex justify-between">
                      <span>Stockwerk</span>
                      <span>+CHF {breakdown.floorSurcharge}</span>
                    </div>
                  )}
                  {breakdown.seasonalAdjustment !== 0 && (
                    <div className="flex justify-between">
                      <span>Saison</span>
                      <span className={breakdown.seasonalAdjustment > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                        {breakdown.seasonalAdjustment > 0 ? '+' : ''}CHF {breakdown.seasonalAdjustment}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-1 font-medium text-foreground">
                    <span>Total</span>
                    <span>CHF {breakdown.total.toLocaleString('de-CH')}</span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Accept Button */}
        <Button
          size="lg"
          className="w-full"
          onClick={onAccept}
          disabled={isAccepting}
        >
          {isAccepting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="mr-2"
              >
                <Clock className="h-4 w-4" />
              </motion.div>
              Wird verarbeitet...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Angebot annehmen & buchen
            </>
          )}
        </Button>
        
        {/* Not fixed warning */}
        {!isFixed && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg text-sm">
            <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-700 dark:text-yellow-400">
              Für einen verbindlichen Festpreis empfehlen wir einen Video-Scan Ihrer Wohnung.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default GuaranteedPriceCard;
