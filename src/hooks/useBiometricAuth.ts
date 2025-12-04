import { useState, useCallback } from 'react';

interface BiometricAuthState {
  isSupported: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const useBiometricAuth = () => {
  const [state, setState] = useState<BiometricAuthState>({
    isSupported: typeof PublicKeyCredential !== 'undefined',
    isAuthenticated: false,
    error: null,
  });

  const checkSupport = useCallback(async () => {
    if (!window.PublicKeyCredential) {
      return { biometric: false, platform: false };
    }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return { biometric: true, platform: available };
    } catch {
      return { biometric: false, platform: false };
    }
  }, []);

  const authenticate = useCallback(async (userId: string) => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Biometric auth not supported' }));
      return false;
    }

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required',
          rpId: window.location.hostname,
          allowCredentials: [{
            type: 'public-key',
            id: new TextEncoder().encode(userId),
          }],
        },
      });

      if (credential) {
        setState(prev => ({ ...prev, isAuthenticated: true, error: null }));
        return true;
      }
      return false;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Authentication failed',
        isAuthenticated: false 
      }));
      return false;
    }
  }, [state.isSupported]);

  const register = useCallback(async (userId: string, userName: string) => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Biometric auth not supported' }));
      return null;
    }

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: 'Umzugscheck.ch',
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(userId),
            name: userName,
            displayName: userName,
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 },
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
        },
      });

      return credential;
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
      return null;
    }
  }, [state.isSupported]);

  return {
    ...state,
    checkSupport,
    authenticate,
    register,
  };
};
