/**
 * Enhanced Trust Bar V6 - Premium trust signals with tooltips
 * Features: Comparis-style, Swiss Label, Trusted Shops, TÜV, SMA, ISO
 */
import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle2, Star, Lock, Building2, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TrustBadge {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  verified?: boolean;
  link?: string;
}

const TRUST_BADGES: TrustBadge[] = [
  {
    id: 'swiss-label',
    name: 'Swiss Label',
    shortName: 'Swiss Quality',
    description: '82% der Schweizer vertrauen dem Armbrust-Symbol für Qualität',
    icon: Shield,
    bgColor: 'bg-red-50 dark:bg-red-950',
    iconColor: 'text-red-600',
    verified: true,
    link: 'https://swisslabel.ch',
  },
  {
    id: 'trusted-shops',
    name: 'Trusted Shops',
    shortName: 'Käuferschutz',
    description: 'Europas bekanntestes E-Commerce-Gütesiegel mit Käuferschutz',
    icon: CheckCircle2,
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    iconColor: 'text-amber-600',
    verified: true,
    link: 'https://trustedshops.ch',
  },
  {
    id: 'sma',
    name: 'Swiss Movers Association',
    shortName: 'SMA Qualität',
    description: 'Nur geprüfte Schweizer Umzugsfirmen mit Verbandsgarantie',
    icon: Award,
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    iconColor: 'text-blue-600',
    verified: true,
  },
  {
    id: 'tuv',
    name: 'TÜV geprüft',
    shortName: 'TÜV Service',
    description: 'Geprüfte Servicequalität nach TÜV-Standard',
    icon: Building2,
    bgColor: 'bg-slate-50 dark:bg-slate-900',
    iconColor: 'text-slate-700',
    verified: true,
  },
  {
    id: 'ssl',
    name: 'SSL-Verschlüsselung',
    shortName: '256-bit SSL',
    description: 'Ihre Daten werden mit Bankstandard verschlüsselt übertragen',
    icon: Lock,
    bgColor: 'bg-green-50 dark:bg-green-950',
    iconColor: 'text-green-600',
    verified: true,
  },
  {
    id: 'rating',
    name: 'Kundenbewertung',
    shortName: '4.9/5 ★',
    description: 'Basierend auf 2.847+ verifizierten Kundenbewertungen',
    icon: Star,
    bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    iconColor: 'text-yellow-600',
    verified: true,
  },
];

export const EnhancedTrustBar = memo(function EnhancedTrustBar() {
  return (
    <section className="py-6 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Geprüft & Zertifiziert
          </p>
        </div>

        {/* Trust Badges Grid */}
        <TooltipProvider>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {TRUST_BADGES.map((badge, index) => (
              <Tooltip key={badge.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative flex flex-col items-center p-3 rounded-xl ${badge.bgColor} cursor-help group hover:shadow-md transition-all`}
                  >
                    {/* Verified checkmark */}
                    {badge.verified && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    <badge.icon className={`w-5 h-5 ${badge.iconColor} mb-1.5`} />
                    <span className={`text-[10px] font-semibold ${badge.iconColor} text-center leading-tight`}>
                      {badge.shortName}
                    </span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[220px]">
                  <div className="text-center">
                    <p className="font-semibold text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {badge.description}
                    </p>
                    {badge.link && (
                      <a 
                        href={badge.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
                      >
                        Verifizieren <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
});
