// Build: v11-fresh-start - Use explicit React namespace to prevent duplicate React issues
import * as React from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
  systemTheme: "dark" | "light" | undefined;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
  attribute = "class",
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">("light");
  const [systemTheme, setSystemTheme] = React.useState<"dark" | "light" | undefined>(undefined);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const currentSystemTheme = mediaQuery.matches ? "dark" : "light";
    setSystemTheme(currentSystemTheme);

    let effectiveTheme: "dark" | "light";

    if (theme === "system" && enableSystem) {
      effectiveTheme = currentSystemTheme;
    } else {
      effectiveTheme = theme === "dark" ? "dark" : "light";
    }

    setResolvedTheme(effectiveTheme);

    if (attribute === "class") {
      root.classList.add(effectiveTheme);
    } else {
      root.setAttribute(attribute, effectiveTheme);
    }
  }, [theme, attribute, enableSystem]);

  React.useEffect(() => {
    if (!enableSystem) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? "dark" : "light";
      setSystemTheme(newSystemTheme);
      
      if (theme === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(newSystemTheme);
        setResolvedTheme(newSystemTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, enableSystem]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    return {
      theme: "light" as Theme,
      setTheme: () => {},
      resolvedTheme: "light" as const,
      systemTheme: undefined,
    };
  }
  return context;
};

export default ThemeProvider;
