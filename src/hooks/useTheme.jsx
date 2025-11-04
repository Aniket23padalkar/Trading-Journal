import { useEffect, useState } from "react";

export default function useTheme(key, initialValue) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(key) || initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, theme);
    document.documentElement.classList.toggle("dark");
  }, [key, theme]);

  return [theme, setTheme];
}
