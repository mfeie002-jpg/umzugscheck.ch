import { createContext, useContext, type ReactNode } from "react";
import { usePaidMode, type PaidModeConfig } from "@/hooks/usePaidMode";

const PaidModeContext = createContext<PaidModeConfig | null>(null);

type PaidModeProviderProps = {
  children: ReactNode;
};

export function PaidModeProvider({ children }: PaidModeProviderProps) {
  const paidMode = usePaidMode();
  return <PaidModeContext.Provider value={paidMode}>{children}</PaidModeContext.Provider>;
}

export function usePaidModeContext() {
  return useContext(PaidModeContext);
}
