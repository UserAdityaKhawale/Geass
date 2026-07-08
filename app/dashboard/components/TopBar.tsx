"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useGeassStore } from "@/store/useGeassStore";
import { Bell, ChevronDown, ChevronRight } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { SearchInput } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import NotificationDropdown from "./NotificationDropdown";

const BREADCRUMBS: Record<
  string,
  { label: string; parent?: { label: string; href: string } }
> = {
  "/dashboard": { label: "Dashboard" },
  "/dashboard/notes": {
    label: "Notes",
    parent: { label: "Dashboard", href: "/dashboard" },
  },
  "/dashboard/calendar": {
    label: "Calendar",
    parent: { label: "Dashboard", href: "/dashboard" },
  },
  "/dashboard/tasks": {
    label: "Tasks",
    parent: { label: "Dashboard", href: "/dashboard" },
  },
  "/dashboard/planner": {
    label: "Planner",
    parent: { label: "Dashboard", href: "/dashboard" },
  },
  "/dashboard/focus": {
    label: "Focus",
    parent: { label: "Dashboard", href: "/dashboard" },
  },
  "/dashboard/analytics": {
    label: "Analytics",
    parent: { label: "Dashboard", href: "/dashboard" },
  },
  "/dashboard/settings": {
    label: "Settings",
    parent: { label: "Dashboard", href: "/dashboard" },
  },
};

export default function TopBar() {
  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useGeassStore();

  const crumb = BREADCRUMBS[pathname] ?? { label: "Dashboard" };
  const activeWs = workspaces.find((w) => w._id === activeWorkspaceId);
  const [openSelector, setOpenSelector] = useState(false);

  return (
    <div className="h-12 flex items-center gap-4 px-4 border-b border-[var(--topbar-border)] bg-[var(--topbar-bg)] shrink-0">
      {/* Workspace selector badge */}
      <div className="relative flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => setOpenSelector((o) => !o)}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center border"
            style={{
              backgroundColor: activeWs ? `${activeWs.color}15` : undefined,
              borderColor: activeWs ? `${activeWs.color}30` : undefined,
            }}
          >
            <span className="text-[10px]" style={{ color: activeWs?.color }}>
              {activeWs?.icon || "📁"}
            </span>
          </div>
          <span className="text-[12px] font-bold text-[var(--text-primary)]">
            {activeWs?.name || "Workspace"}
          </span>
          <ChevronDown size={12} className="text-neutral-600" />
        </button>

        {openSelector && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-[var(--surface)] border border-[var(--card-border)] rounded-xl shadow-2xl z-50 overflow-hidden">
            {workspaces.map((w) => (
              <button
                key={w._id}
                onClick={() => {
                  setActiveWorkspace(w._id);
                  setOpenSelector(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-white/[0.05] transition-colors ${w._id === activeWorkspaceId ? "bg-white/[0.03]" : ""}`}
              >
                <span>{w.icon}</span>
                <span className="text-[11px] font-bold text-[var(--text-primary)] truncate">
                  {w.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {crumb.parent && (
        <div className="flex items-center gap-1.5 shrink-0">
          <ChevronRight size={11} className="text-neutral-700" />
          <Link
            href={crumb.parent.href}
            className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-300 transition-colors"
          >
            {crumb.parent.label}
          </Link>
          <ChevronRight size={11} className="text-neutral-700" />
          <span className="text-[11px] font-bold text-[var(--text-primary)]">
            {crumb.label}
          </span>
        </div>
      )}

      {/* Search */}
      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search anything... (Ctrl + K)"
        shortcut="⌘K"
        className="flex-1 max-w-xl"
      />

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <AnimatedThemeToggler variant="circle" duration={500} />

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowNotifications((o) => !o)}
            className={`relative flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
              showNotifications
                ? "border-[#EF5A6F]/30 bg-[#EF5A6F]/10 text-[#EF5A6F]"
                : "border-white/[0.06] bg-white/[0.03] text-neutral-500 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF5A6F] ring-1 ring-[#030303]" />
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.18 }}
              >
                <NotificationDropdown
                  onClose={() => setShowNotifications(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile UserButton */}
        <div className="flex items-center pl-1 shrink-0">
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "w-7 h-7 rounded-xl border border-white/[0.08] shadow-lg focus:outline-none hover:opacity-80 transition-all",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
