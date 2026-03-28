import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Mic, MicOff, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_LINKS = [
  { label: 'Umzugsrechner', path: '/umzugsrechner', icon: '🧮' },
  { label: 'Umzugsfirmen', path: '/umzugsfirmen', icon: '🚚' },
  { label: 'Offerten erhalten', path: '/umzugsofferten', icon: '📋' },
  { label: 'Reinigung', path: '/reinigung', icon: '🧹' },
];

const TRENDING_SEARCHES = [
  'Umzug Zürich',
  'Günstige Umzugsfirma',
  'Umzugskosten berechnen',
  'Reinigung nach Umzug',
];

const RECENT_SEARCHES_KEY = 'umzugscheck_recent_searches';

export const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { isSupported, isListening, interimTranscript, toggleListening } = useVoiceInput({
    language: 'de-CH',
    onResult: (transcript) => {
      setQuery(transcript);
    },
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (interimTranscript) {
      setQuery(interimTranscript);
    }
  }, [interimTranscript]);

  const saveSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    
    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    saveSearch(searchQuery);
    onClose();
    
    // Navigate based on search query
    const lowerQuery = searchQuery.toLowerCase();
    if (lowerQuery.includes('rechner') || lowerQuery.includes('kosten')) {
      navigate('/umzugsrechner');
    } else if (lowerQuery.includes('firma') || lowerQuery.includes('firmen')) {
      navigate('/umzugsfirmen');
    } else if (lowerQuery.includes('offert')) {
      navigate('/umzugsofferten');
    } else if (lowerQuery.includes('reinig')) {
      navigate('/reinigung');
    } else {
      navigate(`/umzugsfirmen?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-background"
        >
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Suchen..."
                  className="w-full h-12 pl-11 pr-12 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {isSupported && (
                  <button
                    onClick={toggleListening}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                      isListening 
                        ? 'bg-destructive text-destructive-foreground' 
                        : 'bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-12 w-12 rounded-xl"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Voice listening indicator */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 flex items-center gap-2 text-sm text-destructive"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
                  </span>
                  Sprachaufnahme aktiv...
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Schnellzugriff</h3>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_LINKS.map((link) => (
                  <motion.button
                    key={link.path}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onClose();
                      navigate(link.path);
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-left"
                  >
                    <span className="text-2xl">{link.icon}</span>
                    <span className="font-medium text-foreground">{link.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Letzte Suchen
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Löschen
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSearch(search)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="text-foreground">{search}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4" />
                Beliebte Suchen
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((search) => (
                  <motion.button
                    key={search}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSearch(search)}
                    className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSearchOverlay;
