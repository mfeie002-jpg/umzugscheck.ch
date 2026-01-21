/**
 * SmartRouterHero - Festpreis headline with Swiss trust signals
 * Based on Gemini UX Audit recommendations
 */

import { motion } from 'framer-motion';
import { SWISS_TRUST_BADGES, HEADLINE_VARIANTS } from '../constants';

interface SmartRouterHeroProps {
  variant?: keyof typeof HEADLINE_VARIANTS;
  className?: string;
}

export function SmartRouterHero({ 
  variant = 'festpreis',
  className = '' 
}: SmartRouterHeroProps) {
  const headline = HEADLINE_VARIANTS[variant];

  return (
    <div className={`text-center ${className}`}>
      {/* Main Headline - Outcome focused, not process */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3"
      >
        {headline.main}
      </motion.h1>
      
      {/* Subline with USP */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-lg sm:text-xl text-primary font-medium mb-6"
      >
        {headline.sub}
      </motion.p>
      
      {/* Swiss Trust Badges - Replaces "100% Kostenlos" */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
      >
        {SWISS_TRUST_BADGES.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full text-sm"
            title={badge.description}
          >
            <span className="text-base">{badge.icon}</span>
            <span className="font-medium text-muted-foreground">{badge.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
