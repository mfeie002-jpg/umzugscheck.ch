/**
 * Partner Network KPI Cards
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatSwissCHF, formatSwissPercent } from '@/lib/swiss-number-format';
import type { MarketplaceKPIs, MarketplaceStatus } from './types';

interface PartnerKPICardsProps {
  kpis7d: MarketplaceKPIs;
  kpis30d: MarketplaceKPIs;
}

function getStatus(kpis: MarketplaceKPIs): MarketplaceStatus {
  const { fillRate, disputeRate, avgResaleRate } = kpis;
  
  // Critical
  if (fillRate < 70 || disputeRate > 5 || avgResaleRate < 1.0) {
    return 'critical';
  }
  
  // Warning (borderline)
  if (fillRate < 80 || disputeRate > 3 || avgResaleRate < 1.5) {
    return 'warning';
  }
  
  return 'healthy';
}

function StatusBanner({ status }: { status: MarketplaceStatus }) {
  if (status === 'healthy') {
    return (
      <div className="p-3 bg-green-500/10 border border-green-500 rounded-lg text-green-700 dark:text-green-400">
        🟢 Marketplace gesund: Fill Rate ≥80%, Disputes ≤3%, Resale ≥1.5
      </div>
    );
  }
  if (status === 'warning') {
    return (
      <div className="p-3 bg-yellow-500/10 border border-yellow-500 rounded-lg text-yellow-700 dark:text-yellow-400">
        🟡 Achtung: Einer oder mehrere KPIs an der Grenze. Überwachen.
      </div>
    );
  }
  return (
    <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-700 dark:text-red-400">
      🔴 KRITISCH: Fill Rate &lt;70% ODER Disputes &gt;5% ODER Resale &lt;1.0. Sofortige Massnahmen erforderlich!
    </div>
  );
}

function KPICard({ label, value, subValue }: { label: string; value: string | number; subValue?: string }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
      </CardContent>
    </Card>
  );
}

function KPIGrid({ kpis }: { kpis: MarketplaceKPIs }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <KPICard label="Leads generiert" value={kpis.totalLeadsGenerated} subValue="Tier 2 + 3" />
      <KPICard label="Leads verkauft" value={kpis.leadsSold} />
      <KPICard label="Fill Rate" value={formatSwissPercent(kpis.fillRate / 100)} subValue="≥1 Partner" />
      <KPICard label="Avg Resale Rate" value={kpis.avgResaleRate.toFixed(2)} subValue="Käufer/Lead" />
      <KPICard label="RPL" value={formatSwissCHF(kpis.avgRevenuePerLead)} subValue="Revenue/Lead" />
      <KPICard label="Margin/Lead" value={formatSwissCHF(kpis.avgMarginPerLead)} />
      <KPICard label="Dispute Rate" value={formatSwissPercent(kpis.disputeRate / 100)} subValue={kpis.disputeRate > 5 ? '⚠️ Hoch' : '✓ OK'} />
      <KPICard label="Aktive Partner" value={kpis.activePartners} />
      <KPICard label="Partner Churn" value={kpis.partnerChurn} subValue="Inaktiv/Pausiert" />
    </div>
  );
}

export function PartnerKPICards({ kpis7d, kpis30d }: PartnerKPICardsProps) {
  const status7d = getStatus(kpis7d);
  const status30d = getStatus(kpis30d);
  const worstStatus = status7d === 'critical' || status30d === 'critical' ? 'critical' 
    : status7d === 'warning' || status30d === 'warning' ? 'warning' : 'healthy';
  
  return (
    <div className="space-y-4">
      <StatusBanner status={worstStatus} />
      
      <Tabs defaultValue="7d">
        <TabsList>
          <TabsTrigger value="7d">Letzte 7 Tage</TabsTrigger>
          <TabsTrigger value="30d">Letzte 30 Tage</TabsTrigger>
        </TabsList>
        <TabsContent value="7d" className="mt-4">
          <KPIGrid kpis={kpis7d} />
        </TabsContent>
        <TabsContent value="30d" className="mt-4">
          <KPIGrid kpis={kpis30d} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
