"use client";

import { useState } from "react";
import {
  ChevronDown, Share2, MoreHorizontal, Star, Calendar, CheckSquare, TrendingUp
} from "lucide-react";

const PROJECTS = [
  { id: 1, name: "Geass Redesign",          icon: "⚡", color: "#EF5A6F", status: "Active",    progress: 68, tasks: { done: 24, total: 35 }, due: "May 30, 2025" },
  { id: 2, name: "College Semester Project", icon: "📚", color: "#7C3AED", status: "In Progress",progress: 40, tasks: { done: 12, total: 30 }, due: "Jun 15, 2025" },
  { id: 3, name: "Freelance Landing Page",   icon: "🌐", color: "#3b82f6", status: "Active",    progress: 60, tasks: { done: 9,  total: 15 }, due: "Jul 01, 2025" },
  { id: 4, name: "Personal Website",         icon: "💻", color: "#22c55e", status: "Done",      progress: 90, tasks: { done: 18, total: 20 }, due: "Apr 20, 2025" },
];

const STATUS_COLORS: Record<string, string> = {
  Active:      "#22c55e",
  "In Progress": "#f59e0b",
  Done:        "#3b82f6",
  Paused:      "#6b7280",
};

interface Props {
  selectedId: number;
  onSelect: (id: number) => void;
}

export default function ProjectsPageHeader({ selectedId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const project = PROJECTS.find(p => p.id === selectedId) ?? PROJECTS[0];

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
          {project.icon}
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
            <span className="text-[11px] font-semibold" style={{ color: STATUS_COLORS[project.status] }}>
              {project.status}
            </span>
            <span className="text-[11px] text-neutral-600 ml-1">Redesign the entire Geass platform with modern UI/UX</span>
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#111113] border border-white/[0.08] rounded-xl shadow-2xl z-50 overflow-hidden">
              {PROJECTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { onSelect(p.id); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/[0.05] transition-colors ${p.id === selectedId ? "bg-white/[0.04]" : ""}`}
                >
                  <span className="text-base">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-neutral-600">{p.progress}% · {p.tasks.done}/{p.tasks.total} tasks</p>
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
              <span className="text-[22px] font-black" style={{ color: project.color }}>{project.progress}%</span>
              <TrendingUp size={13} className="text-neutral-600 mb-1" />
            </div>
          </div>

          <div className="w-px h-8 bg-white/[0.06]" />

          <div className="text-center">
            <p className="text-[11px] text-neutral-600 font-mono uppercase tracking-wider mb-0.5">Tasks</p>
            <div className="flex items-center gap-1">
              <CheckSquare size={13} className="text-neutral-500" />
              <span className="text-[16px] font-black text-white">{project.tasks.done}</span>
              <span className="text-[12px] text-neutral-600">/ {project.tasks.total}</span>
            </div>
          </div>

          <div className="w-px h-8 bg-white/[0.06]" />

          <div className="text-center">
            <p className="text-[11px] text-neutral-600 font-mono uppercase tracking-wider mb-0.5">Due Date</p>
            <div className="flex items-center gap-1">
              <Calendar size={13} className="text-neutral-500" />
              <span className="text-[13px] font-bold text-white">{project.due}</span>
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
              width: `${project.progress}%`,
              background: `linear-gradient(90deg, ${project.color}, #7C3AED)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
