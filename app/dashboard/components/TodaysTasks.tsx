"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

const INIT = [
  { id: 1, title: "Build Geass Dashboard UI",   priority: "High",   time: "08:00 AM", done: false },
  { id: 2, title: "Integrate Local Storage",    priority: "Medium", time: "11:00 AM", done: false },
  { id: 3, title: "Study DBMS",                 priority: "High",   time: "01:00 PM", done: false },
  { id: 4, title: "Workout",                    priority: "Medium", time: "05:30 PM", done: false },
  { id: 5, title: "Read 10 Pages",              priority: "Low",    time: "08:00 PM", done: false },
];

const PC: Record<string, string> = { High: "#EF5A6F", Medium: "#f59e0b", Low: "#22c55e" };

export default function TodaysTasks() {
  const [tasks, setTasks] = useState(INIT);
  const toggle = (id: number) => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const done  = tasks.filter(t => t.done).length;
  const pct   = Math.round((done / tasks.length) * 100);

  return (
    <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[12px] font-bold text-white">Today&apos;s Tasks</span>
        <Link href="/dashboard/tasks" className="text-[10px] text-[#EF5A6F] hover:text-[#ff8b98] font-semibold transition-colors">
          View all
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-0.5 min-h-0">
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => toggle(task.id)}
            className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            {/* Checkbox */}
            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${task.done ? "border-[#22c55e] bg-[#22c55e]" : "border-white/20 hover:border-white/40"}`}>
              {task.done && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`flex-1 text-[11px] font-semibold truncate ${task.done ? "line-through text-neutral-700" : "text-neutral-200"}`}>
              {task.title}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0"
              style={{ color: PC[task.priority], backgroundColor: `${PC[task.priority]}15` }}>
              {task.priority}
            </span>
            <span className="text-[9px] text-neutral-700 font-mono shrink-0 hidden xl:block">{task.time}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-white/[0.05] shrink-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] text-neutral-600">{done} of {tasks.length} tasks completed</span>
          <span className="text-[10px] font-bold text-white">{pct}%</span>
        </div>
        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#EF5A6F] to-[#7C3AED] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <button className="mt-2.5 flex items-center gap-2 text-[11px] text-neutral-600 hover:text-white transition-colors font-semibold">
          <Plus size={13} />Add Task
        </button>
      </div>
    </div>
  );
}
