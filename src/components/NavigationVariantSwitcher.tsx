/**
 * Navigation Variant Switcher
 * 
 * Floating UI to switch between 5 navigation variants for A/B testing
 */

import { useState } from "react";
import { 
  Settings2, 
  X, 
  Check, 
  Monitor, 
  Smartphone,
  ChevronDown,
  Eye
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

export const NavigationVariantSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const activeVariant = getActiveVariant();

  const handleVariantChange = (variant: NavVariant) => {
    setActiveVariant(variant);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-4 left-4 z-[100]",
          "w-12 h-12 rounded-full",
          "bg-primary text-primary-foreground",
          "shadow-lg hover:shadow-xl",
          "flex items-center justify-center",
          "transition-all hover:scale-110",
          "animate-pulse"
        )}
        title="Navigation Varianten testen"
      >
        <Settings2 className="w-5 h-5" />
      </button>

      {/* Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={() => setIsOpen(false)}
          />

          {/* Switcher Panel */}
          <div className={cn(
            "fixed bottom-0 left-0 right-0 z-[101]",
            "bg-background border-t border-border",
            "rounded-t-2xl shadow-2xl",
            "max-h-[80vh] overflow-hidden",
            "animate-in slide-in-from-bottom duration-300"
          )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-bold text-lg">Navigation A/B Test</h3>
                <p className="text-sm text-muted-foreground">
                  Wähle eine Variante zum Testen
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Device Toggle */}
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      previewMode === 'desktop' 
                        ? "bg-background shadow-sm" 
                        : "hover:bg-background/50"
                    )}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      previewMode === 'mobile' 
                        ? "bg-background shadow-sm" 
                        : "hover:bg-background/50"
                    )}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Variants List */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
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
              <div className="mt-6 p-4 bg-muted rounded-xl">
                <p className="text-sm font-medium mb-2">💡 Direktlinks für Tests:</p>
                <div className="space-y-1 text-xs font-mono text-muted-foreground">
                  {NAV_VARIANTS.map(v => (
                    <div key={v.id} className="flex items-center gap-2">
                      <span className="text-primary">?nav={v.id}</span>
                      <span>→</span>
                      <span>{v.name}</span>
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
      "border rounded-xl overflow-hidden transition-all",
      isActive 
        ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
        : "border-border hover:border-primary/50"
    )}>
      {/* Card Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {isActive && (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{variant.name}</h4>
              {variant.id === 'ultimate' && (
                <Badge variant="secondary" className="text-[10px]">Empfohlen</Badge>
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
            >
              Aktivieren
            </Button>
          )}
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            expanded && "rotate-180"
          )} />
        </div>
      </div>

      {/* Expanded Preview */}
      {expanded && (
        <div className="border-t border-border p-4 bg-muted/30">
          {/* Navigation Preview */}
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {previewMode === 'desktop' ? 'Desktop Navigation:' : 'Mobile Menu:'}
          </p>
          
          {previewMode === 'desktop' ? (
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="px-3 py-1.5 bg-background rounded-lg border">
                {variant.labels.preisrechner}
              </span>
              <span className="px-3 py-1.5 bg-background rounded-lg border">
                {variant.labels.firmen}
              </span>
              <span className="px-3 py-1.5 bg-background rounded-lg border">
                {variant.labels.services}
              </span>
              <span className="px-3 py-1.5 bg-background rounded-lg border">
                {variant.labels.ratgeber}
              </span>
              <span className="px-3 py-1.5 bg-background rounded-lg border">
                {variant.labels.fuerFirmen}
              </span>
              <span className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg font-semibold">
                {variant.labels.cta}
              </span>
            </div>
          ) : (
            <div className="space-y-1.5 max-w-[280px]">
              {Object.entries(variant.labels).filter(([k]) => k !== 'cta').map(([key, label]) => (
                <div key={key} className="px-3 py-2 bg-background rounded-lg border text-sm">
                  {label}
                </div>
              ))}
              <div className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold text-sm text-center">
                {variant.labels.cta}
              </div>
            </div>
          )}

          {/* Microcopy Preview */}
          <p className="text-xs font-medium text-muted-foreground mt-4 mb-2">
            Microcopy Beispiele:
          </p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>• <strong>{variant.labels.preisrechner}:</strong> {variant.microcopy.preisrechner}</p>
            <p>• <strong>{variant.labels.firmen}:</strong> {variant.microcopy.firmen}</p>
          </div>
        </div>
      )}
    </div>
  );
};
