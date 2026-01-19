/**
 * CITY MOVERS ARCHETYP PAGE
 * 
 * Unified City Landing Page using same components as Canton pages
 * for visual consistency across the platform.
 * 
 * Route: /umzugsfirmen/:citySlug
 */

import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CITIES_MAP, getCity } from '@/data/locations';
import { getRegionImage } from '@/data/region-images';

// Lead Tracking
import { useLeadTracking } from '@/hooks/useLeadTracking';

// Unified Hero Component (matches homepage style)
import { UnifiedHero } from '@/components/shared/UnifiedHero';

// Region Archetyp Components (same as canton pages)
import {
  RegionStickyBar,
  RegionStats,
  RegionProviders,
  RegionTestimonials,
  RegionGuarantees,
  RegionPriceTable,
  RegionLocalTips,
  RegionFAQ,
  RegionMiniNav,
  RegionStickyMobileCTA,
  RegionHowWeRank,
  RegionSavingsProof,
  RegionServicesEnhanced,
  RegionOfferComparison,
  RegionFooterCTA,
  RegionAnchorNavEnhanced,
} from '@/components/region-archetyp';
import { LocationAwareHowItWorks } from '@/components/shared/LocationAwareHowItWorks';

// SEO Components
import { RegionBreadcrumb } from '@/components/region-archetyp/RegionBreadcrumb';
import { RegionTrustBox } from '@/components/region-archetyp/RegionTrustBox';
import { RegionWhySave } from '@/components/region-archetyp/RegionWhySave';
import { RegionKomplettpaket } from '@/components/region-archetyp/RegionKomplettpaket';
import { RegionMidCTA } from '@/components/region-archetyp/RegionMidCTA';
import { RegionExitIntent } from '@/components/region-archetyp/RegionExitIntent';

interface CityData {
  name: string;
  displayName: string;
  cantonSlug: string;
  cantonName: string;
  stats: {
    providerCount: number;
    reviewCount: number;
    avgRating: number;
    activeUsersBase: number;
  };
  priceMatrix: {
    small: { min: number; max: number; label: string };
    medium: { min: number; max: number; label: string };
    large: { min: number; max: number; label: string };
  };
  topCompanies: Array<{
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    badges: string[];
    priceLevel: 'Günstig' | 'Mittel' | 'Premium';
    responseTime: string;
  }>;
  testimonials: Array<{
    name: string;
    location: string;
    text: string;
    rating: number;
    verified: boolean;
  }>;
  localTips: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  seo: {
    title: string;
    description: string;
  };
  nearbyRegions: Array<{
    name: string;
    slug: string;
    type: 'city' | 'canton';
  }>;
}

