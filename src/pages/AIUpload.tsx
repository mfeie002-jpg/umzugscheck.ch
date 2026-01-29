import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Upload, Image as ImageIcon, Video, X, CheckCircle2, Loader2, 
  AlertCircle, ArrowRight, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

const AIUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isImage && !isVideo) {
        toast({
          title: "Ungültiger Dateityp",
          description: `${file.name} ist weder ein Bild noch ein Video.`,
          variant: "destructive",
        });
        return false;
      }

      if (!isValidSize) {
        toast({
          title: "Datei zu gross",
          description: `${file.name} überschreitet 10MB.`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    if (files.length + validFiles.length > 10) {
      toast({
        title: "Zu viele Dateien",
        description: "Maximal 10 Dateien erlaubt.",
        variant: "destructive",
      });
      return;
    }

    const filesWithPreview = validFiles.map(file => {
      const fileWithId = Object.assign(file, { id: Math.random().toString(36).substr(2, 9) });
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFiles(prev => 
            prev.map(f => 
              f.id === fileWithId.id ? { ...f, preview: e.target?.result as string } : f
            )
          );
        };
        reader.readAsDataURL(file);
      }
      
      return fileWithId as FileWithPreview;
    });

    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast({
        title: "Keine Dateien",
        description: "Bitte laden Sie mindestens ein Foto oder Video hoch.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      setUploadProgress(100);
      
      toast({
        title: "Analyse abgeschlossen!",
        description: "Ihre Umzugsgrösse wurde geschätzt.",
      });

      setTimeout(() => {
        navigate("/rechner/ergebnis", {
          state: {
            type: "ai",
            calculatorData: { fileCount: files.length },
            calculation: {
              estimatedVolume: 45,
              rooms: 3.5,
              confidence: 0.85,
            },
          },
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Analyse ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/rechner")}
                className="mb-4 min-h-[44px]"
                aria-label="Zurück zum Rechner"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-semibold">Zurück</span>
              </Button>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-light rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">KI-gestützte Analyse</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                📸 Fotos & Videos hochladen
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Laden Sie Bilder oder Videos Ihrer Wohnung hoch. Unsere <span className="font-semibold text-accent">KI analysiert automatisch</span> das Umzugsvolumen und erstellt eine <span className="font-semibold text-primary">detaillierte Inventarliste</span>.
              </p>
            </div>

            {/* Instructions */}
            <Alert className="mb-8 bg-primary/5 border-primary/20 shadow-soft">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-lg" role="img" aria-label="Glühbirne">💡</span>
                </div>
                <div className="flex-1">
                  <AlertTitle className="text-base font-bold mb-3">So erhalten Sie die beste Schätzung</AlertTitle>
                  <AlertDescription>
                    <ul className="space-y-2.5 text-sm">
                      <li className="flex gap-2"><span className="text-primary font-bold">✓</span> Fotografieren Sie jedes Zimmer aus verschiedenen Winkeln</li>
                      <li className="flex gap-2"><span className="text-primary font-bold">✓</span> Zeigen Sie Möbel, Schränke und Gegenstände deutlich</li>
                      <li className="flex gap-2"><span className="text-accent font-bold">🎥</span> Optional: Machen Sie einen Video-Rundgang durch die Wohnung</li>
                      <li className="flex gap-2"><span className="text-green-600 font-bold">★</span> Je mehr Details sichtbar sind, desto genauer die Schätzung</li>
                    </ul>
                  </AlertDescription>
                </div>
              </div>
            </Alert>

            {/* Upload Area */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Dateien hochladen"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`
                    border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer
                    transition-all duration-300 min-h-[280px] flex items-center justify-center
                    focus:outline-none focus:ring-4 focus:ring-accent/30
                    ${isDragging 
                      ? "border-accent bg-accent/10 scale-105 shadow-lift" 
                      : "border-border hover:border-accent hover:bg-accent/5 hover:shadow-medium"
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-accent/15 flex items-center justify-center animate-pulse-subtle shadow-medium">
                      <Upload className="w-12 h-12 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-foreground">
                        📁 Dateien hierher ziehen oder klicken
                      </h3>
                      <p className="text-base text-muted-foreground mb-4 font-medium">
                        Maximal 10 Dateien, je max. 10MB
                      </p>
                      <div className="flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
                          <ImageIcon className="w-5 h-5 text-primary" />
                          <span className="font-medium text-foreground">JPG, PNG, HEIC</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-lg">
                          <Video className="w-5 h-5 text-accent" />
                          <span className="font-medium text-foreground">MP4, MOV</span>
                        </div>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Preview Grid */}
            {files.length > 0 && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">
                      Hochgeladene Dateien ({files.length}/10)
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFiles([])}
                    >
                      Alle entfernen
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="relative group aspect-square rounded-lg overflow-hidden border-2 border-border bg-secondary"
                      >
                        {file.type.startsWith('image/') && file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(file.id);
                            }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Entfernen
                          </Button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white text-xs p-2 truncate">
                          {file.name}
                        </div>
                        <Badge
                          variant="secondary"
                          className="absolute top-2 right-2"
                        >
                          {(file.size / 1024 / 1024).toFixed(1)}MB
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis Progress */}
            {isAnalyzing && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 text-accent animate-spin" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">KI analysiert Ihre Dateien...</h3>
                        <p className="text-sm text-muted-foreground">
                          {uploadProgress < 100 
                            ? "Dateien werden hochgeladen und verarbeitet"
                            : "Analyse abgeschlossen, Ergebnisse werden vorbereitet"
                          }
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-primary">
                        {uploadProgress}%
                      </span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Button */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => navigate("/rechner")}
                disabled={isAnalyzing}
              >
                Abbrechen
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-accent hover:bg-accent/90 shadow-accent group"
                onClick={handleAnalyze}
                disabled={files.length === 0 || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Analysiere...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-5 h-5" />
                    Mit KI analysieren
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default AIUpload;
