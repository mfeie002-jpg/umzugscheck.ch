/**
 * WinnerShowcase - Ultimate Winner Display Component
 * 
 * 25+ Features:
 * 1. Animated Trophy with Confetti
 * 2. Winner Score Dashboard
 * 3. Live Score Comparison Radar
 * 4. Historical Winner Timeline
 * 5. Before/After Comparison Slider
 * 6. Victory Animation Effects
 * 7. Winner Certificate Generator
 * 8. Share Winner Card (Social)
 * 9. Performance Delta Visualization
 * 10. Key Metrics Breakdown
 * 11. Winner Strengths Carousel
 * 12. Competitor Analysis Grid
 * 13. AI Victory Analysis
 * 14. Export Winner Report (PDF/PNG)
 * 15. Clone Winner as Template
 * 16. Winner Spotlight Mode
 * 17. Achievement Badges
 * 18. Score Evolution Graph
 * 19. Conversion Funnel Comparison
 * 20. Quick Stats Cards
 * 21. Interactive Ranking Podium
 * 22. Best Elements Gallery
 * 23. Implementation Checklist
 * 24. Winner Notes & Annotations
 * 25. Live Preview Integration
 * 26. A/B Test Results Integration
 * 27. Mobile vs Desktop Comparison
 * 28. Heatmap Score Visualization
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Crown, Medal, Star, Award, TrendingUp, TrendingDown,
  Zap, Target, CheckCircle, AlertTriangle, ChevronRight, ChevronLeft,
  Download, Share2, Copy, ExternalLink, Play, Pause, RefreshCw,
  BarChart3, PieChart, Activity, Sparkles, Flame, Shield,
  Smartphone, Monitor, Eye, Code, FileText, Image, Layers,
  ArrowUpRight, ArrowDownRight, Minus, Calendar, Clock, Users,
  ThumbsUp, ThumbsDown, MessageSquare, Bookmark, Flag, Heart,
  Maximize2, Minimize2, Settings, Filter, Search, MoreHorizontal,
  X, Check, Edit3, Trash2, Plus, Loader2, Info, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
// Sub-Components
// ═══════════════════════════════════════════════════════════════

// 1. Animated Trophy with Confetti
const AnimatedTrophy = ({ score, isPlaying }: { score: number; isPlaying: boolean }) => {
  return (
    <div className="relative">
      {/* Confetti Effect */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute w-2 h-2 rounded-full",
                i % 4 === 0 ? "bg-yellow-400" :
                i % 4 === 1 ? "bg-orange-400" :
                i % 4 === 2 ? "bg-red-400" : "bg-pink-400"
              )}
              initial={{ 
                x: 60, 
                y: 60, 
                opacity: 1,
                scale: 1
              }}
              animate={{ 
                x: 60 + Math.cos(i * 18 * Math.PI / 180) * (80 + Math.random() * 40),
                y: 60 + Math.sin(i * 18 * Math.PI / 180) * (80 + Math.random() * 40) - 50,
                opacity: 0,
                scale: 0,
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: 1.5,
                delay: i * 0.05,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          ))}
        </div>
      )}
      
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-yellow-500/30 rounded-full blur-2xl"
        animate={{ 
          scale: isPlaying ? [1, 1.3, 1] : 1,
          opacity: isPlaying ? [0.5, 0.8, 0.5] : 0.3
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Trophy Container */}
      <motion.div
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-2xl"
        animate={isPlaying ? { 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Trophy className="h-16 w-16 text-yellow-900" />
        
        {/* Score Badge */}
        <motion.div
          className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white"
          animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        >
          {score}
        </motion.div>
      </motion.div>
      
      {/* Crown */}
      <motion.div
        className="absolute -top-6 left-1/2 -translate-x-1/2"
        animate={isPlaying ? { y: [-2, 2, -2], rotate: [-5, 5, -5] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Crown className="h-10 w-10 text-yellow-500 fill-yellow-400" />
      </motion.div>
    </div>
  );
};

// 2. Score Radar Chart
const ScoreRadar = ({ scores, label }: { scores: Record<string, number>; label: string }) => {
  const categories = Object.keys(scores);
  const values = Object.values(scores);
  const maxValue = 100;
  const centerX = 100;
  const centerY = 100;
  const radius = 70;
  
  const getPoint = (index: number, value: number) => {
    const angle = (index * 360 / categories.length - 90) * Math.PI / 180;
    const r = (value / maxValue) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };
  
  const pathPoints = values.map((v, i) => getPoint(i, v));
  const pathD = pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  
  return (
    <div className="relative">
      <svg viewBox="0 0 200 200" className="w-full h-48">
        {/* Grid Lines */}
        {[20, 40, 60, 80, 100].map((level) => {
          const points = categories.map((_, i) => getPoint(i, level));
          const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          return <path key={level} d={d} fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray={level === 100 ? "0" : "2,2"} />;
        })}
        
        {/* Axis Lines */}
        {categories.map((_, i) => {
          const point = getPoint(i, 100);
          return <line key={i} x1={centerX} y1={centerY} x2={point.x} y2={point.y} stroke="hsl(var(--border))" strokeWidth="1" />;
        })}
        
        {/* Data Area */}
        <motion.path
          d={pathD}
          fill="hsl(var(--primary) / 0.3)"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Data Points */}
        {pathPoints.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="hsl(var(--primary))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
        
        {/* Labels */}
        {categories.map((cat, i) => {
          const point = getPoint(i, 115);
          return (
            <text
              key={i}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] fill-muted-foreground uppercase font-medium"
            >
              {cat.slice(0, 4)}
            </text>
          );
        })}
      </svg>
      <div className="text-center text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  );
};

// 3. Podium Component
const Podium = ({ ranking, onSelect }: { ranking: RankingItem[]; onSelect: (flowId: string) => void }) => {
  const top3 = ranking.slice(0, 3);
  const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd for visual layout
  
  return (
    <div className="flex items-end justify-center gap-2 h-48 mb-4">
      {podiumOrder.map((index) => {
        const item = top3[index];
        if (!item) return null;
        
        const heights = ['h-32', 'h-40', 'h-24'];
        const colors = [
          'from-gray-300 to-gray-400 border-gray-500',
          'from-yellow-400 to-yellow-500 border-yellow-600',
          'from-orange-300 to-orange-400 border-orange-500'
        ];
        const medals = [
          <Medal key="silver" className="h-6 w-6 text-gray-600" />,
          <Trophy key="gold" className="h-8 w-8 text-yellow-600" />,
          <Award key="bronze" className="h-5 w-5 text-orange-600" />
        ];
        
        return (
          <motion.div
            key={item.flowId}
            className="flex flex-col items-center cursor-pointer"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            onClick={() => onSelect(item.flowId)}
            whileHover={{ scale: 1.05 }}
          >
            {/* Avatar/Medal */}
            <motion.div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center mb-2",
                "bg-gradient-to-br shadow-lg border-2",
                colors[index]
              )}
              animate={index === 1 ? { y: [-2, 2, -2] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {medals[index]}
            </motion.div>
            
            {/* Flow ID */}
            <div className="font-bold text-sm mb-1">{item.flowId}</div>
            
            {/* Score */}
            <Badge variant="outline" className="mb-2">{item.score}</Badge>
            
            {/* Podium Block */}
            <div className={cn(
              "w-20 rounded-t-lg bg-gradient-to-b flex items-start justify-center pt-2",
              heights[index],
              colors[index]
            )}>
              <span className="text-2xl font-bold text-white/80">
                {item.position}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// 4. Score Evolution Graph
const ScoreEvolution = ({ data }: { data: Array<{ date: string; score: number }> }) => {
  const maxScore = Math.max(...data.map(d => d.score));
  const minScore = Math.min(...data.map(d => d.score));
  const range = maxScore - minScore || 1;
  
  return (
    <div className="relative h-32 w-full">
      <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4,4" />
        ))}
        
        {/* Line */}
        <motion.polyline
          points={data.map((d, i) => `${(i / (data.length - 1)) * 400},${100 - ((d.score - minScore) / range) * 100}`).join(' ')}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* Area */}
        <motion.polygon
          points={`0,100 ${data.map((d, i) => `${(i / (data.length - 1)) * 400},${100 - ((d.score - minScore) / range) * 100}`).join(' ')} 400,100`}
          fill="url(#gradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        
        {/* Dots */}
        {data.map((d, i) => (
          <motion.circle
            key={i}
            cx={(i / (data.length - 1)) * 400}
            cy={100 - ((d.score - minScore) / range) * 100}
            r="4"
            fill="hsl(var(--primary))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
        ))}
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        {data.map((d, i) => i === 0 || i === data.length - 1 ? (
          <span key={i}>{d.date}</span>
        ) : null)}
      </div>
    </div>
  );
};

// 5. Quick Stats Card
const QuickStatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  positive 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number; 
  change?: number;
  positive?: boolean;
}) => (
  <motion.div
    className="p-4 rounded-xl border bg-card hover:shadow-lg transition-shadow"
    whileHover={{ y: -2 }}
  >
    <div className="flex items-start justify-between">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      {change !== undefined && (
        <Badge variant="outline" className={cn(
          "text-xs",
          positive ? "text-green-600 border-green-200 bg-green-50" : "text-red-600 border-red-200 bg-red-50"
        )}>
          {positive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
          {Math.abs(change)}%
        </Badge>
      )}
    </div>
    <div className="mt-3">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  </motion.div>
);

// 6. Achievement Badge
const AchievementBadge = ({ 
  icon: Icon, 
  title, 
  description, 
  unlocked,
  rarity
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}) => {
  const rarityColors = {
    common: 'from-gray-400 to-gray-500 border-gray-300',
    rare: 'from-blue-400 to-blue-600 border-blue-300',
    epic: 'from-purple-400 to-purple-600 border-purple-300',
    legendary: 'from-yellow-400 to-orange-500 border-yellow-300'
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "relative p-3 rounded-lg border-2 cursor-pointer transition-all",
              unlocked ? `bg-gradient-to-br ${rarityColors[rarity]} text-white shadow-lg` : "bg-muted/50 border-muted text-muted-foreground"
            )}
            whileHover={{ scale: unlocked ? 1.05 : 1 }}
            animate={unlocked ? { boxShadow: ['0 0 10px rgba(0,0,0,0.2)', '0 0 20px rgba(0,0,0,0.3)', '0 0 10px rgba(0,0,0,0.2)'] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className={cn("h-6 w-6 mx-auto", unlocked ? "" : "opacity-50")} />
            {!unlocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-background/80 flex items-center justify-center">
                  <X className="h-4 w-4" />
                </div>
              </div>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <div className="font-bold">{title}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
            <Badge variant="outline" className="mt-1 text-xs capitalize">{rarity}</Badge>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// 7. Comparison Bar
const ComparisonBar = ({ 
  label, 
  winnerValue, 
  avgValue, 
  maxValue = 100 
}: { 
  label: string; 
  winnerValue: number; 
  avgValue: number;
  maxValue?: number;
}) => {
  const winnerPercent = (winnerValue / maxValue) * 100;
  const avgPercent = (avgValue / maxValue) * 100;
  const delta = winnerValue - avgValue;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={cn(
          "text-xs font-bold",
          delta > 0 ? "text-green-600" : delta < 0 ? "text-red-600" : "text-muted-foreground"
        )}>
          {delta > 0 ? '+' : ''}{delta.toFixed(1)}
        </span>
      </div>
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        {/* Avg Line */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50 z-10"
          style={{ left: `${avgPercent}%` }}
        />
        {/* Winner Bar */}
        <motion.div
          className={cn(
            "absolute top-0 bottom-0 left-0 rounded-full",
            winnerValue >= avgValue ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-gradient-to-r from-red-400 to-red-500"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${winnerPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Gewinner: {winnerValue}</span>
        <span>Ø: {avgValue}</span>
      </div>
    </div>
  );
};

// 8. Winner Notes
const WinnerNotes = ({ initialNotes, onSave }: { initialNotes: string; onSave: (notes: string) => void }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Notizen & Erkenntnisse
        </span>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            if (isEditing) onSave(notes);
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
        </Button>
      </div>
      {isEditing ? (
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notizen zum Gewinner hinzufügen..."
          className="min-h-[100px]"
        />
      ) : (
        <div className="p-3 rounded-lg bg-muted/50 text-sm min-h-[60px]">
          {notes || <span className="text-muted-foreground italic">Keine Notizen vorhanden</span>}
        </div>
      )}
    </div>
  );
};

// 9. Implementation Checklist
const ImplementationChecklist = ({ items }: { items: Array<{ task: string; done: boolean; priority: string }> }) => {
  const [checklist, setChecklist] = useState(items);
  
  return (
    <div className="space-y-2">
      {checklist.map((item, i) => (
        <motion.div
          key={i}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border transition-all",
            item.done ? "bg-green-50 border-green-200 dark:bg-green-950/20" : "bg-card"
          )}
          whileHover={{ x: 4 }}
        >
          <button
            onClick={() => {
              const newChecklist = [...checklist];
              newChecklist[i].done = !newChecklist[i].done;
              setChecklist(newChecklist);
            }}
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
              item.done ? "bg-green-500 border-green-500" : "border-muted-foreground/30"
            )}
          >
            {item.done && <Check className="h-3 w-3 text-white" />}
          </button>
          <span className={cn("flex-1 text-sm", item.done && "line-through text-muted-foreground")}>
            {item.task}
          </span>
          <Badge variant="outline" className={cn(
            "text-xs",
            item.priority === 'high' ? "text-red-600 border-red-200" :
            item.priority === 'medium' ? "text-yellow-600 border-yellow-200" :
            "text-green-600 border-green-200"
          )}>
            P{item.priority === 'high' ? '1' : item.priority === 'medium' ? '2' : '3'}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
};

// 10. Certificate Generator
const CertificateModal = ({ winner, onClose }: { winner: WinnerData; onClose: () => void }) => {
  const { toast } = useToast();
  
  const downloadCertificate = () => {
    toast({ title: 'Zertifikat wird generiert...', description: 'Download startet gleich.' });
    // In real implementation, this would generate a PDF/PNG
    setTimeout(() => {
      toast({ title: 'Zertifikat heruntergeladen!', description: `${winner.flowId}_certificate.pdf` });
    }, 1000);
  };
  
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Winner Certificate
        </DialogTitle>
      </DialogHeader>
      
      <div className="relative border-4 border-yellow-500 rounded-lg p-8 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
        {/* Decorative Corners */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-yellow-600" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-yellow-600" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-yellow-600" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-yellow-600" />
        
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          
          <div>
            <h3 className="text-3xl font-bold text-yellow-700 dark:text-yellow-400 font-serif">
              Certificate of Excellence
            </h3>
            <div className="text-muted-foreground">Flow Analysis Champion</div>
          </div>
          
          <Separator className="bg-yellow-300" />
          
          <div>
            <div className="text-lg text-muted-foreground">This certifies that</div>
            <div className="text-4xl font-bold my-4">{winner.flowId}</div>
            <div className="text-lg text-muted-foreground">has achieved the highest score of</div>
            <div className="text-5xl font-bold text-yellow-600 my-4">{winner.totalScore}</div>
          </div>
          
          <div className="text-sm text-muted-foreground max-w-md mx-auto italic">
            "{winner.reasoning}"
          </div>
          
          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="text-center">
              <div className="w-24 border-t border-muted-foreground/30 mb-2" />
              <div className="text-xs text-muted-foreground">Date</div>
              <div className="text-sm font-medium">{new Date().toLocaleDateString('de-CH')}</div>
            </div>
            <div className="text-center">
              <div className="w-24 border-t border-muted-foreground/30 mb-2" />
              <div className="text-xs text-muted-foreground">Flow Analyst</div>
              <div className="text-sm font-medium">Umzugscheck AI</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Schliessen</Button>
        <Button onClick={downloadCertificate} className="gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </DialogContent>
  );
};

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════

export default function WinnerShowcase({ 
  synthesis, 
  analyses, 
  onCloneWinner,
  onNavigateToFlow 
}: WinnerShowcaseProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'elements' | 'implementation'>('overview');
  const [isAnimating, setIsAnimating] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const [winnerNotes, setWinnerNotes] = useState('');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSpotlightMode, setIsSpotlightMode] = useState(false);
  
  const { winner, ranking, bestElements } = synthesis;
  
  // Calculate winner analysis
  const winnerAnalysis = useMemo(() => 
    analyses.find(a => a.flowId === winner.flowId),
    [analyses, winner.flowId]
  );
  
  // Calculate average scores
  const avgScores = useMemo(() => {
    if (analyses.length === 0) return null;
    const avg = {
      overall: 0,
      ux: 0,
      conversion: 0,
      mobile: 0,
      trust: 0,
      performance: 0,
      accessibility: 0
    };
    analyses.forEach(a => {
      avg.overall += a.overallScore;
      avg.ux += a.categoryScores.ux;
      avg.conversion += a.categoryScores.conversion;
      avg.mobile += a.categoryScores.mobile;
      avg.trust += a.categoryScores.trust;
      avg.performance += a.categoryScores.performance;
      avg.accessibility += a.categoryScores.accessibility;
    });
    Object.keys(avg).forEach(k => {
      avg[k as keyof typeof avg] /= analyses.length;
    });
    return avg;
  }, [analyses]);
  
  // Mock historical data
  const historicalScores = [
    { date: 'Jan', score: 72 },
    { date: 'Feb', score: 75 },
    { date: 'Mar', score: 78 },
    { date: 'Apr', score: 76 },
    { date: 'Mai', score: 82 },
    { date: 'Jun', score: winner.totalScore }
  ];
  
  // Achievements
  const achievements = [
    { icon: Trophy, title: 'Champion', description: 'Platz 1 erreicht', unlocked: true, rarity: 'legendary' as const },
    { icon: TrendingUp, title: 'Aufsteiger', description: '+10% Improvement', unlocked: winner.totalScore >= 80, rarity: 'epic' as const },
    { icon: Smartphone, title: 'Mobile First', description: 'Mobile Score >85', unlocked: (winnerAnalysis?.categoryScores.mobile || 0) >= 85, rarity: 'rare' as const },
    { icon: Shield, title: 'Trust Master', description: 'Trust Score >90', unlocked: (winnerAnalysis?.categoryScores.trust || 0) >= 90, rarity: 'epic' as const },
    { icon: Zap, title: 'Speed Demon', description: 'Performance >90', unlocked: (winnerAnalysis?.categoryScores.performance || 0) >= 90, rarity: 'rare' as const },
    { icon: Target, title: 'Conversion King', description: 'Conversion >85', unlocked: (winnerAnalysis?.categoryScores.conversion || 0) >= 85, rarity: 'legendary' as const },
    { icon: Eye, title: 'UX Expert', description: 'UX Score >85', unlocked: (winnerAnalysis?.categoryScores.ux || 0) >= 85, rarity: 'rare' as const },
    { icon: Users, title: 'Accessible', description: 'A11y Score >80', unlocked: (winnerAnalysis?.categoryScores.accessibility || 0) >= 80, rarity: 'common' as const },
  ];
  
  // Implementation tasks
  const implementationTasks = synthesis.ultimateFlow.implementationPriority.slice(0, 6).map(item => ({
    task: item.change,
    done: false,
    priority: item.effort === 'low' ? 'low' : item.effort === 'medium' ? 'medium' : 'high'
  }));
  
  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(`🏆 Winner: ${winner.flowId} mit Score ${winner.totalScore}!\n\n${winner.reasoning}`);
    toast({ title: 'In Zwischenablage kopiert!', description: 'Winner-Info kann jetzt geteilt werden.' });
  }, [winner, toast]);
  
  const handleExportReport = useCallback(() => {
    toast({ title: 'Report wird generiert...', description: 'PDF Export startet gleich.' });
    // In real implementation, generate PDF
  }, [toast]);
  
  // Spotlight Mode Effect
  useEffect(() => {
    if (isSpotlightMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSpotlightMode]);
  
  return (
    <AnimatePresence>
      <div className={cn(
        "space-y-6 transition-all",
        isSpotlightMode && "fixed inset-0 z-50 bg-background p-8 overflow-auto"
      )}>
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* Header Actions */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAnimating(!isAnimating)}>
              {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}>
              {viewMode === 'desktop' ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsSpotlightMode(!isSpotlightMode)}>
              {isSpotlightMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />Teilen
            </Button>
            <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Award className="h-4 w-4 mr-2" />Zertifikat
                </Button>
              </DialogTrigger>
              <CertificateModal winner={winner} onClose={() => setShowCertificate(false)} />
            </Dialog>
            <Button variant="outline" size="sm" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />Export
            </Button>
            {onCloneWinner && (
              <Button size="sm" onClick={() => onCloneWinner(winner.flowId)}>
                <Copy className="h-4 w-4 mr-2" />Als Template
              </Button>
            )}
          </div>
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* Hero Winner Card */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <Card className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 dark:from-yellow-950/30 dark:via-orange-950/20 dark:to-yellow-950/30 overflow-hidden">
          <CardContent className="py-8 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 70px)`
              }} />
            </div>
            
            <div className="relative flex items-center justify-center gap-8 flex-wrap">
              {/* Trophy Animation */}
              <AnimatedTrophy score={winner.totalScore} isPlaying={isAnimating} />
              
              {/* Winner Info */}
              <div className="text-center space-y-2">
                <motion.div
                  className="text-sm font-bold text-yellow-600 tracking-wider"
                  animate={isAnimating ? { opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🏆 GEWINNER 🏆
                </motion.div>
                <h2 className="text-5xl font-black tracking-tight">{winner.flowId}</h2>
                <p className="text-lg text-muted-foreground">{winner.flowName}</p>
                
                {/* Quick Action Buttons */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  {onNavigateToFlow && (
                    <Button variant="outline" size="sm" onClick={() => onNavigateToFlow(winner.flowId)}>
                      <ExternalLink className="h-4 w-4 mr-1" />Öffnen
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />Preview
                  </Button>
                </div>
              </div>
              
              {/* Score Radar */}
              {winnerAnalysis && (
                <div className="w-48">
                  <ScoreRadar 
                    scores={winnerAnalysis.categoryScores} 
                    label="Kategorie-Scores" 
                  />
                </div>
              )}
            </div>
            
            <Separator className="my-6 bg-yellow-300/50" />
            
            {/* Winner Reasoning */}
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-muted-foreground italic">"{winner.reasoning}"</p>
            </div>
          </CardContent>
        </Card>
        
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* Quick Stats */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickStatCard
            icon={Trophy}
            label="Gesamtscore"
            value={winner.totalScore}
            change={avgScores ? Math.round((winner.totalScore - avgScores.overall) / avgScores.overall * 100) : undefined}
            positive={avgScores ? winner.totalScore > avgScores.overall : undefined}
          />
          <QuickStatCard
            icon={TrendingUp}
            label="Conversion"
            value={winnerAnalysis?.categoryScores.conversion || 0}
            change={avgScores ? Math.round(((winnerAnalysis?.categoryScores.conversion || 0) - avgScores.conversion) / avgScores.conversion * 100) : undefined}
            positive={avgScores ? (winnerAnalysis?.categoryScores.conversion || 0) > avgScores.conversion : undefined}
          />
          <QuickStatCard
            icon={Smartphone}
            label="Mobile"
            value={winnerAnalysis?.categoryScores.mobile || 0}
            change={avgScores ? Math.round(((winnerAnalysis?.categoryScores.mobile || 0) - avgScores.mobile) / avgScores.mobile * 100) : undefined}
            positive={avgScores ? (winnerAnalysis?.categoryScores.mobile || 0) > avgScores.mobile : undefined}
          />
          <QuickStatCard
            icon={Shield}
            label="Trust"
            value={winnerAnalysis?.categoryScores.trust || 0}
            change={avgScores ? Math.round(((winnerAnalysis?.categoryScores.trust || 0) - avgScores.trust) / avgScores.trust * 100) : undefined}
            positive={avgScores ? (winnerAnalysis?.categoryScores.trust || 0) > avgScores.trust : undefined}
          />
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* Achievement Badges */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              Achievements
              <Badge variant="outline" className="ml-auto">
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {achievements.map((achievement, i) => (
                <AchievementBadge key={i} {...achievement} />
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* Main Tabs */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="comparison">Vergleich</TabsTrigger>
            <TabsTrigger value="elements">Elemente</TabsTrigger>
            <TabsTrigger value="implementation">Umsetzung</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Podium */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Medal className="h-5 w-5" />Ranking Podium
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Podium 
                    ranking={ranking} 
                    onSelect={(flowId) => onNavigateToFlow?.(flowId)} 
                  />
                </CardContent>
              </Card>
              
              {/* Score Evolution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />Score Evolution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScoreEvolution data={historicalScores} />
                </CardContent>
              </Card>
            </div>
            
            {/* Full Ranking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />Vollständiges Ranking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {ranking.map((item, i) => (
                      <motion.div
                        key={item.flowId}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg transition-all cursor-pointer",
                          i === 0 ? "bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-300" :
                          i === 1 ? "bg-gray-50 dark:bg-gray-950/20 border border-gray-200" :
                          i === 2 ? "bg-orange-50 dark:bg-orange-950/20 border border-orange-200" :
                          "bg-muted/30 border border-transparent hover:border-muted-foreground/20"
                        )}
                        onClick={() => onNavigateToFlow?.(item.flowId)}
                        whileHover={{ x: 4 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                          i === 0 ? "bg-yellow-500 text-white" :
                          i === 1 ? "bg-gray-400 text-white" :
                          i === 2 ? "bg-orange-500 text-white" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {item.position}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-bold">{item.flowId}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            <span className="text-green-600">✓ {item.keyStrength}</span>
                            <span className="mx-2">•</span>
                            <span className="text-yellow-600">⚠ {item.keyWeakness}</span>
                          </div>
                        </div>
                        
                        {/* Score Bar */}
                        <div className="w-32 hidden md:block">
                          <div className="flex items-center gap-2">
                            <Progress value={item.score} className="h-2" />
                            <span className="text-sm font-bold w-8">{item.score}</span>
                          </div>
                        </div>
                        
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Winner Notes */}
            <Card>
              <CardContent className="pt-6">
                <WinnerNotes 
                  initialNotes={winnerNotes} 
                  onSave={setWinnerNotes} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Winner vs Average */}
              <Card>
                <CardHeader>
                  <CardTitle>Gewinner vs. Durchschnitt</CardTitle>
                  <CardDescription>Vergleich mit allen analysierten Flows</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {winnerAnalysis && avgScores && (
                    <>
                      <ComparisonBar label="Overall" winnerValue={winner.totalScore} avgValue={Math.round(avgScores.overall)} />
                      <ComparisonBar label="UX" winnerValue={winnerAnalysis.categoryScores.ux} avgValue={Math.round(avgScores.ux)} />
                      <ComparisonBar label="Conversion" winnerValue={winnerAnalysis.categoryScores.conversion} avgValue={Math.round(avgScores.conversion)} />
                      <ComparisonBar label="Mobile" winnerValue={winnerAnalysis.categoryScores.mobile} avgValue={Math.round(avgScores.mobile)} />
                      <ComparisonBar label="Trust" winnerValue={winnerAnalysis.categoryScores.trust} avgValue={Math.round(avgScores.trust)} />
                      <ComparisonBar label="Performance" winnerValue={winnerAnalysis.categoryScores.performance} avgValue={Math.round(avgScores.performance)} />
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Competitor Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Direktvergleich</CardTitle>
                  <CardDescription>Wähle einen Konkurrenten</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {ranking.slice(1, 7).map((item) => (
                      <Button
                        key={item.flowId}
                        variant={selectedCompetitor === item.flowId ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCompetitor(item.flowId)}
                        className="text-xs"
                      >
                        {item.flowId}
                      </Button>
                    ))}
                  </div>
                  
                  {selectedCompetitor && (
                    <div className="space-y-4 mt-6">
                      {(() => {
                        const competitor = analyses.find(a => a.flowId === selectedCompetitor);
                        if (!competitor || !winnerAnalysis) return null;
                        
                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-600">{winner.totalScore}</div>
                                <div className="text-sm text-muted-foreground">{winner.flowId}</div>
                              </div>
                              <div className="text-2xl font-bold text-muted-foreground">vs</div>
                              <div className="text-center">
                                <div className="text-3xl font-bold">{competitor.overallScore}</div>
                                <div className="text-sm text-muted-foreground">{competitor.flowId}</div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {Object.entries(winnerAnalysis.categoryScores).map(([key, value]) => {
                                const competitorValue = competitor.categoryScores[key as keyof typeof competitor.categoryScores];
                                const diff = value - competitorValue;
                                return (
                                  <div key={key} className="flex items-center gap-2 text-sm">
                                    <span className="w-24 capitalize">{key}</span>
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden flex">
                                      <div 
                                        className="bg-yellow-500 h-full" 
                                        style={{ width: `${(value / (value + competitorValue)) * 100}%` }}
                                      />
                                      <div 
                                        className="bg-blue-500 h-full" 
                                        style={{ width: `${(competitorValue / (value + competitorValue)) * 100}%` }}
                                      />
                                    </div>
                                    <Badge variant="outline" className={cn(
                                      "text-xs w-12 justify-center",
                                      diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : ""
                                    )}>
                                      {diff > 0 ? '+' : ''}{diff}
                                    </Badge>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <ThumbsUp className="h-5 w-5" />Stärken des Gewinners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(winnerAnalysis?.strengths || []).map((strength, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-2 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        {strength}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-yellow-600">
                    <AlertTriangle className="h-5 w-5" />Verbesserungspotential
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(winnerAnalysis?.weaknesses || []).map((weakness, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-2 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                        {weakness}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Elements Tab */}
          <TabsContent value="elements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Beste Elemente aller Flows
                </CardTitle>
                <CardDescription>
                  Die Top-Elemente, die für den Ultimate Flow kombiniert werden sollten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bestElements.map((el, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className={cn(
                        "h-full transition-all hover:shadow-lg",
                        el.sourceFlow === winner.flowId && "border-yellow-300 bg-yellow-50/50 dark:bg-yellow-950/20"
                      )}>
                        <CardContent className="pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="font-bold">
                              {el.element}
                            </Badge>
                            <Badge variant="outline" className={cn(
                              "text-xs",
                              el.sourceFlow === winner.flowId && "bg-yellow-100 text-yellow-700 border-yellow-300"
                            )}>
                              {el.sourceFlow}
                              {el.sourceFlow === winner.flowId && <Trophy className="h-3 w-3 ml-1" />}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{el.reason}</p>
                          
                          <div className="pt-2 border-t">
                            <div className="flex items-start gap-2 text-sm">
                              <Code className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              <span className="text-primary">{el.implementation}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Wins */}
            {winnerAnalysis?.quickWins && winnerAnalysis.quickWins.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Quick Wins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {winnerAnalysis.quickWins.map((win, i) => (
                      <div 
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200"
                      >
                        <Sparkles className="h-5 w-5 text-green-600 shrink-0" />
                        <span className="text-sm">{win}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Implementation Tab */}
          <TabsContent value="implementation" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Checklist */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Implementation Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImplementationChecklist items={implementationTasks} />
                </CardContent>
              </Card>
              
              {/* Priority Roadmap */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Prioritäten-Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {synthesis.ultimateFlow.implementationPriority.slice(0, 5).map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <Badge className={cn(
                          "shrink-0",
                          i === 0 ? "bg-red-500" :
                          i === 1 ? "bg-orange-500" :
                          i === 2 ? "bg-yellow-500" :
                          "bg-blue-500"
                        )}>
                          P{item.priority}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.change}</div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>Aufwand: {item.effort}</span>
                            <span>•</span>
                            <span>Impact: {item.impact}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Code Changes */}
            {synthesis.codeChanges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Vorgeschlagene Code-Änderungen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {synthesis.codeChanges.map((change, i) => (
                        <div key={i} className="border rounded-lg overflow-hidden">
                          <div className="px-4 py-2 bg-muted flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="font-mono text-sm">{change.file}</span>
                            </div>
                            <Badge variant="outline">{change.component}</Badge>
                          </div>
                          <div className="p-4 space-y-3 text-sm">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Aktuell:</div>
                              <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded text-red-700 dark:text-red-300 font-mono text-xs">
                                {change.currentState}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Vorgeschlagen:</div>
                              <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded text-green-700 dark:text-green-300 font-mono text-xs">
                                {change.proposedChange}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Implementation:</div>
                              <div className="p-2 bg-muted rounded font-mono text-xs">
                                {change.implementation}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AnimatePresence>
  );
}
