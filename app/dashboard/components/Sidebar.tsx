"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useGeassStore } from "@/store/useGeassStore";
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  Calendar,
  Timer,
  FileText,
  BarChart3,
  Settings,
  Plus,
  HelpCircle,
  MessageSquare,
  UserCircle2,
  Trash2,
  X,
  Loader2,
} from "lucide-react";

// SVG icons for social links
const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg className="h-auto w-auto" height={size} width={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = ({ size = 16 }: { size?: number }) => (
  <svg className="h-auto w-auto" height={size} width={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg className="h-auto w-auto" height={size} width={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: CalendarDays, label: "Planner", href: "/dashboard/planner" },
  { icon: CheckSquare, label: "Tasks", href: "/dashboard/tasks" },
  { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
  { icon: Timer, label: "Focus", href: "/dashboard/focus" },
  { icon: FileText, label: "Notes", href: "/dashboard/notes" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: UserCircle2, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { workspaces, activeWorkspaceId, setActiveWorkspace, addWorkspace, deleteWorkspace } =
    useGeassStore();
  const [showAddWs, setShowAddWs] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [newWsIcon, setNewWsIcon] = useState("🚀");
  const [newWsColor, setNewWsColor] = useState("#EF5A6F");
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const activeWs = workspaces.find((w) => w._id === activeWorkspaceId);

  const handleCreateWorkspace = async () => {
    if (!newWsName.trim()) return;

    setError(null);

    const newWorkspace = {
      _id: `ws-${Date.now()}`,
      name: newWsName,
      icon: newWsIcon,
      color: newWsColor,
    };

    // First try to call API to check limit
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorkspace),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }

      // If successful, add to store
      addWorkspace(newWorkspace);
      setNewWsName("");
      setShowAddWs(false);
    } catch (err) {
      console.error("Failed to create workspace:", err);
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    setIsDeleting(true);
    try {
      // Use store function for optimistic update
      deleteWorkspace(workspaceId);

      // If deleted workspace was active, switch to another workspace
      if (activeWorkspaceId === workspaceId) {
        const remainingWorkspaces = workspaces.filter(w => w._id !== workspaceId);
        if (remainingWorkspaces.length > 0) {
          setActiveWorkspace(remainingWorkspaces[0]._id);
        }
      }

      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete workspace:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#0a0a0c] shrink-0 lg:w-[220px]">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-12 border-b border-white/[0.05] shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/geass-logo.png"
            alt="Geass"
            className="h-5 w-auto object-contain drop-shadow-[0_0_6px_rgba(239,90,111,0.4)]"
          />
          <span className="text-[13px] font-black tracking-widest text-white uppercase">
            Geass
          </span>
        </Link>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {/* Primary nav */}
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          // Exact match for root dashboard, startsWith for all sub-routes
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-[12px] font-semibold transition-all duration-200 ${
                active
                  ? "border-[#EF5A6F]/20 bg-[#EF5A6F]/10 text-[#EF5A6F]"
                  : "border-transparent text-neutral-500 hover:-translate-y-0.5 hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-neutral-200"
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
              onClick={() => setShowAddWs((o) => !o)}
              className="text-neutral-600 hover:text-white transition-colors rounded p-0.5"
            >
              <Plus size={11} />
            </button>
          </div>

          {workspaces.map((ws) => (
            <div
              key={ws._id}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-semibold transition-all duration-200 group ${
                activeWorkspaceId === ws._id
                  ? "bg-white/[0.06] text-white"
                  : "text-neutral-600 hover:-translate-y-0.5 hover:bg-white/[0.03] hover:text-neutral-300"
              }`}
            >
              <button
                onClick={() => setActiveWorkspace(ws._id)}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <span
                  className="text-sm shrink-0"
                  style={{
                    color: activeWorkspaceId === ws._id ? ws.color : undefined,
                  }}
                >
                  {ws.icon || "📁"}
                </span>
                <span className="truncate">{ws.name}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(ws._id);
                }}
                className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-400 transition-all p-1 rounded-lg hover:bg-white/[0.05]"
                title="Delete workspace"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          {showAddWs && (
            <div className="mt-2 p-2 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-2">
              {error && (
                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-xs">{error}</p>
                  <button
                    onClick={() => window.location.href = "/dashboard/billing"}
                    className="text-[#EF5A6F] text-xs font-bold mt-1 hover:text-[#ff8b98]"
                  >
                    Upgrade now →
                  </button>
                </div>
              )}
              <input
                type="text"
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                placeholder="Workspace name"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-[#EF5A6F]/50"
              />
              <div className="flex gap-1.5 items-center justify-between">
                <input
                  type="text"
                  value={newWsIcon}
                  onChange={(e) => setNewWsIcon(e.target.value)}
                  placeholder="Icon (emoji)"
                  className="w-12 bg-white/[0.04] border border-white/[0.08] rounded-lg py-1 text-center text-[11px] text-white focus:outline-none"
                />
                <input
                  type="color"
                  value={newWsColor}
                  onChange={(e) => setNewWsColor(e.target.value)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0e0e10] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Workspace?</h3>
                <p className="text-sm text-neutral-400">This action cannot be undone</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-white/5 rounded-xl">
                <p className="text-sm text-neutral-300">
                  This will permanently delete the workspace and all its data including:
                </p>
                <ul className="text-sm text-neutral-400 mt-2 space-y-1 list-disc list-inside">
                  <li>All tasks</li>
                  <li>All notes</li>
                  <li>All focus sessions</li>
                  <li>All time blocks</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2 px-4 rounded-xl border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteWorkspace(showDeleteConfirm)}
                disabled={isDeleting}
                className="flex-1 py-2 px-4 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Workspace"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="shrink-0 space-y-1 border-t border-white/[0.05] px-3 py-3">
        <Link
          href="/help"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[12px] font-semibold text-neutral-600 transition-all hover:-translate-y-0.5 hover:bg-white/[0.04] hover:text-neutral-300"
        >
          <HelpCircle size={14} />
          Help Center
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[12px] font-semibold text-neutral-600 transition-all hover:-translate-y-0.5 hover:bg-white/[0.04] hover:text-neutral-300"
        >
          <MessageSquare size={14} />
          Profile Setup
        </Link>
        <div className="flex items-center gap-2 px-2 pt-2">
          <a
            href="https://github.com/UserAdityaKhawale"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg p-2 text-neutral-600 transition-all hover:bg-white/[0.04] hover:text-white"
          >
            <GithubIcon size={13} />
          </a>
          <a
            href="https://x.com/Workbyaditya"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg p-2 text-neutral-600 transition-all hover:bg-white/[0.04] hover:text-white"
          >
            <TwitterIcon size={13} />
          </a>
          <a
            href="https://www.linkedin.com/in/aditya-r-khawale-1805352a9/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg p-2 text-neutral-600 transition-all hover:bg-white/[0.04] hover:text-white"
          >
            <LinkedinIcon size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
