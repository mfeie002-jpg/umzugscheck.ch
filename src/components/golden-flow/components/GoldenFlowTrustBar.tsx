/**
 * GoldenFlowTrustBar - Trust indicators for credibility
 */

import { Shield, Star, Lock, Award, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoldenFlowTrustBarProps {
  className?: string;
  variant?: 'full' | 'compact';
}

const TRUST_ITEMS = [
  { icon: Shield, text: 'Schweizer Server', color: 'text-green-600' },
  { icon: Star, text: '4.9/5 (2\'847 Bewertungen)', color: 'text-amber-500' },
  { icon: Lock, text: '256-Bit SSL', color: 'text-blue-600' },
  { icon: Phone, text: 'Keine Werbeanrufe', color: 'text-purple-600' },
];

export function GoldenFlowTrustBar({ className, variant = 'full' }: GoldenFlowTrustBarProps) {
  if (variant === 'compact') {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground", className)}>
        <span className="flex items-center gap-1">
          <Shield className="h-3.5 w-3.5 text-green-600" />
          Schweizer Server
        </span>
        <span className="flex items-center gap-1">
          <Lock className="h-3.5 w-3.5 text-blue-600" />
          Sicher
        </span>
        <span className="flex items-center gap-1">
          <Phone className="h-3.5 w-3.5 text-purple-600" />
          Keine Werbeanrufe
        </span>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground py-3 border-t border-border/50",
      className
    )}>
      {TRUST_ITEMS.map((item) => (
        <span key={item.text} className="flex items-center gap-1">
          <item.icon className={cn("h-3.5 w-3.5", item.color)} />
          {item.text}
        </span>
      ))}
    </div>
  );
}
