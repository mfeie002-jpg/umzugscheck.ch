import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Force redeploy - pure JS MD5 implementation (no crypto.subtle)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get credentials from environment variables
const SCREENSHOT_API_KEY = Deno.env.get("SCREENSHOTMACHINE_API_KEY") || "";
const SECRET_PHRASE = Deno.env.get("SCREENSHOTMACHINE_SECRET_PHRASE") || "";

// Simple MD5 implementation for hash authentication
function md5(input: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  
  // MD5 helper functions
  function rotateLeft(x: number, n: number): number {
    return (x << n) | (x >>> (32 - n));
  }
  
  function addUnsigned(x: number, y: number): number {
    const x4 = (x & 0x40000000);
    const y4 = (y & 0x40000000);
    const x8 = (x & 0x80000000);
    const y8 = (y & 0x80000000);
    const result = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
    if (x4 & y4) return (result ^ 0x80000000 ^ x8 ^ y8);
    if (x4 | y4) {
      if (result & 0x40000000) return (result ^ 0xC0000000 ^ x8 ^ y8);
      else return (result ^ 0x40000000 ^ x8 ^ y8);
    }
    return (result ^ x8 ^ y8);
  }
  
  function F(x: number, y: number, z: number): number { return (x & y) | ((~x) & z); }
  function G(x: number, y: number, z: number): number { return (x & z) | (y & (~z)); }
  function H(x: number, y: number, z: number): number { return (x ^ y ^ z); }
  function I(x: number, y: number, z: number): number { return (y ^ (x | (~z))); }
  
  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  
  function wordToHex(value: number): string {
    let hex = "";
    for (let count = 0; count <= 3; count++) {
      const byte = (value >>> (count * 8)) & 255;
      hex += byte.toString(16).padStart(2, "0");
    }
    return hex;
  }
  
  // Prepare message
  const msgLength = data.length;
  const numBlocks = Math.ceil((msgLength + 9) / 64);
  const totalLength = numBlocks * 64;
  const paddedMsg = new Uint8Array(totalLength);
  paddedMsg.set(data);
  paddedMsg[msgLength] = 0x80;
  
  const bitLength = msgLength * 8;
  const view = new DataView(paddedMsg.buffer);
  view.setUint32(totalLength - 8, bitLength, true);
  view.setUint32(totalLength - 4, 0, true);
  
  // Initialize hash values
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  
  // Process each 64-byte block
  for (let i = 0; i < totalLength; i += 64) {
    const block = new Uint32Array(16);
    for (let j = 0; j < 16; j++) {
      block[j] = view.getUint32(i + j * 4, true);
    }
    
    let aa = a, bb = b, cc = c, dd = d;
    
    // Round 1
    a = FF(a, b, c, d, block[0], 7, 0xd76aa478); d = FF(d, a, b, c, block[1], 12, 0xe8c7b756);
    c = FF(c, d, a, b, block[2], 17, 0x242070db); b = FF(b, c, d, a, block[3], 22, 0xc1bdceee);
    a = FF(a, b, c, d, block[4], 7, 0xf57c0faf); d = FF(d, a, b, c, block[5], 12, 0x4787c62a);
    c = FF(c, d, a, b, block[6], 17, 0xa8304613); b = FF(b, c, d, a, block[7], 22, 0xfd469501);
    a = FF(a, b, c, d, block[8], 7, 0x698098d8); d = FF(d, a, b, c, block[9], 12, 0x8b44f7af);
    c = FF(c, d, a, b, block[10], 17, 0xffff5bb1); b = FF(b, c, d, a, block[11], 22, 0x895cd7be);
    a = FF(a, b, c, d, block[12], 7, 0x6b901122); d = FF(d, a, b, c, block[13], 12, 0xfd987193);
    c = FF(c, d, a, b, block[14], 17, 0xa679438e); b = FF(b, c, d, a, block[15], 22, 0x49b40821);
    
    // Round 2
    a = GG(a, b, c, d, block[1], 5, 0xf61e2562); d = GG(d, a, b, c, block[6], 9, 0xc040b340);
    c = GG(c, d, a, b, block[11], 14, 0x265e5a51); b = GG(b, c, d, a, block[0], 20, 0xe9b6c7aa);
    a = GG(a, b, c, d, block[5], 5, 0xd62f105d); d = GG(d, a, b, c, block[10], 9, 0x02441453);
    c = GG(c, d, a, b, block[15], 14, 0xd8a1e681); b = GG(b, c, d, a, block[4], 20, 0xe7d3fbc8);
    a = GG(a, b, c, d, block[9], 5, 0x21e1cde6); d = GG(d, a, b, c, block[14], 9, 0xc33707d6);
    c = GG(c, d, a, b, block[3], 14, 0xf4d50d87); b = GG(b, c, d, a, block[8], 20, 0x455a14ed);
    a = GG(a, b, c, d, block[13], 5, 0xa9e3e905); d = GG(d, a, b, c, block[2], 9, 0xfcefa3f8);
    c = GG(c, d, a, b, block[7], 14, 0x676f02d9); b = GG(b, c, d, a, block[12], 20, 0x8d2a4c8a);
    
    // Round 3
    a = HH(a, b, c, d, block[5], 4, 0xfffa3942); d = HH(d, a, b, c, block[8], 11, 0x8771f681);
    c = HH(c, d, a, b, block[11], 16, 0x6d9d6122); b = HH(b, c, d, a, block[14], 23, 0xfde5380c);
    a = HH(a, b, c, d, block[1], 4, 0xa4beea44); d = HH(d, a, b, c, block[4], 11, 0x4bdecfa9);
    c = HH(c, d, a, b, block[7], 16, 0xf6bb4b60); b = HH(b, c, d, a, block[10], 23, 0xbebfbc70);
    a = HH(a, b, c, d, block[13], 4, 0x289b7ec6); d = HH(d, a, b, c, block[0], 11, 0xeaa127fa);
    c = HH(c, d, a, b, block[3], 16, 0xd4ef3085); b = HH(b, c, d, a, block[6], 23, 0x04881d05);
    a = HH(a, b, c, d, block[9], 4, 0xd9d4d039); d = HH(d, a, b, c, block[12], 11, 0xe6db99e5);
    c = HH(c, d, a, b, block[15], 16, 0x1fa27cf8); b = HH(b, c, d, a, block[2], 23, 0xc4ac5665);
    
    // Round 4
    a = II(a, b, c, d, block[0], 6, 0xf4292244); d = II(d, a, b, c, block[7], 10, 0x432aff97);
    c = II(c, d, a, b, block[14], 15, 0xab9423a7); b = II(b, c, d, a, block[5], 21, 0xfc93a039);
    a = II(a, b, c, d, block[12], 6, 0x655b59c3); d = II(d, a, b, c, block[3], 10, 0x8f0ccc92);
    c = II(c, d, a, b, block[10], 15, 0xffeff47d); b = II(b, c, d, a, block[1], 21, 0x85845dd1);
    a = II(a, b, c, d, block[8], 6, 0x6fa87e4f); d = II(d, a, b, c, block[15], 10, 0xfe2ce6e0);
    c = II(c, d, a, b, block[6], 15, 0xa3014314); b = II(b, c, d, a, block[13], 21, 0x4e0811a1);
    a = II(a, b, c, d, block[4], 6, 0xf7537e82); d = II(d, a, b, c, block[11], 10, 0xbd3af235);
    c = II(c, d, a, b, block[2], 15, 0x2ad7d2bb); b = II(b, c, d, a, block[9], 21, 0xeb86d391);
    
    a = addUnsigned(a, aa); b = addUnsigned(b, bb); c = addUnsigned(c, cc); d = addUnsigned(d, dd);
  }
  
  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
}

