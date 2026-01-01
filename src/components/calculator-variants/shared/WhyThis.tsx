/**
 * WhyThis - Collapsible "Why we ask this" component
 * 
 * Addresses user uncertainty by explaining why we need specific information.
 * Reduces form abandonment by building trust through transparency.
 */

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface WhyThisProps {
  /** Custom trigger text */
  triggerText?: string;
  /** Explanation content */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

export function WhyThis({ 
  triggerText = 'Warum fragen wir das?', 
  children,
  className = '',
}: WhyThisProps) {
  return (
    <details className={`rounded-xl border border-border bg-muted/30 p-3 ${className}`}>
      <summary className="cursor-pointer text-sm font-medium text-foreground flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
        {triggerText}
      </summary>
      <div className="mt-2 text-sm text-muted-foreground leading-relaxed pl-6">
        {children}
      </div>
    </details>
  );
}
