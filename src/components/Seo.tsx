import { Helmet } from "react-helmet";

type SeoProps = {
  title: string;
  description: string;
  path: string; // e.g. "/umzugsfirmen/zuerich"
  robots?: string;
  jsonLd?: Record<string, unknown> | null;
  keywords?: string;
};

/**
 * Check if the current hostname is a preview/staging domain
 * Preview domains should be noindex to prevent SEO issues
 */
function isPreviewHost(hostname: string): boolean {
  return (
    hostname.includes("lovable.app") ||
    hostname.includes("lovableproject.com") ||
    hostname.includes("preview--") ||
    hostname.includes("localhost")
  );
}

/**
 * Build canonical URL from path
 * Uses production domain for canonical URLs
 */
function canonicalFromPath(path: string): string {
  // Always use production domain for canonical URLs
  const origin = "https://umzugscheck.ch";
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Unified SEO Component with:
 * - Meta title & description
 * - Canonical URL (always production domain)
 * - robots noindex for preview domains
 * - Open Graph tags
 * - JSON-LD structured data
 */
export function Seo({ title, description, path, robots, jsonLd, keywords }: SeoProps) {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const canonical = canonicalFromPath(path);
  
  // Preview domains get noindex, production gets index
  const finalRobots =
    robots ??
    (hostname && isPreviewHost(hostname) ? "noindex,nofollow" : "index,follow");

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={finalRobots} />
      
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Language & Region */}
      <meta name="language" content="de-CH" />
      <meta name="geo.region" content="CH" />
      <meta name="geo.placename" content="Switzerland" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="de_CH" />
      <meta property="og:site_name" content="Umzugscheck.ch" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}

export default Seo;
