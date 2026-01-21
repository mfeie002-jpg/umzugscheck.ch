/**
 * Mock Data Dashboard
 * Preview dashboards with realistic Swiss test data
 */

import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart3, Users, Building, Star, TrendingUp, 
  RefreshCw, Calendar, MapPin, Phone,
  Mail, CheckCircle2
} from "lucide-react";
import {
  generateMockLeads,
  generateMockProviders,
  generateMockReview,
  generateMockAnalytics,
  type MockLead,
  type MockProvider,
  type MockReview
} from "@/lib/mock-data-generators";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const statusColors: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-yellow-500/10 text-yellow-600",
  quoted: "bg-purple-500/10 text-purple-600",
  booked: "bg-green-500/10 text-green-600",
  completed: "bg-green-600/10 text-green-700",
  cancelled: "bg-destructive/10 text-destructive"
};

const statusLabels: Record<string, string> = {
  new: "Neu",
  contacted: "Kontaktiert",
  quoted: "Angebot gesendet",
  booked: "Gebucht",
  completed: "Abgeschlossen",
  cancelled: "Storniert"
};

export default function MockDataDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Generate mock data
  const leads = useMemo(() => generateMockLeads(20), [refreshKey]);
  const providers = useMemo(() => generateMockProviders(10), [refreshKey]);
  const reviews = useMemo(() => {
    return providers.slice(0, 15).map(p => generateMockReview(p.id));
  }, [refreshKey, providers]);
  const analytics = useMemo(() => generateMockAnalytics(new Date()), [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Calculate stats
  const leadStats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    booked: leads.filter(l => l.status === 'booked').length,
    avgValue: Math.round(leads.reduce((sum, l) => sum + l.estimatedPrice.max, 0) / leads.length)
  };

  const providerStats = {
    total: providers.length,
    verified: providers.filter(p => p.verified).length,
    premium: providers.filter(p => p.priceLevel === 'premium').length,
    avgRating: (providers.reduce((sum, p) => sum + p.rating, 0) / providers.length).toFixed(1)
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Mock Data Dashboard
            </h1>
            <p className="text-muted-foreground">
              Realistische Schweizer Testdaten für Dashboard-Vorschau
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Daten neu generieren
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads</p>
                <p className="text-2xl font-bold">{leadStats.total}</p>
              </div>
              <Users className="w-8 h-8 text-primary/40" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {leadStats.new} neu, {leadStats.booked} gebucht
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Anbieter</p>
                <p className="text-2xl font-bold">{providerStats.total}</p>
              </div>
              <Building className="w-8 h-8 text-primary/40" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {providerStats.verified} verifiziert, {providerStats.premium} Premium
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ø Bewertung</p>
                <p className="text-2xl font-bold">{providerStats.avgRating}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {reviews.length} Bewertungen
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ø Lead-Wert</p>
                <p className="text-2xl font-bold">CHF {leadStats.avgValue}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500/40" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Geschätzt pro Umzug
            </p>
          </Card>
        </div>

        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList>
            <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="providers">Anbieter ({providers.length})</TabsTrigger>
            <TabsTrigger value="reviews">Bewertungen ({reviews.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <ScrollArea className="h-[500px]">
                <div className="p-4 space-y-3">
                  {leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers">
            <Card>
              <ScrollArea className="h-[500px]">
                <div className="p-4 space-y-3">
                  {providers.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <ScrollArea className="h-[500px]">
                <div className="p-4 space-y-3">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} providers={providers} />
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Traffic Quellen</h3>
                <div className="space-y-2">
                  {analytics.topSources.map((source) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{source.source}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(source.visitors / analytics.visitors) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{source.visitors}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Top Städte</h3>
                <div className="space-y-2">
                  {analytics.topCities.map((city) => (
                    <div key={city.city} className="flex items-center justify-between">
                      <span className="text-sm">{city.city}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(city.leads / Math.max(...analytics.topCities.map(c => c.leads))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{city.leads}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Top Seiten</h3>
                <div className="space-y-2">
                  {analytics.topPages.map((page) => (
                    <div key={page.path} className="flex items-center justify-between">
                      <code className="text-sm bg-muted px-1 rounded">{page.path}</code>
                      <Badge variant="outline">{page.views}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Tages-Metriken</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{analytics.visitors}</p>
                    <p className="text-xs text-muted-foreground">Besucher</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{analytics.leads}</p>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{analytics.conversionRate}%</p>
                    <p className="text-xs text-muted-foreground">Conversion</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">CHF {analytics.revenue}</p>
                    <p className="text-xs text-muted-foreground">Umsatz</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

// Sub-components
function LeadCard({ lead }: { lead: MockLead }) {
  return (
    <div className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{lead.name}</span>
            <Badge className={statusColors[lead.status]}>
              {statusLabels[lead.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {lead.fromCity} → {lead.toCity}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {lead.moveDate}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-primary">CHF {lead.estimatedPrice.min.toLocaleString()} - {lead.estimatedPrice.max.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{lead.rooms} Zimmer, {lead.volume}m³</p>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Mail className="w-3 h-3" />
          {lead.email}
        </span>
        <span className="flex items-center gap-1">
          <Phone className="w-3 h-3" />
          {lead.phone}
        </span>
      </div>
    </div>
  );
}

function ProviderCard({ provider }: { provider: MockProvider }) {
  return (
    <div className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{provider.name}</span>
            {provider.verified && (
              <Badge className="bg-green-500/10 text-green-600">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verifiziert
              </Badge>
            )}
            <Badge variant="outline" className="capitalize">
              {provider.priceLevel}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {provider.city}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              {provider.rating.toFixed(1)} ({provider.reviewCount} Bewertungen)
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold">{provider.employees} Mitarbeiter</p>
          <p className="text-xs text-muted-foreground">
            {provider.responseTimeHours}h Reaktionszeit
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {provider.services.slice(0, 4).map((service, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {service}
          </Badge>
        ))}
        {provider.services.length > 4 && (
          <Badge variant="secondary" className="text-xs">
            +{provider.services.length - 4}
          </Badge>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review, providers }: { review: MockReview; providers: MockProvider[] }) {
  const provider = providers.find(p => p.id === review.providerId);
  
  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{review.authorName}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            für <span className="font-medium">{provider?.name || 'Unbekannt'}</span>
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {format(new Date(review.createdAt), 'dd. MMM yyyy', { locale: de })}
        </span>
      </div>
      <p className="font-medium text-sm mt-2">{review.title}</p>
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{review.content}</p>
    </div>
  );
}
