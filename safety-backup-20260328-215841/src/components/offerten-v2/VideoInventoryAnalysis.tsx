/**
 * VideoInventoryAnalysis - Frame-basierte KI-Inventarerfassung
 * 
 * Upgraded version: extracts frames client-side, sends to analyze-inventory-frames Edge Function.
 * Supports serviceType: umzug | raeumung | entsorgung | firmenumzug
 * 
 * Persists results to video_surveys table incl. GCLID attribution.
 */

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { generateWhatsAppLink } from "@/utils/whatsapp";
import { extractVideoFrames } from "@/utils/extractVideoFrames";
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
  RefreshCw,
  Phone,
  MessageCircle,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Truck,
  Users,
  Weight,
  Trash,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ServiceType = "umzug" | "raeumung" | "entsorgung" | "firmenumzug";

export interface InventoryItem {
  id: string;
  category: string;
  quantity: number;
  icon: string;
  volume_per_item: number;
}

interface BulkyItem {
  item: string;
  count: number;
  notes: string | null;
}

interface DisposalBreakdown {
  sperrgut_m3: number;
  elektroschrott_stueck: number;
  sondermuell_kg: number;
  normalabfall_m3: number;
  wertgegenstaende: string[];
}

interface RecommendedTeam {
  people: number;
  hours: number;
  vehicles: number | null;
  lift_needed: boolean | null;
}

interface PriceRange {
  low: number;
  high: number;
  rationale: string;
}

export interface FrameAnalysisResult {
  serviceType: ServiceType;
  estimated_volume_m3: number;
  estimated_weight_kg: number | null;
  bulky_items: BulkyItem[];
  disposal_breakdown: DisposalBreakdown | null;
  recommended_team: RecommendedTeam;
  price_range_chf: PriceRange;
  confidence: number;
  followup_questions: string[];
  red_flags: string[];
  assumptions: string[];
}

interface VideoInventoryAnalysisProps {
  onInventoryChange: (items: InventoryItem[], volumeM3: number, effortMin: number) => void;
  initialItems?: InventoryItem[];
  serviceType?: ServiceType;
  whatsappPhone?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

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
  default: <Package className="w-4 h-4" />,
};
const getIcon = (iconName: string) => iconMap[iconName] || iconMap.default;

const SERVICE_LABELS: Record<ServiceType, string> = {
  umzug: "Umzug",
  raeumung: "Räumung",
  entsorgung: "Entsorgung",
  firmenumzug: "Firmenumzug",
};

function getUrlParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const keys = ["gclid", "gbraid", "wbraid", "fbclid"];
  const result: Record<string, string> = {};
  for (const key of keys) {
    const val = params.get(key);
    if (val) result[key] = val;
  }
  return result;
}

function confidenceColor(c: number) {
  if (c >= 0.7) return "text-green-700 bg-green-100 border-green-200";
  if (c >= 0.4) return "text-amber-700 bg-amber-100 border-amber-200";
  return "text-red-700 bg-red-100 border-red-200";
}

