/**
 * Navigation Variant Switcher
 * 
 * Floating UI to switch between 5 navigation variants for A/B testing
 * Shows on homepage for easy comparison
 */

import { useState, useEffect } from "react";
import { 
  Settings2, 
  X, 
  Check, 
  Monitor, 
  Smartphone,
  ChevronDown,
  Beaker
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  NAV_VARIANTS, 
  getActiveVariant, 
  setActiveVariant,
  type NavConfig,
  type NavVariant 
} from "@/lib/navigation-variants";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface NavigationVariantSwitcherProps {
  showOnlyOnHome?: boolean;
}

export const NavigationVariantSwitcher = ({ showOnlyOnHome = true }: NavigationVariantSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeVariant, setActiveVariantState] = useState<NavConfig>(getActiveVariant());
  const location = useLocation();

  // Update active variant when component mounts
  useEffect(() => {
    setActiveVariantState(getActiveVariant());
  }, []);

  // Only show on homepage if showOnlyOnHome is true
  if (showOnlyOnHome && location.pathname !== '/') {
    return null;
  }

  const handleVariantChange = (variant: NavVariant) => {
    setActiveVariant(variant);
  };

  return (
    <>
      {/* Floating Toggle Button - Bottom Left */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-20 left-4 z-[60]",
          "flex items-center gap-2 px-4 py-3 rounded-full",
          "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",
          "shadow-lg hover:shadow-xl",
          "transition-all hover:scale-105",
          "border-2 border-primary-foreground/20"
        )}
        title="Navigation Varianten testen"
      >
        <Beaker className="w-5 h-5" />
        <span className="text-sm font-semibold hidden sm:inline">A/B Test</span>
        <Badge variant="secondary" className="text-[10px] bg-secondary text-secondary-foreground">
          {activeVariant.name.split('.')[0]}
        </Badge>
      </button>

      {/* Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => setIsOpen(false)}
          />

          {/* Switcher Panel */}
          <div className={cn(
            "fixed bottom-0 left-0 right-0 z-[101]",
            "bg-background border-t-2 border-primary",
            "rounded-t-3xl shadow-2xl",
            "max-h-[85vh] overflow-hidden",
            "animate-in slide-in-from-bottom duration-300"
          )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Beaker className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Navigation A/B Test</h3>
                  <p className="text-sm text-muted-foreground">
                    5 Varianten vergleichen auf Desktop & Mobile
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Device Toggle */}
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      previewMode === 'desktop' 
                        ? "bg-background shadow-sm text-primary" 
                        : "hover:bg-background/50 text-muted-foreground"
                    )}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      previewMode === 'mobile' 
                        ? "bg-background shadow-sm text-primary" 
                        : "hover:bg-background/50 text-muted-foreground"
                    )}
                    title="Mobile Preview"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-10 w-10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Variants List */}
            <div className="p-4 overflow-y-auto max-h-[65vh]">
              <div className="space-y-3">
                {NAV_VARIANTS.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    isActive={activeVariant.id === variant.id}
                    previewMode={previewMode}
                    onSelect={() => handleVariantChange(variant.id)}
                  />
                ))}
              </div>

              {/* URL Hint */}
              <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span>💡</span> Direktlinks für Tests:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {NAV_VARIANTS.map(v => (
                    <div key={v.id} className="flex items-center gap-2 p-2 bg-background rounded-lg">
                      <code className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">
                        ?nav={v.id}
                      </code>
                      <span className="text-muted-foreground truncate">{v.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Variant Card Component
interface VariantCardProps {
  variant: NavConfig;
  isActive: boolean;
  previewMode: 'desktop' | 'mobile';
  onSelect: () => void;
}

const VariantCard = ({ variant, isActive, previewMode, onSelect }: VariantCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      "border-2 rounded-xl overflow-hidden transition-all",
      isActive 
        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
        : "border-border hover:border-primary/50 bg-background"
    )}>
      {/* Card Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {isActive ? (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <Check className="w-4 h-4 text-primary-foreground" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
              {variant.name.split('.')[0]}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{variant.name}</h4>
              {isActive && (
                <Badge className="text-[10px] bg-primary/20 text-primary border-0">Aktiv</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{variant.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isActive && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="font-semibold"
            >
              Aktivieren
            </Button>
          )}
          <ChevronDown className={cn(
            "w-5 h-5 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )} />
        </div>
      </div>

      {/* Expanded Preview */}
      {expanded && (
        <div className="border-t border-border p-4 bg-muted/30">
          {/* Navigation Preview */}
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            {previewMode === 'desktop' ? '🖥️ Desktop Navigation' : '📱 Mobile Menu'}
          </p>
          
          {previewMode === 'desktop' ? (
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="px-3 py-2 bg-background rounded-lg border font-medium">
                {variant.labels.preisrechner}
              </span>
              <span className="px-3 py-2 bg-background rounded-lg border font-medium">
                {variant.labels.firmen}
              </span>
              <span className="px-3 py-2 bg-background rounded-lg border font-medium">
                {variant.labels.services}
              </span>
              <span className="px-3 py-2 bg-background rounded-lg border font-medium">
                {variant.labels.ratgeber}
              </span>
              <span className="px-3 py-2 bg-background rounded-lg border font-medium">
                {variant.labels.fuerFirmen}
              </span>
              <span className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg font-bold shadow-sm">
                {variant.labels.cta}
              </span>
            </div>
          ) : (
            <div className="space-y-2 max-w-[300px]">
              {Object.entries(variant.labels).filter(([k]) => k !== 'cta').map(([key, label]) => (
                <div key={key} className="px-4 py-3 bg-background rounded-lg border text-sm font-medium">
                  {label}
                </div>
              ))}
              <div className="px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-bold text-center shadow-sm">
                {variant.labels.cta}
              </div>
            </div>
          )}

          {/* Microcopy Preview */}
          <p className="text-xs font-semibold text-muted-foreground mt-5 mb-2 uppercase tracking-wide">
            📝 Microcopy in Dropdowns
          </p>
          <div className="space-y-2 text-sm bg-background p-3 rounded-lg border">
            <p className="flex items-start gap-2">
              <span className="font-semibold text-primary min-w-[140px]">{variant.labels.preisrechner}:</span>
              <span className="text-muted-foreground">{variant.microcopy.preisrechner}</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-semibold text-primary min-w-[140px]">{variant.labels.firmen}:</span>
              <span className="text-muted-foreground">{variant.microcopy.firmen}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
