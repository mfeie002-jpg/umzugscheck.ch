/**
 * A/B Comparison Lab
 * 
 * Multi-device simulator for comparing A/B test variants side-by-side
 * Like having multiple phones on a table - each independently scrollable/interactive
 */

import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Minus, Smartphone, Monitor, Tablet, Settings2, Copy, RefreshCw, Maximize2, Grid3X3, Shuffle, Loader2, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
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

// Page variants - dedicated homepage versions for testing
const PAGE_VARIANTS = [
  { id: 'index', label: '— Index (A/B)', description: 'Standard Homepage mit A/B Params', path: '/' },
  { id: 'homepage-1', label: 'Homepage 1', description: 'Trust/Social Proof Focus', path: '/homepage-1' },
  { id: 'homepage-2', label: 'Homepage 2', description: 'Institutional Trust (HEV, SFTA)', path: '/homepage-2' },
  { id: 'homepage-3', label: 'Homepage 3', description: 'Emotional Design & Accessibility', path: '/homepage-3' },
  { id: 'homepage-4', label: 'Homepage 4', description: 'Personalization & Seasonality', path: '/homepage-4' },
  { id: 'homepage-5', label: 'Homepage 5', description: 'Regulatory Architecture (SRO)', path: '/homepage-5' },
  { id: 'homepage-6', label: 'Homepage 6', description: 'Premium Trust & Team', path: '/homepage-6' },
];

// Trust Landing Page Variants (dedicated test pages)
const TRUST_LANDING_VARIANTS = [
  { id: 'none', label: '— Keine', description: 'Standard Page' },
  { id: 'v1', label: 'T1 Behörden', description: 'Zefix/UID staatliche Autorität' },
  { id: 'v2', label: 'T2 Branchen', description: 'ASTAG/SMA Verbands-Legitimität' },
  { id: 'v3', label: 'T3 Konsumenten', description: 'Käuferschutz & Garantien' },
  { id: 'v4', label: 'T4 Synthese', description: 'Best-Of psychologisch optimiert' },
];

