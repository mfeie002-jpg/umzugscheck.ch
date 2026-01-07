import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Star, BarChart3, Search, ArrowRight, Sparkles, Zap, Trophy, MessageSquare, Target,
  Grid3X3, List, Play, ExternalLink, Crown, Medal, Flame, Filter
} from 'lucide-react';
import { Helmet } from 'react-helmet';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';
import { FlowExportDialog } from '@/components/flow-tester/FlowExportDialog';
import { TopTenFlowSelector } from '@/components/flow-tester/TopTenFlowSelector';
import { FlowRatingsDisplay } from '@/components/flow-tester/FlowRatingsDisplay';
import { FlowZipExport } from '@/components/flow-tester/FlowZipExport';
import { cn } from '@/lib/utils';

// ============================================================================
// FLOW FAMILIES (for "Familien" tab)
// ============================================================================
const MAIN_FLOWS = [
  { id: 'v1', configId: 'umzugsofferten-v1', prefix: 'v1' },
  { id: 'v2', configId: 'umzugsofferten-v2', prefix: 'v2' },
  { id: 'v3', configId: 'umzugsofferten-v3', prefix: 'v3' },
  { id: 'v4', configId: 'umzugsofferten-v4', prefix: 'v4' },
  { id: 'v5', configId: 'umzugsofferten-v5', prefix: 'v5' },
  { id: 'v6', configId: 'umzugsofferten-v6', prefix: 'v6' },
  { id: 'v7', configId: 'umzugsofferten-v7', prefix: 'v7' },
  { id: 'v8', configId: 'umzugsofferten-v8', prefix: 'v8' },
  { id: 'v9', configId: 'umzugsofferten-v9', prefix: 'v9' },
];

const CHATGPT_FLOWS = [
  { id: 'chatgpt-flow-1', label: 'ChatGPT Flow 1 ⭐⭐', path: '/chatgpt-flow-1', description: 'Zero Friction Pro: 2 Steps', steps: 2 },
  { id: 'chatgpt-flow-2', label: 'ChatGPT Flow 2 ⭐⭐', path: '/chatgpt-flow-2', description: 'Social Proof Boosted: 3 Steps', steps: 3 },
  { id: 'chatgpt-flow-3', label: 'ChatGPT Flow 3 ⭐⭐', path: '/chatgpt-flow-3', description: 'Personalized Guided Chat', steps: 3 },
];

const SWISS_PREMIUM_FLOWS = [
  { id: 'swiss-lightning', label: 'Swiss Lightning ⚡', path: '/swiss-lightning', description: '2 Steps, 90 Sek. bis Lead', steps: 2 },
  { id: 'swiss-premium-choice', label: 'Swiss Premium Choice 💎', path: '/swiss-premium-choice', description: '3 Steps mit Paketauswahl', steps: 3 },
  { id: 'swiss-concierge-hybrid', label: 'Swiss Concierge Hybrid 🎬', path: '/swiss-concierge-hybrid', description: '4 Steps, optionales Video', steps: 4 },
];

const GEMINI_TOP_FLOWS = [
  { id: 'v9-zero-friction', label: 'V9 Zero Friction ⭐4.9', path: '/v9-zero-friction', description: '5 Steps, Route-Fokus, Labor Illusion', steps: 5 },
  { id: 'ultimate-best36', label: 'Ultimate Best36 ⭐4.8', path: '/ultimate-best36', description: '4 Steps, Auto-Advance, High-Contrast', steps: 4 },
  { id: 'golden-flow-v10', label: 'Golden Flow V10 ⭐5.0', path: '/golden-flow-v10', description: '6 Steps, Glassmorphism, Perfekter Score', steps: 6 },
];

const getSubVariants = (prefix: string) => {
  return Object.entries(SUB_VARIANT_CONFIGS)
    .filter(([key]) => key.startsWith(prefix) && key !== prefix)
    .map(([key, config]) => ({
      id: key,
      label: config.label,
      path: config.path,
      description: config.description,
      steps: config.steps.length,
    }));
};

