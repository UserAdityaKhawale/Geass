"use client";

import Link from "next/link";

const FEED = [
  { emoji: "✅", color: "#22c55e", text: 'Completed task "Integrate Local Storage"',          time: "Today, 11:40 AM" },
  { emoji: "⏱",  color: "#7C3AED", text: "Started focus session (Deep Work)",                  time: "Today, 10:45 AM" },
  { emoji: "📁", color: "#3b82f6", text: 'Created project "College Semester Project"',          time: "Today, 09:30 AM" },
  { emoji: "➕", color: "#EF5A6F", text: 'Added new task "Study DBMS"',                         time: "Today, 09:15 AM" },
  { emoji: "🔑", color: "#f59e0b", text: "Logged in to Geass",                                 time: "Today, 08:50 AM" },
];

export default function ActivityFeed() {
  return (
    <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-white">Activity</span>
        <Link href="/dashboard/analytics" className="text-[10px] text-[#EF5A6F] hover:text-[#ff8b98] font-semibold transition-colors">
          View all
        </Link>
      </div>

      <div className="space-y-0.5">
        {FEED.map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-white/[0.03] transition-colors">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center text-[12px] shrink-0"
              style={{ backgroundColor: `${item.color}15` }}
            >
              {item.emoji}
            </div>
            <span className="flex-1 text-[11px] text-neutral-300 font-medium leading-tight">{item.text}</span>
            <span className="text-[9px] text-neutral-700 font-mono shrink-0 whitespace-nowrap">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
