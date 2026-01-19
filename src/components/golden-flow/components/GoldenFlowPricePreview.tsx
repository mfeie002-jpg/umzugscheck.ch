/**
 * GoldenFlowPricePreview - Live price estimation display
 */

import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GoldenFlowPriceEstimate } from '../types';

interface GoldenFlowPricePreviewProps {
  estimate: GoldenFlowPriceEstimate | null;
  className?: string;
  variant?: 'full' | 'compact' | 'inline';
}

const formatCHF = (amount: number): string => {
  return `CHF ${amount.toLocaleString('de-CH')}`;
};

export function GoldenFlowPricePreview({ 
  estimate, 
  className, 
  variant = 'full' 
}: GoldenFlowPricePreviewProps) {
  if (!estimate) return null;
  
  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex items-center gap-2", className)}
      >
        <span className="text-sm text-muted-foreground">Geschätzt:</span>
        <span className="font-semibold text-primary">
          {formatCHF(estimate.min)} – {formatCHF(estimate.max)}
        </span>
      </motion.div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "bg-primary/5 rounded-lg p-3 border border-primary/20",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Preis-Schätzung</p>
            <p className="text-lg font-bold text-primary">
              {formatCHF(estimate.min)} – {formatCHF(estimate.max)}
            </p>
          </div>
          {estimate.savings > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              <TrendingDown className="h-3 w-3 mr-1" />
              Sparen
            </Badge>
          )}
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">Ihre Preis-Schätzung</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-primary">
            {formatCHF(estimate.min)} – {formatCHF(estimate.max)}
          </p>
        </div>
        <div className="text-right">
          {estimate.savings > 0 && (
            <>
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                <TrendingDown className="h-3 w-3 mr-1" />
                Bis {formatCHF(estimate.savings)} sparen
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">vs. Marktdurchschnitt</p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
