import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Globe, Calculator, Search, Users, TrendingUp, ExternalLink } from 'lucide-react';

interface Props {
  providerId: string;
}

export const LeadSourceAnalytics = ({ providerId }: Props) => {
  const sourceData = [
    { name: 'Umzugsrechner', value: 45, leads: 156, conversions: 38, color: '#3b82f6' },
    { name: 'Google Ads', value: 25, leads: 89, conversions: 18, color: '#22c55e' },
    { name: 'Direktzugriff', value: 15, leads: 52, conversions: 12, color: '#f59e0b' },
    { name: 'Empfehlungen', value: 10, leads: 35, conversions: 14, color: '#8b5cf6' },
    { name: 'Social Media', value: 5, leads: 18, conversions: 3, color: '#ec4899' },
  ];

  const trendData = [
    { month: 'Aug', calculator: 38, ads: 22, direct: 12, referral: 8, social: 4 },
    { month: 'Sep', calculator: 42, ads: 25, direct: 14, referral: 9, social: 5 },
    { month: 'Okt', calculator: 48, ads: 28, direct: 15, referral: 10, social: 6 },
    { month: 'Nov', calculator: 45, ads: 25, direct: 15, referral: 10, social: 5 },
  ];

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Umzugsrechner': return <Calculator className="h-4 w-4" />;
      case 'Google Ads': return <Search className="h-4 w-4" />;
      case 'Direktzugriff': return <Globe className="h-4 w-4" />;
      case 'Empfehlungen': return <Users className="h-4 w-4" />;
      case 'Social Media': return <ExternalLink className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const totalLeads = sourceData.reduce((sum, s) => sum + s.leads, 0);
  const totalConversions = sourceData.reduce((sum, s) => sum + s.conversions, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Lead-Quellen Analyse
        </CardTitle>
        <CardDescription>Woher kommen Ihre Leads?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold">{totalLeads}</p>
            <p className="text-xs text-muted-foreground">Leads gesamt</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold">{totalConversions}</p>
            <p className="text-xs text-muted-foreground">Konvertiert</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold">{Math.round((totalConversions / totalLeads) * 100)}%</p>
            <p className="text-xs text-muted-foreground">Ø Conversion</p>
          </div>
        </div>

        <Tabs defaultValue="distribution">
          <TabsList className="w-full">
            <TabsTrigger value="distribution" className="flex-1">Verteilung</TabsTrigger>
            <TabsTrigger value="trend" className="flex-1">Trend</TabsTrigger>
          </TabsList>

          <TabsContent value="distribution" className="mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Source List */}
              <div className="space-y-3">
                {sourceData.map(source => (
                  <div key={source.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="flex items-center gap-1 text-sm">
                        {getSourceIcon(source.name)}
                        {source.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{source.leads} Leads</Badge>
                      <span className="text-sm font-medium">{source.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trend" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calculator" name="Rechner" fill="#3b82f6" stackId="a" />
                  <Bar dataKey="ads" name="Google Ads" fill="#22c55e" stackId="a" />
                  <Bar dataKey="direct" name="Direkt" fill="#f59e0b" stackId="a" />
                  <Bar dataKey="referral" name="Empfehlung" fill="#8b5cf6" stackId="a" />
                  <Bar dataKey="social" name="Social" fill="#ec4899" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Best Performing Sources */}
        <div>
          <h4 className="font-medium mb-3">Performance nach Quelle</h4>
          <div className="space-y-3">
            {sourceData
              .sort((a, b) => (b.conversions / b.leads) - (a.conversions / a.leads))
              .map(source => {
                const conversionRate = Math.round((source.conversions / source.leads) * 100);
                return (
                  <div key={source.name} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSourceIcon(source.name)}
                        <span className="font-medium">{source.name}</span>
                      </div>
                      <Badge 
                        variant={conversionRate >= 30 ? 'default' : 'secondary'}
                        className={conversionRate >= 30 ? 'bg-green-100 text-green-700' : ''}
                      >
                        {conversionRate}% Conversion
                      </Badge>
                    </div>
                    <Progress value={conversionRate} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {source.conversions} von {source.leads} Leads konvertiert
                    </p>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Insights */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Empfehlung</h4>
              <p className="text-sm text-blue-700 mt-1">
                Empfehlungs-Leads haben die höchste Konversionsrate ({Math.round((sourceData.find(s => s.name === 'Empfehlungen')?.conversions || 0) / (sourceData.find(s => s.name === 'Empfehlungen')?.leads || 1) * 100)}%). 
                Bitten Sie zufriedene Kunden aktiv um Weiterempfehlungen.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
