import { useState, useCallback, useRef, useEffect } from 'react';

interface VoiceInputState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

interface UseVoiceInputOptions {
  language?: string;
  continuous?: boolean;
  onResult?: (transcript: string) => void;
  onInterim?: (transcript: string) => void;
}

export const useVoiceInput = (options: UseVoiceInputOptions = {}) => {
  const {
    language = 'de-CH',
    continuous = false,
    onResult,
    onInterim,
  } = options;

  const [state, setState] = useState<VoiceInputState>({
    isSupported: typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
    isListening: false,
    transcript: '',
    interimTranscript: '',
    error: null,
  });

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!state.isSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || 
                              (window as any).webkitSpeechRecognition;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null }));
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognition.onerror = (event: any) => {
      setState(prev => ({ 
        ...prev, 
        isListening: false, 
        error: event.error === 'not-allowed' 
          ? 'Mikrofon-Zugriff verweigert' 
          : `Fehler: ${event.error}` 
      }));
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setState(prev => ({ ...prev, transcript: finalTranscript }));
        onResult?.(finalTranscript);
      }
      
      if (interimTranscript) {
        setState(prev => ({ ...prev, interimTranscript }));
        onInterim?.(interimTranscript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [state.isSupported, language, continuous, onResult, onInterim]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || state.isListening) return;
    
    setState(prev => ({ ...prev, transcript: '', interimTranscript: '', error: null }));
    recognitionRef.current.start();
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !state.isListening) return;
    recognitionRef.current.stop();
  }, [state.isListening]);

  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [state.isListening, startListening, stopListening]);

  return {
    ...state,
    startListening,
    stopListening,
    toggleListening,
  };
};
