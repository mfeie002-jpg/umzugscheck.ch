/**
 * ARCHETYP REGION PAGE - SEO OPTIMIERT
 * 
 * 20 SEO-Features implementiert:
 * ✅ Title/Meta mit "vergleichen / Offerten"
 * ✅ Canonical sauber (/umzugsfirmen/kanton-{slug})
 * ✅ Breadcrumbs (UI + Schema)
 * ✅ HowTo Schema
 * ✅ FAQ Schema
 * ✅ Interne Links Stadt ↔ Kanton
 * ✅ Komplettpaket Block
 * ✅ Preis-Range + Faktoren
 * ✅ Local Tips
 * ✅ Trust Layer / E-E-A-T Box
 * ✅ Service Coverage
 * ✅ "Warum sparen?" Block
 * ✅ Conversion Module (Top + Mid + Bottom)
 * ✅ Content Cluster Links
 * ✅ Image Alt + LCP optimiert
 * ✅ OpenGraph/Twitter
 * ✅ Related Cities
 * ✅ Glossar Mini-Abschnitt
 * ✅ Anchor Navigation (Sitelinks-Potential)
 */

import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useMemo, useCallback } from "react";
import { ArrowRight, MapPin } from "lucide-react";

// Unified Hero Component (matches homepage style)
import { UnifiedHero } from "@/components/shared/UnifiedHero";

// Archetyp Components
import {
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
  RegionMiniNav,
  RegionStickyMobileCTA,
  RegionHowWeRank,
  RegionSavingsProof,
  RegionCitiesGrid,
} from "@/components/region-archetyp";
import { LocationAwareHowItWorks } from "@/components/shared/LocationAwareHowItWorks";

// NEW SEO Components
import { RegionBreadcrumb } from "@/components/region-archetyp/RegionBreadcrumb";
import { RegionAnchorNav } from "@/components/region-archetyp/RegionAnchorNav";
import { RegionTrustBox } from "@/components/region-archetyp/RegionTrustBox";
import { RegionWhySave } from "@/components/region-archetyp/RegionWhySave";
import { RegionKomplettpaket } from "@/components/region-archetyp/RegionKomplettpaket";
import { RegionGlossar } from "@/components/region-archetyp/RegionGlossar";
import { RegionContentCluster } from "@/components/region-archetyp/RegionContentCluster";
import { RegionMidCTA } from "@/components/region-archetyp/RegionMidCTA";

