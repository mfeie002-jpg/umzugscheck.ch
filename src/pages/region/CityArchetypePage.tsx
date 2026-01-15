/**
 * CITY ARCHETYPE PAGE
 * 
 * Gold Standard City Landing Page Template
 * /umzugsfirmen/[citySlug]
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
  QuartiereSection,
  Breadcrumbs,
  InternalLinkingBlock,
  FinalCTA,
  StickyMobileCTA,
  SectionNav,
} from "@/components/archetype";

// Data
import { 
  STADT_ZUG,
  STADT_BAAR,
  STADT_CHAM,
  TRUST_GLOBALS,
  type CityConfig,
} from "@/data/archetypeConfig";
import { getCity } from "@/data/locations";
import { getRegionImage } from "@/data/region-images";

const CityArchetypePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Get city data - first try archetype config, then fall back to legacy
  const { cityData, legacyCity } = useMemo(() => {
    if (!slug) return { cityData: null, legacyCity: null };
    
    // Check archetype config first
    if (slug === 'zug') return { cityData: STADT_ZUG, legacyCity: null };
    if (slug === 'baar') return { cityData: STADT_BAAR, legacyCity: null };
    if (slug === 'cham') return { cityData: STADT_CHAM, legacyCity: null };
    
    // Fall back to legacy city lookup
    const legacy = getCity(slug);
    return { cityData: null, legacyCity: legacy };
  }, [slug]);
  
  // Use archetype data if available
  const placeName = cityData?.name || legacyCity?.name || '';
  const cantonName = cityData?.cantonName || legacyCity?.cantonName || '';
  const cantonSlug = cityData?.cantonSlug || legacyCity?.cantonSlug || '';
  
  const stats = cityData?.stats || {
    providerCount: 15,
    reviewCount: 500,
    avgRating: 4.7,
    activeUsersBase: 8,
  };
  
  // 404 if not found
  if (!cityData && !legacyCity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Stadt nicht gefunden</h1>
          <p className="text-muted-foreground mb-6">Die gewünschte Stadt existiert nicht.</p>
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
  const seo = cityData?.seo || {
    title: `Umzugsfirmen in ${placeName} vergleichen | Umzugscheck`,
    description: `Vergleichen Sie geprüfte Umzugsfirmen in ${placeName}. Gratis Offerten in 24–48h. Bis zu 40% sparen.`,
    h1: `Umzugsfirma in ${placeName} finden: Offerten vergleichen & sparen`,
    canonicalUrl: `/umzugsfirmen/${slug}`,
  };
  
  const heroImage = getRegionImage(cantonSlug || 'default');
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Umzugsfirmen Schweiz', href: '/umzugsfirmen-schweiz' },
    { label: `Kanton ${cantonName}`, href: `/umzugsfirmen/kanton-${cantonSlug}` },
    { label: placeName },
  ];
  
  // Get data from archetype or use defaults
  const priceAnchors = cityData?.price.anchors || [
    { label: '1.5 - 2.5 Zimmer', min: 650, max: 1000, savingsText: 'bis CHF 300' },
    { label: '3.5 - 4.5 Zimmer', min: 900, max: 1400, savingsText: 'bis CHF 400' },
    { label: '5+ Zimmer / Haus', min: 1500, max: 2400, savingsText: 'bis CHF 500' },
  ];
  const priceExamples = cityData?.price.examples || [];
  const topCompanies = cityData?.topCompanies || [];
  const quartiere = cityData?.quartiere || [];
  const faqs = cityData?.faqs || [];
  const testimonials = cityData?.testimonials || [];
  const localTips = cityData?.localTips || [];
  const services = cityData?.services || [];
  const internalLinks = cityData?.internalLinks || {
    parent: { label: `Kanton ${cantonName}`, href: `/umzugsfirmen/kanton-${cantonSlug}` },
    neighbors: [],
  };
  
  // Schema.org
  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems.map((item, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": item.label,
          "item": item.href ? `https://umzugscheck.ch${item.href}` : undefined
        }))
      },
      {
        "@type": "Service",
        "name": `Umzugsfirmen in ${placeName}`,
        "serviceType": "Umzugsfirmen-Vergleich",
        "areaServed": {
          "@type": "City",
          "name": placeName,
          "addressCountry": "CH"
        },
        "provider": {
          "@type": "Organization",
          "name": "Umzugscheck.ch",
          "url": "https://umzugscheck.ch"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.slice(0, 10).map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={`https://umzugscheck.ch${seo.canonicalUrl}`} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={heroImage} />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <main>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero */}
        <HeroWithPresets
          pageType="city"
          placeName={placeName}
          placeSlug={slug!}
          h1={seo.h1}
          subtitle={`Vergleichen Sie geprüfte Umzugsfirmen in ${placeName}. Kostenlose Offerten in 24–48h, bis zu 40% sparen.`}
          stats={stats}
          backgroundImage={heroImage}
          cantonName={cantonName}
          quartiere={quartiere.map(q => q.name)}
        />

        {/* Sticky Navigation */}
        <SectionNav />

        {/* Sticky Mobile CTA */}
        <StickyMobileCTA placeName={placeName} placeKind="city" />

        {/* Trust Bar */}
        <TrustBar 
          stats={stats}
          trustGlobals={TRUST_GLOBALS}
          placeName={placeName}
          placeKind="city"
        />

        {/* Quartiere Section */}
        {quartiere.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            id="quartiere"
            className="scroll-mt-20"
          >
            <QuartiereSection
              quartiere={quartiere}
              cityName={placeName}
            />
          </motion.div>
        )}

        {/* Price Module with Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="preise"
          className="scroll-mt-20"
        >
          <PriceModule
            priceAnchors={priceAnchors}
            priceExamples={priceExamples}
            placeName={placeName}
            placeKind="city"
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
            placeKind="city"
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
              placeSlug={slug!}
              placeKind="city"
            />
          </motion.div>
        )}

        {/* Top Companies */}
        {topCompanies.length > 0 && (
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
              placeKind="city"
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
            placeKind="city"
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
            placeKind="city"
          />
        </motion.div>

        {/* Final CTA */}
        <FinalCTA 
          placeName={placeName}
          placeKind="city"
        />
      </main>
    </div>
  );
};

export default CityArchetypePage;