const FLOW_FAMILIES = [
  {
    id: 'gemini-top',
    familyId: 'gemini-top',
    label: 'Gemini Top 🏆⭐',
    path: '/flows/gemini-top',
    color: 'bg-gradient-to-r from-amber-500 to-orange-600',
    description: '3 Top-Flows mit Score 4.8-5.0 (Gemini Analyse)',
    steps: 5,
    icon: Trophy,
    subVariants: GEMINI_TOP_FLOWS,
  },
  {
    id: 'swiss-premium',
    familyId: 'swiss-premium',
    label: 'Swiss Premium ⚡💎',
    path: '/flows/swiss-premium',
    color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    description: '3 neue Flows mit Flow-Components (beste UX)',
    steps: 2,
    icon: Sparkles,
    subVariants: SWISS_PREMIUM_FLOWS,
  },
  {
    id: 'chatgpt',
    familyId: 'chatgpt',
    label: 'ChatGPT Optimized ⭐⭐',
    path: '/flows/chatgpt',
    color: 'bg-gradient-to-r from-blue-500 to-teal-500',
    description: '3 Premium-Flows von ChatGPT optimiert',
    steps: 2,
    icon: MessageSquare,
    subVariants: CHATGPT_FLOWS,
  },
  ...MAIN_FLOWS.map(main => {
    const config = FLOW_CONFIGS[main.configId];
    const subVariants = getSubVariants(main.prefix);
    return {
      id: main.id,
      familyId: main.id,
      label: config?.label || main.id.toUpperCase(),
      path: `/flows/${main.id}`,
      color: config?.color || 'bg-gray-500',
      description: config?.description || '',
      steps: config?.steps.length || 4,
      icon: main.id === 'v9' ? Star : main.id === 'v7' ? Zap : Target,
      subVariants,
    };
  }),
];

// ============================================================================
// ALL FLOWS (for "Alle Flows" tab - merged from FlowOverview)
// ============================================================================
const CATEGORIES = {
  'gemini-top': { label: 'Gemini Top 3', icon: Crown, color: 'from-amber-500 to-orange-600' },
  'swiss-premium': { label: 'Swiss Premium', icon: Medal, color: 'from-red-500 to-rose-600' },
  'top-10-upgrades': { label: 'Top 10 Upgrades', icon: Trophy, color: 'from-blue-500 to-indigo-600' },
  'chatgpt-flows': { label: 'ChatGPT Flows', icon: Sparkles, color: 'from-green-500 to-emerald-600' },
  'v1-control': { label: 'V1 Control', icon: Target, color: 'from-blue-400 to-blue-600' },
  'v2-premium': { label: 'V2 Premium', icon: Star, color: 'from-purple-400 to-purple-600' },
  'v3-mobile': { label: 'V3 Mobile-First', icon: Zap, color: 'from-green-400 to-green-600' },
  'v4-video': { label: 'V4 Video-First', icon: Play, color: 'from-pink-400 to-pink-600' },
  'v5-marketplace': { label: 'V5 Marketplace', icon: Grid3X3, color: 'from-yellow-400 to-yellow-600' },
  'v6-ultimate': { label: 'V6 Ultimate', icon: Flame, color: 'from-orange-400 to-orange-600' },
  'v7-v9-special': { label: 'V7-V9 Special', icon: Sparkles, color: 'from-teal-400 to-cyan-600' },
  'ultimate': { label: 'Ultimate Flows', icon: Crown, color: 'from-purple-500 to-pink-500' },
};

type CategoryKey = keyof typeof CATEGORIES;

interface FlowItem {
  id: string;
  label: string;
  description: string;
  path: string;
  category: CategoryKey;
  isPremium?: boolean;
}

function categorizeFlow(id: string): CategoryKey {
  if (['v9-zero-friction', 'ultimate-best36', 'golden-flow-v10'].includes(id)) return 'gemini-top';
  if (id.includes('swiss') || id === 'ultimate-v7' || id === 'ultimate-ch') return 'swiss-premium';
  if (['multi-a', 'v6a', 'v1a', 'v1f', 'v8a', 'v4c', 'v2f'].includes(id)) return 'top-10-upgrades';
  if (id.includes('chatgpt')) return 'chatgpt-flows';
  if (id.includes('ultimate') || id.includes('archetyp')) return 'ultimate';
  if (id.startsWith('v1') || id === 'umzugsofferten-v1') return 'v1-control';
  if (id.startsWith('v2') || id === 'umzugsofferten-v2') return 'v2-premium';
  if (id.startsWith('v3') || id === 'umzugsofferten-v3') return 'v3-mobile';
  if (id.startsWith('v4') || id === 'umzugsofferten-v4') return 'v4-video';
  if (id.startsWith('v5') || id === 'umzugsofferten-v5') return 'v5-marketplace';
  if (id.startsWith('v6') || id === 'umzugsofferten-v6') return 'v6-ultimate';
  if (id.startsWith('v7') || id.startsWith('v8') || id.startsWith('v9') || id.startsWith('multi')) return 'v7-v9-special';
  return 'v1-control';
}

