import { supabase } from "@/integrations/supabase/client";

export interface ScreenshotOptions {
  url: string;
  dimension?: string;
  delay?: number;
  format?: 'png' | 'jpg' | 'pdf';
  fullPage?: boolean;
  scroll?: boolean;
  noCache?: boolean;
  /**
   * When true, the backend will use a selector that waits for the capture sentinel.
   * In capture-mode URLs this defaults to true unless explicitly set to false.
   */
  waitForReadySentinel?: boolean;
}

export interface ScreenshotResult {
  success: boolean;
  image?: string;
  url?: string;
  dimension?: string;
  capturedAt?: string;
  error?: string;
}

/**
 * Capture a screenshot using the backend edge function.
 * This ensures proper authentication with ScreenshotMachine API
 * and avoids CORS/hash issues from direct browser calls.
 */
export async function captureScreenshot(options: ScreenshotOptions): Promise<ScreenshotResult> {
  try {
    // Cache-buster for screenshot tooling (prevents stale HTML/JS/service-worker caches during captures)
    const cacheBuster = options.noCache === false ? '' : `uc_cb=${Date.now()}`;
    const urlWithCacheBuster = (() => {
      try {
        const u = new URL(options.url);
        if (cacheBuster) u.searchParams.set('uc_cb', String(Date.now()));
        return u.toString();
      } catch {
        return options.url;
      }
    })();

    const isCaptureLike = (() => {
      try {
        const u = new URL(urlWithCacheBuster);
        return u.searchParams.get('uc_capture') === '1' || u.searchParams.get('uc_render') === '1' || u.searchParams.has('uc_step');
      } catch {
        return urlWithCacheBuster.includes('uc_capture=1') || urlWithCacheBuster.includes('uc_step=') || urlWithCacheBuster.includes('uc_render=1');
      }
    })();

    // CRITICAL FIX 10x: For full-page captures, DO use scrolling.
    // Provider-side scrolling is necessary for xfull stitching to trigger lazy-loaded content.
    // Previous "scroll: false" for fullPage was causing blank sections in long pages.
    const effectiveScroll = options.scroll ?? (isCaptureLike ? false : true);

    // In capture mode we default to waiting for the in-app sentinel.
    const waitForReadySentinel = options.waitForReadySentinel ?? isCaptureLike;

    // ScreenshotMachine API only allows delays: 0, 200, 400, 600, 800, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000
    // Maximum is 10000ms (10 seconds)
    const requestedDelay = options.delay || 10000; // Default to max for reliability
    
    const { data, error } = await supabase.functions.invoke('capture-screenshot', {
      body: {
        url: urlWithCacheBuster,
        dimension: options.dimension || '1920x1080',
        delay: Math.min(requestedDelay, 10000), // Cap at API max
        format: options.format || 'png',
        fullPage: options.fullPage || false,
        // CRITICAL FIX 10x: Full-page captures NEED scrolling for xfull stitching.
        // The API scrolls to trigger lazy-loaded content, then stitches the full page.
        scroll: effectiveScroll,
        noCache: options.noCache !== false,
        // Enables provider-side selector for capture-ready (safe because sentinel is viewport-sized)
        ...(waitForReadySentinel
          ? { waitForReadySentinel: true, selector: '#uc-capture-sentinel[data-status="ready"]' }
          : {}),
      },
    });

    if (error) {
      console.error('Screenshot edge function error:', error);
      return { success: false, error: error.message };
    }

    if (data?.error) {
      return { success: false, error: data.error };
    }

    return {
      success: true,
      image: data.image,
      url: data.url,
      dimension: data.dimension,
      capturedAt: data.capturedAt,
    };
  } catch (err) {
    console.error('Screenshot capture error:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    };
  }
}

/**
 * Capture multiple screenshots in sequence with progress callback.
 */
export async function captureMultipleScreenshots(
  urls: string[],
  options: Omit<ScreenshotOptions, 'url'>,
  onProgress?: (current: number, total: number, url: string) => void
): Promise<ScreenshotResult[]> {
  const results: ScreenshotResult[] = [];
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    onProgress?.(i + 1, urls.length, url);
    
    const result = await captureScreenshot({ ...options, url });
    results.push(result);
    
    // Small delay between requests to avoid rate limiting
    if (i < urls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}
