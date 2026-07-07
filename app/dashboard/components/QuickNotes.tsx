"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MoreHorizontal } from "lucide-react";

const INIT = [
  "Review UI/UX of dashboard",
  "Implement focus mode",
  "Add capacity planner (Beta)",
  "Write blog about Geass",
];

export default function QuickNotes() {
  const [notes, setNotes] = useState(INIT);
  const [editing, setEditing] = useState<number | null>(null);

  const addNote = () => {
    setNotes(n => [...n, ""]);
    setEditing(notes.length);
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-[#161200] border border-[#f59e0b]/12 rounded-2xl p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between shrink-0">
        <span className="text-[12px] font-bold text-[#fbbf24]">📝 Quick Notes</span>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/notes" className="text-[10px] text-[#f59e0b]/60 hover:text-[#f59e0b] font-semibold transition-colors">
            Open Notes
          </Link>
          <button onClick={addNote} className="text-[#f59e0b]/50 hover:text-[#f59e0b] transition-colors">
            <Plus size={14} />
          </button>
          <button className="text-[#f59e0b]/30 hover:text-[#f59e0b]/70 transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {notes.map((note, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]/40 mt-1.5 shrink-0" />
            {editing === i ? (
              <input
                autoFocus
                className="flex-1 text-[11px] text-[#fde68a] bg-transparent border-none outline-none"
                value={note}
                onChange={e => setNotes(n => n.map((x, j) => j === i ? e.target.value : x))}
                onBlur={() => setEditing(null)}
              />
            ) : (
              <span
                onClick={() => setEditing(i)}
                className="flex-1 text-[11px] text-[#fde68a] leading-relaxed cursor-text"
              >
                {note || <span className="text-[#f59e0b]/30 italic">Empty note…</span>}
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="text-[9px] text-[#f59e0b]/25 font-mono shrink-0">
        {dateStr} · {timeStr}
      </p>
    </div>
  );
}
