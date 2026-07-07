"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const EVENTS = [
  { time: "09:00 AM", title: "Team Standup",        platform: "Google Meet", color: "#7C3AED" },
  { time: "11:00 AM", title: "Project Discussion",   platform: "Google Meet", color: "#3b82f6" },
  { time: "02:00 PM", title: "Client Call",          platform: "Zoom",        color: "#EF5A6F" },
  { time: "04:00 PM", title: "Gym Time",             platform: "Personal",    color: "#22c55e" },
];

type ViewT = "Day" | "Week" | "Month";

export default function CalendarPreview() {
  const [view, setView] = useState<ViewT>("Day");
  const now = new Date();
  const label = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[12px] font-bold text-white">Calendar Preview</span>
        <Link href="/dashboard/calendar" className="text-[10px] text-[#EF5A6F] hover:text-[#ff8b98] font-semibold transition-colors">
          View full calendar
        </Link>
      </div>

      {/* Nav row */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <button className="text-neutral-600 hover:text-white transition-colors p-0.5">
            <ChevronLeft size={14} />
          </button>
          <span className="text-[11px] font-bold text-white">{label}</span>
          <button className="text-neutral-600 hover:text-white transition-colors p-0.5">
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex rounded-xl border border-white/[0.06] overflow-hidden">
          {(["Day", "Week", "Month"] as ViewT[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-2.5 py-1 text-[10px] font-semibold transition-colors ${view === v ? "bg-white/[0.08] text-white" : "text-neutral-600 hover:text-white"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {EVENTS.map((ev, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer">
            <span className="text-[10px] font-mono text-neutral-600 w-16 shrink-0">{ev.time}</span>
            <div className="w-0.5 self-stretch rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-white truncate">{ev.title}</p>
              <p className="text-[9px] text-neutral-600">{ev.platform}</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-white transition-all">
              <MoreHorizontal size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
