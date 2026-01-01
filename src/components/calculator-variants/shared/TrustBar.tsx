/**
 * TrustBar - Trust signals for conversion optimization
 * 
 * Displays:
 * - Unverbindlich (keine Pflicht)
 * - Geprüfte Firmen (CH-Partner)
 * - Datenschutz (DSG/DSGVO)
 */

import React from 'react';
import { Shield, CheckCircle2, Lock } from 'lucide-react';

interface TrustBarProps {
  compact?: boolean;
}

export function TrustBar({ compact = false }: TrustBarProps) {
  if (compact) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
          <div className="flex items-center gap-2 min-h-[44px] px-2">
            <Shield className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="font-medium">Unverbindlich</span>
          </div>
          <div className="flex items-center gap-2 min-h-[44px] px-2">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="font-medium">Geprüfte Firmen</span>
          </div>
          <div className="flex items-center gap-2 min-h-[44px] px-2">
            <Lock className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="font-medium">DSG/DSGVO</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
        <div className="flex items-center gap-2 min-h-[44px] px-2">
          <div className="bg-primary/10 rounded-full p-1.5">
            <Shield className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Unverbindlich</p>
            <p className="text-xs text-muted-foreground">keine Pflicht</p>
          </div>
        </div>
        <div className="flex items-center gap-2 min-h-[44px] px-2">
          <div className="bg-primary/10 rounded-full p-1.5">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Geprüfte Firmen</p>
            <p className="text-xs text-muted-foreground">CH-Partner</p>
          </div>
        </div>
        <div className="flex items-center gap-2 min-h-[44px] px-2">
          <div className="bg-primary/10 rounded-full p-1.5">
            <Lock className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Datenschutz</p>
            <p className="text-xs text-muted-foreground">DSG/DSGVO</p>
          </div>
        </div>
      </div>
    </div>
  );
}
