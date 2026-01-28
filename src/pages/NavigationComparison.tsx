/**
 * Navigation Comparison Page
 * 
 * Shows all 17 navigation variants side by side for easy comparison
 * Similar to the flow comparison view
 */

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronUp,
  Monitor, 
  Smartphone, 
  ArrowLeft,
  ExternalLink,
  Check,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { NAV_VARIANTS, type NavConfig } from "@/lib/navigation-variants";
import { cn } from "@/lib/utils";

export default function NavigationComparison() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showDropdowns, setShowDropdowns] = useState(true);
  const [expandedVariants, setExpandedVariants] = useState<string[]>(
    NAV_VARIANTS.map(v => v.id) // All expanded by default
  );
  const [activeVariantId, setActiveVariantId] = useState<string>(() => {
    // Get initial active variant from localStorage or URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlVariant = urlParams.get('nav');
    if (urlVariant) return urlVariant;
    
    const stored = localStorage.getItem('nav-variant');
    return stored || 'ultimate';
  });

  // Listen for variant changes
  useEffect(() => {
    const handleVariantChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newVariantId = customEvent.detail?.variantId || customEvent.detail;
      if (newVariantId) {
        setActiveVariantId(newVariantId);
        console.log('[NavigationComparison] Variant changed to:', newVariantId);
      }
    };

    window.addEventListener('nav-variant-changed', handleVariantChange);
    window.addEventListener('ab-state-changed', handleVariantChange);

    return () => {
      window.removeEventListener('nav-variant-changed', handleVariantChange);
      window.removeEventListener('ab-state-changed', handleVariantChange);
    };
  }, []);

  const activateVariant = (variantId: string) => {
    // Save to localStorage
    localStorage.setItem('nav-variant', variantId);
    
    // Update state
    setActiveVariantId(variantId);
    
    // Dispatch events for all components to update
    window.dispatchEvent(new CustomEvent('nav-variant-changed', { detail: variantId }));
    window.dispatchEvent(new CustomEvent('ab-state-changed', { detail: { type: 'nav', variantId } }));
    
    console.log('[NavigationComparison] Activated variant:', variantId);
  };

  const toggleVariant = (id: string) => {
    setExpandedVariants(prev => 
      prev.includes(id) 
        ? prev.filter(v => v !== id) 
        : [...prev, id]
    );
  };

  const expandAll = () => setExpandedVariants(NAV_VARIANTS.map(v => v.id));
  const collapseAll = () => setExpandedVariants([]);

  return (
    <>
      <Helmet>
        <title>Navigation Varianten Vergleich | A/B Test</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Zurück</span>
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Navigation A/B Test</h1>
                  <p className="text-sm text-muted-foreground">
                    {NAV_VARIANTS.length} Varianten im Vergleich
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Toggle Dropdowns */}
                <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                  <span className="text-sm font-medium">Dropdowns</span>
                  <Switch 
                    checked={showDropdowns} 
                    onCheckedChange={setShowDropdowns}
                  />
                </div>

                {/* Device Toggle */}
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                      viewMode === 'desktop' 
                        ? "bg-background shadow-sm text-primary" 
                        : "hover:bg-background/50 text-muted-foreground"
                    )}
                  >
                    <Monitor className="w-4 h-4" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                      viewMode === 'mobile' 
                        ? "bg-background shadow-sm text-primary" 
                        : "hover:bg-background/50 text-muted-foreground"
                    )}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>

                {/* Expand/Collapse */}
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={expandAll} className="gap-1">
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Alle öffnen</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={collapseAll} className="gap-1">
                    <EyeOff className="w-4 h-4" />
                    <span className="hidden sm:inline">Alle schliessen</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Variants Grid */}
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            {NAV_VARIANTS.map((variant, index) => (
              <VariantPreview
                key={variant.id}
                variant={variant}
                index={index + 1}
                viewMode={viewMode}
                showDropdowns={showDropdowns}
                isExpanded={expandedVariants.includes(variant.id)}
                onToggle={() => toggleVariant(variant.id)}
                isActive={activeVariantId === variant.id}
                onActivate={() => activateVariant(variant.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

interface VariantPreviewProps {
  variant: NavConfig;
  index: number;
  viewMode: 'desktop' | 'mobile';
  showDropdowns: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  isActive: boolean;
  onActivate: () => void;
}

const VariantPreview = ({ 
  variant, 
  index, 
  viewMode, 
  showDropdowns,
  isExpanded,
  onToggle,
  isActive,
  onActivate
}: VariantPreviewProps) => {
  const labels = Object.entries(variant.labels).filter(([k]) => k !== 'cta');

  return (
    <div className={cn(
      "border-2 rounded-xl overflow-hidden bg-background transition-all",
      isActive ? "border-green-500 shadow-lg shadow-green-500/20" : 
      isExpanded ? "border-primary shadow-lg" : "border-border hover:border-primary/50"
    )}>
      {/* Header - Always visible */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold",
            isActive ? "bg-green-500 text-white" :
            isExpanded 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          )}>
            {isActive ? <Check className="w-6 h-6" /> : index}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{variant.name}</h3>
              {isActive && (
                <Badge className="bg-green-500 text-white hover:bg-green-600">
                  ✓ Aktiv
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{variant.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isActive && (
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onActivate();
              }}
              size="sm" 
              className="gap-2 bg-green-500 hover:bg-green-600 text-white"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Aktivieren</span>
            </Button>
          )}
          <Link 
            to={`/?nav=${variant.id}`}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Öffnen</span>
            </Button>
          </Link>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t border-border">
          {/* Navigation Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {viewMode === 'desktop' ? 'Desktop Navigation' : 'Mobile Menu'}
            </h4>
            
            {viewMode === 'desktop' ? (
              <div className="flex items-center gap-2 flex-wrap">
                {labels.map(([key, label]) => (
                  <span 
                    key={key}
                    className="px-4 py-2 bg-muted rounded-lg border border-border font-medium text-sm flex items-center gap-1"
                  >
                    {label}
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </span>
                ))}
                <span className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-bold text-sm shadow-sm">
                  {variant.labels.cta}
                </span>
              </div>
            ) : (
              <div className="max-w-xs space-y-2">
                {labels.map(([key, label]) => (
                  <div 
                    key={key}
                    className="px-4 py-3 bg-muted rounded-lg border border-border font-medium text-sm flex items-center justify-between"
                  >
                    {label}
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
                <div className="px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-bold text-center shadow-sm">
                  {variant.labels.cta}
                </div>
              </div>
            )}
          </div>

          {/* Microcopy */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Microcopy
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(variant.microcopy).map(([key, text]) => (
                <div key={key} className="p-3 bg-muted/50 rounded-lg border border-border">
                  <span className="text-xs font-semibold text-primary uppercase">
                    {variant.labels[key as keyof typeof variant.labels]}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dropdown Previews */}
          {showDropdowns && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Dropdown Inhalte
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(variant.dropdownTitles).map(([key, title]) => {
                  const ctaCard = variant.ctaCard[key as keyof typeof variant.ctaCard];
                  return (
                    <div key={key} className="p-4 bg-background rounded-xl border-2 border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs font-bold">
                          {title}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p className="text-xs">
                          <span className="font-semibold text-foreground">CTA Card:</span>
                        </p>
                        <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="font-semibold text-foreground text-xs">{ctaCard.title}</p>
                          <Button size="sm" className="mt-2 h-7 text-xs w-full">
                            {ctaCard.buttonText}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
