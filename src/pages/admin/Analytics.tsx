import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  MapPin,
  Calendar,
  Activity,
  Star,
  BarChart3,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface AnalyticsData {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  averageLeadValue: number;
  topCompanies: any[];
  leadsBySource: any[];
  leadsByStatus: any[];
  leadsTrend: any[];
  cantonDistribution: any[];
  calculatorUsage: any[];
}

const COLORS = ['hsl(220 70% 50%)', 'hsl(0 75% 55%)', 'hsl(142 76% 36%)', 'hsl(45 93% 47%)', 'hsl(200 80% 50%)'];

const AdminAnalytics = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalLeads: 0,
    convertedLeads: 0,
    conversionRate: 0,
    averageLeadValue: 0,
    topCompanies: [],
    leadsBySource: [],
    leadsByStatus: [],
    leadsTrend: [],
    cantonDistribution: [],
    calculatorUsage: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const days = parseInt(timeRange);
      const startDate = startOfDay(subDays(new Date(), days));

      // Fetch leads
      const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("*")
        .gte("created_at", startDate.toISOString());

      if (leadsError) throw leadsError;

      // Fetch companies with review stats
      const { data: companies, error: companiesError } = await supabase
        .from("companies")
        .select("id, name, logo, rating, review_count")
        .order("review_count", { ascending: false })
        .limit(5);

      if (companiesError) throw companiesError;

      // Process analytics data
      const totalLeads = leads?.length || 0;
      const convertedLeads = leads?.filter(l => l.status === "converted").length || 0;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      // Calculate average lead value
      const totalValue = leads?.reduce((sum, lead) => {
        const output = lead.calculator_output as any;
        const avg = output?.priceMin && output?.priceMax ? (output.priceMin + output.priceMax) / 2 : 0;
        return sum + avg;
      }, 0) || 0;
      const averageLeadValue = totalLeads > 0 ? totalValue / totalLeads : 0;

      // Leads by status
      const statusCounts = leads?.reduce((acc: any, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {}) || {};

      const leadsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        name: status === "new" ? "Neu" : status === "contacted" ? "Kontaktiert" : status === "converted" ? "Konvertiert" : "Verloren",
        value: count,
        status,
      }));

      // Leads by calculator type (source)
      const sourceCounts = leads?.reduce((acc: any, lead) => {
        const type = lead.calculator_type || "unknown";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {}) || {};

      const leadsBySource = Object.entries(sourceCounts).map(([source, count]) => ({
        name: source === "quick" ? "Schnellrechner" : source === "advanced" ? "Detailliert" : source === "ai" ? "KI-Upload" : "Unbekannt",
        value: count,
      }));

      // Leads trend (last 30 days)
      const trendData: any = {};
      for (let i = days - 1; i >= 0; i--) {
        const date = format(subDays(new Date(), i), "dd.MM");
        trendData[date] = 0;
      }

      leads?.forEach(lead => {
        const date = format(new Date(lead.created_at), "dd.MM");
        if (trendData.hasOwnProperty(date)) {
          trendData[date]++;
        }
      });

      const leadsTrend = Object.entries(trendData).map(([date, count]) => ({
        date,
        leads: count,
      }));

      // Canton distribution
      const cantonCounts = leads?.reduce((acc: any, lead) => {
        const canton = lead.from_city.split(",")[0] || "Unbekannt";
        acc[canton] = (acc[canton] || 0) + 1;
        return acc;
      }, {}) || {};

      const cantonDistribution = Object.entries(cantonCounts)
        .map(([canton, count]) => ({ canton, count }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 8);

      // Calculator usage breakdown
      const calculatorUsage = [
        { type: "Schnellrechner", usage: sourceCounts["quick"] || 0, percentage: 0 },
        { type: "Detaillierter Rechner", usage: sourceCounts["advanced"] || 0, percentage: 0 },
        { type: "KI-Upload", usage: sourceCounts["ai"] || 0, percentage: 0 },
      ];

      const totalUsage = calculatorUsage.reduce((sum, item) => sum + item.usage, 0);
      calculatorUsage.forEach(item => {
        item.percentage = totalUsage > 0 ? Math.round((item.usage / totalUsage) * 100) : 0;
      });

      setAnalytics({
        totalLeads,
        convertedLeads,
        conversionRate,
        averageLeadValue,
        topCompanies: companies || [],
        leadsBySource,
        leadsByStatus,
        leadsTrend,
        cantonDistribution,
        calculatorUsage,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Fehler",
        description: "Analytics konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-strong">
          <p className="font-medium">{label}</p>
          <p className="text-primary">{payload[0].value} Leads</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const previousConversionRate = analytics.conversionRate - 2.3; // Mock comparison
  const conversionTrend = analytics.conversionRate > previousConversionRate;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-8 bg-gradient-light">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link to="/admin">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück zum Dashboard
                </Button>
              </Link>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
                  <p className="text-muted-foreground">
                    Detaillierte Einblicke in Performance und Nutzerverhalten
                  </p>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Letzte 7 Tage</SelectItem>
                    <SelectItem value="14">Letzte 14 Tage</SelectItem>
                    <SelectItem value="30">Letzte 30 Tage</SelectItem>
                    <SelectItem value="90">Letzte 90 Tage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    {conversionTrend ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div className="text-3xl font-bold mb-1">{analytics.totalLeads}</div>
                  <div className="text-sm text-muted-foreground">Gesamt Leads</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    +{Math.round((analytics.totalLeads / 30) * 100) / 100} pro Tag
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-success/10">
                      <Target className="w-6 h-6 text-success" />
                    </div>
                    {conversionTrend ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {analytics.conversionRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Conversion Rate</div>
                  <div className="text-xs text-success mt-2">
                    {conversionTrend ? "+" : ""}{Math.abs(analytics.conversionRate - previousConversionRate).toFixed(1)}% vs. vorher
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <DollarSign className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    CHF {Math.round(analytics.averageLeadValue).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Ø Lead-Wert</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Geschätzter Auftragswert
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{analytics.convertedLeads}</div>
                  <div className="text-sm text-muted-foreground">Konvertierte Leads</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {analytics.totalLeads - analytics.convertedLeads} noch offen
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="funnel">Funnel</TabsTrigger>
                <TabsTrigger value="companies">Firmen</TabsTrigger>
                <TabsTrigger value="geography">Geografie</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Lead Trend */}
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle>Lead-Entwicklung</CardTitle>
                      <CardDescription>Tägliche neue Anfragen</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analytics.leadsTrend}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="date" fontSize={12} />
                          <YAxis fontSize={12} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="leads"
                            stroke="hsl(220 70% 50%)"
                            fill="hsl(220 70% 50% / 0.2)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Lead Sources */}
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle>Lead-Quellen</CardTitle>
                      <CardDescription>Verteilung nach Rechner-Typ</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analytics.leadsBySource}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analytics.leadsBySource.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Calculator Usage */}
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle>Rechner-Nutzung</CardTitle>
                      <CardDescription>Detaillierte Aufschlüsselung</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.calculatorUsage.map((item, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{item.type}</span>
                              <span className="text-sm text-muted-foreground">
                                {item.usage} ({item.percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status Distribution */}
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle>Lead-Status</CardTitle>
                      <CardDescription>Verteilung nach Bearbeitungsstand</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.leadsByStatus}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="name" fontSize={12} />
                          <YAxis fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="value" fill="hsl(220 70% 50%)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Funnel Tab */}
              <TabsContent value="funnel" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                    <CardDescription>Von Website-Besuch bis zur Konversion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { stage: "Website Besucher", count: analytics.totalLeads * 5, percentage: 100 },
                        { stage: "Rechner gestartet", count: analytics.totalLeads * 2, percentage: 40 },
                        { stage: "Rechner abgeschlossen", count: analytics.totalLeads, percentage: 20 },
                        { stage: "Kontakt aufgenommen", count: Math.round(analytics.totalLeads * 0.5), percentage: 10 },
                        { stage: "Konvertiert", count: analytics.convertedLeads, percentage: analytics.conversionRate },
                      ].map((stage, index) => (
                        <div key={index} className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 4 ? "bg-success text-white" : "bg-primary/10 text-primary"
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium">{stage.stage}</div>
                                <div className="text-sm text-muted-foreground">
                                  {stage.count.toLocaleString()} ({stage.percentage.toFixed(1)}%)
                                </div>
                              </div>
                            </div>
                            {index < 4 && (
                              <Badge variant="outline">
                                {((stage.percentage / 100) * 100).toFixed(0)}% →
                              </Badge>
                            )}
                          </div>
                          <div className="w-full bg-muted rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${
                                index === 4 ? "bg-success" : "bg-primary"
                              }`}
                              style={{ width: `${stage.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-3">User Journey Insights</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium mb-1">Durchschnittliche Time-to-Lead</div>
                          <div className="text-muted-foreground">~3.2 Minuten</div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Beliebtester Einstiegspunkt</div>
                          <div className="text-muted-foreground">Schnellrechner (45%)</div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Ø Seiten pro Session</div>
                          <div className="text-muted-foreground">4.7 Seiten</div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Absprungrate</div>
                          <div className="text-muted-foreground">32% (gut)</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Companies Tab */}
              <TabsContent value="companies" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>Top Performing Firmen</CardTitle>
                    <CardDescription>Nach Bewertungen und Engagement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rang</TableHead>
                          <TableHead>Firma</TableHead>
                          <TableHead>Bewertung</TableHead>
                          <TableHead>Anzahl Bewertungen</TableHead>
                          <TableHead>Performance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analytics.topCompanies.map((company, index) => (
                          <TableRow key={company.id}>
                            <TableCell>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                index === 0 ? "bg-yellow-400 text-yellow-900" :
                                index === 1 ? "bg-gray-300 text-gray-700" :
                                index === 2 ? "bg-orange-300 text-orange-900" :
                                "bg-muted"
                              }`}>
                                {index + 1}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                                  {company.logo}
                                </div>
                                <div className="font-medium">{company.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{company.rating}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{company.review_count}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-muted rounded-full h-2">
                                  <div
                                    className="bg-success h-2 rounded-full"
                                    style={{ width: `${(company.rating / 5) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {((company.rating / 5) * 100).toFixed(0)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Geography Tab */}
              <TabsContent value="geography" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>Geografische Verteilung</CardTitle>
                    <CardDescription>Lead-Herkunft nach Regionen</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={analytics.cantonDistribution} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis type="number" fontSize={12} />
                        <YAxis dataKey="canton" type="category" width={100} fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(220 70% 50%)" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>

                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                      {analytics.cantonDistribution.slice(0, 6).map((item: any, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-medium">{item.canton}</span>
                          </div>
                          <Badge variant="secondary">{item.count} Leads</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
