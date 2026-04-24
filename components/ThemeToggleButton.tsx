"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemePreference = "light" | "dark" | "system";

function getStoredTheme(): ThemePreference {
  const value = localStorage.getItem("theme");
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return "system";
}

function resolveDarkMode(theme: ThemePreference): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggleButton() {
  const [, setRenderTick] = useState(0);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = mounted ? resolveDarkMode(getStoredTheme()) : false;

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDark);
  }, [mounted, isDark]);

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  const toggleTheme = () => {
    if (!mounted) return;
    const nextTheme: ThemePreference = isDark ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    setRenderTick((tick) => tick + 1);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-white/20",
        "bg-white/10 px-3 py-2 text-sm font-medium text-foreground",
        "transition-all hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/30",
      )}
      aria-label={label}
      title={label}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
