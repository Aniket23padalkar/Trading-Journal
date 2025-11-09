import { createContext, useEffect, useMemo, useState } from "react";
import useTradesData from "../hooks/useTradesData.jsx";

export const GlobalContext = createContext(null);

export default function GlobalStateContext({ children }) {
  const { trades } = useTradesData();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  const contextMemo = useMemo(
    () => ({
      trades,
      theme,
      setTheme,
    }),
    [trades, theme]
  );

  return (
    <GlobalContext.Provider value={contextMemo}>
      {children}
    </GlobalContext.Provider>
  );
}
