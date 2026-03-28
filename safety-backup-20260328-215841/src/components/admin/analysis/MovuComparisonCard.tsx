/**
 * MovuComparisonCard - Displays comparison with Movu.ch (market leader)
 * Shows what we do better and where we lag behind
 */

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ExternalLink, Trophy, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface MovuComparison {
  betterThan: string[];
  worseThan: string[];
  differentiators?: string[];
}

interface MovuComparisonCardProps {
  comparison: MovuComparison;
  flowName?: string;
}

export function MovuComparisonCard({ comparison, flowName }: MovuComparisonCardProps) {
  const betterCount = comparison.betterThan?.length || 0;
  const worseCount = comparison.worseThan?.length || 0;
  const competitiveScore = betterCount - worseCount;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Movu.ch Vergleich
                <Badge variant="outline" className="text-xs font-normal">
                  Marktführer
                </Badge>
              </CardTitle>
              <CardDescription>
                {flowName ? `${flowName} vs. ` : ''}Wettbewerbsanalyse
              </CardDescription>
            </div>
          </div>
          
          {/* Competitive score badge */}
          <Badge 
            variant={competitiveScore > 0 ? 'default' : competitiveScore < 0 ? 'destructive' : 'secondary'}
            className="text-lg px-3 py-1"
          >
            {competitiveScore > 0 ? '+' : ''}{competitiveScore}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Better than Movu */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium text-sm">Besser als Movu</span>
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700">
                {betterCount}
              </Badge>
            </div>
            
            <div className="space-y-1.5 pl-6">
              {comparison.betterThan?.length > 0 ? (
                comparison.betterThan.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{item}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Keine Vorteile identifiziert
                </p>
              )}
            </div>
          </div>

          {/* Worse than Movu */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <TrendingDown className="h-4 w-4" />
              <span className="font-medium text-sm">Movu ist besser</span>
              <Badge variant="secondary" className="text-xs bg-red-500/20 text-red-700">
                {worseCount}
              </Badge>
            </div>
            
            <div className="space-y-1.5 pl-6">
              {comparison.worseThan?.length > 0 ? (
                comparison.worseThan.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="text-red-500 mt-1">✗</span>
                    <span>{item}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Keine Nachteile identifiziert
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Differentiators */}
        {comparison.differentiators && comparison.differentiators.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-sm">Alleinstellungsmerkmale</span>
              </div>
              <div className="flex flex-wrap gap-2 pl-6">
                {comparison.differentiators.map((diff, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {diff}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Summary */}
        <div className="mt-4 p-3 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {competitiveScore > 2 ? (
                <span className="text-green-600 font-medium">
                  🏆 Starker Wettbewerbsvorteil gegenüber Movu
                </span>
              ) : competitiveScore > 0 ? (
                <span className="text-green-600">
                  ↗️ Leichter Vorteil gegenüber Movu
                </span>
              ) : competitiveScore === 0 ? (
                <span className="text-muted-foreground">
                  ↔️ Auf Augenhöhe mit Movu
                </span>
              ) : competitiveScore > -3 ? (
                <span className="text-amber-600">
                  ↘️ Leichter Rückstand zu Movu
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  ⚠️ Deutlicher Rückstand zu Movu
                </span>
              )}
            </div>
            
            <Button variant="ghost" size="sm" asChild>
              <a href="https://movu.ch" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Movu.ch
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MovuComparisonCard;
