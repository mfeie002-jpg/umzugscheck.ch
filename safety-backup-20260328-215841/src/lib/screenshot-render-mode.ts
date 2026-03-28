export const SCREENSHOT_RENDER_PARAM = "uc_render";

export function isScreenshotRenderMode(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get(SCREENSHOT_RENDER_PARAM) === "1";
}

export function addScreenshotRenderParam(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set(SCREENSHOT_RENDER_PARAM, "1");
    return u.toString();
  } catch {
    return url;
  }
}

export function addScreenshotRenderParamIfHost(url: string, hostOrHosts: string | string[]): string {
  try {
    const u = new URL(url);
    const hosts = Array.isArray(hostOrHosts) ? hostOrHosts : [hostOrHosts];

    const matches = hosts.some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`));
    if (!matches) return url;

    u.searchParams.set(SCREENSHOT_RENDER_PARAM, "1");
    return u.toString();
  } catch {
    return url;
  }
}
