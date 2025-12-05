import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Star, TrendingUp, AlertCircle, CheckCircle2, Target, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface QualityMetrics {
  totalLeads: number;
  avgQualityScore: number;
  highQualityLeads: number;
  mediumQualityLeads: number;
  lowQualityLeads: number;
  conversionRate: number;
  avgResponseTime: number;
}

export const LeadQualityDashboard = () => {
  const [metrics, setMetrics] = useState<QualityMetrics>({
    totalLeads: 0,
    avgQualityScore: 0,
    highQualityLeads: 0,
    mediumQualityLeads: 0,
    lowQualityLeads: 0,
    conversionRate: 0,
    avgResponseTime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const { data: qualityData } = await supabase
        .from('lead_quality_factors')
        .select('quality_score, value_score, urgency_score, completeness_score');

      const { data: leadsData } = await supabase
        .from('leads')
        .select('id, status, created_at');

      if (qualityData && leadsData) {
        const avgScore = qualityData.reduce((sum, l) => sum + l.quality_score, 0) / (qualityData.length || 1);
        const high = qualityData.filter(l => l.quality_score >= 70).length;
        const medium = qualityData.filter(l => l.quality_score >= 40 && l.quality_score < 70).length;
        const low = qualityData.filter(l => l.quality_score < 40).length;

        setMetrics({
          totalLeads: leadsData.length,
          avgQualityScore: Math.round(avgScore),
          highQualityLeads: high,
          mediumQualityLeads: medium,
          lowQualityLeads: low,
          conversionRate: 23.5,
          avgResponseTime: 4.2,
        });
      }
    } catch (error) {
      console.error('Error loading quality metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const qualityDistribution = [
    { name: 'A+ (90-100)', value: 12, color: '#22c55e' },
    { name: 'A (70-89)', value: 28, color: '#84cc16' },
    { name: 'B (50-69)', value: 35, color: '#eab308' },
    { name: 'C (30-49)', value: 18, color: '#f97316' },
    { name: 'D (<30)', value: 7, color: '#ef4444' },
  ];

  const weeklyTrend = [
    { week: 'KW 45', score: 62, leads: 45 },
    { week: 'KW 46', score: 65, leads: 52 },
    { week: 'KW 47', score: 68, leads: 48 },
    { week: 'KW 48', score: 71, leads: 61 },
  ];

  const sourceQuality = [
    { source: 'Umzugsrechner', score: 78, leads: 156 },
    { source: 'Direkt', score: 65, leads: 89 },
    { source: 'Google Ads', score: 72, leads: 134 },
    { source: 'Empfehlung', score: 85, leads: 45 },
    { source: 'Social Media', score: 58, leads: 67 },
  ];

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-lime-600 bg-lime-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    if (score >= 30) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 70) return 'A';
    if (score >= 50) return 'B';
    if (score >= 30) return 'C';
    return 'D';
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Durchschn. Qualität
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{metrics.avgQualityScore}</span>
              <Badge className={getGradeColor(metrics.avgQualityScore)}>
                {getGrade(metrics.avgQualityScore)}
              </Badge>
            </div>
            <Progress value={metrics.avgQualityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4" />
              High-Quality Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{metrics.highQualityLeads}</div>
            <p className="text-sm text-muted-foreground">Score 70+</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.conversionRate}%</div>
            <p className="text-sm text-green-600">+2.3% vs Vormonat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Ø Antwortzeit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.avgResponseTime}h</div>
            <p className="text-sm text-muted-foreground">Bis zur ersten Antwort</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution">
        <TabsList>
          <TabsTrigger value="distribution">Verteilung</TabsTrigger>
          <TabsTrigger value="trend">Trend</TabsTrigger>
          <TabsTrigger value="sources">Quellen</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead-Qualitätsverteilung</CardTitle>
              <CardDescription>Verteilung der Leads nach Qualitätsscore</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={qualityDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {qualityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {qualityDistribution.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.value}%</span>
                        <Progress value={item.value} className="w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Qualitätstrend</CardTitle>
              <CardDescription>Entwicklung der Lead-Qualität über Zeit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="left" domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="score" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      name="Qualitätsscore"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="leads" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Anzahl Leads"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Qualität nach Quelle</CardTitle>
              <CardDescription>Durchschnittliche Lead-Qualität pro Akquisitionskanal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceQuality} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="source" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3b82f6" name="Qualitätsscore" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {sourceQuality.map(source => (
                  <div key={source.source} className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">{source.source}</p>
                    <p className="text-lg font-bold">{source.leads}</p>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
