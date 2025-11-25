import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SWISS_CANTONS = [
  { code: "AG", name: "Aargau" },
  { code: "AI", name: "Appenzell Innerrhoden" },
  { code: "AR", name: "Appenzell Ausserrhoden" },
  { code: "BE", name: "Bern" },
  { code: "BL", name: "Basel-Landschaft" },
  { code: "BS", name: "Basel-Stadt" },
  { code: "FR", name: "Freiburg" },
  { code: "GE", name: "Genf" },
  { code: "GL", name: "Glarus" },
  { code: "GR", name: "Graubünden" },
  { code: "JU", name: "Jura" },
  { code: "LU", name: "Luzern" },
  { code: "NE", name: "Neuenburg" },
  { code: "NW", name: "Nidwalden" },
  { code: "OW", name: "Obwalden" },
  { code: "SG", name: "St. Gallen" },
  { code: "SH", name: "Schaffhausen" },
  { code: "SO", name: "Solothurn" },
  { code: "SZ", name: "Schwyz" },
  { code: "TG", name: "Thurgau" },
  { code: "TI", name: "Tessin" },
  { code: "UR", name: "Uri" },
  { code: "VD", name: "Waadt" },
  { code: "VS", name: "Wallis" },
  { code: "ZG", name: "Zug" },
  { code: "ZH", name: "Zürich" },
];

export default function Sitemap() {
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const { data } = await supabase
      .from("companies")
      .select("id, name")
      .limit(100);
    
    setCompanies(data || []);
  };

  const baseUrl = "https://umzugscheck.ch";

  const generateSitemap = () => {
    const urls = [
      { loc: baseUrl, priority: "1.0", changefreq: "daily" },
      { loc: `${baseUrl}/preise`, priority: "0.9", changefreq: "weekly" },
      { loc: `${baseUrl}/vergleich`, priority: "0.9", changefreq: "weekly" },
      { loc: `${baseUrl}/offerte`, priority: "0.9", changefreq: "weekly" },
      { loc: `${baseUrl}/rechner`, priority: "1.0", changefreq: "daily" },
      { loc: `${baseUrl}/rechner/video`, priority: "0.9", changefreq: "weekly" },
      { loc: `${baseUrl}/rechner/reinigung`, priority: "0.8", changefreq: "weekly" },
      { loc: `${baseUrl}/rechner/entsorgung`, priority: "0.8", changefreq: "weekly" },
      { loc: `${baseUrl}/rechner/lager`, priority: "0.8", changefreq: "weekly" },
      { loc: `${baseUrl}/rechner/packservice`, priority: "0.8", changefreq: "weekly" },
      { loc: `${baseUrl}/rechner/moebelmontage`, priority: "0.8", changefreq: "weekly" },
      { loc: `${baseUrl}/umzugsfirmen`, priority: "0.9", changefreq: "daily" },
      { loc: `${baseUrl}/dienstleistungen`, priority: "0.8", changefreq: "weekly" },
      { loc: `${baseUrl}/ratgeber`, priority: "0.8", changefreq: "daily" },
      { loc: `${baseUrl}/über-uns`, priority: "0.7", changefreq: "monthly" },
      { loc: `${baseUrl}/kontakt`, priority: "0.7", changefreq: "monthly" },
      { loc: `${baseUrl}/datenschutz`, priority: "0.5", changefreq: "monthly" },
      { loc: `${baseUrl}/agb`, priority: "0.5", changefreq: "monthly" },
      { loc: `${baseUrl}/impressum`, priority: "0.5", changefreq: "monthly" },
      { loc: `${baseUrl}/cookies`, priority: "0.5", changefreq: "monthly" },
      { loc: `${baseUrl}/anbieter-werden`, priority: "0.8", changefreq: "monthly" },
      ...SWISS_CANTONS.map((canton) => ({
        loc: `${baseUrl}/kanton/${canton.code.toLowerCase()}`,
        priority: "0.8",
        changefreq: "weekly",
      })),
      ...companies.map((company) => ({
        loc: `${baseUrl}/umzugsfirmen/${company.id}`,
        priority: "0.7",
        changefreq: "weekly",
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return xml;
  };

  const handleDownload = () => {
    const xml = generateSitemap();
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Sitemap</h1>
      <div className="mb-6">
        <button
          onClick={handleDownload}
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          Download sitemap.xml
        </button>
      </div>
      <pre className="bg-muted p-4 rounded overflow-auto text-sm">
        {generateSitemap()}
      </pre>
    </div>
  );
}
