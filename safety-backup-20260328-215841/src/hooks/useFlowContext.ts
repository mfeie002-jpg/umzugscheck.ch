import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export interface FlowContext {
  isInFlow: boolean;
  flowName: string | null;
  currentStep: number | null;
  totalSteps: number | null;
  flowBasePath: string | null;
  previousStepPath: string | null;
  flowStartPath: string | null;
}

const FLOW_CONFIGS: Record<string, { name: string; totalSteps: number; basePath: string }> = {
  "/umzug": { name: "Umzugsrechner", totalSteps: 5, basePath: "/umzug" },
  "/reinigung": { name: "Reinigungsrechner", totalSteps: 4, basePath: "/reinigung" },
  "/entsorgung": { name: "Entsorgungsrechner", totalSteps: 4, basePath: "/entsorgung" },
  "/firmenumzug": { name: "Firmenumzug", totalSteps: 5, basePath: "/firmenumzug" },
  "/offerten": { name: "Offerten-Flow", totalSteps: 3, basePath: "/offerten" },
  "/umzugsofferten": { name: "Umzugsofferten", totalSteps: 4, basePath: "/umzugsofferten" },
};

export function useFlowContext(): FlowContext {
  const location = useLocation();
  
  return useMemo(() => {
    const pathname = location.pathname;
    
    // Find matching flow
    for (const [basePath, config] of Object.entries(FLOW_CONFIGS)) {
      if (pathname.startsWith(basePath)) {
        // Extract step number from path (e.g., /umzug/step-2 or /umzug/2)
        const stepMatch = pathname.match(/(?:step-?)?(\d+)$/i);
        const currentStep = stepMatch ? parseInt(stepMatch[1], 10) : 1;
        
        const previousStep = currentStep > 1 ? currentStep - 1 : null;
        const previousStepPath = previousStep 
          ? `${config.basePath}/step-${previousStep}` 
          : null;
        
        return {
          isInFlow: true,
          flowName: config.name,
          currentStep,
          totalSteps: config.totalSteps,
          flowBasePath: config.basePath,
          previousStepPath,
          flowStartPath: config.basePath,
        };
      }
    }
    
    return {
      isInFlow: false,
      flowName: null,
      currentStep: null,
      totalSteps: null,
      flowBasePath: null,
      previousStepPath: null,
      flowStartPath: null,
    };
  }, [location.pathname]);
}
