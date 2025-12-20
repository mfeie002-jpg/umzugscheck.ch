import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeftRight,
  Columns2,
  SplitSquareHorizontal,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
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
  const [comparisonMode, setComparisonMode] = useState<"side-by-side" | "slider" | "overlay">("slider");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [zoom, setZoom] = useState(100);
  
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

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
  };

  const hasImages = leftImage && rightImage;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          Screenshot Vergleich
        </CardTitle>
        <CardDescription>
          Vergleiche zwei Screenshots nebeneinander oder mit einem Schieberegler
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
                    onClick={() => setLeftImage(null)}
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
                {availableScreenshots.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {availableScreenshots.slice(0, 4).map((s, i) => (
                      <Button 
                        key={i} 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                        onClick={() => selectFromAvailable("left", s)}
                      >
                        {new URL(s.url).pathname.slice(0, 15) || "Home"}
                      </Button>
                    ))}
                  </div>
                )}
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
                    onClick={() => setRightImage(null)}
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
                {availableScreenshots.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {availableScreenshots.slice(0, 4).map((s, i) => (
                      <Button 
                        key={i} 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                        onClick={() => selectFromAvailable("right", s)}
                      >
                        {new URL(s.url).pathname.slice(0, 15) || "Home"}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comparison View */}
        {hasImages && (
          <>
            {/* Mode Selection */}
            <div className="flex items-center justify-between">
              <Tabs value={comparisonMode} onValueChange={(v) => setComparisonMode(v as typeof comparisonMode)}>
                <TabsList>
                  <TabsTrigger value="slider" className="gap-2">
                    <SplitSquareHorizontal className="h-4 w-4" />
                    Schieberegler
                  </TabsTrigger>
                  <TabsTrigger value="side-by-side" className="gap-2">
                    <Columns2 className="h-4 w-4" />
                    Nebeneinander
                  </TabsTrigger>
                  <TabsTrigger value="overlay" className="gap-2">
                    <ArrowLeftRight className="h-4 w-4" />
                    Überlagert
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
                {/* Left Image (full) */}
                <img 
                  src={leftImage.imageUrl} 
                  alt="Before" 
                  className="absolute inset-0 w-full h-full object-contain bg-muted"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
                  draggable={false}
                />
                
                {/* Right Image (clipped) */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                >
                  <img 
                    src={rightImage.imageUrl} 
                    alt="After" 
                    className="w-full h-full object-contain bg-muted"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
                    draggable={false}
                  />
                </div>

                {/* Slider Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  onMouseDown={handleMouseDown}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Labels */}
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
          </>
        )}

        {!hasImages && (
          <div className="text-center py-8 text-muted-foreground">
            <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Wähle zwei Screenshots aus, um sie zu vergleichen</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
