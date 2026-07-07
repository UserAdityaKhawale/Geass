"use client";

import { Pin, Clock, Search } from "lucide-react";

export interface Note {
  id: string;
  title: string;
  snippet: string;
  content: string;
  pinned: boolean;
  tags: string[];
  color: string;
  updatedAt: string;
}

const TAG_COLORS: Record<string, string> = {
  Design: "#7C3AED",
  UI: "#3b82f6",
  Dev: "#EF5A6F",
  Research: "#f59e0b",
  Ideas: "#22c55e",
  Personal: "#ec4899",
};

interface Props {
  note: Note;
  selected: boolean;
  onClick: () => void;
  onPin: () => void;
  searchQuery: string;
}

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-[#f59e0b]/30 text-[#fbbf24] rounded px-0.5">{p}</mark>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

export default function NoteCard({ note, selected, onClick, onPin, searchQuery }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === "Enter" && onClick()}
      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all group relative cursor-pointer ${
        selected
          ? "bg-[#f59e0b]/[0.08] border-[#f59e0b]/25 text-white"
          : "border-transparent hover:bg-white/[0.03] hover:border-white/[0.06] text-neutral-400"
      }`}
    >
      {/* Color dot + title */}
      <div className="flex items-start gap-2">
        <div
          className="w-1 self-stretch rounded-full shrink-0 mt-1"
          style={{ backgroundColor: note.color, minHeight: "12px" }}
        />
        <div className="flex-1 min-w-0">
          <p className={`text-[12px] font-bold truncate ${selected ? "text-white" : "text-neutral-200"}`}>
            {highlight(note.title, searchQuery)}
          </p>
          <p className="text-[10px] text-neutral-600 leading-relaxed line-clamp-2 mt-0.5">
            {highlight(note.snippet, searchQuery)}
          </p>
          {/* Tags */}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {note.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{ color: TAG_COLORS[tag] ?? "#6b7280", backgroundColor: `${TAG_COLORS[tag] ?? "#6b7280"}20` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 mt-1.5">
            <Clock size={8} className="text-neutral-700" />
            <span className="text-[9px] text-neutral-700 font-mono">{note.updatedAt}</span>
          </div>
        </div>
      </div>

      {/* Pin button — valid because parent is now a div, not a button */}
      <button
        onClick={e => { e.stopPropagation(); onPin(); }}
        className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all p-0.5 rounded ${
          note.pinned ? "opacity-100 text-[#f59e0b]" : "text-neutral-700 hover:text-[#f59e0b]"
        }`}
      >
        <Pin size={11} fill={note.pinned ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
