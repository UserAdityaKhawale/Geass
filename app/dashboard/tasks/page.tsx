"use client";

import { useState, useRef } from "react";
import { useGeassStore, Task } from "@/store/useGeassStore";
import {
  Plus, CheckSquare, Star, Calendar, CheckCircle2,
  Inbox, Clock, Pencil, Trash2, Check, X, ChevronDown
} from "lucide-react";

type FilterType = "all" | "today" | "high" | "completed";

const PRIORITY_COLORS: Record<string, string> = {
  high: "#EF5A6F",
  medium: "#f59e0b",
  low: "#22c55e",
};

const PRIORITY_ORDER: Task["priority"][] = ["low", "medium", "high"];

function EditableTaskRow({ task }: { task: Task }) {
  const { updateTask, deleteTask } = useGeassStore();
  const [editing, setEditing]     = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDue, setEditDue]     = useState(task.dueDate?.split("T")[0] ?? "");
  const [confirm, setConfirm]     = useState(false);

  const commit = () => {
    const trimmed = editTitle.trim();
    updateTask(task._id, {
      title: trimmed || task.title,
      ...(editDue ? { dueDate: new Date(editDue).toISOString() } : {}),
    });
    setEditing(false);
  };

  const cyclePriority = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = PRIORITY_ORDER[(PRIORITY_ORDER.indexOf(task.priority) + 1) % PRIORITY_ORDER.length];
    updateTask(task._id, { priority: next });
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${
      editing
        ? "border-[#EF5A6F]/30 bg-[#0e0e10]"
        : "border-white/[0.04] bg-[#0e0e10] hover:bg-white/[0.02] hover:border-white/[0.08]"
    }`}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Checkbox */}
        <button
          onClick={() => updateTask(task._id, { status: task.status === "done" ? "todo" : "done" })}
          className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
            task.status === "done" ? "border-[#22c55e] bg-[#22c55e]" : "border-white/20 hover:border-white/40"
          }`}
        >
          {task.status === "done" && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="space-y-1.5">
              <input
                autoFocus
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
                className="w-full bg-white/[0.05] border border-[#EF5A6F]/40 rounded-lg px-2 py-1 text-[12px] text-white focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-neutral-600 font-mono">Due:</span>
                <input
                  type="date"
                  value={editDue}
                  onChange={e => setEditDue(e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-0.5 text-[9px] text-neutral-300 focus:outline-none focus:border-[#EF5A6F]/40 [color-scheme:dark]"
                />
              </div>
            </div>
          ) : (
            <>
              <p
                onDoubleClick={() => setEditing(true)}
                className={`text-[12px] font-semibold truncate cursor-text ${
                  task.status === "done" ? "line-through text-neutral-700" : "text-neutral-200"
                }`}
                title="Double-click to edit"
              >
                {task.title}
              </p>
              {task.dueDate && (
                <div className="flex items-center gap-1.5 text-[9px] text-neutral-600 font-mono mt-0.5">
                  <Calendar size={9} />
                  Due: {task.dueDate.split("T")[0]}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        {/* Priority pill — click to cycle */}
        <button
          onClick={cyclePriority}
          title="Click to change priority"
          className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase transition-all hover:scale-105 active:scale-95"
          style={{ color: PRIORITY_COLORS[task.priority], backgroundColor: `${PRIORITY_COLORS[task.priority]}18` }}
        >
          {task.priority}
        </button>

        {/* Edit / confirm / cancel / delete */}
        {editing ? (
          <div className="flex items-center gap-1">
            <button onClick={commit} className="text-[#22c55e] hover:bg-[#22c55e]/10 p-1.5 rounded-lg transition-all" title="Save">
              <Check size={12} />
            </button>
            <button onClick={() => setEditing(false)} className="text-neutral-500 hover:bg-white/[0.06] p-1.5 rounded-lg transition-all" title="Cancel">
              <X size={12} />
            </button>
          </div>
        ) : confirm ? (
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-[#EF5A6F] font-mono mr-1">Delete?</span>
            <button onClick={() => deleteTask(task._id)} className="text-[#EF5A6F] hover:bg-[#EF5A6F]/10 p-1.5 rounded-lg transition-all">
              <Check size={12} />
            </button>
            <button onClick={() => setConfirm(false)} className="text-neutral-500 hover:bg-white/[0.06] p-1.5 rounded-lg transition-all">
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
              className="text-neutral-600 hover:text-white hover:bg-white/[0.06] p-1.5 rounded-lg transition-all"
              title="Edit task"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={() => setConfirm(true)}
              className="text-neutral-600 hover:text-[#EF5A6F] hover:bg-[#EF5A6F]/10 p-1.5 rounded-lg transition-all"
              title="Delete task"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const { activeWorkspaceId, tasks, addTask } = useGeassStore();
  const [filter, setFilter]         = useState<FilterType>("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newPriority, setNewPriority]   = useState<Task["priority"]>("medium");
  const [newDueDate, setNewDueDate]     = useState(new Date().toISOString().split("T")[0]);
  const [sortBy, setSortBy]             = useState<"date" | "priority">("priority");

  const todayStr = new Date().toISOString().split("T")[0];
  const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId);

  const filteredTasks = workspaceTasks.filter(t => {
    if (filter === "today")     return t.dueDate?.startsWith(todayStr) && t.status !== "done";
    if (filter === "high")      return t.priority === "high" && t.status !== "done";
    if (filter === "completed") return t.status === "done";
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "date") return (a.dueDate || "").localeCompare(b.dueDate || "");
    const pLevel = { high: 3, medium: 2, low: 1 };
    return (pLevel[b.priority] || 0) - (pLevel[a.priority] || 0);
  });

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !activeWorkspaceId) return;
    addTask({
      _id: `task-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      title: newTaskTitle,
      priority: newPriority,
      status: "todo",
      dueDate: new Date(newDueDate).toISOString(),
      orderIndex: workspaceTasks.length,
    });
    setNewTaskTitle("");
  };

  const counts = {
    all:       workspaceTasks.length,
    today:     workspaceTasks.filter(t => t.dueDate?.startsWith(todayStr) && t.status !== "done").length,
    high:      workspaceTasks.filter(t => t.priority === "high" && t.status !== "done").length,
    completed: workspaceTasks.filter(t => t.status === "done").length,
  };

  return (
    <div className="flex h-full bg-[#030303] min-h-0 overflow-hidden">
      {/* Smart Filters Sidebar */}
      <div className="w-[220px] shrink-0 border-r border-white/[0.05] bg-[#0a0a0c] p-4 flex flex-col gap-4">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-600 px-2 block mb-3">Smart Filters</span>
          <div className="space-y-1">
            {([
              { id: "all",       label: "Inbox / All",   icon: Inbox,        count: counts.all },
              { id: "today",     label: "Due Today",     icon: Clock,        count: counts.today },
              { id: "high",      label: "High Priority", icon: Star,         count: counts.high },
              { id: "completed", label: "Completed",     icon: CheckCircle2, count: counts.completed },
            ] as const).map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
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
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-700 px-2 block mb-2">Sort By</span>
          <div className="flex rounded-xl border border-white/[0.06] overflow-hidden">
            {(["priority", "date"] as const).map(s => (
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

      {/* Main Task Pane */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#030303] p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <h1 className="text-[18px] font-black text-white capitalize tracking-tight flex items-center gap-2">
            <CheckSquare size={16} className="text-[#EF5A6F]" />
            {filter === "all" ? "Workspace Task Inbox" : `${filter === "today" ? "Due Today" : filter === "high" ? "High Priority" : "Completed"} Tasks`}
          </h1>
          <span className="text-[10px] text-neutral-600">{sortedTasks.length} tasks</span>
        </div>

        {/* Quick Add */}
        {filter !== "completed" && (
          <div className="flex gap-2 bg-[#0e0e10] border border-white/[0.07] rounded-xl p-2 items-center shrink-0">
            <input
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddTask()}
              placeholder="Add a new task…  (Press Enter)"
              className="flex-1 bg-transparent text-[12px] text-white placeholder:text-neutral-700 outline-none px-2"
            />
            {/* Priority selector */}
            <select
              value={newPriority}
              onChange={e => setNewPriority(e.target.value as Task["priority"])}
              className="bg-white/[0.04] border border-white/[0.08] text-neutral-400 text-[10px] font-bold py-1 px-2.5 rounded-lg outline-none cursor-pointer focus:border-[#EF5A6F]/30"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {/* Due date */}
            <input
              type="date"
              value={newDueDate}
              onChange={e => setNewDueDate(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] text-neutral-400 text-[10px] py-1 px-2 rounded-lg outline-none cursor-pointer focus:border-[#EF5A6F]/30 [color-scheme:dark]"
            />
            <button
              onClick={handleAddTask}
              className="bg-[#EF5A6F] text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg hover:bg-[#d94a5f] transition-all flex items-center gap-1 shrink-0 active:scale-95"
            >
              <Plus size={12} /> Add
            </button>
          </div>
        )}

        {/* Hint */}
        <p className="text-[9px] text-neutral-700 font-mono shrink-0">
          💡 Double-click task name to edit • Click priority badge to cycle • Hover to reveal edit/delete
        </p>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1.5 min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08]">
          {sortedTasks.map(t => (
            <EditableTaskRow key={t._id} task={t} />
          ))}
          {sortedTasks.length === 0 && (
            <div className="text-center py-16 text-neutral-700 text-[11px]">
              {filter === "completed" ? "Nothing completed yet. Keep going!" : "No tasks found. Add one above ↑"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
