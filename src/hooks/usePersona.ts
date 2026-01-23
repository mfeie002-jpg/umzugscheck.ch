/**
 * usePersona Hook
 * Manages persona state with URL params + localStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';
import type { PersonaKey, VisionLanguage } from '@/lib/persona-types';

const STORAGE_KEY = 'umzugscheck_persona';
const FUN_MODE_KEY = 'umzugscheck_fun_mode';

interface PersonaState {
  persona: PersonaKey;
  funMode: boolean;
}

export function usePersona(language: VisionLanguage) {
  const [persona, setPersonaState] = useState<PersonaKey>('bg0');
  const [funMode, setFunModeState] = useState(true);

  // Initialize from URL params and localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPersona = params.get('persona') as PersonaKey | null;
    const urlFun = params.get('fun');
    
    const storedPersona = localStorage.getItem(STORAGE_KEY) as PersonaKey | null;
    const storedFun = localStorage.getItem(FUN_MODE_KEY);

    if (urlPersona && ['bg0', 'bg1', 'bg2', 'bg3', 'it'].includes(urlPersona)) {
      setPersonaState(urlPersona);
    } else if (storedPersona && ['bg0', 'bg1', 'bg2', 'bg3', 'it'].includes(storedPersona)) {
      setPersonaState(storedPersona);
    } else if (language === 'bg') {
      setPersonaState('bg0');
    } else if (language === 'it') {
      setPersonaState('it');
    }

    if (urlFun !== null) {
      setFunModeState(urlFun === '1');
    } else if (storedFun !== null) {
      setFunModeState(storedFun === '1');
    }
  }, [language]);

  // Update persona
  const setPersona = useCallback((newPersona: PersonaKey) => {
    setPersonaState(newPersona);
    localStorage.setItem(STORAGE_KEY, newPersona);
    
    const params = new URLSearchParams(window.location.search);
    params.set('persona', newPersona);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, []);

  // Update fun mode
  const setFunMode = useCallback((enabled: boolean) => {
    setFunModeState(enabled);
    localStorage.setItem(FUN_MODE_KEY, enabled ? '1' : '0');
    
    const params = new URLSearchParams(window.location.search);
    params.set('fun', enabled ? '1' : '0');
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, []);

  // Get effective persona based on language
  // Respect URL persona (bg1/bg2/bg3/it) even when language differs
  const effectivePersona: PersonaKey = 
    ['bg1', 'bg2', 'bg3', 'it'].includes(persona) ? persona :
    language === 'de' ? 'bg0' :
    language === 'it' ? (funMode ? 'it' : 'bg0') :
    persona;

  const isPersonalized = effectivePersona !== 'bg0';

  return {
    persona: effectivePersona,
    setPersona,
    funMode,
    setFunMode,
    isPersonalized,
    showPersonaPicker: language === 'bg',
    showFunToggle: language === 'it'
  };
}
