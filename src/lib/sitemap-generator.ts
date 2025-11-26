// Sitemap generator for SEO optimization

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const BASE_URL = 'https://umzugscheck.ch';

const cities = [
  'zuerich', 'basel', 'bern', 'genf', 'lausanne', 'luzern', 
  'winterthur', 'stgallen', 'zug', 'lugano', 'biel', 'aarau',
  'schaffhausen', 'chur'
];

const services = [
  'umzug', 'reinigung', 'raeumung', 'firmenumzug',
  'entsorgung', 'lagerung', 'transport', 'umzug-mit-reinigung'
];

export const generateSitemapUrls = (): SitemapUrl[] => {
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];

  // Core pages
  const corePages: SitemapUrl[] = [
    { loc: `${BASE_URL}/`, changefreq: 'daily', priority: 1.0, lastmod: today },
    { loc: `${BASE_URL}/offerten/`, changefreq: 'daily', priority: 0.9, lastmod: today },
    { loc: `${BASE_URL}/preise/`, changefreq: 'weekly', priority: 0.8, lastmod: today },
    { loc: `${BASE_URL}/vergleich/`, changefreq: 'daily', priority: 0.9, lastmod: today },
    { loc: `${BASE_URL}/faq/`, changefreq: 'monthly', priority: 0.7, lastmod: today },
    { loc: `${BASE_URL}/ueber-uns/`, changefreq: 'monthly', priority: 0.6, lastmod: today },
    { loc: `${BASE_URL}/firmen/`, changefreq: 'daily', priority: 0.9, lastmod: today },
    { loc: `${BASE_URL}/beste-umzugsfirma/`, changefreq: 'daily', priority: 0.9, lastmod: today },
    { loc: `${BASE_URL}/guenstige-umzugsfirma/`, changefreq: 'daily', priority: 0.9, lastmod: today },
    { loc: `${BASE_URL}/umzugsofferten/`, changefreq: 'daily', priority: 0.9, lastmod: today },
  ];

  urls.push(...corePages);

  // City pages
  cities.forEach(city => {
    urls.push({
      loc: `${BASE_URL}/${city}/umzugsfirmen/`,
      changefreq: 'daily',
      priority: 0.85,
      lastmod: today
    });
  });

  // Service pages
  services.forEach(service => {
    urls.push({
      loc: `${BASE_URL}/${service}/`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: today
    });
  });

  // City + Service combinations
  cities.forEach(city => {
    services.forEach(service => {
      urls.push({
        loc: `${BASE_URL}/${city}/${service}/`,
        changefreq: 'weekly',
        priority: 0.75,
        lastmod: today
      });
    });
  });

  return urls;
};

export const generateSitemapXML = (): string => {
  const urls = generateSitemapUrls();
  
  const urlsXML = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority.toFixed(1)}</priority>` : ''}
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;
};

export const getTotalUrls = (): number => {
  return generateSitemapUrls().length;
};
