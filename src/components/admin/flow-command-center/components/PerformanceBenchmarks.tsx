/**
 * Performance Benchmarks - Compare against industry standards
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Award, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceBenchmarksProps {
  overallScore: number | null;
  conversionScore: number | null;
  uxScore: number | null;
  mobileScore: number | null;
  trustScore: number | null;
  className?: string;
}

// Industry benchmarks for Swiss moving platforms
const BENCHMARKS = {
  overall: { poor: 50, average: 65, good: 80, excellent: 90 },
  conversion: { poor: 45, average: 60, good: 75, excellent: 85 },
  ux: { poor: 50, average: 65, good: 78, excellent: 88 },
  mobile: { poor: 55, average: 70, good: 82, excellent: 92 },
  trust: { poor: 50, average: 65, good: 80, excellent: 90 },
};

const COMPETITOR_SCORES = {
  movu: { overall: 78, conversion: 75, ux: 80, mobile: 82, trust: 76 },
  umzugMeister: { overall: 65, conversion: 60, ux: 68, mobile: 70, trust: 62 },
  average: { overall: 62, conversion: 58, ux: 65, mobile: 68, trust: 60 },
};

export const PerformanceBenchmarks: React.FC<PerformanceBenchmarksProps> = ({
  overallScore,
  conversionScore,
  uxScore,
  mobileScore,
  trustScore,
  className,
}) => {
  const getPerformanceLevel = (score: number | null, benchmark: typeof BENCHMARKS.overall) => {
    if (score === null) return 'unknown';
    if (score >= benchmark.excellent) return 'excellent';
    if (score >= benchmark.good) return 'good';
    if (score >= benchmark.average) return 'average';
    return 'poor';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'average': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'excellent': return 'Exzellent';
      case 'good': return 'Gut';
      case 'average': return 'Durchschnitt';
      case 'poor': return 'Verbesserungsbedarf';
      default: return 'N/A';
    }
  };

  const overallLevel = getPerformanceLevel(overallScore, BENCHMARKS.overall);
  const vsMovu = overallScore !== null ? overallScore - COMPETITOR_SCORES.movu.overall : null;
  const vsAverage = overallScore !== null ? overallScore - COMPETITOR_SCORES.average.overall : null;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" />
          Performance Benchmarks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Performance Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">Performance-Level</span>
          </div>
          <Badge className={cn("text-xs", getLevelColor(overallLevel))}>
            {getLevelLabel(overallLevel)}
          </Badge>
        </div>

        {/* vs Competitors */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">vs. Konkurrenz</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between text-sm">
              <span>vs. Movu</span>
              <Badge 
                variant={vsMovu && vsMovu > 0 ? "default" : "destructive"}
                className="text-xs"
              >
                {vsMovu !== null ? (vsMovu > 0 ? `+${vsMovu}` : vsMovu) : '-'}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>vs. Markt</span>
              <Badge 
                variant={vsAverage && vsAverage > 0 ? "default" : "destructive"}
                className="text-xs"
              >
                {vsAverage !== null ? (vsAverage > 0 ? `+${vsAverage}` : vsAverage) : '-'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Category Benchmarks */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Kategorien vs. Branchendurchschnitt</div>
          
          <BenchmarkBar 
            label="Conversion" 
            score={conversionScore} 
            benchmark={BENCHMARKS.conversion.good}
            competitorScore={COMPETITOR_SCORES.movu.conversion}
          />
          <BenchmarkBar 
            label="UX" 
            score={uxScore} 
            benchmark={BENCHMARKS.ux.good}
            competitorScore={COMPETITOR_SCORES.movu.ux}
          />
          <BenchmarkBar 
            label="Mobile" 
            score={mobileScore} 
            benchmark={BENCHMARKS.mobile.good}
            competitorScore={COMPETITOR_SCORES.movu.mobile}
          />
          <BenchmarkBar 
            label="Trust" 
            score={trustScore} 
            benchmark={BENCHMARKS.trust.good}
            competitorScore={COMPETITOR_SCORES.movu.trust}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Ihr Score
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
            Benchmark
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BenchmarkBar: React.FC<{
  label: string;
  score: number | null;
  benchmark: number;
  competitorScore: number;
}> = ({ label, score, benchmark, competitorScore }) => {
  const isAboveBenchmark = score !== null && score >= benchmark;
  const diff = score !== null ? score - competitorScore : null;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span>{label}</span>
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-medium",
            isAboveBenchmark ? "text-green-600" : "text-yellow-600"
          )}>
            {score ?? '-'}
          </span>
          {diff !== null && (
            <span className={cn(
              "text-[10px]",
              diff >= 0 ? "text-green-600" : "text-red-600"
            )}>
              ({diff >= 0 ? '+' : ''}{diff})
            </span>
          )}
        </div>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-primary rounded-full transition-all"
          style={{ width: `${Math.min(score || 0, 100)}%` }}
        />
        <div 
          className="absolute h-full w-0.5 bg-muted-foreground/50"
          style={{ left: `${benchmark}%` }}
        />
      </div>
    </div>
  );
};

export default PerformanceBenchmarks;
