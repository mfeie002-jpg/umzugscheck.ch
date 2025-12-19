import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Upload, Image as ImageIcon, Video, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AICalculator = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Check if file is an image
  const isImageFile = (file: File): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif', '.bmp', '.tiff'];
    const fileName = file.name.toLowerCase();
    return imageExtensions.some(ext => fileName.endsWith(ext)) || file.type.startsWith('image/');
  };

  // Check if file is a video
  const isVideoFile = (file: File): boolean => {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
    const fileName = file.name.toLowerCase();
    return videoExtensions.some(ext => fileName.endsWith(ext)) || file.type.startsWith('video/');
  };

  const analyzeWithAI = async () => {
    if (files.length === 0) {
      toast({
        title: "Keine Dateien ausgewählt",
        description: "Bitte laden Sie mindestens ein Foto oder Video hoch.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const imageFiles = files.filter(isImageFile).slice(0, 5);
      const videoFiles = files.filter(isVideoFile);

      // If we have a video, analyze it first
      if (videoFiles.length > 0) {
        const videoFile = videoFiles[0]; // Use first video
        const videoBase64 = await fileToBase64(videoFile);
        
        console.log('Sending video for analysis');
        
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-moving-video`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ video: videoBase64 }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();
        if (result.success && result.data) {
          // Transform video analysis to match expected format
          setAnalysis({
            estimatedVolume: `${result.data.estimatedVolumeM3} m³`,
            confidence: result.data.confidence,
            rooms: [{ name: "Video-Analyse", items: Object.values(result.data.itemCounts || {}).reduce((a: number, b: any) => a + (b || 0), 0), volume: `${result.data.estimatedVolumeM3} m³` }],
            largeItems: Object.entries(result.data.itemCounts || {}).filter(([_, v]) => (v as number) > 0).map(([k, v]) => `${v}x ${k}`),
          });
          toast({ title: "Video-Analyse abgeschlossen!", description: "Ihre Umzugsgrösse wurde geschätzt." });
          return;
        }
        throw new Error(result.error || 'Video analysis failed');
      }

      // Fall back to image analysis
      if (imageFiles.length === 0) {
        toast({
          title: "Keine Bilder gefunden",
          description: "Bitte laden Sie Fotos hoch (JPG, PNG, HEIC) oder ein Video (MP4, MOV).",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      const images = await Promise.all(imageFiles.map(file => fileToBase64(file)));
      console.log('Sending', images.length, 'images for analysis');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-moving-photos`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ images }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const analysis = await response.json();
      console.log('Analysis result:', analysis);

      setAnalysis(analysis);
      
      toast({
        title: "Analyse abgeschlossen!",
        description: "Ihre Umzugsgrösse wurde geschätzt. Sie können die Werte noch anpassen.",
      });
    } catch (error) {
      console.error('AI analysis error:', error);
      toast({
        title: "Fehler bei der Analyse",
        description: error instanceof Error ? error.message : "Bitte versuchen Sie es erneut oder nutzen Sie den manuellen Rechner.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  return (
    <Card className="shadow-strong">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Sparkles className="w-6 h-6 text-accent" />
          Smart-Rechner mit Bildanalyse
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Laden Sie Fotos oder Videos Ihrer Wohnung hoch. Unser System schätzt automatisch das Volumen und erstellt eine detaillierte Inventarliste.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        {!analysis && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-base">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center">
                  <Upload className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-lg font-semibold text-primary hover:underline">
                      Dateien hochladen
                    </span>
                  </Label>
                  <p className="text-sm text-foreground/70 mt-1">
                    Fotos oder Videos (max. 10 Dateien, je max. 10MB)
                  </p>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex gap-4 text-sm text-foreground/70">
                  <div className="flex items-center gap-1">
                    <ImageIcon className="w-4 h-4" />
                    JPG, PNG, HEIC
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    MP4, MOV
                  </div>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <Label className="text-foreground">Hochgeladene Dateien ({files.length})</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-2">
                        {file.type.startsWith('image/') ? (
                          <ImageIcon className="w-4 h-4 text-foreground/70" />
                        ) : (
                          <Video className="w-4 h-4 text-foreground/70" />
                        )}
                        <span className="text-sm truncate max-w-xs text-foreground">{file.name}</span>
                        <span className="text-xs text-foreground/70">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        Entfernen
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <Button
              onClick={analyzeWithAI}
              disabled={files.length === 0 || isAnalyzing}
              className="w-full bg-accent hover:bg-accent/90 shadow-accent group"
              size="lg"
              aria-label={isAnalyzing ? "System analysiert Ihre Dateien" : "Jetzt analysieren"}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" aria-hidden="true" />
                  Analysiere...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 w-5 h-5" aria-hidden="true" />
                  Jetzt analysieren
                </>
              )}
            </Button>

            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-2">
                  <p className="font-semibold text-accent">So funktioniert's:</p>
                  <ol className="list-decimal list-inside space-y-1 text-foreground/80">
                    <li>Machen Sie Fotos von jedem Zimmer (verschiedene Winkel)</li>
                    <li>Optional: Video-Rundgang durch die Wohnung</li>
                    <li>Unser System analysiert Möbel, Kartons und Volumen</li>
                    <li>Sie erhalten eine editierbare Schätzung mit allen Details</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results - Premium Display */}
        {analysis && (
          <div className="space-y-8">
            {/* Success Header */}
            <div className="text-center py-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Analyse abgeschlossen!</h3>
              <p className="text-muted-foreground">Basierend auf Ihren Dateien haben wir folgende Schätzung erstellt</p>
            </div>

            {/* Main Volume Card - Hero Style */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-2 border-primary/20 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Geschätztes Umzugsvolumen</p>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-6xl md:text-7xl font-bold text-primary">{analysis.estimatedVolume?.replace(' m³', '') || analysis.estimatedVolume}</span>
                  <span className="text-2xl text-muted-foreground">m³</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-background/80 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-foreground">Konfidenz: <strong>{(analysis.confidence * 100).toFixed(0)}%</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Breakdown Grid */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full" />
                Zimmer-Analyse
              </h4>
              <div className="grid gap-3">
                {analysis.rooms.map((room: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{room.name}</div>
                        <div className="text-sm text-muted-foreground">{room.items} Gegenstände erkannt</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{room.volume}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Large Items */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <div className="w-1 h-6 bg-accent rounded-full" />
                Grosse Möbelstücke
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.largeItems.map((item: string, index: number) => (
                  <div key={index} className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setAnalysis(null);
                  setFiles([]);
                }}
                className="flex-1"
                size="lg"
              >
                Neu analysieren
              </Button>
              <Button
                className="flex-1 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/25"
                size="lg"
                onClick={() => {
                  toast({
                    title: "Weiter zur Offerte",
                    description: "Sie werden zu den Umzugsfirmen weitergeleitet.",
                  });
                }}
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Offerten erhalten
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
