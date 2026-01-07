/**
 * FlowRatingsDisplay - Shows collected ratings from localStorage
 * Displays: Average rating per flow, number of ratings, top tags
 * Includes visual charts for rating distribution
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, Users, Tag, BarChart3, RefreshCw, Award, Trophy } from 'lucide-react';
import { loadFlowRatings, FlowRating } from '@/components/flow-components/FlowCompleteFeedback';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FlowStats {
  flowId: string;
  avgRating: number;
  totalRatings: number;
  topTags: { tag: string; count: number }[];
  recentComments: string[];
  ratingDistribution: number[];
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
    
    // Rating distribution [1★, 2★, 3★, 4★, 5★]
    const distribution = [0, 0, 0, 0, 0];
    flowRatings.forEach(r => {
      if (r.stars >= 1 && r.stars <= 5) {
        distribution[r.stars - 1]++;
      }
    });
    
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
      ratingDistribution: distribution,
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

// Rating Distribution Chart
const RatingDistributionChart: React.FC<{ distribution: number[] }> = ({ distribution }) => {
  const maxCount = Math.max(...distribution, 1);
  
  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map(star => {
        const count = distribution[star - 1];
        const percentage = (count / maxCount) * 100;
        
        return (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-4 text-right text-muted-foreground">{star}</span>
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, delay: (5 - star) * 0.1 }}
                className={cn(
                  "h-full rounded-full",
                  star >= 4 ? "bg-emerald-500" : star === 3 ? "bg-amber-500" : "bg-red-500"
                )}
              />
            </div>
            <span className="w-6 text-right text-muted-foreground">{count}</span>
          </div>
        );
      })}
    </div>
  );
};

// Overall Stats Chart
const OverallStatsChart: React.FC<{ ratings: FlowRating[] }> = ({ ratings }) => {
  const distribution = [0, 0, 0, 0, 0];
  ratings.forEach(r => {
    if (r.stars >= 1 && r.stars <= 5) {
      distribution[r.stars - 1]++;
    }
  });
  
  const total = ratings.length || 1;
  
  return (
    <div className="grid grid-cols-5 gap-2">
      {[1, 2, 3, 4, 5].map(star => {
        const count = distribution[star - 1];
        const percentage = (count / total) * 100;
        
        return (
          <div key={star} className="text-center">
            <div className="relative h-24 bg-muted rounded-lg overflow-hidden mb-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${percentage}%` }}
                transition={{ duration: 0.6, delay: star * 0.1 }}
                className={cn(
                  "absolute bottom-0 left-0 right-0 rounded-t-lg",
                  star >= 4 ? "bg-gradient-to-t from-emerald-500 to-emerald-400" : 
                  star === 3 ? "bg-gradient-to-t from-amber-500 to-amber-400" : 
                  "bg-gradient-to-t from-red-500 to-red-400"
                )}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-foreground/80">{count}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-0.5">
              <span className="text-xs font-medium">{star}</span>
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
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
      
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Flow-Bewertungen</span>
                <p className="text-sm font-normal text-muted-foreground mt-0.5">
                  Nutzerfeedback aus abgeschlossenen Flows
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={loadRatings} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Aktualisieren
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {totalRatings === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12 text-center">
            <div>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Star className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <p className="text-lg font-semibold">Noch keine Bewertungen</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Bewertungen werden gesammelt, wenn Nutzer Flows vollständig durchlaufen und Feedback geben.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Stats */}
            <div className="p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-b">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Summary Numbers */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">{overallAvg}</span>
                    </div>
                    <div>
                      <StarRating rating={Math.round(overallAvg)} size="md" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Durchschnitt aus {totalRatings} Bewertungen
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-background/50">
                      <CardContent className="p-3 flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xl font-bold">{totalRatings}</p>
                          <p className="text-xs text-muted-foreground">Bewertungen</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-background/50">
                      <CardContent className="p-3 flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                        <div>
                          <p className="text-xl font-bold">{stats.length}</p>
                          <p className="text-xs text-muted-foreground">Flows bewertet</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Right: Distribution Chart */}
                <div>
                  <p className="text-sm font-medium mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Bewertungsverteilung
                  </p>
                  <OverallStatsChart ratings={ratings} />
                </div>
              </div>
              
              {/* Top Global Tags */}
              {topGlobalTags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Beliebteste Feedback-Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topGlobalTags.map(([tag, count]) => (
                      <Badge key={tag} className="bg-background/80 text-foreground border">
                        {TAG_LABELS[tag] || tag} 
                        <span className="ml-1.5 text-muted-foreground">({count})</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Per-Flow Stats */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                <p className="text-sm font-semibold flex items-center gap-2 mb-4">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Flow-Ranking nach Bewertung
                </p>
                
                {stats.map((flowStat, index) => (
                  <motion.div
                    key={flowStat.flowId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={cn(
                      "overflow-hidden transition-shadow hover:shadow-md",
                      index === 0 && "ring-2 ring-amber-500/50 bg-amber-500/5"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Rank Badge */}
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold shrink-0",
                            index === 0 ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white" :
                            index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white" :
                            index === 2 ? "bg-gradient-to-br from-orange-600 to-orange-700 text-white" :
                            "bg-muted text-muted-foreground"
                          )}>
                            {index === 0 ? <Trophy className="h-5 w-5" /> : `#${index + 1}`}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className="font-semibold">{flowStat.flowId}</p>
                              {index === 0 && (
                                <Badge className="bg-amber-500 text-white text-xs">Top Flow</Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 mb-3">
                              <StarRating rating={Math.round(flowStat.avgRating)} />
                              <span className="text-sm font-medium">{flowStat.avgRating}/5</span>
                              <span className="text-xs text-muted-foreground">
                                ({flowStat.totalRatings} {flowStat.totalRatings === 1 ? 'Bewertung' : 'Bewertungen'})
                              </span>
                            </div>
                            
                            {/* Mini Distribution */}
                            <div className="mb-3">
                              <RatingDistributionChart distribution={flowStat.ratingDistribution} />
                            </div>
                            
                            {flowStat.topTags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {flowStat.topTags.map(({ tag, count }) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {TAG_LABELS[tag] || tag} ({count})
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            {flowStat.recentComments.length > 0 && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-xs text-muted-foreground mb-1">💬 Kommentare:</p>
                                {flowStat.recentComments.map((comment, i) => (
                                  <p key={i} className="text-xs italic text-muted-foreground bg-muted/50 rounded px-2 py-1 mb-1">
                                    "{comment}"
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Big Score */}
                          <div className="text-right shrink-0">
                            <div className={cn(
                              "text-3xl font-bold",
                              flowStat.avgRating >= 4.5 ? "text-emerald-500" :
                              flowStat.avgRating >= 4 ? "text-amber-500" :
                              flowStat.avgRating >= 3 ? "text-orange-500" : "text-red-500"
                            )}>
                              {flowStat.avgRating}
                            </div>
                            <div className="text-xs text-muted-foreground">/ 5</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
