import { supabase } from "@/integrations/supabase/client";

export interface ScreenshotOptions {
  url: string;
  dimension?: string;
  delay?: number;
  format?: 'png' | 'jpg' | 'pdf';
  fullPage?: boolean;
  scroll?: boolean;
  noCache?: boolean;
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

    const { data, error } = await supabase.functions.invoke('capture-screenshot', {
      body: {
        url: urlWithCacheBuster,
        dimension: options.dimension || '1920x1080',
        delay: options.delay || 6000,
        format: options.format || 'png',
        fullPage: options.fullPage || false,
        // IMPORTANT: many "scroll" based full-page captures create large white gaps.
        // When fullPage is requested, rely on stitching mode instead of scrolling.
        scroll: options.fullPage ? false : options.scroll !== false,
        noCache: options.noCache !== false,
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
