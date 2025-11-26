import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { TrendingUp, MapPin, Briefcase, Target } from 'lucide-react';

export default function ConversionAnalytics() {
  const [cityData, setCityData] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch city conversions
      const { data: cityConversions } = await supabase
        .from('conversion_analytics')
        .select('city, conversion_type')
        .order('created_at', { ascending: false })
        .limit(1000);

      // Aggregate by city
      const cityAgg = (cityConversions || []).reduce((acc: any, curr) => {
        if (!acc[curr.city]) {
          acc[curr.city] = { city: curr.city, leads: 0, quotes: 0, contacts: 0 };
        }
        if (curr.conversion_type === 'lead_created') acc[curr.city].leads++;
        if (curr.conversion_type === 'quote_requested') acc[curr.city].quotes++;
        if (curr.conversion_type === 'company_contacted') acc[curr.city].contacts++;
        return acc;
      }, {});
      setCityData(Object.values(cityAgg));

      // Fetch service conversions
      const { data: serviceConversions } = await supabase
        .from('conversion_analytics')
        .select('service, conversion_type')
        .order('created_at', { ascending: false })
        .limit(1000);

      // Aggregate by service
      const serviceAgg = (serviceConversions || []).reduce((acc: any, curr) => {
        if (!acc[curr.service]) {
          acc[curr.service] = { service: curr.service, count: 0 };
        }
        acc[curr.service].count++;
        return acc;
      }, {});
      setServiceData(Object.values(serviceAgg));

      // Fetch timeline data
      const { data: timeline } = await supabase
        .from('conversion_analytics')
        .select('created_at, conversion_type')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      // Group by date
      const timelineAgg = (timeline || []).reduce((acc: any, curr) => {
        const date = new Date(curr.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { date, conversions: 0 };
        }
        acc[date].conversions++;
        return acc;
      }, {});
      setTimelineData(Object.values(timelineAgg));

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Conversion Analytics</h1>
        <p className="text-muted-foreground">
          Detaillierte Analyse der Conversions nach Stadt und Service
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Conversions</p>
                <h3 className="text-2xl font-bold mt-2">
                  {cityData.reduce((sum, city) => sum + city.leads + city.quotes + city.contacts, 0)}
                </h3>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktive Städte</p>
                <h3 className="text-2xl font-bold mt-2">{cityData.length}</h3>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktive Services</p>
                <h3 className="text-2xl font-bold mt-2">{serviceData.length}</h3>
              </div>
              <Briefcase className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <h3 className="text-2xl font-bold mt-2">
                  {cityData.length > 0 ? 
                    ((cityData.reduce((sum, city) => sum + city.contacts, 0) / 
                      cityData.reduce((sum, city) => sum + city.leads, 0)) * 100).toFixed(1) 
                    : 0}%
                </h3>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="cities" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cities">Nach Stadt</TabsTrigger>
          <TabsTrigger value="services">Nach Service</TabsTrigger>
          <TabsTrigger value="timeline">Zeitverlauf</TabsTrigger>
        </TabsList>

        <TabsContent value="cities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversions nach Stadt</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leads" fill="#0088FE" name="Leads erstellt" />
                  <Bar dataKey="quotes" fill="#00C49F" name="Offerten angefragt" />
                  <Bar dataKey="contacts" fill="#FFBB28" name="Firmen kontaktiert" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversions nach Service</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({service, count}) => `${service}: ${count}`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversions über Zeit (30 Tage)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="#0088FE" 
                    strokeWidth={2}
                    name="Total Conversions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
