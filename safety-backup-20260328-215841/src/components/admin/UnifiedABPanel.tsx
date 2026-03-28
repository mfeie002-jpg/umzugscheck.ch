/**
 * Unified A/B Testing Admin Panel
 * 
 * Single admin UI for managing both Navigation and Flow A/B tests
 * with consistent Reset, Preview, Set, and Toggle behavior
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FlaskConical, 
  Navigation2, 
  Trash2, 
  Eye, 
  ExternalLink,
  Check,
  RotateCcw,
  Shuffle,
  Settings2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedAB } from '@/hooks/useUnifiedAB';
import { NAV_VARIANTS } from '@/lib/navigation-variants';
import { FLOW_VARIANTS } from '@/lib/unified-ab-config';

export function UnifiedABPanel() {
  const { toast } = useToast();
  const {
    navVariant,
    flowVariant,
    navABActive,
    flowABActive,
    flowPath,
    navId,
    flowId,
    setNav,
    setFlow,
    toggleNavAB,
    toggleFlowAB,
    resetNav,
    resetFlow,
    resetAll,
    assignRandomFlow,
  } = useUnifiedAB();
  
  const [activeTab, setActiveTab] = useState<'nav' | 'flow'>('nav');
  
  // Toggle Nav A/B
  const handleToggleNavAB = (active: boolean) => {
    toggleNavAB(active);
    toast({
      title: active ? 'Navigation A/B aktiviert' : 'Navigation A/B deaktiviert',
      description: active 
        ? 'Benutzer sehen die zugewiesene Nav-Variante' 
        : 'Standard-Navigation für alle Benutzer',
    });
  };
  
  // Toggle Flow A/B
  const handleToggleFlowAB = (active: boolean) => {
    toggleFlowAB(active);
    toast({
      title: active ? 'Flow A/B aktiviert' : 'Flow A/B deaktiviert',
      description: active 
        ? 'CTAs nutzen den zugewiesenen Flow' 
        : 'Standard-Flow (V1) für alle Benutzer',
    });
  };
  
  // Reset handlers
  const handleResetAll = () => {
    resetAll();
    toast({
      title: 'Alle A/B-Zuweisungen zurückgesetzt',
      description: 'Navigation und Flow wurden auf Standard zurückgesetzt',
    });
    setTimeout(() => window.location.reload(), 500);
  };
  
  const handleResetNav = () => {
    resetNav();
    toast({
      title: 'Navigation zurückgesetzt',
      description: 'Nav-Variante wurde auf Standard zurückgesetzt',
    });
    setTimeout(() => window.location.reload(), 500);
  };
  
  const handleResetFlow = () => {
    resetFlow();
    toast({
      title: 'Flow zurückgesetzt',
      description: 'Flow-Variante wurde auf Standard (V1) zurückgesetzt',
    });
  };
  
  // Set handlers
  const handleSetNav = (variantId: string) => {
    setNav(variantId as any);
    toast({
      title: 'Navigation geändert',
      description: `Aktive Nav: ${variantId}`,
    });
    setTimeout(() => window.location.reload(), 300);
  };
  
  const handleSetFlow = (variantId: string) => {
    setFlow(variantId);
    toast({
      title: 'Flow geändert',
      description: `Aktiver Flow: ${variantId}`,
    });
  };
  
  // Random assignment
  const handleRandomFlow = () => {
    const variant = assignRandomFlow();
    toast({
      title: 'Zufälliger Flow zugewiesen',
      description: `${variant.name} (${variant.path})`,
    });
  };
  
  // Preview handlers
  const previewNav = (variantId: string) => {
    window.open(`/?nav=${variantId}`, '_blank');
  };
  
  const previewFlow = (path: string) => {
    window.open(path, '_blank');
  };
  
  return (
    <div className="space-y-6">
      {/* Status Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Unified A/B Testing
              </CardTitle>
              <CardDescription>
                Zentrale Steuerung für Navigation und Flow Varianten
              </CardDescription>
            </div>
            <Button variant="destructive" size="sm" onClick={handleResetAll}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Alles zurücksetzen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nav Status */}
            <div className="bg-muted/50 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Navigation2 className="h-4 w-4 text-primary" />
                  Navigation
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant={navABActive ? 'default' : 'secondary'}>
                    {navABActive ? 'A/B Aktiv' : 'Standard'}
                  </Badge>
                </div>
              </div>
              <p className="text-lg font-bold text-primary truncate" title={navVariant.name}>
                {navVariant.name}
              </p>
              <p className="text-xs text-muted-foreground font-mono">{navId}</p>
            </div>
            
            {/* Flow Status */}
            <div className="bg-muted/50 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-secondary" />
                  Flow (Offerten)
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant={flowABActive ? 'default' : 'secondary'}>
                    {flowABActive ? 'A/B Aktiv' : 'Standard'}
                  </Badge>
                </div>
              </div>
              <p className="text-lg font-bold text-secondary truncate" title={flowVariant.name}>
                {flowVariant.name}
              </p>
              <p className="text-xs text-muted-foreground font-mono">{flowPath}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for Nav and Flow */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'nav' | 'flow')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nav" className="flex items-center gap-2">
            <Navigation2 className="h-4 w-4" />
            Navigation ({NAV_VARIANTS.length})
          </TabsTrigger>
          <TabsTrigger value="flow" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Flow ({Object.keys(FLOW_VARIANTS).length})
          </TabsTrigger>
        </TabsList>
        
        {/* Navigation Tab */}
        <TabsContent value="nav">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-base">Navigation Varianten</CardTitle>
                  <CardDescription>
                    Wähle eine Variante oder nutze ?nav=variant-id in der URL
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">A/B Test aktiv</span>
                    <Switch 
                      checked={navABActive} 
                      onCheckedChange={handleToggleNavAB}
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={handleResetNav}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {NAV_VARIANTS.map((variant) => {
                    const isActive = navId === variant.id;
                    return (
                      <div
                        key={variant.id}
                        className={`border rounded-lg p-3 transition-all ${
                          isActive 
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                            : 'hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm truncate flex-1" title={variant.name}>
                            {variant.name}
                          </h4>
                          {isActive && (
                            <Badge variant="default" className="text-[10px] ml-2 shrink-0">
                              <Check className="h-3 w-3 mr-0.5" />
                              Aktiv
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2">
                          {variant.description}
                        </p>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-7 text-xs"
                            onClick={() => previewNav(variant.id)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            variant={isActive ? 'secondary' : 'default'}
                            size="sm"
                            className="flex-1 h-7 text-xs"
                            onClick={() => handleSetNav(variant.id)}
                            disabled={isActive}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Setzen
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Flow Tab */}
        <TabsContent value="flow">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-base">Flow Varianten (Offerten-Funnel)</CardTitle>
                  <CardDescription>
                    Der CTA auf der Homepage nutzt den hier zugewiesenen Flow
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 mr-2">
                    <span className="text-sm text-muted-foreground">A/B Test aktiv</span>
                    <Switch 
                      checked={flowABActive} 
                      onCheckedChange={handleToggleFlowAB}
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRandomFlow}>
                    <Shuffle className="h-4 w-4 mr-2" />
                    Zufällig
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleResetFlow}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.values(FLOW_VARIANTS).map((variant) => {
                    const isActive = flowId === variant.id;
                    return (
                      <div
                        key={variant.id}
                        className={`border rounded-lg p-4 transition-all ${
                          isActive 
                            ? 'border-secondary bg-secondary/5 ring-2 ring-secondary/20' 
                            : 'hover:border-secondary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">{variant.name}</h4>
                          {isActive && (
                            <Badge variant="default" className="text-xs bg-secondary">
                              <Check className="h-3 w-3 mr-1" />
                              Aktiv
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1 font-mono">
                          {variant.path}
                        </p>
                        {variant.description && (
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {variant.description}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => previewFlow(variant.path)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            variant={isActive ? 'secondary' : 'default'}
                            size="sm"
                            className="flex-1"
                            onClick={() => handleSetFlow(variant.id)}
                            disabled={isActive}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Setzen
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Info Box */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Wie funktioniert es?</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Navigation:</strong> Wähle eine Variante → Navigation wird sofort aktualisiert</li>
              <li><strong>Flow:</strong> Wähle einen Flow → Homepage-CTAs leiten zu diesem Flow</li>
              <li><strong>URL-Parameter:</strong> ?nav=variant-id oder ?flow=umzugsofferten-v2</li>
              <li><strong>Reset:</strong> Setzt auf Standard zurück (Navigation: Original, Flow: V1)</li>
              <li><strong>A/B Toggle:</strong> Aktiviert/deaktiviert zufällige Zuweisung für neue Benutzer</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
