"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Bell, ChevronDown, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const BREADCRUMBS: Record<string, { label: string; parent?: { label: string; href: string } }> = {
  "/dashboard":          { label: "Dashboard" },
  "/dashboard/projects": { label: "Projects",  parent: { label: "Dashboard", href: "/dashboard" } },
  "/dashboard/notes":    { label: "Notes",     parent: { label: "Dashboard", href: "/dashboard" } },
  "/dashboard/calendar": { label: "Calendar",  parent: { label: "Dashboard", href: "/dashboard" } },
  "/dashboard/tasks":    { label: "Tasks",     parent: { label: "Dashboard", href: "/dashboard" } },
  "/dashboard/planner":  { label: "Planner",   parent: { label: "Dashboard", href: "/dashboard" } },
  "/dashboard/focus":    { label: "Focus",     parent: { label: "Dashboard", href: "/dashboard" } },
  "/dashboard/analytics":{ label: "Analytics", parent: { label: "Dashboard", href: "/dashboard" } },
  "/dashboard/settings": { label: "Settings",  parent: { label: "Dashboard", href: "/dashboard" } },
};

export default function TopBar() {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const crumb = BREADCRUMBS[pathname] ?? { label: "Dashboard" };

  return (
    <div className="h-12 flex items-center gap-4 px-4 border-b border-white/[0.05] bg-[#0a0a0c] shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 shrink-0">
        {crumb.parent ? (
          <>
            <Link href={crumb.parent.href} className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-300 transition-colors">
              {crumb.parent.label}
            </Link>
            <ChevronRight size={11} className="text-neutral-700" />
            <span className="text-[11px] font-bold text-white">{crumb.label}</span>
          </>
        ) : (
          <>
            <div className="w-5 h-5 rounded-md bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center">
              <span className="text-[9px] text-[#7C3AED] font-black">C</span>
            </div>
            <span className="text-[12px] font-semibold text-white">College</span>
            <ChevronDown size={12} className="text-neutral-600" />
          </>
        )}
      </div>

      {/* Search */}
      <div className="flex-1 relative max-w-xl">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search anything... (Ctrl + K)"
          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-8 pr-10 py-1.5 text-[11px] text-neutral-400 placeholder:text-neutral-700 focus:outline-none focus:border-white/15 focus:bg-white/[0.05] focus:text-white transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <kbd className="text-[9px] text-neutral-700 font-mono border border-white/[0.08] rounded px-1 py-0.5">⌘K</kbd>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative flex items-center justify-center h-8 w-8 rounded-xl border border-white/[0.06] bg-white/[0.03] text-neutral-500 hover:text-white hover:bg-white/[0.08] transition-all">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF5A6F] ring-1 ring-[#030303]" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] transition-all">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EF5A6F] flex items-center justify-center text-[9px] font-black text-white shrink-0">
            A
          </div>
          <span className="text-[12px] font-semibold text-white">Aditya</span>
          <ChevronDown size={11} className="text-neutral-600" />
        </button>
      </div>
    </div>
  );
}
