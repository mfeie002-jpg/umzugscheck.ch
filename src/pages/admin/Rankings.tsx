import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GripVertical, Star, Crown, Save, RefreshCw, Search, BarChart3, Eye, Trash2, Download, Calendar, History as HistoryIcon, FlaskConical, Brain, Activity, MapPin, Bell } from "lucide-react";
import { exportToCSV, exportAnalyticsToPDF } from "@/lib/export-utils";
import { RankingScheduler } from "@/components/admin/RankingScheduler";
import { RankingHistory } from "@/components/admin/RankingHistory";
import { ABTestManager } from "@/components/admin/ABTestManager";
import { PerformanceBenchmark } from "@/components/admin/PerformanceBenchmark";
import { RegionalRankingsManager } from "@/components/admin/RegionalRankingsManager";
import { RealtimeDashboard } from "@/components/admin/RealtimeDashboard";
import { MLOptimizer } from "@/components/admin/MLOptimizer";
import { RevenueForecasting } from "@/components/admin/RevenueForecasting";
import { EmailAutomationManager } from "@/components/admin/EmailAutomationManager";
import { CompetitorIntelligence } from "@/components/admin/CompetitorIntelligence";
import { SeasonalPresets } from "@/components/admin/SeasonalPresets";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Company {
  id: string;
  company_name: string;
  logo_url: string | null;
  verification_status: string;
  is_featured: boolean;
  ranking_position: number | null;
  featured_position: number | null;
  cantons_served: string[];
  price_level: string | null;
}

interface Analytics {
  total_clicks: number;
  total_leads: number;
  conversion_rate: number;
}

