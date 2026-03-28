import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, ExternalLink, Camera, Eye, Search, 
  Layers, Smartphone, Monitor, Grid3X3, List,
  ArrowRight, CheckCircle2, Zap, Target
} from 'lucide-react';
import { VARIANT_REGISTRY } from '@/components/calculator-variants';
import { FLOW_CONFIGS } from '@/data/flowConfigs';

// Main flows (V1-V9)
const MAIN_FLOWS = [
  { id: 'v1', label: 'V1 - Control', path: '/umzugsofferten', color: 'bg-blue-500', steps: 4 },
  { id: 'v2', label: 'V2 - Premium', path: '/umzugsofferten-v2', color: 'bg-purple-500', steps: 6 },
  { id: 'v3', label: 'V3 - God Mode', path: '/umzugsofferten-v3', color: 'bg-green-500', steps: 4 },
  { id: 'v4', label: 'V4 - Video AI', path: '/umzugsofferten-v4', color: 'bg-pink-500', steps: 5 },
  { id: 'v5', label: 'V5 - Marketplace', path: '/umzugsofferten-v5', color: 'bg-yellow-500', steps: 5 },
  { id: 'v6', label: 'V6 - Ultimate', path: '/umzugsofferten-v6', color: 'bg-orange-500', steps: 6 },
  { id: 'v7', label: 'V7 - SwissMove', path: '/umzugsofferten-v7', color: 'bg-cyan-500', steps: 4 },
  { id: 'v8', label: 'V8 - Decision-Free', path: '/umzugsofferten-v8', color: 'bg-emerald-500', steps: 3 },
  { id: 'v9', label: 'V9 - Zero Friction', path: '/umzugsofferten-v9', color: 'bg-rose-500', steps: 3 },
];

// Categorize sub-variants
const VARIANT_CATEGORIES = {
  'v2': { label: 'V2 - UX Optimiert', color: 'bg-purple-500', variants: ['v2a', 'v2b', 'v2c', 'v2d', 'v2e'] },
  'v3': { label: 'V3 - Mobile First', color: 'bg-green-500', variants: ['v3a', 'v3a-pro', 'v3b', 'v3b-feedback', 'v3c', 'v3d', 'v3e', 'v3g'] },
  'v4': { label: 'V4 - Conversion', color: 'bg-pink-500', variants: ['v4a', 'v4b', 'v4c', 'v4d', 'v4e'] },
  'v5': { label: 'V5 - Accessibility', color: 'bg-yellow-500', variants: ['v5a', 'v5b', 'v5c', 'v5d', 'v5e'] },
};

