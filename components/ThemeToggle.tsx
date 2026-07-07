"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

type ThemeOption = "light" | "dark" | "system";

const CYCLE: ThemeOption[] = ["light", "dark", "system"];

const ICONS: Record<ThemeOption, React.ReactNode> = {
  light: <Sun size={14} strokeWidth={2} />,
  dark: <Moon size={14} strokeWidth={2} />,
  system: <Monitor size={14} strokeWidth={2} />,
};

const LABELS: Record<ThemeOption, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const current = (mounted ? theme : "system") as ThemeOption;
  const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];

  return (
    <div className="relative group/toggle">
      <button
        type="button"
        onClick={() => setTheme(next)}
        aria-label={`Switch to ${LABELS[next]} mode`}
        className="flex items-center justify-center h-8 w-8 rounded-xl border border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#EF5A6F]/40"
      >
        {mounted ? ICONS[current] : <Monitor size={14} strokeWidth={2} />}
      </button>

      {/* Tooltip */}
      <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/toggle:opacity-100 transition-opacity duration-150 z-50">
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#111] px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-neutral-400 whitespace-nowrap shadow-xl">
          {mounted ? LABELS[current] : "System"}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
