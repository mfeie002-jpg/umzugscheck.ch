import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Video, Play, Pause, CheckCircle, Clock, AlertCircle, 
  User, Mail, Phone, MapPin, Calendar, Package, 
  Plus, Trash2, Save, Eye, Download, Filter,
  ChevronLeft, ChevronRight, Search, RefreshCw,
  Sparkles, Brain, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface VideoAnalysis {
  id: string;
  video_url: string;
  thumbnail_url: string | null;
  user_email: string;
  user_name: string | null;
  user_phone: string | null;
  from_city: string | null;
  to_city: string | null;
  from_postal: string | null;
  to_postal: string | null;
  move_date: string | null;
  status: 'pending' | 'reviewing' | 'analyzed' | 'error';
  rooms: any[];
  items: any[];
  total_volume_m3: number | null;
  total_weight_kg: number | null;
  estimated_boxes: number | null;
  estimated_hours: number | null;
  price_min: number | null;
  price_max: number | null;
  reviewer_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  ai_summary: string | null;
  confidence_score: number | null;
  ai_analyzed_at: string | null;
  converted_to_lead: boolean | null;
  lead_id: string | null;
}

interface AnalysisItem {
  id?: string;
  name: string;
  category: string;
  quantity: number;
  weight_kg: number;
  volume_m3: number;
  room_name: string;
  requires_special_handling: boolean;
  notes: string;
  ai_detected?: boolean;
  ai_confidence?: number;
  manually_verified?: boolean;
}

const ITEM_CATEGORIES = [
  { value: 'furniture', label: 'Möbel' },
  { value: 'electronics', label: 'Elektronik' },
  { value: 'fragile', label: 'Zerbrechlich' },
  { value: 'heavy', label: 'Schwer' },
  { value: 'plants', label: 'Pflanzen' },
  { value: 'art', label: 'Kunst' },
  { value: 'boxes', label: 'Kartons' },
  { value: 'other', label: 'Sonstiges' },
];

const COMMON_ITEMS = [
  { name: 'Doppelbett', category: 'furniture', weight: 80, volume: 1.5 },
  { name: 'Einzelbett', category: 'furniture', weight: 40, volume: 0.8 },
  { name: 'Kleiderschrank (2-türig)', category: 'furniture', weight: 60, volume: 1.2 },
  { name: 'Kleiderschrank (3-türig)', category: 'furniture', weight: 90, volume: 1.8 },
  { name: 'Sofa (2-Sitzer)', category: 'furniture', weight: 50, volume: 1.0 },
  { name: 'Sofa (3-Sitzer)', category: 'furniture', weight: 70, volume: 1.5 },
  { name: 'Esstisch', category: 'furniture', weight: 40, volume: 0.5 },
  { name: 'Stuhl', category: 'furniture', weight: 5, volume: 0.1 },
  { name: 'Fernseher', category: 'electronics', weight: 15, volume: 0.2 },
  { name: 'Kühlschrank', category: 'electronics', weight: 60, volume: 0.5 },
  { name: 'Waschmaschine', category: 'electronics', weight: 70, volume: 0.4 },
  { name: 'Bücherregal', category: 'furniture', weight: 30, volume: 0.8 },
  { name: 'Schreibtisch', category: 'furniture', weight: 35, volume: 0.6 },
  { name: 'Kommode', category: 'furniture', weight: 40, volume: 0.5 },
  { name: 'Umzugskarton (Standard)', category: 'boxes', weight: 20, volume: 0.06 },
  { name: 'Umzugskarton (Bücher)', category: 'boxes', weight: 30, volume: 0.04 },
];

