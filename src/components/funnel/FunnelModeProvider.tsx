/**
 * FunnelModeProvider - Activates "funnel mode" for focused calculator/form flows
 * 
 * Based on ChatGPT UX Analysis:
 * - Focus Mode after interaction: minimize navigation/long content
 * - Reduce distractions during critical conversion steps
 * - Minimal header in funnel (Back + Help only)
 * - Hide bottom nav/footer/marketing sections
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Routes that should activate funnel mode
const FUNNEL_ROUTES = [
  '/umzugsofferten',
  '/umzugsofferten-baseline',
  '/umzugsofferten-v1',
  '/umzugsofferten-v1a',
  '/rechner',
  '/umzugsrechner',
  '/offerten',
];

// Check if URL has funnel step parameter
const hasFunnelParams = (search: string): boolean => {
  const params = new URLSearchParams(search);
  return params.has('uc_step') || params.has('step');
};

export const FunnelModeProvider = () => {
  const location = useLocation();
  
  useEffect(() => {
    const isInFunnel = FUNNEL_ROUTES.some(route => 
      location.pathname.startsWith(route)
    ) || hasFunnelParams(location.search);
    
    if (isInFunnel) {
      document.documentElement.classList.add('uc-funnel');
    } else {
      document.documentElement.classList.remove('uc-funnel');
    }
    
    return () => {
      document.documentElement.classList.remove('uc-funnel');
    };
  }, [location.pathname, location.search]);
  
  return null;
};

export default FunnelModeProvider;
