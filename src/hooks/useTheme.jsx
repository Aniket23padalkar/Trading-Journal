import { useEffect, useState } from "react";

export default function useTheme(key, initialValue) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(key) || initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [key, theme]);

  return [theme, setTheme];
}
