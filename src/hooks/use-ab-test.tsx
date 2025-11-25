import { useEffect, useState } from 'react';
import { abTesting } from '@/lib/ab-testing';

export const useABTest = (testId: string) => {
  const [variant, setVariant] = useState<string | null>(null);

  useEffect(() => {
    const assignedVariant = abTesting.getVariant(testId);
    setVariant(assignedVariant);
  }, [testId]);

  const trackConversion = (conversionType: string, value?: number) => {
    abTesting.trackConversion(testId, conversionType, value);
  };

  return { variant, trackConversion };
};
