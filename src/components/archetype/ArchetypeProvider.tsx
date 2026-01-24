import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useArchetypeDetection } from "@/hooks/useArchetypeDetection";
import { type ArchetypeType } from "@/lib/archetype-signals";

interface ArchetypeContextValue {
  archetype: ArchetypeType | null;
  confidence: number;
  isDetecting: boolean;
}

const ArchetypeContext = createContext<ArchetypeContextValue | null>(null);

interface ArchetypeProviderProps {
  children: ReactNode;
}

export const ArchetypeProvider = ({ children }: ArchetypeProviderProps) => {
  const detection = useArchetypeDetection();
  const value = useMemo(
    () => detection,
    [detection.archetype, detection.confidence, detection.isDetecting]
  );

  return <ArchetypeContext.Provider value={value}>{children}</ArchetypeContext.Provider>;
};

export const useArchetype = (): ArchetypeContextValue => {
  const context = useContext(ArchetypeContext);
  if (!context) {
    throw new Error("useArchetype must be used within an ArchetypeProvider");
  }
  return context;
};
