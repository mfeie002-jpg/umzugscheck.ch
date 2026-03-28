import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { generateEnhancedMeta, type EnhancedPageMeta } from '@/lib/seo-enhanced';

interface UseEnhancedSEOOptions {
  pageType: 'home' | 'canton' | 'service' | 'company' | 'calculator' | 'blog' | 'about';
  params?: {
    canton?: string;
    service?: string;
    companyName?: string;
    articleTitle?: string;
    articleSlug?: string;
  };
  customMeta?: Partial<EnhancedPageMeta>;
}

export function useEnhancedSEO(options: UseEnhancedSEOOptions) {
  const location = useLocation();
  
  const meta = useMemo(() => {
    const baseMeta = generateEnhancedMeta(options.pageType, options.params);
    return options.customMeta ? { ...baseMeta, ...options.customMeta } : baseMeta;
  }, [options.pageType, options.params, options.customMeta]);

  // Update document title and meta tags dynamically
  useEffect(() => {
    // Update title
    document.title = meta.title;

    // Update meta description
    updateMetaTag('description', meta.description);
    
    // Update keywords
    if (meta.keywords.length > 0) {
      updateMetaTag('keywords', meta.keywords.join(', '));
    }

    // Update canonical
    updateLinkTag('canonical', meta.canonicalUrl);

    // Update Open Graph tags
    updateMetaProperty('og:title', meta.title);
    updateMetaProperty('og:description', meta.description);
    updateMetaProperty('og:url', meta.canonicalUrl);
    updateMetaProperty('og:image', meta.ogImage);
    updateMetaProperty('og:type', meta.ogType);
    updateMetaProperty('og:locale', 'de_CH');
    updateMetaProperty('og:site_name', 'Umzugscheck.ch');

    // Update Twitter tags
    updateMetaTag('twitter:title', meta.title, 'name');
    updateMetaTag('twitter:description', meta.description, 'name');
    updateMetaTag('twitter:image', meta.ogImage, 'name');
    updateMetaTag('twitter:card', 'summary_large_image', 'name');

    // Update structured data
    updateStructuredData(meta.structuredData);

    // Track page view for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: meta.title,
        page_location: meta.canonicalUrl,
        page_path: location.pathname
      });
    }
  }, [meta, location.pathname]);

  return meta;
}

function updateMetaTag(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function updateMetaProperty(property: string, content: string) {
  updateMetaTag(property, content, 'property');
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

function updateStructuredData(schemas: Record<string, unknown>[]) {
  // Remove existing structured data
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-dynamic="true"]');
  existingScripts.forEach(script => script.remove());

  // Add new structured data
  schemas.forEach(schema => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-dynamic', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}

// Hook for preloading critical resources
export function useResourcePreload(resources: { href: string; as: string; type?: string }[]) {
  useEffect(() => {
    resources.forEach(resource => {
      const existing = document.querySelector(`link[href="${resource.href}"]`);
      if (existing) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) {
        link.type = resource.type;
      }
      document.head.appendChild(link);
    });
  }, [resources]);
}

// Hook for setting up page-specific prefetching
export function useRoutePrefetch(routes: string[]) {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        routes.forEach(route => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = route;
          document.head.appendChild(link);
        });
      });
    }
  }, [routes]);
}
