/**
 * useAllFlowVariants - Dynamische Zusammenführung aller Flow-Varianten
 * 
 * Kombiniert:
 * - Statische FLOW_CONFIGS (V1-V9)
 * - Statische SUB_VARIANT_CONFIGS (v2a-e, v3a-e, etc.)
 * - Dynamische flow_feedback_variants aus DB (neue via Workflow erstellte)
 * 
 * Generiert automatisch URLs basierend auf Konvention:
 * - Hauptflows: /umzugsofferten-v{N}
 * - Sub-Varianten: /umzugsofferten?variant=v{N}{letter}
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS, FlowConfig } from '@/data/flowConfigs';

export interface UnifiedFlowVariant {
  id: string;
  label: string;
  path: string;
  liveUrl: string;
  testerUrl: string;
  screenshotUrl: string;
  color: string;
  description: string;
  source: 'static' | 'static-sub' | 'workflow';
  parentFlow?: string;
  stepCount: number;
  status?: 'pending' | 'done';
  flowNumber: number;
  variantLetter?: string;
}

// Parse flow ID to extract number and variant letter
function parseFlowId(flowId: string): { flowNumber: number; variantLetter?: string } {
  // Match patterns like "umzugsofferten-v9", "v3a", "umzugsofferten-v9-a"
  const mainMatch = flowId.match(/v(\d+)[-]?([a-z])?$/i);
  if (mainMatch) {
    return {
      flowNumber: parseInt(mainMatch[1], 10),
      variantLetter: mainMatch[2]?.toLowerCase(),
    };
  }
  
  // Match patterns like "v3a"
  const subMatch = flowId.match(/^v(\d+)([a-z])$/i);
  if (subMatch) {
    return {
      flowNumber: parseInt(subMatch[1], 10),
      variantLetter: subMatch[2]?.toLowerCase(),
    };
  }
  
  return { flowNumber: 1 };
}

// Generate URLs for a variant
function generateVariantUrls(flowNumber: number, variantLetter?: string) {
  const variantKey = variantLetter ? `v${flowNumber}${variantLetter}` : null;
  
  if (variantLetter) {
    // Sub-variant URLs
    return {
      liveUrl: `/umzugsofferten?variant=${variantKey}`,
      testerUrl: `/flow-tester?variant=${variantKey}`,
      screenshotUrl: `/admin/tools?tab=calculator-review&flow=umzugsofferten-v${flowNumber}`,
    };
  }
  
  // Main flow URLs
  const flowId = flowNumber === 1 ? 'umzugsofferten' : `umzugsofferten-v${flowNumber}`;
  return {
    liveUrl: `/${flowId}`,
    testerUrl: `/flow-tester?flow=${flowId}`,
    screenshotUrl: `/admin/tools?tab=calculator-review&flow=${flowId}`,
  };
}

export function useAllFlowVariants(selectedFlowFilter?: string) {
  // Fetch workflow-created variants from DB
  const { data: dbVariants, isLoading, refetch } = useQuery({
    queryKey: ['all-flow-variants', selectedFlowFilter],
    queryFn: async () => {
      let query = supabase
        .from('flow_feedback_variants')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (selectedFlowFilter) {
        query = query.eq('flow_id', selectedFlowFilter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 30, // 30 seconds
  });

  // Build unified list of all variants
  const allVariants: UnifiedFlowVariant[] = [];

  // 1. Add main static flows (V1-V9)
  Object.entries(FLOW_CONFIGS).forEach(([id, config]) => {
    const parsed = parseFlowId(id);
    const urls = generateVariantUrls(parsed.flowNumber);
    
    allVariants.push({
      id,
      label: config.label,
      path: config.path,
      ...urls,
      color: config.color,
      description: config.description,
      source: 'static',
      stepCount: config.steps.length,
      flowNumber: parsed.flowNumber,
    });
  });

  // 2. Add static sub-variants (v2a-e, v3a-e, etc.)
  Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
    const parsed = parseFlowId(id);
    const urls = generateVariantUrls(parsed.flowNumber, parsed.variantLetter);
    
    allVariants.push({
      id,
      label: config.label,
      path: config.path,
      ...urls,
      color: config.color,
      description: config.description,
      source: 'static-sub',
      parentFlow: config.parentFlow,
      stepCount: config.steps.length,
      flowNumber: parsed.flowNumber,
      variantLetter: parsed.variantLetter,
    });
  });

  // 3. Add dynamic workflow-created variants from DB
  if (dbVariants) {
    const seenIds = new Set<string>();
    
    dbVariants.forEach((variant) => {
      // Parse flow_id to get flow number
      const parsed = parseFlowId(variant.flow_id);
      
      // Normalize variant_label - extract just the letter if it contains one
      let variantLetter = 'a';
      const label = variant.variant_label || '';
      
      // Try to extract single letter variant (a, b, c, etc.)
      const letterMatch = label.match(/^([a-z])$/i) || label.match(/\.([a-z])$/i);
      if (letterMatch) {
        variantLetter = letterMatch[1].toLowerCase();
      } else if (label.length === 1 && /[a-z]/i.test(label)) {
        variantLetter = label.toLowerCase();
      } else {
        // Generate based on first letter of variant name
        const nameFirst = (variant.variant_name || 'a').charAt(0).toLowerCase();
        variantLetter = /[a-z]/.test(nameFirst) ? nameFirst : 'x';
      }
      
      const urls = generateVariantUrls(parsed.flowNumber, variantLetter);
      
      // Check if this already exists in static configs
      const staticKey = `v${parsed.flowNumber}${variantLetter}`;
      const existsInStatic = SUB_VARIANT_CONFIGS[staticKey];
      
      // Only add if not already in static config and not seen yet
      if (!existsInStatic && variant.status === 'done' && !seenIds.has(staticKey)) {
        seenIds.add(staticKey);
        
        allVariants.push({
          id: staticKey,
          label: `V${parsed.flowNumber}.${variantLetter?.toUpperCase()} - ${variant.variant_name}`,
          path: urls.liveUrl,
          ...urls,
          color: 'bg-emerald-500',
          description: variant.variant_name || 'Workflow-created variant',
          source: 'workflow',
          parentFlow: variant.flow_id,
          stepCount: 4, // Default, can be updated
          flowNumber: parsed.flowNumber,
          variantLetter,
          status: variant.status as 'pending' | 'done',
        });
      }
    });
  }

  // Filter by selected flow if needed
  const filteredVariants = selectedFlowFilter
    ? allVariants.filter(v => 
        v.id === selectedFlowFilter || 
        v.parentFlow === selectedFlowFilter ||
        v.id.startsWith(selectedFlowFilter)
      )
    : allVariants;

  // Get main flows only (for dropdown)
  const mainFlows = allVariants.filter(v => v.source === 'static' && !v.variantLetter);

  // Get sub-variants for a specific flow
  const getSubVariantsForFlow = (flowId: string): UnifiedFlowVariant[] => {
    const parsed = parseFlowId(flowId);
    return allVariants.filter(v => 
      v.flowNumber === parsed.flowNumber && 
      v.variantLetter && 
      (v.source === 'static-sub' || v.source === 'workflow')
    );
  };

  // Get pending workflow variants
  const pendingWorkflowVariants = dbVariants?.filter(v => v.status === 'pending') || [];
  const completedWorkflowVariants = dbVariants?.filter(v => v.status === 'done') || [];

  return {
    allVariants,
    filteredVariants,
    mainFlows,
    getSubVariantsForFlow,
    pendingWorkflowVariants,
    completedWorkflowVariants,
    dbVariants,
    isLoading,
    refetch,
  };
}

export default useAllFlowVariants;