function confidenceLabel(c: number) {
  if (c >= 0.7) return "Hohe Konfidenz";
  if (c >= 0.4) return "Mittlere Konfidenz";
  return "Niedrige Konfidenz";
}

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function VideoInventoryAnalysis({
  onInventoryChange,
  initialItems = [],
  serviceType: propServiceType = "umzug",
  whatsappPhone,
}: VideoInventoryAnalysisProps) {
  const [activeTab, setActiveTab] = useState<"video" | "manual">("video");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FrameAnalysisResult | null>(null);
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [volumeM3, setVolumeM3] = useState(0);
  const [effortMin, setEffortMin] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customItemName, setCustomItemName] = useState("");
  const [frameProgress, setFrameProgress] = useState<{ current: number; total: number } | null>(null);
  const [analysisStep, setAnalysisStep] = useState<"idle" | "extracting" | "analyzing" | "done">("idle");
  const [showFollowup, setShowFollowup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // ── Inventory helpers ──
  const calculateTotals = useCallback((itemList: InventoryItem[]) => {
    const totalVolume = itemList.reduce((sum, i) => sum + i.quantity * i.volume_per_item, 0);
    const estimatedEffort = Math.round(totalVolume * 8 + 60);
    return { totalVolume, estimatedEffort };
  }, []);

  const updateInventory = useCallback(
    (newItems: InventoryItem[]) => {
      setItems(newItems);
      const { totalVolume, estimatedEffort } = calculateTotals(newItems);
      setVolumeM3(totalVolume);
      setEffortMin(estimatedEffort);
      onInventoryChange(newItems, totalVolume, estimatedEffort);
    },
    [calculateTotals, onInventoryChange]
  );

  // ── File handling ──
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError("Das Video ist zu gross (max. 200 MB). Bitte kürzen Sie das Video.");
      return;
    }
    if (!file.type.startsWith("video/")) {
      setError("Bitte wählen Sie eine Videodatei.");
      return;
    }
    setSelectedFile(file);
    setError(null);
    setAnalysisResult(null);
  };

  // ── Main analysis flow ──
  const analyzeVideo = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setError(null);
    setFrameProgress(null);
    setAnalysisStep("extracting");

    try {
      // Step 1: Extract frames
      const frames = await extractVideoFrames(selectedFile, {
        targetFrames: 10,
        maxWidth: 1024,
        quality: 0.75,
        onProgress: (current, total) => setFrameProgress({ current, total }),
      });

      setFrameProgress(null);
      setAnalysisStep("analyzing");

      // Step 2: Call Edge Function
      const { data, error: funcError } = await supabase.functions.invoke(
        "analyze-inventory-frames",
        {
          body: {
            frames,
            serviceType: propServiceType,
          },
        }
      );

      if (funcError) throw funcError;
      if (!data?.success) throw new Error(data?.error || "Analyse fehlgeschlagen");

      const result = data.data as FrameAnalysisResult;
      setAnalysisResult(result);
      setAnalysisStep("done");

      // Map bulky_items to InventoryItem format for legacy compatibility
      const mappedItems: InventoryItem[] = result.bulky_items.map((b, idx) => ({
        id: `ai-${idx}-${Date.now()}`,
        category: b.item,
        quantity: b.count,
        icon: "box",
        volume_per_item: result.estimated_volume_m3 / Math.max(1, result.bulky_items.reduce((s, x) => s + x.count, 0)),
      }));
      updateInventory(mappedItems);
      setVolumeM3(result.estimated_volume_m3);
      setEffortMin(result.recommended_team.hours * 60);

      // Persist to video_surveys
      const urlParams = getUrlParams();
      await supabase.from("video_surveys").insert({
        service_type: result.serviceType,
        frames_count: frames.length,
        analysis_json: result as any,
        confidence: result.confidence,
        landing_path: typeof window !== "undefined" ? window.location.pathname : null,
        status: "completed",
        ...urlParams,
      });

      toast({
        title: "Analyse erfolgreich ✓",
        description: `${result.estimated_volume_m3.toFixed(1)} m³ • CHF ${result.price_range_chf.low.toLocaleString("de-CH")}–${result.price_range_chf.high.toLocaleString("de-CH")}`,
      });
    } catch (err: any) {
      console.error("Video analysis error:", err);
      const msg = err.message?.includes("RATE_LIMIT")
        ? "Zu viele Anfragen. Bitte warten Sie eine Stunde."
        : err.message?.includes("AI_CREDITS")
        ? "KI-Service vorübergehend nicht verfügbar."
        : err.message || "Analyse fehlgeschlagen";
      setError(msg);
      setAnalysisStep("idle");
      toast({
        title: "Analyse fehlgeschlagen",
        description: "Bitte manuell ausfüllen oder erneut versuchen.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Item management ──
  const updateQuantity = (id: string, delta: number) => {
    const newItems = items
      .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
      .filter((i) => i.quantity > 0 || !i.id.startsWith("ai-"));
    updateInventory(newItems);
  };

  const removeItem = (id: string) => updateInventory(items.filter((i) => i.id !== id));

  const addCustomItem = () => {
    if (!customItemName.trim()) return;
    updateInventory([
      ...items,
      { id: `custom-${Date.now()}`, category: customItemName, quantity: 1, icon: "box", volume_per_item: 0.5 },
    ]);
    setCustomItemName("");
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setSelectedFile(null);
    setItems([]);
    setVolumeM3(0);
    setEffortMin(0);
    setAnalysisStep("idle");
    setFrameProgress(null);
    onInventoryChange([], 0, 0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  // ── CTA helpers ──
  const whatsappLink = generateWhatsAppLink({
    phone: whatsappPhone,
    service: SERVICE_LABELS[propServiceType],
  });

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "video" | "manual")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="video" className="gap-2">
            <Video className="w-4 h-4" />
            KI Video-Analyse
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-2">
            <Edit3 className="w-4 h-4" />
            Manuell eingeben
          </TabsTrigger>
        </TabsList>

        {/* ── Video Tab ── */}
        <TabsContent value="video" className="space-y-4 mt-4">
          <AnimatePresence mode="wait">
            {/* Upload state */}
            {!analysisResult && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Upload area */}
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
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
                        <p className="font-medium text-foreground mb-1">📹 Video-Rundgang hochladen</p>
                        <p className="text-sm text-muted-foreground">
                          Filmen Sie Ihre {propServiceType === "umzug" || propServiceType === "firmenumzug" ? "Räumlichkeiten" : "zu räumenden Räume"} für eine KI-Analyse
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">max. 200 MB · MP4, MOV, AVI</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* Error */}
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

                {/* Analyze button */}
                {selectedFile && (
                  <Button onClick={analyzeVideo} disabled={isAnalyzing} className="w-full h-12 gap-2">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {analysisStep === "extracting"
                          ? frameProgress
                            ? `Frames extrahieren ${frameProgress.current}/${frameProgress.total}...`
                            : "Frames extrahieren..."
                          : "KI analysiert Frames..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Inventar automatisch erkennen
                      </>
                    )}
                  </Button>
                )}

                {/* Progress bar */}
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {/* Step indicators */}
                      <div className="flex items-center gap-3 text-sm">
                        <div className={`flex items-center gap-1.5 ${analysisStep === "extracting" ? "text-primary font-medium" : analysisStep === "analyzing" || analysisStep === "done" ? "text-muted-foreground line-through" : "text-muted-foreground"}`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${analysisStep === "extracting" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>1</div>
                          Frames extrahieren
                        </div>
                        <div className="flex-1 h-px bg-border" />
                        <div className={`flex items-center gap-1.5 ${analysisStep === "analyzing" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${analysisStep === "analyzing" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>2</div>
                          KI analysiert
                        </div>
                      </div>

                      {frameProgress && analysisStep === "extracting" && (
                        <div className="space-y-1">
                          <Progress value={(frameProgress.current / frameProgress.total) * 100} className="h-2" />
                          <p className="text-xs text-muted-foreground text-center">
                            Frame {frameProgress.current} von {frameProgress.total}
                          </p>
                        </div>
                      )}

                      {analysisStep === "analyzing" && (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg animate-pulse">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <p className="text-sm text-muted-foreground">KI analysiert die extrahierten Frames...</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Privacy & info */}
                <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Nur einzelne Frames (keine ganzen Videos) werden analysiert. Ihr Video verlässt nie Ihr Gerät komplett.
                  </span>
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Filmen Sie einen langsamen Rundgang durch alle Räume. Die KI erkennt automatisch{" "}
                    {propServiceType === "raeumung" || propServiceType === "entsorgung"
                      ? "Entsorgungsgut und schätzt Räumungskosten"
                      : "Möbel und schätzt Umzugskosten"}.
                  </span>
                </div>
              </motion.div>
            )}

            {/* Analysis Result */}
            {analysisResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">KI-Analyse abgeschlossen</p>
                      <p className="text-sm text-green-700">
                        {SERVICE_LABELS[analysisResult.serviceType]} · {totalItems} Objekte erkannt
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetAnalysis} className="text-green-700 hover:bg-green-100">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Neu
                  </Button>
                </div>

                {/* Confidence badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${confidenceColor(analysisResult.confidence)}`}>
                  <div className="w-2 h-2 rounded-full bg-current opacity-70" />
                  {confidenceLabel(analysisResult.confidence)} · {Math.round(analysisResult.confidence * 100)}%
                </div>

                {/* Price range – prominent */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Geschätzte Kosten (CHF)</p>
                    <div className="text-3xl font-bold text-primary">
                      {analysisResult.price_range_chf.low.toLocaleString("de-CH")} – {analysisResult.price_range_chf.high.toLocaleString("de-CH")}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{analysisResult.price_range_chf.rationale}</p>
                  </CardContent>
                </Card>

                {/* Key metrics grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Volumen</span>
                    </div>
                    <div className="text-xl font-bold">{analysisResult.estimated_volume_m3.toFixed(1)} m³</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Team</span>
                    </div>
                    <div className="text-xl font-bold">{analysisResult.recommended_team.people} Pers. · {analysisResult.recommended_team.hours}h</div>
                  </div>
                  {analysisResult.recommended_team.vehicles && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Fahrzeuge</span>
                      </div>
                      <div className="text-xl font-bold">{analysisResult.recommended_team.vehicles}</div>
                    </div>
                  )}
                  {analysisResult.estimated_weight_kg && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Weight className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Gewicht</span>
                      </div>
                      <div className="text-xl font-bold">{(analysisResult.estimated_weight_kg / 1000).toFixed(1)} t</div>
                    </div>
                  )}
                </div>

                {/* Disposal breakdown (raeumung/entsorgung) */}
                {analysisResult.disposal_breakdown && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                      <Trash className="w-4 h-4" />
                      Entsorgungsaufschlüsselung
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {analysisResult.disposal_breakdown.sperrgut_m3 > 0 && (
                        <div className="flex justify-between">
                          <span className="text-amber-700">Sperrgut</span>
                          <span className="font-medium">{analysisResult.disposal_breakdown.sperrgut_m3} m³</span>
                        </div>
                      )}
                      {analysisResult.disposal_breakdown.elektroschrott_stueck > 0 && (
                        <div className="flex justify-between">
                          <span className="text-amber-700">Elektroschrott</span>
                          <span className="font-medium">{analysisResult.disposal_breakdown.elektroschrott_stueck} Stk.</span>
                        </div>
                      )}
                      {analysisResult.disposal_breakdown.sondermuell_kg > 0 && (
                        <div className="flex justify-between">
                          <span className="text-amber-700">Sondermüll</span>
                          <span className="font-medium">{analysisResult.disposal_breakdown.sondermuell_kg} kg</span>
                        </div>
                      )}
                      {analysisResult.disposal_breakdown.normalabfall_m3 > 0 && (
                        <div className="flex justify-between">
                          <span className="text-amber-700">Normalabfall</span>
                          <span className="font-medium">{analysisResult.disposal_breakdown.normalabfall_m3} m³</span>
                        </div>
                      )}
                    </div>
                    {analysisResult.disposal_breakdown.wertgegenstaende.length > 0 && (
                      <div className="text-xs text-amber-700">
                        <span className="font-medium">Wertgegenstände: </span>
                        {analysisResult.disposal_breakdown.wertgegenstaende.join(", ")}
                      </div>
                    )}
                  </div>
                )}

                {/* Bulky items */}
                {analysisResult.bulky_items.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Erkannte Objekte ({analysisResult.bulky_items.length})</p>
                    <ScrollArea className="h-[160px]">
                      <div className="space-y-1.5 pr-2">
                        {analysisResult.bulky_items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 bg-muted/40 rounded-lg text-sm">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-muted-foreground" />
                              <span>{item.item}</span>
                              {item.notes && <span className="text-xs text-muted-foreground">({item.notes})</span>}
                            </div>
                            <Badge variant="secondary" className="text-xs">{item.count}×</Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {/* Red flags */}
                {analysisResult.red_flags.length > 0 && (
                  <div className="space-y-2">
                    {analysisResult.red_flags.map((flag, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg text-sm text-destructive">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {flag}
                      </div>
                    ))}
                  </div>
                )}

                {/* Follow-up questions */}
                {analysisResult.followup_questions.length > 0 && (
                  <div>
                    <button
                      onClick={() => setShowFollowup(!showFollowup)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left py-1"
                    >
                      {showFollowup ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {analysisResult.followup_questions.length} Rückfragen der KI
                    </button>
                    <AnimatePresence>
                      {showFollowup && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-2 pt-2">
                            {analysisResult.followup_questions.map((q, idx) => (
                              <div key={idx} className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                {q}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Dual CTA */}
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors text-sm"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Remote Offerte fixieren (WhatsApp)
                  </a>
                  <Button
                    variant="outline"
                    className="w-full h-12 gap-2"
                    onClick={() => {
                      const el = document.getElementById("offerte-form") || document.getElementById("contact-form");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Calendar className="w-5 h-5" />
                    Vor-Ort Besichtigung buchen
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* ── Manual Tab ── */}
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

// ─────────────────────────────────────────────────────────────────────────────
// Inventory List subcomponent
// ─────────────────────────────────────────────────────────────────────────────

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
  showDefaults = false,
}: InventoryListProps) {
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

  const displayItems =
    showDefaults && items.length === 0
      ? defaultItems.map((item, idx) => ({ ...item, id: `default-${idx}` }))
      : items;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Eigenen Artikel hinzufügen..."
          value={customItemName}
          onChange={(e) => onCustomItemNameChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onAddCustomItem()}
          className="flex-1"
        />
        <Button onClick={onAddCustomItem} size="icon" variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="h-[250px]">
        <div className="space-y-2 pr-4">
          {displayItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                item.quantity > 0 ? "border-primary/30 bg-primary/5" : "border-border/50 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.quantity > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {getIcon(item.icon)}
                </div>
                <div>
                  <span className="font-medium text-sm">{item.category}</span>
                  <div className="text-xs text-muted-foreground">~{item.volume_per_item} m³/Stk</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => onUpdateQuantity(item.id, -1)} disabled={item.quantity === 0}>
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => onUpdateQuantity(item.id, 1)}>
                  <Plus className="w-3 h-3" />
                </Button>
                {(item.id.startsWith("custom-") || item.id.startsWith("ai-")) && (
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onRemoveItem(item.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default VideoInventoryAnalysis;
