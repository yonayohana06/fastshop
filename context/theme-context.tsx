"use client";

import React, { createContext, useContext, useCallback, useSyncExternalStore, useEffect } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("fastshop-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("fastshop-theme-change", callback);
  };
}

function getThemeSnapshot(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function getServerThemeSnapshot(): Theme {
  return "light"; // Default theme is strictly light
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  // Sync class on root document whenever theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
      window.dispatchEvent(new Event("fastshop-theme-change"));
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