function getPngDimensions(bytes: Uint8Array): { width: number; height: number } | null {
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (bytes.length < 24) return null;
  if (
    bytes[0] !== 0x89 ||
    bytes[1] !== 0x50 ||
    bytes[2] !== 0x4e ||
    bytes[3] !== 0x47 ||
    bytes[4] !== 0x0d ||
    bytes[5] !== 0x0a ||
    bytes[6] !== 0x1a ||
    bytes[7] !== 0x0a
  ) {
    return null;
  }

  // IHDR chunk data starts at offset 16
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const width = view.getUint32(16, false);
  const height = view.getUint32(20, false);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
  return { width, height };
}

function extractAssetUrlsFromHtml(html: string, baseUrl: string): string[] {
  const out = new Set<string>();
  const push = (raw: string) => {
    try {
      if (!raw) return;
      if (raw.startsWith("data:")) return;
      const u = new URL(raw, baseUrl).toString();
      if (u.includes("/assets/") || u.endsWith(".js") || u.endsWith(".css")) out.add(u);
    } catch {
      // ignore
    }
  };

  for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) push(m[1]);
  for (const m of html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi)) push(m[1]);

  return [...out];
}

async function fetchAssetHealth(url: string, traceId: string) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "cache-control": "no-cache",
        pragma: "no-cache",
      },
    });

    const ct = res.headers.get("content-type") || "";
    const cc = res.headers.get("cache-control") || "";

    console.log(`[${traceId}] AssetHealth: ${res.status} ${url} ct=${ct} cc=${cc}`);

    return {
      ok: res.ok,
      status: res.status,
      url,
      contentType: ct,
      cacheControl: cc,
    };
  } catch (e) {
    console.log(`[${traceId}] AssetHealth: error ${url} ${(e as any)?.message || String(e)}`);
    return { ok: false, status: 0, url, contentType: "", cacheControl: "" };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Generate trace ID for request correlation
  const traceId = crypto.randomUUID().slice(0, 8);

  try {
    const body = await req.json();
    let {
      url,
      dimension = "1920x1080",
      delay = 6000,
      format = "png",
      fullPage = false,
      scroll = true,
      noCache = true,
      failOn404 = false, // NEW: Return error instead of screenshot for 404 pages
    } = body ?? {};
    // Determine capture-mode early (used for delays + safer defaults)
    const isCaptureMode = (() => {
      try {
        const u = new URL(url);
        return u.searchParams.get("uc_capture") === "1" || u.searchParams.has("uc_step") || u.searchParams.get("uc_render") === "1";
      } catch {
        const s = String(url);
        return s.includes("uc_capture=1") || s.includes("uc_step=") || s.includes("uc_render=1");
      }
    })();

    // Optional selector:
    // - If caller passes `selector`, we use it (element capture)
    // - If caller passes `waitForReadySentinel`, we use our sentinel (readiness + safe cropping)
    const explicitSelector =
      typeof (body as any)?.selector === "string" && (body as any).selector.trim().length > 0
        ? (body as any).selector.trim()
        : null;

    const waitForReadySentinel =
      (body as any)?.waitForReadySentinel === true || (isCaptureMode && (body as any)?.waitForReadySentinel !== false);

    // FIX: Wait for "not loading" instead of just "ready" - this captures error states too
    // so we can see the error reason in the screenshot instead of blank timeout
    const requestedSelector = explicitSelector || (waitForReadySentinel ? '#uc-capture-sentinel:not([data-status="loading"])' : null);

    // NOTE: We NO longer auto-add uc_render=1.
    // The uc_render parameter triggers special render-mode logic (IntersectionObserver patches, scroll sweeps)
    // which can cause blank screens in heavy SPA flows. Manual captures work without it.
    // If the caller wants uc_render, they should add it themselves in the URL.

    // Validate format
    const validFormats = ["png", "jpg", "pdf"];
    const outputFormat = validFormats.includes(format) ? format : "png";

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required", traceId }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[${traceId}] Starting capture for: ${url}`);

    // === PREFLIGHT CHECK ===
    // Fetch the target URL to verify it's accessible and returns HTML
    // This helps diagnose 404s, redirects, and build mismatches early
    let preflightInfo: {
      status: number;
      contentType: string;
      finalUrl: string;
      hasAssets: boolean;
      assetsFound?: number;
      assetsChecked?: Array<{ ok: boolean; status: number; url: string; contentType: string; cacheControl: string }>;
      error?: string;
      is404Page?: boolean;
    } | null = null;

    try {
      const preflightResponse = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; UmzugscheckBot/1.0; preflight)",
          Accept: "text/html",
          "cache-control": "no-cache",
          pragma: "no-cache",
        },
      });

      const contentType = preflightResponse.headers.get("content-type") || "";
      const htmlText = contentType.includes("text/html") ? await preflightResponse.text() : "";

      // Detect 404 pages by checking for common error indicators in HTML
      // SPA 404s often return 200 status but show error content
      const is404Page = preflightResponse.status === 404 || (
        preflightResponse.status === 200 && (
          htmlText.toLowerCase().includes("seite nicht gefunden") ||
          htmlText.toLowerCase().includes("page not found") ||
          htmlText.toLowerCase().includes("404") ||
          htmlText.includes("NotFoundPage") ||
          htmlText.includes("not-found")
        )
      );

      const assetUrls = contentType.includes("text/html")
        ? extractAssetUrlsFromHtml(htmlText, preflightResponse.url)
        : [];

      const assetsChecked = await Promise.all(assetUrls.slice(0, 3).map((a) => fetchAssetHealth(a, traceId)));

      preflightInfo = {
        status: preflightResponse.status,
        contentType,
        finalUrl: preflightResponse.url,
        hasAssets: assetUrls.length > 0,
        assetsFound: assetUrls.length,
        assetsChecked,
        is404Page,
      };

      console.log(
        `[${traceId}] Preflight: status=${preflightInfo.status}, contentType=${contentType.slice(0, 50)}, finalUrl=${preflightInfo.finalUrl}, hasAssets=${preflightInfo.hasAssets}, assetsFound=${preflightInfo.assetsFound}, is404Page=${is404Page}`
      );

      if (preflightResponse.status === 404 || is404Page) {
        console.error(`[${traceId}] Preflight detected 404 page: ${url}`);
        
        // If failOn404 is enabled, return error immediately
        if (failOn404) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Page not found (404)",
              is404: true,
              url,
              traceId,
              preflight: preflightInfo,
              hint: "The page does not exist or returns a 404 error. This is common for SPA routes that haven't been published.",
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
      if (preflightResponse.status >= 500) {
        console.error(`[${traceId}] Preflight ${preflightResponse.status} - Server error`);
      }
      if (!contentType.includes("text/html")) {
        console.warn(`[${traceId}] Preflight: unexpected content-type (not HTML)`);
      }
      if (preflightInfo.finalUrl !== url) {
        console.log(`[${traceId}] Preflight: URL was redirected to ${preflightInfo.finalUrl}`);
      }
    } catch (preflightError) {
      const errMsg = preflightError instanceof Error ? preflightError.message : String(preflightError);
      console.warn(`[${traceId}] Preflight failed: ${errMsg}`);
      preflightInfo = {
        status: 0,
        contentType: "",
        finalUrl: url,
        hasAssets: false,
        error: errMsg,
      };
    }

    // Parse dimension to detect mobile/tablet
    const [widthStr, heightStr] = dimension.split("x");
    const width = parseInt(widthStr, 10);
    const heightNum = parseInt(heightStr, 10);

    const isDimensionFull = String(heightStr || "").toLowerCase() === "full";
    let isFullPage = Boolean(fullPage || isDimensionFull);

    const isTallViewport = Number.isFinite(heightNum) && heightNum >= 2000;
    if (!isFullPage && isTallViewport) {
      isFullPage = true;
      console.log(`Detected tall viewport (${dimension}); switching to xfull stitching.`);
    }

    // ScreenshotMachine API ONLY accepts these delay values (in ms):
    // 0, 200, 400, 600, 800, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000
    // Maximum is 10000ms (10 seconds)!
    const ALLOWED_DELAYS = [0, 200, 400, 600, 800, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
    
    const delayMsRaw = typeof delay === "number" ? delay : Number(delay);
    
    // For capture mode and full page, use maximum allowed delay (10000ms)
    const defaultDelay = (isCaptureMode || isFullPage) ? 10000 : 6000;
    
    // Find the closest allowed delay value
    const targetDelay = Number.isFinite(delayMsRaw) ? delayMsRaw : defaultDelay;
    const effectiveDelay = ALLOWED_DELAYS.reduce((prev, curr) => 
      Math.abs(curr - targetDelay) < Math.abs(prev - targetDelay) ? curr : prev
    );
    
    console.log(`[${traceId}] Delay: requested=${delayMsRaw}ms, effective=${effectiveDelay}ms (API max: 10000ms)`);

    let deviceType = "desktop";
    if (width <= 480) {
      deviceType = "phone";
    } else if (width <= 1024) {
      deviceType = "tablet";
    }

    console.log(
      `Capturing screenshot for: ${url}, dimension: ${dimension}, device: ${deviceType}, delay: ${effectiveDelay}ms, fullPage: ${isFullPage}`
    );

    // CRITICAL FIX: Don't use "xfull" dimensions - ScreenshotMachine doesn't handle them reliably
    // (returns 1912x768 instead of the expected dimension). Use fixed tall heights instead.
    let effectiveDimension = dimension;
    const safeWidth = Number.isFinite(width) && width > 0 ? width : 1920;
    
    if (isFullPage || isDimensionFull) {
      // CRITICAL FIX 10x: Use ScreenshotMachine's native "xfull" feature instead of fixed height.
      // Previous approach (1920x2500) was truncating long pages - causing blank/missing content.
      // The API's xfull feature properly captures the entire page height.
      effectiveDimension = `${safeWidth}xfull`;
      console.log(`Capture strategy: using API native xfull (full page capture), effectiveDimension: ${effectiveDimension}`);
    } else {
      console.log(`Capture strategy: viewport, effectiveDimension: ${effectiveDimension}`);
    }


    if (!SCREENSHOT_API_KEY) {
      console.error("SCREENSHOTMACHINE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Screenshot provider not configured - API key missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build ScreenshotMachine API URL
    // IMPORTANT: timeout must be >= delay, otherwise the provider can return a "success" image
    // that is still an early/blank render.
    const effectiveTimeoutMs = Math.min(120000, effectiveDelay + 60000);

    // CRITICAL FIX: For full-page captures, NEVER use selector.
    // Selector causes ScreenshotMachine to crop to the element, breaking full-page stitching.
    // Only use selector for viewport captures to wait for readiness.
    const useSelector = requestedSelector && !isFullPage && !isDimensionFull;
    const selector = useSelector ? requestedSelector : null;

    const params = new URLSearchParams({
      key: SCREENSHOT_API_KEY,
      url: url,
      dimension: effectiveDimension,
      format: outputFormat,
      cacheLimit: "0",
      delay: String(effectiveDelay),
      js: "true",
      timeout: String(effectiveTimeoutMs),
    });

    // Optional element capture (only for viewport captures, NOT fullPage)
    if (selector) {
      params.set("selector", selector);
      console.log(`Selector enabled (viewport capture): ${selector}`);
    } else if (requestedSelector && isFullPage) {
      console.log(`Selector DISABLED for fullPage capture (would cause wrong cropping)`);
    }

    // CRITICAL FIX 10x: For full-page captures, use proper scroll parameters.
    // The API needs scroll=true + scrolldelay for xfull to work correctly.
    // This ensures all lazy-loaded content is triggered before stitching.
    const scrollExplicit = typeof scroll === "boolean";
    
    if (isFullPage || isDimensionFull) {
      // Full-page ALWAYS needs scrolling to trigger lazy-loaded content
      params.set("scroll", "true");
      params.set("scrolldelay", "2000"); // Give time for content to load during scroll
      console.log("Full-page scroll enabled (xfull stitching mode)");
    } else {
      // Viewport captures: use caller preference or defaults
      const shouldScroll = scrollExplicit ? Boolean(scroll) : (!isCaptureMode);
      if (shouldScroll) {
        params.set("scroll", "true");
        params.set("scrolldelay", "1500");
        if (!isCaptureMode) params.set("scrollto", "bottom");
        console.log(`Scroll enabled (viewport)`);
      }
    }

    // Add hash authentication if secret phrase is configured
    if (SECRET_PHRASE) {
      const hashValue = md5(url + SECRET_PHRASE);
      params.set("hash", hashValue);
      console.log("Using hash authentication with secret phrase");
    } else {
      console.log("No secret phrase configured, using simple API key auth");
    }

    // ScreenshotMachine is most reliable with zoom=100 across devices.
    // Using zoom=200 for phones can push SPA content out of the captured viewport (blank center).
    const effectiveZoom = "100";
    params.set("accept-language", "de-CH,de;q=0.9,en;q=0.8");

    // ScreenshotMachine expects a `device` parameter even for full-length ("...xfull") screenshots.
    // If omitted, it can silently fall back to an unexpected default viewport.
    params.set("device", deviceType);

    if (deviceType === "phone") {
      params.set(
        "user-agent",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
      );
    } else if (deviceType === "tablet") {
      params.set(
        "user-agent",
        "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
      );
    } else {
      params.set(
        "user-agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );
    }

    const apiUrl = `https://api.screenshotmachine.com?${params.toString()}`;

    console.log("Requesting screenshot from ScreenshotMachine API");
    
    // Retry logic for transient errors (system_error, rate limits)
    let response: Response | null = null;
    let smErrorHeader: string | null = null;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      response = await fetch(apiUrl);
      smErrorHeader = response.headers.get("x-screenshotmachine-response");
      
      // Check for transient errors that should be retried
      if (smErrorHeader === "system_error" || smErrorHeader === "too_many_requests") {
        const backoffMs = Math.min(5000 * attempt, 15000); // 5s, 10s, 15s
        console.warn(`ScreenshotMachine ${smErrorHeader} (attempt ${attempt}/${maxRetries}), retrying in ${backoffMs}ms...`);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
      }
      
      // Success or non-retryable error - break out of loop
      break;
    }
    
    if (!response) {
      return new Response(
        JSON.stringify({ error: "Failed to connect to ScreenshotMachine API" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (smErrorHeader && smErrorHeader !== "ok") {
      console.error(`ScreenshotMachine error header: ${smErrorHeader}`);

       // If capture-ready selector is missing, retry with MORE delay (same selector) once.
       // If it still fails, retry ONCE without selector.
       // This avoids "too-early" screenshots on heavy SPAs, while still keeping a fallback.
       if (smErrorHeader === "invalid_selector" && selector) {
         console.warn("Selector not found; retrying with increased delay (selector mode)");

         const retryDelay = Math.min(60000, effectiveDelay + 8000);
         const retryTimeout = Math.min(120000, retryDelay + 60000);

         if (retryDelay > effectiveDelay) {
           const retryParams1 = new URLSearchParams(params);
           retryParams1.set("delay", String(retryDelay));
           retryParams1.set("timeout", String(retryTimeout));
           const retryApiUrl1 = `https://api.screenshotmachine.com?${retryParams1.toString()}`;

           const retryResponse1 = await fetch(retryApiUrl1);
           const retryErrorHeader1 = retryResponse1.headers.get("x-screenshotmachine-response");

           if (!retryErrorHeader1 || retryErrorHeader1 === "ok") {
             response = retryResponse1;
           } else {
             console.warn(`Retry (selector+delay) error header: ${retryErrorHeader1}`);
           }
         }

         // If still failing with selector, fallback without selector
         const afterRetryHeader = response.headers.get("x-screenshotmachine-response");
         if (afterRetryHeader && afterRetryHeader !== "ok") {
           console.warn("Selector still not found; retrying without selector (fallback mode)");

           const retryParams = new URLSearchParams(params);
           retryParams.delete("selector");
           const retryApiUrl = `https://api.screenshotmachine.com?${retryParams.toString()}`;

           const retryResponse = await fetch(retryApiUrl);
           const retryErrorHeader = retryResponse.headers.get("x-screenshotmachine-response");
           if (retryErrorHeader && retryErrorHeader !== "ok") {
             console.error(`Retry ScreenshotMachine error header: ${retryErrorHeader}`);
             return new Response(
               JSON.stringify({
                 error: `ScreenshotMachine error: ${smErrorHeader}`,
                 smError: smErrorHeader,
                 hint: "The capture-ready selector was not found (and fallback also failed).",
                 selector,
                 fallbackAttempted: true,
                 fallbackError: retryErrorHeader,
               }),
               // IMPORTANT: return 200 so the client can show the error without throwing "Edge function returned 500"
               { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
             );
           }

           if (!retryResponse.ok) {
             const errorText = await retryResponse.text();
             console.error(`Retry Screenshot API error: ${retryResponse.status}`, errorText);
             return new Response(
               JSON.stringify({
                 error: `Screenshot API error: ${retryResponse.status}`,
                 details: errorText,
                 selector,
                 fallbackAttempted: true,
               }),
               { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
             );
           }

           response = retryResponse;
         }
       } else {
        return new Response(
          JSON.stringify({
            error: `ScreenshotMachine error: ${smErrorHeader}`,
            smError: smErrorHeader,
            hint: smErrorHeader === "invalid_selector"
              ? "The capture-ready selector was not found - wizard may not have rendered"
              : smErrorHeader === "timeout"
              ? "Page took too long to render - try increasing delay"
              : undefined,
          }),
          // IMPORTANT: return 200 so the client can show the error without throwing "Edge function returned 500"
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Screenshot API error: ${response.status}`, errorText);
      return new Response(
        JSON.stringify({ error: `Screenshot API error: ${response.status}`, details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Read the screenshot bytes
    let imageBuffer = await response.arrayBuffer();
    let bytes = new Uint8Array(imageBuffer);

    // Heuristic: detect "blank" captures (very small PNGs are typically mostly-white/empty)
    // and retry once as a full-length capture (xfull) to force the provider to render more content.
    // We only do this for capture-mode URLs to avoid changing behavior for normal screenshots.
    const isPng = outputFormat === "png";
    let pngDims = isPng ? getPngDimensions(bytes) : null;
    if (pngDims) {
      console.log(`Output image dimensions: ${pngDims.width}x${pngDims.height}`);
    }

    // CRITICAL FIX 10x: Blank retry DISABLED – no longer needed with native xfull.
    // When caller requests fullPage, we now use ScreenshotMachine's native xfull feature.
    // This properly captures the entire page without needing heuristic retries.
    const shouldRetryBlank = false;

    let base64 = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize);
      base64 += String.fromCharCode(...chunk);
    }
    base64 = btoa(base64);

    console.log(
      `Screenshot captured successfully, size: ${imageBuffer.byteLength} bytes, format: ${outputFormat}, device: ${deviceType}, zoom: ${effectiveZoom}${
        pngDims ? `, out: ${pngDims.width}x${pngDims.height}` : ""
      }`
    );

    const mimeType = outputFormat === "pdf" ? "application/pdf" : `image/${outputFormat}`;

    return new Response(
      JSON.stringify({
        success: true,
        image: `data:${mimeType};base64,${base64}`,
        url,
        dimension: effectiveDimension,
        format: outputFormat,
        device: deviceType,
        imageWidth: pngDims?.width ?? null,
        imageHeight: pngDims?.height ?? null,
        capturedAt: new Date().toISOString(),
        traceId,
        preflight: preflightInfo,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Screenshot capture error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
