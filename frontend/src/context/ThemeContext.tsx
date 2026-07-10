import { createContext, useEffect, useState } from "react";
import type {
  ContextProviderProps,
  Theme,
  ThemeContextType,
} from "../types/context.types.js";

export const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ThemeProvider({ children }: ContextProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
