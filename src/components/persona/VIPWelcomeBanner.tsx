/**
 * VIPWelcomeBanner - Celebrity welcome message for personalized pages
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Crown, Star } from 'lucide-react';
import { PERSONA_INFO, type PersonaKey } from '@/lib/persona-types';

interface VIPWelcomeBannerProps {
  persona: PersonaKey;
}

export const VIPWelcomeBanner = memo(function VIPWelcomeBanner({ persona }: VIPWelcomeBannerProps) {
  const info = PERSONA_INFO[persona];
  
  if (persona === 'bg0') return null;

  const welcomeMessages: Record<PersonaKey, string> = {
    bg0: '',
    bg1: 'Добре дошъл, Шампион! 🥊 Ти си първият, който вижда това.',
    bg2: 'Добре дошла, Кралице! 👑 Създадено специално за теб.',
    bg3: 'Добре дошъл, Късметлия! 🎰 VIP достъп само за теб.',
    it: 'Benvenuto, VIP! 🇮🇹 Solo per te, prima visione!'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-secondary/10 via-primary/5 to-secondary/10 border-b border-secondary/20"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
          <Crown className="w-4 h-4 text-secondary" />
          <span className="font-medium text-secondary">
            {welcomeMessages[persona]}
          </span>
          <div className="flex gap-1">
            <Star className="w-3 h-3 text-secondary fill-secondary" />
            <Star className="w-3 h-3 text-secondary fill-secondary" />
            <Star className="w-3 h-3 text-secondary fill-secondary" />
          </div>
          <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full font-medium">
            {info.vipBadge}
          </span>
        </div>
      </div>
    </motion.div>
  );
});
