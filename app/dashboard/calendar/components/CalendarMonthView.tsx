"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarEvent } from "../hooks/useGoogleCalendar";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDay(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function dateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

interface Props {
  events: CalendarEvent[];
  activeCalendars: string[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function CalendarMonthView({ events, activeCalendars, onEventClick }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const monthLabel = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  // Pad to 6 rows
  while (cells.length % 7 !== 0) cells.push(null);

  const visibleEvents = events.filter(e => activeCalendars.includes(e.calendar));

  const getEventsForDay = (day: number) => {
    const ds = dateStr(year, month, day);
    return visibleEvents.filter(e => e.date === ds).slice(0, 3);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.05] shrink-0">
        <button onClick={prevMonth} className="text-neutral-700 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-all">
          <ChevronLeft size={14} />
        </button>
        <span className="text-[13px] font-bold text-white">{monthLabel}</span>
        <button onClick={nextMonth} className="text-neutral-700 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-all">
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 border-b border-white/[0.05] shrink-0">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} className="py-2 text-center text-[10px] font-mono uppercase text-neutral-700">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-7 h-full" style={{ gridAutoRows: "minmax(80px, 1fr)" }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="border-r border-b border-white/[0.04] bg-transparent" />;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const dayEvents = getEventsForDay(day);

            return (
              <div
                key={i}
                className={`border-r border-b border-white/[0.04] p-1.5 relative transition-colors hover:bg-white/[0.02] ${isToday ? "bg-[#EF5A6F]/[0.04]" : ""}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mb-1 ${
                  isToday ? "bg-[#EF5A6F] text-white" : "text-neutral-600"
                }`}>
                  {day}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.map(ev => (
                    <button
                      key={ev.id}
                      onClick={() => onEventClick(ev)}
                      className="w-full text-left text-[9px] font-semibold px-1.5 py-0.5 rounded-md truncate hover:brightness-125 transition-all"
                      style={{ backgroundColor: `${ev.color}25`, color: ev.color }}
                    >
                      {ev.title}
                    </button>
                  ))}
                  {getEventsForDay(day).length === 0 && visibleEvents.filter(e => e.date === dateStr(year, month, day)).length > 3 && (
                    <span className="text-[8px] text-neutral-700">+{visibleEvents.filter(e => e.date === dateStr(year, month, day)).length - 3} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
