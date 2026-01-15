/**
 * Localized Umzugsofferten Funnel
 * /umzugsofferten/[city] - e.g. /umzugsofferten/zuerich
 * 
 * SEO-optimized with city-specific content
 */

import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { UltimateSwissFlow } from "@/components/ultimate-flow";
import { useMemo } from "react";

// City data for localization
const CITY_DATA: Record<string, {
  name: string;
  canton: string;
  cantonCode: string;
  population: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
}> = {
  zuerich: {
    name: "Zürich",
    canton: "Zürich",
    cantonCode: "ZH",
    population: "420'000",
    description: "Grösste Stadt der Schweiz mit über 420'000 Einwohnern",
    metaTitle: "Umzugsofferten Zürich | Bis zu 5 Angebote vergleichen",
    metaDescription: "Vergleichen Sie kostenlos Umzugsofferten in Zürich. Geprüfte lokale Umzugsfirmen, faire Preise, bis zu 40% sparen. Jetzt unverbindlich anfragen!",
  },
  bern: {
    name: "Bern",
    canton: "Bern",
    cantonCode: "BE",
    population: "140'000",
    description: "Bundesstadt und Hauptstadt des Kantons Bern",
    metaTitle: "Umzugsofferten Bern | Kostenlos Angebote vergleichen",
    metaDescription: "Umzugsofferten in Bern vergleichen. Lokale geprüfte Umzugsfirmen, transparente Preise. Kostenlos & unverbindlich. Jetzt anfragen!",
  },
  basel: {
    name: "Basel",
    canton: "Basel-Stadt",
    cantonCode: "BS",
    population: "175'000",
    description: "Drittgrösste Stadt der Schweiz am Dreiländereck",
    metaTitle: "Umzugsofferten Basel | Geprüfte Umzugsfirmen vergleichen",
    metaDescription: "Umzugsofferten Basel: Bis zu 5 Angebote von lokalen Umzugsfirmen. Transparent, schnell, kostenlos. Jetzt Offerten einholen!",
  },
  luzern: {
    name: "Luzern",
    canton: "Luzern",
    cantonCode: "LU",
    population: "82'000",
    description: "Tor zur Zentralschweiz am Vierwaldstättersee",
    metaTitle: "Umzugsofferten Luzern | Umzugsfirmen vergleichen",
    metaDescription: "Umzugsofferten Luzern vergleichen: Geprüfte lokale Firmen, faire Preise, bis zu 40% sparen. Kostenlos & unverbindlich anfragen!",
  },
  winterthur: {
    name: "Winterthur",
    canton: "Zürich",
    cantonCode: "ZH",
    population: "115'000",
    description: "Sechstgrösste Stadt der Schweiz",
    metaTitle: "Umzugsofferten Winterthur | Bis zu 5 Angebote",
    metaDescription: "Umzugsofferten in Winterthur vergleichen. Lokale geprüfte Umzugsfirmen, transparente Preise. Jetzt kostenlos anfragen!",
  },
  stgallen: {
    name: "St. Gallen",
    canton: "St. Gallen",
    cantonCode: "SG",
    population: "80'000",
    description: "Hauptort des gleichnamigen Kantons in der Ostschweiz",
    metaTitle: "Umzugsofferten St. Gallen | Vergleichen & Sparen",
    metaDescription: "Umzugsofferten St. Gallen: Geprüfte Umzugsfirmen, faire Preise. Bis zu 5 Angebote kostenlos vergleichen. Jetzt anfragen!",
  },
  lausanne: {
    name: "Lausanne",
    canton: "Waadt",
    cantonCode: "VD",
    population: "140'000",
    description: "Viertgrösste Stadt der Schweiz am Genfersee",
    metaTitle: "Umzugsofferten Lausanne | Déménagement comparer",
    metaDescription: "Umzugsofferten Lausanne vergleichen: Geprüfte Umzugsfirmen, transparente Preise. Kostenlos & unverbindlich. Jetzt anfragen!",
  },
  genf: {
    name: "Genf",
    canton: "Genf",
    cantonCode: "GE",
    population: "200'000",
    description: "Internationale Stadt am Genfersee",
    metaTitle: "Umzugsofferten Genf | Déménagement Genève",
    metaDescription: "Umzugsofferten Genf: Bis zu 5 Angebote von geprüften Umzugsfirmen. Kostenlos vergleichen. Jetzt anfragen!",
  },
  lugano: {
    name: "Lugano",
    canton: "Tessin",
    cantonCode: "TI",
    population: "65'000",
    description: "Grösste Stadt im Tessin",
    metaTitle: "Umzugsofferten Lugano | Trasloco confrontare",
    metaDescription: "Umzugsofferten Lugano vergleichen: Geprüfte Firmen, faire Preise. Kostenlos & unverbindlich. Jetzt anfragen!",
  },
  aarau: {
    name: "Aarau",
    canton: "Aargau",
    cantonCode: "AG",
    population: "22'000",
    description: "Hauptort des Kantons Aargau",
    metaTitle: "Umzugsofferten Aarau | Umzugsfirmen Aargau",
    metaDescription: "Umzugsofferten Aarau: Lokale geprüfte Umzugsfirmen im Aargau. Kostenlos vergleichen, bis zu 40% sparen!",
  },
  thun: {
    name: "Thun",
    canton: "Bern",
    cantonCode: "BE",
    population: "45'000",
    description: "Stadt am Thunersee im Berner Oberland",
    metaTitle: "Umzugsofferten Thun | Umzugsfirmen vergleichen",
    metaDescription: "Umzugsofferten Thun: Geprüfte Umzugsfirmen im Berner Oberland. Kostenlos & unverbindlich vergleichen!",
  },
  chur: {
    name: "Chur",
    canton: "Graubünden",
    cantonCode: "GR",
    population: "38'000",
    description: "Älteste Stadt der Schweiz und Hauptort Graubündens",
    metaTitle: "Umzugsofferten Chur | Umzugsfirmen Graubünden",
    metaDescription: "Umzugsofferten Chur vergleichen: Lokale geprüfte Umzugsfirmen in Graubünden. Jetzt kostenlos anfragen!",
  },
  zug: {
    name: "Zug",
    canton: "Zug",
    cantonCode: "ZG",
    population: "30'000",
    description: "Hauptort des Kantons Zug",
    metaTitle: "Umzugsofferten Zug | Premium Umzugsservice",
    metaDescription: "Umzugsofferten Zug: Geprüfte Premium-Umzugsfirmen. Kostenlos vergleichen & sparen. Jetzt anfragen!",
  },
};

