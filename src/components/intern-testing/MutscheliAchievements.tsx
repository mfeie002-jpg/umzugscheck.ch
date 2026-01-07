/**
 * Special Mutscheli Achievements - Bulgarian Only
 * Custom achievements with unique icons and animations for Mutscheli
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Car, 
  Crown, 
  Sparkles, 
  Coffee, 
  Cigarette, 
  Moon, 
  Heart,
  Star,
  Zap,
  Trophy,
  Gem,
  Flame,
  PartyPopper,
  Clock,
  MessageCircle,
  Brain,
  Target
} from "lucide-react";

export interface MutscheliAchievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  unlockCondition: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const MUTSCHELI_ACHIEVEMENTS: MutscheliAchievement[] = [
  {
    id: "mercedes_queen",
    title: "Кралица на Мерцедеса! 🚗",
    description: "Първият поток готов - по-бързо от паркиране!",
    icon: <Car size={28} />,
    color: "#10B981",
    gradient: "from-emerald-400 to-teal-500",
    unlockCondition: "firstFlow",
    rarity: "common"
  },
  {
    id: "no_sleep_needed",
    title: "Без сън днес! 😴➡️😊",
    description: "Половината потоци без да заспиш!",
    icon: <Moon size={28} />,
    color: "#8B5CF6",
    gradient: "from-violet-400 to-purple-500",
    unlockCondition: "halfWay",
    rarity: "rare"
  },
  {
    id: "faster_than_mercedes",
    title: "По-бърза от Мерцедеса! 🚗💨",
    description: "Под 2 минути - дори extensions-ите не могат!",
    icon: <Zap size={28} />,
    color: "#F59E0B",
    gradient: "from-amber-400 to-orange-500",
    unlockCondition: "speedster",
    rarity: "epic"
  },
  {
    id: "actually_listened",
    title: "Наистина слуша! 👂✨",
    description: "Много feedback - чудо стана!",
    icon: <MessageCircle size={28} />,
    color: "#EC4899",
    gradient: "from-pink-400 to-rose-500",
    unlockCondition: "critic",
    rarity: "rare"
  },
  {
    id: "queen_complete",
    title: "Mutscheli, ти успя! 👑💕",
    description: "Всичките 10 потока готови! Bory Bory е най-добрата!",
    icon: <Crown size={28} />,
    color: "#FBBF24",
    gradient: "from-yellow-400 to-amber-500",
    unlockCondition: "complete",
    rarity: "legendary"
  },
  {
    id: "coffee_break",
    title: "Кафе пауза! ☕",
    description: "Паузирала си тестването - типично!",
    icon: <Coffee size={28} />,
    color: "#78350F",
    gradient: "from-amber-700 to-amber-900",
    unlockCondition: "paused",
    rarity: "common"
  },
  {
    id: "focus_master",
    title: "ADHD? Какво ADHD? 🎯",
    description: "Завърши поток без разсейване!",
    icon: <Brain size={28} />,
    color: "#06B6D4",
    gradient: "from-cyan-400 to-teal-500",
    unlockCondition: "focused",
    rarity: "epic"
  },
  {
    id: "extension_queen",
    title: "Extension Кралица! 💇‍♀️",
    description: "Толкова дълъг feedback колкото extensions-ите!",
    icon: <Sparkles size={28} />,
    color: "#D946EF",
    gradient: "from-fuchsia-400 to-pink-500",
    unlockCondition: "longFeedback",
    rarity: "rare"
  },
  {
    id: "no_excuses",
    title: "Без извинения! 🎉",
    description: "Завърши всичко без да каже 'после'!",
    icon: <Target size={28} />,
    color: "#22C55E",
    gradient: "from-green-400 to-emerald-500",
    unlockCondition: "noSkips",
    rarity: "legendary"
  },
  {
    id: "present_moment",
    title: "Живее в момента! 🌟",
    description: "Цял час без да спомене 2017!",
    icon: <Star size={28} />,
    color: "#F472B6",
    gradient: "from-pink-400 to-rose-400",
    unlockCondition: "present",
    rarity: "epic"
  }
];

interface MutscheliAchievementToastProps {
  achievement: MutscheliAchievement;
  onClose: () => void;
}

export function MutscheliAchievementToast({ achievement, onClose }: MutscheliAchievementToastProps) {
  const [showSparkles, setShowSparkles] = useState(true);

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    const sparkleTimer = setTimeout(() => setShowSparkles(false), 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(sparkleTimer);
    };
  }, [onClose]);

  const rarityColors = {
    common: "border-emerald-400/50",
    rare: "border-blue-400/50",
    epic: "border-purple-400/50",
    legendary: "border-amber-400/50 ring-2 ring-amber-400/30"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.5, rotate: -10 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="fixed bottom-24 left-4 right-4 z-[100] mx-auto max-w-sm"
    >
      {/* Sparkle effects */}
      <AnimatePresence>
        {showSparkles && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  scale: 0,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: 0, 
                  scale: 1.5,
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200
                }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
                className="absolute left-1/2 top-1/2 pointer-events-none"
                style={{ color: achievement.color }}
              >
                <Sparkles size={16} />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ 
          boxShadow: [
            `0 0 20px ${achievement.color}40`,
            `0 0 40px ${achievement.color}60`,
            `0 0 20px ${achievement.color}40`
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`bg-gradient-to-r ${achievement.gradient} rounded-3xl p-1 ${rarityColors[achievement.rarity]}`}
      >
        <div className="bg-slate-900/95 backdrop-blur-sm rounded-[22px] p-4">
          <div className="flex items-center gap-4">
            {/* Animated icon */}
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.5, repeat: 3 }}
              className={`w-16 h-16 bg-gradient-to-br ${achievement.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}
              style={{ boxShadow: `0 8px 32px ${achievement.color}50` }}
            >
              {achievement.icon}
            </motion.div>

            <div className="flex-1 min-w-0">
              {/* Rarity badge */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full mb-1"
              >
                <Gem size={10} className="text-white/60" />
                <span className="text-[10px] text-white/60 uppercase tracking-wider">
                  {achievement.rarity === "legendary" ? "Легендарно" :
                   achievement.rarity === "epic" ? "Епично" :
                   achievement.rarity === "rare" ? "Рядко" : "Обичайно"}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white font-bold text-lg leading-tight"
              >
                {achievement.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/60 text-sm mt-0.5"
              >
                {achievement.description}
              </motion.p>
            </div>
          </div>

          {/* Progress bar animation */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-1 bg-white/20 rounded-full mt-3 origin-left"
          />
        </div>
      </motion.div>

      {/* Confetti burst for legendary */}
      {achievement.rarity === "legendary" && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 3 }}
          className="absolute inset-0 pointer-events-none overflow-visible"
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: "50%", 
                y: "50%",
                scale: 0
              }}
              animate={{ 
                x: `${Math.random() * 200 - 50}%`,
                y: `${Math.random() * -200 - 100}%`,
                scale: Math.random() + 0.5,
                rotate: Math.random() * 720
              }}
              transition={{ 
                duration: 2 + Math.random(),
                ease: "easeOut"
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: ["#FFD700", "#FF69B4", "#00CED1", "#FF6347", "#9370DB"][i % 5]
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// Hook to get achievement by condition
export function getMutscheliAchievement(conditionId: string): MutscheliAchievement | undefined {
  return MUTSCHELI_ACHIEVEMENTS.find(a => a.unlockCondition === conditionId);
}

export default MutscheliAchievementToast;
