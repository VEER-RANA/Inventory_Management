"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type ThemePreference = "light" | "dark" | "system";

const THEMES: ThemePreference[] = ["light", "dark", "system"];

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

export function ThemeToggle() {
  const [, setRenderTick] = useState(0);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const theme = mounted ? getStoredTheme() : "system";
  const isDark = mounted ? resolveDarkMode(theme) : false;

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDark);
  }, [mounted, isDark]);

  const setTheme = (nextTheme: ThemePreference) => {
    if (!mounted) return;
    localStorage.setItem("theme", nextTheme);
    const darkMode = resolveDarkMode(nextTheme);
    document.documentElement.classList.toggle("dark", darkMode);
    setRenderTick((tick) => tick + 1);
  };

  const cssVarsLoaded =
    mounted &&
    ["--background", "--foreground", "--primary", "--secondary", "--accent"].every(
      (name) =>
        getComputedStyle(document.documentElement)
          .getPropertyValue(name)
          .trim().length > 0,
    );

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "glass rounded-lg p-4 border border-white/10",
          cssVarsLoaded ? "bg-green-500/10" : "bg-red-500/10",
        )}
      >
        <p className="text-sm text-foreground font-medium">
          Current Theme: <span className="capitalize font-bold">{theme}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          CSS Variables: {cssVarsLoaded ? "✓ Loaded" : "✗ Missing"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {THEMES.map((item) => (
          <button
            key={item}
            onClick={() => setTheme(item)}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-all border border-white/20",
              theme === item
                ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                : "bg-white/10 text-foreground hover:bg-white/20",
            )}
          >
            <span className="capitalize">{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
