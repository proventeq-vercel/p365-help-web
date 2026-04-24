"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "p365-help-theme";

type Theme = "light" | "dark";

function resolveSystemTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : resolveSystemTheme();

    applyTheme(initialTheme);
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      aria-label={mounted ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Toggle color mode"}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      onClick={toggleTheme}
      type="button"
    >
      {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{mounted ? (theme === "dark" ? "Light mode" : "Dark mode") : "Theme"}</span>
    </button>
  );
}
