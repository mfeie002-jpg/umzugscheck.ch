/**
 * Persistent Score Panel
 * 
 * Shows real-time improvement tracking with database-backed scores.
 * Displays actual improvements that persist across sessions.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Minus, CheckCircle, AlertCircle,
  ArrowRight, X, BarChart3, Trophy, RefreshCw, Sparkles, Database,
  Zap, Target, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ImprovementResult } from '@/lib/persistent-flow-scores';

interface PersistentScorePanelProps {
  reports: ImprovementResult[];
  isVisible: boolean;
  onClose: () => void;
  onRunAgain: () => void;
  isRunning: boolean;
  globalStats: {
    totalFlows: number;
    avgScore: number;
    maxScore: number;
    minScore: number;
    totalIssues: number;
    totalFixed: number;
    fullyOptimized: number;
  } | null;
  improvementPotential: {
    currentTotal: number;
    maxTotal: number;
    potential: number;
    remainingRuns: number;
    percentComplete: number;
  };
}

export default function PersistentScorePanel({
  reports,
  isVisible,
  onClose,
  onRunAgain,
  isRunning,
  globalStats,
  improvementPotential,
}: PersistentScorePanelProps) {
  if (!isVisible) return null;
  
  const hasImprovements = reports.length > 0 && reports.some(r => r.scoreDelta > 0);
  const totalDelta = reports.reduce((sum, r) => sum + r.scoreDelta, 0);
  const totalFixed = reports.reduce((sum, r) => sum + r.fixedFeatures.length, 0);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-4 right-4 z-50 w-[520px] max-h-[85vh] overflow-hidden"
      >
        <Card className="border-2 border-primary/30 shadow-2xl bg-background/98 backdrop-blur-md">
          <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Echte Verbesserungen
                    <Badge variant="secondary" className="text-[10px]">
                      Persistent
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Scores werden in der Datenbank gespeichert
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Global Stats */}
            {globalStats && (
              <div className="grid grid-cols-5 gap-2">
                <div className="p-2.5 rounded-lg bg-muted/50 text-center border">
                  <div className="text-xl font-bold text-primary">{globalStats.avgScore}</div>
                  <div className="text-[10px] text-muted-foreground">Ø Score</div>
                </div>
                <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/30 text-center border border-green-200/50">
                  <div className="text-xl font-bold text-green-600">{globalStats.maxScore}</div>
                  <div className="text-[10px] text-muted-foreground">Max</div>
                </div>
                <div className="p-2.5 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-center border border-yellow-200/50">
                  <div className="text-xl font-bold text-yellow-600">{globalStats.totalIssues}</div>
                  <div className="text-[10px] text-muted-foreground">Issues</div>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center border border-blue-200/50">
                  <div className="text-xl font-bold text-blue-600">{globalStats.totalFixed}</div>
                  <div className="text-[10px] text-muted-foreground">Fixed</div>
                </div>
                <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-center border border-purple-200/50">
                  <div className="text-xl font-bold text-purple-600">{globalStats.fullyOptimized}</div>
                  <div className="text-[10px] text-muted-foreground">100%</div>
                </div>
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" />
                  Optimierungsfortschritt
                </span>
                <span className="font-bold text-primary">
                  {improvementPotential.percentComplete}%
                </span>
              </div>
              <Progress value={improvementPotential.percentComplete} className="h-3" />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{improvementPotential.currentTotal} / {improvementPotential.maxTotal} Punkte</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  ~{improvementPotential.remainingRuns} Runs bis max
                </span>
              </div>
            </div>
            
            {/* Current Run Results */}
            {reports.length > 0 && (
              <>
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Dieser Run
                    </h4>
                    <Badge variant={totalDelta > 0 ? "default" : "secondary"} className="gap-1">
                      {totalDelta > 0 ? <TrendingUp className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                      {totalDelta > 0 ? '+' : ''}{totalDelta} Punkte
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 p-2 rounded bg-green-50 dark:bg-green-950/30">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{totalFixed} Features gefixt</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-blue-50 dark:bg-blue-950/30">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span>{reports.filter(r => r.scoreDelta > 0).length} Flows verbessert</span>
                    </div>
                  </div>
                </div>
                
                {/* Flow Details */}
                <ScrollArea className="max-h-[30vh]">
                  <div className="space-y-2">
                    {reports.map((report) => (
                      <div 
                        key={report.flowId}
                        className={cn(
                          "p-3 rounded-lg border transition-colors",
                          report.scoreDelta > 0 
                            ? "bg-green-50/50 dark:bg-green-950/20 border-green-200/50" 
                            : "bg-muted/30"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{report.flowId}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">{report.previousScore}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="font-bold">{report.currentScore}</span>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                report.scoreDelta > 0 && "text-green-600 border-green-300 bg-green-50"
                              )}
                            >
                              {report.scoreDelta > 0 ? '+' : ''}{report.scoreDelta}
                            </Badge>
                          </div>
                        </div>
                        
                        {report.fixedFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {report.fixedFeatures.map((feature, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px] gap-1">
                                <CheckCircle className="h-2.5 w-2.5 text-green-500" />
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
            
            {/* No improvements message */}
            {reports.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Klicke "Optimieren" um echte Verbesserungen zu sehen</p>
              </div>
            )}
            
            <Separator />
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {improvementPotential.remainingRuns > 0 ? (
                <Button 
                  onClick={onRunAgain} 
                  disabled={isRunning}
                  className="flex-1 gap-2"
                  variant="default"
                >
                  {isRunning ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {isRunning ? 'Optimiere...' : 'Optimieren'}
                </Button>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-600 border border-green-200/50">
                  <Trophy className="h-5 w-5" />
                  <span className="font-semibold">Maximum erreicht!</span>
                </div>
              )}
              <Button variant="outline" onClick={onClose}>
                Schliessen
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