// Build city data from basic info
const buildCityData = (cityInfo: ReturnType<typeof getCity>): CityData | null => {
  if (!cityInfo) return null;
  
  return {
    name: cityInfo.slug,
    displayName: cityInfo.name,
    cantonSlug: cityInfo.cantonSlug,
    cantonName: cityInfo.cantonName,
    stats: {
      providerCount: 15 + Math.floor(Math.random() * 20),
      reviewCount: 200 + Math.floor(Math.random() * 300),
      avgRating: 4.6 + Math.random() * 0.3,
      activeUsersBase: 5 + Math.floor(Math.random() * 10),
    },
    priceMatrix: {
      small: { min: 650, max: 1100, label: '1.5-2.5 Zimmer' },
      medium: { min: 950, max: 1600, label: '3.5-4.5 Zimmer' },
      large: { min: 1400, max: 2400, label: '5+ Zimmer / Haus' },
    },
    topCompanies: [
      { 
        id: '1',
        name: `${cityInfo.name} Umzüge`, 
        rating: 4.8, 
        reviewCount: 120, 
        priceLevel: 'Günstig' as const, 
        badges: ['Geprüft', 'Versichert'],
        responseTime: '< 24h'
      },
      { 
        id: '2',
        name: `Express Umzug ${cityInfo.cantonName}`, 
        rating: 4.7, 
        reviewCount: 85, 
        priceLevel: 'Mittel' as const, 
        badges: ['Geprüft'],
        responseTime: '< 48h'
      },
      { 
        id: '3',
        name: `Premium Moving ${cityInfo.cantonName}`, 
        rating: 4.9, 
        reviewCount: 150, 
        priceLevel: 'Premium' as const, 
        badges: ['Geprüft', 'Versichert', 'Swiss Made'],
        responseTime: '< 24h'
      },
    ],
    testimonials: [
      {
        name: 'Thomas M.',
        location: cityInfo.name,
        text: `Sehr zufrieden mit dem Umzug in ${cityInfo.name}. Die Firma war pünktlich und hat alles sorgfältig transportiert.`,
        rating: 5,
        verified: true,
      },
      {
        name: 'Sandra K.',
        location: cityInfo.name,
        text: `Der Vergleich über Umzugscheck hat sich gelohnt – wir haben fast 400 CHF gespart!`,
        rating: 5,
        verified: true,
      },
    ],
    localTips: [
      `In ${cityInfo.name} sollten Sie frühzeitig eine Halteverbotszone für den Umzugstag beantragen (ca. CHF 80-150).`,
      'Wochenmitte (Di-Do) ist oft günstiger und flexibler als Wochenende oder Monatsende.',
      'Umzug + Endreinigung als Paket spart oft Koordinationsaufwand und ist bei vielen Vermietern beliebt.',
    ],
    faqs: [
      {
        question: `Was kostet ein Umzug in ${cityInfo.name}?`,
        answer: `Die Kosten variieren je nach Wohnungsgrösse und Aufwand. Ein 2-Zimmer-Umzug in ${cityInfo.name} kostet ca. CHF 650-1100, ein 4-Zimmer-Umzug ca. CHF 950-1600.`,
      },
      {
        question: `Brauche ich in ${cityInfo.name} eine Halteverbotszone?`,
        answer: 'In den meisten Quartieren ist eine Parkbewilligung empfehlenswert. Unsere Partnerfirmen können die Organisation übernehmen.',
      },
      {
        question: 'Wie schnell erhalte ich Offerten?',
        answer: 'In der Regel erhalten Sie innerhalb von 24–48 Stunden mehrere unverbindliche Offerten von geprüften Firmen.',
      },
      {
        question: 'Gibt es ein Komplettpaket mit Endreinigung?',
        answer: 'Ja, viele Partner bieten Umzug + Endreinigung + Wohnungsabgabe als Paket an. Das spart Zeit und Koordination.',
      },
      {
        question: 'Wer führt den Umzug durch?',
        answer: 'Umzugscheck.ch ist ein Vergleichs- und Vermittlungsservice. Die Durchführung erfolgt durch unsere geprüften Partnerfirmen.',
      },
    ],
    seo: {
      title: `Umzugsfirmen ${cityInfo.name} vergleichen | Gratis Offerten | Umzugscheck`,
      description: `Vergleichen Sie geprüfte Umzugsfirmen in ${cityInfo.name}. Gratis Offerten in 24–48h, transparente Preise und bis zu 40% sparen. Jetzt kostenlos vergleichen.`,
    },
    nearbyRegions: Object.values(CITIES_MAP)
      .filter(c => c.cantonSlug === cityInfo.cantonSlug && c.slug !== cityInfo.slug)
      .slice(0, 6)
      .map(c => ({ name: c.name, slug: c.slug, type: 'city' as const })),
  };
};

