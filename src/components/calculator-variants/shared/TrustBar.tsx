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
      <div className="bg-muted/50 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium">Unverbindlich</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="font-medium">Geprüfte Firmen</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <span className="font-medium">DSG/DSGVO</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 rounded-xl p-4 mb-6">
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <div>
            <p className="font-medium">Unverbindlich</p>
            <p className="text-xs text-muted-foreground">keine Pflicht</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <div>
            <p className="font-medium">Geprüfte Firmen</p>
            <p className="text-xs text-muted-foreground">CH-Partner</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <div>
            <p className="font-medium">Datenschutz</p>
            <p className="text-xs text-muted-foreground">DSG/DSGVO</p>
          </div>
        </div>
      </div>
    </div>
  );
}
