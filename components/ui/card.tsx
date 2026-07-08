import { cn } from "@/lib/utils";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "ghost";
  padding?: "none" | "sm" | "md" | "lg";
}

const surfaceVariants = {
  default:
    "bg-[var(--card-bg)] border border-[var(--card-border)]",
  elevated:
    "bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[0_8px_32px_var(--shadow)]",
  ghost: "bg-[var(--surface-strong)] border border-[var(--surface-border)]",
};

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Surface({
  className,
  variant = "default",
  padding = "none",
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-colors duration-200",
        surfaceVariants[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    />
  );
}

export type CardProps = SurfaceProps;

export function Card(props: CardProps) {
  return <Surface padding="md" {...props} />;
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1 pb-3", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-[13px] font-bold text-[var(--text-primary)]",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}
