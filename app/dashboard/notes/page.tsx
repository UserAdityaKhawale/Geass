"use client";

import { useState, useCallback } from "react";
import NotesSidebar from "./components/NotesSidebar";
import NoteEditor from "./components/NoteEditor";
import type { Note } from "./components/NoteCard";
import { FileText } from "lucide-react";

const INITIAL_NOTES: Note[] = [
  {
    id: "1", title: "Review UI/UX of Dashboard", pinned: true, color: "#f59e0b",
    tags: ["Design", "UI"],
    snippet: "The dashboard needs a better visual hierarchy. Consider adding more whitespace and clearer section dividers...",
    content: "<h1>Review UI/UX of Dashboard</h1><p>The dashboard needs a better visual hierarchy. Consider adding more whitespace and clearer section dividers.</p><ul><li>Improve spacing between widgets</li><li>Add subtle animations on hover</li><li>Review color contrast ratios</li></ul>",
    updatedAt: "2m ago",
  },
  {
    id: "2", title: "Implement Focus Mode", pinned: true, color: "#EF5A6F",
    tags: ["Dev"],
    snippet: "Focus mode should hide all distractions and show only the current task with a Pomodoro timer...",
    content: "<h1>Implement Focus Mode</h1><p>Focus mode should hide all distractions and show only the current task with a Pomodoro timer.</p><h2>Requirements</h2><ul><li>Full-screen overlay</li><li>Ambient sound player</li><li>Task-specific timer</li></ul>",
    updatedAt: "1h ago",
  },
  {
    id: "3", title: "Add Capacity Planner (Beta)", pinned: false, color: "#7C3AED",
    tags: ["Ideas", "Dev"],
    snippet: "A capacity planner that shows how much work is assigned vs available hours per week...",
    content: "<h1>Add Capacity Planner (Beta)</h1><p>A capacity planner that shows how much work is assigned vs available hours per week.</p>",
    updatedAt: "3h ago",
  },
  {
    id: "4", title: "Write Blog About Geass", pinned: false, color: "#22c55e",
    tags: ["Research", "Ideas"],
    snippet: "Write a detailed blog post about the development journey of Geass and lessons learned...",
    content: "<h1>Write Blog About Geass</h1><p>Write a detailed blog post about the development journey of Geass and lessons learned.</p>",
    updatedAt: "Yesterday",
  },
  {
    id: "5", title: "API Documentation Notes", pinned: false, color: "#3b82f6",
    tags: ["Dev"],
    snippet: "Key endpoints to document: /api/tasks, /api/projects, /api/notes, /api/calendar...",
    content: "<h1>API Documentation Notes</h1><p>Key endpoints to document:</p><ul><li>/api/tasks</li><li>/api/projects</li><li>/api/notes</li><li>/api/calendar</li></ul>",
    updatedAt: "2d ago",
  },
  {
    id: "6", title: "Personal Goals Q3 2025", pinned: false, color: "#ec4899",
    tags: ["Personal"],
    snippet: "1. Launch Geass publicly. 2. Get 100 beta users. 3. Write 10 blog posts...",
    content: "<h1>Personal Goals Q3 2025</h1><ol><li>Launch Geass publicly</li><li>Get 100 beta users</li><li>Write 10 blog posts</li></ol>",
    updatedAt: "3d ago",
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selectedId, setSelectedId] = useState(INITIAL_NOTES[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedNote = notes.find(n => n.id === selectedId);

  const updateNote = useCallback((id: string, changes: Partial<Note>) => {
    setNotes(ns => ns.map(n => n.id === id ? { ...n, ...changes, updatedAt: "Just now" } : n));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(ns => ns.filter(n => n.id !== id));
    setSelectedId(notes.find(n => n.id !== id)?.id ?? "");
  }, [notes]);

  const pinNote = useCallback((id: string) => {
    setNotes(ns => ns.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  }, []);

  const newNote = useCallback(() => {
    const id = `note-${Date.now()}`;
    const note: Note = {
      id, title: "Untitled Note", pinned: false,
      color: "#f59e0b", tags: [], snippet: "", content: "", updatedAt: "Just now",
    };
    setNotes(ns => [note, ...ns]);
    setSelectedId(id);
  }, []);

  return (
    <div className="flex h-full bg-[#030303] min-h-0 overflow-hidden">
      {/* Left sidebar */}
      <NotesSidebar
        notes={notes}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onPin={pinNote}
        onNew={newNote}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      {/* Editor / empty state */}
      {selectedNote ? (
        <NoteEditor
          note={selectedNote}
          onUpdate={updateNote}
          onDelete={deleteNote}
          onPin={pinNote}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center">
            <FileText size={28} className="text-[#f59e0b]/40" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-neutral-400">No note selected</p>
            <p className="text-[12px] text-neutral-700 mt-1">Select a note from the sidebar or create a new one</p>
          </div>
          <button
            onClick={newNote}
            className="px-4 py-2 bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-[12px] font-bold rounded-xl hover:bg-[#f59e0b]/20 transition-all"
          >
            + New Note
          </button>
        </div>
      )}
    </div>
  );
}
