/**
 * SLUG RESOLVER PAGE
 * 
 * Entscheidet ob ein Slug eine Stadt, ein Kanton oder ein kanton-Prefix hat:
 * - kanton-{slug} -> Rendert RegionArchetypPage direkt
 * - Stadt -> Rendert CityMoversPage
 * - Kanton (ohne Prefix) -> Redirect zu /umzugsfirmen/kanton-{slug}
 * - Unbekannt -> 404
 * 
 * Ermöglicht saubere SEO-Trennung ohne Duplicate Content.
 */

import { useParams, Navigate } from "react-router-dom";
import { useMemo, lazy, Suspense } from "react";
import { resolveSlug, isCanton, extractCantonFromKantonRoute } from "@/data/locations";

// Lazy load pages for code splitting
const CityMovers = lazy(() => import("./CityMoversArchetyp"));
const RegionArchetypPage = lazy(() => import("./region/RegionArchetypPage"));
const NotFound = lazy(() => import("./NotFound"));

const SlugResolverPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const resolution = useMemo(() => {
    if (!slug) return { type: 'unknown' as const };
    
    // Check if slug starts with "kanton-" -> render RegionArchetypPage
    const extractedCantonSlug = extractCantonFromKantonRoute(slug);
    if (extractedCantonSlug && isCanton(extractedCantonSlug)) {
      return { 
        type: 'kanton-route' as const, 
        cantonSlug: extractedCantonSlug 
      };
    }
    
    // Otherwise use normal resolution
    return resolveSlug(slug);
  }, [slug]);

  // kanton-{slug} route -> Render RegionArchetypPage directly
  if (resolution.type === 'kanton-route') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Laden...</div>}>
        <RegionArchetypPage />
      </Suspense>
    );
  }

  // City -> Render CityMoversPage directly
  if (resolution.type === 'city') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Laden...</div>}>
        <CityMovers />
      </Suspense>
    );
  }
  
  // Canton without prefix -> 301 Redirect to /umzugsfirmen/kanton-{slug}
  if (resolution.type === 'canton') {
    return <Navigate to={resolution.redirectTo} replace />;
  }
  
  // Unknown -> 404
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Laden...</div>}>
      <NotFound />
    </Suspense>
  );
};

export default SlugResolverPage;
