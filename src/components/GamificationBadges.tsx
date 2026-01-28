import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Medal, Star, Zap, Crown } from 'lucide-react';

const achievements = [
  { id: 'first-quote', name: 'Erste Offerte', icon: Star, description: 'Erste Kostenschätzung erstellt', unlocked: true },
  { id: 'calculator-pro', name: 'Rechner-Profi', icon: Zap, description: '5 verschiedene Schätzungen gemacht', unlocked: true },
  { id: 'early-bird', name: 'Frühbucher', icon: Medal, description: '4+ Wochen im Voraus gebucht', unlocked: false },
  { id: 'referral-star', name: 'Empfehlungs-Star', icon: Trophy, description: '3 Freunde geworben', unlocked: false },
  { id: 'vip-member', name: 'VIP Mitglied', icon: Crown, description: '2+ Umzüge mit uns', unlocked: false },
  { id: 'review-hero', name: 'Bewertungs-Held', icon: Award, description: 'Eine 5-Sterne Bewertung', unlocked: false },
];

interface GamificationBadgesProps {
  variant?: 'compact' | 'full';
}

const GamificationBadges = ({ variant = 'compact' }: GamificationBadgesProps) => {
  const [showUnlock, setShowUnlock] = useState<string | null>(null);
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progress = (unlockedCount / achievements.length) * 100;

  useEffect(() => {
    // Check for newly unlocked achievements (simulated)
    const lastCheck = localStorage.getItem('last-achievement-check');
    const now = Date.now();
    
    if (!lastCheck || now - parseInt(lastCheck) > 60000) {
      localStorage.setItem('last-achievement-check', now.toString());
    }
  }, []);

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        {achievements.filter(a => a.unlocked).slice(0, 3).map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
            title={achievement.name}
          >
            <achievement.icon className="w-4 h-4 text-primary" />
          </motion.div>
        ))}
        {unlockedCount > 3 && (
          <span className="text-xs text-muted-foreground">+{unlockedCount - 3}</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Erfolge freigeschaltet</span>
          <span className="font-medium">{unlockedCount}/{achievements.length}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-warning"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-3 gap-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-3 rounded-xl border text-center transition-all ${
              achievement.unlocked 
                ? 'bg-primary/5 border-primary/20' 
                : 'bg-muted/30 border-border opacity-50 grayscale'
            }`}
          >
            <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
              achievement.unlocked ? 'bg-primary/10' : 'bg-muted'
            }`}>
              <achievement.icon className={`w-5 h-5 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <p className="text-xs font-medium line-clamp-1">{achievement.name}</p>
            <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">{achievement.description}</p>
            
            {!achievement.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-xl">
                <span className="text-lg">🔒</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GamificationBadges;
