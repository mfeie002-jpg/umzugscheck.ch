/**
 * Flow Overview - All 80+ flows grouped by category with filters
 * Mobile-optimized gallery with direct navigation to standalone flow pages
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Sparkles, 
  Zap, 
  Target, 
  Crown, 
  Medal,
  ArrowRight,
  Grid3X3,
  List,
  ExternalLink,
  Play,
  Trophy,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';

// Define categories for flows
const CATEGORIES = {
  'gemini-top': {
    label: 'Gemini Top 3',
    icon: Crown,
    color: 'from-amber-500 to-orange-600',
    description: 'Die besten Flows nach Gemini-Analyse'
  },
  'swiss-premium': {
    label: 'Swiss Premium',
    icon: Medal,
    color: 'from-red-500 to-rose-600',
    description: 'Speziell für den Schweizer Markt optimiert'
  },
  'top-10-upgrades': {
    label: 'Top 10 Upgrades',
    icon: Trophy,
    color: 'from-blue-500 to-indigo-600',
    description: '5.0 Score-optimierte Flows'
  },
  'chatgpt-flows': {
    label: 'ChatGPT Flows',
    icon: Sparkles,
    color: 'from-green-500 to-emerald-600',
    description: 'Von ChatGPT optimierte Varianten'
  },
  'v1-control': {
    label: 'V1 Control',
    icon: Target,
    color: 'from-blue-400 to-blue-600',
    description: 'Baseline Control Flows'
  },
  'v2-premium': {
    label: 'V2 Premium',
    icon: Star,
    color: 'from-purple-400 to-purple-600',
    description: 'Full-Journey Premium Flows'
  },
  'v3-mobile': {
    label: 'V3 Mobile-First',
    icon: Zap,
    color: 'from-green-400 to-green-600',
    description: 'Mobile-optimierte Flows'
  },
  'v4-video': {
    label: 'V4 Video-First',
    icon: Play,
    color: 'from-pink-400 to-pink-600',
    description: 'Video-basierte Flows'
  },
  'v5-marketplace': {
    label: 'V5 Marketplace',
    icon: Grid3X3,
    color: 'from-yellow-400 to-yellow-600',
    description: 'Marketplace & Accessibility Flows'
  },
  'v6-ultimate': {
    label: 'V6 Ultimate',
    icon: Flame,
    color: 'from-orange-400 to-orange-600',
    description: '6-Tier Ultimate Flows'
  },
  'v7-v9-special': {
    label: 'V7-V9 Special',
    icon: Sparkles,
    color: 'from-teal-400 to-cyan-600',
    description: 'SwissMove, Decision-Free, Zero Friction'
  },
  'ultimate': {
    label: 'Ultimate Flows',
    icon: Crown,
    color: 'from-purple-500 to-pink-500',
    description: 'Combined Best Practices'
  }
};

type CategoryKey = keyof typeof CATEGORIES;

// Build flow list from configs
interface FlowItem {
  id: string;
  label: string;
  description: string;
  path: string;
  category: CategoryKey;
  score?: number;
  isNew?: boolean;
  isPremium?: boolean;
}

function categorizeFlow(id: string, label: string): CategoryKey {
  // Gemini Top 3
  if (['v9-zero-friction', 'ultimate-best36', 'golden-flow-v10'].includes(id)) return 'gemini-top';
  
  // Swiss Premium
  if (id.includes('swiss') || id === 'ultimate-v7' || id === 'ultimate-ch') return 'swiss-premium';
  
  // Top 10 Upgrades
  if (['multi-a', 'v6a', 'v1a', 'v1f', 'v8a', 'v4c', 'v2f'].includes(id)) return 'top-10-upgrades';
  
  // ChatGPT Flows
  if (id.includes('chatgpt')) return 'chatgpt-flows';
  
  // Ultimate flows
  if (id.includes('ultimate') || id.includes('archetyp')) return 'ultimate';
  
  // V1-V6 categories
  if (id.startsWith('v1') || id === 'umzugsofferten-v1') return 'v1-control';
  if (id.startsWith('v2') || id === 'umzugsofferten-v2') return 'v2-premium';
  if (id.startsWith('v3') || id === 'umzugsofferten-v3') return 'v3-mobile';
  if (id.startsWith('v4') || id === 'umzugsofferten-v4') return 'v4-video';
  if (id.startsWith('v5') || id === 'umzugsofferten-v5') return 'v5-marketplace';
  if (id.startsWith('v6') || id === 'umzugsofferten-v6') return 'v6-ultimate';
  
  // V7-V9
  if (id.startsWith('v7') || id.startsWith('v8') || id.startsWith('v9') || id.startsWith('multi')) return 'v7-v9-special';
  
  return 'v1-control'; // Default
}

function buildFlowList(): FlowItem[] {
  const flows: FlowItem[] = [];
  
  // Add main flows
  Object.entries(FLOW_CONFIGS).forEach(([id, config]) => {
    flows.push({
      id,
      label: config.label,
      description: config.description,
      path: config.path,
      category: categorizeFlow(id, config.label),
      isPremium: config.label.includes('⭐'),
      isNew: config.label.includes('NEW') || id.includes('ultimate')
    });
  });
  
  // Add sub-variants
  Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
    flows.push({
      id,
      label: config.label,
      description: config.description,
      path: config.path,
      category: categorizeFlow(id, config.label),
      isPremium: config.label.includes('⭐'),
      isNew: config.label.includes('NEW')
    });
  });
  
  return flows;
}

// Flow Card Component
const FlowCard: React.FC<{ flow: FlowItem; index: number }> = ({ flow, index }) => {
  const category = CATEGORIES[flow.category];
  const CategoryIcon = category.icon;
  
  // Map flow ID to standalone URL if available
  const getStandaloneUrl = (flowId: string): string | null => {
    const standaloneFlows = [
      'v9-zero-friction', 'ultimate-best36', 'golden-flow-v10',
      'swiss-lightning', 'swiss-premium-choice', 'swiss-concierge-hybrid', 'ultimate-v7',
      'multi-a', 'v6a', 'v1a', 'v1f', 'v8a', 'v4c', 'v2f'
    ];
    if (standaloneFlows.includes(flowId)) {
      return `/flow/${flowId}`;
    }
    return null;
  };
  
  const standaloneUrl = getStandaloneUrl(flow.id);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 border-muted/50 hover:border-primary/30 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br",
                  category.color
                )}>
                  <CategoryIcon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{flow.label}</h3>
                  {flow.isPremium && (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0 bg-amber-100 text-amber-800">
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {flow.description}
              </p>
            </div>
            
            <div className="flex flex-col gap-1">
              {standaloneUrl ? (
                <Button
                  size="sm"
                  variant="default"
                  className="h-8 gap-1"
                  asChild
                >
                  <Link to={standaloneUrl}>
                    <Play className="h-3 w-3" />
                    <span className="hidden sm:inline">Testen</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1"
                  asChild
                >
                  <Link to={flow.path}>
                    <ExternalLink className="h-3 w-3" />
                    <span className="hidden sm:inline">Öffnen</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Category Section Component
const CategorySection: React.FC<{ 
  categoryKey: CategoryKey; 
  flows: FlowItem[];
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ categoryKey, flows, isExpanded, onToggle }) => {
  const category = CATEGORIES[categoryKey];
  const CategoryIcon = category.icon;
  
  const displayedFlows = isExpanded ? flows : flows.slice(0, 6);
  
  return (
    <div className="space-y-4">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r hover:opacity-90 transition-opacity"
        style={{
          background: `linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.05))`
        }}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br",
            category.color
          )}>
            <CategoryIcon className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <h2 className="font-semibold text-lg">{category.label}</h2>
            <p className="text-sm text-muted-foreground">{flows.length} Flows</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{category.description}</Badge>
          <ArrowRight className={cn(
            "h-5 w-5 transition-transform",
            isExpanded && "rotate-90"
          )} />
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
          >
            {displayedFlows.map((flow, index) => (
              <FlowCard key={flow.id} flow={flow} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FlowOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | 'all'>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<CategoryKey>>(
    new Set(['gemini-top', 'top-10-upgrades', 'swiss-premium'])
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const allFlows = useMemo(() => buildFlowList(), []);
  
  // Filter flows
  const filteredFlows = useMemo(() => {
    let flows = allFlows;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      flows = flows.filter(f => 
        f.label.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.id.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      flows = flows.filter(f => f.category === selectedCategory);
    }
    
    return flows;
  }, [allFlows, searchQuery, selectedCategory]);
  
  // Group flows by category
  const groupedFlows = useMemo(() => {
    const groups: Record<CategoryKey, FlowItem[]> = {} as any;
    
    Object.keys(CATEGORIES).forEach(key => {
      groups[key as CategoryKey] = [];
    });
    
    filteredFlows.forEach(flow => {
      if (groups[flow.category]) {
        groups[flow.category].push(flow);
      }
    });
    
    return groups;
  }, [filteredFlows]);
  
  const toggleCategory = (key: CategoryKey) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCategories(newExpanded);
  };
  
  // Stats
  const totalFlows = allFlows.length;
  const premiumFlows = allFlows.filter(f => f.isPremium).length;
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Flow Übersicht | {totalFlows}+ Flows | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Flow Übersicht</h1>
              <p className="text-muted-foreground">
                {totalFlows} Flows • {premiumFlows} Premium
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Flow suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Button variant="outline" size="icon" asChild>
                <Link to="/flow-tester">
                  <Play className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" size="icon" asChild>
                <Link to="/admin/flow-command-center">
                  <Target className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Category Filter Tabs */}
          <div className="mt-4 overflow-x-auto pb-2">
            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
              <TabsList className="inline-flex h-9 gap-1 bg-muted/50">
                <TabsTrigger value="all" className="text-xs px-3">
                  Alle ({totalFlows})
                </TabsTrigger>
                {Object.entries(CATEGORIES).slice(0, 6).map(([key, cat]) => (
                  <TabsTrigger key={key} value={key} className="text-xs px-3 gap-1">
                    <cat.icon className="h-3 w-3" />
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{totalFlows}</div>
              <div className="text-sm text-muted-foreground">Total Flows</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-600">{premiumFlows}</div>
              <div className="text-sm text-muted-foreground">Premium ⭐</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">14</div>
              <div className="text-sm text-muted-foreground">Standalone Pages</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">9</div>
              <div className="text-sm text-muted-foreground">Kategorien</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Categories */}
        {selectedCategory === 'all' ? (
          <div className="space-y-6">
            {Object.entries(groupedFlows)
              .filter(([_, flows]) => flows.length > 0)
              .map(([key, flows]) => (
                <CategorySection
                  key={key}
                  categoryKey={key as CategoryKey}
                  flows={flows}
                  isExpanded={expandedCategories.has(key as CategoryKey)}
                  onToggle={() => toggleCategory(key as CategoryKey)}
                />
              ))}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredFlows.map((flow, index) => (
              <FlowCard key={flow.id} flow={flow} index={index} />
            ))}
          </div>
        )}
        
        {/* No results */}
        {filteredFlows.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Keine Flows gefunden für "{searchQuery}"
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Filter zurücksetzen
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
