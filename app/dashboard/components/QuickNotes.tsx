"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MoreHorizontal } from "lucide-react";
import { useGeassStore } from "@/store/useGeassStore";

export default function QuickNotes() {
  const { activeWorkspaceId, notes, addNote, updateNote } = useGeassStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  const workspaceNotes = notes.filter((n) => n.workspaceId === activeWorkspaceId);
  const visibleNotes = workspaceNotes.slice(0, 4);

  const handleAddNote = () => {
    if (!activeWorkspaceId) return;
    const newId = `note-${Date.now()}`;
    addNote({
      _id: newId,
      workspaceId: activeWorkspaceId,
      title: "",
      pinned: false,
      color: "#f59e0b",
      tags: [],
      snippet: "",
      content: "",
    });
    setEditingId(newId);
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
          <button onClick={handleAddNote} className="text-[#f59e0b]/50 hover:text-[#f59e0b] transition-colors">
            <Plus size={14} />
          </button>
          <button className="text-[#f59e0b]/30 hover:text-[#f59e0b]/70 transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0 scrollbar-thin scrollbar-thumb-[#f59e0b]/10">
        {visibleNotes.map((note) => (
          <div key={note._id} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]/40 mt-1.5 shrink-0" />
            {editingId === note._id ? (
              <input
                autoFocus
                className="flex-1 text-[11px] text-[#fde68a] bg-transparent border-none outline-none"
                value={note.title}
                onChange={e => updateNote(note._id, { title: e.target.value })}
                onBlur={() => setEditingId(null)}
                onKeyDown={e => e.key === "Enter" && setEditingId(null)}
              />
            ) : (
              <span
                onClick={() => setEditingId(note._id)}
                className="flex-1 text-[11px] text-[#fde68a] leading-relaxed cursor-text truncate"
              >
                {note.title || <span className="text-[#f59e0b]/30 italic">Empty note…</span>}
              </span>
            )}
          </div>
        ))}

        {visibleNotes.length === 0 && (
          <div className="text-center py-6 text-[#f59e0b]/30 text-[10px] italic">No notes created yet.</div>
        )}
      </div>

      <p className="text-[9px] text-[#f59e0b]/25 font-mono shrink-0">
        {dateStr} · {timeStr}
      </p>
    </div>
  );
}
