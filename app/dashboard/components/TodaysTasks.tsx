"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Check, X, ChevronDown } from "lucide-react";
import { useGeassStore, Task } from "@/store/useGeassStore";
import { getTodaysTasks } from "@/lib/taskFilters";

const PRIORITY_COLORS: Record<string, string> = {
  high: "#EF5A6F",
  medium: "#f59e0b",
  low: "#22c55e",
};

function TaskRow({ task }: { task: Task }) {
  const { updateTask, deleteTask } = useGeassStore();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const commitEdit = () => {
    if (editTitle.trim()) updateTask(task._id, { title: editTitle.trim() });
    else setEditTitle(task.title);
    setEditing(false);
  };

  const cyclePriority = (e: React.MouseEvent) => {
    e.stopPropagation();
    const order: Task["priority"][] = ["low", "medium", "high"];
    const next = order[(order.indexOf(task.priority) + 1) % order.length];
    updateTask(task._id, { priority: next });
  };

  return (
    <div className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-white/[0.03] transition-colors group">
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

      {/* Title */}
      {editing ? (
        <input
          ref={inputRef}
          autoFocus
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") { setEditTitle(task.title); setEditing(false); }}}
          onBlur={commitEdit}
          className="flex-1 bg-white/[0.05] border border-[#EF5A6F]/40 rounded-lg px-2 py-0.5 text-[11px] text-white focus:outline-none"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={`flex-1 text-[11px] font-semibold truncate cursor-text ${
            task.status === "done" ? "line-through text-neutral-700" : "text-neutral-200"
          }`}
          title="Double-click to edit"
        >
          {task.title}
        </span>
      )}

      {/* Priority pill — clickable to cycle */}
      <button
        onClick={cyclePriority}
        title="Click to change priority"
        className="text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 uppercase transition-all hover:scale-105 active:scale-95"
        style={{ color: PRIORITY_COLORS[task.priority], backgroundColor: `${PRIORITY_COLORS[task.priority]}18` }}
      >
        {task.priority}
      </button>

      {/* Edit / Delete — appear on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {editing ? (
          <>
            <button onClick={commitEdit} className="text-[#22c55e] hover:bg-[#22c55e]/10 p-1 rounded-lg"><Check size={11} /></button>
            <button onClick={() => { setEditTitle(task.title); setEditing(false); }} className="text-neutral-500 hover:bg-white/[0.05] p-1 rounded-lg"><X size={11} /></button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} className="text-neutral-600 hover:text-white hover:bg-white/[0.06] p-1 rounded-lg"><Pencil size={11} /></button>
            <button onClick={() => deleteTask(task._id)} className="text-neutral-600 hover:text-[#EF5A6F] hover:bg-[#EF5A6F]/10 p-1 rounded-lg"><Trash2 size={11} /></button>
          </>
        )}
      </div>
    </div>
  );
}

export default function TodaysTasks() {
  const { activeWorkspaceId, tasks, addTask } = useGeassStore();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [showInput, setShowInput] = useState(false);

  const todaysTasksList = getTodaysTasks(tasks, activeWorkspaceId);

  const completed = todaysTasksList.filter(t => t.status === "done").length;
  const total = todaysTasksList.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !activeWorkspaceId) return;
    addTask({
      _id: `task-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      title: newTaskTitle,
      priority: newPriority,
      status: "todo",
      dueDate: new Date().toISOString(),
      orderIndex: todaysTasksList.length,
    });
    setNewTaskTitle("");
    setShowInput(false);
  };

  return (
    <div className="bg-transparent backdrop-blur-sm border border-white/[0.06] rounded-2xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[12px] font-bold text-white">Today&apos;s Tasks</span>
        <Link href="/dashboard/tasks" className="text-[10px] text-[#EF5A6F] hover:text-[#ff8b98] font-semibold transition-colors">
          View all
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-0.5 min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08]">
        {todaysTasksList.map(task => (
          <TaskRow key={task._id} task={task} />
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
          <div className="mt-2 flex gap-2 items-center">
            <input
              type="text"
              autoFocus
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddTask()}
              placeholder="Task name…"
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-2 py-1 text-[11px] text-white focus:outline-none focus:border-[#EF5A6F]/50"
            />
            <select
              value={newPriority}
              onChange={e => setNewPriority(e.target.value as Task["priority"])}
              className="bg-white/[0.04] border border-white/[0.08] text-neutral-400 text-[10px] font-bold py-1 px-2 rounded-lg outline-none cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Med</option>
              <option value="high">High</option>
            </select>
            <button onClick={handleAddTask} className="bg-[#EF5A6F] text-white font-bold text-[10px] px-3 py-1 rounded-xl hover:bg-[#d94a5f]">
              Add
            </button>
            <button onClick={() => setShowInput(false)} className="text-neutral-600 hover:text-white p-1 rounded-lg">
              <X size={11} />
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
