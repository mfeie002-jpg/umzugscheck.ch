/**
 * Stakeholder Joke Banner - BG & IT Only
 * Shows funny stoner/weed jokes for Bulgarian and Italian stakeholder pages
 * Used on /vision, /family, /investoren when language is BG or IT
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Cannabis } from 'lucide-react';
import { 
  getRandomBulgarianJoke, 
  getRandomItalianJoke,
  bulgarianWeedJokes,
  italianWeedJokes 
} from '@/data/stakeholderWeedJokes';

interface StakeholderJokeBannerProps {
  language: 'bg' | 'it';
  variant?: 'compact' | 'full' | 'floating';
  className?: string;
}

export function StakeholderJokeBanner({ 
  language, 
  variant = 'compact',
  className = '' 
}: StakeholderJokeBannerProps) {
  const [currentJoke, setCurrentJoke] = useState('');
  const [jokeIndex, setJokeIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const jokes = language === 'bg' ? bulgarianWeedJokes : italianWeedJokes;
  const getRandomJoke = language === 'bg' ? getRandomBulgarianJoke : getRandomItalianJoke;

  useEffect(() => {
    setCurrentJoke(getRandomJoke());
  }, [language]);

  const nextJoke = () => {
    setIsSpinning(true);
    const newIndex = (jokeIndex + 1) % jokes.length;
    setJokeIndex(newIndex);
    setCurrentJoke(jokes[newIndex]);
    setTimeout(() => setIsSpinning(false), 300);
  };

  const randomJoke = () => {
    setIsSpinning(true);
    setCurrentJoke(getRandomJoke());
    setTimeout(() => setIsSpinning(false), 300);
  };

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed bottom-4 right-4 z-50 max-w-sm ${className}`}
      >
        <div className="bg-gradient-to-r from-green-500/90 to-emerald-600/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-green-400/30">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Cannabis className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentJoke}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-white text-sm leading-relaxed"
                >
                  {currentJoke}
                </motion.p>
              </AnimatePresence>
              <button
                onClick={randomJoke}
                className="mt-2 text-white/70 hover:text-white text-xs flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isSpinning ? 'animate-spin' : ''}`} />
                {language === 'bg' ? 'Друг виц' : 'Altra battuta'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'full') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl p-6 shadow-xl ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Cannabis className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {language === 'bg' ? '🌿 Зелена Мъдрост' : '🌿 Saggezza Verde'}
              </h3>
              <p className="text-white/70 text-sm">
                {language === 'bg' ? `${jokes.length} вица за добро настроение` : `${jokes.length} battute per buon umore`}
              </p>
            </div>
          </div>
          <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 min-h-[100px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentJoke}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-white text-lg leading-relaxed"
            >
              "{currentJoke}"
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={nextJoke}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            {language === 'bg' ? 'Следващ' : 'Prossima'} →
          </button>
          <button
            onClick={randomJoke}
            className="bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <p className="text-center text-white/50 text-xs mt-3">
          #{jokeIndex + 1} / {jokes.length}
        </p>
      </motion.div>
    );
  }

  // Compact variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <Cannabis className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentJoke}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-foreground/80 text-sm leading-relaxed"
            >
              {currentJoke}
            </motion.p>
          </AnimatePresence>
        </div>
        <button
          onClick={randomJoke}
          className="text-green-500 hover:text-green-400 transition-colors flex-shrink-0"
          title={language === 'bg' ? 'Друг виц' : 'Altra battuta'}
        >
          <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </motion.div>
  );
}

// Scrolling jokes marquee for hero sections
export function StakeholderJokesMarquee({ 
  language 
}: { 
  language: 'bg' | 'it' 
}) {
  const jokes = language === 'bg' ? bulgarianWeedJokes : italianWeedJokes;
  const displayJokes = jokes.slice(0, 10); // Show first 10 in marquee

  return (
    <div className="overflow-hidden py-3 bg-gradient-to-r from-green-500/5 via-emerald-500/10 to-green-500/5">
      <motion.div
        animate={{ x: [0, -2000] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 60,
            ease: "linear",
          },
        }}
        className="flex gap-8 whitespace-nowrap"
      >
        {[...displayJokes, ...displayJokes].map((joke, i) => (
          <span key={i} className="text-green-600/70 text-sm flex items-center gap-2">
            <Cannabis className="w-4 h-4 text-green-500" />
            {joke}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// Grid of jokes for sections
export function StakeholderJokesGrid({ 
  language,
  count = 6 
}: { 
  language: 'bg' | 'it';
  count?: number;
}) {
  const jokes = language === 'bg' ? bulgarianWeedJokes : italianWeedJokes;
  const displayJokes = jokes.slice(0, count);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayJokes.map((joke, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl p-4"
        >
          <div className="flex items-start gap-2">
            <span className="text-green-500 text-lg">🌿</span>
            <p className="text-foreground/80 text-sm leading-relaxed">
              {joke}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default StakeholderJokeBanner;