// Data Layer
import { getRegionBySlug } from "@/data/regions-database";
import { CITIES_MAP } from "@/data/locations";
import { getRegionImage } from "@/data/region-images";

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

  // City pages within the canton (internal linking)
  const cantonCities = Object.values(CITIES_MAP)
    .filter((c) => c.cantonSlug === region.slug)
    .sort((a, b) => a.name.localeCompare(b.name, 'de'))
    .slice(0, 12);

  // Transform nearby regions to slugs array
  const nearbySlugArray = region.nearbyRegions.map(r => r.slug);

  const canonicalUrl = `https://umzugscheck.ch/umzugsfirmen/kanton-${effectiveSlug}`;
  const heroImage = getRegionImage(region.slug);
  const seoTitle = region.seo.title;
  const seoDescription = region.seo.description;
  const seoKeywords = [
    `Umzugsfirmen Kanton ${region.name}`,
    `Umzugsfirma Kanton ${region.name}`,
    `Umzug Kanton ${region.name}`,
    `Umzugskosten Kanton ${region.name}`,
    `Umzugsunternehmen ${region.name}`,
    `Umzug & Endreinigung ${region.name}`,
    `Wohnungsabgabe ${region.name}`,
    `Möbellift ${region.name}`,
    `Einlagerung ${region.name}`,
    `Entsorgung ${region.name}`,
  ];

  // Schema.org structured data with HowTo Schema
  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "url": canonicalUrl,
        "name": seoTitle,
        "description": seoDescription,
        "inLanguage": "de-CH",
        "primaryImageOfPage": { "@type": "ImageObject", "url": heroImage, "caption": `Umzug im Kanton ${region.name}` },
        "isPartOf": { "@type": "WebSite", "name": "Umzugscheck.ch", "url": "https://umzugscheck.ch" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://umzugscheck.ch" },
          { "@type": "ListItem", "position": 2, "name": "Umzugsfirmen Schweiz", "item": "https://umzugscheck.ch/umzugsfirmen-schweiz" },
          { "@type": "ListItem", "position": 3, "name": `Kanton ${region.name}`, "item": canonicalUrl }
        ]
      },
      {
        "@type": "Service",
        "name": `Umzugsfirmen vergleichen im Kanton ${region.name}`,
        "serviceType": "Umzugsfirmen-Vergleich",
        "areaServed": { "@type": "AdministrativeArea", "name": `Kanton ${region.name}`, "addressCountry": "CH" },
        "provider": { "@type": "Organization", "name": "Umzugscheck.ch", "url": "https://umzugscheck.ch" }
      },
      {
        "@type": "ItemList",
        "name": `Top Umzugsfirmen im Kanton ${region.name}`,
        "itemListElement": region.topCompanies.map((c, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": c.name
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": region.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
      },
      // NEW: HowTo Schema for "So bekommen Sie Offerten"
      {
        "@type": "HowTo",
        "name": `So erhalten Sie Umzugsofferten in ${region.name}`,
        "description": `Schritt-für-Schritt Anleitung für kostenlose Umzugsofferten im Kanton ${region.name}`,
        "totalTime": "PT5M",
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "CHF",
          "value": "0"
        },
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Umzugsdaten eingeben",
            "text": "Geben Sie Ihre Umzugsdaten ein: Von wo nach wo, Wohnungsgrösse und gewünschtes Datum.",
            "url": `${canonicalUrl}#offerten`
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Offerten vergleichen",
            "text": "Erhalten Sie bis zu 5 unverbindliche Offerten von geprüften Umzugsfirmen in Ihrer Region.",
            "url": `${canonicalUrl}#firmen`
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Beste Firma wählen",
            "text": "Vergleichen Sie Preise, Leistungen und Bewertungen. Wählen Sie die beste Umzugsfirma für Ihren Umzug.",
            "url": `${canonicalUrl}#firmen`
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background" data-uc-capture-root="1">
      <Helmet>
        <html lang="de-CH" />
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords.join(', ')} />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Social */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={heroImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="de_CH" />
        <meta property="og:site_name" content="Umzugscheck.ch" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={heroImage} />

        {/* Geo */}
        <meta name="geo.region" content={`CH-${region.short}`} />
        <meta name="geo.placename" content={`Kanton ${region.name}`} />

        {/* Performance hint for hero */}
        <link rel="preload" as="image" href={heroImage} />

        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <main>
        {/* NEW: Breadcrumb UI */}
        <RegionBreadcrumb 
          regionName={region.name} 
          regionType="canton" 
        />

        {/* Zone 1: Above the Fold - Unified Hero (Homepage Style) */}
        <UnifiedHero
          title={`Umzugsfirmen Kanton ${region.name}`}
          titleAccent="Jetzt gratis vergleichen"
          subtitle={`Vergleichen Sie ${region.stats.providerCount}+ geprüfte Umzugsfirmen im Kanton ${region.name} und erhalten Sie kostenlose Offerten.`}
          locationName={region.name}
          locationShort={region.short}
          stats={{
            rating: region.stats.avgRating,
            reviewCount: region.stats.reviewCount,
            providerCount: region.stats.providerCount,
            activeUsers: region.stats.activeUsersBase
          }}
          backgroundImage={heroImage}
          prefillFrom={region.name}
          variant="canton"
        />

        {/* NEW: Anchor Navigation for Sitelinks */}
        <RegionAnchorNav />

        {/* GOLD STANDARD: Mini Navigation (Mobile) */}
        <RegionMiniNav />

        {/* GOLD STANDARD: Sticky Mobile CTA */}
        <RegionStickyMobileCTA regionName={region.name} variant="canton" />

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
          id="firmen"
          className="scroll-mt-20"
        >
          <RegionProviders
            companies={region.topCompanies}
            regionName={region.name}
          />
          {/* GOLD STANDARD: How We Rank Credibility Box */}
          <div className="container mx-auto px-4 -mt-6 mb-8">
            <div className="max-w-5xl mx-auto">
              <RegionHowWeRank regionName={region.name} variant="canton" />
            </div>
          </div>
        </motion.div>

        {/* GOLD STANDARD: Location-Aware How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="so-funktionierts"
          className="scroll-mt-20"
        >
          <LocationAwareHowItWorks 
            locationName={region.name} 
            variant="canton"
            exampleCities={cantonCities.slice(0, 4).map(c => c.name)}
          />
        </motion.div>

        {/* GOLD STANDARD: Savings Proof Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionSavingsProof regionName={region.name} variant="canton" />
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

        {/* NEW: Komplettpaket Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionKomplettpaket regionName={region.name} />
        </motion.div>

        {/* Zone 3: SEO Layer - Prices with ID for anchor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="preise"
          className="scroll-mt-20"
        >
          <RegionPriceTable
            prices={region.priceMatrix}
            regionName={region.name}
            priceCoefficient={region.priceCoefficient}
          />
        </motion.div>

        {/* NEW: Why Save Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionWhySave regionName={region.name} />
        </motion.div>

        {/* NEW: Mid-Page CTA */}
        <RegionMidCTA regionName={region.name} />

        {/* Local Tips with ID for anchor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="tipps"
          className="scroll-mt-20"
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

        {/* NEW: E-E-A-T Trust Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionTrustBox regionName={region.name} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionGuarantees />
        </motion.div>

        {/* Cities & Internal Links Section */}
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
                    Städte & Gemeinden im Kanton {region.name}
                  </h2>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    Direkte City-Pages mit Umzugsfirma-Vergleich, Preisbeispielen und Tipps. Perfekt als Einstieg für lokale SEO und interne Verlinkung.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-soft">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Beliebte Städte
                    </h3>

                    {cantonCities.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {cantonCities.map((c) => (
                          <Link
                            key={c.slug}
                            to={`/umzugsfirmen/${c.slug}`}
                            className="group flex items-center justify-between rounded-xl border border-border/60 p-4 hover:bg-muted/50 transition-colors"
                          >
                            <span className="font-medium">{c.name}</span>
                            <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Für diesen Kanton bauen wir die City-Pages als Nächstes aus.</p>
                    )}
                  </div>

                  <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-soft">
                    <h3 className="font-semibold text-lg mb-3">Weitere nützliche Seiten</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Link to="/regionen" className="group flex items-center justify-between rounded-xl border border-border/60 p-4 hover:bg-muted/50 transition-colors">
                        <span className="font-medium">Alle Kantone</span>
                        <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                      </Link>
                      <Link to="/umzugsfirmen-schweiz" className="group flex items-center justify-between rounded-xl border border-border/60 p-4 hover:bg-muted/50 transition-colors">
                        <span className="font-medium">Schweiz Übersicht</span>
                        <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                      </Link>
                      <Link to="/umzugsofferten" className="group flex items-center justify-between rounded-xl border border-border/60 p-4 hover:bg-muted/50 transition-colors">
                        <span className="font-medium">Offerten erhalten</span>
                        <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                      </Link>
                      <Link to="/umzugsfirmen" className="group flex items-center justify-between rounded-xl border border-border/60 p-4 hover:bg-muted/50 transition-colors">
                        <span className="font-medium">Umzugsfirmen finden</span>
                        <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                      </Link>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Tipp: Für die Wohnungsabgabe empfiehlt sich oft das Komplettpaket (Umzug + Endreinigung + Abnahmevorbereitung).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        {/* NEW: Glossar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionGlossar />
        </motion.div>

        {/* FAQ with ID for anchor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="faq"
          className="scroll-mt-20"
        >
          <RegionFAQ faqs={region.faqs} regionName={region.name} />
        </motion.div>

        {/* NEW: Content Cluster Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RegionContentCluster regionName={region.name} regionSlug={region.slug} />
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

        {/* Final CTA Section with ID for anchor */}
        <section id="offerten" className="py-16 bg-primary text-primary-foreground scroll-mt-20">
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