// Flow Variants - All Offerten Flows grouped by family
const FLOW_VARIANTS = [
  // Default (Homepage)
  { id: 'none', label: '— Homepage', path: null, group: 'default' },
  
  // V1 Familie
  { id: 'v1', label: 'V1 Control', path: '/umzugsofferten-v1', group: 'v1' },
  { id: 'v1a', label: 'V1a Feedback', path: '/umzugsofferten-v1a', group: 'v1' },
  { id: 'v1b', label: 'V1b ChatGPT', path: '/umzugsofferten-v1b', group: 'v1' },
  { id: 'v1c', label: 'V1c Strategic', path: '/umzugsofferten-v1c', group: 'v1' },
  { id: 'v1d', label: 'V1d Optimized', path: '/umzugsofferten-v1d', group: 'v1' },
  { id: 'v1e', label: 'V1e Enhanced', path: '/umzugsofferten-v1e', group: 'v1' },
  { id: 'v1f', label: 'V1f Sticky CTA', path: '/umzugsofferten-v1f', group: 'v1' },
  { id: 'v1g', label: 'V1g Trust Pills', path: '/umzugsofferten-v1g', group: 'v1' },
  
  // V2 Familie
  { id: 'v2', label: 'V2 Premium', path: '/umzugsofferten-v2', group: 'v2' },
  { id: 'v2a', label: 'V2a Variant', path: '/umzugsofferten-v2a', group: 'v2' },
  { id: 'v2b', label: 'V2b Variant', path: '/umzugsofferten-v2b', group: 'v2' },
  { id: 'v2c', label: 'V2c Variant', path: '/umzugsofferten-v2c', group: 'v2' },
  { id: 'v2d', label: 'V2d Variant', path: '/umzugsofferten-v2d', group: 'v2' },
  { id: 'v2f', label: 'V2f Variant', path: '/umzugsofferten-v2f', group: 'v2' },
  { id: 'v2-archetyp', label: 'V2 Archetyp', path: '/umzugsofferten-v2-archetyp', group: 'v2' },
  
  // V3 Familie
  { id: 'v3', label: 'V3 Expanded', path: '/umzugsofferten-v3', group: 'v3' },
  { id: 'v3a', label: 'V3a Variant', path: '/umzugsofferten-v3a', group: 'v3' },
  { id: 'v3b', label: 'V3b Variant', path: '/umzugsofferten-v3b', group: 'v3' },
  { id: 'v3c', label: 'V3c Variant', path: '/umzugsofferten-v3c', group: 'v3' },
  { id: 'v3d', label: 'V3d Variant', path: '/umzugsofferten-v3d', group: 'v3' },
  { id: 'v3e', label: 'V3e Variant', path: '/umzugsofferten-v3e', group: 'v3' },
  
  // V4 Familie
  { id: 'v4', label: 'V4 Full', path: '/umzugsofferten-v4', group: 'v4' },
  { id: 'v4a', label: 'V4a Variant', path: '/umzugsofferten-v4a', group: 'v4' },
  { id: 'v4b', label: 'V4b Variant', path: '/umzugsofferten-v4b', group: 'v4' },
  { id: 'v4c', label: 'V4c Variant', path: '/umzugsofferten-v4c', group: 'v4' },
  { id: 'v4d', label: 'V4d Variant', path: '/umzugsofferten-v4d', group: 'v4' },
  { id: 'v4e', label: 'V4e Variant', path: '/umzugsofferten-v4e', group: 'v4' },
  { id: 'v4f', label: 'V4f Variant', path: '/umzugsofferten-v4f', group: 'v4' },
  
  // V5 Familie (Marketplace)
  { id: 'v5', label: 'V5 Marketplace', path: '/umzugsofferten-v5', group: 'v5' },
  { id: 'v5a', label: 'V5a Variant', path: '/umzugsofferten-v5a', group: 'v5' },
  { id: 'v5b', label: 'V5b Funnel', path: '/umzugsofferten-v5b', group: 'v5' },
  { id: 'v5c', label: 'V5c Variant', path: '/umzugsofferten-v5c', group: 'v5' },
  { id: 'v5d', label: 'V5d Variant', path: '/umzugsofferten-v5d', group: 'v5' },
  { id: 'v5e', label: 'V5e Variant', path: '/umzugsofferten-v5e', group: 'v5' },
  { id: 'v5f', label: 'V5f Feedback', path: '/umzugsofferten-v5f', group: 'v5' },
  
  // V6 Familie (Ultimate)
  { id: 'v6', label: 'V6 Ultimate', path: '/umzugsofferten-v6', group: 'v6' },
  { id: 'v6a', label: 'V6a Optimized', path: '/umzugsofferten-v6a', group: 'v6' },
  { id: 'v6b', label: 'V6b Variant', path: '/umzugsofferten-v6b', group: 'v6' },
  { id: 'v6c', label: 'V6c Variant', path: '/umzugsofferten-v6c', group: 'v6' },
  { id: 'v6d', label: 'V6d Variant', path: '/umzugsofferten-v6d', group: 'v6' },
  { id: 'v6e', label: 'V6e Variant', path: '/umzugsofferten-v6e', group: 'v6' },
  { id: 'v6f', label: 'V6f Best-of-All', path: '/umzugsofferten-v6f', group: 'v6' },
  
  // V7 Familie
  { id: 'v7', label: 'V7 Comprehensive', path: '/umzugsofferten-v7', group: 'v7' },
  { id: 'v7a', label: 'V7a Variant', path: '/umzugsofferten-v7a', group: 'v7' },
  
  // V8 Familie (Decision-Free)
  { id: 'v8', label: 'V8 Decision-Free', path: '/umzugsofferten-v8', group: 'v8' },
  { id: 'v8a', label: 'V8a Feedback', path: '/umzugsofferten-v8a', group: 'v8' },
  
  // V9 Familie (Zero Friction)
  { id: 'v9', label: 'V9 Zero Friction', path: '/umzugsofferten-v9', group: 'v9' },
  { id: 'v9a', label: 'V9a Variant', path: '/umzugsofferten-v9a', group: 'v9' },
  { id: 'v9b', label: 'V9b Variant', path: '/umzugsofferten-v9b', group: 'v9' },
  { id: 'v9c', label: 'V9c Optimized', path: '/umzugsofferten-v9c', group: 'v9' },
  { id: 'v9d', label: 'V9d Variant', path: '/umzugsofferten-v9d', group: 'v9' },
  
  // ChatGPT Flows
  { id: 'chatgpt-1', label: 'ChatGPT Flow 1', path: '/chatgpt-flow-1', group: 'chatgpt' },
  { id: 'chatgpt-2', label: 'ChatGPT Flow 2', path: '/chatgpt-flow-2', group: 'chatgpt' },
  { id: 'chatgpt-3', label: 'ChatGPT Flow 3', path: '/chatgpt-flow-3', group: 'chatgpt' },
  
  // Swiss Premium Flows
  { id: 'swiss-premium', label: 'Swiss Premium Choice ⭐', path: '/swiss-premium-choice', group: 'premium' },
  { id: 'swiss-lightning', label: 'Swiss Lightning ⚡', path: '/swiss-lightning', group: 'premium' },
  { id: 'swiss-concierge', label: 'Swiss Concierge Hybrid', path: '/swiss-concierge-hybrid', group: 'premium' },
  
  // Ultimate / Golden
  { id: 'ultimate-best36', label: 'Ultimate Best36 🏆', path: '/umzugsofferten-ultimate-best36', group: 'ultimate' },
  { id: 'ultimate-v7', label: 'Ultimate V7', path: '/umzugsofferten-ultimate-v7', group: 'ultimate' },
  { id: 'golden-v10', label: 'V10 Golden Flow ✨', path: '/golden-flow-v10', group: 'ultimate' },
];

