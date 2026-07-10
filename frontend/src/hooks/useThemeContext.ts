import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.js";
import type { ThemeContextType } from "../types/context.types.js";

export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }

  return context;
}
