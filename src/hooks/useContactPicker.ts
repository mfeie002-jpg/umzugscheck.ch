import { useState, useCallback } from 'react';

interface Contact {
  name?: string[];
  email?: string[];
  tel?: string[];
  address?: string[];
}

interface UseContactPickerReturn {
  isSupported: boolean;
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  selectContacts: (properties?: string[], multiple?: boolean) => Promise<Contact[]>;
  clearContacts: () => void;
}

export const useContactPicker = (): UseContactPickerReturn => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = 'contacts' in navigator && 'ContactsManager' in window;

  const selectContacts = useCallback(async (
    properties: string[] = ['name', 'email', 'tel'],
    multiple: boolean = false
  ): Promise<Contact[]> => {
    if (!isSupported) {
      setError('Contact Picker API not supported');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const contactsManager = (navigator as any).contacts;
      const supportedProperties = await contactsManager.getProperties();
      
      const validProperties = properties.filter(p => supportedProperties.includes(p));
      
      if (validProperties.length === 0) {
        throw new Error('No valid properties supported');
      }

      const selected = await contactsManager.select(validProperties, { multiple });
      setContacts(selected);
      return selected;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to select contacts';
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const clearContacts = useCallback(() => {
    setContacts([]);
    setError(null);
  }, []);

  return {
    isSupported,
    contacts,
    isLoading,
    error,
    selectContacts,
    clearContacts,
  };
};