// Flow group labels for UI
const FLOW_GROUPS = {
  default: 'Standard',
  v1: 'V1 Familie',
  v2: 'V2 Familie',
  v3: 'V3 Familie',
  v4: 'V4 Familie',
  v5: 'V5 Marketplace',
  v6: 'V6 Ultimate',
  v7: 'V7 Familie',
  v8: 'V8 Decision-Free',
  v9: 'V9 Zero Friction',
  chatgpt: 'ChatGPT Flows',
  premium: 'Swiss Premium',
  ultimate: 'Ultimate & Golden',
} as const;

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
  page: string; // 'index' or 'homepage-1' to 'homepage-6'
  homepage: string; // A/B/C variant (only used when page='index')
  navigation: string;
  socialProof: string;
  trustLanding: string; // 'none' = Normal page, 'v1'-'v4' = Trust Landing Pages
  flow: string; // 'none' = Homepage, or flow variant ID
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

// Staggered load delay per device (ms)
const STAGGER_DELAY_MS = 400;

const generateDeviceId = () => `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const DEFAULT_DEVICE: () => DeviceConfig = () => ({
  id: generateDeviceId(),
  page: 'index',
  homepage: 'C',
  navigation: 'V10',
  socialProof: 'I',
  trustLanding: 'none',
  flow: 'none',
  deviceType: 'mobile',
});

/**
 * Lazy-loaded iframe component that only loads when scheduled
 * Uses staggered loading to prevent simultaneous network requests
 */
interface LazyDeviceIframeProps {
  device: DeviceConfig;
  url: string;
  index: number;
  iframeRef: (el: HTMLIFrameElement | null) => void;
}

const LazyDeviceIframe = memo(({ device, url, index, iframeRef }: LazyDeviceIframeProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(index === 0); // First device loads immediately
  const size = DEVICE_SIZES[device.deviceType];
  const scale = DEVICE_SCALE[device.deviceType];

  // Staggered loading: each device waits for its turn
  useEffect(() => {
    if (index === 0) {
      setShouldLoad(true);
      return;
    }

    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, index * STAGGER_DELAY_MS);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className="relative overflow-hidden rounded-lg bg-white"
      style={{ 
        width: size.width * scale,
        height: size.height * scale,
      }}
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <span className="text-xs text-muted-foreground">
            {shouldLoad ? 'Laden...' : `Wartet... (${index + 1})`}
          </span>
        </div>
      )}
      
      {shouldLoad && (
        <iframe
          ref={iframeRef}
          src={url}
          className="absolute top-0 left-0 origin-top-left transition-opacity duration-300"
          style={{
            width: size.width,
            height: size.height,
            transform: `scale(${scale})`,
            border: 'none',
            opacity: isLoaded ? 1 : 0,
          }}
          title={`Device ${device.id}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
});

