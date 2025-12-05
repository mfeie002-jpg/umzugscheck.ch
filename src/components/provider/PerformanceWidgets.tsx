import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Star, 
  Clock,
  Target,
  Award,
  Zap,
  BarChart3
} from 'lucide-react';

interface MetricWidget {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: typeof TrendingUp;
  color: string;
  progress?: number;
  target?: string;
}

export const PerformanceWidgets = () => {
  const widgets: MetricWidget[] = [
    {
      title: 'Leads diesen Monat',
      value: 24,
      change: 12,
      changeLabel: 'vs. letzten Monat',
      icon: Users,
      color: 'text-blue-600',
      progress: 80,
      target: '30 Leads',
    },
    {
      title: 'Konversionsrate',
      value: '34%',
      change: 5,
      changeLabel: 'vs. letzten Monat',
      icon: Target,
      color: 'text-green-600',
      progress: 68,
      target: '50%',
    },
    {
      title: 'Umsatz',
      value: 'CHF 12,450',
      change: -3,
      changeLabel: 'vs. letzten Monat',
      icon: DollarSign,
      color: 'text-emerald-600',
      progress: 62,
      target: 'CHF 20,000',
    },
    {
      title: 'Ø Bewertung',
      value: '4.8',
      change: 0.2,
      changeLabel: 'vs. letzten Monat',
      icon: Star,
      color: 'text-yellow-600',
      progress: 96,
      target: '5.0',
    },
    {
      title: 'Antwortzeit',
      value: '2.4h',
      change: -15,
      changeLabel: 'schneller',
      icon: Clock,
      color: 'text-purple-600',
      progress: 85,
      target: '< 2h',
    },
    {
      title: 'Qualitäts-Score',
      value: '8.5',
      change: 0.5,
      changeLabel: 'vs. letzten Monat',
      icon: Award,
      color: 'text-orange-600',
      progress: 85,
      target: '10.0',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {widgets.map((widget, index) => {
        const Icon = widget.icon;
        const isPositive = widget.change && widget.change > 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{widget.title}</p>
                  <p className="text-2xl font-bold mt-1">{widget.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-muted ${widget.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              {widget.change !== undefined && (
                <div className="flex items-center gap-1 mt-2">
                  <TrendIcon className={`h-4 w-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{widget.change}%
                  </span>
                  <span className="text-sm text-muted-foreground">{widget.changeLabel}</span>
                </div>
              )}

              {widget.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Fortschritt</span>
                    <span className="font-medium">Ziel: {widget.target}</span>
                  </div>
                  <Progress value={widget.progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export const QuickStats = () => {
  const stats = [
    { label: 'Offene Anfragen', value: 5, urgent: 2 },
    { label: 'Angebote ausstehend', value: 3, urgent: 1 },
    { label: 'Heute fällig', value: 2, urgent: 2 },
    { label: 'Diese Woche', value: 8, urgent: 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Schnellübersicht
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              {stat.urgent > 0 && (
                <Badge variant="destructive" className="mt-2">
                  {stat.urgent} dringend
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const RevenueChart = () => {
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'];
  const revenue = [8500, 9200, 7800, 11000, 10500, 12450];
  const maxRevenue = Math.max(...revenue);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Umsatzentwicklung
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-40">
          {months.map((month, index) => {
            const height = (revenue[index] / maxRevenue) * 100;
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium">
                  {(revenue[index] / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-muted-foreground">{month}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
