"use client";

import { useGeassStore } from "@/store/useGeassStore";
import { CheckCircle2, Timer, Zap, Layers, History, Award } from "lucide-react";

export default function AnalyticsPage() {
  const { activeWorkspaceId, tasks, projects, focusSessions } = useGeassStore();

  const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId);
  const workspaceSessions = focusSessions.filter(s => s.workspaceId === activeWorkspaceId);
  const workspaceProjects = projects.filter(p => p.workspaceId === activeWorkspaceId);

  // Stats aggregate calculations
  const totalCompletedTasks = workspaceTasks.filter(t => t.status === "done").length;
  const totalTasksCount = workspaceTasks.length;

  const totalFocusMinutes = workspaceSessions.reduce((acc, curr) => acc + curr.duration, 0);
  const focusHrs = Math.floor(totalFocusMinutes / 60);
  const focusMins = totalFocusMinutes % 60;
  const focusTimeStr = focusHrs > 0 ? `${focusHrs}h ${focusMins}m` : `${focusMins}m`;

  const averageProjectProgress = workspaceProjects.length > 0
    ? Math.round(workspaceProjects.reduce((acc, curr) => acc + (curr.progress || 0), 0) / workspaceProjects.length)
    : 0;

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

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-black text-white tracking-tight">Analytics Workspace</h1>
        <p className="text-[12px] text-neutral-500 mt-1">Real-time productivity summary metrics for your active workspace.</p>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: CheckCircle2, label: "Tasks Completed", value: String(totalCompletedTasks), sub: `/ ${totalTasksCount} total`, color: "#22c55e" },
          { icon: Timer, label: "Total Focus Time", value: focusTimeStr, sub: `${workspaceSessions.length} sessions`, color: "#7C3AED" },
          { icon: Award, label: "Current Streak", value: `${streak} days`, sub: "focus target streak", color: "#EF5A6F" },
          { icon: Layers, label: "Avg Project Progress", value: `${averageProjectProgress}%`, sub: `${workspaceProjects.length} projects`, color: "#f59e0b" },
        ].map(card => (
          <div key={card.label} className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon size={13} style={{ color: card.color }} />
              </div>
              <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wide truncate">{card.label}</span>
            </div>
            <div>
              <p className="text-[20px] font-black text-white leading-none tracking-tight">{card.value}</p>
              <p className="text-[9px] text-neutral-600 font-medium mt-1">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail History Panels */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Completed Tasks */}
        <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#22c55e]" />
            <h2 className="text-[13px] font-bold text-white">Recent Completed Tasks</h2>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/[0.08]">
            {workspaceTasks.filter(t => t.status === "done").slice(0, 8).map(task => (
              <div key={task._id} className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/[0.04] rounded-xl text-[11px] text-neutral-300">
                <span className="truncate flex-1 pr-3 font-semibold">{task.title}</span>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase text-neutral-600 bg-white/[0.04] shrink-0">
                  {task.priority}
                </span>
              </div>
            ))}
            {workspaceTasks.filter(t => t.status === "done").length === 0 && (
              <div className="text-center py-10 text-neutral-700 text-[11px]">No completed tasks logged yet.</div>
            )}
          </div>
        </div>

        {/* Completed Focus Sessions Log */}
        <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <History size={14} className="text-[#7C3AED]" />
            <h2 className="text-[13px] font-bold text-white">Focus Sessions History</h2>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/[0.08]">
            {workspaceSessions.slice(0, 8).map(sess => (
              <div key={sess._id} className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/[0.04] rounded-xl text-[11px] text-neutral-300">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold capitalize">{sess.type.replace("_", " ")} Session</span>
                  <span className="text-[8px] text-neutral-600 font-mono">
                    {sess.completedAt ? new Date(sess.completedAt).toLocaleString() : "Recently"}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#7C3AED] shrink-0">
                  {sess.duration} mins
                </span>
              </div>
            ))}
            {workspaceSessions.length === 0 && (
              <div className="text-center py-10 text-neutral-700 text-[11px]">No focus sessions logged yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
