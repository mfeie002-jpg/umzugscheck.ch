/**
 * Morris Love Declaration Banner - Bulgarian Only
 * Shows love declarations + kiffer/ski jokes for Bulgarian testers
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, X, Crown, Star, Heart } from "lucide-react";

// All love declarations from Morris to Bory 💕
// NOTE: Keep it playful + non-offensive (no sexual content).
const MORRIS_LOVE_DECLARATIONS = [
  // ========== KIFFER / STONER JOKES (BG) ==========
  { icon: "🌿", text: "Bory, казах 'само 2 стъпки'… после видях още 8. Май съм на облак ☁️😂" },
  { icon: "💨", text: "Bory, аз не съм бавен… просто UX-ът е в slow motion. 💨🐌" },
  { icon: "🍪", text: "Bory, правило #1: Step 1 → snack. Step 2 → snack. Step 3 →… пак snack. 🍪✨" },
  { icon: "🧠", text: "Bory, имах гениална идея за UX-а… *забравям веднага* 💭😅" },
  { icon: "🔄", text: "Testing loop: Отвори flow → Разсейка → Пак отвори flow → Repeat 🔁🌿" },
  { icon: "🌈", text: "Bory, цветовете на този flow са прекрасни... или съм аз? 🌈✨" },
  { icon: "😴", text: "Bory, 'още 1 flow' казах на 22:00... сега е 03:00 😴🌙" },
  { icon: "🍕", text: "Bory, този бутон ми прилича на пица... Чакай, гладен съм. 🍕🤔" },
  { icon: "⏰", text: "Bory, времето при testing: 5 минути = 2 часа. Или не. Кой знае? ⏰🌀" },
  { icon: "🔮", text: "Bory, предвиждам че този flow ще бъде... wait, какво казвах? 🔮💨" },
  { icon: "🤔", text: "Bory, ако flow-ът има 3 стъпки... колко flow-a има flow-ът? 🤯🌿" },
  { icon: "💭", text: "Deep thought: CTA бутонът съществува ли или е метафора? 🧘💭" },
  { icon: "😎", text: "Bory, Pro tip: Ако не разбираш flow-а, виновен е flow-ът. Никога ти! 😎✌️" },
  
  // ========== SNOW / SKI JOKES (BG) ==========
  { icon: "⛷️", text: "Bory, готова ли си за ски? Аз съм 'професионалист'… в падането. 😂⛷️" },
  { icon: "❄️", text: "Bory, навън вали сняг… а аз се плъзгам по UX-а като на лед! 🧊😅" },
  { icon: "🏔️", text: "Bory, ако този flow беше писта: Step 1 е синя, Step 2 е червена, Step 3 е 'къде ми е CTA-то' 🤣🎿" },
  { icon: "☕", text: "Bory, топъл чай след тестовете, а после… още 1 flow. Само още 1. Обещавам. 😇❄️" },
  { icon: "🎿", text: "Bory, каращ ски като мен правиш testing: много падания, но накрая стигаш долу! 🎿💪" },
  { icon: "🌨️", text: "Bory, снегът пада, а аз тествам flows. Идеален зимен ден! 🌨️💻" },
  { icon: "🧊", text: "Bory, този loading spinner е като ски лифт: бавен, но стигаш там! 🚡⏳" },
  { icon: "⛄", text: "Bory, направих снежен човек... изглежда като UI на този flow! ⛄🤣" },
  { icon: "🧣", text: "Bory, облечи се топло - тези flows са COOL! 🧣😎" },
  { icon: "🏂", text: "Bory, сноуборд или ски? Аз: и двете... и падам и от двете! 🏂😅" },
  
  // ========== LOVE DECLARATIONS (BG) ==========
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
  { icon: "👑", text: "Bory, ти си моята кралица! Заслужаваш само най-доброто! 👸" },
  { icon: "🍯", text: "По-сладка от мед, по-красива от цвете - това си ти, Bory! 🌸" },
  { icon: "🎵", text: "Bory, гласът ти е любимата ми мелодия. Искам да те слушам завинаги! 🎶" },
  { icon: "☀️", text: "Ти си слънцето в моя живот, Bory. Без теб е тъмно! 🌅" },
  { icon: "🦸‍♂️", text: "За теб, Bory, ще направя всичко. Ти си моята супер сила! 💪❤️" },
  { icon: "🍕", text: "Bory, ти си моята любима... като пицата! Но още повече! 😂❤️" },
  { icon: "☕", text: "Като кафе сутрин - не мога без теб, Bory! ☕❤️" },
  { icon: "🍀", text: "Най-късметлията съм, Bory, защото те имам! Lucky Morris! 🍀" },
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
