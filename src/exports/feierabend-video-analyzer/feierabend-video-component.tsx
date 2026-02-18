/**
 * FeierabendVideoAnalysis – KI Video-Analyse für feierabendservices.ch
 * 
 * COPY TO: src/components/FeierabendVideoAnalysis.tsx
 * 
 * Fokus: Räumung, Haushaltsauflösung, Entsorgung, Firmenräumung
 * 
 * Abhängigkeiten:
 * - @/utils/extractVideoFrames (aus feierabend-extract-frames.ts)
 * - @/integrations/supabase/client
 * - framer-motion, lucide-react, shadcn/ui
 */

/*
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { extractVideoFrames } from "@/utils/extractVideoFrames";
import {
  Camera, Loader2, CheckCircle2, AlertCircle, Package, Shield, Sparkles,
  Info, RefreshCw, MessageCircle, Phone, Calendar, AlertTriangle,
  ChevronDown, ChevronUp, Truck, Users, Trash,
} from "lucide-react";

// ── Configuration ──
const DEFAULT_FEIERABEND_PHONE = "41XXXXXXXXX"; // ← Feierabend Nummer einsetzen

type ServiceType = "raeumung" | "entsorgung" | "firmenumzug" | "umzug";

interface FeierabendVideoAnalysisProps {
  defaultServiceType?: ServiceType;
  whatsappPhone?: string;
  bookingUrl?: string;
}

// ── Service Tabs ──
const SERVICE_TABS: { value: ServiceType; label: string; emoji: string }[] = [
  { value: "raeumung", label: "Räumung", emoji: "🏠" },
  { value: "entsorgung", label: "Entsorgung", emoji: "♻️" },
  { value: "firmenumzug", label: "Firmenräumung", emoji: "🏢" },
  { value: "umzug", label: "Umzug", emoji: "📦" },
];

// ── URL tracking params ──
function getUrlParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  for (const key of ["gclid", "gbraid", "wbraid", "fbclid"]) {
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

export default function FeierabendVideoAnalysis({
  defaultServiceType = "raeumung",
  whatsappPhone = DEFAULT_FEIERABEND_PHONE,
  bookingUrl = "/kontakt",
}: FeierabendVideoAnalysisProps) {
  const [serviceType, setServiceType] = useState<ServiceType>(defaultServiceType);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<"idle" | "extracting" | "analyzing" | "done">("idle");
  const [frameProgress, setFrameProgress] = useState<{ current: number; total: number } | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFollowup, setShowFollowup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 200 * 1024 * 1024) { setError("Video zu gross (max. 200 MB)"); return; }
    if (!file.type.startsWith("video/")) { setError("Bitte ein Video hochladen"); return; }
    setSelectedFile(file);
    setError(null);
    setResult(null);
  };

  const analyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setError(null);
    setAnalysisStep("extracting");

    try {
      const frames = await extractVideoFrames(selectedFile, {
        targetFrames: 10,
        maxWidth: 1024,
        quality: 0.75,
        onProgress: (current, total) => setFrameProgress({ current, total }),
      });

      setFrameProgress(null);
      setAnalysisStep("analyzing");

      const { data, error: funcError } = await supabase.functions.invoke("analyze-inventory-frames", {
        body: { frames, serviceType },
      });

      if (funcError) throw funcError;
      if (!data?.success) throw new Error(data?.error || "Analyse fehlgeschlagen");

      setResult(data.data);
      setAnalysisStep("done");

      // Persist to video_surveys
      const urlParams = getUrlParams();
      await supabase.from("video_surveys").insert({
        service_type: serviceType,
        frames_count: frames.length,
        analysis_json: data.data,
        confidence: data.data.confidence,
        landing_path: window.location.pathname,
        status: "completed",
        ...urlParams,
      });

      toast({ title: "Analyse abgeschlossen ✓" });
    } catch (err: any) {
      setError(err.message || "Analyse fehlgeschlagen");
      setAnalysisStep("idle");
      toast({ title: "Fehler", description: "Bitte erneut versuchen.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setSelectedFile(null);
    setAnalysisStep("idle");
    setFrameProgress(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const waLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    result
      ? `Guten Tag Feierabend Services,\n\nIch habe eine Video-Analyse durchgeführt:\nService: ${result.serviceType}\nVolumen: ${result.estimated_volume_m3} m³\nPreisrange: CHF ${result.price_range_chf?.low}–${result.price_range_chf?.high}\n\nIch möchte eine unverbindliche Offerte erhalten.`
      : `Guten Tag Feierabend Services,\n\nIch hätte gerne eine unverbindliche Offerte für eine ${SERVICE_TABS.find(t => t.value === serviceType)?.label || "Räumung"}.`
  )}`;

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      -- Service Type Selection --
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SERVICE_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => { setServiceType(tab.value); reset(); }}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
              serviceType === tab.value
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/40 text-muted-foreground"
            }`}
          >
            <span className="text-xl">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      -- Upload Area --
      {!result && (
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
            id="feierabend-video-upload"
          />
          <label
            htmlFor="feierabend-video-upload"
            className={`flex flex-col items-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
              selectedFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
            }`}
          >
            {selectedFile ? (
              <div className="text-center">
                <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-2" />
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="font-semibold text-lg mb-1">Video aufnehmen oder hochladen</p>
                <p className="text-sm text-muted-foreground">Filmen Sie einen Rundgang durch die zu räumenden Räume</p>
                <p className="text-xs text-muted-foreground mt-2">max. 200 MB · MP4, MOV</p>
              </div>
            )}
          </label>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {selectedFile && (
            <Button onClick={analyze} disabled={isAnalyzing} className="w-full h-12 text-base gap-2">
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {analysisStep === "extracting"
                    ? frameProgress ? `Frames ${frameProgress.current}/${frameProgress.total}...` : "Frames extrahieren..."
                    : "KI analysiert..."}
                </>
              ) : (
                <><Sparkles className="w-5 h-5" />Inventar KI-gestützt analysieren</>
              )}
            </Button>
          )}

          {isAnalyzing && frameProgress && (
            <div className="space-y-1">
              <Progress value={(frameProgress.current / frameProgress.total) * 100} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">Frame {frameProgress.current} von {frameProgress.total}</p>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Nur 10 Einzelbilder (keine Vollvideos) werden analysiert. Datenschutzkonform für CH/EU.</span>
          </div>
        </div>
      )}

      -- Result --
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">KI-Analyse abgeschlossen</p>
                <p className="text-sm text-green-700">{result.bulky_items?.length || 0} Objekte erkannt</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={reset} className="text-green-700 hover:bg-green-100">
              <RefreshCw className="w-4 h-4 mr-1" />Neu
            </Button>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${confidenceColor(result.confidence)}`}>
            <div className="w-2 h-2 rounded-full bg-current opacity-70" />
            Konfidenz: {Math.round(result.confidence * 100)}%
          </div>

          -- Price Card --
          <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl">
            <p className="text-xs text-muted-foreground mb-1">Geschätzte Kosten (CHF)</p>
            <div className="text-4xl font-bold text-primary">
              {result.price_range_chf?.low?.toLocaleString("de-CH")} – {result.price_range_chf?.high?.toLocaleString("de-CH")}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{result.price_range_chf?.rationale}</p>
          </div>

          -- Metrics --
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Volumen</p>
              <p className="text-xl font-bold">{result.estimated_volume_m3?.toFixed(1)} m³</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Team</p>
              <p className="text-xl font-bold">{result.recommended_team?.people} Pers. · {result.recommended_team?.hours}h</p>
            </div>
          </div>

          -- Red flags --
          {result.red_flags?.length > 0 && result.red_flags.map((flag: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg text-sm text-destructive">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {flag}
            </div>
          ))}

          -- CTAs --
          <div className="space-y-3 pt-2">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-base transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Jetzt Offerte anfordern (WhatsApp)
            </a>
            <a
              href={bookingUrl}
              className="flex items-center justify-center gap-2 w-full h-12 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl font-medium transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Vor-Ort Besichtigung buchen
            </a>
            <a
              href={`tel:+${whatsappPhone}`}
              className="flex items-center justify-center gap-2 w-full h-12 border border-border text-foreground hover:bg-muted rounded-xl font-medium transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              Direkt anrufen
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
*/

// NOTE: This is the reference file for feierabendservices.ch
// Remove the comment wrapper (/* ... */) when implementing in the target project.
// Ensure you have also added the required dependencies:
//   - framer-motion: npm install framer-motion
//   - lucide-react: npm install lucide-react
//   - shadcn/ui components (Button, Badge, Card, Progress, ScrollArea)
//   - @/utils/extractVideoFrames (copy feierabend-extract-frames.ts)
//   - @/integrations/supabase/client (auto-generated in Lovable projects)

export {};
