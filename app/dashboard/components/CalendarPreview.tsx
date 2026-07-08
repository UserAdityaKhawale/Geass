"use client";

import { useGeassStore } from "@/store/useGeassStore";
import Link from "next/link";

const PRIORITY_COLORS: Record<string, string> = {
  high: "#EF5A6F",
  medium: "#f59e0b",
  low: "#22c55e",
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPreview() {
  const { activeWorkspaceId, tasks, timeblocks } = useGeassStore();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Get the start of the current week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Generate the next 7 days starting from today
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      date,
      dateStr: date.toISOString().split("T")[0],
      dayName: DAY_NAMES[date.getDay()],
      isToday: date.toDateString() === today.toDateString(),
    };
  });

  const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId && t.dueDate);
  const workspaceTimeblocks = timeblocks.filter(tb => tb.workspaceId === activeWorkspaceId);

  // Group tasks and timeblocks by date
  const eventsByDate = weekDays.reduce((acc, day) => {
    const dayTasks = workspaceTasks.filter(t => t.dueDate?.startsWith(day.dateStr));
    const dayTimeblocks = workspaceTimeblocks.filter(tb => tb.date === day.dateStr);
    
    acc[day.dateStr] = [
      ...dayTasks.map(t => ({ ...t, type: 'task' })),
      ...dayTimeblocks.map(tb => ({ ...tb, type: 'timeblock' }))
    ];
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="bg-transparent backdrop-blur-sm border border-white/[0.06] rounded-2xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[12px] font-bold text-white">Calendar Preview</span>
        <Link href="/dashboard/calendar" className="text-[10px] text-[#EF5A6F] hover:text-[#ff8b98] font-semibold transition-colors">
          View full calendar
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08]">
        {weekDays.map((day) => {
          const dayEvents = eventsByDate[day.dateStr] || [];
          const displayDate = day.date.getDate();

          return (
            <div key={day.dateStr} className="space-y-1">
              <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${
                day.isToday ? 'bg-[#EF5A6F]/10' : 'bg-white/[0.02]'
              }`}>
                <span className={`text-[10px] font-bold w-8 ${
                  day.isToday ? 'text-[#EF5A6F]' : 'text-neutral-400'
                }`}>{day.dayName}</span>
                <span className={`text-[10px] font-mono ${
                  day.isToday ? 'text-white' : 'text-neutral-600'
                }`}>{displayDate}</span>
                {dayEvents.length > 0 && (
                  <span className="text-[8px] text-neutral-500 ml-auto">{dayEvents.length} events</span>
                )}
              </div>

              {dayEvents.slice(0, 2).map((ev) => {
                const color = ev.type === 'task' 
                  ? (PRIORITY_COLORS[ev.priority] || PRIORITY_COLORS.medium)
                  : ev.color || PRIORITY_COLORS.medium;
                const timeLabel = ev.type === 'timeblock'
                  ? `${ev.start} – ${ev.end}`
                  : (ev.createdAt
                    ? new Date(ev.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                    : "10:00 AM");

                return (
                  <div key={ev._id} className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer">
                    <span className="text-[9px] font-mono text-neutral-600 w-16 shrink-0">{timeLabel}</span>
                    <div className="w-0.5 self-stretch rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-white truncate">{ev.title}</p>
                      <p className="text-[8px] text-neutral-600 uppercase">{ev.tag || ev.type === 'timeblock' ? 'Schedule' : 'Task'}</p>
                    </div>
                  </div>
                );
              })}

              {dayEvents.length > 2 && (
                <div className="text-[9px] text-neutral-600 px-2 py-1">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          );
        })}

        {weekDays.every(day => !eventsByDate[day.dateStr]?.length) && (
          <div className="text-center py-10 text-neutral-700 text-[10px]">No events scheduled this week.</div>
        )}
      </div>
    </div>
  );
}
