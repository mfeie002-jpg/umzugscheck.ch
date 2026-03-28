import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Bell,
  Sun,
  Cloud,
  Snowflake,
  Leaf,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface SeasonalTrend {
  month: string;
  demand: 'high' | 'medium' | 'low';
  avgPrice: number;
  priceChange: number;
  icon: typeof Sun;
}

const seasonalData: SeasonalTrend[] = [
  { month: 'Januar', demand: 'low', avgPrice: 1100, priceChange: -15, icon: Snowflake },
  { month: 'Februar', demand: 'low', avgPrice: 1150, priceChange: -10, icon: Snowflake },
  { month: 'März', demand: 'medium', avgPrice: 1300, priceChange: 5, icon: Cloud },
  { month: 'April', demand: 'high', avgPrice: 1450, priceChange: 15, icon: Leaf },
  { month: 'Mai', demand: 'high', avgPrice: 1500, priceChange: 20, icon: Sun },
  { month: 'Juni', demand: 'high', avgPrice: 1550, priceChange: 25, icon: Sun },
  { month: 'Juli', demand: 'high', avgPrice: 1600, priceChange: 30, icon: Sun },
  { month: 'August', demand: 'high', avgPrice: 1550, priceChange: 25, icon: Sun },
  { month: 'September', demand: 'high', avgPrice: 1500, priceChange: 20, icon: Leaf },
  { month: 'Oktober', demand: 'medium', avgPrice: 1350, priceChange: 10, icon: Leaf },
  { month: 'November', demand: 'low', avgPrice: 1200, priceChange: -5, icon: Cloud },
  { month: 'Dezember', demand: 'low', avgPrice: 1100, priceChange: -15, icon: Snowflake },
];

interface PricingAlert {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'warning' | 'info';
  action?: string;
}

const currentAlerts: PricingAlert[] = [
  {
    id: '1',
    title: 'Hochsaison beginnt!',
    description: 'Die Nachfrage steigt im April um 40%. Empfehlung: Preise um 15-20% erhöhen.',
    type: 'opportunity',
    action: 'Preise anpassen',
  },
  {
    id: '2',
    title: 'Konkurrenz senkt Preise',
    description: '3 Mitbewerber haben ihre Preise um durchschnittlich 8% gesenkt.',
    type: 'warning',
    action: 'Analysieren',
  },
  {
    id: '3',
    title: 'Wochenend-Premium möglich',
    description: 'Samstags-Anfragen sind 35% höher als Werktage. Premium-Zuschlag empfohlen.',
    type: 'info',
  },
];

export const SeasonalPricingAlerts = () => {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoAdjust, setAutoAdjust] = useState(false);

  const currentMonth = new Date().getMonth();
  const currentData = seasonalData[currentMonth];
  const nextMonthData = seasonalData[(currentMonth + 1) % 12];

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <Bell className="h-5 w-5 text-blue-600" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Season Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Aktuelle Saison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <currentData.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">{currentData.month}</p>
              <Badge className={getDemandColor(currentData.demand)}>
                {currentData.demand === 'high' ? 'Hohe' : currentData.demand === 'medium' ? 'Mittlere' : 'Niedrige'} Nachfrage
              </Badge>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Ø Marktpreis</p>
              <p className="text-2xl font-bold">CHF {currentData.avgPrice}</p>
              <div className={`flex items-center justify-center gap-1 ${currentData.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentData.priceChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="text-sm">{currentData.priceChange > 0 ? '+' : ''}{currentData.priceChange}%</span>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Nächster Monat</p>
              <nextMonthData.icon className="h-6 w-6 mx-auto my-1 text-muted-foreground" />
              <Badge className={getDemandColor(nextMonthData.demand)}>
                {nextMonthData.demand === 'high' ? 'Hohe' : nextMonthData.demand === 'medium' ? 'Mittlere' : 'Niedrige'} Nachfrage
              </Badge>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Preisprognose</p>
              <p className="text-2xl font-bold">CHF {nextMonthData.avgPrice}</p>
              <div className={`flex items-center justify-center gap-1 ${nextMonthData.priceChange > currentData.priceChange ? 'text-green-600' : 'text-red-600'}`}>
                {nextMonthData.priceChange > currentData.priceChange ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="text-sm">
                  {nextMonthData.priceChange > currentData.priceChange ? '+' : ''}
                  {nextMonthData.priceChange - currentData.priceChange}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Preis-Alerts
            </div>
            <Switch
              checked={alertsEnabled}
              onCheckedChange={setAlertsEnabled}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 border rounded-lg ${
                alert.type === 'opportunity' ? 'border-green-200 bg-green-50' :
                alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                  </div>
                </div>
                {alert.action && (
                  <Button size="sm" variant="outline">
                    {alert.action}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Yearly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Jahresübersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {seasonalData.map((month, index) => {
              const Icon = month.icon;
              const isCurrent = index === currentMonth;
              
              return (
                <div
                  key={month.month}
                  className={`p-2 rounded-lg text-center ${
                    isCurrent ? 'ring-2 ring-primary' : ''
                  } ${getDemandColor(month.demand)}`}
                >
                  <Icon className="h-4 w-4 mx-auto mb-1" />
                  <p className="text-xs font-medium">{month.month.slice(0, 3)}</p>
                  <p className="text-xs">{month.avgPrice}</p>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
              <span>Hohe Nachfrage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300" />
              <span>Mittlere Nachfrage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
              <span>Niedrige Nachfrage</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Adjust Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Automatische Preisanpassung</Label>
              <p className="text-sm text-muted-foreground">
                Preise automatisch basierend auf saisonalen Trends anpassen
              </p>
            </div>
            <Switch
              checked={autoAdjust}
              onCheckedChange={setAutoAdjust}
            />
          </div>
          {autoAdjust && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Aktiv: Preise werden automatisch um ±10% angepasst</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
