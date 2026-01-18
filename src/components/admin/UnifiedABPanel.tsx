/**
 * Unified A/B Testing Admin Panel
 * 
 * Single admin UI for managing both Navigation and Flow A/B tests
 * with consistent Reset, Preview, and Toggle behavior
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FlaskConical, 
  Navigation2, 
  RefreshCw, 
  Trash2, 
  Eye, 
  ExternalLink,
  Power,
  PowerOff,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedAB } from '@/hooks/useUnifiedAB';
import { 
  AB_STORAGE_KEYS, 
  FLOW_VARIANTS,
  resetAllAB,
  resetNavAB,
  resetFlowAB,
  setNavABActive,
} from '@/lib/unified-ab-config';
import { NAV_VARIANTS } from '@/lib/navigation-variants';

export function UnifiedABPanel() {
  const { toast } = useToast();
  const {
    navVariant,
    flowVariant,
    navABActive,
    flowPath,
    navId,
    flowId,
    setNav,
    setFlow,
    resetNav,
    resetFlow,
    resetAll,
  } = useUnifiedAB();
  
  const [activeTab, setActiveTab] = useState<'nav' | 'flow'>('nav');
  
  const handleToggleNavAB = (active: boolean) => {
    setNavABActive(active);
    toast({
      title: active ? 'Navigation A/B aktiviert' : 'Navigation A/B deaktiviert',
      description: active 
        ? 'Benutzer können verschiedene Nav-Varianten sehen' 
        : 'Standard-Navigation für alle Benutzer',
    });
    window.location.reload();
  };
  
  const handleResetAll = () => {
    resetAllAB();
    toast({
      title: 'Alle A/B-Zuweisungen zurückgesetzt',
      description: 'Navigation und Flow werden bei nächstem Laden neu zugewiesen',
    });
    setTimeout(() => window.location.reload(), 500);
  };
  
  const handleResetNav = () => {
    resetNavAB();
    toast({
      title: 'Navigation zurückgesetzt',
      description: 'Nav-Variante wird bei nächstem Laden neu zugewiesen',
    });
    setTimeout(() => window.location.reload(), 500);
  };
  
  const handleResetFlow = () => {
    resetFlowAB();
    toast({
      title: 'Flow zurückgesetzt',
      description: 'Flow-Variante wird bei nächstem Laden neu zugewiesen',
    });
    setTimeout(() => window.location.reload(), 500);
  };
  
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
    setTimeout(() => window.location.reload(), 300);
  };
  
  const previewNav = (variantId: string) => {
    window.open(`/?nav=${variantId}`, '_blank');
  };
  
  const previewFlow = (variantId: string) => {
    window.open(`/${variantId}`, '_blank');
  };
  
  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Unified A/B Testing
              </CardTitle>
              <CardDescription>
                Eine Steuerung für Navigation und Flow Varianten
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
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Navigation2 className="h-4 w-4" />
                  Navigation
                </span>
                <Badge variant={navABActive ? 'default' : 'secondary'}>
                  {navABActive ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </div>
              <p className="text-lg font-bold text-primary truncate" title={navVariant.name}>
                {navVariant.name}
              </p>
              <p className="text-xs text-muted-foreground">{navId}</p>
            </div>
            
            {/* Flow Status */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" />
                  Flow (Offerten)
                </span>
                <Badge variant="outline">
                  Zugewiesen
                </Badge>
              </div>
              <p className="text-lg font-bold text-primary truncate" title={flowVariant.name}>
                {flowVariant.name}
              </p>
              <p className="text-xs text-muted-foreground">{flowPath}</p>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Navigation Varianten</CardTitle>
                  <CardDescription>
                    Wechseln Sie per URL: ?nav=variant-id
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">A/B aktiv</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
                          <Badge variant="default" className="text-[10px] ml-2">
                            <Check className="h-3 w-3 mr-0.5" />
                            Aktiv
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-2 line-clamp-1">
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
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Flow Tab */}
        <TabsContent value="flow">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Flow Varianten (Offerten-Funnel)</CardTitle>
                  <CardDescription>
                    Der CTA auf der Homepage nutzt den hier zugewiesenen Flow
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetFlow}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(FLOW_VARIANTS).map((variant) => {
                  const isActive = flowId === variant.id;
                  return (
                    <div
                      key={variant.id}
                      className={`border rounded-lg p-4 transition-all ${
                        isActive 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{variant.name}</h4>
                        {isActive && (
                          <Badge variant="default" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Aktiv
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {variant.path}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => previewFlow(variant.id)}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