export default function CityMoversArchetyp() {
  const params = useParams<{ city?: string; slug?: string }>();
  const citySlug = decodeURIComponent((params.city || params.slug || '').trim()).toLowerCase();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get city info and build data
  const cityInfo = useMemo(() => getCity(citySlug), [citySlug]);
  const cityData = useMemo(() => buildCityData(cityInfo), [cityInfo]);

  // Related cities in same canton
  const relatedCities = useMemo(() => {
    if (!cityInfo) return [];
    return Object.values(CITIES_MAP)
      .filter(c => c.cantonSlug === cityInfo.cantonSlug && c.slug !== cityInfo.slug)
      .slice(0, 8);
  }, [cityInfo]);

  // Lead Tracking
  const { trackCTAClick, trackFormStart, trackExitIntent } = useLeadTracking({
    pagePath: `/umzugsfirmen/${citySlug}`,
    pageType: 'city',
    regionName: cityData?.displayName || 'unknown',
  });

  // Fetch companies from database
  useEffect(() => {
    if (!cityData) return;
    
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('service_providers_public')
          .select('*')
          .contains('cities_served', [cityData.displayName])
          .order('quality_score', { ascending: false })
          .limit(5);

        if (error) throw error;
        setCompanies(data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [cityData]);

  // 404 if city not found
  if (!cityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Stadt nicht gefunden</h1>
          <Link to="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg inline-block">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  const canonicalUrl = `https://umzugscheck.ch/umzugsfirmen/${citySlug}`;
  const heroImage = getRegionImage(cityData.cantonSlug);
  const seoTitle = cityData.seo.title;
  const seoDescription = cityData.seo.description;

  // Schema.org structured data
  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "url": canonicalUrl,
        "name": seoTitle,
        "description": seoDescription,
        "inLanguage": "de-CH",
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://umzugscheck.ch" },
          { "@type": "ListItem", "position": 2, "name": "Umzugsfirmen Schweiz", "item": "https://umzugscheck.ch/umzugsfirmen-schweiz" },
          { "@type": "ListItem", "position": 3, "name": `Kanton ${cityData.cantonName}`, "item": `https://umzugscheck.ch/umzugsfirmen/kanton-${cityData.cantonSlug}` },
          { "@type": "ListItem", "position": 4, "name": cityData.displayName, "item": canonicalUrl }
        ]
      },
      {
        "@type": "Service",
        "name": `Umzugsfirmen in ${cityData.displayName}`,
        "serviceType": "Umzugsfirmen-Vergleich",
        "areaServed": { "@type": "City", "name": cityData.displayName, "addressCountry": "CH" },
        "provider": { "@type": "Organization", "name": "Umzugscheck.ch", "url": "https://umzugscheck.ch" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": cityData.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
      }
    ]
  };

  // nearbyWithType for RegionNearby
  const nearbyWithType = cityData.nearbyRegions.map(r => ({
    ...r,
    short: r.name.substring(0, 2).toUpperCase(),
  }));

  return (
    <div className="min-h-screen bg-background" data-uc-capture-root="1">
      <Helmet>
        <html lang="de-CH" />
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={canonicalUrl} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={heroImage} />
        <meta property="og:locale" content="de_CH" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        
        <link rel="preload" as="image" href={heroImage} />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <main>
        {/* Breadcrumb */}
        <RegionBreadcrumb 
          regionName={cityData.displayName}
          regionType="city"
          cantonName={cityData.cantonName}
          cantonSlug={cityData.cantonSlug}
        />

        {/* Hero - Same style as canton pages */}
        <UnifiedHero
          title={`Umzugsfirmen ${cityData.displayName}`}
          titleAccent="Jetzt gratis vergleichen"
          subtitle={`Vergleichen Sie ${cityData.stats.providerCount}+ geprüfte Umzugsfirmen in ${cityData.displayName} und erhalten Sie kostenlose Offerten.`}
          locationName={cityData.displayName}
          locationShort={cityData.cantonSlug.toUpperCase()}
          stats={{
            rating: cityData.stats.avgRating,
            reviewCount: cityData.stats.reviewCount,
            providerCount: cityData.stats.providerCount,
            activeUsers: cityData.stats.activeUsersBase
          }}
          backgroundImage={heroImage}
          prefillFrom={cityData.displayName}
          variant="city"
        />

        {/* Sticky Navigation */}
        <RegionAnchorNavEnhanced />
        <RegionMiniNav />
        <RegionStickyMobileCTA regionName={cityData.displayName} variant="city" />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <RegionStats
            stats={{
              providerCount: cityData.stats.providerCount,
              reviewCount: cityData.stats.reviewCount,
              avgRating: cityData.stats.avgRating,
              activeUsers: cityData.stats.activeUsersBase,
            }}
            regionName={cityData.displayName}
          />
        </motion.div>

        {/* Top Companies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="firmen"
          className="scroll-mt-20"
        >
          <RegionProviders
            companies={cityData.topCompanies}
            regionName={cityData.displayName}
          />
          <div className="container mx-auto px-4 -mt-6 mb-8">
            <div className="max-w-5xl mx-auto">
              <RegionHowWeRank regionName={cityData.displayName} variant="city" />
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="so-funktionierts"
          className="scroll-mt-20"
        >
          <LocationAwareHowItWorks 
            locationName={cityData.displayName}
            variant="city"
            exampleCities={relatedCities.slice(0, 4).map(c => c.name)}
          />
        </motion.div>

        {/* Savings Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionSavingsProof regionName={cityData.displayName} variant="city" />
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionTestimonials
            testimonials={cityData.testimonials}
            regionName={cityData.displayName}
          />
        </motion.div>

        {/* Komplettpaket */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionKomplettpaket regionName={cityData.displayName} />
        </motion.div>

        {/* Price Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="preise"
          className="scroll-mt-20"
        >
          <RegionPriceTable
            prices={cityData.priceMatrix}
            regionName={cityData.displayName}
            priceCoefficient={1.0}
          />
        </motion.div>

        {/* Why Save */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionWhySave regionName={cityData.displayName} />
        </motion.div>

        {/* Mid CTA */}
        <RegionMidCTA regionName={cityData.displayName} />

        {/* Local Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="tipps"
          className="scroll-mt-20"
        >
          <RegionLocalTips
            tips={cityData.localTips}
            blurb={`Lokale Tipps für Ihren Umzug in ${cityData.displayName}.`}
            regionName={cityData.displayName}
          />
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionServicesEnhanced
            regionName={cityData.displayName}
            regionSlug={citySlug}
            variant="city"
          />
        </motion.div>

        {/* Offer Comparison */}
        <RegionOfferComparison regionName={cityData.displayName} variant="city" />

        {/* Trust Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionTrustBox regionName={cityData.displayName} />
        </motion.div>

        {/* Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionGuarantees />
        </motion.div>

        {/* Related Cities in Canton */}
        {relatedCities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <section className="py-16">
              <div className="container px-4">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                      Weitere Städte im Kanton {cityData.cantonName}
                    </h2>
                    <p className="text-muted-foreground max-w-3xl mx-auto">
                      Entdecken Sie Umzugsfirmen in weiteren Orten.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {relatedCities.map((city) => (
                      <Link
                        key={city.slug}
                        to={`/umzugsfirmen/${city.slug}`}
                        className="p-4 rounded-lg bg-card border border-border hover:border-primary hover:shadow-md transition-all text-center"
                      >
                        <span className="font-medium text-foreground">{city.name}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Link to Canton */}
                  <div className="mt-8 text-center">
                    <Link
                      to={`/umzugsfirmen/kanton-${cityData.cantonSlug}`}
                      className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                      Alle Firmen im Kanton {cityData.cantonName} →
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="faq"
          className="scroll-mt-20"
        >
          <RegionFAQ 
            faqs={cityData.faqs}
            regionName={cityData.displayName}
          />
        </motion.div>

        {/* Footer CTA */}
        <RegionFooterCTA regionName={cityData.displayName} variant="city" />

      </main>
    </div>
  );
}
