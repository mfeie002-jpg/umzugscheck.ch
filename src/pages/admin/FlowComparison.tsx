/**
 * Flow Comparison Page - Shows all sub-variants with "Alle" overview and ratings
 * 
 * Features:
 * - "Alle" tab showing all flows ranked by analysis score
 * - Individual flow views (V1, V2, etc.)
 * - Rating integration from flow_analysis_runs
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Camera, Star, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';
import { FLOW_COMPONENT_REGISTRY } from '@/lib/flowComponentRegistry';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface FlowScore {
  flowId: string;
  overallScore: number | null;
  conversionScore: number | null;
  uxScore: number | null;
  mobileScore: number | null;
  lastAnalyzed: string | null;
}

// Get main flow key for a number
function getMainFlowKey(flowNumber: number): string {
  return `umzugsofferten-v${flowNumber}`;
}

// Get all variants for a flow number
function getVariantsForFlow(flowNumber: number | 'all') {
  const variants: Array<{
    id: string;
    label: string;
    description: string;
    color: string;
    path: string;
    stepCount: number;
    isMain: boolean;
    flowNumber: number;
  }> = [];
  
  if (flowNumber === 'all') {
    // Get ALL variants from all flows
    Object.entries(FLOW_CONFIGS).forEach(([id, config]) => {
      const match = id.match(/umzugsofferten-v(\d+)/);
      if (match) {
        variants.push({
          id,
          label: config.label,
          description: config.description,
          color: config.color,
          path: config.path,
          stepCount: config.steps.length,
          isMain: true,
          flowNumber: parseInt(match[1], 10),
        });
      }
    });
    
    Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
      const match = id.match(/^v(\d+)([a-z])$/i);
      if (match) {
        variants.push({
          id,
          label: config.label,
          description: config.description,
          color: config.color,
          path: config.path,
          stepCount: config.steps.length,
          isMain: false,
          flowNumber: parseInt(match[1], 10),
        });
      }
    });
  } else {
    const mainFlowKey = getMainFlowKey(flowNumber);
    const mainFlow = FLOW_CONFIGS[mainFlowKey];
    
    // Add main flow
    if (mainFlow) {
      variants.push({
        id: mainFlowKey,
        label: mainFlow.label,
        description: mainFlow.description,
        color: mainFlow.color,
        path: mainFlow.path,
        stepCount: mainFlow.steps.length,
        isMain: true,
        flowNumber,
      });
    }
    
    // Add sub-variants
    Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
      const match = id.match(/^v(\d+)([a-z])$/i);
      if (match && parseInt(match[1], 10) === flowNumber) {
        variants.push({
          id,
          label: config.label,
          description: config.description,
          color: config.color,
          path: config.path,
          stepCount: config.steps.length,
          isMain: false,
          flowNumber,
        });
      }
    });
  }
  
  return variants;
}

// Get all available flow numbers
function getAllFlowNumbers(): number[] {
  const numbers = new Set<number>();
  
  Object.keys(FLOW_CONFIGS).forEach(key => {
    const match = key.match(/umzugsofferten-v(\d+)/);
    if (match) numbers.add(parseInt(match[1], 10));
  });
  
  Object.keys(SUB_VARIANT_CONFIGS).forEach(key => {
    const match = key.match(/^v(\d+)/i);
    if (match) numbers.add(parseInt(match[1], 10));
  });
  
  return Array.from(numbers).sort((a, b) => a - b);
}

// Score badge component
function ScoreBadge({ score, label }: { score: number | null; label?: string }) {
  if (score === null || score === undefined) {
    return (
      <Badge variant="outline" className="text-xs opacity-50">
        {label || 'N/A'}
      </Badge>
    );
  }
  
  const color = score >= 80 
    ? 'bg-green-100 text-green-800 border-green-200' 
    : score >= 60 
      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
      : 'bg-red-100 text-red-800 border-red-200';
  
  return (
    <Badge className={cn('text-xs font-semibold', color)}>
      {label && <span className="mr-1 opacity-70">{label}</span>}
      {score}
    </Badge>
  );
}

export default function FlowComparison() {
  const { flowNumber } = useParams<{ flowNumber: string }>();
  const isAllView = flowNumber === 'all' || flowNumber === undefined;
  const flowNum = isAllView ? 'all' : parseInt(flowNumber || '1', 10);
  
  const [scores, setScores] = useState<Record<string, FlowScore>>({});
  const [sortBy, setSortBy] = useState<'name' | 'score'>('score');
  
  // Fetch scores from database
  useEffect(() => {
    async function fetchScores() {
      try {
        const { data, error } = await supabase
          .from('flow_analysis_runs')
          .select('flow_id, overall_score, conversion_score, ux_score, mobile_score, created_at')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Get latest score per flow
        const scoreMap: Record<string, FlowScore> = {};
        data?.forEach(row => {
          if (!scoreMap[row.flow_id]) {
            scoreMap[row.flow_id] = {
              flowId: row.flow_id,
              overallScore: row.overall_score,
              conversionScore: row.conversion_score,
              uxScore: row.ux_score,
              mobileScore: row.mobile_score,
              lastAnalyzed: row.created_at,
            };
          }
        });
        
        setScores(scoreMap);
      } catch (err) {
        console.error('Failed to fetch scores:', err);
      }
    }
    
    fetchScores();
  }, []);
  
  let variants = getVariantsForFlow(flowNum);
  const allFlowNumbers = getAllFlowNumbers();
  const mainFlowConfig = flowNum !== 'all' ? FLOW_CONFIGS[getMainFlowKey(flowNum as number)] : null;
  
  // Sort variants by score if in 'all' view
  if (isAllView && sortBy === 'score') {
    variants = [...variants].sort((a, b) => {
      const scoreA = scores[a.id]?.overallScore ?? -1;
      const scoreB = scores[b.id]?.overallScore ?? -1;
      return scoreB - scoreA;
    });
  }
  
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link to="/admin/tools?tab=flow-automation">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">
                  {isAllView ? 'Alle Flows (Ranking)' : `V${flowNum} Flow Vergleich`}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isAllView 
                    ? `${variants.length} Varianten nach Score sortiert`
                    : `${variants.length} Varianten • ${mainFlowConfig?.description || 'Alle Sub-Varianten'}`
                  }
                </p>
              </div>
            </div>
            
            {/* Flow Selector with "Alle" option */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground mr-2">Flow:</span>
              
              {/* "Alle" button */}
              <Link to="/admin/flow-comparison/all">
                <Button 
                  variant={isAllView ? 'default' : 'outline'} 
                  size="sm"
                  className={isAllView ? 'bg-gradient-to-r from-primary to-secondary' : ''}
                >
                  <Award className="w-3.5 h-3.5 mr-1" />
                  Alle
                </Button>
              </Link>
              
              {allFlowNumbers.map(num => (
                <Link key={num} to={`/admin/flow-comparison/${num}`}>
                  <Button 
                    variant={num === flowNum ? 'default' : 'outline'} 
                    size="sm"
                  >
                    V{num}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Sort controls for "Alle" view */}
          {isAllView && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-muted-foreground">Sortieren:</span>
              <Button 
                variant={sortBy === 'score' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setSortBy('score')}
              >
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                Nach Score
              </Button>
              <Button 
                variant={sortBy === 'name' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setSortBy('name')}
              >
                Nach Name
              </Button>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        {variants.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {isAllView ? 'Keine Varianten gefunden.' : `Keine Varianten für V${flowNum} gefunden.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          variants.map((variant, index) => {
            const Component = FLOW_COMPONENT_REGISTRY[variant.id];
            const score = scores[variant.id];
            const rank = isAllView && sortBy === 'score' ? index + 1 : null;
            
            return (
              <div key={variant.id} id={variant.id} className="scroll-mt-24">
                <Card className="overflow-hidden border-2">
                  <CardHeader className={`${variant.color} text-white`}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          {/* Rank badge for "Alle" view */}
                          {rank !== null && (
                            <Badge variant="secondary" className={cn(
                              "text-lg px-3 py-1 font-bold",
                              rank === 1 ? "bg-yellow-400 text-yellow-900" :
                              rank === 2 ? "bg-gray-300 text-gray-800" :
                              rank === 3 ? "bg-amber-600 text-white" :
                              "bg-white/20 text-white"
                            )}>
                              #{rank}
                            </Badge>
                          )}
                          
                          <Badge variant="secondary" className="bg-white/10 text-white font-mono">
                            {variant.id}
                          </Badge>
                          
                          {variant.isMain && (
                            <Badge variant="secondary" className="bg-white/30 text-white">
                              Hauptflow
                            </Badge>
                          )}
                          
                          {isAllView && (
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              V{variant.flowNumber}
                            </Badge>
                          )}
                        </div>
                        
                        <CardTitle className="text-2xl mt-3">{variant.label}</CardTitle>
                        <CardDescription className="text-white/80 mt-1">
                          {variant.description} • {variant.stepCount} Steps
                        </CardDescription>
                        
                        {/* Score badges */}
                        {score && (
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <ScoreBadge score={score.overallScore} label="Gesamt" />
                            <ScoreBadge score={score.conversionScore} label="Conv" />
                            <ScoreBadge score={score.uxScore} label="UX" />
                            <ScoreBadge score={score.mobileScore} label="Mobile" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link to={variant.path} target="_blank">
                          <Button variant="secondary" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Live
                          </Button>
                        </Link>
                        <Link to={`/admin/tools?tab=calculator-review&flow=${variant.id}`}>
                          <Button variant="secondary" size="sm">
                            <Camera className="h-4 w-4 mr-2" />
                            Screenshot
                          </Button>
                        </Link>
                        <Link to={`/admin/flow-analysis?flow=${variant.id}&view=analysis`}>
                          <Button variant="secondary" size="sm">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analyse
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {/* Only show component in individual flow view, not in "Alle" */}
                  {!isAllView && (
                    <CardContent className="p-0">
                      <div className="bg-background p-6 lg:p-8">
                        {Component ? (
                          <div className="max-w-4xl mx-auto">
                            <Component />
                          </div>
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            <p>Komponente für <code className="bg-muted px-2 py-1 rounded">{variant.id}</code> nicht gefunden</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            );
          })
        )}
      </main>
      
      {/* Quick Navigation (only for individual flows) */}
      {!isAllView && variants.length > 1 && (
        <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
          <Card className="p-2">
            <div className="space-y-1">
              {variants.map((variant, index) => (
                <a
                  key={variant.id}
                  href={`#${variant.id}`}
                  className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                >
                  #{index + 1} {variant.id}
                </a>
              ))}
            </div>
          </Card>
        </nav>
      )}
    </div>
  );
}
