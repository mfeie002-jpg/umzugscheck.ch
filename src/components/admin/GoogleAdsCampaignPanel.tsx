import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Target, DollarSign, TrendingUp, MousePointer,
  Users, Eye, Pause, Play, Settings, ExternalLink, Copy,
  MapPin, Search, RefreshCcw, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  SWISS_MOVING_CAMPAIGNS,
  MONTHLY_BUDGET_ALLOCATION,
  CONVERSION_EVENTS,
  buildUTMUrl,
  type AdCampaign,
} from '@/lib/google-ads-campaigns';
import { toast } from 'sonner';

const CAMPAIGN_TYPE_ICONS = {
  search: Search,
  display: Eye,
  remarketing: RefreshCcw,
  pmax: Zap,
};

const STATUS_COLORS = {
  active: 'bg-success/10 text-success border-success/20',
  paused: 'bg-warning/10 text-warning border-warning/20',
  draft: 'bg-muted text-muted-foreground border-border',
};

export const GoogleAdsCampaignPanel = memo(function GoogleAdsCampaignPanel() {
  const [campaigns, setCampaigns] = useState(SWISS_MOVING_CAMPAIGNS);

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'paused' : 'active' as const }
          : c
      )
    );
    toast.success('Kampagnenstatus aktualisiert');
  };

  const copyUTMUrl = (campaign: AdCampaign) => {
    const url = buildUTMUrl(campaign.landingPage, campaign.utmParams);
    navigator.clipboard.writeText(url);
    toast.success('URL kopiert!');
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalDailyBudget = activeCampaigns.reduce((sum, c) => sum + c.budget.daily, 0);
  const avgCPA = activeCampaigns.reduce((sum, c) => sum + c.expectedMetrics.cpa, 0) / activeCampaigns.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Google Ads Kampagnen
          </h2>
          <p className="text-muted-foreground">
            Kampagnenstruktur für den Schweizer Umzugsmarkt
          </p>
        </div>
        <Button className="gap-2">
          <ExternalLink className="w-4 h-4" />
          Google Ads öffnen
        </Button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Tagesbudget</span>
          </div>
          <div className="text-2xl font-bold">CHF {totalDailyBudget}</div>
          <div className="text-xs text-muted-foreground">
            {activeCampaigns.length} aktive Kampagnen
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Target className="w-4 h-4" />
            <span className="text-sm">Ø CPA</span>
          </div>
          <div className="text-2xl font-bold">CHF {avgCPA.toFixed(0)}</div>
          <div className="text-xs text-success">Ziel: CHF 25</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">Erw. Leads/Monat</span>
          </div>
          <div className="text-2xl font-bold">{MONTHLY_BUDGET_ALLOCATION.expectedResults.leads}</div>
          <div className="text-xs text-muted-foreground">
            bei CHF {MONTHLY_BUDGET_ALLOCATION.totalBudget.toLocaleString()} Budget
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Erw. ROAS</span>
          </div>
          <div className="text-2xl font-bold">{MONTHLY_BUDGET_ALLOCATION.expectedResults.roas}x</div>
          <div className="text-xs text-success">Profitabel ab 1.5x</div>
        </motion.div>
      </div>

      {/* Budget Allocation */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Budget-Allokation (CHF {MONTHLY_BUDGET_ALLOCATION.totalBudget.toLocaleString()}/Monat)</h3>
        <div className="space-y-4">
          {Object.entries(MONTHLY_BUDGET_ALLOCATION.allocation).map(([type, data]) => {
            const Icon = CAMPAIGN_TYPE_ICONS[type as keyof typeof CAMPAIGN_TYPE_ICONS] || Search;
            return (
              <div key={type} className="flex items-center gap-4">
                <div className="w-24 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium capitalize">{type}</span>
                </div>
                <div className="flex-1">
                  <Progress value={data.percentage} className="h-2" />
                </div>
                <div className="w-32 text-right">
                  <span className="font-semibold">CHF {data.amount.toLocaleString()}</span>
                  <span className="text-muted-foreground text-sm ml-1">({data.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campaigns List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Alle ({campaigns.length})</TabsTrigger>
          <TabsTrigger value="active">Aktiv ({activeCampaigns.length})</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="remarketing">Remarketing</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {campaigns.map((campaign, idx) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              index={idx}
              onToggle={() => toggleCampaignStatus(campaign.id)}
              onCopyUrl={() => copyUTMUrl(campaign)}
            />
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-3">
          {activeCampaigns.map((campaign, idx) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              index={idx}
              onToggle={() => toggleCampaignStatus(campaign.id)}
              onCopyUrl={() => copyUTMUrl(campaign)}
            />
          ))}
        </TabsContent>

        <TabsContent value="search" className="space-y-3">
          {campaigns.filter(c => c.type === 'search').map((campaign, idx) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              index={idx}
              onToggle={() => toggleCampaignStatus(campaign.id)}
              onCopyUrl={() => copyUTMUrl(campaign)}
            />
          ))}
        </TabsContent>

        <TabsContent value="remarketing" className="space-y-3">
          {campaigns.filter(c => c.type === 'remarketing').map((campaign, idx) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              index={idx}
              onToggle={() => toggleCampaignStatus(campaign.id)}
              onCopyUrl={() => copyUTMUrl(campaign)}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* Conversion Events */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Conversion-Tracking Events</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(CONVERSION_EVENTS).map(([event, data]) => (
            <div
              key={event}
              className="p-3 rounded-lg bg-muted/50 border border-border"
            >
              <div className="text-sm font-medium mb-1">
                {event.replace(/_/g, ' ')}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">CHF {data.value}</span>
                <Badge variant="outline" className="text-xs">
                  {data.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

interface CampaignCardProps {
  campaign: AdCampaign;
  index: number;
  onToggle: () => void;
  onCopyUrl: () => void;
}

const CampaignCard = memo(function CampaignCard({
  campaign,
  index,
  onToggle,
  onCopyUrl,
}: CampaignCardProps) {
  const Icon = CAMPAIGN_TYPE_ICONS[campaign.type];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{campaign.name}</h4>
              <Badge className={cn('text-xs', STATUS_COLORS[campaign.status])}>
                {campaign.status === 'active' ? 'Aktiv' : campaign.status === 'paused' ? 'Pausiert' : 'Entwurf'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                CHF {campaign.budget.daily}/Tag
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {campaign.targeting.locations.join(', ')}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                CPA: CHF {campaign.expectedMetrics.cpa}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onCopyUrl}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            {campaign.status === 'active' ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">CTR</div>
          <div className="font-semibold">{campaign.expectedMetrics.ctr}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Conv. Rate</div>
          <div className="font-semibold">{campaign.expectedMetrics.conversionRate}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">CPC</div>
          <div className="font-semibold">CHF {campaign.expectedMetrics.cpc}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">CPA</div>
          <div className="font-semibold text-primary">CHF {campaign.expectedMetrics.cpa}</div>
        </div>
      </div>

      {/* Keywords (for search campaigns) */}
      {campaign.type === 'search' && campaign.targeting.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {campaign.targeting.keywords.slice(0, 4).map(kw => (
            <Badge key={kw} variant="secondary" className="text-xs">
              {kw}
            </Badge>
          ))}
          {campaign.targeting.keywords.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{campaign.targeting.keywords.length - 4} mehr
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
});
