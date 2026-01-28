/**
 * 90-Day Roadmap Table Component
 */

import { CheckCircle, XCircle, Clock, AlertTriangle, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { LaunchKPIs, RoadmapWeek } from './types';

const ROADMAP_DATA: RoadmapWeek[] = [
  // Phase 1: Validation (Weeks 1-4)
  {
    week: 1,
    phase: 1,
    buildAction: 'Setup: Google Ads (Alpha), 1 Landing Page, Rent 1 truck, Hire Team Leader + 2 temps, CRM setup',
    measureKPI: ['CPC < CHF 6.00', 'CTR > 3.5%'],
    stopGoCriteria: 'STOP: CPC > CHF 10 on day 1. GO: 1st booking within CHF 200 spend.',
    status: 'pending',
  },
  {
    week: 2,
    phase: 1,
    buildAction: 'Sales: Founder takes 100% calls, Script testing. Pricing: Flat rate offers only.',
    measureKPI: ['Close Rate > 20%', 'CPL < CHF 80'],
    stopGoCriteria: 'STOP: Close rate < 10% (Offer or Sales skill issue).',
    status: 'pending',
  },
  {
    week: 3,
    phase: 1,
    buildAction: 'Ops: Execute first 5 jobs. Audit: Time vs. Estimate. Did we lose money on labor?',
    measureKPI: ['Job Margin > 20%', 'NPS: 10/10'],
    stopGoCriteria: 'STOP: Job Margin < 0%. Re-price immediately.',
    status: 'pending',
  },
  {
    week: 4,
    phase: 1,
    buildAction: 'Review: Calculate "True CAC" (Media + Founder Time). Decision: Is Direct Profitable?',
    measureKPI: ['Blended CAC < CHF 150', 'Utilization: 40%'],
    stopGoCriteria: 'GO: If CM2 positive → Unlock Phase 2.',
    status: 'pending',
  },
  // Phase 2: Hybrid Switch (Weeks 5-8)
  {
    week: 5,
    phase: 2,
    buildAction: 'Tech: Launch Umzugscheck LP. Routing: Manual triage. Ptnr: Onboard 3 Beta partners.',
    measureKPI: ['Marketplace CPL < CHF 45'],
    stopGoCriteria: 'STOP: Mktplace CPL > Direct CPL (Arbitrage failed).',
    status: 'pending',
  },
  {
    week: 6,
    phase: 2,
    buildAction: 'Traffic: Shift 50% budget to Marketplace keywords. Routing: Cherries → Feierabend, Chaff → Partners.',
    measureKPI: ['Partner Accept % > 40%'],
    stopGoCriteria: 'STOP: Partners reject >80% leads (Quality issue).',
    status: 'pending',
  },
  {
    week: 7,
    phase: 2,
    buildAction: 'Process: Install Wizard form. Auto-reject leads < 1.5 rooms unless partner wants.',
    measureKPI: ['Lead Qual Rate > 30%'],
    stopGoCriteria: 'GO: Marketplace revenue covers 30% of Ad Spend.',
    status: 'pending',
  },
  {
    week: 8,
    phase: 2,
    buildAction: 'Stress Test: Fill Feierabend truck for End-of-Month. Sell overflow to partners at premium.',
    measureKPI: ['Feierabend Util: 90% (EOM)', 'Mktplace Rev: > CHF 2k'],
    stopGoCriteria: 'GO: Scale Ads.',
    status: 'pending',
  },
  // Phase 3: Optimization (Weeks 9-12)
  {
    week: 9,
    phase: 3,
    buildAction: 'Hiring: Hire Sales/Concierge Rep (Part-time). Training: Shadow founder for 1 week.',
    measureKPI: ['Rep Close Rate > 15%'],
    stopGoCriteria: 'STOP: Rep close rate < 15% → Retrain or fire.',
    status: 'pending',
  },
  {
    week: 10,
    phase: 3,
    buildAction: 'Pricing: Activate Dynamic Pricing (Mid-month discounts). Auto-Routing: Implement Tier 1/2 logic.',
    measureKPI: ['Mid-Month Util > 60%'],
    stopGoCriteria: 'GO: Mid-month fills up.',
    status: 'pending',
  },
  {
    week: 11,
    phase: 3,
    buildAction: 'Finances: Full P&L Review. Audit: Partner Churn / Disputes.',
    measureKPI: ['CM2 > 35%', 'Partner Churn: 0'],
    stopGoCriteria: 'Kill Switch: Disputes > 5% → Pause Partner network.',
    status: 'pending',
  },
  {
    week: 12,
    phase: 3,
    buildAction: 'Scale: Double Ad Spend. Commit to 2nd Truck Lease.',
    measureKPI: ['Blended ROAS > 400%'],
    stopGoCriteria: 'GO: Graduation to Q2.',
    status: 'pending',
  },
];

interface RoadmapTableProps {
  currentWeek: number;
  kpis: LaunchKPIs;
}

function evaluateWeekStatus(week: RoadmapWeek, currentWeek: number, kpis: LaunchKPIs): RoadmapWeek['status'] {
  if (week.week > currentWeek) return 'pending';
  if (week.week === currentWeek) return 'in_progress';
  
  // Evaluate based on KPIs for past weeks
  switch (week.week) {
    case 1:
      return kpis.cpc <= 10 ? 'passed' : 'failed';
    case 2:
      return kpis.closeRate >= 10 ? 'passed' : 'failed';
    case 3:
      return kpis.cm2Percent >= 0 ? 'passed' : 'failed';
    case 4:
      return kpis.cm2 > 0 ? 'passed' : 'blocked';
    case 5:
      return kpis.marketplaceCPL <= kpis.cpl ? 'passed' : 'failed';
    case 6:
      return kpis.partnerAcceptRate >= 20 ? 'passed' : 'failed';
    case 7:
      return kpis.marketplaceRevenuePercent >= 30 ? 'passed' : 'blocked';
    case 8:
      return kpis.utilization >= 90 ? 'passed' : 'blocked';
    default:
      return 'passed';
  }
}

export function RoadmapTable({ currentWeek, kpis }: RoadmapTableProps) {
  const evaluatedData = ROADMAP_DATA.map(week => ({
    ...week,
    status: evaluateWeekStatus(week, currentWeek, kpis),
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          90-Day Roadmap (Weeks 1–12)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Week</TableHead>
              <TableHead className="w-20">Phase</TableHead>
              <TableHead>Build / Action</TableHead>
              <TableHead>Measure / KPI</TableHead>
              <TableHead>Stop/Go Criteria</TableHead>
              <TableHead className="w-24 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluatedData.map((row) => (
              <TableRow 
                key={row.week}
                className={
                  row.week === currentWeek ? 'bg-primary/5 border-l-4 border-l-primary' :
                  row.status === 'failed' ? 'bg-red-500/5' :
                  row.status === 'blocked' ? 'bg-yellow-500/5' :
                  ''
                }
              >
                <TableCell className="font-mono font-bold">
                  W{row.week}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    row.phase === 1 ? 'outline' :
                    row.phase === 2 ? 'secondary' :
                    'default'
                  }>
                    P{row.phase}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm max-w-xs">
                  {row.buildAction}
                </TableCell>
                <TableCell>
                  <ul className="text-xs space-y-1">
                    {row.measureKPI.map((kpi, i) => (
                      <li key={i} className="text-muted-foreground">• {kpi}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="text-xs max-w-xs">
                  <span className={
                    row.stopGoCriteria.startsWith('STOP') ? 'text-red-600 font-medium' :
                    row.stopGoCriteria.startsWith('GO') ? 'text-green-600 font-medium' :
                    row.stopGoCriteria.startsWith('Kill') ? 'text-red-600 font-bold' :
                    ''
                  }>
                    {row.stopGoCriteria}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: RoadmapWeek['status'] }) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
    case 'in_progress':
      return <Badge className="gap-1 bg-blue-500"><PlayCircle className="h-3 w-3" /> Active</Badge>;
    case 'passed':
      return <Badge className="gap-1 bg-green-500"><CheckCircle className="h-3 w-3" /> Passed</Badge>;
    case 'failed':
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Failed</Badge>;
    case 'blocked':
      return <Badge className="gap-1 bg-yellow-500 text-black"><AlertTriangle className="h-3 w-3" /> Blocked</Badge>;
  }
}
