/**
 * FlowComparison - Top 10 Flows Vergleichsseite
 * 
 * Zeigt die besten Flows nach Score nebeneinander/untereinander
 * für einfachen Vergleich auf Desktop und Mobile.
 */

import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Star, 
  TrendingUp, 
  Smartphone, 
  Monitor,
  Grid3X3,
  List,
  ArrowUpDown
} from 'lucide-react';

// Top flows with their scores (from analysis)
const TOP_FLOWS = [
  { 
    id: 'v1', 
    label: 'V1 Control Flow', 
    path: '/umzugsofferten-v1a',
    score: 96, 
    issues: 0,
    criticalIssues: 0,
    badge: 'Baseline',
    highlights: ['Minimal', '2 Steps', 'Schnell'],
  },
  { 
    id: 'v1f', 
    label: 'V1f Sticky CTA + Trust', 
    path: '/umzugsofferten-v1f',
    score: 95, 
    issues: 0,
    criticalIssues: 0,
    badge: 'Neu ⭐',
    highlights: ['Micro-Feedback', 'Step Trust Pills', 'WhyThis'],
  },
  { 
    id: 'v1g', 
    label: 'V1g Input UX', 
    path: '/umzugsofferten-v1g',
    score: 94, 
    issues: 0,
    criticalIssues: 0,
    badge: 'Neu ⭐',
    highlights: ['Inline Validation', 'Mobile InputMode', 'Completion Indicators'],
  },
  { 
    id: 'v2c', 
    label: 'V2c Trust Focused', 
    path: '/umzugsofferten-v2?variant=v2c',
    score: 79, 
    issues: 22,
    criticalIssues: 2,
    badge: 'Trust',
    highlights: ['Trust-Elemente', '6 Steps', 'Detailliert'],
  },
  { 
    id: 'v2e', 
    label: 'V2e Chat Funnel', 
    path: '/umzugsofferten-v2e',
    score: 79, 
    issues: 35,
    criticalIssues: 3,
    badge: 'Chat ⭐',
    highlights: ['Conversational', 'Modern', 'Chat-UI'],
  },
  { 
    id: 'v9d', 
    label: 'V9d Main Gemini', 
    path: '/umzugsofferten-v9d',
    score: 76, 
    issues: 41,
    criticalIssues: 6,
    badge: 'Gemini',
    highlights: ['AI-Optimiert', '9 Steps', 'Umfangreich'],
  },
  { 
    id: 'v9b', 
    label: 'V9b ChatGPT Pro Ext', 
    path: '/umzugsofferten-v9b',
    score: 73, 
    issues: 39,
    criticalIssues: 10,
    badge: 'ChatGPT ⭐',
    highlights: ['ChatGPT-Optimiert', 'Extended', 'Social Proof'],
  },
  { 
    id: 'v9c', 
    label: 'V9c Zero Friction', 
    path: '/umzugsofferten-v9c',
    score: 72, 
    issues: 39,
    criticalIssues: 13,
    badge: 'Zero Friction',
    highlights: ['Minimal Friction', 'Schnell', 'Optimiert'],
  },
  { 
    id: 'v3a', 
    label: 'V3a Mobile First', 
    path: '/umzugsofferten-v3a',
    score: 70, 
    issues: 28,
    criticalIssues: 4,
    badge: 'Mobile',
    highlights: ['Mobile-First', 'Thumb Zone', 'Touch-Optimiert'],
  },
  { 
    id: 'v4b', 
    label: 'V4b Social Proof', 
    path: '/umzugsofferten-v4b',
    score: 68, 
    issues: 32,
    criticalIssues: 5,
    badge: 'Social',
    highlights: ['Social Proof', 'Reviews', 'Trust'],
  },
];

type ViewMode = 'grid' | 'list';
type SortBy = 'score' | 'issues' | 'name';

