"use client";

import { useState } from "react";
import { useGeassStore } from "@/store/useGeassStore";
import {
  ChevronDown, Share2, MoreHorizontal, Star, Calendar, CheckSquare, TrendingUp
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  active:      "#22c55e",
  archived:    "#6b7280",
  done:        "#3b82f6",
};

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ProjectsPageHeader({ selectedId, onSelect }: Props) {
  const { activeWorkspaceId, projects, tasks, updateProject } = useGeassStore();
  const [open, setOpen] = useState(false);

  const workspaceProjects = projects.filter(p => p.workspaceId === activeWorkspaceId);
  const project = workspaceProjects.find(p => p._id === selectedId) || workspaceProjects[0];

  if (!project) return null;

  // Compute dynamic task stats
  const projectTasks = tasks.filter(t => t.projectId === project._id);
  const doneTasks = projectTasks.filter(t => t.status === "done").length;
  const totalTasks = projectTasks.length;
  const computedProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Keep project progress synced in store/DB if it changes
  if (project.progress !== computedProgress) {
    updateProject(project._id, { progress: computedProgress });
  }

  return (
    <div className="px-6 py-4 border-b border-white/[0.05] bg-[#0a0a0c] shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 mb-3 font-mono">
        <span>Projects</span>
        <span>›</span>
        <span className="text-neutral-400">{project.name}</span>
        <span>›</span>
        <span className="text-neutral-400">Tasks</span>
      </div>

      {/* Main header row */}
      <div className="flex items-center gap-4">
        {/* Project icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border"
          style={{ backgroundColor: `${project.color}20`, borderColor: `${project.color}30` }}
        >
          {project.icon || "⚡"}
        </div>

        {/* Title + selector */}
        <div className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-[18px] font-black text-white tracking-tight">{project.name}</span>
            <Star size={13} className="text-neutral-600 hover:text-[#f59e0b] transition-colors" />
            <ChevronDown size={14} className="text-neutral-500" />
          </button>

          {/* Status pill */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[project.status] }} />
            <span className="text-[11px] font-semibold capitalize" style={{ color: STATUS_COLORS[project.status] }}>
              {project.status}
            </span>
            <span className="text-[11px] text-neutral-600 ml-1">Workspace scoped project execution</span>
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#111113] border border-white/[0.08] rounded-xl shadow-2xl z-50 overflow-hidden">
              {workspaceProjects.map(p => (
                <button
                  key={p._id}
                  onClick={() => { onSelect(p._id); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/[0.05] transition-colors ${p._id === selectedId ? "bg-white/[0.04]" : ""}`}
                >
                  <span className="text-base">{p.icon || "⚡"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-neutral-600">{p.progress}%</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[p.status] }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 ml-8">
          <div className="text-center">
            <p className="text-[11px] text-neutral-600 font-mono uppercase tracking-wider mb-0.5">Progress</p>
            <div className="flex items-end gap-1.5">
              <span className="text-[22px] font-black" style={{ color: project.color }}>{computedProgress}%</span>
              <TrendingUp size={13} className="text-neutral-600 mb-1" />
            </div>
          </div>

          <div className="w-px h-8 bg-white/[0.06]" />

          <div className="text-center">
            <p className="text-[11px] text-neutral-600 font-mono uppercase tracking-wider mb-0.5">Tasks</p>
            <div className="flex items-center gap-1">
              <CheckSquare size={13} className="text-neutral-500" />
              <span className="text-[16px] font-black text-white">{doneTasks}</span>
              <span className="text-[12px] text-neutral-600">/ {totalTasks}</span>
            </div>
          </div>

          <div className="w-px h-8 bg-white/[0.06]" />

          <div className="text-center">
            <p className="text-[11px] text-neutral-600 font-mono uppercase tracking-wider mb-0.5">Due Date</p>
            <div className="flex items-center gap-1">
              <Calendar size={13} className="text-neutral-500" />
              <span className="text-[13px] font-bold text-white">{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No Date"}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#EF5A6F]/10 border border-[#EF5A6F]/20 text-[#EF5A6F] text-[11px] font-bold rounded-xl hover:bg-[#EF5A6F]/20 transition-all">
            <Share2 size={12} />
            Share
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-neutral-500 hover:text-white hover:bg-white/[0.08] transition-all">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${computedProgress}%`,
              background: `linear-gradient(90deg, ${project.color}, #7C3AED)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
