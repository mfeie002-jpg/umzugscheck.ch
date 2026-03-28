/**
 * SEO Meta Templates
 * 
 * Centralized meta title/description templates for all page types
 * Ensures consistency and optimal length for SERP display
 */

// Title should be < 60 chars, description < 160 chars

export interface MetaTemplate {
  title: string;
  description: string;
  keywords?: string[];
}

/**
 * Homepage meta
 */
export const getHomepageMeta = (): MetaTemplate => ({
  title: "Umzugsfirmen vergleichen Schweiz 2025 | Umzugscheck.ch",
  description: "Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. Smart-Preisrechner, transparente Preise. Jetzt vergleichen & bis zu 40% sparen!",
  keywords: ["Umzug Schweiz", "Umzugsfirma vergleichen", "Umzugsofferten", "Umzugskosten"]
});

/**
 * City/Region page meta
 */
export const getCityMeta = (cityName: string, companyCount: number = 20): MetaTemplate => ({
  title: `Umzugsfirmen ${cityName} vergleichen 2025 | Umzugscheck.ch`,
  description: `${companyCount}+ geprüfte Umzugsfirmen in ${cityName} vergleichen. Kostenlose Offerten, faire Preise, echte Bewertungen. Jetzt in ${cityName} bis zu 40% sparen!`,
  keywords: [`Umzug ${cityName}`, `Umzugsfirma ${cityName}`, `Umzugskosten ${cityName}`]
});

/**
 * Canton page meta
 */
export const getCantonMeta = (cantonName: string, companyCount: number = 30): MetaTemplate => ({
  title: `Umzugsfirmen Kanton ${cantonName} 2025 | Umzugscheck.ch`,
  description: `${companyCount}+ Umzugsfirmen im Kanton ${cantonName} vergleichen. Kostenlose Offerten, geprüfte Partner, faire Preise. Jetzt Angebote erhalten!`,
  keywords: [`Umzug ${cantonName}`, `Umzugsfirma ${cantonName}`, `Kanton ${cantonName} Umzug`]
});

/**
 * Service page meta
 */
export const getServiceMeta = (serviceName: string, priceRange?: string): MetaTemplate => ({
  title: `${serviceName} Schweiz – Preise & Anbieter 2025 | Umzugscheck.ch`,
  description: `${serviceName} in der Schweiz${priceRange ? ` ab ${priceRange}` : ''}. Geprüfte Anbieter vergleichen, kostenlose Offerten erhalten. Bis zu 40% sparen!`,
  keywords: [serviceName, `${serviceName} Schweiz`, `${serviceName} Kosten`, `${serviceName} Preise`]
});

/**
 * Ratgeber/Guide page meta
 */
export const getRatgeberMeta = (topic: string): MetaTemplate => ({
  title: `${topic} – Ratgeber & Tipps 2025 | Umzugscheck.ch`,
  description: `Alles über ${topic}: Praktische Tipps, Checklisten und Expertenrat. Kostenloser Ratgeber für Ihren Umzug in der Schweiz.`,
  keywords: [topic, `${topic} Tipps`, `${topic} Checkliste`, "Umzug Ratgeber"]
});

/**
 * Company listing page meta
 */
export const getCompanyListMeta = (filterType?: 'beste' | 'guenstige'): MetaTemplate => {
  if (filterType === 'beste') {
    return {
      title: "Beste Umzugsfirmen Schweiz 2025 – Top bewertet | Umzugscheck.ch",
      description: "Die bestbewerteten Umzugsfirmen der Schweiz im Vergleich. Echte Kundenbewertungen, geprüfte Qualität. Jetzt Top-Firmen finden!",
      keywords: ["beste Umzugsfirma", "Top Umzugsfirmen Schweiz", "Umzugsfirma Bewertungen"]
    };
  }
  if (filterType === 'guenstige') {
    return {
      title: "Günstige Umzugsfirmen Schweiz 2025 | Umzugscheck.ch",
      description: "Günstige Umzugsfirmen in der Schweiz finden. Preise vergleichen, bis zu 40% sparen. Qualität zum fairen Preis!",
      keywords: ["günstige Umzugsfirma", "billige Umzugsfirma", "Umzug günstig"]
    };
  }
  return {
    title: "Umzugsfirmen Schweiz vergleichen 2025 | Umzugscheck.ch",
    description: "200+ Schweizer Umzugsfirmen im Vergleich. Filter nach Region, Preis, Bewertung. Jetzt kostenlos Offerten erhalten!",
    keywords: ["Umzugsfirmen Schweiz", "Umzugsfirma finden", "Umzugsfirmen vergleichen"]
  };
};

/**
 * Calculator page meta
 */
export const getCalculatorMeta = (calculatorType: string): MetaTemplate => ({
  title: `${calculatorType} – Kosten berechnen 2025 | Umzugscheck.ch`,
  description: `${calculatorType}: Berechnen Sie Ihre Kosten in 2 Minuten. Kostenlos, unverbindlich, sofortige Preisschätzung für Ihren Umzug.`,
  keywords: [`${calculatorType}`, "Umzugskosten berechnen", "Umzug Preisrechner"]
});

/**
 * Generate canonical URL
 */
export const getCanonicalUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `https://umzugscheck.ch${cleanPath}`;
};

/**
 * Generate Open Graph tags
 */
export const getOGTags = (meta: MetaTemplate, path: string, image?: string) => ({
  "og:title": meta.title,
  "og:description": meta.description,
  "og:url": getCanonicalUrl(path),
  "og:type": "website",
  "og:image": image || "https://umzugscheck.ch/og-image.jpg",
  "og:locale": "de_CH",
  "og:site_name": "Umzugscheck.ch"
});