interface SortableItemProps {
  id: string;
  company: Company;
  position: number;
  isFeatured: boolean;
  onToggleFeatured: (id: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

const SortableItem = ({ id, company, position, isFeatured, onToggleFeatured, isSelected, onToggleSelect }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-background border rounded-lg p-4 mb-2"
    >
      <div className="flex items-center gap-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(id)}
        />
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
          {position}
        </div>

        {company.logo_url ? (
          <img
            src={company.logo_url}
            alt={company.company_name}
            className="w-12 h-12 object-contain rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
            <Crown className="w-6 h-6 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1">
          <h3 className="font-semibold flex items-center gap-2">
            {company.company_name}
            {isFeatured && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {company.verification_status === "approved" && (
              <Badge variant="outline" className="text-xs">
                Verifiziert
              </Badge>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            {company.cantons_served.slice(0, 3).join(", ")}
            {company.price_level && ` • ${company.price_level}`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Featured</span>
          <Switch
            checked={isFeatured}
            onCheckedChange={() => onToggleFeatured(id)}
          />
        </div>
      </div>
    </div>
  );
};

export default function Rankings() {
  const [organicCompanies, setOrganicCompanies] = useState<Company[]>([]);
  const [featuredCompanies, setFeaturedCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [analytics, setAnalytics] = useState<Record<string, Analytics>>({});
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchCompanies();
    fetchAnalytics();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .eq("verification_status", "approved")
        .order("ranking_position", { ascending: true, nullsFirst: false });

      if (error) throw error;

      if (data) {
        const featured = data
          .filter((c) => c.is_featured)
          .sort((a, b) => (a.featured_position || 999) - (b.featured_position || 999));
        
        const organic = data
          .filter((c) => !c.is_featured)
          .sort((a, b) => (a.ranking_position || 999) - (b.ranking_position || 999));

        setFeaturedCompanies(featured);
        setOrganicCompanies(organic);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast({
        title: "Fehler",
        description: "Firmen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Fetch click events
      const { data: clickData } = await supabase
        .from("provider_click_events")
        .select("provider_id");

      // Fetch lead transactions
      const { data: leadData } = await supabase
        .from("lead_transactions")
        .select("provider_id, conversion_status");

      // Calculate analytics per provider
      const analyticsMap: Record<string, Analytics> = {};

      if (clickData) {
        clickData.forEach((click) => {
          if (!analyticsMap[click.provider_id]) {
            analyticsMap[click.provider_id] = { total_clicks: 0, total_leads: 0, conversion_rate: 0 };
          }
          analyticsMap[click.provider_id].total_clicks++;
        });
      }

      if (leadData) {
        leadData.forEach((lead) => {
          if (!analyticsMap[lead.provider_id]) {
            analyticsMap[lead.provider_id] = { total_clicks: 0, total_leads: 0, conversion_rate: 0 };
          }
          analyticsMap[lead.provider_id].total_leads++;
        });
      }

      // Calculate conversion rates
      Object.keys(analyticsMap).forEach((providerId) => {
        const stats = analyticsMap[providerId];
        stats.conversion_rate = stats.total_clicks > 0 
          ? (stats.total_leads / stats.total_clicks) * 100 
          : 0;
      });

      setAnalytics(analyticsMap);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const handleDragEnd = (event: DragEndEvent, isFeatured: boolean) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const companies = isFeatured ? featuredCompanies : organicCompanies;
    const setCompanies = isFeatured ? setFeaturedCompanies : setOrganicCompanies;

    const oldIndex = companies.findIndex((c) => c.id === active.id);
    const newIndex = companies.findIndex((c) => c.id === over.id);

    setCompanies(arrayMove(companies, oldIndex, newIndex));
  };

  const toggleFeatured = async (id: string) => {
    const company = [...featuredCompanies, ...organicCompanies].find(c => c.id === id);
    if (!company) return;

    const newFeaturedStatus = !company.is_featured;

    if (newFeaturedStatus) {
      // Move to featured
      setOrganicCompanies(prev => prev.filter(c => c.id !== id));
      setFeaturedCompanies(prev => [...prev, { ...company, is_featured: true }]);
    } else {
      // Move to organic
      setFeaturedCompanies(prev => prev.filter(c => c.id !== id));
      setOrganicCompanies(prev => [...prev, { ...company, is_featured: false }]);
    }

    // Update in database immediately
    try {
      const { error } = await supabase
        .from("service_providers")
        .update({ is_featured: newFeaturedStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Aktualisiert",
        description: `Firma wurde ${newFeaturedStatus ? "zu Featured hinzugefügt" : "von Featured entfernt"}`,
      });
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast({
        title: "Fehler",
        description: "Featured-Status konnte nicht aktualisiert werden",
        variant: "destructive",
      });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    try {
      for (const id of selectedIds) {
        const { error } = await supabase
          .from("service_providers")
          .update({ verification_status: "rejected" })
          .eq("id", id);

        if (error) throw error;
      }

      toast({
        title: "Gelöscht",
        description: `${selectedIds.size} Firma(n) wurden entfernt`,
      });

      setSelectedIds(new Set());
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting companies:", error);
      toast({
        title: "Fehler",
        description: "Firmen konnten nicht gelöscht werden",
        variant: "destructive",
      });
    }
  };

  const saveRankings = async () => {
    try {
      setSaving(true);

      // Update featured companies
      const featuredUpdates = featuredCompanies.map((company, index) => ({
        id: company.id,
        featured_position: index + 1,
        is_featured: true,
      }));

      // Update organic companies
      const organicUpdates = organicCompanies.map((company, index) => ({
        id: company.id,
        ranking_position: index + 1,
      }));

      // Batch update
      for (const update of [...featuredUpdates, ...organicUpdates]) {
        const { error } = await supabase
          .from("service_providers")
          .update(update)
          .eq("id", update.id);

        if (error) throw error;
      }

      toast({
        title: "Gespeichert",
        description: "Rankings wurden erfolgreich aktualisiert",
      });
    } catch (error) {
      console.error("Error saving rankings:", error);
      toast({
        title: "Fehler",
        description: "Rankings konnten nicht gespeichert werden",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredFeaturedCompanies = featuredCompanies.filter(c =>
    c.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrganicCompanies = organicCompanies.filter(c =>
    c.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportRankings = () => {
    const data = [
      ...filteredFeaturedCompanies.map((c, i) => ({
        Position: i + 1,
        Type: "Featured",
        Company: c.company_name,
        Cantons: c.cantons_served.join(", "),
        PriceLevel: c.price_level || "N/A",
        Status: c.verification_status,
      })),
      ...filteredOrganicCompanies.map((c, i) => ({
        Position: i + filteredFeaturedCompanies.length + 1,
        Type: "Organic",
        Company: c.company_name,
        Cantons: c.cantons_served.join(", "),
        PriceLevel: c.price_level || "N/A",
        Status: c.verification_status,
      })),
    ];

    exportToCSV(data, "ranking_export");
    toast({
      title: "Exportiert",
      description: "Ranking-Daten wurden als CSV exportiert",
    });
  };

  const exportAnalytics = async () => {
    const data = [...filteredFeaturedCompanies, ...filteredOrganicCompanies].map((company) => {
      const stats = analytics[company.id] || { total_clicks: 0, total_leads: 0, conversion_rate: 0 };
      return {
        Company: company.company_name,
        Type: company.is_featured ? "Featured" : "Organic",
        Clicks: stats.total_clicks,
        Leads: stats.total_leads,
        "Conversion Rate": `${stats.conversion_rate.toFixed(2)}%`,
      };
    });

    await exportAnalyticsToPDF(data, "ranking_analytics");
    toast({
      title: "Exportiert",
      description: "Analytics wurden exportiert",
    });
  };

  return (
    <>
      <Helmet>
        <title>Rankings verwalten | Admin | Umzugscheck.ch</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Rankings verwalten</h1>
                    <p className="text-muted-foreground">
                      Verwalten Sie die Reihenfolge der Firmen in Featured und organischen Rankings
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={exportRankings}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showPreview ? "Editor" : "Vorschau"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={fetchCompanies}
                      disabled={loading}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Neu laden
                    </Button>
                    <Button
                      onClick={saveRankings}
                      disabled={saving || loading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Speichert..." : "Speichern"}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Firma suchen..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {selectedIds.size > 0 && (
                    <Button
                      variant="destructive"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {selectedIds.size} löschen
                    </Button>
                  )}
                </div>
              </div>

              {loading ? (
                <Card className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Lade Firmen...</p>
                </Card>
              ) : showPreview ? (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Vorschau: Öffentliche Ranking-Ansicht</h2>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Featured / Gesponserte Firmen
                    </h3>
                    <div className="grid gap-4">
                      {filteredFeaturedCompanies.map((company, index) => (
                        <div key={company.id} className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-950">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-white">
                              {index + 1}
                            </div>
                            {company.logo_url ? (
                              <img src={company.logo_url} alt={company.company_name} className="w-16 h-16 object-contain" />
                            ) : (
                              <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                                <Crown className="w-8 h-8" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{company.company_name}</h4>
                              <p className="text-sm text-muted-foreground">{company.cantons_served.join(", ")}</p>
                            </div>
                            <Badge className="bg-yellow-500">Gesponsert</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4">Organisches Ranking</h3>
                    <div className="grid gap-4">
                      {filteredOrganicCompanies.map((company, index) => (
                        <div key={company.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center font-bold">
                              {index + filteredFeaturedCompanies.length + 1}
                            </div>
                            {company.logo_url ? (
                              <img src={company.logo_url} alt={company.company_name} className="w-16 h-16 object-contain" />
                            ) : (
                              <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                                <Crown className="w-8 h-8" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{company.company_name}</h4>
                              <p className="text-sm text-muted-foreground">{company.cantons_served.join(", ")}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ) : (
                <Tabs defaultValue="featured" className="w-full">
                  <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="featured">
                      Featured ({featuredCompanies.length})
                    </TabsTrigger>
                    <TabsTrigger value="organic">
                      Organisch ({organicCompanies.length})
                    </TabsTrigger>
                    <TabsTrigger value="realtime">
                      <Activity className="w-4 h-4 mr-1" />
                      Live
                    </TabsTrigger>
                    <TabsTrigger value="ml">
                      <Brain className="w-4 h-4 mr-1" />
                      ML
                    </TabsTrigger>
                    <TabsTrigger value="intelligence">
                      <Eye className="w-4 h-4 mr-1" />
                      Intel
                    </TabsTrigger>
                    <TabsTrigger value="automation">
                      <Bell className="w-4 h-4 mr-1" />
                      Auto
                    </TabsTrigger>
                    <TabsTrigger value="more">
                      Mehr
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="featured" className="mt-6">
                    <Card className="p-6">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Featured / Gesponserte Firmen
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        Diese Firmen erscheinen ganz oben in den Rankings mit "Gesponsert" Badge.
                        Ziehen Sie die Karten, um die Reihenfolge zu ändern.
                      </p>

                      {filteredFeaturedCompanies.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          {searchQuery ? "Keine Ergebnisse gefunden" : "Keine Featured-Firmen vorhanden"}
                        </div>
                      ) : (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(e) => handleDragEnd(e, true)}
                        >
                          <SortableContext
                            items={filteredFeaturedCompanies.map((c) => c.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {filteredFeaturedCompanies.map((company, index) => (
                              <SortableItem
                                key={company.id}
                                id={company.id}
                                company={company}
                                position={index + 1}
                                isFeatured={true}
                                onToggleFeatured={toggleFeatured}
                                isSelected={selectedIds.has(company.id)}
                                onToggleSelect={toggleSelect}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      )}
                    </Card>
                  </TabsContent>

                  <TabsContent value="organic" className="mt-6">
                    <Card className="p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Organisches Ranking
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        Diese Firmen erscheinen nach den Featured-Firmen im Standard-Ranking.
                        Ziehen Sie die Karten, um die Reihenfolge zu ändern.
                      </p>

                      {filteredOrganicCompanies.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          {searchQuery ? "Keine Ergebnisse gefunden" : "Keine Firmen im organischen Ranking"}
                        </div>
                      ) : (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(e) => handleDragEnd(e, false)}
                        >
                          <SortableContext
                            items={filteredOrganicCompanies.map((c) => c.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {filteredOrganicCompanies.map((company, index) => (
                              <SortableItem
                                key={company.id}
                                id={company.id}
                                company={company}
                                position={index + filteredFeaturedCompanies.length + 1}
                                isFeatured={false}
                                onToggleFeatured={toggleFeatured}
                                isSelected={selectedIds.has(company.id)}
                                onToggleSelect={toggleSelect}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      )}
                    </Card>
                  </TabsContent>

                  <TabsContent value="analytics" className="mt-6">
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-bold">Performance Analytics</h2>
                          <p className="text-sm text-muted-foreground">
                            Ranking-Performance basierend auf Klicks und Lead-Generierung
                          </p>
                        </div>
                        <Button variant="outline" onClick={exportAnalytics}>
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {[...filteredFeaturedCompanies, ...filteredOrganicCompanies].map((company) => {
                          const stats = analytics[company.id] || { total_clicks: 0, total_leads: 0, conversion_rate: 0 };
                          return (
                            <div key={company.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  {company.logo_url ? (
                                    <img src={company.logo_url} alt={company.company_name} className="w-12 h-12 object-contain rounded" />
                                  ) : (
                                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                      <Crown className="w-6 h-6" />
                                    </div>
                                  )}
                                  <div>
                                    <h3 className="font-semibold">{company.company_name}</h3>
                                    {company.is_featured && (
                                      <Badge variant="secondary" className="text-xs mt-1">Featured</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Klicks</p>
                                  <p className="text-2xl font-bold">{stats.total_clicks}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Leads</p>
                                  <p className="text-2xl font-bold">{stats.total_leads}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                                  <p className="text-2xl font-bold">{stats.conversion_rate.toFixed(1)}%</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="scheduler" className="mt-6">
                    <RankingScheduler 
                      currentFeatured={filteredFeaturedCompanies}
                      currentOrganic={filteredOrganicCompanies}
                    />
                  </TabsContent>

                  <TabsContent value="history" className="mt-6">
                    <RankingHistory />
                  </TabsContent>

                  <TabsContent value="abtests" className="mt-6">
                    <ABTestManager 
                      currentFeatured={filteredFeaturedCompanies}
                      currentOrganic={filteredOrganicCompanies}
                    />
                  </TabsContent>

                  <TabsContent value="realtime" className="mt-6">
                    <RealtimeDashboard />
                  </TabsContent>

                  <TabsContent value="ml" className="mt-6">
                    <MLOptimizer 
                      companies={[...filteredFeaturedCompanies, ...filteredOrganicCompanies]}
                      analytics={analytics}
                    />
                  </TabsContent>

                  <TabsContent value="intelligence" className="mt-6">
                    <CompetitorIntelligence />
                  </TabsContent>

                  <TabsContent value="automation" className="mt-6">
                    <Tabs defaultValue="alerts" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="alerts">Smart Alerts</TabsTrigger>
                        <TabsTrigger value="forecasting">Prognosen</TabsTrigger>
                        <TabsTrigger value="presets">Vorlagen</TabsTrigger>
                      </TabsList>

                      <TabsContent value="alerts" className="mt-6">
                        <EmailAutomationManager />
                      </TabsContent>

                      <TabsContent value="forecasting" className="mt-6">
                        <RevenueForecasting />
                      </TabsContent>

                      <TabsContent value="presets" className="mt-6">
                        <SeasonalPresets />
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="more" className="mt-6">
                    <Tabs defaultValue="benchmark" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="benchmark">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Benchmarks
                        </TabsTrigger>
                        <TabsTrigger value="regional">
                          <MapPin className="w-4 h-4 mr-1" />
                          Regional
                        </TabsTrigger>
                        <TabsTrigger value="advanced">
                          Erweitert
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="benchmark" className="mt-6">
                        <PerformanceBenchmark />
                      </TabsContent>

                      <TabsContent value="regional" className="mt-6">
                        <RegionalRankingsManager 
                          companies={[...filteredFeaturedCompanies, ...filteredOrganicCompanies]}
                        />
                      </TabsContent>

                      <TabsContent value="advanced" className="mt-6">
                        <div className="grid grid-cols-2 gap-6">
                          <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <Calendar className="w-5 h-5" />
                              Geplante Änderungen
                            </h3>
                            <RankingScheduler 
                              currentFeatured={filteredFeaturedCompanies}
                              currentOrganic={filteredOrganicCompanies}
                            />
                          </Card>

                          <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <HistoryIcon className="w-5 h-5" />
                              Verlauf
                            </h3>
                            <RankingHistory />
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
