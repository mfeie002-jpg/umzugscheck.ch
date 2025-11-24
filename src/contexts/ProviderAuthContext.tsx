import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

interface Provider {
  id: string;
  company_name: string;
  contact_person_name: string;
  email: string;
  phone: string;
  website?: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  cantons_served: string[];
  services_offered: string[];
  description?: string;
  fleet_size?: number;
  employees_count?: number;
  price_level?: string;
  logo_url?: string;
  verification_status: string;
  account_status: string;
  max_leads_per_month?: number;
  preferred_regions?: string[];
  min_job_value?: number;
  created_at: string;
  updated_at: string;
}

interface ProviderAuthContextType {
  provider: Provider | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => void;
  updateProvider: (data: Partial<Provider>) => Promise<{ error: any }>;
  refreshProvider: () => Promise<void>;
}

const ProviderAuthContext = createContext<ProviderAuthContextType | undefined>(undefined);

export const ProviderAuthProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedToken = localStorage.getItem('provider_token');
    const storedProvider = localStorage.getItem('provider_data');
    
    if (storedToken && storedProvider) {
      setToken(storedToken);
      setProvider(JSON.parse(storedProvider));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('provider-login', {
        body: { email, password }
      });

      if (error || !data.success) {
        return { error: data?.error || 'Login fehlgeschlagen' };
      }

      // Store token and provider data
      localStorage.setItem('provider_token', data.token);
      localStorage.setItem('provider_data', JSON.stringify(data.provider));
      
      setToken(data.token);
      setProvider(data.provider);
      
      return { error: null };
    } catch (error) {
      logger.error('Provider sign in error', error);
      return { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' };
    }
  };

  const signOut = () => {
    localStorage.removeItem('provider_token');
    localStorage.removeItem('provider_data');
    setToken(null);
    setProvider(null);
  };

  const updateProvider = async (data: Partial<Provider>) => {
    if (!token) {
      return { error: 'Nicht angemeldet' };
    }

    try {
      const response = await supabase.functions.invoke('provider-profile', {
        body: data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.error || !response.data.success) {
        return { error: response.data?.error || 'Aktualisierung fehlgeschlagen' };
      }

      // Update local provider data
      const updatedProvider = response.data.provider;
      localStorage.setItem('provider_data', JSON.stringify(updatedProvider));
      setProvider(updatedProvider);

      return { error: null };
    } catch (error) {
      logger.error('Provider update error', error);
      return { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' };
    }
  };

  const refreshProvider = async () => {
    if (!token) return;

    try {
      const response = await supabase.functions.invoke('provider-profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data?.provider) {
        localStorage.setItem('provider_data', JSON.stringify(response.data.provider));
        setProvider(response.data.provider);
      }
    } catch (error) {
      logger.error('Provider refresh error', error);
    }
  };

  return (
    <ProviderAuthContext.Provider
      value={{
        provider,
        token,
        loading,
        signIn,
        signOut,
        updateProvider,
        refreshProvider,
      }}
    >
      {children}
    </ProviderAuthContext.Provider>
  );
};

export const useProviderAuth = () => {
  const context = useContext(ProviderAuthContext);
  if (context === undefined) {
    throw new Error("useProviderAuth must be used within a ProviderAuthProvider");
  }
  return context;
};
