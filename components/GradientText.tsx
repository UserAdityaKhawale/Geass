"use client";

import { useCallback, useMemo, useState } from "react";
import styles from "./GradientText.module.css";

type GradientTextProps = {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  direction?: "horizontal" | "vertical" | "diagonal";
  pauseOnHover?: boolean;
  yoyo?: boolean;
  showBorder?: boolean;
};

export default function GradientText({
  children,
  className = "",
  colors = ["#ffffff", "#ffb3c4", "#ef5a6f", "#ffb3c4"],
  animationSpeed = 8,
  direction = "horizontal",
  pauseOnHover = false,
  yoyo = true,
  showBorder = false,
}: GradientTextProps) {
  const [isPaused, setIsPaused] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  }, [pauseOnHover]);

  const gradientAngle =
    direction === "horizontal"
      ? "to right"
      : direction === "vertical"
        ? "to bottom"
        : "to bottom right";

  const gradientColors = [...colors, colors[0]].join(", ");

  const sharedStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
      backgroundSize:
        direction === "horizontal"
          ? "300% 100%"
          : direction === "vertical"
            ? "100% 300%"
            : "300% 300%",
      backgroundRepeat: "repeat",
      animationDirection: yoyo ? "alternate" : "normal",
      animationDuration: `${animationSpeed}s`,
      animationPlayState: isPaused ? "paused" : "running",
    }),
    [direction, gradientAngle, gradientColors, isPaused, animationSpeed, yoyo],
  );

  const animationClass =
    direction === "vertical"
      ? styles.verticalAnimation
      : direction === "diagonal"
        ? styles.diagonalAnimation
        : styles.horizontalAnimation;

  const wrapperStyle = showBorder ? sharedStyle : undefined;

  return (
    <span
      className={`${styles.animatedGradientText} ${showBorder ? styles.withBorder : ""} ${className}`.trim()}
      style={wrapperStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showBorder && <span className={styles.gradientOverlay} />}
      <span
        className={`${styles.textContent} ${animationClass}`}
        style={sharedStyle}
      >
        {children}
      </span>
    </span>
  );
}
