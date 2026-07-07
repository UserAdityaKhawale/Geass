"use client";

import { useMemo } from "react";

type ShinyTextProps = {
  text: string;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  duration?: number;
  delay?: number;
};

const ShinyText = ({
  text,
  className = "",
  color = "#f8fafc",
  shineColor = "#ffffff",
  spread = 120,
  duration = 2,
  delay = 0,
}: ShinyTextProps) => {
  const style = useMemo(
    () => ({
      backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 30%, ${shineColor} 50%, ${color} 70%, ${color} 100%)`,
      backgroundSize: "200% 100%",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      animation: `shiny-text-slide ${duration}s linear ${delay}s infinite`,
      backgroundRepeat: "no-repeat",
    }),
    [color, delay, duration, shineColor, spread],
  );

  return (
    <span className={`shiny-text ${className}`} style={style}>
      {text}
    </span>
  );
};

export default ShinyText;
