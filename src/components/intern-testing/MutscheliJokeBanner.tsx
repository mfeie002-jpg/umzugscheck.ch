/**
 * Random Mutscheli Joke Banner - Bulgarian Only
 * Shows random jokes that rotate on each render/refresh
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, X, Crown, Star, Heart } from "lucide-react";

// All Mutscheli jokes - she's never wrong, always has excuses, lives in the past
// Plus Morris jokes - the hero, the love, the big boss, the Einstein!
const MUTSCHELI_JOKES = [
  // Mutscheli classics
  { icon: "🚗", text: "Защо Mutscheli кара Мерцедес? Защото другите коли не издържат колко много говори!" },
  { icon: "👱‍♀️", text: "Mutscheli има extensions... и за косата, и за извиненията си!" },
  { icon: "😴", text: "Mutscheli спи 12 часа на ден. Другите 12 часа търси извинения защо е спала толкова." },
  { icon: "🍳", text: "Mutscheli е готвач... готви планове които никога не се случват!" },
  { icon: "💬", text: "ADHD? Не, Mutscheli просто има твърде много интересни мисли... за миналото!" },
  { icon: "🚬", text: "Mutscheli пуши за здраве - казва че релаксира. После пие за стреса от пушенето!" },
  { icon: "💸", text: "Mutscheli е на минус? Не е минус, само временно отрицателен баланс с план за утре!" },
  { icon: "👂", text: "Mutscheli не може да слуша? Не, тя просто чува само важните неща... от 2019!" },
  { icon: "🍷", text: "Една чаша вино помага. Втората още повече. Третата... какво питаше?" },
  { icon: "💕", text: "Mutscheli е най-сладкото същество... особено когато има нужда от услуга!" },
  { icon: "📱", text: "Братът на Mutscheli се обажда. Тя: 'Имам среща!' (лежи на дивана)" },
  { icon: "🛏️", text: "'Ставам в 7!' - Mutscheli, всяка вечер в 2 сутринта." },
  { icon: "💇‍♀️", text: "Extensionsите на Mutscheli имат повече живот от плановете ѝ!" },
  { icon: "🇧🇬", text: "Какво е общото между Mutscheli и българската икономика? И двете живеят на кредит!" },
  { icon: "❤️", text: "Mutscheli е моята приятелка и я обичам... дори когато разказва за 2017 пак!" },
  // "Never wrong" jokes
  { icon: "👑", text: "Mutscheli никога не греши. Просто всички други са грешни!" },
  { icon: "🎯", text: "'Аз ти казах!' - Mutscheli, за всичко, винаги, дори когато не е казала." },
  { icon: "🤔", text: "Mutscheli: 'Не е моя грешка.' Наратор: Беше нейна грешка." },
  { icon: "📚", text: "Историята се пише от победителите. Mutscheli си я пише сама." },
  { icon: "🔮", text: "Mutscheli не прави грешки. Тя прави 'алтернативни решения'." },
  { icon: "🎭", text: "'Аз знаех че ще стане така!' - Mutscheli, след като стана обратното." },
  { icon: "💅", text: "Mutscheli не закъснява. Всички други просто пристигат твърде рано." },
  { icon: "🌟", text: "Грешките са за обикновените хора. Mutscheli е специална!" },
  { icon: "🏆", text: "Mutscheli: Кралицата на извиненията от 1995!" },
  { icon: "🎪", text: "Цирк? Не, това е просто Mutscheli която обяснява защо не е виновна." },
  { icon: "⏰", text: "Часовникът на Mutscheli работи перфектно. Просто показва 2019." },
  { icon: "🍕", text: "Mutscheli готви най-добре! Особено когато другите готвят." },
  { icon: "💤", text: "Mutscheli не спи много. Тя просто 'възстановява енергията' 14 часа." },
  { icon: "🚀", text: "Mutscheli е винаги права. Дори когато не е. Особено тогава." },
  { icon: "🎶", text: "Mutscheli не говори много. Просто другите слушат малко!" },
  
  // MORRIS - The Hero, The Love, The Big Boss, The Einstein! 💪
  { icon: "🦸‍♂️", text: "Кой е героят на Mutscheli? MORRIS! Единственият, който я търпи! 💪" },
  { icon: "❤️‍🔥", text: "Morris е любовта на Mutscheli. Той е най-добрият! THE BEST! 🏆" },
  { icon: "👔", text: "Big Boss Morris! Когато той говори, дори Mutscheli слуша... понякога." },
  { icon: "🧠", text: "Morris = Einstein 2.0! Толкова умен, че разбира какво казва Mutscheli!" },
  { icon: "💎", text: "Кой е най-милият? MORRIS! Дори когато Mutscheli има 100 извинения!" },
  { icon: "🤴", text: "Morris - The Biggest Dealer! Дава на Mutscheli любов на кредит! 💕" },
  { icon: "🌍", text: "Mutscheli: 'Аз съм най-добрата!' Morris: 'Да, златце.' (Big Boss Energy)" },
  { icon: "💘", text: "Morris + Mutscheli = ❤️ Той е нейният герой, дори когато тя забравя!" },
  { icon: "🎖️", text: "Morris - Герой на Mutscheli! Издържа повече от Мерцедеса!" },
  { icon: "🏅", text: "Кой е THE BOSS? Morris! Mutscheli само мисли че е тя! 😉" },
  { icon: "🧲", text: "Morris е магнит за любов! Mutscheli каза... преди 5 години." },
  { icon: "👑", text: "Morris - Кралят! Mutscheli е кралица, но той е Big Boss!" },
  { icon: "🔥", text: "Morris е толкова hot, че дори extensions-ите на Mutscheli се топят!" },
  { icon: "💪", text: "Кой търпи Mutscheli 24/7? Само Morris! Истински герой! 🦸‍♂️" },
  { icon: "🎁", text: "Morris дава най-добрите подаръци: търпение и любов... и пари за кредитите!" },
  { icon: "🌹", text: "Morris е романтик! Обича Mutscheli дори когато тя говори за 2015!" },
  { icon: "⭐", text: "5 звезди за Morris! Най-добрият boyfriend! The Einstein of Love!" },
  { icon: "🎯", text: "Morris никога не греши. За разлика от... о, чакай, Mutscheli също не греши! 😏" },
  { icon: "💑", text: "Mutscheli + Morris = Perfect Match! Той слуша, тя говори... много!" },
  { icon: "🦁", text: "Morris - Big Boss Lion! Mutscheli е неговата малка... много говореща котка!" },
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
  const [jokeIndex, setJokeIndex] = useState(() => Math.floor(Math.random() * MUTSCHELI_JOKES.length));
  const [isVisible, setIsVisible] = useState(true);

  const currentJoke = useMemo(() => MUTSCHELI_JOKES[jokeIndex], [jokeIndex]);

  // Auto-rotate jokes
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setJokeIndex(prev => (prev + 1) % MUTSCHELI_JOKES.length);
    }, rotateInterval);
    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval]);

  const nextJoke = () => {
    setJokeIndex(prev => (prev + 1) % MUTSCHELI_JOKES.length);
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
