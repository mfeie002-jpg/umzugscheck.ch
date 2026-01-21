/**
 * Unified A/B Testing Toggle
 * 
 * Combines Navigation A/B Test + Social Proof A/B Test + Hero Tab Hints + Homepage Hero
 * in one compact toggle with tabs to switch between the test categories
 */

import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, X, Check, Navigation, Sparkles, MousePointerClick, LayoutTemplate } from 'lucide-react';
import { useState, memo, useCallback } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { useNavigationAB } from '@/contexts/NavigationABContext';
import { useTabHintAB, TabHintVariant } from '@/contexts/TabHintABContext';
import { useHomepageAB, HomepageVariant } from '@/contexts/HomepageABContext';
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

// Tab Hint variant info
const tabHintVariants: Record<TabHintVariant, { label: string; title: string; color: string }> = {
  default: { label: '1', title: 'Kein Hint (Standard)', color: 'bg-slate-600' },
  A: { label: '2', title: 'ODER-Trennlinie', color: 'bg-blue-600' },
  B: { label: '3', title: 'Pulsing Hint', color: 'bg-emerald-600' },
  C: { label: '4', title: 'Label oben', color: 'bg-amber-600' },
  D: { label: '5', title: 'Badge Alternativen', color: 'bg-violet-600' },
};

// Homepage Hero variant info
const homepageVariants: Record<HomepageVariant, { label: string; title: string; color: string; description: string }> = {
  A: { label: 'A', title: 'Original (Split)', color: 'bg-blue-600', description: 'Split-Layout mit Form rechts' },
  B: { label: 'B', title: 'Premium (4 Tabs)', color: 'bg-amber-600', description: 'IndexPremium mit 4 Tab-Optionen' },
  C: { label: 'C', title: 'SmartRouter', color: 'bg-emerald-600', description: 'PLZ-first Wizard (aktuell)' },
};

