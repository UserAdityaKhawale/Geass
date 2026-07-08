"use client";

import { useGeassStore } from "@/store/useGeassStore";
import NextLink from "next/link";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// v = completion percentage 0–100
function heatBg(v: number) {
  if (v === 0)  return "#0f1629";   // empty — very dark blue
  if (v >= 90)  return "#EF5A6F";   // 90–100% → pink
  if (v >= 50)  return "#7c3aed";   // 50–89%  → purple mid
  return "#1e3a8a";                  // 1–49%   → blue
}

function heatLabel(v: number) {
  if (v === 0)  return "No tasks";
  if (v >= 90)  return `${v}% — Great day!`;
  if (v >= 50)  return `${v}% — Good progress`;
  return `${v}% — Keep going`;
}

export default function AnalyticsSnapshot() {
  const { activeWorkspaceId, tasks, focusSessions } = useGeassStore();

  const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId);
  const workspaceSessions = focusSessions.filter(s => s.workspaceId === activeWorkspaceId);

  // Completed tasks count
  const completedTasks = workspaceTasks.filter(t => t.status === "done");
  const completedCount = completedTasks.length;

  // Focus time (total hours)
  const focusMinutes = workspaceSessions.reduce((acc, curr) => acc + curr.duration, 0);
  const focusHrs = Math.floor(focusMinutes / 60);
  const focusMins = focusMinutes % 60;
  const focusTimeStr = focusHrs > 0 ? `${focusHrs}h ${focusMins}m` : `${focusMins}m`;

  // Streak calculations
  const countsByDate: Record<string, number> = {};
  workspaceSessions.forEach(sess => {
    try {
      const dateStr = sess.completedAt.split("T")[0];
      countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;
    } catch {}
  });

  const today = new Date();
  let streak = 0;
  let checkDate = new Date(today);
  const todayStr = checkDate.toISOString().split("T")[0];
  const hasToday = (countsByDate[todayStr] || 0) > 0;

  if (!hasToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const checkStr = checkDate.toISOString().split("T")[0];
    if ((countsByDate[checkStr] || 0) > 0) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  if (hasToday && streak === 0) streak = 1;

  // Productivity Score
  const todayTasksList = workspaceTasks.filter(t => t.dueDate?.startsWith(todayStr) || !t.dueDate);
  const completedToday = todayTasksList.filter(t => t.status === "done").length;
  const totalToday = todayTasksList.length;
  const taskRatio = totalToday > 0 ? completedToday / totalToday : 0.5;
  const focusTodayMinutes = workspaceSessions
    .filter(s => s.completedAt?.startsWith(todayStr))
    .reduce((acc, curr) => acc + curr.duration, 0);
  const focusRatio = Math.min(focusTodayMinutes / 120, 1);
  const productivityScore = Math.round((taskRatio * 60) + (focusRatio * 40));

  // ── Heatmap: per-day completion percentage over last 28 days ──────────────
  // Grid is 4 rows (weeks) × 7 cols (Mon–Sun), oldest week first
  // Each cell = % of tasks due that day that are "done" (0 if no tasks)
  const heatMapGrid: number[][] = Array.from({ length: 4 }, () => Array(7).fill(0));

  for (let w = 0; w < 4; w++) {
    for (let d = 0; d < 7; d++) {
      // Week 0 = oldest (21–27 days ago), week 3 = most recent (0–6 days ago)
      const daysAgo = (3 - w) * 7 + (6 - d);
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - daysAgo);
      const targetStr = targetDate.toISOString().split("T")[0];

      const dueThatDay = workspaceTasks.filter(t => t.dueDate?.startsWith(targetStr));
      const doneThatDay = dueThatDay.filter(t => t.status === "done");

      heatMapGrid[w][d] = dueThatDay.length > 0
        ? Math.round((doneThatDay.length / dueThatDay.length) * 100)
        : 0;
    }
  }

  const metrics = [
    { label: "Focus Time",         value: focusTimeStr,              trend: "+12%",    up: true },
    { label: "Tasks Completed",    value: String(completedCount),    trend: "+15%",    up: true },
    { label: "Productivity Score", value: String(productivityScore), trend: "+8%",     up: true },
    { label: "Streak",             value: `${streak} days`,          trend: "+5 days", up: true },
  ];

  return (
    <div className="bg-transparent backdrop-blur-sm border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-white">Analytics Snapshot</span>
        <NextLink href="/dashboard/analytics" className="text-[10px] text-[#EF5A6F] hover:text-[#ff8b98] font-semibold transition-colors">
          View all
        </NextLink>
      </div>

      {/* Metric blocks */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map(m => (
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
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-neutral-500 font-semibold">Task Completion Heatmap</p>
          {/* Legend */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#1e3a8a" }} />
              <span className="text-[8px] text-neutral-600">&lt;50%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#7c3aed" }} />
              <span className="text-[8px] text-neutral-600">50–89%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#EF5A6F" }} />
              <span className="text-[8px] text-neutral-600">90–100%</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1.5">
          {DAYS.map(d => (
            <span key={d} className="text-center text-[8px] text-neutral-700 font-mono">{d}</span>
          ))}
        </div>
        <div className="space-y-1">
          {heatMapGrid.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((v, di) => (
                <div
                  key={di}
                  className="h-4 rounded-sm transition-all duration-300 cursor-default"
                  style={{ backgroundColor: heatBg(v) }}
                  title={heatLabel(v)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