function buildAllFlowsList(): FlowItem[] {
  const flows: FlowItem[] = [];
  
  Object.entries(FLOW_CONFIGS).forEach(([id, config]) => {
    flows.push({
      id,
      label: config.label,
      description: config.description,
      path: config.path,
      category: categorizeFlow(id),
      isPremium: config.label.includes('⭐'),
    });
  });
  
  Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
    flows.push({
      id,
      label: config.label,
      description: config.description,
      path: config.path,
      category: categorizeFlow(id),
      isPremium: config.label.includes('⭐'),
    });
  });
  
  return flows;
}

// Standalone flow URLs
const STANDALONE_FLOWS = [
  'v9-zero-friction', 'ultimate-best36', 'golden-flow-v10',
  'swiss-lightning', 'swiss-premium-choice', 'swiss-concierge-hybrid', 'ultimate-v7',
  'multi-a', 'v6a', 'v1a', 'v1f', 'v8a', 'v4c', 'v2f',
  'chatgpt-flow-1', 'chatgpt-flow-2', 'chatgpt-flow-3'
];

const getStandaloneUrl = (flowId: string): string | null => {
  if (STANDALONE_FLOWS.includes(flowId)) {
    if (flowId.startsWith('chatgpt-flow')) return `/${flowId}`;
    return `/flow/${flowId}`;
  }
  return null;
};

