/**
 * HeroTrustBar - Integrated trust signals for Hero sections
 * 
 * Based on UX Research:
 * - Position: Below form/CTA to reinforce action without obstruction
 * - Design: Horizontal row of grayscale logos, responsive stacking
 * - Label: "Bekannt aus führenden Medien:" for context
 * - Spacing: Generous (15-20px gap) to avoid crowding
 * - Logos: 5-7 max, muted colors to not compete with CTA
 * 
 * Variants:
 * - below-form: Full trust bar below form card
 * - inline-form: Compact version inside form card footer
 * - below-cta: Under the CTA button section
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, Star, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroTrustBarProps {
  variant?: 'below-form' | 'inline-form' | 'below-cta';
  className?: string;
  showSecurityBadges?: boolean;
}

// Swiss media partners for trust signals
const MEDIA_LOGOS = [
  { name: 'SRF', website: 'srf.ch', color: '#C8102E' },
  { name: 'NZZ', website: 'nzz.ch', color: '#000000' },
  { name: 'Blick', website: 'blick.ch', color: '#E4002B' },
  { name: '20min', website: '20min.ch', color: '#E3000F' },
  { name: 'TCS', website: 'tcs.ch', color: '#FFD700' },
];

const SECURITY_BADGES = [
  { icon: Lock, label: 'SSL-verschlüsselt' },
  { icon: Shield, label: 'DSGVO-konform' },
  { icon: CheckCircle, label: 'Swiss Made' },
];

export const HeroTrustBar = memo(function HeroTrustBar({
  variant = 'below-form',
  className,
  showSecurityBadges = true,
}: HeroTrustBarProps) {
  
  // Inline-form: Compact version for form card footer
  if (variant === 'inline-form') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={cn(
          "pt-4 mt-4 border-t border-border/50",
          className
        )}
      >
        {/* Security badges row */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-3">
          {SECURITY_BADGES.map((badge, idx) => (
            <span key={idx} className="inline-flex items-center gap-1">
              <badge.icon className="w-3.5 h-3.5 text-primary" />
              {badge.label}
            </span>
          ))}
        </div>
        
        {/* Compact media logos */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
            Bekannt aus:
          </span>
          {MEDIA_LOGOS.slice(0, 4).map((logo) => (
            <span 
              key={logo.name}
              className="text-[11px] font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              {logo.name}
            </span>
          ))}
        </div>
      </motion.div>
    );
  }
  
  // Below-CTA: Under the CTA button
  if (variant === 'below-cta') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={cn("mt-6 space-y-3", className)}
      >
        {/* Label */}
        <p className="text-xs text-muted-foreground text-center lg:text-left">
          Vertrauen Sie dem Marktführer – bekannt aus:
        </p>
        
        {/* Logos row - grayscale on light, subtle on dark */}
        <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
          {MEDIA_LOGOS.map((logo, idx) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + idx * 0.05 }}
              className="group flex items-center gap-1"
            >
              <span 
                className="text-sm font-bold text-muted-foreground/50 group-hover:text-muted-foreground transition-colors"
              >
                {logo.name}
              </span>
            </motion.div>
          ))}
        </div>
        
        {/* Rating badge */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">4.8/5</span>
          </div>
          <span className="text-muted-foreground/50">•</span>
          <span>15'000+ Umzüge vermittelt</span>
        </div>
      </motion.div>
    );
  }
  
  // Default: Below-form - Full trust bar
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className={cn(
        "bg-muted/40 rounded-xl border border-border/50 p-4 md:p-5",
        className
      )}
    >
      {/* Header with label */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-px w-8 bg-border/60" />
        <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">
          Bekannt aus führenden Medien
        </span>
        <div className="h-px w-8 bg-border/60" />
      </div>
      
      {/* Logo Grid - Responsive: 2 cols mobile, flex desktop */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-4">
        {MEDIA_LOGOS.map((logo, idx) => (
          <motion.a
            key={logo.name}
            href={`https://www.${logo.website}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + idx * 0.08 }}
            whileHover={{ scale: 1.05 }}
            className="group flex flex-col items-center gap-1 px-3 py-2 rounded-lg
                       hover:bg-background/50 transition-all cursor-pointer"
          >
            {/* Logo as styled text - grayscale by default */}
            <span 
              className="text-lg font-bold text-muted-foreground/40 group-hover:text-muted-foreground transition-colors"
              style={{ 
                filter: 'grayscale(100%)',
              }}
            >
              {logo.name}
            </span>
            <span className="text-[9px] text-muted-foreground/40 group-hover:text-muted-foreground/60 flex items-center gap-0.5">
              {logo.website}
              <ExternalLink className="w-2 h-2 opacity-0 group-hover:opacity-100" />
            </span>
          </motion.a>
        ))}
      </div>
      
      {/* Security badges row */}
      {showSecurityBadges && (
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-border/40">
          {SECURITY_BADGES.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <badge.icon className="w-3.5 h-3.5 text-primary" />
              <span>{badge.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-muted-foreground">4.8/5</span>
            <span className="text-muted-foreground/50">(15'000+ Umzüge)</span>
          </div>
        </div>
      )}
    </motion.div>
  );
});

export default HeroTrustBar;
