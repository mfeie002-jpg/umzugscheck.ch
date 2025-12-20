import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { encode as encodeHex } from "https://deno.land/std@0.168.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ScreenshotMachine API credentials
const SCREENSHOT_API_KEY = Deno.env.get("SCREENSHOTMACHINE_API_KEY") ?? "892618";
const SECRET_PHRASE = "iamthebestintheworld";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let {
      url,
      dimension = "1920x1080",
      delay = 6000,
      format = "png",
      fullPage = false,
      scroll = true,
      noCache = true,
    } = await req.json();

    // Auto-add uc_render=1 for umzugscheck.ch to avoid lazy-loading issues
    let isHomepage = false;
    try {
      const parsedUrl = new URL(url);
      isHomepage = parsedUrl.pathname === "/" || parsedUrl.pathname === "";

      if (
        parsedUrl.hostname === "umzugscheck.ch" ||
        parsedUrl.hostname.endsWith(".umzugscheck.ch")
      ) {
        parsedUrl.searchParams.set("uc_render", "1");
        url = parsedUrl.toString();
        console.log("Added uc_render=1 for umzugscheck.ch URL");
      }
    } catch (e) {
      console.warn("Could not parse URL for uc_render injection:", e);
    }

    // Validate format
    const validFormats = ["png", "jpg", "pdf"];
    const outputFormat = validFormats.includes(format) ? format : "png";

    // ScreenshotMachine only supports specific delay values (ms) - use HIGHER delays for complex pages
    const allowedDelays = [0, 200, 400, 600, 800, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
    const delayMsRaw = typeof delay === "number" ? delay : Number(delay);
    // Default to 10000ms (10s) for umzugscheck.ch to ensure all content loads
    const defaultDelay = 10000;
    const delayMsClamped = Number.isFinite(delayMsRaw)
      ? Math.max(0, Math.min(10000, delayMsRaw))
      : defaultDelay;
    const effectiveDelay = allowedDelays.reduce(
      (prev, curr) =>
        Math.abs(curr - delayMsClamped) < Math.abs(prev - delayMsClamped) ? curr : prev,
      allowedDelays[0]
    );

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse dimension to detect mobile/tablet
    const [widthStr, heightStr] = dimension.split("x");
    const width = parseInt(widthStr, 10);
    const heightNum = parseInt(heightStr, 10);

    // Treat "xfull" dimensions as full-page even if caller forgot fullPage=true
    const isDimensionFull = String(heightStr || "").toLowerCase() === "full";
    let isFullPage = Boolean(fullPage || isDimensionFull);

    // Guardrail: Tall viewports often break vh/svh layouts
    const isTallViewport = Number.isFinite(heightNum) && heightNum >= 2000;
    if (!isFullPage && isTallViewport) {
      isFullPage = true;
      console.log(`Detected tall viewport (${dimension}); switching to xfull stitching.`);
    }

    // Determine device type based on width
    let deviceType = "desktop";
    if (width <= 480) {
      deviceType = "phone";
    } else if (width <= 1024) {
      deviceType = "tablet";
    }

    console.log(
      `Capturing screenshot for: ${url}, dimension: ${dimension}, device: ${deviceType}, delay: ${effectiveDelay}ms, fullPage: ${isFullPage}`
    );

    // Determine effective dimension for full-page captures
    let effectiveDimension = dimension;
    let captureStrategy: "viewport" | "xfull" = "viewport";

    if (isFullPage) {
      effectiveDimension = `${width}xfull`;
      captureStrategy = "xfull";
    }

    console.log(`Capture strategy: ${captureStrategy}, effectiveDimension: ${effectiveDimension}`);

    // Build ScreenshotMachine API URL
    const params = new URLSearchParams({
      key: SCREENSHOT_API_KEY,
      url: url,
      dimension: effectiveDimension,
      format: outputFormat,
      cacheLimit: "0", // Always bypass cache to get fresh content
      delay: String(effectiveDelay),
      js: "true", // Enable JavaScript rendering
      timeout: "20000", // 20 second timeout for slow-loading pages
    });

    // Set device type properly for mobile/tablet rendering
    params.set("device", deviceType);

    // Zoom controls output resolution
    const effectiveZoom = deviceType === "desktop" && isFullPage ? "100" : "200";
    params.set("zoom", effectiveZoom);

    // Improve reliability on real-world sites
    params.set("accept-language", "de-CH,de;q=0.9,en;q=0.8");

    // Use appropriate user-agent based on device type
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

    // Generate MD5 hash: md5(url + secretPhrase)
    const hashInput = url + SECRET_PHRASE;
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest("MD5", data);
    const hashBytes = encodeHex(new Uint8Array(hashBuffer));
    const hash = new TextDecoder().decode(hashBytes);
    params.set("hash", hash);

    const apiUrl = `https://api.screenshotmachine.com?${params.toString()}`;

    console.log("Requesting screenshot from ScreenshotMachine API (with hash authentication)");
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Screenshot API error: ${response.status}`, errorText);
      return new Response(
        JSON.stringify({ error: `Screenshot API error: ${response.status}`, details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return the image as base64 (handle large images safely)
    const imageBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(imageBuffer);

    // Convert to base64 in chunks to avoid stack overflow
    let base64 = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize);
      base64 += String.fromCharCode(...chunk);
    }
    base64 = btoa(base64);

    console.log(
      `Screenshot captured successfully, size: ${imageBuffer.byteLength} bytes, format: ${outputFormat}, device: ${deviceType}, zoom: ${effectiveZoom}`
    );

    // Determine MIME type based on format
    const mimeType = outputFormat === "pdf" ? "application/pdf" : `image/${outputFormat}`;

    return new Response(
      JSON.stringify({
        success: true,
        image: `data:${mimeType};base64,${base64}`,
        url,
        dimension: effectiveDimension,
        format: outputFormat,
        device: deviceType,
        capturedAt: new Date().toISOString(),
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
