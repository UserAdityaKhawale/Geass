"use client";

import { useState, useCallback, useEffect } from "react";
import { useGeassStore } from "@/store/useGeassStore";
import NotesSidebar from "./components/NotesSidebar";
import NoteEditor from "./components/NoteEditor";
import { FileText } from "lucide-react";

export default function NotesPage() {
  const { activeWorkspaceId, notes, addNote, updateNote, deleteNote } = useGeassStore();

  const workspaceNotes = notes.filter((n) => n.workspaceId === activeWorkspaceId);
  const [selectedId, setSelectedId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedNote = workspaceNotes.find((n) => n._id === selectedId);

  // Auto-select first note if selection is invalid
  useEffect(() => {
    if (workspaceNotes.length > 0) {
      if (!selectedId || !workspaceNotes.some((n) => n._id === selectedId)) {
        setSelectedId(workspaceNotes[0]._id);
      }
    } else {
      setSelectedId("");
    }
  }, [workspaceNotes, selectedId]);

  const handleUpdate = useCallback(
    (id: string, changes: any) => {
      updateNote(id, changes);
    },
    [updateNote]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteNote(id);
      // Auto fallback to next note
      const nextNote = workspaceNotes.find((n) => n._id !== id);
      setSelectedId(nextNote?._id ?? "");
    },
    [deleteNote, workspaceNotes]
  );

  const handlePin = useCallback(
    (id: string) => {
      const note = workspaceNotes.find((n) => n._id === id);
      if (note) {
        updateNote(id, { pinned: !note.pinned });
      }
    },
    [updateNote, workspaceNotes]
  );

  const handleNewNote = useCallback(() => {
    if (!activeWorkspaceId) return;
    const newId = `note-${Date.now()}`;
    addNote({
      _id: newId,
      workspaceId: activeWorkspaceId,
      title: "Untitled Note",
      pinned: false,
      color: "#f59e0b",
      tags: [],
      snippet: "",
      content: "",
    });
    setSelectedId(newId);
  }, [addNote, activeWorkspaceId]);

  return (
    <div className="flex h-full bg-[#030303] min-h-0 overflow-hidden">
      {/* Left sidebar */}
      <NotesSidebar
        notes={workspaceNotes}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onPin={handlePin}
        onNew={handleNewNote}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      {/* Editor / empty state */}
      {selectedNote ? (
        <NoteEditor
          note={selectedNote}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onPin={handlePin}
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
            onClick={handleNewNote}
            className="px-4 py-2 bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-[12px] font-bold rounded-xl hover:bg-[#f59e0b]/20 transition-all"
          >
            + New Note
          </button>
        </div>
      )}
    </div>
  );
}
