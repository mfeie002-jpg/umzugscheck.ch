/**
 * Partner OS Analytics Dashboard Component
 * Key metrics and trends for moving companies
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Truck,
  Star,
  Clock,
  Users,
  DollarSign,
  Target,
  BarChart3
} from 'lucide-react';
import { PartnerAnalytics } from '@/lib/partner-os';

interface PartnerAnalyticsDashboardProps {
  analytics: PartnerAnalytics;
}

export function PartnerAnalyticsDashboard({ analytics }: PartnerAnalyticsDashboardProps) {
  const { metrics, trends } = analytics;

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const formatTrend = (value: number) => {
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value.toFixed(1)}%`;
  };

  const metricCards = [
    {
      label: 'Umsatz',
      value: `CHF ${metrics.totalRevenue.toLocaleString()}`,
      trend: trends.revenueChange,
      icon: <DollarSign className="h-5 w-5" />,
      color: 'text-emerald-600'
    },
    {
      label: 'Aufträge',
      value: metrics.completedJobs,
      subValue: `${metrics.cancelledJobs} storniert`,
      trend: trends.jobsChange,
      icon: <Truck className="h-5 w-5" />,
      color: 'text-primary'
    },
    {
      label: 'Durchschn. Auftragswert',
      value: `CHF ${Math.round(metrics.avgJobValue)}`,
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'text-amber-600'
    },
    {
      label: 'Bewertung',
      value: metrics.avgRating.toFixed(1),
      subValue: `${metrics.reviewCount} Bewertungen`,
      trend: trends.ratingChange,
      icon: <Star className="h-5 w-5" />,
      color: 'text-amber-500'
    },
    {
      label: 'Lead-Conversion',
      value: `${metrics.leadConversionRate}%`,
      icon: <Target className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      label: 'Ø Reaktionszeit',
      value: `${metrics.avgResponseTimeHours}h`,
      icon: <Clock className="h-5 w-5" />,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((metric, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={metric.color}>{metric.icon}</span>
                {metric.trend !== undefined && (
                  <Badge variant="outline" className="text-xs">
                    {getTrendIcon(metric.trend)}
                    {formatTrend(metric.trend)}
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-xs text-muted-foreground">{metric.label}</div>
              {metric.subValue && (
                <div className="text-xs text-muted-foreground mt-1">{metric.subValue}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Utilization Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Team-Auslastung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{metrics.crewUtilization}%</span>
              <Badge variant={metrics.crewUtilization > 80 ? 'default' : 'secondary'}>
                {metrics.crewUtilization > 80 ? 'Optimal' : 'Kapazität frei'}
              </Badge>
            </div>
            <Progress value={metrics.crewUtilization} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              Ziel: 75-85% für optimale Effizienz
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Fahrzeug-Auslastung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{metrics.vehicleUtilization}%</span>
              <Badge variant={metrics.vehicleUtilization > 70 ? 'default' : 'secondary'}>
                {metrics.vehicleUtilization > 70 ? 'Gut ausgelastet' : 'Kapazität frei'}
              </Badge>
            </div>
            <Progress value={metrics.vehicleUtilization} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              Ziel: 65-80% für optimale Effizienz
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PartnerAnalyticsDashboard;
