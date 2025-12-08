import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

interface CanonicalUrlProps {
  path?: string;
}

/**
 * Component to add canonical URL to page
 * Helps prevent duplicate content issues for SEO
 */
export const CanonicalUrl = ({ path }: CanonicalUrlProps) => {
  const location = useLocation();
  const canonicalPath = path || location.pathname;
  
  // Remove trailing slash unless it's the homepage
  const cleanPath = canonicalPath === '/' 
    ? canonicalPath 
    : canonicalPath.replace(/\/$/, '');
  
  const canonicalUrl = `https://umzugscheck.ch${cleanPath}`;

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};
