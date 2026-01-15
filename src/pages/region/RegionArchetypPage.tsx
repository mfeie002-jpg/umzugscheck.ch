/**
 * ARCHETYP REGION PAGE
 * 
 * Eine einzige Seite für ALLE 26 Kantone.
 * Nutzt die zentrale Datenbank und Archetyp-Komponenten.
 * 
 * Ersetzt: ~28'650 Zeilen duplizierter Code
 * Neu: ~150 Zeilen Assembly-Code
 */

import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useMemo, useCallback } from "react";
import { ArrowRight, MapPin } from "lucide-react";

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
        "primaryImageOfPage": { "@type": "ImageObject", "url": heroImage, "caption": `Umzug im Kanton ${region.name}` },
        "isPartOf": { "@type": "WebSite", "name": "Umzugscheck.ch", "url": "https://umzugscheck.ch" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Umzugsfirmen Schweiz", "item": "https://umzugscheck.ch/umzugsfirmen-schweiz" },
          { "@type": "ListItem", "position": 2, "name": "Regionen", "item": "https://umzugscheck.ch/regionen" },
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
