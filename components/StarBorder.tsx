import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import "./StarBorder.css";

type StarBorderProps<T extends ElementType = "button"> = {
  as?: T;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

const StarBorder = <T extends ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  thickness = 3,
  children,
  style,
  ...rest
}: StarBorderProps<T>) => {
  const Component = (as || "button") as ElementType;
  return (
    <Component
      className={`star-border-container ${className}`.trim()}
      style={{ padding: `${thickness}px 0`, ...style }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />

      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />

      <div className="inner-content">{children}</div>
    </Component>
  );
};

export default StarBorder;