// Fallback city data for unknown cities
const DEFAULT_CITY = {
  name: "Schweiz",
  canton: "Schweiz",
  cantonCode: "CH",
  population: "8.7 Mio",
  description: "Schweizweite Umzugsofferten",
  metaTitle: "Umzugsofferten Schweiz | Kostenlos vergleichen",
  metaDescription: "Vergleichen Sie kostenlos Umzugsofferten in der Schweiz. Geprüfte Umzugsfirmen, faire Preise. Jetzt anfragen!",
};

export default function LocalizedUmzugsofferten() {
  const { city } = useParams<{ city: string }>();
  
  const cityData = useMemo(() => {
    if (!city) return DEFAULT_CITY;
    const normalized = city.toLowerCase().replace(/-/g, '');
    return CITY_DATA[normalized] || DEFAULT_CITY;
  }, [city]);

  // Redirect unknown cities to main page
  if (!city || (!CITY_DATA[city.toLowerCase().replace(/-/g, '')] && city !== 'schweiz')) {
    // Still render but with default data - no redirect to preserve SEO
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": cityData.metaTitle,
    "description": cityData.metaDescription,
    "url": `https://umzugscheck.ch/umzugsofferten/${city}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Umzugscheck.ch",
      "url": "https://umzugscheck.ch"
    },
    "about": {
      "@type": "Service",
      "serviceType": "Moving Service",
      "areaServed": {
        "@type": "City",
        "name": cityData.name,
        "containedIn": {
          "@type": "AdministrativeArea",
          "name": cityData.canton
        }
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{cityData.metaTitle} | Umzugscheck.ch</title>
        <meta name="description" content={cityData.metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://umzugscheck.ch/umzugsofferten/${city}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={cityData.metaTitle} />
        <meta property="og:description" content={cityData.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://umzugscheck.ch/umzugsofferten/${city}`} />
        <meta property="og:locale" content="de_CH" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      {/* City-specific header banner */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-3 text-center">
        <p className="text-sm font-medium">
          📍 Umzugsofferten für <span className="font-bold">{cityData.name}</span> ({cityData.canton})
        </p>
      </div>
      
      <UltimateSwissFlow />
    </>
  );
}