export default function ABComparisonLab() {
  // Default: 5 devices with different pages/variants for comparison
  const [devices, setDevices] = useState<DeviceConfig[]>([
    { ...DEFAULT_DEVICE(), id: 'device-1', page: 'index', homepage: 'B', socialProof: 'I' },
    { ...DEFAULT_DEVICE(), id: 'device-2', page: 'homepage-1', socialProof: 'A' },
    { ...DEFAULT_DEVICE(), id: 'device-3', page: 'homepage-3', socialProof: 'B' },
    { ...DEFAULT_DEVICE(), id: 'device-4', page: 'homepage-5', socialProof: 'D', navigation: 'V15' },
    { ...DEFAULT_DEVICE(), id: 'device-5', page: 'homepage-6', socialProof: 'F', navigation: 'V1' },
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

  // Randomize all variants for a device
  const randomizeDevice = useCallback((deviceId: string) => {
    const randomPage = PAGE_VARIANTS[Math.floor(Math.random() * PAGE_VARIANTS.length)].id;
    const randomHomepage = HOMEPAGE_VARIANTS[Math.floor(Math.random() * HOMEPAGE_VARIANTS.length)].id;
    const randomNavigation = NAVIGATION_VARIANTS[Math.floor(Math.random() * NAVIGATION_VARIANTS.length)].id;
    const randomSocialProof = SOCIAL_PROOF_VARIANTS[Math.floor(Math.random() * SOCIAL_PROOF_VARIANTS.length)].id;
    const randomTrustLanding = TRUST_LANDING_VARIANTS[Math.floor(Math.random() * TRUST_LANDING_VARIANTS.length)].id;
    const randomFlow = FLOW_VARIANTS[Math.floor(Math.random() * FLOW_VARIANTS.length)].id;
    
    updateDevice(deviceId, {
      page: randomPage,
      homepage: randomHomepage,
      navigation: randomNavigation,
      socialProof: randomSocialProof,
      trustLanding: randomTrustLanding,
      flow: randomFlow,
    });
  }, [updateDevice]);

  /**
   * Build URL with variant params.
   * IMPORTANT: In Lovable preview, the page access token is passed via query params.
   * If we don't forward that token, the iframe requests can render blank.
   */
  const buildDeviceUrl = useCallback((device: DeviceConfig) => {
    const baseParams = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search : ''
    );

    // Always force lab mode for iframes
    baseParams.set('ab-lab', '1');
    baseParams.set('ab-nav', device.navigation);
    baseParams.set('ab-social', device.socialProof);

    // If a flow is selected, navigate directly to that flow
    if (device.flow && device.flow !== 'none') {
      const flowConfig = FLOW_VARIANTS.find(f => f.id === device.flow);
      if (flowConfig?.path) {
        return `${flowConfig.path}?${baseParams.toString()}`;
      }
    }

    // If a trust landing page is selected, navigate directly to that page
    if (device.trustLanding && device.trustLanding !== 'none') {
      return `/test/trust-${device.trustLanding}?${baseParams.toString()}`;
    }

    // Find the page config
    const pageConfig = PAGE_VARIANTS.find(p => p.id === device.page);
    const pagePath = pageConfig?.path || '/';

    // For index page, add homepage A/B variant
    if (device.page === 'index') {
      baseParams.set('ab-homepage', device.homepage);
    }

    return `${pagePath}?${baseParams.toString()}`;
  }, []);

  // Presets
  const applyPreset = useCallback((preset: string) => {
    setActivePreset(preset);
    switch (preset) {
      case 'pages-all':
        // Show all 6 homepage variants + index
        setDevices(PAGE_VARIANTS.slice(0, 6).map((p, idx) => ({
          id: `device-${idx + 1}`,
          page: p.id,
          homepage: 'B',
          navigation: 'V10',
          socialProof: 'I',
          trustLanding: 'none',
          flow: 'none',
          deviceType: 'mobile' as const,
        })));
        break;
      case 'social-all':
        // Show all social proof variants
        setDevices(SOCIAL_PROOF_VARIANTS.slice(0, 6).map((sp, idx) => ({
          id: `device-${idx + 1}`,
          page: 'index',
          homepage: 'C',
          navigation: 'V10',
          socialProof: sp.id,
          trustLanding: 'none',
          flow: 'none',
          deviceType: 'mobile' as const,
        })));
        break;
      case 'nav-top5':
        // Show top 5 navigation variants
        setDevices(['V10', 'V15', 'V1', 'V5', 'V17'].map((nav, idx) => ({
          id: `device-${idx + 1}`,
          page: 'index',
          homepage: 'C',
          navigation: nav,
          socialProof: 'I',
          trustLanding: 'none',
          flow: 'none',
          deviceType: 'mobile' as const,
        })));
        break;
      case 'hero-all':
        // Show all hero variants
        setDevices(HOMEPAGE_VARIANTS.map((hp, idx) => ({
          id: `device-${idx + 1}`,
          page: 'index',
          homepage: hp.id,
          navigation: 'V10',
          socialProof: 'I',
          trustLanding: 'none',
          flow: 'none',
          deviceType: 'mobile' as const,
        })));
        break;
      case 'trust-all':
        // Show all 4 Trust Landing Pages
        setDevices(TRUST_LANDING_VARIANTS.filter(t => t.id !== 'none').map((t, idx) => ({
          id: `device-${idx + 1}`,
          page: 'index',
          homepage: 'C',
          navigation: 'V10',
          socialProof: 'I',
          trustLanding: t.id,
          flow: 'none',
          deviceType: 'mobile' as const,
        })));
        break;
      case 'responsive':
        // Show same config on different devices
        setDevices([
          { id: 'device-1', page: 'index', homepage: 'C', navigation: 'V10', socialProof: 'I', trustLanding: 'none', flow: 'none', deviceType: 'mobile' as const },
          { id: 'device-2', page: 'index', homepage: 'C', navigation: 'V10', socialProof: 'I', trustLanding: 'none', flow: 'none', deviceType: 'tablet' as const },
          { id: 'device-3', page: 'index', homepage: 'C', navigation: 'V10', socialProof: 'I', trustLanding: 'none', flow: 'none', deviceType: 'desktop' as const },
        ]);
        break;
      // NEW: Flow Presets
      case 'top-flows':
        // Top 5 best-performing flows based on ChatGPT analysis
        setDevices([
          { id: 'device-1', page: 'index', homepage: 'C', navigation: 'V10', socialProof: 'I', trustLanding: 'none', flow: 'chatgpt-1', deviceType: 'mobile' as const },
          { id: 'device-2', page: 'index', homepage: 'C', navigation: 'V10', socialProof: 'I', trustLanding: 'none', flow: 'v8a', deviceType: 'mobile' as const },
          { id: 'device-3', page: 'index', homepage: 'C', navigation: 'V10', socialProof: 'I', trustLanding: 'none', flow: 'v1f', deviceType: 'mobile' as const },
          { id: 'device-4', page: 'index', homepage: 'C', navigation: 'V10', socialProof: 'I', trustLanding: 'none', flow: 'ultimate-best36', deviceType: 'mobile' as const },
          { id: 'device-5', page: 'index', homepage: 'C', navigation: 'V10', socialProof: 'I', trustLanding: 'none', flow: 'golden-v10', deviceType: 'mobile' as const },
        ]);
        break;
      case 'v1-family':
        // V1 sub-variants comparison
        setDevices(FLOW_VARIANTS.filter(f => f.group === 'v1').slice(0, 6).map((f, idx) => ({
          id: `device-${idx + 1}`,
          page: 'index',
          homepage: 'C',
          navigation: 'V10',
          socialProof: 'I',
          trustLanding: 'none',
          flow: f.id,
          deviceType: 'mobile' as const,
        })));
        break;
      case 'premium-flows':
        // Premium & ChatGPT flows
        setDevices([
          { id: 'device-1', page: 'index', homepage: 'C', navigation: 'V10', socialProof: 'I', trustLanding: 'none', flow: 'swiss-premium', deviceType: 'mobile' as const },
          { id: 'device-2', page: 'index', homepage: 'C', navigation: 'V10', socialProof: 'I', trustLanding: 'none', flow: 'swiss-lightning', deviceType: 'mobile' as const },
          { id: 'device-3', page: 'index', homepage: 'C', navigation: 'V10', socialProof: 'I', trustLanding: 'none', flow: 'swiss-concierge', deviceType: 'mobile' as const },
          { id: 'device-4', page: 'index', homepage: 'C', navigation: 'V10', socialProof: 'I', trustLanding: 'none', flow: 'chatgpt-1', deviceType: 'mobile' as const },
          { id: 'device-5', page: 'index', homepage: 'C', navigation: 'V10', socialProof: 'I', trustLanding: 'none', flow: 'chatgpt-2', deviceType: 'mobile' as const },
        ]);
        break;
      default:
        setActivePreset('custom');
    }
  }, []);

  // Get short label for device
  const getDeviceLabel = (device: DeviceConfig) => {
    // If a flow is selected, show flow label
    if (device.flow && device.flow !== 'none') {
      const flowConfig = FLOW_VARIANTS.find(f => f.id === device.flow);
      const flowLabel = flowConfig?.label.replace(/\s*[⭐⚡🏆✨]/g, '').substring(0, 12) || device.flow;
      return `${flowLabel}-N${device.navigation.replace('V', '')}`;
    }
    
    if (device.trustLanding && device.trustLanding !== 'none') {
      return `Trust-${device.trustLanding.toUpperCase()}`;
    }
    const pageLabel = device.page === 'index' ? `H${device.homepage}` : device.page.replace('homepage-', 'HP');
    return `${pageLabel}-N${device.navigation.replace('V', '')}-S${device.socialProof}`;
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
                  variant={activePreset === 'pages-all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyPreset('pages-all')}
                  className="h-7 text-xs"
                >
                  HP 1-6
                </Button>
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
                  variant={activePreset === 'trust-all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyPreset('trust-all')}
                  className="h-7 text-xs"
                >
                  Trust V1-V4
                </Button>
                <Button
                  variant={activePreset === 'responsive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyPreset('responsive')}
                  className="h-7 text-xs"
                >
                  Responsive
                </Button>
                
                {/* Flow Presets - with visual separator */}
                <div className="h-4 w-px bg-border mx-1" />
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Flows:
                </span>
                <Button
                  variant={activePreset === 'top-flows' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyPreset('top-flows')}
                  className="h-7 text-xs gap-1"
                >
                  <Star className="w-3 h-3" />
                  Top 5
                </Button>
                <Button
                  variant={activePreset === 'v1-family' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyPreset('v1-family')}
                  className="h-7 text-xs"
                >
                  V1 Familie
                </Button>
                <Button
                  variant={activePreset === 'premium-flows' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyPreset('premium-flows')}
                  className="h-7 text-xs"
                >
                  Premium
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
            {devices.map((device, index) => {
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

                      {/* Flow Selector (NEW) */}
                      <div className="mb-1">
                        <Select
                          value={device.flow}
                          onValueChange={(v) => updateDevice(device.id, { flow: v })}
                        >
                          <SelectTrigger className={cn(
                            "h-7 text-[10px]",
                            device.flow !== 'none' && "border-primary bg-primary/5"
                          )}>
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-primary" />
                              <SelectValue placeholder="Flow wählen..." />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="max-h-80">
                            {Object.entries(FLOW_GROUPS).map(([groupId, groupLabel]) => {
                              const groupFlows = FLOW_VARIANTS.filter(f => f.group === groupId);
                              if (groupFlows.length === 0) return null;
                              return (
                                <SelectGroup key={groupId}>
                                  <SelectLabel className="text-[10px] font-semibold text-muted-foreground">
                                    {groupLabel}
                                  </SelectLabel>
                                  {groupFlows.map((flow) => (
                                    <SelectItem key={flow.id} value={flow.id} className="text-xs">
                                      {flow.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Page/Trust Selectors (disabled when flow is active) */}
                      <div className={cn(
                        "grid grid-cols-2 gap-1 mb-1",
                        device.flow !== 'none' && "opacity-50 pointer-events-none"
                      )}>
                        {/* Page Selector */}
                        <Select
                          value={device.page}
                          onValueChange={(v) => updateDevice(device.id, { page: v })}
                          disabled={device.flow !== 'none'}
                        >
                          <SelectTrigger className="h-7 text-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PAGE_VARIANTS.map((p) => (
                              <SelectItem key={p.id} value={p.id} className="text-xs">
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Trust Landing Page */}
                        <Select
                          value={device.trustLanding}
                          onValueChange={(v) => updateDevice(device.id, { trustLanding: v })}
                          disabled={device.flow !== 'none'}
                        >
                          <SelectTrigger className="h-7 text-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TRUST_LANDING_VARIANTS.map((t) => (
                              <SelectItem key={t.id} value={t.id} className="text-xs">
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* A/B Params (only shown when flow is 'none' and trustLanding is 'none') */}
                      {device.flow === 'none' && device.trustLanding === 'none' && (
                        <div className="grid grid-cols-3 gap-1">
                          {/* Homepage A/B (only for index page) */}
                          {device.page === 'index' ? (
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
                          ) : (
                            <div className="h-7 flex items-center text-[10px] text-muted-foreground px-2 bg-muted/50 rounded">
                              {PAGE_VARIANTS.find(p => p.id === device.page)?.label}
                            </div>
                          )}

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
                      )}

                      {/* Show Navigation selector for flows too */}
                      {device.flow !== 'none' && (
                        <div className="grid grid-cols-1 gap-1">
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
                        </div>
                      )}

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

                      {/* Lazy-loaded iframe with staggered loading */}
                      <LazyDeviceIframe
                        device={device}
                        url={buildDeviceUrl(device)}
                        index={index}
                        iframeRef={(el) => { iframeRefs.current[device.id] = el; }}
                      />

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
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-xs text-muted-foreground">
              <div>
                <strong className="text-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3 text-primary" />
                  Flows:
                </strong>
                <ul className="mt-1 space-y-0.5">
                  <li>V1-V9 = Hauptversionen</li>
                  <li>V1a-V1g = Subvarianten</li>
                  <li>ChatGPT 1-3 = AI-Optimiert</li>
                  <li>Swiss Premium/Lightning</li>
                  <li>Ultimate Best36 = Top</li>
                  <li>Golden V10 = Best-of</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Pages:</strong>
                <ul className="mt-1 space-y-0.5">
                  <li>Index = A/B Test Homepage</li>
                  <li>HP1 = Trust/Social Proof</li>
                  <li>HP2 = Institutional Trust</li>
                  <li>HP3 = Emotional Design</li>
                  <li>HP4 = Personalization</li>
                  <li>HP5 = Regulatory (SRO)</li>
                  <li>HP6 = Premium Trust</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Trust Landing (T):</strong>
                <ul className="mt-1 space-y-0.5">
                  <li>T1 = Behörden (Zefix/UID)</li>
                  <li>T2 = Branchen (ASTAG/SMA)</li>
                  <li>T3 = Konsumenten</li>
                  <li>T4 = Synthese (Best-Of)</li>
                </ul>
              </div>
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
                  <li>V1 = Original</li>
                  <li>V10 = Golden Navigation</li>
                  <li>V15 = Mobile-First</li>
                  <li>... (17 total)</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Social Proof (S):</strong>
                <ul className="mt-1 space-y-0.5">
                  <li>A-F = Standalone</li>
                  <li>G-H = Swiss-specific</li>
                  <li>I-M = Hero-Integrated</li>
                  <li>N-AB = Psychological+CRO</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
