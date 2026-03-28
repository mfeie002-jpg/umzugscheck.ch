import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useHaptic } from '@/hooks/use-haptic';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
  onResult: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  language?: string;
}

export const VoiceInputButton = ({
  onResult,
  className,
  size = 'md',
  language = 'de-CH',
}: VoiceInputButtonProps) => {
  const { trigger } = useHaptic();
  const {
    isSupported,
    isListening,
    interimTranscript,
    error,
    toggleListening,
  } = useVoiceInput({
    language,
    onResult: (text) => {
      trigger('success');
      onResult(text);
    },
  });

  if (!isSupported) return null;

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => {
          trigger('medium');
          toggleListening();
        }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          'rounded-full flex items-center justify-center transition-colors',
          isListening 
            ? 'bg-red-500 text-white' 
            : 'bg-muted hover:bg-muted/80 text-foreground',
          sizes[size],
          className
        )}
        aria-label={isListening ? 'Spracherkennung stoppen' : 'Spracherkennung starten'}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative"
            >
              <MicOff className={iconSizes[size]} />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic className={iconSizes[size]} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Interim transcript tooltip */}
      <AnimatePresence>
        {isListening && interimTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-sm rounded-lg whitespace-nowrap max-w-[200px] truncate"
          >
            {interimTranscript}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error tooltip */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-destructive text-destructive-foreground text-xs rounded-lg whitespace-nowrap"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
