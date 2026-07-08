"use client";

import { useState } from "react";
import { useGeassStore, TimeBlock } from "@/store/useGeassStore";
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock, MapPin, X, Pencil, Trash2, Check } from "lucide-react";

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getWeekDays(start: Date) {
  const arr = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    arr.push(d);
  }
  return arr;
}

function getWeekStart(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function PlannerPage() {
  const { activeWorkspaceId, tasks, timeblocks, addTimeBlock, updateTask, updateTimeBlock, deleteTimeBlock } = useGeassStore();

  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()));
  const weekDays = getWeekDays(currentWeekStart);

  // Form Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState(9);
  const [blockTitle, setBlockTitle] = useState("");
  const [blockSub, setBlockSub] = useState("");
  const [blockColor, setBlockColor] = useState("#7C3AED");

  // Edit modal state
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSub, setEditSub] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editColor, setEditColor] = useState("#7C3AED");

  const openEditModal = (block: TimeBlock) => {
    setEditingBlock(block);
    setEditTitle(block.title);
    setEditSub(block.sub || "");
    setEditStart(block.start);
    setEditEnd(block.end);
    setEditColor(block.color);
  };

  const saveEdit = () => {
    if (!editingBlock || !editTitle.trim()) return;
    updateTimeBlock(editingBlock._id, {
      title: editTitle.trim(),
      sub: editSub,
      start: editStart,
      end: editEnd,
      color: editColor,
    });
    setEditingBlock(null);
  };

  const workspaceBlocks = timeblocks.filter(b => b.workspaceId === activeWorkspaceId);
  const unscheduledTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId && !t.dueDate && t.status !== "done");

  const prevWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(d);
  };

  const handleCellClick = (dateStr: string, hour: number) => {
    setSelectedDate(dateStr);
    setSelectedHour(hour);
    setBlockTitle("");
    setBlockSub("");
    setOpenModal(true);
  };

  const handleSaveBlock = () => {
    if (!blockTitle.trim() || !activeWorkspaceId) return;

    const startStr = `${String(selectedHour).padStart(2, "0")}:00`;
    const endStr = `${String(selectedHour + 1).padStart(2, "0")}:00`;

    addTimeBlock({
      _id: `block-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      title: blockTitle,
      sub: blockSub,
      start: startStr,
      end: endStr,
      color: blockColor,
      date: selectedDate,
    });

    setOpenModal(false);
  };

  const handleScheduleTask = (taskId: string) => {
    if (!activeWorkspaceId) return;
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const dateInput = prompt("Enter date (YYYY-MM-DD):", new Date().toISOString().split("T")[0]);
    if (!dateInput) return;

    const hourInput = prompt("Enter hour slot (6-22):", "9");
    if (!hourInput) return;

    const hr = parseInt(hourInput);
    if (isNaN(hr) || hr < 6 || hr > 22) return;

    // Save as block + update task dueDate
    const startStr = `${String(hr).padStart(2, "0")}:00`;
    const endStr = `${String(hr + 1).padStart(2, "0")}:00`;

    addTimeBlock({
      _id: `block-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      title: task.title,
      sub: "Scheduled task block",
      start: startStr,
      end: endStr,
      color: "#f59e0b",
      date: dateInput,
    });

    updateTask(taskId, { dueDate: new Date(dateInput + "T10:00:00.000Z").toISOString() });
  };

  return (
    <div className="flex h-full bg-[#030303] min-h-0 overflow-hidden relative">
      {/* Planner Grid Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Navigation Toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-white/[0.05] bg-[#0a0a0c] shrink-0">
          <button
            onClick={() => setCurrentWeekStart(getWeekStart(new Date()))}
            className="px-3 py-1.5 border border-white/[0.08] bg-white/[0.03] text-[11px] font-bold text-white rounded-xl hover:bg-white/[0.08] transition-all"
          >
            This Week
          </button>
          <div className="flex items-center gap-1.5">
            <button onClick={prevWeek} className="text-neutral-700 hover:text-white p-1 rounded-lg hover:bg-white/[0.06]">
              <ChevronLeft size={14} />
            </button>
            <span className="text-[12px] font-bold text-white">
              {weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <button onClick={nextWeek} className="text-neutral-700 hover:text-white p-1 rounded-lg hover:bg-white/[0.06]">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Weekly Hourly Grid */}
        <div className="flex-1 overflow-auto min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08]">
          <div className="min-w-[800px] grid grid-cols-[60px_repeat(7,1fr)] border-b border-white/[0.04]">
            {/* Headers row */}
            <div className="border-r border-white/[0.04] bg-[#0a0a0c] py-3 text-center text-[9px] font-mono text-neutral-700 uppercase">GMT</div>
            {weekDays.map(wd => {
              const dateStr = wd.toISOString().split("T")[0];
              const isToday = dateStr === new Date().toISOString().split("T")[0];
              return (
                <div
                  key={dateStr}
                  className={`border-r border-white/[0.04] py-3 text-center flex flex-col items-center justify-center gap-0.5 ${
                    isToday ? "bg-[#EF5A6F]/[0.02]" : "bg-[#0a0a0c]"
                  }`}
                >
                  <span className={`text-[10px] font-mono uppercase font-bold ${isToday ? "text-[#EF5A6F]" : "text-neutral-600"}`}>
                    {DAYS[wd.getDay()].substring(0, 3)}
                  </span>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isToday ? "bg-[#EF5A6F] text-white" : "text-neutral-400"
                  }`}>
                    {wd.getDate()}
                  </span>
                </div>
              );
            })}

            {/* Time Grid Rows */}
            {HOURS.map(hour => {
              const displayHour = hour % 12 === 0 ? 12 : hour % 12;
              const period = hour < 12 ? "AM" : "PM";

              return (
                <>
                  {/* Hour label */}
                  <div key={`lbl-${hour}`} className="border-r border-b border-white/[0.04] bg-[#0a0a0c] py-4 text-center text-[9px] font-mono font-bold text-neutral-700 leading-none">
                    {displayHour} {period}
                  </div>

                  {/* Days slots */}
                  {weekDays.map(wd => {
                    const dateStr = wd.toISOString().split("T")[0];
                    const hourStartStr = `${String(hour).padStart(2, "0")}:00`;

                    // Find block matching this date and hour start slot
                    const block = workspaceBlocks.find(b => b.date === dateStr && b.start.startsWith(hourStartStr));

                    return (
                      <div
                        key={`cell-${dateStr}-${hour}`}
                        onClick={() => !block && handleCellClick(dateStr, hour)}
                        className={`border-r border-b border-white/[0.04] p-1 min-h-[44px] relative transition-colors group cursor-pointer ${
                          block ? "" : "hover:bg-white/[0.01]"
                        }`}
                      >
                        {block ? (
                          <div
                            className="absolute inset-1 rounded-lg px-2 py-1 text-left flex flex-col justify-between overflow-hidden shadow-lg border transition-all hover:brightness-110 group/block"
                            style={{
                              backgroundColor: `${block.color}15`,
                              borderColor: `${block.color}30`,
                              color: block.color,
                            }}
                          >
                            <p className="text-[10px] font-bold truncate leading-tight">{block.title}</p>
                            {block.sub && <p className="text-[8px] opacity-60 truncate mt-0.5">{block.sub}</p>}
                            {/* Hover action buttons */}
                            <div className="absolute top-0.5 right-0.5 opacity-0 group-hover/block:opacity-100 transition-opacity flex gap-0.5">
                              <button
                                onClick={e => { e.stopPropagation(); openEditModal(block); }}
                                className="w-5 h-5 rounded flex items-center justify-center bg-black/40 hover:bg-black/70 text-white transition-all"
                                title="Edit"
                              >
                                <Pencil size={9} />
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); deleteTimeBlock(block._id); }}
                                className="w-5 h-5 rounded flex items-center justify-center bg-black/40 hover:bg-[#EF5A6F]/80 text-white transition-all"
                                title="Delete"
                              >
                                <Trash2 size={9} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button className="opacity-0 group-hover:opacity-100 absolute top-1.5 right-1.5 text-neutral-700 hover:text-white p-0.5 rounded hover:bg-white/[0.05]">
                            <Plus size={10} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </>
              );
            })}
          </div>
        </div>
      </div>

      {/* Unscheduled Tasks Drawer Sidebar */}
      <div className="w-[240px] shrink-0 border-l border-white/[0.05] bg-[#0a0a0c] p-4 flex flex-col gap-4 min-h-0">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-600 block mb-3">Unscheduled Inbox</span>
          <div className="space-y-1.5 overflow-y-auto max-h-[480px] scrollbar-thin scrollbar-thumb-white/[0.08] pr-1.5">
            {unscheduledTasks.map(t => (
              <button
                key={t._id}
                onClick={() => handleScheduleTask(t._id)}
                className="w-full text-left p-3 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group flex flex-col gap-1.5"
              >
                <span className="text-[11px] font-semibold text-white leading-tight group-hover:text-[#f59e0b] transition-colors">
                  {t.title}
                </span>
                <div className="flex items-center justify-between w-full">
                  <span className="text-[8px] font-mono text-neutral-700">Click to schedule</span>
                  <span className="text-[8px] font-bold text-neutral-500 uppercase">{t.priority}</span>
                </div>
              </button>
            ))}

            {unscheduledTasks.length === 0 && (
              <div className="text-center py-10 text-neutral-700 text-[10px]">No unscheduled tasks.</div>
            )}
          </div>
        </div>
      </div>

      {/* TimeBlock Creation Form Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpenModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm bg-[#111113] border border-white/[0.1] rounded-2xl p-5 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-white">Create Schedule Slot</span>
              <button onClick={() => setOpenModal(false)} className="text-neutral-500 hover:text-white">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                autoFocus
                value={blockTitle}
                onChange={e => setBlockTitle(e.target.value)}
                placeholder="Time block title…"
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-[12px] text-white focus:outline-none"
              />
              <input
                type="text"
                value={blockSub}
                onChange={e => setBlockSub(e.target.value)}
                placeholder="Description/notes (optional)"
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-[12px] text-white focus:outline-none"
              />

              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>Selected Time</span>
                <span className="font-mono text-white">{selectedDate} at {selectedHour}:00</span>
              </div>

              {/* Color options */}
              <div className="flex justify-between items-center pt-1 border-t border-white/[0.04]">
                <span className="text-[10px] text-neutral-500">Color Tag</span>
                <input
                  type="color"
                  value={blockColor}
                  onChange={e => setBlockColor(e.target.value)}
                  className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleSaveBlock}
              className="w-full bg-[#EF5A6F] text-white font-bold text-[12px] py-2 rounded-xl hover:bg-[#d94a5f] transition-all"
            >
              Add Schedule Block
            </button>
          </div>
        </div>
      )}

      {/* Edit TimeBlock Modal */}
      {editingBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditingBlock(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm bg-[#111113] border border-white/[0.1] rounded-2xl p-5 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-white">Edit Time Block</span>
              <button onClick={() => setEditingBlock(null)} className="text-neutral-500 hover:text-white">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                autoFocus
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingBlock(null); }}
                placeholder="Time block title…"
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-[12px] text-white focus:outline-none focus:border-white/[0.2]"
              />
              <input
                type="text"
                value={editSub}
                onChange={e => setEditSub(e.target.value)}
                placeholder="Description/notes (optional)"
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-[12px] text-white focus:outline-none focus:border-white/[0.2]"
              />
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[9px] font-mono text-neutral-600 uppercase block mb-1.5">Start</label>
                  <input type="time" value={editStart} onChange={e => setEditStart(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-[12px] text-white focus:outline-none [color-scheme:dark]" />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] font-mono text-neutral-600 uppercase block mb-1.5">End</label>
                  <input type="time" value={editEnd} onChange={e => setEditEnd(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-[12px] text-white focus:outline-none [color-scheme:dark]" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-white/[0.04]">
                <span className="text-[10px] text-neutral-500">Color Tag</span>
                <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)}
                  className="w-6 h-6 border-0 bg-transparent cursor-pointer" />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#EF5A6F] text-white font-bold text-[12px] py-2 rounded-xl hover:bg-[#d94a5f] transition-all"
              >
                <Check size={13} /> Save Changes
              </button>
              <button
                onClick={() => setEditingBlock(null)}
                className="px-4 py-2 border border-white/[0.08] text-neutral-400 hover:text-white text-[12px] font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
