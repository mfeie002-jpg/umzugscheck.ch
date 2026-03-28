import { useLocation } from "react-router-dom";
import { useCaptureMode } from "./use-capture-mode";

/**
 * Hook to get the initial step for sub-variant calculators.
 * In capture mode, it returns the step from uc_step URL parameter.
 * Otherwise, it returns 1 (or 0 for flows that start with step 0).
 */
export function useInitialStep(defaultStep: number = 1): number {
  const { isCaptureMode, captureStep } = useCaptureMode();
  
  // In capture mode, use the step from URL if valid
  if (isCaptureMode && captureStep !== null && captureStep >= 0) {
    return captureStep;
  }
  
  return defaultStep;
}
