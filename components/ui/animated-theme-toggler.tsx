"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type TransitionVariant =
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "hexagon"
  | "rectangle"
  | "star";

function polygonCollapsed(cx: number, cy: number, n: number) {
  return `polygon(${Array.from({ length: n }, () => `${cx}px ${cy}px`).join(", ")})`;
}

function getClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxR: number,
  vw: number,
  vh: number
): [string, string] {
  switch (variant) {
    case "circle":
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxR}px at ${cx}px ${cy}px)`,
      ];
    case "square": {
      const s = Math.max(Math.max(cx, vw - cx), Math.max(cy, vh - cy)) * 1.05;
      const end = `polygon(${cx - s}px ${cy - s}px, ${cx + s}px ${cy - s}px, ${cx + s}px ${cy + s}px, ${cx - s}px ${cy + s}px)`;
      return [polygonCollapsed(cx, cy, 4), end];
    }
    case "diamond": {
      const R = maxR * Math.SQRT2;
      return [
        polygonCollapsed(cx, cy, 4),
        `polygon(${cx}px ${cy - R}px, ${cx + R}px ${cy}px, ${cx}px ${cy + R}px, ${cx - R}px ${cy}px)`,
      ];
    }
    case "hexagon": {
      const R = maxR * Math.SQRT2;
      const v = Array.from({ length: 6 }, (_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        return `${cx + R * Math.cos(a)}px ${cy + R * Math.sin(a)}px`;
      });
      return [polygonCollapsed(cx, cy, 6), `polygon(${v.join(", ")})`];
    }
    case "star": {
      const R = maxR * Math.SQRT2 * 1.03;
      const inner = 0.42;
      const star = (r: number) => {
        const pts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const oa = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          pts.push(`${cx + r * Math.cos(oa)}px ${cy + r * Math.sin(oa)}px`);
          const ia = oa + Math.PI / 5;
          pts.push(
            `${cx + r * inner * Math.cos(ia)}px ${cy + r * inner * Math.sin(ia)}px`
          );
        }
        return `polygon(${pts.join(", ")})`;
      };
      return [star(Math.max(2, R * 0.025)), star(R)];
    }
    default:
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxR}px at ${cx}px ${cy}px)`,
      ];
  }
}

export interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
  variant?: TransitionVariant;
  fromCenter?: boolean;
  /** Controlled theme — when set, skips next-themes setTheme */
  theme?: string;
  /** Called with the next theme when toggling in controlled mode */
  onThemeChange?: (theme: string) => void;
}

export function AnimatedThemeToggler({
  className,
  duration = 500,
  variant = "circle",
  fromCenter = false,
  theme: controlledTheme,
  onThemeChange,
  ...props
}: AnimatedThemeTogglerProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const btnRef = useRef<HTMLButtonElement>(null);

  const activeTheme = controlledTheme ?? resolvedTheme;
  const isDark = activeTheme === "dark";

  const toggle = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const vw = window.visualViewport?.width ?? window.innerWidth;
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const { top, left, width, height } = btn.getBoundingClientRect();
    const cx = fromCenter ? vw / 2 : left + width / 2;
    const cy = fromCenter ? vh / 2 : top + height / 2;
    const maxR = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy));
    const [clipFrom, clipTo] = getClipPaths(variant, cx, cy, maxR, vw, vh);
    const nextTheme = isDark ? "light" : "dark";

    const applyTheme = () => {
      if (onThemeChange) {
        onThemeChange(nextTheme);
      } else {
        setTheme(nextTheme);
      }
    };

    if (typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    const root = document.documentElement;
    root.dataset.magicuiThemeVt = "active";
    root.style.setProperty(
      "--magicui-theme-toggle-vt-duration",
      `${duration}ms`
    );
    root.style.setProperty("--magicui-theme-vt-clip-from", clipFrom);

    const cleanup = () => {
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty("--magicui-theme-toggle-vt-duration");
      root.style.removeProperty("--magicui-theme-vt-clip-from");
    };

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme);
    });
    transition?.finished?.finally(cleanup);
    transition?.ready?.then(() => {
      document.documentElement.animate(
        { clipPath: [clipFrom, clipTo] },
        {
          duration,
          easing: variant === "star" ? "linear" : "ease-in-out",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  }, [isDark, setTheme, onThemeChange, variant, fromCenter, duration]);

  const buttonClass = cn(
    "group relative flex items-center justify-center h-8 w-8 rounded-xl border transition-all duration-200",
    isDark
      ? "border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/10"
      : "border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 shadow-sm",
    className
  );

  if (!mounted) {
    return (
      <button
        className={cn(
          "flex items-center justify-center h-8 w-8 rounded-xl border border-white/10 bg-white/5 text-neutral-400",
          className
        )}
        {...props}
      >
        <Moon size={14} />
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to Light" : "Switch to Dark"}
      className={buttonClass}
      {...props}
    >
      <span className="relative w-4 h-4">
        <Sun
          size={14}
          className={cn(
            "absolute inset-0 transition-all duration-300",
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-50"
          )}
        />
        <Moon
          size={14}
          className={cn(
            "absolute inset-0 transition-all duration-300",
            !isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-50"
          )}
        />
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