export const UnifiedABToggle = memo(function UnifiedABToggle() {
  const { variant: spVariant, setVariant: setSPVariant } = useSocialProofAB();
  const { variant: navVariant, setVariant: setNavVariant } = useNavigationAB();
  const { variant: homepageVariant, setVariant: setHomepageVariant } = useHomepageAB();
  
  // Tab Hint A/B - handle case where provider might not exist
  let tabHintVariant: TabHintVariant = 'default';
  let setTabHintVariant: ((v: TabHintVariant) => void) | null = null;
  
  try {
    const tabHintContext = useTabHintAB();
    tabHintVariant = tabHintContext.variant;
    setTabHintVariant = tabHintContext.setVariant;
  } catch {
    // Context not available - use default
  }
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'homepage' | 'nav' | 'social' | 'hero'>('homepage');
  
  const location = useLocation();

  const handleNavVariantChange = useCallback((variantId: string) => {
    setNavVariant(variantId);
  }, [setNavVariant]);

  const handleSPVariantChange = useCallback((sv: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setSPVariant(sv);
  }, [setSPVariant]);

  const handleTabHintChange = useCallback((v: TabHintVariant) => {
    if (setTabHintVariant) {
      setTabHintVariant(v);
    }
  }, [setTabHintVariant]);

  const handleHomepageChange = useCallback((v: HomepageVariant) => {
    setHomepageVariant(v);
  }, [setHomepageVariant]);

  // Extract navigation variant number (e.g., "1" from "1. Original (Status Quo)")
  const getNavVariantNumber = () => {
    if (!navVariant?.name) return '1';
    const match = navVariant.name.match(/^(\d+)/);
    return match ? match[1] : '1';
  };

  const currentSPInfo = socialProofVariants[spVariant] || socialProofVariants.A;
  const currentTabHintInfo = tabHintVariants[tabHintVariant] || tabHintVariants.default;
  const currentHomepageInfo = homepageVariants[homepageVariant] || homepageVariants.C;
  const navVariantNumber = getNavVariantNumber();

  // Only show in development/preview mode, never in production
  const isProduction = window.location.hostname === 'umzugscheck.ch' || 
                       window.location.hostname === 'www.umzugscheck.ch' ||
                       window.location.hostname === 'umzugscheckv2.lovable.app';
  
  // Only show on homepage AND only in development
  if (location.pathname !== '/' || isProduction) {
    return null;
  }

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
              className="fixed bottom-24 left-4 right-4 sm:right-auto sm:w-[400px] bg-background border-2 border-primary rounded-2xl shadow-2xl overflow-hidden z-[90]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-muted/50 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">🧪 A/B Tests</h3>
                    <p className="text-xs text-muted-foreground">Navigation, Social Proof & Hero</p>
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
              <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'homepage' | 'nav' | 'social' | 'hero')} className="w-full">
                <TabsList className="w-full grid grid-cols-4 p-1 m-3 mb-0 bg-muted/50">
                  <TabsTrigger value="homepage" className="gap-1 text-[10px] px-1">
                    <LayoutTemplate className="w-3 h-3" />
                    Hero
                  </TabsTrigger>
                  <TabsTrigger value="nav" className="gap-1 text-[10px] px-1">
                    <Navigation className="w-3 h-3" />
                    Nav
                  </TabsTrigger>
                  <TabsTrigger value="social" className="gap-1 text-[10px] px-1">
                    <Sparkles className="w-3 h-3" />
                    Social
                  </TabsTrigger>
                  <TabsTrigger value="hero" className="gap-1 text-[10px] px-1">
                    <MousePointerClick className="w-3 h-3" />
                    Tabs
                  </TabsTrigger>
                </TabsList>

                {/* Homepage Hero Variants - NEW */}
                <TabsContent value="homepage" className="p-3 pt-2 max-h-[50vh] overflow-y-auto">
                  <div className="space-y-2">
                    {(Object.keys(homepageVariants) as HomepageVariant[]).map((hv) => {
                      const info = homepageVariants[hv];
                      const isActive = homepageVariant === hv;
                      return (
                        <button
                          key={hv}
                          onClick={() => handleHomepageChange(hv)}
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
                            <div className="text-left">
                              <div>{info.title}</div>
                              <div className="text-[10px] opacity-70">{info.description}</div>
                            </div>
                          </span>
                          {isActive && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground space-y-1">
                    <div><strong>A:</strong> Original - Split mit Formular rechts (Screenshot)</div>
                    <div><strong>B:</strong> Premium - 4 Tabs (Formular/Video/Chat/WA)</div>
                    <div><strong>C:</strong> SmartRouter - PLZ-first Wizard</div>
                  </div>
                </TabsContent>

                {/* Navigation Variants */}
                <TabsContent value="nav" className="p-3 pt-2 max-h-[50vh] overflow-y-auto">
                  <div className="space-y-2">
                    {NAV_VARIANTS.map((nv) => {
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

                {/* Hero Tab Hints */}
                <TabsContent value="hero" className="p-3 pt-2 max-h-[50vh] overflow-y-auto">
                  <div className="space-y-2">
                    {(Object.keys(tabHintVariants) as TabHintVariant[]).map((thv) => {
                      const info = tabHintVariants[thv];
                      const isActive = tabHintVariant === thv;
                      return (
                        <button
                          key={thv}
                          onClick={() => handleTabHintChange(thv)}
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
                    <div><strong>1:</strong> Standard - keine Hinweise</div>
                    <div><strong>2:</strong> "ODER"-Linie unterhalb Tabs</div>
                    <div><strong>3:</strong> Puls + "Klicken für andere Methoden"</div>
                    <div><strong>4:</strong> "Eine Methode wählen" Label oben</div>
                    <div><strong>5:</strong> "3 Alternativen" Badge</div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Floating Toggle Button - Shows Hero, N (Nav), SP (Social Proof), and TH (Tab Hint) variants */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center gap-1 px-2.5 py-2 rounded-full shadow-2xl border-2 text-white font-bold transition-all",
          "bg-gradient-to-r from-primary to-primary/80 border-white/30 hover:scale-105"
        )}
        whileTap={{ scale: 0.95 }}
        style={{ 
          boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.2)'
        }}
      >
        <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-[10px] whitespace-nowrap">H{currentHomepageInfo.label}</span>
        <span className="text-white/40">·</span>
        <span className="text-[10px] whitespace-nowrap">N{navVariantNumber}</span>
        <span className="text-white/40">·</span>
        <span className="text-[10px] whitespace-nowrap">S{currentSPInfo.label}</span>
      </motion.button>
    </div>
  );
});
