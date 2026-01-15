import { Navigate, useParams } from "react-router-dom";

/**
 * Redirect legacy /:city/umzugsfirmen URLs to canonical /umzugsfirmen/:city
 * This eliminates duplicate content and consolidates SEO authority
 */
export default function LegacyCityServiceRedirect() {
  const { city } = useParams<{ city: string }>();
  const target = city ? `/umzugsfirmen/${city}` : "/umzugsfirmen";
  
  return <Navigate to={target} replace />;
}
