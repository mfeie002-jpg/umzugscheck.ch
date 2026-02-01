/**
 * A/B Comparison Lab
 * 
 * Multi-device simulator for comparing A/B test variants side-by-side
 * Like having multiple phones on a table - each independently scrollable/interactive
 */

import { useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Minus, Smartphone, Monitor, Tablet, Settings2, Copy, RefreshCw, Maximize2, Grid3X3, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// A/B Test Variant Definitions
const HOMEPAGE_VARIANTS = [
  { id: 'A', label: 'Original (Split)', description: 'Split-Layout mit Form rechts' },
  { id: 'B', label: 'Premium (4 Tabs)', description: '4 Tab-Optionen' },
  { id: 'C', label: 'SmartRouter', description: 'PLZ-first Wizard' },
];

const NAVIGATION_VARIANTS = Array.from({ length: 17 }, (_, i) => ({
  id: `V${i + 1}`,
  label: `Nav V${i + 1}`,
  description: `Navigation Variante ${i + 1}`,
}));

// All 28 Social Proof Variants (A-AB) matching SocialProofABContext
const SOCIAL_PROOF_VARIANTS = [
  // Standalone (A-F)
  { id: 'A', label: 'V1 Original', description: 'Farbige Logos' },
  { id: 'B', label: 'V2 Live Dashboard', description: 'Deal Cards, Activity Ticker' },
  { id: 'C', label: 'V3 Trust Hierarchy', description: 'Authority → Logic → Emotion' },
  { id: 'D', label: 'V4 Trust Stack', description: 'Kompakt mit Outcome-Tags' },
  { id: 'E', label: 'V5 Trust Strip 2.0', description: 'Unified Strip' },
  { id: 'F', label: 'V6 Verifiable Trust', description: 'ZEFIX, UID, Insurance' },
  // Hybrid/Swiss (G-H)
  { id: 'G', label: 'V7 Swiss Infrastructure', description: 'eUmzugCH, Post, ASTAG' },
  { id: 'H', label: 'V8 Minimal Proof Strip', description: 'Clean Grayscale Logos' },
  // Hero-Integrated (I-M)
  { id: 'I', label: 'V9 Card CTA Trust 🎯', description: 'Trust at CTA decision point' },
  { id: 'J', label: 'V10 Press Trust Bar', description: 'Desktop rail + Mobile inline' },
  { id: 'K', label: 'V11 Glassmorphism Bar', description: 'Premium overlay' },
  { id: 'L', label: 'V12 Hero Left + Form', description: 'Desktop left + Mobile footer' },
  { id: 'M', label: 'V13 Left Under CTA', description: 'Monochrome white logos' },
  // Psychological (N-Q)
  { id: 'N', label: 'V14 Bandwagon Effect', description: 'Live activity' },
  { id: 'O', label: 'V15 Local Trust', description: 'Regional badges' },
  { id: 'P', label: 'V16 Data Security', description: 'SSL, GDPR, Swiss Made' },
  { id: 'Q', label: 'V17 In-Form Container', description: 'Trust bar inside form' },
  // Research-Based (R-V)
  { id: 'R', label: 'V18 Scannable Grid', description: '4-card grid for quick scanning' },
  { id: 'S', label: 'V19 Hierarchy Strip', description: 'Micro-testimonial + core stats' },
  { id: 'T', label: 'V20 Comparison Preview', description: 'Visual price comparison' },
  { id: 'U', label: 'V21 Mobile-First Tabs', description: 'Tab interface for mobile' },
  { id: 'V', label: 'V22 Trust + Pain Combo', description: 'Pain points + solutions' },
  // CRO Patterns (W-AB)
  { id: 'W', label: 'V23 Trust Floor', description: 'Full-width bar at hero bottom' },
  { id: 'X', label: 'V24 Form Anchor', description: 'Trust in form card footer' },
  { id: 'Y', label: 'V25 Eyebrow Badge', description: 'Trust above main headline' },
  { id: 'Z', label: 'V26 Floating Cards', description: 'UI cards overlaying hero' },
  { id: 'AA', label: 'V27 Trust Ticker', description: 'Infinite scroll marquee' },
  { id: 'AB', label: 'V28 Glasmorphism Authority', description: 'Frosted glass premium bar' },
];

interface DeviceConfig {
  id: string;
  homepage: string;
  navigation: string;
  socialProof: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

const DEVICE_SIZES = {
  mobile: { width: 390, height: 844, label: 'iPhone 14' },
  tablet: { width: 820, height: 1180, label: 'iPad Air' },
  desktop: { width: 1280, height: 800, label: 'Desktop' },
};

const DEVICE_SCALE = {
  mobile: 0.55,
  tablet: 0.4,
  desktop: 0.35,
};

const generateDeviceId = () => `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const DEFAULT_DEVICE: () => DeviceConfig = () => ({
  id: generateDeviceId(),
  homepage: 'C',
  navigation: 'V10',
  socialProof: 'I',
  deviceType: 'mobile',
});

export default function ABComparisonLab() {
  const [devices, setDevices] = useState<DeviceConfig[]>([
    { ...DEFAULT_DEVICE(), id: 'device-1' },
    { ...DEFAULT_DEVICE(), id: 'device-2', socialProof: 'A' },
    { ...DEFAULT_DEVICE(), id: 'device-3', socialProof: 'B' },
  ]);
  
  const [activePreset, setActivePreset] = useState<string>('custom');
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});

  // Add a new device
  const addDevice = useCallback(() => {
    if (devices.length >= 8) return; // Max 8 devices
    setDevices(prev => [...prev, DEFAULT_DEVICE()]);
  }, [devices.length]);

  // Remove a device
  const removeDevice = useCallback((deviceId: string) => {
    if (devices.length <= 1) return; // Min 1 device
    setDevices(prev => prev.filter(d => d.id !== deviceId));
  }, [devices.length]);

  // Update device config
  const updateDevice = useCallback((deviceId: string, updates: Partial<DeviceConfig>) => {
    setDevices(prev => prev.map(d => 
      d.id === deviceId ? { ...d, ...updates } : d
    ));
  }, []);

  // Duplicate a device
  const duplicateDevice = useCallback((deviceId: string) => {
    if (devices.length >= 8) return;
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      setDevices(prev => [...prev, { ...device, id: generateDeviceId() }]);
    }
  }, [devices]);

  // Refresh a specific device
  const refreshDevice = useCallback((deviceId: string) => {
    const iframe = iframeRefs.current[deviceId];
    if (iframe) {
      iframe.src = iframe.src;
    }
  }, []);

  // Randomize all 3 variants for a device
  const randomizeDevice = useCallback((deviceId: string) => {
    const randomHomepage = HOMEPAGE_VARIANTS[Math.floor(Math.random() * HOMEPAGE_VARIANTS.length)].id;
    const randomNavigation = NAVIGATION_VARIANTS[Math.floor(Math.random() * NAVIGATION_VARIANTS.length)].id;
    const randomSocialProof = SOCIAL_PROOF_VARIANTS[Math.floor(Math.random() * SOCIAL_PROOF_VARIANTS.length)].id;
    
    updateDevice(deviceId, {
      homepage: randomHomepage,
      navigation: randomNavigation,
      socialProof: randomSocialProof,
    });
  }, [updateDevice]);

  // Build URL with variant params
  const buildDeviceUrl = useCallback((device: DeviceConfig) => {
    const params = new URLSearchParams({
      'ab-homepage': device.homepage,
      'ab-nav': device.navigation,
      'ab-social': device.socialProof,
      'ab-lab': '1', // Flag to hide the A/B toggle
    });
    return `/?${params.toString()}`;
  }, []);

  // Presets
  const applyPreset = useCallback((preset: string) => {
    setActivePreset(preset);
    switch (preset) {
      case 'social-all':
        // Show all social proof variants
        setDevices(SOCIAL_PROOF_VARIANTS.slice(0, 6).map((sp, idx) => ({
          id: `device-${idx + 1}`,
          homepage: 'C',
          navigation: 'V10',
          socialProof: sp.id,
          deviceType: 'mobile' as const,
        })));
        break;
      case 'nav-top5':
        // Show top 5 navigation variants
        setDevices(['V10', 'V15', 'V1', 'V5', 'V17'].map((nav, idx) => ({
          id: `device-${idx + 1}`,
          homepage: 'C',
          navigation: nav,
          socialProof: 'I',
          deviceType: 'mobile' as const,
        })));
        break;
      case 'hero-all':
        // Show all hero variants
        setDevices(HOMEPAGE_VARIANTS.map((hp, idx) => ({
          id: `device-${idx + 1}`,
          homepage: hp.id,
          navigation: 'V10',
          socialProof: 'I',
          deviceType: 'mobile' as const,
        })));
        break;
      case 'responsive':
        // Show same config on different devices
        setDevices([
          { id: 'device-1', homepage: 'C', navigation: 'V10', socialProof: 'I', deviceType: 'mobile' },
          { id: 'device-2', homepage: 'C', navigation: 'V10', socialProof: 'I', deviceType: 'tablet' },
          { id: 'device-3', homepage: 'C', navigation: 'V10', socialProof: 'I', deviceType: 'desktop' },
        ]);
        break;
      default:
        setActivePreset('custom');
    }
  }, []);

  // Get short label for device
  const getDeviceLabel = (device: DeviceConfig) => {
    return `H${device.homepage}-N${device.navigation.replace('V', '')}-S${device.socialProof}`;
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-muted/30">
        <Helmet>
          <title>A/B Comparison Lab | Internal</title>
        </Helmet>

        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5 text-primary" />
                  A/B Comparison Lab
                </h1>
                <p className="text-xs text-muted-foreground">
                  {devices.length} Device{devices.length !== 1 ? 's' : ''} • Drag to scroll each
                </p>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Presets:</span>
                <Button
                  variant={activePreset === 'social-all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyPreset('social-all')}
                  className="h-7 text-xs"
                >
                  Social V1-V6
                </Button>
                <Button
                  variant={activePreset === 'nav-top5' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyPreset('nav-top5')}
                  className="h-7 text-xs"
                >
                  Top Nav
                </Button>
                <Button
                  variant={activePreset === 'hero-all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyPreset('hero-all')}
                  className="h-7 text-xs"
                >
                  All Heroes
                </Button>
                <Button
                  variant={activePreset === 'responsive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyPreset('responsive')}
                  className="h-7 text-xs"
                >
                  Responsive
                </Button>
              </div>

              {/* Add Device */}
              <Button
                onClick={addDevice}
                disabled={devices.length >= 8}
                size="sm"
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Device
              </Button>
            </div>
          </div>
        </div>

        {/* Device Grid */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {devices.map((device) => {
              const size = DEVICE_SIZES[device.deviceType];
              const scale = DEVICE_SCALE[device.deviceType];
              
              return (
                <div 
                  key={device.id} 
                  className="snap-center flex-shrink-0"
                  style={{ width: size.width * scale + 32 }}
                >
                  <Card className="overflow-hidden bg-background">
                    {/* Device Header */}
                    <div className="p-2 bg-muted/50 border-b space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          {getDeviceLabel(device)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => randomizeDevice(device.id)}
                              >
                                <Shuffle className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Randomize</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => duplicateDevice(device.id)}
                                disabled={devices.length >= 8}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Duplizieren</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => refreshDevice(device.id)}
                              >
                                <RefreshCw className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Refresh</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={() => removeDevice(device.id)}
                                disabled={devices.length <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Entfernen</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Variant Selectors */}
                      <div className="grid grid-cols-3 gap-1">
                        {/* Homepage */}
                        <Select
                          value={device.homepage}
                          onValueChange={(v) => updateDevice(device.id, { homepage: v })}
                        >
                          <SelectTrigger className="h-7 text-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {HOMEPAGE_VARIANTS.map((hp) => (
                              <SelectItem key={hp.id} value={hp.id} className="text-xs">
                                H{hp.id}: {hp.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Navigation */}
                        <Select
                          value={device.navigation}
                          onValueChange={(v) => updateDevice(device.id, { navigation: v })}
                        >
                          <SelectTrigger className="h-7 text-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {NAVIGATION_VARIANTS.map((nav) => (
                              <SelectItem key={nav.id} value={nav.id} className="text-xs">
                                {nav.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Social Proof */}
                        <Select
                          value={device.socialProof}
                          onValueChange={(v) => updateDevice(device.id, { socialProof: v })}
                        >
                          <SelectTrigger className="h-7 text-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SOCIAL_PROOF_VARIANTS.map((sp) => (
                              <SelectItem key={sp.id} value={sp.id} className="text-xs">
                                S{sp.id}: {sp.label.replace(/^V\d+\s*/, '')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Device Type */}
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant={device.deviceType === 'mobile' ? 'default' : 'ghost'}
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateDevice(device.id, { deviceType: 'mobile' })}
                        >
                          <Smartphone className="w-3 h-3" />
                        </Button>
                        <Button
                          variant={device.deviceType === 'tablet' ? 'default' : 'ghost'}
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateDevice(device.id, { deviceType: 'tablet' })}
                        >
                          <Tablet className="w-3 h-3" />
                        </Button>
                        <Button
                          variant={device.deviceType === 'desktop' ? 'default' : 'ghost'}
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateDevice(device.id, { deviceType: 'desktop' })}
                        >
                          <Monitor className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Device Frame */}
                    <div 
                      className="relative bg-black rounded-b-2xl overflow-hidden"
                      style={{ 
                        width: size.width * scale + 16,
                        height: size.height * scale + 16,
                        padding: 8,
                      }}
                    >
                      {/* Phone Notch (mobile only) */}
                      {device.deviceType === 'mobile' && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl z-10" />
                      )}

                      {/* Iframe Container */}
                      <div 
                        className="relative overflow-hidden rounded-lg bg-white"
                        style={{ 
                          width: size.width * scale,
                          height: size.height * scale,
                        }}
                      >
                        <iframe
                          ref={(el) => { iframeRefs.current[device.id] = el; }}
                          src={buildDeviceUrl(device)}
                           // Isolate each simulator instance to avoid shared localStorage/auth races
                           // when multiple devices are rendered in parallel.
                           // IMPORTANT: We intentionally omit `allow-same-origin`.
                           sandbox="allow-scripts allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-downloads"
                           loading="lazy"
                          className="absolute top-0 left-0 origin-top-left"
                          style={{
                            width: size.width,
                            height: size.height,
                            transform: `scale(${scale})`,
                            border: 'none',
                          }}
                          title={`Device ${device.id}`}
                        />
                      </div>

                      {/* Home Indicator (mobile only) */}
                      {device.deviceType === 'mobile' && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/30 rounded-full" />
                      )}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend / Help */}
        <div className="container mx-auto px-4 pb-8">
          <Card className="p-4 bg-muted/30">
            <h3 className="font-semibold text-sm mb-2">Quick Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div>
                <strong className="text-foreground">Homepage (H):</strong>
                <ul className="mt-1 space-y-0.5">
                  <li>A = Original Split</li>
                  <li>B = Premium 4-Tabs</li>
                  <li>C = SmartRouter (PLZ)</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Navigation (N):</strong>
                <ul className="mt-1 space-y-0.5">
                  <li>V1 = Original (Status Quo)</li>
                  <li>V10 = Golden Navigation</li>
                  <li>V15 = Mobile-First</li>
                  <li>... (17 total)</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Social Proof (S):</strong>
                <ul className="mt-1 space-y-0.5">
                  <li>A-F = Standalone Sections</li>
                  <li>G-H = Swiss-specific</li>
                  <li>I-M = Hero-Integrated (Best 5)</li>
                  <li>N-Q = Psychological Triggers</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
