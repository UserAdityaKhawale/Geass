"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  FolderKanban,
  Calendar,
  Timer,
  FileText,
  BarChart3,
  Settings,
  Plus,
  HelpCircle,
  MessageSquare,
  Home,
  GraduationCap,
  Briefcase,
  Rocket,
  Dumbbell,
  BookOpen,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: CalendarDays,    label: "Planner",   href: "/dashboard/planner" },
  { icon: CheckSquare,     label: "Tasks",     href: "/dashboard/tasks" },
  { icon: FolderKanban,   label: "Projects",  href: "/dashboard/projects" },
  { icon: Calendar,        label: "Calendar",  href: "/dashboard/calendar" },
  { icon: Timer,           label: "Focus",     href: "/dashboard/focus" },
  { icon: FileText,        label: "Notes",     href: "/dashboard/notes" },
  { icon: BarChart3,       label: "Analytics", href: "/dashboard/analytics" },
  { icon: Settings,        label: "Settings",  href: "/dashboard/settings" },
];

const WORKSPACES = [
  { icon: Home,          label: "Home",      color: "#EF5A6F" },
  { icon: GraduationCap, label: "College",   color: "#7C3AED" },
  { icon: Briefcase,     label: "Freelance", color: "#3b82f6" },
  { icon: Rocket,        label: "Startup",   color: "#f59e0b" },
  { icon: Dumbbell,      label: "Fitness",   color: "#22c55e" },
  { icon: BookOpen,      label: "Learning",  color: "#06b6d4" },
  { icon: User,          label: "Personal",  color: "#ec4899" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [activeWs, setActiveWs] = useState("College");

  return (
    <div className="w-[220px] h-full flex flex-col bg-[#0a0a0c] border-r border-white/[0.05] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-12 border-b border-white/[0.05] shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <img src="/geass-logo.png" alt="Geass" className="h-5 w-auto object-contain drop-shadow-[0_0_6px_rgba(239,90,111,0.4)]" />
          <span className="text-[13px] font-black tracking-widest text-white uppercase">Geass</span>
        </Link>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {/* Primary nav */}
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all duration-150 ${
                active
                  ? "bg-[#EF5A6F]/10 text-[#EF5A6F] border border-[#EF5A6F]/15"
                  : "text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}

        {/* Workspaces */}
        <div className="pt-4 pb-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-600">
              Workspaces
            </span>
            <button className="text-neutral-600 hover:text-white transition-colors rounded p-0.5">
              <Plus size={11} />
            </button>
          </div>

          {WORKSPACES.map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              onClick={() => setActiveWs(label)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all duration-150 ${
                activeWs === label
                  ? "bg-white/[0.06] text-white"
                  : "text-neutral-600 hover:text-neutral-300 hover:bg-white/[0.03]"
              }`}
            >
              <Icon size={13} style={{ color: activeWs === label ? color : undefined }} />
              {label}
            </button>
          ))}

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] text-neutral-700 hover:text-neutral-400 transition-colors mt-1">
            <Plus size={12} />
            New Workspace
          </button>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-3 py-3 border-t border-white/[0.05] space-y-0.5 shrink-0">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-semibold text-neutral-600 hover:text-neutral-300 hover:bg-white/[0.04] transition-all">
          <HelpCircle size={14} />
          Help & Support
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-semibold text-neutral-600 hover:text-neutral-300 hover:bg-white/[0.04] transition-all">
          <MessageSquare size={14} />
          Feedback
        </button>
      </div>
    </div>
  );
}
