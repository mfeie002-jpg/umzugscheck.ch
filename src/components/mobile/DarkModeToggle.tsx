import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useHaptic } from '@/hooks/use-haptic';

export const DarkModeToggle = () => {
  const { theme, setTheme, isDark } = useDarkMode();
  const { trigger } = useHaptic();

  const modes = [
    { value: 'light' as const, icon: Sun, label: 'Hell' },
    { value: 'dark' as const, icon: Moon, label: 'Dunkel' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-full">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => {
            trigger('light');
            setTheme(mode.value);
          }}
          className="relative p-2 rounded-full"
        >
          {theme === mode.value && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-background rounded-full shadow-sm"
            />
          )}
          <mode.icon 
            className={`w-4 h-4 relative z-10 ${
              theme === mode.value ? 'text-foreground' : 'text-muted-foreground'
            }`} 
          />
        </button>
      ))}
    </div>
  );
};

// Simple toggle version
export const DarkModeSimpleToggle = () => {
  const { toggleTheme, isDark } = useDarkMode();
  const { trigger } = useHaptic();

  return (
    <button
      onClick={() => {
        trigger('light');
        toggleTheme();
      }}
      className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.div>
    </button>
  );
};
