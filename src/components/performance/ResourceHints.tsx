import { useEffect } from 'react';

interface ResourceHint {
  href: string;
  rel: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch';
  as?: 'script' | 'style' | 'image' | 'font' | 'document';
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

const defaultHints: ResourceHint[] = [
  // Preconnect to external origins
  { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
  { href: 'https://fonts.gstatic.com', rel: 'preconnect', crossOrigin: 'anonymous' },
  
  // DNS prefetch for Supabase
  { href: 'https://twpyrbhqsfwtoyudkfss.supabase.co', rel: 'dns-prefetch' },
];

export const ResourceHints = ({ additionalHints = [] }: { additionalHints?: ResourceHint[] }) => {
  useEffect(() => {
    const allHints = [...defaultHints, ...additionalHints];
    
    allHints.forEach(hint => {
      const existingLink = document.querySelector(`link[href="${hint.href}"][rel="${hint.rel}"]`);
      if (existingLink) return;

      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      
      if (hint.as) link.setAttribute('as', hint.as);
      if (hint.type) link.type = hint.type;
      if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
      
      document.head.appendChild(link);
    });
  }, [additionalHints]);

  return null;
};

// Prefetch routes for faster navigation
export const prefetchRoute = (path: string) => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  link.as = 'document';
  document.head.appendChild(link);
};

// Preload critical images
export const preloadImage = (src: string, priority: 'high' | 'low' = 'high') => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  link.setAttribute('fetchpriority', priority);
  document.head.appendChild(link);
};
