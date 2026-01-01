/**
 * WinnerShowcase - Clean & Simple Winner Display
 * 
 * HAUPTZIEL: Klar zeigen wer gewonnen hat und warum
 * - Gewinner auf einen Blick
 * - Top 3 Podium
 * - Klare Gründe warum
 * - Was als nächstes tun
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, ArrowRight, CheckCircle, Zap, ExternalLink, Copy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface WinnerData {
  flowId: string;
  flowName: string;
  totalScore: number;
  reasoning: string;
}

interface RankingItem {
  position: number;
  flowId: string;
  score: number;
  keyStrength: string;
  keyWeakness: string;
}

interface BestElement {
  element: string;
  sourceFlow: string;
  reason: string;
  implementation: string;
}

interface Synthesis {
  winner: WinnerData;
  ranking: RankingItem[];
  bestElements: BestElement[];
  ultimateFlow: {
    name: string;
    description: string;
    steps: Array<{
      number: number;
      name: string;
      sourceFlow: string;
      elements: string[];
      improvements: string[];
    }>;
    expectedConversionLift: string;
    implementationPriority: Array<{
      priority: number;
      change: string;
      effort: string;
      impact: string;
      sourceFlow: string;
    }>;
  };
  codeChanges: Array<{
    file: string;
    component: string;
    currentState: string;
    proposedChange: string;
    implementation: string;
  }>;
}

interface FlowAnalysis {
  flowId: string;
  flowName: string;
  overallScore: number;
  categoryScores: {
    ux: number;
    conversion: number;
    mobile: number;
    accessibility: number;
    performance: number;
    trust: number;
    clarity: number;
  };
  strengths: string[];
  weaknesses: string[];
  quickWins: string[];
}

interface WinnerShowcaseProps {
  synthesis: Synthesis;
  analyses: FlowAnalysis[];
  onCloneWinner?: (flowId: string) => void;
  onNavigateToFlow?: (flowId: string) => void;
}

// ═══════════════════════════════════════════════════════════════
// Main Component - Simple & Clear
// ═══════════════════════════════════════════════════════════════

export const WinnerShowcase: React.FC<WinnerShowcaseProps> = ({
  synthesis,
  analyses,
  onCloneWinner,
  onNavigateToFlow
}) => {
  const { toast } = useToast();
  const { winner, ranking, ultimateFlow } = synthesis;
  
  const winnerAnalysis = analyses.find(a => a.flowId === winner.flowId);
  const top3 = ranking.slice(0, 3);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Kopiert!", description: "In Zwischenablage kopiert" });
  };

  return (
    <div className="space-y-8">
      
      {/* ══════════════════════════════════════════════════════════
          SECTION 1: Der Gewinner - Gross & Klar
      ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Card className="overflow-hidden border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-50/50 via-background to-orange-50/30 dark:from-yellow-950/20 dark:to-orange-950/10">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              
              {/* Trophy */}
              <motion.div
                className="relative flex-shrink-0"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-3xl" />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-2xl">
                  <Trophy className="h-16 w-16 text-yellow-900" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-background">
                  {winner.totalScore}
                </div>
              </motion.div>
              
              {/* Winner Info */}
              <div className="flex-1 text-center lg:text-left">
                <Badge className="mb-3 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-400/50">
                  🏆 Gewinner
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  {winner.flowName}
                </h1>
                <p className="text-lg text-muted-foreground mb-4 max-w-xl">
                  {winner.reasoning}
                </p>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <Button
                    onClick={() => onNavigateToFlow?.(winner.flowId)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  >
                    Flow ansehen
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onCloneWinner?.(winner.flowId)}
                  >
                    Als Vorlage nutzen
                    <Copy className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2: Top 3 Podium
      ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-4">Ranking</h2>
        <div className="flex items-end justify-center gap-4 py-4">
          {/* 2nd Place */}
          {top3[1] && (
            <motion.div
              className="flex flex-col items-center cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => onNavigateToFlow?.(top3[1].flowId)}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg mb-2 group-hover:scale-110 transition-transform">
                <Medal className="h-8 w-8 text-gray-700" />
              </div>
              <span className="font-bold text-sm">{top3[1].flowId}</span>
              <Badge variant="outline" className="mt-1">{top3[1].score}</Badge>
              <div className="w-24 h-24 mt-3 rounded-t-lg bg-gradient-to-b from-gray-300 to-gray-400 flex items-center justify-center">
                <span className="text-3xl font-bold text-white/80">2</span>
              </div>
            </motion.div>
          )}
          
          {/* 1st Place */}
          {top3[0] && (
            <motion.div
              className="flex flex-col items-center cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => onNavigateToFlow?.(top3[0].flowId)}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-xl mb-2 group-hover:scale-110 transition-transform">
                <Trophy className="h-10 w-10 text-yellow-800" />
              </div>
              <span className="font-bold">{top3[0].flowId}</span>
              <Badge className="mt-1 bg-yellow-500 text-white">{top3[0].score}</Badge>
              <div className="w-28 h-32 mt-3 rounded-t-lg bg-gradient-to-b from-yellow-400 to-yellow-500 flex items-center justify-center">
                <span className="text-4xl font-bold text-white/80">1</span>
              </div>
            </motion.div>
          )}
          
          {/* 3rd Place */}
          {top3[2] && (
            <motion.div
              className="flex flex-col items-center cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => onNavigateToFlow?.(top3[2].flowId)}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center shadow-lg mb-2 group-hover:scale-110 transition-transform">
                <Award className="h-7 w-7 text-orange-700" />
              </div>
              <span className="font-bold text-sm">{top3[2].flowId}</span>
              <Badge variant="outline" className="mt-1">{top3[2].score}</Badge>
              <div className="w-20 h-16 mt-3 rounded-t-lg bg-gradient-to-b from-orange-300 to-orange-400 flex items-center justify-center">
                <span className="text-2xl font-bold text-white/80">3</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3: Warum hat dieser Flow gewonnen?
      ══════════════════════════════════════════════════════════ */}
      {winnerAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Warum dieser Flow gewonnen hat</h2>
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* Stärken */}
            <Card className="border-green-200 bg-green-50/30 dark:bg-green-950/10 dark:border-green-900/30">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800 dark:text-green-400">Stärken</h3>
                </div>
                <ul className="space-y-2">
                  {winnerAnalysis.strengths.slice(0, 5).map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Scores */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4">Score-Übersicht</h3>
                <div className="space-y-3">
                  {Object.entries(winnerAnalysis.categoryScores).slice(0, 5).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-muted-foreground">{key}</span>
                        <span className="font-medium">{value}/100</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════
          SECTION 4: Nächste Schritte (Quick Wins)
      ══════════════════════════════════════════════════════════ */}
      {ultimateFlow.implementationPriority.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Nächste Schritte</h2>
          <Card>
            <CardContent className="p-5">
              <div className="space-y-3">
                {ultimateFlow.implementationPriority.slice(0, 5).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      i === 0 ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                    )}>
                      {item.priority}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.change}</p>
                      <p className="text-sm text-muted-foreground">
                        Aufwand: {item.effort} • Impact: {item.impact}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.sourceFlow}
                    </Badge>
                  </div>
                ))}
              </div>
              
              {ultimateFlow.expectedConversionLift && (
                <div className="mt-5 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Erwartete Conversion-Steigerung:</span>
                    <span className="text-primary font-bold">{ultimateFlow.expectedConversionLift}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════
          SECTION 5: Vollständiges Ranking
      ══════════════════════════════════════════════════════════ */}
      {ranking.length > 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">Alle Flows im Vergleich</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {ranking.map((item, i) => (
                  <div
                    key={item.flowId}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onNavigateToFlow?.(item.flowId)}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      i === 0 ? "bg-yellow-400 text-yellow-900" :
                      i === 1 ? "bg-gray-300 text-gray-700" :
                      i === 2 ? "bg-orange-300 text-orange-800" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {item.position}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.flowId}</p>
                      <p className="text-sm text-muted-foreground">{item.keyStrength}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{item.score}</div>
                      <div className="text-xs text-muted-foreground">Punkte</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default WinnerShowcase;
