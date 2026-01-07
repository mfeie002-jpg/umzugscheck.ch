/**
 * FlowRatingsDisplay - Shows collected ratings from localStorage
 * Displays: Average rating per flow, number of ratings, top tags
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, TrendingUp, Users, Tag, BarChart3, RefreshCw } from 'lucide-react';
import { loadFlowRatings, FlowRating } from '@/components/flow-components/FlowCompleteFeedback';
import { cn } from '@/lib/utils';

interface FlowStats {
  flowId: string;
  avgRating: number;
  totalRatings: number;
  topTags: { tag: string; count: number }[];
  recentComments: string[];
}

function calculateFlowStats(ratings: FlowRating[]): FlowStats[] {
  const flowMap = new Map<string, FlowRating[]>();
  
  ratings.forEach(rating => {
    const existing = flowMap.get(rating.flowId) || [];
    flowMap.set(rating.flowId, [...existing, rating]);
  });
  
  const stats: FlowStats[] = [];
  
  flowMap.forEach((flowRatings, flowId) => {
    // Calculate average
    const avgRating = flowRatings.reduce((sum, r) => sum + r.stars, 0) / flowRatings.length;
    
    // Count tags
    const tagCounts = new Map<string, number>();
    flowRatings.forEach(r => {
      r.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    
    const topTags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
    
    // Get recent comments
    const recentComments = flowRatings
      .filter(r => r.comment)
      .map(r => r.comment!)
      .slice(-3);
    
    stats.push({
      flowId,
      avgRating: Math.round(avgRating * 10) / 10,
      totalRatings: flowRatings.length,
      topTags,
      recentComments,
    });
  });
  
  return stats.sort((a, b) => b.avgRating - a.avgRating);
}

const TAG_LABELS: Record<string, string> = {
  fast: 'Schnell ⚡',
  easy: 'Einfach 👍',
  clear: 'Klar 👁️',
  trustworthy: 'Vertrauenswürdig 🛡️',
};

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({ rating, size = 'sm' }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={cn(
          size === 'sm' ? 'h-3 w-3' : 'h-4 w-4',
          i <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
        )}
      />
    );
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

export function FlowRatingsDisplay() {
  const [isOpen, setIsOpen] = useState(false);
  const [ratings, setRatings] = useState<FlowRating[]>([]);
  const [stats, setStats] = useState<FlowStats[]>([]);
  
  const loadRatings = () => {
    const loaded = loadFlowRatings();
    setRatings(loaded);
    setStats(calculateFlowStats(loaded));
  };
  
  useEffect(() => {
    loadRatings();
    
    // Listen for new ratings
    const handleNewRating = () => loadRatings();
    window.addEventListener('flow-rating-submitted', handleNewRating);
    return () => window.removeEventListener('flow-rating-submitted', handleNewRating);
  }, []);
  
  const totalRatings = ratings.length;
  const overallAvg = totalRatings > 0 
    ? Math.round((ratings.reduce((sum, r) => sum + r.stars, 0) / totalRatings) * 10) / 10
    : 0;
  
  // Count all tags
  const allTags = new Map<string, number>();
  ratings.forEach(r => {
    r.tags.forEach(tag => {
      allTags.set(tag, (allTags.get(tag) || 0) + 1);
    });
  });
  const topGlobalTags = Array.from(allTags.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Bewertungen
          {totalRatings > 0 && (
            <Badge variant="secondary" className="ml-1">
              {totalRatings}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl">Flow-Bewertungen</span>
                <p className="text-sm font-normal text-muted-foreground mt-0.5">
                  Gesammelte Nutzerbewertungen aus localStorage
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={loadRatings}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {totalRatings === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12 text-center">
            <div>
              <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
              <p className="text-lg font-medium">Noch keine Bewertungen</p>
              <p className="text-sm text-muted-foreground mt-1">
                Bewertungen werden gesammelt, wenn Nutzer Flows abschliessen
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="p-6 border-b bg-muted/30">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    <span className="text-2xl font-bold">{overallAvg}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Durchschnitt</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{totalRatings}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Bewertungen</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    <span className="text-2xl font-bold">{stats.length}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Flows bewertet</p>
                </div>
              </div>
              
              {/* Top Global Tags */}
              {topGlobalTags.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Top Feedback-Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topGlobalTags.map(([tag, count]) => (
                      <Badge key={tag} variant="secondary">
                        {TAG_LABELS[tag] || tag} ({count})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Per-Flow Stats */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {stats.map((flowStat, index) => (
                  <Card key={flowStat.flowId} className={index === 0 ? 'ring-2 ring-amber-500/50' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {index === 0 && (
                              <Badge className="bg-amber-500 text-white text-xs">Top</Badge>
                            )}
                            <p className="font-semibold truncate">{flowStat.flowId}</p>
                          </div>
                          
                          <div className="flex items-center gap-3 mb-2">
                            <StarRating rating={Math.round(flowStat.avgRating)} />
                            <span className="text-sm font-medium">{flowStat.avgRating}</span>
                            <span className="text-xs text-muted-foreground">
                              ({flowStat.totalRatings} {flowStat.totalRatings === 1 ? 'Bewertung' : 'Bewertungen'})
                            </span>
                          </div>
                          
                          {flowStat.topTags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {flowStat.topTags.map(({ tag, count }) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {TAG_LABELS[tag] || tag} ({count})
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {flowStat.recentComments.length > 0 && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs text-muted-foreground mb-1">Letzte Kommentare:</p>
                              {flowStat.recentComments.map((comment, i) => (
                                <p key={i} className="text-xs italic text-muted-foreground">
                                  "{comment}"
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-bold text-amber-500">{flowStat.avgRating}</div>
                          <div className="text-xs text-muted-foreground">/ 5</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
