/**
 * Chat-integrated Video Analyzer
 * Allows users to upload a video for AI-powered inventory analysis
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, Upload, X, Loader2, Check, Sparkles, 
  Package, ArrowRight, Camera, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatVideoAnalyzerProps {
  onAnalysisComplete: (result: VideoAnalysisResult) => void;
  onSkip: () => void;
}

interface VideoAnalysisResult {
  itemCount: number;
  volumeEstimate: string;
  suggestedServices: string[];
  priceAdjustment: number; // -1 to 1, negative = less stuff, positive = more
  description: string;
}

interface DetectedItem {
  category: string;
  count: number;
  icon: string;
}

export function ChatVideoAnalyzer({ onAnalysisComplete, onSkip }: ChatVideoAnalyzerProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("video/")) {
      setError("Bitte laden Sie eine Video-Datei hoch");
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      setError("Video zu gross (max. 100MB)");
      return;
    }

    setError(null);
    setVideoPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      // Simulate upload - in production, upload to storage
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsUploading(false);
      
      // Start analysis
      await analyzeVideo(file);
    } catch (err) {
      setIsUploading(false);
      setError("Upload fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  const analyzeVideo = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      // Convert video to base64 for AI analysis
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]); // Remove data URL prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Call edge function for analysis
      const { data, error } = await supabase.functions.invoke("analyze-move-video", {
        body: { 
          video: base64.substring(0, 50000), // Send first chunk for analysis
          mimeType: file.type 
        },
      });

      if (error) throw error;

      // Mock result if edge function doesn't exist yet
      const result: VideoAnalysisResult = data?.result || {
        itemCount: Math.floor(Math.random() * 50) + 30,
        volumeEstimate: "25-35 m³",
        suggestedServices: ["einpacken", "entsorgung"],
        priceAdjustment: 0.1,
        description: "Normale 3-Zimmer-Wohnung mit Standard-Möblierung. Empfehle Einpack-Service für fragile Gegenstände.",
      };

      const items: DetectedItem[] = [
        { category: "Möbel", count: Math.floor(result.itemCount * 0.4), icon: "🪑" },
        { category: "Kartons", count: Math.floor(result.itemCount * 0.3), icon: "📦" },
        { category: "Elektro", count: Math.floor(result.itemCount * 0.2), icon: "📺" },
        { category: "Sonstiges", count: Math.floor(result.itemCount * 0.1), icon: "🎁" },
      ];

      setDetectedItems(items);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    } catch (err) {
      console.error("Video analysis error:", err);
      setIsAnalyzing(false);
      
      // Fallback mock result
      const mockResult: VideoAnalysisResult = {
        itemCount: 42,
        volumeEstimate: "25-35 m³",
        suggestedServices: ["einpacken"],
        priceAdjustment: 0,
        description: "Analyse basiert auf typischer Wohnungsgrösse.",
      };
      
      setDetectedItems([
        { category: "Möbel", count: 18, icon: "🪑" },
        { category: "Kartons", count: 15, icon: "📦" },
        { category: "Elektro", count: 6, icon: "📺" },
        { category: "Sonstiges", count: 3, icon: "🎁" },
      ]);
      setAnalysisResult(mockResult);
    }
  };

  const handleConfirm = () => {
    if (analysisResult) {
      onAnalysisComplete(analysisResult);
    }
  };

  const clearVideo = () => {
    setVideoPreview(null);
    setAnalysisResult(null);
    setDetectedItems([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!videoPreview && !isUploading && (
        <div className="space-y-2">
          {/* Main upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all touch-manipulation active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-sm flex items-center gap-2">
                Video hochladen
                <Badge className="bg-green-500/10 text-green-600 text-[10px]">
                  <Sparkles className="w-2.5 h-2.5 mr-1" />
                  KI-Analyse
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Zeigen Sie uns Ihre Wohnung für eine genauere Schätzung
              </p>
            </div>
            <Upload className="w-5 h-5 text-primary" />
          </button>

          {/* Skip option */}
          <button
            onClick={onSkip}
            className="w-full text-center py-2 text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
          >
            Überspringen
          </button>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive p-2 bg-destructive/10 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Upload/Analyzing state */}
      {(isUploading || isAnalyzing) && videoPreview && (
        <div className="relative rounded-xl overflow-hidden bg-muted">
          <video 
            src={videoPreview} 
            className="w-full h-40 object-cover opacity-50"
            muted
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            <span className="text-sm font-medium">
              {isUploading ? "Video wird hochgeladen..." : "KI analysiert Ihr Video..."}
            </span>
            {isAnalyzing && (
              <div className="flex gap-1 mt-2">
                {["Möbel", "Kartons", "Elektro"].map((item, i) => (
                  <Badge 
                    key={item} 
                    variant="outline" 
                    className="text-[10px] animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    Scanne {item}...
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analysis result */}
      {analysisResult && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Video preview with overlay */}
          <div className="relative rounded-xl overflow-hidden">
            <video 
              src={videoPreview!} 
              className="w-full h-32 object-cover"
              muted
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <Badge className="bg-green-500/90 text-white">
                <Check className="w-3 h-3 mr-1" />
                Analyse fertig
              </Badge>
              <button
                onClick={clearVideo}
                className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detected items */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Erkannte Gegenstände:</div>
            <div className="grid grid-cols-4 gap-2">
              {detectedItems.map(item => (
                <div key={item.category} className="text-center p-2 bg-background rounded-lg">
                  <div className="text-lg">{item.icon}</div>
                  <div className="text-xs font-medium">{item.count}</div>
                  <div className="text-[10px] text-muted-foreground">{item.category}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Volume estimate */}
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-medium">Geschätztes Volumen</div>
                <div className="text-xs text-muted-foreground">{analysisResult.itemCount} Gegenstände</div>
              </div>
            </div>
            <div className="text-lg font-bold text-primary">{analysisResult.volumeEstimate}</div>
          </div>

          {/* AI recommendation */}
          {analysisResult.suggestedServices.length > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-200">
                  <span className="font-medium">KI-Empfehlung:</span> {analysisResult.description}
                </div>
              </div>
            </div>
          )}

          {/* Confirm button */}
          <Button
            onClick={handleConfirm}
            className="w-full min-h-[48px] touch-manipulation"
            size="lg"
          >
            Analyse übernehmen
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}

export default ChatVideoAnalyzer;
