/**
 * PRICE GUARANTEE BADGE
 * 
 * Trust-building badge showing price match guarantee.
 */

import { motion } from 'framer-motion';
import { Shield, BadgeCheck, Percent } from 'lucide-react';

interface PriceGuaranteeBadgeProps {
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export const PriceGuaranteeBadge = ({ 
  variant = 'default',
  className = '' 
}: PriceGuaranteeBadgeProps) => {
  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-1.5 text-sm text-green-600 font-medium ${className}`}>
        <Shield className="h-4 w-4" />
        <span>Preisgarantie</span>
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-3 py-1.5 ${className}`}
      >
        <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
        <span className="text-sm font-medium text-green-700 dark:text-green-300">
          Bestpreis-Garantie
        </span>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center">
          <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h4 className="font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
            Bestpreis-Garantie
            <BadgeCheck className="h-4 w-4" />
          </h4>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            Finden Sie woanders einen günstigeren Preis, erstatten wir die Differenz + 10% Bonus.
          </p>
          
          {/* Trust points */}
          <div className="flex flex-wrap gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
              <Percent className="h-3.5 w-3.5" />
              <span>Bis 40% sparen</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
              <BadgeCheck className="h-3.5 w-3.5" />
              <span>Geprüfte Firmen</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
