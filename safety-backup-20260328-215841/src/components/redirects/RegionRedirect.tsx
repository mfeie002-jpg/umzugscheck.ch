/**
 * Redirect component for legacy /regionen/:slug routes
 * Redirects to canonical /umzugsfirmen/kanton-{slug} URLs
 */
import { Navigate, useParams } from "react-router-dom";

export const RegionSlugRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <Navigate to="/umzugsfirmen-schweiz" replace />;
  }
  
  // Redirect to canonical canton URL
  return <Navigate to={`/umzugsfirmen/kanton-${slug}`} replace />;
};

export const RegionenOverviewRedirect = () => {
  return <Navigate to="/umzugsfirmen-schweiz" replace />;
};
