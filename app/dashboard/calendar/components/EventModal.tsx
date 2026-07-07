"use client";

import { useState } from "react";
import { X, Clock, Calendar, Trash2, MapPin } from "lucide-react";
import type { CalendarEvent } from "../hooks/useGoogleCalendar";

const CALENDARS = ["Personal", "College", "Work", "Fitness"];
const COLORS = ["#EF5A6F", "#7C3AED", "#3b82f6", "#22c55e", "#f59e0b", "#ec4899"];

interface Props {
  event?: CalendarEvent;
  defaultDate?: string;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
  onDelete?: (id: string) => void;
}

export default function EventModal({ event, defaultDate, onClose, onSave, onDelete }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [title, setTitle] = useState(event?.title ?? "");
  const [date, setDate] = useState(event?.date ?? defaultDate ?? today);
  const [startHour, setStartHour] = useState(event?.startHour ?? 9);
  const [endHour, setEndHour] = useState(event?.endHour ?? 10);
  const [color, setColor] = useState(event?.color ?? "#EF5A6F");
  const [calendar, setCalendar] = useState(event?.calendar ?? "Personal");
  const [platform, setPlatform] = useState(event?.platform ?? "");
  const [description, setDescription] = useState(event?.description ?? "");

  function formatHourOption(h: number) {
    const period = h < 12 ? "AM" : "PM";
    const display = h % 12 === 0 ? 12 : h % 12;
    const mins = h % 1 === 0.5 ? "30" : "00";
    return `${display}:${mins} ${period}`;
  }

  const HOUR_OPTIONS: number[] = [];
  for (let h = 0; h <= 23.5; h += 0.5) HOUR_OPTIONS.push(h);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, date, startHour, endHour, color, calendar, platform, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-[#111113] border border-white/[0.1] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Color accent strip */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, #7C3AED)` }} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-[14px] font-black text-white">{event ? "Edit Event" : "New Event"}</h2>
          <button onClick={onClose} className="text-neutral-700 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.06]">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {/* Title */}
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Event title"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[14px] font-bold text-white placeholder:text-neutral-700 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
          />

          {/* Date */}
          <div className="flex items-center gap-2.5">
            <Calendar size={13} className="text-neutral-600 shrink-0" />
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-[12px] text-neutral-300 focus:outline-none focus:border-white/15 transition-all"
            />
          </div>

          {/* Time */}
          <div className="flex items-center gap-2.5">
            <Clock size={13} className="text-neutral-600 shrink-0" />
            <select
              value={startHour}
              onChange={e => setStartHour(Number(e.target.value))}
              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-[12px] text-neutral-300 focus:outline-none focus:border-white/15 transition-all"
            >
              {HOUR_OPTIONS.map(h => <option key={h} value={h}>{formatHourOption(h)}</option>)}
            </select>
            <span className="text-neutral-700 text-[11px]">to</span>
            <select
              value={endHour}
              onChange={e => setEndHour(Number(e.target.value))}
              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-[12px] text-neutral-300 focus:outline-none focus:border-white/15 transition-all"
            >
              {HOUR_OPTIONS.filter(h => h > startHour).map(h => <option key={h} value={h}>{formatHourOption(h)}</option>)}
            </select>
          </div>

          {/* Platform / Location */}
          <div className="flex items-center gap-2.5">
            <MapPin size={13} className="text-neutral-600 shrink-0" />
            <input
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              placeholder="Location or platform (e.g. Google Meet)"
              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-[12px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-white/15 transition-all"
            />
          </div>

          {/* Calendar selector */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-700 mb-2">Calendar</p>
            <div className="flex gap-1.5 flex-wrap">
              {CALENDARS.map(cal => (
                <button
                  key={cal}
                  onClick={() => setCalendar(cal)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                    calendar === cal
                      ? "bg-[#EF5A6F]/15 border-[#EF5A6F]/30 text-[#EF5A6F]"
                      : "border-white/[0.08] text-neutral-600 hover:text-neutral-300 hover:border-white/15"
                  }`}
                >
                  {cal}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-700 mb-2">Color</p>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform border-2 ${color === c ? "scale-125 border-white/60" : "border-transparent hover:scale-110"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add description…"
            rows={2}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-[12px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-white/15 transition-all resize-none"
          />

          {/* Actions */}
          <div className="flex items-center justify-between pt-1">
            {event && onDelete ? (
              <button
                onClick={() => { onDelete(event.id); onClose(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-[#EF5A6F]/70 hover:text-[#EF5A6F] hover:bg-[#EF5A6F]/[0.06] rounded-xl transition-all"
              >
                <Trash2 size={12} />
                Delete
              </button>
            ) : <div />}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-white/[0.08] text-neutral-500 text-[11px] font-semibold rounded-xl hover:bg-white/[0.05] hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#EF5A6F] hover:bg-[#d94a5f] text-white text-[11px] font-bold rounded-xl transition-all shadow-lg shadow-[#EF5A6F]/20"
              >
                {event ? "Update" : "Create Event"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
