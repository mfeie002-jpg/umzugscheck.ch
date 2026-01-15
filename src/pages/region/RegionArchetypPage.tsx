/**
 * ARCHETYP REGION PAGE
 * 
 * Eine einzige Seite für ALLE 26 Kantone.
 * Nutzt die zentrale Datenbank und Archetyp-Komponenten.
 * 
 * Ersetzt: ~28'650 Zeilen duplizierter Code
 * Neu: ~150 Zeilen Assembly-Code
 */

import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useMemo, useCallback } from "react";

// Archetyp Components
import {
  RegionHero,
  RegionStickyBar,
  RegionStats,
  RegionProviders,
  RegionHowItWorks,
  RegionTestimonials,
  RegionGuarantees,
  RegionPriceTable,
  RegionLocalTips,
  RegionServices,
  RegionFAQ,
  RegionNearby,
} from "@/components/region-archetyp";

// Data Layer
import { getRegionBySlug } from "@/data/regions-database";

// Transform services for component (icon -> string name)
const SERVICES_FOR_COMPONENT = [
  { title: "Endreinigung", icon: "Sparkles", description: "Wohnungsabnahme garantiert" },
  { title: "Ein-/Auspackservice", icon: "Package", description: "Professionelles Verpacken" },
  { title: "Möbelmontage", icon: "Wrench", description: "Auf- & Abbau vor Ort" },
  { title: "Möbellift", icon: "Truck", description: "Für schwere Möbel" },
  { title: "Einlagerung", icon: "Warehouse", description: "Sichere Lagerräume" },
  { title: "Entsorgung", icon: "Trash2", description: "Fachgerechte Entsorgung" },
];

const RegionArchetypPage = () => {
  // Support /umzugsfirmen/kanton-{slug} (via SlugResolver) and legacy /kanton/:slug routes
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  
  // Extract canton slug from kanton- prefix if present
  const effectiveSlug = useMemo(() => {
    if (!slug) return null;
    if (slug.startsWith('kanton-')) {
      return slug.replace('kanton-', '');
    }
    return slug;
  }, [slug]);

  // Get region data from central database
  const region = useMemo(() => {
    if (!effectiveSlug) return null;
    return getRegionBySlug(effectiveSlug);
  }, [effectiveSlug]);

  // Handle region change - now uses canonical kanton- URLs
  const handleRegionChange = useCallback((newSlug: string) => {
    if (newSlug !== effectiveSlug) {
      navigate(`/umzugsfirmen/kanton-${newSlug}`);
    }
  }, [navigate, effectiveSlug]);

  // 404 fallback
  if (!region) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Region nicht gefunden</h1>
          <p className="text-muted-foreground mb-6">Die gewünschte Region existiert nicht.</p>
          <button 
            onClick={() => navigate("/umzugsfirmen")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg"
          >
            Zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  // Transform nearby regions to slugs array
  const nearbySlugArray = region.nearbyRegions.map(r => r.slug);

  // Schema.org structured data
  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": `Umzugscheck.ch - Kanton ${region.name}`,
        "description": region.seo.description,
        "areaServed": { "@type": "Place", "name": `Kanton ${region.name}, Schweiz` },
        "priceRange": `CHF ${region.priceMatrix.small.min} - CHF ${region.priceMatrix.large.max}`,
        "aggregateRating": { 
          "@type": "AggregateRating", 
          "ratingValue": region.stats.avgRating.toString(), 
          "reviewCount": region.stats.reviewCount.toString() 
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": region.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background" data-uc-capture-root="1">
      <Helmet>
        <html lang="de-CH" />
        <title>{region.seo.title}</title>
        <meta name="description" content={region.seo.description} />
        {/* Canonical URL now uses /umzugsfirmen/kanton-{slug} format */}
        <link rel="canonical" href={`https://umzugscheck.ch/umzugsfirmen/kanton-${effectiveSlug}`} />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <main>
        {/* Zone 1: Above the Fold - Transaction Focus */}
        <RegionHero
          region={region}
          onRegionChange={handleRegionChange}
        />

        {/* Sticky CTA Bar (mobile) */}
        <RegionStickyBar region={region} />

        {/* Zone 2: Validation Layer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <RegionStats
            stats={{
              providerCount: region.stats.providerCount,
              reviewCount: region.stats.reviewCount,
              avgRating: region.stats.avgRating,
              activeUsers: region.stats.activeUsersBase,
            }}
            regionName={region.name}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionProviders
            companies={region.topCompanies}
            regionName={region.name}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionHowItWorks />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionTestimonials
            testimonials={region.testimonials}
            regionName={region.name}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionGuarantees />
        </motion.div>

        {/* Zone 3: SEO Layer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionPriceTable
            prices={region.priceMatrix}
            regionName={region.name}
            priceCoefficient={region.priceCoefficient}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionLocalTips
            tips={region.localTips}
            blurb={region.localBlurb}
            regionName={region.name}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionServices
            services={SERVICES_FOR_COMPONENT}
            regionName={region.name}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionFAQ faqs={region.faqs} regionName={region.name} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionNearby
            nearbyRegions={nearbySlugArray}
            currentRegion={region.name}
          />
        </motion.div>

        {/* Final CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Bereit für Ihren Umzug in {region.name}?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Vergleichen Sie jetzt {region.stats.providerCount}+ geprüfte Umzugsfirmen
              und sparen Sie bis zu 40%.
            </p>
            <button
              onClick={() => navigate("/umzugsofferten")}
              className="px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-semibold text-lg hover:bg-secondary/90 transition-colors shadow-lg"
            >
              Kostenlos Offerten erhalten
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RegionArchetypPage;
