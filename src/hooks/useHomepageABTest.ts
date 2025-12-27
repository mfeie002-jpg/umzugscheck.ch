import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// 9 Main Flow Variants for A/B Testing
const FLOW_VARIANTS = [
  'umzugsofferten',      // V1 - Control
  'umzugsofferten-v2',   // V2 - Premium
  'umzugsofferten-v3',   // V3 - God Mode
  'umzugsofferten-v4',   // V4 - Video AI
  'umzugsofferten-v5',   // V5 - Marketplace
  'umzugsofferten-v6',   // V6 - Ultimate
  'umzugsofferten-v7',   // V7 - SwissMove
  'umzugsofferten-v8',   // V8 - Decision-Free
  'umzugsofferten-v9',   // V9 - Zero Friction
] as const;

type FlowVariant = typeof FLOW_VARIANTS[number];

interface ABTestState {
  isActive: boolean;
  assignedVariant: FlowVariant | null;
  loading: boolean;
}

const STORAGE_KEY = 'homepage_ab_variant';
const USER_ID_KEY = 'homepage_ab_user_id';
const SESSION_KEY = 'homepage_ab_session';

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
const assignVariant = (): FlowVariant => {
  const existingVariant = localStorage.getItem(STORAGE_KEY) as FlowVariant | null;
  if (existingVariant && FLOW_VARIANTS.includes(existingVariant as FlowVariant)) {
    return existingVariant as FlowVariant;
  }
  
  // Random assignment
  const randomIndex = Math.floor(Math.random() * FLOW_VARIANTS.length);
  const newVariant = FLOW_VARIANTS[randomIndex];
  localStorage.setItem(STORAGE_KEY, newVariant);
  return newVariant;
};

export const useHomepageABTest = () => {
  const [state, setState] = useState<ABTestState>({
    isActive: false,
    assignedVariant: null,
    loading: true,
  });

  // Check if A/B test is active
  useEffect(() => {
    const checkABTestStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('homepage_ab_config')
          .select('is_active')
          .eq('id', '00000000-0000-0000-0000-000000000001')
          .single();

        if (error) {
          console.error('Error fetching AB config:', error);
          setState(prev => ({ ...prev, loading: false }));
          return;
        }

        const isActive = data?.is_active ?? false;
        
        if (isActive) {
          const variant = assignVariant();
          setState({ isActive: true, assignedVariant: variant, loading: false });
        } else {
          // When inactive, always use V1 (control)
          setState({ isActive: false, assignedVariant: 'umzugsofferten', loading: false });
        }
      } catch (err) {
        console.error('AB Test check failed:', err);
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
      console.error('Failed to track AB event:', err);
    }
  }, [state.assignedVariant]);

  // Get the flow path for the assigned variant
  const getFlowPath = useCallback((): string => {
    if (!state.assignedVariant || state.assignedVariant === 'umzugsofferten') {
      return '/umzugsofferten';
    }
    return `/${state.assignedVariant}`;
  }, [state.assignedVariant]);

  return {
    ...state,
    trackEvent,
    getFlowPath,
    variants: FLOW_VARIANTS,
  };
};

// Admin hook for managing A/B test
export const useABTestAdmin = () => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);

  // Fetch current status
  const fetchStatus = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('homepage_ab_config')
        .select('is_active')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();
      
      setIsActive(data?.is_active ?? false);
    } catch (err) {
      console.error('Failed to fetch AB status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle A/B test
  const toggleABTest = async (active: boolean) => {
    try {
      const { error } = await supabase
        .from('homepage_ab_config')
        .update({ is_active: active })
        .eq('id', '00000000-0000-0000-0000-000000000001');
      
      if (error) throw error;
      setIsActive(active);
      return true;
    } catch (err) {
      console.error('Failed to toggle AB test:', err);
      return false;
    }
  };

  // Fetch statistics
  const fetchStats = async (days: number = 30) => {
    try {
      const { data, error } = await supabase.rpc('get_homepage_ab_stats', { p_days: days });
      if (error) throw error;
      setStats(data || []);
    } catch (err) {
      console.error('Failed to fetch AB stats:', err);
    }
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
    refetch: fetchStatus,
  };
};

export { FLOW_VARIANTS };
export type { FlowVariant };
