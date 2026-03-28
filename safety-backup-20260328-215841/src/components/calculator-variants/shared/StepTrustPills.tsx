/**
 * StepTrustPills - Step-specific Trust Signals
 * 
 * Shows context-aware trust pills that address specific fears at each step:
 * - addresses: General trust + "no obligation"
 * - inventory: Speed + data privacy
 * - services: Partner quality + transparent pricing
 * - contact: Data usage + easy opt-out
 */

import React from 'react';
import { Shield, Clock, Lock, CheckCircle2, Users, Eye } from 'lucide-react';

const trustByStep: Record<string, Array<{ text: string; icon: React.ElementType }>> = {
  addresses: [
    { text: 'Kostenlos & unverbindlich', icon: CheckCircle2 },
    { text: 'Schweizer Anbieter', icon: Shield },
    { text: 'Keine Telefonpflicht', icon: Lock },
  ],
  inventory: [
    { text: 'Nur 2 Min.', icon: Clock },
    { text: 'Kein Spam', icon: Shield },
    { text: 'Daten vertraulich', icon: Lock },
  ],
  services: [
    { text: 'Geprüfte Partner', icon: Users },
    { text: 'Transparente Offerten', icon: Eye },
    { text: 'Sicher bezahlen', icon: Lock },
  ],
  contact: [
    { text: 'Nur für Offerten', icon: CheckCircle2 },
    { text: 'Abmeldung jederzeit', icon: Shield },
    { text: 'Datenschutz CH/EU', icon: Lock },
  ],
};

interface StepTrustPillsProps {
  stepId?: 'addresses' | 'inventory' | 'services' | 'contact';
  className?: string;
}

export function StepTrustPills({ stepId = 'addresses', className = '' }: StepTrustPillsProps) {
  const items = trustByStep[stepId] ?? trustByStep.addresses;
  
  return (
    <div className={`flex flex-wrap gap-2 justify-center ${className}`}>
      {items.map(({ text, icon: Icon }) => (
        <span
          key={text}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/20 px-3 py-1.5 text-xs font-medium text-foreground"
        >
          <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
          {text}
        </span>
      ))}
    </div>
  );
}
