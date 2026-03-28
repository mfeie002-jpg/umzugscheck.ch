import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Focused 3-way A/B Test: Ultimate vs V1 vs V2e
const FOCUSED_VARIANTS = [
  'umzugsofferten-v1',           // V1 - Control
  'umzugsofferten-v2e',          // V2e - Enhanced
  'umzugsofferten-ultimate-best36', // Ultimate - Best of 36
] as const;

type FocusedVariant = typeof FOCUSED_VARIANTS[number];

interface FocusedABTestState {
  isActive: boolean;
  assignedVariant: FocusedVariant | null;
  loading: boolean;
}

const STORAGE_KEY = 'focused_ab_variant';
const USER_ID_KEY = 'focused_ab_user_id';
const SESSION_KEY = 'focused_ab_session';

// Generate a unique user ID for anonymous tracking
const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

// Generate session ID (resets per browser session)
const getOrCreateSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// Assign a random variant (persistent per user)
const assignVariant = (): FocusedVariant => {
  const existingVariant = localStorage.getItem(STORAGE_KEY) as FocusedVariant | null;
  if (existingVariant && FOCUSED_VARIANTS.includes(existingVariant as FocusedVariant)) {
    return existingVariant as FocusedVariant;
  }
  
  // Random assignment with equal weights (33.3% each)
  const randomIndex = Math.floor(Math.random() * FOCUSED_VARIANTS.length);
  const newVariant = FOCUSED_VARIANTS[randomIndex];
  localStorage.setItem(STORAGE_KEY, newVariant);
  return newVariant;
};

export const useFocusedABTest = () => {
  const [state, setState] = useState<FocusedABTestState>({
    isActive: false,
    assignedVariant: null,
    loading: true,
  });

  // Check if focused A/B test is active
  useEffect(() => {
    const checkABTestStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('homepage_ab_config')
          .select('is_active')
          .eq('id', '00000000-0000-0000-0000-000000000002') // Different ID for focused test
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching focused AB config:', error);
        }

        const isActive = data?.is_active ?? false;
        
        if (isActive) {
          const variant = assignVariant();
          setState({ isActive: true, assignedVariant: variant, loading: false });
        } else {
          // When inactive, always use V1 (control)
          setState({ isActive: false, assignedVariant: 'umzugsofferten-v1', loading: false });
        }
      } catch (err) {
        console.error('Focused AB Test check failed:', err);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    checkABTestStatus();
  }, []);

  // Track events
  const trackEvent = useCallback(async (
    eventType: 'impression' | 'cta_click' | 'funnel_start' | 'lead_submit',
    metadata?: Record<string, unknown>
  ) => {
    if (!state.assignedVariant) return;

    try {
      await supabase.from('homepage_ab_events').insert([{
        session_id: getOrCreateSessionId(),
        user_id: getOrCreateUserId(),
        flow_variant: state.assignedVariant,
        event_type: eventType,
        page_path: window.location.pathname,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : {},
      }]);
    } catch (err) {
      console.error('Failed to track focused AB event:', err);
    }
  }, [state.assignedVariant]);

  // Get the flow path for the assigned variant
  const getFlowPath = useCallback((): string => {
    if (!state.assignedVariant) {
      return '/umzugsofferten-v1';
    }
    return `/${state.assignedVariant}`;
  }, [state.assignedVariant]);

  // Get variant display name
  const getVariantName = useCallback((): string => {
    switch (state.assignedVariant) {
      case 'umzugsofferten-v1': return 'V1 Control';
      case 'umzugsofferten-v2e': return 'V2e Enhanced';
      case 'umzugsofferten-ultimate-best36': return 'Ultimate Best36';
      default: return 'Unknown';
    }
  }, [state.assignedVariant]);

  return {
    ...state,
    trackEvent,
    getFlowPath,
    getVariantName,
    variants: FOCUSED_VARIANTS,
  };
};

// Admin hook for managing focused A/B test
export const useFocusedABTestAdmin = () => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);

  // Fetch current status
  const fetchStatus = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_ab_config')
        .select('is_active')
        .eq('id', '00000000-0000-0000-0000-000000000002')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Failed to fetch focused AB status:', error);
      }
      
      setIsActive(data?.is_active ?? false);
    } catch (err) {
      console.error('Failed to fetch focused AB status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle focused A/B test
  const toggleABTest = async (active: boolean) => {
    try {
      // First try to update
      const { error: updateError, count } = await supabase
        .from('homepage_ab_config')
        .update({ is_active: active, updated_at: new Date().toISOString() })
        .eq('id', '00000000-0000-0000-0000-000000000002')
        .select();
      
      // If no row exists, insert it
      if (updateError || count === 0) {
        const { error: insertError } = await supabase
          .from('homepage_ab_config')
          .upsert({
            id: '00000000-0000-0000-0000-000000000002',
            is_active: active,
            updated_at: new Date().toISOString(),
          });
        
        if (insertError) throw insertError;
      }
      
      setIsActive(active);
      return true;
    } catch (err) {
      console.error('Failed to toggle focused AB test:', err);
      return false;
    }
  };

  // Fetch statistics for focused variants
  const fetchStats = async (days: number = 30) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('homepage_ab_events')
        .select('flow_variant, event_type')
        .in('flow_variant', FOCUSED_VARIANTS as unknown as string[])
        .gte('created_at', cutoffDate.toISOString());
      
      if (error) throw error;
      
      // Calculate stats per variant
      const variantStats = FOCUSED_VARIANTS.map(variant => {
        const events = data?.filter(e => e.flow_variant === variant) || [];
        const impressions = events.filter(e => e.event_type === 'impression').length;
        const ctaClicks = events.filter(e => e.event_type === 'cta_click').length;
        const funnelStarts = events.filter(e => e.event_type === 'funnel_start').length;
        const leadSubmits = events.filter(e => e.event_type === 'lead_submit').length;
        
        return {
          flow_variant: variant,
          impressions,
          cta_clicks: ctaClicks,
          funnel_starts: funnelStarts,
          lead_submits: leadSubmits,
          conversion_rate: impressions > 0 
            ? Math.round((leadSubmits / impressions) * 10000) / 100 
            : 0,
          cta_rate: impressions > 0
            ? Math.round((ctaClicks / impressions) * 10000) / 100
            : 0,
        };
      });
      
      setStats(variantStats);
    } catch (err) {
      console.error('Failed to fetch focused AB stats:', err);
    }
  };

  // Reset test (clear localStorage assignments for new test)
  const resetTest = () => {
    // Note: This only affects the admin's browser
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_ID_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  };

  useEffect(() => {
    fetchStatus();
    fetchStats();
  }, []);

  return {
    isActive,
    loading,
    stats,
    toggleABTest,
    fetchStats,
    resetTest,
    refetch: fetchStatus,
    variants: FOCUSED_VARIANTS,
  };
};

export { FOCUSED_VARIANTS };
export type { FocusedVariant };
