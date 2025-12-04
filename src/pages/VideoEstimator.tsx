import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, Video, CheckCircle, AlertCircle, Loader2, Home, Package, Sofa, Box, TrendingUp, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { calculateVideoBasedPrice, formatCurrency, estimateDistance } from "@/lib/pricing";
import { swissPostalCodes, validatePostalCode, PostalCodeEntry } from "@/lib/swiss-postal-codes";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AnalysisResult {
  videoId: string;
  estimatedVolumeM3: number;
  difficultyScore: number;
  itemCounts: {
    sofas?: number;
    beds?: number;
    wardrobes?: number;
    boxes?: number;
    [key: string]: number | undefined;
  };
}

export default function VideoEstimator() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [priceEstimate, setPriceEstimate] = useState<{
    minPrice: number;
    maxPrice: number;
    estimatedHours: number;
    breakdown?: {
      basePrice: number;
      basePricePercent: number;
      distanceFee: number;
      distanceFeePercent: number;
      floorFee: number;
      floorFeePercent: number;
      elevatorDiscount: number;
      elevatorDiscountPercent: number;
      total: number;
    };
  } | null>(null);
  const [customDistance, setCustomDistance] = useState<string>("50");
  const [isCustomDistance, setIsCustomDistance] = useState(false);
  const [fromPostal, setFromPostal] = useState<string>("");
  const [toPostal, setToPostal] = useState<string>("");
  const [usePostalCodes, setUsePostalCodes] = useState(false);
  const [fromPostalDisplay, setFromPostalDisplay] = useState<string>("");
  const [toPostalDisplay, setToPostalDisplay] = useState<string>("");
  const [fromPostalSearchQuery, setFromPostalSearchQuery] = useState<string>("");
  const [toPostalSearchQuery, setToPostalSearchQuery] = useState<string>("");
  const [fromPostalValid, setFromPostalValid] = useState<boolean | null>(null);
  const [toPostalValid, setToPostalValid] = useState<boolean | null>(null);
  
  // Lead form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

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
    
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Bitte wählen Sie eine gültige Videodatei (MP4, MOV)");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Die Datei ist zu groß. Maximale Größe: 100MB");
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) {
      toast.error("Bitte wählen Sie zuerst ein Video aus");
      return;
    }

    setStep(2);
    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert video to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Video = reader.result as string;

        const { data, error: functionError } = await supabase.functions.invoke('analyze-moving-video', {
          body: { video: base64Video }
        });

        if (functionError) {
          throw new Error(functionError.message || 'Analyse fehlgeschlagen');
        }

          if (data && data.success) {
          setAnalysisResult(data.data);
          
          // Calculate price estimate based on volume and difficulty
          const priceCalc = calculateVideoBasedPrice(
            data.data.estimatedVolumeM3,
            data.data.difficultyScore
          );
          setPriceEstimate({
            minPrice: priceCalc.priceMin,
            maxPrice: priceCalc.priceMax,
            estimatedHours: priceCalc.estimatedHours,
            breakdown: priceCalc.breakdown
          });
          
          setStep(3);
        } else {
          throw new Error(data?.error || 'Analyse fehlgeschlagen');
        }
      };

      reader.onerror = () => {
        throw new Error('Fehler beim Lesen der Videodatei');
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
      toast.error("Video konnte nicht analysiert werden");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitLead = async () => {
    if (!name || !email || !analysisResult || !priceEstimate) {
      toast.error("Bitte füllen Sie alle erforderlichen Felder aus");
      return;
    }

    setIsSubmittingLead(true);

    try {
      // Create estimate session
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        'create-estimate-session',
        {
          body: {
            moveDetails: {
              fromPostal: fromPostal || '0000',
              fromCity: 'Video-Analyse',
              toPostal: toPostal || '0000',
              toCity: 'Video-Analyse',
              calculatorType: 'video',
              videoId: analysisResult.videoId,
              fileName: selectedFile?.name,
            },
            estimate: {
              priceMin: priceEstimate.minPrice,
              priceMax: priceEstimate.maxPrice,
              volumeM3: analysisResult.estimatedVolumeM3,
              estimatedHours: priceEstimate.estimatedHours,
              distance: parseInt(customDistance) || 50,
            },
          },
        }
      );

      if (sessionError || !sessionData?.success) {
        throw new Error(sessionData?.error?.message || 'Failed to create estimate session');
      }

      // Navigate to funnel
      navigate(`/ergebnis/${sessionData.data.id}`);
      
      toast.success("Kostenschätzung erstellt!");
    } catch (err) {
      console.error('Lead submission error:', err);
      toast.error("Anfrage konnte nicht gesendet werden");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleDistanceChange = (newDistance: string) => {
    setCustomDistance(newDistance);
    const distanceNum = parseInt(newDistance);
    
    if (!isNaN(distanceNum) && distanceNum > 0 && analysisResult) {
      setIsCustomDistance(true);
      setUsePostalCodes(false);
      const priceCalc = calculateVideoBasedPrice(
        analysisResult.estimatedVolumeM3,
        analysisResult.difficultyScore,
        distanceNum
      );
      setPriceEstimate({
        minPrice: priceCalc.priceMin,
        maxPrice: priceCalc.priceMax,
        estimatedHours: priceCalc.estimatedHours,
        breakdown: priceCalc.breakdown
      });
    }
  };

  const handleFromPostalSelect = (entry: PostalCodeEntry) => {
    setFromPostal(entry.code);
    setFromPostalDisplay(`${entry.code} - ${entry.city}`);
    setFromPostalSearchQuery(`${entry.code} - ${entry.city} (${entry.canton})`);
    setFromPostalValid(true);
    
    // Calculate distance if destination postal code is also selected
    if (toPostal && validatePostalCode(toPostal)) {
      calculateDistanceAndPrice(entry.code, toPostal);
    }
  };

  const handleToPostalSelect = (entry: PostalCodeEntry) => {
    setToPostal(entry.code);
    setToPostalDisplay(`${entry.code} - ${entry.city}`);
    setToPostalSearchQuery(`${entry.code} - ${entry.city} (${entry.canton})`);
    setToPostalValid(true);
    
    // Calculate distance if source postal code is also selected
    if (fromPostal && validatePostalCode(fromPostal)) {
      calculateDistanceAndPrice(fromPostal, entry.code);
    }
  };

  const calculateDistanceAndPrice = (from: string, to: string) => {
    // Always calculate distance when both postal codes are selected
    const calculatedDistance = estimateDistance(from, to);
    setCustomDistance(calculatedDistance.toString());
    setUsePostalCodes(true);
    setIsCustomDistance(true);
    
    // Only calculate price if video/image analysis is complete
    if (analysisResult) {
      const priceCalc = calculateVideoBasedPrice(
        analysisResult.estimatedVolumeM3,
        analysisResult.difficultyScore,
        calculatedDistance
      );
      setPriceEstimate({
        minPrice: priceCalc.priceMin,
        maxPrice: priceCalc.priceMax,
        estimatedHours: priceCalc.estimatedHours,
        breakdown: priceCalc.breakdown
      });
    }
  };

  const clearFromPostal = () => {
    setFromPostal("");
    setFromPostalDisplay("");
    setFromPostalSearchQuery("");
    setFromPostalValid(null);
    setUsePostalCodes(false);
  };

  const clearToPostal = () => {
    setToPostal("");
    setToPostalDisplay("");
    setToPostalSearchQuery("");
    setToPostalValid(null);
    setUsePostalCodes(false);
  };

  const filterPostalCodes = (query: string): PostalCodeEntry[] => {
    if (!query || query.trim().length < 1) {
      // Show diverse selection from different cantons
      return swissPostalCodes.filter((_, index) => index % 10 === 0).slice(0, 50);
    }
    
    const lowerQuery = query.toLowerCase().trim();
    
    return swissPostalCodes
      .filter(entry => 
        entry.code.startsWith(lowerQuery) || 
        entry.city.toLowerCase().startsWith(lowerQuery) ||
        entry.city.toLowerCase().includes(lowerQuery) ||
        entry.canton.toLowerCase() === lowerQuery
      )
      .slice(0, 50);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedFile(null);
    setAnalysisResult(null);
    setPriceEstimate(null);
    setCustomDistance("50");
    setIsCustomDistance(false);
    setFromPostal("");
    setToPostal("");
    setFromPostalDisplay("");
    setToPostalDisplay("");
    setFromPostalSearchQuery("");
    setToPostalSearchQuery("");
    setFromPostalValid(null);
    setToPostalValid(null);
    setUsePostalCodes(false);
    setError(null);
  };

  const getDifficultyLabel = (score: number): string => {
    if (score <= 2) return "Einfach";
    if (score <= 3.5) return "Mittel";
    return "Anspruchsvoll";
  };

  const getDifficultyColor = (score: number): string => {
    if (score <= 2) return "text-green-600";
    if (score <= 3.5) return "text-yellow-600";
    return "text-red-600";
  };

  // Generate structured data schemas
  const videoObjectSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Video-Umzugsrechner Tutorial - Umzugsvolumen automatisch schätzen",
    "description": "Erfahren Sie, wie Sie mit dem Video-Umzugsrechner von Umzugscheck.ch Ihr Umzugsvolumen automatisch berechnen lassen. Filmen Sie einfach Ihre Wohnung mit dem Smartphone, laden Sie das Video hoch und erhalten Sie eine KI-gestützte Kostenschätzung in Sekunden.",
    "thumbnailUrl": "https://umzugscheck.ch/og-image-video-calculator.jpg",
    "uploadDate": "2024-01-15T08:00:00+01:00",
    "contentUrl": "https://umzugscheck.ch/video-rechner",
    "duration": "PT2M30S",
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "http://schema.org/WatchAction",
      "userInteractionCount": 1250
    },
    "potentialAction": {
      "@type": "UseAction",
      "target": "https://umzugscheck.ch/video-rechner",
      "name": "Video hochladen und Umzugskosten berechnen"
    }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Wie man den Video-Umzugsrechner verwendet",
    "description": "Schritt-für-Schritt Anleitung zur Nutzung des Video-Umzugsrechners für eine automatische Umzugskostenschätzung",
    "totalTime": "PT3M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Video aufnehmen",
        "text": "Filmen Sie alle Räume Ihrer Wohnung mit Ihrem Smartphone. Zeigen Sie alle Möbel, Gegenstände und Räume, die umgezogen werden müssen.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Video hochladen",
        "text": "Laden Sie das Video auf Umzugscheck.ch hoch. Unterstützte Formate: MP4, MOV. Maximale Dateigröße: 100MB.",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "KI-Analyse abwarten",
        "text": "Unsere KI analysiert Ihr Video automatisch und schätzt das Umzugsvolumen in Kubikmetern sowie die Schwierigkeit des Umzugs.",
        "position": 3
      },
      {
        "@type": "HowToStep",
        "name": "Kostenvoranschlag erhalten",
        "text": "Erhalten Sie eine detaillierte Kostenschätzung basierend auf dem geschätzten Volumen, Schwierigkeit und Distanz.",
        "position": 4
      },
      {
        "@type": "HowToStep",
        "name": "Offerte anfragen",
        "text": "Fordern Sie kostenlose Offerten von geprüften Umzugsfirmen an, basierend auf Ihrer Video-Analyse.",
        "position": 5
      }
    ]
  };

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Video-Umzugsrechner",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CHF"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "156"
    },
    "featureList": "Video-Upload, KI-gestützte Volumenberechnung, Kostenschätzung, Schwierigkeitsanalyse, Distanzberechnung",
    "screenshot": "https://umzugscheck.ch/screenshot-video-calculator.jpg"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Video-Umzugsrechner - KI-gestützte Kostenschätzung | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Video-Umzugsrechner mit KI: Filmen Sie Ihre Wohnung, laden Sie das Video hoch und erhalten Sie automatisch eine präzise Schätzung für Umzugsvolumen und -kosten. Kostenlos & in Sekunden." 
        />
        <meta name="keywords" content="Video Umzugsrechner, KI Umzugskostenschätzung, Video Upload Umzug, automatische Volumenberechnung, Umzugskosten Video" />
        <link rel="canonical" href="https://umzugscheck.ch/video-rechner" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Video-Umzugsrechner - Umzugsvolumen per KI berechnen" />
        <meta property="og:description" content="Filmen Sie Ihre Wohnung und erhalten Sie eine automatische Kostenschätzung durch KI-Analyse. Schnell, kostenlos und präzise." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://umzugscheck.ch/video-rechner" />
        <meta property="og:image" content="https://umzugscheck.ch/og-image-video-calculator.jpg" />
        
        {/* Structured Data - VideoObject */}
        <script type="application/ld+json">
          {JSON.stringify(videoObjectSchema)}
        </script>
        
        {/* Structured Data - HowTo */}
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
        
        {/* Structured Data - WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify(webApplicationSchema)}
        </script>
      </Helmet>

      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Video-Umzugsrechner
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Filmen Sie Ihre Wohnung mit dem Handy, laden Sie das Video hoch und erhalten Sie eine automatische Schätzung Ihres Umzugsvolumens.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  1
                </div>
                <span className="hidden sm:inline">Video hochladen</span>
              </div>
              <div className={`h-px w-12 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  2
                </div>
                <span className="hidden sm:inline">Analyse</span>
              </div>
              <div className={`h-px w-12 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  3
                </div>
                <span className="hidden sm:inline">Ergebnis</span>
              </div>
            </div>
          </div>

          {/* Step 1: Upload */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Video hochladen</CardTitle>
                <CardDescription>
                  Wählen Sie ein Video Ihrer Wohnung oder ziehen Sie es per Drag & Drop hierher
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  {selectedFile ? (
                    <div className="space-y-4">
                      <Video className="w-16 h-16 mx-auto text-primary" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => setSelectedFile(null)}>
                        Anderes Video wählen
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium mb-2">
                          Video hier ablegen oder klicken zum Auswählen
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Erlaubte Formate: MP4, MOV • Max. Größe: 100MB
                        </p>
                      </div>
                      <Input
                        type="file"
                        accept="video/mp4,video/quicktime,video/x-msvideo"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="video-upload"
                      />
                      <Label htmlFor="video-upload">
                        <Button variant="outline" asChild>
                          <span>Video auswählen</span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleStartAnalysis}
                  disabled={!selectedFile}
                >
                  Analyse starten
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Analysis */}
          {step === 2 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-6">
                  <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Video wird analysiert...</h3>
                    <p className="text-muted-foreground">
                      Unsere KI analysiert Ihr Video und schätzt das Umzugsvolumen.
                      Dies kann einige Sekunden dauern.
                    </p>
                  </div>
                  <Progress value={66} className="max-w-md mx-auto" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Results */}
          {step === 3 && analysisResult && (
            <div className="space-y-6">
              {error && (
                <Card className="border-destructive">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-destructive">Fehler bei der Analyse</p>
                        <p className="text-sm text-muted-foreground mt-1">{error}</p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={handleReset}>
                          Neue Analyse starten
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!error && (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            Ihre Umzugsschätzung
                          </CardTitle>
                          <CardDescription>Basierend auf der Video-Analyse</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex items-center gap-3 mb-2">
                            <Package className="w-6 h-6 text-primary" />
                            <h4 className="font-semibold">Geschätztes Volumen</h4>
                          </div>
                          <p className="text-3xl font-bold text-primary">
                            {analysisResult.estimatedVolumeM3} m³
                          </p>
                        </div>

                        <div className="p-6 rounded-lg bg-secondary">
                          <div className="flex items-center gap-3 mb-2">
                            <Home className="w-6 h-6 text-secondary-foreground" />
                            <h4 className="font-semibold">Schwierigkeitsgrad</h4>
                          </div>
                          <p className={`text-3xl font-bold ${getDifficultyColor(analysisResult.difficultyScore)}`}>
                            {getDifficultyLabel(analysisResult.difficultyScore)}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Score: {analysisResult.difficultyScore} / 5
                          </p>
                        </div>
                      </div>

                      {Object.keys(analysisResult.itemCounts).length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Box className="w-5 h-5" />
                            Erkannte Gegenstände
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {Object.entries(analysisResult.itemCounts).map(([item, count]) => (
                              count && count > 0 ? (
                                <div key={item} className="p-3 rounded-lg border bg-card text-center">
                                  <p className="text-2xl font-bold text-primary">{count}</p>
                                  <p className="text-sm text-muted-foreground capitalize">
                                    {item}
                                  </p>
                                </div>
                              ) : null
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">
                          💡 Diese Schätzung basiert auf einer automatischen Video-Analyse und dient als erste Orientierung. 
                          Für ein verbindliches Angebot empfehlen wir eine persönliche Besichtigung.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Price Estimate Card */}
                  {priceEstimate && (
                    <Card className="border-2 border-accent/30 bg-accent/5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-6 h-6 text-accent" />
                          Geschätzte Umzugskosten
                        </CardTitle>
                        <CardDescription>
                          Basierend auf {analysisResult.estimatedVolumeM3} m³ Volumen und Schwierigkeitsgrad {analysisResult.difficultyScore}/5
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Distance Adjustment */}
                        <div className="p-4 rounded-lg bg-card border border-border space-y-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            <Label className="text-base font-semibold">
                              Umzugsdistanz anpassen
                            </Label>
                          </div>
                          
                          {/* Postal Code Inputs */}
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                              Geben Sie die Postleitzahlen ein für eine automatische Distanzberechnung
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="fromPostal" className="text-sm mb-2 block">Von PLZ</Label>
              <div className="relative">
                <Input
                  id="fromPostal"
                  type="text"
                  placeholder="PLZ oder Ort eingeben..."
                  value={fromPostalSearchQuery}
                   onChange={(e) => {
                     const value = e.target.value;
                     setFromPostalSearchQuery(value);
                     
                     // Check if user selected from datalist (format: "CODE - CITY (CANTON)")
                     const match = value.match(/^(\d{4})\s*-\s*([^(]+)\s*\(([^)]+)\)$/);
                     if (match) {
                       const [, code] = match;
                       const entry = swissPostalCodes.find(e => e.code === code);
                       if (entry) {
                         handleFromPostalSelect(entry);
                       }
                     } else if (value.trim() === "") {
                       // Only clear if user explicitly emptied the field
                       clearFromPostal();
                     }
                   }}
                  list="fromPostalList"
                  className={`pr-8 ${
                    fromPostalValid === false ? 'border-destructive' : 
                    fromPostalValid === true ? 'border-green-500' : ''
                  }`}
                />
                <datalist id="fromPostalList">
                  {filterPostalCodes(fromPostalSearchQuery).map((entry) => (
                    <option 
                      key={entry.code} 
                      value={`${entry.code} - ${entry.city} (${entry.canton})`}
                    />
                  ))}
                </datalist>
                                  {fromPostal && (
                                    <button
                                      type="button"
                                      onClick={clearFromPostal}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="toPostal" className="text-sm mb-2 block">Nach PLZ</Label>
              <div className="relative">
                <Input
                  id="toPostal"
                  type="text"
                  placeholder="PLZ oder Ort eingeben..."
                  value={toPostalSearchQuery}
                   onChange={(e) => {
                     const value = e.target.value;
                     setToPostalSearchQuery(value);
                     
                     // Check if user selected from datalist (format: "CODE - CITY (CANTON)")
                     const match = value.match(/^(\d{4})\s*-\s*([^(]+)\s*\(([^)]+)\)$/);
                     if (match) {
                       const [, code] = match;
                       const entry = swissPostalCodes.find(e => e.code === code);
                       if (entry) {
                         handleToPostalSelect(entry);
                       }
                     } else if (value.trim() === "") {
                       // Only clear if user explicitly emptied the field
                       clearToPostal();
                     }
                   }}
                  list="toPostalList"
                  className={`pr-8 ${
                    toPostalValid === false ? 'border-destructive' : 
                    toPostalValid === true ? 'border-green-500' : ''
                  }`}
                />
                <datalist id="toPostalList">
                  {filterPostalCodes(toPostalSearchQuery).map((entry) => (
                    <option 
                      key={entry.code} 
                      value={`${entry.code} - ${entry.city} (${entry.canton})`}
                    />
                  ))}
                </datalist>
                                  {toPostal && (
                                    <button
                                      type="button"
                                      onClick={clearToPostal}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                            {usePostalCodes && (
                              <p className="text-xs text-primary flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Distanz automatisch berechnet: {customDistance} km
                              </p>
                            )}
                          </div>

                          {/* Or Manual Distance */}
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-card px-2 text-muted-foreground">Oder manuell</span>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="distance" className="text-sm mb-1">Distanz (km)</Label>
                            <div className="flex gap-3 items-end">
                              <div className="flex-1">
                                <Input
                                  id="distance"
                                  type="number"
                                  min="1"
                                  max="500"
                                  value={customDistance}
                                  onChange={(e) => handleDistanceChange(e.target.value)}
                                  className="text-lg"
                                />
                              </div>
                              <div className="text-muted-foreground font-medium pb-2">km</div>
                            </div>
                            {isCustomDistance && !usePostalCodes && (
                              <p className="text-xs text-primary mt-2 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Preis aktualisiert für {customDistance} km
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="p-6 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">Geschätzter Preis</p>
                            <p className="text-4xl font-bold text-accent mb-1">
                              {formatCurrency(priceEstimate.minPrice)} - {formatCurrency(priceEstimate.maxPrice)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Ca. {priceEstimate.estimatedHours} Stunden
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-3 text-sm">
                          <div className="p-3 rounded-lg bg-card border">
                            <p className="text-muted-foreground mb-1">Volumen</p>
                            <p className="font-semibold">{analysisResult.estimatedVolumeM3} m³</p>
                          </div>
                          <div className="p-3 rounded-lg bg-card border">
                            <p className="text-muted-foreground mb-1">Distanz</p>
                            <p className="font-semibold">{customDistance} km</p>
                          </div>
                          <div className="p-3 rounded-lg bg-card border">
                            <p className="text-muted-foreground mb-1">Schwierigkeit</p>
                            <p className="font-semibold">{analysisResult.difficultyScore}/5</p>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            ⚠️ Dies ist eine automatische Schätzung. Der tatsächliche Preis kann je nach 
                            Zusatzleistungen, Parkplatzsituation und spezifischen Anforderungen variieren. 
                            Für ein verbindliches Angebot fordern Sie bitte eine Offerte an.
                          </p>
                        </div>

                        {/* Cost Breakdown Visualization */}
                        {priceEstimate.breakdown && (
                          <div className="p-6 rounded-lg bg-card border border-border">
                            <h4 className="font-semibold mb-4 flex items-center gap-2">
                              <Package className="w-5 h-5 text-primary" />
                              Kostenaufschlüsselung
                            </h4>
                            
                            <div className="space-y-4">
                              {/* Visual Bar */}
                              <div className="flex h-8 rounded-full overflow-hidden">
                                <div 
                                  className="bg-primary transition-all" 
                                  style={{ width: `${priceEstimate.breakdown.basePricePercent}%` }}
                                  title={`Basispreis: ${priceEstimate.breakdown.basePricePercent}%`}
                                ></div>
                                <div 
                                  className="bg-blue-500 transition-all" 
                                  style={{ width: `${priceEstimate.breakdown.distanceFeePercent}%` }}
                                  title={`Distanzgebühr: ${priceEstimate.breakdown.distanceFeePercent}%`}
                                ></div>
                                {priceEstimate.breakdown.floorFee > 0 && (
                                  <div 
                                    className="bg-orange-500 transition-all" 
                                    style={{ width: `${priceEstimate.breakdown.floorFeePercent}%` }}
                                    title={`Etagenzuschlag: ${priceEstimate.breakdown.floorFeePercent}%`}
                                  ></div>
                                )}
                                {priceEstimate.breakdown.elevatorDiscount < 0 && (
                                  <div 
                                    className="bg-green-500 transition-all" 
                                    style={{ width: `${Math.abs(priceEstimate.breakdown.elevatorDiscountPercent)}%` }}
                                    title={`Aufzugrabatt: ${Math.abs(priceEstimate.breakdown.elevatorDiscountPercent)}%`}
                                  ></div>
                                )}
                              </div>

                              {/* Breakdown Items */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                                    <span className="text-sm font-medium">Basispreis</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">{formatCurrency(priceEstimate.breakdown.basePrice)}</div>
                                    <div className="text-xs text-muted-foreground">{priceEstimate.breakdown.basePricePercent}%</div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pb-2 border-b">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm font-medium">Distanzgebühr</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">{formatCurrency(priceEstimate.breakdown.distanceFee)}</div>
                                    <div className="text-xs text-muted-foreground">{priceEstimate.breakdown.distanceFeePercent}%</div>
                                  </div>
                                </div>

                                {priceEstimate.breakdown.floorFee > 0 && (
                                  <div className="flex items-center justify-between pb-2 border-b">
                                    <div className="flex items-center gap-2">
                                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                      <span className="text-sm font-medium">Etagenzuschlag</span>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold">{formatCurrency(priceEstimate.breakdown.floorFee)}</div>
                                      <div className="text-xs text-muted-foreground">{priceEstimate.breakdown.floorFeePercent}%</div>
                                    </div>
                                  </div>
                                )}

                                {priceEstimate.breakdown.elevatorDiscount < 0 && (
                                  <div className="flex items-center justify-between pb-2 border-b">
                                    <div className="flex items-center gap-2">
                                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                      <span className="text-sm font-medium">Aufzugrabatt</span>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold">{formatCurrency(priceEstimate.breakdown.elevatorDiscount)}</div>
                                      <div className="text-xs text-muted-foreground">{Math.abs(priceEstimate.breakdown.elevatorDiscountPercent)}%</div>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-3 bg-accent/10 -mx-3 px-3 py-3 rounded-lg">
                                  <span className="font-semibold">Gesamtkosten</span>
                                  <span className="font-bold text-lg text-accent">{formatCurrency(priceEstimate.breakdown.total)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle>Unverbindliche Umzugsofferte anfordern</CardTitle>
                      <CardDescription>
                        Erhalten Sie passende Angebote von geprüften Umzugsfirmen
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ihr Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-Mail *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ihre@email.ch"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon (optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+41 79 123 45 67"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Nachricht (optional)</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Weitere Informationen zu Ihrem Umzug..."
                          rows={4}
                        />
                      </div>

                      <Button
                        size="lg"
                        className="w-full"
                        onClick={handleSubmitLead}
                        disabled={isSubmittingLead}
                      >
                        {isSubmittingLead ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Wird gesendet...
                          </>
                        ) : (
                          "Offerte anfordern"
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="text-center">
                    <Button variant="outline" onClick={handleReset}>
                      Neue Schätzung starten
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SEO Content */}
          <div className="mt-16 prose prose-slate max-w-none">
            <h2>Video-basierte Umzugsschätzung – So funktioniert's</h2>
            <p>
              Mit unserem innovativen Video-Umzugsrechner können Sie schnell und unkompliziert eine erste Schätzung 
              Ihres Umzugsvolumens erhalten. Filmen Sie einfach Ihre Wohnung mit dem Smartphone, laden Sie das Video 
              hoch und unsere KI analysiert automatisch die Räume und Gegenstände.
            </p>
            
            <h3>Vorteile der Video-Analyse</h3>
            <ul>
              <li><strong>Schnell und bequem:</strong> Keine Terminvereinbarung für eine Besichtigung nötig</li>
              <li><strong>Präzise Schätzung:</strong> KI-gestützte Analyse erkennt Möbel und Gegenstände</li>
              <li><strong>Kostenlos:</strong> Keine Kosten für die erste Schätzung</li>
              <li><strong>Transparent:</strong> Sofortige Rückmeldung zum geschätzten Umfangsvolumen</li>
            </ul>

            <h3>Tipps für das perfekte Video</h3>
            <ul>
              <li>Filmen Sie alle Räume nacheinander in Ruhe</li>
              <li>Achten Sie auf gute Beleuchtung</li>
              <li>Schwenken Sie langsam, damit alle Gegenstände erkennbar sind</li>
              <li>Öffnen Sie Schränke und Schubladen, um den Inhalt zu zeigen</li>
              <li>Filmen Sie auch Keller, Dachboden und Garage</li>
            </ul>

            <h3>Nach der Analyse</h3>
            <p>
              Basierend auf der Video-Analyse erhalten Sie eine Schätzung des Umzugsvolumens in Kubikmetern sowie 
              einen Schwierigkeitsgrad. Diese Informationen helfen Ihnen, die passenden Umzugsfirmen zu finden und 
              erste Kostenkalkulationen zu erstellen. Für ein verbindliches Angebot empfehlen wir anschließend eine 
              persönliche Besichtigung durch die Umzugsfirma.
            </p>
          </div>
        </div>
      </main>

      
    </div>
  );
}
