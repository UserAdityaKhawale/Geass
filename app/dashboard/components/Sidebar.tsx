"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useGeassStore } from "@/store/useGeassStore";
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

export default function Sidebar() {
  const pathname = usePathname();
  const { workspaces, activeWorkspaceId, setActiveWorkspace, addWorkspace } = useGeassStore();
  const [showAddWs, setShowAddWs] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [newWsIcon, setNewWsIcon] = useState("🚀");
  const [newWsColor, setNewWsColor] = useState("#EF5A6F");

  const activeWs = workspaces.find(w => w._id === activeWorkspaceId);

  const handleCreateWorkspace = () => {
    if (!newWsName.trim()) return;
    addWorkspace({
      _id: `ws-${Date.now()}`,
      name: newWsName,
      icon: newWsIcon,
      color: newWsColor,
    });
    setNewWsName("");
    setShowAddWs(false);
  };

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
            <button
              onClick={() => setShowAddWs(o => !o)}
              className="text-neutral-600 hover:text-white transition-colors rounded p-0.5"
            >
              <Plus size={11} />
            </button>
          </div>

          {workspaces.map((ws) => (
            <button
              key={ws._id}
              onClick={() => setActiveWorkspace(ws._id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all duration-150 ${
                activeWorkspaceId === ws._id
                  ? "bg-white/[0.06] text-white"
                  : "text-neutral-600 hover:text-neutral-300 hover:bg-white/[0.03]"
              }`}
            >
              <span className="text-sm shrink-0" style={{ color: activeWorkspaceId === ws._id ? ws.color : undefined }}>
                {ws.icon || "📁"}
              </span>
              <span className="truncate">{ws.name}</span>
            </button>
          ))}

          {showAddWs && (
            <div className="mt-2 p-2 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-2">
              <input
                type="text"
                value={newWsName}
                onChange={e => setNewWsName(e.target.value)}
                placeholder="Workspace name"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-[#EF5A6F]/50"
              />
              <div className="flex gap-1.5 items-center justify-between">
                <input
                  type="text"
                  value={newWsIcon}
                  onChange={e => setNewWsIcon(e.target.value)}
                  placeholder="Icon (emoji)"
                  className="w-12 bg-white/[0.04] border border-white/[0.08] rounded-lg py-1 text-center text-[11px] text-white focus:outline-none"
                />
                <input
                  type="color"
                  value={newWsColor}
                  onChange={e => setNewWsColor(e.target.value)}
                  className="w-6 h-6 border-0 bg-transparent cursor-pointer rounded overflow-hidden shrink-0"
                />
                <button
                  onClick={handleCreateWorkspace}
                  className="bg-[#EF5A6F] text-white font-bold text-[10px] px-2.5 py-1 rounded-lg hover:bg-[#d94a5f] transition-all"
                >
                  Create
                </button>
              </div>
            </div>
          )}

          {!showAddWs && (
            <button
              onClick={() => setShowAddWs(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] text-neutral-700 hover:text-neutral-400 transition-colors mt-1"
            >
              <Plus size={12} />
              New Workspace
            </button>
          )}
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
