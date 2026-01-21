/**
 * Dynamic Sitemap Generator Component
 * Generates XML sitemap for SEO
 */

import { Helmet } from "react-helmet";
import { memo } from "react";

// All main routes for sitemap
const SITEMAP_ROUTES = [
  // Core pages
  { path: "/", priority: 1.0, changefreq: "daily" },
  { path: "/vergleich", priority: 0.9, changefreq: "daily" },
  { path: "/umzugsofferten", priority: 0.9, changefreq: "daily" },
  
  // Services
  { path: "/privatumzug", priority: 0.8, changefreq: "weekly" },
  { path: "/firmenumzug", priority: 0.8, changefreq: "weekly" },
  { path: "/reinigung", priority: 0.8, changefreq: "weekly" },
  { path: "/entsorgung", priority: 0.8, changefreq: "weekly" },
  { path: "/lagerung", priority: 0.8, changefreq: "weekly" },
  { path: "/montage", priority: 0.7, changefreq: "weekly" },
  { path: "/moebellift", priority: 0.7, changefreq: "weekly" },
  { path: "/packservice", priority: 0.7, changefreq: "weekly" },
  { path: "/klaviertransport", priority: 0.7, changefreq: "weekly" },
  { path: "/seniorenumzug", priority: 0.7, changefreq: "weekly" },
  
  // Regions - Cantons
  { path: "/umzugsfirmen/kanton-zuerich", priority: 0.8, changefreq: "weekly" },
  { path: "/umzugsfirmen/kanton-bern", priority: 0.8, changefreq: "weekly" },
  { path: "/umzugsfirmen/kanton-basel", priority: 0.8, changefreq: "weekly" },
  { path: "/umzugsfirmen/kanton-aargau", priority: 0.8, changefreq: "weekly" },
  { path: "/umzugsfirmen/kanton-luzern", priority: 0.7, changefreq: "weekly" },
  { path: "/umzugsfirmen/kanton-st-gallen", priority: 0.7, changefreq: "weekly" },
  { path: "/umzugsfirmen/kanton-genf", priority: 0.7, changefreq: "weekly" },
  { path: "/umzugsfirmen/kanton-waadt", priority: 0.7, changefreq: "weekly" },
  
  // Ranking pages
  { path: "/beste-umzugsfirma", priority: 0.8, changefreq: "weekly" },
  { path: "/guenstige-umzugsfirma", priority: 0.8, changefreq: "weekly" },
  { path: "/umzugsfirmen-schweiz", priority: 0.9, changefreq: "weekly" },
  
  // Ratgeber
  { path: "/ratgeber/umzugskosten", priority: 0.7, changefreq: "monthly" },
  { path: "/ratgeber/umzugstipps", priority: 0.7, changefreq: "monthly" },
  { path: "/ratgeber/checkliste", priority: 0.7, changefreq: "monthly" },
  { path: "/umzugs-checkliste", priority: 0.7, changefreq: "monthly" },
  
  // Calculators
  { path: "/reinigungsrechner", priority: 0.7, changefreq: "monthly" },
  { path: "/entsorgungsrechner", priority: 0.7, changefreq: "monthly" },
  { path: "/lagerrechner", priority: 0.7, changefreq: "monthly" },
  
  // Info pages
  { path: "/ueber-uns", priority: 0.5, changefreq: "monthly" },
  { path: "/kontakt", priority: 0.5, changefreq: "monthly" },
  { path: "/faq", priority: 0.6, changefreq: "monthly" },
  { path: "/so-funktionierts", priority: 0.6, changefreq: "monthly" },
  
  // Legal
  { path: "/datenschutz", priority: 0.3, changefreq: "yearly" },
  { path: "/agb", priority: 0.3, changefreq: "yearly" },
  { path: "/impressum", priority: 0.3, changefreq: "yearly" },
  
  // Provider
  { path: "/fuer-firmen", priority: 0.6, changefreq: "weekly" },
  { path: "/anbieter-werden", priority: 0.6, changefreq: "weekly" },
];

export interface SitemapEntry {
  path: string;
  priority: number;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  lastmod?: string;
}

export function generateSitemapXML(baseUrl: string = "https://umzugscheck.ch"): string {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  SITEMAP_ROUTES.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Component to add sitemap reference in head
export const SitemapReference = memo(function SitemapReference() {
  return (
    <Helmet>
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
    </Helmet>
  );
});

// Generate robots.txt content
export function generateRobotsTxt(baseUrl: string = "https://umzugscheck.ch"): string {
  return `# Robots.txt for Umzugscheck.ch
User-agent: *
Allow: /

# Disallow admin and internal pages
Disallow: /admin/
Disallow: /admin/*
Disallow: /flow-tester
Disallow: /intern/*
Disallow: /demo-ergebnis
Disallow: /all-flows-review

# Allow important pages
Allow: /vergleich
Allow: /umzugsofferten
Allow: /umzugsfirmen/
Allow: /ratgeber/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for politeness
Crawl-delay: 1
`;
}

export default SitemapReference;
