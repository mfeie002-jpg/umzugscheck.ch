import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Accessibility, 
  ZoomIn, 
  ZoomOut, 
  Type, 
  Contrast, 
  MousePointer,
  X,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 100,
    highContrast: false,
    largePointer: false,
    reducedMotion: false,
    dyslexicFont: false
  });

  const applySettings = () => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${settings.fontSize}%`;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Large pointer
    if (settings.largePointer) {
      root.classList.add('large-pointer');
    } else {
      root.classList.remove('large-pointer');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Dyslexic font
    if (settings.dyslexicFont) {
      root.classList.add('dyslexic-font');
    } else {
      root.classList.remove('dyslexic-font');
    }
  };

  const resetSettings = () => {
    setSettings({
      fontSize: 100,
      highContrast: false,
      largePointer: false,
      reducedMotion: false,
      dyslexicFont: false
    });
    document.documentElement.style.fontSize = '100%';
    document.documentElement.classList.remove(
      'high-contrast', 
      'large-pointer', 
      'reduce-motion', 
      'dyslexic-font'
    );
  };

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  // Apply settings when they change
  useState(() => {
    applySettings();
  });

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Barrierefreiheit-Optionen öffnen"
      >
        <Accessibility className="h-5 w-5" />
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-background border-l border-border z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Accessibility className="h-5 w-5" />
                    Barrierefreiheit
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Font Size */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Schriftgrösse
                      </Label>
                      <span className="text-sm font-medium">{settings.fontSize}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateSetting('fontSize', Math.max(80, settings.fontSize - 10))}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Slider
                        value={[settings.fontSize]}
                        onValueChange={([val]) => updateSetting('fontSize', val)}
                        min={80}
                        max={150}
                        step={10}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateSetting('fontSize', Math.min(150, settings.fontSize + 10))}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* High Contrast */}
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Contrast className="h-4 w-4" />
                      Hoher Kontrast
                    </Label>
                    <Switch
                      checked={settings.highContrast}
                      onCheckedChange={(val) => updateSetting('highContrast', val)}
                    />
                  </div>

                  {/* Large Pointer */}
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4" />
                      Grosser Mauszeiger
                    </Label>
                    <Switch
                      checked={settings.largePointer}
                      onCheckedChange={(val) => updateSetting('largePointer', val)}
                    />
                  </div>

                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      Weniger Animationen
                    </Label>
                    <Switch
                      checked={settings.reducedMotion}
                      onCheckedChange={(val) => updateSetting('reducedMotion', val)}
                    />
                  </div>

                  {/* Dyslexic Font */}
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      Legasthenie-Schrift
                    </Label>
                    <Switch
                      checked={settings.dyslexicFont}
                      onCheckedChange={(val) => updateSetting('dyslexicFont', val)}
                    />
                  </div>

                  {/* Apply & Reset */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={resetSettings}
                      className="flex-1"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Zurücksetzen
                    </Button>
                    <Button
                      onClick={() => {
                        applySettings();
                        setIsOpen(false);
                      }}
                      className="flex-1"
                    >
                      Anwenden
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
