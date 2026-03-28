/**
 * Psychological Trigger Components for Golden Flow
 * 
 * Evidence-based UX patterns to increase conversions:
 * - Social Proof: Live activity indicators
 * - Scarcity: Limited availability messaging
 * - Authority: Trust badges and certifications
 * - Urgency: Time-sensitive messaging
 */

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Shield, 
  TrendingUp, 
  CheckCircle2, 
  Star,
  Zap,
  Award,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============= SOCIAL PROOF =============

interface LiveActivityProps {
  className?: string;
}

const ACTIVITY_MESSAGES = [
  { name: 'Maria S.', action: 'hat gerade eine Offerte angefordert', city: 'Zürich' },
  { name: 'Thomas K.', action: 'vergleicht Angebote', city: 'Bern' },
  { name: 'Sandra M.', action: 'hat 3 Offerten erhalten', city: 'Basel' },
  { name: 'Peter W.', action: 'hat einen Umzug gebucht', city: 'Luzern' },
  { name: 'Anna B.', action: 'hat gerade eine Offerte angefordert', city: 'Winterthur' },
  { name: 'Michael R.', action: 'vergleicht Angebote', city: 'St. Gallen' },
];

export const LiveActivityIndicator = memo(function LiveActivityIndicator({ className }: LiveActivityProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % ACTIVITY_MESSAGES.length);
        setIsVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const message = ACTIVITY_MESSAGES[currentMessage];

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5",
            className
          )}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span>
            <strong>{message.name}</strong> aus {message.city} {message.action}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ============= SCARCITY / URGENCY =============

interface UrgencyBannerProps {
  availableSlots?: number;
  deadline?: string;
  className?: string;
}

export const UrgencyBanner = memo(function UrgencyBanner({ 
  availableSlots = 3, 
  deadline = 'heute',
  className 
}: UrgencyBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-lg p-3",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-amber-500/20 rounded-full">
          <Timer className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">
            Hohe Nachfrage in Ihrer Region
          </p>
          <p className="text-xs text-amber-700/80">
            Nur noch <strong>{availableSlots} Termine</strong> diese Woche verfügbar
          </p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-xs font-semibold text-amber-600 bg-amber-500/20 px-2 py-1 rounded-full"
        >
          {deadline}
        </motion.div>
      </div>
    </motion.div>
  );
});

// ============= TRUST INDICATORS =============

interface TrustPillsProps {
  className?: string;
  variant?: 'compact' | 'full';
}

const TRUST_ITEMS = [
  { icon: Shield, text: 'Geprüfte Firmen', color: 'text-emerald-600' },
  { icon: Star, text: '4.8/5 Bewertung', color: 'text-amber-600' },
  { icon: Users, text: '50\'000+ Umzüge', color: 'text-blue-600' },
  { icon: Award, text: 'Swiss Made', color: 'text-red-600' },
];

export const TrustPills = memo(function TrustPills({ className, variant = 'compact' }: TrustPillsProps) {
  if (variant === 'compact') {
    return (
      <div className={cn("flex flex-wrap justify-center gap-2", className)}>
        {TRUST_ITEMS.slice(0, 3).map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-2.5 py-1"
          >
            <item.icon className={cn("w-3 h-3", item.color)} />
            <span>{item.text}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-4 gap-3", className)}>
      {TRUST_ITEMS.map((item, index) => (
        <motion.div
          key={item.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center gap-1 p-3 bg-muted/30 rounded-lg text-center"
        >
          <item.icon className={cn("w-5 h-5", item.color)} />
          <span className="text-xs font-medium">{item.text}</span>
        </motion.div>
      ))}
    </div>
  );
});

// ============= SAVINGS HIGHLIGHT =============

interface SavingsHighlightProps {
  savings: number;
  className?: string;
}

export const SavingsHighlight = memo(function SavingsHighlight({ savings, className }: SavingsHighlightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5",
        className
      )}
    >
      <TrendingUp className="w-4 h-4 text-emerald-600" />
      <span className="text-sm">
        <span className="font-semibold text-emerald-700">CHF {savings.toLocaleString('de-CH')}</span>
        <span className="text-emerald-600/80"> durchschnittliche Ersparnis</span>
      </span>
    </motion.div>
  );
});

// ============= COMPLETION MOMENTUM =============

interface CompletionMomentumProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const CompletionMomentum = memo(function CompletionMomentum({ 
  currentStep, 
  totalSteps,
  className 
}: CompletionMomentumProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);
  const remainingTime = Math.max(1, (totalSteps - currentStep) * 30); // ~30 sec per step

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex items-center justify-between text-xs text-muted-foreground", className)}
    >
      <div className="flex items-center gap-1.5">
        <Zap className="w-3.5 h-3.5 text-amber-500" />
        <span>{percent}% abgeschlossen</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        <span>~{remainingTime} Sek. verbleibend</span>
      </div>
    </motion.div>
  );
});

// ============= FREE BADGE =============

interface FreeBadgeProps {
  className?: string;
}

export const FreeBadge = memo(function FreeBadge({ className }: FreeBadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full",
        className
      )}
    >
      <CheckCircle2 className="w-3 h-3" />
      100% KOSTENLOS
    </motion.span>
  );
});

// ============= GUARANTEE BADGE =============

interface GuaranteeBadgeProps {
  className?: string;
}

export const GuaranteeBadge = memo(function GuaranteeBadge({ className }: GuaranteeBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-2 text-xs bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2",
        className
      )}
    >
      <Shield className="w-5 h-5 text-blue-600" />
      <div>
        <p className="font-medium text-blue-800">Bestpreis-Garantie</p>
        <p className="text-blue-600/80">Wir finden den besten Preis für Sie</p>
      </div>
    </motion.div>
  );
});
