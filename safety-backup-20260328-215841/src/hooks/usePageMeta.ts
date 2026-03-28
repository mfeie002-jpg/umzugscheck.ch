import { useEffect } from 'react';

interface PageMetaOptions {
  title: string;
  description?: string;
  keywords?: string[];
  noindex?: boolean;
}

/**
 * Hook to update page metadata dynamically
 * Useful for client-side rendered pages
 */
export const usePageMeta = ({
  title,
  description,
  keywords,
  noindex = false
}: PageMetaOptions) => {
  useEffect(() => {
    // Update document title
    const fullTitle = title.includes('Umzugscheck') 
      ? title 
      : `${title} | Umzugscheck.ch`;
    document.title = fullTitle;

    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }

    // Update meta keywords
    if (keywords && keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }

    // Update robots meta
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute(
      'content',
      noindex ? 'noindex, nofollow' : 'index, follow'
    );

    // Cleanup on unmount (restore default title)
    return () => {
      // Title will be updated by next page
    };
  }, [title, description, keywords, noindex]);
};

/**
 * Hook to set viewport meta tag for mobile
 */
export const useViewportMeta = () => {
  useEffect(() => {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
    );
  }, []);
};
