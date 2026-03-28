import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, ArrowRight, Users, Eye, MessageSquare, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  providerId: string;
}

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

export const LeadConversionFunnel = ({ providerId }: Props) => {
  const [timeRange, setTimeRange] = useState('30d');

  const funnelStages: FunnelStage[] = [
    { name: 'Leads erhalten', count: 156, percentage: 100, icon: <Users className="h-4 w-4" />, color: 'bg-blue-500' },
    { name: 'Angesehen', count: 142, percentage: 91, icon: <Eye className="h-4 w-4" />, color: 'bg-indigo-500' },
    { name: 'Kontaktiert', count: 98, percentage: 63, icon: <MessageSquare className="h-4 w-4" />, color: 'bg-purple-500' },
    { name: 'Offerte gesendet', count: 67, percentage: 43, icon: <FileText className="h-4 w-4" />, color: 'bg-pink-500' },
    { name: 'Konvertiert', count: 34, percentage: 22, icon: <CheckCircle2 className="h-4 w-4" />, color: 'bg-green-500' },
  ];

  const conversionRates = [
    { from: 'Erhalten → Angesehen', rate: 91, benchmark: 85, status: 'good' },
    { from: 'Angesehen → Kontaktiert', rate: 69, benchmark: 60, status: 'good' },
    { from: 'Kontaktiert → Offerte', rate: 68, benchmark: 55, status: 'good' },
    { from: 'Offerte → Konvertiert', rate: 51, benchmark: 40, status: 'excellent' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'average': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'bg-muted';
    }
  };

  const weeklyData = [
    { week: 'KW 45', received: 38, converted: 8, rate: 21 },
    { week: 'KW 46', received: 42, converted: 10, rate: 24 },
    { week: 'KW 47', received: 35, converted: 7, rate: 20 },
    { week: 'KW 48', received: 41, converted: 9, rate: 22 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lead-Conversion-Funnel</CardTitle>
            <CardDescription>Visualisierung Ihres Verkaufsprozesses</CardDescription>
          </div>
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="7d">7 Tage</TabsTrigger>
              <TabsTrigger value="30d">30 Tage</TabsTrigger>
              <TabsTrigger value="90d">90 Tage</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Visual Funnel */}
        <div className="space-y-2">
          {funnelStages.map((stage, index) => (
            <div key={stage.name} className="relative">
              <div 
                className={`${stage.color} rounded-lg p-4 text-white transition-all`}
                style={{ 
                  width: `${Math.max(stage.percentage, 30)}%`,
                  marginLeft: `${(100 - Math.max(stage.percentage, 30)) / 2}%`
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {stage.icon}
                    <span className="font-medium">{stage.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{stage.count}</span>
                    <span className="text-sm opacity-80 ml-2">({stage.percentage}%)</span>
                  </div>
                </div>
              </div>
              {index < funnelStages.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Conversion Rates */}
        <div>
          <h4 className="font-semibold mb-4">Konversionsraten</h4>
          <div className="space-y-3">
            {conversionRates.map(rate => (
              <div key={rate.from} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">{rate.from}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <Progress value={rate.rate} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold w-12 text-right">{rate.rate}%</span>
                    <Badge className={getStatusColor(rate.status)} variant="outline">
                      {rate.rate > rate.benchmark ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {rate.rate > rate.benchmark ? '+' : ''}{rate.rate - rate.benchmark}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        <div>
          <h4 className="font-semibold mb-4">Wochenübersicht</h4>
          <div className="grid grid-cols-4 gap-4">
            {weeklyData.map(week => (
              <div key={week.week} className="p-4 border rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">{week.week}</p>
                <p className="text-2xl font-bold">{week.rate}%</p>
                <p className="text-xs text-muted-foreground">
                  {week.converted}/{week.received} konvertiert
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">💡 Erkenntnisse</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Ihre Konversionsrate liegt 5% über dem Branchendurchschnitt</li>
            <li>• Leads mit schneller Antwort konvertieren 2x häufiger</li>
            <li>• Montags eingegangene Leads haben die höchste Konversionsrate</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
