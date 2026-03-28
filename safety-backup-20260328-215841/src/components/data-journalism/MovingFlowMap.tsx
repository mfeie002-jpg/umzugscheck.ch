/**
 * Canton-to-Canton Flow Map
 * 
 * Interactive SVG visualization of migration flows between Swiss cantons.
 * Shows moving patterns with animated flow lines.
 */

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, TrendingUp, TrendingDown, Minus, MapPin, Users, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Swiss canton coordinates (simplified for SVG positioning)
const CANTON_POSITIONS: Record<string, { x: number; y: number; name: string }> = {
  ZH: { x: 280, y: 120, name: 'Zürich' },
  BE: { x: 180, y: 200, name: 'Bern' },
  LU: { x: 240, y: 180, name: 'Luzern' },
  UR: { x: 280, y: 220, name: 'Uri' },
  SZ: { x: 300, y: 180, name: 'Schwyz' },
  OW: { x: 250, y: 200, name: 'Obwalden' },
  NW: { x: 260, y: 190, name: 'Nidwalden' },
  GL: { x: 330, y: 170, name: 'Glarus' },
  ZG: { x: 270, y: 160, name: 'Zug' },
  FR: { x: 120, y: 200, name: 'Fribourg' },
  SO: { x: 200, y: 140, name: 'Solothurn' },
  BS: { x: 180, y: 80, name: 'Basel-Stadt' },
  BL: { x: 170, y: 100, name: 'Basel-Land' },
  SH: { x: 290, y: 60, name: 'Schaffhausen' },
  AR: { x: 360, y: 110, name: 'Appenzell A.Rh.' },
  AI: { x: 370, y: 130, name: 'Appenzell I.Rh.' },
  SG: { x: 350, y: 140, name: 'St. Gallen' },
  GR: { x: 380, y: 220, name: 'Graubünden' },
  AG: { x: 230, y: 110, name: 'Aargau' },
  TG: { x: 330, y: 80, name: 'Thurgau' },
  TI: { x: 290, y: 320, name: 'Tessin' },
  VD: { x: 80, y: 260, name: 'Waadt' },
  VS: { x: 160, y: 300, name: 'Wallis' },
  NE: { x: 100, y: 180, name: 'Neuenburg' },
  GE: { x: 40, y: 280, name: 'Genf' },
  JU: { x: 130, y: 120, name: 'Jura' },
};

interface CantonFlow {
  id: string;
  year: number;
  from_canton: string;
  to_canton: string;
  move_count: number;
  avg_cost: number | null;
  trend: 'steigend' | 'stabil' | 'sinkend' | null;
  yoy_change_percent: number | null;
}

