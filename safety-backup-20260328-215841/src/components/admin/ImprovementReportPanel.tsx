/**
 * Improvement Report Panel
 * 
 * Shows what was improved after each Fix All run with:
 * - Before/After score comparison
 * - Fixed issues list
 * - Category-wise breakdown
 * - Historical trend
 * - Iteration counter (how many more improvements possible)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Minus, CheckCircle, AlertCircle,
  ArrowRight, ChevronDown, ChevronUp, X, BarChart3, Clock,
  Zap, Trophy, RefreshCw, Sparkles, Target, Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { ImprovementReport } from '@/hooks/use-live-flow-analysis';

interface ImprovementReportPanelProps {
  reports: ImprovementReport[];
  isVisible: boolean;
  onClose: () => void;
  onRunAgain: () => void;
  isRunning: boolean;
  maxIterations?: number;
}

export default function ImprovementReportPanel({
  reports,
  isVisible,
  onClose,
  onRunAgain,
  isRunning,
  maxIterations = 10
}: ImprovementReportPanelProps) {
  const [expandedFlows, setExpandedFlows] = useState<Set<string>>(new Set());
  
  const summary = useMemo(() => {
    if (reports.length === 0) return null;
    
    const totalDelta = reports.reduce((sum, r) => sum + r.scoreDelta, 0);
    const avgDelta = totalDelta / reports.length;
    const fixedCount = reports.reduce((sum, r) => sum + r.fixedIssues.length, 0);
    const newIssueCount = reports.reduce((sum, r) => sum + r.newIssues.length, 0);
    const improved = reports.filter(r => r.scoreDelta > 0).length;
    const declined = reports.filter(r => r.scoreDelta < 0).length;
    const unchanged = reports.filter(r => r.scoreDelta === 0 && r.fixedIssues.length === 0).length;
    
    // Estimate remaining iterations
    const avgScoreNow = reports.reduce((sum, r) => sum + r.currentScore, 0) / reports.length;
    const targetScore = 100;
    const remainingGap = targetScore - avgScoreNow;
    const avgImprovementRate = avgDelta > 0 ? avgDelta : 2; // Assume 2 points per iteration if no improvement
    const estimatedIterations = remainingGap > 0 ? Math.ceil(remainingGap / avgImprovementRate) : 0;
    
    return {
      totalDelta,
      avgDelta,
      fixedCount,
      newIssueCount,
      improved,
      declined,
      unchanged,
      estimatedIterations: Math.min(estimatedIterations, maxIterations),
      canImprove: improved > 0 || fixedCount > 0 || estimatedIterations > 0,
    };
  }, [reports, maxIterations]);
  
  const toggleFlow = (flowId: string) => {
    setExpandedFlows(prev => {
      const next = new Set(prev);
      if (next.has(flowId)) next.delete(flowId);
      else next.add(flowId);
      return next;
    });
  };
  
  if (!isVisible || reports.length === 0) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-4 right-4 z-50 w-[480px] max-h-[80vh] overflow-hidden"
      >
        <Card className="border-2 border-primary/20 shadow-2xl bg-background/95 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Improvement Report</CardTitle>
                  <CardDescription className="text-xs">
                    {reports.length} Flows analysiert • {new Date(reports[0]?.timestamp).toLocaleTimeString('de-CH')}
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Summary Stats */}
            {summary && (
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2 rounded-lg bg-muted text-center">
                  <div className={cn(
                    "text-xl font-bold",
                    summary.totalDelta > 0 ? "text-green-600" : 
                    summary.totalDelta < 0 ? "text-red-600" : "text-muted-foreground"
                  )}>
                    {summary.totalDelta > 0 ? '+' : ''}{summary.totalDelta.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Total Δ</div>
                </div>
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
                  <div className="text-xl font-bold text-green-600">{summary.fixedCount}</div>
                  <div className="text-[10px] text-muted-foreground">Fixed</div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
                  <div className="text-xl font-bold text-blue-600">{summary.improved}</div>
                  <div className="text-[10px] text-muted-foreground">Verbessert</div>
                </div>
                <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-center">
                  <div className="text-xl font-bold text-yellow-600">{summary.estimatedIterations}</div>
                  <div className="text-[10px] text-muted-foreground">Runs left</div>
                </div>
              </div>
            )}
            
            {/* Remaining Improvement Estimate */}
            {summary && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Optimierungsfortschritt</span>
                  <span className="font-medium">
                    {Math.round((maxIterations - summary.estimatedIterations) / maxIterations * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(maxIterations - summary.estimatedIterations) / maxIterations * 100} 
                  className="h-2" 
                />
                <p className="text-[10px] text-muted-foreground">
                  {summary.estimatedIterations === 0 
                    ? '✨ Maximale Optimierung erreicht!' 
                    : `~${summary.estimatedIterations} weitere Durchläufe für maximale Verbesserung`
                  }
                </p>
              </div>
            )}
            
            <Separator />
            
            {/* Flow-by-Flow Details */}
            <ScrollArea className="max-h-[40vh]">
              <div className="space-y-2">
                {reports.map((report) => (
                  <Collapsible 
                    key={report.flowId}
                    open={expandedFlows.has(report.flowId)}
                    onOpenChange={() => toggleFlow(report.flowId)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className={cn(
                        "flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-muted/50",
                        report.scoreDelta > 0 && "bg-green-50/50 dark:bg-green-950/20",
                        report.scoreDelta < 0 && "bg-red-50/50 dark:bg-red-950/20"
                      )}>
                        {/* Delta Icon */}
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          report.scoreDelta > 0 ? "bg-green-100 text-green-600" :
                          report.scoreDelta < 0 ? "bg-red-100 text-red-600" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {report.scoreDelta > 0 ? <TrendingUp className="h-4 w-4" /> :
                           report.scoreDelta < 0 ? <TrendingDown className="h-4 w-4" /> :
                           <Minus className="h-4 w-4" />}
                        </div>
                        
                        {/* Flow Info */}
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{report.flowId}</div>
                          <div className="text-xs text-muted-foreground">
                            {report.fixedIssues.length > 0 && (
                              <span className="text-green-600">{report.fixedIssues.length} fixed</span>
                            )}
                            {report.fixedIssues.length > 0 && report.newIssues.length > 0 && ' • '}
                            {report.newIssues.length > 0 && (
                              <span className="text-yellow-600">{report.newIssues.length} new</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Score Change */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{report.previousScore}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="font-bold">{report.currentScore}</span>
                          <Badge variant="outline" className={cn(
                            "text-xs",
                            report.scoreDelta > 0 && "text-green-600 border-green-200",
                            report.scoreDelta < 0 && "text-red-600 border-red-200"
                          )}>
                            {report.scoreDelta > 0 ? '+' : ''}{report.scoreDelta}
                          </Badge>
                        </div>
                        
                        <ChevronDown className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          expandedFlows.has(report.flowId) && "rotate-180"
                        )} />
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="pl-11 pr-2 pb-2 space-y-2">
                        {/* Category Changes */}
                        <div className="grid grid-cols-4 gap-1 text-[10px]">
                          {Object.entries(report.categoryChanges).slice(0, 8).map(([cat, change]) => (
                            <div key={cat} className="text-center p-1 rounded bg-muted/50">
                              <div className={cn(
                                "font-bold",
                                change.delta > 0 ? "text-green-600" : 
                                change.delta < 0 ? "text-red-600" : ""
                              )}>
                                {change.delta > 0 ? '+' : ''}{change.delta}
                              </div>
                              <div className="text-muted-foreground capitalize truncate">{cat}</div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Fixed Issues */}
                        {report.fixedIssues.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-[10px] font-medium text-green-600">✓ Behoben:</div>
                            {report.fixedIssues.map((issue, i) => (
                              <div key={i} className="text-[10px] text-muted-foreground pl-3 flex items-start gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                                {issue}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* New Issues */}
                        {report.newIssues.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-[10px] font-medium text-yellow-600">⚠ Neue Issues:</div>
                            {report.newIssues.map((issue, i) => (
                              <div key={i} className="text-[10px] text-muted-foreground pl-3 flex items-start gap-1">
                                <AlertCircle className="h-3 w-3 text-yellow-500 mt-0.5 shrink-0" />
                                {issue}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
            
            <Separator />
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {summary && summary.canImprove && summary.estimatedIterations > 0 ? (
                <Button 
                  onClick={onRunAgain} 
                  disabled={isRunning}
                  className="flex-1 gap-2"
                >
                  {isRunning ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {isRunning ? 'Optimiere...' : 'Nochmal ausführen'}
                </Button>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-green-600">
                  <Trophy className="h-5 w-5" />
                  <span className="font-medium">Maximale Optimierung erreicht!</span>
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
