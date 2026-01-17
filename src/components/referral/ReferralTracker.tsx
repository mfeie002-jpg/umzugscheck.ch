import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Tracks referral codes from URL parameters
 * Place this component high in the app tree (e.g., App.tsx or Layout)
 */
export function ReferralTracker() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    
    if (refCode) {
      // Store referral code in localStorage for later attribution
      const existingRef = localStorage.getItem('umzugscheck_referral');
      
      // Only set if no existing referral or it's older than 30 days
      if (!existingRef) {
        localStorage.setItem('umzugscheck_referral', JSON.stringify({
          code: refCode,
          timestamp: Date.now(),
          source: window.location.href,
        }));
        console.log('Referral code tracked:', refCode);
      }
    }
  }, [searchParams]);

  return null;
}

/**
 * Get the stored referral code
 */
export function getStoredReferralCode(): string | null {
  try {
    const stored = localStorage.getItem('umzugscheck_referral');
    if (!stored) return null;

    const data = JSON.parse(stored);
    
    // Check if referral is still valid (30 days)
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - data.timestamp > thirtyDays) {
      localStorage.removeItem('umzugscheck_referral');
      return null;
    }

    return data.code;
  } catch {
    return null;
  }
}

/**
 * Clear the stored referral code (after successful conversion)
 */
export function clearStoredReferralCode(): void {
  localStorage.removeItem('umzugscheck_referral');
}
