"use client";

import { CheckCircle2, Timer, Zap, Layers } from "lucide-react";

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 56;
  const H = 22;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 4)}`)
    .join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const STATS = [
  {
    icon: CheckCircle2, label: "Tasks Completed",
    value: "12", sub: "/ 18 today", trend: "+20% from yesterday", up: true,
    color: "#22c55e", data: [4, 7, 5, 9, 8, 11, 12],
  },
  {
    icon: Timer, label: "Focus Time",
    value: "2h 45m", sub: "/ 4h goal", trend: "+15% from yesterday", up: true,
    color: "#7C3AED", data: [60, 90, 75, 120, 100, 140, 165],
  },
  {
    icon: Zap, label: "Productivity Score",
    value: "87", sub: "/100", trend: "+8% from yesterday", up: true,
    color: "#EF5A6F", data: [70, 75, 68, 80, 78, 85, 87],
  },
  {
    icon: Layers, label: "Project Progress",
    value: "68%", sub: "overall", trend: "+12% from last week", up: true,
    color: "#f59e0b", data: [40, 45, 50, 55, 60, 65, 68],
  },
];

export default function StatsRow() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {STATS.map(({ icon: Icon, label, value, sub, trend, up, color, data }) => (
        <div key={label} className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-3.5 flex flex-col gap-2.5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
              <Icon size={13} style={{ color }} />
            </div>
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide truncate">{label}</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-[18px] font-black text-white tracking-tight leading-none">{value}</span>
                <span className="text-[10px] text-neutral-600 font-medium">{sub}</span>
              </div>
              <p className="text-[10px] mt-1" style={{ color: up ? "#22c55e" : "#EF5A6F" }}>
                {up ? "↑" : "↓"} {trend}
              </p>
            </div>
            <Sparkline data={data} color={color} />
          </div>
        </div>
      ))}
    </div>
  );
}
