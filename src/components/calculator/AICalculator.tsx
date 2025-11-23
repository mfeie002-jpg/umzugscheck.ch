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
      // Convert first image to base64 for analysis
      const file = files[0];
      const base64 = await fileToBase64(file);

      // Note: In a real implementation, this would call your Lovable Cloud edge function
      // that integrates with Lovable AI for image analysis
      
      // Simulated AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockAnalysis = {
        estimatedVolume: "35 m³",
        rooms: [
          { name: "Wohnzimmer", items: 12, volume: "15 m³" },
          { name: "Schlafzimmer", items: 8, volume: "10 m³" },
          { name: "Küche", items: 6, volume: "6 m³" },
          { name: "Badezimmer", items: 4, volume: "4 m³" },
        ],
        largeItems: ["Sofa 3-Sitzer", "Esstisch", "Bett 180x200", "Schrank 3m"],
        confidence: 0.87,
      };

      setAnalysis(mockAnalysis);
      
      toast({
        title: "Analyse abgeschlossen!",
        description: "Ihre Umzugsgrösse wurde geschätzt. Sie können die Werte noch anpassen.",
      });
    } catch (error) {
      toast({
        title: "Fehler bei der Analyse",
        description: "Bitte versuchen Sie es erneut oder nutzen Sie den manuellen Rechner.",
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
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-accent" />
          KI-gestützter Rechner
        </CardTitle>
        <CardDescription>
          Laden Sie Fotos oder Videos Ihrer Wohnung hoch. Unsere KI schätzt automatisch das Volumen und erstellt eine detaillierte Inventarliste.
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
                  <p className="text-sm text-muted-foreground mt-1">
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
                <div className="flex gap-4 text-sm text-muted-foreground">
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
                <Label>Hochgeladene Dateien ({files.length})</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-2">
                        {file.type.startsWith('image/') ? (
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Video className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm truncate max-w-xs">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
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
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  KI analysiert...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 w-5 h-5" />
                  Mit KI analysieren
                </>
              )}
            </Button>

            <div className="bg-accent-light border border-accent/20 rounded-lg p-4">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-2">
                  <p className="font-semibold text-accent">So funktioniert's:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Machen Sie Fotos von jedem Zimmer (verschiedene Winkel)</li>
                    <li>Optional: Video-Rundgang durch die Wohnung</li>
                    <li>Unsere KI analysiert Möbel, Kartons und Volumen</li>
                    <li>Sie erhalten eine editierbare Schätzung mit allen Details</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Analyse abgeschlossen!</span>
            </div>

            {/* Volume Estimate */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Geschätztes Umzugsvolumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">{analysis.estimatedVolume}</span>
                  <span className="text-muted-foreground">Kubikmeter</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Konfidenz: {(analysis.confidence * 100).toFixed(0)}%
                </p>
              </CardContent>
            </Card>

            {/* Room Breakdown */}
            <div className="space-y-3">
              <Label>Zimmer-Analyse</Label>
              {analysis.rooms.map((room: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{room.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {room.items} Gegenstände erkannt
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary">{room.volume}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Large Items */}
            <div className="space-y-3">
              <Label>Grosse Möbelstücke</Label>
              <div className="flex flex-wrap gap-2">
                {analysis.largeItems.map((item: string, index: number) => (
                  <div key={index} className="px-3 py-1 bg-secondary rounded-full text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setAnalysis(null);
                  setFiles([]);
                }}
                className="flex-1"
              >
                Neu analysieren
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={() => {
                  // Navigate to results or next step
                  toast({
                    title: "Weiter zur Offerte",
                    description: "Sie werden zu den Umzugsfirmen weitergeleitet.",
                  });
                }}
              >
                Offerten erhalten
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
