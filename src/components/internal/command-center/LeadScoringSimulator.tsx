/**
 * Lead Scoring & Routing Simulator
 */

import { useState } from 'react';
import { Brain, ArrowRight, User, Zap, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { calculateLeadScore, routeLead } from '@/lib/cherries-chaff/routing-brain';
import { formatSwissCHF } from '@/lib/swiss-number-format';

export function LeadScoringSimulator() {
  const [input, setInput] = useState({
    rooms: 3.5,
    distanceKm: 25,
    services: ['transport', 'packing'],
    moveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    budgetAttitude: 'quality' as const,
    feierabendCapacity: true,
  });
  
  const [result, setResult] = useState<ReturnType<typeof calculateLeadScore> | null>(null);
  const [routing, setRouting] = useState<ReturnType<typeof routeLead> | null>(null);
  
  const handleSimulate = () => {
    const scoring = calculateLeadScore({
      rooms: input.rooms,
      distance_km: input.distanceKm,
      move_date: input.moveDate,
      services: input.services,
      budget_signal: input.budgetAttitude,
    });
    
    const routingResult = routeLead(
      {
        rooms: input.rooms,
        distance_km: input.distanceKm,
        move_date: input.moveDate,
        services: input.services,
        budget_signal: input.budgetAttitude,
      },
      {
        available_slots: input.feierabendCapacity ? 2 : 0,
        date: input.moveDate,
        utilization_percent: input.feierabendCapacity ? 65 : 95,
      }
    );
    
    setResult(scoring);
    setRouting(routingResult);
  };
  
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'feierabend':
        return <Badge className="bg-green-500">Tier 1 - Feierabend</Badge>;
      case 'marketplace_premium':
        return <Badge className="bg-blue-500">Tier 1 - Premium Auction</Badge>;
      case 'marketplace_standard':
        return <Badge className="bg-yellow-500 text-black">Tier 2 - Marketplace</Badge>;
      default:
        return <Badge variant="destructive">Tier 3 - Reject/Budget</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="h-4 w-4" />
          Lead Scoring & Routing
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        {/* Inputs */}
        <div className="grid grid-cols-6 gap-2 text-xs">
          <div>
            <Label className="text-xs">Rooms</Label>
            <Input
              type="number"
              step="0.5"
              className="h-7 text-xs"
              value={input.rooms}
              onChange={(e) => setInput({ ...input, rooms: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label className="text-xs">Distance km</Label>
            <Input
              type="number"
              className="h-7 text-xs"
              value={input.distanceKm}
              onChange={(e) => setInput({ ...input, distanceKm: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label className="text-xs">Move Date</Label>
            <Input
              type="date"
              className="h-7 text-xs"
              value={input.moveDate.toISOString().split('T')[0]}
              onChange={(e) => setInput({ ...input, moveDate: new Date(e.target.value) })}
            />
          </div>
          <div>
            <Label className="text-xs">Budget</Label>
            <Select value={input.budgetAttitude} onValueChange={(v: any) => setInput({ ...input, budgetAttitude: v })}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="cheap">Cheap</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 pt-4">
            <Switch
              checked={input.feierabendCapacity}
              onCheckedChange={(checked) => setInput({ ...input, feierabendCapacity: checked })}
            />
            <Label className="text-xs">Capacity</Label>
          </div>
          <div className="pt-3">
            <Button size="sm" onClick={handleSimulate} className="w-full h-7 text-xs">
              Simulate
            </Button>
          </div>
        </div>
        
        {/* Results */}
        {result && routing && (
          <div className="grid grid-cols-2 gap-3">
            {/* Score Breakdown */}
            <div className="p-2 bg-muted rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Lead Score</span>
                <span className="text-lg font-bold font-mono">{result.total_score}</span>
              </div>
              <Progress value={result.total_score} className="h-2" />
              <div className="grid grid-cols-5 gap-1 text-xs">
                <div className="text-center">
                  <div className="text-muted-foreground">Rooms</div>
                  <div className="font-mono font-bold">{result.breakdown.rooms}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Dist</div>
                  <div className="font-mono font-bold">{result.breakdown.distance}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Svc</div>
                  <div className="font-mono font-bold">{result.breakdown.services}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Date</div>
                  <div className="font-mono font-bold">{result.breakdown.date}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Budget</div>
                  <div className="font-mono font-bold">{result.breakdown.budget}</div>
                </div>
              </div>
            </div>
            
            {/* Routing Decision */}
            <div className="p-2 bg-muted rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Routing</span>
                {getTierBadge(routing.tier)}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" />
                  <span className="text-muted-foreground">Dest:</span>
                  <span className="font-mono">{routing.destination}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="text-muted-foreground">Concierge:</span>
                  <span className="font-mono">{routing.concierge_type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-muted-foreground">SLA:</span>
                  <span className="font-mono">{routing.sla_minutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-mono">{formatSwissCHF(routing.lead_price)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Reasons */}
        {result && result.reasons.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {result.reasons.map((reason, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {reason}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
