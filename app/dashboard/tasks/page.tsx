"use client";

import { useState } from "react";
import { useGeassStore, Task } from "@/store/useGeassStore";
import { Plus, CheckSquare, ListTodo, Star, Calendar, CheckCircle2, ChevronRight, Inbox, Clock } from "lucide-react";

type FilterType = "all" | "today" | "high" | "completed";

const PRIORITY_COLORS = {
  high: "#EF5A6F",
  medium: "#f59e0b",
  low: "#22c55e",
};

export default function TasksPage() {
  const { activeWorkspaceId, tasks, addTask, updateTask, deleteTask } = useGeassStore();
  const [filter, setFilter] = useState<FilterType>("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [sortBy, setSortBy] = useState<"date" | "priority">("priority");

  const todayStr = new Date().toISOString().split("T")[0];
  const workspaceTasks = tasks.filter((t) => t.workspaceId === activeWorkspaceId);

  // Apply filters
  const filteredTasks = workspaceTasks.filter((t) => {
    if (filter === "today") return t.dueDate?.startsWith(todayStr) && t.status !== "done";
    if (filter === "high") return t.priority === "high" && t.status !== "done";
    if (filter === "completed") return t.status === "done";
    return true; // "all"
  });

  // Apply sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = a.dueDate || "";
      const dateB = b.dueDate || "";
      return dateA.localeCompare(dateB);
    } else {
      const pLevel = { high: 3, medium: 2, low: 1 };
      return (pLevel[b.priority] || 0) - (pLevel[a.priority] || 0);
    }
  });

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !activeWorkspaceId) return;
    addTask({
      _id: `task-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      title: newTaskTitle,
      priority: newPriority,
      status: "todo",
      dueDate: new Date().toISOString(),
      orderIndex: workspaceTasks.length,
    });
    setNewTaskTitle("");
  };

  const counts = {
    all: workspaceTasks.length,
    today: workspaceTasks.filter((t) => t.dueDate?.startsWith(todayStr) && t.status !== "done").length,
    high: workspaceTasks.filter((t) => t.priority === "high" && t.status !== "done").length,
    completed: workspaceTasks.filter((t) => t.status === "done").length,
  };

  return (
    <div className="flex h-full bg-[#030303] min-h-0 overflow-hidden">
      {/* Smart Filters Sidebar */}
      <div className="w-[220px] shrink-0 border-r border-white/[0.05] bg-[#0a0a0c] p-4 flex flex-col gap-4">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-600 px-2 block mb-3">Smart Filters</span>
          <div className="space-y-1">
            {[
              { id: "all", label: "Inbox / All", icon: Inbox, count: counts.all },
              { id: "today", label: "Due Today", icon: Clock, count: counts.today },
              { id: "high", label: "High Priority", icon: Star, count: counts.high },
              { id: "completed", label: "Completed", icon: CheckCircle2, count: counts.completed },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as FilterType)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                  filter === f.id
                    ? "bg-[#EF5A6F]/10 text-[#EF5A6F] border border-[#EF5A6F]/15"
                    : "text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <f.icon size={13} />
                  <span>{f.label}</span>
                </div>
                <span className="text-[10px] text-neutral-600 font-mono bg-white/[0.05] px-1.5 py-0.5 rounded-md">
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-white/[0.05] pt-4">
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-700 px-2 block mb-2">Sorting</span>
          <div className="flex rounded-xl border border-white/[0.06] overflow-hidden">
            {(["priority", "date"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`flex-1 py-1.5 text-[9px] font-bold uppercase transition-colors ${
                  sortBy === s ? "bg-white/[0.08] text-white" : "text-neutral-600 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Unified Task List Main Pane */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#030303] p-6 space-y-4">
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-black text-white capitalize tracking-tight flex items-center gap-2">
            <ListTodo size={16} className="text-[#EF5A6F]" />
            {filter === "all" ? "Workspace Task Inbox" : `${filter} Tasks`}
          </h1>
          <span className="text-[10px] text-neutral-600 font-medium">Workspace tasks listing</span>
        </div>

        {/* Dynamic Inline quick-add input */}
        {filter !== "completed" && (
          <div className="flex gap-2 bg-[#0e0e10] border border-white/[0.07] rounded-xl p-2 items-center">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              placeholder="Add a new task to your list…"
              className="flex-1 bg-transparent text-[12px] text-white placeholder:text-neutral-700 outline-none px-2"
            />
            {/* Priority selection */}
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as Task["priority"])}
              className="bg-white/[0.04] border border-white/[0.08] text-neutral-400 text-[10px] font-bold py-1 px-2.5 rounded-lg outline-none cursor-pointer focus:border-[#EF5A6F]/30"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={handleAddTask}
              className="bg-[#EF5A6F] text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg hover:bg-[#d94a5f] transition-all flex items-center gap-1 shrink-0"
            >
              <Plus size={12} /> Add
            </button>
          </div>
        )}

        {/* Task list list view */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1.5 scrollbar-thin scrollbar-thumb-white/[0.08] min-h-0">
          {sortedTasks.map((t) => (
            <div
              key={t._id}
              className="flex items-center justify-between p-3 rounded-xl border border-white/[0.04] bg-[#0e0e10] hover:bg-white/[0.02] hover:border-white/[0.08] transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Complete checkbox */}
                <button
                  onClick={() => updateTask(t._id, { status: t.status === "done" ? "todo" : "done" })}
                  className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all ${
                    t.status === "done" ? "border-[#22c55e] bg-[#22c55e]" : "border-white/20 hover:border-white/40"
                  }`}
                >
                  {t.status === "done" && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="min-w-0">
                  <p className={`text-[12px] font-semibold truncate ${t.status === "done" ? "line-through text-neutral-700" : "text-neutral-200"}`}>
                    {t.title}
                  </p>
                  {t.dueDate && (
                    <div className="flex items-center gap-1.5 text-[9px] text-neutral-600 font-mono mt-0.5">
                      <Calendar size={9} />
                      Due: {t.dueDate.split("T")[0]}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Priority pill */}
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase"
                  style={{ color: PRIORITY_COLORS[t.priority], backgroundColor: `${PRIORITY_COLORS[t.priority]}15` }}
                >
                  {t.priority}
                </span>

                {/* Delete button */}
                <button
                  onClick={() => deleteTask(t._id)}
                  className="opacity-0 group-hover:opacity-100 text-neutral-700 hover:text-[#EF5A6F] p-1 rounded-lg hover:bg-[#EF5A6F]/10 transition-all"
                >
                  <CheckSquare size={12} className="rotate-45" />
                </button>
              </div>
            </div>
          ))}

          {sortedTasks.length === 0 && (
            <div className="text-center py-16 text-neutral-700 text-[11px]">No tasks found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
