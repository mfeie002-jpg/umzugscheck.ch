import { useEffect, useRef, useState, createContext, useContext, ReactNode } from 'react';

interface AnnouncerContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AnnouncerContext = createContext<AnnouncerContextType | null>(null);

export function useAnnouncer() {
  const context = useContext(AnnouncerContext);
  if (!context) {
    throw new Error('useAnnouncer must be used within an AnnouncerProvider');
  }
  return context;
}

interface AnnouncerProviderProps {
  children: ReactNode;
}

export function AnnouncerProvider({ children }: AnnouncerProviderProps) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const politeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const assertiveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (priority === 'assertive') {
      // Clear previous message first to ensure re-announcement
      setAssertiveMessage('');
      if (assertiveTimeoutRef.current) {
        clearTimeout(assertiveTimeoutRef.current);
      }
      assertiveTimeoutRef.current = setTimeout(() => {
        setAssertiveMessage(message);
      }, 50);
    } else {
      setPoliteMessage('');
      if (politeTimeoutRef.current) {
        clearTimeout(politeTimeoutRef.current);
      }
      politeTimeoutRef.current = setTimeout(() => {
        setPoliteMessage(message);
      }, 50);
    }
  };

  useEffect(() => {
    return () => {
      if (politeTimeoutRef.current) clearTimeout(politeTimeoutRef.current);
      if (assertiveTimeoutRef.current) clearTimeout(assertiveTimeoutRef.current);
    };
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        {politeMessage}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
}

// Component for visually hidden text (screen reader only)
interface VisuallyHiddenProps {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export function VisuallyHidden({ children, as: Component = 'span' }: VisuallyHiddenProps) {
  return (
    <Component
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0
      }}
    >
      {children}
    </Component>
  );
}

// Focus indicator component
interface FocusRingProps {
  children: ReactNode;
  className?: string;
}

export function FocusRing({ children, className = '' }: FocusRingProps) {
  return (
    <div className={`focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 rounded-lg ${className}`}>
      {children}
    </div>
  );
}

export default AnnouncerProvider;
