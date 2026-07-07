"use client";

import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import KanbanCard, { Task } from "./KanbanCard";

interface Column {
  id: string;
  label: string;
  dotColor: string;
  tasks: Task[];
}

const INITIAL_COLUMNS: Column[] = [
  {
    id: "todo",
    label: "To Do",
    dotColor: "#6b7280",
    tasks: [
      { id: "t1",  title: "Create landing page design",         priority: "High",   due: "May 12", tag: "Design" },
      { id: "t2",  title: "Implement authentication flow",       priority: "Medium", due: "May 14", tag: "Dev" },
      { id: "t3",  title: "Database schema design",             priority: "High",   due: "May 16", tag: "Dev" },
      { id: "t4",  title: "Setup CI/CD pipeline",               priority: "Low",    due: "May 20" },
      { id: "t5",  title: "Write unit tests",                   priority: "Low",    due: "May 22" },
      { id: "t6",  title: "Create API documentation",           priority: "Medium", due: "May 25", tag: "Docs" },
      { id: "t7",  title: "Fix UI responsiveness issues",       priority: "Low",    due: "May 28" },
      { id: "t8",  title: "Research performance optimization",  priority: "Medium", due: "May 30" },
    ],
  },
  {
    id: "inprogress",
    label: "In Progress",
    dotColor: "#EF5A6F",
    tasks: [
      { id: "p1", title: "Redesign dashboard UI",              priority: "High",   due: "May 18", progress: 70, tag: "Design" },
      { id: "p2", title: "Build task management module",       priority: "High",   due: "May 20", progress: 50 },
      { id: "p3", title: "Integrate AI Copilot",               priority: "Medium", due: "May 22", progress: 30, tag: "AI" },
      { id: "p4", title: "Implement real-time notifications",  priority: "Medium", due: "May 24", progress: 60 },
      { id: "p5", title: "Setup analytics tracking",           priority: "Low",    due: "May 26", progress: 40 },
      { id: "p6", title: "Optimize database queries",          priority: "Low",    due: "May 28", progress: 20 },
    ],
  },
  {
    id: "done",
    label: "Done",
    dotColor: "#22c55e",
    tasks: [
      { id: "d1",  title: "Project initial setup",             priority: "High" },
      { id: "d2",  title: "Requirements gathering",            priority: "Medium" },
      { id: "d3",  title: "Wireframe design",                  priority: "High" },
      { id: "d4",  title: "User flow mapping",                 priority: "Medium" },
      { id: "d5",  title: "Create style guide",                priority: "Low" },
      { id: "d6",  title: "Setup development environment",     priority: "High" },
      { id: "d7",  title: "Implement dark mode",               priority: "Medium" },
      { id: "d8",  title: "Create logo and branding",          priority: "Low" },
      { id: "d9",  title: "Basic routing setup",               priority: "Medium" },
      { id: "d10", title: "Sidebar navigation",                priority: "Low" },
    ],
  },
  {
    id: "backlog",
    label: "Backlog",
    dotColor: "#6b7280",
    tasks: [
      { id: "b1", title: "Mobile app development",    priority: "High" },
      { id: "b2", title: "Browser extension",         priority: "Medium" },
      { id: "b3", title: "Advanced analytics",        priority: "Medium" },
      { id: "b4", title: "Multi-language support",    priority: "Low" },
    ],
  },
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const addTask = (colId: string) => {
    setColumns(cols =>
      cols.map(col =>
        col.id === colId
          ? {
              ...col,
              tasks: [
                ...col.tasks,
                {
                  id: `new-${Date.now()}`,
                  title: "New Task",
                  priority: "Medium",
                } as Task,
              ],
            }
          : col
      )
    );
  };

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-2 px-6 pt-4 min-w-0">
      {columns.map(col => (
        <div
          key={col.id}
          onDragOver={e => { e.preventDefault(); setDragOverId(col.id); }}
          onDragLeave={() => setDragOverId(null)}
          onDrop={() => setDragOverId(null)}
          className={`flex flex-col shrink-0 w-[240px] rounded-2xl border transition-all duration-200 ${
            dragOverId === col.id
              ? "border-[#EF5A6F]/30 bg-[#EF5A6F]/[0.03]"
              : "border-white/[0.06] bg-[#0e0e10]"
          }`}
        >
          {/* Column header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.dotColor }} />
              <span className="text-[12px] font-bold text-white">{col.label}</span>
              <span className="text-[10px] text-neutral-600 font-mono bg-white/[0.05] px-1.5 py-0.5 rounded-md">
                {col.tasks.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => addTask(col.id)}
                className="text-neutral-700 hover:text-white transition-colors p-0.5 rounded hover:bg-white/[0.06]"
              >
                <Plus size={13} />
              </button>
              <button className="text-neutral-700 hover:text-white transition-colors p-0.5 rounded hover:bg-white/[0.06]">
                <MoreHorizontal size={13} />
              </button>
            </div>
          </div>

          {/* Task list */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2.5 min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08] scrollbar-track-transparent">
            {col.tasks.map((task, i) => (
              <div key={task.id} draggable className="cursor-grab active:cursor-grabbing">
                <KanbanCard
                  task={task}
                  index={i}
                  showProgress={col.id === "inprogress"}
                />
              </div>
            ))}
          </div>

          {/* Add task button */}
          <button
            onClick={() => addTask(col.id)}
            className="mx-3 mb-3 flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-white/[0.08] text-[11px] text-neutral-700 hover:text-neutral-400 hover:border-white/[0.14] transition-all shrink-0"
          >
            <Plus size={11} />
            Add Task
          </button>
        </div>
      ))}
    </div>
  );
}
