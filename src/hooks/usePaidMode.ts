import { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";

export type PaidModeConfig = {
  isPaidTraffic: boolean;
  isPremiumMode: boolean; // Zug/Baar and other premium areas
  city?: string;
  keyword?: string;
  campaign?: string;
  source?: string;
};

export type DynamicContent = {
  headline: string;
  subheadline: string;
  ctaText: string;
  wording: "premium" | "standard" | "empathetic";
};

const premiumCities = [
  "zug",
  "baar",
  "kuesnacht",
  "pfaffikon",
  "wollerau",
  "freienbach",
];

const toTitleCase = (value?: string) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "";

/**
 * Hook to detect paid traffic and adapt content dynamically
 * Reads URL parameters: utm_campaign, utm_term, city, kw, loc
 */
export function usePaidMode(): PaidModeConfig {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [config, setConfig] = useState<PaidModeConfig>({
    isPaidTraffic: false,
    isPremiumMode: false,
  });

  useEffect(() => {
    const utmSource = searchParams.get("utm_source")?.toLowerCase();
    const utmMedium = searchParams.get("utm_medium")?.toLowerCase();
    const utmCampaign = searchParams.get("utm_campaign")?.toLowerCase() ?? "";
    const utmTerm = searchParams.get("utm_term");
    const cityParam = searchParams.get("city") || searchParams.get("loc");
    const kwParam = searchParams.get("kw");
    const paidMode = searchParams.get("mode")?.toLowerCase();
    const gclid = searchParams.get("gclid");

    const isPaid =
      Boolean(gclid) ||
      paidMode === "paid" ||
      utmSource === "google" ||
      utmMedium === "cpc" ||
      utmMedium === "ppc" ||
      utmCampaign.includes("paid") ||
      utmCampaign.includes("ads") ||
      utmCampaign.includes("lsa") ||
      utmCampaign.includes("ppc");

    const cityNormalized = cityParam?.toLowerCase();
    const pathCity = location.pathname.match(/\/area\/([^/]+)/)?.[1];
    const pathCityNormalized = pathCity?.toLowerCase();

    const isPremium =
      (cityNormalized && premiumCities.includes(cityNormalized)) ||
      (pathCityNormalized && premiumCities.includes(pathCityNormalized));

    setConfig({
      isPaidTraffic: isPaid,
      isPremiumMode: isPremium,
      city: cityParam || pathCity,
      keyword: kwParam || utmTerm || undefined,
      campaign: utmCampaign || undefined,
      source: utmSource || undefined,
    });
  }, [searchParams, location]);

  return config;
}

/**
 * Get dynamic content based on paid mode configuration
 */
export function useDynamicContent(): DynamicContent {
  const paidMode = usePaidMode();

  if (paidMode.isPremiumMode) {
    const cityName = toTitleCase(paidMode.city);
    return {
      headline: cityName
        ? `Ihr Premium Umzug in ${cityName}`
        : "Ihr Premium Umzug - Diskret und Sorglos",
      subheadline: "Full-Service inkl. Packing, Reinigung und Entsorgung",
      ctaText: "Premium-Termin sichern",
      wording: "premium",
    };
  }

  if (paidMode.keyword?.toLowerCase().includes("senior")) {
    return {
      headline: "Umzug fuer Senioren - Geduldig und Einfuehlsam",
      subheadline: "Wir nehmen uns Zeit fuer Ihren neuen Lebensabschnitt",
      ctaText: "Beratungstermin vereinbaren",
      wording: "empathetic",
    };
  }

  if (paidMode.isPaidTraffic && paidMode.city) {
    const cityName = toTitleCase(paidMode.city);
    return {
      headline: `Ihr Umzug in ${cityName} - Jetzt in 5 Min. Termin sichern`,
      subheadline: "Feierabend ab dem ersten Anruf - wir machen die Arbeit",
      ctaText: "Jetzt Termin sichern",
      wording: "standard",
    };
  }

  return {
    headline: "Umzug in besten Haenden - Feierabend Umzuege",
    subheadline: "Familienunternehmen seit 1980 - Swiss Quality und Festpreise",
    ctaText: "Offerte anfordern",
    wording: "standard",
  };
}
