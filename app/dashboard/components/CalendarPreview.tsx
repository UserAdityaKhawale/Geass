"use client";

import { useGeassStore } from "@/store/useGeassStore";
import Link from "next/link";

const PRIORITY_COLORS: Record<string, string> = {
  high: "#EF5A6F",
  medium: "#f59e0b",
  low: "#22c55e",
};

export default function CalendarPreview() {
  const { activeWorkspaceId, tasks } = useGeassStore();

  const todayStr = new Date().toISOString().split("T")[0];
  const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId && t.dueDate);

  // Filter tasks due today or tasks that are undated (fallback)
  const todaysEvents = workspaceTasks
    .filter(t => t.dueDate?.startsWith(todayStr))
    .slice(0, 4);

  return (
    <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[12px] font-bold text-white">Calendar Preview</span>
        <Link href="/dashboard/calendar" className="text-[10px] text-[#EF5A6F] hover:text-[#ff8b98] font-semibold transition-colors">
          View full calendar
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08]">
        {todaysEvents.map((ev, i) => {
          const color = PRIORITY_COLORS[ev.priority] || PRIORITY_COLORS.medium;
          const timeLabel = ev.createdAt
            ? new Date(ev.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            : "10:00 AM";

          return (
            <div key={ev._id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer">
              <span className="text-[10px] font-mono text-neutral-600 w-16 shrink-0">{timeLabel}</span>
              <div className="w-0.5 self-stretch rounded-full shrink-0" style={{ backgroundColor: color }} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white truncate">{ev.title}</p>
                <p className="text-[9px] text-neutral-600 uppercase">{ev.tag || "Task"}</p>
              </div>
            </div>
          );
        })}

        {todaysEvents.length === 0 && (
          <div className="text-center py-10 text-neutral-700 text-[10px]">No events scheduled for today.</div>
        )}
      </div>
    </div>
  );
}