// ============================================================================
// COMPONENT
// ============================================================================
export default function FlowTesterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | 'all'>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<CategoryKey>>(
    new Set(['gemini-top', 'top-10-upgrades', 'swiss-premium', 'chatgpt-flows'])
  );

  const allFlows = useMemo(() => buildAllFlowsList(), []);

  // Filter families
  const filteredFamilies = useMemo(() => {
    if (!searchQuery) return FLOW_FAMILIES;
    const q = searchQuery.toLowerCase();
    return FLOW_FAMILIES.filter(f => {
      const mainMatches = f.label.toLowerCase().includes(q) || 
                          f.description.toLowerCase().includes(q) ||
                          f.id.toLowerCase().includes(q);
      const subMatches = f.subVariants.some(sub => 
        sub.label.toLowerCase().includes(q) || 
        sub.description.toLowerCase().includes(q) ||
        sub.id.toLowerCase().includes(q)
      );
      return mainMatches || subMatches;
    });
  }, [searchQuery]);

  // Filter all flows
  const filteredAllFlows = useMemo(() => {
    let flows = allFlows;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      flows = flows.filter(f => 
        f.label.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.id.toLowerCase().includes(query)
      );
    }
    if (selectedCategory !== 'all') {
      flows = flows.filter(f => f.category === selectedCategory);
    }
    return flows;
  }, [allFlows, searchQuery, selectedCategory]);

  // Group flows by category
  const groupedFlows = useMemo(() => {
    const groups: Record<CategoryKey, FlowItem[]> = {} as any;
    Object.keys(CATEGORIES).forEach(key => { groups[key as CategoryKey] = []; });
    filteredAllFlows.forEach(flow => {
      if (groups[flow.category]) groups[flow.category].push(flow);
    });
    return groups;
  }, [filteredAllFlows]);

  const toggleCategory = (key: CategoryKey) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCategories(newExpanded);
  };

  const totalFlowCount = FLOW_FAMILIES.reduce((acc, f) => acc + 1 + f.subVariants.length, 0);
  const premiumFlowCount = allFlows.filter(f => f.isPremium).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Helmet>
        <title>Flow-Tester | {totalFlowCount}+ Flows | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg">Flow-Tester</span>
              <Badge variant="outline" className="ml-2">{totalFlowCount} Flows</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <FlowRatingsDisplay />
            <TopTenFlowSelector />
            <FlowZipExport />
            <FlowExportDialog />
            <Link to="/flow-command-center">
              <Button variant="outline" size="sm">
                Command Center
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="families" className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="families" className="gap-2">
                <Grid3X3 className="h-4 w-4" />
                Familien
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-2">
                <List className="h-4 w-4" />
                Alle Flows ({allFlows.length})
              </TabsTrigger>
            </TabsList>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Flow suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{totalFlowCount}</div>
                <div className="text-xs text-muted-foreground">Total Flows</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">{premiumFlowCount}</div>
                <div className="text-xs text-muted-foreground">Premium ⭐</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{STANDALONE_FLOWS.length}</div>
                <div className="text-xs text-muted-foreground">Standalone</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{Object.keys(CATEGORIES).length}</div>
                <div className="text-xs text-muted-foreground">Kategorien</div>
              </CardContent>
            </Card>
          </div>

          {/* Families Tab */}
          <TabsContent value="families" className="space-y-6 mt-0">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">Flow-Familien</h3>
                    <p className="text-sm text-muted-foreground">
                      Klicken Sie auf eine Flow-Familie um alle Varianten auf einer eigenen Landingpage zu sehen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFamilies.map((flow, index) => {
                const totalCount = 1 + flow.subVariants.length;
                const IconComponent = flow.icon;
                
                return (
                  <motion.div
                    key={flow.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link to={flow.path}>
                      <Card className="relative overflow-hidden group hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer h-full">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg ${flow.color} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base group-hover:text-primary transition-colors">
                                {flow.label}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground truncate">{flow.description}</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                          </div>
                        </CardHeader>
                        
                        <CardContent className="py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">{flow.steps} Schritte</Badge>
                            <Badge variant="outline" className="text-xs">{totalCount} Flows</Badge>
                          </div>
                        </CardContent>

                        <div className={`absolute inset-0 ${flow.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* All Flows Tab */}
          <TabsContent value="all" className="space-y-6 mt-0">
            {/* Category Filter */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className="shrink-0"
                >
                  Alle ({allFlows.length})
                </Button>
                {Object.entries(CATEGORIES).slice(0, 6).map(([key, cat]) => {
                  const count = groupedFlows[key as CategoryKey]?.length || 0;
                  if (count === 0) return null;
                  return (
                    <Button
                      key={key}
                      size="sm"
                      variant={selectedCategory === key ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(key as CategoryKey)}
                      className="shrink-0 gap-1"
                    >
                      <cat.icon className="h-3 w-3" />
                      {cat.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Categories with Flows */}
            <div className="space-y-4">
              {Object.entries(groupedFlows)
                .filter(([_, flows]) => flows.length > 0)
                .map(([key, flows]) => {
                  const category = CATEGORIES[key as CategoryKey];
                  const CategoryIcon = category.icon;
                  const isExpanded = expandedCategories.has(key as CategoryKey);
                  
                  return (
                    <div key={key} className="space-y-3">
                      <button 
                        onClick={() => toggleCategory(key as CategoryKey)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br",
                            category.color
                          )}>
                            <CategoryIcon className="h-4 w-4 text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-sm">{category.label}</h3>
                            <p className="text-xs text-muted-foreground">{flows.length} Flows</p>
                          </div>
                        </div>
                        <ArrowRight className={cn(
                          "h-4 w-4 transition-transform text-muted-foreground",
                          isExpanded && "rotate-90"
                        )} />
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid gap-2 md:grid-cols-2 lg:grid-cols-3"
                          >
                            {flows.map((flow, index) => {
                              const standaloneUrl = getStandaloneUrl(flow.id);
                              
                              return (
                                <motion.div
                                  key={flow.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.02 }}
                                >
                                  <Card className="group hover:shadow-md transition-all border-muted/50 hover:border-primary/30">
                                    <CardContent className="p-3">
                                      <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-sm truncate">{flow.label}</h4>
                                            {flow.isPremium && (
                                              <Badge variant="secondary" className="text-[10px] px-1 py-0 bg-amber-100 text-amber-800">
                                                ⭐
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="text-xs text-muted-foreground line-clamp-1">
                                            {flow.description}
                                          </p>
                                        </div>
                                        
                                        {standaloneUrl ? (
                                          <Button size="sm" className="h-8 gap-1 shrink-0" asChild>
                                            <Link to={standaloneUrl}>
                                              <Play className="h-3 w-3" />
                                              <span className="hidden sm:inline">Test</span>
                                            </Link>
                                          </Button>
                                        ) : (
                                          <Button size="sm" variant="outline" className="h-8 gap-1 shrink-0" asChild>
                                            <Link to={flow.path}>
                                              <ExternalLink className="h-3 w-3" />
                                            </Link>
                                          </Button>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-8 border-t mt-8">
          <Link to="/flow-command-center">
            <Button variant="outline">Command Center</Button>
          </Link>
          <Link to="/flow-comparison">
            <Button variant="outline">Flow-Vergleich</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
