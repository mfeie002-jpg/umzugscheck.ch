/**
 * Morris Love Declaration Banner - Bulgarian Only
 * Shows romantic love declarations from Morris to Bory
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, X, Crown, Star, Heart } from "lucide-react";

// All love declarations from Morris to Bory 💕
const MORRIS_LOVE_DECLARATIONS = [
  // Deep love declarations
  { icon: "💕", text: "Bory, ти си най-красивата жена на този свят. Обичам те безкрайно! ❤️" },
  { icon: "🌹", text: "Всяка сутрин се събуждам щастлив, защото знам че си моя, Bory! 💖" },
  { icon: "💎", text: "Bory, ти си моето съкровище. По-ценна от всичко на света! 👑" },
  { icon: "🌟", text: "Звездите завиждат на очите ти, Bory. Толкова красива си! ✨" },
  { icon: "❤️‍🔥", text: "Bory, любовта ми към теб е по-силна всеки ден. Завинаги твой, Morris 💘" },
  { icon: "🦋", text: "Когато те видях за пръв път, Bory, сърцето ми спря. И продължава да бие само за теб! 💓" },
  { icon: "🌈", text: "Bory, ти правиш живота ми цветен. Без теб всичко е сиво. 🎨" },
  { icon: "🏆", text: "Най-големият ми успех в живота? Да те имам, Bory! THE BEST! 💪" },
  { icon: "💫", text: "Bory, ти си моята луна и звезди. Осветяваш пътя ми! 🌙" },
  { icon: "🔥", text: "Огънят на любовта ми към теб никога няма да угасне, Bory! 🔥❤️" },
  
  // Sweet compliments
  { icon: "👑", text: "Bory, ти си моята кралица! Заслужаваш само най-доброто! 👸" },
  { icon: "🍯", text: "По-сладка от мед, по-красива от цвете - това си ти, Bory! 🌸" },
  { icon: "💋", text: "Всяка целувка с теб, Bory, е като първата. Магическа! ✨" },
  { icon: "🎵", text: "Bory, гласът ти е любимата ми мелодия. Искам да те слушам завинаги! 🎶" },
  { icon: "☀️", text: "Ти си слънцето в моя живот, Bory. Без теб е тъмно! 🌅" },
  { icon: "🦸‍♂️", text: "За теб, Bory, ще направя всичко. Ти си моята супер сила! 💪❤️" },
  { icon: "🌺", text: "Bory, ти ухаеш на щастие. Най-красивото цвете в света! 🌷" },
  { icon: "💝", text: "Сърцето ми принадлежи само на теб, Bory. Завинаги! 💖" },
  { icon: "🎁", text: "Bory, ти си най-хубавият подарък, който животът ми е дал! 🎀" },
  { icon: "🦁", text: "Ще те пазя като лъв, Bory. Ти си моето всичко! 🛡️" },
  
  // Romantic promises
  { icon: "💒", text: "Bory, искам да остарея с теб. Ти си моето бъдеще! 👫" },
  { icon: "🌍", text: "Ще обиколим целия свят заедно, Bory! Ти и аз, завинаги! ✈️" },
  { icon: "🏠", text: "Bory, домът е там, където си ти. Ти си моят дом! 🏡" },
  { icon: "⭐", text: "Ще ти сваля звездите, Bory! Заслужаваш целия космос! 🚀" },
  { icon: "🎭", text: "С теб, Bory, всеки ден е приключение. Обичам те! 🎪" },
  { icon: "🍀", text: "Най-късметлията съм, Bory, защото те имам! Lucky Morris! 🍀" },
  { icon: "📖", text: "Bory, нашата любовна история е най-красивата! Обичам те! 💕" },
  { icon: "🎯", text: "Целта на живота ми? Да те правя щастлива, Bory! 🎯❤️" },
  { icon: "🌻", text: "Bory, ти си като слънчоглед - винаги ме караш да се усмихвам! 😊" },
  { icon: "💐", text: "Хиляда рози не стигат да покажат колко те обичам, Bory! 🌹🌹🌹" },
  
  // Playful love
  { icon: "🐻", text: "Bory, ти си моето мече! Искам да те прегръщам вечно! 🤗" },
  { icon: "🍫", text: "Bory, ти си по-сладка от шоколад! Моята сладурана! 🍬" },
  { icon: "🎮", text: "Играта на живота? Печеля, защото съм с теб, Bory! 🏆" },
  { icon: "☕", text: "Като кафе сутрин - не мога без теб, Bory! ☕❤️" },
  { icon: "🎈", text: "Bory, с теб летя от щастие! Моя балон от любов! 🎈💕" },
  { icon: "🌊", text: "Любовта ми към теб, Bory, е безкрайна като океана! 🌊💙" },
  { icon: "🍕", text: "Bory, ти си моята любима... като пицата! Но още повече! 😂❤️" },
  { icon: "🎤", text: "Ако можех да пея, щях да пея само за теб, Bory! 🎵" },
  { icon: "🌠", text: "Всяка падаща звезда - желание за теб, Bory! 💫" },
  { icon: "🦋", text: "С теб, Bory, имам пеперуди в стомаха всеки ден! 🦋💕" },
];

interface MutscheliJokeBannerProps {
  variant?: "top" | "inline" | "mini";
  className?: string;
  onDismiss?: () => void;
  autoRotate?: boolean;
  rotateInterval?: number;
}

export function MutscheliJokeBanner({ 
  variant = "top", 
  className = "",
  onDismiss,
  autoRotate = false,
  rotateInterval = 8000
}: MutscheliJokeBannerProps) {
  const [jokeIndex, setJokeIndex] = useState(() => Math.floor(Math.random() * MORRIS_LOVE_DECLARATIONS.length));
  const [isVisible, setIsVisible] = useState(true);

  const currentJoke = useMemo(() => MORRIS_LOVE_DECLARATIONS[jokeIndex], [jokeIndex]);

  // Auto-rotate declarations
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setJokeIndex(prev => (prev + 1) % MORRIS_LOVE_DECLARATIONS.length);
    }, rotateInterval);
    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval]);

  const nextJoke = () => {
    setJokeIndex(prev => (prev + 1) % MORRIS_LOVE_DECLARATIONS.length);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  if (variant === "mini") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full border border-pink-400/30 ${className}`}
      >
        <span className="text-sm">{currentJoke.icon}</span>
        <span className="text-xs text-white/80 max-w-[200px] truncate">{currentJoke.text}</span>
        <button onClick={nextJoke} className="p-1 hover:bg-white/10 rounded-full touch-manipulation">
          <RefreshCw size={12} className="text-pink-400" />
        </button>
      </motion.div>
    );
  }

  if (variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-3 p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl border border-pink-400/20 ${className}`}
      >
        <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center text-xl shrink-0">
          {currentJoke.icon}
        </div>
        <p className="flex-1 text-sm text-white/80 leading-relaxed">{currentJoke.text}</p>
        <button 
          onClick={nextJoke} 
          className="p-2 hover:bg-white/10 rounded-lg touch-manipulation shrink-0"
          title="Нов виц"
        >
          <RefreshCw size={16} className="text-pink-400" />
        </button>
      </motion.div>
    );
  }

  // Top banner (default)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative overflow-hidden ${className}`}
      >
        <div className="bg-gradient-to-r from-pink-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-sm border-b border-pink-400/30">
          {/* Sparkle decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -left-4 text-pink-300/20"
            >
              <Star size={60} fill="currentColor" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-4 -right-4 text-purple-300/20"
            >
              <Crown size={80} fill="currentColor" />
            </motion.div>
          </div>

          <div className="relative flex items-center gap-3 px-4 py-3 max-w-4xl mx-auto">
            {/* Icon with animation */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg"
            >
              {currentJoke.icon}
            </motion.div>

            {/* Joke text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={jokeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 text-white font-medium text-sm sm:text-base leading-relaxed"
              >
                {currentJoke.text}
              </motion.p>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <motion.button
                whileTap={{ scale: 0.9, rotate: 180 }}
                onClick={nextJoke}
                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl touch-manipulation transition-colors"
                title="Нов виц"
              >
                <RefreshCw size={18} className="text-white" />
              </motion.button>
              {onDismiss && (
                <button
                  onClick={handleDismiss}
                  className="p-2.5 hover:bg-white/20 rounded-xl touch-manipulation transition-colors"
                >
                  <X size={18} className="text-white/70" />
                </button>
              )}
            </div>
          </div>

          {/* Love decoration */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1 pb-0.5">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
              >
                <Heart size={8} className="text-pink-300/50" fill="currentColor" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MutscheliJokeBanner;
