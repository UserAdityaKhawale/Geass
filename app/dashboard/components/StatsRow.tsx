"use client";

import { CheckCircle2, Timer, Zap, Layers } from "lucide-react";
import { useGeassStore } from "@/store/useGeassStore";

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

export default function StatsRow() {
  const { activeWorkspaceId, tasks, focusSessions } = useGeassStore();

  const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId);
  const todayStr = new Date().toISOString().split("T")[0];

  // Tasks completed today
  const todaysTasks = workspaceTasks.filter(t => t.dueDate?.startsWith(todayStr) || !t.dueDate);
  const completedTodayCount = todaysTasks.filter(t => t.status === "done").length;
  const totalTodayCount = todaysTasks.length;

  // Focus time today (in minutes)
  const todaysSessions = focusSessions.filter(
    s => s.workspaceId === activeWorkspaceId && s.completedAt?.startsWith(todayStr)
  );
  const focusMinutes = todaysSessions.reduce((acc, curr) => acc + curr.duration, 0);
  const hrs = Math.floor(focusMinutes / 60);
  const mins = focusMinutes % 60;
  const focusTimeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

  // Total Notes (for 4th stat
  const totalTasks = workspaceTasks.length;

  // Productivity Score (0-100) based on task completion ratio + focus target
  const taskRatio = totalTodayCount > 0 ? completedTodayCount / totalTodayCount : 0.5;
  const focusRatio = Math.min(focusMinutes / 120, 1); // 2 hours target
  const productivityScore = Math.round((taskRatio * 60) + (focusRatio * 40));

  const stats = [
    {
      icon: CheckCircle2, label: "Tasks Completed",
      value: String(completedTodayCount), sub: `/ ${totalTodayCount} today`, trend: "+10% from yesterday", up: true,
      color: "#22c55e", data: [4, 7, 5, 9, 8, completedTodayCount || 1, completedTodayCount],
    },
    {
      icon: Timer, label: "Focus Time",
      value: focusTimeStr, sub: "/ 2h goal", trend: "+15% from yesterday", up: true,
      color: "#7C3AED", data: [30, 45, 60, 90, 75, focusMinutes || 10, focusMinutes],
    },
    {
      icon: Zap, label: "Productivity Score",
      value: String(productivityScore), sub: "/100", trend: "+8% from yesterday", up: true,
      color: "#EF5A6F", data: [55, 60, 70, 75, 68, productivityScore || 50, productivityScore],
    },
    {
      icon: Layers, label: "Total Tasks",
      value: String(totalTasks), sub: "in workspace", trend: "+3% from last week", up: true,
      color: "#f59e0b", data: [35, 40, 45, 50, 55, totalTasks || 10, totalTasks],
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value, sub, trend, up, color, data }) => (
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
