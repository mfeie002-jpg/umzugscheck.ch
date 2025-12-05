import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  providerId: string;
}

export const ResponseTimeTracker = ({ providerId }: Props) => {
  const [avgResponseTime, setAvgResponseTime] = useState(4.2);
  const [trend, setTrend] = useState(-12);
  const [ranking, setRanking] = useState(8);
  const [totalProviders, setTotalProviders] = useState(45);

  const historyData = [
    { date: 'Mo', time: 3.8 },
    { date: 'Di', time: 4.5 },
    { date: 'Mi', time: 3.2 },
    { date: 'Do', time: 5.1 },
    { date: 'Fr', time: 4.8 },
    { date: 'Sa', time: 6.2 },
    { date: 'So', time: 8.1 },
  ];

  const recentLeads = [
    { id: 1, name: 'M. Schmidt', responseTime: 2.5, status: 'excellent' },
    { id: 2, name: 'K. Weber', responseTime: 4.1, status: 'good' },
    { id: 3, name: 'A. Müller', responseTime: 8.3, status: 'slow' },
    { id: 4, name: 'P. Fischer', responseTime: 1.8, status: 'excellent' },
    { id: 5, name: 'S. Brunner', responseTime: 5.6, status: 'average' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-700';
      case 'good': return 'bg-blue-100 text-blue-700';
      case 'average': return 'bg-yellow-100 text-yellow-700';
      case 'slow': return 'bg-red-100 text-red-700';
      default: return 'bg-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent': return 'Exzellent';
      case 'good': return 'Gut';
      case 'average': return 'Durchschnitt';
      case 'slow': return 'Langsam';
      default: return status;
    }
  };

  const responseTimeScore = Math.max(0, 100 - (avgResponseTime * 10));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Antwortzeit-Tracker
        </CardTitle>
        <CardDescription>Ihre durchschnittliche Reaktionszeit auf neue Leads</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Ø Antwortzeit</span>
            </div>
            <div className="text-3xl font-bold">{avgResponseTime}h</div>
            <div className={`flex items-center justify-center gap-1 text-sm ${trend < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
              {Math.abs(trend)}% vs Vorwoche
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Performance</span>
            </div>
            <div className="text-3xl font-bold">{Math.round(responseTimeScore)}%</div>
            <Progress value={responseTimeScore} className="mt-2" />
          </div>

          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Ranking</span>
            </div>
            <div className="text-3xl font-bold">#{ranking}</div>
            <p className="text-sm text-muted-foreground">von {totalProviders} Anbietern</p>
          </div>
        </div>

        {/* Chart */}
        <div>
          <h4 className="font-medium mb-3">Wochenverlauf</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip 
                  formatter={(value: number) => [`${value}h`, 'Antwortzeit']}
                />
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Leads */}
        <div>
          <h4 className="font-medium mb-3">Letzte Antworten</h4>
          <div className="space-y-2">
            {recentLeads.map(lead => (
              <div 
                key={lead.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className="font-medium">{lead.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {lead.responseTime}h
                  </span>
                  <Badge className={getStatusColor(lead.status)}>
                    {getStatusLabel(lead.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        {avgResponseTime > 4 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Verbesserungspotenzial</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Eine Antwortzeit unter 2 Stunden erhöht Ihre Conversion-Rate um bis zu 40%.
                  Aktivieren Sie Push-Benachrichtigungen für neue Leads.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
