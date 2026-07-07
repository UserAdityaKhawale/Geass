"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useGeassStore } from "@/store/useGeassStore";

const PRIORITY_COLORS: Record<string, string> = {
  high: "#EF5A6F",
  medium: "#f59e0b",
  low: "#22c55e",
};

export default function TodaysTasks() {
  const { activeWorkspaceId, tasks, addTask, updateTask } = useGeassStore();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showInput, setShowInput] = useState(false);

  // Filter tasks due today for active workspace
  const todayStr = new Date().toISOString().split("T")[0];
  const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId);
  const todaysTasksList = workspaceTasks.filter(t => t.dueDate?.startsWith(todayStr) || !t.dueDate); // Fallback: show undated if empty or due today

  const completed = todaysTasksList.filter(t => t.status === "done").length;
  const total = todaysTasksList.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const toggle = (id: string, currentStatus: string) => {
    updateTask(id, { status: currentStatus === "done" ? "todo" : "done" });
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !activeWorkspaceId) return;
    addTask({
      _id: `task-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      title: newTaskTitle,
      priority: "medium",
      status: "todo",
      dueDate: new Date().toISOString(),
      orderIndex: todaysTasksList.length,
    });
    setNewTaskTitle("");
    setShowInput(false);
  };

  return (
    <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[12px] font-bold text-white">Today&apos;s Tasks</span>
        <Link href="/dashboard/tasks" className="text-[10px] text-[#EF5A6F] hover:text-[#ff8b98] font-semibold transition-colors">
          View all
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-0.5 min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08]">
        {todaysTasksList.map(task => (
          <div
            key={task._id}
            onClick={() => toggle(task._id, task.status)}
            className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            {/* Checkbox */}
            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
              task.status === "done" ? "border-[#22c55e] bg-[#22c55e]" : "border-white/20 hover:border-white/40"
            }`}>
              {task.status === "done" && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`flex-1 text-[11px] font-semibold truncate ${task.status === "done" ? "line-through text-neutral-700" : "text-neutral-200"}`}>
              {task.title}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 uppercase"
              style={{ color: PRIORITY_COLORS[task.priority], backgroundColor: `${PRIORITY_COLORS[task.priority]}15` }}>
              {task.priority}
            </span>
          </div>
        ))}

        {todaysTasksList.length === 0 && (
          <div className="text-center py-6 text-neutral-700 text-[10px]">No tasks for today.</div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-white/[0.05] shrink-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] text-neutral-600">{completed} of {total} tasks completed</span>
          <span className="text-[10px] font-bold text-white">{pct}%</span>
        </div>
        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#EF5A6F] to-[#7C3AED] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {showInput ? (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddTask()}
              placeholder="Task name…"
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-2 py-1 text-[11px] text-white focus:outline-none focus:border-[#EF5A6F]/50"
            />
            <button
              onClick={handleAddTask}
              className="bg-[#EF5A6F] text-white font-bold text-[10px] px-3 py-1 rounded-xl hover:bg-[#d94a5f]"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="mt-2.5 flex items-center gap-2 text-[11px] text-neutral-600 hover:text-white transition-colors font-semibold"
          >
            <Plus size={13} />Add Task
          </button>
        )}
      </div>
    </div>
  );
}
