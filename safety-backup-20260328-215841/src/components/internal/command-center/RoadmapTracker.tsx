/**
 * 90-Day Roadmap & Execution Tracker
 */

import { Calendar, CheckCircle, XCircle, Clock, AlertTriangle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { RoadmapWeek } from './types';

const ROADMAP_WEEKS: RoadmapWeek[] = [
  { week: 1, phase: 1, buildAction: 'Launch first Google Ads campaign (CHF 100/day)', measureKPI: ['CPL', 'CTR'], stopGoCriteria: 'CPL < CHF 80', status: 'passed' },
  { week: 2, phase: 1, buildAction: 'Optimize landing page CVR', measureKPI: ['CVR', 'Bounce'], stopGoCriteria: 'CVR > 12%', status: 'passed' },
  { week: 3, phase: 1, buildAction: 'Close first 3 Feierabend jobs', measureKPI: ['Close Rate', 'CM2'], stopGoCriteria: 'Close > 20%', status: 'in_progress' },
  { week: 4, phase: 1, buildAction: 'Validate CM2 positive on jobs', measureKPI: ['CM2 %', 'COGS'], stopGoCriteria: 'CM2 > 25%', status: 'pending' },
  { week: 5, phase: 2, buildAction: 'Onboard first 3 marketplace partners', measureKPI: ['Partners', 'Accept Rate'], stopGoCriteria: 'Accept > 60%', status: 'pending' },
  { week: 6, phase: 2, buildAction: 'Sell first 10 leads to partners', measureKPI: ['Fill Rate', 'RPL'], stopGoCriteria: 'Fill > 70%', status: 'pending' },
  { week: 7, phase: 2, buildAction: 'Validate marketplace margin positive', measureKPI: ['Margin/Lead', 'Disputes'], stopGoCriteria: 'Margin > CHF 10', status: 'pending' },
  { week: 8, phase: 2, buildAction: 'Scale to 5 partners per canton', measureKPI: ['Coverage', 'Churn'], stopGoCriteria: 'Churn < 10%', status: 'pending' },
  { week: 9, phase: 3, buildAction: 'Increase ad spend to CHF 200/day', measureKPI: ['CPL', 'Volume'], stopGoCriteria: 'CPL stable', status: 'pending' },
  { week: 10, phase: 3, buildAction: 'Launch Meta retargeting', measureKPI: ['Blended CPL', 'ROAS'], stopGoCriteria: 'Blended < CHF 70', status: 'pending' },
  { week: 11, phase: 3, buildAction: 'Premium auction for Tier 1', measureKPI: ['Auction Price', 'Fill'], stopGoCriteria: 'Avg bid > CHF 50', status: 'pending' },
  { week: 12, phase: 3, buildAction: 'Full automation + scale review', measureKPI: ['All KPIs'], stopGoCriteria: 'All green', status: 'pending' },
];

export function RoadmapTracker() {
  const getStatusIcon = (status: RoadmapWeek['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />;
    }
  };
  
  const getPhaseBadge = (phase: 1 | 2 | 3) => {
    switch (phase) {
      case 1: return <Badge className="bg-blue-500 text-xs">P1 Validate</Badge>;
      case 2: return <Badge className="bg-purple-500 text-xs">P2 Hybrid</Badge>;
      case 3: return <Badge className="bg-green-500 text-xs">P3 Scale</Badge>;
    }
  };
  
  const currentWeek = ROADMAP_WEEKS.find(w => w.status === 'in_progress');
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            90-Day Roadmap
          </CardTitle>
          {currentWeek && (
            <Badge className="bg-blue-500">
              <Zap className="h-3 w-3 mr-1" />
              Week {currentWeek.week}: {currentWeek.buildAction.slice(0, 30)}...
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="border rounded overflow-x-auto max-h-64">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow className="text-xs">
                <TableHead className="w-10">Wk</TableHead>
                <TableHead className="w-16">Phase</TableHead>
                <TableHead>Build / Action</TableHead>
                <TableHead className="w-28">KPIs</TableHead>
                <TableHead className="w-28">Stop/Go</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROADMAP_WEEKS.map((week) => (
                <TableRow 
                  key={week.week} 
                  className={`text-xs ${week.status === 'in_progress' ? 'bg-blue-500/10' : ''}`}
                >
                  <TableCell className="font-mono font-bold">{week.week}</TableCell>
                  <TableCell>{getPhaseBadge(week.phase)}</TableCell>
                  <TableCell className="max-w-xs truncate">{week.buildAction}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{week.measureKPI.join(', ')}</TableCell>
                  <TableCell className="font-mono">{week.stopGoCriteria}</TableCell>
                  <TableCell>{getStatusIcon(week.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
