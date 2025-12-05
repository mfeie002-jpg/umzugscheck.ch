import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, FileText, DollarSign, Building2, Star, Calendar, Activity } from "lucide-react";

interface PlatformStats {
  totalLeads: number;
  totalProviders: number;
  approvedProviders: number;
  totalRevenue: number;
  conversionRate: number;
  avgLeadValue: number;
  leadsThisMonth: number;
  leadsLastMonth: number;
  providersThisMonth: number;
}

export function AdminStatistics() {
  const [stats, setStats] = useState<PlatformStats>({
    totalLeads: 0,
    totalProviders: 0,
    approvedProviders: 0,
    totalRevenue: 0,
    conversionRate: 0,
    avgLeadValue: 0,
    leadsThisMonth: 0,
    leadsLastMonth: 0,
    providersThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      // Fetch leads count
      const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

      // Fetch this month's leads
      const { count: leadsThisMonth } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thisMonthStart);

      // Fetch last month's leads
      const { count: leadsLastMonth } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", lastMonthStart)
        .lte("created_at", lastMonthEnd);

      // Fetch providers
      const { count: totalProviders } = await supabase
        .from("service_providers")
        .select("*", { count: "exact", head: true });

      const { count: approvedProviders } = await supabase
        .from("service_providers")
        .select("*", { count: "exact", head: true })
        .eq("verification_status", "approved");

      const { count: providersThisMonth } = await supabase
        .from("service_providers")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thisMonthStart);

      // Fetch billing records for revenue
      const { data: billingData } = await supabase
        .from("billing_records")
        .select("price_chf")
        .eq("status", "paid");

      const totalRevenue = billingData?.reduce((sum, r) => sum + Number(r.price_chf), 0) || 0;

      // Calculate conversion rate (simplified)
      const { count: convertedLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "converted");

      const conversionRate = totalLeads ? ((convertedLeads || 0) / totalLeads) * 100 : 0;
      const avgLeadValue = totalLeads ? totalRevenue / totalLeads : 0;

      setStats({
        totalLeads: totalLeads || 0,
        totalProviders: totalProviders || 0,
        approvedProviders: approvedProviders || 0,
        totalRevenue,
        conversionRate,
        avgLeadValue,
        leadsThisMonth: leadsThisMonth || 0,
        leadsLastMonth: leadsLastMonth || 0,
        providersThisMonth: providersThisMonth || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent leads
      const { data: recentLeads } = await supabase
        .from("leads")
        .select("id, name, created_at, calculator_type")
        .order("created_at", { ascending: false })
        .limit(5);

      // Fetch recent providers
      const { data: recentProviders } = await supabase
        .from("service_providers")
        .select("id, company_name, created_at, verification_status")
        .order("created_at", { ascending: false })
        .limit(5);

      const activity = [
        ...(recentLeads?.map((l) => ({
          type: "lead",
          title: `Neuer Lead: ${l.name}`,
          subtitle: l.calculator_type,
          time: l.created_at,
        })) || []),
        ...(recentProviders?.map((p) => ({
          type: "provider",
          title: `Neuer Anbieter: ${p.company_name}`,
          subtitle: p.verification_status,
          time: p.created_at,
        })) || []),
      ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 10);

      setRecentActivity(activity);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  const leadsGrowth =
    stats.leadsLastMonth > 0
      ? ((stats.leadsThisMonth - stats.leadsLastMonth) / stats.leadsLastMonth) * 100
      : 0;

  if (loading) {
    return <div className="text-center py-8">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gesamte Leads</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {leadsGrowth > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{leadsGrowth.toFixed(1)}%</span>
                </>
              ) : (
                <span>vs. letzter Monat</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Anbieter</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProviders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.approvedProviders} genehmigt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Umsatz</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              CHF {stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Gesamt bezahlt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Lead zu Kunde</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Leads diesen Monat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.leadsThisMonth}</div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${Math.min(100, (stats.leadsThisMonth / Math.max(stats.leadsLastMonth, 1)) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Letzter Monat: {stats.leadsLastMonth}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Durchschn. Lead-Wert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              CHF {stats.avgLeadValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Pro Lead</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Neue Anbieter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.providersThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-2">Diesen Monat</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Letzte Aktivitäten
          </CardTitle>
          <CardDescription>Die neuesten Ereignisse auf der Plattform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-full ${
                    activity.type === "lead" ? "bg-blue-100" : "bg-green-100"
                  }`}
                >
                  {activity.type === "lead" ? (
                    <FileText className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Building2 className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.subtitle}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(activity.time).toLocaleString("de-CH", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
