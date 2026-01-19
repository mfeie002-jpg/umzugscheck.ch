/**
 * GoldenFlowTrustBar - Enhanced Trust indicators for Swiss credibility
 * 
 * Phase 1.4: Trust Architecture
 * - Swiss server badge with flag
 * - 256-Bit SSL security indicator
 * - Media logos strip (20min, NZZ, Blick)
 * - No advertising calls promise
 */

import { Shield, Star, Lock, Phone, CheckCircle, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoldenFlowTrustBarProps {
  className?: string;
  variant?: 'full' | 'compact' | 'media';
}

const TRUST_ITEMS = [
  { 
    icon: Shield, 
    text: '🇨🇭 Schweizer Server', 
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  { 
    icon: Star, 
    text: '4.9/5 (2\'847 Bewertungen)', 
    color: 'text-amber-500',
    bgColor: 'bg-amber-50'
  },
  { 
    icon: Lock, 
    text: '256-Bit SSL', 
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  { 
    icon: Phone, 
    text: 'Keine Werbeanrufe', 
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
];

const MEDIA_LOGOS = [
  { name: '20 Minuten', short: '20min' },
  { name: 'NZZ', short: 'NZZ' },
  { name: 'Blick', short: 'Blick' },
  { name: 'SRF', short: 'SRF' },
];

export function GoldenFlowTrustBar({ className, variant = 'full' }: GoldenFlowTrustBarProps) {
  if (variant === 'compact') {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground", className)}>
        <span className="flex items-center gap-1">
          <Shield className="h-3.5 w-3.5 text-green-600" />
          🇨🇭 Schweizer Server
        </span>
        <span className="flex items-center gap-1">
          <Lock className="h-3.5 w-3.5 text-blue-600" />
          256-Bit SSL
        </span>
        <span className="flex items-center gap-1">
          <Phone className="h-3.5 w-3.5 text-purple-600" />
          Keine Werbeanrufe
        </span>
      </div>
    );
  }
  
  if (variant === 'media') {
    return (
      <div className={cn("py-3 border-t border-border/50", className)}>
        <p className="text-xs text-center text-muted-foreground mb-2">
          Bekannt aus
        </p>
        <div className="flex items-center justify-center gap-4">
          {MEDIA_LOGOS.map((media) => (
            <span 
              key={media.short}
              className="px-3 py-1 rounded-full bg-muted/60 text-xs font-medium text-muted-foreground"
            >
              {media.short}
            </span>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-3", className)}>
      {/* Main trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs py-3 border-t border-border/50">
        {TRUST_ITEMS.map((item) => (
          <span 
            key={item.text} 
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
              item.bgColor
            )}
          >
            <item.icon className={cn("h-3.5 w-3.5", item.color)} />
            <span className="text-foreground/80 font-medium">{item.text}</span>
          </span>
        ))}
      </div>
      
      {/* Media strip */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Bekannt aus:</span>
        {MEDIA_LOGOS.map((media, i) => (
          <span key={media.short}>
            <span className="font-medium text-foreground/70">{media.short}</span>
            {i < MEDIA_LOGOS.length - 1 && <span className="ml-2">•</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * SwissTrustBadge - Standalone Swiss quality badge
 */
export function SwissTrustBadge({ className }: { className?: string }) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-200 bg-green-50",
      className
    )}>
      <span className="text-base">🇨🇭</span>
      <span className="text-xs font-semibold text-green-800">
        100% Schweizer Qualität
      </span>
      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
    </div>
  );
}

/**
 * SecurityBadge - SSL/Security indicator
 */
export function SecurityBadge({ className }: { className?: string }) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700",
      className
    )}>
      <Lock className="h-3 w-3" />
      <span className="text-[10px] font-semibold">256-Bit SSL gesichert</span>
    </div>
  );
}

/**
 * MediaLogosStrip - Shows media mentions
 */
export function MediaLogosStrip({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-4 py-2", className)}>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
        Bekannt aus
      </span>
      <div className="flex items-center gap-3">
        {MEDIA_LOGOS.map((media) => (
          <span 
            key={media.short}
            className="text-xs font-bold text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            {media.short}
          </span>
        ))}
      </div>
    </div>
  );
}
