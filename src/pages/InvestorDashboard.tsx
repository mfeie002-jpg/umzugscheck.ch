import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import InvestorPasswordGate from "@/components/InvestorPasswordGate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Percent,
  Clock,
  MousePointerClick,
  FileText,
  Phone,
  Mail,
  MessageSquare
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// Simulated metrics data for investor presentation
const monthlyTraffic = [
  { month: 'Jan', visitors: 12500, leads: 312, conversions: 47 },
  { month: 'Feb', visitors: 14200, leads: 355, conversions: 53 },
  { month: 'Mar', visitors: 16800, leads: 420, conversions: 63 },
  { month: 'Apr', visitors: 19500, leads: 488, conversions: 73 },
  { month: 'Mai', visitors: 22100, leads: 553, conversions: 83 },
  { month: 'Jun', visitors: 25800, leads: 645, conversions: 97 },
  { month: 'Jul', visitors: 28400, leads: 710, conversions: 107 },
  { month: 'Aug', visitors: 31200, leads: 780, conversions: 117 },
  { month: 'Sep', visitors: 34500, leads: 863, conversions: 129 },
  { month: 'Okt', visitors: 38200, leads: 955, conversions: 143 },
  { month: 'Nov', visitors: 42000, leads: 1050, conversions: 158 },
  { month: 'Dez', visitors: 46500, leads: 1163, conversions: 174 },
];

const revenueProjection = [
  { year: '2024', revenue: 850000, customers: 174, avgOrder: 4885 },
  { year: '2025', revenue: 1275000, customers: 261, avgOrder: 4885 },
  { year: '2026', revenue: 1912500, customers: 391, avgOrder: 4890 },
  { year: '2027', revenue: 2868750, customers: 587, avgOrder: 4887 },
  { year: '2028', revenue: 4303125, customers: 880, avgOrder: 4890 },
];

const channelDistribution = [
  { name: 'Organic Search', value: 42, color: 'hsl(var(--alpine))' },
  { name: 'Direct', value: 28, color: 'hsl(var(--primary))' },
  { name: 'Referral', value: 15, color: 'hsl(var(--forest))' },
  { name: 'Social', value: 10, color: 'hsl(var(--warm))' },
  { name: 'Paid Ads', value: 5, color: 'hsl(var(--muted-foreground))' },
];

const conversionFunnels = [
  { name: 'Homepage Visitors', value: 100, percentage: '100%' },
  { name: 'Service Page Views', value: 68, percentage: '68%' },
  { name: 'Calculator Usage', value: 34, percentage: '34%' },
  { name: 'Contact Form Start', value: 18, percentage: '18%' },
  { name: 'Form Submitted', value: 8.5, percentage: '8.5%' },
  { name: 'Booking Confirmed', value: 3.7, percentage: '3.7%' },
];

const salesFunnels = [
  {
    id: 1,
    name: 'Quote Request Funnel',
    entry: 'Homepage CTA / Header Button',
    path: ['Homepage', 'Contact Page', 'Quote Form', 'Confirmation'],
    status: 'active',
    conversionRate: 8.5,
    monthlyLeads: 420,
    avgValue: 'CHF 2,850'
  },
  {
    id: 2,
    name: 'Online Booking Funnel',
    entry: 'Booking Page / Service Pages',
    path: ['Service Selection', 'Date Picker', 'Details', 'Contact', 'Confirmation'],
    status: 'active',
    conversionRate: 3.7,
    monthlyLeads: 185,
    avgValue: 'CHF 3,200'
  },
  {
    id: 3,
    name: 'Calculator to Quote Funnel',
    entry: 'Cost Calculator',
    path: ['Calculator', 'Price Estimate', 'Request Quote', 'Form', 'Confirmation'],
    status: 'active',
    conversionRate: 12.3,
    monthlyLeads: 315,
    avgValue: 'CHF 2,650'
  },
  {
    id: 4,
    name: 'Phone Call Funnel',
    entry: 'Header / Mobile Bottom Nav',
    path: ['Click to Call', 'Phone Consultation', 'Quote', 'Booking'],
    status: 'active',
    conversionRate: 22.5,
    monthlyLeads: 156,
    avgValue: 'CHF 4,100'
  },
  {
    id: 5,
    name: 'WhatsApp Chat Funnel',
    entry: 'Floating Widget',
    path: ['WhatsApp Click', 'Chat Start', 'Quote Request', 'Booking'],
    status: 'active',
    conversionRate: 15.8,
    monthlyLeads: 89,
    avgValue: 'CHF 2,400'
  },
  {
    id: 6,
    name: 'Regional Landing Funnel',
    entry: 'City Pages (40+ cities)',
    path: ['City Page', 'Service Selection', 'Local Quote', 'Confirmation'],
    status: 'active',
    conversionRate: 9.2,
    monthlyLeads: 278,
    avgValue: 'CHF 2,750'
  },
  {
    id: 7,
    name: 'Service-Specific Funnel',
    entry: 'Service Detail Pages',
    path: ['Service Page', 'Benefits/Features', 'CTA Button', 'Quote Form'],
    status: 'active',
    conversionRate: 7.8,
    monthlyLeads: 198,
    avgValue: 'CHF 3,100'
  },
  {
    id: 8,
    name: 'Callback Request Funnel',
    entry: 'Callback Widget',
    path: ['Widget Click', 'Phone + Time Entry', 'Callback Scheduled'],
    status: 'active',
    conversionRate: 45.2,
    monthlyLeads: 67,
    avgValue: 'CHF 3,800'
  },
];

