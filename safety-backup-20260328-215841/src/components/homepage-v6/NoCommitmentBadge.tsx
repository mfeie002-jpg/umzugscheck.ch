/**
 * No Commitment Badge V6 - Trust badge for CTAs
 * Addresses: "No-Commitment-Garantie kommunizieren"
 */
import { memo } from 'react';
import { Shield, CheckCircle2, Lock, Clock, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface NoCommitmentBadgeProps {
  variant?: 'compact' | 'full' | 'inline';
  className?: string;
}

export const NoCommitmentBadge = memo(function NoCommitmentBadge({
  variant = 'compact',
  className = '',
}: NoCommitmentBadgeProps) {
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <Shield className="w-3.5 h-3.5 text-green-500" />
        <span>100% kostenlos & unverbindlich</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground ${className}`}>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span>Kostenlos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-primary" />
          <span>Unverbindlich</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-secondary" />
          <span>In 2 Min.</span>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-green-50 dark:bg-green-950 rounded-xl p-4 border border-green-200 dark:border-green-800 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
            🌟 Unser Versprechen
          </h4>
          <p className="text-sm text-green-700 dark:text-green-300">
            Ihre Anfrage ist 100% unverbindlich. Sie entscheiden selbst, 
            ob und welches Angebot Sie annehmen.
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <Phone className="w-3.5 h-3.5" />
              <span>Keine Werbeanrufe</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <Mail className="w-3.5 h-3.5" />
              <span>Kein Spam</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
