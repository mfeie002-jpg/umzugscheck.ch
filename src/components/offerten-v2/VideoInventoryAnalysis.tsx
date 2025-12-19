/**
 * VideoInventoryAnalysis - Video-Upload für automatische Inventarerfassung
 * 
 * Features:
 * - Video-Upload oder Kamera-Aufnahme (mobil)
 * - Edge-Function Analyse mit Lovable AI
 * - Auto-Fill der Inventarliste
 * - Volle Editierbarkeit der Ergebnisse
 * - Datenschutz-Hinweis
 */

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Video,
  Upload,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Trash2,
  Edit3,
  Package,
  Sofa,
  Bed,
  Monitor,
  Archive,
  Armchair,
  Lamp,
  BookOpen,
  Utensils,
  Shield,
  Sparkles,
  Info,
  X,
  RefreshCw
} from "lucide-react";

// Item interface for inventory
export interface InventoryItem {
  id: string;
  category: string;
  quantity: number;
  icon: string;
  volume_per_item: number;
}

// Analysis result from API
interface AnalysisResult {
  id: string;
  volume_m3: number;
  estimated_effort_min: number;
  confidence: number;
  rooms_detected?: string[];
  items: InventoryItem[];
  special_items?: string[];
  difficulty_notes?: string;
  note?: string;
}

// Props for the component
interface VideoInventoryAnalysisProps {
  onInventoryChange: (items: InventoryItem[], volumeM3: number, effortMin: number) => void;
  initialItems?: InventoryItem[];
}

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  sofa: <Sofa className="w-4 h-4" />,
  bed: <Bed className="w-4 h-4" />,
  wardrobe: <Archive className="w-4 h-4" />,
  table: <Utensils className="w-4 h-4" />,
  chair: <Armchair className="w-4 h-4" />,
  armchair: <Armchair className="w-4 h-4" />,
  tv: <Monitor className="w-4 h-4" />,
  bookshelf: <BookOpen className="w-4 h-4" />,
  dresser: <Archive className="w-4 h-4" />,
  box: <Package className="w-4 h-4" />,
  lamp: <Lamp className="w-4 h-4" />,
  plant: <Sparkles className="w-4 h-4" />,
  fridge: <Archive className="w-4 h-4" />,
  washer: <Archive className="w-4 h-4" />,
  default: <Package className="w-4 h-4" />
};

const getIcon = (iconName: string) => iconMap[iconName] || iconMap.default;

