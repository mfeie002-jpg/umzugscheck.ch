import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, Calendar, Activity } from "lucide-react";

export default function PricingAnalytics() {
  // Mock data for seasonal trends
  const seasonalData = [
    { month: 'Jan', avgPrice: 25, volume: 120 },
    { month: 'Feb', avgPrice: 26, volume: 130 },
    { month: 'Mär', avgPrice: 28, volume: 150 },
    { month: 'Apr', avgPrice: 32, volume: 180 },
    { month: 'Mai', avgPrice: 38, volume: 220 },
    { month: 'Jun', avgPrice: 40, volume: 250 },
    { month: 'Jul', avgPrice: 42, volume: 280 },
    { month: 'Aug', avgPrice: 41, volume: 270 },
    { month: 'Sep', avgPrice: 35, volume: 200 },
    { month: 'Okt', avgPrice: 30, volume: 160 },
    { month: 'Nov', avgPrice: 27, volume: 140 },
    { month: 'Dez', avgPrice: 24, volume: 110 },
  ];

  // Mock data for demand patterns
  const demandData = [
    { providers: '0', leads: 45, avgPrice: 21 },
    { providers: '1', leads: 120, avgPrice: 26 },
    { providers: '2-3', leads: 200, avgPrice: 30 },
    { providers: '4-5', leads: 180, avgPrice: 35 },
    { providers: '6+', leads: 95, avgPrice: 45 },
  ];

  // Mock data for availability impact
  const availabilityData = [
    { range: '0-20%', count: 80, avgPrice: 42 },
    { range: '20-40%', count: 120, avgPrice: 36 },
    { range: '40-60%', count: 180, avgPrice: 30 },
    { range: '60-80%', count: 150, avgPrice: 27 },
    { range: '80-100%', count: 90, avgPrice: 24 },
  ];

  // Mock data for price distribution
  const priceDistribution = [
    { name: 'CHF 15-25', value: 320, fill: '#10b981' },
    { name: 'CHF 26-35', value: 450, fill: '#3b82f6' },
    { name: 'CHF 36-45', value: 280, fill: '#f59e0b' },
    { name: 'CHF 46+', value: 150, fill: '#ef4444' },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          Preis-Analytics
        </h1>
        <p className="text-muted-foreground">
          Historische Preisentwicklung und Markttrends
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Durchschnittspreis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">CHF 32</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+8% vs. Vormonat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Hochsaison-Aufschlag</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">+25%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Mai - September</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Nachfrage-Multiplikator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">1.35×</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Bei 4-6 Anbietern</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Verfügbarkeits-Rabatt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">-20%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Bei hoher Kapazität</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="seasonal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="seasonal">Saisonalität</TabsTrigger>
          <TabsTrigger value="demand">Nachfrage</TabsTrigger>
          <TabsTrigger value="availability">Verfügbarkeit</TabsTrigger>
          <TabsTrigger value="distribution">Verteilung</TabsTrigger>
        </TabsList>

        {/* Seasonal Trends */}
        <TabsContent value="seasonal">
          <Card>
            <CardHeader>
              <CardTitle>Saisonale Preisentwicklung</CardTitle>
              <CardDescription>
                Durchschnittlicher Lead-Preis und Volumen nach Monat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={seasonalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" label={{ value: 'Preis (CHF)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Volumen', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="avgPrice" stroke="#3b82f6" strokeWidth={2} name="Ø Preis (CHF)" />
                  <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} name="Lead-Volumen" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <strong>Insight:</strong> Die Hochsaison (Mai-September) zeigt einen durchschnittlichen 
                  Preisanstieg von 25% gegenüber der Nebensaison. Das Lead-Volumen steigt in dieser 
                  Zeit um bis zu 150%.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demand Impact */}
        <TabsContent value="demand">
          <Card>
            <CardHeader>
              <CardTitle>Nachfrage-Einfluss auf Preise</CardTitle>
              <CardDescription>
                Wie die Anzahl interessierter Anbieter den Preis beeinflusst
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={demandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="providers" label={{ value: 'Anzahl Anbieter', position: 'insideBottom', offset: -5 }} />
                  <YAxis yAxisId="left" label={{ value: 'Preis (CHF)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Leads', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="avgPrice" fill="#3b82f6" name="Ø Preis (CHF)" />
                  <Bar yAxisId="right" dataKey="leads" fill="#10b981" name="Anzahl Leads" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <strong>Insight:</strong> Leads mit 6+ interessierten Anbietern erzielen durchschnittlich 
                  115% höhere Preise als Leads ohne Interesse. Die optimale Anbieter-Anzahl für Conversions 
                  liegt bei 2-3 Anbietern.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Impact */}
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Verfügbarkeits-Einfluss auf Preise</CardTitle>
              <CardDescription>
                Zusammenhang zwischen Anbieter-Kapazität und Lead-Preisen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={availabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" label={{ value: 'Verfügbare Kapazität (%)', position: 'insideBottom', offset: -5 }} />
                  <YAxis yAxisId="left" label={{ value: 'Preis (CHF)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Leads', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="avgPrice" fill="#f59e0b" name="Ø Preis (CHF)" />
                  <Bar yAxisId="right" dataKey="count" fill="#8b5cf6" name="Anzahl Leads" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <strong>Insight:</strong> Bei niedriger Verfügbarkeit (0-20%) steigen die Preise um bis zu 
                  75% gegenüber hoher Verfügbarkeit (80-100%). Dies spiegelt die Knappheit am Markt wider.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Price Distribution */}
        <TabsContent value="distribution">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Preisverteilung</CardTitle>
                <CardDescription>
                  Anteil der Leads nach Preiskategorien
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={priceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {priceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preis-Optimierungsvorschläge</CardTitle>
                <CardDescription>
                  Empfehlungen zur Maximierung der Conversions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <strong className="text-green-900 dark:text-green-100">Hochsaison nutzen:</strong>
                    <p className="text-green-700 dark:text-green-300 mt-1">
                      Preise in Mai-September um 20-25% erhöhen, da Nachfrage deutlich steigt.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <strong className="text-blue-900 dark:text-blue-100">Nachfrage-basierte Anpassung:</strong>
                    <p className="text-blue-700 dark:text-blue-300 mt-1">
                      Bei 4+ interessierten Anbietern automatisch höhere Preise anbieten.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="text-sm">
                    <strong className="text-orange-900 dark:text-orange-100">Alters-Rabatte optimieren:</strong>
                    <p className="text-orange-700 dark:text-orange-300 mt-1">
                      Aktuelle Rabatte (15% nach 24h, 30% nach 48h) führen zu besseren Conversions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
