/**
 * Campaign Table Component
 * Shows all campaigns with aggregated metrics
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PaidMediaCampaign, PaidMediaDailyMetrics } from './types';

interface CampaignTableProps {
  campaigns: PaidMediaCampaign[];
  metrics: PaidMediaDailyMetrics[];
}

export function CampaignTable({ campaigns, metrics }: CampaignTableProps) {
  // Aggregate metrics per campaign
  const campaignMetrics = campaigns.map(campaign => {
    const campaignData = metrics.filter(m => m.campaign_id === campaign.id);
    
    const totals = campaignData.reduce((acc, m) => ({
      impressions: acc.impressions + (m.impressions || 0),
      clicks: acc.clicks + (m.clicks || 0),
      cost: acc.cost + (m.cost_chf || 0),
      conversions: acc.conversions + (m.conversions || 0),
      value: acc.value + (m.conversion_value_chf || 0),
    }), { impressions: 0, clicks: 0, cost: 0, conversions: 0, value: 0 });

    return {
      ...campaign,
      ...totals,
      ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
      cpc: totals.clicks > 0 ? totals.cost / totals.clicks : 0,
      cpl: totals.conversions > 0 ? totals.cost / totals.conversions : 0,
      roas: totals.cost > 0 ? totals.value / totals.cost : 0,
    };
  });

  const getPlatformBadge = (platform: string) => {
    const colors: Record<string, string> = {
      google_ads: 'bg-blue-500',
      meta_ads: 'bg-indigo-500',
      microsoft_ads: 'bg-cyan-500',
    };
    const labels: Record<string, string> = {
      google_ads: 'Google',
      meta_ads: 'Meta',
      microsoft_ads: 'Microsoft',
    };
    return (
      <Badge className={`${colors[platform] || 'bg-gray-500'} text-white`}>
        {labels[platform] || platform}
      </Badge>
    );
  };

  const getCPLStatus = (cpl: number) => {
    if (cpl > 90) return 'text-destructive font-bold';
    if (cpl > 60) return 'text-yellow-600 font-medium';
    if (cpl > 0) return 'text-green-600';
    return '';
  };

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Noch keine Kampagnen. Importieren Sie Daten über den "Daten Import" Tab.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kampagnen ({campaigns.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plattform</TableHead>
                <TableHead>Kampagne</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Klicks</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Kosten</TableHead>
                <TableHead className="text-right">CPC</TableHead>
                <TableHead className="text-right">Conv.</TableHead>
                <TableHead className="text-right">CPL</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignMetrics.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>{getPlatformBadge(campaign.platform)}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {campaign.campaign_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{campaign.campaign_type || '-'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.impressions.toLocaleString('de-CH')}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.clicks.toLocaleString('de-CH')}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.ctr.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    CHF {campaign.cost.toLocaleString('de-CH', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    CHF {campaign.cpc.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.conversions}
                  </TableCell>
                  <TableCell className={`text-right ${getCPLStatus(campaign.cpl)}`}>
                    {campaign.conversions > 0 ? `CHF ${campaign.cpl.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.roas > 0 ? `${campaign.roas.toFixed(2)}x` : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
