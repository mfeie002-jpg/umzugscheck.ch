/**
 * Kiffer Joke Banner - Italian Only
 * Shows funny stoner/weed jokes for Italian testers
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, X, Leaf, Sparkles, Coffee, Pizza } from "lucide-react";

// Kiffer jokes for Italian testers 🌿
const KIFFER_JOKES = [
  // Classic kiffer jokes
  { icon: "🌿", text: "Perché il kiffer non finisce mai i test? Perché ogni volta ricomincia da capo! 😂" },
  { icon: "💨", text: "Un kiffer entra in un flusso... e si perde al primo step. Normale martedì! 🤷‍♂️" },
  { icon: "🍕", text: "Testing tip: Prima pizza, poi test. L'ordine è importante! 🍕✨" },
  { icon: "😴", text: "Il kiffer dice: 'Questo flusso è troppo veloce... o sono io troppo lento?' 🐌" },
  { icon: "🌙", text: "Ore 3 di notte: 'Forse dovrei testare ancora un flusso...' - Nessun kiffer mai 😂" },
  { icon: "🎯", text: "Obiettivo del giorno: Finire 10 flussi. Realtà: Guardare il pulsante per 10 minuti. 👀" },
  { icon: "☕", text: "Caffè + erba = Test perfetti? La scienza non conferma, ma noi sì! ☕🌿" },
  { icon: "🧠", text: "Il kiffer: 'Ho avuto un'idea geniale per il UX!' *dimentica immediatamente* 💭" },
  { icon: "🔄", text: "Kiffer testing loop: Apri flusso → Distratto → Riapri flusso → Repeat 🔁" },
  { icon: "🌈", text: "I colori di questo flusso sono bellissimi... o sono io? 🌈✨" },
  
  // Food & munchies related
  { icon: "🍪", text: "Pausa snack tra ogni step. È la regola non scritta del testing! 🍪" },
  { icon: "🍔", text: "Questo pulsante sembra un hamburger... No aspetta, ho fame. 🍔" },
  { icon: "🧀", text: "Rating: 5 stelle perché il form mi ha ricordato il formaggio. Logica! 🧀⭐" },
  { icon: "🍫", text: "Cioccolato migliora la concentrazione. Fonte: Fidati bro! 🍫" },
  { icon: "🥤", text: "Bocca secca al test 5... Coincidenza? Non credo! 😏" },
  
  // Philosophy mode
  { icon: "🤔", text: "Ma se il flusso ha 3 step... quanti flussi ha il flusso? 🤯" },
  { icon: "💭", text: "Deep thought: Il pulsante CTA esiste davvero o è una metafora? 🧘" },
  { icon: "🌀", text: "Sto testando il flusso o il flusso sta testando me? 🌀" },
  { icon: "⏰", text: "Il tempo durante il testing: 5 minuti = 2 ore. O forse no. Chi lo sa? ⏰" },
  { icon: "🔮", text: "Prevedo che questo flusso sarà... wait, cosa stavo dicendo? 🔮" },
  
  // Italian lifestyle
  { icon: "🇮🇹", text: "Testing italiano: Espresso, flusso, siesta, repeat! ☕😴" },
  { icon: "👨‍🍳", text: "Come la mamma fa la pasta, io faccio i test: con amore e confusione! 🍝" },
  { icon: "🛵", text: "Veloce come una Vespa! *procede a 2 km/h* 🛵💨" },
  { icon: "🏖️", text: "Dopo questo test, me lo merito: Spritz time! 🍹" },
  { icon: "🎭", text: "Drama italiano: 'Mamma mia, questo flusso è INCREDIBILE!' *1 stella* 🎭" },
  
  // Self-aware humor
  { icon: "😎", text: "Pro tip: Se non capisci il flusso, è colpa del flusso. Mai tua! 😎" },
  { icon: "🎪", text: "Testing circus: Io = 🤡, Flusso = 🎯, Risultato = 🎉" },
  { icon: "📱", text: "Ho cliccato 47 volte sullo stesso pulsante. Per sicurezza. 📱👆" },
  { icon: "🎮", text: "Se il testing fosse un videogioco, sarei al livello 'facile'... per errore! 🎮" },
  { icon: "🌿", text: "Remember: Test responsibly! *non segue il proprio consiglio* 🌿😂" },
];

interface KifferJokeBannerProps {
  variant?: "top" | "bottom" | "floating";
  autoRotate?: boolean;
  rotateInterval?: number;
  onClose?: () => void;
  className?: string;
}

export function KifferJokeBanner({
  variant = "top",
  autoRotate = true,
  rotateInterval = 15000,
  onClose,
  className = ""
}: KifferJokeBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(() => 
    Math.floor(Math.random() * KIFFER_JOKES.length)
  );
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentJoke = useMemo(() => KIFFER_JOKES[currentIndex], [currentIndex]);

  // Auto-rotate jokes
  useEffect(() => {
    if (!autoRotate || !isVisible) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % KIFFER_JOKES.length);
        setIsAnimating(false);
      }, 300);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, isVisible]);

  const nextJoke = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % KIFFER_JOKES.length);
      setIsAnimating(false);
    }, 200);
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const baseStyles = {
    top: "w-full",
    bottom: "w-full",
    floating: "fixed bottom-20 left-4 right-4 z-40 max-w-lg mx-auto"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: variant === "bottom" ? 20 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: variant === "bottom" ? 20 : -20 }}
      className={`${baseStyles[variant]} ${className}`}
    >
      <div className="bg-gradient-to-r from-green-600/90 via-emerald-600/90 to-teal-600/90 backdrop-blur-sm border-y border-green-400/30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          {/* Icon */}
          <motion.div 
            className="flex-shrink-0 text-2xl"
            animate={{ 
              rotate: [0, -10, 10, -5, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3 
            }}
          >
            {currentJoke.icon}
          </motion.div>

          {/* Joke Text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isAnimating ? 0.5 : 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 text-white/95 text-sm font-medium leading-snug"
            >
              {currentJoke.text}
            </motion.p>
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={nextJoke}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
              title="Prossima battuta"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
              title="Chiudi"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Achievement toast for Italian - Kiffer style
export interface KifferAchievement {
  icon: string;
  title: string;
  subtitle: string;
}

const KIFFER_ACHIEVEMENTS: Record<string, KifferAchievement> = {
  firstFlow: {
    icon: "🌿",
    title: "Primo flusso! Non male!",
    subtitle: "Il viaggio di mille flussi inizia con un click 🚀"
  },
  halfWay: {
    icon: "🍕",
    title: "Metà strada! Pizza time!",
    subtitle: "5/10 completati - Meriti uno snack! 🎉"
  },
  speedster: {
    icon: "⚡",
    title: "Velocissimo! Come il vento!",
    subtitle: "Sotto 2 min - Sei un fulmine! 💨"
  },
  critic: {
    icon: "🧠",
    title: "Filosofo del UX!",
    subtitle: "Feedback profondo - Deep thoughts! 💭"
  },
  complete: {
    icon: "👑",
    title: "LEGGENDA! Tutti i 10!",
    subtitle: "Sei il re/regina del testing! 🏆🌿"
  }
};

export function getKifferAchievement(type: string): KifferAchievement | null {
  return KIFFER_ACHIEVEMENTS[type] || null;
}

export function KifferAchievementToast({ 
  achievement, 
  onClose 
}: { 
  achievement: KifferAchievement; 
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [achievement.title]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-sm"
    >
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl p-4 shadow-2xl shadow-green-500/30 flex items-center gap-3 border border-green-300/30">
        <motion.div 
          className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl"
          animate={{ 
            rotate: [0, -5, 5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {achievement.icon}
        </motion.div>
        <div className="flex-1">
          <div className="text-white/80 text-xs font-medium flex items-center gap-1">
            <Leaf size={12} /> Achievement Unlocked!
          </div>
          <div className="text-white font-bold text-lg">{achievement.title}</div>
          <div className="text-white/70 text-xs">{achievement.subtitle}</div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </motion.div>
  );
}