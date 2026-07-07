"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  Bold, Italic, Underline, Heading1, Heading2,
  List, Link, Code, Pin, Trash2, Plus, X, Clock, Save
} from "lucide-react";
import type { Note } from "./NoteCard";

const TAG_COLORS: Record<string, string> = {
  Design: "#7C3AED",
  UI: "#3b82f6",
  Dev: "#EF5A6F",
  Research: "#f59e0b",
  Ideas: "#22c55e",
  Personal: "#ec4899",
};
const AVAILABLE_TAGS = Object.keys(TAG_COLORS);

const NOTE_COLORS = ["#f59e0b", "#EF5A6F", "#7C3AED", "#3b82f6", "#22c55e", "#ec4899"];

interface Props {
  note: Note;
  onUpdate: (id: string, changes: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
}

export default function NoteEditor({ note, onUpdate, onDelete, onPin }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [addingTag, setAddingTag] = useState(false);
  const [saved, setSaved] = useState(true);

  // Sync content into editor when note changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== note.content) {
      editorRef.current.innerHTML = note.content;
    }
  }, [note.id]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    setSaved(false);
    onUpdate(note.id, { content: editorRef.current.innerHTML, snippet: editorRef.current.innerText.slice(0, 120) });
    setTimeout(() => setSaved(true), 800);
  }, [note.id, onUpdate]);

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0c]">
      {/* Title row */}
      <div className="px-8 pt-6 pb-3 shrink-0">
        <div className="flex items-start gap-3">
          {/* Color strip / picker */}
          <div className="flex flex-col gap-1 pt-1 shrink-0">
            {NOTE_COLORS.map(c => (
              <button
                key={c}
                onClick={() => onUpdate(note.id, { color: c })}
                className={`w-2.5 h-2.5 rounded-full transition-transform ${note.color === c ? "scale-125" : "hover:scale-110 opacity-40 hover:opacity-80"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <input
              value={note.title}
              onChange={e => onUpdate(note.id, { title: e.target.value })}
              placeholder="Untitled note…"
              className="w-full bg-transparent text-[24px] font-black text-white placeholder:text-neutral-700 focus:outline-none leading-tight"
            />
            {/* Metadata */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-[10px] text-neutral-700 font-mono">
                <Clock size={10} />
                Last edited: {dateStr} · {timeStr}
              </div>
              {saved ? (
                <div className="flex items-center gap-1 text-[9px] text-[#22c55e]">
                  <Save size={9} />
                  Saved
                </div>
              ) : (
                <div className="text-[9px] text-[#f59e0b] animate-pulse">Saving…</div>
              )}
            </div>
          </div>

          {/* Pin + Delete */}
          <div className="flex items-center gap-1.5 shrink-0 pt-1">
            <button
              onClick={() => onPin(note.id)}
              className={`p-1.5 rounded-xl border transition-all ${note.pinned ? "border-[#f59e0b]/30 text-[#f59e0b] bg-[#f59e0b]/10" : "border-white/[0.08] text-neutral-700 hover:text-[#f59e0b] hover:border-[#f59e0b]/20"}`}
            >
              <Pin size={13} fill={note.pinned ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-1.5 rounded-xl border border-white/[0.08] text-neutral-700 hover:text-[#EF5A6F] hover:border-[#EF5A6F]/20 transition-all"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {note.tags.map(tag => (
            <span
              key={tag}
              className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg"
              style={{ color: TAG_COLORS[tag] ?? "#6b7280", backgroundColor: `${TAG_COLORS[tag] ?? "#6b7280"}18` }}
            >
              {tag}
              <button
                onClick={() => onUpdate(note.id, { tags: note.tags.filter(t => t !== tag) })}
                className="hover:opacity-60 transition-opacity"
              >
                <X size={8} />
              </button>
            </span>
          ))}

          {addingTag ? (
            <div className="flex items-center gap-1 flex-wrap">
              {AVAILABLE_TAGS.filter(t => !note.tags.includes(t)).map(tag => (
                <button
                  key={tag}
                  onClick={() => { onUpdate(note.id, { tags: [...note.tags, tag] }); setAddingTag(false); }}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ color: TAG_COLORS[tag], backgroundColor: `${TAG_COLORS[tag]}18` }}
                >
                  {tag}
                </button>
              ))}
              <button onClick={() => setAddingTag(false)} className="text-neutral-700 hover:text-white transition-colors">
                <X size={11} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingTag(true)}
              className="flex items-center gap-1 text-[10px] text-neutral-700 hover:text-neutral-400 px-2 py-0.5 rounded-lg border border-dashed border-white/[0.08] hover:border-white/[0.14] transition-all"
            >
              <Plus size={9} />
              Add Tag
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.05] mx-8 mb-1 shrink-0" />

      {/* Formatting toolbar */}
      <div className="flex items-center gap-1 px-8 py-2 shrink-0">
        {[
          { icon: Bold,     cmd: "bold",         tip: "Bold" },
          { icon: Italic,   cmd: "italic",        tip: "Italic" },
          { icon: Underline,cmd: "underline",     tip: "Underline" },
        ].map(({ icon: Icon, cmd, tip }) => (
          <button
            key={cmd}
            title={tip}
            onMouseDown={e => { e.preventDefault(); exec(cmd); }}
            className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <Icon size={13} />
          </button>
        ))}
        <div className="w-px h-4 bg-white/[0.08] mx-1" />
        <button title="Heading 1" onMouseDown={e => { e.preventDefault(); exec("formatBlock", "h1"); }} className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-white/[0.06] transition-all">
          <Heading1 size={13} />
        </button>
        <button title="Heading 2" onMouseDown={e => { e.preventDefault(); exec("formatBlock", "h2"); }} className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-white/[0.06] transition-all">
          <Heading2 size={13} />
        </button>
        <div className="w-px h-4 bg-white/[0.08] mx-1" />
        <button title="Bullet list" onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }} className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-white/[0.06] transition-all">
          <List size={13} />
        </button>
        <button title="Link" onMouseDown={e => { e.preventDefault(); const url = prompt("URL:"); if (url) exec("createLink", url); }} className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-white/[0.06] transition-all">
          <Link size={13} />
        </button>
        <button title="Code" onMouseDown={e => { e.preventDefault(); exec("formatBlock", "pre"); }} className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-white/[0.06] transition-all">
          <Code size={13} />
        </button>
      </div>

      <div className="h-px bg-white/[0.05] mx-8 shrink-0" />

      {/* Editable content area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder="Start writing your note…"
        className="flex-1 px-8 py-5 text-[13px] text-neutral-300 leading-7 outline-none overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08]
          [&_h1]:text-[20px] [&_h1]:font-black [&_h1]:text-white [&_h1]:mb-3 [&_h1]:mt-4
          [&_h2]:text-[16px] [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-2 [&_h2]:mt-3
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
          [&_li]:text-neutral-300
          [&_pre]:bg-white/[0.04] [&_pre]:border [&_pre]:border-white/[0.08] [&_pre]:rounded-xl [&_pre]:px-4 [&_pre]:py-3 [&_pre]:font-mono [&_pre]:text-[12px] [&_pre]:text-[#f59e0b] [&_pre]:my-2
          [&_a]:text-[#EF5A6F] [&_a]:underline
          [&_strong]:text-white [&_strong]:font-bold
          empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-700 empty:before:pointer-events-none"
      />
    </div>
  );
}