export function MovingFlowMap() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedCanton, setSelectedCanton] = useState<string | null>(null);
  const [flowDirection, setFlowDirection] = useState<'outbound' | 'inbound'>('outbound');

  // Fetch flow data
  const { data: flows, isLoading } = useQuery({
    queryKey: ['canton-flows', selectedYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canton_migration_flows')
        .select('*')
        .eq('year', selectedYear)
        .order('move_count', { ascending: false });

      if (error) throw error;
      return data as CantonFlow[];
    },
  });

  // Filter flows based on selected canton
  const filteredFlows = useMemo(() => {
    if (!flows || !selectedCanton) return flows || [];
    
    return flows.filter(f => 
      flowDirection === 'outbound' 
        ? f.from_canton === selectedCanton 
        : f.to_canton === selectedCanton
    );
  }, [flows, selectedCanton, flowDirection]);

  // Calculate max for scaling
  const maxCount = useMemo(() => {
    if (!filteredFlows?.length) return 1;
    return Math.max(...filteredFlows.map(f => f.move_count));
  }, [filteredFlows]);

  // Get stats for selected canton
  const cantonStats = useMemo(() => {
    if (!flows || !selectedCanton) return null;
    
    const outbound = flows.filter(f => f.from_canton === selectedCanton);
    const inbound = flows.filter(f => f.to_canton === selectedCanton);
    
    return {
      totalOutbound: outbound.reduce((sum, f) => sum + f.move_count, 0),
      totalInbound: inbound.reduce((sum, f) => sum + f.move_count, 0),
      topDestinations: outbound.slice(0, 5),
      topSources: inbound.slice(0, 5),
      avgCostOutbound: outbound.length 
        ? Math.round(outbound.reduce((sum, f) => sum + (f.avg_cost || 0), 0) / outbound.length)
        : 0,
    };
  }, [flows, selectedCanton]);

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'steigend': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'sinkend': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Umzugsströme Schweiz
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={flowDirection} onValueChange={(v) => setFlowDirection(v as 'outbound' | 'inbound')}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outbound">Abwanderung</SelectItem>
                <SelectItem value="inbound">Zuwanderung</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Klicken Sie auf einen Kanton, um die Umzugsbewegungen zu sehen
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-3 gap-0">
          {/* SVG Map */}
          <div className="lg:col-span-2 p-4 bg-muted/30">
            <svg 
              viewBox="0 0 420 380" 
              className="w-full h-auto max-h-[400px]"
              style={{ minHeight: '300px' }}
            >
              {/* Flow lines */}
              <AnimatePresence>
                {filteredFlows?.map((flow) => {
                  const from = CANTON_POSITIONS[flow.from_canton];
                  const to = CANTON_POSITIONS[flow.to_canton];
                  if (!from || !to) return null;
                  
                  const strokeWidth = 1 + (flow.move_count / maxCount) * 6;
                  const opacity = 0.3 + (flow.move_count / maxCount) * 0.5;
                  
                  return (
                    <motion.line
                      key={flow.id}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="hsl(var(--primary))"
                      strokeWidth={strokeWidth}
                      strokeOpacity={opacity}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  );
                })}
              </AnimatePresence>
              
              {/* Canton circles */}
              {Object.entries(CANTON_POSITIONS).map(([code, pos]) => {
                const isSelected = selectedCanton === code;
                const hasFlows = filteredFlows?.some(
                  f => f.from_canton === code || f.to_canton === code
                );
                
                return (
                  <g key={code}>
                    <motion.circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? 18 : 14}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isSelected 
                          ? "fill-primary stroke-primary-foreground" 
                          : hasFlows
                            ? "fill-primary/30 stroke-primary hover:fill-primary/50"
                            : "fill-muted stroke-border hover:fill-muted-foreground/20"
                      )}
                      strokeWidth={2}
                      onClick={() => setSelectedCanton(isSelected ? null : code)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={cn(
                        "text-[10px] font-bold pointer-events-none select-none",
                        isSelected ? "fill-primary-foreground" : "fill-foreground"
                      )}
                    >
                      {code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          {/* Details Panel */}
          <div className="p-4 border-t lg:border-t-0 lg:border-l border-border">
            <AnimatePresence mode="wait">
              {selectedCanton && cantonStats ? (
                <motion.div
                  key={selectedCanton}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Badge variant="default">{selectedCanton}</Badge>
                      {CANTON_POSITIONS[selectedCanton]?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedYear}</p>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                        <Users className="w-3 h-3" />
                        Abwanderung
                      </div>
                      <div className="font-bold text-lg">
                        {cantonStats.totalOutbound.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                        <Users className="w-3 h-3" />
                        Zuwanderung
                      </div>
                      <div className="font-bold text-lg">
                        {cantonStats.totalInbound.toLocaleString()}
                      </div>
                    </div>
                    <div className="col-span-2 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                        <Banknote className="w-3 h-3" />
                        Ø Umzugskosten
                      </div>
                      <div className="font-bold text-lg">
                        CHF {cantonStats.avgCostOutbound.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Top destinations/sources */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      {flowDirection === 'outbound' ? 'Top Ziele' : 'Top Herkunft'}
                    </h4>
                    <div className="space-y-2">
                      {(flowDirection === 'outbound' 
                        ? cantonStats.topDestinations 
                        : cantonStats.topSources
                      ).map((flow) => (
                        <div 
                          key={flow.id}
                          className="flex items-center justify-between p-2 bg-muted/30 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="w-8 justify-center">
                              {flowDirection === 'outbound' ? flow.to_canton : flow.from_canton}
                            </Badge>
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {flow.move_count.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(flow.trend)}
                            {flow.yoy_change_percent && (
                              <span className={cn(
                                "text-xs",
                                flow.yoy_change_percent > 0 ? "text-green-600" : 
                                flow.yoy_change_percent < 0 ? "text-red-600" : "text-muted-foreground"
                              )}>
                                {flow.yoy_change_percent > 0 ? '+' : ''}{flow.yoy_change_percent.toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center text-center p-8"
                >
                  <div className="text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Kanton auswählen</p>
                    <p className="text-sm">Klicken Sie auf einen Kanton für Details</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MovingFlowMap;
