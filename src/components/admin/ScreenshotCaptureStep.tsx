import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Camera, 
  Play, 
  Eye, 
  ArrowRight,
  CheckCircle,
  FileCode,
  ChevronDown
} from "lucide-react";
import type { UnifiedFlowVariant } from "@/hooks/useAllFlowVariants";

interface ScreenshotCaptureStepProps {
  selectedFlow: string;
  getSubVariantsForFlow: (flowId: string) => UnifiedFlowVariant[];
  navigate: NavigateFunction;
  onNext: () => void;
}

export function ScreenshotCaptureStep({
  selectedFlow,
  getSubVariantsForFlow,
  navigate,
  onNext,
}: ScreenshotCaptureStepProps) {
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  
  // Get all static sub-variants for this flow
  const allSubVariants = getSubVariantsForFlow(selectedFlow)
    .filter(v => v.source === 'static-sub');
  
  // Find the currently selected variant
  const currentVariant = allSubVariants.find(v => v.id === selectedVariant);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Camera className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">4. Screenshots erfassen</CardTitle>
            <CardDescription>Wähle eine Variante und erfasse Screenshots</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {allSubVariants.length > 0 ? (
          <>
            {/* Variant Dropdown */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-2">
                <FileCode className="h-3 w-3" />
                Feedback-Variante auswählen:
              </Label>
              <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Variante auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {allSubVariants.map(variant => (
                    <SelectItem key={variant.id} value={variant.id}>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-blue-600" />
                        <span className="font-mono font-bold">{variant.label}</span>
                        <span className="text-muted-foreground text-xs">
                          - {variant.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Variant Details & Actions */}
            {currentVariant && (
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-mono font-bold text-lg">
                      {currentVariant.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentVariant.description} • {currentVariant.stepCount} Steps
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(currentVariant.liveUrl, '_blank')}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Live ansehen
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(currentVariant.testerUrl)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Flow Tester
                  </Button>
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => {
                      // Open the live view with capture mode enabled for manual screenshot
                      const captureUrl = `${currentVariant.liveUrl}${currentVariant.liveUrl.includes('?') ? '&' : '?'}uc_capture=1&uc_step=1`;
                      window.open(captureUrl, '_blank');
                    }}
                  >
                    <Camera className="h-3 w-3 mr-1" />
                    Screenshots erfassen
                  </Button>
                </div>
              </div>
            )}

            {/* Quick list of all variants */}
            {!selectedVariant && (
              <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                <p className="font-medium mb-2">Verfügbare Varianten ({allSubVariants.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {allSubVariants.map(v => (
                    <span 
                      key={v.id} 
                      className="font-mono text-xs bg-background px-2 py-1 rounded border cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setSelectedVariant(v.id)}
                    >
                      {v.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Keine Varianten für diesen Flow</p>
            <p className="text-xs">Wähle einen anderen Flow oder erstelle eine Variante</p>
          </div>
        )}

        <Separator />

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={() => navigate(`/admin/tools?tab=calculator-review&flow=${encodeURIComponent(selectedFlow)}`)}
          >
            <Camera className="h-4 w-4" />
            Screenshot Tool
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={() => navigate('/flow-tester')}
          >
            <Play className="h-4 w-4" />
            Flow Tester
          </Button>
          <Button onClick={onNext} className="flex-1">
            Weiter zu Vergleich
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
