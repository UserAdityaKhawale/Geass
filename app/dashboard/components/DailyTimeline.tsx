"use client";

import { MoreHorizontal, Plus } from "lucide-react";

const EVENTS = [
  { start: "08:00", end: "10:30", title: "Deep Work Session",    sub: "Build Geass Dashboard",   color: "#7C3AED" },
  { start: "10:30", end: "10:45", title: "Break",               sub: "Take a short break",       color: "#22c55e" },
  { start: "10:45", end: "12:30", title: "College Study",        sub: "DBMS Notes & Revision",   color: "#3b82f6" },
  { start: "12:30", end: "13:15", title: "Lunch",               sub: "Recharge & Relax",         color: "#f59e0b" },
  { start: "13:15", end: "15:00", title: "Freelance Work",       sub: "Landing Page for Client", color: "#7C3AED" },
  { start: "15:00", end: "16:00", title: "Project Discussion",   sub: "Team Sync",               color: "#EF5A6F" },
  { start: "17:00", end: "18:00", title: "Gym Time",             sub: "Stay Healthy",            color: "#22c55e" },
];

export default function DailyTimeline() {
  return (
    <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[12px] font-bold text-white">Today&apos;s Timeline</span>
        <button className="text-neutral-600 hover:text-neutral-300 transition-colors">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0 pr-0.5">
        {EVENTS.map((ev, i) => (
          <div
            key={i}
            className="flex gap-3 items-start p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group"
          >
            <div
              className="w-[3px] rounded-full self-stretch shrink-0 mt-0.5"
              style={{ backgroundColor: ev.color, minHeight: "36px" }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white leading-tight truncate">{ev.title}</p>
                  <p className="text-[10px] text-neutral-600 mt-0.5 truncate">{ev.sub}</p>
                </div>
                <span
                  className="text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded-md whitespace-nowrap"
                  style={{ color: ev.color, backgroundColor: `${ev.color}14` }}
                >
                  {ev.start} – {ev.end}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-3 flex items-center gap-2 text-[11px] text-neutral-600 hover:text-white transition-colors font-semibold shrink-0">
        <Plus size={13} />
        Add Time Block
      </button>
    </div>
  );
}
