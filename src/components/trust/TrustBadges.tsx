/**
 * Trust Badges & Certifications
 * 
 * Swiss-specific trust signals:
 * - Swiss Made badge
 * - Verified company badges
 * - Insurance badges
 * - Rating badges
 */

import { memo } from 'react';
import { 
  Shield, 
  CheckCircle, 
  Star, 
  Award, 
  Clock, 
  Users,
  BadgeCheck,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/**
 * Swiss Quality Badge
 */
export const SwissQualityBadge = memo(function SwissQualityBadge({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 rounded-full",
      "bg-red-600 text-white font-semibold",
      sizes[size],
      className
    )}>
      <span className="text-white">🇨🇭</span>
      <span>Swiss Quality</span>
    </div>
  );
});

/**
 * Verified Badge
 */
export const VerifiedBadge = memo(function VerifiedBadge({
  label = 'Verifiziert',
  variant = 'default',
  size = 'md',
  className,
}: {
  label?: string;
  variant?: 'default' | 'success' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const variants = {
    default: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-green-500/10 text-green-700 border-green-500/20',
    premium: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <motion.div 
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
    >
      <BadgeCheck className={cn(
        size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
      )} />
      <span>{label}</span>
    </motion.div>
  );
});

/**
 * Insurance Badge
 */
export const InsuranceBadge = memo(function InsuranceBadge({
  amount,
  className,
}: {
  amount?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-2 rounded-lg",
      "bg-blue-500/10 text-blue-700 border border-blue-500/20",
      className
    )}>
      <Shield className="w-5 h-5" />
      <div>
        <p className="text-xs font-medium">Versichert</p>
        {amount && <p className="text-[10px] opacity-80">bis CHF {amount}</p>}
      </div>
    </div>
  );
});

/**
 * Rating Badge
 */
export const RatingBadge = memo(function RatingBadge({
  rating,
  count,
  size = 'md',
  className,
}: {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = {
    sm: 'text-xs gap-0.5',
    md: 'text-sm gap-1',
    lg: 'text-base gap-1.5',
  };

  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn("inline-flex items-center", sizes[size], className)}>
      <Star className={cn(starSizes[size], "text-yellow-500 fill-yellow-500")} />
      <span className="font-semibold">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-muted-foreground">({count})</span>
      )}
    </div>
  );
});

/**
 * Response Time Badge
 */
export const ResponseTimeBadge = memo(function ResponseTimeBadge({
  hours,
  className,
}: {
  hours: number;
  className?: string;
}) {
  const isFast = hours <= 2;
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 text-sm",
      isFast ? "text-green-600" : "text-muted-foreground",
      className
    )}>
      <Clock className="w-4 h-4" />
      <span>
        {hours <= 1 ? '< 1 Stunde' : hours <= 24 ? `${hours}h` : `${Math.round(hours / 24)} Tage`}
      </span>
    </div>
  );
});

/**
 * Trust Pill Group
 */
export const TrustPillGroup = memo(function TrustPillGroup({
  items,
  className,
}: {
  items: Array<{ icon: React.ElementType; text: string }>;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item, i) => (
        <div
          key={i}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm"
        >
          <item.icon className="w-4 h-4 text-primary" />
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
});

/**
 * Security Badge
 */
export const SecurityBadge = memo(function SecurityBadge({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-2 rounded-lg",
      "bg-green-500/10 text-green-700 border border-green-500/20",
      className
    )}>
      <Lock className="w-4 h-4" />
      <span className="text-sm font-medium">SSL-verschlüsselt</span>
    </div>
  );
});

/**
 * Customer Count Badge
 */
export const CustomerCountBadge = memo(function CustomerCountBadge({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  const formattedCount = count >= 1000 
    ? `${(count / 1000).toFixed(1).replace('.0', '')}k+`
    : `${count}+`;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 text-sm text-muted-foreground",
      className
    )}>
      <Users className="w-4 h-4" />
      <span>{formattedCount} zufriedene Kunden</span>
    </div>
  );
});

/**
 * Award Badge
 */
export const AwardBadge = memo(function AwardBadge({
  title,
  year,
  className,
}: {
  title: string;
  year?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-2 rounded-lg",
      "bg-yellow-500/10 text-yellow-700 border border-yellow-500/20",
      className
    )}>
      <Award className="w-5 h-5" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        {year && <p className="text-[10px] opacity-80">{year}</p>}
      </div>
    </div>
  );
});
