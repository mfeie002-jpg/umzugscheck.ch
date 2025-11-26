/**
 * Complete SEO Meta Generator for umzugscheck.ch
 * Generates meta titles, descriptions, and OG tags for all page types
 */

import { CITIES, SERVICES, SITE_CONFIG } from '@/data/constants';

export interface MetaData {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
}

export interface PageContext {
  type: 'home' | 'city' | 'service' | 'city-service' | 'offerten' | 'preise' | 'vergleich' | 'faq' | 'ratgeber';
  city?: string;
  service?: string;
  url: string;
}

/**
 * Generate complete meta data for any page
 */
export function generateCompleteMeta(context: PageContext): MetaData {
  const { type, city, service, url } = context;

  switch (type) {
    case 'home':
      return {
        title: 'Umzugsvergleich Schweiz | Kostenlos Offerten erhalten',
        description: 'Vergleiche geprüfte Umzugsfirmen in der Schweiz. Kostenlose Offerten, 4.8 Sterne, 15\'000+ vermittelte Umzüge. In 2 Minuten zum besten Angebot.',
        ogImage: `${SITE_CONFIG.url}/assets/og-home.png`,
        canonical: SITE_CONFIG.url,
      };

    case 'city':
      if (!city) throw new Error('City required for city pages');
      const cityName = getCityName(city);
      return {
        title: `Umzugsfirmen in ${cityName} | Preise & Offerten 2025`,
        description: `Top Umzugsfirmen in ${cityName} vergleichen. Kostenlose Offerten von lokalen Profis, faire Preise, schnelle Termine.`,
        ogImage: `${SITE_CONFIG.url}/assets/og-${city}.png`,
        canonical: `${SITE_CONFIG.url}/${city}/umzugsfirmen/`,
      };

    case 'service':
      if (!service) throw new Error('Service required for service pages');
      const serviceName = getServiceName(service);
      return {
        title: `${serviceName} Schweiz | Beste Umzugsfirmen vergleichen`,
        description: `Professionelle ${serviceName} in der Schweiz. Kostenlose Offerten, geprüfte Anbieter, schnelle Verfügbarkeit.`,
        ogImage: `${SITE_CONFIG.url}/assets/og-${service}.png`,
        canonical: `${SITE_CONFIG.url}/${service}/`,
      };

    case 'city-service':
      if (!city || !service) throw new Error('City and service required');
      const cityNameCS = getCityName(city);
      const serviceNameCS = getServiceName(service);
      return {
        title: `${serviceNameCS} in ${cityNameCS} | Preise & Offerten 2025`,
        description: `Top Anbieter für ${serviceNameCS} in ${cityNameCS} vergleichen. Kostenlose Offerten, regionale Profis, schnelle Termine.`,
        ogImage: `${SITE_CONFIG.url}/assets/og-${city}-${service}.png`,
        canonical: `${SITE_CONFIG.url}/${city}/${service}/`,
      };

    case 'offerten':
      return {
        title: 'Umzugsofferten vergleichen | Bis zu 40% sparen',
        description: 'Vergleiche kostenlose Umzugsofferten von geprüften Schweizer Anbietern. Spare bis zu 40% auf deinem Umzug.',
        ogImage: `${SITE_CONFIG.url}/assets/og-offerten.png`,
        canonical: `${SITE_CONFIG.url}/umzugsofferten`,
      };

    case 'preise':
      return {
        title: 'Umzugskosten Schweiz 2025 | Was kostet ein Umzug?',
        description: 'Was kostet ein Umzug in der Schweiz? Preisübersicht, Kostenfaktoren und Spartipps für deinen Umzug 2025.',
        ogImage: `${SITE_CONFIG.url}/assets/og-preise.png`,
        canonical: `${SITE_CONFIG.url}/preise`,
      };

    case 'vergleich':
      return {
        title: 'Umzugsfirmen vergleichen | Die besten Anbieter 2025',
        description: 'Vergleiche die besten Umzugsfirmen der Schweiz. Bewertungen, Preise, Verfügbarkeit. Finde die perfekte Umzugsfirma.',
        ogImage: `${SITE_CONFIG.url}/assets/og-vergleich.png`,
        canonical: `${SITE_CONFIG.url}/vergleich`,
      };

    case 'faq':
      return {
        title: 'FAQ | Häufige Fragen zu Umzügen in der Schweiz',
        description: 'Antworten auf die häufigsten Fragen rund um Umzüge, Kosten, Ablauf und Umzugsfirmen in der Schweiz.',
        ogImage: `${SITE_CONFIG.url}/assets/og-faq.png`,
        canonical: `${SITE_CONFIG.url}/faq`,
      };

    case 'ratgeber':
      return {
        title: 'Umzugsratgeber | Tipps & Checklisten für deinen Umzug',
        description: 'Hilfreiche Tipps, Checklisten und Ratgeber für einen stressfreien Umzug in der Schweiz.',
        ogImage: `${SITE_CONFIG.url}/assets/og-ratgeber.png`,
        canonical: `${SITE_CONFIG.url}/ratgeber`,
      };

    default:
      return {
        title: 'umzugscheck.ch | Umzugsfirmen vergleichen',
        description: 'Vergleiche Umzugsfirmen in der Schweiz und spare Zeit und Geld.',
        ogImage: `${SITE_CONFIG.url}/assets/og-default.png`,
        canonical: url,
      };
  }
}

/**
 * Generate Open Graph tags
 */
export function generateOGTagsComplete(meta: MetaData, url: string): Record<string, string> {
  return {
    'og:title': meta.title,
    'og:description': meta.description,
    'og:type': 'website',
    'og:url': url,
    'og:image': meta.ogImage || `${SITE_CONFIG.url}/assets/og-default.png`,
    'og:site_name': SITE_CONFIG.name,
    'og:locale': 'de_CH',
    'twitter:card': 'summary_large_image',
    'twitter:title': meta.title,
    'twitter:description': meta.description,
    'twitter:image': meta.ogImage || `${SITE_CONFIG.url}/assets/og-default.png`,
    'twitter:site': SITE_CONFIG.twitterHandle,
  };
}

// Helper functions
function getCityName(slug: string): string {
  const city = CITIES.find(c => c.slug === slug);
  return city?.name || slug;
}

function getServiceName(slug: string): string {
  const service = SERVICES.find(s => s.slug === slug);
  return service?.name || slug;
}
