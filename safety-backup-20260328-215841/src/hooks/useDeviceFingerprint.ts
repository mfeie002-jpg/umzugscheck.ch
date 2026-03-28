import { useState, useEffect, useCallback } from 'react';

interface FingerprintComponents {
  userAgent: string;
  language: string;
  colorDepth: number;
  screenResolution: string;
  timezoneOffset: number;
  sessionStorage: boolean;
  localStorage: boolean;
  indexedDb: boolean;
  cpuClass: string;
  platform: string;
  doNotTrack: string;
  plugins: string[];
  canvas: string;
  webgl: string;
  webglVendor: string;
  adBlock: boolean;
  hasLiedLanguages: boolean;
  hasLiedResolution: boolean;
  hasLiedOs: boolean;
  hasLiedBrowser: boolean;
  touchSupport: {
    maxTouchPoints: number;
    touchEvent: boolean;
    touchStart: boolean;
  };
  fonts: string[];
  audio: string;
  hardwareConcurrency: number;
  deviceMemory: number;
}

interface DeviceFingerprint {
  hash: string;
  components: Partial<FingerprintComponents>;
  confidence: number;
  isBot: boolean;
  riskScore: number;
}

/**
 * Simple hash function for fingerprint
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get canvas fingerprint
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    canvas.width = 200;
    canvas.height = 50;
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(0, 0, 100, 50);
    ctx.fillStyle = '#069';
    ctx.fillText('Feierabend Umzüge 🚛', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Fingerprint Test', 4, 17);
    
    return canvas.toDataURL();
  } catch {
    return '';
  }
}

/**
 * Get WebGL fingerprint
 */
function getWebGLFingerprint(): { renderer: string; vendor: string } {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { renderer: '', vendor: '' };
    
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return { renderer: '', vendor: '' };
    
    return {
      renderer: (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
      vendor: (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
    };
  } catch {
    return { renderer: '', vendor: '' };
  }
}

/**
 * Check for bot-like behavior
 */
function detectBotBehavior(): { isBot: boolean; signals: string[] } {
  const signals: string[] = [];
  
  // Check for headless browser
  if (navigator.webdriver) {
    signals.push('webdriver');
  }
  
  // Check for phantom
  if ('_phantom' in window || 'phantom' in window) {
    signals.push('phantom');
  }
  
  // Check for nightmare
  if ('__nightmare' in window) {
    signals.push('nightmare');
  }
  
  // Check for selenium
  if ('_selenium' in window || '_Selenium_IDE_Recorder' in window) {
    signals.push('selenium');
  }
  
  // Check for buffer
  if ('Buffer' in window) {
    signals.push('buffer');
  }
  
  // Check for suspicious screen dimensions
  if (screen.width === 0 || screen.height === 0) {
    signals.push('zero_screen');
  }
  
  // Check for missing plugins in non-mobile
  if (!navigator.plugins || navigator.plugins.length === 0) {
    if (!('ontouchstart' in window)) {
      signals.push('no_plugins_desktop');
    }
  }
  
  // Check for automation flags
  if (navigator.userAgent.includes('HeadlessChrome')) {
    signals.push('headless_chrome');
  }
  
  return {
    isBot: signals.length >= 2,
    signals,
  };
}

/**
 * Calculate risk score based on fingerprint anomalies
 */
function calculateRiskScore(components: Partial<FingerprintComponents>, isBot: boolean): number {
  let risk = 0;
  
  if (isBot) risk += 50;
  
  // Missing expected features
  if (!components.localStorage) risk += 10;
  if (!components.sessionStorage) risk += 10;
  if (!components.indexedDb) risk += 5;
  
  // Suspicious values
  if (components.hardwareConcurrency === 0) risk += 15;
  if (components.deviceMemory === 0) risk += 10;
  
  // VPN/Proxy indicators (timezone vs language mismatch)
  // This is a simplified check
  const language = components.language || '';
  const timezone = components.timezoneOffset || 0;
  
  // Swiss timezone is UTC+1 or UTC+2
  if (language.startsWith('de') && (timezone < -180 || timezone > 60)) {
    risk += 20;
  }
  
  return Math.min(100, risk);
}

export function useDeviceFingerprint() {
  const [fingerprint, setFingerprint] = useState<DeviceFingerprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const collectFingerprint = useCallback(async (): Promise<DeviceFingerprint> => {
    const canvas = getCanvasFingerprint();
    const webgl = getWebGLFingerprint();
    const botDetection = detectBotBehavior();

    const components: Partial<FingerprintComponents> = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      colorDepth: screen.colorDepth,
      screenResolution: `${screen.width}x${screen.height}`,
      timezoneOffset: new Date().getTimezoneOffset(),
      sessionStorage: !!window.sessionStorage,
      localStorage: !!window.localStorage,
      indexedDb: !!window.indexedDB,
      platform: navigator.platform,
      doNotTrack: navigator.doNotTrack || 'unknown',
      canvas: simpleHash(canvas),
      webgl: simpleHash(webgl.renderer),
      webglVendor: webgl.vendor,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as any).deviceMemory || 0,
      touchSupport: {
        maxTouchPoints: navigator.maxTouchPoints || 0,
        touchEvent: 'TouchEvent' in window,
        touchStart: 'ontouchstart' in window,
      },
    };

    // Generate hash from components
    const componentString = Object.entries(components)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${JSON.stringify(v)}`)
      .join('|');
    
    const hash = simpleHash(componentString);
    
    // Calculate confidence based on how many components we collected
    const totalPossible = Object.keys(components).length;
    const collected = Object.values(components).filter(v => v !== undefined && v !== '').length;
    const confidence = Math.round((collected / totalPossible) * 100);
    
    const riskScore = calculateRiskScore(components, botDetection.isBot);

    return {
      hash,
      components,
      confidence,
      isBot: botDetection.isBot,
      riskScore,
    };
  }, []);

  useEffect(() => {
    collectFingerprint().then(fp => {
      setFingerprint(fp);
      setIsLoading(false);
    });
  }, [collectFingerprint]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const fp = await collectFingerprint();
    setFingerprint(fp);
    setIsLoading(false);
    return fp;
  }, [collectFingerprint]);

  return {
    fingerprint,
    isLoading,
    refresh,
    hash: fingerprint?.hash || '',
    isBot: fingerprint?.isBot || false,
    riskScore: fingerprint?.riskScore || 0,
    confidence: fingerprint?.confidence || 0,
  };
}
