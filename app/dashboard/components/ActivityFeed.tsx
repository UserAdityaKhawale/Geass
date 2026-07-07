"use client";

import Link from "next/link";
import { useGeassStore } from "@/store/useGeassStore";

const TYPE_CONFIG = {
  task:    { emoji: "✅", color: "#22c55e" },
  project: { emoji: "📁", color: "#3b82f6" },
  focus:   { emoji: "⏱",  color: "#7C3AED" },
  system:  { emoji: "⚙️",  color: "#f59e0b" },
};

export default function ActivityFeed() {
  const { activityLog } = useGeassStore();

  const getRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Just now";
    }
  };

  return (
    <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-white">Activity Log</span>
        <Link href="/dashboard/analytics" className="text-[10px] text-[#EF5A6F] hover:text-[#ff8b98] font-semibold transition-colors">
          View all
        </Link>
      </div>

      <div className="space-y-0.5 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/[0.08]">
        {activityLog.slice(0, 5).map((item) => {
          const config = TYPE_CONFIG[item.type] || { emoji: "📝", color: "#EF5A6F" };
          return (
            <div key={item.id} className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-white/[0.03] transition-colors">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center text-[12px] shrink-0"
                style={{ backgroundColor: `${config.color}15` }}
              >
                {config.emoji}
              </div>
              <span className="flex-1 text-[11px] text-neutral-300 font-medium leading-tight">
                <span className="capitalize text-neutral-500 font-semibold">{item.action}</span> &ldquo;{item.subject}&rdquo;
              </span>
              <span className="text-[9px] text-neutral-700 font-mono shrink-0 whitespace-nowrap">
                {getRelativeTime(item.timestamp)}
              </span>
            </div>
          );
        })}

        {activityLog.length === 0 && (
          <div className="text-center py-8 text-neutral-700 text-[10px]">No recent activity.</div>
        )}
      </div>
    </div>
  );
}
