/**
 * Client-side rate limiting utility
 * Stores submission timestamps in localStorage to prevent spam
 */

interface RateLimitConfig {
  key: string;
  maxAttempts: number;
  windowMs: number;
}

interface AttemptRecord {
  timestamps: number[];
}

/**
 * Check if an action is rate limited
 * @returns {boolean} true if action is allowed, false if rate limited
 */
export const checkRateLimit = (config: RateLimitConfig): boolean => {
  const { key, maxAttempts, windowMs } = config;
  const now = Date.now();
  const storageKey = `rate_limit_${key}`;
  
  try {
    // Get existing attempts
    const stored = localStorage.getItem(storageKey);
    const record: AttemptRecord = stored ? JSON.parse(stored) : { timestamps: [] };
    
    // Filter out old attempts outside the time window
    const recentTimestamps = record.timestamps.filter(
      (timestamp) => now - timestamp < windowMs
    );
    
    // Check if limit exceeded
    if (recentTimestamps.length >= maxAttempts) {
      return false;
    }
    
    // Record new attempt
    recentTimestamps.push(now);
    localStorage.setItem(storageKey, JSON.stringify({ timestamps: recentTimestamps }));
    
    return true;
  } catch (error) {
    // If localStorage fails, allow the action (don't block legitimate users)
    return true;
  }
};

/**
 * Get time remaining until rate limit resets
 * @returns {number} milliseconds until reset, or 0 if not rate limited
 */
export const getRateLimitReset = (config: RateLimitConfig): number => {
  const { key, maxAttempts, windowMs } = config;
  const now = Date.now();
  const storageKey = `rate_limit_${key}`;
  
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return 0;
    
    const record: AttemptRecord = JSON.parse(stored);
    const recentTimestamps = record.timestamps.filter(
      (timestamp) => now - timestamp < windowMs
    );
    
    if (recentTimestamps.length < maxAttempts) return 0;
    
    // Find oldest timestamp and calculate reset time
    const oldestTimestamp = Math.min(...recentTimestamps);
    const resetTime = oldestTimestamp + windowMs - now;
    
    return Math.max(0, resetTime);
  } catch (error) {
    return 0;
  }
};

/**
 * Clear rate limit for a specific key (for testing or admin purposes)
 */
export const clearRateLimit = (key: string): void => {
  try {
    localStorage.removeItem(`rate_limit_${key}`);
  } catch (error) {
    // Ignore errors
  }
};