const FlowComparison = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('score');
  const [showOnlyNew, setShowOnlyNew] = useState(false);

  const sortedFlows = useMemo(() => {
    let flows = [...TOP_FLOWS];
    
    if (showOnlyNew) {
      flows = flows.filter(f => f.badge.includes('⭐') || f.badge === 'Neu ⭐');
    }

    switch (sortBy) {
      case 'score':
        return flows.sort((a, b) => b.score - a.score);
      case 'issues':
        return flows.sort((a, b) => a.criticalIssues - b.criticalIssues);
      case 'name':
        return flows.sort((a, b) => a.label.localeCompare(b.label));
      default:
        return flows;
    }
  }, [sortBy, showOnlyNew]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Flow Vergleich | Top 10 Flows | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Top 10 Flow Vergleich
          </h1>
          <p className="text-muted-foreground">
            Alle besten Flows nach Score sortiert - zum einfachen Vergleichen und Testen
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="gap-1"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-1"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Liste</span>
            </Button>
          </div>

          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={sortBy === 'score' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('score')}
              className="gap-1"
            >
              <TrendingUp className="h-4 w-4" />
              Score
            </Button>
            <Button
              variant={sortBy === 'issues' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('issues')}
              className="gap-1"
            >
              <ArrowUpDown className="h-4 w-4" />
              Issues
            </Button>
          </div>

          <Button
            variant={showOnlyNew ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowOnlyNew(!showOnlyNew)}
            className="gap-1"
          >
            <Star className="h-4 w-4" />
            Nur Neue
          </Button>
        </div>

        {/* Tabs for Desktop/Mobile Preview */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all" className="gap-1">
              Alle
            </TabsTrigger>
            <TabsTrigger value="desktop" className="gap-1">
              <Monitor className="h-4 w-4" />
              Desktop
            </TabsTrigger>
            <TabsTrigger value="mobile" className="gap-1">
              <Smartphone className="h-4 w-4" />
              Mobile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedFlows.map((flow, index) => (
                  <FlowCard key={flow.id} flow={flow} rank={index + 1} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedFlows.map((flow, index) => (
                  <FlowListItem key={flow.id} flow={flow} rank={index + 1} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="desktop" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sortedFlows.slice(0, 4).map((flow, index) => (
                <FlowPreviewCard key={flow.id} flow={flow} rank={index + 1} device="desktop" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {sortedFlows.slice(0, 5).map((flow, index) => (
                <FlowPreviewCard key={flow.id} flow={flow} rank={index + 1} device="mobile" />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Schnellzugriff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sortedFlows.map(flow => (
                <Link key={flow.id} to={flow.path}>
                  <Button variant="outline" size="sm" className="gap-1">
                    {flow.label}
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Flow Card Component
const FlowCard = ({ flow, rank }: { flow: typeof TOP_FLOWS[0]; rank: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      {/* Rank Badge */}
      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
        {rank}
      </div>

      <CardContent className="pt-10 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground text-sm">{flow.label}</h3>
            <Badge variant="secondary" className="mt-1 text-xs">
              {flow.badge}
            </Badge>
          </div>
          <div className={`text-2xl font-bold px-2 py-1 rounded border ${getScoreColor(flow.score)}`}>
            {flow.score}
          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1 mb-3">
          {flow.highlights.map(h => (
            <span key={h} className="text-xs bg-muted px-2 py-0.5 rounded">
              {h}
            </span>
          ))}
        </div>

        {/* Issues */}
        <div className="text-xs text-muted-foreground mb-3">
          {flow.criticalIssues > 0 ? (
            <span className="text-destructive">{flow.criticalIssues} kritisch</span>
          ) : (
            <span className="text-green-600">✓ Keine kritischen Issues</span>
          )}
          {flow.issues > 0 && ` • ${flow.issues} total`}
        </div>

        {/* CTA */}
        <Link to={flow.path}>
          <Button size="sm" className="w-full gap-1">
            Öffnen
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

// Flow List Item Component
const FlowListItem = ({ flow, rank }: { flow: typeof TOP_FLOWS[0]; rank: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-emerald-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <Card className="p-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center flex-shrink-0">
          {rank}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground text-sm">{flow.label}</h3>
            <Badge variant="secondary" className="text-xs">{flow.badge}</Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {flow.highlights.join(' • ')}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className={`text-xl font-bold ${getScoreColor(flow.score)}`}>
            {flow.score}
          </div>
          <Link to={flow.path}>
            <Button size="sm" variant="outline" className="gap-1">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

// Flow Preview Card Component
const FlowPreviewCard = ({ 
  flow, 
  rank, 
  device 
}: { 
  flow: typeof TOP_FLOWS[0]; 
  rank: number;
  device: 'desktop' | 'mobile';
}) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
        {rank}
      </div>
      
      {/* Placeholder for screenshot */}
      <div className={`bg-muted ${device === 'mobile' ? 'aspect-[9/16]' : 'aspect-video'} flex items-center justify-center`}>
        <div className="text-center p-4">
          <div className="text-2xl font-bold text-muted-foreground mb-1">{flow.score}</div>
          <div className="text-xs text-muted-foreground">{flow.label}</div>
        </div>
      </div>
      
      <CardContent className="p-3">
        <Link to={flow.path}>
          <Button size="sm" className="w-full gap-1">
            Öffnen
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default FlowComparison;
