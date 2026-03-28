/**
 * URL Tracking Dashboard
 * 
 * Admin page to track all URLs, their optimization status, and change history
 */

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink,
  Edit2,
  History,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  FileText,
  Globe,
  ShoppingCart,
  Users,
  BookOpen,
  Award,
  ArrowUpDown,
  X,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format } from "date-fns";
import { de } from "date-fns/locale";

// Types
interface UrlTracking {
  id: string;
  url_path: string;
  page_type: string;
  status: string;
  primary_keyword: string | null;
  secondary_keywords: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  h1_tag: string | null;
  funnel_role: string | null;
  conversion_potential: string | null;
  search_intent: string | null;
  estimated_search_volume: number | null;
  created_at: string;
  updated_at: string;
  last_reviewed_at: string | null;
  reviewed_by: string | null;
  notes: string | null;
  optimization_score: number | null;
}

interface UrlChangeHistory {
  id: string;
  url_id: string;
  change_date: string;
  change_type: string;
  change_description: string;
  changed_by: string | null;
  impact_notes: string | null;
}

const PAGE_TYPE_ICONS: Record<string, React.ReactNode> = {
  'funnel': <TrendingUp className="w-4 h-4" />,
  'service': <FileText className="w-4 h-4" />,
  'geo-kanton': <Globe className="w-4 h-4" />,
  'geo-stadt': <Globe className="w-4 h-4" />,
  'ratgeber': <BookOpen className="w-4 h-4" />,
  'ranking': <Award className="w-4 h-4" />,
  'b2b': <Users className="w-4 h-4" />,
  'shop': <ShoppingCart className="w-4 h-4" />,
  'landing': <FileText className="w-4 h-4" />,
  'other': <FileText className="w-4 h-4" />
};

const STATUS_COLORS: Record<string, string> = {
  'live': 'bg-green-500',
  'planned': 'bg-blue-500',
  'in-progress': 'bg-yellow-500',
  'deprecated': 'bg-gray-500',
  'redirect': 'bg-purple-500'
};

const INTENT_COLORS: Record<string, string> = {
  'hot': 'text-red-500 bg-red-50 dark:bg-red-950',
  'warm': 'text-orange-500 bg-orange-50 dark:bg-orange-950',
  'cold': 'text-blue-500 bg-blue-50 dark:bg-blue-950',
  'informational': 'text-gray-500 bg-gray-50 dark:bg-gray-950'
};

