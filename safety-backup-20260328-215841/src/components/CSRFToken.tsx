import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface CSRFContextValue {
  token: string;
  refreshToken: () => void;
  validateToken: (token: string) => boolean;
}

const CSRFContext = createContext<CSRFContextValue | null>(null);

/**
 * Generate a cryptographically secure CSRF token
 */
function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * CSRF Token Provider for client-side form protection
 */
export function CSRFProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => generateCSRFToken());
  const [tokenTimestamp, setTokenTimestamp] = useState(Date.now());

  // Refresh token periodically (every 30 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      setToken(generateCSRFToken());
      setTokenTimestamp(Date.now());
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const refreshToken = useCallback(() => {
    setToken(generateCSRFToken());
    setTokenTimestamp(Date.now());
  }, []);

  const validateToken = useCallback((inputToken: string) => {
    // Token must match and not be older than 1 hour
    const isExpired = Date.now() - tokenTimestamp > 60 * 60 * 1000;
    return inputToken === token && !isExpired;
  }, [token, tokenTimestamp]);

  return (
    <CSRFContext.Provider value={{ token, refreshToken, validateToken }}>
      {children}
    </CSRFContext.Provider>
  );
}

/**
 * Hook to access CSRF token and utilities
 */
export function useCSRFToken() {
  const context = useContext(CSRFContext);
  if (!context) {
    throw new Error('useCSRFToken must be used within a CSRFProvider');
  }
  return context;
}

/**
 * Hidden CSRF token input for forms
 */
export function CSRFInput() {
  const { token } = useCSRFToken();
  return <input type="hidden" name="_csrf" value={token} />;
}
