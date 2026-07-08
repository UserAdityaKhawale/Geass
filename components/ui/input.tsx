"use client";

import { forwardRef } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const inputBase =
  "bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] rounded-xl outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[var(--input-placeholder)] focus:border-[rgba(239,90,111,0.5)] focus:shadow-[0_0_0_3px_rgba(239,90,111,0.1)] disabled:cursor-not-allowed disabled:opacity-50";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-[11px] font-medium",
  md: "px-3.5 py-2.5 text-[13px] font-medium",
  lg: "px-4 py-3 text-sm font-medium",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize = "md", type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn("w-full", inputBase, sizeClasses[inputSize], className)}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  inputSize?: "sm" | "md" | "lg";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, inputSize = "md", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full resize-none",
          inputBase,
          sizeClasses[inputSize],
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export interface SearchInputProps
  extends Omit<InputProps, "type"> {
  shortcut?: string;
  iconSize?: number;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      shortcut,
      iconSize = 13,
      inputSize = "sm",
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative w-full", className)}>
        <Search
          size={iconSize}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        />
        <Input
          ref={ref}
          type="search"
          inputSize={inputSize}
          className={cn("pl-8", shortcut && "pr-10")}
          {...props}
        />
        {shortcut && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <kbd className="text-[9px] text-[var(--text-muted)] font-mono border border-[var(--input-border)] rounded px-1 py-0.5 bg-[var(--surface-strong)]">
              {shortcut}
            </kbd>
          </div>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  inputSize?: "sm" | "md";
}

const selectSizeClasses = {
  sm: "px-2.5 py-1.5 text-[11px]",
  md: "px-3 py-2 text-[13px]",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, inputSize = "sm", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "themed-select w-full font-semibold",
          selectSizeClasses[inputSize],
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
