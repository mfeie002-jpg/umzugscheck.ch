/**
 * Navigation Variant Manager - Admin component to manage navigation A/B tests
 * Allows switching between 16+ navigation variants with full reset + active/inactive toggle
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Navigation2, 
  RefreshCw, 
  Eye, 
  Check,
  ExternalLink,
  Power,
  PowerOff,
  Trash2
} from 'lucide-react';
import { NAV_VARIANTS, type NavConfig, setActiveVariant } from '@/lib/navigation-variants';

const NAV_AB_STORAGE_KEY = 'nav_ab_active';

export function NavigationVariantManager() {
  const [currentVariant, setCurrentVariant] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('nav-variant');
    setCurrentVariant(stored || 'ultimate');
    
    // Check if Nav A/B test is active
    const activeState = localStorage.getItem(NAV_AB_STORAGE_KEY);
    setIsActive(activeState !== 'false');
  }, []);

  const handleSetVariant = (variantId: string) => {
    localStorage.setItem('nav-variant', variantId);
    setCurrentVariant(variantId);
    toast({
      title: 'Navigation aktualisiert',
      description: `Sie sehen jetzt: ${variantId}`,
    });
    // Reload to apply changes
    setTimeout(() => window.location.reload(), 300);
  };

  const previewVariant = (variantId: string) => {
    window.open(`/?nav=${variantId}`, '_blank');
  };

  const resetVariant = () => {
    localStorage.removeItem('nav-variant');
    setCurrentVariant('ultimate');
    toast({
      title: 'Navigation zurückgesetzt',
      description: 'Standard-Navigation wird verwendet',
    });
    setTimeout(() => window.location.reload(), 300);
  };

  const resetAndReassign = () => {
    // Remove all navigation-related localStorage items
    localStorage.removeItem('nav-variant');
    localStorage.removeItem('nav_ab_user_id');
    sessionStorage.removeItem('nav_ab_session');
    setCurrentVariant(null);
    
    toast({
      title: 'Navigation zurückgesetzt',
      description: 'Bei der nächsten Seitenladung wird eine neue Variante zufällig zugewiesen',
    });
    
    // Reload to trigger new random assignment
    setTimeout(() => window.location.reload(), 500);
  };

  const toggleABTest = (active: boolean) => {
    localStorage.setItem(NAV_AB_STORAGE_KEY, active ? 'true' : 'false');
    setIsActive(active);
    
    toast({
      title: active ? 'Navigation A/B Test aktiviert' : 'Navigation A/B Test deaktiviert',
      description: active 
        ? 'Benutzer werden zufällig auf Varianten verteilt' 
        : 'Alle Benutzer sehen die Standard-Navigation',
    });
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Navigation2 className="h-5 w-5" />
                Navigation A/B Testing
              </CardTitle>
              <CardDescription>
                16+ Navigations-Varianten für Mobile und Desktop
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isActive ? 'default' : 'secondary'} className="text-sm">
                {isActive ? (
                  <>
                    <Power className="h-3 w-3 mr-1" />
                    Aktiv
                  </>
                ) : (
                  <>
                    <PowerOff className="h-3 w-3 mr-1" />
                    Inaktiv
                  </>
                )}
              </Badge>
              <Switch
                checked={isActive}
                onCheckedChange={toggleABTest}
                aria-label="Navigation A/B Test aktivieren"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Aktuelle Navigation:</p>
                <p className="text-lg font-bold text-primary">
                  {NAV_VARIANTS.find(v => v.id === currentVariant)?.name || 'Standard'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Wechseln Sie per URL: ?nav=variant-b oder klicken Sie unten
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetVariant}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Zurücksetzen
                </Button>
                <Button variant="destructive" size="sm" onClick={resetAndReassign}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset & neu zuweisen
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variants Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Varianten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {NAV_VARIANTS.map((variant) => {
              const isCurrentActive = currentVariant === variant.id;
              
              return (
                <div
                  key={variant.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isCurrentActive 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : 'hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{variant.name}</h4>
                    {isCurrentActive && (
                      <Badge variant="default" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Aktiv
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {variant.description}
                  </p>
                  
                  {/* Labels Preview */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="outline" className="text-[10px]">
                      {variant.labels.preisrechner}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {variant.labels.firmen}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {variant.labels.cta}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => previewVariant(variant.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant={isCurrentActive ? 'secondary' : 'default'}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSetVariant(variant.id)}
                      disabled={isCurrentActive}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Aktivieren
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
