import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, X, Home, Building2, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackConversion } from '@/lib/conversionTracker';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  link: string;
  icon: React.ElementType;
  color: string;
}

const allRecommendations: Recommendation[] = [
  {
    id: 'private',
    title: 'Privatumzug',
    description: 'Stressfreier Umzug für Ihr Zuhause',
    link: '/plan/private',
    icon: Home,
    color: 'bg-alpine',
  },
  {
    id: 'office',
    title: 'Büroumzug',
    description: 'Professioneller Firmenumzug',
    link: '/plan/office',
    icon: Building2,
    color: 'bg-forest',
  },
  {
    id: 'senior',
    title: 'Seniorenumzug',
    description: 'Einfühlsamer Service für Senioren',
    link: '/plan/senior',
    icon: Users,
    color: 'bg-warm',
  },
  {
    id: 'express',
    title: 'Express-Umzug',
    description: 'Kurzfristige Termine verfügbar',
    link: '/contact',
    icon: Clock,
    color: 'bg-alpine',
  },
];

const PersonalizedRecommendations = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const wasDismissed = sessionStorage.getItem('recommendations-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Get browsing history from localStorage
    const visitedPages = JSON.parse(localStorage.getItem('visited-pages') || '[]');
    
    // Personalize recommendations based on behavior
    let personalizedRecs = [...allRecommendations];
    
    // If user visited calculator, prioritize cost-related content
    if (visitedPages.includes('/calculator')) {
      personalizedRecs = personalizedRecs.filter(r => r.id !== 'express');
    }
    
    // Shuffle and pick 2-3 recommendations
    const shuffled = personalizedRecs.sort(() => Math.random() - 0.5);
    setRecommendations(shuffled.slice(0, 3));

    // Show after scrolling 50% of the page
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 40 && !isVisible && !dismissed) {
        setIsVisible(true);
        trackConversion('recommendation_shown');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, dismissed]);

  // Track visited pages
  useEffect(() => {
    const visitedPages = JSON.parse(localStorage.getItem('visited-pages') || '[]');
    const currentPath = window.location.pathname;
    if (!visitedPages.includes(currentPath)) {
      visitedPages.push(currentPath);
      localStorage.setItem('visited-pages', JSON.stringify(visitedPages.slice(-10)));
    }
  }, []);

  const handleDismiss = () => {
    trackConversion('recommendation_dismissed');
    setIsVisible(false);
    setDismissed(true);
    sessionStorage.setItem('recommendations-dismissed', 'true');
  };

  const handleRecommendationClick = (rec: Recommendation) => {
    trackConversion('recommendation_clicked', { 
      id: rec.id, 
      title: rec.title, 
      link: rec.link 
    });
    handleDismiss();
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 right-4 z-40 w-80 hidden lg:block"
        >
          <div className="bg-card border rounded-2xl shadow-strong overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-alpine to-primary p-4 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">Für Sie empfohlen</span>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 space-y-3">
              {recommendations.map((rec, index) => {
                const Icon = rec.icon;
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={rec.link}
                      onClick={() => handleRecommendationClick(rec)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className={`p-2 rounded-lg ${rec.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{rec.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{rec.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={handleDismiss}
                asChild
              >
                <Link to="/contact">
                  Kostenlose Beratung
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersonalizedRecommendations;