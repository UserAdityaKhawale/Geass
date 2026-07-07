"use client";

import { Search, Plus, Pin, Clock } from "lucide-react";
import NoteCard, { Note } from "./NoteCard";

interface Props {
  notes: Note[];
  selectedId: string;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onNew: () => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}

export default function NotesSidebar({ notes, selectedId, onSelect, onPin, onNew, searchQuery, onSearch }: Props) {
  const pinned = notes.filter(n => n.pinned);
  const recent = notes.filter(n => !n.pinned).slice(0, 3);
  const all = notes.filter(n => !n.pinned);

  const filtered = searchQuery.trim()
    ? notes.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.snippet.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="w-[280px] shrink-0 border-r border-white/[0.05] bg-[#0a0a0c] flex flex-col min-h-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-black text-white">Notes</span>
          <button
            onClick={onNew}
            className="flex items-center gap-1 px-2 py-1 bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-[10px] font-bold rounded-lg hover:bg-[#f59e0b]/20 transition-all"
          >
            <Plus size={10} />
            New
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-700 pointer-events-none" />
          <input
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search notes…"
            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl pl-7 pr-3 py-1.5 text-[11px] text-neutral-400 placeholder:text-neutral-700 focus:outline-none focus:border-[#f59e0b]/30 focus:bg-white/[0.05] transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08]">
        {filtered ? (
          <>
            <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-700 px-1 mb-1">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>
            {filtered.map(n => (
              <NoteCard
                key={n.id}
                note={n}
                selected={n.id === selectedId}
                onClick={() => onSelect(n.id)}
                onPin={() => onPin(n.id)}
                searchQuery={searchQuery}
              />
            ))}
          </>
        ) : (
          <>
            {pinned.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-1 mb-1.5">
                  <Pin size={9} className="text-[#f59e0b]" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-700">Pinned</span>
                </div>
                {pinned.map(n => (
                  <NoteCard key={n.id} note={n} selected={n.id === selectedId} onClick={() => onSelect(n.id)} onPin={() => onPin(n.id)} searchQuery="" />
                ))}
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5 px-1 mb-1.5 mt-1">
                <Clock size={9} className="text-neutral-700" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-700">Recent</span>
              </div>
              {recent.map(n => (
                <NoteCard key={n.id} note={n} selected={n.id === selectedId} onClick={() => onSelect(n.id)} onPin={() => onPin(n.id)} searchQuery="" />
              ))}
            </div>

            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-700 px-1">All Notes ({all.length})</span>
              <div className="mt-1.5">
                {all.map(n => (
                  <NoteCard key={n.id} note={n} selected={n.id === selectedId} onClick={() => onSelect(n.id)} onPin={() => onPin(n.id)} searchQuery="" />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-white/[0.05] shrink-0">
        <p className="text-[9px] text-neutral-800 font-mono">{notes.length} notes · synced</p>
      </div>
    </div>
  );
}