const UrlTrackingDashboard = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUrl, setSelectedUrl] = useState<UrlTracking | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [newChange, setNewChange] = useState({ type: "", description: "", impact: "" });

  // Fetch URLs
  const { data: urls = [], isLoading } = useQuery({
    queryKey: ['url-tracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('url_tracking')
        .select('*')
        .order('url_path');
      if (error) throw error;
      return data as UrlTracking[];
    }
  });

  // Fetch change history for selected URL
  const { data: changeHistory = [] } = useQuery({
    queryKey: ['url-change-history', selectedUrl?.id],
    queryFn: async () => {
      if (!selectedUrl?.id) return [];
      const { data, error } = await supabase
        .from('url_change_history')
        .select('*')
        .eq('url_id', selectedUrl.id)
        .order('change_date', { ascending: false });
      if (error) throw error;
      return data as UrlChangeHistory[];
    },
    enabled: !!selectedUrl?.id
  });

  // Add URL mutation
  const addUrlMutation = useMutation({
    mutationFn: async (newUrl: Partial<UrlTracking> & { url_path: string; page_type: string }) => {
      const { data, error } = await supabase
        .from('url_tracking')
        .insert([newUrl as any])
        .select()
        .single();
      if (error) throw error;
      
      // Add creation history
      await supabase.from('url_change_history').insert([{
        url_id: data.id,
        change_type: 'created',
        change_description: `URL ${newUrl.url_path} erstellt`,
        changed_by: 'System'
      }]);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-tracking'] });
      toast.success('URL erfolgreich hinzugefügt');
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Fehler: ${error.message}`);
    }
  });

  // Update URL mutation
  const updateUrlMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UrlTracking> }) => {
      const { data, error } = await supabase
        .from('url_tracking')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-tracking'] });
      toast.success('URL aktualisiert');
    }
  });

  // Add change history
  const addHistoryMutation = useMutation({
    mutationFn: async (change: { url_id: string; change_type: string; change_description: string; impact_notes?: string }) => {
      const { error } = await supabase.from('url_change_history').insert([{
        ...change,
        changed_by: 'Admin'
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-change-history'] });
      toast.success('Änderung dokumentiert');
      setNewChange({ type: "", description: "", impact: "" });
    }
  });

  // Filter URLs
  const filteredUrls = useMemo(() => {
    return urls.filter(url => {
      const matchesSearch = url.url_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.primary_keyword?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || url.page_type === filterType;
      const matchesStatus = filterStatus === "all" || url.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [urls, searchTerm, filterType, filterStatus]);

  // Stats
  const stats = useMemo(() => ({
    total: urls.length,
    live: urls.filter(u => u.status === 'live').length,
    planned: urls.filter(u => u.status === 'planned').length,
    avgScore: Math.round(urls.filter(u => u.optimization_score).reduce((acc, u) => acc + (u.optimization_score || 0), 0) / urls.filter(u => u.optimization_score).length) || 0
  }), [urls]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              URL Tracking Dashboard
            </h1>
            <p className="text-muted-foreground">Alle URLs dokumentieren und Optimierungen tracken</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                URL hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Neue URL hinzufügen</DialogTitle>
              </DialogHeader>
              <AddUrlForm onSubmit={(data) => addUrlMutation.mutate(data)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Gesamt URLs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-green-500">{stats.live}</div>
              <div className="text-sm text-muted-foreground">Live</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-blue-500">{stats.planned}</div>
              <div className="text-sm text-muted-foreground">Geplant</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-orange-500">{stats.avgScore}%</div>
              <div className="text-sm text-muted-foreground">Ø Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="URL oder Keyword suchen..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Seitentyp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Typen</SelectItem>
              <SelectItem value="funnel">Funnel</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="geo-kanton">Geo (Kanton)</SelectItem>
              <SelectItem value="geo-stadt">Geo (Stadt)</SelectItem>
              <SelectItem value="ratgeber">Ratgeber</SelectItem>
              <SelectItem value="ranking">Ranking</SelectItem>
              <SelectItem value="b2b">B2B</SelectItem>
              <SelectItem value="shop">Shop</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="planned">Geplant</SelectItem>
              <SelectItem value="in-progress">In Arbeit</SelectItem>
              <SelectItem value="deprecated">Veraltet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* URL List */}
        <Card>
          <CardHeader>
            <CardTitle>URLs ({filteredUrls.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Lade URLs...</div>
            ) : filteredUrls.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {urls.length === 0 ? "Noch keine URLs erfasst. Füge die erste URL hinzu!" : "Keine URLs gefunden."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUrls.map((url) => (
                  <div 
                    key={url.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedUrl(url)}
                  >
                    <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[url.status]}`} />
                    <div className="flex-shrink-0 text-muted-foreground">
                      {PAGE_TYPE_ICONS[url.page_type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm truncate">{url.url_path}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {url.primary_keyword || "Kein Keyword"}
                      </div>
                    </div>
                    {url.search_intent && (
                      <Badge variant="outline" className={INTENT_COLORS[url.search_intent]}>
                        {url.search_intent}
                      </Badge>
                    )}
                    {url.optimization_score !== null && (
                      <div className={`text-sm font-medium ${
                        url.optimization_score >= 80 ? 'text-green-500' :
                        url.optimization_score >= 60 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {url.optimization_score}%
                      </div>
                    )}
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUrl(url);
                      setIsHistoryDialogOpen(true);
                    }}>
                      <History className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                      <a href={url.url_path} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* URL Detail Dialog */}
        <Dialog open={!!selectedUrl && !isHistoryDialogOpen} onOpenChange={(open) => !open && setSelectedUrl(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedUrl && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {PAGE_TYPE_ICONS[selectedUrl.page_type]}
                    <span className="font-mono">{selectedUrl.url_path}</span>
                  </DialogTitle>
                </DialogHeader>
                <UrlDetailView 
                  url={selectedUrl} 
                  onUpdate={(updates) => updateUrlMutation.mutate({ id: selectedUrl.id, updates })}
                  onAddHistory={() => setIsHistoryDialogOpen(true)}
                />
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Änderungsverlauf: {selectedUrl?.url_path}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="history">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history">Verlauf</TabsTrigger>
                <TabsTrigger value="add">Neue Änderung</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history">
                <ScrollArea className="h-[400px]">
                  {changeHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Noch keine Änderungen dokumentiert.
                    </div>
                  ) : (
                    <div className="space-y-4 pr-4">
                      {changeHistory.map((change) => (
                        <div key={change.id} className="border-l-2 border-primary/30 pl-4 py-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{change.change_type}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(change.change_date), "dd.MM.yyyy HH:mm", { locale: de })}
                            </span>
                          </div>
                          <p className="text-sm">{change.change_description}</p>
                          {change.impact_notes && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              Impact: {change.impact_notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="add">
                <div className="space-y-4">
                  <div>
                    <Label>Änderungstyp</Label>
                    <Select value={newChange.type} onValueChange={(v) => setNewChange({...newChange, type: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Typ wählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="seo">SEO</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="a/b-test">A/B Test</SelectItem>
                        <SelectItem value="fix">Bugfix</SelectItem>
                        <SelectItem value="other">Sonstiges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Beschreibung</Label>
                    <Textarea 
                      placeholder="Was wurde geändert?" 
                      value={newChange.description}
                      onChange={(e) => setNewChange({...newChange, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Impact (optional)</Label>
                    <Input 
                      placeholder="Erwarteter Effekt..." 
                      value={newChange.impact}
                      onChange={(e) => setNewChange({...newChange, impact: e.target.value})}
                    />
                  </div>
                  <Button 
                    onClick={() => selectedUrl && addHistoryMutation.mutate({
                      url_id: selectedUrl.id,
                      change_type: newChange.type,
                      change_description: newChange.description,
                      impact_notes: newChange.impact || undefined
                    })}
                    disabled={!newChange.type || !newChange.description}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Änderung speichern
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Add URL Form Component
const AddUrlForm = ({ onSubmit }: { onSubmit: (data: Partial<UrlTracking> & { url_path: string; page_type: string }) => void }) => {
  const [formData, setFormData] = useState({
    url_path: "",
    page_type: "service",
    status: "live",
    primary_keyword: "",
    funnel_role: "",
    conversion_potential: "",
    search_intent: "",
    notes: ""
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>URL Pfad *</Label>
          <Input 
            placeholder="/services/reinigung" 
            value={formData.url_path}
            onChange={(e) => setFormData({...formData, url_path: e.target.value})}
          />
        </div>
        <div>
          <Label>Seitentyp *</Label>
          <Select value={formData.page_type} onValueChange={(v) => setFormData({...formData, page_type: v})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="funnel">Funnel</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="geo-kanton">Geo (Kanton)</SelectItem>
              <SelectItem value="geo-stadt">Geo (Stadt)</SelectItem>
              <SelectItem value="ratgeber">Ratgeber</SelectItem>
              <SelectItem value="ranking">Ranking</SelectItem>
              <SelectItem value="b2b">B2B</SelectItem>
              <SelectItem value="shop">Shop</SelectItem>
              <SelectItem value="landing">Landing</SelectItem>
              <SelectItem value="other">Sonstiges</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="planned">Geplant</SelectItem>
              <SelectItem value="in-progress">In Arbeit</SelectItem>
              <SelectItem value="deprecated">Veraltet</SelectItem>
              <SelectItem value="redirect">Redirect</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Primäres Keyword</Label>
          <Input 
            placeholder="Umzugsreinigung Schweiz" 
            value={formData.primary_keyword}
            onChange={(e) => setFormData({...formData, primary_keyword: e.target.value})}
          />
        </div>
        <div>
          <Label>Search Intent</Label>
          <Select value={formData.search_intent} onValueChange={(v) => setFormData({...formData, search_intent: v})}>
            <SelectTrigger>
              <SelectValue placeholder="Wählen..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hot">Hot 🔥</SelectItem>
              <SelectItem value="warm">Warm 🌡️</SelectItem>
              <SelectItem value="cold">Cold ❄️</SelectItem>
              <SelectItem value="informational">Informational 📚</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Funnel Rolle</Label>
          <Select value={formData.funnel_role} onValueChange={(v) => setFormData({...formData, funnel_role: v})}>
            <SelectTrigger>
              <SelectValue placeholder="Wählen..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="traffic-magnet">Traffic Magnet</SelectItem>
              <SelectItem value="lead-converter">Lead Converter</SelectItem>
              <SelectItem value="trust-builder">Trust Builder</SelectItem>
              <SelectItem value="seo-authority">SEO Authority</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Conversion Potential</Label>
          <Select value={formData.conversion_potential} onValueChange={(v) => setFormData({...formData, conversion_potential: v})}>
            <SelectTrigger>
              <SelectValue placeholder="Wählen..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sehr-hoch">Sehr Hoch 🚀</SelectItem>
              <SelectItem value="hoch">Hoch</SelectItem>
              <SelectItem value="mittel">Mittel</SelectItem>
              <SelectItem value="niedrig">Niedrig</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label>Notizen</Label>
          <Textarea 
            placeholder="Zusätzliche Infos..." 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Abbrechen</Button>
        </DialogClose>
        <Button 
          onClick={() => onSubmit(formData as Partial<UrlTracking> & { url_path: string; page_type: string })}
          disabled={!formData.url_path || !formData.page_type}
        >
          URL hinzufügen
        </Button>
      </DialogFooter>
    </div>
  );
};

// URL Detail View Component
const UrlDetailView = ({ 
  url, 
  onUpdate, 
  onAddHistory 
}: { 
  url: UrlTracking; 
  onUpdate: (updates: Partial<UrlTracking>) => void;
  onAddHistory: () => void;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(url);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onAddHistory}>
          <History className="w-4 h-4 mr-2" />
          Änderung dokumentieren
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={url.url_path} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Seite öffnen
          </a>
        </Button>
        <Button 
          variant={editMode ? "default" : "outline"} 
          size="sm"
          onClick={() => {
            if (editMode) {
              onUpdate(editData);
            }
            setEditMode(!editMode);
          }}
        >
          {editMode ? <Save className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
          {editMode ? "Speichern" : "Bearbeiten"}
        </Button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-muted-foreground">Status</Label>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[url.status]}`} />
            <span className="capitalize">{url.status}</span>
          </div>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Seitentyp</Label>
          <div className="flex items-center gap-2 mt-1">
            {PAGE_TYPE_ICONS[url.page_type]}
            <span className="capitalize">{url.page_type}</span>
          </div>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Search Intent</Label>
          {url.search_intent ? (
            <Badge variant="outline" className={`mt-1 ${INTENT_COLORS[url.search_intent]}`}>
              {url.search_intent}
            </Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Optimization Score</Label>
          <div className={`text-lg font-bold ${
            (url.optimization_score || 0) >= 80 ? 'text-green-500' :
            (url.optimization_score || 0) >= 60 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {url.optimization_score !== null ? `${url.optimization_score}%` : '-'}
          </div>
        </div>
      </div>

      {/* SEO Data */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-semibold">SEO Daten</h4>
        <div>
          <Label className="text-xs text-muted-foreground">Primäres Keyword</Label>
          {editMode ? (
            <Input 
              value={editData.primary_keyword || ""} 
              onChange={(e) => setEditData({...editData, primary_keyword: e.target.value})}
            />
          ) : (
            <p>{url.primary_keyword || <span className="text-muted-foreground italic">Nicht gesetzt</span>}</p>
          )}
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Meta Title</Label>
          {editMode ? (
            <Input 
              value={editData.meta_title || ""} 
              onChange={(e) => setEditData({...editData, meta_title: e.target.value})}
            />
          ) : (
            <p>{url.meta_title || <span className="text-muted-foreground italic">Nicht gesetzt</span>}</p>
          )}
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Meta Description</Label>
          {editMode ? (
            <Textarea 
              value={editData.meta_description || ""} 
              onChange={(e) => setEditData({...editData, meta_description: e.target.value})}
            />
          ) : (
            <p className="text-sm">{url.meta_description || <span className="text-muted-foreground italic">Nicht gesetzt</span>}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2 pt-4 border-t">
        <Label className="text-xs text-muted-foreground">Notizen</Label>
        {editMode ? (
          <Textarea 
            value={editData.notes || ""} 
            onChange={(e) => setEditData({...editData, notes: e.target.value})}
            rows={3}
          />
        ) : (
          <p className="text-sm">{url.notes || <span className="text-muted-foreground italic">Keine Notizen</span>}</p>
        )}
      </div>

      {/* Timestamps */}
      <div className="text-xs text-muted-foreground pt-4 border-t flex gap-4">
        <span>Erstellt: {format(new Date(url.created_at), "dd.MM.yyyy", { locale: de })}</span>
        <span>Aktualisiert: {format(new Date(url.updated_at), "dd.MM.yyyy", { locale: de })}</span>
      </div>
    </div>
  );
};

export default UrlTrackingDashboard;