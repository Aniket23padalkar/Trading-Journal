import { useState } from "react";

export default function useLocalStorage(key, initialValue) {
  const [trades] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  return trades;
}
