// useLocalStorage.js
import { useState } from "react";

export function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  function setLocal(val) {
    try {
      const next = typeof val === "function" ? val(state) : val;
      setState(next);
      localStorage.setItem(key, JSON.stringify(next));
    } catch (e) {
      console.error("localStorage set failed", e);
    }
  }

  return [state, setLocal];
}