export default function VideoAnalysesAdmin() {
  const queryClient = useQueryClient();
  const [selectedAnalysis, setSelectedAnalysis] = useState<VideoAnalysis | null>(null);
  const [items, setItems] = useState<AnalysisItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [newItem, setNewItem] = useState<AnalysisItem>({
    name: '',
    category: 'furniture',
    quantity: 1,
    weight_kg: 0,
    volume_m3: 0,
    room_name: '',
    requires_special_handling: false,
    notes: ''
  });

  // Fetch video analyses
  const { data: analyses, isLoading, refetch } = useQuery({
    queryKey: ['video-analyses', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('video_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as VideoAnalysis[];
    }
  });

  // Fetch items for selected analysis
  const { data: analysisItems } = useQuery({
    queryKey: ['video-analysis-items', selectedAnalysis?.id],
    queryFn: async () => {
      if (!selectedAnalysis) return [];
      const { data, error } = await supabase
        .from('video_analysis_items')
        .select('*')
        .eq('analysis_id', selectedAnalysis.id);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedAnalysis
  });

  useEffect(() => {
    if (analysisItems) {
      setItems(analysisItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity || 1,
        weight_kg: item.weight_kg || 0,
        volume_m3: item.volume_m3 || 0,
        room_name: item.room_name || '',
        requires_special_handling: item.requires_special_handling || false,
        notes: item.notes || '',
        ai_detected: item.ai_detected || false,
        ai_confidence: item.ai_confidence || item.confidence_score || 0,
        manually_verified: item.manually_verified || false
      })));
    }
  }, [analysisItems]);

  // Update analysis mutation
  const updateAnalysis = useMutation({
    mutationFn: async (updates: Partial<VideoAnalysis>) => {
      if (!selectedAnalysis) throw new Error('No analysis selected');
      
      const { error } = await supabase
        .from('video_analyses')
        .update({
          ...updates,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', selectedAnalysis.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Analyse gespeichert');
      queryClient.invalidateQueries({ queryKey: ['video-analyses'] });
    },
    onError: (error) => {
      toast.error('Fehler beim Speichern: ' + error.message);
    }
  });

  // Add item mutation
  const addItem = useMutation({
    mutationFn: async (item: AnalysisItem) => {
      if (!selectedAnalysis) throw new Error('No analysis selected');
      
      const { error } = await supabase
        .from('video_analysis_items')
        .insert({
          analysis_id: selectedAnalysis.id,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          weight_kg: item.weight_kg,
          volume_m3: item.volume_m3,
          room_name: item.room_name,
          requires_special_handling: item.requires_special_handling,
          notes: item.notes,
          manually_verified: true
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Item hinzugefügt');
      queryClient.invalidateQueries({ queryKey: ['video-analysis-items'] });
      setShowAddItemDialog(false);
      setNewItem({
        name: '',
        category: 'furniture',
        quantity: 1,
        weight_kg: 0,
        volume_m3: 0,
        room_name: '',
        requires_special_handling: false,
        notes: ''
      });
    }
  });

  // Delete item mutation
  const deleteItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('video_analysis_items')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Item gelöscht');
      queryClient.invalidateQueries({ queryKey: ['video-analysis-items'] });
    }
  });

  // AI Analysis mutation
  const runAiAnalysis = useMutation({
    mutationFn: async (analysisId: string) => {
      const { data, error } = await supabase.functions.invoke('analyze-video', {
        body: { analysis_id: analysisId }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success('KI-Analyse abgeschlossen!', {
        description: `${data.result?.items?.length || 0} Items erkannt`
      });
      queryClient.invalidateQueries({ queryKey: ['video-analyses'] });
      queryClient.invalidateQueries({ queryKey: ['video-analysis-items'] });
    },
    onError: (error) => {
      toast.error('KI-Analyse fehlgeschlagen: ' + error.message);
    }
  });
  
  // Convert to Lead mutation
  const convertToLead = useMutation({
    mutationFn: async (analysis: VideoAnalysis) => {
      const totals = calculateTotals();
      
      // Create lead from video analysis
      const leadData = {
        email: analysis.user_email,
        name: analysis.user_name || analysis.user_email.split('@')[0],
        phone: analysis.user_phone,
        from_city: analysis.from_city || '',
        to_city: analysis.to_city || '',
        from_postal: analysis.from_postal || '',
        to_postal: analysis.to_postal || '',
        move_date: analysis.move_date,
        calculator_type: 'video_analysis',
        calculator_input: { 
          video_url: analysis.video_url,
          items: items,
          rooms: analysis.rooms 
        } as any,
        calculator_output: {
          total_volume_m3: totals.totalVolume,
          total_weight_kg: totals.totalWeight,
          estimated_boxes: totals.estimatedBoxes,
          price_min: totals.priceMin,
          price_max: totals.priceMax,
          ai_summary: analysis.ai_summary
        } as any,
        lead_source: 'video_upload'
      };
      
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert(leadData)
        .select('id')
        .single();
      
      if (leadError) throw leadError;
      
      // Update video analysis to mark as converted
      const { error: updateError } = await supabase
        .from('video_analyses')
        .update({
          converted_to_lead: true,
          lead_id: lead.id
        })
        .eq('id', analysis.id);
      
      if (updateError) throw updateError;
      
      return lead;
    },
    onSuccess: () => {
      toast.success('Lead erfolgreich erstellt!');
      queryClient.invalidateQueries({ queryKey: ['video-analyses'] });
    },
    onError: (error) => {
      toast.error('Fehler beim Erstellen des Leads: ' + error.message);
    }
  });

  const calculateTotals = () => {
    const totalVolume = items.reduce((sum, item) => sum + (item.volume_m3 * item.quantity), 0);
    const totalWeight = items.reduce((sum, item) => sum + (item.weight_kg * item.quantity), 0);
    const estimatedBoxes = items.filter(i => i.category === 'boxes').reduce((sum, item) => sum + item.quantity, 0);
    
    // Simple price estimation
    const basePrice = 500;
    const volumePrice = totalVolume * 50;
    const priceMin = Math.round(basePrice + volumePrice * 0.8);
    const priceMax = Math.round(basePrice + volumePrice * 1.3);

    return { totalVolume, totalWeight, estimatedBoxes, priceMin, priceMax };
  };

  const handleSaveAnalysis = () => {
    const totals = calculateTotals();
    updateAnalysis.mutate({
      status: 'analyzed',
      total_volume_m3: totals.totalVolume,
      total_weight_kg: totals.totalWeight,
      estimated_boxes: totals.estimatedBoxes,
      price_min: totals.priceMin,
      price_max: totals.priceMax,
      items: items
    });
  };

  const handleQuickAddItem = (preset: typeof COMMON_ITEMS[0]) => {
    setNewItem({
      ...newItem,
      name: preset.name,
      category: preset.category,
      weight_kg: preset.weight,
      volume_m3: preset.volume
    });
    setShowAddItemDialog(true);
  };

  const statusColors = {
    pending: 'bg-warning/20 text-warning border-warning/30',
    reviewing: 'bg-info/20 text-info border-info/30',
    analyzed: 'bg-success/20 text-success border-success/30',
    error: 'bg-destructive/20 text-destructive border-destructive/30'
  };

  const statusLabels = {
    pending: 'Ausstehend',
    reviewing: 'In Bearbeitung',
    analyzed: 'Analysiert',
    error: 'Fehler'
  };

  const filteredAnalyses = analyses?.filter(a => 
    a.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.from_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.to_city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Video className="h-6 w-6 text-primary" />
              Video-Analysen
            </h1>
            <p className="text-muted-foreground">
              Manuelle Prüfung und Annotation von Kundenvideos
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Suchen nach Email, Name, Stadt..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="reviewing">In Bearbeitung</SelectItem>
                  <SelectItem value="analyzed">Analysiert</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="text-sm">
                {filteredAnalyses?.length || 0} Videos
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-3">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Laden...</div>
            ) : filteredAnalyses?.length === 0 ? (
              <Card className="p-8 text-center">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Keine Videos gefunden</p>
              </Card>
            ) : (
              filteredAnalyses?.map((analysis) => (
                <motion.div
                  key={analysis.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${selectedAnalysis?.id === analysis.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedAnalysis(analysis)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Video className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{analysis.user_name || analysis.user_email}</p>
                            <Badge className={statusColors[analysis.status]} variant="outline">
                              {statusLabels[analysis.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {analysis.from_city && analysis.to_city 
                              ? `${analysis.from_city} → ${analysis.to_city}`
                              : 'Keine Route angegeben'
                            }
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(analysis.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Detail View */}
          <div className="lg:col-span-2">
            {selectedAnalysis ? (
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Video-Analyse
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[selectedAnalysis.status]} variant="outline">
                        {statusLabels[selectedAnalysis.status]}
                      </Badge>
                      {selectedAnalysis.status === 'pending' && (
                        <Button 
                          onClick={() => runAiAnalysis.mutate(selectedAnalysis.id)}
                          disabled={runAiAnalysis.isPending}
                          variant="secondary"
                          className="bg-gradient-to-r from-primary to-secondary text-white"
                        >
                          {runAiAnalysis.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Brain className="h-4 w-4 mr-2" />
                          )}
                          KI-Analyse starten
                        </Button>
                      )}
                      <Button 
                        onClick={handleSaveAnalysis}
                        disabled={updateAnalysis.isPending}
                        className="bg-success hover:bg-success/90"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Speichern & Abschliessen
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="video">
                    <TabsList className="mb-6">
                      <TabsTrigger value="video">Video</TabsTrigger>
                      <TabsTrigger value="items">Inventar ({items.length})</TabsTrigger>
                      {selectedAnalysis.ai_summary && (
                        <TabsTrigger value="ai" className="gap-1">
                          <Sparkles className="h-3 w-3" />
                          KI-Analyse
                        </TabsTrigger>
                      )}
                      <TabsTrigger value="customer">Kunde</TabsTrigger>
                      <TabsTrigger value="result">Ergebnis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="video" className="space-y-4">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <video 
                          src={selectedAnalysis.video_url} 
                          controls 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <a 
                          href={selectedAnalysis.video_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" className="w-full gap-2">
                            <Eye className="h-4 w-4" />
                            In neuem Tab öffnen
                          </Button>
                        </a>
                        <a 
                          href={selectedAnalysis.video_url} 
                          download
                        >
                          <Button variant="outline" className="w-full gap-2">
                            <Download className="h-4 w-4" />
                            Herunterladen
                          </Button>
                        </a>
                      </div>
                      
                      {/* AI Analysis Info */}
                      {selectedAnalysis.ai_analyzed_at && (
                        <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            KI-analysiert am {format(new Date(selectedAnalysis.ai_analyzed_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                            {selectedAnalysis.confidence_score && (
                              <Badge className="ml-2 bg-primary/20 text-primary">
                                {Math.round(selectedAnalysis.confidence_score * 100)}% Konfidenz
                              </Badge>
                            )}
                          </span>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="items" className="space-y-4">
                      {/* Quick Add Presets */}
                      <div>
                        <Label className="mb-2 block">Schnell hinzufügen:</Label>
                        <div className="flex flex-wrap gap-2">
                          {COMMON_ITEMS.slice(0, 8).map((preset) => (
                            <Button
                              key={preset.name}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickAddItem(preset)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {preset.name}
                            </Button>
                          ))}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowAddItemDialog(true)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Eigenes Item
                          </Button>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {items.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Noch keine Items hinzugefügt</p>
                          </div>
                        ) : (
                          items.map((item, index) => (
                            <div key={item.id || index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{item.name} {item.quantity > 1 && `(${item.quantity}x)`}</p>
                                  {item.ai_detected && (
                                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                                      <Sparkles className="h-2.5 w-2.5 mr-1" />
                                      KI {item.ai_confidence ? `${Math.round(item.ai_confidence * 100)}%` : ''}
                                    </Badge>
                                  )}
                                  {item.manually_verified && (
                                    <Badge variant="outline" className="text-xs text-success border-success/30">
                                      <CheckCircle className="h-2.5 w-2.5 mr-1" />
                                      Geprüft
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {item.weight_kg}kg • {item.volume_m3}m³ • {item.room_name || 'Kein Raum'}
                                </p>
                              </div>
                              <Badge variant="outline">{ITEM_CATEGORIES.find(c => c.value === item.category)?.label}</Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => item.id && deleteItem.mutate(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Totals */}
                      {items.length > 0 && (
                        <Card className="bg-primary/5 border-primary/20">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-4 gap-4 text-center">
                              <div>
                                <p className="text-2xl font-bold">{calculateTotals().totalVolume.toFixed(1)}</p>
                                <p className="text-sm text-muted-foreground">m³ Volumen</p>
                              </div>
                              <div>
                                <p className="text-2xl font-bold">{calculateTotals().totalWeight.toFixed(0)}</p>
                                <p className="text-sm text-muted-foreground">kg Gewicht</p>
                              </div>
                              <div>
                                <p className="text-2xl font-bold">{items.length}</p>
                                <p className="text-sm text-muted-foreground">Items</p>
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-secondary">
                                  CHF {calculateTotals().priceMin} - {calculateTotals().priceMax}
                                </p>
                                <p className="text-sm text-muted-foreground">Preisspanne</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="customer" className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">E-Mail</p>
                            <p className="font-medium">{selectedAnalysis.user_email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{selectedAnalysis.user_name || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Telefon</p>
                            <p className="font-medium">{selectedAnalysis.user_phone || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Route</p>
                            <p className="font-medium">
                              {selectedAnalysis.from_city && selectedAnalysis.to_city 
                                ? `${selectedAnalysis.from_city} → ${selectedAnalysis.to_city}`
                                : '-'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Notizen für Review</Label>
                        <Textarea
                          placeholder="Interne Notizen zur Analyse..."
                          value={selectedAnalysis.reviewer_notes || ''}
                          onChange={(e) => setSelectedAnalysis({
                            ...selectedAnalysis,
                            reviewer_notes: e.target.value
                          })}
                          rows={4}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="result" className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Geschätztes Volumen (m³)</Label>
                          <Input
                            type="number"
                            value={selectedAnalysis.total_volume_m3 || ''}
                            onChange={(e) => setSelectedAnalysis({
                              ...selectedAnalysis,
                              total_volume_m3: parseFloat(e.target.value)
                            })}
                          />
                        </div>
                        <div>
                          <Label>Geschätztes Gewicht (kg)</Label>
                          <Input
                            type="number"
                            value={selectedAnalysis.total_weight_kg || ''}
                            onChange={(e) => setSelectedAnalysis({
                              ...selectedAnalysis,
                              total_weight_kg: parseFloat(e.target.value)
                            })}
                          />
                        </div>
                        <div>
                          <Label>Preis Min (CHF)</Label>
                          <Input
                            type="number"
                            value={selectedAnalysis.price_min || ''}
                            onChange={(e) => setSelectedAnalysis({
                              ...selectedAnalysis,
                              price_min: parseFloat(e.target.value)
                            })}
                          />
                        </div>
                        <div>
                          <Label>Preis Max (CHF)</Label>
                          <Input
                            type="number"
                            value={selectedAnalysis.price_max || ''}
                            onChange={(e) => setSelectedAnalysis({
                              ...selectedAnalysis,
                              price_max: parseFloat(e.target.value)
                            })}
                          />
                        </div>
                      </div>
                      
                      {/* Convert to Lead */}
                      {selectedAnalysis.status === 'analyzed' && !selectedAnalysis.converted_to_lead && (
                        <Card className="mt-6 border-primary/30 bg-primary/5">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">In Lead umwandeln</h4>
                                <p className="text-sm text-muted-foreground">
                                  Die Analyse ist abgeschlossen. Jetzt als Lead speichern.
                                </p>
                              </div>
                              <Button 
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => convertToLead.mutate(selectedAnalysis)}
                                disabled={convertToLead.isPending}
                              >
                                {convertToLead.isPending ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Als Lead speichern
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {selectedAnalysis.converted_to_lead && (
                        <Badge variant="outline" className="mt-4 text-success border-success/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Bereits als Lead gespeichert
                        </Badge>
                      )}
                    </TabsContent>
                    
                    {/* AI Summary Tab */}
                    {selectedAnalysis.ai_summary && (
                      <TabsContent value="ai" className="space-y-4">
                        <Card className="border-primary/20">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Brain className="h-5 w-5 text-primary" />
                              KI-Zusammenfassung
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="prose prose-sm max-w-none text-foreground">
                              <p className="whitespace-pre-wrap">{selectedAnalysis.ai_summary}</p>
                            </div>
                            
                            {selectedAnalysis.confidence_score && (
                              <div className="mt-4 pt-4 border-t flex items-center gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Konfidenz</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${selectedAnalysis.confidence_score * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium">
                                      {Math.round(selectedAnalysis.confidence_score * 100)}%
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Analysiert am</p>
                                  <p className="text-sm font-medium">
                                    {selectedAnalysis.ai_analyzed_at 
                                      ? format(new Date(selectedAnalysis.ai_analyzed_at), 'dd.MM.yyyy HH:mm', { locale: de })
                                      : '-'
                                    }
                                  </p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[500px]">
                <div className="text-center p-8">
                  <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Kein Video ausgewählt</h3>
                  <p className="text-muted-foreground">
                    Wählen Sie ein Video aus der Liste zur Analyse
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Item hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Bezeichnung</Label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="z.B. Doppelbett"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kategorie</Label>
                <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEM_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Anzahl</Label>
                <Input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                  min={1}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gewicht (kg)</Label>
                <Input
                  type="number"
                  value={newItem.weight_kg}
                  onChange={(e) => setNewItem({ ...newItem, weight_kg: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Volumen (m³)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={newItem.volume_m3}
                  onChange={(e) => setNewItem({ ...newItem, volume_m3: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Raum</Label>
              <Input
                value={newItem.room_name}
                onChange={(e) => setNewItem({ ...newItem, room_name: e.target.value })}
                placeholder="z.B. Schlafzimmer"
              />
            </div>
            <Button 
              onClick={() => addItem.mutate(newItem)} 
              disabled={!newItem.name || addItem.isPending}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Item hinzufügen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
