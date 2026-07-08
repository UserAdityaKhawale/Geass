"use client";

import { useEffect, useState } from "react";
import { useGeassStore } from "@/store/useGeassStore";
import { AlertCircle, Calendar, Sparkles, Timer } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
}

interface Props {
  onClose: () => void;
}

export default function NotificationDropdown({ onClose }: Props) {
  const { tasks, activeWorkspaceId, focusSessions } = useGeassStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId && t.status !== "done");
  const overdueTaskName = workspaceTasks.length > 0 ? workspaceTasks[0].title : "Your Tasks";

  // Generate nudges based on activity
  useEffect(() => {
    const newNotifications: Notification[] = [
      {
        id: "1",
        title: "Daily Review",
        desc: "Plan your capacity and timeblocks for today.",
        icon: Calendar,
        color: "#7C3AED",
      },
    ];

    // Check for overdue tasks
    if (workspaceTasks.length > 0) {
      newNotifications.push({
        id: "2",
        title: "Pending Tasks",
        desc: `"${overdueTaskName}" and ${workspaceTasks.length - 1} others need attention.`,
        icon: AlertCircle,
        color: "#EF5A6F",
      });
    }

    // Check focus sessions
    const today = new Date().toDateString();
    const sessionsToday = focusSessions.filter(
      s => new Date(s.completedAt).toDateString() === today
    );

    if (sessionsToday.length < 2) {
      newNotifications.push({
        id: "3",
        title: "Momentum Dropping",
        desc: "Start a 25-minute focus session to keep your streak going.",
        icon: Timer,
        color: "#f59e0b",
      });
    }

    if (sessionsToday.length > 0) {
      newNotifications.push({
        id: "4",
        title: "Great Focus!",
        desc: `You've completed ${sessionsToday.length} focus session${sessionsToday.length > 1 ? "s" : ""} today. Keep it up!`,
        icon: Sparkles,
        color: "#22c55e",
      });
    }

    setNotifications(newNotifications);
  }, [tasks, activeWorkspaceId, focusSessions, overdueTaskName]);

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-[#0e0e10] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/80 z-50 p-4 space-y-3 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider">Execution Center</span>
        <button onClick={onClose} className="text-[9px] font-mono text-neutral-600 hover:text-white uppercase transition-colors">
          Dismiss all
        </button>
      </div>

      {/* Notifications list */}
      <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/[0.06]">
        {notifications.map(n => (
          <div
            key={n.id}
            className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] transition-all"
          >
            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${n.color}15` }}>
              <n.icon size={12} style={{ color: n.color }} />
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-[11px] font-bold text-white leading-tight">{n.title}</p>
              <p className="text-[9.5px] text-neutral-500 leading-snug">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
