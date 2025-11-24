import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ABTest {
  id: string;
  variant: "A" | "B";
}

interface ABTestingContextType {
  getVariant: (testId: string) => "A" | "B";
  trackConversion: (testId: string) => void;
}

const ABTestingContext = createContext<ABTestingContextType | undefined>(undefined);

export const useABTest = () => {
  const context = useContext(ABTestingContext);
  if (!context) {
    throw new Error("useABTest must be used within ABTestingProvider");
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const ABTestingProvider = ({ children }: Props) => {
  const [tests, setTests] = useState<ABTest[]>([]);

  useEffect(() => {
    // Load tests from localStorage
    const savedTests = localStorage.getItem("ab-tests");
    if (savedTests) {
      setTests(JSON.parse(savedTests));
    }
  }, []);

  const getVariant = (testId: string): "A" | "B" => {
    const existingTest = tests.find(t => t.id === testId);
    if (existingTest) {
      return existingTest.variant;
    }

    // Randomly assign variant
    const variant = Math.random() < 0.5 ? "A" : "B";
    const newTest: ABTest = { id: testId, variant };
    const updatedTests = [...tests, newTest];
    
    setTests(updatedTests);
    localStorage.setItem("ab-tests", JSON.stringify(updatedTests));
    
    // Track assignment
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_assigned', {
        test_id: testId,
        variant: variant,
      });
    }
    
    return variant;
  };

  const trackConversion = (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (test && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_conversion', {
        test_id: testId,
        variant: test.variant,
      });
    }
  };

  return (
    <ABTestingContext.Provider value={{ getVariant, trackConversion }}>
      {children}
    </ABTestingContext.Provider>
  );
};
