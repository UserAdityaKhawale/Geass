"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, X, Pencil, Trash2, Check } from "lucide-react";
import { useGeassStore, TimeBlock } from "@/store/useGeassStore";

const DEFAULT_BLOCKS = [
  { title: "Deep Work Session", sub: "Build Geass Dashboard", start: "08:00", end: "10:30", color: "#7C3AED" },
  { title: "Break", sub: "Take a short break", start: "10:30", end: "10:45", color: "#22c55e" },
  { title: "College Study", sub: "DBMS Notes & Revision", start: "10:45", end: "12:30", color: "#3b82f6" },
];

export default function DailyTimeline() {
  const { activeWorkspaceId, timeblocks, addTimeBlock, updateTimeBlock, deleteTimeBlock } = useGeassStore();

  // Add form state
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [sub, setSub] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [color, setColor] = useState("#7C3AED");

  // Edit state — which block is being edited + its draft values
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSub, setEditSub] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editColor, setEditColor] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];
  const workspaceBlocks = timeblocks.filter(b => b.workspaceId === activeWorkspaceId && b.date === todayStr);
  const visibleBlocks = workspaceBlocks.length > 0 ? workspaceBlocks : DEFAULT_BLOCKS;
  const isUsingDefaults = workspaceBlocks.length === 0;

  const handleAddTimeBlock = () => {
    if (!title.trim() || !activeWorkspaceId) return;
    addTimeBlock({
      _id: `block-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      title, sub, start, end, color,
      date: todayStr,
    });
    setTitle(""); setSub(""); setShowAdd(false);
  };

  const startEdit = (block: TimeBlock) => {
    setEditingId(block._id);
    setEditTitle(block.title);
    setEditSub(block.sub || "");
    setEditStart(block.start);
    setEditEnd(block.end);
    setEditColor(block.color);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = () => {
    if (!editingId || !editTitle.trim()) return;
    updateTimeBlock(editingId, {
      title: editTitle.trim(),
      sub: editSub,
      start: editStart,
      end: editEnd,
      color: editColor,
    });
    setEditingId(null);
  };

  return (
    <div className="bg-transparent backdrop-blur-sm border border-white/[0.06] rounded-2xl p-4 flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[12px] font-bold text-white">Today&apos;s Timeline</span>
        <button className="text-neutral-600 hover:text-neutral-300 transition-colors">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0 pr-0.5 scrollbar-thin scrollbar-thumb-white/[0.08]">
        {visibleBlocks.map((ev, i) => {
          const blockId = (ev as TimeBlock)._id;
          const isEditing = !isUsingDefaults && editingId === blockId;

          if (isEditing) {
            return (
              <div key={blockId} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] space-y-2">
                <input
                  autoFocus
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                  placeholder="Title"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-white/[0.2]"
                />
                <input
                  value={editSub}
                  onChange={e => setEditSub(e.target.value)}
                  placeholder="Description (optional)"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-white/[0.2]"
                />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[8px] font-mono text-neutral-600 uppercase block mb-1">Start</label>
                    <input type="time" value={editStart} onChange={e => setEditStart(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none [color-scheme:dark]" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[8px] font-mono text-neutral-600 uppercase block mb-1">End</label>
                    <input type="time" value={editEnd} onChange={e => setEditEnd(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none [color-scheme:dark]" />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="text-[8px] font-mono text-neutral-600 uppercase block mb-1">Color</label>
                    <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)}
                      className="w-8 h-[30px] border-0 bg-transparent cursor-pointer rounded" />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={saveEdit}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[#EF5A6F] hover:bg-[#d94a5f] text-white text-[10px] font-bold rounded-lg transition-all"
                  >
                    <Check size={11} /> Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-white/[0.08] text-neutral-400 hover:text-white text-[10px] font-bold rounded-lg transition-all"
                  >
                    <X size={11} /> Cancel
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={i}
              className="flex gap-3 items-center p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
            >
              <div className="w-[3px] rounded-full shrink-0" style={{ backgroundColor: ev.color, height: "32px" }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white leading-tight truncate">{ev.title}</p>
                    {ev.sub && <p className="text-[10px] text-neutral-600 mt-0.5 truncate">{ev.sub}</p>}
                  </div>
                  <span
                    className="text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded-md whitespace-nowrap"
                    style={{ color: ev.color, backgroundColor: `${ev.color}14` }}
                  >
                    {ev.start} – {ev.end}
                  </span>
                </div>
              </div>
              {/* Edit/Delete — only shown for real blocks, not defaults */}
              {!isUsingDefaults && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => startEdit(ev as TimeBlock)}
                    className="p-1 rounded-lg text-neutral-600 hover:text-white hover:bg-white/[0.06] transition-all"
                    title="Edit"
                  >
                    <Pencil size={11} />
                  </button>
                  <button
                    onClick={() => deleteTimeBlock((ev as TimeBlock)._id)}
                    className="p-1 rounded-lg text-neutral-600 hover:text-[#EF5A6F] hover:bg-[#EF5A6F]/10 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAdd ? (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between z-10 border border-white/[0.1]">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-2 mb-2">
            <span className="text-[11px] font-bold text-white">Add Time Block</span>
            <button onClick={() => setShowAdd(false)} className="text-neutral-500 hover:text-white"><X size={12} /></button>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto pr-0.5">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (e.g. Sync Session)"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-2 py-1 text-[11px] text-white focus:outline-none" />
            <input type="text" value={sub} onChange={e => setSub(e.target.value)} placeholder="Description (optional)"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-2 py-1 text-[11px] text-white focus:outline-none" />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[8px] font-mono text-neutral-600 uppercase block mb-1">Start</label>
                <input type="time" value={start} onChange={e => setStart(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-2 py-1 text-[11px] text-white focus:outline-none" />
              </div>
              <div className="flex-1">
                <label className="text-[8px] font-mono text-neutral-600 uppercase block mb-1">End</label>
                <input type="time" value={end} onChange={e => setEnd(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-2 py-1 text-[11px] text-white focus:outline-none" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-neutral-500">Color Tag</span>
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                className="w-6 h-6 border-0 bg-transparent cursor-pointer" />
            </div>
          </div>
          <button onClick={handleAddTimeBlock}
            className="w-full bg-[#EF5A6F] text-white font-bold text-[11px] py-1.5 rounded-xl hover:bg-[#d94a5f] mt-2 shrink-0">
            Add Block
          </button>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)}
          className="mt-3 flex items-center gap-2 text-[11px] text-neutral-600 hover:text-white transition-colors font-semibold shrink-0">
          <Plus size={13} /> Add Time Block
        </button>
      )}
    </div>
  );
}
