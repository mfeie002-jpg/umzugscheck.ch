/**
 * CaptureSentinel - Wrapper for screenshot automation
 * 
 * Provides a simple re-export of the global CaptureReadySentinel
 * for use in calculator variant components.
 */

import React from 'react';
import { CaptureReadySentinel } from '@/components/CaptureReadySentinel';

interface CaptureSentinelProps {
  step?: number | string;
  flow?: string;
  isReady?: boolean;
}

export const CaptureSentinel: React.FC<CaptureSentinelProps> = ({ 
  step, 
  flow, 
  isReady = false // FIXED: default to false - flows must explicitly set isReady when content is rendered
}) => {
  return <CaptureReadySentinel step={step} flow={flow} isReady={isReady} />;
};

export default CaptureSentinel;
