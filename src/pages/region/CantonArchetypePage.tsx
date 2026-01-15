/**
 * CANTON ARCHETYPE PAGE
 * 
 * Gold Standard Canton Landing Page Template
 * /umzugsfirmen/kanton-[cantonSlug]
 * 
 * Uses all archetype components for maximum conversion & SEO
 */

import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useMemo } from "react";

// Archetype Components
import {
  HeroWithPresets,
  TrustBar,
  HowItWorks3Steps,
  PriceModule,
  ServicesGrid,
  TopCompaniesPreview,
  TestimonialsArchetype,
  LocalTipsSection,
  FAQAccordionArchetype,
  CitiesDirectory,
  Breadcrumbs,
  InternalLinkingBlock,
  FinalCTA,
  StickyMobileCTA,
  SectionNav,
} from "@/components/archetype";

// Data
import { 
  KANTON_ZUG, 
  TRUST_GLOBALS,
  type CantonConfig,
} from "@/data/archetypeConfig";
import { getRegionBySlug } from "@/data/regions-database";
import { getRegionImage } from "@/data/region-images";

const CantonArchetypePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Extract canton slug from kanton- prefix
  const effectiveSlug = useMemo(() => {
    if (!slug) return null;
    return slug.startsWith('kanton-') ? slug.replace('kanton-', '') : slug;
  }, [slug]);
  
  // Get region data - first try archetype config, then fall back to legacy
  const { cantonData, legacyRegion } = useMemo(() => {
    if (!effectiveSlug) return { cantonData: null, legacyRegion: null };
    
    // Check archetype config first
    if (effectiveSlug === 'zug') {
      return { cantonData: KANTON_ZUG, legacyRegion: null };
    }
    
    // Fall back to legacy regions database
    const legacy = getRegionBySlug(effectiveSlug);
    return { cantonData: null, legacyRegion: legacy };
  }, [effectiveSlug]);
  
  // Use archetype data if available, otherwise adapt legacy
  const placeName = cantonData?.name || legacyRegion?.name || '';
  const stats = cantonData?.stats || (legacyRegion ? {
    providerCount: legacyRegion.stats.providerCount,
    reviewCount: legacyRegion.stats.reviewCount,
    avgRating: legacyRegion.stats.avgRating,
    activeUsersBase: legacyRegion.stats.activeUsersBase,
  } : { providerCount: 0, reviewCount: 0, avgRating: 0 });
  
  // 404 if not found
  if (!cantonData && !legacyRegion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Kanton nicht gefunden</h1>
          <p className="text-muted-foreground mb-6">Der gewünschte Kanton existiert nicht.</p>
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
  
  // SEO
  const seo = cantonData?.seo || {
    title: `Umzugsfirmen Kanton ${placeName} vergleichen | Umzugscheck`,
    description: `Vergleichen Sie geprüfte Umzugsfirmen im Kanton ${placeName}. Gratis Offerten in 24–48h. Bis zu 40% sparen.`,
    h1: `Umzugsfirmen im Kanton ${placeName} vergleichen`,
    canonicalUrl: `/umzugsfirmen/kanton-${effectiveSlug}`,
  };
  
  const heroImage = getRegionImage(effectiveSlug || 'default');
  
  // Breadcrumb items - split path items from current page
  const breadcrumbPathItems = [
    { label: 'Umzugsfirmen Schweiz', href: '/umzugsfirmen-schweiz' },
  ];
  const currentPageLabel = `Kanton ${placeName}`;
  
  // Section nav items
  const sectionNavItems = [
    { id: 'firmen', label: 'Top Firmen' },
    { id: 'preise', label: 'Preise' },
    { id: 'so-funktionierts', label: 'So gehts' },
    { id: 'services', label: 'Services' },
    { id: 'gemeinden', label: 'Gemeinden' },
    { id: 'faq', label: 'FAQ' },
  ];
  
  // ... rest of component
  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://umzugscheck.ch" },
          { "@type": "ListItem", "position": 2, "name": "Umzugsfirmen Schweiz", "item": "https://umzugscheck.ch/umzugsfirmen-schweiz" },
          { "@type": "ListItem", "position": 3, "name": currentPageLabel },
        ]
      },
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={`https://umzugscheck.ch${seo.canonicalUrl}`} />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <main>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbPathItems} currentPage={currentPageLabel} />

        {/* Hero */}
        <HeroWithPresets
          pageType="canton"
          placeName={placeName}
          placeSlug={effectiveSlug!}
          h1={seo.h1}
          subtitle={`Vergleichen Sie ${stats.providerCount}+ geprüfte Umzugsfirmen im Kanton ${placeName}. Kostenlose Offerten in 24–48h.`}
          stats={stats}
          backgroundImage={heroImage}
          citiesInCanton={citiesInCanton}
        />

        {/* Sticky Navigation */}
        <SectionNav items={sectionNavItems} />

        {/* Sticky Mobile CTA */}
        <StickyMobileCTA placeName={placeName} placeKind="canton" />

        {/* Trust Bar */}
        <TrustBar 
          stats={stats}
          trustGlobals={TRUST_GLOBALS}
          placeName={placeName}
          placeKind="canton"
        />

        {/* Top Companies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="firmen"
          className="scroll-mt-20"
        >
          <TopCompaniesPreview
            companies={topCompanies}
            placeName={placeName}
            placeKind="canton"
          />
        </motion.div>

        {/* Price Module */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="preise"
          className="scroll-mt-20"
        >
          <PriceModule
            priceAnchors={priceAnchors}
            placeName={placeName}
            placeKind="canton"
          />
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="so-funktionierts"
          className="scroll-mt-20"
        >
          <HowItWorks3Steps 
            placeName={placeName}
            placeKind="canton"
          />
        </motion.div>

        {/* Services Grid */}
        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            id="services"
            className="scroll-mt-20"
          >
            <ServicesGrid
              services={services}
              placeName={placeName}
              placeSlug={effectiveSlug!}
              placeKind="canton"
            />
          </motion.div>
        )}

        {/* Cities in Canton */}
        {citiesInCanton.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            id="gemeinden"
            className="scroll-mt-20"
          >
            <CitiesDirectory
              cities={citiesInCanton}
              cantonName={placeName}
            />
          </motion.div>
        )}

        {/* Local Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <LocalTipsSection
            tips={localTips}
            placeName={placeName}
            placeKind="canton"
          />
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <TestimonialsArchetype
            testimonials={testimonials}
            placeName={placeName}
          />
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="faq"
          className="scroll-mt-20"
        >
          <FAQAccordionArchetype
            faqs={faqs}
            placeName={placeName}
          />
        </motion.div>

        {/* Internal Linking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <InternalLinkingBlock
            links={internalLinks}
            placeName={placeName}
            placeKind="canton"
          />
        </motion.div>

        {/* Final CTA */}
        <FinalCTA 
          placeName={placeName}
          placeKind="canton"
        />
      </main>
    </div>
  );
};

export default CantonArchetypePage;
