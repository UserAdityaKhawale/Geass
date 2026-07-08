"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Surface } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PromptDialogProps {
  title: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

/** Beautiful custom replacement for window.prompt() */
function PromptDialog({
  title,
  placeholder = "",
  defaultValue = "",
  confirmLabel = "Create",
  onConfirm,
  onCancel,
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleConfirm = () => {
    if (value.trim()) onConfirm(value.trim());
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="prompt-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          onClick={e => e.stopPropagation()}
        >
          <Surface
            variant="elevated"
            className="w-[420px] overflow-hidden shadow-[0_40px_100px_var(--shadow)] bg-[var(--prompt-bg)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3 className="text-[13px] font-bold text-[var(--text-primary)]">
                {title}
              </h3>
              <button
                onClick={onCancel}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-strong)] p-1 rounded-lg transition-all"
              >
                <X size={13} />
              </button>
            </div>

            {/* Input */}
            <div className="px-5 pb-5">
              <Input
                ref={inputRef}
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") handleConfirm();
                  if (e.key === "Escape") onCancel();
                }}
                placeholder={placeholder}
                inputSize="md"
              />

              <div className="flex gap-2 mt-3 justify-end">
                <button
                  onClick={onCancel}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[12px] font-semibold border transition-all",
                    "border-[var(--input-border)] text-[var(--text-secondary)]",
                    "hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)]"
                  )}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!value.trim()}
                  className="px-4 py-2 rounded-xl text-[12px] font-bold bg-[#EF5A6F] text-white hover:bg-[#d94a5f] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-1.5 shadow-[0_4px_16px_rgba(239,90,111,0.3)]"
                >
                  <Check size={11} />
                  {confirmLabel}
                </button>
              </div>
            </div>
          </Surface>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

interface PromptConfig {
  title: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
}

export function usePrompt() {
  const [config, setConfig] = useState<(PromptConfig & { resolve: (v: string | null) => void }) | null>(null);

  const prompt = (cfg: PromptConfig): Promise<string | null> => {
    return new Promise(resolve => {
      setConfig({ ...cfg, resolve });
    });
  };

  const dialog = config ? (
    <PromptDialog
      {...config}
      onConfirm={v => { config.resolve(v); setConfig(null); }}
      onCancel={() => { config.resolve(null); setConfig(null); }}
    />
  ) : null;

  return { prompt, dialog };
}

export { PromptDialog };
