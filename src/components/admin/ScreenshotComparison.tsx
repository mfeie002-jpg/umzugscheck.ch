import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import {
  ArrowLeftRight,
  Columns2,
  SplitSquareHorizontal,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Diff,
  Download,
  FileText,
  History,
  Loader2,
} from "lucide-react";

interface ComparisonImage {
  id: string;
  imageUrl: string;
  label: string;
  timestamp?: Date;
}

interface ScreenshotComparisonProps {
  availableScreenshots?: Array<{
    url: string;
    imageUrl: string;
    timestamp: Date;
    dimension: string;
  }>;
}

export function ScreenshotComparison({ availableScreenshots = [] }: ScreenshotComparisonProps) {
  const [leftImage, setLeftImage] = useState<ComparisonImage | null>(null);
  const [rightImage, setRightImage] = useState<ComparisonImage | null>(null);
  const [comparisonMode, setComparisonMode] = useState<"side-by-side" | "slider" | "overlay" | "diff">("slider");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [zoom, setZoom] = useState(100);
  const [diffImageUrl, setDiffImageUrl] = useState<string | null>(null);
  const [diffLoading, setDiffLoading] = useState(false);
  const [diffStats, setDiffStats] = useState<{ totalPixels: number; diffPixels: number; percentage: number } | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const diffCanvasRef = useRef<HTMLCanvasElement>(null);

  // Handle file upload
  const handleImageUpload = (side: "left" | "right") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img: ComparisonImage = {
          id: `uploaded-${Date.now()}`,
          imageUrl: event.target?.result as string,
          label: file.name,
        };
        if (side === "left") {
          setLeftImage(img);
        } else {
          setRightImage(img);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Select from available screenshots
  const selectFromAvailable = (side: "left" | "right", screenshot: typeof availableScreenshots[0]) => {
    const img: ComparisonImage = {
      id: `screenshot-${screenshot.timestamp.getTime()}`,
      imageUrl: screenshot.imageUrl,
      label: new URL(screenshot.url).pathname || "Homepage",
      timestamp: screenshot.timestamp,
    };
    if (side === "left") {
      setLeftImage(img);
    } else {
      setRightImage(img);
    }
  };

  // Generate pixel diff
  const generateDiff = useCallback(async () => {
    if (!leftImage || !rightImage) return;
    
    setDiffLoading(true);
    setDiffImageUrl(null);
    setDiffStats(null);

    try {
      // Load both images
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      const [imgA, imgB] = await Promise.all([
        loadImage(leftImage.imageUrl),
        loadImage(rightImage.imageUrl),
      ]);

      // Create canvas with max dimensions
      const width = Math.max(imgA.width, imgB.width);
      const height = Math.max(imgA.height, imgB.height);
      
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error("Canvas context not available");
      }

      // Draw image A
      const canvasA = document.createElement("canvas");
      canvasA.width = width;
      canvasA.height = height;
      const ctxA = canvasA.getContext("2d");
      ctxA?.drawImage(imgA, 0, 0);
      const dataA = ctxA?.getImageData(0, 0, width, height);

      // Draw image B
      const canvasB = document.createElement("canvas");
      canvasB.width = width;
      canvasB.height = height;
      const ctxB = canvasB.getContext("2d");
      ctxB?.drawImage(imgB, 0, 0);
      const dataB = ctxB?.getImageData(0, 0, width, height);

      if (!dataA || !dataB) {
        throw new Error("Could not get image data");
      }

      // Create diff image
      const diffData = ctx.createImageData(width, height);
      let diffPixelCount = 0;
      const threshold = 30; // Color difference threshold

      for (let i = 0; i < dataA.data.length; i += 4) {
        const rA = dataA.data[i];
        const gA = dataA.data[i + 1];
        const bA = dataA.data[i + 2];
        
        const rB = dataB.data[i];
        const gB = dataB.data[i + 1];
        const bB = dataB.data[i + 2];

        // Calculate color difference
        const diff = Math.abs(rA - rB) + Math.abs(gA - gB) + Math.abs(bA - bB);
        
        if (diff > threshold) {
          // Highlight difference in red
          diffData.data[i] = 255;     // R
          diffData.data[i + 1] = 0;   // G
          diffData.data[i + 2] = 0;   // B
          diffData.data[i + 3] = 200; // A
          diffPixelCount++;
        } else {
          // Show original but dimmed
          diffData.data[i] = rA;
          diffData.data[i + 1] = gA;
          diffData.data[i + 2] = bA;
          diffData.data[i + 3] = 100;
        }
      }

      ctx.putImageData(diffData, 0, 0);
      
      const totalPixels = (width * height);
      const percentage = (diffPixelCount / totalPixels) * 100;
      
      setDiffStats({
        totalPixels,
        diffPixels: diffPixelCount,
        percentage,
      });
      
      setDiffImageUrl(canvas.toDataURL("image/png"));
      toast.success(`Diff erstellt: ${percentage.toFixed(2)}% Unterschied`);
    } catch (error) {
      console.error("Diff generation error:", error);
      toast.error("Fehler beim Erstellen des Diffs");
    } finally {
      setDiffLoading(false);
    }
  }, [leftImage, rightImage]);

  // Auto-generate diff when mode changes to diff
  useEffect(() => {
    if (comparisonMode === "diff" && leftImage && rightImage && !diffImageUrl) {
      generateDiff();
    }
  }, [comparisonMode, leftImage, rightImage, diffImageUrl, generateDiff]);

  // Export comparison as PDF
  const exportToPdf = async () => {
    if (!leftImage || !rightImage) return;
    
    setPdfLoading(true);
    
    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      // Title page
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("Screenshot Vergleich", pageWidth / 2, 30, { align: "center" });
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Erstellt am: ${new Date().toLocaleString("de-CH")}`, pageWidth / 2, 45, { align: "center" });
      
      pdf.text(`Bild A: ${leftImage.label}`, margin, 70);
      pdf.text(`Bild B: ${rightImage.label}`, margin, 80);
      
      if (diffStats) {
        pdf.text(`Unterschied: ${diffStats.percentage.toFixed(2)}% (${diffStats.diffPixels.toLocaleString()} von ${diffStats.totalPixels.toLocaleString()} Pixeln)`, margin, 95);
      }

      // Page 2: Image A
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Bild A (Vorher)", margin, margin + 10);
      
      try {
        const imgWidth = pageWidth - (margin * 2);
        const imgHeight = pageHeight - margin - 25;
        pdf.addImage(leftImage.imageUrl, "PNG", margin, margin + 15, imgWidth, imgHeight, undefined, "FAST");
      } catch (e) {
        pdf.text("Bild konnte nicht geladen werden", margin, margin + 30);
      }

      // Page 3: Image B
      pdf.addPage();
      pdf.text("Bild B (Nachher)", margin, margin + 10);
      
      try {
        const imgWidth = pageWidth - (margin * 2);
        const imgHeight = pageHeight - margin - 25;
        pdf.addImage(rightImage.imageUrl, "PNG", margin, margin + 15, imgWidth, imgHeight, undefined, "FAST");
      } catch (e) {
        pdf.text("Bild konnte nicht geladen werden", margin, margin + 30);
      }

      // Page 4: Diff (if available)
      if (diffImageUrl) {
        pdf.addPage();
        pdf.text("Pixel-Diff (Unterschiede in Rot)", margin, margin + 10);
        
        if (diffStats) {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.text(`${diffStats.percentage.toFixed(2)}% der Pixel haben sich geändert`, margin, margin + 18);
        }
        
        try {
          const imgWidth = pageWidth - (margin * 2);
          const imgHeight = pageHeight - margin - 30;
          pdf.addImage(diffImageUrl, "PNG", margin, margin + 22, imgWidth, imgHeight, undefined, "FAST");
        } catch (e) {
          pdf.text("Diff-Bild konnte nicht geladen werden", margin, margin + 35);
        }
      }

      pdf.save(`screenshot-vergleich-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF exportiert!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Fehler beim PDF-Export");
    } finally {
      setPdfLoading(false);
    }
  };

  // Slider drag handling
  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !sliderContainerRef.current) return;
    
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const resetComparison = () => {
    setLeftImage(null);
    setRightImage(null);
    setSliderPosition(50);
    setOverlayOpacity(50);
    setZoom(100);
    setDiffImageUrl(null);
    setDiffStats(null);
  };

  const hasImages = leftImage && rightImage;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Screenshot Vergleich
            </CardTitle>
            <CardDescription>
              Vergleiche zwei Screenshots nebeneinander, mit Slider oder Pixel-Diff
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-1"
            >
              <History className="h-4 w-4" />
              History ({availableScreenshots.length})
            </Button>
            {hasImages && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportToPdf}
                disabled={pdfLoading}
                className="gap-1"
              >
                {pdfLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                PDF Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* History Panel */}
        {showHistory && availableScreenshots.length > 0 && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <Label className="text-sm font-medium mb-3 block">
              Screenshot History ({availableScreenshots.length} verfügbar)
            </Label>
            <ScrollArea className="h-32">
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {availableScreenshots.map((s, i) => (
                  <div key={i} className="relative group">
                    <img 
                      src={s.imageUrl} 
                      alt={s.url}
                      className="w-full h-16 object-cover rounded border hover:border-primary cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-6 w-6"
                        onClick={() => selectFromAvailable("left", s)}
                      >
                        A
                      </Button>
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-6 w-6"
                        onClick={() => selectFromAvailable("right", s)}
                      >
                        B
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate mt-1">
                      {new URL(s.url).pathname || "/"}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Image Selection */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Left Image */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600">A</Badge>
              Vorher / Links
            </Label>
            {leftImage ? (
              <div className="relative group">
                <img 
                  src={leftImage.imageUrl} 
                  alt="Left comparison" 
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setLeftImage(null);
                      setDiffImageUrl(null);
                      setDiffStats(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" /> Entfernen
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{leftImage.label}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Bild hochladen</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload("left")} />
                </label>
              </div>
            )}
          </div>

          {/* Right Image */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-600">B</Badge>
              Nachher / Rechts
            </Label>
            {rightImage ? (
              <div className="relative group">
                <img 
                  src={rightImage.imageUrl} 
                  alt="Right comparison" 
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setRightImage(null);
                      setDiffImageUrl(null);
                      setDiffStats(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" /> Entfernen
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{rightImage.label}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Bild hochladen</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload("right")} />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Comparison View */}
        {hasImages && (
          <>
            {/* Mode Selection */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Tabs value={comparisonMode} onValueChange={(v) => setComparisonMode(v as typeof comparisonMode)}>
                <TabsList>
                  <TabsTrigger value="slider" className="gap-2">
                    <SplitSquareHorizontal className="h-4 w-4" />
                    Slider
                  </TabsTrigger>
                  <TabsTrigger value="side-by-side" className="gap-2">
                    <Columns2 className="h-4 w-4" />
                    Side-by-Side
                  </TabsTrigger>
                  <TabsTrigger value="overlay" className="gap-2">
                    <ArrowLeftRight className="h-4 w-4" />
                    Overlay
                  </TabsTrigger>
                  <TabsTrigger value="diff" className="gap-2">
                    <Diff className="h-4 w-4" />
                    Pixel-Diff
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(50, zoom - 25))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-12 text-center">{zoom}%</span>
                <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={resetComparison}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Slider Mode */}
            {comparisonMode === "slider" && (
              <div 
                ref={sliderContainerRef}
                className="relative overflow-hidden rounded-lg border cursor-ew-resize select-none"
                style={{ height: `${400 * (zoom / 100)}px` }}
                onMouseMove={handleMouseMove}
              >
                <img 
                  src={leftImage.imageUrl} 
                  alt="Before" 
                  className="absolute inset-0 w-full h-full object-contain bg-muted"
                  draggable={false}
                />
                
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                >
                  <img 
                    src={rightImage.imageUrl} 
                    alt="After" 
                    className="w-full h-full object-contain bg-muted"
                    draggable={false}
                  />
                </div>

                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  onMouseDown={handleMouseDown}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <Badge className="absolute top-2 left-2 bg-blue-500">A: Vorher</Badge>
                <Badge className="absolute top-2 right-2 bg-green-500">B: Nachher</Badge>
              </div>
            )}

            {/* Side by Side Mode */}
            {comparisonMode === "side-by-side" && (
              <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden border">
                <div className="relative">
                  <img 
                    src={leftImage.imageUrl} 
                    alt="Left" 
                    className="w-full object-contain bg-muted"
                    style={{ height: `${400 * (zoom / 100)}px` }}
                  />
                  <Badge className="absolute top-2 left-2 bg-blue-500">A: Vorher</Badge>
                </div>
                <div className="relative">
                  <img 
                    src={rightImage.imageUrl} 
                    alt="Right" 
                    className="w-full object-contain bg-muted"
                    style={{ height: `${400 * (zoom / 100)}px` }}
                  />
                  <Badge className="absolute top-2 left-2 bg-green-500">B: Nachher</Badge>
                </div>
              </div>
            )}

            {/* Overlay Mode */}
            {comparisonMode === "overlay" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label className="w-24">Deckkraft B:</Label>
                  <Slider 
                    value={[overlayOpacity]} 
                    onValueChange={([v]) => setOverlayOpacity(v)}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="w-12 text-right text-sm">{overlayOpacity}%</span>
                </div>
                <div 
                  className="relative rounded-lg overflow-hidden border"
                  style={{ height: `${400 * (zoom / 100)}px` }}
                >
                  <img 
                    src={leftImage.imageUrl} 
                    alt="Base" 
                    className="absolute inset-0 w-full h-full object-contain bg-muted"
                  />
                  <img 
                    src={rightImage.imageUrl} 
                    alt="Overlay" 
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ opacity: overlayOpacity / 100 }}
                  />
                  <Badge className="absolute top-2 left-2 bg-blue-500">A: Basis</Badge>
                  <Badge className="absolute top-2 right-2 bg-green-500">B: Overlay ({overlayOpacity}%)</Badge>
                </div>
              </div>
            )}

            {/* Diff Mode */}
            {comparisonMode === "diff" && (
              <div className="space-y-4">
                {diffStats && (
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <Badge variant={diffStats.percentage > 10 ? "destructive" : diffStats.percentage > 5 ? "default" : "secondary"}>
                      {diffStats.percentage.toFixed(2)}% Unterschied
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {diffStats.diffPixels.toLocaleString()} von {diffStats.totalPixels.toLocaleString()} Pixeln
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={generateDiff}
                      disabled={diffLoading}
                      className="ml-auto"
                    >
                      {diffLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Neu berechnen"}
                    </Button>
                  </div>
                )}
                
                {diffLoading && (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-3 text-muted-foreground">Berechne Pixel-Unterschiede...</span>
                  </div>
                )}
                
                {diffImageUrl && !diffLoading && (
                  <div 
                    className="relative rounded-lg overflow-hidden border"
                    style={{ height: `${400 * (zoom / 100)}px` }}
                  >
                    <img 
                      src={diffImageUrl} 
                      alt="Diff" 
                      className="w-full h-full object-contain bg-black"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500">Unterschiede in Rot</Badge>
                    {diffImageUrl && (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="absolute bottom-2 right-2"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = diffImageUrl;
                          a.download = `diff-${Date.now()}.png`;
                          a.click();
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Diff speichern
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {!hasImages && (
          <div className="text-center py-8 text-muted-foreground">
            <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Wähle zwei Screenshots aus, um sie zu vergleichen</p>
            <p className="text-sm mt-2">Nutze die History oben oder lade Bilder hoch</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
