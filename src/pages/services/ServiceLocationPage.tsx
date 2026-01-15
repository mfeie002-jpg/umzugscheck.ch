/**
 * SERVICE + LOCATION PAGE TEMPLATE
 * 
 * Unified template for:
 * - Service + Canton: /dienstleistungen/[serviceSlug]/kanton-[cantonSlug]
 * - Service + City: /dienstleistungen/[serviceSlug]/[citySlug]
 * 
 * Gold Standard SEO & Conversion Optimized
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
  TopCompaniesPreview,
  TestimonialsArchetype,
  LocalTipsSection,
  FAQAccordionArchetype,
  Breadcrumbs,
  InternalLinkingBlock,
  FinalCTA,
  StickyMobileCTA,
  SectionNav,
} from "@/components/archetype";

// Data
import { 
  KANTON_ZUG, 
  STADT_ZUG,
  STADT_BAAR,
  STADT_CHAM,
  CORE_SERVICES,
  TRUST_GLOBALS,
  type ServiceConfig,
  type CantonConfig,
  type CityConfig,
} from "@/data/archetypeConfig";

// Service Package Component
const ServicePackages = ({ service, placeName }: { service: ServiceConfig; placeName: string }) => {
  if (!service.packages || service.packages.length === 0) return null;
  
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {service.title} Pakete in {placeName}
            </h2>
            <p className="text-muted-foreground">
              Wählen Sie das passende Paket für Ihre Bedürfnisse
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {service.packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-card rounded-2xl p-6 border ${
                  pkg.highlight 
                    ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                    : 'border-border/50'
                }`}
              >
                {pkg.highlight && (
                  <div className="text-xs font-medium text-primary mb-2">
                    EMPFOHLEN
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pkg.bestFor}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary">✓</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// What's Included Component
const WhatsIncluded = ({ service, placeName }: { service: ServiceConfig; placeName: string }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Was ist bei {service.title} in {placeName} enthalten?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {service.uspBullets.map((bullet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border/50"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  ✓
                </span>
                <span>{bullet}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ServiceLocationPage = () => {
  const { serviceSlug, locationSlug } = useParams<{ serviceSlug: string; locationSlug: string }>();
  const navigate = useNavigate();
  
  // Determine if canton or city
  const isCanton = locationSlug?.startsWith('kanton-');
  const effectiveLocationSlug = isCanton 
    ? locationSlug?.replace('kanton-', '') 
    : locationSlug;
  
  // Get location data
  const locationData = useMemo(() => {
    if (!effectiveLocationSlug) return null;
    
    // Match against known locations
    if (isCanton) {
      if (effectiveLocationSlug === 'zug') return KANTON_ZUG;
      // Add more cantons here
    } else {
      if (effectiveLocationSlug === 'zug') return STADT_ZUG;
      if (effectiveLocationSlug === 'baar') return STADT_BAAR;
      if (effectiveLocationSlug === 'cham') return STADT_CHAM;
      // Add more cities here
    }
    return null;
  }, [effectiveLocationSlug, isCanton]);
  
  // Get service data
  const service = useMemo(() => {
    return CORE_SERVICES.find(s => s.slug === serviceSlug);
  }, [serviceSlug]);
  
  // 404 if not found
  if (!locationData || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Seite nicht gefunden</h1>
          <p className="text-muted-foreground mb-6">Die gewünschte Seite existiert nicht.</p>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg"
          >
            Zur Startseite
          </button>
        </div>
      </div>
    );
  }
  
  const pageType = isCanton ? 'serviceCanton' : 'serviceCity';
  const locationPrefix = isCanton ? 'im Kanton' : 'in';
  const placeName = locationData.name;
  
  // SEO
  const seoTitle = `${service.title} ${locationPrefix} ${placeName} – Preise vergleichen & sparen | Umzugscheck`;
  const seoDescription = `${service.title} ${locationPrefix} ${placeName}: Vergleichen Sie geprüfte Anbieter und erhalten Sie kostenlose Offerten in 24–48h. Bis zu 40% sparen.`;
  const canonicalUrl = isCanton 
    ? `/dienstleistungen/${serviceSlug}/kanton-${effectiveLocationSlug}`
    : `/dienstleistungen/${serviceSlug}/${effectiveLocationSlug}`;
  const h1 = `${service.title} ${locationPrefix} ${placeName}`;
  
  // Breadcrumb items - separate path items from current page
  const breadcrumbPathItems = [
    { label: 'Dienstleistungen', href: '/dienstleistungen' },
    { label: service.title, href: `/dienstleistungen/${serviceSlug}` },
  ];
  const currentPageLabel = isCanton ? `Kanton ${placeName}` : placeName;
  
  // Section nav items
  const sectionNavItems = [
    { id: 'preise', label: 'Preise' },
    { id: 'firmen', label: 'Top Firmen' },
    { id: 'so-funktionierts', label: 'So gehts' },
    { id: 'faq', label: 'FAQ' },
  ];
  
  // Schema.org
  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://umzugscheck.ch" },
          { "@type": "ListItem", "position": 2, "name": "Dienstleistungen", "item": "https://umzugscheck.ch/dienstleistungen" },
          { "@type": "ListItem", "position": 3, "name": service.title, "item": `https://umzugscheck.ch/dienstleistungen/${serviceSlug}` },
          { "@type": "ListItem", "position": 4, "name": currentPageLabel },
        ]
      },
      {
        "@type": "Service",
        "name": h1,
        "serviceType": service.title,
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": isCanton ? `Kanton ${placeName}` : placeName,
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
        "mainEntity": locationData.faqs.slice(0, 5).map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
      }
    ]
  };
  
  // Internal links for this service page
  const serviceInternalLinks = {
    parent: { 
      label: isCanton ? `Umzugsfirmen Kanton ${placeName}` : `Umzugsfirmen ${placeName}`,
      href: isCanton ? `/umzugsfirmen/kanton-${effectiveLocationSlug}` : `/umzugsfirmen/${effectiveLocationSlug}`
    },
    neighbors: CORE_SERVICES.filter(s => s.slug !== serviceSlug).slice(0, 4).map(s => ({
      label: `${s.title} ${locationPrefix} ${placeName}`,
      href: isCanton 
        ? `/dienstleistungen/${s.slug}/kanton-${effectiveLocationSlug}`
        : `/dienstleistungen/${s.slug}/${effectiveLocationSlug}`
    })),
  };
  
  // Quartiere for city pages
  const quartiere = !isCanton && (locationData as CityConfig).quartiere
    ? (locationData as CityConfig).quartiere.map(q => q.name)
    : [];
  
  // Cities in canton for canton pages
  const citiesInCanton = isCanton && (locationData as CantonConfig).citiesInCanton
    ? (locationData as CantonConfig).citiesInCanton
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`https://umzugscheck.ch${canonicalUrl}`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://umzugscheck.ch${canonicalUrl}`} />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <main>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbPathItems} currentPage={currentPageLabel} />

        {/* Hero */}
        <HeroWithPresets
          pageType={pageType}
          placeName={placeName}
          placeSlug={effectiveLocationSlug!}
          h1={h1}
          subtitle={`Vergleichen Sie geprüfte ${service.title}-Anbieter ${locationPrefix} ${placeName}. Kostenlose Offerten in 24–48h, bis zu 40% sparen.`}
          stats={locationData.stats}
          serviceName={service.title}
          serviceSlug={service.slug}
          citiesInCanton={citiesInCanton}
          quartiere={quartiere}
        />

        {/* Sticky Navigation */}
        <SectionNav items={sectionNavItems} />

        {/* Sticky Mobile CTA */}
        <StickyMobileCTA placeName={placeName} placeKind={isCanton ? 'canton' : 'city'} />

        {/* Trust Bar */}
        <TrustBar 
          stats={locationData.stats}
          trustGlobals={TRUST_GLOBALS}
          placeName={placeName}
          placeKind={isCanton ? 'canton' : 'city'}
        />

        {/* Price Module */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="preise"
          className="scroll-mt-20"
        >
          <PriceModule
            anchors={locationData.price.anchors}
            examples={locationData.price.examples}
            placeName={placeName}
            placeKind={isCanton ? 'canton' : 'city'}
          />
        </motion.div>

        {/* What's Included */}
        <WhatsIncluded service={service} placeName={placeName} />

        {/* Service Packages */}
        <ServicePackages service={service} placeName={placeName} />

        {/* Top Companies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="firmen"
          className="scroll-mt-20"
        >
          <TopCompaniesPreview
            companies={locationData.topCompanies}
            placeName={placeName}
            placeKind={isCanton ? 'canton' : 'city'}
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
            placeKind={isCanton ? 'canton' : 'city'}
            serviceName={service.title}
          />
        </motion.div>

        {/* Local Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <LocalTipsSection
            tips={locationData.localTips}
            placeName={placeName}
            placeKind={isCanton ? 'canton' : 'city'}
          />
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <TestimonialsArchetype
            testimonials={locationData.testimonials}
            placeName={placeName}
            placeKind={isCanton ? 'canton' : 'city'}
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
            faqs={locationData.faqs}
            placeName={placeName}
            placeKind={isCanton ? 'canton' : 'city'}
          />
        </motion.div>

        {/* Internal Linking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <InternalLinkingBlock
            parent={serviceInternalLinks.parent}
            neighbors={serviceInternalLinks.neighbors}
            services={CORE_SERVICES}
            placeName={placeName}
            placeSlug={effectiveLocationSlug!}
            placeKind={isCanton ? 'canton' : 'city'}
          />
        </motion.div>

        {/* Final CTA */}
        <FinalCTA 
          placeName={placeName}
          placeKind={isCanton ? 'canton' : 'city'}
          serviceName={service.title}
        />
      </main>
    </div>
  );
};

export default ServiceLocationPage;