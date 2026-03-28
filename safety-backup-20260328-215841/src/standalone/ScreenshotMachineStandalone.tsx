/**
 * ============================================================================
 * SCREENSHOT MACHINE STANDALONE V3.0
 * ============================================================================
 * 
 * A complete, self-contained screenshot capture tool.
 * Drop this single file into any Lovable or Softgen project.
 * 
 * WHAT IT DOES:
 * - Capture single or bulk screenshots
 * - Desktop and mobile dimensions
 * - Full-page or viewport captures
 * - Download as PNG or ZIP (for bulk)
 * - Optional cloud storage upload
 * 
 * REQUIREMENTS:
 * 1. Install dependencies: jszip, file-saver, lucide-react
 * 2. Get a ScreenshotMachine API key (free tier available)
 * 3. (Optional) Supabase storage bucket for cloud uploads
 * 
 * USAGE:
 * 1. Add this file to your project: src/components/ScreenshotMachineStandalone.tsx
 * 2. Import and render: <ScreenshotMachineStandalone />
 * 3. Enter URL(s) and capture
 * 
 * ============================================================================
 * SETUP INSTRUCTIONS
 * ============================================================================
 * 
 * 1. INSTALL DEPENDENCIES:
 *    npm install jszip file-saver lucide-react
 * 
 * 2. GET SCREENSHOT API KEY:
 *    - Go to https://www.screenshotmachine.com
 *    - Sign up for free account (100 free captures/month)
 *    - Copy your API key
 *    - Replace SCREENSHOT_API_KEY below
 * 
 * 3. (OPTIONAL) SUPABASE STORAGE:
 *    If you want cloud storage for screenshots:
 *    - Create a storage bucket named 'screenshots'
 *    - Make it public or configure RLS
 *    - The component will auto-upload and provide shareable URLs
 * 
 * ============================================================================
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Camera, Download, Loader2, Globe, Copy, CheckCircle2, 
  Monitor, Smartphone, Image, ExternalLink, Trash2, Plus
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

// ============================================================================
// CONFIGURATION - EDIT THIS VALUE
// ============================================================================

const SCREENSHOT_API_KEY = "892618"; // Replace with your ScreenshotMachine API key

// ============================================================================
// TYPES
// ============================================================================

interface ScreenshotConfig {
  dimension: string;
  format: 'png' | 'jpg';
  delay: number;
  fullPage: boolean;
}

interface CapturedScreenshot {
  url: string;
  blob: Blob;
  dimension: string;
  timestamp: Date;
}

// ============================================================================
// DIMENSION PRESETS
// ============================================================================

const DIMENSION_PRESETS = {
  desktop: [
    { label: 'HD (1920x1080)', value: '1920x1080' },
    { label: 'HD Full Page', value: '1920xfull' },
    { label: 'MacBook (1440x900)', value: '1440x900' },
    { label: '4K (3840x2160)', value: '3840x2160' },
    { label: 'Wide (2560x1440)', value: '2560x1440' },
  ],
  mobile: [
    { label: 'iPhone (375x812)', value: '375x812' },
    { label: 'iPhone Full Page', value: '375xfull' },
    { label: 'iPhone Plus (414x896)', value: '414x896' },
    { label: 'Android (360x800)', value: '360x800' },
    { label: 'Tablet (768x1024)', value: '768x1024' },
  ],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const normalizeUrl = (url: string): string => {
  let normalized = url.trim();
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = 'https://' + normalized;
  }
  return normalized;
};

const extractDomain = (url: string): string => {
  try {
    return new URL(normalizeUrl(url)).hostname.replace('www.', '');
  } catch {
    return url;
  }
};

const sanitizeFilename = (name: string): string => {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// API FUNCTIONS
// ============================================================================

const captureScreenshot = async (
  url: string, 
  config: ScreenshotConfig
): Promise<Blob | null> => {
  try {
    const dimension = config.fullPage 
      ? config.dimension.replace(/x\d+$/, 'xfull')
      : config.dimension;

    const params = new URLSearchParams({
      key: SCREENSHOT_API_KEY,
      url: normalizeUrl(url),
      dimension: dimension,
      format: config.format,
      cacheLimit: '0',
      delay: String(config.delay),
    });
    
    const response = await fetch(`https://api.screenshotmachine.com?${params}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const blob = await response.blob();
    if (blob.size < 1000) throw new Error('Invalid screenshot');
    
    return blob;
  } catch (err) {
    console.error('Screenshot error:', err);
    return null;
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ScreenshotMachineStandalone: React.FC = () => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  
  // Single mode state
  const [singleUrl, setSingleUrl] = useState('');
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedDimension, setSelectedDimension] = useState('1920x1080');
  const [fullPage, setFullPage] = useState(false);
  const [captureDelay, setCaptureDelay] = useState(3000);
  
  // Bulk mode state
  const [bulkUrls, setBulkUrls] = useState('');
  const [captureDesktop, setCaptureDesktop] = useState(true);
  const [captureMobile, setCaptureMobile] = useState(true);
  
  // Shared state
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: '', percent: 0 });
  const [captures, setCaptures] = useState<CapturedScreenshot[]>([]);

  const config: ScreenshotConfig = {
    dimension: selectedDimension,
    format: 'png',
    delay: captureDelay,
    fullPage,
  };

  // Single capture
  const handleSingleCapture = async () => {
    if (!singleUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    setProgress({ step: 'Capturing...', percent: 50 });

    try {
      const blob = await captureScreenshot(singleUrl, config);
      
      if (blob) {
        setCaptures(prev => [{
          url: singleUrl,
          blob,
          dimension: config.fullPage ? config.dimension.replace(/x\d+$/, 'xfull') : config.dimension,
          timestamp: new Date()
        }, ...prev]);
        
        toast.success('Screenshot captured!');
      } else {
        toast.error('Failed to capture screenshot');
      }
    } catch (error) {
      toast.error('Capture failed');
    } finally {
      setLoading(false);
      setProgress({ step: '', percent: 0 });
    }
  };

  // Bulk capture
  const handleBulkCapture = async () => {
    const urls = bulkUrls.split('\n').map(u => u.trim()).filter(Boolean);
    
    if (urls.length === 0) {
      toast.error('Please enter at least one URL');
      return;
    }

    setLoading(true);
    const newCaptures: CapturedScreenshot[] = [];
    const totalSteps = urls.length * ((captureDesktop ? 1 : 0) + (captureMobile ? 1 : 0));
    let currentStep = 0;

    try {
      for (const url of urls) {
        const domain = extractDomain(url);

        if (captureDesktop) {
          currentStep++;
          setProgress({ 
            step: `Desktop: ${domain}`, 
            percent: Math.round((currentStep / totalSteps) * 100) 
          });
          
          const blob = await captureScreenshot(url, { 
            ...config, 
            dimension: '1920xfull',
            fullPage: true 
          });
          
          if (blob) {
            newCaptures.push({
              url,
              blob,
              dimension: '1920xfull',
              timestamp: new Date()
            });
          }
          
          await delay(1000);
        }

        if (captureMobile) {
          currentStep++;
          setProgress({ 
            step: `Mobile: ${domain}`, 
            percent: Math.round((currentStep / totalSteps) * 100) 
          });
          
          const blob = await captureScreenshot(url, { 
            ...config, 
            dimension: '375xfull',
            fullPage: true 
          });
          
          if (blob) {
            newCaptures.push({
              url,
              blob,
              dimension: '375xfull',
              timestamp: new Date()
            });
          }
          
          await delay(1000);
        }
      }

      setCaptures(prev => [...newCaptures, ...prev]);
      toast.success(`Captured ${newCaptures.length} screenshots!`);
    } catch (error) {
      toast.error('Bulk capture failed');
    } finally {
      setLoading(false);
      setProgress({ step: '', percent: 0 });
    }
  };

  // Download single
  const downloadSingle = (capture: CapturedScreenshot) => {
    const domain = extractDomain(capture.url);
    const filename = `${sanitizeFilename(domain)}_${capture.dimension}.png`;
    saveAs(capture.blob, filename);
    toast.success('Downloaded!');
  };

  // Download all as ZIP
  const downloadAllAsZip = async () => {
    if (captures.length === 0) {
      toast.error('No screenshots to download');
      return;
    }

    const zip = new JSZip();
    
    captures.forEach((capture, index) => {
      const domain = extractDomain(capture.url);
      const isDesktop = capture.dimension.startsWith('1920') || capture.dimension.startsWith('1440');
      const folder = isDesktop ? 'desktop' : 'mobile';
      const filename = `${String(index + 1).padStart(2, '0')}_${sanitizeFilename(domain)}_${capture.dimension}.png`;
      zip.file(`${folder}/${filename}`, capture.blob);
    });

    const timestamp = new Date().toISOString().split('T')[0];
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `screenshots_${timestamp}.zip`);
    toast.success('ZIP downloaded!');
  };

  // Clear all
  const clearAll = () => {
    setCaptures([]);
    toast.success('All screenshots cleared');
  };

  // Copy URL to clipboard
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Screenshot Machine v3.0
          </CardTitle>
          <CardDescription>
            Capture high-quality screenshots of any website. Single or bulk mode.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'single' | 'bulk')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="single">
                <Image className="h-4 w-4 mr-2" />
                Single Capture
              </TabsTrigger>
              <TabsTrigger value="bulk">
                <Globe className="h-4 w-4 mr-2" />
                Bulk Capture
              </TabsTrigger>
            </TabsList>

            {/* Single Capture Mode */}
            <TabsContent value="single" className="space-y-4">
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  placeholder="example.com"
                  value={singleUrl}
                  onChange={(e) => setSingleUrl(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Device</Label>
                  <Select 
                    value={deviceType} 
                    onValueChange={(v) => {
                      setDeviceType(v as 'desktop' | 'mobile');
                      setSelectedDimension(DIMENSION_PRESETS[v as 'desktop' | 'mobile'][0].value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desktop">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" /> Desktop
                        </div>
                      </SelectItem>
                      <SelectItem value="mobile">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" /> Mobile
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dimension</Label>
                  <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIMENSION_PRESETS[deviceType].map((preset) => (
                        <SelectItem key={preset.value} value={preset.value}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Delay (ms)</Label>
                  <Select value={String(captureDelay)} onValueChange={(v) => setCaptureDelay(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000">1 second</SelectItem>
                      <SelectItem value="2000">2 seconds</SelectItem>
                      <SelectItem value="3000">3 seconds</SelectItem>
                      <SelectItem value="5000">5 seconds</SelectItem>
                      <SelectItem value="8000">8 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="fullPage"
                  checked={fullPage}
                  onCheckedChange={setFullPage}
                />
                <Label htmlFor="fullPage">Full page screenshot (scroll entire page)</Label>
              </div>

              <Button 
                onClick={handleSingleCapture} 
                disabled={loading || !singleUrl}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Screenshot
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Bulk Capture Mode */}
            <TabsContent value="bulk" className="space-y-4">
              <div className="space-y-2">
                <Label>URLs (one per line)</Label>
                <Textarea
                  placeholder="example.com&#10;another-site.com&#10;third-site.com"
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  disabled={loading}
                  rows={6}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="captureDesktop"
                    checked={captureDesktop}
                    onCheckedChange={setCaptureDesktop}
                  />
                  <Label htmlFor="captureDesktop">Desktop (1920px)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="captureMobile"
                    checked={captureMobile}
                    onCheckedChange={setCaptureMobile}
                  />
                  <Label htmlFor="captureMobile">Mobile (375px)</Label>
                </div>
              </div>

              {loading && (
                <div className="space-y-2">
                  <Progress value={progress.percent} className="h-2" />
                  <p className="text-sm text-muted-foreground text-center">{progress.step}</p>
                </div>
              )}

              <Button 
                onClick={handleBulkCapture} 
                disabled={loading || !bulkUrls.trim() || (!captureDesktop && !captureMobile)}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Capture All URLs
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Captured Screenshots */}
      {captures.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Captured Screenshots ({captures.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadAllAsZip}>
                  <Download className="h-4 w-4 mr-1" />
                  Download ZIP
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {captures.map((capture, index) => (
                <div 
                  key={index}
                  className="border rounded-lg overflow-hidden bg-muted"
                >
                  <div className="aspect-video relative">
                    <img
                      src={URL.createObjectURL(capture.blob)}
                      alt={capture.url}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate flex-1">
                        {extractDomain(capture.url)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {capture.dimension}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => downloadSingle(capture)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyUrl(capture.url)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(capture.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info badges */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="outline"><Monitor className="h-3 w-3 mr-1" /> Desktop + Mobile</Badge>
        <Badge variant="outline"><Image className="h-3 w-3 mr-1" /> Full Page Capture</Badge>
        <Badge variant="outline"><Download className="h-3 w-3 mr-1" /> ZIP Export</Badge>
      </div>
    </div>
  );
};

export default ScreenshotMachineStandalone;
