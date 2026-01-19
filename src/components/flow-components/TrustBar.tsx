/**
 * TrustBar Component - UX Compliance Checklist:
 * ✅ Mobile-first design with proper spacing
 * ✅ Semantic tokens from design system
 * ✅ Touch-friendly targets (badges are informational, not interactive)
 * ✅ Trust signals: Partner verification, SSL, ratings
 * ✅ Compact and full variants for different contexts
 * ✅ Uses Lucide icons for consistent visual style
 */

import React, { memo } from 'react';
import { Shield, Lock, Star, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TrustBarProps {
  variant?: 'compact' | 'full';
  className?: string;
}

interface TrustItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sublabel?: string;
}

const TRUST_ITEMS_COMPACT: TrustItem[] = [
  { icon: Shield, label: 'Geprüfte Partner' },
  { icon: Lock, label: 'SSL-verschlüsselt' },
  { icon: Star, label: '4.8/5 Bewertung' },
];

const TRUST_ITEMS_FULL: TrustItem[] = [
  { icon: Shield, label: 'Geprüfte Umzugsfirmen', sublabel: '150+ Partner' },
  { icon: Lock, label: 'Datenschutz garantiert', sublabel: 'SSL-verschlüsselt' },
  { icon: Star, label: '4.8 von 5 Sternen', sublabel: '2\'400+ Bewertungen' },
  { icon: Clock, label: 'Schnelle Antwort', sublabel: 'Innert 24h' },
];

export const TrustBar = memo(function TrustBar({ variant = 'compact', className }: TrustBarProps) {
  const items = variant === 'compact' ? TRUST_ITEMS_COMPACT : TRUST_ITEMS_FULL;

  if (variant === 'compact') {
    return (
      <div className={cn(
        "bg-muted/50 border-b border-border py-2.5 px-4",
        className
      )}>
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-primary/20 py-4 px-4",
      className
    )}>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.label}</p>
                {item.sublabel && (
                  <p className="text-xs text-muted-foreground truncate">{item.sublabel}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Inline mini trust bar for forms
export const TrustBarMini = memo(function TrustBarMini({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3 text-xs text-muted-foreground", className)}>
      <span className="flex items-center gap-1">
        <Shield className="w-3 h-3 text-primary" />
        Geprüft
      </span>
      <span className="text-border">•</span>
      <span className="flex items-center gap-1">
        <Lock className="w-3 h-3 text-primary" />
        Sicher
      </span>
      <span className="text-border">•</span>
      <span className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3 text-primary" />
        Kostenlos
      </span>
    </div>
  );
});

export default TrustBar;