export default function VariantTestHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');

  // Filter variants based on search
  const filteredVariants = useMemo(() => {
    const allVariants = Object.entries(VARIANT_REGISTRY).map(([id, config]) => ({
      id,
      ...config,
      path: `/umzugsofferten?v=${id.replace('v', '')}`,
    }));

    if (!searchQuery) return allVariants;
    
    const query = searchQuery.toLowerCase();
    return allVariants.filter(v => 
      v.id.toLowerCase().includes(query) || 
      v.label.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Get variants for a specific category
  const getVariantsForCategory = (category: string) => {
    const cat = VARIANT_CATEGORIES[category as keyof typeof VARIANT_CATEGORIES];
    if (!cat) return [];
    return cat.variants.map(id => {
      const config = VARIANT_REGISTRY[id];
      return config ? { id, ...config, path: `/umzugsofferten?v=${id.replace('v', '')}` } : null;
    }).filter(Boolean);
  };

  const VariantCard = ({ variant, compact = false }: { variant: any; compact?: boolean }) => (
    <Card className={`group hover:shadow-md transition-all ${compact ? '' : ''}`}>
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-lg ${
              variant.id.startsWith('v2') ? 'bg-purple-500' :
              variant.id.startsWith('v3') ? 'bg-green-500' :
              variant.id.startsWith('v4') ? 'bg-pink-500' :
              variant.id.startsWith('v5') ? 'bg-yellow-500' : 'bg-blue-500'
            } flex items-center justify-center text-white font-bold text-sm shrink-0`}>
              {variant.id.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-medium truncate">{variant.label}</div>
              <div className="text-xs text-muted-foreground">
                {variant.stepCount} Steps
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            <Button size="sm" variant="ghost" asChild>
              <a href={variant.path} target="_blank" rel="noopener noreferrer" title="Extern öffnen">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Link to={`/flow-tester?variant=${variant.id}`}>
              <Button size="sm" variant="ghost" title="Im Flow Tester">
                <Play className="h-4 w-4" />
              </Button>
            </Link>
            <Link to={`/admin/tools?tab=calculator-review&url=${encodeURIComponent(window.location.origin + variant.path)}`}>
              <Button size="sm" variant="ghost" title="Screenshot">
                <Camera className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MainFlowCard = ({ flow }: { flow: typeof MAIN_FLOWS[0] }) => (
    <Card className="group hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${flow.color} flex items-center justify-center text-white font-bold`}>
              {flow.id.toUpperCase()}
            </div>
            <div>
              <div className="font-semibold">{flow.label}</div>
              <div className="text-xs text-muted-foreground">{flow.steps} Steps</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href={flow.path} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Öffnen
              </a>
            </Button>
            <Link to={`/admin/tools?tab=calculator-review&url=${encodeURIComponent(window.location.origin + flow.path)}`}>
              <Button size="sm" variant="default">
                <Camera className="h-4 w-4 mr-1" />
                Screenshot
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Varianten Testen</h1>
            <p className="text-muted-foreground">
              Alle Flow-Varianten testen, vergleichen und Screenshots erstellen
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/flow-tester">
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Flow Tester
              </Button>
            </Link>
            <Link to="/admin/tools?tab=calculator-review">
              <Button>
                <Camera className="h-4 w-4 mr-2" />
                Screenshot Tool
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Play className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Flow Tester</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Interaktiver Test aller Varianten mit Feedback-System
                  </p>
                  <Link to="/flow-tester">
                    <Button size="sm" variant="link" className="p-0 h-auto">
                      Öffnen <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Camera className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Screenshot Tool</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Desktop/Mobile Screenshots für AI-Analyse
                  </p>
                  <Link to="/admin/tools?tab=calculator-review">
                    <Button size="sm" variant="link" className="p-0 h-auto text-blue-500">
                      Öffnen <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Layers className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">V3 Vergleich</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Übersicht aller V3 Sub-Varianten
                  </p>
                  <Link to="/v3-varianten">
                    <Button size="sm" variant="link" className="p-0 h-auto text-green-500">
                      Öffnen <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all">Alle ({Object.keys(VARIANT_REGISTRY).length})</TabsTrigger>
              <TabsTrigger value="main">Haupt-Flows (9)</TabsTrigger>
              <TabsTrigger value="v2">V2</TabsTrigger>
              <TabsTrigger value="v3">V3</TabsTrigger>
              <TabsTrigger value="v4">V4</TabsTrigger>
              <TabsTrigger value="v5">V5</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-48"
                />
              </div>
              <div className="flex border rounded-lg">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* All Variants */}
          <TabsContent value="all" className="mt-4">
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3' 
              : 'space-y-2'
            }>
              {filteredVariants.map((variant) => (
                <VariantCard key={variant.id} variant={variant} compact={viewMode === 'list'} />
              ))}
            </div>
          </TabsContent>

          {/* Main Flows */}
          <TabsContent value="main" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MAIN_FLOWS.map((flow) => (
                <MainFlowCard key={flow.id} flow={flow} />
              ))}
            </div>
          </TabsContent>

          {/* Category Tabs (V2-V5) */}
          {['v2', 'v3', 'v4', 'v5'].map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${VARIANT_CATEGORIES[cat as keyof typeof VARIANT_CATEGORIES].color} flex items-center justify-center text-white font-bold`}>
                      {cat.toUpperCase()}
                    </div>
                    <div>
                      <CardTitle>{VARIANT_CATEGORIES[cat as keyof typeof VARIANT_CATEGORIES].label}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {getVariantsForCategory(cat).length} Sub-Varianten
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3' 
                    : 'space-y-2'
                  }>
                    {getVariantsForCategory(cat).map((variant: any) => (
                      <VariantCard key={variant.id} variant={variant} compact={viewMode === 'list'} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
