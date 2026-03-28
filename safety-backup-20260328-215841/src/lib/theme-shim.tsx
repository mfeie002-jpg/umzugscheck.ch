// Complete no-op replacement for next-themes to avoid React context issues
// This shim provides the same API as next-themes but WITHOUT using any React hooks

import type { ReactNode } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  themes?: string[];
  forcedTheme?: string;
  nonce?: string;
  value?: { [themeName: string]: string };
}

interface ThemeProviderState {
  theme: string;
  setTheme: (theme: string) => void;
  resolvedTheme: string;
  themes: string[];
  systemTheme: string | undefined;
  forcedTheme?: string;
}

// Completely static ThemeProvider that just renders children
// No React hooks, no context - just a passthrough
function ThemeProvider({ children }: ThemeProviderProps): ReactNode {
  return children;
}

// Static useTheme that returns safe defaults
// No React hooks used at all
function useTheme(): ThemeProviderState {
  return {
    theme: "light",
    setTheme: () => {},
    resolvedTheme: "light",
    themes: ["light", "dark", "system"],
    systemTheme: undefined,
    forcedTheme: undefined,
  };
}

// Export everything that next-themes exports
export { ThemeProvider, useTheme };
export type { ThemeProviderProps };

// Additional exports to match next-themes API completely
export default ThemeProvider;
