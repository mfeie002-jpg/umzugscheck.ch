/**
 * Micro Trust CTA V6 - CTA buttons with integrated trust signals
 * Addresses: "Vertrauenssiegel am CTA-Button"
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Shield, CheckCircle2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface MicroTrustCTAProps {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'lg';
  showTrustBadges?: boolean;
  className?: string;
}

export const MicroTrustCTA = memo(function MicroTrustCTA({
  variant = 'primary',
  size = 'default',
  showTrustBadges = true,
  className = '',
}: MicroTrustCTAProps) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Main CTA Button */}
      <Link to="/umzugsofferten" className="w-full max-w-sm">
        <Button 
          size={size === 'lg' ? 'lg' : 'default'}
          className={`w-full gap-2 shadow-lg ${
            size === 'lg' ? 'h-14 text-lg' : ''
          } ${
            variant === 'primary' 
              ? 'bg-secondary hover:bg-secondary/90' 
              : ''
          }`}
        >
          <Lock className="w-4 h-4" />
          Kostenlose Offerten anfordern
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Link>

      {/* Micro Trust Badges */}
      {showTrustBadges && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            <span>Datenschutz geprüft</span>
          </div>
          <span className="text-muted-foreground/30">|</span>
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Käuferschutz aktiv</span>
          </div>
          <span className="text-muted-foreground/30 hidden sm:inline">|</span>
          <div className="flex items-center gap-1 hidden sm:flex">
            <Star className="w-3.5 h-3.5 text-yellow-500" />
            <span>4.9/5 Sterne</span>
          </div>
        </motion.div>
      )}
    </div>
  );
});
