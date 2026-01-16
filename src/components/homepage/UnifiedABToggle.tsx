/**
 * Unified A/B Testing Toggle
 * 
 * Combines Navigation A/B Test + Social Proof A/B Test in one compact toggle
 * with tabs to switch between the two test categories
 */

import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, X, Check, Navigation, Sparkles } from 'lucide-react';
import { useState, memo, useCallback } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { useNavigationAB } from '@/contexts/NavigationABContext';
import { NAV_VARIANTS } from '@/lib/navigation-variants';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Social Proof variant info
const socialProofVariants = {
  A: { label: 'V1', title: 'Original', color: 'bg-blue-600' },
  B: { label: 'V2', title: 'Live Dashboard', color: 'bg-emerald-600' },
  C: { label: 'V3', title: 'Trust Hierarchy', color: 'bg-amber-600' },
  D: { label: 'V4', title: 'Trust Stack', color: 'bg-violet-600' },
  E: { label: 'V5', title: 'Trust Strip 2.0', color: 'bg-rose-600' },
};

export const UnifiedABToggle = memo(function UnifiedABToggle() {
  const { variant: spVariant, setVariant: setSPVariant } = useSocialProofAB();
  const { variant: navVariant, setVariant: setNavVariant } = useNavigationAB();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'nav' | 'social'>('nav');
  
  const location = useLocation();

  // Only show on homepage
  if (location.pathname !== '/') {
    return null;
  }

  // Extract navigation variant number (e.g., "1" from "1. Original (Status Quo)")
  const getNavVariantNumber = () => {
    if (!navVariant?.name) return '1';
    const match = navVariant.name.match(/^(\d+)/);
    return match ? match[1] : '1';
  };

  const handleNavVariantChange = useCallback((variantId: string) => {
    setNavVariant(variantId);
  }, [setNavVariant]);

  const handleSPVariantChange = useCallback((sv: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setSPVariant(sv);
  }, [setSPVariant]);

  const currentSPInfo = socialProofVariants[spVariant] || socialProofVariants.A;
  const navVariantNumber = getNavVariantNumber();

  return (
    <div 
      className="fixed z-[90] pointer-events-auto"
      style={{ 
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)',
        left: '16px'
      }}
    >
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[89]"
              onClick={() => setIsExpanded(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-24 left-4 right-4 sm:right-auto sm:w-[380px] bg-background border-2 border-primary rounded-2xl shadow-2xl overflow-hidden z-[90]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-muted/50 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">🧪 A/B Tests</h3>
                    <p className="text-xs text-muted-foreground">Navigation & Social Proof</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)} 
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'nav' | 'social')} className="w-full">
                <TabsList className="w-full grid grid-cols-2 p-1 m-3 mb-0 bg-muted/50">
                  <TabsTrigger value="nav" className="gap-2 text-xs sm:text-sm">
                    <Navigation className="w-4 h-4" />
                    Navigation
                  </TabsTrigger>
                  <TabsTrigger value="social" className="gap-2 text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4" />
                    Social Proof
                  </TabsTrigger>
                </TabsList>

                {/* Navigation Variants */}
                <TabsContent value="nav" className="p-3 pt-2 max-h-[50vh] overflow-y-auto">
                  <div className="space-y-2">
                    {NAV_VARIANTS.slice(0, 8).map((nv) => {
                      const isActive = navVariant?.id === nv.id;
                      const variantNum = nv.name.match(/^(\d+)/)?.[1] || '?';
                      return (
                        <button
                          key={nv.id}
                          onClick={() => handleNavVariantChange(nv.id)}
                          className={cn(
                            "w-full py-2.5 px-3 rounded-lg font-medium text-sm transition-all flex items-center justify-between",
                            isActive 
                              ? "bg-primary text-primary-foreground shadow-lg" 
                              : "bg-muted/50 text-foreground hover:bg-muted"
                          )}
                        >
                          <span className="flex items-center gap-2 text-left">
                            <span className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                              isActive ? "bg-primary-foreground/20" : "bg-muted"
                            )}>
                              {variantNum}
                            </span>
                            <span className="truncate max-w-[180px]">{nv.name.replace(/^\d+\.\s*/, '')}</span>
                          </span>
                          {isActive && <Check className="w-4 h-4 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* More variants hint */}
                  {NAV_VARIANTS.length > 8 && (
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      +{NAV_VARIANTS.length - 8} weitere Varianten via URL
                    </p>
                  )}
                </TabsContent>

                {/* Social Proof Variants */}
                <TabsContent value="social" className="p-3 pt-2 max-h-[50vh] overflow-y-auto">
                  <div className="space-y-2">
                    {(Object.keys(socialProofVariants) as Array<keyof typeof socialProofVariants>).map((sv) => {
                      const info = socialProofVariants[sv];
                      const isActive = spVariant === sv;
                      return (
                        <button
                          key={sv}
                          onClick={() => handleSPVariantChange(sv)}
                          className={cn(
                            "w-full py-2.5 px-3 rounded-lg font-medium text-sm transition-all flex items-center justify-between",
                            isActive 
                              ? `${info.color} text-white shadow-lg` 
                              : "bg-muted/50 text-foreground hover:bg-muted"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <span className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                              isActive ? "bg-white/20" : "bg-muted"
                            )}>
                              {info.label}
                            </span>
                            <span>{info.title}</span>
                          </span>
                          {isActive && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground space-y-1">
                    <div><strong>V1:</strong> Original (farbige Logos)</div>
                    <div><strong>V2:</strong> Live Dashboard + Deal Cards</div>
                    <div><strong>V3:</strong> Trust Hierarchy (Logos oben)</div>
                    <div><strong>V4:</strong> Trust Stack (kompakt)</div>
                    <div><strong>V5:</strong> Trust Strip 2.0 (unified)</div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Floating Toggle Button - Shows both N (Nav) and SP (Social Proof) variants */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2.5 rounded-full shadow-2xl border-2 text-white font-bold transition-all",
          "bg-gradient-to-r from-primary to-primary/80 border-white/30 hover:scale-105"
        )}
        whileTap={{ scale: 0.95 }}
        style={{ 
          boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.2)'
        }}
      >
        <FlaskConical className="w-4 h-4 flex-shrink-0" />
        <span className="text-xs whitespace-nowrap">N{navVariantNumber}</span>
        <span className="text-white/50">|</span>
        <span className="text-xs whitespace-nowrap">SP{currentSPInfo.label}</span>
      </motion.button>
    </div>
  );
});
