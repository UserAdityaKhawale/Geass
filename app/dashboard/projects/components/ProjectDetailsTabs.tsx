"use client";

import { useState } from "react";
import { Plus, Calendar, GitBranch, FileText, Activity } from "lucide-react";

const TABS = [
  { id: "overview",  label: "Overview",  icon: FileText },
  { id: "timeline",  label: "Timeline",  icon: Calendar },
  { id: "files",     label: "Files",     icon: GitBranch },
  { id: "activity",  label: "Activity",  icon: Activity },
];

const TEAM = [
  { initials: "AK", color: "#EF5A6F" },
  { initials: "RS", color: "#7C3AED" },
  { initials: "MJ", color: "#3b82f6" },
  { initials: "PR", color: "#22c55e" },
];

const LABELS = [
  { name: "Design",      color: "#7C3AED" },
  { name: "Development", color: "#EF5A6F" },
  { name: "Frontend",    color: "#3b82f6" },
  { name: "Backend",     color: "#f59e0b" },
  { name: "Testing",     color: "#22c55e" },
];

const TIMELINE_ITEMS = [
  { phase: "Planning",     start: 0,  width: 15, color: "#7C3AED" },
  { phase: "Design",       start: 12, width: 20, color: "#3b82f6" },
  { phase: "Development",  start: 28, width: 40, color: "#EF5A6F" },
  { phase: "Testing",      start: 62, width: 20, color: "#f59e0b" },
  { phase: "Launch",       start: 78, width: 22, color: "#22c55e" },
];

const ACTIVITY = [
  { avatar: "AK", action: "moved", subject: "Redesign dashboard UI", detail: "→ In Progress", time: "2m ago", color: "#EF5A6F" },
  { avatar: "RS", action: "added",  subject: "Mobile app development", detail: "to Backlog", time: "15m ago", color: "#7C3AED" },
  { avatar: "MJ", action: "completed", subject: "Sidebar navigation", detail: "", time: "1h ago", color: "#3b82f6" },
  { avatar: "PR", action: "commented on", subject: "Database schema design", detail: '"Need to review the relations"', time: "3h ago", color: "#22c55e" },
  { avatar: "AK", action: "created", subject: "Fix UI responsiveness issues", detail: "· High priority", time: "Yesterday", color: "#EF5A6F" },
];

const FILES = [
  { name: "geass-wireframes-v3.fig",  size: "12.4 MB", type: "Figma",  date: "May 12" },
  { name: "db-schema.pdf",            size: "2.1 MB",  type: "PDF",    date: "May 10" },
  { name: "style-guide.pdf",          size: "4.8 MB",  type: "PDF",    date: "May 8" },
  { name: "api-docs.md",              size: "124 KB",  type: "Docs",   date: "May 6" },
];

export default function ProjectDetailsTabs() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="border-t border-white/[0.05] bg-[#0a0a0c] shrink-0">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-6 pt-1 border-b border-white/[0.05]">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold border-b-2 transition-all -mb-px ${
              tab === id
                ? "border-[#EF5A6F] text-white"
                : "border-transparent text-neutral-600 hover:text-neutral-300"
            }`}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-6 py-4">
        {tab === "overview" && (
          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-700 mb-1.5">Description</p>
              <p className="text-[12px] text-neutral-400 leading-relaxed">
                Complete redesign of the Geass platform with modern UI, better performance and enhanced features. 
                Focus on dark theme aesthetics, smooth animations, and intuitive UX.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-700 mb-2">Team Members</p>
              <div className="flex items-center gap-1.5">
                {TEAM.map(m => (
                  <div
                    key={m.initials}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black text-white border-2 border-[#0a0a0c]"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.initials}
                  </div>
                ))}
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-neutral-400 bg-white/[0.06] border border-white/[0.08]">
                  +2
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-700 mb-2">Labels</p>
              <div className="flex flex-wrap gap-1.5">
                {LABELS.slice(0, 3).map(l => (
                  <span key={l.name} className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ color: l.color, backgroundColor: `${l.color}20` }}>
                    {l.name}
                  </span>
                ))}
                <button className="text-[10px] text-neutral-700 hover:text-neutral-300 px-2 py-0.5 rounded-lg border border-dashed border-white/[0.08] transition-colors">
                  <Plus size={10} />
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "timeline" && (
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-700 mb-3">Project Timeline — 12 Weeks</p>
            <div className="space-y-2">
              {TIMELINE_ITEMS.map(item => (
                <div key={item.phase} className="flex items-center gap-3">
                  <span className="text-[10px] text-neutral-500 w-24 shrink-0">{item.phase}</span>
                  <div className="flex-1 h-5 bg-white/[0.03] rounded-full overflow-hidden relative">
                    <div
                      className="absolute h-full rounded-full flex items-center px-2"
                      style={{ left: `${item.start}%`, width: `${item.width}%`, backgroundColor: `${item.color}30`, borderLeft: `2px solid ${item.color}` }}
                    >
                      <span className="text-[8px] font-bold" style={{ color: item.color }}>{item.width}w</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "files" && (
          <div className="space-y-1.5">
            {FILES.map(f => (
              <div key={f.name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-[#EF5A6F]/10 flex items-center justify-center shrink-0">
                  <FileText size={14} className="text-[#EF5A6F]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-neutral-200 truncate">{f.name}</p>
                  <p className="text-[9px] text-neutral-700">{f.type} · {f.size}</p>
                </div>
                <span className="text-[9px] text-neutral-700 font-mono">{f.date}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "activity" && (
          <div className="space-y-2">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white shrink-0 mt-0.5" style={{ backgroundColor: a.color }}>
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-neutral-400">
                    <span className="font-bold text-white">{a.avatar}</span>{" "}
                    {a.action}{" "}
                    <span className="font-semibold text-neutral-200">{a.subject}</span>{" "}
                    {a.detail && <span className="text-neutral-600">{a.detail}</span>}
                  </p>
                </div>
                <span className="text-[9px] text-neutral-700 font-mono shrink-0 mt-0.5">{a.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
