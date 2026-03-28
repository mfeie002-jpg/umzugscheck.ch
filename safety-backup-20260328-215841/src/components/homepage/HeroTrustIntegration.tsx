/**
 * HeroTrustIntegration - Refined trust signal integration for Hero sections
 * 
 * Based on UX Feedback:
 * 1. Left-aligned under CTA (Recommended) - Monochrome WHITE logos on dark bg
 * 2. Inside form container - At bottom of white form box
 * 3. Glassmorphism bar - Premium overlay at bottom of hero image
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Lock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroTrustIntegrationProps {
  variant: 'left-under-cta' | 'in-form-container' | 'glassmorphism-bar';
  className?: string;
}

// Swiss media logos - text-based for clean monochrome rendering
const MEDIA_LOGOS = [
  { name: 'SRF', full: 'Schweizer Radio' },
  { name: 'NZZ', full: 'Neue Zürcher Zeitung' },
  { name: 'Blick', full: 'Blick.ch' },
  { name: '20min', full: '20 Minuten' },
  { name: 'TCS', full: 'Touring Club' },
];

export const HeroTrustIntegration = memo(function HeroTrustIntegration({
  variant,
  className,
}: HeroTrustIntegrationProps) {
  
  // Option 1: Left-aligned under CTA - Monochrome WHITE on dark background
  if (variant === 'left-under-cta') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className={cn("mt-8 space-y-3", className)}
      >
        {/* Label in white/light gray */}
        <p className="text-sm text-white/70 font-medium">
          Vertrauen Sie dem Marktführer – bekannt aus:
        </p>
        
        {/* Monochrome WHITE logos row */}
        <div className="flex items-center gap-5 flex-wrap">
          {MEDIA_LOGOS.map((logo, idx) => (
            <motion.span
              key={logo.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + idx * 0.05 }}
              className="text-base font-bold text-white/60 hover:text-white transition-colors cursor-default"
              title={logo.full}
            >
              {logo.name}
            </motion.span>
          ))}
        </div>
        
        {/* Rating in white */}
        <div className="flex items-center gap-2 text-sm text-white/80">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold">4.8/5</span>
          <span className="text-white/50">•</span>
          <span className="text-white/60">15'000+ Umzüge</span>
        </div>
      </motion.div>
    );
  }
  
  // Option 2: Inside form container - At bottom of white form box
  if (variant === 'in-form-container') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={cn(
          "pt-4 mt-4 border-t border-border/50 bg-muted/30 -mx-4 -mb-4 px-4 pb-4 rounded-b-xl",
          className
        )}
      >
        {/* Compact label */}
        <p className="text-[11px] text-muted-foreground text-center mb-2">
          Bekannt aus:
        </p>
        
        {/* Colored logos (smaller) on white background */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {MEDIA_LOGOS.slice(0, 4).map((logo) => (
            <span
              key={logo.name}
              className="text-xs font-bold text-muted-foreground/70 hover:text-foreground transition-colors"
            >
              {logo.name}
            </span>
          ))}
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-medium text-muted-foreground">4.8</span>
          </div>
        </div>
        
        {/* Security micro-badges */}
        <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-muted-foreground/60">
          <span className="inline-flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5" /> SSL
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Shield className="w-2.5 h-2.5" /> DSGVO
          </span>
          <span className="inline-flex items-center gap-0.5">
            <CheckCircle className="w-2.5 h-2.5" /> Swiss
          </span>
        </div>
      </motion.div>
    );
  }
  
  // Option 3: Glassmorphism bar - Premium overlay at bottom of hero
  if (variant === 'glassmorphism-bar') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={cn(
          "absolute bottom-0 left-0 right-0 py-4 px-6",
          "backdrop-blur-md bg-white/10 border-t border-white/20",
          className
        )}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Label + Logos */}
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <span className="text-sm text-white/70 font-medium">
              Bekannt aus:
            </span>
            <div className="flex items-center gap-4">
              {MEDIA_LOGOS.map((logo) => (
                <span
                  key={logo.name}
                  className="text-sm font-bold text-white/50 hover:text-white transition-colors"
                >
                  {logo.name}
                </span>
              ))}
            </div>
          </div>
          
          {/* Right: Stats + Rating */}
          <div className="flex items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">4.8/5</span>
            </div>
            <span className="text-white/30">|</span>
            <span className="text-white/60">15'000+ Umzüge</span>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-white/60" />
              <span className="text-white/60">Swiss Made</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return null;
});

export default HeroTrustIntegration;
