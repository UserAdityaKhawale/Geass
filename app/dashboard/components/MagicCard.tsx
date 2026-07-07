"use client";

import { useCallback } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  /** Radius of the spotlight radial gradient in px */
  gradientSize?: number;
  /** Inner spotlight fill colour (css colour string) */
  gradientColor?: string;
  /** Opacity of the spotlight fill layer  (0-1) */
  gradientOpacity?: number;
  /** Border highlight colour at the cursor */
  borderColor?: string;
  /** Border highlight opacity (0-1) */
  borderOpacity?: number;
}

/**
 * Wraps any card with a subtle, mouse-tracking spotlight + border highlight.
 * Designed to be dropped in as a thin wrapper — no layout/sizing changes.
 */
export function MagicCard({
  children,
  className = "",
  gradientSize = 140,
  gradientColor = "#EF5A6F",
  gradientOpacity = 0.05,
  borderColor = "#EF5A6F",
  borderOpacity = 0.35,
}: MagicCardProps) {
  // raw mouse position
  const rawX = useMotionValue(-gradientSize);
  const rawY = useMotionValue(-gradientSize);

  // spring-smoothed for the orb so it lags behind naturally
  const mouseX = useSpring(rawX, { stiffness: 400, damping: 35, mass: 0.4 });
  const mouseY = useSpring(rawY, { stiffness: 400, damping: 35, mass: 0.4 });

  // spotlight inner glow — very subtle fill
  const innerGlow = useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 80%)`;

  // border shimmer — brighter ring right at the cursor
  const borderGlow = useMotionTemplate`radial-gradient(${gradientSize * 0.7}px circle at ${mouseX}px ${mouseY}px, ${borderColor}, transparent 70%)`;

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      rawX.set(e.clientX - rect.left);
      rawY.set(e.clientY - rect.top);
    },
    [rawX, rawY]
  );

  const handleLeave = useCallback(() => {
    rawX.set(-gradientSize);
    rawY.set(-gradientSize);
  }, [rawX, rawY, gradientSize]);

  return (
    <div
      className={`group/magic relative ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {/*
        ─── Layer 1: border highlight ─────────────────────────────────────────
        Sits between the card background and the content. Uses a pseudo-border
        trick: 1px border as a mask, gradient follows cursor.
        We achieve this by positioning an overlay at -1px inset so it sits
        behind the card's own border — giving just a glow ring on the edge.
      */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover/magic:opacity-100 transition-opacity duration-500 z-0"
        style={{
          background: borderGlow,
          opacity: borderOpacity,
        }}
        suppressHydrationWarning
      />

      {/*
        ─── Layer 2: inner spotlight glow ────────────────────────────────────
        Renders ON TOP of the card background but below content.
        Extremely subtle fill so it doesn't wash out text.
      */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover/magic:opacity-100 transition-opacity duration-300 z-[1]"
        style={{
          background: innerGlow,
          opacity: gradientOpacity,
        }}
        suppressHydrationWarning
      />

      {/* ─── Content: stacked above both glow layers ───────────────────────── */}
      <div className="relative z-[2] h-full">{children}</div>
    </div>
  );
}
