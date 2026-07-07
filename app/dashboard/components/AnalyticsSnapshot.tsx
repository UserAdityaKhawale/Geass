"use client";

import Link from "next/link";

const METRICS = [
  { label: "Focus Time",          value: "18h 30m", trend: "+12%",    up: true },
  { label: "Tasks Completed",     value: "92",       trend: "+15%",    up: true },
  { label: "Productivity Score",  value: "87",       trend: "+8%",     up: true },
  { label: "Streak",              value: "23 days",  trend: "+5 days", up: true },
];

const DAYS  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// 4 weeks of random heatmap values (seeded deterministically)
const HEAT: number[][] = [
  [0.9, 0.5, 0.7, 0.3, 0.8, 0.2, 0.6],
  [0.4, 0.9, 0.6, 0.8, 0.5, 0.3, 0.7],
  [0.7, 0.3, 0.9, 0.5, 0.4, 0.8, 0.2],
  [0.5, 0.7, 0.4, 0.9, 0.6, 0.3, 0.8],
];

function heatBg(v: number) {
  if (v > 0.75) return "#7C3AED";
  if (v > 0.5)  return "#6d28d9";
  if (v > 0.25) return "#3b1d8a";
  return "#1e1333";
}

export default function AnalyticsSnapshot() {
  return (
    <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-white">Analytics Snapshot</span>
        <Link href="/dashboard/analytics" className="text-[10px] text-[#EF5A6F] hover:text-[#ff8b98] font-semibold transition-colors">
          View full analytics
        </Link>
      </div>

      {/* Metric blocks */}
      <div className="grid grid-cols-4 gap-4">
        {METRICS.map(m => (
          <div key={m.label}>
            <p className="text-[10px] text-neutral-500 font-semibold mb-1">{m.label}</p>
            <p className="text-[17px] font-black text-white leading-tight">{m.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: m.up ? "#22c55e" : "#EF5A6F" }}>
              ↑ {m.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div>
        <p className="text-[10px] text-neutral-500 font-semibold mb-2">Task Completion Heatmap</p>
        <div className="grid grid-cols-7 gap-1 mb-1.5">
          {DAYS.map(d => <span key={d} className="text-center text-[8px] text-neutral-700 font-mono">{d}</span>)}
        </div>
        <div className="space-y-1">
          {HEAT.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((v, di) => (
                <div
                  key={di}
                  className="h-4 rounded-sm transition-colors"
                  style={{ backgroundColor: heatBg(v) }}
                  title={`${Math.round(v * 12)} tasks`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
