/**
 * Conversion Tracking Hook
 * 
 * Frontend hook to capture UTM/click IDs and track conversion events.
 * Critical for paid media attribution.
 */

import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getVisitorId, trackConversion as localTrackConversion } from '@/lib/attribution-tracking';

// Storage keys for attribution persistence
const STORAGE_KEYS = {
  UTM_DATA: 'uc_utm_data',
  CLICK_IDS: 'uc_click_ids',
  FIRST_TOUCH: 'uc_first_touch',
} as const;

interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

interface ClickIds {
  gclid?: string;  // Google Ads
  gbraid?: string; // Google Ads (iOS)
  wbraid?: string; // Google Ads (web-to-app)
  fbclid?: string; // Facebook/Meta Ads
  msclkid?: string; // Microsoft Ads
}

interface ConversionEvent {
  event_type: 'form_start' | 'form_submit' | 'call_click' | 'whatsapp_start' | 'chat_start' | 'company_view' | 'lead_created';
  lead_id?: string;
  company_id?: string;
  estimated_value?: number;
  metadata?: Record<string, unknown>;
}

const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod/.test(ua)) return 'mobile';
  if (/tablet|ipad/.test(ua)) return 'tablet';
  return 'desktop';
};

export const useConversionTracking = () => {
  const location = useLocation();
  const hasTrackedRef = useRef(false);

  // Capture UTM params on first load
  useEffect(() => {
    if (hasTrackedRef.current) return;
    hasTrackedRef.current = true;

    const params = new URLSearchParams(location.search);
    
    // Extract UTM data
    const utmData: UTMData = {};
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    utmKeys.forEach(key => {
      const value = params.get(key);
      if (value) utmData[key as keyof UTMData] = value;
    });

    // Extract click IDs (critical for ad platforms)
    const clickIds: ClickIds = {};
    const clickIdKeys = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'];
    clickIdKeys.forEach(key => {
      const value = params.get(key);
      if (value) clickIds[key as keyof ClickIds] = value;
    });

    // Persist if we have any attribution data
    if (Object.keys(utmData).length > 0 || Object.keys(clickIds).length > 0) {
      // Store current session data
      sessionStorage.setItem(STORAGE_KEYS.UTM_DATA, JSON.stringify(utmData));
      sessionStorage.setItem(STORAGE_KEYS.CLICK_IDS, JSON.stringify(clickIds));
      
      // Store first touch (only if not already set)
      if (!localStorage.getItem(STORAGE_KEYS.FIRST_TOUCH)) {
        localStorage.setItem(STORAGE_KEYS.FIRST_TOUCH, JSON.stringify({
          ...utmData,
          ...clickIds,
          timestamp: Date.now(),
          landing_page: location.pathname,
        }));
      }

      if (import.meta.env.DEV) {
        console.log('[ConversionTracking] Attribution captured:', { utmData, clickIds });
      }
    }
  }, [location.search, location.pathname]);

  // Get stored attribution data
  const getAttributionData = useCallback(() => {
    try {
      const utmData = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.UTM_DATA) || '{}') as UTMData;
      const clickIds = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CLICK_IDS) || '{}') as ClickIds;
      const firstTouch = JSON.parse(localStorage.getItem(STORAGE_KEYS.FIRST_TOUCH) || '{}');
      
      return { utmData, clickIds, firstTouch };
    } catch {
      return { utmData: {}, clickIds: {}, firstTouch: {} };
    }
  }, []);

  // Track conversion event (sends to edge function)
  const trackConversion = useCallback(async (event: ConversionEvent): Promise<void> => {
    const visitorId = getVisitorId();
    const sessionId = sessionStorage.getItem('uc_session_id') || '';
    const { utmData, clickIds } = getAttributionData();

    // Also track locally
    localTrackConversion(event.event_type as "lead", event.estimated_value, event.metadata);

    // Build payload
    const payload = {
      event_type: event.event_type,
      visitor_id: visitorId,
      session_id: sessionId,
      ...utmData,
      ...clickIds,
      page_url: window.location.href,
      referrer: document.referrer || undefined,
      device_type: getDeviceType(),
      lead_id: event.lead_id,
      company_id: event.company_id,
      estimated_value: event.estimated_value,
      metadata: event.metadata,
    };

    try {
      const { error } = await supabase.functions.invoke('track-conversion', {
        body: payload,
      });

      if (error) {
        console.warn('[ConversionTracking] Edge function error:', error);
      } else if (import.meta.env.DEV) {
        console.log('[ConversionTracking] Event tracked:', event.event_type);
      }
    } catch (err) {
      // Non-blocking - don't break user experience for tracking failures
      console.warn('[ConversionTracking] Failed to track:', err);
    }
  }, [getAttributionData]);

  // Convenience methods for common events
  const trackFormStart = useCallback((metadata?: Record<string, unknown>) => {
    return trackConversion({ event_type: 'form_start', metadata });
  }, [trackConversion]);

  const trackFormSubmit = useCallback((leadId?: string, estimatedValue?: number, metadata?: Record<string, unknown>) => {
    return trackConversion({ event_type: 'form_submit', lead_id: leadId, estimated_value: estimatedValue, metadata });
  }, [trackConversion]);

  const trackCallClick = useCallback((companyId: string, metadata?: Record<string, unknown>) => {
    return trackConversion({ event_type: 'call_click', company_id: companyId, metadata });
  }, [trackConversion]);

  const trackWhatsAppStart = useCallback((companyId: string, metadata?: Record<string, unknown>) => {
    return trackConversion({ event_type: 'whatsapp_start', company_id: companyId, metadata });
  }, [trackConversion]);

  const trackCompanyView = useCallback((companyId: string, metadata?: Record<string, unknown>) => {
    return trackConversion({ event_type: 'company_view', company_id: companyId, metadata });
  }, [trackConversion]);

  const trackLeadCreated = useCallback((leadId: string, estimatedValue?: number, metadata?: Record<string, unknown>) => {
    return trackConversion({ event_type: 'lead_created', lead_id: leadId, estimated_value: estimatedValue, metadata });
  }, [trackConversion]);

  return {
    trackConversion,
    trackFormStart,
    trackFormSubmit,
    trackCallClick,
    trackWhatsAppStart,
    trackCompanyView,
    trackLeadCreated,
    getAttributionData,
  };
};

/**
 * Helper to get attribution data for form submissions
 * Can be used in form handlers to include attribution with lead data
 */
export const getLeadAttribution = () => {
  try {
    const utmData = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.UTM_DATA) || '{}');
    const clickIds = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CLICK_IDS) || '{}');
    const firstTouch = JSON.parse(localStorage.getItem(STORAGE_KEYS.FIRST_TOUCH) || '{}');
    
    return {
      // Current session attribution
      utm_source: utmData.utm_source || null,
      utm_medium: utmData.utm_medium || null,
      utm_campaign: utmData.utm_campaign || null,
      utm_content: utmData.utm_content || null,
      utm_term: utmData.utm_term || null,
      gclid: clickIds.gclid || null,
      gbraid: clickIds.gbraid || null,
      wbraid: clickIds.wbraid || null,
      fbclid: clickIds.fbclid || null,
      // First touch data
      first_touch_source: firstTouch.utm_source || null,
      first_touch_medium: firstTouch.utm_medium || null,
      first_touch_campaign: firstTouch.utm_campaign || null,
      first_touch_landing_page: firstTouch.landing_page || null,
      first_touch_timestamp: firstTouch.timestamp || null,
    };
  } catch {
    return {};
  }
};