// Max file size (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export function VideoInventoryAnalysis({ 
  onInventoryChange, 
  initialItems = [] 
}: VideoInventoryAnalysisProps) {
  const [activeTab, setActiveTab] = useState<"manual" | "video">("video");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [volumeM3, setVolumeM3] = useState(0);
  const [effortMin, setEffortMin] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customItemName, setCustomItemName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Calculate totals from items
  const calculateTotals = useCallback((itemList: InventoryItem[]) => {
    const totalVolume = itemList.reduce(
      (sum, item) => sum + item.quantity * item.volume_per_item, 
      0
    );
    const totalItems = itemList.reduce((sum, item) => sum + item.quantity, 0);
    // Rough estimate: 2 min per m³ + base time
    const estimatedEffort = Math.round(totalVolume * 8 + 60);
    return { totalVolume, totalItems, estimatedEffort };
  }, []);

  // Update parent when items change
  const updateInventory = useCallback((newItems: InventoryItem[]) => {
    setItems(newItems);
    const { totalVolume, estimatedEffort } = calculateTotals(newItems);
    setVolumeM3(totalVolume);
    setEffortMin(estimatedEffort);
    onInventoryChange(newItems, totalVolume, estimatedEffort);
  }, [calculateTotals, onInventoryChange]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("Das Video ist zu gross (max. 50MB). Bitte kürzen Sie das Video.");
      toast({
        title: "Datei zu gross",
        description: "Bitte wählen Sie ein Video unter 50MB.",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("video/") && !file.type.startsWith("image/")) {
      setError("Bitte wählen Sie ein Video oder Bild.");
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  // Analyze video with Edge Function
  const analyzeVideo = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(selectedFile);
      const base64 = await base64Promise;

      // Call Edge Function
      const { data, error: funcError } = await supabase.functions.invoke('analyze-moving-video', {
        body: { video: base64 }
      });

      if (funcError) throw funcError;

      if (!data?.success) {
        throw new Error(data?.error || 'Analyse fehlgeschlagen');
      }

      const result = data.data as AnalysisResult;
      setAnalysisResult(result);

      // Map items with IDs
      const mappedItems: InventoryItem[] = result.items.map((item, idx) => ({
        ...item,
        id: `ai-${idx}-${Date.now()}`
      }));

      // Update state
      updateInventory(mappedItems);
      setVolumeM3(result.volume_m3);
      setEffortMin(result.estimated_effort_min);

      toast({
        title: "Analyse erfolgreich",
        description: `${mappedItems.length} Gegenstände erkannt, ~${result.volume_m3.toFixed(1)} m³`,
      });

    } catch (err: any) {
      console.error('Video analysis error:', err);
      const message = err.message || 'Analyse fehlgeschlagen';
      setError(message);
      toast({
        title: "Analyse fehlgeschlagen",
        description: "Bitte füllen Sie die Liste manuell aus oder versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Item quantity handlers
  const updateQuantity = (id: string, delta: number) => {
    const newItems = items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0 || !item.id.startsWith('ai-'));
    updateInventory(newItems);
  };

  const removeItem = (id: string) => {
    updateInventory(items.filter(item => item.id !== id));
  };

  const addCustomItem = () => {
    if (!customItemName.trim()) return;
    const newItem: InventoryItem = {
      id: `custom-${Date.now()}`,
      category: customItemName,
      quantity: 1,
      icon: "box",
      volume_per_item: 0.5
    };
    updateInventory([...items, newItem]);
    setCustomItemName("");
  };

  // Reset analysis
  const resetAnalysis = () => {
    setAnalysisResult(null);
    setSelectedFile(null);
    setItems([]);
    setVolumeM3(0);
    setEffortMin(0);
    onInventoryChange([], 0, 0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4">
      {/* Tab Selection */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "manual" | "video")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="video" className="gap-2">
            <Video className="w-4 h-4" />
            Video-Analyse
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-2">
            <Edit3 className="w-4 h-4" />
            Manuell eingeben
          </TabsTrigger>
        </TabsList>

        {/* Video Analysis Tab */}
        <TabsContent value="video" className="space-y-4 mt-4">
          {/* Upload Area */}
          {!analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Main Upload Button */}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    selectedFile 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  {selectedFile ? (
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Camera className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-medium text-foreground mb-1">
                        📹 Video-Rundgang hochladen
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Filmen Sie Ihre Wohnung für automatische Inventarerkennung
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Analyze Button */}
              {selectedFile && (
                <Button
                  onClick={analyzeVideo}
                  disabled={isAnalyzing}
                  className="w-full h-12 gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Video wird analysiert...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Inventar automatisch erkennen
                    </>
                  )}
                </Button>
              )}

              {/* Loading Skeleton */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg animate-pulse">
                      <div className="w-10 h-10 rounded-lg bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg animate-pulse">
                      <div className="w-10 h-10 rounded-lg bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-2/5" />
                        <div className="h-3 bg-muted rounded w-1/3" />
                      </div>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      Analysiere Räume und zähle Gegenstände...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Privacy Notice */}
              <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  📋 Ihr Video wird nur zur Analyse verwendet und anschließend sofort gelöscht. 
                  Keine Speicherung, kein Weitergabe.
                </span>
              </div>

              {/* Info Tooltip */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Film deine Wohnung, und unser System erkennt automatisch dein Umzugsinventar. 
                  Du sparst Zeit und erhältst präzisere Offerten.
                </span>
              </div>
            </motion.div>
          )}

          {/* Analysis Results */}
          <AnimatePresence>
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Success Banner */}
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Video analysiert</p>
                      <p className="text-sm text-green-700">
                        ~{volumeM3.toFixed(1)} m³ • {totalItems} Gegenstände erkannt
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetAnalysis}
                    className="text-green-700 hover:text-green-800 hover:bg-green-100"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Neu
                  </Button>
                </div>

                {/* Rooms Detected */}
                {analysisResult.rooms_detected && analysisResult.rooms_detected.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.rooms_detected.map((room, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {room}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Special Items Warning */}
                {analysisResult.special_items && analysisResult.special_items.length > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Spezielle Gegenstände erkannt:</strong>{" "}
                      {analysisResult.special_items.join(", ")}
                    </div>
                  </div>
                )}

                {/* Editable Item List */}
                <InventoryList 
                  items={items}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                  customItemName={customItemName}
                  onCustomItemNameChange={setCustomItemName}
                  onAddCustomItem={addCustomItem}
                />

                {/* Summary */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-muted/50 rounded-lg text-center">
                  <div>
                    <div className="text-xl font-bold text-primary">{totalItems}</div>
                    <div className="text-xs text-muted-foreground">Gegenstände</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">{volumeM3.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">m³ Volumen</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">
                      {Math.floor(effortMin / 60)}h {effortMin % 60}min
                    </div>
                    <div className="text-xs text-muted-foreground">Zeitaufwand</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Manual Input Tab */}
        <TabsContent value="manual" className="space-y-4 mt-4">
          <InventoryList 
            items={items}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            customItemName={customItemName}
            onCustomItemNameChange={setCustomItemName}
            onAddCustomItem={addCustomItem}
            showDefaults={items.length === 0}
          />

          {/* Summary for Manual */}
          {items.length > 0 && (
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg text-center">
              <div>
                <div className="text-xl font-bold text-primary">{totalItems}</div>
                <div className="text-xs text-muted-foreground">Gegenstände</div>
              </div>
              <div>
                <div className="text-xl font-bold text-primary">{volumeM3.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">m³ Volumen</div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Separate Inventory List component for reuse
interface InventoryListProps {
  items: InventoryItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  customItemName: string;
  onCustomItemNameChange: (name: string) => void;
  onAddCustomItem: () => void;
  showDefaults?: boolean;
}

function InventoryList({
  items,
  onUpdateQuantity,
  onRemoveItem,
  customItemName,
  onCustomItemNameChange,
  onAddCustomItem,
  showDefaults = false
}: InventoryListProps) {
  // Default items for manual entry
  const defaultItems: Omit<InventoryItem, "id">[] = [
    { category: "Sofa", quantity: 0, icon: "sofa", volume_per_item: 1.5 },
    { category: "Bett", quantity: 0, icon: "bed", volume_per_item: 2.0 },
    { category: "Kleiderschrank", quantity: 0, icon: "wardrobe", volume_per_item: 2.5 },
    { category: "Esstisch", quantity: 0, icon: "table", volume_per_item: 1.2 },
    { category: "Stühle", quantity: 0, icon: "chair", volume_per_item: 0.3 },
    { category: "Sessel", quantity: 0, icon: "armchair", volume_per_item: 0.8 },
    { category: "TV/Monitor", quantity: 0, icon: "tv", volume_per_item: 0.3 },
    { category: "Bücherregal", quantity: 0, icon: "bookshelf", volume_per_item: 0.8 },
    { category: "Umzugskartons", quantity: 0, icon: "box", volume_per_item: 0.06 },
  ];

  const displayItems = showDefaults && items.length === 0 
    ? defaultItems.map((item, idx) => ({ ...item, id: `default-${idx}` }))
    : items;

  return (
    <div className="space-y-3">
      {/* Add Custom Item */}
      <div className="flex gap-2">
        <Input
          placeholder="Eigenen Artikel hinzufügen..."
          value={customItemName}
          onChange={(e) => onCustomItemNameChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onAddCustomItem()}
          className="flex-1"
        />
        <Button onClick={onAddCustomItem} size="icon" variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Items List */}
      <ScrollArea className="h-[250px]">
        <div className="space-y-2 pr-4">
          {displayItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                item.quantity > 0
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/50 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.quantity > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {getIcon(item.icon)}
                </div>
                <div>
                  <span className="font-medium text-sm">{item.category}</span>
                  <div className="text-xs text-muted-foreground">
                    ~{item.volume_per_item} m³/Stk
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  disabled={item.quantity === 0}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-6 text-center font-medium text-sm">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
                {item.id.startsWith('custom-') || item.id.startsWith('ai-') ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default VideoInventoryAnalysis;