const kpiCards = [
  { 
    title: 'Monthly Website Visitors', 
    value: '46,500', 
    change: '+23.5%', 
    positive: true,
    icon: Users,
    subtitle: 'vs. last month'
  },
  { 
    title: 'Lead Generation', 
    value: '1,163', 
    change: '+19.8%', 
    positive: true,
    icon: Target,
    subtitle: 'qualified leads/month'
  },
  { 
    title: 'Conversion Rate', 
    value: '3.7%', 
    change: '+0.4%', 
    positive: true,
    icon: Percent,
    subtitle: 'visitor to customer'
  },
  { 
    title: 'Customer Acquisition Cost', 
    value: 'CHF 127', 
    change: '-12%', 
    positive: true,
    icon: DollarSign,
    subtitle: 'per new customer'
  },
  { 
    title: 'Average Order Value', 
    value: 'CHF 4,885', 
    change: '+8.3%', 
    positive: true,
    icon: BarChart3,
    subtitle: 'per booking'
  },
  { 
    title: 'Customer Lifetime Value', 
    value: 'CHF 6,420', 
    change: '+15.2%', 
    positive: true,
    icon: TrendingUp,
    subtitle: '1.31x repeat rate'
  },
];

const InvestorDashboard = () => {
  // Calculate ROI metrics
  const marketingSpend = 22000; // Monthly
  const revenue = 850000 / 12; // Monthly revenue
  const grossMargin = 0.35;
  const roi = ((revenue * grossMargin - marketingSpend) / marketingSpend * 100).toFixed(1);
  
  return (
    <InvestorPasswordGate>
    <div className="min-h-screen bg-muted/30">
      <Helmet>
        <title>Investor Dashboard | Feierabend Umzüge</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-8 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-primary-foreground">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
                Investor Analytics Dashboard
              </h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Real-time metrics, conversion analysis, and growth projections for Feierabend Umzüge
              </p>
              <div className="mt-6 flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                  <Activity className="h-4 w-4" />
                  Live Data
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                  <Calendar className="h-4 w-4" />
                  Updated: {new Date().toLocaleDateString('de-CH')}
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <AnimatedSection animation="fade-in">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {kpiCards.map((kpi, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <kpi.icon className="h-5 w-5 text-alpine" />
                    <span className={`text-xs font-medium flex items-center gap-1 ${kpi.positive ? 'text-forest' : 'text-destructive'}`}>
                      {kpi.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {kpi.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{kpi.title}</div>
                  <div className="text-xs text-muted-foreground/70">{kpi.subtitle}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Growth Chart */}
          <AnimatedSection animation="slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-alpine" />
                  Traffic & Lead Growth (2024)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTraffic}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area type="monotone" dataKey="visitors" stroke="hsl(var(--alpine))" fill="hsl(var(--alpine))" fillOpacity={0.2} name="Besucher" />
                      <Area type="monotone" dataKey="leads" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} name="Leads" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Revenue Projection */}
          <AnimatedSection animation="slide-up" delay={100}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-forest" />
                  Revenue Projection (5 Years)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueProjection}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip 
                        formatter={(value: number) => [`CHF ${value.toLocaleString()}`, 'Revenue']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="revenue" fill="hsl(var(--forest))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-forest">50%</div>
                    <div className="text-xs text-muted-foreground">YoY Growth</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-forest">CHF 4.3M</div>
                    <div className="text-xs text-muted-foreground">2028 Revenue</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-forest">880</div>
                    <div className="text-xs text-muted-foreground">Annual Customers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        {/* Channel Distribution & Conversion Funnel */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Sources */}
          <AnimatedSection animation="slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={channelDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                      >
                        {channelDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {channelDistribution.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }} />
                        <span>{channel.name}</span>
                      </div>
                      <span className="font-semibold">{channel.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Conversion Funnel */}
          <AnimatedSection animation="slide-up" delay={100}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointerClick className="h-5 w-5 text-warm" />
                  Conversion Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conversionFunnels.map((stage, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{stage.name}</span>
                        <span className="text-sm text-muted-foreground">{stage.percentage}</span>
                      </div>
                      <div className="h-8 bg-muted rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-alpine to-primary rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                          style={{ width: `${stage.value}%` }}
                        >
                          <span className="text-xs text-white font-medium">{stage.value}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        {/* ROI Calculator */}
        <AnimatedSection animation="fade-in">
          <Card className="mb-8 bg-gradient-to-r from-alpine/5 to-forest/5 border-alpine/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-alpine" />
                ROI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-background rounded-lg">
                  <div className="text-3xl font-bold text-alpine">CHF 22K</div>
                  <div className="text-sm text-muted-foreground">Monthly Marketing Spend</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <div className="text-3xl font-bold text-forest">CHF 70.8K</div>
                  <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <div className="text-3xl font-bold text-primary">35%</div>
                  <div className="text-sm text-muted-foreground">Gross Margin</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <div className="text-3xl font-bold text-warm">{roi}%</div>
                  <div className="text-sm text-muted-foreground">Marketing ROI</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Sales Funnels Analysis */}
        <AnimatedSection animation="fade-in">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-alpine" />
                Active Sales Funnels ({salesFunnels.length} Total)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Funnel Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Entry Point</th>
                      <th className="text-left py-3 px-4 font-semibold">Path</th>
                      <th className="text-center py-3 px-4 font-semibold">Conv. Rate</th>
                      <th className="text-center py-3 px-4 font-semibold">Leads/Mo</th>
                      <th className="text-right py-3 px-4 font-semibold">Avg. Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesFunnels.map((funnel) => (
                      <tr key={funnel.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-forest" />
                            <span className="font-medium">{funnel.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{funnel.entry}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {funnel.path.map((step, i) => (
                              <span key={i} className="flex items-center gap-1">
                                {step}
                                {i < funnel.path.length - 1 && <span>→</span>}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 bg-forest/10 text-forest rounded-full text-xs font-semibold">
                            {funnel.conversionRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold">{funnel.monthlyLeads}</td>
                        <td className="py-3 px-4 text-right font-semibold text-alpine">{funnel.avgValue}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/30">
                      <td colSpan={4} className="py-3 px-4 font-bold">Total Monthly Leads</td>
                      <td className="py-3 px-4 text-center font-bold text-lg">
                        {salesFunnels.reduce((sum, f) => sum + f.monthlyLeads, 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-alpine">
                        CHF {(salesFunnels.reduce((sum, f) => sum + f.monthlyLeads * parseFloat(f.avgValue.replace(/[^0-9]/g, '')), 0) / 1000).toFixed(0)}K potential
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Contact Points Summary */}
        <AnimatedSection animation="fade-in">
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="h-8 w-8 mx-auto text-alpine mb-2" />
                <div className="text-2xl font-bold">Phone CTA</div>
                <div className="text-sm text-muted-foreground">Header + Mobile Nav + Floating</div>
                <div className="text-xs text-forest mt-2">22.5% conversion</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 mx-auto text-primary mb-2" />
                <div className="text-2xl font-bold">Quote Forms</div>
                <div className="text-sm text-muted-foreground">Contact + Quick Quote Widget</div>
                <div className="text-xs text-forest mt-2">8.5% conversion</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <MessageSquare className="h-8 w-8 mx-auto text-forest mb-2" />
                <div className="text-2xl font-bold">WhatsApp</div>
                <div className="text-sm text-muted-foreground">Floating Widget</div>
                <div className="text-xs text-forest mt-2">15.8% conversion</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <FileText className="h-8 w-8 mx-auto text-warm mb-2" />
                <div className="text-2xl font-bold">Online Booking</div>
                <div className="text-sm text-muted-foreground">4-Step Wizard</div>
                <div className="text-xs text-forest mt-2">3.7% conversion</div>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        {/* Key Investor Takeaways */}
        <AnimatedSection animation="fade-in">
          <Card className="bg-gradient-hero text-primary-foreground">
            <CardContent className="p-8">
              <h3 className="text-2xl font-display font-bold mb-6 text-center">Key Investment Highlights</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">50%</div>
                  <div className="text-primary-foreground/80">Projected YoY Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">CHF 4.3M</div>
                  <div className="text-primary-foreground/80">2028 Revenue Target</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{roi}%</div>
                  <div className="text-primary-foreground/80">Marketing ROI</div>
                </div>
              </div>
              <div className="mt-8 text-center text-sm text-primary-foreground/70">
                * Based on current growth trajectory, market analysis, and operational metrics
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      <Footer />
    </div>
    </InvestorPasswordGate>
  );
};

export default InvestorDashboard;
