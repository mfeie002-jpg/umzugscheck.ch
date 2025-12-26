/**
 * useFlowVersion - Hook for dynamic flow version management
 * 
 * Supports hierarchical versioning:
 * - ?v=2 → Flow V2
 * - ?v=2a → Flow V2, Variant A
 * - ?v=2a1 → Flow V2, Variant A, Adjustment 1
 * - ?v=ultimate → Combined Ultimate
 */

import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface FlowVersionConfig {
  component?: string;
  tweaks?: Record<string, unknown>;
  isUltimate?: boolean;
}

export interface FlowVersion {
  id: string;
  flow_code: string | null;
  flow_number: number | null;
  variant_letter: string | null;
  adjustment_number: number | null;
  parent_flow_code: string | null;
  version_name: string | null;
  description: string | null;
  config: FlowVersionConfig | null;
  is_active: boolean | null;
  is_ultimate: boolean | null;
}

// Parse version parameter into components
export function parseVersionCode(versionParam: string | null): {
  flowNumber: number | null;
  variantLetter: string | null;
  adjustmentNumber: number | null;
  isUltimate: boolean;
  flowCode: string;
} {
  if (!versionParam) {
    return { flowNumber: 1, variantLetter: null, adjustmentNumber: null, isUltimate: false, flowCode: '1' };
  }
  
  if (versionParam === 'ultimate') {
    return { flowNumber: null, variantLetter: null, adjustmentNumber: null, isUltimate: true, flowCode: 'ultimate' };
  }
  
  // Parse patterns like "2", "2a", "2a1"
  const match = versionParam.match(/^(\d)([a-e])?(\d)?$/);
  
  if (!match) {
    return { flowNumber: 1, variantLetter: null, adjustmentNumber: null, isUltimate: false, flowCode: '1' };
  }
  
  const [, flowStr, variant, adjustment] = match;
  
  return {
    flowNumber: parseInt(flowStr, 10),
    variantLetter: variant || null,
    adjustmentNumber: adjustment ? parseInt(adjustment, 10) : null,
    isUltimate: false,
    flowCode: versionParam,
  };
}

// Build display label for version
export function getVersionLabel(parsed: ReturnType<typeof parseVersionCode>): string {
  if (parsed.isUltimate) return 'Ultimate';
  
  let label = `V${parsed.flowNumber}`;
  if (parsed.variantLetter) {
    label += `.${parsed.variantLetter.toUpperCase()}`;
    if (parsed.adjustmentNumber) {
      label += `.${parsed.adjustmentNumber}`;
    }
  }
  return label;
}

export function useFlowVersion() {
  const [searchParams] = useSearchParams();
  const versionParam = searchParams.get('v');
  
  const parsed = parseVersionCode(versionParam);
  const label = getVersionLabel(parsed);
  
  // Fetch version config from database
  const { data: flowVersion, isLoading, error } = useQuery({
    queryKey: ['flow-version', parsed.flowCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flow_versions')
        .select('*')
        .eq('flow_code', parsed.flowCode)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) return null;
      
      // Parse config from JSON
      const config = typeof data.config === 'object' && data.config !== null
        ? data.config as FlowVersionConfig
        : {};
      
      return {
        ...data,
        config,
      } as FlowVersion;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
  
  // Track version view for analytics
  useEffect(() => {
    if (parsed.flowCode !== '1') {
      localStorage.setItem('uc_flow_variant', parsed.flowCode);
      console.log(`[Flow Version] Viewing: ${label} (${parsed.flowCode})`);
    }
  }, [parsed.flowCode, label]);
  
  // Determine component to render
  const getComponentName = (): string => {
    if (flowVersion?.config?.component) {
      return flowVersion.config.component;
    }
    
    // Fallback mapping based on flow number
    switch (parsed.flowNumber) {
      case 2: return 'MultiStepCalculatorVariantA';
      case 3: return 'MultiStepCalculatorVariantB';
      case 4: return 'MultiStepCalculatorVariantC';
      case 5: return 'MultiStepCalculatorUltimate';
      default: return 'MultiStepCalculator';
    }
  };
  
  return {
    versionParam,
    parsed,
    label,
    flowVersion,
    isLoading,
    error,
    isControl: parsed.flowCode === '1',
    isUltimate: parsed.isUltimate,
    componentName: getComponentName(),
    tweaks: flowVersion?.config?.tweaks || {},
    meta: {
      title: flowVersion?.version_name || `Umzugsofferten ${label}`,
      description: flowVersion?.description || 'Umzugsofferten vergleichen',
    },
  };
}

export default useFlowVersion;
